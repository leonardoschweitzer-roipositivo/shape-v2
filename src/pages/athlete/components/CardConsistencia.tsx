import React, { useMemo } from 'react'
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

function toDateKey(d: Date): string {
    return d.toISOString().split('T')[0]
}

// ==========================================
// COMPONENTE
// ==========================================
interface CardConsistenciaProps {
    dados: DadosConsistencia
}

export function CardConsistencia({ dados }: CardConsistenciaProps) {
    const {
        ano,
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

    // ---- Gerar grade do heatmap (últimas 34 semanas) ----
    const gradeData = useMemo(() => {
        const checkinsSet = new Set(checkins)
        const hoje = new Date()
        hoje.setHours(0, 0, 0, 0)
        const hojeKey = hoje.toISOString().split('T')[0]

        // Janela de 6 meses: Março a Agosto de 2026
        const startDate = new Date(ano, 2, 1) // 1 de Março

        // Ajustar para segunda-feira
        const diaSemana = startDate.getDay()
        const offset = diaSemana === 0 ? 6 : diaSemana - 1
        startDate.setDate(startDate.getDate() - offset)

        const semanas: { key: string; cor: string; mes: number }[][] = []
        const mesesLabels: { mes: number; coluna: number }[] = []

        let mesAnterior = -1
        const cursor = new Date(startDate)

        for (let col = 0; col < numWeeksToShow; col++) {
            const semana: { key: string; cor: string; mes: number }[] = []

            for (let d = 0; d < 7; d++) {
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

            // Registrar label do mês
            const mesAtual = semana[0].mes
            if (mesAtual !== mesAnterior) {
                // Registrar apenas se estiver dentro da janela Mar-Ago (2 a 7)
                if (mesAtual >= 2 && mesAtual <= 7) {
                    mesesLabels.push({ mes: mesAtual, coluna: col })
                }
                mesAnterior = mesAtual
            }

            semanas.push(semana)
        }

        return { semanas, mesesLabels }
    }, [checkins, numWeeksToShow, ano])

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
                            {gradeData.mesesLabels.map((ml, i) => {
                                // Calcula % da posição baseada na coluna atual vs total de colunas.
                                // Subtraímos uma pequena margem para no último mês não colar totalmente na borda e sumir texto
                                const leftPercentage = (ml.coluna / numWeeksToShow) * 100;
                                const isUltimo = i === gradeData.mesesLabels.length - 1;

                                return (
                                    <span
                                        key={i}
                                        className="text-[9px] text-gray-500 font-bold uppercase inline-block"
                                        style={{
                                            position: 'absolute',
                                            // Se for o último, alinha à direita da porcentagem calculada para evitar clipping
                                            left: isUltimo ? undefined : `${leftPercentage}%`,
                                            right: isUltimo ? '0%' : undefined,
                                            transform: isUltimo ? 'none' : 'translateX(-50%)' // Centraliza o texto no ponto exato
                                        }}
                                    >
                                        {MESES[ml.mes]}
                                    </span>
                                );
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
