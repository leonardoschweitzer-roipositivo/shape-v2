/**
 * Comentário Service — VITRU IA
 *
 * CRUD para comentários em notificações do Personal.
 * Permite ao Personal responder notificações recebidas.
 */

import { supabase } from './supabase'

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface Comentario {
    id: string
    notificacao_id: string
    autor_id: string
    autor_tipo: 'personal' | 'atleta'
    mensagem: string
    created_at: string
}

export interface CriarComentarioDTO {
    notificacao_id: string
    autor_id: string
    autor_tipo: 'personal' | 'atleta'
    mensagem: string
}

// ═══════════════════════════════════════════════════════════
// SERVICE
// ═══════════════════════════════════════════════════════════

export const comentarioService = {
    /**
     * Lista comentários de uma notificação, ordenados por data (mais antigos primeiro).
     */
    async listar(notificacaoId: string): Promise<Comentario[]> {
        const { data, error } = await supabase
            .from('comentarios_notificacao')
            .select('*')
            .eq('notificacao_id', notificacaoId)
            .order('created_at', { ascending: true })

        if (error) {
            console.error('[Comentario] Erro ao listar:', error.message)
            return []
        }

        return (data ?? []) as Comentario[]
    },

    /**
     * Cria um novo comentário em uma notificação.
     */
    async criar(dto: CriarComentarioDTO): Promise<Comentario | null> {
        const { data, error } = await supabase
            .from('comentarios_notificacao')
            .insert(dto)
            .select()
            .single()

        if (error) {
            console.error('[Comentario] Erro ao criar:', error.message)
            return null
        }

        return data as Comentario
    },

    /**
     * Deleta um comentário pelo ID.
     */
    async deletar(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('comentarios_notificacao')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('[Comentario] Erro ao deletar:', error.message)
            return false
        }

        return true
    },

    /**
     * Conta comentários de uma notificação.
     */
    async contar(notificacaoId: string): Promise<number> {
        const { count, error } = await supabase
            .from('comentarios_notificacao')
            .select('*', { count: 'exact', head: true })
            .eq('notificacao_id', notificacaoId)

        if (error) {
            console.error('[Comentario] Erro ao contar:', error.message)
            return 0
        }

        return count ?? 0
    },

    /**
     * Conta comentários para múltiplas notificações de uma vez.
     * Retorna um Map de notificacaoId → count.
     */
    async contarBatch(notificacaoIds: string[]): Promise<Map<string, number>> {
        const result = new Map<string, number>()
        if (notificacaoIds.length === 0) return result

        const { data, error } = await supabase
            .from('comentarios_notificacao')
            .select('notificacao_id')
            .in('notificacao_id', notificacaoIds)

        if (error) {
            console.error('[Comentario] Erro ao contar batch:', error.message)
            return result
        }

        for (const row of (data ?? [])) {
            const id = (row as { notificacao_id: string }).notificacao_id
            result.set(id, (result.get(id) ?? 0) + 1)
        }

        return result
    },
}
