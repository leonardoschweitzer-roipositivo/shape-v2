import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

    try {
        const url = new URL(req.url);
        let target_atleta_id = url.searchParams.get('atleta_id') || url.searchParams.get('atletaId');
        
        console.log("[get_user_context] ID Bruto recebido via URL:", target_atleta_id);

        if (!target_atleta_id) {
            try {
                const body = await req.json();
                target_atleta_id = body.atleta_id || body.atletaId;
            } catch { /* vazio */ }
        }

        if (target_atleta_id) {
            target_atleta_id = target_atleta_id.replace(/['"]+/g, '').trim();
        }

        // --- VALIDAÇÃO DE UUID PARA EVITAR ERRO DE BANCO ---
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const isValidUUID = target_atleta_id && uuidRegex.test(target_atleta_id);

        if (!target_atleta_id || !isValidUUID) {
            console.warn(`[get_user_context] ID inválido ou ausente: "${target_atleta_id}"`);
            return new Response(JSON.stringify({ 
                success: false, 
                error: "atleta_id inválido ou ausente. O Agente precisa identificar o usuário para prosseguir.",
                debug_received_id: target_atleta_id 
            }), { 
                status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            });
        }

        // --- MUDANÇA CRÍTICA: USAR SERVICE_ROLE_KEY PARA EVITAR RECURSÃO DE RLS ---
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!, 
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // Permissão de Admin do Sistema
        );

        const { data: atleta, error: dbError } = await supabase
            .from('atletas')
            .select('id, nome, status')
            .eq('id', target_atleta_id)
            .maybeSingle();

        if (dbError) throw dbError;

        if (!atleta) {
            return new Response(JSON.stringify({ success: false, error: "Atleta não encontrado" }), { 
                status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            });
        }

        return new Response(JSON.stringify({
            success: true,
            atleta_id: atleta.id,
            nome: atleta.nome,
            status: atleta.status,
            role: 'ATLETA'
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } catch (error: any) {
        console.error('[get_user_context] 🧨 Erro:', error.message);
        return new Response(JSON.stringify({ success: false, error: error.message }), { 
            status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
    }
})