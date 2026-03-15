/**
 * VITRU IA — Edge Function: get_user_context
 * 
 * Descobre o contexto completo do usuário logado.
 * Esta é a primeira função chamada pelo Vitruvius Prime para
 * identificar quem está falando e qual seu nível de acesso.
 * 
 * SEGURANÇA: O auth_user_id é extraído do JWT, não do body.
 * Isso impede que um cliente mal-intencionado forje sua identidade.
 * 
 * @endpoint POST /get_user_context
 * @header Authorization: Bearer <JWT>
 * @returns {UserContext} Contexto completo do usuário
 * 
 * @version 1.2.0 (inline - sem dependências externas)
 * @author VITRU IA Team
 */

import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ═══════════════════════════════════════════════════════════════
// CORS HEADERS (de auth_helper.ts)
// ═══════════════════════════════════════════════════════════════

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
}

// ═══════════════════════════════════════════════════════════════
// SUPABASE CLIENT (de supabase_client.ts)
// ═══════════════════════════════════════════════════════════════

function getSupabaseClient(req: Request): SupabaseClient {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    const authHeader = req.headers.get('Authorization')

    return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            headers: {
                Authorization: authHeader || ''
            }
        },
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}

// ═══════════════════════════════════════════════════════════════
// HELPERS DE RESPOSTA (de auth_helper.ts)
// ═══════════════════════════════════════════════════════════════

function buildErrorResponse(message: string, status = 500): Response {
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
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status }
    )
}

// ═══════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════

type UserRole = 'ATLETA' | 'PERSONAL' | 'ACADEMIA'

interface UserContextResponse {
    role: UserRole
    auth_user_id: string
    entity_id: string
    nome: string
    email: string
    foto_url?: string
    academia_id: string | null
    academia?: {
        id: string
        nome: string
    }
    personal?: {
        id: string
        nome: string
    }
    extras: Record<string, any>
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function jsonResponse(data: any, status = 200): Response {
    return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status }
    )
}

// ═══════════════════════════════════════════════════════════════
// FUNÇÃO PRINCIPAL
// ═══════════════════════════════════════════════════════════════

