/**
 * ScoreGeralAvaliacao Component
 * 
 * Card hero com score circular + 3 pilares da avaliação
 * Mobile-first, design premium dark theme
 */

import React, { memo } from 'react'

interface ScoreGeralAvaliacaoProps {
    scoreGeral: number
    classificacao: string
    emoji: string
    scores: {
        proporcoes: { valor: number; peso: number; contribuicao: number }
        composicao: { valor: number; peso: number; contribuicao: number }
        simetria: { valor: number; peso: number; contribuicao: number }
    }
    penalizacoes?: {
        vTaper: number
        cintura: number
    }
}

function getScoreColor(score: number): string {
    if (score >= 90) return '#EAB308'   // Gold
    if (score >= 80) return '#8B5CF6'   // Purple
    if (score >= 70) return '#3B82F6'   // Blue
    if (score >= 60) return '#06B6D4'   // Cyan
    if (score >= 50) return '#10B981'   // Green
    return '#6B7280'                     // Gray
}

export const ScoreGeralAvaliacao = memo(function ScoreGeralAvaliacao({
    scoreGeral,
    classificacao,
    emoji,
    scores,
    penalizacoes,
}: ScoreGeralAvaliacaoProps) {
    const color = getScoreColor(scoreGeral)
    const circumference = 2 * Math.PI * 54 // radius = 54
    const dashOffset = circumference - (circumference * Math.min(100, scoreGeral)) / 100

    const pilares = [
        { label: 'Proporções', peso: '40%', valor: scores.proporcoes.valor, cor: '#8B5CF6' },
        { label: 'Composição', peso: '35%', valor: scores.composicao.valor, cor: '#3B82F6' },
        { label: 'Simetria', peso: '25%', valor: scores.simetria.valor, cor: '#10B981' },
    ]

    // Cálculo do score bruto antes das penalizações
    const scoreBase =
        (scores.proporcoes.valor * scores.proporcoes.peso) +
        (scores.composicao.valor * scores.composicao.peso) +
        (scores.simetria.valor * scores.simetria.peso)

    const diferencaScore = Math.round(scoreBase - scoreGeral)

    let textoPenalizacao = ''
    if (diferencaScore > 0) {
        const motivos = []
        if (penalizacoes?.cintura && penalizacoes.cintura < 1.0) motivos.push('Cintura')
        if (penalizacoes?.vTaper && penalizacoes.vTaper < 1.0) motivos.push('V-Taper')

        textoPenalizacao = motivos.length > 0
            ? `-${diferencaScore} pts (${motivos.join(' e ')})`
            : `-${diferencaScore} pts penalização`
    }

    return (
        <div className="bg-gradient-to-br from-[#0D1425] to-[#0A0F1C] rounded-2xl border border-white/5 p-6">
            {/* Score Circular */}
            <div className="flex flex-col items-center mb-4">
                <div className="relative w-32 h-32">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                        {/* Background circle */}
                        <circle
                            cx="60" cy="60" r="54"
                            fill="none"
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="8"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="60" cy="60" r="54"
                            fill="none"
                            stroke={color}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={dashOffset}
                            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                        />
                    </svg>
                    {/* Score number */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-white">
                            {Math.round(scoreGeral)}
                        </span>
                        <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                            SCORE
                        </span>
                    </div>
                </div>

                {/* Classificação */}
                <div className="mt-3 flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{emoji}</span>
                        <span
                            className="text-sm font-bold uppercase tracking-wider"
                            style={{ color }}
                        >
                            {classificacao}
                        </span>
                    </div>
                    {diferencaScore > 0 && (
                        <span className="text-[10px] text-red-500/90 font-medium mt-1 text-center leading-tight">
                            Bruto {Math.round(scoreBase)} <span className="opacity-50 mx-0.5">•</span> {textoPenalizacao}
                        </span>
                    )}
                </div>
            </div>

            {/* 3 Pilares */}
            <div className="grid grid-cols-3 gap-3">
                {pilares.map((pilar) => (
                    <div
                        key={pilar.label}
                        className="bg-white/[0.03] rounded-xl p-3 text-center border border-white/5"
                    >
                        <span className="text-xl font-black text-white block">
                            {Math.round(pilar.valor)}
                        </span>
                        <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block mt-0.5">
                            {pilar.label}
                        </span>
                        <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                    width: `${Math.min(100, pilar.valor)}%`,
                                    backgroundColor: pilar.cor,
                                }}
                            />
                        </div>
                        <span className="text-[9px] text-gray-600 font-medium mt-1 block">
                            Peso: {pilar.peso}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
})
