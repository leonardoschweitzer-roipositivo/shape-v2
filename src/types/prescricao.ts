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

/** Origem da carga de uma série prescrita. */
export type FonteCarga = 'kg' | 'pctTopSet'

/** Uma série prescrita pelo personal (input do plano, não execução). */
export interface SeriePrescrita {
    /** Posição 1..N dentro do exercício. */
    ordem: number
    /** Classificação do esforço (reuso de TipoSet do athlete-portal). */
    tipo: TipoSet
    /** Repetições-alvo mínimas. Se fixo, igual a repsAlvoMax. */
    repsAlvoMin: number
    /** Repetições-alvo máximas. */
    repsAlvoMax: number
    /** Define como interpretar cargaKg vs cargaPercentTopSet. */
    fonteCarga: FonteCarga
    /** Carga absoluta em kg (usada quando fonteCarga='kg'). */
    cargaKg?: number
    /** Fração do top set 0..1 (usada quando fonteCarga='pctTopSet'). */
    cargaPercentTopSet?: number
    /** Reps in Reserve alvo (0-5). Zourdos 2016. */
    rirAlvo?: number
    /** Descanso prescrito em segundos até a próxima série. */
    descansoSegundos: number
    /** Observação livre (ex: "tempo sob tensão 3-1-1"). */
    observacao?: string
}

/** Contexto para resolver percentuais em kg concretos. */
export interface PrescricaoContext {
    /** Carga do top set da sessão em kg — usada p/ expandir pctTopSet. */
    topSetKg?: number
}

/** Identificadores dos templates de prescrição disponíveis. */
export type TemplateId =
    | 'rampa-classica'
    | 'top-set-backoff'
    | 'piramide-reversa'
    | 'straight-sets'
