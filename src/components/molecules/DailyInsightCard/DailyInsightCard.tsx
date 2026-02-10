/**
 * DailyInsightCard - Molecule Component
 * 
 * Card de insight da IA para daily tracking (substitui InsightCard para evitar conflito de tipos)
 */

import React from 'react'
import type { Insight } from '../../../types/daily-tracking'

export interface DailyInsightCardProps {
    insight: Insight
    className?: string
}

const TIPO_COLORS = {
    alerta: 'border-red-500/30 bg-red-500/10',
    dica: 'border-blue-500/30 bg-blue-500/10',
    elogio: 'border-green-500/30 bg-green-500/10',
    lembrete: 'border-amber-500/30 bg-amber-500/10',
}

const TIPO_TEXT_COLORS = {
    alerta: 'text-red-300',
    dica: 'text-blue-300',
    elogio: 'text-green-300',
    lembrete: 'text-amber-300',
}

/**
 * Card de insight inteligente da IA para Daily Tracking
 * 
 * @example
 * <DailyInsightCard
 *   insight={{
 *     tipo: 'dica',
 *     icone: '💡',
 *     mensagem: 'Faltam 100g de proteína...',
 *     acao: { label: 'Ver sugestões', callback: () => {} }
 *   }}
 * />
 */
export const DailyInsightCard: React.FC<DailyInsightCardProps> = ({
    insight,
    className = '',
}) => {
    return (
        <div
            className={`
        border-2 rounded-lg p-4
        ${TIPO_COLORS[insight.tipo]}
        ${className}
      `}
        >
            <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{insight.icone}</span>

                <div className="flex-1">
                    <p className={`text-sm font-medium ${TIPO_TEXT_COLORS[insight.tipo]}`}>
                        {insight.mensagem}
                    </p>

                    {insight.acao && (
                        <button
                            onClick={insight.acao.callback}
                            className="mt-2 text-xs font-bold text-white/80 hover:text-white
                underline transition-colors"
                        >
                            {insight.acao.label} →
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DailyInsightCard
