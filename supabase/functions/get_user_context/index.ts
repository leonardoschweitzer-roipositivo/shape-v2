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
        const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!);

        // Captura o ID da URL ou do Body
        let target_atleta_id = url.searchParams.get('atleta_id') || url.searchParams.get('atletaId');

        if (!target_atleta_id) {
            const body = await req.json().catch(() => ({}));
            target_atleta_id = body.atleta_id || body.atletaId;
        }

        if (!target_atleta_id) {
            // Se não achou, responde para a IA o que ela deve fazer
            return new Response(JSON.stringify({
                error: "Falta o parâmetro 'atleta_id'. Por favor, use o AtletaID fornecido no seu contexto de sistema para chamar esta ferramenta.",
                hint: "Sempre inclua 'atleta_id' no corpo da requisição JSON."
            }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const { data: atleta } = await supabase
            .from('atletas')
            .select('id, nome, auth_user_id, status')
            .eq('id', target_atleta_id)
            .maybeSingle();

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