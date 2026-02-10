/**
 * DailyInsightCard - Molecule Component
 * 
 * Card de insight da IA para daily tracking (substitui InsightCard para evitar conflito de tipos)
 */

import React from 'react'
import { AlertTriangle, Lightbulb, ThumbsUp, Bell } from 'lucide-react'
import type { Insight } from '../../../types/daily-tracking'

export interface DailyInsightCardProps {
    insight: Insight
    className?: string
}

const TIPO_STYLES = {
    alerta: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        text: 'text-red-400',
        icon: AlertTriangle
    },
    dica: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        text: 'text-blue-400',
        icon: Lightbulb
    },
    elogio: {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        text: 'text-emerald-400',
        icon: ThumbsUp
    },
    lembrete: {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        text: 'text-amber-400',
        icon: Bell
    },
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
    const style = TIPO_STYLES[insight.tipo]
    const Icon = style.icon

    return (
        <div
            className={`
        border rounded-xl p-4
        ${style.bg} ${style.border}
        ${className}
      `}
        >
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-white/5 ${style.text}`}>
                    <Icon size={18} />
                </div>

                <div className="flex-1 pt-0.5">
                    <p className={`text-sm font-medium ${style.text}`}>
                        {insight.mensagem}
                    </p>

                    {insight.acao && (
                        <button
                            onClick={insight.acao.callback}
                            className={`mt-2 text-xs font-bold hover:underline transition-colors ${style.text}`}
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
