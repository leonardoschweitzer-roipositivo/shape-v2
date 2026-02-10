/**
 * CardDieta Component
 * 
 * Card de dieta do dia com barras de progresso para macros
 */

import React from 'react'
import { UtensilsCrossed, Plus } from 'lucide-react'
import { DietOfDay } from '../../../types/athlete-portal'

interface CardDietaProps {
    dieta: DietOfDay
    onRegistrarRefeicao: () => void
}

interface MacroBarProps {
    label: string
    atual: number
    meta: number
    percentual: number
    unidade: string
    color: 'teal' | 'purple' | 'orange' | 'yellow'
}

const COLOR_CLASSES = {
    teal: 'bg-teal-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500'
}

function MacroBar({ label, atual, meta, percentual, unidade, color }: MacroBarProps) {
    const barColor = COLOR_CLASSES[color]
    const displayPercentual = Math.min(100, percentual)

    return (
        <div>
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-gray-400">{label}</span>
                <span className="text-xs text-gray-500">{percentual}%</span>
            </div>

            <div className="flex items-end gap-2 mb-2">
                <span className="text-lg font-bold text-white">
                    {atual.toLocaleString('pt-BR')}
                    <span className="text-sm text-gray-500 font-normal">{unidade}</span>
                </span>
                <span className="text-xs text-gray-600 pb-0.5">
                    / {meta.toLocaleString('pt-BR')}{unidade}
                </span>
            </div>

            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                    className={`h-full ${barColor} transition-all duration-500 ease-out`}
                    style={{ width: `${displayPercentual}%` }}
                />
            </div>
        </div>
    )
}

export function CardDieta({ dieta, onRegistrarRefeicao }: CardDietaProps) {
    return (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                    <UtensilsCrossed size={20} className="text-teal-400" />
                </div>
                <div>
                    <h3 className="text-base font-semibold text-white">DIETA DE HOJE</h3>
                </div>
            </div>

            <div className="space-y-5 mb-5">
                <MacroBar
                    label="Calorias"
                    atual={dieta.consumidoCalorias}
                    meta={dieta.metaCalorias}
                    percentual={dieta.percentualCalorias}
                    unidade="kcal"
                    color="teal"
                />

                <MacroBar
                    label="Proteína"
                    atual={dieta.consumidoProteina}
                    meta={dieta.metaProteina}
                    percentual={dieta.percentualProteina}
                    unidade="g"
                    color="purple"
                />

                <MacroBar
                    label="Carboidratos"
                    atual={dieta.consumidoCarbos}
                    meta={dieta.metaCarbos}
                    percentual={dieta.percentualCarbos}
                    unidade="g"
                    color="orange"
                />

                <MacroBar
                    label="Gordura"
                    atual={dieta.consumidoGordura}
                    meta={dieta.metaGordura}
                    percentual={dieta.percentualGordura}
                    unidade="g"
                    color="yellow"
                />
            </div>

            <button
                onClick={onRegistrarRefeicao}
                className="w-full py-3 px-4 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 rounded-lg text-sm font-semibold text-teal-400 transition-colors flex items-center justify-center gap-2"
            >
                <Plus size={18} />
                REGISTRAR REFEIÇÃO
            </button>
        </div>
    )
}
