import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface PersonalStatsCardProps {
    title: string;
    value: number;
    variation?: number;
    variationType?: 'absolute' | 'percentage';
    unit?: string;
    icon?: LucideIcon;
    color?: 'primary' | 'success' | 'warning' | 'error';
    showProgress?: boolean;
    target?: number;
}

export const PersonalStatsCard: React.FC<PersonalStatsCardProps> = ({
    title,
    value,
    variation,
    variationType = 'absolute',
    unit = '',
    icon: Icon,
    color = 'primary',
    showProgress = false,
    target,
}) => {
    const colorClasses = {
        primary: 'bg-slate-950/25 backdrop-blur-sm border-white/5 hover:border-indigo-500/30 shadow-2xl',
        success: 'bg-slate-950/25 backdrop-blur-sm border-white/5 hover:border-emerald-500/30 shadow-2xl',
        warning: 'bg-slate-950/25 backdrop-blur-sm border-white/5 hover:border-amber-500/30 shadow-2xl',
        error: 'bg-slate-950/25 backdrop-blur-sm border-white/5 hover:border-rose-500/30 shadow-2xl',
    };

    const iconColorClasses = {
        primary: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
        success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        error: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    };

    const progressPercentage = target ? Math.min((value / target) * 100, 100) : 0;
    const isPositiveVariation = variation && variation > 0;
    const isNegativeVariation = variation && variation < 0;

    return (
        <div className={`${colorClasses[color]} border rounded-[2rem] p-8 transition-all hover:scale-[1.02] group`}>
            <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1.5">
                        {title}
                    </p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-white tracking-tighter">
                            {value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}
                        </span>
                        {unit && <span className="text-sm font-bold text-zinc-600 uppercase tracking-widest">{unit}</span>}
                    </div>
                </div>
                {Icon && (
                    <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 border ${iconColorClasses[color]}`}>
                        <Icon size={24} />
                    </div>
                )}
            </div>

            {variation !== undefined && (
                <div className="flex items-center gap-1.5 mt-2">
                    {isPositiveVariation && (
                        <>
                            <TrendingUp size={14} className="text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                +{variation.toFixed(1)}{variationType === 'percentage' ? '%' : ''}
                            </span>
                        </>
                    )}
                    {isNegativeVariation && (
                        <>
                            <TrendingDown size={14} className="text-rose-500" />
                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">
                                {variation.toFixed(1)}{variationType === 'percentage' ? '%' : ''}
                            </span>
                        </>
                    )}
                    {!isPositiveVariation && !isNegativeVariation && (
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                            Estável
                        </span>
                    )}
                </div>
            )}

            {showProgress && target && (
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">Progresso</span>
                        <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">
                            {progressPercentage.toFixed(0)}% de {target}
                        </span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden p-[1px]">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out fill-current ${color === 'primary' ? 'bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.5)]' :
                                color === 'success' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' :
                                    color === 'warning' ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]' :
                                        'bg-rose-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                                }`}
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
