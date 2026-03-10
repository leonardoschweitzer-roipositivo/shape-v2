/**
 * portalNotificacaoService — Notificações do Atleta no Portal
 *
 * Busca, contagem e marcação de notificações destinadas ao atleta.
 * Acesso via token anônimo (sem auth.uid).
 */

import { supabase } from '../supabase'
import type { Notificacao } from '@/types/notificacao.types'

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface NotificacaoAtletaView extends Notificacao {
    personal_nome?: string
}

// ═══════════════════════════════════════════════════════════
// SERVICE
// ═══════════════════════════════════════════════════════════

export const portalNotificacaoService = {
    /**
     * Busca notificações destinadas ao atleta (últimos 30 dias).
     * Ordenadas por data (mais recente primeiro).
     */
    async buscarNotificacoesAtleta(
        atletaId: string,
        limit = 50
    ): Promise<NotificacaoAtletaView[]> {
        const trintaDiasAtras = new Date()
        trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30)

        const { data, error } = await supabase
            .from('notificacoes')
            .select('*')
            .eq('atleta_id', atletaId)
            .eq('destinatario', 'atleta')
            .gte('created_at', trintaDiasAtras.toISOString())
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) {
            console.error('[portalNotificacaoService] Erro ao buscar:', error.message)
            return []
        }

        return (data ?? []) as NotificacaoAtletaView[]
    },

    /**
     * Conta notificações não lidas do atleta.
     */
    async contarNaoLidas(atletaId: string): Promise<number> {
        const { count, error } = await supabase
            .from('notificacoes')
            .select('*', { count: 'exact', head: true })
            .eq('atleta_id', atletaId)
            .eq('destinatario', 'atleta')
            .eq('lida', false)

        if (error) {
            console.error('[portalNotificacaoService] Erro ao contar:', error.message)
            return 0
        }

        return count ?? 0
    },

    /**
     * Marca uma notificação como lida.
     */
    async marcarComoLida(id: string): Promise<void> {
        const { error } = await supabase
            .from('notificacoes')
            .update({ lida: true, lida_em: new Date().toISOString() })
            .eq('id', id)

        if (error) {
            console.error('[portalNotificacaoService] Erro ao marcar lida:', error.message)
        }
    },

    /**
     * Marca todas como lidas para um atleta.
     */
    async marcarTodasComoLidas(atletaId: string): Promise<void> {
        const { error } = await supabase
            .from('notificacoes')
            .update({ lida: true, lida_em: new Date().toISOString() })
            .eq('atleta_id', atletaId)
            .eq('destinatario', 'atleta')
            .eq('lida', false)

        if (error) {
            console.error('[portalNotificacaoService] Erro ao marcar todas:', error.message)
        }
    },
}
