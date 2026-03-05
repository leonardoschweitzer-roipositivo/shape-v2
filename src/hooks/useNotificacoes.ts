/**
 * Hook para gerenciar notificações do Personal — VITRU IA
 *
 * Fornece estado, polling automático e ações de leitura.
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { notificacaoService } from '@/services/notificacao.service'
import { useAuthStore } from '@/stores/authStore'
import type {
    Notificacao,
    FiltroNotificacao,
} from '@/types/notificacao.types'

const POLLING_INTERVAL_MS = 60_000 // 60 segundos

interface UseNotificacoesReturn {
    notificacoes: Notificacao[]
    naoLidas: number
    total: number
    loading: boolean
    filtro: FiltroNotificacao
    setFiltro: (filtro: FiltroNotificacao) => void
    marcarComoLida: (id: string) => Promise<void>
    marcarTodasComoLidas: () => Promise<void>
    recarregar: () => Promise<void>
    carregarMais: () => Promise<void>
    temMais: boolean
}

export function useNotificacoes(): UseNotificacoesReturn {
    const { entity } = useAuthStore()
    const personalId = entity?.personal?.id || null

    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
    const [naoLidas, setNaoLidas] = useState(0)
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const [filtro, setFiltroState] = useState<FiltroNotificacao>({ limit: 20, offset: 0 })
    const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // ===== Buscar notificações =====
    const buscar = useCallback(async (filtroAtual: FiltroNotificacao, append = false) => {
        if (!personalId) return

        setLoading(true)
        try {
            const resultado = await notificacaoService.buscar(personalId, filtroAtual)

            if (append) {
                setNotificacoes(prev => [...prev, ...resultado.data])
            } else {
                setNotificacoes(resultado.data)
            }
            setTotal(resultado.total)
        } catch (err) {
            console.error('[useNotificacoes] Erro ao buscar:', err)
        } finally {
            setLoading(false)
        }
    }, [personalId])

    // ===== Contar não lidas =====
    const atualizarContagem = useCallback(async () => {
        if (!personalId) return
        const count = await notificacaoService.contarNaoLidas(personalId)
        setNaoLidas(count)
    }, [personalId])

    // ===== Recarregar tudo =====
    const recarregar = useCallback(async () => {
        const filtroReset = { ...filtro, offset: 0 }
        setFiltroState(filtroReset)
        await Promise.all([
            buscar(filtroReset),
            atualizarContagem(),
        ])
    }, [filtro, buscar, atualizarContagem])

    // ===== Carregar mais (paginação) =====
    const carregarMais = useCallback(async () => {
        const novoOffset = (filtro.offset || 0) + (filtro.limit || 20)
        const novoFiltro = { ...filtro, offset: novoOffset }
        setFiltroState(novoFiltro)
        await buscar(novoFiltro, true)
    }, [filtro, buscar])

    // ===== Atualizar filtro =====
    const setFiltro = useCallback((novoFiltro: FiltroNotificacao) => {
        const filtroComReset = { ...novoFiltro, offset: 0, limit: novoFiltro.limit || 20 }
        setFiltroState(filtroComReset)
        buscar(filtroComReset)
    }, [buscar])

    // ===== Marcar como lida =====
    const marcarComoLida = useCallback(async (id: string) => {
        await notificacaoService.marcarComoLida(id)

        // Atualizar estado local otimisticamente
        setNotificacoes(prev =>
            prev.map(n =>
                n.id === id ? { ...n, lida: true, lida_em: new Date().toISOString() } : n
            )
        )
        setNaoLidas(prev => Math.max(0, prev - 1))
    }, [])

    // ===== Marcar todas como lidas =====
    const marcarTodasComoLidas = useCallback(async () => {
        if (!personalId) return

        await notificacaoService.marcarTodasComoLidas(personalId)

        // Atualizar estado local otimisticamente
        setNotificacoes(prev =>
            prev.map(n => ({ ...n, lida: true, lida_em: new Date().toISOString() }))
        )
        setNaoLidas(0)
    }, [personalId])

    // ===== Carga inicial + polling =====
    useEffect(() => {
        if (!personalId) return

        // Carga inicial
        buscar(filtro)
        atualizarContagem()

        // Polling a cada 60s (apenas contagem para badge)
        pollingRef.current = setInterval(() => {
            atualizarContagem()
        }, POLLING_INTERVAL_MS)

        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current)
            }
        }
        // Dependências intencionais: apenas personalId para evitar re-polling em cada filtro
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [personalId])

    // ===== Tem mais para carregar? =====
    const temMais = notificacoes.length < total

    return {
        notificacoes,
        naoLidas,
        total,
        loading,
        filtro,
        setFiltro,
        marcarComoLida,
        marcarTodasComoLidas,
        recarregar,
        carregarMais,
        temMais,
    }
}
