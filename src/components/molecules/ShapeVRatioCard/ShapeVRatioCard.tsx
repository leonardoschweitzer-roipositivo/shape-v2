import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { KPIData } from '../../../features/dashboard/types';

interface ShapeVRatioCardProps {
    data: KPIData['ratio'];
}

export const ShapeVRatioCard: React.FC<ShapeVRatioCardProps> = ({ data }) => {
    const { current, target, previous, classification, distanceToTarget, evolution } = data;

    const getEvolutionIcon = () => {
        if (evolution > 0) return <ArrowUpRight size={16} className="text-emerald-500" />;
        if (evolution < 0) return <ArrowDownRight size={16} className="text-red-500" />;
        return <Minus size={16} className="text-gray-500" />;
    };

    const classifications = ['BLOCO', 'NORMAL', 'ATLÉTICO', 'ESTÉTICO', 'FREAK'];
    const activeClassIndex = classifications.indexOf(classification);

    // Calculate percentage position for the progress bar cursor
    // Assuming scale range roughly from 1.0 to 1.7
    const minRatio = 1.1;
    const maxRatio = 1.7;
    const progressPercent = Math.min(100, Math.max(0, ((current - minRatio) / (maxRatio - minRatio)) * 100));

    return (
        <div className="bg-[#131B2C] rounded-2xl p-6 border border-white/5 shadow-lg flex flex-col justify-between h-full relative overflow-hidden group hover:border-[#00C9A7]/30 transition-colors">

            {/* Header */}
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <h4 className="text-gray-400 text-xs font-bold tracking-wider uppercase mb-1">SHAPE-V RATIO</h4>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white">{current.toFixed(2)}</span>
                        <span className="text-sm text-gray-500 font-medium">/ {target.toFixed(3)}</span>
                    </div>
                </div>
                <div className="bg-emerald-500/10 p-2 rounded-lg">
                    {/* Simple bar chart icon */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00C9A7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10"></line>
                        <line x1="12" y1="20" x2="12" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                </div>
            </div>

            {/* Progress Bar / Scale */}
            <div className="mb-4 relative z-10">
                <div className="h-2 bg-gray-800 rounded-full w-full relative overflow-hidden">
                    {/* Target Marker */}
                    <div
                        className="absolute top-0 bottom-0 w-0.5 bg-[#FFD700] z-20"
                        style={{ left: `${((target - minRatio) / (maxRatio - minRatio)) * 100}%` }}
                        title="Target Golden Ratio"
                    />
                    {/* Current Value Bar */}
                    <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-[#00C9A7] rounded-full transition-all duration-1000"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>

                {/* Classification Labels */}
                <div className="flex justify-between mt-2 text-[9px] text-gray-500 font-medium tracking-wide uppercase">
                    {classifications.map((item, index) => (
                        <span key={item} className={index === activeClassIndex ? 'text-[#00C9A7] font-bold' : ''}>
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            {/* Mini History Chart (The "Good Idea" to fill the gap) */}
            <div className="flex-1 flex flex-col justify-center py-4 opacity-40 hover:opacity-100 transition-opacity">
                <div className="flex justify-between items-end h-16 w-full gap-1">
                    {/* Simulated Sparkline Bar Chart */}
                    {[45, 52, 48, 62, 58, 70, 75, 82].map((height, i) => (
                        <div
                            key={i}
                            className="bg-indigo-500/40 w-full rounded-t-sm hover:bg-[#00C9A7]/60 transition-colors"
                            style={{ height: `${height}%` }}
                        ></div>
                    ))}
                </div>
                <div className="flex justify-between mt-2 text-[8px] text-gray-600 uppercase font-bold tracking-tighter">
                    <span>JAN</span>
                    <span>FEV</span>
                    <span>MAR</span>
                    <span>ABR</span>
                    <span>MAI</span>
                    <span>JUN</span>
                    <span>JUL</span>
                    <span>ATUAL</span>
                </div>
            </div>

            {/* Footer / Insights */}
            <div className="mt-auto relative z-10 pt-4 border-t border-white/5">
                <p className="text-sm text-gray-300 mb-2 font-medium">
                    Você está a <span className="text-white font-bold">{distanceToTarget.toFixed(3)}</span> do índice perfeito
                </p>

                {previous && (
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                        {getEvolutionIcon()}
                        <span className={evolution > 0 ? 'text-emerald-500' : evolution < 0 ? 'text-red-500' : 'text-gray-500'}>
                            {evolution > 0 ? '+' : ''}{evolution.toFixed(2)}
                        </span>
                        <span className="text-gray-500">vs último mês</span>
                    </div>
                )}
            </div>

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C9A7]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        </div>
    );
};
