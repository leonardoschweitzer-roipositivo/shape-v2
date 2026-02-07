import React from 'react';
import { Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { GlassPanel } from '../../GlassPanel';

// Define the interface for the component props
export interface PeriodKPIs {
    ratio: {
        label: string;
        startValue: number;
        endValue: number;
        change: number;
        changePercent: number;
        status: 'positive' | 'negative' | 'neutral';
    };
    score: {
        label: string;
        startValue: number;
        endValue: number;
        change: number;
        status: 'positive' | 'negative' | 'neutral';
    };
    bestEvolution: {
        label: string;
        metric: string;
        change: number;
        changePercent: number;
        status: 'positive';
    };
    attention: {
        label: string;
        metric: string;
        change: number;
        changePercent: number;
        status: 'warning' | 'negative';
        reason?: string;
    };
}

export interface PeriodSummaryProps {
    period: {
        label: string;
        startDate: Date;
        endDate: Date;
    };
    kpis: PeriodKPIs;
}

// Helper specific for KPI Card
interface KPICardProps {
    label: string;
    value: React.ReactNode;
    subvalue: string;
    status: 'positive' | 'negative' | 'warning' | 'neutral';
    icon: React.ReactNode;
    onClick?: () => void;
}

const STATUS_STYLES = {
    positive: { color: '#10B981', bg: 'rgba(16,185,129,0.1)', borderColor: '#10B981' },
    negative: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', borderColor: '#EF4444' },
    warning: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', borderColor: '#F59E0B' },
    neutral: { color: '#6B7280', bg: 'rgba(107,114,128,0.1)', borderColor: '#6B7280' },
};

const KPICard: React.FC<KPICardProps> = ({ label, value, subvalue, status, icon, onClick }) => {
    const styles = STATUS_STYLES[status];

    return (
        <div
            className="flex flex-col p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer relative overflow-hidden"
            style={{ borderColor: styles.borderColor }} // Apply border color based on status
            onClick={onClick}
        >
            <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{label}</span>
                <span className="text-lg opacity-80" style={{ color: styles.color }}>{icon}</span>
            </div>

            <div className="flex flex-col gap-1">
                <div className="text-lg font-bold text-white flex items-baseline gap-1">
                    {value}
                </div>
                <div className="text-[10px] text-gray-500 font-medium">
                    {subvalue}
                </div>
            </div>

            {/* Background glowing effect */}
            <div
                className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full blur-xl opacity-20 pointer-events-none"
                style={{ backgroundColor: styles.color }}
            />
        </div>
    );
};

export const PeriodSummary: React.FC<PeriodSummaryProps> = ({ period, kpis }) => {

    // Formatting date helper (simple implementation)
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' }).format(date);
    };

    return (
        <section className="flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 ml-1">
                <div className="p-2 bg-[#131B2C] rounded-xl text-primary border border-white/10 shadow-lg">
                    <span className="text-lg">📊</span>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">RESUMO DO PERÍODO</h3>
                    <p className="text-[10px] text-gray-500 font-medium">
                        Comparativo: {formatDate(period.startDate)} → {formatDate(period.endDate)} ({period.label})
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    label={kpis.ratio.label}
                    value={
                        <span style={{ color: STATUS_STYLES[kpis.ratio.status].color }}>
                            {kpis.ratio.change > 0 ? '+' : ''}{kpis.ratio.change.toFixed(2)}
                        </span>
                    }
                    subvalue={`${kpis.ratio.startValue.toFixed(2)} → ${kpis.ratio.endValue.toFixed(2)}`}
                    status={kpis.ratio.status}
                    icon={<Target size={16} />}
                />

                <KPICard
                    label={kpis.score.label}
                    value={
                        <span style={{ color: STATUS_STYLES[kpis.score.status].color }}>
                            {kpis.score.change > 0 ? '+' : ''}{kpis.score.change} pts
                        </span>
                    }
                    subvalue={`${kpis.score.startValue} → ${kpis.score.endValue}`}
                    status={kpis.score.status}
                    icon={<Target size={16} />}
                />

                <KPICard
                    label={kpis.bestEvolution.label}
                    value={kpis.bestEvolution.metric}
                    subvalue={`+${kpis.bestEvolution.change}cm (${kpis.bestEvolution.changePercent}%)`}
                    status="positive"
                    icon={<TrendingUp size={16} />}
                />

                <KPICard
                    label={kpis.attention.label}
                    value={kpis.attention.metric}
                    subvalue={`+${kpis.attention.change}cm (${kpis.attention.changePercent}%)`}
                    status={kpis.attention.status}
                    icon={<AlertTriangle size={16} />}
                />
            </div>
        </section>
    );
};
