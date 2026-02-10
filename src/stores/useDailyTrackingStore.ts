/**
 * Daily Tracking Store
 * 
 * Zustand store para gerenciar estado do acompanhamento diário
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
    ResumoDiario,
    Refeicao,
    TreinoDiario,
    RegistroAgua,
    RegistroSono,
    RegistroDor,
    Insight,
    Badge
} from '../types/daily-tracking'
import { gerarInsightPrincipal } from '../services/insights/daily-insights'
import { calcularStreak, calcularScoreDia, verificarNovosBadges } from '../services/gamification'
import { mockResumoDiario } from '../mocks/daily-tracking'

interface DailyTrackingState {
    // Estado
    resumoDiario: ResumoDiario
    historico: ResumoDiario[]
    insightAtual: Insight | null
    badgesConquistados: string[]

    // Modals
    modalAberto: 'refeicao' | 'treino' | 'agua' | 'sono' | 'dor' | null

    // Actions
    abrirModal: (tipo: 'refeicao' | 'treino' | 'agua' | 'sono' | 'dor') => void
    fecharModal: () => void

    registrarRefeicao: (refeicao: Omit<Refeicao, 'id' | 'atletaId' | 'createdAt' | 'updatedAt'>) => void
    registrarTreino: (treino: Partial<TreinoDiario>) => void
    registrarAgua: (quantidade: number) => void
    registrarSono: (sono: Omit<RegistroSono, 'id' | 'atletaId' | 'createdAt' | 'updatedAt'>) => void
    reportarDor: (dor: Omit<RegistroDor, 'id' | 'atletaId' | 'createdAt' | 'updatedAt'>) => void

    atualizarInsight: () => void
    verificarBadges: () => void
}

export const useDailyTrackingStore = create<DailyTrackingState>()(
    persist(
        (set, get) => ({
            // Estado inicial
            resumoDiario: mockResumoDiario,
            historico: [],
            insightAtual: null,
            badgesConquistados: [],
            modalAberto: null,

            // Modal actions
            abrirModal: (tipo) => set({ modalAberto: tipo }),
            fecharModal: () => set({ modalAberto: null }),

            // Registrar refeição
            registrarRefeicao: (refeicaoData) => {
                const state = get()
                const novaRefeicao: Refeicao = {
                    ...refeicaoData,
                    id: `ref-${Date.now()}`,
                    atletaId: state.resumoDiario.atletaId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }

                // Atualizar resumo diário
                const resumoAtualizado: ResumoDiario = {
                    ...state.resumoDiario,
                    nutricao: {
                        ...state.resumoDiario.nutricao,
                        refeicoes: state.resumoDiario.nutricao.refeicoes + 1,
                        totalCalorias: state.resumoDiario.nutricao.totalCalorias + novaRefeicao.calorias,
                        totalProteina: state.resumoDiario.nutricao.totalProteina + novaRefeicao.proteina,
                        totalCarboidrato: state.resumoDiario.nutricao.totalCarboidrato + novaRefeicao.carboidrato,
                        totalGordura: state.resumoDiario.nutricao.totalGordura + novaRefeicao.gordura,
                        aderenciaPercentual: 0, // Será recalculado
                    },
                    updatedAt: new Date(),
                }

                // Recalcular aderência
                resumoAtualizado.nutricao.aderenciaPercentual = Math.round(
                    ((resumoAtualizado.nutricao.totalCalorias / resumoAtualizado.nutricao.metaCalorias) * 100)
                )

                // Recalcular score
                resumoAtualizado.scoreDia = calcularScoreDia(resumoAtualizado)

                set({ resumoDiario: resumoAtualizado, modalAberto: null })
                get().atualizarInsight()
                get().verificarBadges()
            },

            // Registrar treino
            registrarTreino: (treinoData) => {
                const state = get()

                const resumoAtualizado: ResumoDiario = {
                    ...state.resumoDiario,
                    treino: {
                        ...state.resumoDiario.treino,
                        realizado: true,
                        duracao: treinoData.duracao,
                        intensidade: treinoData.intensidadePercebida,
                    },
                    updatedAt: new Date(),
                }

                resumoAtualizado.scoreDia = calcularScoreDia(resumoAtualizado)

                set({ resumoDiario: resumoAtualizado, modalAberto: null })
                get().atualizarInsight()
                get().verificarBadges()
            },

            // Registrar água
            registrarAgua: (quantidade) => {
                const state = get()

                const resumoAtualizado: ResumoDiario = {
                    ...state.resumoDiario,
                    hidratacao: {
                        ...state.resumoDiario.hidratacao,
                        totalMl: state.resumoDiario.hidratacao.totalMl + quantidade,
                    },
                    updatedAt: new Date(),
                }

                resumoAtualizado.hidratacao.aderenciaPercentual = Math.round(
                    (resumoAtualizado.hidratacao.totalMl / resumoAtualizado.hidratacao.metaMl) * 100
                )

                resumoAtualizado.scoreDia = calcularScoreDia(resumoAtualizado)

                set({ resumoDiario: resumoAtualizado })
                get().atualizarInsight()
            },

            // Registrar sono
            registrarSono: (sonoData) => {
                const state = get()

                const resumoAtualizado: ResumoDiario = {
                    ...state.resumoDiario,
                    sono: {
                        horas: sonoData.duracaoTotal / 60,
                        qualidade: sonoData.qualidade,
                        energiaResultante: sonoData.energiaAoAcordar,
                    },
                    updatedAt: new Date(),
                }

                resumoAtualizado.scoreDia = calcularScoreDia(resumoAtualizado)

                set({ resumoDiario: resumoAtualizado, modalAberto: null })
                get().atualizarInsight()
            },

            // Reportar dor
            reportarDor: (dorData) => {
                const state = get()

                const resumoAtualizado: ResumoDiario = {
                    ...state.resumoDiario,
                    doresAtivas: state.resumoDiario.doresAtivas + 1,
                    updatedAt: new Date(),
                }

                resumoAtualizado.scoreDia = calcularScoreDia(resumoAtualizado)

                set({ resumoDiario: resumoAtualizado, modalAberto: null })
                get().atualizarInsight()
            },

            // Atualizar insight
            atualizarInsight: () => {
                const state = get()
                const insight = gerarInsightPrincipal(state.resumoDiario)
                set({ insightAtual: insight })
            },

            // Verificar badges
            verificarBadges: () => {
                const state = get()
                const novosBadges = verificarNovosBadges(
                    state.resumoDiario,
                    state.historico,
                    state.badgesConquistados
                )

                if (novosBadges.length > 0) {
                    const novosIds = novosBadges.map(b => b.id)
                    set({ badgesConquistados: [...state.badgesConquistados, ...novosIds] })

                    // TODO: Mostrar notificação de badge conquistado
                    console.log('🏆 Novos badges conquistados:', novosBadges)
                }
            },
        }),
        {
            name: 'daily-tracking-storage',
            partialize: (state) => ({
                resumoDiario: state.resumoDiario,
                historico: state.historico,
                badgesConquistados: state.badgesConquistados,
            }),
        }
    )
)
