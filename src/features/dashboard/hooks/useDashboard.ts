import { useState, useEffect } from 'react';
import { DashboardResponse, ScoreClassification, MetricCardData } from '../types';
import { mockDashboardData } from '../services/mockDashboardData';
import { useAthleteStore } from '@/stores/athleteStore';
import { useDataStore } from '@/stores/dataStore';
import { PersonalAthlete } from '@/mocks/personal';
import {
    mapMeasurementToInput,
    calcularAvaliacaoGeral,
    GOLDEN_RATIO
} from '@/services/calculations';

import { calculateAge } from '@/utils/dateUtils';

// Helper to map athlete data to dashboard structure
const mapAthleteToDashboard = (athlete: PersonalAthlete, profileBirthDate?: string | Date): DashboardResponse => {
    const current = athlete.assessments[0];
    const previous = athlete.assessments[1];

    if (!current) return mockDashboardData;

    // Use shared service to map and calculate scores
    const fallbackDate = athlete.birthDate || profileBirthDate;
    const age = fallbackDate ? calculateAge(fallbackDate) : 30;

    const currentInput = mapMeasurementToInput(current, athlete.gender === 'FEMALE' ? 'FEMALE' : 'MALE', age);
    const currentResults = calcularAvaliacaoGeral(currentInput);

    const previousInput = previous ? mapMeasurementToInput(previous, athlete.gender === 'FEMALE' ? 'FEMALE' : 'MALE', age) : null;
    const previousResults = previousInput ? calcularAvaliacaoGeral(previousInput) : null;

    // Extract current values
    const m = current.measurements;
    const currentScore = currentResults.avaliacaoGeral;
    const currentRatio = m.shoulders / m.waist;
    const currentBF = Number(currentResults.scores.composicao.detalhes.detalhes.bf.valor.toFixed(2));

    // Extract previous values for trends
    const prevScore = previousResults ? previousResults.avaliacaoGeral : currentScore;
    const prevRatio = previous ? (previous.measurements.shoulders / previous.measurements.waist) : currentRatio;
    const prevBF = previousResults ? Number(previousResults.scores.composicao.detalhes.detalhes.bf.valor.toFixed(2)) : currentBF;
    const weightTrend = previous ? m.weight - previous.measurements.weight : 0;

    // Calculate Evolution Metrics for the dashboard summary
    const evolutionMetrics: any[] = [];
    if (previous) {
        // Ombros
        const ombrosDiff = m.shoulders - previous.measurements.shoulders;
        evolutionMetrics.push({
            name: 'Ombros',
            previous: previous.measurements.shoulders,
            current: m.shoulders,
            change: Number(ombrosDiff.toFixed(1)),
            changePercent: Number(((ombrosDiff / previous.measurements.shoulders) * 100).toFixed(1)),
            status: ombrosDiff >= 0 ? 'up' : 'down',
            isPositive: ombrosDiff > 0,
            unit: 'cm'
        });

        // Cintura
        const cinturaDiff = m.waist - previous.measurements.waist;
        evolutionMetrics.push({
            name: 'Cintura',
            previous: previous.measurements.waist,
            current: m.waist,
            change: Number(cinturaDiff.toFixed(1)),
            changePercent: Number(((cinturaDiff / previous.measurements.waist) * 100).toFixed(1)),
            status: cinturaDiff >= 0 ? 'up' : 'down',
            isPositive: cinturaDiff < 0,
            unit: 'cm'
        });

        // Ratio
        const ratioDiff = currentRatio - prevRatio;
        evolutionMetrics.push({
            name: 'Ratio',
            previous: Number(prevRatio.toFixed(2)),
            current: Number(currentRatio.toFixed(2)),
            change: Number(ratioDiff.toFixed(2)),
            changePercent: Number(((ratioDiff / prevRatio) * 100).toFixed(1)),
            status: ratioDiff >= 0 ? 'up' : 'down',
            isPositive: ratioDiff > 0,
            unit: ''
        });
    }

    // Dynamic Ideals (Golden Ratio as default for dashboard)
    const punho = (m.wristLeft + m.wristRight) / 2 || 17.5;
    const joelho = (m.kneeLeft + m.kneeRight) / 2 || 38;
    const tornozelo = (m.ankleLeft + m.ankleRight) / 2 || 23;

    const peitoIdeal = Number((punho * GOLDEN_RATIO.PEITO_PUNHO).toFixed(1));
    const bracoIdeal = Number((punho * GOLDEN_RATIO.BRACO_PUNHO).toFixed(1));
    const cinturaIdeal = Number((m.pelvis * GOLDEN_RATIO.CINTURA_PELVIS).toFixed(1));
    const coxaIdeal = Number((joelho * GOLDEN_RATIO.COXA_JOELHO).toFixed(1));
    const panturrilhaIdeal = Number((tornozelo * GOLDEN_RATIO.PANTURRILHA_TORNOZELO).toFixed(1));
    const ombroIdeal = Number((m.waist * GOLDEN_RATIO.PHI).toFixed(1));

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
            weight: m.weight,
            bodyFat: currentBF
        },
        lastMeasurementDate: new Date(current.date),
        daysSinceLastMeasurement: Math.floor((new Date().getTime() - new Date(current.date).getTime()) / (1000 * 60 * 60 * 24)),

        currentScores: {
            method: 'golden_ratio',
            scoreTotal: currentScore,
            ratio: Number(currentRatio.toFixed(2)),
            classification: currentResults.classificacao.nivel as ScoreClassification,
            ratioClassification: 'ESTÉTICO',
            breakdown: {
                method: 'golden_ratio',
                totalScore: currentScore,
                proportions: currentResults.scores.proporcoes.detalhes.detalhes.map(d => ({
                    id: d.proporcao,
                    nome: d.proporcao.charAt(0).toUpperCase() + d.proporcao.slice(1),
                    score: Math.round(d.percentualDoIdeal),
                    maxScore: 100,
                    percentage: Math.min(100, d.percentualDoIdeal),
                    status: d.percentualDoIdeal >= 90 ? 'excellent' : d.percentualDoIdeal >= 80 ? 'good' : 'attention' as any
                }))
            },
            ideals: {
                ombros: ombroIdeal,
                peitoral: peitoIdeal,
                bracos: bracoIdeal,
                cintura: cinturaIdeal,
                coxas: coxaIdeal,
                panturrilha: panturrilhaIdeal
            }
        },

        kpi: {
            ratio: {
                current: Number(currentRatio.toFixed(2)),
                target: 1.618,
                previous: Number(prevRatio.toFixed(2)),
                classification: 'ESTÉTICO',
                distanceToTarget: Math.max(0, 1.618 - currentRatio),
                evolution: Number((currentRatio - prevRatio).toFixed(2))
            },
            score: {
                total: currentScore,
                max: 100,
                change: Number((currentScore - prevScore).toFixed(1)),
                changePeriod: 'vs avaliação anterior',
                grades: currentResults.scores.proporcoes.detalhes.detalhes.reduce((acc, d) => {
                    const grade = d.percentualDoIdeal >= 95 ? 'A+' : d.percentualDoIdeal >= 90 ? 'A' : d.percentualDoIdeal >= 80 ? 'B+' : 'B';
                    (acc as any)[d.proporcao] = grade;
                    return acc;
                }, {
                    simetria: 'A+',
                    proporcao: 'A',
                    estetica: 'A+',
                    evolucao: 'A+'
                } as any),
                classification: currentResults.classificacao.nivel as ScoreClassification,
                aiSummary: currentResults.insights.pontoForte.mensagem
            }
        },

        evolution: {
            period: '30d',
            metrics: evolutionMetrics.length > 0 ? evolutionMetrics : mockDashboardData.evolution.metrics,
            scoreChange: Number((currentScore - prevScore).toFixed(1)),
            ratioChange: Number((currentRatio - prevRatio).toFixed(2)),
            overallTrend: currentScore >= prevScore ? 'improving' : 'declining'
        },

        bodyComposition: {
            weight: {
                current: m.weight,
                start: previous?.measurements.weight || m.weight,
                goal: 90.0,
                trend: weightTrend,
                unit: 'kg'
            },
            bodyFat: {
                current: currentBF,
                start: prevBF,
                goal: 10.0,
                trend: Number((currentBF - prevBF).toFixed(1)),
                unit: '%',
                classification: currentBF < 10 ? 'Atleta' : currentBF < 15 ? 'Fitness' : 'Normal'
            }
        },

        metricsGrid: [
            { metric: 'peitoral', label: 'PEITORAL', value: m.chest, unit: 'cm', ideal: peitoIdeal, status: m.chest >= peitoIdeal ? 'onTarget' : 'close', statusLabel: m.chest >= peitoIdeal ? 'Na Meta ✓' : `Meta: ${peitoIdeal}cm` },
            { metric: 'bracos', label: 'BRAÇOS', value: m.armRight, unit: 'cm', ideal: bracoIdeal, status: m.armRight >= bracoIdeal ? 'onTarget' : 'close', statusLabel: m.armRight >= bracoIdeal ? 'Na Meta ✓' : `Meta: ${bracoIdeal}cm` },
            { metric: 'cintura', label: 'CINTURA', value: m.waist, unit: 'cm', ideal: cinturaIdeal, status: m.waist <= cinturaIdeal ? 'onTarget' : 'close', statusLabel: m.waist <= cinturaIdeal ? 'Na Meta ✓' : `Ideal: ${cinturaIdeal}cm` },
            { metric: 'coxas', label: 'COXAS', value: m.thighRight, unit: 'cm', ideal: coxaIdeal, status: m.thighRight >= coxaIdeal ? 'onTarget' : 'close', statusLabel: m.thighRight >= coxaIdeal ? 'Na Meta ✓' : `Meta: ${coxaIdeal}cm` },
            { metric: 'panturrilha', label: 'PANTURRILHA', value: m.calfRight, unit: 'cm', ideal: panturrilhaIdeal, status: m.calfRight >= panturrilhaIdeal ? 'onTarget' : 'close', statusLabel: m.calfRight >= panturrilhaIdeal ? 'Na Meta ✓' : `Meta: ${panturrilhaIdeal}cm` },
            { metric: 'ombros', label: 'OMBROS', value: m.shoulders, unit: 'cm', ideal: ombroIdeal, status: m.shoulders >= ombroIdeal ? 'onTarget' : 'close', statusLabel: m.shoulders >= ombroIdeal ? 'Na Meta ✓' : `Meta: ${ombroIdeal}cm` },
        ],

        heatmap: {
            mode: 'score',
            regions: {
                ombros: { name: 'Ombros', score: Math.round(currentResults.scores.proporcoes.detalhes.detalhes.find(d => d.proporcao === 'vTaper')?.percentualDoIdeal || 80), atual: m.shoulders, ideal: ombroIdeal, diferenca: Number(Math.abs(ombroIdeal - m.shoulders).toFixed(1)), status: m.shoulders >= ombroIdeal ? 'excellent' : 'good' },
                peitoral: { name: 'Peitoral', score: Math.round(currentResults.scores.proporcoes.detalhes.detalhes.find(d => d.proporcao === 'peitoral')?.percentualDoIdeal || 80), atual: m.chest, ideal: peitoIdeal, diferenca: Number(Math.abs(peitoIdeal - m.chest).toFixed(1)), status: m.chest >= peitoIdeal ? 'excellent' : 'good' },
                bracos: { name: 'Braços', score: Math.round(currentResults.scores.proporcoes.detalhes.detalhes.find(d => d.proporcao === 'braco')?.percentualDoIdeal || 80), atual: m.armRight, ideal: bracoIdeal, diferenca: Number(Math.abs(bracoIdeal - m.armRight).toFixed(1)), status: m.armRight >= bracoIdeal ? 'excellent' : 'good' },
                cintura: { name: 'Cintura', score: Math.round(currentResults.scores.proporcoes.detalhes.detalhes.find(d => d.proporcao === 'cintura')?.percentualDoIdeal || 80), atual: m.waist, ideal: cinturaIdeal, diferenca: Number(Math.abs(cinturaIdeal - m.waist).toFixed(1)), status: m.waist <= cinturaIdeal ? 'excellent' : 'good' },
                coxas: { name: 'Coxas', score: Math.round(currentResults.scores.proporcoes.detalhes.detalhes.find(d => d.proporcao === 'coxa')?.percentualDoIdeal || 80), atual: m.thighRight, ideal: coxaIdeal, diferenca: Number(Math.abs(coxaIdeal - m.thighRight).toFixed(1)), status: m.thighRight >= coxaIdeal ? 'excellent' : 'good' },
                panturrilhas: { name: 'Panturrilhas', score: Math.round(currentResults.scores.proporcoes.detalhes.detalhes.find(d => d.proporcao === 'panturrilha')?.percentualDoIdeal || 80), atual: m.calfRight, ideal: panturrilhaIdeal, diferenca: Number(Math.abs(panturrilhaIdeal - m.calfRight).toFixed(1)), status: m.calfRight >= panturrilhaIdeal ? 'excellent' : 'good' },
            }
        },

        symmetry: {
            overallSymmetry: currentResults.scores.simetria.valor,
            items: currentResults.scores.simetria.detalhes.detalhes?.map(d => ({
                muscle: d.grupo.charAt(0).toUpperCase() + d.grupo.slice(1),
                left: d.esquerdo,
                right: d.direito,
                diff: d.diferenca,
                diffPercent: d.diferencaPercent,
                status: d.status.toLowerCase() as any
            })) || []
        },

        gamification: {
            ...mockDashboardData.gamification,
            level: currentScore > 90 ? 8 : 6,
            currentXp: currentScore > 90 ? 800 : 120,
            nextLevelXp: 1000
        },

        insights: [
            {
                id: 'insight-1',
                type: 'tip',
                title: 'Análise do Coach',
                message: currentResults.insights.proximaMeta.acao,
                priority: 'medium',
                icon: 'bulb',
                isPro: true,
                createdAt: new Date()
            }
        ]
    };
};

export function useDashboard() {
    const [data, setData] = useState<DashboardResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const { profile } = useAthleteStore();
    const { personalAthletes } = useDataStore();

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setIsLoading(true);
                await new Promise(resolve => setTimeout(resolve, 600));

                const userEmail = profile?.email?.toLowerCase();
                const foundAthlete = personalAthletes.find(a =>
                    (profile && a.id === profile.id) ||
                    (userEmail && a.email.toLowerCase() === userEmail) ||
                    a.id === 'athlete-leonardo'
                );

                if (foundAthlete) {
                    setData(mapAthleteToDashboard(foundAthlete, profile?.birthDate));
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
    }, [profile, personalAthletes]);

    return { data, isLoading, error };
}
