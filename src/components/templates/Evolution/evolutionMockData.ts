/**
 * Evolution — Mock data constants
 * Extracted from Evolution.tsx for readability.
 */
import type {
    PeriodKPIs,
    EvolutionInsightProps,
    AsymmetryData,
    AsymmetryHistory,
    AsymmetryRecommendation,
} from '@/components/molecules';
import type { MetricConfig } from '@/components/organisms';

export const MOCK_PERIOD = {
    label: '6 meses',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-06-30'),
};

export const MOCK_KPIS: PeriodKPIs = {
    ratio: {
        label: 'SHAPE-V RATIO',
        startValue: 1.49,
        endValue: 1.61,
        change: 0.12,
        changePercent: 8.05,
        status: 'positive',
    },
    score: {
        label: 'SCORE GERAL',
        startValue: 72,
        endValue: 80,
        change: 8,
        status: 'positive',
    },
    bestEvolution: {
        label: 'MELHOR EVOLUÇÃO',
        metric: 'Ombros',
        change: 5,
        changePercent: 4.3,
        status: 'positive',
    },
    attention: {
        label: 'ATENÇÃO',
        metric: 'Cintura',
        change: 1,
        changePercent: 1.2,
        status: 'warning',
    },
};

export const MOCK_INSIGHT: EvolutionInsightProps['insight'] = {
    summary: 'Excelente progresso nos últimos 6 meses! Seu V-taper melhorou significativamente e você está cada vez mais próximo do Golden Ratio.',
    highlights: {
        positive: [
            'Seu V-taper melhorou significativamente (+0.12 ratio)',
            'Ombros foram sua melhor evolução (+5cm, 4.3%)',
            'Score geral subiu de 72 para 80 pontos'
        ],
        attention: [
            'Cintura aumentou levemente (+1cm). Considere revisar a dieta ou aumentar atividade cardiovascular.'
        ]
    },
    projection: 'Se mantiver este ritmo, você atinge o Golden Ratio ideal (1.618) em aproximadamente 4 meses!',
    generatedAt: new Date()
};

export const MOCK_COMPARISON = {
    before: {
        date: new Date('2023-01-01'),
        label: 'JANEIRO 2023',
        measurements: { ombros: 115, cintura: 84, braco: 38, coxa: 58 },
        ratio: 1.37,
        score: 68
    },
    after: {
        date: new Date('2023-06-30'),
        label: 'JUNHO 2023',
        measurements: { ombros: 120, cintura: 82, braco: 42, coxa: 62 },
        ratio: 1.46,
        score: 80
    },
    summary: {
        periodLabel: '6 meses',
        biggestGain: { metric: 'Ombros', change: 5 },
        ratioImprovement: { change: 0.09, changePercent: 6.6 },
        scoreImprovement: { change: 12, changePercent: 17.6 }
    }
};

export const MOCK_ASYMMETRY_DATA: AsymmetryData[] = [
    { muscle: 'arm', muscleLabel: 'Braço', left: 41.0, right: 44.5, difference: 3.5, differencePercent: 8.5, dominantSide: 'right', status: 'asymmetric' },
    { muscle: 'thigh', muscleLabel: 'Coxa', left: 62.0, right: 63.0, difference: 1.0, differencePercent: 1.6, dominantSide: 'right', status: 'symmetric' },
    { muscle: 'calf', muscleLabel: 'Panturrilha', left: 38.5, right: 39.0, difference: 0.5, differencePercent: 1.3, dominantSide: 'right', status: 'symmetric' },
];

export const MOCK_ASYMMETRY_HISTORY: AsymmetryHistory[] = [
    { muscle: 'arm', date: new Date('2023-01-01'), dateLabel: 'Jan', differencePercent: 2.0 },
    { muscle: 'arm', date: new Date('2023-02-01'), dateLabel: 'Fev', differencePercent: 3.5 },
    { muscle: 'arm', date: new Date('2023-03-01'), dateLabel: 'Mar', differencePercent: 5.0 },
    { muscle: 'arm', date: new Date('2023-04-01'), dateLabel: 'Abr', differencePercent: 6.5 },
    { muscle: 'arm', date: new Date('2023-05-01'), dateLabel: 'Mai', differencePercent: 7.8 },
    { muscle: 'arm', date: new Date('2023-06-01'), dateLabel: 'Jun', differencePercent: 8.5 },
];

export const MOCK_ASYMMETRY_REC: AsymmetryRecommendation = {
    muscle: 'arm',
    severity: 'high',
    message: 'Assimetria significativa detectada nos braços (8.5%).',
    tips: [
        'Iniciar exercícios pelo lado esquerdo (mais fraco)',
        'Usar exercícios unilaterais: rosca concentrada, rosca scott unilateral',
        'Manter mesmo peso e reps para ambos os lados',
        'Considere 1-2 séries extras para o lado esquerdo'
    ]
};

export const AVAILABLE_METRICS: MetricConfig[] = [
    { id: 'ratio', label: 'Shape-V Ratio', color: '#00C9A7', unit: '', idealValue: 1.618, yAxisId: 'left' },
    { id: 'score', label: 'Score Geral', color: '#7C3AED', unit: 'pts', idealValue: 100, yAxisId: 'right' },
    { id: 'ombros', label: 'Ombros', color: '#3B82F6', unit: 'cm', yAxisId: 'right' },
    { id: 'cintura', label: 'Cintura', color: '#F59E0B', unit: 'cm', yAxisId: 'right' },
    { id: 'braco', label: 'Braço', color: '#EC4899', unit: 'cm', yAxisId: 'right' },
    { id: 'peitoral', label: 'Peitoral', color: '#8B5CF6', unit: 'cm', yAxisId: 'right' },
    { id: 'coxa', label: 'Coxa', color: '#06B6D4', unit: 'cm', yAxisId: 'right' },
    { id: 'panturrilha', label: 'Panturrilha', color: '#84CC16', unit: 'cm', yAxisId: 'right' },
];

export const MOCK_CHART_DATA = [
    { date: 'Jan', fullDate: new Date('2023-01-01'), ratio: 1.49, score: 72, ombros: 115, cintura: 84 },
    { date: 'Fev', fullDate: new Date('2023-02-01'), ratio: 1.51, score: 73, ombros: 116, cintura: 83.5 },
    { date: 'Mar', fullDate: new Date('2023-03-01'), ratio: 1.53, score: 75, ombros: 117, cintura: 83 },
    { date: 'Abr', fullDate: new Date('2023-04-01'), ratio: 1.56, score: 77, ombros: 118, cintura: 82.5 },
    { date: 'Mai', fullDate: new Date('2023-05-01'), ratio: 1.58, score: 79, ombros: 119, cintura: 82 },
    { date: 'Jun', fullDate: new Date('2023-06-01'), ratio: 1.61, score: 80, ombros: 120, cintura: 82 },
];

export const MOCK_WEIGHT_DATA = [
    { date: 'Jan', total: 90, lean: 75, fat: 15 },
    { date: 'Fev', total: 89.5, lean: 75.5, fat: 14 },
    { date: 'Mar', total: 89, lean: 76, fat: 13 },
    { date: 'Abr', total: 88.8, lean: 76.5, fat: 12.3 },
    { date: 'Mai', total: 88.5, lean: 77, fat: 11.5 },
    { date: 'Jun', total: 88.5, lean: 78, fat: 10.5 },
];
