/**
 * Portal COACH — Chat com o Coach IA
 */
import { supabase } from '@/services/supabase';
import type { ChatMessage } from '@/types/athlete-portal';
import type { SupaChatMessage } from './portalTypes';

/**
 * Busca mensagens de chat do Supabase
 */
export async function buscarMensagensChat(atletaId: string): Promise<ChatMessage[]> {
    const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('atleta_id', atletaId)
        .order('created_at', { ascending: true })
        .limit(100);

    return ((data || []) as unknown as SupaChatMessage[]).map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: new Date(m.created_at),
        status: 'sent' as const,
    }));
}

/**
 * Salva uma mensagem de chat
 */
export async function salvarMensagemChat(
    atletaId: string,
    role: 'user' | 'assistant',
    content: string
): Promise<void> {
    await supabase
        .from('chat_messages')
        .insert({
            atleta_id: atletaId,
            role,
            content,
        } as Record<string, unknown>);
}
