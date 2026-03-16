/**
 * VITRU IA — Auth Helper
 * 
 * Helper compartilhado para validação de acesso em todas as Edge Functions.
 * Centraliza a lógica de permissões para os 3 tipos de usuário:
 * - ATLETA: só acessa seus próprios dados
 * - PERSONAL: acessa dados dos atletas vinculados a ele
 * - ACADEMIA: acessa dados de todos os atletas/personais da unidade
 * 
 * @version 1.1.0
 * @author VITRU IA Team
 */

import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ═══════════════════════════════════════════════════════════════
// CORS HEADERS
// ═══════════════════════════════════════════════════════════════

/**
 * Headers CORS padrão para todas as Edge Functions
 */
export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
}

// ═══════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════

export type UserRole = 'ATLETA' | 'PERSONAL' | 'ACADEMIA'

export interface AuthContext {
    /** UUID do auth.users (usuário logado) */
    auth_user_id: string
    /** Role do usuário (descoberto automaticamente ou informado) */
    role?: UserRole
    /** UUID do atleta alvo (quando aplicável) */
    atleta_id?: string
    /** UUID da academia (contexto) */
    academia_id?: string
}

export interface UserContext {
    /** Role do usuário */
    role: UserRole
    /** UUID do auth.users */
    auth_user_id: string
    /** UUID específico (atleta.id, personal.id ou academia.id) */
    entity_id: string
    /** Nome do usuário */
    nome: string
    /** UUID da academia vinculada */
    academia_id: string | null
    /** Email do usuário */
    email: string
    /** Dados extras conforme o role */
    extras?: Record<string, any>
}

export interface AuthResult {
    /** Se o acesso foi permitido */
    permitido: boolean
    /** Nível de acesso concedido */
    nivel: 'proprio' | 'completo' | 'gestao' | 'nenhum'
    /** Motivo da negação (se aplicável) */
    motivo?: string
    /** Dados do atleta alvo (se permitido) */
    atleta?: Record<string, any>
}

export interface FunctionResponse {
    success: boolean
    data?: any
    error?: {
        code: string
        message: string
    }
}

// ═══════════════════════════════════════════════════════════════
// CLIENTE SUPABASE
// ═══════════════════════════════════════════════════════════════

let supabaseClient: SupabaseClient | null = null

/**
 * Retorna uma instância do cliente Supabase (singleton)
 */
export function getSupabaseClient(): SupabaseClient {
    if (!supabaseClient) {
        const url = Deno.env.get('SUPABASE_URL')
        const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

        if (!url || !key) {
            throw new Error('SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios')
        }

        supabaseClient = createClient(url, key)
    }

    return supabaseClient
}

// ═══════════════════════════════════════════════════════════════
// DESCOBERTA DE CONTEXTO DO USUÁRIO
// ═══════════════════════════════════════════════════════════════

/**
 * Descobre o contexto completo do usuário logado.
 * Verifica em qual tabela (atletas, personais, academias) o auth_user_id existe
 * e retorna o role + dados básicos.
 * 
 * @param auth_user_id - UUID do auth.users
 * @returns UserContext com role e dados do usuário
 */
export async function getUserContext(auth_user_id: string): Promise<UserContext | null> {
    const supabase = getSupabaseClient()

    // Tentar encontrar como ACADEMIA
    const { data: academia } = await supabase
        .from('academias')
        .select('id, nome, email, auth_user_id')
        .eq('auth_user_id', auth_user_id)
        .maybeSingle()

    if (academia) {
        return {
            role: 'ACADEMIA',
            auth_user_id,
            entity_id: academia.id,
            nome: academia.nome,
            academia_id: academia.id,
            email: academia.email,
            extras: {
                is_owner: true
            }
        }
    }

    // Tentar encontrar como PERSONAL
    const { data: personal } = await supabase
        .from('personais')
        .select('id, nome, email, auth_user_id, academia_id, cref, plano, limite_atletas, status')
        .eq('auth_user_id', auth_user_id)
        .maybeSingle()

    if (personal) {
        return {
            role: 'PERSONAL',
            auth_user_id,
            entity_id: personal.id,
            nome: personal.nome,
            academia_id: personal.academia_id,
            email: personal.email,
            extras: {
                cref: personal.cref,
                plano: personal.plano,
                limite_atletas: personal.limite_atletas,
                status: personal.status
            }
        }
    }

    // Tentar encontrar como ATLETA
    const { data: atleta } = await supabase
        .from('atletas')
        .select('id, nome, email, auth_user_id, personal_id, academia_id, status')
        .eq('auth_user_id', auth_user_id)
        .maybeSingle()

    if (atleta) {
        return {
            role: 'ATLETA',
            auth_user_id,
            entity_id: atleta.id,
            nome: atleta.nome,
            academia_id: atleta.academia_id,
            email: atleta.email,
            extras: {
                personal_id: atleta.personal_id,
                status: atleta.status
            }
        }
    }

    // Usuário não encontrado em nenhuma tabela
    return null
}

