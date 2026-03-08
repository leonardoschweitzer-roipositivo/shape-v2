import React, { useMemo } from 'react'
import { getEmojiStreak, formatarTempo } from '@/services/consistencia.service'
import { Flame, Calendar, Zap, Trophy, Timer } from 'lucide-react'

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
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

interface CardConsistenciaPersonalProps {
    checkins: string[]
    streakAtual: number
    recorde: number
    proximoBadge: {
        nome: string
        emoji: string
        diasFaltando: number
    } | null | undefined
    totalTreinos: number
    consistencia: number
    tempoTotalMinutos: number
    atletaId: string
    startDateOverride?: string | null
}

export function CardConsistenciaPersonal({
    checkins,
    streakAtual,
    recorde,
    proximoBadge,
    totalTreinos,
    consistencia,
    tempoTotalMinutos,
    startDateOverride
}: CardConsistenciaPersonalProps) {
    const ano = new Date().getFullYear()
    const emojiStreak = getEmojiStreak(streakAtual)
    const tempoFormatado = formatarTempo(tempoTotalMinutos)

    // ---- Tamanho dos quadrados ----
    const cellSize = 20
    const cellGap = 4
    const totalCellSize = cellSize + cellGap
    const numWeeksToShow = 26 // Exatamente 6 meses (26 semanas)

    const gradeData = useMemo(() => {
        const checkinsSet = new Set(checkins)
        const hoje = new Date()
        hoje.setHours(0, 0, 0, 0)
        const hojeKey = toDateKey(hoje)

        // Data de ancoragem: Criação do plano ou hoje se não houver
        const anchorDate = startDateOverride ? new Date(startDateOverride) : new Date()
        anchorDate.setHours(0, 0, 0, 0)

        // Calcular quantos trimesteres exibir (13 semanas cada)
        const diffTime = Math.abs(hoje.getTime() - anchorDate.getTime())
        const totalWeeksElapsed = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))
        const numTrimesters = Math.floor(totalWeeksElapsed / 13) + 1

        const trimesters = []

        for (let t = 0; t < numTrimesters; t++) {
            // Data de início real do trimestre (T0 + t*13 semanas)
            const tStart = new Date(anchorDate)
            tStart.setDate(tStart.getDate() + (t * 13 * 7))

            // Ajuste para segunda-feira para alinhamento visual
            const displayStart = new Date(tStart)
            const diaSemana = displayStart.getDay()
            const offset = diaSemana === 0 ? 6 : diaSemana - 1
            displayStart.setDate(displayStart.getDate() - offset)

            const semanas: { key: string; cor: string; mes: number }[][] = []
            const mesesLabels: { mes: number; coluna: number }[] = []
            let mesAnterior = -1
            const cursor = new Date(displayStart)

            for (let col = 0; col < 13; col++) {
                const semana: { key: string; cor: string; mes: number }[] = []
                for (let d = 0; d < 7; d++) {
                    const key = toDateKey(cursor)
                    const cursorMes = cursor.getMonth()

                    let cor: string
                    if (key === hojeKey) {
                        cor = checkinsSet.has(key) ? CORES.hoje : CORES.hojePendente
                    } else if (cursor > hoje) {
                        cor = CORES.futuro
                    } else if (cursor < anchorDate && t === 0) {
                        // Dias antes do início do plano no primeiro trimestre (devido ao offset da segunda-feira)
                        cor = 'transparent'
                    } else {
                        cor = checkinsSet.has(key) ? CORES.treinou : CORES.naoTreinou
                    }
                    semana.push({ key, cor, mes: cursorMes })
                    cursor.setDate(cursor.getDate() + 1)
                }

                // Registrar label do mês
                const mesAtual = semana[0].mes
                if (mesAtual !== mesAnterior) {
                    mesesLabels.push({ mes: mesAtual, coluna: col })
                    mesAnterior = mesAtual
                }
                semanas.push(semana)
            }
            trimesters.push({ semanas, mesesLabels, num: t + 1 })
        }

        return { trimesters }
    }, [checkins, startDateOverride])

    const totalWeeksInTrimester = 13
    const svgWidth = totalWeeksInTrimester * totalCellSize
    const svgHeight = 7 * totalCellSize

    return (
        <div className="space-y-4">
            {/* Título e Ano fora do card */}
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <Flame size={16} className="text-orange-500" />
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Consistência Trimestral</h3>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                    <Calendar size={12} className="text-gray-500" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{ano}</span>
                </div>
            </div>

            <div className="bg-surface-deep rounded-3xl p-5 border border-white/5 shadow-xl transition-all hover:border-white/10 group">
                {/* Streak + Recorde */}
                <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-1">
                            {[...Array(Math.min(3, Math.floor(streakAtual / 7) + 1))].map((_, i) => (
                                <Zap key={i} size={20} className="text-orange-500 fill-orange-500/20" />
                            ))}
                        </div>
                        <span className="text-white font-black text-xl">
                            {streakAtual} {streakAtual === 1 ? 'dia' : 'dias'} seguidos
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Trophy size={12} className="text-yellow-500" />
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Recorde:</span>
                        <span className="text-[10px] text-gray-300 font-black">{recorde} dias</span>
                    </div>
                </div>

                <div className="mb-6 h-4">
                    {proximoBadge && (
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium italic">
                            <Timer size={12} className="text-gray-600" />
                            <span>
                                {proximoBadge.diasFaltando === 1 ? 'Falta 1 dia' : `Faltam ${proximoBadge.diasFaltando} dias`} para: {proximoBadge.nome}
                            </span>
                        </div>
                    )}
                </div>

                {/* Heatmaps (Trimesteres) */}
                <div className="space-y-8 mb-8">
                    {gradeData.trimesters.map((tri, tIdx) => (
                        <div key={tIdx} className="w-full">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                                    {gradeData.trimesters.length > 1 ? `Trimestre ${tri.num}` : 'Plano de Evolução Trimestral'}
                                </div>
                            </div>

                            {/* Labels dos meses */}
                            <div className="relative h-4 w-full mb-1">
                                {tri.mesesLabels.map((ml, i) => {
                                    const leftPercentage = (ml.coluna / totalWeeksInTrimester) * 100;
                                    const isUltimo = i === tri.mesesLabels.length - 1 && ml.coluna > 10;

                                    return (
                                        <span
                                            key={i}
                                            className="text-[9px] text-gray-500 font-black uppercase inline-block"
                                            style={{
                                                position: 'absolute',
                                                left: isUltimo ? undefined : `${leftPercentage}%`,
                                                right: isUltimo ? '0%' : undefined,
                                                transform: isUltimo ? 'none' : 'translateX(-50%)'
                                            }}
                                        >
                                            {MESES[ml.mes]}
                                        </span>
                                    );
                                })}
                            </div>

                            {/* Grade SVG */}
                            <svg
                                width="100%"
                                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                                preserveAspectRatio="xMinYMin meet"
                                className="w-full h-auto"
                            >
                                {tri.semanas.map((semana, col) =>
                                    semana.map((dia, row) => (
                                        <rect
                                            key={dia.key}
                                            x={col * totalCellSize}
                                            y={row * totalCellSize}
                                            width={cellSize}
                                            height={cellSize}
                                            rx={4}
                                            fill={dia.cor}
                                        />
                                    ))
                                )}
                            </svg>
                        </div>
                    ))}
                </div>

                {/* Métricas */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="text-center py-4 bg-white/[0.03] rounded-2xl border border-white/5 transition-colors group-hover:bg-white/[0.05]">
                        <div className="text-white font-black text-lg leading-none">{totalTreinos}</div>
                        <div className="text-gray-500 text-[8px] font-bold tracking-widest uppercase mt-2">Treinos</div>
                    </div>
                    <div className="text-center py-4 bg-white/[0.03] rounded-2xl border border-white/5 transition-colors group-hover:bg-white/[0.05]">
                        <div className="text-white font-black text-lg leading-none">{consistencia}%</div>
                        <div className="text-gray-500 text-[8px] font-bold tracking-widest uppercase mt-2">Consistência</div>
                    </div>
                    <div className="text-center py-4 bg-white/[0.03] rounded-2xl border border-white/5 transition-colors group-hover:bg-white/[0.05]">
                        <div className="text-white font-black text-lg leading-none">{tempoFormatado}</div>
                        <div className="text-gray-500 text-[8px] font-bold tracking-widest uppercase mt-2">Tempo Total</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
