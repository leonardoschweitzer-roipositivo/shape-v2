/**
 * ListaProporcoesResumo Component
 * 
 * Lista das top 3 proporções do atleta
 */

import React from 'react'
import { ProporcaoResumo } from '../../../types/athlete-portal'

interface ListaProporcoesResumoProps {
    proporcoes: ProporcaoResumo[]
}

const CLASSIFICATION_COLORS = {
    'INICIANTE': 'bg-gray-500',
    'EVOLUINDO': 'bg-blue-500',
    'QUASE LÁ': 'bg-yellow-500',
    'SHAPE MODELO': 'bg-teal-500',
    'DEUS GREGO': 'bg-purple-500'
}

function ProporcaoCard({ proporcao }: { proporcao: ProporcaoResumo }) {
    const barColor = CLASSIFICATION_COLORS[proporcao.classificacao] || 'bg-gray-500'

    return (
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{proporcao.emoji}</span>
                    <h4 className="text-sm font-semibold text-white">{proporcao.nome}</h4>
                </div>
                <span className="text-xs font-medium text-gray-400 uppercase">
                    {proporcao.classificacao}
                </span>
            </div>

            {/* Valores */}
            <div className="flex items-baseline gap-2 mb-3">
                <span className="text-2xl font-bold text-white">
                    {proporcao.atual.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500">
                    / {proporcao.meta.toFixed(2)}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-2">
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${barColor} transition-all duration-500`}
                        style={{ width: `${Math.min(100, proporcao.percentual)}%` }}
                    />
                </div>
            </div>

            {/* Percentual */}
            <div className="text-right">
                <span className="text-xs font-medium text-gray-400">
                    {proporcao.percentual}% da meta
                </span>
            </div>
        </div>
    )
}

export function ListaProporcoesResumo({ proporcoes }: ListaProporcoesResumoProps) {
    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider px-1">
                Top 3 Proporções
            </h3>
            {proporcoes.map((proporcao) => (
                <ProporcaoCard key={proporcao.nome} proporcao={proporcao} />
            ))}
        </div>
    )
}
