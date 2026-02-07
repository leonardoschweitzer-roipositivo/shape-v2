import React, { useState } from 'react';
import { GlassPanel } from './GlassPanel';
import { List, BarChart2, TrendingUp, Info, Scale, Activity, X } from 'lucide-react';
import { AssessmentList } from './AssessmentList';
import {
    GoldenEvolutionChart,
    WeightChart,
    BodyFatChart,
    MetricConfig
} from './EvolutionCharts';

// New Components
import { PeriodSummary, PeriodKPIs } from './molecules/PeriodSummary/PeriodSummary';
import { EvolutionInsight, EvolutionInsightProps } from './molecules/EvolutionInsight/EvolutionInsight';
import { VisualComparison, ComparisonSnapshot, TransformationSummary } from './molecules/VisualComparison/VisualComparison';
import { AsymmetrySection, AsymmetryData, AsymmetryHistory, AsymmetryRecommendation } from './molecules/AsymmetrySection/AsymmetrySection';

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


export const Evolution: React.FC = () => {
    const [period, setPeriod] = useState('6M');
    const [viewMode, setViewMode] = useState<'charts' | 'list'>('charts');

    // Chart State
    const [selectedMetrics, setSelectedMetrics] = useState<MetricConfig[]>([AVAILABLE_METRICS[0]]); // Helper to start with Ratio

    // Weight State
    const [selectedWeightMetric, setSelectedWeightMetric] = useState('all');
    const [selectedBfMethod, setSelectedBfMethod] = useState('marinha');

    // Helper functions for metric selection
    const handleAddMetric = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const metricId = e.target.value;
        if (!metricId) return;

        const metric = AVAILABLE_METRICS.find(m => m.id === metricId);
        if (metric && !selectedMetrics.find(m => m.id === metric.id) && selectedMetrics.length < 3) {
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

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar pb-20">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">

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

                {viewMode === 'charts' ? (
                    <>
                        {/* 1. SECTION: KPIs Summary */}
                        <PeriodSummary period={MOCK_PERIOD} kpis={MOCK_KPIS} />

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

                                    {/* Metric Selector Pills */}
                                    <div className="flex flex-wrap gap-2 items-center">
                                        {selectedMetrics.map(metric => (
                                            <div
                                                key={metric.id}
                                                className="flex items-center gap-2 pl-3 pr-2 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white"
                                            >
                                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: metric.color }}></span>
                                                {metric.label}
                                                <button
                                                    onClick={() => handleRemoveMetric(metric.id)}
                                                    className="ml-1 p-0.5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"
                                                >
                                                    <X size={10} />
                                                </button>
                                            </div>
                                        ))}

                                        {selectedMetrics.length < 3 && (
                                            <div className="relative">
                                                <select
                                                    onChange={handleAddMetric}
                                                    value=""
                                                    className="appearance-none bg-[#0A0F1C] border border-white/10 text-primary text-[10px] font-bold py-1 pl-3 pr-2 rounded-full focus:outline-none hover:bg-white/5 transition-colors cursor-pointer"
                                                >
                                                    <option value="" disabled>+ Comparar métrica</option>
                                                    {AVAILABLE_METRICS
                                                        .filter(m => !selectedMetrics.find(s => s.id === m.id))
                                                        .map(m => (
                                                            <option key={m.id} value={m.id}>{m.label}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="w-full h-[400px] mt-4">
                                    <GoldenEvolutionChart
                                        data={MOCK_CHART_DATA}
                                        selectedMetrics={selectedMetrics}
                                    />
                                </div>
                            </GlassPanel>
                        </div>

                        {/* 3. SECTION: AI Insight */}
                        <EvolutionInsight insight={MOCK_INSIGHT} />

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
                                        <WeightChart data={MOCK_WEIGHT_DATA} selectedMetric={selectedWeightMetric as any} />
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
                                    <BodyFatChart method={selectedBfMethod} />
                                </GlassPanel>
                            </div>
                        </div>

                        <div className="h-px w-full bg-white/5 my-2" />

                        {/* 5. SECTION: Asymmetry */}
                        <AsymmetrySection
                            data={MOCK_ASYMMETRY_DATA}
                            history={MOCK_ASYMMETRY_HISTORY}
                            recommendation={MOCK_ASYMMETRY_REC}
                        />

                        {/* 6. SECTION: Visual Comparison */}
                        <VisualComparison
                            before={MOCK_COMPARISON.before}
                            after={MOCK_COMPARISON.after}
                            summary={MOCK_COMPARISON.summary}
                        />

                    </>
                ) : (
                    <AssessmentList />
                )}

            </div>
        </div>
    );
};
