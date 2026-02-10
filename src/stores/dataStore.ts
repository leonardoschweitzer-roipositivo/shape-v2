import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MeasurementHistory, PersonalAthlete, mockPersonalAthletes } from '@/mocks/personal';
import { PersonalSummary, mockPersonalsSummary, AcademyStats, mockAcademyStats } from '@/mocks/academy';
import { mapMeasurementToInput } from '@/services/calculations/evolutionProcessor';
import { calcularAvaliacaoGeral } from '@/services/calculations/assessment';

interface DataState {
    personalAthletes: PersonalAthlete[];
    personals: PersonalSummary[];
    academyStats: AcademyStats;

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

    resetToMocks: () => void;
}

export const useDataStore = create<DataState>()(
    persist(
        (set, get) => ({
            personalAthletes: mockPersonalAthletes,
            personals: mockPersonalsSummary,
            academyStats: mockAcademyStats,

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

                    // In a real app, we'd know which personal this athlete belongs to.
                    // For this mock, we'll assume most of them belong to 'p1' (Carlos Lima)
                    // or we just find the personal p1 and update their stats.
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

                        // Also update academy stats
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
                // Logic to recalculate average student score for a personal
                set(state => {
                    // Implementation here if needed, but we do it in addAssessment
                    return state;
                });
            },

            resetToMocks: () => {
                set({
                    personalAthletes: mockPersonalAthletes,
                    personals: mockPersonalsSummary,
                    academyStats: mockAcademyStats
                });
            }
        }),
        {
            name: 'vitru-data-storage',
        }
    )
);
