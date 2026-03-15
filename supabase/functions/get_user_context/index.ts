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

        // Se não achou na URL, tenta ler do corpo JSON (sugestão do Claude)
        if (!target_atleta_id) {
            try {
                const body = await req.json();
                target_atleta_id = body.atleta_id || body.atletaId;
            } catch {
                // Corpo não é JSON ou está vazio
            }
        }

        if (!target_atleta_id) {
            return new Response(JSON.stringify({ 
                error: "atleta_id não encontrado.",
                hint: "Envie via Query Parameter (?atleta_id=...) ou JSON Body ({ 'atleta_id': '...' })."
            }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!);
        const { data: atleta } = await supabase.from('atletas').select('id, nome, status').eq('id', target_atleta_id).maybeSingle();

        if (!atleta) throw new Error("Atleta não encontrado.");

        return new Response(JSON.stringify({
            success: true,
            atleta_id: atleta.id,
            nome: atleta.nome,
            status: atleta.status,
            role: 'ATLETA'
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { 
            status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
    }
})