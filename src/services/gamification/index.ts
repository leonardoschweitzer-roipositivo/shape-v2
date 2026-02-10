/**
 * Gamification Service
 * 
 * Lógica de gamificação: streaks, XP, níveis e badges
 */

import type {
    StreakSystem,
    XPSystem,
    Badge,
    ResumoDiario
} from '../../types/daily-tracking'
import { STREAK_CONFIG, XP_ACOES, NIVEIS, BADGES } from '../../config/tracker-config'

/**
 * Calcula o streak atual baseado no histórico
 */
export function calcularStreak(historico: ResumoDiario[]): StreakSystem {
    if (historico.length === 0) {
        return {
            atual: 0,
            recorde: 0,
            ultimoRegistro: new Date(),
            diasParaManter: STREAK_CONFIG.trackersObrigatorios,
            minimoParaContar: STREAK_CONFIG.minimoTrackers,
        }
    }

    // Ordenar por data decrescente
    const historicoOrdenado = [...historico].sort(
        (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
    )

    let streakAtual = 0
    let streakRecorde = 0
    let streakTemp = 0

    // Verificar se hoje conta
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    const ultimoDia = new Date(historicoOrdenado[0].data)
    ultimoDia.setHours(0, 0, 0, 0)

    const diffDias = Math.floor((hoje.getTime() - ultimoDia.getTime()) / (1000 * 60 * 60 * 24))

    // Se o último registro foi hoje ou ontem, começamos a contar
    if (diffDias <= 1) {
        for (let i = 0; i < historicoOrdenado.length; i++) {
            const registro = historicoOrdenado[i]

            // Verificar se o dia conta para o streak
            if (diaContaParaStreak(registro)) {
                streakTemp++

                // Verificar se é consecutivo com o próximo
                if (i < historicoOrdenado.length - 1) {
                    const diaAtual = new Date(registro.data)
                    diaAtual.setHours(0, 0, 0, 0)

                    const proxDia = new Date(historicoOrdenado[i + 1].data)
                    proxDia.setHours(0, 0, 0, 0)

                    const diff = Math.floor((diaAtual.getTime() - proxDia.getTime()) / (1000 * 60 * 60 * 24))

                    // Se não é consecutivo, quebra o streak
                    if (diff > 1) {
                        break
                    }
                }
            } else {
                // Dia não conta, quebra o streak
                break
            }
        }

        streakAtual = streakTemp
    }

    // Calcular recorde
    streakTemp = 0
    for (let i = 0; i < historicoOrdenado.length; i++) {
        const registro = historicoOrdenado[i]

        if (diaContaParaStreak(registro)) {
            streakTemp++

            if (i < historicoOrdenado.length - 1) {
                const diaAtual = new Date(registro.data)
                diaAtual.setHours(0, 0, 0, 0)

                const proxDia = new Date(historicoOrdenado[i + 1].data)
                proxDia.setHours(0, 0, 0, 0)

                const diff = Math.floor((diaAtual.getTime() - proxDia.getTime()) / (1000 * 60 * 60 * 24))

                if (diff > 1) {
                    if (streakTemp > streakRecorde) {
                        streakRecorde = streakTemp
                    }
                    streakTemp = 0
                }
            }
        } else {
            if (streakTemp > streakRecorde) {
                streakRecorde = streakTemp
            }
            streakTemp = 0
        }
    }

    if (streakTemp > streakRecorde) {
        streakRecorde = streakTemp
    }

    return {
        atual: streakAtual,
        recorde: Math.max(streakRecorde, streakAtual),
        ultimoRegistro: new Date(historicoOrdenado[0].data),
        diasParaManter: STREAK_CONFIG.trackersObrigatorios,
        minimoParaContar: STREAK_CONFIG.minimoTrackers,
    }
}

/**
 * Verifica se um dia específico conta para o streak
 */
function diaContaParaStreak(dia: ResumoDiario): boolean {
    let trackersCompletos = 0

    // Refeição: pelo menos 3 de 5
    if (dia.nutricao.refeicoes >= 3) {
        trackersCompletos++
    }

    // Treino: se planejado, deve ser realizado
    if (dia.treino.planejado) {
        if (dia.treino.realizado) {
            trackersCompletos++
        }
    } else {
        // Se não planejado, não conta contra
        trackersCompletos++
    }

    // Água: pelo menos 60% da meta
    if (dia.hidratacao.aderenciaPercentual >= 60) {
        trackersCompletos++
    }

    return trackersCompletos >= STREAK_CONFIG.minimoTrackers
}

/**
 * Calcula XP ganho por uma ação
 */
export function calcularXP(acao: keyof typeof XP_ACOES): number {
    return XP_ACOES[acao] || 0
}

/**
 * Calcula o nível atual baseado no XP total
 */
export function calcularNivel(xpTotal: number): number {
    for (let i = NIVEIS.length - 1; i >= 0; i--) {
        if (xpTotal >= NIVEIS[i].xpMinimo) {
            return NIVEIS[i].nivel
        }
    }
    return 1
}

/**
 * Calcula XP necessário para o próximo nível
 */
export function calcularXPProximoNivel(nivelAtual: number): number {
    const proximoNivel = NIVEIS.find(n => n.nivel === nivelAtual + 1)
    return proximoNivel ? proximoNivel.xpMinimo : 0
}

/**
 * Retorna o nome do nível atual
 */
export function getNomeNivel(nivel: number): string {
    const nivelData = NIVEIS.find(n => n.nivel === nivel)
    return nivelData ? nivelData.nome : 'Iniciante'
}

/**
 * Verifica novos badges conquistados
 */
export function verificarNovosBadges(
    dadosAtual: ResumoDiario,
    historico: ResumoDiario[],
    badgesConquistados: string[]
): Badge[] {
    const novosBadges: Badge[] = []

    // Streak badges
    const streak = calcularStreak([dadosAtual, ...historico])

    if (streak.atual === 7 && !badgesConquistados.includes('streak_7')) {
        novosBadges.push({
            ...BADGES.find(b => b.id === 'streak_7')!,
            condicao: () => true,
            conquistado: true,
            dataConquista: new Date(),
        })
    }

    if (streak.atual === 30 && !badgesConquistados.includes('streak_30')) {
        novosBadges.push({
            ...BADGES.find(b => b.id === 'streak_30')!,
            condicao: () => true,
            conquistado: true,
            dataConquista: new Date(),
        })
    }

    if (streak.atual === 90 && !badgesConquistados.includes('streak_90')) {
        novosBadges.push({
            ...BADGES.find(b => b.id === 'streak_90')!,
            condicao: () => true,
            conquistado: true,
            dataConquista: new Date(),
        })
    }

    // Treino badges
    const totalTreinos = historico.filter(d => d.treino.realizado).length

    if (totalTreinos >= 100 && !badgesConquistados.includes('treino_100')) {
        novosBadges.push({
            ...BADGES.find(b => b.id === 'treino_100')!,
            condicao: () => true,
            conquistado: true,
            dataConquista: new Date(),
        })
    }

    // Nutrição badges
    if (dadosAtual.nutricao.aderenciaPercentual >= 100 && !badgesConquistados.includes('dieta_perfeita')) {
        novosBadges.push({
            ...BADGES.find(b => b.id === 'dieta_perfeita')!,
            condicao: () => true,
            conquistado: true,
            dataConquista: new Date(),
        })
    }

    // Proteína 7 dias
    const ultimos7Dias = historico.slice(0, 7)
    const bateuProteinaTodosOsDias = ultimos7Dias.every(
        d => d.nutricao.totalProteina >= d.nutricao.metaProteina
    )

    if (bateuProteinaTodosOsDias && ultimos7Dias.length === 7 && !badgesConquistados.includes('proteina_7dias')) {
        novosBadges.push({
            ...BADGES.find(b => b.id === 'proteina_7dias')!,
            condicao: () => true,
            conquistado: true,
            dataConquista: new Date(),
        })
    }

    // Hidratação 7 dias
    const bateuAguaTodosOsDias = ultimos7Dias.every(
        d => d.hidratacao.aderenciaPercentual >= 100
    )

    if (bateuAguaTodosOsDias && ultimos7Dias.length === 7 && !badgesConquistados.includes('hidratacao_perfeita')) {
        novosBadges.push({
            ...BADGES.find(b => b.id === 'hidratacao_perfeita')!,
            condicao: () => true,
            conquistado: true,
            dataConquista: new Date(),
        })
    }

    return novosBadges
}

/**
 * Calcula o score do dia (0-100)
 */
export function calcularScoreDia(dados: ResumoDiario): number {
    let score = 0

    // Nutrição (40 pontos)
    score += (dados.nutricao.aderenciaPercentual / 100) * 40

    // Treino (30 pontos)
    if (dados.treino.planejado) {
        if (dados.treino.realizado) {
            score += 30

            // Bônus por intensidade
            if (dados.treino.intensidade && dados.treino.intensidade >= 3) {
                score += 5
            }
        }
    } else {
        score += 15 // Pontuação parcial se não tinha treino planejado
    }

    // Hidratação (15 pontos)
    score += (dados.hidratacao.aderenciaPercentual / 100) * 15

    // Sono (15 pontos)
    const scoreSono = (dados.sono.horas / 8) * 10 + (dados.sono.qualidade / 5) * 5
    score += Math.min(scoreSono, 15)

    // Penalidade por dor
    score -= dados.doresAtivas * 5

    return Math.max(0, Math.min(100, Math.round(score)))
}
