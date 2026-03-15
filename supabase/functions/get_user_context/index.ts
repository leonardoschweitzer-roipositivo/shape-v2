import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

    try {
        console.log("--- [WEBHOOK SCANNER] ---");
        
        // 1. Capturar Headers
        const hs: Record<string, string> = {};
        req.headers.forEach((v, k) => hs[k] = v);
        
        // 2. Capturar Body
        const body = await req.json().catch(() => ({}));
        
        console.log("[Scanner] Body:", JSON.stringify(body));
        console.log("[Scanner] Headers:", JSON.stringify(hs));

        const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!)

        let target_atleta_id: string | undefined;

        // ESTRATÉGIA A: Buscar nos parâmetros do Dialogflow (vários locais possíveis)
        target_atleta_id = 
            body.atleta_id || 
            body.atletaId || 
            body.sessionInfo?.parameters?.atleta_id || 
            body.sessionInfo?.parameters?.atletaId ||
            body.toolCall?.parameters?.atleta_id;

        // ESTRATÉGIA B: Buscar no nome da sessão (No Dialogflow CX, a sessão contém o nosso AtletaID)
        if (!target_atleta_id && body.sessionInfo?.session) {
            // O formato é projects/.../agents/.../sessions/ID_DO_ATLETA
            const sessionParts = body.sessionInfo.session.split('/');
            target_atleta_id = sessionParts[sessionParts.length - 1];
            console.log(`[Scanner] ID extraído da sessão: ${target_atleta_id}`);
        }

        // ESTRATÉGIA C: Se ainda não achou e tem um token do Supabase no Header
        if (!target_atleta_id && hs['authorization']?.includes('ey')) {
            const { data: { user } } = await supabase.auth.getUser(hs['authorization'].split(' ')[1]);
            if (user) {
                const { data: a } = await supabase.from('atletas').select('id').eq('auth_user_id', user.id).maybeSingle();
                target_atleta_id = a?.id;
            }
        }

        if (!target_atleta_id) {
            console.error("[Scanner] 🛑 Nenhuma pista de ID encontrada.");
            return new Response(JSON.stringify({ 
                fulfillmentResponse: { messages: [{ text: { text: ["Identificação ausente."] } }] } 
            }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // Busca o perfil real
        const { data: atleta } = await supabase
            .from('atletas')
            .select('id, nome, auth_user_id, status')
            .eq('id', target_atleta_id)
            .maybeSingle();

        if (!atleta) throw new Error("Atleta não encontrado no banco.");

        console.log(`[Scanner] ✅ Atleta identificado: ${atleta.nome}`);

        // RESPOSTA NO FORMATO DIALOGFLOW CX
        return new Response(JSON.stringify({
            success: true,
            atleta_nome: atleta.nome,
            atleta_id: atleta.id,
            status: atleta.status,
            // Adicional para o Playbook entender como Tool output
            outputParameters: {
                nome: atleta.nome,
                id: atleta.id,
                role: 'ATLETA'
            }
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } catch (error: any) {
        console.error('[Scanner] 🧨 Erro:', error.message);
        return new Response(JSON.stringify({ error: error.message }), { 
            status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
    }
})