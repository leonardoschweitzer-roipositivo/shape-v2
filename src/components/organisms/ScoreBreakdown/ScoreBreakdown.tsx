import React from 'react';
import { ScoreBreakdownData, ProportionBreakdownItem } from '../../../features/dashboard/types';
import { ChevronRight, Zap } from 'lucide-react';

interface ScoreBreakdownProps {
    data: ScoreBreakdownData;
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ data }) => {
    const { method, totalScore, proportions } = data;

    const getStatusColor = (status: ProportionBreakdownItem['status']) => {
        switch (status) {
            case 'excellent': return 'bg-emerald-500';
            case 'good': return 'bg-[#00C9A7]';
            case 'attention': return 'bg-amber-500';
            case 'critical': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getMethodLabel = (m: string) => {
        if (m === 'golden_ratio') return 'Golden Ratio';
        if (m === 'classic_physique') return 'Classic Physique';
        return "Men's Physique";
    };

    return (
        <div className="bg-[#131B2C] rounded-2xl p-6 border border-white/5 shadow-lg flex flex-col h-[380px] relative overflow-hidden">

            {/* Header */}
            <div className="flex justify-between items-start mb-6 z-10">
                <div>
                    <h4 className="text-gray-400 text-xs font-bold tracking-wider uppercase mb-1">BREAKDOWN DO SCORE</h4>
                    <div className="text-xs text-gray-500 font-medium">Método: <span className="text-white">{getMethodLabel(method)}</span></div>
                </div>
                <div className="bg-[#0A0F1C] px-3 py-1 rounded-lg border border-white/5">
                    <span className="text-xs text-gray-400 font-bold">TOTAL: <span className="text-white text-base">{totalScore}/100</span></span>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar z-10">
                {proportions.map((prop, index) => (
                    <div key={prop.id} className="group">
                        <div className="flex justify-between items-end mb-1.5">
                            <span className="text-sm text-gray-300 font-medium group-hover:text-white transition-colors">
                                {index + 1}. {prop.nome}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-gray-500">{prop.score}%</span>
                                <div className={`w-2 h-2 rounded-full ${getStatusColor(prop.status)}`}></div>
                            </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="h-2 bg-[#0A0F1C] rounded-full overflow-hidden border border-white/5 relative">
                            {/* Background segments for visual texture */}
                            <div className="absolute inset-0 flex">
                                {[...Array(10)].map((_, i) => (
                                    <div key={i} className="flex-1 border-r border-[#131B2C]/50 last:border-0"></div>
                                ))}
                            </div>
                            {/* Bar */}
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ${getStatusColor(prop.status)}`}
                                style={{ width: `${prop.percentage}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer / Tip */}
            <div className="mt-6 pt-4 border-t border-white/10 z-10">
                <div className="flex item-start gap-3 bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20">
                    <div className="bg-indigo-500/20 p-1.5 rounded-lg text-indigo-400 mt-0.5">
                        <Zap size={14} />
                    </div>
                    <div>
                        <p className="text-indigo-200 text-xs font-medium leading-relaxed">
                            Foque em <span className="text-white font-bold">Pernas</span> para maior ganho de pontuação nesta semana.
                        </p>
                    </div>
                </div>
            </div>

            {/* Background Decor */}
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        </div>
    );
};
