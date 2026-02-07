import React, { useState } from 'react';
import { EvolutionData } from '../../../features/dashboard/types';
import { ArrowUpRight, ArrowDownRight, Minus, TrendingUp } from 'lucide-react';

interface EvolutionCardProps {
    data: EvolutionData;
}

export const EvolutionCard: React.FC<EvolutionCardProps> = ({ data }) => {
    const [period, setPeriod] = useState<'7d' | '30d' | '90d'>(data.period);
    const { metrics, overallTrend } = data; // In a real app we'd fetch based on period state

    const getMetricIcon = (status: 'up' | 'down' | 'stable', isPositive: boolean) => {
        if (status === 'stable') return <Minus size={14} className="text-gray-500" />;

        // Positive context: up is good (e.g. biceps), down is good (e.g. waist)?
        // The data has isPositive flag to indicate if the change direction is good.
        // Spec says: "up pode ser negativo (ex: cintura)"
        // But data model has isPositive boolean. Let's use that for color.

        const colorClass = isPositive ? 'text-emerald-500' : 'text-red-500';
        return status === 'up'
            ? <ArrowUpRight size={14} className={colorClass} />
            : <ArrowDownRight size={14} className={colorClass} />;
    };

    return (
        <div className="bg-[#131B2C] rounded-2xl p-6 border border-white/5 shadow-lg relative overflow-hidden h-full flex flex-col group hover:border-purple-500/30 transition-colors">

            {/* Header with Period Selector */}
            <div className="flex justify-between items-start mb-6 z-10 relative">
                <h4 className="text-gray-400 text-xs font-bold tracking-wider uppercase flex items-center gap-2">
                    <TrendingUp size={14} className="text-purple-500" />
                    EVOLUÇÃO
                </h4>
                <div className="flex bg-[#0A0F1C] rounded-lg p-0.5 border border-white/5">
                    {(['7d', '30d', '90d'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-2 py-1 text-[10px] font-bold rounded-md transition-colors ${period === p
                                    ? 'bg-purple-500/20 text-purple-400'
                                    : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {p.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Metrics List */}
            <div className="flex-1 space-y-4 mb-6 z-10 relative">
                {metrics.map((metric) => (
                    <div key={metric.name} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                        <span className="text-sm text-gray-400 font-medium">{metric.name}</span>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-gray-500 font-mono">
                                {metric.previous} → <span className="text-white font-bold">{metric.current}</span>
                            </span>
                            <div className="flex items-center gap-1 min-w-[60px] justify-end">
                                {getMetricIcon(metric.status, metric.isPositive)}
                                <span className={`text-xs font-bold ${metric.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {metric.change > 0 && '+'}{metric.change}{metric.unit}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer / Trend */}
            <div className="mt-auto pt-4 border-t border-white/10 z-10 relative">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Tendência Geral:</span>
                    <span className={`font-bold uppercase tracking-wider ${overallTrend === 'improving' ? 'text-emerald-400' :
                            overallTrend === 'declining' ? 'text-red-400' : 'text-blue-400'
                        }`}>
                        {overallTrend === 'improving' ? 'MELHORANDO ↗️' :
                            overallTrend === 'declining' ? 'PIORANDO ↘️' : 'ESTÁVEL →'}
                    </span>
                </div>
                <button className="w-full mt-3 text-[10px] uppercase font-bold text-gray-500 hover:text-white transition-colors text-center">
                    Ver evolução completa →
                </button>
            </div>

            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        </div>
    );
};