// ═══════════════════════════════════════════════════════════════
// VALIDAÇÃO DE ACESSO A DADOS DE ATLETA
// ═══════════════════════════════════════════════════════════════

/**
 * Valida se o solicitante tem acesso aos dados de um atleta específico.
 * 
 * Regras:
 * - ATLETA: só pode acessar seus próprios dados
 * - PERSONAL: só pode acessar dados dos atletas vinculados a ele
 * - ACADEMIA: pode acessar dados de todos os atletas da unidade
 * 
 * @param ctx - Contexto de autenticação
 * @returns AuthResult com permissão e nível de acesso
 */
export async function validarAcessoAtleta(ctx: AuthContext): Promise<AuthResult> {
    const supabase = getSupabaseClient()

    // Primeiro, descobrir o contexto do solicitante se não foi informado
    let userCtx: UserContext | null = null

    if (!ctx.role) {
        userCtx = await getUserContext(ctx.auth_user_id)
        if (!userCtx) {
            return {
                permitido: false,
                nivel: 'nenhum',
                motivo: 'Usuário não encontrado no sistema.'
            }
        }
        ctx.role = userCtx.role
    }

    // Se não tem atleta_id, não há o que validar
    if (!ctx.atleta_id) {
        return {
            permitido: false,
            nivel: 'nenhum',
            motivo: 'ID do atleta não informado.'
        }
    }

    // Buscar o atleta alvo
    const { data: atleta, error } = await supabase
        .from('atletas')
        .select('id, auth_user_id, personal_id, academia_id, nome, email, status')
        .eq('id', ctx.atleta_id)
        .maybeSingle()

    if (error) {
        console.error('Erro ao buscar atleta:', error)
        return {
            permitido: false,
            nivel: 'nenhum',
            motivo: 'Erro ao buscar dados do atleta.'
        }
    }

    if (!atleta) {
        return {
            permitido: false,
            nivel: 'nenhum',
            motivo: 'Atleta não encontrado.'
        }
    }

    // ─────────────────────────────────────────
    // ATLETA: só pode ver a si mesmo
    // ─────────────────────────────────────────
    if (ctx.role === 'ATLETA') {
        // Buscar o atleta vinculado ao auth_user_id do solicitante
        const { data: atletaSolicitante } = await supabase
            .from('atletas')
            .select('id')
            .eq('auth_user_id', ctx.auth_user_id)
            .maybeSingle()

        if (atletaSolicitante && atletaSolicitante.id === atleta.id) {
            return {
                permitido: true,
                nivel: 'proprio',
                atleta
            }
        }

        return {
            permitido: false,
            nivel: 'nenhum',
            motivo: 'Você só pode acessar seus próprios dados.'
        }
    }

    // ─────────────────────────────────────────
    // PERSONAL: só pode ver atletas vinculados
    // ─────────────────────────────────────────
    if (ctx.role === 'PERSONAL') {
        const { data: personal } = await supabase
            .from('personais')
            .select('id')
            .eq('auth_user_id', ctx.auth_user_id)
            .maybeSingle()

        if (personal && atleta.personal_id === personal.id) {
            return {
                permitido: true,
                nivel: 'completo',
                atleta
            }
        }

        return {
            permitido: false,
            nivel: 'nenhum',
            motivo: 'Este atleta não está vinculado a você.'
        }
    }

    // ─────────────────────────────────────────
    // ACADEMIA: pode ver todos da unidade
    // ─────────────────────────────────────────
    if (ctx.role === 'ACADEMIA') {
        const { data: academia } = await supabase
            .from('academias')
            .select('id')
            .eq('auth_user_id', ctx.auth_user_id)
            .maybeSingle()

        if (academia && atleta.academia_id === academia.id) {
            return {
                permitido: true,
                nivel: 'gestao',
                atleta
            }
        }

        return {
            permitido: false,
            nivel: 'nenhum',
            motivo: 'Este atleta não pertence à sua academia.'
        }
    }

    return {
        permitido: false,
        nivel: 'nenhum',
        motivo: 'Role inválido.'
    }
}

// ═══════════════════════════════════════════════════════════════
// VALIDAÇÃO DE ACESSO À GESTÃO (EXCLUSIVO ACADEMIA)
// ═══════════════════════════════════════════════════════════════

/**
 * Valida se o solicitante tem acesso às funcionalidades de gestão.
 * APENAS usuários com role ACADEMIA podem acessar.
 * 
 * @param ctx - Contexto de autenticação
 * @returns AuthResult
 */
