/**
 * DicaCoach Component
 * 
 * Card com dica contextual do Coach IA
 */

import React from 'react'
import { Lightbulb, AlertTriangle, Sparkles, MessageCircle } from 'lucide-react'
import { DicaCoach as DicaCoachType } from '../../../types/athlete-portal'

interface DicaCoachProps {
    dica: DicaCoachType
    onFalarComCoach: () => void
}

const TIPO_CONFIG = {
    dica: {
        icon: Lightbulb,
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30',
        iconColor: 'text-blue-400',
        title: '💡 DICA DO COACH'
    },
    alerta: {
        icon: AlertTriangle,
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/30',
        iconColor: 'text-orange-400',
        title: '⚠️ ALERTA DO COACH'
    },
    elogio: {
        icon: Sparkles,
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/30',
        iconColor: 'text-purple-400',
        title: '✨ PARABÉNS!'
    }
}

export function DicaCoach({ dica, onFalarComCoach }: DicaCoachProps) {
    const config = TIPO_CONFIG[dica.tipo]
    const Icon = config.icon

    return (
        <div className={`rounded-xl p-6 border ${config.bgColor} ${config.borderColor}`}>
            <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center`}>
                    <Icon size={20} className={config.iconColor} />
                </div>
                <h3 className={`text-sm font-semibold ${config.iconColor}`}>
                    {config.title}
                </h3>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed mb-4">
                {dica.mensagem}
            </p>

            <button
                onClick={dica.acao?.callback || onFalarComCoach}
                className={`
          w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-colors
          flex items-center justify-center gap-2
          ${config.bgColor} hover:opacity-80 border ${config.borderColor} ${config.iconColor}
        `}
            >
                <MessageCircle size={16} />
                {dica.acao?.label || 'FALAR COM O COACH'}
            </button>
        </div>
    )
}
