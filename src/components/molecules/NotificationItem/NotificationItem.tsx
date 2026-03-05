/**
 * NotificationItem — Item individual de notificação
 *
 * Card reutilizável que exibe uma notificação com ícone, prioridade,
 * hora relativa, badge de não-lida e ação contextual.
 */

import React, { memo, useCallback } from 'react'
import { ExternalLink } from 'lucide-react'
import type { Notificacao } from '@/types/notificacao.types'
import { PRIORIDADE_CONFIG } from '@/types/notificacao.types'

interface NotificationItemProps {
    notificacao: Notificacao
    onMarcarLida?: (id: string) => void
    onAcao?: (url: string) => void
}

/** Formata data como "há X minutos", "há 2h", "ontem", etc. */
function formatarTempoRelativo(dataISO: string): string {
    const agora = new Date()
    const data = new Date(dataISO)
    const diffMs = agora.getTime() - data.getTime()
    const diffMin = Math.floor(diffMs / 60_000)
    const diffHoras = Math.floor(diffMs / 3_600_000)
    const diffDias = Math.floor(diffMs / 86_400_000)

    if (diffMin < 1) return 'agora'
    if (diffMin < 60) return `há ${diffMin}min`
    if (diffHoras < 24) return `há ${diffHoras}h`
    if (diffDias === 1) return 'ontem'
    if (diffDias < 7) return `há ${diffDias} dias`
    if (diffDias < 30) return `há ${Math.floor(diffDias / 7)} sem`
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export const NotificationItem = memo(function NotificationItem({
    notificacao,
    onMarcarLida,
    onAcao,
}: NotificationItemProps) {
    const prioridadeConfig = PRIORIDADE_CONFIG[notificacao.prioridade]
    const isNaoLida = !notificacao.lida

    const handleClick = useCallback(() => {
        if (isNaoLida && onMarcarLida) {
            onMarcarLida(notificacao.id)
        }
        if (notificacao.acao_url && onAcao) {
            onAcao(notificacao.acao_url)
        }
    }, [isNaoLida, onMarcarLida, onAcao, notificacao.id, notificacao.acao_url])

    return (
        <div
            onClick={handleClick}
            className={`
        relative flex gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200
        ${isNaoLida
                    ? 'bg-white/[0.04] hover:bg-white/[0.07] border border-white/10'
                    : 'hover:bg-white/[0.03] border border-transparent'
                }
      `}
        >
            {/* Indicador de não-lida */}
            {isNaoLida && (
                <span
                    className="absolute top-3 left-1 w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: prioridadeConfig.cor }}
                />
            )}

            {/* Ícone / Avatar */}
            <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
                style={{ backgroundColor: `${prioridadeConfig.cor}15`, color: prioridadeConfig.cor }}
            >
                {notificacao.atleta_foto ? (
                    <img
                        src={notificacao.atleta_foto}
                        alt={notificacao.atleta_nome || ''}
                        className="w-9 h-9 rounded-full object-cover"
                    />
                ) : (
                    <span>{prioridadeConfig.icone}</span>
                )}
            </div>

            {/* Conteúdo */}
            <div className="flex-1 min-w-0">
                <p
                    className={`text-sm leading-snug ${isNaoLida ? 'text-white font-medium' : 'text-gray-300'}`}
                    dangerouslySetInnerHTML={{ __html: notificacao.titulo }}
                />
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {notificacao.mensagem}
                </p>

                {/* Ação */}
                {notificacao.acao_label && (
                    <button
                        className="flex items-center gap-1 text-xs mt-1.5 hover:underline"
                        style={{ color: prioridadeConfig.cor }}
                        onClick={(e) => {
                            e.stopPropagation()
                            if (notificacao.acao_url && onAcao) onAcao(notificacao.acao_url)
                        }}
                    >
                        <ExternalLink size={11} />
                        {notificacao.acao_label}
                    </button>
                )}
            </div>

            {/* Tempo */}
            <span className="text-[10px] text-gray-600 flex-shrink-0 mt-0.5">
                {formatarTempoRelativo(notificacao.created_at)}
            </span>
        </div>
    )
})
