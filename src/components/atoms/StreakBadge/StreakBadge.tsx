/**
 * StreakBadge - Atom Component
 * 
 * Badge de streak com fogo e contador animado
 */

import React from 'react'
import { Flame } from 'lucide-react'

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
        inline-flex items-center gap-1.5 px-3 py-1.5
        bg-orange-500/10 text-orange-400
        border border-orange-500/20
        rounded-full
        ${className}
      `}
        >
            <Flame size={14} className="fill-orange-500/20" />
            <span className="text-xs font-bold font-mono tracking-wider">
                {streak} DIAS
            </span>
        </div>
    )
}

export default StreakBadge
