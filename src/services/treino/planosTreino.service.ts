/**
 * Planos de Treino — persistência e montagem de planos manuais/copiados.
 *
 * Regras (ver supabase/migrations/20261015_fase3_treinos.sql):
 * - 1 plano ATIVO por aluno (índice único). Criar = desativa o ativo + insere (RPC atômica);
 *   o anterior fica como histórico (registros antigos continuam apontando para ele).
 * - Editar = atualiza só `dados` do plano (nunca mexe em diagnostico_id/status).
 */
import { supabase } from '@/services/supabase';
import type { Resultado } from '@/types/resultado';
import {
    derivarDivisao,
    type Exercicio,
    type OrigemPlanoTreino,
    type PlanoTreino,
    type TreinoDetalhado,
} from '@/services/calculations/treino';

export interface PlanoTreinoResumo {
    id: string;
    status: 'ativo' | 'inativo';
    createdAt: string;
    diagnosticoId: string | null;
    origem: OrigemPlanoTreino;
    dados: PlanoTreino;
}

export interface AlunoComPlano {
    atletaId: string;
    nome: string;
    planoId: string;
    dados: PlanoTreino;
}

const MSG_ERRO = 'Não foi possível salvar o treino. Tente novamente.';

function falha<T>(codigo: string, erro = MSG_ERRO): Resultado<T> {
    return { ok: false, codigo, erro };
}

/** Remove valores não serializáveis (NaN/Infinity) antes de gravar em jsonb. */
function paraJson(dados: PlanoTreino): PlanoTreino {
    return JSON.parse(JSON.stringify(dados, (_, v) => (typeof v === 'number' && !isFinite(v) ? 0 : v)));
}

// ═══════════════════════════════════════════════════════════
// PERSISTÊNCIA
// ═══════════════════════════════════════════════════════════

export async function buscarPlanoTreinoAtivoMeta(
    atletaId: string
): Promise<{ id: string; diagnosticoId: string | null; origem?: OrigemPlanoTreino } | null> {
    const { data } = await supabase
        .from('planos_treino')
        .select('id, diagnostico_id, dados')
        .eq('atleta_id', atletaId)
        .eq('status', 'ativo')
        .maybeSingle();
    if (!data) return null;
    const row = data as { id: string; diagnostico_id: string | null; dados: PlanoTreino | null };
    return { id: row.id, diagnosticoId: row.diagnostico_id, origem: row.dados?.origem };
}

/** Cria um plano novo e ativo; o ativo anterior vira histórico. */
export async function criarPlanoTreino(
    atletaId: string,
    dados: PlanoTreino,
    diagnosticoId?: string | null
): Promise<Resultado<string>> {
    const { data, error } = await supabase.rpc('criar_plano_treino', {
        p_atleta_id: atletaId,
        p_dados: paraJson(dados),
        p_diagnostico_id: diagnosticoId ?? null,
    });
    if (error || !data) {
        console.error('[PlanosTreino] criar_plano_treino:', error?.message);
        return falha('ERRO_CRIAR');
    }
    return { ok: true, data: data as string };
}

/** Atualiza só os dados (exercícios, séries...) de um plano existente. */
export async function atualizarPlanoTreino(planoId: string, dados: PlanoTreino): Promise<Resultado<null>> {
    const { error } = await supabase
        .from('planos_treino')
        .update({ dados: paraJson(dados) } as Record<string, unknown>)
        .eq('id', planoId);
    if (error) {
        console.error('[PlanosTreino] atualizar:', error.message);
        return falha('ERRO_ATUALIZAR');
    }
    return { ok: true, data: null };
}

export async function listarPlanosTreino(atletaId: string): Promise<PlanoTreinoResumo[]> {
    const { data, error } = await supabase
        .from('planos_treino')
        .select('id, status, created_at, diagnostico_id, dados')
        .eq('atleta_id', atletaId)
        .order('created_at', { ascending: false });
    if (error) {
        console.error('[PlanosTreino] listar:', error.message);
        return [];
    }
    return (data ?? []).map((r: Record<string, unknown>) => {
        const dados = r.dados as PlanoTreino;
        return {
            id: r.id as string,
            status: r.status === 'ativo' ? 'ativo' : 'inativo',
            createdAt: r.created_at as string,
            diagnosticoId: (r.diagnostico_id as string | null) ?? null,
            origem: dados?.origem ?? 'vitruvio',
            dados,
        };
    });
}

