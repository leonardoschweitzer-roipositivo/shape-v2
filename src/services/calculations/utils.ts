/**
 * Funções Utilitárias de Cálculo - SHAPE-V
 * 
 * Funções puras reutilizáveis para cálculos de score e proporções.
 * @see docs/specs/code-style.md - Seção 4.2
 */

import { CLASSIC_WEIGHT_LIMITS, SCORE_CLASSIFICATIONS } from './constants'

// ============================================================================
// FUNÇÕES DE SCORE
// ============================================================================

/**
 * Calcula score proporcional (quanto maior até o ideal, melhor)
 * @reusable - Usado em todos os métodos de cálculo
 */
export function calcularScoreProporcional(
    atual: number,
    ideal: number,
    peso: number
): number {
    const percentual = Math.min(100, (atual / ideal) * 100)
    return percentual * (peso / 100)
}

/**
 * Calcula score inverso (quanto menor, melhor - ex: cintura)
 * @reusable - Usado para cintura em todos os métodos
 */
export function calcularScoreInverso(
    atual: number,
    ideal: number,
    peso: number
): number {
    if (atual <= ideal) return peso
    const percentual = (ideal / atual) * 100
    return percentual * (peso / 100)
}

/**
 * Calcula score da tríade (simetria entre 3 medidas)
 * @reusable - Usado no Golden Ratio e Classic Physique
 */
export function calcularScoreTriade(
    medida1: number,
    medida2: number,
    medida3: number,
    peso: number
): number {
    const media = (medida1 + medida2 + medida3) / 3
    const desvios = [medida1, medida2, medida3].map(m => Math.abs(m - media) / media)
    const desvioMedio = desvios.reduce((a, b) => a + b, 0) / 3
    const percentual = Math.max(0, (1 - desvioMedio) * 100)
    return percentual * (peso / 100)
}

// ============================================================================
// FUNÇÕES DE INTERPOLAÇÃO
// ============================================================================

/**
 * Interpola valor entre dois pontos
 * @reusable - Usado para calcular peso máximo por altura
 */
export function interpolate(
    x: number,
    x1: number,
    x2: number,
    y1: number,
    y2: number
): number {
    const fator = (x - x1) / (x2 - x1)
    return y1 + (y2 - y1) * fator
}

/**
 * Obtém o peso máximo permitido para Classic Physique
 * Interpola entre os valores da tabela IFBB
 */
export function getPesoMaximoClassic(altura_cm: number): number {
    const alturas = Object.keys(CLASSIC_WEIGHT_LIMITS).map(Number).sort((a, b) => a - b)

    if (altura_cm <= alturas[0]) return CLASSIC_WEIGHT_LIMITS[alturas[0]]
    if (altura_cm >= alturas[alturas.length - 1]) return CLASSIC_WEIGHT_LIMITS[alturas[alturas.length - 1]]

    for (let i = 0; i < alturas.length - 1; i++) {
        if (altura_cm >= alturas[i] && altura_cm < alturas[i + 1]) {
            const h1 = alturas[i], h2 = alturas[i + 1]
            const w1 = CLASSIC_WEIGHT_LIMITS[h1], w2 = CLASSIC_WEIGHT_LIMITS[h2]
            return Math.round(interpolate(altura_cm, h1, h2, w1, w2) * 10) / 10
        }
    }

    return CLASSIC_WEIGHT_LIMITS[alturas[alturas.length - 1]]
}

// ============================================================================
// FUNÇÕES DE CLASSIFICAÇÃO
// ============================================================================

/**
 * Retorna a classificação baseada no score total
 */
export function getClassificacao(score: number): {
    nivel: string
    emoji: string
    descricao: string
} {
    if (score >= SCORE_CLASSIFICATIONS.ELITE.min) {
        return { nivel: 'ELITE', ...SCORE_CLASSIFICATIONS.ELITE }
    }
    if (score >= SCORE_CLASSIFICATIONS.AVANCADO.min) {
        return { nivel: 'AVANÇADO', ...SCORE_CLASSIFICATIONS.AVANCADO }
    }
    if (score >= SCORE_CLASSIFICATIONS.INTERMEDIARIO.min) {
        return { nivel: 'INTERMEDIÁRIO', ...SCORE_CLASSIFICATIONS.INTERMEDIARIO }
    }
    if (score >= SCORE_CLASSIFICATIONS.INICIANTE.min) {
        return { nivel: 'INICIANTE', ...SCORE_CLASSIFICATIONS.INICIANTE }
    }
    return { nivel: 'EM DESENVOLVIMENTO', ...SCORE_CLASSIFICATIONS.DESENVOLVENDO }
}

/**
 * Retorna o label de status baseado no percentual
 */
export function getStatusLabel(percentual: number): string {
    if (percentual >= 98) return 'IDEAL CLÁSSICO'
    if (percentual >= 90) return 'QUASE LÁ'
    if (percentual >= 80) return 'EM PROGRESSO'
    if (percentual >= 60) return 'DESENVOLVENDO'
    return 'INICIANDO'
}

// ============================================================================
// FUNÇÕES DE FORMATAÇÃO
// ============================================================================

/**
 * Formata a diferença para exibição
 */
export function formatDifference(
    diferenca: number,
    necessario: 'aumentar' | 'diminuir' | 'manter'
): string {
    if (necessario === 'manter') return '✓ Na meta'
    const sinal = necessario === 'aumentar' ? '+' : '-'
    return `${sinal}${diferenca}cm para meta`
}

/**
 * Calcula a diferença entre atual e ideal
 */
export function calcularDiferenca(atual: number, ideal: number): {
    diferenca: number
    necessario: 'aumentar' | 'diminuir' | 'manter'
    percentual: number
} {
    const diferenca = Math.round((ideal - atual) * 10) / 10
    const percentual = Math.round((atual / ideal) * 100)

    return {
        diferenca: Math.abs(diferenca),
        necessario: diferenca > 0.5 ? 'aumentar' : diferenca < -0.5 ? 'diminuir' : 'manter',
        percentual,
    }
}
