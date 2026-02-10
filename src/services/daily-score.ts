/**
 * Daily Score Calculation Service
 * Calcula o score diário (0-100) baseado em múltiplos fatores
 */

import type { ResumoDiario, Insight, TipoInsight } from '../types/daily-tracking'

interface ScoreComponents {
    nutricao: number      // 0-30 pontos
    hidratacao: number    // 0-20 pontos
    treino: number        // 0-25 pontos
    sono: number          // 0-20 pontos
    saude: number         // 0-5 pontos (sem dores)
}

/**
 * Calcula o score diário total (0-100)
 */
export function calcularScoreDiario(resumo: ResumoDiario): number {
    const components = calcularComponentesScore(resumo)

    return Math.round(
        components.nutricao +
        components.hidratacao +
        components.treino +
        components.sono +
        components.saude
    )
}

/**
 * Calcula cada componente do score
 */
export function calcularComponentesScore(resumo: ResumoDiario): ScoreComponents {
    return {
        nutricao: calcularScoreNutricao(resumo),
        hidratacao: calcularScoreHidratacao(resumo),
        treino: calcularScoreTreino(resumo),
        sono: calcularScoreSono(resumo),
        saude: calcularScoreSaude(resumo),
    }
}

/**
 * Score de Nutrição (0-30)
 * Baseado em aderência às metas de macros
 */
function calcularScoreNutricao(resumo: ResumoDiario): number {
    const { nutricao } = resumo

    // Aderência de calorias (0-10 pontos)
    const aderenciaCalorias = Math.min(100, nutricao.aderenciaPercentual)
    const pontosCalorias = (aderenciaCalorias / 100) * 10

    // Aderência de proteína (0-15 pontos - MAIS IMPORTANTE)
    const aderenciaProteina = Math.min(100, (nutricao.totalProteina / nutricao.metaProteina) * 100)
    const pontosProteina = (aderenciaProteina / 100) * 15

    // Refeições realizadas (0-5 pontos)
    const pontosRefeicoes = Math.min(5, nutricao.refeicoes)

    return Math.round(pontosCalorias + pontosProteina + pontosRefeicoes)
}

/**
 * Score de Hidratação (0-20)
 */
function calcularScoreHidratacao(resumo: ResumoDiario): number {
    const { hidratacao } = resumo

    const aderencia = Math.min(100, hidratacao.aderenciaPercentual)
    return Math.round((aderencia / 100) * 20)
}

/**
 * Score de Treino (0-25)
 */
function calcularScoreTreino(resumo: ResumoDiario): number {
    const { treino } = resumo

    // Base: treinou = 15 pontos
    if (!treino.realizado) return 0

    let pontos = 15

    // Intensidade (0-10 pontos)
    if (treino.intensidade) {
        pontos += treino.intensidade * 2 // 1-5 → 2-10 pontos
    }

    return Math.min(25, pontos)
}

/**
 * Score de Sono (0-20)
 */
function calcularScoreSono(resumo: ResumoDiario): number {
    const { sono } = resumo

    // Horas de sono (0-12 pontos)
    let pontosHoras = 0
    if (sono.horas >= 7 && sono.horas <= 9) {
        pontosHoras = 12 // Ideal
    } else if (sono.horas >= 6 && sono.horas <= 10) {
        pontosHoras = 8  // Aceitável
    } else if (sono.horas >= 5) {
        pontosHoras = 4  // Insuficiente
    }

    // Qualidade (0-8 pontos)
    const pontosQualidade = (sono.qualidade / 5) * 8

    return Math.round(pontosHoras + pontosQualidade)
}

/**
 * Score de Saúde (0-5)
 * Penalidade por dores ativas
 */
function calcularScoreSaude(resumo: ResumoDiario): number {
    return resumo.doresAtivas === 0 ? 5 : 0
}

/**
 * Classifica o score em categorias
 */
export function classificarScore(score: number): {
    categoria: 'excelente' | 'bom' | 'regular' | 'ruim'
    cor: string
    emoji: string
    mensagem: string
} {
    if (score >= 85) {
        return {
            categoria: 'excelente',
            cor: '#10b981', // green-500
            emoji: '🔥',
            mensagem: 'Dia excepcional! Continue assim!',
        }
    }

    if (score >= 70) {
        return {
            categoria: 'bom',
            cor: '#3b82f6', // blue-500
            emoji: '💪',
            mensagem: 'Ótimo dia! Você está no caminho certo.',
        }
    }

    if (score >= 50) {
        return {
            categoria: 'regular',
            cor: '#f59e0b', // amber-500
            emoji: '⚠️',
            mensagem: 'Dia razoável. Tente melhorar amanhã!',
        }
    }

    return {
        categoria: 'ruim',
        cor: '#ef4444', // red-500
        emoji: '📉',
        mensagem: 'Dia difícil. Vamos focar na recuperação!',
    }
}

