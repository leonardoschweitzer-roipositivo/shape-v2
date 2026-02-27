import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MeasurementHistory, PersonalAthlete } from '@/mocks/personal';
import { PersonalSummary, AcademyStats } from '@/mocks/academy';
import { mapMeasurementToInput } from '@/services/calculations/evolutionProcessor';
import { calcularAvaliacaoGeral } from '@/services/calculations/assessment';
import { mapAtletaToPersonalAthlete } from '@/services/mappers';
import { supabase } from '@/services/supabase';
import { useAthleteStore } from '@/stores/athleteStore';
import { calculateAge } from '@/utils/dateUtils';
import type { Atleta, Ficha, Medida } from '@/lib/database.types';

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

                    // 2. Para cada atleta, buscar ficha, medidas e assessments (tabela consolidada)
                    const mappedAthletes: PersonalAthlete[] = await Promise.all(
                        atletas.map(async (atleta: Atleta) => {
                            const [fichaRes, medidasRes, assessmentsRes] = await Promise.all([
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
                                    .from('assessments')
                                    .select('*')
                                    .eq('atleta_id', atleta.id)
                                    .order('date', { ascending: false }),
                            ]);

                            const ficha = fichaRes.data as Ficha | null;
                            const medidas = (medidasRes.data || []) as Medida[];
                            const assessments = (assessmentsRes.data || []) as any[];

                            console.info(`[DataStore] Atleta: ${atleta.nome} | Medidas: ${medidas.length} | Assessments: ${assessments.length}`);

                            return mapAtletaToPersonalAthlete(
                                atleta,
                                ficha,
                                medidas,
                                assessments
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
                const athlete = get().personalAthletes.find(a => a.id === athleteId);

                // Tratar de pegar a data de nascimento seja do atleta, ou do próprio profile ativo
                const store = useAthleteStore.getState();
                const profile = store.profile;

                const birthDate = athlete?.birthDate || (profile?.id === athleteId ? profile?.birthDate : undefined);
                const realAge = calculateAge(birthDate) || 30;

                // Calculate score
                const calculationInput = mapMeasurementToInput(
                    { id: '', date: '', measurements, skinfolds },
                    gender === 'FEMALE' ? 'FEMALE' : 'MALE',
                    realAge
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

                            const heightCm = measurements.height > 0 && measurements.height < 3
                                ? Math.round(measurements.height * 100)
                                : measurements.height;

                            // Determinar método de BF usado
                            const hasSkinfolds = skinfolds && Object.values(skinfolds).some((v: any) => v > 0);
                            const bfMethod = hasSkinfolds ? 'POLLOCK_7' : 'NAVY';

                            const assessmentInsert = {
                                atleta_id: athleteId,
                                personal_id: athlete?.personalId, // Usar o personalId do registro do atleta
                                date: new Date().toISOString(),
                                weight: Math.round(measurements.weight * 100) / 100,
                                height: heightCm,
                                age: realAge,
                                gender: gender === 'FEMALE' ? 'FEMALE' : 'MALE',
                                body_fat: Math.round(result.scores.composicao.detalhes.detalhes.bf.valor * 100) / 100,
                                body_fat_method: bfMethod,
                                measurements: {
                                    linear: measurements,
                                    skinfolds: skinfolds,
                                },
                                results: safeResults,
                                score: Math.round(result.avaliacaoGeral * 10) / 10,
                                ratio: Math.round(physicalRatio * 100) / 100,
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

                            // Backward compat: também gravar na tabela medidas (para manter histórico detalhado)
                            const medidaInsert = {
                                atleta_id: athleteId,
                                personal_id: athlete?.personalId,
                                data: new Date().toISOString().split('T')[0], // YYYY-MM-DD
                                peso: measurements.weight,
                                gordura_corporal: Math.round(result.scores.composicao.detalhes.detalhes.bf.valor * 100) / 100,
                                pescoco: measurements.neck,
                                ombros: measurements.shoulders,
                                peitoral: measurements.chest,
                                cintura: measurements.waist,
                                quadril: measurements.hips,
                                abdomen: measurements.abdomen || measurements.waist, // Fallback abdomen para cintura
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
                                registrado_por: 'COACH_IA',
                                score: Math.round(result.avaliacaoGeral * 10) / 10,
                                ratio: Math.round(physicalRatio * 100) / 100,
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

