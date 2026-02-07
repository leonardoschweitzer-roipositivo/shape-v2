import React from 'react';
import { GamificationData } from '../../../features/dashboard/types';
import { Trophy, Flame, Zap, ChevronRight } from 'lucide-react';

interface AchievementsCardProps {
    data: GamificationData;
}

export const AchievementsCard: React.FC<AchievementsCardProps> = ({ data }) => {
    const { streak, level, currentXp, nextLevelXp, upcomingAchievements } = data;

    const xpPercentage = Math.min(100, (currentXp / nextLevelXp) * 100);

    return (
        <div className="bg-[#131B2C] rounded-2xl p-6 border border-white/5 shadow-lg relative overflow-hidden flex flex-col h-full group hover:border-yellow-500/30 transition-colors">

            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <h4 className="text-gray-400 text-xs font-bold tracking-wider uppercase flex items-center gap-2">
                    <Trophy size={14} className="text-yellow-500" />
                    CONQUISTAS
                </h4>
                <div className="flex items-center gap-2 bg-[#0A0F1C] px-3 py-1 rounded-full border border-yellow-500/20">
                    <span className="text-[10px] text-yellow-500 font-bold uppercase">Nível {level}</span>
                    <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${xpPercentage}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Upcoming List */}
            <div className="space-y-4 mb-6 z-10">
                {upcomingAchievements.map(ach => (
                    <div key={ach.id} className="group/item">
                        <div className="flex justify-between items-center mb-1.5">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{ach.icon}</span>
                                <span className="text-sm text-gray-300 font-medium group-hover/item:text-white transition-colors">{ach.name}</span>
                            </div>
                            <span className="text-xs font-mono text-gray-500">{ach.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-[#0A0F1C] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full transition-all duration-1000"
                                style={{ width: `${ach.progress}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Streak Footer */}
            <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${streak.isActive ? 'bg-orange-500/20 text-orange-500' : 'bg-gray-800 text-gray-500'}`}>
                        <Flame size={18} fill={streak.isActive ? "currentColor" : "none"} />
                    </div>
                    <div>
                        <div className="text-lg font-bold text-white leading-none">{streak.current} dias</div>
                        <div className="text-[10px] text-gray-500 uppercase font-medium mt-0.5">Recorde: {streak.best}</div>
                    </div>
                </div>

                <button className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                    VER TODAS
                    <ChevronRight size={14} />
                </button>
            </div>

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-[60px] translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        </div>
    );
};
