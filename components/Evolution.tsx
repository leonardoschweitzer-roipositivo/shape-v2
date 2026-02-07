import React, { useState } from 'react';
import { GlassPanel } from './GlassPanel';
import { Info, List, BarChart2, TrendingUp, Accessibility, ChevronDown, Compass, Scale, Ruler, Activity, Target } from 'lucide-react';
import { AssessmentList } from './AssessmentList';
import {
    GoldenEvolutionChart,
    MeasuresChart,
    WeightChart,
    BodyFatChart,
    AsymmetryScannerChart
} from './EvolutionCharts';

const proportions = [
    { id: 'shape-v', label: 'Shape-V (Ombro/Cintura)' },
    { id: 'arm-neck', label: 'Braço / Pescoço' },
    { id: 'thigh-calf', label: 'Coxa / Panturrilha' },
    { id: 'chest-waist', label: 'Peitoral / Cintura' },
    { id: 'waist-hip', label: 'Cintura / Quadril' },
    { id: 'arm-forearm', label: 'Braço / Antebraço' },
    { id: 'neck-calf', label: 'Pescoço / Panturrilha' },
    { id: 'biceps-thigh', label: 'Bíceps / Coxa' },
];

const measures = [
    { id: 'chest', label: 'Peitoral' },
    { id: 'arm', label: 'Braço' },
    { id: 'waist', label: 'Cintura' },
    { id: 'thigh', label: 'Coxa' },
    { id: 'calf', label: 'Panturrilha' },
];

