/**
 * NotificationsPage — Página completa do Centro de Notificações
 *
 * Filtros por categoria, busca, período, status.
 * Lista paginada com agrupamento por data.
 */

import React, { useState, useCallback } from 'react'
import { Bell, Search, Filter, ChevronDown, ArrowLeft } from 'lucide-react'
import { useNotificacoes } from '@/hooks/useNotificacoes'
import { NotificationItem } from '@/components/molecules/NotificationItem'
import type { CategoriaNotificacao, PrioridadeNotificacao } from '@/types/notificacao.types'
import { CATEGORIA_CONFIG } from '@/types/notificacao.types'

interface NotificationsPageProps {
    onBack?: () => void
    onAcao?: (url: string) => void
}

const FILTROS_PERIODO = [
    { id: 'tudo', label: 'Tudo' },
    { id: 'hoje', label: 'Hoje' },
    { id: 'semana', label: 'Semana' },
    { id: 'mes', label: 'Mês' },
] as const

const FILTROS_STATUS = [
    { id: undefined, label: 'Todas' },
    { id: false, label: 'Não lidas' },
    { id: true, label: 'Lidas' },
] as const

export function NotificationsPage({ onBack, onAcao }: NotificationsPageProps) {
    const {
        notificacoes,
        naoLidas,
        total,
        loading,
        filtro,
        setFiltro,
        marcarComoLida,
        marcarTodasComoLidas,
        carregarMais,
        temMais,
    } = useNotificacoes()

    const [busca, setBusca] = useState('')
    const [categoriaAtiva, setCategoriaAtiva] = useState<CategoriaNotificacao | undefined>()
    const [periodoAtivo, setPeriodoAtivo] = useState<'tudo' | 'hoje' | 'semana' | 'mes'>('tudo')
    const [statusAtivo, setStatusAtivo] = useState<boolean | undefined>()

    // ===== Handlers =====

    const handleCategoria = useCallback((cat: CategoriaNotificacao | undefined) => {
        setCategoriaAtiva(cat)
        setFiltro({ ...filtro, categoria: cat, offset: 0 })
    }, [filtro, setFiltro])

    const handlePeriodo = useCallback((periodo: 'tudo' | 'hoje' | 'semana' | 'mes') => {
        setPeriodoAtivo(periodo)
        setFiltro({ ...filtro, periodo, offset: 0 })
    }, [filtro, setFiltro])

    const handleStatus = useCallback((lida: boolean | undefined) => {
        setStatusAtivo(lida)
        setFiltro({ ...filtro, lida, offset: 0 })
    }, [filtro, setFiltro])

    const handleBusca = useCallback((e: React.FormEvent) => {
        e.preventDefault()
        setFiltro({ ...filtro, busca, offset: 0 })
    }, [filtro, setFiltro, busca])

    // ===== Agrupamento por data =====
    const grupos = React.useMemo(() => {
        const result = new Map<string, typeof notificacoes>()
        const hoje = new Date()
        hoje.setHours(0, 0, 0, 0)
        const ontem = new Date(hoje)
        ontem.setDate(ontem.getDate() - 1)

        for (const n of notificacoes) {
            const data = new Date(n.created_at)
            data.setHours(0, 0, 0, 0)

            let grupo: string
            if (data.getTime() >= hoje.getTime()) {
                grupo = 'Hoje'
            } else if (data.getTime() >= ontem.getTime()) {
                grupo = 'Ontem'
            } else {
                grupo = data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
            }

            const lista = result.get(grupo) || []
            lista.push(n)
            result.set(grupo, lista)
        }

        return result
    }, [notificacoes])

    return (
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <div className="flex items-center gap-2">
                        <Bell size={22} className="text-primary" />
                        <h1 className="text-xl font-bold text-white">Notificações</h1>
                    </div>
                    {naoLidas > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                            {naoLidas} não lidas
                        </span>
                    )}
                </div>
                {naoLidas > 0 && (
                    <button
                        onClick={marcarTodasComoLidas}
                        className="text-xs text-primary hover:text-primary/80 transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/5 border border-primary/20"
                    >
                        Marcar todas como lidas
                    </button>
                )}
            </div>

            {/* Filtros de Categoria */}
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => handleCategoria(undefined)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all
            ${!categoriaAtiva
                            ? 'bg-primary/20 text-primary border border-primary/30'
                            : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20 hover:text-white'
                        }`}
                >
                    Todas
                </button>
                {(Object.entries(CATEGORIA_CONFIG) as [CategoriaNotificacao, typeof CATEGORIA_CONFIG[CategoriaNotificacao]][]).map(([key, config]) => (
                    <button
                        key={key}
                        onClick={() => handleCategoria(key)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5
              ${categoriaAtiva === key
                                ? 'bg-primary/20 text-primary border border-primary/30'
                                : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20 hover:text-white'
                            }`}
                    >
                        <span>{config.icone}</span>
                        {config.label}
                    </button>
                ))}
            </div>

            {/* Busca + Filtros Secundários */}
            <div className="flex flex-col sm:flex-row gap-3">
                <form onSubmit={handleBusca} className="flex-1 relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        placeholder="Buscar por aluno..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                </form>
                <div className="flex gap-2">
                    {/* Período */}
                    <div className="flex bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                        {FILTROS_PERIODO.map(f => (
                            <button
                                key={f.id}
                                onClick={() => handlePeriodo(f.id)}
                                className={`px-3 py-2 text-xs font-medium transition-colors
                  ${periodoAtivo === f.id
                                        ? 'bg-primary/20 text-primary'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                    {/* Status */}
                    <div className="flex bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                        {FILTROS_STATUS.map((f, i) => (
                            <button
                                key={i}
                                onClick={() => handleStatus(f.id)}
                                className={`px-3 py-2 text-xs font-medium transition-colors
                  ${statusAtivo === f.id
                                        ? 'bg-primary/20 text-primary'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Lista */}
            <div className="flex-1 flex flex-col gap-1">
                {loading && notificacoes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 gap-3">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-gray-500">Carregando notificações...</p>
                    </div>
                ) : notificacoes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                            <Bell size={28} className="text-gray-600" />
                        </div>
                        <div>
                            <p className="text-base font-medium text-gray-400">Nenhuma notificação encontrada</p>
                            <p className="text-sm text-gray-600 mt-1">
                                {categoriaAtiva || busca
                                    ? 'Tente alterar os filtros de busca.'
                                    : 'Quando seus alunos interagirem, as notificações aparecerão aqui.'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {Array.from(grupos.entries()).map(([grupo, itens]) => (
                            <div key={grupo} className="mb-4">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2 py-2">
                                    {grupo}
                                </p>
                                <div className="flex flex-col gap-1 bg-white/[0.02] rounded-xl border border-white/5 p-1">
                                    {itens.map(notif => (
                                        <NotificationItem
                                            key={notif.id}
                                            notificacao={notif}
                                            onMarcarLida={marcarComoLida}
                                            onAcao={onAcao}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Carregar mais */}
                        {temMais && (
                            <button
                                onClick={carregarMais}
                                disabled={loading}
                                className="mx-auto mt-4 px-6 py-2 text-sm font-medium text-primary hover:text-primary/80 border border-primary/20 rounded-lg hover:bg-primary/5 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Carregando...' : `Carregar mais (${notificacoes.length} de ${total})`}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
