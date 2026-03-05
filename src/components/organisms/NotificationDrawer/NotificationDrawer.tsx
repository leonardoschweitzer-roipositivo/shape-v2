/**
 * NotificationDrawer — Painel lateral de notificações
 *
 * Slide-in da direita com as últimas 20 notificações,
 * agrupadas por data, ações rápidas e link para página completa.
 */

import React, { memo, useMemo, useCallback, useEffect, useRef } from 'react'
import { X, CheckCheck, Bell } from 'lucide-react'
import { NotificationItem } from '@/components/molecules/NotificationItem'
import type { Notificacao } from '@/types/notificacao.types'

interface NotificationDrawerProps {
    isOpen: boolean
    onClose: () => void
    notificacoes: Notificacao[]
    naoLidas: number
    loading: boolean
    onMarcarLida: (id: string) => void
    onMarcarTodasLidas: () => void
    onVerTodas: () => void
    onAcao?: (url: string) => void
}

/** Agrupa notificações por "HOJE", "ONTEM", "ESTA SEMANA", "ANTERIORES" */
function agruparPorData(notifs: Notificacao[]): Map<string, Notificacao[]> {
    const grupos = new Map<string, Notificacao[]>()
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const ontem = new Date(hoje)
    ontem.setDate(ontem.getDate() - 1)
    const inicioSemana = new Date(hoje)
    inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay())

    for (const n of notifs) {
        const data = new Date(n.created_at)
        data.setHours(0, 0, 0, 0)

        let grupo: string
        if (data.getTime() >= hoje.getTime()) {
            grupo = 'HOJE'
        } else if (data.getTime() >= ontem.getTime()) {
            grupo = 'ONTEM'
        } else if (data.getTime() >= inicioSemana.getTime()) {
            grupo = 'ESTA SEMANA'
        } else {
            grupo = 'ANTERIORES'
        }

        const lista = grupos.get(grupo) || []
        lista.push(n)
        grupos.set(grupo, lista)
    }

    return grupos
}

export const NotificationDrawer = memo(function NotificationDrawer({
    isOpen,
    onClose,
    notificacoes,
    naoLidas,
    loading,
    onMarcarLida,
    onMarcarTodasLidas,
    onVerTodas,
    onAcao,
}: NotificationDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null)

    // Fechar ao clicar fora
    useEffect(() => {
        if (!isOpen) return
        const handleClickOutside = (e: MouseEvent) => {
            if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
                onClose()
            }
        }
        // Delay para evitar fechar no mesmo click que abriu
        const timer = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside)
        }, 100)
        return () => {
            clearTimeout(timer)
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, onClose])

    // Escape para fechar
    useEffect(() => {
        if (!isOpen) return
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, onClose])

    const grupos = useMemo(() => agruparPorData(notificacoes), [notificacoes])

    const handleVerTodas = useCallback(() => {
        onClose()
        onVerTodas()
    }, [onClose, onVerTodas])

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/40 z-40 transition-opacity" />
            )}

            {/* Drawer */}
            <div
                ref={drawerRef}
                className={`
          fixed top-0 right-0 h-full w-full max-w-md bg-[#0A0F1C] border-l border-white/10
          z-50 flex flex-col transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <Bell size={18} className="text-primary" />
                        <h2 className="text-base font-semibold text-white">Notificações</h2>
                        {naoLidas > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                                {naoLidas}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {naoLidas > 0 && (
                            <button
                                onClick={onMarcarTodasLidas}
                                className="flex items-center gap-1 text-xs text-gray-400 hover:text-primary transition-colors px-2 py-1 rounded hover:bg-white/5"
                                title="Marcar todas como lidas"
                            >
                                <CheckCheck size={14} />
                                <span className="hidden sm:inline">Marcar lidas</span>
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Lista */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-2">
                    {loading && notificacoes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 gap-2">
                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs text-gray-500">Carregando...</p>
                        </div>
                    ) : notificacoes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                <Bell size={20} className="text-gray-600" />
                            </div>
                            <p className="text-sm text-gray-500">Sem notificações por enquanto</p>
                            <p className="text-xs text-gray-600">
                                Quando seus alunos treinarem ou registrarem medidas, você verá aqui.
                            </p>
                        </div>
                    ) : (
                        <>
                            {Array.from(grupos.entries()).map(([grupo, itens]) => (
                                <div key={grupo} className="mb-3">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 py-1.5">
                                        {grupo}
                                    </p>
                                    <div className="flex flex-col gap-0.5">
                                        {itens.map(notif => (
                                            <NotificationItem
                                                key={notif.id}
                                                notificacao={notif}
                                                onMarcarLida={onMarcarLida}
                                                onAcao={onAcao}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {/* Footer */}
                {notificacoes.length > 0 && (
                    <div className="px-5 py-3 border-t border-white/10">
                        <button
                            onClick={handleVerTodas}
                            className="w-full py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors rounded-lg hover:bg-primary/5"
                        >
                            Ver todas as notificações →
                        </button>
                    </div>
                )}
            </div>
        </>
    )
})
