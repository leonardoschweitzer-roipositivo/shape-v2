import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MeasurementHistory, PersonalAthlete } from '@/mocks/personal';
import { PersonalSummary, AcademyStats } from '@/mocks/academy';
import { mapMeasurementToInput } from '@/services/calculations/evolutionProcessor';
import { calcularAvaliacaoGeral } from '@/services/calculations/assessment';
import { supabase } from '@/services/supabase';
import { mapAtletaToPersonalAthlete } from '@/services/mappers';
import type { Atleta, Ficha, Medida, Avaliacao } from '@/lib/database.types';

type DataSource = 'MOCK' | 'SUPABASE';

interface DataState {
    personalAthletes: PersonalAthlete[];
    personals: PersonalSummary[];
    academyStats: AcademyStats;
    dataSource: DataSource;
    isLoadingFromDB: boolean;

    // Actions
    addAssessment: (data: {
        athleteId: string;
        measurements: any;
        skinfolds: any;
        gender: 'MALE' | 'FEMALE' | 'OTHER';
    }) => { assessment: MeasurementHistory; result: any };

    updateAthlete: (athlete: PersonalAthlete) => void;
    getAthleteById: (id: string) => PersonalAthlete | undefined;

    // Academia specific
    getPersonals: () => PersonalSummary[];
    updatePersonalStats: (personalId: string) => void;

    // Supabase integration
    loadFromSupabase: (personalId: string) => Promise<void>;

    resetToMocks: () => void;
}

