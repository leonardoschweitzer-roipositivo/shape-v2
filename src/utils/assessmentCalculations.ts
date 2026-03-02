/**
 * Assessment Calculations
 * 
 * Funções puras de cálculo para a tela de Avaliação do Portal do Atleta.
 * Baseadas nas specs: escalas-proporcoes.md, calculo-avaliacao-geral.md
 */

import type {
    ClassificacaoId,
    ClassificacaoProporcao,
    AssimetriaStatus,
    AssimetriaItem,
} from '@/types/assessment-evaluation.types'

// ==========================================
// CLASSIFICAÇÕES (escalas-proporcoes.md §3.1)
// ==========================================

export const CLASSIFICACOES: Record<ClassificacaoId, ClassificacaoProporcao> = {
    INICIO: {
        id: 'INICIO',
        label: 'Início',
        labelCurto: 'INÍCIO',
        cor: '#1E3A5F',
        corTexto: '#94A3B8',
        emoji: '🚀',
        minPercent: 0,
        maxPercent: 82,
    },
    CAMINHO: {
        id: 'CAMINHO',
        label: 'Caminho',
        labelCurto: 'CAMINHO',
        cor: '#2563EB',
        corTexto: '#60A5FA',
        emoji: '🛤️',
        minPercent: 82,
        maxPercent: 90,
    },
    QUASE_LA: {
        id: 'QUASE_LA',
        label: 'Quase Lá',
        labelCurto: 'QUASE LÁ',
        cor: '#3B82F6',
        corTexto: '#93C5FD',
        emoji: '💪',
        minPercent: 90,
        maxPercent: 97,
    },
    META: {
        id: 'META',
        label: 'Meta',
        labelCurto: 'META',
        cor: '#8B5CF6',
        corTexto: '#C4B5FD',
        emoji: '🎯',
        minPercent: 97,
        maxPercent: 103,
    },
    ELITE: {
        id: 'ELITE',
        label: 'Elite',
        labelCurto: 'ELITE',
        cor: '#EAB308',
        corTexto: '#FDE047',
        emoji: '👑',
        minPercent: 103,
        maxPercent: 150,
    },
}

// ==========================================
// ESCALA VISUAL (escalas-proporcoes.md §4.1)
// ==========================================

const ESCALA_INICIO = 75
const ESCALA_FIM = 110

/**
 * Converte % do ideal para posição na barra (0-100%)
 * Fórmula: ((percentual - 75) / 35) × 100
 */
export function percentualParaPosicaoBarra(percentualDoIdeal: number): number {
    const clamped = Math.max(ESCALA_INICIO, Math.min(ESCALA_FIM, percentualDoIdeal))
    return ((clamped - ESCALA_INICIO) / (ESCALA_FIM - ESCALA_INICIO)) * 100
}

/**
 * Posição do marcador GOLDEN na barra
 * GOLDEN = ((100 - 75) / 35) × 100 = 71.43%
 */
export function getPosicaoGolden(): number {
    return ((100 - ESCALA_INICIO) / (ESCALA_FIM - ESCALA_INICIO)) * 100
}

/**
 * Retorna os limites visuais de cada faixa na barra
 */
export function getFaixasVisuais(): Array<{
    id: ClassificacaoId
    inicio: number
    fim: number
    largura: number
    cor: string
}> {
    const faixas: Array<{ id: ClassificacaoId; inicioPercent: number; fimPercent: number }> = [
        { id: 'INICIO', inicioPercent: 75, fimPercent: 82 },
        { id: 'CAMINHO', inicioPercent: 82, fimPercent: 90 },
        { id: 'QUASE_LA', inicioPercent: 90, fimPercent: 97 },
        { id: 'META', inicioPercent: 97, fimPercent: 103 },
        { id: 'ELITE', inicioPercent: 103, fimPercent: 110 },
    ]

    return faixas.map(f => {
        const inicio = percentualParaPosicaoBarra(f.inicioPercent)
        const fim = percentualParaPosicaoBarra(f.fimPercent)
        return {
            id: f.id,
            inicio,
            fim,
            largura: fim - inicio,
            cor: CLASSIFICACOES[f.id].cor,
        }
    })
}

// ==========================================
// CLASSIFICAÇÃO (escalas-proporcoes.md §4.3)
// ==========================================

/**
 * Determina a classificação baseada no % do ideal
 */
export function getClassificacao(percentualDoIdeal: number): ClassificacaoProporcao {
    if (percentualDoIdeal < 82) return CLASSIFICACOES.INICIO
    if (percentualDoIdeal < 90) return CLASSIFICACOES.CAMINHO
    if (percentualDoIdeal < 97) return CLASSIFICACOES.QUASE_LA
    if (percentualDoIdeal < 103) return CLASSIFICACOES.META
    return CLASSIFICACOES.ELITE
}

