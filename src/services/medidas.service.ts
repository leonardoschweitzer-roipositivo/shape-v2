/**
 * Medidas Service
 * 
 * Gerencia registros de medidas corporais dos atletas.
 * Cada medida gera automaticamente uma avaliação.
 * 
 * Fluxo: Component → Hook → MedidasService → Supabase
 */
import { supabase } from '@/services/supabase';
import type { Medida } from '@/lib/database.types';

// ===== TYPES =====

export interface CriarMedidaInput {
    atleta_id: string;
    data?: string;
    peso?: number;
    gordura_corporal?: number;
    ombros?: number;
    peitoral?: number;
    cintura?: number;
    quadril?: number;
    abdomen?: number;
    braco_esquerdo?: number;
    braco_direito?: number;
    antebraco_esquerdo?: number;
    antebraco_direito?: number;
    coxa_esquerda?: number;
    coxa_direita?: number;
    panturrilha_esquerda?: number;
    panturrilha_direita?: number;
    pescoco?: number;
    registrado_por?: 'PORTAL' | 'COACH_IA' | 'PERSONAL' | 'APP';
    personal_id?: string;
}

// ===== SERVICE =====

export const medidasService = {
    /**
     * Listar histórico de medidas de um atleta
     */
    async listar(atletaId: string): Promise<Medida[]> {
        const { data, error } = await supabase
            .from('medidas')
            .select('*')
            .eq('atleta_id', atletaId)
            .order('data', { ascending: false });

        if (error) {
            console.error('[MedidasService] Erro ao listar medidas:', error.message);
            return [];
        }

        return data || [];
    },

    /**
     * Buscar medida mais recente do atleta
     */
    async buscarUltima(atletaId: string): Promise<Medida | null> {
        const { data, error } = await supabase
            .from('medidas')
            .select('*')
            .eq('atleta_id', atletaId)
            .order('data', { ascending: false })
            .limit(1)
            .single();

        if (error) {
            console.error('[MedidasService] Erro ao buscar última medida:', error.message);
            return null;
        }

        return data;
    },

    /**
     * Registrar nova medida
     */
    async criar(input: CriarMedidaInput): Promise<Medida | null> {
        const { data, error } = await supabase
            .from('medidas')
            .insert({
                ...input,
                data: input.data || new Date().toISOString().split('T')[0],
            })
            .select()
            .single();

        if (error) {
            console.error('[MedidasService] Erro ao criar medida:', error.message);
            return null;
        }

        return data;
    },

    /**
     * Atualizar medida
     */
    async atualizar(id: string, updates: Partial<Medida>): Promise<Medida | null> {
        const { data, error } = await supabase
            .from('medidas')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('[MedidasService] Erro ao atualizar medida:', error.message);
            return null;
        }

        return data;
    }
};
