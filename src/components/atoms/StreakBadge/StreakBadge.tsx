/**
 * StreakBadge - Atom Component
 * 
 * Badge de streak com fogo e contador animado
 */

import React from 'react'

export interface StreakBadgeProps {
    streak: number
    className?: string
}

/**
 * Badge de streak para acompanhamento diário
 * 
 * @example
 * <StreakBadge streak={7} />
 */
export const StreakBadge: React.FC<StreakBadgeProps> = ({
    streak,
    className = ''
}) => {
    if (streak === 0) return null

    return (
        <div
            className={`
        inline-flex items-center gap-1 px-2 py-1
        bg-gradient-to-r from-orange-500/20 to-red-500/20
        border border-orange-500/30
        rounded-full
        ${className}
      `}
        >
            <span className="text-lg animate-pulse">🔥</span>
            <span className="text-sm font-bold text-orange-300">
                {streak}
            </span>
        </div>
    )
}

export default StreakBadge