/**
 * Label contextual para proporções normais
 */
export function getLabelContextual(percentualDoIdeal: number): string {
    if (percentualDoIdeal < 82) return 'INÍCIO DA JORNADA'
    if (percentualDoIdeal < 90) return `NO CAMINHO (${Math.round(percentualDoIdeal)}%)`
    if (percentualDoIdeal < 97) return `QUASE LÁ (${Math.round(percentualDoIdeal)}%)`
    if (percentualDoIdeal >= 97 && percentualDoIdeal <= 103) return 'META ATINGIDA! 🎯'
    return `ELITE (${Math.round(percentualDoIdeal)}%)`
}

// ==========================================
// PROPORÇÕES INVERSAS (escalas-proporcoes.md §5.2)
// ==========================================

/**
 * Calcula o percentual do ideal para proporções INVERSAS (cintura, WHR)
 * Onde estar ABAIXO do ideal é BOM
 */
export function calcularPercentualInverso(
    indiceAtual: number,
    indiceIdeal: number
): number {
    if (indiceAtual <= indiceIdeal) {
        const bonus = ((indiceIdeal - indiceAtual) / indiceIdeal) * 100
        return Math.min(110, 100 + bonus * 0.5)
    }

    const excesso = ((indiceAtual - indiceIdeal) / indiceIdeal) * 100
    return Math.max(75, 100 - excesso * 1.5)
}

// ==========================================
// ASSIMETRIA
// ==========================================

/**
 * Calcula diferença percentual entre dois lados
 */
export function calcularDiferencaAssimetria(
    ladoEsquerdo: number,
    ladoDireito: number
): { diferencaCm: number; diferencaPercentual: number } {
    const maior = Math.max(ladoEsquerdo, ladoDireito)
    const menor = Math.min(ladoEsquerdo, ladoDireito)
    const diferencaCm = Math.abs(ladoEsquerdo - ladoDireito)
    const diferencaPercentual = maior > 0
        ? ((maior - menor) / maior) * 100
        : 0

    return {
        diferencaCm: Math.round(diferencaCm * 10) / 10,
        diferencaPercentual: Math.round(diferencaPercentual * 10) / 10,
    }
}

/**
 * Determina o status de assimetria baseado na diferença percentual
 */
export function getStatusAssimetria(
    diferencaPercentual: number
): { status: AssimetriaStatus; emoji: string; label: string } {
    if (diferencaPercentual <= 2) {
        return { status: 'simetrico', emoji: '✅', label: 'Simétrico' }
    }
    if (diferencaPercentual <= 5) {
        return { status: 'leve', emoji: '⚠️', label: 'Leve assimetria' }
    }
    if (diferencaPercentual <= 10) {
        return { status: 'moderada', emoji: '🔶', label: 'Assimetria moderada' }
    }
    return { status: 'significativa', emoji: '❌', label: 'Assimetria significativa' }
}

/**
 * Cria um item de análise de assimetria completo
 */
export function criarAssimetriaItem(
    membro: string,
    ladoEsquerdo: number,
    ladoDireito: number
): AssimetriaItem {
    const { diferencaCm, diferencaPercentual } = calcularDiferencaAssimetria(ladoEsquerdo, ladoDireito)
    const { status, emoji, label } = getStatusAssimetria(diferencaPercentual)

    return {
        membro,
        ladoEsquerdo,
        ladoDireito,
        diferencaCm,
        diferencaPercentual,
        status,
        emoji,
        label,
    }
}

/**
 * Calcula o score geral de simetria baseado nos membros
 * Cada membro contribui igualmente; diferenças menores = score maior
 */
export function calcularScoreSimetria(
    membros: AssimetriaItem[]
): { score: number; classificacao: string; emoji: string } {
    if (membros.length === 0) {
        return { score: 100, classificacao: 'SEM DADOS', emoji: '📊' }
    }

    const scores = membros.map(m => {
        // 0% diferença = 100 pts, 10%+ = ~50 pts
        return Math.max(50, 100 - m.diferencaPercentual * 5)
    })

    const score = Math.round(
        scores.reduce((a, b) => a + b, 0) / scores.length
    )

    let classificacao = 'EXCELENTE'
    let emoji = '✅'
    if (score < 70) { classificacao = 'PRECISA MELHORAR'; emoji = '❌' }
    else if (score < 85) { classificacao = 'BOM'; emoji = '⚠️' }
    else if (score < 95) { classificacao = 'MUITO BOM'; emoji = '💪' }

    return { score, classificacao, emoji }
}
