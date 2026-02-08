// PersonalRankingTable - Complete ranking table
// VITRU IA - Ranking Personais

import React from 'react';
import { TrendingUp, Users, MapPin, CheckCircle, ChevronRight } from 'lucide-react';
import { PersonalRankingItem, TIER_CONFIG } from '@/types/personalRanking';

interface PersonalRankingTableProps {
    personals: PersonalRankingItem[];
    onSelectPersonal: (personalId: string) => void;
    onLoadMore?: () => void;
    hasMore?: boolean;
}

const getMedalDisplay = (position: number): { icon: string; color: string } | null => {
    switch (position) {
        case 1:
            return { icon: '🥇', color: 'text-yellow-500' };
        case 2:
            return { icon: '🥈', color: 'text-gray-400' };
        case 3:
            return { icon: '🥉', color: 'text-orange-500' };
        default:
            return null;
    }
};

const TableRow: React.FC<{
    personal: PersonalRankingItem;
    onClick: () => void;
}> = ({ personal, onClick }) => {
    const medal = getMedalDisplay(personal.position);
    const tierConfig = TIER_CONFIG[personal.tier];

    return (
        <tr
            onClick={onClick}
            className="
        group cursor-pointer
        border-b border-white/5
        hover:bg-white/[0.03] transition-colors
      "
        >
            {/* Position */}
            <td className="py-4 px-4 w-16">
                <div className="flex items-center justify-center">
                    {medal ? (
                        <span className="text-xl">{medal.icon}</span>
                    ) : (
                        <span className="text-gray-400 font-medium">#{personal.position}</span>
                    )}
                </div>
            </td>

            {/* Personal Info */}
            <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-white/10">
                        {personal.avatarUrl ? (
                            <img
                                src={personal.avatarUrl}
                                alt={personal.name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-sm font-bold text-gray-400">
                                {personal.name.charAt(0)}
                            </span>
                        )}
                    </div>

                    {/* Name & Details */}
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{personal.name}</span>
                            {personal.crefVerified && (
                                <CheckCircle size={14} className="text-primary" />
                            )}
                            <span className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-gray-400">
                                {tierConfig.icon} {tierConfig.name}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin size={10} />
                            <span>{personal.city}, {personal.state}</span>
                        </div>
                    </div>
                </div>
            </td>

            {/* Score */}
            <td className="py-4 px-4 text-center">
                <span className="text-lg font-bold text-white">{personal.score.toFixed(1)}</span>
            </td>

            {/* Evolution */}
            <td className="py-4 px-4 text-center">
                <div className="flex items-center justify-center gap-1">
                    <TrendingUp size={14} className="text-green-400" />
                    <span className="text-green-400 font-medium">+{personal.avgEvolution.toFixed(1)}</span>
                </div>
            </td>

            {/* Athletes */}
            <td className="py-4 px-4 text-center">
                <div className="flex items-center justify-center gap-1 text-gray-400">
                    <Users size={14} />
                    <span>{personal.athleteCount}</span>
                </div>
            </td>

            {/* Location */}
            <td className="py-4 px-4 text-center hidden md:table-cell">
                <span className="text-gray-400">{personal.state}</span>
            </td>

            {/* Arrow */}
            <td className="py-4 px-4 w-10">
                <ChevronRight
                    size={18}
                    className="text-gray-600 group-hover:text-primary transition-colors"
                />
            </td>
        </tr>
    );
};

export const PersonalRankingTable: React.FC<PersonalRankingTableProps> = ({
    personals,
    onSelectPersonal,
    onLoadMore,
    hasMore = false,
}) => {
    // Skip first 3 (already shown in podium)
    const tablePersonals = personals.slice(3);

    if (tablePersonals.length === 0 && personals.length <= 3) {
        return null; // Only showing podium
    }

    return (
        <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/5">
                <h3 className="text-lg font-semibold text-white">Ranking Completo</h3>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/5 text-xs text-gray-500 uppercase tracking-wider">
                            <th className="py-3 px-4 text-center">#</th>
                            <th className="py-3 px-4 text-left">Personal</th>
                            <th className="py-3 px-4 text-center">Score</th>
                            <th className="py-3 px-4 text-center">Evolução</th>
                            <th className="py-3 px-4 text-center">Atletas</th>
                            <th className="py-3 px-4 text-center hidden md:table-cell">Local</th>
                            <th className="py-3 px-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {tablePersonals.map((personal) => (
                            <TableRow
                                key={personal.personalId}
                                personal={personal}
                                onClick={() => onSelectPersonal(personal.personalId)}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Load More */}
            {hasMore && onLoadMore && (
                <div className="px-6 py-4 border-t border-white/5 text-center">
                    <button
                        onClick={onLoadMore}
                        className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                    >
                        Carregar mais...
                    </button>
                </div>
            )}
        </div>
    );
};
