/**
 * Mock Data - Gamification Profiles
 * Perfis de gamificação com XP, níveis, badges e streaks
 */

import type { GamificationProfile, Badge } from '../types/gamification'
import { criarBadgesIniciais } from '../services/gamification'

// João Silva - Jogador experiente (Nível 5)
export const mockGamificationJoaoSilva: GamificationProfile = {
    atletaId: '1',

    streak: {
        atual: 12,
        recorde: 28,
        ultimoRegistro: new Date(),
        proximaMilestone: 14,
    },

    xp: {
        totalXP: 8500,
        nivel: 5,
        xpAtual: 1500,
        xpProximoNivel: 5000,
        percentualNivel: 30,
    },

    badges: criarBadgesIniciais().map(badge => {
        // Desbloquear alguns badges
        if (['streak_7', 'treino_10', 'treino_50', 'proteina_7dias', 'primeiro_kg', 'primeira_avaliacao', 'early_adopter'].includes(badge.id)) {
            return {
                ...badge,
                desbloqueado: true,
                dataDesbloqueio: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            }
        }

        // Adicionar progresso em alguns
        if (badge.id === 'streak_14') {
            return {
                ...badge,
                progresso: { atual: 12, total: 14 },
            }
        }
        if (badge.id === 'treino_100') {
            return {
                ...badge,
                progresso: { atual: 52, total: 100 },
            }
        }

        return badge
    }),

    badgesDesbloqueados: 7,
    totalBadges: 17,

    stats: {
        diasAtivos: 45,
        treinosCompletados: 52,
        refeicõesRegistradas: 215,
        litrosAguaBebidos: 135,
        horasDormidas: 320,
    },

    historicoXP: [
        { data: new Date(), acao: 'registrarTreino', xp: 25 },
        { data: new Date(Date.now() - 86400000), acao: 'baterMetaProteina', xp: 20 },
        { data: new Date(Date.now() - 2 * 86400000), acao: 'completarDia', xp: 50 },
    ],

    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
}

// Maria Santos - Jogadora intermediária (Nível 3)
export const mockGamificationMariaSantos: GamificationProfile = {
    atletaId: '2',

    streak: {
        atual: 5,
        recorde: 14,
        ultimoRegistro: new Date(),
        proximaMilestone: 7,
    },

    xp: {
        totalXP: 2200,
        nivel: 3,
        xpAtual: 700,
        xpProximoNivel: 2000,
        percentualNivel: 35,
    },

    badges: criarBadgesIniciais().map(badge => {
        if (['treino_10', 'primeiro_kg', 'primeira_avaliacao'].includes(badge.id)) {
            return {
                ...badge,
                desbloqueado: true,
                dataDesbloqueio: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000),
            }
        }

        if (badge.id === 'streak_7') {
            return {
                ...badge,
                progresso: { atual: 5, total: 7 },
            }
        }

        return badge
    }),

    badgesDesbloqueados: 3,
    totalBadges: 17,

    stats: {
        diasAtivos: 23,
        treinosCompletados: 28,
        refeicõesRegistradas: 98,
        litrosAguaBebidos: 68,
        horasDormidas: 165,
    },

    historicoXP: [],

    createdAt: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
}

// Pedro Oliveira - Jogador iniciante (Nível 1)
export const mockGamificationPedroOliveira: GamificationProfile = {
    atletaId: '3',

    streak: {
        atual: 0,
        recorde: 3,
        ultimoRegistro: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
        proximaMilestone: 7,
    },

    xp: {
        totalXP: 180,
        nivel: 1,
        xpAtual: 180,
        xpProximoNivel: 500,
        percentualNivel: 36,
    },

    badges: criarBadgesIniciais().map(badge => {
        if (badge.id === 'primeira_avaliacao') {
            return {
                ...badge,
                desbloqueado: true,
                dataDesbloqueio: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            }
        }

        if (badge.id === 'treino_10') {
            return {
                ...badge,
                progresso: { atual: 4, total: 10 },
            }
        }

        return badge
    }),

    badgesDesbloqueados: 1,
    totalBadges: 17,

    stats: {
        diasAtivos: 8,
        treinosCompletados: 4,
        refeicõesRegistradas: 22,
        litrosAguaBebidos: 18,
        horasDormidas: 52,
    },

    historicoXP: [],

    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
}

// Ana Costa - Jogadora avançada (Nível 7)
export const mockGamificationAnaCosta: GamificationProfile = {
    atletaId: '4',

    streak: {
        atual: 32,
        recorde: 45,
        ultimoRegistro: new Date(),
        proximaMilestone: 60,
    },

    xp: {
        totalXP: 24500,
        nivel: 7,
        xpAtual: 4500,
        xpProximoNivel: 15000,
        percentualNivel: 30,
    },

    badges: criarBadgesIniciais().map(badge => {
        // Desbloquear a maioria dos badges
        if ([
            'streak_7',
            'streak_14',
            'streak_30',
            'treino_10',
            'treino_50',
            'treino_100',
            'proteina_7dias',
            'dieta_perfeita',
            'hidratacao_completa',
            'primeiro_kg',
            'meta_5kg',
            'meta_bf',
            'primeira_avaliacao',
            'early_adopter',
            'feedback',
        ].includes(badge.id)) {
            return {
                ...badge,
                desbloqueado: true,
                dataDesbloqueio: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
            }
        }

        if (badge.id === 'streak_90') {
            return {
                ...badge,
                progresso: { atual: 32, total: 90 },
            }
        }

        return badge
    }),

    badgesDesbloqueados: 15,
    totalBadges: 17,

    stats: {
        diasAtivos: 92,
        treinosCompletados: 125,
        refeicõesRegistradas: 450,
        litrosAguaBebidos: 280,
        horasDormidas: 680,
    },

    historicoXP: [],

    createdAt: new Date(Date.now() - 92 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
}

export const mockGamificationProfiles = {
    '1': mockGamificationJoaoSilva,
    '2': mockGamificationMariaSantos,
    '3': mockGamificationPedroOliveira,
    '4': mockGamificationAnaCosta,
}
