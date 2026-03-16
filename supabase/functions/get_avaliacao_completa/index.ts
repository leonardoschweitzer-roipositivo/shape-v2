// supabase/functions/get_avaliacao_completa/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ═══════════════════════════════════════════════════════════════
// CORS & HEADERS (Da sua v1.1.0)
// ═══════════════════════════════════════════════════════════════
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
}

function badRequestResponse(mensagem: string) {
    return new Response(JSON.stringify({ success: false, error: { code: 'BAD_REQUEST', message: mensagem } }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
    })
}

function errorResponse(status: number, mensagem: string) {
    return new Response(JSON.stringify({ success: false, error: { code: 'ERROR', message: mensagem } }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status
    })
}

function successResponse(data: any) {
    return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
    })
}

// ═══════════════════════════════════════════════════════════════
// LÓGICA DE ACESSO (Da sua v1.1.0)
// ═══════════════════════════════════════════════════════════════
async function validarAcessoAtleta(ctx: any, supabase: any) {
    // ATLETA: só pode ver a si mesmo
    if (ctx.role === 'ATLETA') {
        // Se temos auth_user_id, permitimos o acesso. A query final filtrará pelos dados do próprio usuário.
        if (ctx.auth_user_id) {
            return { permitido: true, atleta_id: ctx.atleta_id }
        }

        return { permitido: false, motivo: 'ID de usuário (auth_user_id) não fornecido.' }
    }

    // Buscar o atleta alvo
    const { data: atleta } = await supabase.from('atletas').select('id, personal_id, academia_id').eq('id', ctx.atleta_id).maybeSingle()
    if (!atleta) return { permitido: false, motivo: 'Atleta não encontrado.' }

    // PERSONAL: só pode ver atletas vinculados
    if (ctx.role === 'PERSONAL') {
        const { data: personal } = await supabase.from('personais').select('id').eq('auth_user_id', ctx.auth_user_id).maybeSingle()
        if (personal && atleta.personal_id === personal.id) {
            return { permitido: true, atleta_id: atleta.id }
        }
        return { permitido: false, motivo: 'Este atleta não está vinculado a você.' }
    }

    // ACADEMIA: pode ver todos da unidade
    if (ctx.role === 'ACADEMIA') {
        const { data: academia } = await supabase.from('academias').select('id').eq('auth_user_id', ctx.auth_user_id).maybeSingle()
        if (academia && atleta.academia_id === academia.id) {
            return { permitido: true, atleta_id: atleta.id }
        }
        return { permitido: false, motivo: 'Este atleta não pertence à sua academia.' }
    }

    return { permitido: false, motivo: 'Role inválido.' }
}

// ═══════════════════════════════════════════════════════════════
// FUNÇÃO PRINCIPAL
// ═══════════════════════════════════════════════════════════════
Deno.serve(async (req) => {
    // Lidar com requisições CORS (Preflight)
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const url = new URL(req.url);
        const body = await req.json().catch(() => ({}));
        console.log("[get_avaliacao_completa] Body recebido:", JSON.stringify(body, null, 2));

        // Suporte a chamada direta ou via Dialogflow CX Webhook (O auth_user_id virá do SessionId automático)
        const auth_user_id = 
            body.auth_user_id || 
            body.sessionInfo?.parameters?.auth_user_id;
        
        const role = body.role || body.sessionInfo?.parameters?.role;
        const atleta_id = url.searchParams.get('atleta_id') ||
                           url.searchParams.get('atletaId') ||
                           body.atleta_id ||
                           body.atletaId ||
                           body.sessionInfo?.parameters?.atleta_id;

        if (!auth_user_id || !role) {
            return badRequestResponse("Parâmetros 'auth_user_id' e 'role' são obrigatórios.")
        }

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        )

        // 1. Validação de Segurança baseada na sua v1.1.0
        const ctx = {
            auth_user_id,
            role: role.toUpperCase(), // Garantir que está em maiúsculo (ATLETA, PERSONAL)
            atleta_id: role.toUpperCase() === 'ATLETA' ? null : atleta_id
        }

        const acesso = await validarAcessoAtleta(ctx, supabase)

        if (!acesso.permitido) {
            return errorResponse(403, acesso.motivo || "Acesso negado.")
        }

        const id_busca = acesso.atleta_id || ctx.atleta_id;

        // 2. Buscar os dados mais recentes na nova tabela assessments
        console.info(`[get_avaliacao_completa] 🔍 Buscando avaliação para auth_user_id: ${auth_user_id}`);
        
        const { data: assessment, error: erroAssessment } = await supabase
            .from('assessments')
            .select('id, score, body_fat, measurements, results, created_at')
            .eq('auth_user_id', auth_user_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        if (erroAssessment) return errorResponse(500, `Erro ao buscar avaliação: ${erroAssessment.message}`)
        if (!assessment) return errorResponse(404, "Nenhuma avaliação encontrada na tabela assessments para este usuário.")

        // 3. Formatar resposta para o Phidias (DNA Alinhado)
        return successResponse({
            id: assessment.id,
            score: assessment.score,
            body_fat: assessment.body_fat,
            measurements: assessment.measurements,
            results: assessment.results,
            created_at: assessment.created_at
        })

    } catch (err) {
        console.error("Erro em get_avaliacao_completa:", err)
        return errorResponse(500, "Erro interno ao calcular a avaliação.")
    }
})