/**
 * Types - Gamification System
 * Sistema de gamificação: Streaks, XP, Níveis e Badges
 */

// ============================================================================
// STREAKS
// ============================================================================

export interface StreakSystem {
    atual: number                   // Dias consecutivos atual
    recorde: number                 // Maior streak já alcançado
    ultimoRegistro: Date           // Último dia com registro
    proximaMilestone: number       // Próxima conquista (7, 14, 30, etc.)
}

export interface StreakConfig {
    trackersObrigatorios: string[] // Quais trackers mantêm o streak
    minimoTrackers: number         // Mínimo de trackers para manter
    milestones: {
        dias: number
        badge: string
        xp: number
        emoji: string
    }[]
}

// ============================================================================
// XP E NÍVEIS
// ============================================================================

export interface XPSystem {
    totalXP: number
    nivel: number
    xpAtual: number               // XP no nível atual
    xpProximoNivel: number        // XP necessário para próximo nível
    percentualNivel: number       // % de progresso no nível
}

export interface AcaoXP {
    tipo: XPActionType
    xp: number
    descricao: string
}

export type XPActionType =
    | 'registrarRefeicao'
    | 'registrarTreino'
    | 'registrarAgua'
    | 'registrarSono'
    | 'completarDia'
    | 'baterMetaProteina'
    | 'baterMetaAgua'
    | 'treinarNoDiaPlanejado'
    | 'fazerCheckinSemanal'
    | 'manterStreak7Dias'
    | 'manterStreak30Dias'
    | 'primeiraAvaliacao'
    | 'melhorarShape'

export interface Nivel {
    nivel: number
    nome: string
    xpMinimo: number
    xpMaximo: number
    cor: string
    icone: string
    beneficios?: string[]
}

// ============================================================================
// BADGES/CONQUISTAS
// ============================================================================

export interface Badge {
    id: string
    nome: string
    icone: string
    descricao: string
    categoria: BadgeCategory
    raridade: BadgeRarity
    xpBonus: number
    desbloqueado: boolean
    dataDesbloqueio?: Date
    progresso?: {
        atual: number
        total: number
    }
}

export type BadgeCategory =
    | 'streak'
    | 'treino'
    | 'nutricao'
    | 'progresso'
    | 'social'
    | 'especial'

export type BadgeRarity =
    | 'comum'
    | 'raro'
    | 'epico'
    | 'lendario'

// ============================================================================
// PERFIL DE GAMIFICAÇÃO
// ============================================================================

export interface GamificationProfile {
    atletaId: string

    // Streaks
    streak: StreakSystem

    // XP e Nível
    xp: XPSystem

    // Badges
    badges: Badge[]
    badgesDesbloqueados: number
    totalBadges: number

    // Estatísticas
    stats: {
        diasAtivos: number
        treinosCompletados: number
        refeicõesRegistradas: number
        litrosAguaBebidos: number
        horasDormidas: number
    }

    // Histórico
    historicoXP: {
        data: Date
        acao: XPActionType
        xp: number
    }[]

    createdAt: Date
    updatedAt: Date
}

// ============================================================================
// NOTIFICAÇÕES DE CONQUISTA
// ============================================================================

export interface ConquistaNotificacao {
    tipo: 'badge' | 'nivel' | 'streak'
    titulo: string
    mensagem: string
    icone: string
    xpGanho?: number
    mostrar: boolean
    timestamp: Date
}
