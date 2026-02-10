/**
 * StreakDisplay - Visualização do streak com animação de fogo
 */

import React from 'react'
import type { StreakSystem } from '../../../types/gamification'

interface StreakDisplayProps {
    streak: StreakSystem
    size?: 'sm' | 'md' | 'lg'
    showMilestone?: boolean
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({
    streak,
    size = 'md',
    showMilestone = true,
}) => {
    const sizeClasses = {
        sm: 'text-2xl',
        md: 'text-3xl',
        lg: 'text-4xl',
    }

    const numberSizeClasses = {
        sm: 'text-lg',
        md: 'text-2xl',
        lg: 'text-3xl',
    }

    const getStreakColor = () => {
        if (streak.atual >= 30) return '#F59E0B' // Laranja/Dourado
        if (streak.atual >= 14) return '#EF4444' // Vermelho forte
        if (streak.atual >= 7) return '#F97316'  // Laranja
        return '#6B7280' // Cinza
    }

    const getStreakEmoji = () => {
        if (streak.atual >= 30) return '🔥🔥🔥'
        if (streak.atual >= 14) return '🔥🔥'
        if (streak.atual >= 7) return '🔥'
        return '⚡'
    }

    const progressoMilestone = streak.proximaMilestone > 0
        ? (streak.atual / streak.proximaMilestone) * 100
        : 0

    return (
        <div className="flex flex-col items-center gap-2">
            {/* Ícone e número */}
            <div className="flex items-center gap-2">
                <div
                    className={`${sizeClasses[size]} ${streak.atual > 0 ? 'animate-pulse' : ''}`}
                >
                    {getStreakEmoji()}
                </div>

                <div className="flex flex-col items-center">
                    <div
                        className={`${numberSizeClasses[size]} font-bold`}
                        style={{ color: getStreakColor() }}
                    >
                        {streak.atual}
                    </div>
                    <div className="text-xs text-gray-400 font-medium">
                        {streak.atual === 1 ? 'dia' : 'dias'}
                    </div>
                </div>
            </div>

            {/* Mensagem */}
            <div className="text-xs text-center text-gray-400">
                {streak.atual === 0 && 'Comece seu streak hoje!'}
                {streak.atual > 0 && streak.atual < 7 && 'Continue assim!'}
                {streak.atual >= 7 && streak.atual < 14 && 'Uma semana incrível!'}
                {streak.atual >= 14 && streak.atual < 30 && 'Você está no fogo! 🔥'}
                {streak.atual >= 30 && 'Lendário! 👑'}
            </div>

            {/* Recorde */}
            {streak.recorde > streak.atual && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span>🏆</span>
                    <span>Recorde: {streak.recorde} dias</span>
                </div>
            )}

            {/* Progresso para próxima milestone */}
            {showMilestone && streak.proximaMilestone > streak.atual && (
                <div className="w-full max-w-xs">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Próxima conquista</span>
                        <span>{streak.proximaMilestone} dias</span>
                    </div>

                    <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${Math.min(100, progressoMilestone)}%`,
                                backgroundColor: getStreakColor(),
                            }}
                        />
                    </div>

                    <div className="text-center text-xs text-gray-500 mt-1">
                        Faltam {streak.proximaMilestone - streak.atual} dias
                    </div>
                </div>
            )}
        </div>
    )
}

export default StreakDisplay
