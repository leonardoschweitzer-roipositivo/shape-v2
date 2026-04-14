/**
 * Templates de prescrição série-a-série, com base científica.
 *
 * Funções puras: recebem parâmetros do personal e retornam SeriePrescrita[].
 *
 * Referências:
 *  - Aquec 50/70/85/95% reps 12/8/5/3: Haun et al. 2019 (Sports Med); Schoenfeld 2016
 *  - RIR: Zourdos et al. 2016 (J Strength Cond Res)
 *  - Top + backoff 80-85%: Helms (Muscle & Strength Pyramid); Israetel (RP)
 *  - Pirâmide reversa: McDonald (Generic Bulking Routine)
 */

import type { SeriePrescrita } from '../../types/prescricao'

/** Arredonda para o múltiplo de 0.5kg mais próximo (padrão de barras/anilhas). */
function arredondarCarga(kg: number): number {
    return Math.round(kg * 2) / 2
}

/**
 * Gera aquecimento progressivo antes de uma carga-alvo.
 * Usa tabela Haun/Schoenfeld: 50%×12, 70%×8, 85%×5, 95%×3.
 * Retorna as primeiras `numAquec` séries (0-4).
 */
export function gerarAquecimento(topKg: number, numAquec: number): SeriePrescrita[] {
    const tabela: Array<{ pct: number; reps: number; desc: number; tipo: 'aquecimento' | 'reconhecimento' }> = [
        { pct: 0.5, reps: 12, desc: 60, tipo: 'aquecimento' },
        { pct: 0.7, reps: 8, desc: 60, tipo: 'aquecimento' },
        { pct: 0.85, reps: 5, desc: 90, tipo: 'reconhecimento' },
        { pct: 0.95, reps: 3, desc: 120, tipo: 'reconhecimento' },
    ]
    const escolhidas = tabela.slice(0, Math.max(0, Math.min(4, numAquec)))
    return escolhidas.map((t, i) => ({
        ordem: i + 1,
        tipo: t.tipo,
        repsAlvoMin: t.reps,
        repsAlvoMax: t.reps,
        fonteCarga: 'pctTopSet',
        cargaPercentTopSet: t.pct,
        cargaKg: arredondarCarga(topKg * t.pct),
        rirAlvo: t.tipo === 'aquecimento' ? 4 : 2,
        descansoSegundos: t.desc,
    }))
}

/**
 * Rampa clássica: N-2 séries de aquecimento/reconhecimento + 2 válidas no top.
 * Uso típico: hipertrofia com progressão gradual até carga de trabalho.
 */
export function rampaClassica(params: {
    totalSeries: number
    repsValida: number
    topKg: number
}): SeriePrescrita[] {
    const { totalSeries, repsValida, topKg } = params
    const numAquec = Math.max(0, Math.min(4, totalSeries - 2))
    const aquec = gerarAquecimento(topKg, numAquec)
    const numValidas = totalSeries - aquec.length
    const validas: SeriePrescrita[] = Array.from({ length: numValidas }, (_, i) => ({
        ordem: aquec.length + i + 1,
        tipo: 'valida',
        repsAlvoMin: Math.max(1, repsValida - 2),
        repsAlvoMax: repsValida,
        fonteCarga: 'kg',
        cargaKg: arredondarCarga(topKg),
        rirAlvo: i === numValidas - 1 ? 0 : 1,
        descansoSegundos: 180,
    }))
    return [...aquec, ...validas]
}

/**
 * Top set + backoffs. 1 top pesado (RIR 0-1) + N backoffs a 80-85% do top (RIR 1-2).
 * Uso típico: força com acessório de volume.
 */
export function topSetBackoff(params: {
    topKg: number
    repsTop: number
    backoffPct?: number
    backoffSeries?: number
    repsBackoff: number
    numAquec?: number
}): SeriePrescrita[] {
    const { topKg, repsTop, repsBackoff } = params
    const backoffPct = params.backoffPct ?? 0.85
    const backoffSeries = params.backoffSeries ?? 3
    const numAquec = params.numAquec ?? 3
    const aquec = gerarAquecimento(topKg, numAquec)
    const top: SeriePrescrita = {
        ordem: aquec.length + 1,
        tipo: 'top',
        repsAlvoMin: Math.max(1, repsTop - 1),
        repsAlvoMax: repsTop,
        fonteCarga: 'kg',
        cargaKg: arredondarCarga(topKg),
        rirAlvo: 0,
        descansoSegundos: 240,
    }
    const backoffKg = arredondarCarga(topKg * backoffPct)
    const backoffs: SeriePrescrita[] = Array.from({ length: backoffSeries }, (_, i) => ({
        ordem: aquec.length + 2 + i,
        tipo: 'backoff',
        repsAlvoMin: Math.max(1, repsBackoff - 2),
        repsAlvoMax: repsBackoff,
        fonteCarga: 'pctTopSet',
        cargaPercentTopSet: backoffPct,
        cargaKg: backoffKg,
        rirAlvo: 2,
        descansoSegundos: 180,
    }))
    return [...aquec, top, ...backoffs]
}

/**
 * Pirâmide reversa: top pesado primeiro, cada série subsequente com -decrescerPct e +2 reps.
 */
export function piramideReversa(params: {
    topKg: number
    decrescerPct?: number
    series: number
    repsTop: number
    numAquec?: number
}): SeriePrescrita[] {
    const { topKg, series, repsTop } = params
    const decrescerPct = params.decrescerPct ?? 0.1
    const numAquec = params.numAquec ?? 3
    const aquec = gerarAquecimento(topKg, numAquec)
    const principais: SeriePrescrita[] = Array.from({ length: series }, (_, i) => {
        const pct = Math.max(0.5, 1 - decrescerPct * i)
        return {
            ordem: aquec.length + i + 1,
            tipo: i === 0 ? 'top' : 'valida',
            repsAlvoMin: repsTop + i * 2 - 1,
            repsAlvoMax: repsTop + i * 2 + 1,
            fonteCarga: 'kg',
            cargaKg: arredondarCarga(topKg * pct),
            rirAlvo: i === 0 ? 0 : 1,
            descansoSegundos: i === 0 ? 240 : 180,
        }
    })
    return [...aquec, ...principais]
}

/**
 * Straight sets: N séries idênticas (hipertrofia clássica).
 * Sem aquecimento embutido (personal adiciona separado se quiser).
 */
export function straightSets(params: {
    series: number
    reps: number
    cargaKg: number
    rirAlvo?: number
    descansoSegundos?: number
}): SeriePrescrita[] {
    const { series, reps, cargaKg } = params
    const rirAlvo = params.rirAlvo ?? 2
    const descansoSegundos = params.descansoSegundos ?? 120
    return Array.from({ length: series }, (_, i) => ({
        ordem: i + 1,
        tipo: 'valida',
        repsAlvoMin: Math.max(1, reps - 2),
        repsAlvoMax: reps,
        fonteCarga: 'kg',
        cargaKg: arredondarCarga(cargaKg),
        rirAlvo,
        descansoSegundos,
    }))
}
