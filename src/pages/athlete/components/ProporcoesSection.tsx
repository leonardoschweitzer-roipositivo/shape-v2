/**
 * ProporcoesSection Component
 * 
 * Seção colapsável "Proporções Áureas" — todas as proporções com barras visuais
 * Usa ProportionBar para cada proporção individual
 */

import React, { memo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { ProportionBar } from './ProportionBar'
import type { ProporcaoDetalhe } from '@/types/assessment-evaluation.types'

interface ProporcoesSectionProps {
    proporcoes: ProporcaoDetalhe[]
    /** Score total de proporções (0-100) */
    scoreTotal: number
}

export const ProporcoesSection = memo(function ProporcoesSection({
    proporcoes,
    scoreTotal,
}: ProporcoesSectionProps) {
    const [expanded, setExpanded] = useState(true)

    return (
        <div className="bg-gradient-to-br from-[#0D1425] to-[#0A0F1C] rounded-2xl border border-white/5 overflow-hidden">
            {/* Header colapsável */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between px-5 py-4"
            >
                <div className="flex items-center gap-3">
                    <span className="text-lg">🏛️</span>
                    <div className="text-left">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                            Proporções Áureas
                        </h3>
                        <span className="text-[10px] text-gray-500">
                            Golden Ratio • {proporcoes.length} proporções
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">
                        {Math.round(scoreTotal)}
                    </span>
                    <ChevronDown
                        size={18}
                        className={`text-gray-500 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                    />
                </div>
            </button>

            {/* Conteúdo */}
            <div
                className={`transition-all duration-300 ease-in-out ${expanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden`}
            >
                <div className="px-5 pb-5 space-y-3">
                    {proporcoes.map((prop) => (
                        <ProportionBar
                            key={prop.nome}
                            nome={prop.nome}
                            indiceAtual={prop.indiceAtual}
                            indiceMeta={prop.indiceMeta}
                            ehInversa={prop.ehInversa}
                            formulaBase={prop.formulaBase}
                            medidaAtual={prop.medidaAtual}
                            medidaMeta={prop.medidaMeta}
                        />
                    ))}

                    {proporcoes.length === 0 && (
                        <div className="text-center py-8">
                            <span className="text-gray-600 text-sm">
                                Nenhuma proporção disponível
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
})
