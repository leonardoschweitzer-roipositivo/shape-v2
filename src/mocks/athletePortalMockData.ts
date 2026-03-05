/**
 * Athlete Portal Mock Data
 * 
 * Dados simulados para desenvolvimento do Portal do Atleta
 */

import { TodayScreenData } from '../types/athlete-portal'

export const mockTodayData: TodayScreenData = {
    atleta: {
        nome: 'João Silva',
        streak: 7
    },

    dataFormatada: 'Dom, 10 Fev',

    treino: {
        id: '1',
        titulo: 'PEITO + TRÍCEPS',
        subtitulo: 'Foco: Peitoral superior (gap identificado)',
        diaAtual: 3,
        diasTotal: 5,
        status: 'pendente',
        exercicios: [
            {
                id: '1',
                nome: 'Supino Inclinado com Halteres',
                series: 4,
                repeticoes: '10-12',
                foco: 'Peitoral superior',
                dica: 'Controle a descida'
            },
            {
                id: '2',
                nome: 'Supino Reto com Barra',
                series: 4,
                repeticoes: '8-10',
                dica: 'Desça a barra até o peito'
            },
            {
                id: '3',
                nome: 'Crucifixo Inclinado',
                series: 3,
                repeticoes: '12-15',
                dica: 'Sinta o alongamento'
            },
            {
                id: '4',
                nome: 'Cross Over',
                series: 3,
                repeticoes: '15',
                dica: 'Contraia no centro'
            },
            {
                id: '5',
                nome: 'Tríceps Pulley',
                series: 4,
                repeticoes: '12'
            },
            {
                id: '6',
                nome: 'Tríceps Francês',
                series: 3,
                repeticoes: '12'
            }
        ]
    },

    dieta: {
        metaCalorias: 2500,
        metaProteina: 180,
        metaCarbos: 280,
        metaGordura: 70,

        consumidoCalorias: 1200,
        consumidoProteina: 80,
        consumidoCarbos: 120,
        consumidoGordura: 45,

        percentualCalorias: 48,
        percentualProteina: 44,
        percentualCarbos: 43,
        percentualGordura: 64
    },

    trackers: [
        {
            id: 'agua',
            icone: '💧',
            label: 'Água',
            valor: '1.5',
            unidade: 'L',
            status: 'registrado'
        },
        {
            id: 'sono',
            icone: '😴',
            label: 'Sono',
            valor: '7',
            unidade: 'h',
            status: 'registrado'
        },
        {
            id: 'peso',
            icone: '⚖️',
            label: 'Peso',
            valor: '85',
            unidade: 'kg',
            status: 'registrado'
        },
        {
            id: 'dor',
            icone: '🤕',
            label: 'Dor',
            status: 'pendente'
        }
    ],

    dicaCoach: {
        tipo: 'alerta',
        mensagem: 'Faltam 100g de proteína hoje. Que tal um shake pós-treino com 2 scoops de whey?',
        acao: {
            label: 'FALAR COM O COACH',
            callback: () => { /* noop */ }
        }
    }
}

// Mock data alternativo para treino completo
export const mockTodayDataTreinoCompleto: TodayScreenData = {
    ...mockTodayData,
    treino: {
        ...mockTodayData.treino,
        status: 'completo',
        duracao: 90,
        intensidade: 4
    }
}

// Mock data para dia de descanso
export const mockTodayDataDescanso: TodayScreenData = {
    ...mockTodayData,
    treino: {
        ...mockTodayData.treino,
        status: 'descanso'
    }
}
