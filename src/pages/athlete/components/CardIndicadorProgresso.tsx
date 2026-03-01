import React from 'react'

interface CardIndicadorProgressoProps {
    label: string
    valorAtual: number
    valorMeta: number
    unidade?: string
    cor?: string
    isInverse?: boolean
}

export function CardIndicadorProgresso({
    label,
    valorAtual,
    valorMeta,
    unidade = '',
    cor = '#8B5CF6',
    isInverse = false
}: CardIndicadorProgressoProps) {
    // Cálculo de percentual
    // Se for inverso (ex: BF), menor é melhor. 
    // Mas para a barra, queremos mostrar o progresso em direção à meta.
    // Proporção: (Atual - Baseline) / (Meta - Baseline) ? Simplificaremos.

    const progressText = unidade === '%' ? `${valorAtual}%` : valorAtual.toFixed(2)
    const targetText = unidade === '%' ? `${valorMeta}%` : valorMeta.toFixed(2)

    return (
        <div className="max-w-2xl mx-auto px-6 mt-4">
            <div className="p-4 bg-gradient-to-br from-[#0C1220] to-[#0A0F1C] rounded-2xl border border-white/5 shadow-lg">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                        {label}
                    </span>
                    <div className="flex items-center gap-1.5">
                        <span className="text-white font-black text-lg">{progressText}</span>
                        <span className="text-gray-600 text-[10px] font-bold">{unidade}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{
                                width: '70%', // Fallback ou cálculo real se tivéssemos baseline
                                backgroundColor: cor
                            }}
                        />
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                        <span className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter">Meta</span>
                        <span className="text-[11px] font-black text-emerald-400">{targetText}{unidade}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
