/**
 * ProportionBar Component
 * 
 * Barra visual de escala 75-110% conforme escalas-proporcoes.md
 * 5 faixas coloridas + marcador GOLDEN + indicador VOCÊ
 * Mobile-first
 */

import React, { memo, useMemo } from 'react'
import type { ClassificacaoProporcao } from '@/types/assessment-evaluation.types'
import {
    percentualParaPosicaoBarra,
    getPosicaoGolden,
    getFaixasVisuais,
    getClassificacao,
    getLabelContextual,
    calcularPercentualInverso,
} from '@/utils/assessmentCalculations'

interface ProportionBarProps {
    /** Nome da proporção ex: "Shape-V" */
    nome: string
    /** Índice atual calculado */
    indiceAtual: number
    /** Índice meta/ideal */
    indiceMeta: number
    /** Se é proporção inversa (menor é melhor) */
    ehInversa?: boolean
    /** Fórmula base ex: "Ombros ÷ Cintura" */
    formulaBase?: string
    /** Medida atual em cm */
    medidaAtual?: number
    /** Medida meta em cm */
    medidaMeta?: number
}

export const ProportionBar = memo(function ProportionBar({
    nome,
    indiceAtual,
    indiceMeta,
    ehInversa = false,
    formulaBase,
    medidaAtual,
    medidaMeta,
}: ProportionBarProps) {
    const resultado = useMemo(() => {
        const percentualDoIdeal = ehInversa
            ? calcularPercentualInverso(indiceAtual, indiceMeta)
            : Math.min(115, (indiceAtual / indiceMeta) * 100)

        const classificacao = getClassificacao(percentualDoIdeal)
        const posicaoBarra = percentualParaPosicaoBarra(percentualDoIdeal)
        const label = getLabelContextual(percentualDoIdeal)

        return { percentualDoIdeal, classificacao, posicaoBarra, label }
    }, [indiceAtual, indiceMeta, ehInversa])

    const faixas = useMemo(() => getFaixasVisuais(), [])
    const posicaoGolden = useMemo(() => getPosicaoGolden(), [])

    const diferencaCm = medidaAtual && medidaMeta
        ? Math.round((medidaMeta - medidaAtual) * 10) / 10
        : null

    return (
        <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
            {/* Header */}
            <div className="flex items-start justify-between mb-1">
                <div className="flex-1">
                    <h4 className="text-sm font-bold text-white">{nome}</h4>
                    {formulaBase && (
                        <span className="text-[10px] text-gray-600 font-medium">
                            {formulaBase}
                        </span>
                    )}
                </div>
                <div className="text-right">
                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-white">
                            {indiceAtual.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500">
                            / {indiceMeta.toFixed(2)}
                        </span>
                    </div>
                    {diferencaCm !== null && diferencaCm !== 0 && (
                        <span className={`text-[10px] font-medium ${diferencaCm > 0 ? 'text-blue-400' : 'text-green-400'}`}>
                            {diferencaCm > 0 ? `+${diferencaCm}cm para meta` : `${Math.abs(diferencaCm)}cm acima`}
                        </span>
                    )}
                </div>
            </div>

            {/* Barra Visual */}
            <div className="relative h-2 mt-3 mb-6 rounded-full overflow-visible">
                {/* Faixas coloridas */}
                {faixas.map((faixa, i) => (
                    <div
                        key={faixa.id}
                        className="absolute top-0 h-full"
                        style={{
                            left: `${faixa.inicio}%`,
                            width: `${faixa.largura}%`,
                            backgroundColor: faixa.cor,
                            borderRadius: i === 0
                                ? '4px 0 0 4px'
                                : i === faixas.length - 1
                                    ? '0 4px 4px 0'
                                    : '0',
                            opacity: 0.6,
                        }}
                    />
                ))}

                {/* Marcador GOLDEN */}
                <div
                    className="absolute -top-1 flex flex-col items-center z-10"
                    style={{ left: `${posicaoGolden}%`, transform: 'translateX(-50%)' }}
                >
                    <span className="text-[10px] text-yellow-500 font-bold">★</span>
                    <div className="w-px h-4 bg-yellow-500/50" />
                </div>

                {/* Indicador VOCÊ */}
                <div
                    className="absolute -top-1.5 flex flex-col items-center z-20"
                    style={{
                        left: `${resultado.posicaoBarra}%`,
                        transform: 'translateX(-50%)',
                        transition: 'left 0.5s ease-out',
                    }}
                >
                    <div
                        className="w-3.5 h-3.5 rounded-full border-2 shadow-lg"
                        style={{
                            backgroundColor: resultado.classificacao.corTexto,
                            borderColor: resultado.classificacao.cor,
                            boxShadow: `0 0 8px ${resultado.classificacao.cor}50`,
                        }}
                    />
                </div>
            </div>

            {/* Label + Badge */}
            <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-500 font-medium">
                    {Math.round(resultado.percentualDoIdeal)}% do ideal
                </span>
                <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                    style={{
                        color: resultado.classificacao.corTexto,
                        borderColor: `${resultado.classificacao.cor}40`,
                        backgroundColor: `${resultado.classificacao.cor}15`,
                    }}
                >
                    {resultado.classificacao.emoji} {resultado.classificacao.labelCurto}
                </span>
            </div>
        </div>
    )
})
