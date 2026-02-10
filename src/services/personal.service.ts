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

export interface CriarPersonalInput {
    academia_id?: string;
    nome: string;
    email: string;
    telefone?: string;
    cpf?: string;
    cref?: string;
    foto_url?: string;
}

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
     * Criar novo personal
     */
    async criar(input: CriarPersonalInput): Promise<Personal | null> {
        const { data, error } = await supabase
            .from('personais')
            .insert(input)
            .select()
            .single();

        if (error) {
            console.error('[PersonalService] Erro ao criar personal:', error.message);
            return null;
        }

        return data;
    },

    /**
     * Atualizar dados do personal
     */
    async atualizar(id: string, updates: Partial<Personal>): Promise<Personal | null> {
        const { data, error } = await supabase
            .from('personais')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('[PersonalService] Erro ao atualizar personal:', error.message);
            return null;
        }

        return data;
    },

    /**
     * Vincular personal a uma academia
     */
    async vincularAcademia(personalId: string, academiaId: string): Promise<boolean> {
        const { error } = await supabase
            .from('personais')
            .update({
                academia_id: academiaId,
                data_vinculo: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', personalId);

        if (error) {
            console.error('[PersonalService] Erro ao vincular academia:', error.message);
            return false;
        }

        return true;
    }
};
