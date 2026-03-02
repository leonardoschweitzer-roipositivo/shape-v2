import React from 'react'

interface CardIndicadorProgressoProps {
    label: string
    valorAtual: number
    valorMeta: number
    unidade?: string
    cor?: string
    isInverse?: boolean
    subLabel?: string
    subValorAtual?: number
    subValorMeta?: number
    subUnidade?: string
    valorBasal?: number
}

export function CardIndicadorProgresso({
    label,
    valorAtual,
    valorMeta,
    unidade = '',
    cor = '#8B5CF6',
    isInverse = false,
    subLabel,
    subValorAtual,
    subValorMeta,
    subUnidade = '',
    valorBasal
}: CardIndicadorProgressoProps) {
    // Cálculo de percentual baseado em Gap (Basal vs Meta)
    // Se não tivermos um basal, usaremos um valor default levemente pior que o atual para não quebrar a UI
    const pseudoBasal = isInverse ? valorAtual + (valorAtual * 0.1) : valorAtual - (valorAtual * 0.1);
    const basalReal = valorBasal ?? pseudoBasal;

    // Vamos criar a prop valorBasal na interface
    // (A interface deve ter valorBasal, vou assumir aqui uma variável local para segurar as pontas se a prop não existe, mas depois arrumaremos a interface)
    const gapTotal = Math.abs(valorMeta - basalReal);
    const progressoPercorrido = Math.abs(valorAtual - basalReal);

    let percentComplete = gapTotal > 0 ? (progressoPercorrido / gapTotal) * 100 : 0;

    // Tratamento de segurança:
    // Se isInverse e o valorAtual for MAIOR que o basal, o cara regrediu, então 0%
    if (isInverse && valorAtual > basalReal) percentComplete = 0;
    // Se !isInverse e o valorAtual for MENOR que o basal, o cara regrediu, então 0%
    if (!isInverse && valorAtual < basalReal) percentComplete = 0;

    // Se já bateu ou passou da meta:
    if (isInverse && valorAtual <= valorMeta) percentComplete = 100;
    if (!isInverse && valorAtual >= valorMeta) percentComplete = 100;

    const percent = Math.max(0, Math.min(100, Math.round(percentComplete)));

    // Agora o USER quer que o número Principal seja a META
    const primaryValue = unidade === '%' ? `${valorMeta}%` : valorMeta.toFixed(1)
    const currentValue = unidade === '%' ? `${valorAtual}%` : valorAtual.toFixed(1)

    return (
        <div className="max-w-2xl mx-auto px-6 mt-4">
            <div className="p-4 bg-gradient-to-br from-[#0C1220] to-[#0A0F1C] rounded-2xl border border-white/5 shadow-lg">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                            {label}
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 font-medium">ATUAL:</span>
                            <span className="text-white text-xs font-black">{currentValue}{unidade}</span>
                            <span className="text-gray-600 text-[10px]">→</span>
                            <span className="text-emerald-400 text-xs font-black">{primaryValue}{unidade}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1">
                            <span className="text-white font-black text-3xl tracking-tighter">{primaryValue}</span>
                            <span className="text-gray-600 text-xs font-bold">{unidade}</span>
                        </div>
                        <span className="text-[9px] font-bold text-emerald-400/80 uppercase tracking-widest">META DO PLANO</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div
                            className="h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                            style={{
                                width: `${Math.max(3, percent)}%`,
                                backgroundColor: cor
                            }}
                        />
                    </div>
                    <div className="flex flex-col items-end shrink-0 min-w-[3rem]">
                        <span className="text-[11px] font-black text-white">{percent}%</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
