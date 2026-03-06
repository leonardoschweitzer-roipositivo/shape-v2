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
        <div className="min-h-screen bg-background-dark pb-24">
            {/* Header */}
            <div className="sticky top-0 bg-background-dark px-4 pt-6 pb-3 border-b border-white/5 z-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-white text-xl font-black">Alertas</h1>
                        {naoLidas > 0 && (
                            <p className="text-gray-400 text-xs mt-0.5">{naoLidas} não {naoLidas === 1 ? 'lida' : 'lidas'}</p>
                        )}
                    </div>
                    {naoLidas > 0 && (
                        <button
                            onClick={marcarTodasLidas}
                            disabled={marcandoTodas}
                            className="flex items-center gap-1.5 text-[var(--color-accent)] text-xs font-bold"
                        >
                            {marcandoTodas
                                ? <Loader2 size={12} className="animate-spin" />
                                : <CheckCheck size={14} />
                            }
                            Limpar
                        </button>
                    )}
                </div>
            </div>

            {/* Notificações */}
            <div className="px-4 pt-4 space-y-5">
                {notificacoes.length === 0 ? (
                    <div className="text-center py-16">
                        <Bell size={40} className="text-gray-700 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">Nenhuma notificação.</p>
                        <p className="text-gray-600 text-xs mt-1">As atividades dos alunos aparecerão aqui.</p>
                    </div>
                ) : (
                    ordemGrupos.map(grupo => {
                        const items = grupos[grupo]
                        if (!items || items.length === 0) return null
                        return (
                            <div key={grupo}>
                                <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest mb-2 px-1">
                                    {GRUPO_LABEL[grupo]}
                                </p>
                                <div className="bg-surface rounded-2xl border border-white/5 overflow-hidden">
                                    {items.map((notif, idx) => {
                                        const prioConfig = PRIORIDADE_CONFIG[notif.prioridade]
                                        return (
                                            <button
                                                key={notif.id}
                                                onClick={() => handleClickNotificacao(notif)}
                                                className={`w-full flex items-start gap-3 p-4 text-left transition-colors hover:bg-white/5 ${idx < items.length - 1 ? 'border-b border-white/5' : ''} ${!notif.lida ? 'bg-white/[0.02]' : ''}`}
                                            >
                                                {/* Ícone / indicador */}
                                                <div className="shrink-0 mt-0.5">
                                                    <span className="text-lg">{prioConfig.icone}</span>
                                                </div>

                                                {/* Conteúdo */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className={`text-sm font-semibold leading-snug ${!notif.lida ? 'text-white' : 'text-gray-300'}`}>
                                                            {stripHtml(notif.titulo)}
                                                        </p>
                                                        <span className="text-gray-600 text-[11px] shrink-0">{formatarHora(notif.created_at)}</span>
                                                    </div>
                                                    <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{stripHtml(notif.mensagem)}</p>
                                                </div>

                                                {/* Ponto não lida */}
                                                {!notif.lida && (
                                                    <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] shrink-0 mt-1.5" />
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
    )
}
