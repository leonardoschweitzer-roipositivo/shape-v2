/**
 * Modelos de treino do personal (tabela treino_modelos, RLS = só os do personal logado).
 * O modelo guarda só os treinos (sem cargas) + observações; aplicar = semear o editor.
 */
import { supabase } from '@/services/supabase';
import type { Resultado } from '@/types/resultado';
import type { ObservacoesTreino, TreinoDetalhado } from '@/services/calculations/treino';
import { sanitizarTreinosParaCopia } from './planosTreino.service';

export interface TreinoModelo {
    id: string;
    nome: string;
    descricao: string | null;
    treinos: TreinoDetalhado[];
    observacoes?: ObservacoesTreino;
    atualizadoEm: string;
}

export async function listarModelos(): Promise<TreinoModelo[]> {
    const { data, error } = await supabase
        .from('treino_modelos')
        .select('id, nome, descricao, dados, updated_at')
        .order('nome');
    if (error) {
        console.error('[TreinoModelos] listar:', error.message);
        return [];
    }
    return (data ?? []).map((r: Record<string, unknown>) => {
        const dados = (r.dados ?? {}) as { treinos?: TreinoDetalhado[]; observacoes?: ObservacoesTreino };
        return {
            id: r.id as string,
            nome: r.nome as string,
            descricao: (r.descricao as string | null) ?? null,
            treinos: dados.treinos ?? [],
            observacoes: dados.observacoes,
            atualizadoEm: r.updated_at as string,
        };
    });
}

export async function salvarComoModelo(
    nome: string,
    treinos: TreinoDetalhado[],
    opcoes: { descricao?: string; observacoes?: ObservacoesTreino } = {}
): Promise<Resultado<string>> {
    const nomeLimpo = nome.trim();
    if (nomeLimpo.length < 2) return { ok: false, codigo: 'NOME_INVALIDO', erro: 'Dê um nome ao modelo.' };

    const { data, error } = await supabase
        .from('treino_modelos')
        .insert({
            nome: nomeLimpo,
            descricao: opcoes.descricao?.trim() || null,
            dados: { treinos: sanitizarTreinosParaCopia(treinos), observacoes: opcoes.observacoes },
        } as Record<string, unknown>)
        .select('id')
        .single();

    if (error) {
        const duplicado = error.code === '23505';
        return {
            ok: false,
            codigo: duplicado ? 'NOME_DUPLICADO' : 'ERRO',
            erro: duplicado ? 'Você já tem um modelo com esse nome.' : 'Não foi possível salvar o modelo.',
        };
    }
    return { ok: true, data: (data as { id: string }).id };
}

export async function excluirModelo(id: string): Promise<Resultado<null>> {
    const { error } = await supabase.from('treino_modelos').delete().eq('id', id);
    if (error) return { ok: false, codigo: 'ERRO', erro: 'Não foi possível excluir o modelo.' };
    return { ok: true, data: null };
}
