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

        const rawBody = await req.text();
        console.log(`[get_user_context] 📝 Body Recebido: ${rawBody || 'vazio'}`);

        if (!target_atleta_id && rawBody) {
            try {
                const body = JSON.parse(rawBody);
                target_atleta_id = body.atleta_id || body.atletaId;
            } catch { /* não é JSON */ }
        }

        // Limpeza de possíveis aspas extras vindo do LLM
        if (target_atleta_id) {
            target_atleta_id = target_atleta_id.replace(/['"]+/g, '').trim();
        }

        console.log(`[get_user_context] 🎯 ID Final para busca: "${target_atleta_id}"`);

        if (!target_atleta_id) {
            return new Response(JSON.stringify({ error: "atleta_id ausente" }), { 
                status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            });
        }

        const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!);
        
        // Buscamos o atleta. Nota: usamos o ID UUID da tabela atletas.
        const { data: atleta, error: dbError } = await supabase
            .from('atletas')
            .select('id, nome, status')
            .eq('id', target_atleta_id)
            .maybeSingle();

        if (dbError) {
            console.error(`[get_user_context] ❌ Erro no Banco: ${dbError.message}`);
            throw dbError;
        }

        if (!atleta) {
            console.warn(`[get_user_context] ⚠️ Atleta com ID ${target_atleta_id} não existe no banco.`);
            return new Response(JSON.stringify({ 
                success: false, 
                error: `Atleta não localizado. Verifique se o ID ${target_atleta_id} é um UUID válido da tabela atletas.` 
            }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        console.log(`[get_user_context] ✅ Sucesso! Retornando contexto de ${atleta.nome}`);

        return new Response(JSON.stringify({
            success: true,
            atleta_id: atleta.id,
            nome: atleta.nome,
            status: atleta.status,
            role: 'ATLETA'
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } catch (error: any) {
        console.error('[get_user_context] 🧨 Erro fatal:', error.message);
        return new Response(JSON.stringify({ success: false, error: error.message }), { 
            status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
    }
})