/** Exclui UM plano (por id). Os demais planos do aluno não são tocados. */
export async function excluirPlanoTreino(planoId: string): Promise<Resultado<null>> {
    const { error } = await supabase.from('planos_treino').delete().eq('id', planoId);
    if (error) return falha('ERRO_EXCLUIR', 'Não foi possível excluir o plano.');
    return { ok: true, data: null };
}

/** Alunos do personal logado que têm plano ativo (fonte para "copiar de outro aluno"). RLS limita aos dele. */
export async function listarAlunosComPlano(excetoAtletaId?: string): Promise<AlunoComPlano[]> {
    const { data, error } = await supabase
        .from('planos_treino')
        .select('id, atleta_id, dados, atletas!inner(nome)')
        .eq('status', 'ativo');
    if (error) {
        console.error('[PlanosTreino] alunos com plano:', error.message);
        return [];
    }
    return (data ?? [])
        .map((r: Record<string, unknown>) => ({
            atletaId: r.atleta_id as string,
            nome: ((r.atletas as { nome?: string } | null)?.nome) ?? 'Aluno',
            planoId: r.id as string,
            dados: r.dados as PlanoTreino,
        }))
        .filter(a => a.atletaId !== excetoAtletaId && (a.dados?.treinos?.length ?? 0) > 0)
        .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}

// ═══════════════════════════════════════════════════════════
// MONTAGEM DE PLANOS
// ═══════════════════════════════════════════════════════════

const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F'];

function novoId(prefixo: string): string {
    return `${prefixo}-${crypto.randomUUID()}`;
}

/** Plano a partir de uma lista de treinos (manual, cópia ou modelo). Sem periodização fictícia. */
export function montarPlanoTreino(
    atletaId: string,
    treinos: TreinoDetalhado[],
    origem: Exclude<OrigemPlanoTreino, 'vitruvio'>,
    base?: Pick<PlanoTreino, 'objetivo' | 'observacoes'>
): PlanoTreino {
    const agora = new Date().toISOString();
    return {
        id: novoId('treino'),
        planoEvolucaoId: '',
        atletaId,
        objetivo: base?.objetivo ?? 'RECOMP',
        origem,
        divisao: derivarDivisao(treinos),
        treinos,
        observacoes: base?.observacoes ?? {
            resumo: '',
            pontosAtencao: [],
            alinhamentoMetodologia: true,
            mensagemFinal: '',
        },
        geradoEm: agora,
    };
}

/** Plano em branco com N treinos (A, B, C...) — cada um com um bloco vazio para o personal preencher. */
export function criarPlanoTreinoVazio(atletaId: string, frequencia: number): PlanoTreino {
    const n = Math.min(Math.max(Math.round(frequencia), 1), LETRAS.length);
    const treinos: TreinoDetalhado[] = LETRAS.slice(0, n).map(letra => ({
        id: novoId(`treino-${letra.toLowerCase()}`),
        nome: `Treino ${letra}`,
        letra,
        duracaoMinutos: 60,
        blocos: [{ nomeGrupo: 'Grupo muscular', seriesTotal: 0, isPrioridade: false, exercicios: [] }],
    }));
    return montarPlanoTreino(atletaId, treinos, 'manual');
}

function sanitizarExercicio(ex: Exercicio): Exercicio {
    // Cargas são individuais do aluno de origem; vídeo é re-vinculado na leitura pela biblioteca
    const { urlVideo: _video, topSetKg: _topKg, topSetReps: _topReps, ...resto } = ex;
    return {
        ...resto,
        prescricaoSeries: ex.prescricaoSeries?.map(s => ({ ...s, cargaKg: 0 })),
    };
}

/**
 * Prepara treinos para reaproveitar em outro aluno / modelo: cópia profunda, ids novos,
 * sem cargas absolutas nem vídeo resolvido. Mantém nomes, séries, reps, descanso, técnica e bibliotecaId.
 */
export function sanitizarTreinosParaCopia(treinos: TreinoDetalhado[]): TreinoDetalhado[] {
    return structuredClone(treinos).map(t => ({
        ...t,
        id: novoId(`treino-${(t.letra || 'x').toLowerCase()}`),
        blocos: t.blocos.map(b => ({ ...b, exercicios: b.exercicios.map(sanitizarExercicio) })),
    }));
}
