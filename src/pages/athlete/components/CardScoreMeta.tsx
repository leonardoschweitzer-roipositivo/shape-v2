import React, { useMemo } from 'react'
import { Target, Trophy, Calendar } from 'lucide-react'
import { CardScoreMetaProps } from './HomeAtletaTypes'

const CLASSIFICACOES = [
    { min: 0, max: 30, nome: 'INICIANDO', cor: '#EF4444' },
    { min: 30, max: 50, nome: 'COMEÇANDO', cor: '#F97316' },
    { min: 50, max: 65, nome: 'EVOLUINDO', cor: '#EAB308' },
    { min: 65, max: 80, nome: 'AVANÇADO', cor: '#22C55E' },
    { min: 80, max: 90, nome: 'ATLETA', cor: '#3B82F6' },
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
        <div className="max-w-2xl mx-auto px-4 mb-6">
            <div className="bg-gradient-to-br from-surface-deep to-background-dark rounded-2xl border border-white/5 shadow-xl overflow-hidden">
                {/* Header Estilo Premium */}
                <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                            <Trophy size={16} className="text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-white font-black text-sm uppercase tracking-widest">
                                Score Geral | Meta Anual
                            </p>
                            <p className="text-zinc-500 text-[10px] sm:text-xs">Avaliação Física · Plano de Evolução</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/5 rounded-full px-2.5 py-1 border border-white/5">
                        <Calendar size={11} className="text-zinc-500" />
                        <span className="text-zinc-400 text-[10px] font-bold">{dataFormatada}</span>
                    </div>
                </div>

                <div className="p-6">
                    {/* Score + Barra + Meta */}
                    <div className="flex items-center justify-between mb-2">
                        {/* Score Atual */}
                        <div className="text-center w-1/4">
                            <div className="flex flex-col">
                                <div>
                                    <span className="text-[2.2rem] sm:text-[2.5rem] font-black leading-none" style={{ color: corAtual }}>
                                        {scoreAtual.toFixed(1)}
                                    </span>
                                    <span className="text-gray-600 text-[10px] ml-1 font-bold uppercase">pts</span>
                                </div>
                                <span className="text-[10px] font-black tracking-widest uppercase mt-1" style={{ color: corAtual }}>
                                    {classificacaoAtual}
                                </span>
                            </div>
                        </div>

                        {/* Barra Central */}
                        <div className="flex-1 px-4 flex flex-col items-center justify-center">
                            <span className="text-gray-500 text-[9px] font-bold tracking-widest uppercase mb-2">
                                META EM {prazoMeta} MESES
                            </span>
                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-2">
                                <div
                                    className="h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(99,102,241,0.3)]"
                                    style={{
                                        width: `${Math.max(3, percentualMeta)}%`,
                                        background: `linear-gradient(90deg, ${corAtual} 0%, ${corMeta} 100%)`,
                                    }}
                                />
                            </div>
                            <span className="text-gray-400 font-bold text-[10px]">
                                {percentualMeta}% <span className="text-gray-600 font-medium">da meta</span>
                            </span>
                        </div>

                        {/* Score Meta */}
                        <div className="text-center w-1/4">
                            <div className="flex flex-col">
                                <span className="text-[2.2rem] sm:text-[2.5rem] font-black leading-none text-gray-300">
                                    {scoreMeta.toFixed(1)}
                                </span>
                                <span className="text-[10px] font-black tracking-widest uppercase mt-1" style={{ color: corMeta }}>
                                    {classificacaoMeta}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
