/**
 * AlertasScreen — Tab ALERTAS do Portal do Personal
 *
 * Reutiliza o notificacaoService existente.
 * Lista agrupada: Hoje / Ontem / Esta Semana.
 * Ao clicar em uma notificação, abre o NotificationDetailModal.
 */

import React, { useEffect, useState, useCallback } from 'react'
import { Bell, Loader2, CheckCheck } from 'lucide-react'
import { notificacaoService } from '@/services/notificacao.service'
import type { Notificacao } from '@/types/notificacao.types'
import { PRIORIDADE_CONFIG } from '@/types/notificacao.types'
import { NotificationDetailModal } from '@/components/molecules/NotificationDetailModal/NotificationDetailModal'

interface AlertasScreenProps {
    personalId: string
    onAbrirAluno?: (alunoId: string) => void
    onAtualizarContador?: (count: number) => void
}

type GrupoData = 'hoje' | 'ontem' | 'semana' | 'antigas'

/** Remove tags HTML que possam vir no texto das notificações */
function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
}

function classificarData(iso: string): GrupoData {
    const diff = Date.now() - new Date(iso).getTime()
    const h = diff / 3600000
    if (h < 24) return 'hoje'
    if (h < 48) return 'ontem'
    if (h < 168) return 'semana'
    return 'antigas'
}

const GRUPO_LABEL: Record<GrupoData, string> = {
    hoje: 'HOJE',
    ontem: 'ONTEM',
    semana: 'ESTA SEMANA',
    antigas: 'ANTERIORES',
}

function formatarHora(iso: string): string {
    const d = new Date(iso)
    const h = d.getHours().toString().padStart(2, '0')
    const m = d.getMinutes().toString().padStart(2, '0')
    return `${h}:${m}`
}

export function AlertasScreen({ personalId, onAbrirAluno, onAtualizarContador }: AlertasScreenProps) {
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
    const [loading, setLoading] = useState(true)
    const [marcandoTodas, setMarcandoTodas] = useState(false)
    const [notifSelecionada, setNotifSelecionada] = useState<Notificacao | null>(null)

    const carregar = useCallback(async () => {
        setLoading(true)
        const { data } = await notificacaoService.buscar(personalId, { limit: 50 })
        setNotificacoes(data)
        const naoLidas = data.filter(n => !n.lida).length
        onAtualizarContador?.(naoLidas)
        setLoading(false)
    }, [personalId, onAtualizarContador])

    useEffect(() => { carregar() }, [carregar])

    const marcarLida = async (id: string) => {
        await notificacaoService.marcarComoLida(id)
        setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n))
        onAtualizarContador?.(notificacoes.filter(n => !n.lida && n.id !== id).length)
    }

    const marcarTodasLidas = async () => {
        setMarcandoTodas(true)
        await notificacaoService.marcarTodasComoLidas(personalId)
        setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })))
        onAtualizarContador?.(0)
        setMarcandoTodas(false)
    }

    const handleClickNotificacao = (notif: Notificacao) => {
        // Marca como lida se ainda não foi
        if (!notif.lida) marcarLida(notif.id)
        // Abre o modal de detalhes
        setNotifSelecionada(notif)
    }

    const handleAcaoModal = (url: string) => {
        // Se tem atleta_id na URL, navega para o aluno
        const atletaMatch = url.match(/athlete-details\/(.+)$/)
        if (atletaMatch && onAbrirAluno) {
            onAbrirAluno(atletaMatch[1])
        }
        setNotifSelecionada(null)
    }

    // Agrupar notificações por data
    const grupos = notificacoes.reduce<Record<GrupoData, Notificacao[]>>((acc, n) => {
        const grupo = classificarData(n.created_at)
        if (!acc[grupo]) acc[grupo] = []
        acc[grupo].push(n)
        return acc
    }, {} as Record<GrupoData, Notificacao[]>)

    const ordemGrupos: GrupoData[] = ['hoje', 'ontem', 'semana', 'antigas']
    const naoLidas = notificacoes.filter(n => !n.lida).length

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <Loader2 className="text-[var(--color-accent)] animate-spin" size={36} />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background-dark pb-24 px-4 pt-8 relative overflow-hidden">
            {/* Efeito de Gradiente de Topo (igual ao Aluno) */}
            <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-indigo-500/10 via-indigo-900/5 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-white text-3xl font-black tracking-tight">Alertas</h1>
                            {naoLidas > 0 && (
                                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                                    {naoLidas} Pendentes
                                </p>
                            )}
                        </div>
                        {naoLidas > 0 && (
                            <button
                                onClick={marcarTodasLidas}
                                disabled={marcandoTodas}
                                className="flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-500/20 active:scale-95 transition-all"
                            >
                                {marcandoTodas
                                    ? <Loader2 size={12} className="animate-spin" />
                                    : <CheckCheck size={14} />
                                }
                                Limpar Tudo
                            </button>
                        )}
                    </div>
                </div>

                {/* Notificações */}
                <div className="space-y-8">
                    {notificacoes.length === 0 ? (
                        <div className="text-center py-20 bg-surface-deep rounded-3xl border border-white/5 shadow-2xl">
                            <Bell size={48} className="text-zinc-800 mx-auto mb-4" />
                            <p className="text-zinc-500 text-sm font-medium">Nenhum alerta agora.</p>
                            <p className="text-zinc-700 text-xs mt-1 font-black uppercase tracking-widest">Tudo sob controle</p>
                        </div>
                    ) : (
                        ordemGrupos.map(grupo => {
                            const items = grupos[grupo]
                            if (!items || items.length === 0) return null
                            return (
                                <div key={grupo}>
                                    <div className="flex items-center gap-2 mb-4 px-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                            {GRUPO_LABEL[grupo]}
                                        </p>
                                    </div>
                                    <div className="bg-surface-deep rounded-3xl border border-white/5 overflow-hidden shadow-xl divide-y divide-white/5">
                                        {items.map((notif) => {
                                            const prioConfig = PRIORIDADE_CONFIG[notif.prioridade]
                                            return (
                                                <button
                                                    key={notif.id}
                                                    onClick={() => handleClickNotificacao(notif)}
                                                    className={`w-full flex items-start gap-4 p-5 text-left transition-all hover:bg-white/5 active:scale-[0.99] group ${!notif.lida ? 'bg-white/[0.02]' : ''}`}
                                                >
                                                    {/* Ícone / indicador */}
                                                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner ${!notif.lida ? 'bg-indigo-500/10' : 'bg-white/5'}`}>
                                                        {prioConfig.icone}
                                                    </div>

                                                    {/* Conteúdo */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className={`text-[13px] font-black tracking-tight leading-snug ${!notif.lida ? 'text-white' : 'text-zinc-400'}`}>
                                                                {stripHtml(notif.titulo)}
                                                            </p>
                                                            <span className="text-zinc-600 text-[9px] font-black uppercase shrink-0">{formatarHora(notif.created_at)}</span>
                                                        </div>
                                                        <p className="text-zinc-500 text-[11px] font-medium mt-1.5 leading-relaxed line-clamp-2">
                                                            {stripHtml(notif.mensagem)}
                                                        </p>
                                                    </div>

                                                    {/* Ponto não lida */}
                                                    {!notif.lida && (
                                                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.6)] shrink-0 mt-1.5 animate-pulse" />
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                {/* Modal de detalhes da notificação */}
                {notifSelecionada && (
                    <NotificationDetailModal
                        notificacao={notifSelecionada}
                        onFechar={() => setNotifSelecionada(null)}
                        onAcao={handleAcaoModal}
                    />
                )}
            </div>
        </div>
    )
}
