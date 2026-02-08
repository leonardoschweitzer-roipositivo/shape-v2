// PersonalTop3 - Podium for top 3 trainers
// VITRU IA - Ranking Personais

import React from 'react';
import { Trophy, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { PersonalRankingItem, TIER_CONFIG } from '../../types/personalRanking';

interface PersonalTop3Props {
    personals: PersonalRankingItem[];
    onSelectPersonal: (personalId: string) => void;
}

const getMedalConfig = (position: number) => {
    switch (position) {
        case 1:
            return {
                icon: '🥇',
                bgGradient: 'from-yellow-500/20 to-amber-600/10',
                borderColor: 'border-yellow-500/40',
                glowColor: 'shadow-yellow-500/20',
                scale: 'scale-110 z-10',
            };
        case 2:
            return {
                icon: '🥈',
                bgGradient: 'from-gray-400/20 to-slate-500/10',
                borderColor: 'border-gray-400/40',
                glowColor: 'shadow-gray-400/20',
                scale: 'scale-100',
            };
        case 3:
            return {
                icon: '🥉',
                bgGradient: 'from-orange-600/20 to-amber-700/10',
                borderColor: 'border-orange-600/40',
                glowColor: 'shadow-orange-600/20',
                scale: 'scale-100',
            };
        default:
            return {
                icon: '🏆',
                bgGradient: 'from-primary/20 to-primary/10',
                borderColor: 'border-primary/40',
                glowColor: 'shadow-primary/20',
                scale: 'scale-100',
            };
    }
};

const PodiumCard: React.FC<{
    personal: PersonalRankingItem;
    onClick: () => void;
}> = ({ personal, onClick }) => {
    const medal = getMedalConfig(personal.position);
    const tierConfig = TIER_CONFIG[personal.tier];

    return (
        <div
            onClick={onClick}
            className={`
        relative cursor-pointer transition-all duration-300
        ${medal.scale} hover:scale-105
        bg-gradient-to-br ${medal.bgGradient}
        border ${medal.borderColor}
        rounded-2xl p-5 flex flex-col items-center gap-3
        shadow-lg ${medal.glowColor} hover:shadow-xl
      `}
        >
            {/* Position Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-3xl">
                {medal.icon}
            </div>

            {/* Avatar */}
            <div className={`
        w-20 h-20 rounded-full bg-gradient-to-br from-gray-700 to-gray-800
        flex items-center justify-center border-2 ${medal.borderColor}
        mt-2
      `}>
                {personal.avatarUrl ? (
                    <img
                        src={personal.avatarUrl}
                        alt={personal.name}
                        className="w-full h-full rounded-full object-cover"
                    />
                ) : (
                    <span className="text-2xl font-bold text-gray-400">
                        {personal.name.charAt(0)}
                    </span>
                )}
            </div>

            {/* Name */}
            <div className="text-center">
                <h3 className="text-white font-semibold text-sm truncate max-w-[140px]">
                    {personal.name}
                </h3>
                <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="text-xs text-gray-400">{personal.city}, {personal.state}</span>
                    {personal.crefVerified && (
                        <CheckCircle size={12} className="text-primary" />
                    )}
                </div>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center">
                <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-white">{personal.score.toFixed(1)}</span>
                    <span className="text-xs text-gray-400">pts</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                    <span>{tierConfig.icon}</span>
                    <span className="text-gray-400">{tierConfig.name}</span>
                </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                <div className="flex items-center gap-1">
                    <TrendingUp size={12} className="text-green-400" />
                    <span className="text-green-400">+{personal.avgEvolution.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Users size={12} />
                    <span>{personal.athleteCount}</span>
                </div>
            </div>

            {/* Specialties */}
            <div className="flex flex-wrap justify-center gap-1 mt-1">
                {personal.specialties.slice(0, 2).map((spec, idx) => (
                    <span
                        key={idx}
                        className="px-2 py-0.5 text-[10px] rounded-full bg-white/5 text-gray-400 capitalize"
                    >
                        {spec}
                    </span>
                ))}
            </div>
        </div>
    );
};

export const PersonalTop3: React.FC<PersonalTop3Props> = ({ personals, onSelectPersonal }) => {
    // Get top 3 and arrange as: 2nd, 1st, 3rd
    const top3 = personals.slice(0, 3);
    const arranged = top3.length >= 3
        ? [top3[1], top3[0], top3[2]] // 2nd, 1st, 3rd
        : top3;

    if (arranged.length === 0) {
        return null;
    }

    return (
        <div className="relative">
            {/* Header */}
            <div className="flex items-center justify-center gap-2 mb-6">
                <Trophy className="text-yellow-500" size={24} />
                <h2 className="text-xl font-bold text-white">TOP 3</h2>
            </div>

            {/* Podium Grid */}
            <div className="flex items-end justify-center gap-4">
                {arranged.map((personal) => (
                    <PodiumCard
                        key={personal.personalId}
                        personal={personal}
                        onClick={() => onSelectPersonal(personal.personalId)}
                    />
                ))}
            </div>
        </div>
    );
};
