/**
 * AssimetriaSection Component
 * 
 * Seção colapsável "Análise de Assimetria" — comparação bilateral E vs D
 * Mostra diferença percentual e status de simetria para cada membro
 */

import React, { memo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { AssimetriaGeral, AssimetriaItem } from '@/types/assessment-evaluation.types'

interface AssimetriaSectionProps {
    assimetria: AssimetriaGeral
}

function AssimetriaRow({ item }: { item: AssimetriaItem }) {
    const statusColors: Record<string, string> = {
        simetrico: 'text-green-400',
        leve: 'text-yellow-400',
        moderada: 'text-orange-400',
        significativa: 'text-red-400',
    }

    const barColor: Record<string, string> = {
        simetrico: 'bg-green-500',
        leve: 'bg-yellow-500',
        moderada: 'bg-orange-500',
        significativa: 'bg-red-500',
    }

    // Barra de diferença visual (0% = centrada, 10%+ = extremo)
    const barWidth = Math.min(100, item.diferencaPercentual * 10) // Escala: 10% diff = barra cheia

    return (
        <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-white">{item.membro}</h4>
                <span className={`text-xs font-bold ${statusColors[item.status] || 'text-gray-400'}`}>
                    {item.emoji} {item.label}
                </span>
            </div>

            {/* E vs D */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    <div className="text-center">
                        <span className="text-[9px] text-gray-600 block">ESQ</span>
                        <span className="text-sm font-bold text-white">
                            {item.ladoEsquerdo.toFixed(1)}
                        </span>
                    </div>
                    <span className="text-gray-600 text-xs">vs</span>
                    <div className="text-center">
                        <span className="text-[9px] text-gray-600 block">DIR</span>
                        <span className="text-sm font-bold text-white">
                            {item.ladoDireito.toFixed(1)}
                        </span>
                    </div>
                </div>
                <span className="text-xs text-gray-400 font-medium">
                    Δ {item.diferencaPercentual.toFixed(1)}%
                </span>
            </div>

            {/* Barra de diferença */}
            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                <div
                    className={`h-full rounded-full ${barColor[item.status] || 'bg-gray-500'} transition-all duration-500`}
                    style={{ width: `${Math.max(2, 100 - barWidth)}%` }}
                />
            </div>
        </div>
    )
}

export const AssimetriaSection = memo(function AssimetriaSection({
    assimetria,
}: AssimetriaSectionProps) {
    const [expanded, setExpanded] = useState(true)

    return (
        <div className="bg-gradient-to-br from-[#0D1425] to-[#0A0F1C] rounded-2xl border border-white/5 overflow-hidden">
            {/* Header colapsável */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between px-5 py-4"
            >
                <div className="flex items-center gap-3">
                    <span className="text-lg">⚖️</span>
                    <div className="text-left">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                            Análise de Assimetria
                        </h3>
                        <span className="text-[10px] text-gray-500">
                            Comparação bilateral E × D
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">
                        {assimetria.scoreGeral}
                    </span>
                    <ChevronDown
                        size={18}
                        className={`text-gray-500 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                    />
                </div>
            </button>

            {/* Conteúdo */}
            <div
                className={`transition-all duration-300 ease-in-out ${expanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden`}
            >
                <div className="px-5 pb-5 space-y-3">
                    {assimetria.membros.map((item) => (
                        <AssimetriaRow key={item.membro} item={item} />
                    ))}

                    {/* Classificação geral */}
                    <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5 flex items-center justify-between">
                        <span className="text-xs text-gray-400 font-medium">Simetria Geral</span>
                        <span className="text-sm font-bold text-white">
                            {assimetria.emoji} {assimetria.classificacao}
                        </span>
                    </div>

                    {assimetria.membros.length === 0 && (
                        <div className="text-center py-8">
                            <span className="text-gray-600 text-sm">
                                Nenhum dado de assimetria disponível
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
})