export const useDataStore = create<DataState>()(
    persist(
        (set, get) => ({
            personalAthletes: [],
            personals: [],
            academyStats: { totalAthletes: 0, totalPersonals: 0, averageScore: 0, measuredThisWeek: 0 } as AcademyStats,
            dataSource: 'SUPABASE' as DataSource,
            isLoadingFromDB: false,

            /**
             * Carrega dados do Supabase para um Personal.
             * Se encontrar atletas no banco, usa eles.
             * Senão, mantém os mocks.
             */
            loadFromSupabase: async (personalId: string) => {
                set({ isLoadingFromDB: true });

                try {
                    // 1. Buscar atletas deste personal
                    const { data: atletas, error: atletasError } = await supabase
                        .from('atletas')
                        .select('*')
                        .eq('personal_id', personalId)
                        .order('nome', { ascending: true });

                    if (atletasError) {
                        console.error('[DataStore] Erro ao buscar atletas do Supabase:', atletasError.message);
                        set({ isLoadingFromDB: false, dataSource: 'SUPABASE', personalAthletes: [] });
                        return;
                    }

                    // Banco pode estar vazio — isso é válido!
                    if (!atletas || atletas.length === 0) {
                        console.info('[DataStore] ✅ Banco vazio — nenhum atleta cadastrado ainda.');
                        set({ isLoadingFromDB: false, dataSource: 'SUPABASE', personalAthletes: [] });
                        return;
                    }

                    // 2. Para cada atleta, buscar ficha, medidas, avaliações (legacy) e assessments (nova tabela)
                    const mappedAthletes: PersonalAthlete[] = await Promise.all(
                        atletas.map(async (atleta: Atleta) => {
                            const [fichaRes, medidasRes, avaliacoesRes, assessmentsRes] = await Promise.all([
                                supabase
                                    .from('fichas')
                                    .select('*')
                                    .eq('atleta_id', atleta.id)
                                    .single(),
                                supabase
                                    .from('medidas')
                                    .select('*')
                                    .eq('atleta_id', atleta.id)
                                    .order('data', { ascending: false }),
                                supabase
                                    .from('avaliacoes')
                                    .select('*')
                                    .eq('atleta_id', atleta.id)
                                    .order('data', { ascending: false }),
                                supabase
                                    .from('assessments')
                                    .select('*')
                                    .eq('athlete_id', atleta.id)
                                    .order('date', { ascending: false }),
                            ]);
                            // Merge dados da tabela antiga (avaliacoes) com a nova (assessments)
                            let avaliacoes = (avaliacoesRes.data || []) as Avaliacao[];
                            const medidas = (medidasRes.data || []) as Medida[];
                            const ficha = fichaRes.data as Ficha | null;
                            const newAssessments = (assessmentsRes.data || []) as any[];

                            // Converter registros da nova tabela "assessments" para o formato Avaliacao
                            if (newAssessments.length > 0) {
                                for (const na of newAssessments) {
                                    const r = na.results || {};
                                    const syntheticAvaliacao: Avaliacao = {
                                        id: na.id,
                                        atleta_id: na.athlete_id,
                                        medidas_id: na.id, // usar próprio ID como referência
                                        data: na.date,
                                        peso: na.weight,
                                        score_geral: r.avaliacaoGeral ? Math.round(r.avaliacaoGeral * 100) / 100 : 0,
                                        gordura_corporal: na.body_fat,
                                        massa_magra: r.scores?.composicao?.detalhes?.pesoMagro || 0,
                                        massa_gorda: r.scores?.composicao?.detalhes?.pesoGordo || 0,
                                        ffmi: r.scores?.composicao?.detalhes?.detalhes?.ffmi?.valor || 0,
                                        imc: na.weight && na.height ? Math.round(na.weight / Math.pow(na.height / 100, 2)) : 0,
                                        classificacao_geral: r.classificacao?.nivel || '',
                                        proporcoes: r.scores || null,
                                        simetria: null,
                                        comparacao_anterior: null,
                                        created_at: na.created_at,
                                    };
                                    // Evitar duplicatas (se já existe uma avaliação com mesma data ±1min)
                                    const existsLegacy = avaliacoes.some(a => {
                                        const diff = Math.abs(new Date(a.data).getTime() - new Date(na.date).getTime());
                                        return diff < 60000; // 1 minuto
                                    });
                                    if (!existsLegacy) {
                                        avaliacoes.push(syntheticAvaliacao);
                                    }
                                }
                                avaliacoes.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
                            }

                            console.info(`[DataStore] Atleta: ${atleta.nome} | Medidas: ${medidas.length} | Avaliações: ${avaliacoes.length} | Assessments(new): ${newAssessments.length}`);

                            // 🔄 AUTO-RECOVERY (migração): Medidas sem avaliação → calcular e persistir
                            const medidasOrfas = medidas.filter(m =>
                                !avaliacoes.some(a => a.medidas_id === m.id)
                            );

                            if (medidasOrfas.length > 0) {
                                console.info(`[DataStore] 🔄 MIGRAÇÃO: ${medidasOrfas.length} medidas sem avaliação para ${atleta.nome}`);

                                const genero = ficha?.sexo === 'F' ? 'FEMALE' : 'MALE';
                                let alturaCm = Number(ficha?.altura) || 175;
                                if (alturaCm > 0 && alturaCm < 3) alturaCm = Math.round(alturaCm * 100);

                                let idade = 30;
                                if (ficha?.data_nascimento) {
                                    const birth = new Date(ficha.data_nascimento);
                                    const now = new Date();
                                    idade = now.getFullYear() - birth.getFullYear();
                                    const m = now.getMonth() - birth.getMonth();
                                    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) idade--;
                                }

                                for (const medida of medidasOrfas) {
                                    try {
                                        const tempHistory: MeasurementHistory = {
                                            id: medida.id,
                                            date: medida.data,
                                            measurements: {
                                                weight: Number(medida.peso) || 0,
                                                height: alturaCm,
                                                neck: Number(medida.pescoco) || 0,
                                                shoulders: Number(medida.ombros) || 0,
                                                chest: Number(medida.peitoral) || 0,
                                                waist: Number(medida.cintura) || 0,
                                                hips: Number(medida.quadril) || 0,
                                                pelvis: Number(ficha?.pelve) || 0,
                                                armRight: Number(medida.braco_direito) || 0,
                                                armLeft: Number(medida.braco_esquerdo) || 0,
                                                forearmRight: Number(medida.antebraco_direito) || 0,
                                                forearmLeft: Number(medida.antebraco_esquerdo) || 0,
                                                thighRight: Number(medida.coxa_direita) || 0,
                                                thighLeft: Number(medida.coxa_esquerda) || 0,
                                                calfRight: Number(medida.panturrilha_direita) || 0,
                                                calfLeft: Number(medida.panturrilha_esquerda) || 0,
                                                wristRight: Number(ficha?.punho) || 17,
                                                wristLeft: Number(ficha?.punho) || 17,
                                                kneeRight: Number(ficha?.joelho) || 40,
                                                kneeLeft: Number(ficha?.joelho) || 40,
                                                ankleRight: Number(ficha?.tornozelo) || 22,
                                                ankleLeft: Number(ficha?.tornozelo) || 22,
                                            },
                                            skinfolds: {
                                                tricep: Number(medida.dobra_tricipital) || 0,
                                                subscapular: Number(medida.dobra_subescapular) || 0,
                                                chest: Number(medida.dobra_peitoral) || 0,
                                                axillary: Number(medida.dobra_axilar_media) || 0,
                                                suprailiac: Number(medida.dobra_suprailiaca) || 0,
                                                abdominal: Number(medida.dobra_abdominal) || 0,
                                                thigh: Number(medida.dobra_coxa) || 0,
                                            },
                                        };

                                        const calcInput = mapMeasurementToInput(tempHistory, genero as 'MALE' | 'FEMALE', idade);
                                        const result = calcularAvaliacaoGeral(calcInput);
                                        const composicao = result.scores.composicao.detalhes;

                                        const safeNum = (v: any): number => {
                                            const n = Number(v);
                                            return (!isFinite(n) || isNaN(n)) ? 0 : Math.round(n * 100) / 100;
                                        };

                                        const scoreGeral = safeNum(result.avaliacaoGeral);
                                        const bfVal = safeNum(composicao.detalhes.bf.valor);
                                        const ffmiVal = safeNum(composicao.detalhes.ffmi.valor);
                                        const peso = safeNum(medida.peso);

                                        const safeJson = JSON.parse(JSON.stringify(result.scores, (_, v) =>
                                            typeof v === 'number' && !isFinite(v) ? 0 : v
                                        ));

                                        // Criar avaliação IN-MEMORY para a UI
                                        const syntheticAvaliacao: Avaliacao = {
                                            id: `auto-${medida.id}`,
                                            atleta_id: atleta.id,
                                            medidas_id: medida.id,
                                            data: medida.data,
                                            peso,
                                            score_geral: scoreGeral,
                                            gordura_corporal: bfVal,
                                            massa_magra: safeNum(composicao.pesoMagro),
                                            massa_gorda: safeNum(composicao.pesoGordo),
                                            ffmi: ffmiVal,
                                            imc: alturaCm > 0 ? safeNum(peso / Math.pow(alturaCm / 100, 2)) : 0,
                                            classificacao_geral: getClassificacao(scoreGeral),
                                            proporcoes: safeJson,
                                            simetria: null,
                                            comparacao_anterior: null,
                                            created_at: new Date().toISOString(),
                                        };

                                        avaliacoes = [...avaliacoes, syntheticAvaliacao];

                                        // Persistir no Supabase (INTEGER para score_geral e imc)
                                        (async () => {
                                            try {
                                                const { id: _, ...insertData } = syntheticAvaliacao;
                                                const dbInsert = {
                                                    ...insertData,
                                                    score_geral: Math.round(scoreGeral),
                                                    imc: Math.round(syntheticAvaliacao.imc || 0),
                                                };
                                                const { error } = await supabase
                                                    .from('avaliacoes')
                                                    .insert(dbInsert as any);
                                                if (error) {
                                                    console.warn(`[DataStore] ⚠️ Migração: persistência falhou para medida ${medida.id.substring(0, 8)}:`, error.message);
                                                } else {
                                                    console.info(`[DataStore] ✅ Migração: avaliação persistida para medida ${medida.id.substring(0, 8)}`);
                                                }
                                            } catch (e) {
                                                console.warn(`[DataStore] ⚠️ Migração: erro background:`, e);
                                            }
                                        })();

                                    } catch (calcErr) {
                                        console.error(`[DataStore] ❌ Migração: erro no cálculo para medida ${medida.id}:`, calcErr);
                                    }
                                }

                                avaliacoes.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
                                console.info(`[DataStore] ✅ Migração concluída para ${atleta.nome}: ${medidasOrfas.length} avaliações recuperadas`);
                            }

                            return mapAtletaToPersonalAthlete(
                                atleta,
                                ficha,
                                medidas,
                                avaliacoes
                            );
                        })
                    );

                    console.info(`[DataStore] ✅ Carregou ${mappedAthletes.length} atletas do Supabase`);
                    set({
                        personalAthletes: mappedAthletes,
                        dataSource: 'SUPABASE',
                        isLoadingFromDB: false,
                    });

                } catch (err) {
                    console.error('[DataStore] Erro ao carregar do Supabase:', err);
                    set({ isLoadingFromDB: false, dataSource: 'SUPABASE', personalAthletes: [] });
                }
            },

            addAssessment: ({ athleteId, measurements, skinfolds, gender }) => {
                // Calculate score
                const calculationInput = mapMeasurementToInput(
                    { id: '', date: '', measurements, skinfolds },
                    gender === 'FEMALE' ? 'FEMALE' : 'MALE'
                );
                const result = calcularAvaliacaoGeral(calculationInput);

                // Encontrar o ratio físico (V-Taper) nos detalhes
                const vTaperDetail = result.scores.proporcoes.detalhes.detalhes.find(
                    (d: any) => d.proporcao === 'vTaper' || d.proporcao === 'shapeV'
                );
                const physicalRatio = vTaperDetail?.valor || 0;

                const newAssessment: MeasurementHistory = {
                    id: `assessment-${Date.now()}`,
                    date: new Date().toISOString(),
                    measurements,
                    skinfolds,
                    score: result.avaliacaoGeral,
                    ratio: physicalRatio,
                    bf: result.scores.composicao.detalhes.detalhes.bf.valor,
                    ffmi: result.scores.composicao.detalhes.detalhes.ffmi.valor
                };

                // Update athletes list
                set((state) => {
                    const updatedAthletes = state.personalAthletes.map(athlete => {
                        if (athlete.id === athleteId) {
                            const updatedAssessments = [newAssessment, ...athlete.assessments];
                            return {
                                ...athlete,
                                assessments: updatedAssessments,
                                score: result.avaliacaoGeral,
                                ratio: physicalRatio,
                                lastMeasurement: newAssessment.date,
                                scoreVariation: updatedAssessments.length > 1
                                    ? result.avaliacaoGeral - (athlete.score || 0)
                                    : 0
                            };
                        }
                        return athlete;
                    });

                    // Update personal stats if using mocks
                    const p1 = state.personals.find(p => p.id === 'p1');
                    if (p1) {
                        const personalAthletesList = updatedAthletes.filter(a =>
                            ['athlete-1', 'athlete-2', 'athlete-3', 'athlete-7', 'athlete-8', 'athlete-leonardo'].includes(a.id)
                        );
                        const avgScore = personalAthletesList.reduce((acc, a) => acc + (a.score || 0), 0) / personalAthletesList.length;

                        const updatedPersonals = state.personals.map(p => {
                            if (p.id === 'p1') {
                                return { ...p, averageStudentScore: Math.round(avgScore * 10) / 10 };
                            }
                            return p;
                        });

                        const totalAvg = updatedPersonals.reduce((acc, p) => acc + p.averageStudentScore, 0) / updatedPersonals.length;
                        const updatedAcademyStats = {
                            ...state.academyStats,
                            averageScore: Math.round(totalAvg * 10) / 10,
                            measuredThisWeek: state.academyStats.measuredThisWeek + 1
                        };

                        return {
                            personalAthletes: updatedAthletes,
                            personals: updatedPersonals,
                            academyStats: updatedAcademyStats
                        };
                    }

                    return { personalAthletes: updatedAthletes };
                });

                // Se usando Supabase, persistir na nova tabela assessments
                const state = get();
                if (state.dataSource === 'SUPABASE') {
                    (async () => {
                        try {
                            // Sanitizar resultados (remover NaN/Infinity)
                            const safeResults = JSON.parse(JSON.stringify({
                                avaliacaoGeral: result.avaliacaoGeral,
                                classificacao: result.classificacao,
                                scores: result.scores,
                                penalizacoes: result.penalizacoes,
                                insights: result.insights,
                            }, (_, v) => typeof v === 'number' && !isFinite(v) ? 0 : v));

                            // Buscar dados da ficha para preencher age
                            const athlete = get().personalAthletes.find(a => a.id === athleteId);
                            let age = 30;
                            if (athlete?.birthDate) {
                                const birth = new Date(athlete.birthDate);
                                const now = new Date();
                                age = now.getFullYear() - birth.getFullYear();
                                const m = now.getMonth() - birth.getMonth();
                                if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
                            }

                            const heightCm = measurements.height > 0 && measurements.height < 3
                                ? Math.round(measurements.height * 100)
                                : measurements.height;

                            // Determinar método de BF usado
                            const hasSkinfolds = skinfolds && Object.values(skinfolds).some((v: any) => v > 0);
                            const bfMethod = hasSkinfolds ? 'POLLOCK_7' : 'NAVY';

                            const assessmentInsert = {
                                athlete_id: athleteId,
                                date: new Date().toISOString(),
                                weight: Math.round(measurements.weight * 100) / 100,
                                height: heightCm,
                                age,
                                gender: gender === 'FEMALE' ? 'FEMALE' : 'MALE',
                                body_fat: Math.round(result.scores.composicao.detalhes.detalhes.bf.valor * 100) / 100,
                                body_fat_method: bfMethod,
                                measurements: {
                                    linear: measurements,
                                    skinfolds: skinfolds,
                                },
                                results: safeResults,
                            };

                            const { error: assessmentError } = await supabase
                                .from('assessments')
                                .insert(assessmentInsert as any);

                            if (assessmentError) {
                                console.error('[DataStore] ❌ Erro ao inserir na tabela assessments:', assessmentError.message, assessmentError.details, assessmentError.hint);
                                console.error('[DataStore] ❌ Payload (primeiros 500 chars):', JSON.stringify(assessmentInsert).substring(0, 500));
                            } else {
                                console.info('[DataStore] ✅ Avaliação completa persistida na tabela assessments');
                            }

                            // Backward compat: também gravar na tabela medidas (para manter histórico)
                            const medidaInsert = {
                                atleta_id: athleteId,
                                peso: measurements.weight,
                                pescoco: measurements.neck,
                                ombros: measurements.shoulders,
                                peitoral: measurements.chest,
                                cintura: measurements.waist,
                                quadril: measurements.hips,
                                braco_direito: measurements.armRight,
                                braco_esquerdo: measurements.armLeft,
                                antebraco_direito: measurements.forearmRight,
                                antebraco_esquerdo: measurements.forearmLeft,
                                coxa_direita: measurements.thighRight,
                                coxa_esquerda: measurements.thighLeft,
                                panturrilha_direita: measurements.calfRight,
                                panturrilha_esquerda: measurements.calfLeft,
                                dobra_tricipital: skinfolds.tricep,
                                dobra_subescapular: skinfolds.subscapular,
                                dobra_peitoral: skinfolds.chest,
                                dobra_axilar_media: skinfolds.axillary,
                                dobra_suprailiaca: skinfolds.suprailiac,
                                dobra_abdominal: skinfolds.abdominal,
                                dobra_coxa: skinfolds.thigh,
                            };
                            await supabase.from('medidas').insert(medidaInsert as any);

                        } catch (err) {
                            console.error('[DataStore] ❌ Exceção ao persistir no Supabase:', err);
                        }
                    })();
                }

                return { assessment: newAssessment, result };
            },

            updateAthlete: (updatedAthlete) => {
                set((state) => ({
                    personalAthletes: state.personalAthletes.map(a =>
                        a.id === updatedAthlete.id ? updatedAthlete : a
                    )
                }));
            },

            getAthleteById: (id) => {
                return get().personalAthletes.find(a => a.id === id);
            },

            getPersonals: () => {
                return get().personals;
            },

            updatePersonalStats: (personalId) => {
                set(state => {
                    return state;
                });
            },

            resetToMocks: () => {
                // Mantido por compatibilidade, mas agora reseta para vazio (sem mocks)
                set({
                    personalAthletes: [],
                    personals: [],
                    academyStats: { totalAthletes: 0, totalPersonals: 0, averageScore: 0, measuredThisWeek: 0 } as AcademyStats,
                    dataSource: 'SUPABASE' as DataSource
                });
            }
        }),
        {
            name: 'vitru-data-storage',
        }
    )
);

// Helper para classificação
function getClassificacao(score: number): 'INICIO' | 'CAMINHO' | 'QUASE_LA' | 'META' | 'ELITE' {
    if (score >= 90) return 'ELITE';
    if (score >= 80) return 'META';
    if (score >= 70) return 'QUASE_LA';
    if (score >= 60) return 'CAMINHO';
    return 'INICIO';
}
