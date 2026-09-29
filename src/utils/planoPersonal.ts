/**
 * Plano do Personal — rótulos e limites.
 *
 * Fonte da verdade do limite é `personais.limite_atletas` (NULL = ilimitado),
 * mantido pelo trigger `a_trg_personais_sync_limite` quando o plano muda.
 */
import type { Personal } from '@/lib/database.types';

export type PlanoPersonal = Personal['plano'];

export const PLANO_PERSONAL_LABEL: Record<PlanoPersonal, string> = {
    FREE: 'Gratuito',
    PRO: 'Profissional PRO',
    UNLIMITED: 'Ilimitado',
};

/**
 * WhatsApp do suporte para upgrade manual de plano (sem pagamento online).
 * Número em VITE_SUPORTE_WHATSAPP (só dígitos, com DDI: 5541999999999). Sem ele, o botão
 * de upgrade some e a UI orienta a falar com o suporte.
 */
const SUPORTE_WHATSAPP = String(import.meta.env.VITE_SUPORTE_WHATSAPP ?? '').replace(/\D/g, '');

export const SUPORTE_WHATSAPP_URL: string | null = SUPORTE_WHATSAPP
    ? `https://wa.me/${SUPORTE_WHATSAPP}?text=${encodeURIComponent('Olá! Quero fazer upgrade do meu plano no VITRU IA.')}`
    : null;

export function formatarLimiteAlunos(limite: number | null | undefined): string {
    return limite == null ? 'Alunos ilimitados' : `Até ${limite} alunos`;
}

/** Percentual de uso do plano (0–100) ou null quando ilimitado. */
export function percentualUsoPlano(ativos: number, limite: number | null | undefined): number | null {
    if (limite == null || limite <= 0) return null;
    return Math.min(100, Math.round((ativos / limite) * 100));
}
