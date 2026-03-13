/**
 * KPICard — Card de KPI reutilizável para o Dashboard GOD
 *
 * Exibe ícone, título, valor principal e variação percentual.
 */

import React from 'react';

interface KPICardProps {
    icon: React.ElementType;
    title: string;
    value: number;
    subtitle?: string;
    trend?: number; // variação percentual vs período anterior
    accentColor?: string;
    isLoading?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({
    icon: Icon,
    title,
    value,
    subtitle,
    trend,
    accentColor = 'amber',
    isLoading = false,
}) => {
    const trendIsPositive = trend !== undefined && trend >= 0;
    const trendLabel = trend !== undefined
        ? `${trendIsPositive ? '+' : ''}${trend.toFixed(0)}%`
        : null;

    if (isLoading) {
        return (
            <div className="relative p-5 rounded-2xl border border-white/10 bg-white/[0.02] animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5" />
                    <div className="h-3 w-20 bg-white/5 rounded" />
                </div>
                <div className="h-8 w-16 bg-white/5 rounded mb-2" />
                <div className="h-3 w-24 bg-white/5 rounded" />
            </div>
        );
    }

    return (
        <div className="relative p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 group">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-${accentColor}-500/10 border border-${accentColor}-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon size={20} className={`text-${accentColor}-400`} />
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</span>
                </div>
                {trendLabel && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${trendIsPositive
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : 'text-red-400 bg-red-500/10'
                        }`}>
                        {trendLabel}
                    </span>
                )}
            </div>

            {/* Value */}
            <div className="text-3xl font-black text-white tracking-tight">
                {value.toLocaleString('pt-BR')}
            </div>

            {/* Subtitle */}
            {subtitle && (
                <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
        </div>
    );
};