export const Evolution: React.FC = () => {
    const [period, setPeriod] = useState('6M');
    const [viewMode, setViewMode] = useState<'charts' | 'list'>('charts');
    const [selectedProportion, setSelectedProportion] = useState('shape-v');
    const [selectedWeightMetric, setSelectedWeightMetric] = useState('all');
    const [selectedMeasure, setSelectedMeasure] = useState('chest');
    const [selectedBfMethod, setSelectedBfMethod] = useState('marinha');
    const [selectedAsymmetryMember, setSelectedAsymmetryMember] = useState('arm');

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar pb-20">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">

                {/* Header Section: Title + Subtitle + Controls */}
                <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
                    <div className="flex flex-col animate-fade-in-up">
                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">EVOLUÇÃO</h2>
                        <p className="text-gray-400 mt-2 font-light max-w-2xl">
                            Análise detalhada do progresso físico e simetria baseada na proporção áurea.
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
                {/* Conditional Content: Charts or List */}
                {viewMode === 'charts' ? (
                    <>
                        {/* SECTION 1: ARQUITETURA ESTÉTICA */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 ml-1">
                                <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20">
                                    <Compass size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Arquitetura Estética</h3>
                                    <p className="text-[10px] text-gray-500 font-medium">Convergência para o ideal das proporções clássicas</p>
                                </div>
                            </div>

                            <GlassPanel className="p-6 md:p-8 rounded-2xl relative overflow-hidden min-h-[400px]">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            EVOLUÇÃO ÁUREA
                                            <Info size={14} className="text-gray-500" />
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">Convergência para proporção ideal (1.618)</p>
                                    </div>

                                    <div className="text-right z-10">
                                        <div className="text-4xl font-bold text-primary tracking-tighter shadow-primary drop-shadow-[0_0_10px_rgba(0,201,167,0.3)]">1.602</div>
                                        <div className="text-[10px] text-green-500 font-bold flex items-center justify-end gap-1">
                                            <TrendingUp size={10} /> +0.04 vs mês anterior
                                        </div>
                                    </div>
                                </div>

                                {/* Proportion Selector */}
                                <div className="relative z-20 mb-2">
                                    <div className="relative inline-block">
                                        <select
                                            value={selectedProportion}
                                            onChange={(e) => setSelectedProportion(e.target.value)}
                                            className="appearance-none bg-[#0A0F1C] border border-white/10 text-white text-xs font-bold py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:border-primary/50 cursor-pointer shadow-lg hover:bg-white/5 transition-colors"
                                        >
                                            {proportions.map((p) => (
                                                <option key={p.id} value={p.id}>{p.label}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-primary">
                                            <ChevronDown size={14} />
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full h-[300px] mt-2">
                                    <GoldenEvolutionChart />
                                </div>
                            </GlassPanel>
                        </div>

                        <div className="h-px w-full bg-white/5 my-2" />

                        {/* SECTION 2: COMPOSIÇÃO CORPORAL */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 ml-1">
                                <div className="p-2 bg-secondary/10 rounded-xl text-secondary border border-secondary/20">
                                    <Scale size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Composição Corporal</h3>
                                    <p className="text-[10px] text-gray-500 font-medium">Análise de peso, massa magra e percentual de gordura</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Weight Evolution */}
                                <GlassPanel className="p-6 rounded-2xl min-h-[300px]">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">EVOLUÇÃO PESO</h3>

                                        <div className="relative z-20">
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
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-primary">
                                                    <ChevronDown size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full h-[200px] mt-4">
                                        <WeightChart selectedMetric={selectedWeightMetric as any} />
                                    </div>

                                    <div className="flex gap-3 justify-center mt-6">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-white"></span>
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
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-primary">
                                                <ChevronDown size={10} />
                                            </div>
                                        </div>
                                    </div>
                                    <BodyFatChart method={selectedBfMethod} />
                                </GlassPanel>
                            </div>
                        </div>

                        <div className="h-px w-full bg-white/5 my-2" />

                        {/* SECTION 3: MORFOLOGIA E SIMETRIA */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 ml-1">
                                <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20">
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Morfologia e Simetria</h3>
                                    <p className="text-[10px] text-gray-500 font-medium">Monitoramento de medidas e equilíbrio bilateral</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Raw Measures */}
                                <GlassPanel className="p-6 rounded-2xl min-h-[300px]">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">MEDIDAS BRUTAS</h3>
                                        <div className="relative inline-block">
                                            <select
                                                value={selectedMeasure}
                                                onChange={(e) => setSelectedMeasure(e.target.value)}
                                                className="appearance-none bg-[#0A0F1C] border border-white/10 text-white text-[10px] font-bold py-1.5 pl-2 pr-6 rounded focus:outline-none focus:border-primary/50 cursor-pointer shadow-lg hover:bg-white/5 transition-colors uppercase"
                                            >
                                                {measures.map((m) => (
                                                    <option key={m.id} value={m.id}>{m.label}</option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-primary">
                                                <ChevronDown size={12} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full h-[200px] mt-4">
                                        <MeasuresChart selectedMeasure={selectedMeasure} />
                                    </div>
                                </GlassPanel>

                                {/* Asymmetry Scanner */}
                                <GlassPanel className="p-6 rounded-2xl">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <Accessibility className="text-primary" size={20} />
                                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">SCANNER DE ASSIMETRIAS</h3>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="relative inline-block">
                                                <select
                                                    value={selectedAsymmetryMember}
                                                    onChange={(e) => setSelectedAsymmetryMember(e.target.value)}
                                                    className="appearance-none bg-[#0A0F1C] border border-white/10 text-white text-[10px] font-bold py-1.5 pl-2 pr-6 rounded focus:outline-none focus:border-primary/50 cursor-pointer shadow-lg hover:bg-white/5 transition-colors uppercase"
                                                >
                                                    <option value="arm">Braços</option>
                                                    <option value="forearm">Antebraços</option>
                                                    <option value="thigh">Coxas</option>
                                                    <option value="calf">Panturrilhas</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-primary">
                                                    <ChevronDown size={10} />
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-gray-500 font-bold hidden sm:block">Esq vs Dir (Desvio %)</span>
                                        </div>
                                    </div>
                                    <AsymmetryScannerChart member={selectedAsymmetryMember} />
                                </GlassPanel>
                            </div>
                        </div>
                    </>
                ) : (
                    <AssessmentList />
                )}

            </div>
        </div>
    );
};