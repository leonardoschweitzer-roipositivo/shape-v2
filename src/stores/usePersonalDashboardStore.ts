/**
 * Personal Dashboard Store
 * 
 * Gerencia o estado do dashboard do personal trainer
 */

import { create } from 'zustand'
import type { AtletaDailyStatus, Alerta } from '../types/daily-tracking'

interface PersonalDashboardState {
    // Lista de atletas
    atletas: AtletaDailyStatus[]

    // Atleta selecionado
    atletaSelecionado: AtletaDailyStatus | null

    // Alertas
    alertas: Alerta[]
    alertasNaoLidas: number

    // Filtros
    filtroStatus: 'todos' | 'ativo' | 'atencao' | 'alerta' | 'inativo'

    // Actions
    setAtletas: (atletas: AtletaDailyStatus[]) => void
    selecionarAtleta: (atletaId: string) => void
    desselecionarAtleta: () => void
    setFiltroStatus: (filtro: 'todos' | 'ativo' | 'atencao' | 'alerta' | 'inativo') => void
    marcarAlertaComoLido: (alertaId: string) => void
    limparAlertasLidos: () => void
}

export const usePersonalDashboardStore = create<PersonalDashboardState>((set, get) => ({
    atletas: [],
    atletaSelecionado: null,
    alertas: [],
    alertasNaoLidas: 0,
    filtroStatus: 'todos',

    setAtletas: (atletas) => set({ atletas }),

    selecionarAtleta: (atletaId) => {
        const atleta = get().atletas.find(a => a.id === atletaId)
        if (atleta) {
            set({ atletaSelecionado: atleta })
        }
    },

    desselecionarAtleta: () => set({ atletaSelecionado: null }),

    setFiltroStatus: (filtro) => set({ filtroStatus: filtro }),

    marcarAlertaComoLido: (alertaId) => {
        const alertas = get().alertas.map(alerta =>
            alerta.id === alertaId ? { ...alerta, lido: true } : alerta
        )
        const alertasNaoLidas = alertas.filter(a => !(a as any).lido).length
        set({ alertas, alertasNaoLidas })
    },

    limparAlertasLidos: () => {
        const alertas = get().alertas.filter(a => !(a as any).lido)
        set({ alertas, alertasNaoLidas: alertas.length })
    },
}))
