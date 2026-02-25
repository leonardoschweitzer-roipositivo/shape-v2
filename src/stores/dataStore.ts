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

                            return mapAtletaToPersonalAthlete(
                                atleta,
                                fichaRes.data as Ficha | null,
                                (medidasRes.data || []) as Medida[],
                                (avaliacoesRes.data || []) as Avaliacao[]
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

                const newAssessment: MeasurementHistory = {
                    id: `assessment-${Date.now()}`,
                    date: new Date().toISOString(),
                    measurements,
                    skinfolds,
                    score: result.avaliacaoGeral,
                    ratio: result.scores.proporcoes.valor
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
                                ratio: result.scores.proporcoes.valor,
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
                            };

                            const { data: medida } = await supabase
                                .from('medidas')
                                .insert(medidaInsert as any)
                                .select()
                                .single();

                            if (medida) {
                                const avaliacaoInsert = {
                                    atleta_id: athleteId,
                                    medidas_id: (medida as any).id,
                                    peso: measurements.weight,
                                    score_geral: result.avaliacaoGeral,
                                    classificacao_geral: getClassificacao(result.avaliacaoGeral),
                                    proporcoes: result.scores,
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
