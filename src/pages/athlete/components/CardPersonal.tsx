import React from 'react'
import { Shield } from 'lucide-react'
import { CardPersonalProps } from './HomeAtletaTypes'

export function CardPersonal({
    nome,
    rankingCidade,
    cidadeSigla,
    exibirRanking,
}: CardPersonalProps) {
    if (!nome) return null

    const renderRanking = () => {
        if (!exibirRanking || !rankingCidade || rankingCidade > 50) return null

        if (rankingCidade <= 10) {
            return (
                <span className="text-amber-400 font-bold text-xs bg-amber-400/10 px-2.5 py-1 rounded-full">
                    ⭐ #{rankingCidade} {cidadeSigla}
                </span>
            )
        }

        return (
            <span className="text-gray-400 font-medium text-xs">
                #{rankingCidade} {cidadeSigla}
            </span>
        )
    }

    return (
        <div className="max-w-2xl mx-auto px-6 mt-4">
            <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#0A0F1C] rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                    <Shield className="text-indigo-400 shrink-0" size={14} />
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                        Personal: <span className="text-white">{nome}</span>
                    </span>
                </div>
                {renderRanking()}
            </div>
        </div>
    )
}
