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
    const pseudoBasal = isInverse ? valorAtual + (valorAtual * 0.1) : valorAtual - (valorAtual * 0.1);
    const basalReal = valorBasal ?? pseudoBasal;

    const gapTotal = Math.abs(valorMeta - basalReal);
    const progressoPercorrido = Math.abs(valorAtual - basalReal);

    let percentComplete = gapTotal > 0 ? (progressoPercorrido / gapTotal) * 100 : 0;

    // Tratamento de segurança:
    if (isInverse && valorAtual > basalReal) percentComplete = 0;
    if (!isInverse && valorAtual < basalReal) percentComplete = 0;

    // Se já bateu ou passou da meta:
    const metaSuperada = isInverse ? valorAtual <= valorMeta : valorAtual >= valorMeta;
    if (metaSuperada) percentComplete = 100;

    const percent = Math.max(0, Math.min(100, Math.round(percentComplete)));

    const currentValue = unidade === '%' ? `${valorAtual}%` : valorAtual.toFixed(1)

    // Para métricas inversas onde a meta já foi superada, exibir o valor atual como destaque
    // Em vez de mostrar "84cm → 90.3cm" (que sugere aumento), mostra "84cm ✓ Meta: ≤90.3cm"
    const metaLabel = isInverse ? `≤ ${valorMeta.toFixed(1)}` : valorMeta.toFixed(1)
    const primaryDisplay = metaSuperada && isInverse ? currentValue : (unidade === '%' ? `${valorMeta}%` : valorMeta.toFixed(1))

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
                            {metaSuperada ? (
                                <>
                                    <span className="text-emerald-400 text-[10px]">✓</span>
                                    <span className="text-emerald-400 text-[10px] font-bold">META SUPERADA</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-gray-600 text-[10px]">{isInverse ? '↓' : '→'}</span>
                                    <span className="text-emerald-400 text-xs font-black">
                                        {isInverse ? `≤${valorMeta.toFixed(1)}` : valorMeta.toFixed(1)}{unidade}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1">
                            <span className="text-white font-black text-3xl tracking-tighter">
                                {isInverse ? `≤${valorMeta.toFixed(1)}` : valorMeta.toFixed(1)}
                            </span>
                            <span className="text-gray-600 text-xs font-bold">{unidade}</span>
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${metaSuperada ? 'text-emerald-400' : 'text-emerald-400/80'}`}>
                            {metaSuperada ? '✓ META SUPERADA' : 'META DO PLANO'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ${metaSuperada ? 'shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'shadow-[0_0_10px_rgba(139,92,246,0.3)]'}`}
                            style={{
                                width: `${Math.max(3, percent)}%`,
                                backgroundColor: metaSuperada ? '#10B981' : cor
                            }}
                        />
                    </div>
                    <div className="flex flex-col items-end shrink-0 min-w-[3rem]">
                        <span className={`text-[11px] font-black ${metaSuperada ? 'text-emerald-400' : 'text-white'}`}>{percent}%</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
