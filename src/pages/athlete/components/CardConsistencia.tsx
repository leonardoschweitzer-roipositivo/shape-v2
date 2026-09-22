import React, { useEffect, useMemo, useState } from 'react'
import { Flame, Trophy, Hourglass } from 'lucide-react'
import { getEmojiStreak, formatarTempo, type DadosConsistencia } from '@/services/consistencia.service'

// ==========================================
// CORES DO HEATMAP (conforme spec)
// ==========================================
const CORES = {
    treinou: '#3B82F6',
    naoTreinou: '#374151',
    hoje: '#22C55E',
    hojePendente: '#F59E0B',
    futuro: '#1F2937',
}

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

/** 'YYYY-MM-DD' no fuso local (toISOString usaria UTC e poderia trocar o dia) */
function toDateKey(d: Date): string {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
}

/** Chave do dia atual — muda à meia-noite para o heatmap andar sozinho com o app aberto */
function useHojeKey(): string {
    const [hojeKey, setHojeKey] = useState(() => toDateKey(new Date()))
    useEffect(() => {
        const atualizar = () => setHojeKey(toDateKey(new Date()))
        const agora = new Date()
        const meiaNoite = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + 1)
        const timer = setTimeout(atualizar, meiaNoite.getTime() - agora.getTime() + 1000)
        const onVisible = () => { if (document.visibilityState === 'visible') atualizar() }
        document.addEventListener('visibilitychange', onVisible)
        return () => {
            clearTimeout(timer)
            document.removeEventListener('visibilitychange', onVisible)
        }
    }, [hojeKey])
    return hojeKey
}

// ==========================================
// COMPONENTE
// ==========================================
interface CardConsistenciaProps {
    dados: DadosConsistencia
}

