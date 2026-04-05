/**
 * Portal Trackers — Registros diários (água, sono, peso, treino)
 */
import { supabase } from '@/services/supabase';
import type { SupaRegistroDiario } from './portalTypes';
import type { SetExecutado } from '@/types/athlete-portal';
import { getHojeLocal } from './dateUtils';

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
            data: dataOverride || getHojeLocal(),
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
 * Exercício realizado em um treino concluído (snapshot da lista final, com sets detalhados).
 */
export interface ExercicioRealizado {
    id: string;
    nome: string;
    series?: number;              // prescrito (contagem original do plano)
    repeticoes?: string;          // prescrito (range "10-12")
    sets?: SetExecutado[];        // realizados — um objeto por série, com carga + reps
    concluido?: boolean;          // se o aluno marcou o checkbox do exercício
}

/**
 * Marca treino como completado
 */
export async function completarTreino(
    atletaId: string,
    dados: {
        intensidade: number;
        duracao: number;
        reportouDor: boolean;
        treinoIndex?: number;
        exercicios?: ExercicioRealizado[]; // snapshot da lista final (após edições do aluno)
    },
    dataOverride?: string, // 'YYYY-MM-DD' — para registros retroativos
    personalId?: string    // ID do personal para notificação direta
): Promise<boolean> {
    const result = await registrarTracker(atletaId, 'treino', {
        status: 'completo',
        ...dados,
    }, dataOverride);

    // Disparar notificação para o Personal (await garante execução no mobile)
    if (result) {
        try {
            const { onTreinoCompleto } = await import('../notificacaoTriggers')
            await onTreinoCompleto(atletaId, {
                duracao: dados.duracao ? `${dados.duracao}min` : undefined,
                personalId
            })
        } catch (err) {
            console.warn('[completarTreino] Erro ao notificar:', err)
        }
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

    // Disparar notificação para o Personal (await garante execução no mobile)
    if (result) {
        try {
            const { onTreinoPulado } = await import('../notificacaoTriggers')
            await onTreinoPulado(atletaId, { personalId, continuarHoje })
        } catch (err) {
            console.warn('[pularTreino] Erro ao notificar:', err)
        }
    }

    return result;
}
