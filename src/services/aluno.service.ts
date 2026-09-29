/**
 * Aluno Service — cadastro, acesso ao portal (convite) e ciclo de vida do aluno.
 *
 * - Cadastro: RPC `cadastrar_aluno` (atleta + ficha numa transação; limite do plano no banco)
 * - Acesso:   Edge Function `convidar-aluno` (link de uso único → /definir-senha; sem senha padrão)
 * - Exclusão: Edge Function `excluir-aluno` (dados + login do aluno)
 * - Arquivar: status INATIVO (libera vaga no plano, mantém histórico)
 *
 * Fluxo: Component → useCadastroAluno / AcessoAlunoCard → alunoService → Supabase
 */
import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';
import type { Resultado } from '@/types/resultado';

export type { Resultado };

export type SexoAluno = 'M' | 'F';

export interface NovoAlunoInput {
    nome: string;
    sexo: SexoAluno;
    email?: string;
    telefone?: string;
    /** Gera o link de acesso ao portal logo após o cadastro (requer e-mail). */
    gerarAcesso?: boolean;
}

export interface LinkAcessoAluno {
    link: string;
    email: string;
    /** invite = primeiro acesso; recovery = reenvio para quem já tem login */
    tipo: 'invite' | 'recovery';
    expiraEm: string;
}

export interface ResultadoCadastroAluno {
    atletaId: string;
    acesso?: LinkAcessoAluno;
    /** O aluno foi criado, mas o link falhou — pode ser gerado depois na ficha. */
    erroAcesso?: string;
}


const MENSAGENS: Record<string, string> = {
    LIMITE_ALUNOS_ATINGIDO:
        'Você atingiu o limite de alunos ativos do seu plano. Arquive um aluno ou fale com o suporte para fazer upgrade.',
    EMAIL_EM_USO: 'Este e-mail já está em uso por outra conta. Use outro e-mail para o aluno.',
    EMAIL_DUPLICADO: 'Você já tem um aluno cadastrado com este e-mail.',
    EMAIL_INVALIDO: 'Informe um e-mail válido.',
    NOME_INVALIDO: 'Informe o nome do aluno (mínimo 2 letras).',
    SEXO_INVALIDO: 'Selecione o sexo do aluno.',
    ATLETA_ARQUIVADO: 'Reative o aluno antes de gerar o acesso.',
    ATLETA_JA_TEM_LOGIN: 'Este aluno já tem login com outro e-mail. Fale com o suporte para trocar.',
    ATLETA_DE_OUTRO_PERSONAL: 'Este aluno não pertence à sua conta.',
    PERSONAL_SUSPENSO: 'Sua conta está suspensa. Fale com o suporte.',
    NAO_AUTENTICADO: 'Sua sessão expirou. Entre novamente.',
};

const MENSAGEM_PADRAO = 'Não foi possível concluir. Tente novamente.';

/** Extrai o código de negócio de erros do Postgres (RAISE 'CODIGO: ...') ou de constraint. */
function codigoDoErroPostgres(err: { message?: string; code?: string } | null): string {
    if (!err) return 'ERRO';
    if (err.code === '23505') return 'EMAIL_DUPLICADO';
    const match = err.message?.match(/^([A-Z_]{4,})/);
    return match ? match[1] : 'ERRO';
}

export function mensagemErroAluno(codigo: string): string {
    return MENSAGENS[codigo] ?? MENSAGEM_PADRAO;
}

function falha<T>(codigo: string): Resultado<T> {
    return { ok: false, codigo, erro: mensagemErroAluno(codigo) };
}

async function invocarFuncao<T>(nome: string, body: Record<string, unknown>): Promise<Resultado<T>> {
    const { data, error } = await supabase.functions.invoke(nome, { body });
    if (!error) return { ok: true, data: data as T };

    let codigo = 'ERRO';
    if (error instanceof FunctionsHttpError) {
        const payload = await error.context.json().catch(() => null);
        codigo = payload?.error?.code ?? 'ERRO';
    }
    console.warn(`[AlunoService] ${nome} falhou:`, codigo, error.message);
    return falha(codigo);
}

export const alunoService = {
    async cadastrarAluno(input: NovoAlunoInput): Promise<Resultado<ResultadoCadastroAluno>> {
        const email = input.email?.trim().toLowerCase() || null;

        const { data: atletaId, error } = await supabase.rpc('cadastrar_aluno', {
            p_nome: input.nome.trim(),
            p_sexo: input.sexo,
            p_email: email,
            p_telefone: input.telefone?.trim() || null,
        });

        if (error || !atletaId) {
            console.warn('[AlunoService] cadastrar_aluno falhou:', error?.message);
            return falha(codigoDoErroPostgres(error));
        }

        const resultado: ResultadoCadastroAluno = { atletaId: atletaId as string };
        if (input.gerarAcesso && email) {
            const acesso = await alunoService.gerarLinkAcesso(resultado.atletaId);
            if (acesso.ok) resultado.acesso = acesso.data;
            else resultado.erroAcesso = acesso.erro;
        }
        return { ok: true, data: resultado };
    },

    /** Gera (ou reenvia) o link para o aluno criar a senha. `email` sobrescreve o cadastrado. */
    async gerarLinkAcesso(atletaId: string, email?: string): Promise<Resultado<LinkAcessoAluno>> {
        const r = await invocarFuncao<{ link: string; email: string; tipo: 'invite' | 'recovery'; expira_em: string }>(
            'convidar-aluno',
            { atleta_id: atletaId, ...(email ? { email: email.trim().toLowerCase() } : {}) }
        );
        if (!r.ok) return r;
        return { ok: true, data: { link: r.data.link, email: r.data.email, tipo: r.data.tipo, expiraEm: r.data.expira_em } };
    },

    /** Arquivar = status INATIVO: some da contagem do plano, mantém histórico. */
    async arquivarAluno(atletaId: string): Promise<Resultado<null>> {
        return alunoService.definirStatus(atletaId, 'INATIVO');
    },

    /** Reativar pode esbarrar no limite do plano (LIMITE_ALUNOS_ATINGIDO). */
    async reativarAluno(atletaId: string): Promise<Resultado<null>> {
        return alunoService.definirStatus(atletaId, 'ATIVO');
    },

    async definirStatus(atletaId: string, status: 'ATIVO' | 'INATIVO'): Promise<Resultado<null>> {
        const { error } = await supabase
            .from('atletas')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', atletaId);
        if (error) return falha(codigoDoErroPostgres(error));
        return { ok: true, data: null };
    },

    /** Exclusão definitiva (dados + login do aluno). */
    async excluirAluno(atletaId: string): Promise<Resultado<{ excluido: boolean; login_removido: boolean }>> {
        return invocarFuncao('excluir-aluno', { atleta_id: atletaId });
    },
};

/** Status do acesso ao portal, a partir das colunas do atleta. */
export type StatusAcessoAluno = 'ativo' | 'pendente' | 'sem_acesso';

export function statusAcessoAluno(atleta: {
    auth_user_id?: string | null;
    acesso_ativado_em?: string | null;
    convite_enviado_em?: string | null;
}): StatusAcessoAluno {
    if (!atleta.auth_user_id) return 'sem_acesso';
    // Alunos antigos (antes do convite) não têm convite_enviado_em mas já usam o portal
    if (atleta.acesso_ativado_em || !atleta.convite_enviado_em) return 'ativo';
    return 'pendente';
}
