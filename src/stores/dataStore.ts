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

                    // 2. Para cada atleta, buscar ficha, medidas e avaliações
                    const mappedAthletes: PersonalAthlete[] = await Promise.all(
                        atletas.map(async (atleta: Atleta) => {
                            const [fichaRes, medidasRes, avaliacoesRes] = await Promise.all([
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
                            ]);

                            // 🔍 DEBUG: O que vem do Supabase?
                            let avaliacoes = (avaliacoesRes.data || []) as Avaliacao[];
                            const medidas = (medidasRes.data || []) as Medida[];
                            const ficha = fichaRes.data as Ficha | null;

                            console.info(`[DataStore] 🔍 Atleta: ${atleta.nome}`);
                            console.info(`[DataStore]   Medidas: ${medidas.length}`);
                            console.info(`[DataStore]   Avaliações: ${avaliacoes.length}`);

                            if (medidas.length > 0) {
                                console.info(`[DataStore]   Última medida peso: ${medidas[0].peso}, ombros: ${medidas[0].ombros}, cintura: ${medidas[0].cintura}`);
                            }

                            // 🔄 AUTO-RECOVERY: Se existem medidas sem avaliações correspondentes,
                            // recalcular e persistir automaticamente
                            const medidasOrfas = medidas.filter(m =>
                                !avaliacoes.some(a => a.medidas_id === m.id)
                            );

                            if (medidasOrfas.length > 0) {
                                console.info(`[DataStore] 🔄 Encontradas ${medidasOrfas.length} medidas sem avaliação. Auto-recovery...`);

                                const genero = ficha?.sexo === 'F' ? 'FEMALE' : 'MALE';
                                let alturaCm = Number(ficha?.altura) || 175;
                                if (alturaCm > 0 && alturaCm < 3) alturaCm = Math.round(alturaCm * 100);

                                // Calcular idade real
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
                                        // Montar MeasurementHistory temporário para calcular
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

                                        console.info(`[DataStore] ✅ Auto-recovery para medida ${medida.id.substring(0, 8)}: score=${scoreGeral}, bf=${bfVal}, ffmi=${ffmiVal}`);

                                        // Sanitizar JSON 
                                        const safeJson = JSON.parse(JSON.stringify(result.scores, (_, v) =>
                                            typeof v === 'number' && !isFinite(v) ? 0 : v
                                        ));

                                        // Criar avaliação IN-MEMORY (garante dados na UI imediatamente)
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
                                        console.info(`[DataStore] ✅ Avaliação sintética criada in-memory`);

                                        // Persistir no Supabase em background (não bloqueia a UI)
                                        // PostgreSQL: score_geral e imc são INTEGER, demais são NUMERIC
                                        (async () => {
                                            try {
                                                const { id: _, ...insertData } = syntheticAvaliacao;
                                                const dbInsert = {
                                                    ...insertData,
                                                    score_geral: Math.round(scoreGeral),
                                                    imc: Math.round(syntheticAvaliacao.imc || 0),
                                                    gordura_corporal: Math.round(bfVal * 100) / 100,
                                                    massa_magra: Math.round(safeNum(composicao.pesoMagro) * 100) / 100,
                                                    massa_gorda: Math.round(safeNum(composicao.pesoGordo) * 100) / 100,
                                                    ffmi: Math.round(ffmiVal * 100) / 100,
                                                    peso: Math.round(peso * 100) / 100,
                                                };
                                                const { error } = await supabase
                                                    .from('avaliacoes')
                                                    .insert(dbInsert as any);
                                                if (error) {
                                                    console.warn(`[DataStore] ⚠️ Persistência Supabase falhou (dados ok na UI):`, error.message);
                                                } else {
                                                    console.info(`[DataStore] ✅ Avaliação persistida no Supabase com sucesso`);
                                                }
                                            } catch (e) {
                                                console.warn(`[DataStore] ⚠️ Erro na persistência background:`, e);
                                            }
                                        })();

                                    } catch (calcErr) {
                                        console.error(`[DataStore] ❌ Erro no cálculo para medida ${medida.id}:`, calcErr);
                                    }
                                }

                                // Re-ordenar avaliações por data DESC
                                avaliacoes.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
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

                // Se usando Supabase, também persiste no banco
                const state = get();
                if (state.dataSource === 'SUPABASE') {
                    // Async sem bloquear - persistir no Supabase em background
                    (async () => {
                        try {
                            // Criar medida
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

                            const { data: medida } = await supabase
                                .from('medidas')
                                .insert(medidaInsert as any)
                                .select()
                                .single();

                            if (medida) {
                                const composicao = result.scores.composicao.detalhes;
                                const safeJson = JSON.parse(JSON.stringify(result.scores, (_, v) =>
                                    typeof v === 'number' && !isFinite(v) ? 0 : v
                                ));
                                const avaliacaoInsert = {
                                    atleta_id: athleteId,
                                    medidas_id: (medida as any).id,
                                    peso: Math.round(measurements.weight * 100) / 100,
                                    score_geral: Math.round(result.avaliacaoGeral),
                                    gordura_corporal: Math.round(composicao.detalhes.bf.valor * 100) / 100,
                                    massa_magra: Math.round(composicao.pesoMagro * 100) / 100,
                                    massa_gorda: Math.round(composicao.pesoGordo * 100) / 100,
                                    ffmi: Math.round(composicao.detalhes.ffmi.valor * 100) / 100,
                                    imc: Math.round(measurements.weight / Math.pow(measurements.height / 100, 2)),
                                    classificacao_geral: getClassificacao(result.avaliacaoGeral),
                                    proporcoes: safeJson,
                                };

                                await supabase
                                    .from('avaliacoes')
                                    .insert(avaliacaoInsert as any);

                                console.info('[DataStore] ✅ Avaliação persistida no Supabase');
                            }
                        } catch (err) {
                            console.error('[DataStore] Erro ao persistir no Supabase:', err);
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
