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
        primary: 'from-primary/20 to-primary/5 border-white/10',
        success: 'from-green-500/20 to-green-500/5 border-white/10',
        warning: 'from-amber-500/20 to-amber-500/5 border-white/10',
        error: 'from-red-500/20 to-red-500/5 border-white/10',
    };

    const iconColorClasses = {
        primary: 'text-primary',
        success: 'text-green-500',
        warning: 'text-amber-500',
        error: 'text-red-500',
    };

    const progressPercentage = target ? Math.min((value / target) * 100, 100) : 0;
    const isPositiveVariation = variation && variation > 0;
    const isNegativeVariation = variation && variation < 0;

    return (
        <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-6 transition-all hover:scale-[1.02]`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-1">
                        {title}
                    </p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white">
                            {value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}
                        </span>
                        {unit && <span className="text-lg text-gray-400">{unit}</span>}
                    </div>
                </div>
                {Icon && (
                    <div className={`p-3 rounded-lg bg-white/5 ${iconColorClasses[color]}`}>
                        <Icon size={24} />
                    </div>
                )}
            </div>

            {variation !== undefined && (
                <div className="flex items-center gap-1 mt-2">
                    {isPositiveVariation && (
                        <>
                            <TrendingUp size={16} className="text-green-500" />
                            <span className="text-sm font-medium text-green-500">
                                +{variation.toFixed(1)}{variationType === 'percentage' ? '%' : ''}
                            </span>
                        </>
                    )}
                    {isNegativeVariation && (
                        <>
                            <TrendingDown size={16} className="text-red-500" />
                            <span className="text-sm font-medium text-red-500">
                                {variation.toFixed(1)}{variationType === 'percentage' ? '%' : ''}
                            </span>
                        </>
                    )}
                    {!isPositiveVariation && !isNegativeVariation && (
                        <span className="text-sm font-medium text-gray-500">
                            Sem variação
                        </span>
                    )}
                </div>
            )}

            {showProgress && target && (
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Progresso</span>
                        <span className="text-xs text-gray-400">
                            {progressPercentage.toFixed(0)}% de {target}
                        </span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${iconColorClasses[color]} bg-current transition-all duration-500`}
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
