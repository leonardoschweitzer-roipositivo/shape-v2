/**
 * Portal Trackers — Registros diários (água, sono, peso, treino)
 */
import { supabase } from '@/services/supabase';
import type { SupaRegistroDiario } from './portalTypes';

/**
 * Registra tracker diário (água, peso, sono, dor, treino)
 */
export async function registrarTracker(
    atletaId: string,
    tipo: 'agua' | 'sono' | 'peso' | 'treino' | 'dor' | 'refeicao' | 'feedback',
    dados: Record<string, unknown>,
    dataOverride?: string // 'YYYY-MM-DD' — para registros retroativos (ex: ontem)
): Promise<boolean> {
    const { error } = await supabase
        .from('registros_diarios')
        .insert({
            atleta_id: atletaId,
            data: dataOverride || new Date().toISOString().split('T')[0],
            tipo,
            dados,
        } as Record<string, unknown>);

    if (error) {
        console.error('[PortalDataService] Erro ao registrar tracker:', error);
        return false;
    }
    return true;
}

/**
 * Marca treino como completado
 */
export async function completarTreino(
    atletaId: string,
    dados: { intensidade: number; duracao: number; reportouDor: boolean; treinoIndex?: number },
    dataOverride?: string, // 'YYYY-MM-DD' — para registros retroativos
    personalId?: string    // ID do personal para notificação direta
): Promise<boolean> {
    const result = await registrarTracker(atletaId, 'treino', {
        status: 'completo',
        ...dados,
    }, dataOverride);

    // Disparar notificação para o Personal (fire-and-forget)
    if (result) {
        import('../notificacaoTriggers').then(({ onTreinoCompleto }) => {
            onTreinoCompleto(atletaId, {
                duracao: dados.duracao ? `${dados.duracao}min` : undefined,
                personalId
            }).catch(err => console.warn('[completarTreino] Erro ao notificar:', err));
        });
    }

    return result;
}

/**
 * Marca treino como pulado
 */
export async function pularTreino(
    atletaId: string,
    treinoIndex?: number,
    continuarHoje: boolean = false,
    personalId?: string
): Promise<boolean> {
    const result = await registrarTracker(atletaId, 'treino', {
        status: 'pulado',
        treinoIndex,
        continuarHoje,
    });

    // Disparar notificação para o Personal (fire-and-forget)
    if (result) {
        import('../notificacaoTriggers').then(({ onTreinoPulado }) => {
            onTreinoPulado(atletaId, { personalId, continuarHoje }).catch(err => console.warn('[pularTreino] Erro ao notificar:', err));
        });
    }

    return result;
}
