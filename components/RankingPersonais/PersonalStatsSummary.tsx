// PersonalStatsSummary - Stats card for ranking
// VITRU IA - Ranking Personais

import React from 'react';
import { Users, TrendingUp, Target, MapPin, BarChart3 } from 'lucide-react';
import { RankingStats, CATEGORY_LABELS } from '../../types/personalRanking';

interface PersonalStatsSummaryProps {
    stats: RankingStats;
}

const StatItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | number;
    suffix?: string;
}> = ({ icon, label, value, suffix }) => (
    <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
        </div>
        <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-white font-semibold">
                {value}
                {suffix && <span className="text-gray-400 text-sm ml-1">{suffix}</span>}
            </p>
        </div>
    </div>
);

export const PersonalStatsSummary: React.FC<PersonalStatsSummaryProps> = ({ stats }) => {
    return (
        <div className="bg-white/5 border border-white/5 rounded-xl p-5">
            {/* Header */}
            <div className="flex items-center gap-2 mb-5">
                <BarChart3 size={18} className="text-primary" />
                <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
                    Estatísticas do Ranking
                </h3>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <StatItem
                    icon={<Users size={18} />}
                    label="Total de personais"
                    value={stats.totalPersonals.toLocaleString('pt-BR')}
                />
                <StatItem
                    icon={<TrendingUp size={18} />}
                    label="Evolução média"
                    value={`+${stats.avgEvolution.toFixed(1)}`}
                    suffix="pontos"
                />
                <StatItem
                    icon={<Target size={18} />}
                    label="Top especialidade"
                    value={CATEGORY_LABELS[stats.topSpecialty]}
                />
                <StatItem
                    icon={<MapPin size={18} />}
                    label="Região com mais personais"
                    value={stats.topRegion}
                />
            </div>
        </div>
    );
};
