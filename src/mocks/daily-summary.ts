/**
 * Mock Data - Daily Summary with Score and Insights
 * Resumo diário completo para o card de acompanhamento
 */

import type { ResumoDiario } from '../types/daily-tracking'

// João Silva - Dia excelente
export const mockResumoDiarioJoaoSilva: ResumoDiario = {
    id: '1',
    atletaId: '1',
    data: new Date(),

    nutricao: {
        refeicoes: 5,
        totalCalorias: 2380,
        totalProteina: 175,
        totalCarboidrato: 265,
        totalGordura: 68,
        metaCalorias: 2500,
        metaProteina: 180,
        metaCarboidrato: 280,
        metaGordura: 70,
        aderenciaPercentual: 95,
    },

    hidratacao: {
        totalMl: 2800,
        metaMl: 3000,
        aderenciaPercentual: 93,
    },

    treino: {
        planejado: true,
        realizado: true,
        tipo: 'Peito + Tríceps',
        duracao: 75,
        intensidade: 4,
    },

    sono: {
        horas: 7.5,
        qualidade: 4,
        energiaResultante: 8,
    },

    doresAtivas: 0,

    scoreDia: 92,
    streakAtual: 12,

    createdAt: new Date(),
    updatedAt: new Date(),
}

// Maria Santos - Dia regular (déficit nutricional)
export const mockResumoDiarioMariaSantos: ResumoDiario = {
    id: '2',
    atletaId: '2',
    data: new Date(),

    nutricao: {
        refeicoes: 3,
        totalCalorias: 1320,
        totalProteina: 85,
        totalCarboidrato: 145,
        totalGordura: 42,
        metaCalorias: 2000,
        metaProteina: 140,
        metaCarboidrato: 180,
        metaGordura: 55,
        aderenciaPercentual: 66,
    },

    hidratacao: {
        totalMl: 1800,
        metaMl: 3000,
        aderenciaPercentual: 60,
    },

    treino: {
        planejado: true,
        realizado: true,
        tipo: 'Glúteos + Pernas',
        duracao: 60,
        intensidade: 3,
    },

    sono: {
        horas: 6.5,
        qualidade: 3,
        energiaResultante: 6,
    },

    doresAtivas: 0,

    scoreDia: 62,
    streakAtual: 5,

    createdAt: new Date(),
    updatedAt: new Date(),
}

// Pedro Oliveira - Dia ruim (múltiplos problemas)
export const mockResumoDiarioPedroOliveira: ResumoDiario = {
    id: '3',
    atletaId: '3',
    data: new Date(),

    nutricao: {
        refeicoes: 2,
        totalCalorias: 980,
        totalProteina: 52,
        totalCarboidrato: 98,
        totalGordura: 35,
        metaCalorias: 2200,
        metaProteina: 150,
        metaCarboidrato: 220,
        metaGordura: 60,
        aderenciaPercentual: 45,
    },

    hidratacao: {
        totalMl: 950,
        metaMl: 3000,
        aderenciaPercentual: 32,
    },

    treino: {
        planejado: true,
        realizado: false,
        tipo: 'Costas + Bíceps',
        duracao: 0,
        intensidade: undefined,
    },

    sono: {
        horas: 5.2,
        qualidade: 2,
        energiaResultante: 3,
    },

    doresAtivas: 1,

    scoreDia: 28,
    streakAtual: 0,

    createdAt: new Date(),
    updatedAt: new Date(),
}

// Ana Costa - Dia bom (quase lá)
export const mockResumoDiarioAnaCosta: ResumoDiario = {
    id: '4',
    atletaId: '4',
    data: new Date(),

    nutricao: {
        refeicoes: 4,
        totalCalorias: 1880,
        totalProteina: 128,
        totalCarboidrato: 195,
        totalGordura: 52,
        metaCalorias: 2100,
        metaProteina: 145,
        metaCarboidrato: 210,
        metaGordura: 58,
        aderenciaPercentual: 89,
    },

    hidratacao: {
        totalMl: 2650,
        metaMl: 3000,
        aderenciaPercentual: 88,
    },

    treino: {
        planejado: true,
        realizado: true,
        tipo: 'Ombros + Abdômen',
        duracao: 55,
        intensidade: 3,
    },

    sono: {
        horas: 7.8,
        qualidade: 4,
        energiaResultante: 8,
    },

    doresAtivas: 0,

    scoreDia: 81,
    streakAtual: 8,

    createdAt: new Date(),
    updatedAt: new Date(),
}

export const mockResumosDiarios = {
    '1': mockResumoDiarioJoaoSilva,
    '2': mockResumoDiarioMariaSantos,
    '3': mockResumoDiarioPedroOliveira,
    '4': mockResumoDiarioAnaCosta,
}
