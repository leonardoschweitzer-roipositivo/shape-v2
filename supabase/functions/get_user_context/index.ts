import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-atleta-id',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

    try {
        const url = new URL(req.url);
        const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!);

        // Tenta capturar o ID de todas as formas possíveis
        let target_atleta_id = 
            req.headers.get('x-atleta-id') || 
            url.searchParams.get('atleta_id') || 
            url.searchParams.get('atletaId');

        if (!target_atleta_id) {
            const body = await req.json().catch(() => ({}));
            target_atleta_id = body.atleta_id || body.atletaId;
            
            // Backup: Se estiver dentro do sessionInfo do Dialogflow
            if (!target_atleta_id && body.sessionInfo?.parameters) {
                target_atleta_id = body.sessionInfo.parameters.atleta_id || body.sessionInfo.parameters.atletaId;
            }
        }

        if (!target_atleta_id) {
            console.error("[get_user_context] 🛑 ID não encontrado em Headers ou Body.");
            return new Response(JSON.stringify({
                error: "atleta_id requerido.",
                hint: "Passe via Header 'x-atleta-id' ou no Body JSON."
            }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        console.log(`[get_user_context] 🎯 ID Localizado: ${target_atleta_id}`);

        const { data: atleta } = await supabase
            .from('atletas')
            .select('id, nome, status, auth_user_id')
            .eq('id', target_atleta_id)
            .maybeSingle();

        if (!atleta) throw new Error("Atleta inexistente.");

        return new Response(JSON.stringify({
            success: true,
            atleta_id: atleta.id,
            nome: atleta.nome,
            status: atleta.status,
            role: 'ATLETA'
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } catch (error: any) {
        console.error('[get_user_context] 🧨 Erro:', error.message);
        return new Response(JSON.stringify({ error: error.message }), { 
            status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
    }
})