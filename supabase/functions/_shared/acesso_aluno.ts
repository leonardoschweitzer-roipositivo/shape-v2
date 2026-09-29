/**
 * VITRU IA — Base compartilhada das Edge Functions de gestão de aluno
 * (convidar-aluno, excluir-aluno).
 *
 * - Identifica o usuário pelo JWT verificado (auth.getUser), nunca decodificando na mão
 * - Confere que o aluno pertence ao personal logado
 * - Usa service_role só depois da checagem de dono
 */
import { createClient, SupabaseClient, User } from 'npm:@supabase/supabase-js@2'

export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

export function json(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
}

/** Erro de negócio com código estável (o front traduz para mensagem amigável). */
export class ErroAcesso extends Error {
    constructor(public status: number, public code: string, message?: string) {
        super(message ?? code)
    }
}

export function responderErro(err: unknown): Response {
    if (err instanceof ErroAcesso) {
        return json({ error: { code: err.code, message: err.message } }, err.status)
    }
    console.error('[acesso_aluno] Erro inesperado:', err)
    return json({ error: { code: 'ERRO_INTERNO', message: 'Erro inesperado. Tente novamente.' } }, 500)
}

function env(nome: string): string {
    const valor = Deno.env.get(nome)
    if (!valor) throw new Error(`Variável de ambiente ausente: ${nome}`)
    return valor
}

export function adminClient(): SupabaseClient {
    return createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), {
        auth: { autoRefreshToken: false, persistSession: false },
    })
}

async function usuarioDaRequisicao(req: Request): Promise<User> {
    const authHeader = req.headers.get('Authorization') ?? ''
    if (!authHeader.startsWith('Bearer ')) throw new ErroAcesso(401, 'NAO_AUTENTICADO')

    const userClient = createClient(env('SUPABASE_URL'), env('SUPABASE_ANON_KEY'), {
        global: { headers: { Authorization: authHeader } },
        auth: { autoRefreshToken: false, persistSession: false },
    })
    const { data, error } = await userClient.auth.getUser()
    if (error || !data.user) throw new ErroAcesso(401, 'NAO_AUTENTICADO')
    return data.user
}

export interface AtletaDoPersonal {
    id: string
    personal_id: string
    nome: string
    email: string | null
    auth_user_id: string | null
    status: string
}

/**
 * Autentica o personal e carrega o aluno, garantindo que o aluno é dele.
 * Lança ErroAcesso (401/403/404) caso contrário.
 */
export async function carregarAlunoDoPersonal(
    req: Request,
    admin: SupabaseClient,
    atletaId: unknown
): Promise<{ personalId: string; atleta: AtletaDoPersonal }> {
    if (typeof atletaId !== 'string' || !/^[0-9a-f-]{36}$/i.test(atletaId)) {
        throw new ErroAcesso(400, 'ATLETA_ID_INVALIDO')
    }

    const user = await usuarioDaRequisicao(req)

    const { data: personal, error: errPersonal } = await admin
        .from('personais')
        .select('id, status')
        .eq('auth_user_id', user.id)
        .maybeSingle()
    if (errPersonal) throw errPersonal
    if (!personal) throw new ErroAcesso(403, 'APENAS_PERSONAL')
    if (personal.status === 'SUSPENSO' || personal.status === 'INATIVO') {
        throw new ErroAcesso(403, 'PERSONAL_SUSPENSO')
    }

    const { data: atleta, error: errAtleta } = await admin
        .from('atletas')
        .select('id, personal_id, nome, email, auth_user_id, status')
        .eq('id', atletaId)
        .maybeSingle()
    if (errAtleta) throw errAtleta
    if (!atleta) throw new ErroAcesso(404, 'ATLETA_NAO_ENCONTRADO')
    if (atleta.personal_id !== personal.id) throw new ErroAcesso(403, 'ATLETA_DE_OUTRO_PERSONAL')

    return { personalId: personal.id, atleta: atleta as AtletaDoPersonal }
}
