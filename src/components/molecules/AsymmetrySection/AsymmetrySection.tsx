import React, { useState } from 'react';
import { Accessibility, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { GlassPanel } from '@/components/atoms/GlassPanel';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, ReferenceLine } from 'recharts';

export interface AsymmetryData {
    muscle: string;
    muscleLabel: string;
    left: number;
    right: number;
    difference: number;
    differencePercent: number;
    dominantSide: 'left' | 'right' | 'equal';
    status: 'symmetric' | 'moderate' | 'asymmetric';
}

export interface AsymmetryHistory {
    muscle: string;
    date: Date; // string or Date, usually string for charts if pre-formatted
    dateLabel: string;
    differencePercent: number;
}

export interface AsymmetryRecommendation {
    muscle: string;
    severity: 'low' | 'medium' | 'high';
    message: string;
    tips: string[];
}

export interface AsymmetrySectionProps {
    data: AsymmetryData[];
    history: AsymmetryHistory[];
    recommendation: AsymmetryRecommendation | null;
}

const STATUS_CONFIG = {
    symmetric: {
        color: '#10B981',
        icon: <CheckCircle2 size={14} weight="fill" />,
        label: 'simétrico',
        bg: 'bg-green-500/10'
    },
    moderate: {
        color: '#F59E0B',
        icon: <AlertCircle size={14} />,
        label: 'moderado',
        bg: 'bg-yellow-500/10'
    },
    asymmetric: {
        color: '#EF4444',
        icon: <AlertCircle size={14} />,
        label: 'assimetria',
        bg: 'bg-red-500/10'
    },
};

export const AsymmetrySection: React.FC<AsymmetrySectionProps> = ({ data, history, recommendation }) => {
    const [selectedMuscle, setSelectedMuscle] = useState<string>(data[0]?.muscle || 'arm');

    const handleMuscleClick = (muscle: string) => {
        setSelectedMuscle(muscle);
    };

    const selectedHistory = history.filter(h => h.muscle === selectedMuscle);
    const selectedMuscleLabel = data.find(d => d.muscle === selectedMuscle)?.muscleLabel || 'Selecionado';

    return (
        <section className="flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-3 ml-1">
                <div className="p-2 bg-[#131B2C] rounded-xl text-primary border border-white/10 shadow-lg">
                    <Accessibility size={20} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">SCANNER DE ASSIMETRIAS</h3>
                    <p className="text-[10px] text-gray-500 font-medium">Monitoramento de equilíbrio bilateral</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* TABLE SECTION */}
                <GlassPanel className="p-0 rounded-2xl overflow-hidden min-h-[300px] flex flex-col">
                    <div className="grid grid-cols-12 gap-2 p-4 bg-white/5 border-b border-white/5 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                        <div className="col-span-3">Músculo</div>
                        <div className="col-span-3 text-center">Esq vs Dir</div>
                        <div className="col-span-3 text-center">Diferença</div>
                        <div className="col-span-3 text-right">Status</div>
                    </div>

                    <div className="flex-1 flex flex-col">
                        {data.map((item) => {
                            const status = STATUS_CONFIG[item.status];
                            const isSelected = selectedMuscle === item.muscle;
                            const maxValue = Math.max(item.left, item.right, 1); // Avoid div by 0

                            return (
                                <div
                                    key={item.muscle}
                                    onClick={() => handleMuscleClick(item.muscle)}
                                    className={`grid grid-cols-12 gap-2 p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/5 ${isSelected ? 'bg-white/10' : ''}`}
                                >
                                    <div className="col-span-3 flex items-center font-medium text-white text-sm">
                                        {item.muscleLabel}
                                    </div>

                                    <div className="col-span-3 flex flex-col justify-center gap-1">
                                        <div className="flex items-center justify-between text-[10px] text-gray-400">
                                            <span>L</span>
                                            <span>R</span>
                                        </div>
                                        <div className="flex gap-1 h-1.5 w-full">
                                            <div className="flex-1 bg-gray-700 rounded-l relative overflow-hidden">
                                                <div
                                                    className="absolute right-0 top-0 h-full transition-all duration-500"
                                                    style={{
                                                        width: `${(item.left / maxValue) * 100}%`,
                                                        backgroundColor: item.dominantSide === 'left' ? status.color : '#6B7280'
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1 bg-gray-700 rounded-r relative overflow-hidden">
                                                <div
                                                    className="absolute left-0 top-0 h-full transition-all duration-500"
                                                    style={{
                                                        width: `${(item.right / maxValue) * 100}%`,
                                                        backgroundColor: item.dominantSide === 'right' ? status.color : '#6B7280'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-3 flex items-center justify-center text-xs font-bold" style={{ color: status.color }}>
                                        {item.difference > 0 ? '+' : ''}{item.difference.toFixed(1)}cm
                                    </div>

                                    <div className="col-span-3 flex items-center justify-end gap-1.5">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-opacity-20 flex items-center gap-1`} style={{ color: status.color, backgroundColor: status.bg }}>
                                            {item.differencePercent <= 3 ? 'OK' : `${item.differencePercent.toFixed(1)}%`}
                                        </span>
                                        {isSelected && <ChevronRight size={14} className="text-gray-500" />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </GlassPanel>

                {/* DETAILS & HISTORY SECTION */}
                <div className="flex flex-col gap-6">
                    {/* Recommendation Card */}
                    {recommendation && recommendation.muscle === selectedMuscle && (
                        <GlassPanel className="p-6 rounded-2xl border-l-4 border-l-yellow-500">
                            <h4 className="flex items-center gap-2 text-yellow-500 text-sm font-bold uppercase mb-2">
                                💡 RECOMENDAÇÃO
                            </h4>
                            <p className="text-sm text-gray-300 mb-4">{recommendation.message}</p>
                            <ul className="space-y-2">
                                {recommendation.tips.map((tip, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                                        <span className="text-yellow-500 mt-1">•</span>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </GlassPanel>
                    )}

                    {/* History Chart */}
                    <GlassPanel className="p-6 rounded-2xl flex-1 min-h-[200px] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                HISTÓRICO ({selectedMuscleLabel})
                            </h4>
                            <div className="flex items-center gap-2 text-[10px]">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span>Meta &lt;3%</span>
                            </div>
                        </div>

                        <div className="flex-1 w-full min-h-[150px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={selectedHistory}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis
                                        dataKey="dateLabel"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6B7280', fontSize: 10 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6B7280', fontSize: 10 }}
                                        unit="%"
                                    />
                                    <ReferenceLine y={3} stroke="#10B981" strokeDasharray="3 3" strokeOpacity={0.5} />
                                    <Area
                                        type="monotone"
                                        dataKey="differencePercent"
                                        stroke="#F59E0B"
                                        fill="rgba(245,158,11,0.1)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassPanel>
                </div>
            </div>
        </section>
    );
};
