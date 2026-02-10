/**
 * DailyTrackerHeader - Molecule Component
 * 
 * Cabeçalho do card de acompanhamento diário com saudação, nível e streak
 */

import React from 'react'
import { StreakBadge } from '../../atoms/StreakBadge'
import { LevelBadge } from '../LevelBadge'
// import { getSaudacao } from '../../../config/tracker-config' // Removido para customização local
import type { Nivel, XPSystem } from '../../../types/gamification'

export interface DailyTrackerHeaderProps {
    nomeAtleta: string
    streak: number
    nivel?: Nivel
    xpSystem?: XPSystem
    className?: string
}

/**
 * Header do card de acompanhamento diário
 * 
 * @example
 * <DailyTrackerHeader nomeAtleta="João" streak={7} nivel={nivelAtual} xpSystem={xp} />
 */
export const DailyTrackerHeader: React.FC<DailyTrackerHeaderProps> = ({
    nomeAtleta,
    streak,
    nivel,
    xpSystem,
    className = '',
}) => {
    // Saudação sóbria sem emotions
    const getSaudacaoSobria = () => {
        const hora = new Date().getHours()
        if (hora < 12) return 'Bom dia'
        if (hora < 18) return 'Boa tarde'
        return 'Boa noite'
    }

    const saudacao = getSaudacaoSobria()
    const hoje = new Date()
    const dataFormatada = hoje.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long'
    })

    return (
        <div className={`${className}`}>
            {/* Saudação e Data */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">
                        {saudacao}, {nomeAtleta}!
                    </h2>
                    <p className="text-sm text-gray-400">{dataFormatada}</p>
                </div>

                <StreakBadge streak={streak} />
            </div>

            {/* Level Badge (se fornecido) */}
            {nivel && xpSystem && (
                <div className="mt-4">
                    <LevelBadge nivel={nivel} xpSystem={xpSystem} size="md" showProgress={true} />
                </div>
            )}
        </div>
    )
}

export default DailyTrackerHeader
