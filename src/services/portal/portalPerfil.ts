/**
 * Portal PERFIL — Dados básicos e informações do personal
 */
import { supabase } from '@/services/supabase';
import type { DadosBasicos, MeuPersonal } from '@/types/athlete-portal';
import type { PortalContext, SupaPersonal } from './portalTypes';

/**
 * Busca dados básicos para a tela de perfil
 */
export function extrairDadosBasicos(ctx: PortalContext): DadosBasicos {
    const ficha = ctx.ficha;
    const hoje = new Date();
    const nascimento = ficha?.data_nascimento ? new Date(ficha.data_nascimento) : null;
    const idade = nascimento
        ? Math.floor((hoje.getTime() - nascimento.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
        : 0;

    return {
        altura: ficha?.altura || 0,
        idade,
        objetivo: ficha?.objetivo || 'Não definido',
        categoria: 'Golden Ratio',
    };
}

/**
 * Extrai dados do personal para a tela de perfil
 */
export async function buscarDadosPersonal(personalId: string): Promise<MeuPersonal | null> {
    if (!personalId) return null;

    const { data } = await supabase
        .from('personais')
        .select('id, nome, email, telefone, cref')
        .eq('id', personalId)
        .single();

    if (!data) return null;

    const p = data as unknown as SupaPersonal;
    return {
        id: p.id,
        nome: p.nome || 'Personal',
        cref: p.cref || '',
        telefone: p.telefone || '',
        email: p.email || '',
    };
}
