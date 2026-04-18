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

        if (error || !data) return null;
        return (data.objetivo_vitruvio as ObjetivoVitruvio | null) ?? null;
    } catch {
        return null;
    }
}
