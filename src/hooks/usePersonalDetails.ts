/**
 * Hook customizado para gerenciar dados da tela de detalhe do Personal
 * Consolida busca de dados, cálculos e estado da interface
 */

import { useState, useEffect, useMemo } from 'react'
import type { DetalhePersonalAcademia, TopAluno } from '@/types/personal-academy'
import {
    calcularRankingPersonal,
    identificarAlunosAtencao,
    calcularDistribuicaoClassificacao,
    calcularEvolucaoMensal,
    calcularTendencia
} from '@/services/calculations/personal-calculations'

/**
 * Hook para gerenciar dados e estado da tela de detalhe do personal
 */
export function usePersonalDetails(personalId: string, academiaId: string) {
    const [isLoading, setIsLoading] = useState(true)
    const [dados, setDados] = useState<DetalhePersonalAcademia | null>(null)
    const [periodoGraficos, setPeriodoGraficos] = useState<'3_MESES' | '6_MESES' | '12_MESES'>('6_MESES')

    // Buscar dados do personal
    useEffect(() => {
        async function carregarDados() {
            setIsLoading(true)
            try {
                // TODO: Substituir por chamada API real
                // const response = await fetch(`/api/academia/${academiaId}/personais/${personalId}`)
                // const dadosAPI = await response.json()

                // Por enquanto, usar mock data
                const mockData = await import('@/mocks/personal')
                const dadosPersonal = mockData.getPersonalDetails(personalId, academiaId)

                setDados(dadosPersonal)
            } catch (error) {
                console.error('Erro ao carregar dados do personal:', error)
            } finally {
                setIsLoading(false)
            }
        }

        carregarDados()
    }, [personalId, academiaId])

    // Dados processados para os gráficos de evolução
    const dadosGraficos = useMemo(() => {
        if (!dados?.evolucao) return null

        const historico = [
            { mes: 'Set', scoreMedio: 70, totalAlunos: 38, avaliacoes: 10 },
            { mes: 'Out', scoreMedio: 72, totalAlunos: 40, avaliacoes: 12 },
            { mes: 'Nov', scoreMedio: 73, totalAlunos: 42, avaliacoes: 11 },
            { mes: 'Dez', scoreMedio: 74, totalAlunos: 43, avaliacoes: 13 },
            { mes: 'Jan', scoreMedio: 75, totalAlunos: 44, avaliacoes: 14 },
            { mes: 'Fev', scoreMedio: 76, totalAlunos: 45, avaliacoes: 12 },
        ]

        const evolucao = calcularEvolucaoMensal(historico, periodoGraficos)

        // Calcular tendências
        const tendenciaScore = calcularTendencia(evolucao.scoreMedio.map(d => d.valor))
        const tendenciaAlunos = calcularTendencia(evolucao.totalAlunos.map(d => d.valor))
        const tendenciaAvaliacoes = calcularTendencia(evolucao.avaliacoes.map(d => d.valor))

        return {
            scoreMedio: {
                dados: evolucao.scoreMedio,
                tendencia: {
                    valor: tendenciaScore.valor,
                    unidade: 'pts/mês',
                    direcao: tendenciaScore.direcao
                }
            },
            totalAlunos: {
                dados: evolucao.totalAlunos,
                tendencia: {
                    valor: tendenciaAlunos.valor,
                    unidade: 'alunos/mês',
                    direcao: tendenciaAlunos.direcao
                }
            },
            avaliacoes: {
                dados: evolucao.avaliacoes,
                tendencia: {
                    valor: tendenciaAvaliacoes.valor,
                    unidade: 'avaliações/mês',
                    direcao: tendenciaAvaliacoes.direcao
                }
            }
        }
    }, [dados, periodoGraficos])

    return {
        isLoading,
        dados,
        dadosGraficos,
        periodoGraficos,
        setPeriodoGraficos
    }
}
