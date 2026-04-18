/**
 * objetivoAtleta.ts — Persistência do objetivo Vitrúvio escolhido pelo personal.
 *
 * O personal pode aceitar a recomendação do VITRU ou escolher outro objetivo
 * no Diagnóstico. A escolha fica em `fichas.objetivo_vitruvio` e deve ser
 * respeitada pelas etapas seguintes (Treino e Dieta).
 */

import { supabase } from '@/services/supabase';
import type { ObjetivoVitruvio } from './objetivos';

export async function buscarObjetivoVitruvio(atletaId: string): Promise<ObjetivoVitruvio | null> {
    try {
        const { data, error } = await supabase
            .from('fichas')
            .select('objetivo_vitruvio')
            .eq('atleta_id', atletaId)
            .single();

        if (error) {
            console.warn('[buscarObjetivoVitruvio] erro ao buscar ficha:', error);
            return null;
        }
        const obj = (data?.objetivo_vitruvio as ObjetivoVitruvio | null) ?? null;
        console.info('[buscarObjetivoVitruvio] atleta', atletaId, '→', obj);
        return obj;
    } catch (e) {
        console.warn('[buscarObjetivoVitruvio] exception:', e);
        return null;
    }
}
