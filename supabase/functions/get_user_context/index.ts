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

        // Tenta ler do corpo JSON se não estiver na URL
        if (!target_atleta_id) {
            try {
                const body = await req.json();
                target_atleta_id = body.atleta_id || body.atletaId;
            } catch { /* vazio */ }
        }

        if (!target_atleta_id) {
            return new Response(JSON.stringify({ error: "atleta_id ausente" }), { 
                status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            });
        }

        const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!);
        const { data: atleta } = await supabase.from('atletas').select('id, nome, status').eq('id', target_atleta_id).maybeSingle();

        if (!atleta) {
            return new Response(JSON.stringify({ success: false, error: "Não encontrado" }), { 
                status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            });
        }

        // Retorno limpo e direto conforme o Schema acima
        return new Response(JSON.stringify({
            success: true,
            atleta_id: atleta.id,
            nome: atleta.nome,
            status: atleta.status,
            role: 'ATLETA'
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } catch (error: any) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { 
            status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
    }
})