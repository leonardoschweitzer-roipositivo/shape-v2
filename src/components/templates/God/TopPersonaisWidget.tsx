/**
 * TopPersonaisWidget — Widget de ranking dos Top 5 Personais
 *
 * Lista os personais com melhor score médio dos atletas.
 */

import React from 'react';
import { Trophy, Users } from 'lucide-react';
import type { PersonalRanking } from '@/services/godDashboard.service';

interface TopPersonaisWidgetProps {
    data: PersonalRanking[];
    isLoading?: boolean;
}

const MEDAL_COLORS = ['text-amber-400', 'text-gray-300', 'text-orange-600'];

export const TopPersonaisWidget: React.FC<TopPersonaisWidgetProps> = ({ data, isLoading = false }) => {
    if (isLoading) {
        return (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 animate-pulse">
                <div className="h-4 w-32 bg-white/5 rounded mb-4" />
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 py-3">
                        <div className="w-8 h-8 rounded-full bg-white/5" />
                        <div className="flex-1 h-3 bg-white/5 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    const isEmpty = data.length === 0;

    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="flex items-center gap-2 mb-4">
                <Trophy size={16} className="text-amber-400" />
                <h3 className="text-sm font-bold text-white">Top Personais</h3>
            </div>
            {isEmpty ? (
                <div className="py-8 text-center text-gray-600 text-sm">
                    Sem dados de personais
                </div>
            ) : (
                <div className="space-y-1">
                    {data.map((personal, i) => (
                        <div
                            key={personal.personal_id}
                            className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/[0.03] transition-colors"
                        >
                            {/* Position */}
                            <div className="w-6 text-center">
                                {i < 3 ? (
                                    <span className={`text-sm font-black ${MEDAL_COLORS[i]}`}>
                                        {i + 1}º
                                    </span>
                                ) : (
                                    <span className="text-xs text-gray-600 font-bold">{i + 1}º</span>
                                )}
                            </div>

                            {/* Avatar placeholder */}
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                                <span className="text-xs font-bold text-white">
                                    {personal.personal_nome.charAt(0).toUpperCase()}
                                </span>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-medium truncate">
                                    {personal.personal_nome}
                                </p>
                                <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                    <Users size={10} />
                                    <span>{personal.atletas_ativos} ativos</span>
                                </div>
                            </div>

                            {/* Score */}
                            <div className="text-right">
                                <span className="text-sm font-bold text-amber-400">
                                    {personal.score_medio !== null
                                        ? personal.score_medio.toFixed(1)
                                        : '—'}
                                </span>
                                <p className="text-[9px] text-gray-600">score</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
