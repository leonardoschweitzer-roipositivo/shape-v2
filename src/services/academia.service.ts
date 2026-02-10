/**
 * Academia Service
 * 
 * Gerencia operações de Academias no Supabase.
 * Uma academia tem vários personais e, indiretamente, vários atletas.
 * 
 * Fluxo: Component → Hook → AcademiaService → Supabase
 */
import { supabase } from '@/services/supabase';
import type { Academia } from '@/lib/database.types';

// ===== TYPES =====

export interface AcademiaComKPIs extends Academia {
    total_personais?: number;
    personais_ativos?: number;
    total_atletas?: number;
    atletas_ativos?: number;
    score_medio?: number;
}

export interface CriarAcademiaInput {
    nome: string;
    email: string;
    razao_social?: string;
    cnpj?: string;
    telefone?: string;
}

// ===== SERVICE =====

export const academiaService = {
    /**
     * Buscar academia por ID
     */
    async buscarPorId(id: string): Promise<Academia | null> {
        const { data, error } = await supabase
            .from('academias')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('[AcademiaService] Erro ao buscar academia:', error.message);
            return null;
        }

        return data;
    },

    /**
     * Buscar academia pelo auth_user_id
     */
    async buscarPorAuthUser(authUserId: string): Promise<Academia | null> {
        const { data, error } = await supabase
            .from('academias')
            .select('*')
            .eq('auth_user_id', authUserId)
            .single();

        if (error) {
            console.error('[AcademiaService] Erro ao buscar academia por auth_user:', error.message);
            return null;
        }

        return data;
    },

    /**
     * Criar nova academia
     */
    async criar(input: CriarAcademiaInput): Promise<Academia | null> {
        const { data, error } = await supabase
            .from('academias')
            .insert(input)
            .select()
            .single();

        if (error) {
            console.error('[AcademiaService] Erro ao criar academia:', error.message);
            return null;
        }

        return data;
    },

    /**
     * Atualizar dados da academia
     */
    async atualizar(id: string, updates: Partial<Academia>): Promise<Academia | null> {
        const { data, error } = await supabase
            .from('academias')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('[AcademiaService] Erro ao atualizar academia:', error.message);
            return null;
        }

        return data;
    },

    /**
     * Listar todas as academias
     */
    async listar(): Promise<Academia[]> {
        const { data, error } = await supabase
            .from('academias')
            .select('*')
            .order('nome', { ascending: true });

        if (error) {
            console.error('[AcademiaService] Erro ao listar academias:', error.message);
            return [];
        }

        return data || [];
    }
};
