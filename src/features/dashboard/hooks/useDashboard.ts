import { useState, useEffect } from 'react';
import { DashboardResponse, RatioClassification, ScoreClassification, MetricCardData, Grade } from '../types';
import { mockDashboardData } from '../services/mockDashboardData';
import { useAthleteStore } from '@/stores/athleteStore';
import { mockPersonalAthletes, PersonalAthlete } from '@/mocks/personal';

// Helper to map athlete data to dashboard structure
const mapAthleteToDashboard = (athlete: PersonalAthlete): DashboardResponse => {
    const current = athlete.assessments[0];
    const previous = athlete.assessments[1];

    if (!current) return mockDashboardData;

    // Calculate trends
    const weightTrend = previous ? current.measurements.weight - previous.measurements.weight : 0;

    // Calculate previous ratio
    const prevRatio = previous
        ? (previous.measurements.shoulders && previous.measurements.waist ? previous.measurements.shoulders / previous.measurements.waist : athlete.ratio - 0.05)
        : athlete.ratio - 0.05;

    // Calculate Evolution Metrics
    const evolutionMetrics: any[] = [];

    if (previous) {
        // Ombros
        const ombrosDiff = current.measurements.shoulders - previous.measurements.shoulders;
        evolutionMetrics.push({
            name: 'Ombros',
            previous: previous.measurements.shoulders,
            current: current.measurements.shoulders,
            change: Number(ombrosDiff.toFixed(1)),
            changePercent: Number(((ombrosDiff / previous.measurements.shoulders) * 100).toFixed(1)),
            status: ombrosDiff >= 0 ? 'up' : 'down',
            isPositive: ombrosDiff > 0, // More shoulders is usually good
            unit: 'cm'
        });

        // Cintura
        const cinturaDiff = current.measurements.waist - previous.measurements.waist;
        evolutionMetrics.push({
            name: 'Cintura',
            previous: previous.measurements.waist,
            current: current.measurements.waist,
            change: Number(cinturaDiff.toFixed(1)),
            changePercent: Number(((cinturaDiff / previous.measurements.waist) * 100).toFixed(1)),
            status: cinturaDiff >= 0 ? 'up' : 'down',
            isPositive: cinturaDiff < 0, // Less waist is good
            unit: 'cm'
        });

        // Braço (Right)
        const bracoDiff = current.measurements.armRight - previous.measurements.armRight;
        evolutionMetrics.push({
            name: 'Braço',
            previous: previous.measurements.armRight,
            current: current.measurements.armRight,
            change: Number(bracoDiff.toFixed(1)),
            changePercent: Number(((bracoDiff / previous.measurements.armRight) * 100).toFixed(1)),
            status: bracoDiff >= 0 ? 'up' : 'down',
            isPositive: bracoDiff > 0,
            unit: 'cm'
        });

        // Ratio
        const ratioDiff = athlete.ratio - prevRatio;
        evolutionMetrics.push({
            name: 'Ratio',
            previous: Number(prevRatio.toFixed(2)),
            current: athlete.ratio,
            change: Number(ratioDiff.toFixed(2)),
            changePercent: Number(((ratioDiff / prevRatio) * 100).toFixed(1)),
            status: ratioDiff >= 0 ? 'up' : 'down',
            isPositive: ratioDiff > 0,
            unit: ''
        });
    } else {
        // Fallback or empty if no history
        // Just use current measurements with 0 change
        // ... (implementation optional, but good for safety)
    }

    // Estimate body fat based on Navy method or skinfolds if available
    // For Leonardo (Navy): Weight 88.8, Waist 84.5, Neck 43, Height 180
    // We can use a simplified value or fixed value for now if calculation is complex to import here
    // Let's use the values from the prompt context if possible, or calculate simple diffs

    // Using mock values for calculated fields to match the requested profile "Leonardo"
    // He has 88.8kg, 1.80m.

    return {
        ...mockDashboardData,
        user: {
            id: athlete.id,
            name: athlete.name,
            isPro: true,
            hasCompleteProfile: true,
        },
        latestMeasurement: {
            date: new Date(current.date),
            weight: current.measurements.weight,
            bodyFat: 12.5
        },
        lastMeasurementDate: new Date(current.date),
        daysSinceLastMeasurement: Math.floor((new Date().getTime() - new Date(current.date).getTime()) / (1000 * 60 * 60 * 24)),

        currentScores: {
            ...mockDashboardData.currentScores,
            scoreTotal: athlete.score,
            ratio: athlete.ratio,
            classification: 'AVANÇADO', // Dynamic based on score?
            ratioClassification: 'ESTÉTICO',
        },

        kpi: {
            ratio: {
                current: athlete.ratio,
                target: 1.618,
                previous: Number(prevRatio.toFixed(2)),
                classification: 'ESTÉTICO',
                distanceToTarget: Math.max(0, 1.618 - athlete.ratio),
                evolution: Number((athlete.ratio - prevRatio).toFixed(2))
            },
            score: {
                total: athlete.score,
                max: 100,
                change: athlete.scoreVariation,
                changePeriod: 'vs avaliação anterior',
                grades: {
                    simetria: 'A',
                    proporcao: 'B+',
                    estetica: 'A', // Fixed from A-
                    evolucao: 'A'
                },
                classification: 'AVANÇADO',
                aiSummary: 'Excelente evolução. Mantenha o foco nos deltoides para maximizar o V-Taper.'
            }
        },

        evolution: {
            period: '30d', // Dynamically calculate period? Defaulting for now
            metrics: evolutionMetrics.length > 0 ? evolutionMetrics : mockDashboardData.evolution.metrics,
            scoreChange: athlete.scoreVariation,
            ratioChange: Number((athlete.ratio - prevRatio).toFixed(2)),
            overallTrend: athlete.scoreVariation >= 0 ? 'improving' : 'declining'
        },

        bodyComposition: {
            weight: {
                current: current.measurements.weight,
                start: previous?.measurements.weight || current.measurements.weight + 2,
                goal: 90.0, // Example goal
                trend: weightTrend,
                unit: 'kg'
            },
            bodyFat: {
                current: 12.5, // Estimated for Leonardo
                start: 14.0,
                goal: 10.0,
                trend: -1.5,
                unit: '%',
                classification: 'Atleta'
            }
        },

        metricsGrid: [
            { metric: 'ombros', label: 'OMBROS', value: current.measurements.shoulders, unit: 'cm', ideal: 135, status: 'close', statusLabel: 'Meta: 135cm', trend: { value: previous ? current.measurements.shoulders - previous.measurements.shoulders : 0, period: 'última' } },
            { metric: 'peitoral', label: 'PEITORAL', value: current.measurements.chest, unit: 'cm', ideal: 125, status: 'close', statusLabel: 'Meta: 125cm', trend: { value: previous ? current.measurements.chest - previous.measurements.chest : 0, period: 'última' } },
            { metric: 'cintura', label: 'CINTURA', value: current.measurements.waist, unit: 'cm', ideal: 80, status: 'onTarget', statusLabel: 'Na Meta ✓', trend: { value: previous ? current.measurements.waist - previous.measurements.waist : 0, period: 'última' } },
            { metric: 'bracos', label: 'BRAÇOS', value: current.measurements.armRight, unit: 'cm', ideal: 45, status: 'far', statusLabel: 'Meta: 45cm', trend: { value: previous ? current.measurements.armRight - previous.measurements.armRight : 0, period: 'última' } },
            { metric: 'coxas', label: 'COXAS', value: current.measurements.thighRight, unit: 'cm', ideal: 65, status: 'far', statusLabel: 'Meta: 65cm', trend: { value: previous ? current.measurements.thighRight - previous.measurements.thighRight : 0, period: 'última' } },
            { metric: 'panturrilha', label: 'PANTURRILHA', value: current.measurements.calfRight, unit: 'cm', ideal: 42, status: 'onTarget', statusLabel: 'Bom', trend: { value: previous ? current.measurements.calfRight - previous.measurements.calfRight : 0, period: 'última' } },
        ],

        heatmap: {
            mode: 'score',
            regions: {
                ombros: { name: 'Ombros', score: 95, atual: current.measurements.shoulders, ideal: 135, diferenca: Number((135 - current.measurements.shoulders).toFixed(1)), status: 'excellent' },
                peitoral: { name: 'Peitoral', score: 90, atual: current.measurements.chest, ideal: 125, diferenca: Number((125 - current.measurements.chest).toFixed(1)), status: 'good' },
                bracos: { name: 'Braços', score: 85, atual: current.measurements.armRight, ideal: 45, diferenca: Number((45 - current.measurements.armRight).toFixed(1)), status: 'attention' },
                cintura: { name: 'Cintura', score: 88, atual: current.measurements.waist, ideal: 80, diferenca: Number((current.measurements.waist - 80).toFixed(1)), status: 'good' },
                coxas: { name: 'Coxas', score: 80, atual: current.measurements.thighRight, ideal: 65, diferenca: Number((65 - current.measurements.thighRight).toFixed(1)), status: 'attention' },
                panturrilhas: { name: 'Panturrilhas', score: 92, atual: current.measurements.calfRight, ideal: 42, diferenca: Number((42 - current.measurements.calfRight).toFixed(1)), status: 'excellent' },
            }
        },

        symmetry: {
            overallSymmetry: 92,
            items: [
                { muscle: 'Braço', left: current.measurements.armLeft, right: current.measurements.armRight, diff: Number(Math.abs(current.measurements.armRight - current.measurements.armLeft).toFixed(1)), diffPercent: 1.2, status: 'symmetric' },
                { muscle: 'Coxa', left: current.measurements.thighLeft, right: current.measurements.thighRight, diff: Number(Math.abs(current.measurements.thighRight - current.measurements.thighLeft).toFixed(1)), diffPercent: 1.6, status: 'symmetric' },
                { muscle: 'Panturrilha', left: current.measurements.calfLeft, right: current.measurements.calfRight, diff: Number(Math.abs(current.measurements.calfRight - current.measurements.calfLeft).toFixed(1)), diffPercent: 3.5, status: 'moderate' }
            ]
        },

        gamification: {
            ...mockDashboardData.gamification,
            level: 6,
            currentXp: 120,
            nextLevelXp: 1000
        }
    };
};

export function useDashboard() {
    const [data, setData] = useState<DashboardResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const { profile } = useAthleteStore();

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setIsLoading(true);
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 600));

                // Try to find Leonardo or logged user
                const userEmail = profile?.email?.toLowerCase();
                const foundAthlete = mockPersonalAthletes.find(a =>
                    (profile && a.id === profile.id) ||
                    (userEmail && a.email.toLowerCase() === userEmail) ||
                    a.id === 'athlete-leonardo'  // Fallback for demo
                );

                if (foundAthlete) {
                    setData(mapAthleteToDashboard(foundAthlete));
                } else {
                    setData(mockDashboardData);
                }

                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch dashboard data'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboard();
    }, [profile]);

    return { data, isLoading, error };
}
