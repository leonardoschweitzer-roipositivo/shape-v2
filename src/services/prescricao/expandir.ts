/**
 * Expande a prescrição de um exercício em SeriePrescrita[].
 *
 * - Se ex.prescricaoSeries existe: retorna como está.
 * - Se não existe (plano legado): gera N séries placeholder a partir de series/repeticoes.
 */

import type { ExercicioTreino } from '../../types/athlete-portal'
import type { SeriePrescrita, PrescricaoContext } from '../../types/prescricao'
import { gerarPrescricaoPadrao } from './templates'

/** Retorna SeriePrescrita[]. Para legado, gera estrutura placeholder (cargaKg=0). */
export function expandirPrescricao(
    ex: Pick<ExercicioTreino, 'series' | 'repeticoes' | 'prescricaoSeries'> & { descansoSegundos?: number },
    _ctx: PrescricaoContext = {},
): SeriePrescrita[] {
    if (ex.prescricaoSeries && ex.prescricaoSeries.length > 0) {
        return ex.prescricaoSeries.map((s, idx) => ({ ...s, ordem: s.ordem ?? idx + 1 }))
    }
    return gerarPrescricaoPadrao({
        series: ex.series,
        repeticoes: ex.repeticoes,
        descansoSegundos: ex.descansoSegundos,
    })
}

/** Total de séries prescritas (usado para UI e stepper). */
export function contarSeriesPrescritas(ex: Pick<ExercicioTreino, 'series' | 'prescricaoSeries'>): number {
    if (ex.prescricaoSeries && ex.prescricaoSeries.length > 0) return ex.prescricaoSeries.length
    return Math.max(1, ex.series || 1)
}