export function CardConsistencia({ dados }: CardConsistenciaProps) {
    const {
        checkins,
        streakAtual,
        recorde,
        proximoBadge,
        totalTreinos,
        consistencia,
        tempoTotalMinutos,
    } = dados

    const emojiStreak = getEmojiStreak(streakAtual)
    const tempoFormatado = formatarTempo(tempoTotalMinutos)

    // ---- Tamanho dos quadrados ----
    const cellSize = 20
    const cellGap = 4
    const totalCellSize = cellSize + cellGap
    const numWeeksToShow = 26 // Exatamente 6 meses (26 semanas)

    const hojeKey = useHojeKey()

    // ---- Gerar grade do heatmap (janela móvel: últimas 26 semanas até a semana atual) ----
    const gradeData = useMemo(() => {
        const checkinsSet = new Set(checkins)
        const [y, m, d] = hojeKey.split('-').map(Number)
        const hoje = new Date(y, m - 1, d)

        // Segunda-feira da semana atual, recuando (numWeeksToShow - 1) semanas
        const diaSemana = hoje.getDay()
        const offset = diaSemana === 0 ? 6 : diaSemana - 1
        const startDate = new Date(hoje)
        startDate.setDate(startDate.getDate() - offset - (numWeeksToShow - 1) * 7)

        const semanas: { key: string; cor: string; mes: number }[][] = []
        const mesesLabels: { mes: number; coluna: number }[] = []

        let mesAnterior = -1
        const cursor = new Date(startDate)

        for (let col = 0; col < numWeeksToShow; col++) {
            const semana: { key: string; cor: string; mes: number }[] = []

            for (let dia = 0; dia < 7; dia++) {
                const key = toDateKey(cursor)
                const cursorMes = cursor.getMonth()

                let cor: string
                if (key === hojeKey) {
                    cor = checkinsSet.has(key) ? CORES.hoje : CORES.hojePendente
                } else if (cursor > hoje) {
                    cor = CORES.futuro
                } else {
                    cor = checkinsSet.has(key) ? CORES.treinou : CORES.naoTreinou
                }

                semana.push({ key, cor, mes: cursorMes })
                cursor.setDate(cursor.getDate() + 1)
            }

            // Label do mês na primeira coluna em que ele aparece (pula a 1ª coluna parcial)
            const mesAtual = semana[semana.length - 1].mes
            if (mesAtual !== mesAnterior) {
                if (col > 0 || semana[0].mes === mesAtual) {
                    mesesLabels.push({ mes: mesAtual, coluna: col })
                }
                mesAnterior = mesAtual
            }

            semanas.push(semana)
        }

        return { semanas, mesesLabels }
    }, [checkins, numWeeksToShow, hojeKey])

    const svgWidth = numWeeksToShow * totalCellSize
    const svgHeight = 7 * totalCellSize

    return (
        <div className="max-w-2xl mx-auto px-4 mb-6">
            <div className="bg-gradient-to-br from-surface-deep to-background-dark rounded-2xl border border-white/5 shadow-xl overflow-hidden">
                {/* Header Estilo Premium */}
                <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                            <Flame size={16} className="text-orange-400" />
                        </div>
                        <div>
                            <p className="text-white font-black text-sm uppercase tracking-widest">
                                Consistência
                            </p>
                            <p className="text-zinc-500 text-[10px] sm:text-xs">{streakAtual} {streakAtual === 1 ? 'dia' : 'dias'} seguidos</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-orange-500/10 rounded-full px-2.5 py-1 border border-orange-500/10">
                        <Trophy size={11} className="text-orange-400" />
                        <span className="text-orange-300 text-[10px] font-bold">Recorde: {recorde} dias</span>
                    </div>
                </div>

                <div className="p-5">



                    {/* Heatmap */}
                    <div className="mb-2 w-full">
                        {/* Labels dos meses */}
                        <div className="relative h-4 w-full">
                            {gradeData.mesesLabels.map((ml) => {
                                // Alinha o rótulo ao início da coluna em que o mês começa;
                                // perto da borda direita, ancora pela direita para não cortar o texto
                                const leftPercentage = (ml.coluna / numWeeksToShow) * 100
                                const pertoDaBorda = ml.coluna >= numWeeksToShow - 2

                                return (
                                    <span
                                        key={`${ml.mes}-${ml.coluna}`}
                                        className="text-[9px] text-gray-500 font-bold uppercase inline-block"
                                        style={{
                                            position: 'absolute',
                                            left: pertoDaBorda ? undefined : `${leftPercentage}%`,
                                            right: pertoDaBorda ? '0%' : undefined,
                                        }}
                                    >
                                        {MESES[ml.mes]}
                                    </span>
                                )
                            })}
                        </div>

                        {/* Grade SVG - Responsivo (sem altura fixa para evitar gap no mobile) */}
                        <svg
                            width="100%"
                            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                            preserveAspectRatio="xMinYMin meet"
                            className="w-full h-auto"
                        >
                            {gradeData.semanas.map((semana, col) =>
                                semana.map((dia, row) => (
                                    dia.cor !== 'transparent' && (
                                        <rect
                                            key={dia.key}
                                            x={col * totalCellSize}
                                            y={row * totalCellSize}
                                            width={cellSize}
                                            height={cellSize}
                                            rx={2}
                                            fill={dia.cor}
                                        />
                                    )
                                ))
                            )}
                        </svg>
                    </div>

                    {/* Métricas */}
                    <div className="grid grid-cols-3 gap-2">
                        <div className="text-center py-2.5 bg-white/[0.03] rounded-xl border border-white/5">
                            <div className="text-white font-black text-base leading-none">{totalTreinos}</div>
                            <div className="text-gray-500 text-[8px] font-bold tracking-widest uppercase mt-1">Treinos</div>
                        </div>
                        <div className="text-center py-2.5 bg-white/[0.03] rounded-xl border border-white/5">
                            <div className="text-white font-black text-base leading-none">{consistencia}%</div>
                            <div className="text-gray-500 text-[8px] font-bold tracking-widest uppercase mt-1">Consistência</div>
                        </div>
                        <div className="text-center py-2.5 bg-white/[0.03] rounded-xl border border-white/5">
                            <div className="text-white font-black text-base leading-none">{tempoFormatado}</div>
                            <div className="text-gray-500 text-[8px] font-bold tracking-widest uppercase mt-1">Tempo Total</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
