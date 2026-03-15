import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

    try {
        console.log("--- [DEBUG] NOVA CHAMADA TOOL ---");
        
        // Logar todos os headers para encontrar pistas do Google
        const headers: Record<string, string> = {};
        req.headers.forEach((v, k) => headers[k] = v);
        console.log("[get_user_context] 🔑 Headers:", JSON.stringify(headers));

        const body = await req.json().catch(() => ({}));
        console.log("[get_user_context] 📥 Body:", JSON.stringify(body));

        const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
            global: { headers: { Authorization: req.headers.get('Authorization') || '' } }
        })

        let auth_user_id: string | undefined;

        // 1. Tenta via JWT
        const { data: { user } } = await supabase.auth.getUser()
        auth_user_id = user?.id

        // 2. Tenta caçar o ID no body (várias nomenclaturas)
        if (!auth_user_id) {
            auth_user_id = 
                body.atleta_id || 
                body.atletaId || 
                body.sessionInfo?.parameters?.atleta_id ||
                body.sessionInfo?.parameters?.atletaId ||
                body.toolCall?.parameters?.atleta_id ||
                // No Dialogflow CX Playbooks, o ID da sessão muitas vezes está no sessionInfo.session
                body.sessionInfo?.session?.split('/').pop(); 
            
            // Se acharmos um ID (que não seja o JWT), precisamos converter para auth_user_id
            if (auth_user_id && auth_user_id.length > 20) { // Checagem básica se é um ID
                console.log(`[get_user_context] 🎯 ID Detectado: ${auth_user_id}. Buscando auth_user_id...`);
                const { data: atleta } = await supabase
                    .from('atletas')
                    .select('auth_user_id')
                    .eq('id', auth_user_id)
                    .maybeSingle();
                auth_user_id = atleta?.auth_user_id;
            }
        }

        if (!auth_user_id) {
            console.error("[get_user_context] 🛑 Identificação ausente.");
            return new Response(JSON.stringify({ success: false, error: "Identificação ausente" }), {
                status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const { data: atleta } = await supabase
            .from('atletas')
            .select('id, nome, status')
            .eq('auth_user_id', auth_user_id)
            .single();

        console.log(`[get_user_context] ✅ Sucesso: ${atleta?.nome}`);

        return new Response(JSON.stringify({
            success: true,
            data: {
                role: 'ATLETA',
                nome: atleta?.nome,
                entity_id: atleta?.id,
                extras: { status: atleta?.status }
            }
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } catch (error: any) {
        console.error('[get_user_context] 🧨 Erro:', error.message);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
})