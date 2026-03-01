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
            <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{label}</span>
                <span className="text-[10px] text-gray-500 font-mono">{percentual}%</span>
            </div>

            <div className="flex items-baseline gap-1 mb-1.5">
                <span className="text-base font-black text-white">
                    {atual.toLocaleString('pt-BR')}
                </span>
                <span className="text-[10px] text-gray-600">
                    / {meta.toLocaleString('pt-BR')}{unidade}
                </span>
            </div>

            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
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
        <div className="bg-[#0C1220] rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                    <UtensilsCrossed size={20} className="text-teal-400" />
                </div>
                <div>
                    <h3 className="text-base font-bold text-white uppercase tracking-wide">DIETA DE HOJE</h3>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
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
                className="w-full py-3 px-4 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-sm font-bold text-indigo-400 transition-colors flex items-center justify-center gap-2"
            >
                <Plus size={18} />
                REGISTRAR REFEIÇÃO
            </button>
        </div>
    )
}
