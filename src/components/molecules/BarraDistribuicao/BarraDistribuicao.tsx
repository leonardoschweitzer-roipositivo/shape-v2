import React from 'react'

export interface BarraDistribuicaoProps {
    dados: {
        label: string
        emoji: string
        valor: number
        percentual: number
        cor: string
    }[]
    mostrarPercentual?: boolean
    mostrarValor?: boolean
}

/**
 * Componente de barras de distribuição com design refinado.
 * Minimalista, elegante e focado em visualização técnica.
 */
export const BarraDistribuicao: React.FC<BarraDistribuicaoProps> = ({
    dados,
    mostrarPercentual = true,
    mostrarValor = true
}) => {
    return (
        <div className="space-y-6">
            {dados.map((item, index) => (
                <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-lg filter drop-shadow-sm">{item.emoji}</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {mostrarValor && (
                                <span className="text-sm font-black text-white italic tracking-tighter">
                                    {item.valor}
                                </span>
                            )}
                            {mostrarPercentual && (
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                                    {item.percentual}%
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div
                            className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                            style={{
                                width: `${item.percentual}%`,
                                backgroundColor: item.cor
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}
