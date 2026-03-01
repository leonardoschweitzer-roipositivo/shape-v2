import React, { useMemo } from 'react'
import { CardScoreMetaProps } from './HomeAtletaTypes'

const CLASSIFICACOES = [
    { min: 0, max: 30, nome: 'INICIANDO', cor: '#EF4444' },
    { min: 30, max: 50, nome: 'COMEÇANDO', cor: '#F97316' },
    { min: 50, max: 65, nome: 'EVOLUINDO', cor: '#EAB308' },
    { min: 65, max: 80, nome: 'ATLETA', cor: '#22C55E' },
    { min: 80, max: 90, nome: 'AVANÇADO', cor: '#3B82F6' },
    { min: 90, max: 95, nome: 'ELITE', cor: '#8B5CF6' },
    { min: 95, max: 100, nome: 'DEUS GREGO', cor: '#FFD700' },
]

function getClassificacaoCor(nome: string) {
    return CLASSIFICACOES.find((c) => c.nome === nome)?.cor || '#F97316'
}

function gerarMensagemProgresso(evolucaoMes: number, melhorMes: number): { texto: string; emoji: string; alerta?: boolean } {
    if (evolucaoMes >= melhorMes && evolucaoMes > 0) {
        return { texto: 'Melhor mês do ano!', emoji: '🔥' }
    } else if (evolucaoMes > 0) {
        return { texto: 'Evoluindo bem!', emoji: '📈' }
    } else if (evolucaoMes === 0) {
        return { texto: 'Mantendo o score', emoji: '⏸️' }
    } else {
        return { texto: 'Vamos recuperar!', emoji: '💪', alerta: true }
    }
}

export function CardScoreMeta({
    scoreAtual,
    classificacaoAtual,
    dataUltimaAvaliacao,
    scoreMeta,
    classificacaoMeta,
    prazoMeta,
    evolucaoMes,
    melhorMesHistorico,
    percentualMeta,
}: CardScoreMetaProps) {
    const corAtual = getClassificacaoCor(classificacaoAtual)
    const corMeta = getClassificacaoCor(classificacaoMeta)

    const progressoData = useMemo(() => gerarMensagemProgresso(evolucaoMes, melhorMesHistorico), [
        evolucaoMes,
        melhorMesHistorico,
    ])

    const dataFormatada = new Intl.DateTimeFormat('pt-BR').format(dataUltimaAvaliacao)

    return (
        <div className="max-w-2xl mx-auto px-6 mt-4">
            <div className="p-6 bg-gradient-to-br from-[#0C1220] to-[#0A0F1C] rounded-2xl border border-white/5 shadow-xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                    <span className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase">
                        Última Avaliação
                    </span>
                    <span className="text-[10px] text-gray-600 font-mono">
                        {dataFormatada}
                    </span>
                </div>

                {/* Score + Barra + Meta */}
                <div className="flex items-center justify-between mb-2">
                    {/* Score Atual */}
                    <div className="text-left w-1/4">
                        <span className="text-[2.5rem] font-black leading-none" style={{ color: corAtual }}>
                            {scoreAtual.toFixed(1)}
                        </span>
                        <span className="text-gray-600 text-sm ml-1 font-bold">pts</span>
                    </div>

                    {/* Barra Central */}
                    <div className="flex-1 px-4 flex flex-col items-center justify-center">
                        <span className="text-gray-500 text-[9px] font-bold tracking-widest uppercase mb-2">
                            META EM {prazoMeta} MESES
                        </span>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-2">
                            <div
                                className="h-full rounded-full transition-all duration-1000"
                                style={{
                                    width: `${percentualMeta}%`,
                                    background: `linear-gradient(90deg, ${corAtual} 0%, ${corMeta} 100%)`,
                                }}
                            />
                        </div>
                        <span className="text-gray-400 font-bold text-[10px]">
                            {percentualMeta}% <span className="text-gray-600 font-medium">da meta</span>
                        </span>
                    </div>

                    {/* Score Meta */}
                    <div className="text-right w-1/4">
                        <span className="text-[2.5rem] font-black leading-none text-gray-300">
                            {Math.round(scoreMeta)}
                        </span>
                    </div>
                </div>

                <div className="flex justify-between px-1 mb-2 text-[10px] font-black tracking-widest uppercase">
                    <span style={{ color: corAtual }}>{classificacaoAtual}</span>
                    <span style={{ color: corMeta }}>{classificacaoMeta}</span>
                </div>
            </div>
        </div>
    )
}
