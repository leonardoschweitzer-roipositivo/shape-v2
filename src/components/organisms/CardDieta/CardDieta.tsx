/**
 * CardDieta Component
 * 
 * Card de dieta do dia com barras de progresso para macros
 * Botões split: Registrar via texto OU via foto
 */

import React from 'react'
import { UtensilsCrossed, Plus, Camera } from 'lucide-react'
import { DietOfDay } from '../../../types/athlete-portal'

interface CardDietaProps {
    dieta: DietOfDay
    onRegistrarRefeicao: () => void
    onCapturarFoto?: () => void
}

interface MacroBarProps {
    label: string
    atual: number
    meta: number
    percentual: number
    unidade: string
    color: 'indigo' | 'purple' | 'orange' | 'yellow'
}

const COLOR_CLASSES = {
    indigo: 'bg-indigo-500',
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

export function CardDieta({ dieta, onRegistrarRefeicao, onCapturarFoto }: CardDietaProps) {
    return (
        <div className="bg-surface-deep rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <UtensilsCrossed size={20} className="text-indigo-400" />
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
                    color="indigo"
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

            {/* Botões split: Texto + Foto */}
            <div className="flex gap-2.5">
                <button
                    onClick={onRegistrarRefeicao}
                    className="flex-1 py-3 px-4 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-sm font-bold text-indigo-400 transition-colors flex items-center justify-center gap-2"
                >
                    <Plus size={16} />
                    REGISTRAR
                </button>
                {onCapturarFoto && (
                    <button
                        onClick={onCapturarFoto}
                        className="py-3 px-5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-sm font-bold text-emerald-400 transition-colors flex items-center justify-center gap-2"
                    >
                        <Camera size={16} />
                        FOTO
                    </button>
                )}
            </div>
        </div>
    )
}
