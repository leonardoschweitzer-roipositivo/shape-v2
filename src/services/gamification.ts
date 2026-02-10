/**
 * Gamification Service
 * Gerencia sistema de XP, níveis, streaks e badges
 */

import type {
    XPSystem,
    XPActionType,
    Nivel,
    Badge,
    StreakSystem,
    BadgeCategory,
    BadgeRarity,
    GamificationProfile,
} from '../types/gamification'

// ============================================================================
// CONFIGURAÇÃO DE XP POR AÇÃO
// ============================================================================

export const XP_ACTIONS: Record<XPActionType, number> = {
    registrarRefeicao: 10,
    registrarTreino: 25,
    registrarAgua: 5,
    registrarSono: 10,
    completarDia: 50,
    baterMetaProteina: 20,
    baterMetaAgua: 15,
    treinarNoDiaPlanejado: 30,
    fazerCheckinSemanal: 100,
    manterStreak7Dias: 100,
    manterStreak30Dias: 500,
    primeiraAvaliacao: 200,
    melhorarShape: 300,
}

// ============================================================================
// NÍVEIS
// ============================================================================

export const NIVEIS: Nivel[] = [
    {
        nivel: 1,
        nome: 'Iniciante',
        xpMinimo: 0,
        xpMaximo: 499,
        cor: '#9CA3AF',
        icone: '🌱',
        beneficios: ['Acesso ao Coach IA', 'Registro de atividades'],
    },
    {
        nivel: 2,
        nome: 'Dedicado',
        xpMinimo: 500,
        xpMaximo: 1499,
        cor: '#6EE7B7',
        icone: '💚',
        beneficios: ['Insights personalizados', 'Histórico de 30 dias'],
    },
    {
        nivel: 3,
        nome: 'Consistente',
        xpMinimo: 1500,
        xpMaximo: 3499,
        cor: '#60A5FA',
        icone: '💙',
        beneficios: ['Gráficos de evolução', 'Comparativo mensal'],
    },
    {
        nivel: 4,
        nome: 'Comprometido',
        xpMinimo: 3500,
        xpMaximo: 6999,
        cor: '#A78BFA',
        icone: '💜',
        beneficios: ['Planos personalizados', 'Alertas inteligentes'],
    },
    {
        nivel: 5,
        nome: 'Disciplinado',
        xpMinimo: 7000,
        xpMaximo: 11999,
        cor: '#F59E0B',
        icone: '🧡',
        beneficios: ['Dashboard avançado', 'Análise preditiva'],
    },
    {
        nivel: 6,
        nome: 'Avançado',
        xpMinimo: 12000,
        xpMaximo: 19999,
        cor: '#EC4899',
        icone: '💗',
        beneficios: ['Treinos IA personalizados', 'Nutrição otimizada'],
    },
    {
        nivel: 7,
        nome: 'Expert',
        xpMinimo: 20000,
        xpMaximo: 34999,
        cor: '#8B5CF6',
        icone: '🔮',
        beneficios: ['Módulo de competição', 'Coaching premium'],
    },
    {
        nivel: 8,
        nome: 'Elite',
        xpMinimo: 35000,
        xpMaximo: 54999,
        cor: '#F97316',
        icone: '🔥',
        beneficios: ['Perfil verificado', 'Comunidade Elite'],
    },
    {
        nivel: 9,
        nome: 'Mestre',
        xpMinimo: 55000,
        xpMaximo: 79999,
        cor: '#06B6D4',
        icone: '💎',
        beneficios: ['Mentor de novatos', 'Eventos exclusivos'],
    },
    {
        nivel: 10,
        nome: 'Lenda',
        xpMinimo: 80000,
        xpMaximo: Infinity,
        cor: '#FFD700',
        icone: '👑',
        beneficios: ['Todas as features', 'Hall da Fama'],
    },
]

// ============================================================================
// BADGES
// ============================================================================

