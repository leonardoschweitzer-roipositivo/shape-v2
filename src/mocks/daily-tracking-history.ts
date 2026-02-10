/**
 * Mock Data - Daily Tracking History
 * Histórico dos últimos 30 dias para visualização de evolução
 */

import type { DailyTrackingHistory } from '../types/daily-tracking'

// Helper para gerar datas dos últimos N dias
const gerarDatas = (dias: number): Date[] => {
    const datas: Date[] = []
    for (let i = dias - 1; i >= 0; i--) {
        const data = new Date()
        data.setDate(data.getDate() - i)
        data.setHours(0, 0, 0, 0)
        datas.push(data)
    }
    return datas
}

// Helper para gerar variação com tendência
const gerarComTendencia = (base: number, variacao: number, tendencia: 'subindo' | 'descendo' | 'estavel' = 'estavel'): number[] => {
    const datas = gerarDatas(30)
    return datas.map((_, i) => {
        let valor = base + (Math.random() - 0.5) * variacao

        if (tendencia === 'subindo') {
            valor += (i / 30) * (variacao * 0.5)
        } else if (tendencia === 'descendo') {
            valor -= (i / 30) * (variacao * 0.5)
        }

        return Math.max(0, Math.round(valor * 10) / 10)
    })
}

// João Silva - Atleta exemplar com boa consistência
export const mockHistoricoJoaoSilva: DailyTrackingHistory = {
    atletaId: '1',
    atletaNome: 'João Silva',
    periodo: { inicio: gerarDatas(30)[0], fim: new Date() },
    dados: gerarDatas(30).map((data, i) => ({
        data,
        nutricao: {
            refeicoes: Math.min(5, 3 + Math.floor(Math.random() * 3)),
            calorias: 2200 + Math.floor(Math.random() * 400),
            proteina: 150 + Math.floor(Math.random() * 30),
            carboidrato: 200 + Math.floor(Math.random() * 50),
            gordura: 60 + Math.floor(Math.random() * 20),
        },
        hidratacao: {
            totalMl: 2500 + Math.floor(Math.random() * 1000),
            metaMl: 3000,
        },
        treino: {
            realizado: Math.random() > 0.2, // 80% de aderência
            tipo: ['Peito', 'Costas', 'Pernas', 'Ombros', 'Braços'][i % 5],
            duracao: Math.random() > 0.2 ? 60 + Math.floor(Math.random() * 30) : 0,
            intensidade: Math.random() > 0.2 ? (3 + Math.floor(Math.random() * 2)) as 1 | 2 | 3 | 4 | 5 : undefined,
        },
        sono: {
            horas: 7 + Math.random() * 1.5,
            qualidade: (3 + Math.floor(Math.random() * 2)) as 1 | 2 | 3 | 4 | 5,
        },
        doresAtivas: Math.random() > 0.9 ? 1 : 0,
        streakAtual: Math.min(i + 1, 30),
    })),
}

// Maria Santos - Atenção: hidratação baixa, melhorando
export const mockHistoricoMariaSantos: DailyTrackingHistory = {
    atletaId: '2',
    atletaNome: 'Maria Santos',
    periodo: { inicio: gerarDatas(30)[0], fim: new Date() },
    dados: gerarDatas(30).map((data, i) => ({
        data,
        nutricao: {
            refeicoes: Math.min(5, 2 + Math.floor(Math.random() * 2)),
            calorias: 1600 + Math.floor(Math.random() * 300),
            proteina: 90 + Math.floor(Math.random() * 20),
            carboidrato: 150 + Math.floor(Math.random() * 40),
            gordura: 45 + Math.floor(Math.random() * 15),
        },
        hidratacao: {
            // Tendência de melhora
            totalMl: 1200 + Math.floor((i / 30) * 800) + Math.floor(Math.random() * 300),
            metaMl: 3000,
        },
        treino: {
            realizado: Math.random() > 0.4, // 60% de aderência
            tipo: ['Glúteos', 'Pernas', 'Costas', 'Ombros'][i % 4],
            duracao: Math.random() > 0.4 ? 50 + Math.floor(Math.random() * 20) : 0,
            intensidade: Math.random() > 0.4 ? (2 + Math.floor(Math.random() * 2)) as 1 | 2 | 3 | 4 | 5 : undefined,
        },
        sono: {
            horas: 6 + Math.random() * 1,
            qualidade: (2 + Math.floor(Math.random() * 2)) as 1 | 2 | 3 | 4 | 5,
        },
        doresAtivas: Math.random() > 0.85 ? 1 : 0,
        streakAtual: i < 5 ? 0 : Math.min(i - 4, 20),
    })),
}

