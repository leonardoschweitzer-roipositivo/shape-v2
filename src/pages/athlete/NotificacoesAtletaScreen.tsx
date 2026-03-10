/**
 * NotificacoesAtletaScreen — Tela de Notificações do Portal do Aluno
 *
 * Lista as notificações destinadas ao atleta agrupadas por data.
 * Ao clicar, abre o AtletaNotificationModal com thread de comentários.
 */

import React, { useState, useEffect, useCallback } from 'react'
import {
    Bell,
    Check,
    CheckCheck,
    Clock,
    MessageCircle,
    Dumbbell,
    FileEdit,
    Inbox,
} from 'lucide-react'
import { portalNotificacaoService, type NotificacaoAtletaView } from '@/services/portal/portalNotificacaoService'
import { AtletaNotificationModal } from '@/components/molecules/AtletaNotificationModal/AtletaNotificationModal'

// ═══════════════════════════════════════════════════════════
// TYPES & HELPERS
// ═══════════════════════════════════════════════════════════

interface NotificacoesAtletaScreenProps {
    atletaId: string
    onAtualizarContador?: (count: number) => void
}

type GrupoData = 'hoje' | 'ontem' | 'anteriores'

function classificarData(iso: string): GrupoData {
    const data = new Date(iso)
    const hoje = new Date()
    const ontem = new Date()
    ontem.setDate(ontem.getDate() - 1)

    if (data.toDateString() === hoje.toDateString()) return 'hoje'
    if (data.toDateString() === ontem.toDateString()) return 'ontem'
    return 'anteriores'
}

const GRUPO_LABEL: Record<GrupoData, string> = {
    hoje: 'HOJE',
    ontem: 'ONTEM',
    anteriores: 'ANTERIORES',
}

function formatarHora(iso: string): string {
    return new Date(iso).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    })
}

function getIconeNotificacao(tipo: string): React.ReactNode {
    switch (tipo) {
        case 'TREINO_EDITADO':
            return <FileEdit size={18} className="text-indigo-400" />
        case 'RESPOSTA_PERSONAL':
            return <MessageCircle size={18} className="text-emerald-400" />
        case 'MENSAGEM_PERSONAL':
            return <MessageCircle size={18} className="text-sky-400" />
        default:
            return <Bell size={18} className="text-gray-400" />
    }
}

function stripHtml(html: string): string {
    return html.replace(/<[^>]+>/g, '')
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

export function NotificacoesAtletaScreen({ atletaId, onAtualizarContador }: NotificacoesAtletaScreenProps) {
    const [notificacoes, setNotificacoes] = useState<NotificacaoAtletaView[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedNotif, setSelectedNotif] = useState<NotificacaoAtletaView | null>(null)

    // ─── Carregar notificações ───────────────────────────
    const carregar = useCallback(async () => {
        setLoading(true)
        const data = await portalNotificacaoService.buscarNotificacoesAtleta(atletaId)
        setNotificacoes(data)
        setLoading(false)

        // Atualizar badge no BottomNav
        const naoLidas = data.filter(n => !n.lida).length
        onAtualizarContador?.(naoLidas)
    }, [atletaId, onAtualizarContador])

    useEffect(() => {
        carregar()
    }, [carregar])

    // ─── Marcar como lida ──────────────────────────────
    const handleClick = useCallback(async (notif: NotificacaoAtletaView) => {
        if (!notif.lida) {
            await portalNotificacaoService.marcarComoLida(notif.id)
            setNotificacoes(prev =>
                prev.map(n => n.id === notif.id ? { ...n, lida: true } : n)
            )
            onAtualizarContador?.(notificacoes.filter(n => !n.lida && n.id !== notif.id).length)
        }
        setSelectedNotif(notif)
    }, [notificacoes, onAtualizarContador])

    // ─── Marcar todas como lidas ───────────────────────
    const handleMarcarTodas = useCallback(async () => {
        await portalNotificacaoService.marcarTodasComoLidas(atletaId)
        setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })))
        onAtualizarContador?.(0)
    }, [atletaId, onAtualizarContador])

    // ─── Agrupar por data ──────────────────────────────
    const grupos = notificacoes.reduce<Record<GrupoData, NotificacaoAtletaView[]>>(
        (acc, n) => {
            const grupo = classificarData(n.created_at)
            acc[grupo].push(n)
            return acc
        },
        { hoje: [], ontem: [], anteriores: [] }
    )

    const naoLidas = notificacoes.filter(n => !n.lida).length

    // ═══════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════

    return (
        <div className="min-h-screen bg-background-dark pb-24">
            {/* Header */}
            <div className="px-5 pt-6 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                            <Bell size={20} className="text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-white uppercase tracking-tight">
                                Notificações
                            </h1>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                {naoLidas > 0 ? `${naoLidas} não lida${naoLidas > 1 ? 's' : ''}` : 'Tudo em dia'}
                            </p>
                        </div>
                    </div>

                    {naoLidas > 0 && (
                        <button
                            onClick={handleMarcarTodas}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-wider"
                        >
                            <CheckCheck size={14} />
                            Ler todas
                        </button>
                    )}
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-white/5 mt-4" />
            </div>

            {/* Content */}
            <div className="px-5">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <div className="w-8 h-8 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
                        <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">Carregando...</p>
                    </div>
                ) : notificacoes.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Inbox size={28} className="text-gray-600" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-bold text-gray-400">Nenhuma notificação ainda</p>
                            <p className="text-xs text-gray-600 mt-1">
                                Quando seu personal editar treinos ou responder, você verá aqui
                            </p>
                        </div>
                    </div>
                ) : (
                    /* Lista agrupada */
                    <div className="space-y-6">
                        {(['hoje', 'ontem', 'anteriores'] as GrupoData[]).map(grupo => {
                            if (grupos[grupo].length === 0) return null
                            return (
                                <div key={grupo}>
                                    <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3">
                                        {GRUPO_LABEL[grupo]}
                                    </h3>
                                    <div className="space-y-2">
                                        {grupos[grupo].map(notif => (
                                            <button
                                                key={notif.id}
                                                onClick={() => handleClick(notif)}
                                                className={`w-full text-left p-4 rounded-2xl border transition-all active:scale-[0.98] ${notif.lida
                                                        ? 'bg-white/[0.02] border-white/5'
                                                        : 'bg-indigo-500/5 border-indigo-500/15 shadow-lg shadow-indigo-500/5'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    {/* Ícone */}
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${notif.lida ? 'bg-white/5' : 'bg-indigo-500/10'
                                                        }`}>
                                                        {getIconeNotificacao(notif.tipo)}
                                                    </div>

                                                    {/* Conteúdo */}
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-bold leading-tight ${notif.lida ? 'text-gray-400' : 'text-white'
                                                            }`}>
                                                            {stripHtml(notif.titulo)}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                            {notif.mensagem}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <Clock size={10} className="text-gray-600" />
                                                            <span className="text-[10px] text-gray-600 font-medium">
                                                                {formatarHora(notif.created_at)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Indicadores */}
                                                    <div className="flex flex-col items-center gap-1 flex-shrink-0">
                                                        {!notif.lida && (
                                                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                                        )}
                                                        {notif.lida && (
                                                            <Check size={14} className="text-gray-700" />
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Modal de detalhes */}
            {selectedNotif && (
                <AtletaNotificationModal
                    notificacao={selectedNotif}
                    atletaId={atletaId}
                    onFechar={() => setSelectedNotif(null)}
                />
            )}
        </div>
    )
}