export const BADGES_CATALOG: Omit<Badge, 'desbloqueado' | 'dataDesbloqueio'>[] = [
    // STREAK
    {
        id: 'streak_7',
        nome: '1 Semana de Fogo',
        icone: '🔥',
        descricao: '7 dias consecutivos registrando atividades',
        categoria: 'streak',
        raridade: 'comum',
        xpBonus: 100,
    },
    {
        id: 'streak_14',
        nome: '2 Semanas Forte',
        icone: '🔥🔥',
        descricao: '14 dias consecutivos',
        categoria: 'streak',
        raridade: 'raro',
        xpBonus: 250,
    },
    {
        id: 'streak_30',
        nome: 'Mês Perfeito',
        icone: '📅',
        descricao: '30 dias consecutivos',
        categoria: 'streak',
        raridade: 'epico',
        xpBonus: 500,
    },
    {
        id: 'streak_90',
        nome: 'Trimestre Imbatível',
        icone: '💪',
        descricao: '90 dias consecutivos',
        categoria: 'streak',
        raridade: 'lendario',
        xpBonus: 2000,
    },

    // TREINO
    {
        id: 'treino_10',
        nome: 'Primeira Dezena',
        icone: '🏋️',
        descricao: '10 treinos registrados',
        categoria: 'treino',
        raridade: 'comum',
        xpBonus: 50,
    },
    {
        id: 'treino_50',
        nome: 'Meio Centenário',
        icone: '💪',
        descricao: '50 treinos registrados',
        categoria: 'treino',
        raridade: 'raro',
        xpBonus: 300,
    },
    {
        id: 'treino_100',
        nome: 'Centurião',
        icone: '💯',
        descricao: '100 treinos registrados',
        categoria: 'treino',
        raridade: 'epico',
        xpBonus: 500,
    },
    {
        id: 'treino_madrugador',
        nome: 'Madrugador',
        icone: '🌅',
        descricao: 'Treinou antes das 7h',
        categoria: 'treino',
        raridade: 'raro',
        xpBonus: 50,
    },
    {
        id: 'treino_noturno',
        nome: 'Coruja',
        icone: '🦉',
        descricao: 'Treinou depois das 22h',
        categoria: 'treino',
        raridade: 'raro',
        xpBonus: 50,
    },

    // NUTRIÇÃO
    {
        id: 'proteina_7dias',
        nome: 'Máquina de Proteína',
        icone: '🥩',
        descricao: 'Bateu meta de proteína 7 dias seguidos',
        categoria: 'nutricao',
        raridade: 'epico',
        xpBonus: 200,
    },
    {
        id: 'dieta_perfeita',
        nome: 'Dieta Perfeita',
        icone: '🎯',
        descricao: '100% de aderência em um dia',
        categoria: 'nutricao',
        raridade: 'raro',
        xpBonus: 100,
    },
    {
        id: 'hidratacao_completa',
        nome: 'Hidratação Master',
        icone: '💧',
        descricao: 'Bateu meta de água 14 dias seguidos',
        categoria: 'nutricao',
        raridade: 'epico',
        xpBonus: 150,
    },

    // PROGRESSO
    {
        id: 'primeiro_kg',
        nome: 'Primeira Conquista',
        icone: '⚖️',
        descricao: 'Perdeu/ganhou 1kg',
        categoria: 'progresso',
        raridade: 'comum',
        xpBonus: 100,
    },
    {
        id: 'meta_5kg',
        nome: 'Transformação Visível',
        icone: '📉',
        descricao: 'Alcançou 5kg de mudança',
        categoria: 'progresso',
        raridade: 'raro',
        xpBonus: 500,
    },
    {
        id: 'meta_bf',
        nome: 'Definição',
        icone: '💪',
        descricao: 'Atingiu meta de BF%',
        categoria: 'progresso',
        raridade: 'epico',
        xpBonus: 1000,
    },
    {
        id: 'proporcao_ideal',
        nome: 'Proporção Áurea',
        icone: '✨',
        descricao: 'Atingiu proporção ideal em uma métrica',
        categoria: 'progresso',
        raridade: 'lendario',
        xpBonus: 500,
    },

    // ESPECIAIS
    {
        id: 'early_adopter',
        nome: 'Pioneiro',
        icone: '🚀',
        descricao: 'Usuário dos primeiros 1000',
        categoria: 'especial',
        raridade: 'lendario',
        xpBonus: 500,
    },
    {
        id: 'feedback',
        nome: 'Voz Ativa',
        icone: '📣',
        descricao: 'Enviou feedback para o app',
        categoria: 'especial',
        raridade: 'comum',
        xpBonus: 50,
    },
    {
        id: 'primeira_avaliacao',
        nome: 'Autoconhecimento',
        icone: '📊',
        descricao: 'Completou primeira avaliação',
        categoria: 'especial',
        raridade: 'comum',
        xpBonus: 200,
    },
]

// ============================================================================
// FUNÇÕES DE XP E NÍVEIS
// ============================================================================

/**
 * Calcula o nível baseado no XP total
 */
export function calcularNivel(totalXP: number): Nivel {
    for (let i = NIVEIS.length - 1; i >= 0; i--) {
        if (totalXP >= NIVEIS[i].xpMinimo) {
            return NIVEIS[i]
        }
    }
    return NIVEIS[0]
}

/**
 * Calcula informações do sistema de XP
 */
