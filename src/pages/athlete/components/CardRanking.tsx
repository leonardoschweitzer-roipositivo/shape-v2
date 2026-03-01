import React from 'react'
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { CardRankingProps } from './HomeAtletaTypes'

function MovimentoIndicador({ valor }: { valor: number }) {
    if (valor > 0) {
        return (
            <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                <TrendingUp size={12} />↑ Subiu {valor} posições
            </span>
        )
    } else if (valor < 0) {
        return (
            <span className="flex items-center gap-1 text-red-400 text-xs font-bold">
                <TrendingDown size={12} />↓ Caiu {Math.abs(valor)} posições
            </span>
        )
    }
    return (
        <span className="flex items-center gap-1 text-gray-500 text-xs">
            <Minus size={12} /> Manteve
        </span>
    )
}

export function CardRanking({
    nomeContexto,
    posicaoGeral,
    totalParticipantes,
    percentilGeral,
    posicaoEvolucao,
    percentilEvolucao,
    movimentoGeral,
    movimentoEvolucao,
    atletaParticipa,
}: CardRankingProps) {
    if (!atletaParticipa) return null

    return (
        <div className="max-w-2xl mx-auto px-6 mt-4">
            <div className="p-5 bg-gradient-to-br from-[#0C1220] to-[#0A0F1C] rounded-2xl border border-white/5 shadow-xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-2">
                        <Trophy className="text-amber-400" size={16} />
                        <span className="text-white font-black text-sm tracking-wider uppercase">
                            Hall dos Deuses
                        </span>
                    </div>
                    <span className="text-gray-500 text-[10px] font-bold tracking-widest uppercase">
                        {nomeContexto}
                    </span>
                </div>

                {/* Ranking Geral */}
                <div className="mb-5">
                    <span className="text-gray-500 text-[10px] font-bold tracking-[0.15em] uppercase">
                        SUA POSIÇÃO GERAL
                    </span>
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-white text-3xl font-black">
                                #{posicaoGeral}
                            </span>
                            <span className="text-gray-600 text-xs font-medium">
                                de {totalParticipantes}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                                    style={{ width: `${100 - percentilGeral}%` }}
                                />
                            </div>
                            <span className="text-gray-400 text-xs font-bold">
                                Top {percentilGeral}%
                            </span>
                        </div>
                    </div>
                    <div className="mt-1.5">
                        <MovimentoIndicador valor={movimentoGeral} />
                    </div>
                </div>

                {/* Separador */}
                <div className="border-t border-white/5 my-4" />

                {/* Ranking de Evolução */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🔥</span>
                        <span className="text-gray-400 text-[10px] font-bold tracking-[0.15em] uppercase">
                            Ranking de Evolução (Mês)
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-white text-2xl font-black">
                                #{posicaoEvolucao}
                            </span>
                            <span className="text-gray-600 text-xs font-medium">
                                de {totalParticipantes}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
                                    style={{ width: `${100 - percentilEvolucao}%` }}
                                />
                            </div>
                            <span className="text-orange-400 text-xs font-bold">
                                Top {percentilEvolucao}%
                            </span>
                        </div>
                    </div>
                    <div className="mt-1.5">
                        <MovimentoIndicador valor={movimentoEvolucao} />
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-4 text-right">
                    <button className="text-gray-400 text-xs font-bold hover:text-indigo-300 transition-colors">
                        [Ver ranking →]
                    </button>
                </div>
            </div>
        </div>
    )
}
