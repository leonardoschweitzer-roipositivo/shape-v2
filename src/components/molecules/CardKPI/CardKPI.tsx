import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export interface CardKPIProps {
    icone: React.ReactNode
    titulo: string
    valorPrincipal: number | string
    unidade?: string
    subtitulo?: string
    variacao?: {
        valor: number
        tipo: 'PERCENTUAL' | 'ABSOLUTO'
        direcao: 'UP' | 'DOWN' | 'STABLE'
    }
}

/**
 * Card de KPI reutilizável com design refinado.
 * Minimalista, elegante e focado nos dados.
 */
export const CardKPI: React.FC<CardKPIProps> = ({
    icone,
    titulo,
    valorPrincipal,
    unidade,
    subtitulo,
    variacao
}) => {
    const getVariacaoColor = () => {
        if (!variacao) return 'text-gray-500'
        if (variacao.direcao === 'UP') return 'text-green-400'
        if (variacao.direcao === 'DOWN') return 'text-red-400'
        return 'text-gray-500'
    }

    const getVariacaoIcon = () => {
        if (!variacao) return null
        if (variacao.direcao === 'UP') return <TrendingUp className="w-3 h-3" />
        if (variacao.direcao === 'DOWN') return <TrendingDown className="w-3 h-3" />
        return <Minus className="w-3 h-3" />
    }

    const formatVariacao = () => {
        if (!variacao) return null
        const valor = Math.abs(variacao.valor)
        const prefix = variacao.direcao === 'UP' ? '+' : variacao.direcao === 'DOWN' ? '-' : ''
        return variacao.tipo === 'PERCENTUAL' ? `${prefix}${valor}%` : `${prefix}${valor}`
    }

    return (
        <div className="bg-card-dark border border-card-border rounded-xl p-5 hover:border-primary/30 transition-all group overflow-hidden relative">
            <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                    {icone}
                </div>
                {variacao && (
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-black italic tracking-tighter ${getVariacaoColor()}`}>
                        {getVariacaoIcon()}
                        <span>{formatVariacao()}</span>
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.15em] leading-none mb-1">
                    {titulo}
                </h3>

                <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-white tracking-tighter">
                        {valorPrincipal}
                    </span>
                    {unidade && (
                        <span className="text-sm font-bold text-gray-600 uppercase italic">
                            {unidade}
                        </span>
                    )}
                </div>

                {subtitulo && (
                    <p className="text-[10px] text-gray-500 font-medium leading-tight mt-2 border-t border-white/5 pt-2">
                        {subtitulo}
                    </p>
                )}
            </div>

            {/* Subtile indicator brush */}
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    )
}