export function calcularXPSystem(totalXP: number): XPSystem {
    const nivelAtual = calcularNivel(totalXP)
    const proximoNivel = NIVEIS.find(n => n.nivel === nivelAtual.nivel + 1)

    const xpAtual = totalXP - nivelAtual.xpMinimo
    const xpProximoNivel = proximoNivel
        ? proximoNivel.xpMinimo - nivelAtual.xpMinimo
        : 0

    const percentualNivel = xpProximoNivel > 0
        ? Math.round((xpAtual / xpProximoNivel) * 100)
        : 100

    return {
        totalXP,
        nivel: nivelAtual.nivel,
        xpAtual,
        xpProximoNivel,
        percentualNivel,
    }
}

/**
 * Adiciona XP e retorna se subiu de nível
 */
export function adicionarXP(
    xpAtual: number,
    acao: XPActionType
): { novoXP: number; subiuNivel: boolean; nivelAnterior: number; novoNivel: number } {
    const nivelAnterior = calcularNivel(xpAtual).nivel
    const xpGanho = XP_ACTIONS[acao]
    const novoXP = xpAtual + xpGanho
    const novoNivel = calcularNivel(novoXP).nivel

    return {
        novoXP,
        subiuNivel: novoNivel > nivelAnterior,
        nivelAnterior,
        novoNivel,
    }
}

// ============================================================================
// FUNÇÕES DE STREAKS
// ============================================================================

/**
 * Atualiza o streak baseado no último registro
 */
export function atualizarStreak(
    streakAtual: StreakSystem,
    novoRegistro: Date
): StreakSystem {
    const agora = new Date(novoRegistro)
    const ontem = new Date(agora)
    ontem.setDate(ontem.getDate() - 1)

    const ultimoRegistroData = new Date(streakAtual.ultimoRegistro)
    ultimoRegistroData.setHours(0, 0, 0, 0)

    const ontemNormalizado = new Date(ontem)
    ontemNormalizado.setHours(0, 0, 0, 0)

    const hojeNormalizado = new Date(agora)
    hojeNormalizado.setHours(0, 0, 0, 0)

    // Se registrou hoje, não muda nada
    if (ultimoRegistroData.getTime() === hojeNormalizado.getTime()) {
        return streakAtual
    }

    // Se registrou ontem, mantém o streak
    if (ultimoRegistroData.getTime() === ontemNormalizado.getTime()) {
        const novoStreak = streakAtual.atual + 1
        return {
            atual: novoStreak,
            recorde: Math.max(novoStreak, streakAtual.recorde),
            ultimoRegistro: agora,
            proximaMilestone: getProximaMilestone(novoStreak),
        }
    }

    // Quebrou o streak
    return {
        atual: 1,
        recorde: streakAtual.recorde,
        ultimoRegistro: agora,
        proximaMilestone: 7,
    }
}

/**
 * Retorna a próxima milestone do streak
 */
function getProximaMilestone(streakAtual: number): number {
    const milestones = [7, 14, 30, 60, 90, 180, 365]
    return milestones.find(m => m > streakAtual) || 999
}

// ============================================================================
// FUNÇÕES DE BADGES
// ============================================================================

/**
 * Verifica quais badges devem ser desbloqueados
 */
export function verificarBadges(profile: Partial<GamificationProfile>): string[] {
    const badgesDesbloqueados: string[] = []

    // Streak badges
    if (profile.streak && profile.streak.atual >= 7) {
        badgesDesbloqueados.push('streak_7')
    }
    if (profile.streak && profile.streak.atual >= 14) {
        badgesDesbloqueados.push('streak_14')
    }
    if (profile.streak && profile.streak.atual >= 30) {
        badgesDesbloqueados.push('streak_30')
    }
    if (profile.streak && profile.streak.atual >= 90) {
        badgesDesbloqueados.push('streak_90')
    }

    // Treino badges
    if (profile.stats && profile.stats.treinosCompletados >= 10) {
        badgesDesbloqueados.push('treino_10')
    }
    if (profile.stats && profile.stats.treinosCompletados >= 50) {
        badgesDesbloqueados.push('treino_50')
    }
    if (profile.stats && profile.stats.treinosCompletados >= 100) {
        badgesDesbloqueados.push('treino_100')
    }

    return badgesDesbloqueados
}

/**
 * Cria badges iniciais para um perfil
 */
export function criarBadgesIniciais(): Badge[] {
    return BADGES_CATALOG.map(badge => ({
        ...badge,
        desbloqueado: false,
    }))
}

/**
 * Retorna a cor baseada na raridade
 */
export function getCorRaridade(raridade: BadgeRarity): string {
    switch (raridade) {
        case 'comum':
            return '#9CA3AF'
        case 'raro':
            return '#3B82F6'
        case 'epico':
            return '#A855F7'
        case 'lendario':
            return '#F59E0B'
        default:
            return '#6B7280'
    }
}
