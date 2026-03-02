/**
 * DiagnosticoSection Component
 * 
 * Seção colapsável "Diagnóstico Estético" — composição corporal
 * Mostra BF%, FFMI, Massa Magra/Gorda e classificação
 */

import React, { memo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { DiagnosticoEstetico } from '@/types/assessment-evaluation.types'

interface DiagnosticoSectionProps {
    diagnostico: DiagnosticoEstetico
}

function MetricCard({
    label,
    valor,
    unidade,
    score,
    destaque = false,
}: {
    label: string
    valor: string
    unidade?: string
    score?: number
    destaque?: boolean
}) {
    return (
        <div className={`rounded-xl p-3 border ${destaque
            ? 'bg-indigo-500/10 border-indigo-500/20'
            : 'bg-white/[0.03] border-white/5'
            }`}>
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">
                {label}
            </span>
            <div className="flex items-baseline gap-1 mt-1">
                <span className={`text-xl font-black ${destaque ? 'text-indigo-400' : 'text-white'}`}>
                    {valor}
                </span>
                {unidade && (
                    <span className="text-xs text-gray-500">{unidade}</span>
                )}
            </div>
            {score !== undefined && (
                <div className="mt-2">
                    <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-indigo-500 transition-all duration-700"
                            style={{ width: `${Math.min(100, score)}%` }}
                        />
                    </div>
                    <span className="text-[9px] text-gray-600 mt-0.5 block">
                        Score: {Math.round(score)}
                    </span>
                </div>
            )}
        </div>
    )
}

export const DiagnosticoSection = memo(function DiagnosticoSection({
    diagnostico,
}: DiagnosticoSectionProps) {
    const [expanded, setExpanded] = useState(true)

    return (
        <div className="bg-gradient-to-br from-[#0D1425] to-[#0A0F1C] rounded-2xl border border-white/5 overflow-hidden">
            {/* Header colapsável */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between px-5 py-4"
            >
                <div className="flex items-center gap-3">
                    <span className="text-lg">🔬</span>
                    <div className="text-left">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                            Diagnóstico Estético
                        </h3>
                        <span className="text-[10px] text-gray-500">Composição corporal</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">
                        {Math.round(diagnostico.scoreTotal)}
                    </span>
                    <ChevronDown
                        size={18}
                        className={`text-gray-500 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                    />
                </div>
            </button>

            {/* Conteúdo */}
            <div
                className={`transition-all duration-300 ease-in-out ${expanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden`}
            >
                <div className="px-5 pb-5 space-y-3">
                    {/* Grid de métricas */}
                    <div className="grid grid-cols-2 gap-3">
                        <MetricCard
                            label="Gordura Corporal"
                            valor={diagnostico.bf.toFixed(1)}
                            unidade="%"
                            score={diagnostico.scoreBF}
                            destaque
                        />
                        <MetricCard
                            label="FFMI"
                            valor={diagnostico.ffmi.toFixed(1)}
                            score={diagnostico.scoreFFMI}
                        />
                        <MetricCard
                            label="Massa Magra"
                            valor={diagnostico.massaMagra.toFixed(1)}
                            unidade="kg"
                        />
                        <MetricCard
                            label="Massa Gorda"
                            valor={diagnostico.massaGorda.toFixed(1)}
                            unidade="kg"
                        />
                    </div>

                    {/* Classificação */}
                    <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5 flex items-center justify-between">
                        <span className="text-xs text-gray-400 font-medium">Classificação</span>
                        <span className="text-sm font-bold text-white">
                            {diagnostico.emoji} {diagnostico.classificacao}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
})
