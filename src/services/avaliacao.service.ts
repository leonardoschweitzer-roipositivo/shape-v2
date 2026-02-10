/**
 * Avaliação Service
 * 
 * Gerencia avaliações (scores, proporções, classificações).
 * Uma avaliação é gerada a partir de uma medida.
 * 
 * Fluxo: Component → Hook → AvaliacaoService → Supabase
 */
import { supabase } from '@/services/supabase';
import type { Avaliacao, Json } from '@/lib/database.types';

// ===== TYPES =====

export interface CriarAvaliacaoInput {
    atleta_id: string;
    medidas_id: string;
    data?: string;
    peso?: number;
    gordura_corporal?: number;
    massa_magra?: number;
    massa_gorda?: number;
    imc?: number;
    ffmi?: number;
    score_geral?: number;
    classificacao_geral?: 'INICIO' | 'CAMINHO' | 'QUASE_LA' | 'META' | 'ELITE';
    proporcoes?: Json;
    simetria?: Json;
    comparacao_anterior?: Json;
}

// ===== SERVICE =====

export const avaliacaoService = {
    /**
     * Listar histórico de avaliações de um atleta
     */
    async listar(atletaId: string): Promise<Avaliacao[]> {
        const { data, error } = await supabase
            .from('avaliacoes')
            .select('*')
            .eq('atleta_id', atletaId)
            .order('data', { ascending: false });

        if (error) {
            console.error('[AvaliacaoService] Erro ao listar avaliações:', error.message);
            return [];
        }

        return data || [];
    },

    /**
     * Buscar avaliação mais recente
     */
    async buscarUltima(atletaId: string): Promise<Avaliacao | null> {
        const { data, error } = await supabase
            .from('avaliacoes')
            .select('*')
            .eq('atleta_id', atletaId)
            .order('data', { ascending: false })
            .limit(1)
            .single();

        if (error) {
            console.error('[AvaliacaoService] Erro ao buscar última avaliação:', error.message);
            return null;
        }

        return data;
    },

    /**
     * Buscar avaliação por ID
     */
    async buscarPorId(id: string): Promise<Avaliacao | null> {
        const { data, error } = await supabase
            .from('avaliacoes')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('[AvaliacaoService] Erro ao buscar avaliação:', error.message);
            return null;
        }

        return data;
    },

    /**
     * Criar nova avaliação
     */
    async criar(input: CriarAvaliacaoInput): Promise<Avaliacao | null> {
        const { data, error } = await supabase
            .from('avaliacoes')
            .insert({
                ...input,
                data: input.data || new Date().toISOString().split('T')[0],
            })
            .select()
            .single();

        if (error) {
            console.error('[AvaliacaoService] Erro ao criar avaliação:', error.message);
            return null;
        }

        return data;
    },

    /**
     * Atualizar avaliação (ex: recalcular proporções)
     */
    async atualizar(id: string, updates: Partial<Avaliacao>): Promise<Avaliacao | null> {
        const { data, error } = await supabase
            .from('avaliacoes')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('[AvaliacaoService] Erro ao atualizar avaliação:', error.message);
            return null;
        }

        return data;
    },

    /**
     * Contar avaliações de um atleta
     */
    async contar(atletaId: string): Promise<number> {
        const { count, error } = await supabase
            .from('avaliacoes')
            .select('*', { count: 'exact', head: true })
            .eq('atleta_id', atletaId);

        if (error) {
            console.error('[AvaliacaoService] Erro ao contar avaliações:', error.message);
            return 0;
        }

        return count || 0;
    }
};
