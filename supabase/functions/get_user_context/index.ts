import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
}

function buildErrorResponse(message: string, status = 500): Response {
    return new Response(JSON.stringify({ success: false, error: { message } }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status
    })
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
        const authHeader = req.headers.get('Authorization')
        
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: authHeader || '' } }
        })

        let auth_user_id: string | undefined;

        // 1. Tenta via JWT (App Real)
        const { data: { user } } = await supabase.auth.getUser()
        auth_user_id = user?.id

        // 2. Tenta via Parâmetros do Google (Tool Call)
        if (!auth_user_id) {
            const body = await req.json().catch(() => ({}));
            console.log("[get_user_context] 📥 Body Recebido:", JSON.stringify(body));

            // No Dialogflow CX, os parâmetros vêm no topo ou dentro de sessionInfo.parameters
            const possibleId = 
                body.atleta_id || 
                body.atletaId || 
                body.sessionInfo?.parameters?.atleta_id ||
                body.sessionInfo?.parameters?.atletaId ||
                body.queryParams?.parameters?.atleta_id;

            if (possibleId) {
                console.log(`[get_user_context] ✅ ID Detectado: ${possibleId}`);
                const { data: targetAtleta } = await supabase
                    .from('atletas')
                    .select('auth_user_id')
                    .eq('id', possibleId)
                    .maybeSingle();
                auth_user_id = targetAtleta?.auth_user_id;
            }
        }

        if (!auth_user_id) {
            console.error("[get_user_context] 🛑 Não foi possível identificar o atleta.");
            return buildErrorResponse('Identificação ausente.', 401)
        }

        // 3. Busca Contexto
        const { data: atleta } = await supabase
            .from('atletas')
            .select('id, nome, personal_id, status')
            .eq('auth_user_id', auth_user_id)
            .single();

        if (!atleta) return buildErrorResponse('Perfil não encontrado.', 404);

        console.log(`[get_user_context] 🔓 Acesso concedido para: ${atleta.nome}`);

        return new Response(JSON.stringify({
            success: true,
            data: {
                role: 'ATLETA',
                auth_user_id,
                entity_id: atleta.id,
                nome: atleta.nome,
                extras: { status: atleta.status }
            }
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } catch (error: any) {
        console.error('[get_user_context] 🧨 Erro Fatal:', error.message);
        return buildErrorResponse(error.message, 500);
    }
})