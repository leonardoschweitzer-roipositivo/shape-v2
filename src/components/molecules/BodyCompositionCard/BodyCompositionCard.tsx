import React from 'react';
import { TrendingUp, TrendingDown, Minus, Target, Activity } from 'lucide-react';

interface BodyCompositionCardProps {
    title: string;
    current: number;
    start: number;
    goal: number;
    unit: string;
    trend: number;
    classification?: string;
    icon?: React.ReactNode;
}

export const BodyCompositionCard: React.FC<BodyCompositionCardProps> = ({
    title,
    current,
    start,
    goal,
    unit,
    trend,
    classification,
    icon
}) => {
    // Determine status color based on progress towards goal
    // Assuming for weight: gained is good if goal > start (bulking), bad if goal < start (cutting)
    // For simplicity here, we'll just show progress towards the numeric goal

    const totalChange = Math.abs(goal - start);
    const currentChange = Math.abs(current - start);
    const progress = Math.min(100, Math.max(0, (currentChange / totalChange) * 100));

    const isPositiveTrend = trend > 0;

    return (
        <div className="bg-[#131B2C] rounded-2xl p-5 border border-white/5 shadow-lg flex flex-col justify-between h-full relative overflow-hidden group hover:border-blue-500/30 transition-colors">

            {/* Header */}
            <div className="flex justify-between items-start mb-2 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-[#0A0F1C] rounded-lg border border-white/5 text-gray-400 group-hover:text-blue-400 transition-colors">
                        {icon || <Activity size={16} />}
                    </div>
                    <h4 className="text-gray-400 text-xs font-bold tracking-wider uppercase">{title}</h4>
                </div>
                {classification && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                        {classification}
                    </span>
                )}
            </div>

            {/* Main Value */}
            <div className="my-3 relative z-10">
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white tracking-tight">{current}</span>
                    <span className="text-sm text-gray-400 font-medium">{unit}</span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                    <div className={`flex items-center text-xs font-medium ${trend < 0 ? 'text-emerald-500' : trend > 0 ? 'text-red-500' : 'text-gray-500'}`}>
                        {trend > 0 ? <TrendingUp size={12} className="mr-0.5" /> : trend < 0 ? <TrendingDown size={12} className="mr-0.5" /> : <Minus size={12} className="mr-0.5" />}
                        <span>{Math.abs(trend)}{unit}</span>
                    </div>
                    <span className="text-[10px] text-gray-500">vs início</span>
                </div>
            </div>

            {/* Progress / Goal Context */}
            <div className="relative z-10 mt-auto pt-3 border-t border-white/5">
                <div className="flex justify-between items-center text-[10px] text-gray-400 mb-1.5">
                    <span>Meta: <span className="text-white font-medium">{goal}{unit}</span></span>
                    <span>{progress.toFixed(0)}%</span>
                </div>
                <div className="h-1.5 bg-[#0A0F1C] rounded-full overflow-hidden border border-white/5">
                    <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        </div>
    );
};
