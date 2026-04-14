/**
 * Prescrição de treino série-a-série.
 *
 * Permite ao personal descrever cada série individualmente (tipo, reps-alvo,
 * carga em kg ou %TopSet, RIR alvo, descanso) em vez do modelo plano
 * legado (series: number + repeticoes: string).
 *
 * Fundamentos:
 * - RIR/RPE: Zourdos et al. 2016 (J Strength Cond Res)
 * - Aquec progressivo: Haun et al. 2019; Schoenfeld 2016
 * - Top + backoff: Helms, Muscle & Strength Pyramid; Israetel (RP)
 * - Descanso por tipo: Schoenfeld 2016 meta-analysis; Grgic et al. 2018
 */

import type { TipoSet } from './athlete-portal'

/** Uma série prescrita pelo personal (input do plano, não execução). */
export interface SeriePrescrita {
    /** Posição 1..N dentro do exercício. */
    ordem: number
    /** Classificação do esforço (reuso de TipoSet do athlete-portal). */
    tipo: TipoSet
    /** Número exato de repetições prescritas. */
    reps: number
    /** Carga prescrita em kg. 0 quando ainda não definida. */
    cargaKg: number
    /** Reps In Reserve alvo (0-5). Zourdos 2016. 0 = até a falha. */
    rirAlvo?: number
    /** Descanso prescrito em segundos até a próxima série. */
    descansoSegundos: number
}

/** Contexto (mantido por compatibilidade; não mais usado para resolver %). */
export interface PrescricaoContext {
    topSetKg?: number
}

/** Identificadores dos templates de prescrição disponíveis. */
export type TemplateId =
    | 'rampa-classica'
    | 'top-set-backoff'
    | 'piramide-reversa'
    | 'straight-sets'
