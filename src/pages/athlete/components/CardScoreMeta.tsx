import React, { useMemo } from 'react'
import { Target, Trophy, Calendar } from 'lucide-react'
import { CardScoreMetaProps } from './HomeAtletaTypes'

const CLASSIFICACOES = [
    { min: 0, max: 30, nome: 'INICIANDO', cor: '#EF4444' },
    { min: 30, max: 50, nome: 'COMEÇANDO', cor: '#F97316' },
    { min: 50, max: 65, nome: 'EVOLUINDO', cor: '#EAB308' },
    { min: 65, max: 80, nome: 'AVANÇADO', cor: '#22C55E' },
    { min: 80, max: 95, nome: 'ATLETA', cor: '#8B5CF6' },
    { min: 95, max: 101, nome: 'ELITE', cor: '#FFD700' },
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
    diagnosticoDados,
    sexo,
    medidas,
}: CardScoreMetaProps) {
    const corAtual = getClassificacaoCor(classificacaoAtual)
    const corMeta = getClassificacaoCor(classificacaoMeta)

    // Helpers para o Gráfico (originais do MetasTrimestre)
    const getLabelGrupo = (grupo: string) => {
        const map: Record<string, { emoji: string; label: string }> = {
            'Shape-V': { emoji: '▽', label: 'Shape-V' },
            'SHR': { emoji: '▽', label: 'Ombros (Ratio)' },
            'Ampulheta': { emoji: '⏳', label: 'Formato Ampulheta' },
        }
        return map[grupo] ?? { emoji: '📏', label: grupo }
    }

    const renderGrafico = () => {
        if (!diagnosticoDados || !sexo) return null

        const primaryGroupName = sexo === 'M' ? 'Shape-V' : 'Ampulheta'
        const primaryPropData = diagnosticoDados.analiseEstetica?.proporcoes?.find(p => p.grupo === primaryGroupName)
        const primaryMetaFound = diagnosticoDados.metasProporcoes?.find(m => m.grupo === primaryGroupName)

        if (!primaryPropData || !primaryMetaFound) {
            // Fallback: se não encontrar no metasProporcoes, tenta achar apenas os dados de proporção atuais
            if (!primaryPropData) return null;
        }

        // Calcular metas: priorizar dados do diagnóstico, com fallback inteligente
        const atual = primaryPropData.atual
        let meta12M: number
        let meta3M: number
        let meta6M: number
        let meta9M: number

        if (primaryMetaFound) {
            // Dados completos do diagnóstico disponíveis
            meta12M = primaryMetaFound.meta12M
            meta3M = primaryMetaFound.meta3M ?? Math.round((atual + (meta12M - atual) * 0.25) * 100) / 100
            meta6M = primaryMetaFound.meta6M ?? Math.round((atual + (meta12M - atual) * 0.50) * 100) / 100
            meta9M = primaryMetaFound.meta9M ?? Math.round((atual + (meta12M - atual) * 0.75) * 100) / 100
        } else {
            // Fallback: usar ideal da análise estética como meta 12M
            // Limitar ganho a no máximo 15% do gap ideal (realista)
            const ideal = primaryPropData.ideal ?? atual
            const gapTotal = ideal - atual
            const ganhoRealista = gapTotal > 0 ? Math.min(gapTotal, gapTotal * 0.5) : 0
            meta12M = Math.round((atual + ganhoRealista) * 100) / 100
            meta3M = Math.round((atual + ganhoRealista * 0.25) * 100) / 100
            meta6M = Math.round((atual + ganhoRealista * 0.50) * 100) / 100
            meta9M = Math.round((atual + ganhoRealista * 0.75) * 100) / 100
        }

        const item = {
            grupo: primaryPropData.grupo,
            atual,
            meta3M,
            meta6M,
            meta9M,
            meta12M,
        }

        const { emoji, label } = getLabelGrupo(item.grupo)
        const isAmpulheta = item.grupo === 'Ampulheta'
        const pontos = [item.atual, item.meta3M, item.meta6M, item.meta9M, item.meta12M]
        
        const width = 400
        const height = 120
        const paddingX = 20
        const paddingY = 20
        const minVal = Math.min(...pontos) * 0.98
        const maxVal = Math.max(...pontos) * 1.02
        const range = maxVal - minVal || 1

        const getX = (i: number) => paddingX + (i * (width - 2 * paddingX)) / (pontos.length - 1)
        const getY = (val: number) => height - paddingY - ((val - minVal) / range) * (height - 2 * paddingY)
        const pathDataArr = pontos.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p)}`)
        const pathData = pathDataArr.join(' ')
        const areaData = `${pathData} L ${getX(pontos.length - 1)} ${height} L ${getX(0)} ${height} Z`
        const labelsMeses = ['Agora', '3m', '6m', '9m', '12m']
        const corPrincipal = sexo === 'M' ? '#6366f1' : '#ec4899'

        return (
            <div className="pt-4 mt-4 border-t border-white/5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">{emoji}</span>
                        <div>
                            <span className="text-white font-black text-sm uppercase tracking-widest block leading-none">{label}</span>
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">Evolução Projetada (12 Meses)</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                            <span className="text-zinc-500 text-[10px] font-bold uppercase">Meta Final:</span>
                            <span className="text-indigo-400 font-black text-sm">
                                {isAmpulheta ? item.meta12M.toFixed(0) : item.meta12M.toFixed(2)}
                                {isAmpulheta && '%'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="relative h-[120px] w-full bg-zinc-950/40 rounded-xl border border-white/5 overflow-hidden">
                    <svg className="absolute inset-0 w-full h-full opacity-10">
                        <rect width="100%" height="100%" fill="url(#grid-score)" />
                        <defs>
                            <pattern id="grid-score" width="40" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                    </svg>

                    <svg viewBox={`0 0 ${width} ${height}`} className="absolute inset-0 w-full h-full">
                        <defs>
                            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={corPrincipal} stopOpacity="0.3" />
                                <stop offset="100%" stopColor={corPrincipal} stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path d={areaData} fill="url(#scoreGradient)" />
                        <path d={pathData} fill="none" stroke={corPrincipal} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        {pontos.map((p, i) => (
                            <circle key={i} cx={getX(i)} cy={getY(p)} r="4" fill="#fff" />
                        ))}
                    </svg>

                    <div className="absolute bottom-1 left-0 w-full flex justify-between px-4">
                        {labelsMeses.map((m, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-tighter">{m}</span>
                                <span className="text-[10px] font-mono text-zinc-400 font-bold">
                                    {pontos[i].toFixed(isAmpulheta ? 0 : 2)}
                                    {isAmpulheta && '%'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

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
                                Meta Anual
                            </p>
                            <p className="text-indigo-400 text-[10px] sm:text-xs font-black uppercase tracking-tight">Score Geral</p>
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

                    {/* Gráfico de Evolução 12 Meses (Movido para cá) */}
                    {renderGrafico()}
                </div>
            </div>
        </div>
    )
}
