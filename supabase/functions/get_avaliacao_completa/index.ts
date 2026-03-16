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

// ═══════════════════════════════════════════════════════════════
// LÓGICA DE ACESSO (Da sua v1.1.0)
// ═══════════════════════════════════════════════════════════════
async function validarAcessoAtleta(ctx: any, supabase: any) {
    // ATLETA: só pode ver a si mesmo
    if (ctx.role === 'ATLETA') {
        const { data } = await supabase.from('atletas').select('id').eq('auth_user_id', ctx.auth_user_id).maybeSingle()
        if (data && (!ctx.atleta_id || data.id === ctx.atleta_id)) {
            return { permitido: true, atleta_id: data.id }
        }
        return { permitido: false, motivo: 'Você só pode acessar seus próprios dados.' }
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
        const body = await req.json()
        const { auth_user_id, role, atleta_id } = body

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

        // 2. Buscar os dados mais recentes do atleta
        const { data: atleta, error: erroAtleta } = await supabase
            .from('atletas')
            .select(`
        id, altura, peso_atual, sexo,
        medidas (peso, gordura_percentual, ombros, cintura, braco_dir, braco_esq, coxa_dir, coxa_esq)
      `)
            .eq('id', id_busca)
            .order('created_at', { referencedTable: 'medidas', ascending: false })
            .limit(1, { referencedTable: 'medidas' })
            .maybeSingle()

        if (erroAtleta || !atleta) return errorResponse(404, "Atleta não encontrado.")

        const ultimaMedida = atleta.medidas?.[0]
        if (!ultimaMedida) return errorResponse(404, "Não existem medidas registadas.")

        // 3. O CÉREBRO MATEMÁTICO (Phidias)
        const alturaM = atleta.altura / 100
        const peso = ultimaMedida.peso || atleta.peso_atual || 0
        const gordura = ultimaMedida.gordura_percentual || 15

        const massaMagra = peso * (1 - (gordura / 100))
        const ffmi = alturaM > 0 ? (massaMagra / (alturaM * alturaM)) : 0

        const ombros = ultimaMedida.ombros || 0
        const cintura = ultimaMedida.cintura || 0
        const proporcao_ombro_cintura = cintura > 0 ? ombros / cintura : 0

        let v_shape_pct = 0;
        if (proporcao_ombro_cintura > 0) {
            v_shape_pct = proporcao_ombro_cintura >= 1.618 ? 100 : (proporcao_ombro_cintura / 1.618) * 100;
        }

        const diff_bracos = Math.abs((ultimaMedida.braco_dir || 0) - (ultimaMedida.braco_esq || 0))
        const diff_coxas = Math.abs((ultimaMedida.coxa_dir || 0) - (ultimaMedida.coxa_esq || 0))

        let score_simetria = 100 - (diff_bracos * 2.5) - (diff_coxas * 2.0)
        score_simetria = Math.max(0, Math.min(100, score_simetria))

        const score_geral = (v_shape_pct * 0.5) + (score_simetria * 0.3) + (ffmi > 20 ? 20 : 10)

        // 4. Retornar os dados (Sem o wrapper 'data' para respeitar o YAML do Phidias)
        const resultado = {
            composicao_corporal: {
                peso_kg: Number(peso.toFixed(1)),
                gordura_percentual: Number(gordura.toFixed(1)),
                ffmi: Number(ffmi.toFixed(2))
            },
            proporcoes_aureas: {
                ombros_cintura: Number(proporcao_ombro_cintura.toFixed(3)),
                score_proporcoes: Number(v_shape_pct.toFixed(1)),
                v_shape_percentual: Number(v_shape_pct.toFixed(1))
            },
            simetria: {
                bracos_diff_cm: Number(diff_bracos.toFixed(1)),
                coxas_diff_cm: Number(diff_coxas.toFixed(1)),
                score_simetria: Number(score_simetria.toFixed(1))
            },
            score_geral: Number(Math.min(100, score_geral).toFixed(1))
        }

        return new Response(JSON.stringify(resultado), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
        })

    } catch (err) {
        console.error("Erro em get_avaliacao_completa:", err)
        return errorResponse(500, "Erro interno ao calcular a avaliação.")
    }
})