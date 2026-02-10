/**
 * BadgeCard - Card individual de badge/conquista
 */

import React from 'react'
import { Lock } from 'lucide-react'
import type { Badge } from '../../../types/gamification'
import { getCorRaridade } from '../../../services/gamification'

interface BadgeCardProps {
    badge: Badge
    size?: 'sm' | 'md' | 'lg'
    showProgress?: boolean
}

export const BadgeCard: React.FC<BadgeCardProps> = ({
    badge,
    size = 'md',
    showProgress = true,
}) => {
    const sizeClasses = {
        sm: 'w-20 h-24 text-2xl',
        md: 'w-28 h-32 text-3xl',
        lg: 'w-36 h-40 text-4xl',
    }

    const textSizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    }

    const corRaridade = getCorRaridade(badge.raridade)

    return (
        <div
            className={`
        ${sizeClasses[size]}
        rounded-xl
        flex flex-col items-center justify-center
        gap-2 p-3
        border-2
        transition-all duration-200
        ${badge.desbloqueado
                    ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:scale-105 cursor-pointer'
                    : 'bg-gray-900/30 opacity-50 grayscale'
                }
      `}
            style={{
                borderColor: badge.desbloqueado ? corRaridade : '#374151',
            }}
            title={badge.descricao}
        >
            {/* Ícone ou Lock */}
            <div className="relative">
                {badge.desbloqueado ? (
                    <span className="text-4xl">{badge.icone}</span>
                ) : (
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 border border-gray-700">
                        <Lock size={24} className="text-gray-600" />
                    </div>
                )}

                {/* Badge de raridade */}
                <div
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full border border-gray-900"
                    style={{ backgroundColor: corRaridade }}
                    title={badge.raridade}
                />
            </div>

            {/* Nome */}
            <div
                className={`${textSizeClasses[size]} font-bold text-center leading-tight`}
                style={{ color: badge.desbloqueado ? corRaridade : '#6B7280' }}
            >
                {badge.nome}
            </div>

            {/* XP Bonus */}
            {badge.desbloqueado && (
                <div className="flex items-center gap-1 text-xs text-gray-400">
                    <span>⭐</span>
                    <span>+{badge.xpBonus} XP</span>
                </div>
            )}

            {/* Progresso (se aplicável) */}
            {showProgress && badge.progresso && !badge.desbloqueado && (
                <div className="w-full mt-1">
                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full"
                            style={{
                                width: `${(badge.progresso.atual / badge.progresso.total) * 100}%`,
                                backgroundColor: corRaridade,
                            }}
                        />
                    </div>
                    <div className="text-xs text-gray-500 text-center mt-1">
                        {badge.progresso.atual}/{badge.progresso.total}
                    </div>
                </div>
            )}

            {/* Data de desbloqueio */}
            {badge.desbloqueado && badge.dataDesbloqueio && (
                <div className="text-xs text-gray-500 text-center">
                    {new Date(badge.dataDesbloqueio).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                    })}
                </div>
            )}
        </div>
    )
}

export default BadgeCard
