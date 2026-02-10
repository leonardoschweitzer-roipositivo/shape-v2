/**
 * Atleta Service
 * 
 * Gerencia operações CRUD de atletas no Supabase.
 * Cada atleta pertence a um personal trainer.
 * 
 * Fluxo: Component → Hook → AtletaService → Supabase
 */
import { supabase } from '@/services/supabase';
import type { Atleta, Ficha } from '@/lib/database.types';

// ===== TYPES =====

export interface AtletaComFicha extends Atleta {
    ficha?: Ficha | null;
}

export interface AtletaResumo {
    id: string;
    nome: string;
    email: string | null;
    foto_url: string | null;
    status: string;
    created_at: string;
    ultima_avaliacao_data: string | null;
    score_geral: number | null;
}

export interface CriarAtletaInput {
    personal_id: string;
    academia_id?: string;
    nome: string;
    email?: string;
    telefone?: string;
    foto_url?: string;
}

export interface CriarFichaInput {
    atleta_id: string;
    sexo: 'M' | 'F';
    data_nascimento?: string;
    altura?: number;
    punho?: number;
    tornozelo?: number;
    joelho?: number;
    pelve?: number;
    objetivo?: string;
    categoria_preferida?: string;
    observacoes?: string;
}

// ===== SERVICE =====

export const atletaService = {
    /**
     * Listar todos os atletas de um personal
     */
    async listar(personalId: string): Promise<Atleta[]> {
        const { data, error } = await supabase
            .from('atletas')
            .select('*')
            .eq('personal_id', personalId)
            .order('nome', { ascending: true });

        if (error) {
            console.error('[AtletaService] Erro ao listar atletas:', error.message);
            return [];
        }

        return data || [];
    },

    /**
     * Buscar atleta por ID com ficha
     */
    async buscarPorId(id: string): Promise<AtletaComFicha | null> {
        const { data: atleta, error } = await supabase
            .from('atletas')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('[AtletaService] Erro ao buscar atleta:', error.message);
            return null;
        }

        // Buscar ficha separadamente
        const { data: ficha } = await supabase
            .from('fichas')
            .select('*')
            .eq('atleta_id', id)
            .single();

        return { ...atleta, ficha: ficha || null } as AtletaComFicha;
    },

    /**
     * Buscar atleta pelo auth_user_id (para quando o atleta faz login)
     */
    async buscarPorAuthUser(authUserId: string): Promise<Atleta | null> {
        const { data, error } = await supabase
            .from('atletas')
            .select('*')
            .eq('auth_user_id', authUserId)
            .single();

        if (error) {
            console.error('[AtletaService] Erro ao buscar atleta por auth_user:', error.message);
            return null;
        }

        return data;
    },

    /**
     * Criar novo atleta
     */
    async criar(input: CriarAtletaInput): Promise<Atleta | null> {
        const { data, error } = await supabase
            .from('atletas')
            .insert(input)
            .select()
            .single();

        if (error) {
            console.error('[AtletaService] Erro ao criar atleta:', error.message);
            return null;
        }

        return data;
    },

    /**
     * Criar ficha do atleta
     */
    async criarFicha(input: CriarFichaInput): Promise<Ficha | null> {
        const { data, error } = await supabase
            .from('fichas')
            .insert(input)
            .select()
            .single();

        if (error) {
            console.error('[AtletaService] Erro ao criar ficha:', error.message);
            return null;
        }

        return data;
    },

    /**
     * Atualizar dados do atleta
     */
    async atualizar(id: string, updates: Partial<Atleta>): Promise<Atleta | null> {
        const { data, error } = await supabase
            .from('atletas')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('[AtletaService] Erro ao atualizar atleta:', error.message);
            return null;
        }

        return data;
    },

    /**
     * Atualizar ficha do atleta
     */
    async atualizarFicha(atletaId: string, updates: Partial<Ficha>): Promise<Ficha | null> {
        const { data, error } = await supabase
            .from('fichas')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('atleta_id', atletaId)
            .select()
            .single();

        if (error) {
            console.error('[AtletaService] Erro ao atualizar ficha:', error.message);
            return null;
        }

        return data;
    },

    /**
     * Deletar atleta (soft delete - marca como inativo)
     */
    async deletar(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('atletas')
            .update({ status: 'INATIVO', updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) {
            console.error('[AtletaService] Erro ao deletar atleta:', error.message);
            return false;
        }

        return true;
    },

    /**
     * Contar atletas ativos de um personal
     */
    async contarAtivos(personalId: string): Promise<number> {
        const { count, error } = await supabase
            .from('atletas')
            .select('*', { count: 'exact', head: true })
            .eq('personal_id', personalId)
            .eq('status', 'ATIVO');

        if (error) {
            console.error('[AtletaService] Erro ao contar atletas:', error.message);
            return 0;
        }

        return count || 0;
    }
};