Deno.serve(async (req) => {
    // Lida com CORS (preflight)
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    // Apenas POST
    if (req.method !== 'POST') {
        return buildErrorResponse('Método não permitido. Use POST.', 405)
    }

    try {
        // 1. Conecta ao Supabase usando o Helper e o Token da requisição
        const supabase = getSupabaseClient(req)

        // 2. SEGURANÇA: Pega o ID de quem realmente está logado via Token JWT
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return buildErrorResponse('Usuário não autenticado ou token inválido.', 401)
        }

        const auth_user_id = user.id

        // ─────────────────────────────────────────
        // TENTAR ENCONTRAR COMO ACADEMIA (DONO)
        // ─────────────────────────────────────────
        const { data: academia } = await supabase
            .from('academias')
            .select(`
        id,
        nome,
        email,
        telefone,
        logo_url,
        plano,
        limite_personais,
        limite_atletas,
        status,
        created_at
      `)
            .eq('auth_user_id', auth_user_id)
            .maybeSingle()

        if (academia) {
            // Buscar estatísticas da academia
            const { data: kpis } = await supabase
                .from('v_kpis_academia')
                .select('*')
                .eq('academia_id', academia.id)
                .maybeSingle()

            const response: UserContextResponse = {
                role: 'ACADEMIA',
                auth_user_id,
                entity_id: academia.id,
                nome: academia.nome,
                email: academia.email,
                foto_url: academia.logo_url,
                academia_id: academia.id,
                academia: {
                    id: academia.id,
                    nome: academia.nome
                },
                extras: {
                    plano: academia.plano,
                    limite_personais: academia.limite_personais,
                    limite_atletas: academia.limite_atletas,
                    status: academia.status,
                    total_personais: kpis?.total_personais || 0,
                    personais_ativos: kpis?.personais_ativos || 0,
                    total_atletas: kpis?.total_atletas || 0,
                    atletas_ativos: kpis?.atletas_ativos || 0,
                    score_medio: kpis?.score_medio || null,
                    avaliacoes_mes: kpis?.avaliacoes_mes || 0
                }
            }

            console.log(`[get_user_context] ACADEMIA: ${academia.nome} (${academia.id})`)
            return jsonResponse(response)
        }

        // ─────────────────────────────────────────
        // TENTAR ENCONTRAR COMO PERSONAL
        // ─────────────────────────────────────────
        const { data: personal } = await supabase
            .from('personais')
            .select(`
        id,
        nome,
        email,
        telefone,
        foto_url,
        cref,
        plano,
        limite_atletas,
        status,
        academia_id,
        created_at
      `)
            .eq('auth_user_id', auth_user_id)
            .maybeSingle()

        if (personal) {
            // Buscar nome da academia vinculada
            let academiaInfo = null
            if (personal.academia_id) {
                const { data: acad } = await supabase
                    .from('academias')
                    .select('id, nome')
                    .eq('id', personal.academia_id)
                    .maybeSingle()
                academiaInfo = acad
            }

            // Buscar KPIs do personal
            const { data: kpis } = await supabase
                .from('v_kpis_personal')
                .select('*')
                .eq('personal_id', personal.id)
                .maybeSingle()

            const response: UserContextResponse = {
                role: 'PERSONAL',
                auth_user_id,
                entity_id: personal.id,
                nome: personal.nome,
                email: personal.email,
                foto_url: personal.foto_url,
                academia_id: personal.academia_id,
                academia: academiaInfo || undefined,
                extras: {
                    cref: personal.cref,
                    plano: personal.plano,
                    limite_atletas: personal.limite_atletas,
                    status: personal.status,
                    total_atletas: kpis?.total_atletas || 0,
                    atletas_ativos: kpis?.atletas_ativos || 0,
                    atletas_inativos: kpis?.atletas_inativos || 0,
                    score_medio: kpis?.score_medio || null,
                    avaliacoes_mes: kpis?.avaliacoes_mes || 0,
                    // Distribuição por classificação
                    atletas_elite: kpis?.atletas_elite || 0,
                    atletas_meta: kpis?.atletas_meta || 0,
                    atletas_quase_la: kpis?.atletas_quase_la || 0,
                    atletas_caminho: kpis?.atletas_caminho || 0,
                    atletas_inicio: kpis?.atletas_inicio || 0
                }
            }

            console.log(`[get_user_context] PERSONAL: ${personal.nome} (${personal.id})`)
            return jsonResponse(response)
        }

        // ─────────────────────────────────────────
        // TENTAR ENCONTRAR COMO ATLETA
        // ─────────────────────────────────────────
        const { data: atleta } = await supabase
            .from('atletas')
            .select(`
        id,
        nome,
        email,
        telefone,
        foto_url,
        status,
        personal_id,
        academia_id,
        portal_ultimo_acesso,
        portal_acessos,
        created_at
      `)
            .eq('auth_user_id', auth_user_id)
            .maybeSingle()

        if (atleta) {
            // Buscar dados do personal vinculado
            let personalInfo = null
            if (atleta.personal_id) {
                const { data: pers } = await supabase
                    .from('personais')
                    .select('id, nome, foto_url')
                    .eq('id', atleta.personal_id)
                    .maybeSingle()
                personalInfo = pers
            }

            // Buscar nome da academia
            let academiaInfo = null
            if (atleta.academia_id) {
                const { data: acad } = await supabase
                    .from('academias')
                    .select('id, nome')
                    .eq('id', atleta.academia_id)
                    .maybeSingle()
                academiaInfo = acad
            }

            // Verificar se tem treino ativo
            const { data: treino } = await supabase
                .from('planos_treino')
                .select('id')
                .eq('atleta_id', atleta.id)
                .eq('status', 'ativo')
                .maybeSingle()

            // Verificar se tem dieta ativa
            const { data: dieta } = await supabase
                .from('planos_dieta')
                .select('id')
                .eq('atleta_id', atleta.id)
                .eq('status', 'ativo')
                .maybeSingle()

            // Buscar última avaliação
            const { data: ultimaAvaliacao } = await supabase
                .from('avaliacoes')
                .select('data, score_geral, classificacao_geral')
                .eq('atleta_id', atleta.id)
                .order('data', { ascending: false })
                .limit(1)
                .maybeSingle()

            // Calcular dias desde última avaliação
            let diasDesdeAvaliacao = null
            if (ultimaAvaliacao?.data) {
                const dataAvaliacao = new Date(ultimaAvaliacao.data)
                const hoje = new Date()
                diasDesdeAvaliacao = Math.floor(
                    (hoje.getTime() - dataAvaliacao.getTime()) / (1000 * 60 * 60 * 24)
                )
            }

            // Buscar streak de treinos (últimos 7 dias com registro)
            const seteDiasAtras = new Date()
            seteDiasAtras.setDate(seteDiasAtras.getDate() - 7)

            const { data: registrosSemana } = await supabase
                .from('registros_diarios')
                .select('data')
                .eq('atleta_id', atleta.id)
                .eq('tipo', 'treino')
                .gte('data', seteDiasAtras.toISOString().split('T')[0])

            const response: UserContextResponse = {
                role: 'ATLETA',
                auth_user_id,
                entity_id: atleta.id,
                nome: atleta.nome,
                email: atleta.email || '',
                foto_url: atleta.foto_url,
                academia_id: atleta.academia_id,
                academia: academiaInfo || undefined,
                personal: personalInfo || undefined,
                extras: {
                    status: atleta.status,
                    tem_treino_ativo: !!treino,
                    tem_dieta_ativa: !!dieta,
                    ultima_avaliacao: ultimaAvaliacao ? {
                        data: ultimaAvaliacao.data,
                        score: ultimaAvaliacao.score_geral,
                        classificacao: ultimaAvaliacao.classificacao_geral
                    } : null,
                    dias_desde_avaliacao: diasDesdeAvaliacao,
                    treinos_semana: registrosSemana?.length || 0,
                    portal_acessos: atleta.portal_acessos || 0,
                    portal_ultimo_acesso: atleta.portal_ultimo_acesso
                }
            }

            console.log(`[get_user_context] ATLETA: ${atleta.nome} (${atleta.id})`)
            return jsonResponse(response)
        }

        // ─────────────────────────────────────────
        // USUÁRIO NÃO ENCONTRADO
        // ─────────────────────────────────────────
        console.log(`[get_user_context] Usuário não encontrado em nenhuma entidade para o token recebido.`)
        return buildErrorResponse('Usuário não encontrado no sistema.', 404)

    } catch (error: any) {
        console.error('[get_user_context] Erro interno:', error)
        return buildErrorResponse(`Erro interno ao buscar contexto do usuário: ${error.message}`, 500)
    }
})