import {
    DashboardResponse,
    RatioClassification,
    ScoreClassification,
    Grade,
    ProportionMethod,
    MetricCardData
} from '../types';

export const mockDashboardData: DashboardResponse = {
    user: {
        id: 'user-123',
        name: 'Leonardo Schweitzer',
        isPro: true,
        hasCompleteProfile: true,
    },
    latestMeasurement: null,
    lastMeasurementDate: new Date('2026-02-01'),
    daysSinceLastMeasurement: 6,

    currentScores: {
        method: 'golden_ratio' as ProportionMethod,
        scoreTotal: 82,
        ratio: 1.56,
        classification: 'AVANÇADO' as ScoreClassification,
        ratioClassification: 'ESTÉTICO' as RatioClassification,
        breakdown: {
            method: 'golden_ratio',
            totalScore: 82,
            proportions: [
                { id: 'ombros', nome: 'Ombros (V-Taper)', score: 92, maxScore: 100, percentage: 92, status: 'excellent', trend: 'up' },
                { id: 'peitoral', nome: 'Peitoral', score: 85, maxScore: 100, percentage: 85, status: 'good', trend: 'up' },
                { id: 'bracos', nome: 'Braços', score: 78, maxScore: 100, percentage: 78, status: 'attention', trend: 'stable' },
                { id: 'cintura', nome: 'Cintura', score: 90, maxScore: 100, percentage: 90, status: 'excellent', trend: 'down' }, // Down is good for waist usually
                { id: 'pernas', nome: 'Pernas', score: 65, maxScore: 100, percentage: 65, status: 'critical', trend: 'stable' },
            ]
        },
        ideals: {
            ombros: 125,
            peitoral: 110,
            bracos: 42,
            cintura: 78,
            coxas: 60,
            panturrilha: 40
        }
    },

    kpi: {
        ratio: {
            current: 1.56,
            target: 1.618,
            previous: 1.52,
            classification: 'ESTÉTICO' as RatioClassification,
            distanceToTarget: 0.058,
            evolution: 0.04
        },
        score: {
            total: 82,
            max: 100,
            change: 5,
            changePeriod: 'vs mês anterior',
            grades: {
                simetria: 'A+' as Grade,
                proporcao: 'B' as Grade,
                estetica: 'A' as Grade,
                evolucao: 'B+' as Grade
            },
            classification: 'AVANÇADO' as ScoreClassification,
            aiSummary: 'Físico atlético com excelente V-taper. Foco recomendado em membros inferiores.'
        }
    },

    evolution: {
        period: '30d',
        metrics: [
            { name: 'Ombros', previous: 118, current: 120, change: 2, changePercent: 1.7, status: 'up', isPositive: true, unit: 'cm' },
            { name: 'Cintura', previous: 84, current: 82, change: -2, changePercent: -2.4, status: 'down', isPositive: true, unit: 'cm' },
            { name: 'Braço', previous: 40, current: 41.5, change: 1.5, changePercent: 3.75, status: 'up', isPositive: true, unit: 'cm' },
            { name: 'Ratio', previous: 1.40, current: 1.56, change: 0.16, changePercent: 11.4, status: 'up', isPositive: true, unit: '' }
        ],
        scoreChange: 4,
        ratioChange: 0.16,
        overallTrend: 'improving'
    },

    heatmap: {
        mode: 'score',
        regions: {
            ombros: { name: 'Ombros', score: 95, atual: 120, ideal: 125, diferenca: 5, status: 'excellent' },
            peitoral: { name: 'Peitoral', score: 85, atual: 108, ideal: 110, diferenca: 2, status: 'good' },
            bracos: { name: 'Braços', score: 75, atual: 41.5, ideal: 43, diferenca: 1.5, status: 'attention' },
            cintura: { name: 'Cintura', score: 98, atual: 82, ideal: 80, diferenca: 2, status: 'excellent' },
            coxas: { name: 'Coxas', score: 60, atual: 58, ideal: 62, diferenca: 4, status: 'critical' },
            panturrilhas: { name: 'Panturrilhas', score: 70, atual: 38, ideal: 40, diferenca: 2, status: 'attention' },
        }
    },

    metricsGrid: [
        { metric: 'peitoral', label: 'PEITORAL', value: 108, unit: 'cm', ideal: 110, status: 'close', statusLabel: 'Faltam: 2cm', trend: { value: 2, period: '30d' } },
        { metric: 'bracos', label: 'BRAÇOS', value: 41.5, unit: 'cm', ideal: 43, status: 'far', statusLabel: 'Meta: 43cm', trend: { value: 1.5, period: '30d' } },
        { metric: 'cintura', label: 'CINTURA', value: 82, unit: 'cm', ideal: 80, status: 'onTarget', statusLabel: 'Na Meta ✓', trend: { value: -2, period: '30d' } },
        { metric: 'coxas', label: 'COXAS', value: 58, unit: 'cm', ideal: 62, status: 'far', statusLabel: 'Meta: 62cm', trend: { value: 1, period: '30d' } },
        { metric: 'panturrilha', label: 'PANTURRILHA', value: 38, unit: 'cm', ideal: 40, status: 'close', statusLabel: 'Faltam: 2cm', trend: { value: 0.5, period: '30d' } },
        { metric: 'ombros', label: 'OMBROS', value: 120, unit: 'cm', ideal: 125, status: 'onTarget', statusLabel: 'Na Meta ✓', trend: { value: 2, period: '30d' } }
    ],

    symmetry: {
        overallSymmetry: 87,
        items: [
            { muscle: 'Braço', left: 41.0, right: 41.5, diff: 0.5, diffPercent: 1.2, status: 'symmetric' },
            { muscle: 'Coxa', left: 58.0, right: 58.5, diff: 0.5, diffPercent: 0.8, status: 'symmetric' },
            { muscle: 'Panturrilha', left: 38.0, right: 37.5, diff: 0.5, diffPercent: 1.3, status: 'symmetric' }
        ]
    },

    gamification: {
        level: 5,
        currentXp: 2450,
        nextLevelXp: 3000,
        totalXp: 12450,
        streak: {
            current: 12,
            best: 21,
            isActive: true
        },
        upcomingAchievements: [
            { id: 'ratio-1.6', name: 'Ratio 1.60', icon: '⭐', progress: 80, requirement: 'Ratio 1.60' },
            { id: 'arm-45', name: 'Braço 45cm', icon: '💪', progress: 55, requirement: 'Braço 45cm' },
            { id: 'score-85', name: 'Score 85', icon: '🎯', progress: 90, requirement: 'Score 85' }
        ]
    },

    insights: [
        {
            id: 'insight-1',
            type: 'tip',
            title: 'Dica da Semana',
            message: 'Seu V-taper melhorou 8% este mês! Continue focando em deltóide lateral e mantenha o vacuum abdominal.',
            priority: 'medium',
            icon: 'bulb',
            isPro: true,
            createdAt: new Date()
        },
        {
            id: 'insight-2',
            type: 'warning',
            title: 'Atenção à Cintura',
            message: 'Sua cintura aumentou 1cm nas últimas 2 semanas. Revise sua dieta.',
            priority: 'high',
            icon: 'warning',
            isPro: false,
            createdAt: new Date(Date.now() - 86400000)
        }
    ],

    weeklyFocus: {
        muscleGroup: 'Ombros',
        reason: 'Para melhorar o V-Taper e alcançar o ratio ideal.',
        suggestedExercises: ['Elevação Lateral', 'Desenvolvimento com Halteres']
    }
};
