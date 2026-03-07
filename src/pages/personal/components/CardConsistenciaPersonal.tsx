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
    return d.toISOString().split('T')[0]
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
    atletaId: string // keeping for compatibility but not used for fetching anymore
}

export function CardConsistenciaPersonal({
    checkins,
    streakAtual,
    recorde,
    proximoBadge,
    totalTreinos,
    consistencia,
    tempoTotalMinutos
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
        const hojeKey = hoje.toISOString().split('T')[0]

        // Janela de 6 meses (Março a Agosto de 2026 conforme imagem do usuário)
        // No portal do aluno, ele pega 6 meses. Vamos ajustar para pegar os últimos 6 meses a partir de hoje.
        const startDate = new Date(hoje)
        startDate.setMonth(startDate.getMonth() - 5)
        startDate.setDate(1) // Primeiro dia de 5 meses atrás

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
                mesesLabels.push({ mes: mesAtual, coluna: col })
                mesAnterior = mesAtual
            }

            semanas.push(semana)
        }

        return { semanas, mesesLabels }
    }, [checkins, numWeeksToShow])

    const svgWidth = numWeeksToShow * totalCellSize
    const svgHeight = 7 * totalCellSize

    return (
        <div className="bg-surface-deep rounded-3xl p-5 border border-white/5 shadow-xl transition-all hover:border-white/10 group">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center">
                        <Flame size={18} className="text-orange-500" />
                    </div>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Consistência</h3>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                    <Calendar size={12} className="text-gray-500" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{ano}</span>
                </div>
            </div>

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

            {/* Heatmap */}
            <div className="mb-8 w-full">
                {/* Labels dos meses */}
                <div className="relative h-4 w-full mb-1">
                    {gradeData.mesesLabels.map((ml, i) => {
                        const leftPercentage = (ml.coluna / numWeeksToShow) * 100;
                        const isUltimo = i === gradeData.mesesLabels.length - 1;

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
                    {gradeData.semanas.map((semana, col) =>
                        semana.map((dia, row) => (
                            <rect
                                key={dia.key}
                                x={col * totalCellSize}
                                y={row * totalCellSize}
                                width={cellSize}
                                height={cellSize}
                                rx={3}
                                fill={dia.cor}
                            />
                        ))
                    )}
                </svg>
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
    )
}
