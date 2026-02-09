import React, { useState } from 'react';
import { List, BarChart2, TrendingUp, Info, Scale, Activity, X, Ruler } from 'lucide-react';
import { GlassPanel } from '@/components/atoms';
import {
    PeriodSummary,
    PeriodKPIs,
    EvolutionInsight,
    EvolutionInsightProps,
    AsymmetrySection,
    AsymmetryData,
    AsymmetryHistory,
    AsymmetryRecommendation
} from '@/components/molecules';
import {
    AssessmentList,
    GoldenEvolutionChart,
    WeightChart,
    BodyFatChart,
    LinearMeasuresChart,
    MetricConfig
} from '@/components/organisms';

// --- MOCK DATA ---

const MOCK_PERIOD = {
    label: '6 meses',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-06-30'),
};

const MOCK_KPIS: PeriodKPIs = {
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

const MOCK_INSIGHT: EvolutionInsightProps['insight'] = {
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

const MOCK_COMPARISON = {
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

const MOCK_ASYMMETRY_DATA: AsymmetryData[] = [
    { muscle: 'arm', muscleLabel: 'Braço', left: 41.0, right: 44.5, difference: 3.5, differencePercent: 8.5, dominantSide: 'right', status: 'asymmetric' },
    { muscle: 'thigh', muscleLabel: 'Coxa', left: 62.0, right: 63.0, difference: 1.0, differencePercent: 1.6, dominantSide: 'right', status: 'symmetric' },
    { muscle: 'calf', muscleLabel: 'Panturrilha', left: 38.5, right: 39.0, difference: 0.5, differencePercent: 1.3, dominantSide: 'right', status: 'symmetric' },
];

const MOCK_ASYMMETRY_HISTORY: AsymmetryHistory[] = [
    { muscle: 'arm', date: new Date('2023-01-01'), dateLabel: 'Jan', differencePercent: 2.0 },
    { muscle: 'arm', date: new Date('2023-02-01'), dateLabel: 'Fev', differencePercent: 3.5 },
    { muscle: 'arm', date: new Date('2023-03-01'), dateLabel: 'Mar', differencePercent: 5.0 },
    { muscle: 'arm', date: new Date('2023-04-01'), dateLabel: 'Abr', differencePercent: 6.5 },
    { muscle: 'arm', date: new Date('2023-05-01'), dateLabel: 'Mai', differencePercent: 7.8 },
    { muscle: 'arm', date: new Date('2023-06-01'), dateLabel: 'Jun', differencePercent: 8.5 },
];

const MOCK_ASYMMETRY_REC: AsymmetryRecommendation = {
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

const AVAILABLE_METRICS: MetricConfig[] = [
    { id: 'ratio', label: 'Shape-V Ratio', color: '#00C9A7', unit: '', idealValue: 1.618, yAxisId: 'left' },
    { id: 'score', label: 'Score Geral', color: '#7C3AED', unit: 'pts', idealValue: 100, yAxisId: 'right' },
    { id: 'ombros', label: 'Ombros', color: '#3B82F6', unit: 'cm', yAxisId: 'right' },
    { id: 'cintura', label: 'Cintura', color: '#F59E0B', unit: 'cm', yAxisId: 'right' },
    { id: 'braco', label: 'Braço', color: '#EC4899', unit: 'cm', yAxisId: 'right' },
    { id: 'peitoral', label: 'Peitoral', color: '#8B5CF6', unit: 'cm', yAxisId: 'right' },
    { id: 'coxa', label: 'Coxa', color: '#06B6D4', unit: 'cm', yAxisId: 'right' },
    { id: 'panturrilha', label: 'Panturrilha', color: '#84CC16', unit: 'cm', yAxisId: 'right' },
];

const MOCK_CHART_DATA = [
    { date: 'Jan', fullDate: new Date('2023-01-01'), ratio: 1.49, score: 72, ombros: 115, cintura: 84 },
    { date: 'Fev', fullDate: new Date('2023-02-01'), ratio: 1.51, score: 73, ombros: 116, cintura: 83.5 },
    { date: 'Mar', fullDate: new Date('2023-03-01'), ratio: 1.53, score: 75, ombros: 117, cintura: 83 },
    { date: 'Abr', fullDate: new Date('2023-04-01'), ratio: 1.56, score: 77, ombros: 118, cintura: 82.5 },
    { date: 'Mai', fullDate: new Date('2023-05-01'), ratio: 1.58, score: 79, ombros: 119, cintura: 82 },
    { date: 'Jun', fullDate: new Date('2023-06-01'), ratio: 1.61, score: 80, ombros: 120, cintura: 82 },
];

const MOCK_WEIGHT_DATA = [
    { date: 'Jan', total: 90, lean: 75, fat: 15 },
    { date: 'Fev', total: 89.5, lean: 75.5, fat: 14 },
    { date: 'Mar', total: 89, lean: 76, fat: 13 },
    { date: 'Abr', total: 88.8, lean: 76.5, fat: 12.3 },
    { date: 'Mai', total: 88.5, lean: 77, fat: 11.5 },
    { date: 'Jun', total: 88.5, lean: 78, fat: 10.5 },
];


import { MeasurementHistory } from '@/mocks/personal';
import { processEvolutionHistory } from '@/services/calculations';

interface EvolutionProps {
    hideHeader?: boolean;
    gender?: 'MALE' | 'FEMALE';
    assessments?: MeasurementHistory[];
}

export const Evolution: React.FC<EvolutionProps> = ({
    hideHeader = false,
    gender = 'MALE',
    assessments
}) => {
    const isMale = gender === 'MALE';

    // --- DYNAMIC DATA PROCESSING ---
    const evolutionData = React.useMemo(() => {
        if (!assessments || assessments.length === 0) return null;
        return processEvolutionHistory(assessments, (gender || 'MALE') as 'MALE' | 'FEMALE');
    }, [assessments, gender]);

    // --- DYNAMIC METRICS CONFIG ---
    const AVAILABLE_METRICS = React.useMemo(() => {
        const baseMetrics: MetricConfig[] = [
            { id: 'ratio', label: isMale ? 'Proporção Shape-V' : 'Razão Cintura-Quadril', color: '#00C9A7', unit: '', idealValue: isMale ? 1.618 : 0.70, yAxisId: 'left' },
            { id: 'score', label: 'Score Geral', color: '#7C3AED', unit: 'pts', idealValue: 100, yAxisId: 'right' },
            { id: 'ombros', label: 'Ombros', color: '#3B82F6', unit: 'cm', yAxisId: 'right' },
            { id: 'cintura', label: 'Cintura', color: '#F59E0B', unit: 'cm', yAxisId: 'right' },
            { id: 'braco', label: 'Braço', color: '#EC4899', unit: 'cm', yAxisId: 'right' },
            { id: 'peitoral', label: 'Peitoral', color: '#8B5CF6', unit: 'cm', yAxisId: 'right' },
            { id: 'coxa', label: 'Coxa', color: '#06B6D4', unit: 'cm', yAxisId: 'right' },
            { id: 'panturrilha', label: 'Panturrilha', color: '#84CC16', unit: 'cm', yAxisId: 'right' },
        ];

        if (!isMale) {
            // Adjust some for female
            const quadrilIdx = baseMetrics.findIndex(m => m.id === 'ombros');
            if (quadrilIdx > -1) {
                baseMetrics[quadrilIdx] = { id: 'quadril', label: 'Quadril', color: '#8B5CF6', unit: 'cm', yAxisId: 'right' };
            }
        }

        if (!evolutionData) return baseMetrics;

        const propColors: Record<string, string> = {
            vTaper: '#00C9A7',
            peitoral: '#8B5CF6',
            braco: '#EC4899',
            antebraco: '#F59E0B',
            triade: '#3B82F6',
            cintura: '#EF4444',
            coxa: '#06B6D4',
            coxaPanturrilha: '#84CC16',
            panturrilha: '#7C3AED',
            costas: '#6366F1'
        };

        const propLabels: Record<string, string> = {
            vTaper: 'Ratio V-Taper',
            peitoral: 'Peitoral / Cintura',
            braco: 'Braço / Punho',
            antebraco: 'Antebraço / Punho',
            triade: 'Tríade (B/A/P)',
            cintura: 'Cintura / Abdômen',
            coxa: 'Coxa / Joelho',
            coxaPanturrilha: 'C. Panturrilha / Joelho',
            panturrilha: 'Panturrilha / Tornozelo',
            costas: 'Costas / Cintura'
        };

        const firstPoint = evolutionData.points[0];
        const additionalProps: MetricConfig[] = [];

        firstPoint?.output?.scores?.proporcoes?.detalhes?.detalhes?.forEach(d => {
            // Avoid duplicates with 'ratio' if it's the same
            if (d.proporcao === 'vTaper' && isMale) return;

            additionalProps.push({
                id: d.proporcao,
                label: propLabels[d.proporcao] || d.proporcao,
                color: propColors[d.proporcao] || '#6B7280',
                unit: d.proporcao === 'triade' ? '%' : '',
                yAxisId: d.proporcao === 'triade' ? 'right' : 'left'
            });
        });

        return [...baseMetrics, ...additionalProps];
    }, [evolutionData, isMale]);

    // --- DATA TRANSFORMATION FOR CHARTS ---
    const chartData = React.useMemo(() => {
        if (!evolutionData) return MOCK_CHART_DATA;

        return (evolutionData?.points || []).map(point => {
            const m = point.measurements;
            const res = point.output;
            const date = new Date(point.date);
            const isMultiYear = evolutionData?.summary.period.end.getFullYear() !== evolutionData?.summary.period.start.getFullYear();
            const dateLabel = date.toLocaleDateString('pt-BR', {
                month: 'short',
                year: isMultiYear ? '2-digit' : undefined
            }).replace('.', '');

            const chartPoint: any = {
                date: dateLabel,
                fullDate: date,
                ombros: m?.shoulders || 0,
                cintura: m?.waist || 0,
                quadril: m?.hips || 0,
                braco: m ? (m.armRight + m.armLeft) / 2 : 0,
                coxa: m ? (m.thighRight + m.thighLeft) / 2 : 0,
                panturrilha: m ? (m.calfRight + m.calfLeft) / 2 : 0,
                peitoral: m?.chest || 0,
                score: res?.avaliacaoGeral || 0,
            };

            // Add all ratios from proporcoes details
            res?.scores?.proporcoes?.detalhes?.detalhes?.forEach(d => {
                chartPoint[d.proporcao] = Number((d.valor || 0).toFixed(2));
            });

            if (isMale) {
                chartPoint.ratio = m ? Number((m.shoulders / Math.max(1, m.waist)).toFixed(2)) : 0;
            } else {
                chartPoint.ratio = m ? Number((m.waist / Math.max(1, (m.hips || m.waist))).toFixed(2)) : 0;
            }

            return chartPoint;
        });
    }, [evolutionData, isMale]);

    const weightData = React.useMemo(() => {
        if (!evolutionData) return MOCK_WEIGHT_DATA;

        return (evolutionData?.points || []).map(point => {
            const date = new Date(point.date);
            const comp = point.output?.scores?.composicao?.detalhes;
            const isMultiYear = evolutionData?.summary?.period?.end?.getFullYear() !== evolutionData?.summary?.period?.start?.getFullYear();
            const dateLabel = date.toLocaleDateString('pt-BR', {
                month: 'short',
                year: isMultiYear ? '2-digit' : undefined
            }).replace('.', '');

            return {
                date: dateLabel,
                total: Number((point.measurements?.weight || 0).toFixed(1)),
                lean: Number((comp?.pesoMagro || 0).toFixed(2)),
                fat: Number((comp?.pesoGordo || 0).toFixed(2))
            };
        });
    }, [evolutionData]);


    // --- KPIs & SUMMARY CALCULATION ---
    const currentPeriod = React.useMemo(() => {
        if (!evolutionData) return MOCK_PERIOD;
        return {
            label: evolutionData.summary.period.label,
            startDate: evolutionData.summary.period.start,
            endDate: evolutionData.summary.period.end,
        };
    }, [evolutionData]);

    const currentKPIs = React.useMemo(() => {
        if (!evolutionData) return MOCK_KPIS;
        const s = evolutionData.summary;

        return {
            ratio: {
                label: s.kpis.ratio.label,
                startValue: Number(s.kpis.ratio.startRatio.toFixed(2)),
                endValue: Number(s.kpis.ratio.endRatio.toFixed(2)),
                change: Number((s.kpis.ratio.endRatio - s.kpis.ratio.startRatio).toFixed(2)),
                changePercent: Number(((s.kpis.ratio.endRatio / s.kpis.ratio.startRatio - 1) * 100).toFixed(1)),
                status: s.kpis.ratio.endRatio >= s.kpis.ratio.startRatio && isMale ? 'positive' : (!isMale && s.kpis.ratio.endRatio <= s.kpis.ratio.startRatio ? 'positive' : 'warning'),
            },
            score: {
                label: s.kpis.score.label,
                startValue: s.kpis.score.startValue,
                endValue: s.kpis.score.endValue,
                change: Number(s.kpis.score.change.toFixed(1)),
                status: s.kpis.score.status as any,
            },
            bestEvolution: {
                label: 'MELHOR EVOLUÇÃO',
                metric: (s?.bestEvolution?.metric || '').charAt(0).toUpperCase() + (s?.bestEvolution?.metric || '').slice(1),
                change: Number((s?.bestEvolution?.change || 0).toFixed(1)),
                changePercent: Number((s?.bestEvolution?.change || 0).toFixed(1)),
                status: 'positive' as const,
            },
            attention: {
                label: 'ATENÇÃO',
                metric: (s?.attentionEvolution?.metric || '').charAt(0).toUpperCase() + (s?.attentionEvolution?.metric || '').slice(1),
                change: Number((s?.attentionEvolution?.change || 0).toFixed(1)),
                changePercent: Number((s?.attentionEvolution?.change || 0).toFixed(1)),
                status: (s?.attentionEvolution?.change || 0) < 0 ? 'negative' as const : 'warning' as const,
            },
        };
    }, [evolutionData, isMale]);

    // --- ASYMMETRY PROCESSING ---
    const asymmetryData = React.useMemo(() => {
        if (!evolutionData) return MOCK_ASYMMETRY_DATA;
        const lastPoint = evolutionData.points[evolutionData.points.length - 1];
        const ass = lastPoint?.output?.scores?.simetria?.detalhes?.detalhes || [];

        return ass.map(a => ({
            muscle: a.grupo,
            muscleLabel: a.grupo.charAt(0).toUpperCase() + a.grupo.slice(1),
            left: a.esquerdo || 0,
            right: a.direito || 0,
            difference: a.diferenca || 0,
            differencePercent: a.diferencaPercent || 0,
            dominantSide: (a.ladoDominante || 'IGUAL').toLowerCase() as any,
            status: (a.status || '').toLowerCase().includes('simetrico') ? 'symmetric' as const : 'asymmetric' as const
        }));
    }, [evolutionData]);

    const asymmetryHistory = React.useMemo(() => {
        if (!evolutionData) return MOCK_ASYMMETRY_HISTORY;

        const history: any[] = [];
        (evolutionData?.points || []).forEach(point => {
            const date = new Date(point.date);
            const ass = point.output?.scores?.simetria?.detalhes?.detalhes || [];

            ass.forEach(a => {
                history.push({
                    muscle: a.grupo,
                    date: date,
                    dateLabel: date.toLocaleDateString('pt-BR', { month: 'short' }),
                    differencePercent: a.diferencaPercent || 0
                });
            });
        });
        return history;
    }, [evolutionData]);

    const asymmetryRecommendation = React.useMemo(() => {
        if (!evolutionData) return MOCK_ASYMMETRY_REC;
        const lastPoint = evolutionData.points[evolutionData.points.length - 1];
        const worst = lastPoint?.output?.scores?.simetria?.detalhes?.assimetriasSignificativas?.[0];

        if (!worst) return null;

        return {
            muscle: worst.grupo,
            severity: (worst.diferencaPercent || 0) > 8 ? 'high' : 'moderate' as any,
            message: `Assimetria detectada: ${worst.grupo} (${(worst.diferencaPercent || 0).toFixed(1)}%).`,
            tips: [
                `Iniciar exercícios pelo lado ${(worst.ladoDominante || 'DIREITO') === 'DIREITO' ? 'esquerdo' : 'direito'} (mais fraco)`,
                'Usar exercícios unilaterais para equilibrar a força',
                'Manter mesmo peso e reps para ambos os lados',
                'Focar na conexão mente-músculo do lado deficitário'
            ]
        };
    }, [evolutionData]);

    const linearEvolutionData = React.useMemo(() => {
        const points = evolutionData?.points || [];
        if (!evolutionData || points.length < 2) return null;

        const first = points[0].measurements;
        const last = points[points.length - 1].measurements;
        const anterior = points.length >= 3 ? points[points.length - 2].measurements : null;

        const mapMeasure = (label: string, key: keyof typeof first | 'quadril') => {
            const getVal = (m: typeof first) => {
                if (key === 'quadril') return (m as any)?.hips || m?.waist || 0;
                return (m as any)[key] || 0;
            };

            return {
                name: label,
                inicio: getVal(first),
                anterior: anterior ? getVal(anterior) : undefined,
                atual: getVal(last)
            };
        };

        const upper = [
            mapMeasure('Ombros', 'shoulders'),
            mapMeasure('Peitoral', 'chest'),
            {
                name: 'Braço (D)',
                inicio: first?.armRight || 0,
                anterior: anterior?.armRight,
                atual: last?.armRight || 0
            },
            {
                name: 'Braço (E)',
                inicio: first?.armLeft || 0,
                anterior: anterior?.armLeft,
                atual: last?.armLeft || 0
            },
        ];

        const lower = [
            mapMeasure('Cintura', 'waist'),
            mapMeasure('Abdom.', 'abdomen'),
            mapMeasure('Quadril', 'hips' as any),
            {
                name: 'Coxa (D)',
                inicio: first?.thighRight || 0,
                anterior: anterior?.thighRight,
                atual: last?.thighRight || 0
            },
            {
                name: 'Coxa (E)',
                inicio: first?.thighLeft || 0,
                anterior: anterior?.thighLeft,
                atual: last?.thighLeft || 0
            },
        ];

        return { upper, lower };
    }, [evolutionData]);

    // --- VISUAL COMPARISON ---
    const visualComparison = React.useMemo(() => {
        if (!evolutionData || (evolutionData?.points || []).length < 2) return MOCK_COMPARISON;
        const s = evolutionData.summary;
        const first = evolutionData.points[0];
        const last = evolutionData.points[evolutionData.points.length - 1];

        return {
            before: {
                date: new Date(first.date),
                label: new Date(first.date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase(),
                measurements: {
                    ombros: first.measurements?.shoulders || 0,
                    cintura: first.measurements?.waist || 0,
                    braco: first.measurements ? (first.measurements.armRight + first.measurements.armLeft) / 2 : 0,
                    coxa: first.measurements ? (first.measurements.thighRight + first.measurements.thighLeft) / 2 : 0
                },
                ratio: first.measurements ? Number((first.measurements.shoulders / Math.max(1, first.measurements.waist)).toFixed(2)) : 0,
                score: first.output?.avaliacaoGeral || 0
            },
            after: {
                date: new Date(last.date),
                label: new Date(last.date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase(),
                measurements: {
                    ombros: last.measurements?.shoulders || 0,
                    cintura: last.measurements?.waist || 0,
                    braco: last.measurements ? (last.measurements.armRight + last.measurements.armLeft) / 2 : 0,
                    coxa: last.measurements ? (last.measurements.thighRight + last.measurements.thighLeft) / 2 : 0
                },
                ratio: last.measurements ? Number((last.measurements.shoulders / Math.max(1, last.measurements.waist)).toFixed(2)) : 0,
                score: last.output?.avaliacaoGeral || 0
            },
            summary: {
                periodLabel: evolutionData?.summary?.period?.label || '',
                biggestGain: {
                    metric: (s?.bestEvolution?.metric || '').charAt(0).toUpperCase() + (s?.bestEvolution?.metric || '').slice(1),
                    change: Number((s?.bestEvolution?.change || 0).toFixed(1))
                },
                ratioImprovement: {
                    change: (last.output?.scores?.proporcoes?.valor || 0) - (first.output?.scores?.proporcoes?.valor || 0),
                    changePercent: (first.output?.scores?.proporcoes?.valor || 0) > 0
                        ? ((last.output?.scores?.proporcoes?.valor || 0) / (first.output?.scores?.proporcoes?.valor || 0) - 1) * 100
                        : 0
                },
                scoreImprovement: {
                    change: (last.output?.avaliacaoGeral || 0) - (first.output?.avaliacaoGeral || 0),
                    changePercent: (first.output?.avaliacaoGeral || 0) > 0
                        ? ((last.output?.avaliacaoGeral || 0) / (first.output?.avaliacaoGeral || 0) - 1) * 100
                        : 0
                }
            }
        };
    }, [evolutionData]);

    // --- AI INSIGHT ---
    const aiInsight = React.useMemo(() => {
        if (!evolutionData) return MOCK_INSIGHT;
        const s = evolutionData.summary;
        const lastOutput = evolutionData.points[evolutionData.points.length - 1].output;
        const firstOutput = evolutionData.points[0].output;

        const scoreChange = (lastOutput?.avaliacaoGeral || 0) - (firstOutput?.avaliacaoGeral || 0);

        return {
            summary: scoreChange >= 0
                ? `Evolução positiva detectada! Seu score subiu ${scoreChange.toFixed(1)} pontos desde a primeira avaliação.`
                : `Seu progresso estabilizou. Vamos ajustar a estratégia para retomar a evolução.`,
            highlights: {
                positive: [
                    `Sua melhor evolução foi em ${s?.bestEvolution?.metric || 'geral'}`,
                    `Seu score atual é ${lastOutput?.avaliacaoGeral || 0} (${lastOutput?.classificacao?.nivel || 'N/A'})`,
                    `Seu ponto forte atual: ${lastOutput?.insights?.pontoForte?.categoria || 'N/A'}`
                ],
                attention: [
                    lastOutput?.insights?.pontoFraco?.mensagem || 'Continue focado no treino',
                    `Foco na próxima meta: ${lastOutput?.insights?.proximaMeta?.acao || 'Manter consistência'}`
                ]
            },
            projection: `Se mantiver o ritmo de ${s?.bestEvolution?.metric || 'treino'}, você alcançará o próximo nível em breve!`,
            generatedAt: new Date()
        };
    }, [evolutionData]);

    const [period, setPeriod] = useState('6M');
    const [viewMode, setViewMode] = useState<'charts' | 'list'>('charts');

    // Chart State
    const [selectedMetrics, setSelectedMetrics] = useState<MetricConfig[]>([AVAILABLE_METRICS[0]]);

    // Reset selected metrics when gender changes to ensure they are valid for the current gender
    React.useEffect(() => {
        // Default to just the main ratio metric for a clean start as requested
        setSelectedMetrics([AVAILABLE_METRICS[0]]);
    }, [gender]);

    // Weight State
    const [selectedWeightMetric, setSelectedWeightMetric] = useState('all');
    const [selectedBfMethod, setSelectedBfMethod] = useState('marinha');

    const bfData = React.useMemo(() => {
        if (!evolutionData) return null;

        return (evolutionData?.points || []).map(point => {
            const date = new Date(point.date);
            const isMultiYear = evolutionData?.summary.period.end.getFullYear() !== evolutionData?.summary.period.start.getFullYear();
            const dateLabel = date.toLocaleDateString('pt-BR', {
                month: 'short',
                year: isMultiYear ? '2-digit' : undefined
            }).replace('.', '');

            let valor = 0;
            const m = point.measurements;

            if (selectedBfMethod === 'marinha' && m) {
                let log1, log2, log3; // declarations for explicit clarity if needed, but direct calc is fine
                // Calculate Navy Method on the fly
                if (isMale) {
                    // 495 / (1.0324 - 0.19077(log10(waist-neck)) + 0.15456(log10(height))) - 450
                    if (m.waist - m.neck > 0) {
                        valor = 495 / (1.0324 - 0.19077 * Math.log10(m.waist - m.neck) + 0.15456 * Math.log10(m.height)) - 450;
                    }
                } else {
                    const hips = (m as any).hips || m.waist; // Fallback
                    if (m.waist + hips - m.neck > 0) {
                        valor = 495 / (1.29579 - 0.35004 * Math.log10(m.waist + hips - m.neck) + 0.22100 * Math.log10(m.height)) - 450;
                    }
                }
                // Sanity check
                if (valor < 3) valor = 3;
                if (valor > 60) valor = 60;
            } else {
                // Return stored value (assumed Pollock or whatever was saved)
                const comp = point.output?.scores?.composicao?.detalhes;
                valor = comp?.detalhes?.bf?.valor || 0;
            }

            return {
                name: dateLabel,
                v: Number(valor.toFixed(2))
            };
        });
    }, [evolutionData, selectedBfMethod, isMale]);

    // Helper functions for metric selection
    const handleAddMetric = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const metricId = e.target.value;
        if (!metricId) return;

        const metric = AVAILABLE_METRICS.find(m => m.id === metricId);
        if (metric && !selectedMetrics.find(m => m.id === metric.id)) {
            setSelectedMetrics([...selectedMetrics, metric]);
        }
        // Reset select
        e.target.value = "";
    };

    const handleRemoveMetric = (metricId: string) => {
        // Prevent removing the last metric if you want at least one
        if (selectedMetrics.length > 1) {
            setSelectedMetrics(selectedMetrics.filter(m => m.id !== metricId));
        }
    };

    const [isMetricMenuOpen, setIsMetricMenuOpen] = useState(false);

    return (
        <div className={`flex-1 ${hideHeader ? 'p-0' : 'p-4 md:p-8 pb-20'}`}>
            <div className="max-w-7xl mx-auto flex flex-col gap-6">

                {!hideHeader && (
                    <>
                        {/* Header Section */}
                        <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
                            <div className="flex flex-col animate-fade-in-up">
                                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">EVOLUÇÃO</h2>
                                <p className="text-gray-400 mt-2 font-light max-w-2xl">
                                    Análise detalhada do progresso físico e simetria.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 mb-1">
                                {/* Toggle View */}
                                <div className="flex bg-[#131B2C] p-1 rounded-lg border border-white/10 shadow-lg">
                                    <button
                                        onClick={() => setViewMode('charts')}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-all ${viewMode === 'charts'
                                            ? 'bg-primary text-[#0A0F1C] shadow-sm hover:brightness-110'
                                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <BarChart2 size={14} /> GRÁFICOS
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-all ${viewMode === 'list'
                                            ? 'bg-primary text-[#0A0F1C] shadow-sm hover:brightness-110'
                                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <List size={14} /> LISTA
                                    </button>
                                </div>

                                {/* Time Filter */}
                                <div className="flex bg-[#131B2C] p-1 rounded-lg border border-white/10 shadow-lg">
                                    {['3M', '6M', '1A', 'TOTAL'].map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setPeriod(p)}
                                            className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all ${period === p ? 'bg-[#1E293B] text-white border border-white/10 shadow-sm' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="h-px w-full bg-white/10" />
                    </>
                )}

                {hideHeader && (
                    <div className="flex justify-end items-center gap-4 mb-1">
                        {/* Toggle View */}
                        <div className="flex bg-[#131B2C] p-1 rounded-lg border border-white/10 shadow-lg">
                            <button
                                onClick={() => setViewMode('charts')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-all ${viewMode === 'charts'
                                    ? 'bg-primary text-[#0A0F1C] shadow-sm hover:brightness-110'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <BarChart2 size={14} /> GRÁFICOS
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-all ${viewMode === 'list'
                                    ? 'bg-primary text-[#0A0F1C] shadow-sm hover:brightness-110'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <List size={14} /> LISTA
                            </button>
                        </div>

                        {/* Time Filter */}
                        <div className="flex bg-[#131B2C] p-1 rounded-lg border border-white/10 shadow-lg">
                            {['3M', '6M', '1A', 'TOTAL'].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all ${period === p ? 'bg-[#1E293B] text-white border border-white/10 shadow-sm' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {viewMode === 'charts' ? (
                    <>
                        {/* 1. SECTION: KPIs Summary */}
                        <PeriodSummary period={currentPeriod} kpis={currentKPIs} />

                        <div className="h-px w-full bg-white/5 my-2" />

                        {/* 2. SECTION: Evolution Charts */}
                        <div className="flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <div className="flex items-center gap-3 ml-1">
                                <div className="p-2 bg-[#131B2C] rounded-xl text-primary border border-white/10 shadow-lg">
                                    <TrendingUp size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Arquitetura Estética</h3>
                                    <p className="text-[10px] text-gray-500 font-medium">Convergência para o ideal das proporções clássicas</p>
                                </div>
                            </div>

                            <GlassPanel className="p-6 md:p-8 rounded-2xl relative overflow-hidden min-h-[450px] flex flex-col">
                                <div className="flex flex-wrap justify-between items-start mb-6 gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            EVOLUÇÃO ÁUREA
                                            <Info size={14} className="text-gray-500" />
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {selectedMetrics.map(m => m.label).join(' vs ')}
                                        </p>
                                    </div>

                                    {/* Metric Selector - Dropdown Style */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsMetricMenuOpen(!isMetricMenuOpen)}
                                            className="bg-[#131B2C] border border-white/10 text-white text-[10px] font-bold py-2 px-4 rounded-xl flex items-center gap-2 hover:bg-white/5 transition-all shadow-lg"
                                        >
                                            <Activity size={12} className="text-primary" />
                                            COMPARAR MÉTRICAS
                                            <span className="ml-1 opacity-50">({selectedMetrics.length})</span>
                                        </button>

                                        {isMetricMenuOpen && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => setIsMetricMenuOpen(false)}
                                                />
                                                <div className="absolute right-0 mt-2 w-64 bg-[#131B2C] border border-white/10 rounded-2xl shadow-2xl z-50 py-2 overflow-hidden animate-fade-in origin-top-right">
                                                    <div className="px-4 py-2 border-b border-white/5 mb-2">
                                                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Métricas Disponíveis</h4>
                                                    </div>
                                                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                                        {AVAILABLE_METRICS.map(metric => {
                                                            const isSelected = selectedMetrics.some(m => m.id === metric.id);
                                                            return (
                                                                <button
                                                                    key={metric.id}
                                                                    onClick={() => {
                                                                        if (isSelected) {
                                                                            handleRemoveMetric(metric.id);
                                                                        } else {
                                                                            setSelectedMetrics([...selectedMetrics, metric]);
                                                                        }
                                                                    }}
                                                                    className={`w-full flex items-center justify-between px-4 py-2.5 text-xs transition-colors hover:bg-white/5 ${isSelected ? 'text-primary' : 'text-gray-400'}`}
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <div
                                                                            className="w-2 h-2 rounded-full"
                                                                            style={{ backgroundColor: metric.color }}
                                                                        />
                                                                        <span className="font-medium text-left">{metric.label}</span>
                                                                    </div>
                                                                    {isSelected && <Activity size={12} />}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Active Tags - Compact */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {selectedMetrics.map(metric => (
                                        <div
                                            key={metric.id}
                                            className="flex items-center gap-2 pl-2.5 pr-1.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-bold text-white group"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: metric.color }}></span>
                                            {metric.label}
                                            {selectedMetrics.length > 1 && (
                                                <button
                                                    onClick={() => handleRemoveMetric(metric.id)}
                                                    className="p-0.5 hover:bg-white/10 rounded text-gray-400 hover:text-white"
                                                >
                                                    <X size={10} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="w-full h-[400px] mt-4">
                                    <GoldenEvolutionChart
                                        data={chartData}
                                        selectedMetrics={selectedMetrics}
                                    />
                                </div>
                            </GlassPanel>
                        </div>

                        {/* 3. SECTION: AI Insight */}
                        <EvolutionInsight insight={aiInsight} />

                        <div className="h-px w-full bg-white/5 my-2" />

                        {/* 4. SECTION: Body Composition */}
                        <div className="flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="flex items-center gap-3 ml-1">
                                <div className="p-2 bg-[#131B2C] rounded-xl text-secondary border border-white/10 shadow-lg">
                                    <Scale size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Composição Corporal</h3>
                                    <p className="text-[10px] text-gray-500 font-medium">Análise de peso, massa magra e percentual de gordura</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 leading-relaxed">
                                {/* Weight Evolution */}
                                <GlassPanel className="p-6 rounded-2xl min-h-[300px]">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">EVOLUÇÃO PESO</h3>
                                        <div className="relative inline-block">
                                            <select
                                                value={selectedWeightMetric}
                                                onChange={(e) => setSelectedWeightMetric(e.target.value)}
                                                className="appearance-none bg-[#0A0F1C] border border-white/10 text-white text-xs font-bold py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:border-primary/50 cursor-pointer shadow-lg hover:bg-white/5 transition-colors"
                                            >
                                                <option value="all">Todos</option>
                                                <option value="total">Peso Total</option>
                                                <option value="lean">Peso Magro</option>
                                                <option value="fat">Peso Gordo</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="w-full h-[200px] mt-4">
                                        <WeightChart data={weightData} selectedMetric={selectedWeightMetric as any} />
                                    </div>

                                    <div className="flex gap-3 justify-center mt-6">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full border border-white bg-transparent"></span>
                                            <span className="text-[10px] text-gray-400 font-bold">Total</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                                            <span className="text-[10px] text-gray-400 font-bold">Magro</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-secondary"></span>
                                            <span className="text-[10px] text-gray-400 font-bold">Gordo</span>
                                        </div>
                                    </div>
                                </GlassPanel>

                                {/* Body Fat */}
                                <GlassPanel className="p-6 rounded-2xl flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">GORDURA CORPORAL %</h3>
                                        <div className="relative inline-block">
                                            <select
                                                value={selectedBfMethod}
                                                onChange={(e) => setSelectedBfMethod(e.target.value)}
                                                className="appearance-none bg-[#0A0F1C] border border-white/10 text-white text-[10px] font-bold py-1.5 pl-2 pr-6 rounded focus:outline-none focus:border-primary/50 cursor-pointer shadow-lg hover:bg-white/5 transition-colors uppercase"
                                            >
                                                <option value="marinha">Marinha</option>
                                                <option value="pollock">Pollock</option>
                                            </select>
                                        </div>
                                    </div>
                                    <BodyFatChart method={selectedBfMethod} data={bfData || undefined} />
                                </GlassPanel>
                            </div>
                        </div>

                        <div className="h-px w-full bg-white/5 my-2" />

                        {/* 5. SECTION: Asymmetry */}
                        <AsymmetrySection
                            data={asymmetryData}
                            history={asymmetryHistory}
                            recommendation={asymmetryRecommendation || MOCK_ASYMMETRY_REC}
                        />

                        {/* 6. SECTION: Linear Measures Evolution */}
                        <div className="flex flex-col gap-6 animate-fade-in-up mt-4" style={{ animationDelay: '0.4s' }}>
                            <div className="flex items-center gap-3 ml-1">
                                <div className="p-2 bg-[#131B2C] rounded-xl text-primary border border-white/10 shadow-lg">
                                    <Ruler size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Evolução das Medidas</h3>
                                    <p className="text-[10px] text-gray-500 font-medium">Comparativo linear entre a primeira e última avaliação (cm)</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
                                <GlassPanel className="p-6 rounded-2xl min-h-[350px]">
                                    {linearEvolutionData ? (
                                        <LinearMeasuresChart
                                            title="Tronco e Membros Superiores"
                                            data={linearEvolutionData.upper}
                                        />
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-gray-500 text-xs italic">
                                            Dados insuficientes para comparativo.
                                        </div>
                                    )}
                                </GlassPanel>

                                <GlassPanel className="p-6 rounded-2xl min-h-[350px]">
                                    {linearEvolutionData ? (
                                        <LinearMeasuresChart
                                            title="Cintura e Membros Inferiores"
                                            data={linearEvolutionData.lower}
                                        />
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-gray-500 text-xs italic">
                                            Dados insuficientes para comparativo.
                                        </div>
                                    )}
                                </GlassPanel>
                            </div>
                        </div>

                    </>
                ) : (
                    <AssessmentList
                        assessments={assessments}
                        onConsult={undefined}
                    />
                )}

            </div>
        </div>
    );
};