export async function validarAcessoGestao(ctx: AuthContext): Promise<AuthResult> {
    // Descobrir o contexto se não foi informado
    if (!ctx.role) {
        const userCtx = await getUserContext(ctx.auth_user_id)
        if (!userCtx) {
            return {
                permitido: false,
                nivel: 'nenhum',
                motivo: 'Usuário não encontrado no sistema.'
            }
        }
        ctx.role = userCtx.role
    }

    // Apenas ACADEMIA pode acessar gestão
    if (ctx.role !== 'ACADEMIA') {
        return {
            permitido: false,
            nivel: 'nenhum',
            motivo: 'Acesso exclusivo para o gestor da academia.'
        }
    }

    return {
        permitido: true,
        nivel: 'gestao'
    }
}

// ═══════════════════════════════════════════════════════════════
// HELPERS DE RESPOSTA HTTP
// ═══════════════════════════════════════════════════════════════

/**
 * Retorna uma resposta JSON de sucesso
 */
export function jsonResponse(data: any, status = 200): Response {
    return new Response(
        JSON.stringify({
            success: true,
            data
        }),
        {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status
        }
    )
}

/**
 * Retorna uma resposta JSON de erro
 */
export function errorResponse(
    status: number,
    message: string,
    code = 'ERROR'
): Response {
    return new Response(
        JSON.stringify({
            success: false,
            error: {
                code,
                message
            }
        }),
        {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status
        }
    )
}

/**
 * Retorna uma resposta JSON de erro (alias para compatibilidade)
 * Versão simplificada que infere o código do status
 */
export function buildErrorResponse(message: string, status = 500): Response {
    const codeMap: Record<number, string> = {
        400: 'BAD_REQUEST',
        401: 'UNAUTHORIZED',
        403: 'ACCESS_DENIED',
        404: 'NOT_FOUND',
        405: 'METHOD_NOT_ALLOWED',
        500: 'INTERNAL_ERROR'
    }

    return new Response(
        JSON.stringify({
            success: false,
            error: {
                code: codeMap[status] || 'ERROR',
                message
            }
        }),
        {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status
        }
    )
}

/**
 * Retorna resposta de acesso negado (403)
 */
export function accessDeniedResponse(motivo: string): Response {
    return errorResponse(403, motivo, 'ACCESS_DENIED')
}

/**
 * Retorna resposta de não encontrado (404)
 */
export function notFoundResponse(entidade: string): Response {
    return errorResponse(404, `${entidade} não encontrado(a).`, 'NOT_FOUND')
}

/**
 * Retorna resposta de parâmetros inválidos (400)
 */
export function badRequestResponse(message: string): Response {
    return errorResponse(400, message, 'BAD_REQUEST')
}

// ═══════════════════════════════════════════════════════════════
// LOGGING DE AUDITORIA (OPCIONAL)
// ═══════════════════════════════════════════════════════════════

interface AuditLog {
    solicitante_id: string
    solicitante_role: UserRole
    agent_name: string
    tool_called: string
    academia_id?: string
    target_atleta_id?: string
    parameters?: Record<string, any>
    success: boolean
    error_message?: string
    response_time_ms: number
}

/**
 * Registra uma chamada na tabela de auditoria
 */
export async function logAuditoria(log: AuditLog): Promise<void> {
    try {
        const supabase = getSupabaseClient()

        await supabase.from('audit_agent_calls').insert({
            solicitante_id: log.solicitante_id,
            solicitante_role: log.solicitante_role,
            agent_name: log.agent_name,
            tool_called: log.tool_called,
            academia_id: log.academia_id,
            target_atleta_id: log.target_atleta_id,
            parameters: log.parameters || {},
            success: log.success,
            error_message: log.error_message,
            response_time_ms: log.response_time_ms
        })
    } catch (error) {
        // Não falhar a requisição por erro de auditoria
        console.error('Erro ao registrar auditoria:', error)
    }
}

// ═══════════════════════════════════════════════════════════════
// UTILITÁRIOS
// ═══════════════════════════════════════════════════════════════

/**
 * Valida se uma string é um UUID válido
 */
export function isValidUUID(str: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(str)
}

/**
 * Extrai o auth_user_id do header Authorization (JWT)
 * Útil quando o request vem autenticado pelo Supabase Auth
 */
export function extractUserIdFromAuth(req: Request): string | null {
    const authHeader = req.headers.get('Authorization')

    if (!authHeader?.startsWith('Bearer ')) {
        return null
    }

    try {
        const token = authHeader.replace('Bearer ', '')
        // Decodificar JWT (apenas a parte do payload, sem validar assinatura)
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload.sub || null
    } catch {
        return null
    }
}