// Pedro Oliveira - Alerta: múltiplos problemas
export const mockHistoricoPedroOliveira: DailyTrackingHistory = {
    atletaId: '3',
    atletaNome: 'Pedro Oliveira',
    periodo: { inicio: gerarDatas(30)[0], fim: new Date() },
    dados: gerarDatas(30).map((data, i) => ({
        data,
        nutricao: {
            refeicoes: Math.min(5, 1 + Math.floor(Math.random() * 2)),
            calorias: 1000 + Math.floor(Math.random() * 500),
            proteina: 60 + Math.floor(Math.random() * 30),
            carboidrato: 100 + Math.floor(Math.random() * 50),
            gordura: 35 + Math.floor(Math.random() * 15),
        },
        hidratacao: {
            totalMl: 800 + Math.floor(Math.random() * 400),
            metaMl: 3000,
        },
        treino: {
            realizado: Math.random() > 0.6, // 40% de aderência
            tipo: ['Peito', 'Costas', 'Braços'][i % 3],
            duracao: Math.random() > 0.6 ? 45 + Math.floor(Math.random() * 15) : 0,
            intensidade: Math.random() > 0.6 ? (2 + Math.floor(Math.random() * 2)) as 1 | 2 | 3 | 4 | 5 : undefined,
        },
        sono: {
            horas: 4.5 + Math.random() * 1.5,
            qualidade: (1 + Math.floor(Math.random() * 2)) as 1 | 2 | 3 | 4 | 5,
        },
        doresAtivas: i > 25 ? 1 : 0, // Dor nos últimos 5 dias
        streakAtual: i % 3 === 0 ? 0 : 1,
    })),
}

// Beatriz Lima - Atleta exemplar, melhor que João
export const mockHistoricoBeatrizLima: DailyTrackingHistory = {
    atletaId: '6',
    atletaNome: 'Beatriz Lima',
    periodo: { inicio: gerarDatas(30)[0], fim: new Date() },
    dados: gerarDatas(30).map((data, i) => ({
        data,
        nutricao: {
            refeicoes: 5,
            calorias: 2000 + Math.floor(Math.random() * 200),
            proteina: 140 + Math.floor(Math.random() * 20),
            carboidrato: 180 + Math.floor(Math.random() * 30),
            gordura: 55 + Math.floor(Math.random() * 10),
        },
        hidratacao: {
            totalMl: 3000 + Math.floor(Math.random() * 500),
            metaMl: 3000,
        },
        treino: {
            realizado: true,
            tipo: ['Ombros', 'Pernas', 'Costas', 'Glúteos', 'Braços'][i % 5],
            duracao: 70 + Math.floor(Math.random() * 20),
            intensidade: (4 + Math.floor(Math.random() * 2)) as 1 | 2 | 3 | 4 | 5,
        },
        sono: {
            horas: 7.5 + Math.random() * 1,
            qualidade: (4 + Math.floor(Math.random() * 2)) as 1 | 2 | 3 | 4 | 5,
        },
        doresAtivas: 0,
        streakAtual: i + 1,
    })),
}

// Carlos Mendes - Inativo, sem registros recentes
export const mockHistoricoCarlosMendes: DailyTrackingHistory = {
    atletaId: '5',
    atletaNome: 'Carlos Mendes',
    periodo: { inicio: gerarDatas(30)[0], fim: new Date() },
    dados: gerarDatas(30).map((data, i) => {
        const ativo = i < 28 // Inativo nos últimos 2 dias
        return {
            data,
            nutricao: {
                refeicoes: ativo ? 2 + Math.floor(Math.random() * 2) : 0,
                calorias: ativo ? 1800 + Math.floor(Math.random() * 400) : 0,
                proteina: ativo ? 100 + Math.floor(Math.random() * 30) : 0,
                carboidrato: ativo ? 180 + Math.floor(Math.random() * 50) : 0,
                gordura: ativo ? 50 + Math.floor(Math.random() * 20) : 0,
            },
            hidratacao: {
                totalMl: ativo ? 2000 + Math.floor(Math.random() * 800) : 0,
                metaMl: 3000,
            },
            treino: {
                realizado: ativo && Math.random() > 0.5,
                tipo: ativo ? ['Peito', 'Costas', 'Pernas'][i % 3] : undefined,
                duracao: ativo && Math.random() > 0.5 ? 55 + Math.floor(Math.random() * 20) : 0,
                intensidade: ativo && Math.random() > 0.5 ? (3 + Math.floor(Math.random() * 2)) as 1 | 2 | 3 | 4 | 5 : undefined,
            },
            sono: {
                horas: ativo ? 6.5 + Math.random() * 1.5 : 0,
                qualidade: ativo ? (3 + Math.floor(Math.random() * 2)) as 1 | 2 | 3 | 4 | 5 : 0 as 1,
            },
            doresAtivas: 0,
            streakAtual: ativo ? Math.min(i + 1, 15) : 0,
        }
    }),
}

export const mockHistoricoAtletas = {
    '1': mockHistoricoJoaoSilva,
    '2': mockHistoricoMariaSantos,
    '3': mockHistoricoPedroOliveira,
    '5': mockHistoricoCarlosMendes,
    '6': mockHistoricoBeatrizLima,
}
