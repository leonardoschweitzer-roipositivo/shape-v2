/**
 * Mock Data - Daily Tracking
 * 
 * Dados mocka dos para desenvolvimento do sistema de acompanhamento diário
 */

import type {
    ResumoDiario,
    Insight
} from '../types/daily-tracking'

/**
 * Resumo diário mockado para João Silva
 */
export const mockResumoDiario: ResumoDiario = {
    id: 'resumo-001',
    atletaId: 'athlete-001',
    data: new Date(),

    nutricao: {
        refeicoes: 2,
        totalCalorias: 1200,
        totalProteina: 80,
        totalCarboidrato: 120,
        totalGordura: 45,
        metaCalorias: 2500,
        metaProteina: 180,
        metaCarboidrato: 280,
        metaGordura: 70,
        aderenciaPercentual: 48,
    },

    hidratacao: {
        totalMl: 1500,
        metaMl: 3000,
        aderenciaPercentual: 50,
    },

    treino: {
        planejado: true,
        realizado: false,
        tipo: 'Peito + Tríceps',
        duracao: undefined,
        intensidade: undefined,
    },

    sono: {
        horas: 7,
        qualidade: 4,
        energiaResultante: 6,
    },

    doresAtivas: 0,
    scoreDia: 0,
    streakAtual: 7,

    createdAt: new Date(),
    updatedAt: new Date(),
}

/**
 * Insight mockado
 */
export const mockInsight: Insight = {
    tipo: 'alerta',
    prioridade: 1,
    icone: '⚠️',
    mensagem: 'Proteína crítica: apenas 80g de 180g. Você pode perder massa muscular!',
    acao: {
        label: 'Ver sugestões',
        callback: () => console.log('Ver sugestões de proteína'),
    },
}
