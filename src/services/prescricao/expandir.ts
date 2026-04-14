/**
 * Expande a prescrição de um exercício em SeriePrescrita[] com cargas resolvidas.
 *
 * - Se ex.prescricaoSeries existe: resolve cargas em %TopSet para kg concretos.
 * - Se não existe (plano legado): gera N séries uniformes a partir de series/repeticoes/descansoSegundos.
 *
 * O runtime (CardTreino) sempre recebe SeriePrescrita[] com cargaKg concreto quando possível.
 */

import type { ExercicioTreino } from '../../types/athlete-portal'
import type { SeriePrescrita, PrescricaoContext } from '../../types/prescricao'

/** Extrai o maior número de uma string de reps ("8-10" → 10, "12" → 12, "até a falha" → 10 default). */
function extrairRepsMax(repeticoes: string | undefined, fallback = 10): number {
    if (!repeticoes) return fallback
    const nums = repeticoes.match(/\d+/g)
    if (!nums || nums.length === 0) return fallback
    return Math.max(...nums.map(Number))
}

/** Extrai o menor número de uma string de reps ("8-10" → 8, "12" → 12). */
function extrairRepsMin(repeticoes: string | undefined, fallback = 8): number {
    if (!repeticoes) return fallback
    const nums = repeticoes.match(/\d+/g)
    if (!nums || nums.length === 0) return fallback
    return Math.min(...nums.map(Number))
}

/**
 * Retorna SeriePrescrita[] com cargaKg resolvido.
 * Prioridade: ctx.topSetKg > ex.topSetKg > indefinido (mantém só pct).
 */
export function expandirPrescricao(
    ex: Pick<ExercicioTreino, 'series' | 'repeticoes' | 'prescricaoSeries' | 'topSetKg'> & { descansoSegundos?: number },
    ctx: PrescricaoContext = {},
): SeriePrescrita[] {
    const topSetKg = ctx.topSetKg ?? ex.topSetKg

    // Caso 1: prescrição detalhada existe → resolve cargas
    if (ex.prescricaoSeries && ex.prescricaoSeries.length > 0) {
        return ex.prescricaoSeries.map((s, idx) => {
            const resolvido: SeriePrescrita = { ...s, ordem: s.ordem ?? idx + 1 }
            if (s.fonteCarga === 'pctTopSet' && s.cargaPercentTopSet != null && topSetKg != null) {
                resolvido.cargaKg = Math.round(topSetKg * s.cargaPercentTopSet * 10) / 10
            }
            return resolvido
        })
    }

    // Caso 2: fallback legado → gera N séries válidas uniformes
    const totalSeries = Math.max(1, ex.series || 1)
    const repsMax = extrairRepsMax(ex.repeticoes, 10)
    const repsMin = extrairRepsMin(ex.repeticoes, repsMax)
    const descansoSeg = ex.descansoSegundos ?? 60

    return Array.from({ length: totalSeries }, (_, i) => ({
        ordem: i + 1,
        tipo: 'valida' as const,
        repsAlvoMin: repsMin,
        repsAlvoMax: repsMax,
        fonteCarga: 'kg' as const,
        cargaKg: undefined,
        descansoSegundos: descansoSeg,
    }))
}

/** Total de séries prescritas (usado para UI e stepper). */
export function contarSeriesPrescritas(ex: Pick<ExercicioTreino, 'series' | 'prescricaoSeries'>): number {
    if (ex.prescricaoSeries && ex.prescricaoSeries.length > 0) return ex.prescricaoSeries.length
    return Math.max(1, ex.series || 1)
}
