/**
 * Mock Progress Data
 */

import { GraficoEvolucaoData, ProporcaoResumo, ScoreGeral } from '../types/athlete-portal'

export const mockScoreGeral: ScoreGeral = {
    score: 78,
    classificacao: 'QUASE LÁ',
    emoji: '💪',
    variacaoVsMes: 5
}

export const mockGraficoEvolucao: GraficoEvolucaoData = {
    metrica: 'score',
    periodo: '6m',
    dados: [
        { data: new Date('2025-09-01'), valor: 65 },
        { data: new Date('2025-10-01'), valor: 68 },
        { data: new Date('2025-11-01'), valor: 71 },
        { data: new Date('2025-12-01'), valor: 73 },
        { data: new Date('2026-01-01'), valor: 78 }
    ]
}

export const mockProporcoesResumo: ProporcaoResumo[] = [
    {
        nome: 'Shape-V',
        atual: 1.52,
        meta: 1.62,
        percentual: 94,
        classificacao: 'QUASE LÁ',
        emoji: '💪'
    },
    {
        nome: 'Ombro/Cintura',
        atual: 1.48,
        meta: 1.5,
        percentual: 99,
        classificacao: 'SHAPE MODELO',
        emoji: '✨'
    },
    {
        nome: 'Braço/Antebraço',
        atual: 1.28,
        meta: 1.3,
        percentual: 98,
        classificacao: 'SHAPE MODELO',
        emoji: '💪'
    }
]

export const mockHistoricoAvaliacoes = [
    {
        id: 'av-3',
        data: new Date('2026-01-15'),
        score: 78,
        classificacao: 'QUASE LÁ'
    },
    {
        id: 'av-2',
        data: new Date('2025-12-10'),
        score: 73,
        classificacao: 'EVOLUINDO'
    },
    {
        id: 'av-1',
        data: new Date('2025-11-05'),
        score: 68,
        classificacao: 'EVOLUINDO'
    }
]