/**
 * Gera insights personalizados baseados no resumo do dia
 */
export function gerarInsights(resumo: ResumoDiario): Insight[] {
    const insights: Insight[] = []

    // INSIGHT: Déficit de Proteína
    const deficitProteina = resumo.nutricao.metaProteina - resumo.nutricao.totalProteina
    if (deficitProteina > 50) {
        insights.push({
            tipo: 'alerta',
            prioridade: 1,
            icone: '🥩',
            mensagem: `Faltam ${Math.round(deficitProteina)}g de proteína hoje. Que tal um shake com 2 scoops de whey (50g)?`,
        })
    } else if (deficitProteina > 20 && deficitProteina <= 50) {
        insights.push({
            tipo: 'dica',
            prioridade: 2,
            icone: '🍗',
            mensagem: `Faltam ${Math.round(deficitProteina)}g de proteína. Adicione uma porção de frango ou atum na próxima refeição.`,
        })
    }

    // INSIGHT: Hidratação baixa
    const deficitAgua = resumo.hidratacao.metaMl - resumo.hidratacao.totalMl
    if (deficitAgua > 1000) {
        insights.push({
            tipo: 'alerta',
            prioridade: 1,
            icone: '💧',
            mensagem: `Você ainda precisa beber ${(deficitAgua / 1000).toFixed(1)}L de água hoje. Mantenha uma garrafa por perto!`,
        })
    }

    // INSIGHT: Treino pendente
    if (resumo.treino.planejado && !resumo.treino.realizado) {
        const horaAtual = new Date().getHours()
        if (horaAtual < 20) {
            insights.push({
                tipo: 'lembrete',
                prioridade: 2,
                icone: '🏋️',
                mensagem: `Você tem treino de ${resumo.treino.tipo || 'musculação'} planejado para hoje. Não deixe para depois!`,
            })
        }
    }

    // INSIGHT: Sono insuficiente
    if (resumo.sono.horas < 6) {
        insights.push({
            tipo: 'alerta',
            prioridade: 1,
            icone: '😴',
            mensagem: `Você dormiu apenas ${resumo.sono.horas.toFixed(1)}h. Tente dormir mais cedo hoje para recuperar!`,
        })
    } else if (resumo.sono.qualidade <= 2) {
        insights.push({
            tipo: 'dica',
            prioridade: 2,
            icone: '🌙',
            mensagem: 'Qualidade do sono baixa. Evite telas 1h antes de dormir e mantenha o quarto escuro.',
        })
    }

    // INSIGHT: Dor ativa
    if (resumo.doresAtivas > 0) {
        insights.push({
            tipo: 'alerta',
            prioridade: 1,
            icone: '🤕',
            mensagem: `Você tem ${resumo.doresAtivas} dor(es) ativa(s). Evite exercícios que agravam e considere descanso.`,
        })
    }

    // INSIGHT: Elogio por dia completo
    const score = calcularScoreDiario(resumo)
    if (score >= 85 && resumo.treino.realizado) {
        insights.push({
            tipo: 'elogio',
            prioridade: 3,
            icone: '🎉',
            mensagem: `Dia excepcional! Score de ${score}/100. Você está arrasando!`,
        })
    }

    // INSIGHT: Streak
    if (resumo.streakAtual > 0 && resumo.streakAtual % 7 === 0) {
        insights.push({
            tipo: 'elogio',
            prioridade: 2,
            icone: '🔥',
            mensagem: `${resumo.streakAtual} dias de consistência! Continue com esse ritmo incrível!`,
        })
    }

    // Ordenar por prioridade
    return insights.sort((a, b) => a.prioridade - b.prioridade)
}

/**
 * Retorna o insight mais relevante (maior prioridade)
 */
export function getInsightPrincipal(resumo: ResumoDiario): Insight | null {
    const insights = gerarInsights(resumo)
    return insights.length > 0 ? insights[0] : null
}
