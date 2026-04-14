/**
 * Descanso prescrito por tipo de série.
 *
 * Baseado em Schoenfeld 2016 (meta-analysis sobre descanso inter-set e hipertrofia)
 * e Grgic et al. 2018. Regra geral:
 *  - Aquecimento: 60s (recuperação neural, sem fadiga acumulada)
 *  - Reconhecimento: 90s
 *  - Válida (isolada): 90-120s
 *  - Válida (composta): 120-180s
 *  - Top set / ≥85% 1RM composto: 180-300s
 *  - Backoff: 150-180s (mantém densidade)
 *  - Drop set: 0-15s (é o próprio ponto)
 *  - Falha: 180s
 */

import type { TipoSet } from '../../types/athlete-portal'

export function descansoRecomendado(tipo: TipoSet, isComposto = false): number {
    switch (tipo) {
        case 'aquecimento': return 60
        case 'reconhecimento': return 90
        case 'valida': return isComposto ? 150 : 90
        case 'top': return isComposto ? 300 : 180
        case 'backoff': return isComposto ? 180 : 120
        case 'drop': return 10
        case 'falha': return 180
        default: return 90
    }
}
