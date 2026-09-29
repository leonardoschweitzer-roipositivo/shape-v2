/**
 * Personal Service
 * 
 * Gerencia operações de Personal Trainers no Supabase.
 * Um personal pertence a uma academia e tem vários atletas.
 * 
 * Fluxo: Component → Hook → PersonalService → Supabase
 */
import { supabase } from '@/services/supabase';
import type { Personal } from '@/lib/database.types';

// ===== TYPES =====

export interface PersonalComKPIs extends Personal {
    total_atletas?: number;
    atletas_ativos?: number;
    score_medio?: number;
}

export type DadosProfissionaisPayload = Pick<
    Personal,
    'nome' | 'cref' | 'telefone' | 'cidade' | 'estado' | 'especialidades' | 'bio'
>;

// ===== SERVICE =====

export const personalService = {
    /**
     * Listar personais (opcionalmente filtrados por academia)
     */
    async listar(academiaId?: string): Promise<Personal[]> {
        let query = supabase
            .from('personais')
            .select('*')
            .order('nome', { ascending: true });

        if (academiaId) {
            query = query.eq('academia_id', academiaId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('[PersonalService] Erro ao listar personais:', error.message);
            return [];
        }

        return data || [];
    },

    /**
     * Buscar personal por ID
     */
    async buscarPorId(id: string): Promise<Personal | null> {
        const { data, error } = await supabase
            .from('personais')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('[PersonalService] Erro ao buscar personal:', error.message);
            return null;
        }

        return data;
    },

    /**
     * Buscar personal pelo auth_user_id
     */
    async buscarPorAuthUser(authUserId: string): Promise<Personal | null> {
        const { data, error } = await supabase
            .from('personais')
            .select('*')
            .eq('auth_user_id', authUserId)
            .single();

        if (error) {
            console.error('[PersonalService] Erro ao buscar personal por auth_user:', error.message);
            return null;
        }

        return data;
    },

    /**
     * Salva os dados profissionais do personal logado (perfil / onboarding).
     * Campos administrativos (plano, limite, status, vínculos) são bloqueados no banco.
     */
    async atualizarDadosProfissionais(
        id: string,
        dados: DadosProfissionaisPayload,
        opcoes: { concluirOnboarding?: boolean } = {}
    ): Promise<{ data: Personal | null; error: string | null }> {
        const { data, error } = await supabase
            .from('personais')
            .update({
                ...dados,
                ...(opcoes.concluirOnboarding ? { onboarding_completo: true } : {}),
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('[PersonalService] Erro ao salvar dados profissionais:', error.message);
            return { data: null, error: error.message };
        }

        return { data, error: null };
    },
};
