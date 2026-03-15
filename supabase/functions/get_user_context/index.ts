import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

    try {
        console.log("--- [GET_USER_CONTEXT] SCANNING... ---");
        const url = new URL(req.url);
        
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_ANON_KEY')!
        );

        let target_atleta_id = url.searchParams.get('atleta_id') || url.searchParams.get('atletaId');

        if (!target_atleta_id) {
            const body = await req.json().catch(() => ({}));
            target_atleta_id = 
                body.atleta_id || 
                body.atletaId || 
                body.sessionInfo?.parameters?.atleta_id || 
                body.sessionInfo?.parameters?.atletaId ||
                body.toolCall?.parameters?.atleta_id;

            if (!target_atleta_id && body.sessionInfo?.session) {
                const sessionParts = body.sessionInfo.session.split('/');
                target_atleta_id = sessionParts[sessionParts.length - 1];
            }
        }

        let auth_user_id: string | undefined;

        // Se achamos um ID (que não seja o JWT do Supabase), buscamos quem é o dono dele
        if (target_atleta_id && target_atleta_id.length > 20) {
            console.log(`[Scanner] ID Encontrado: ${target_atleta_id}`);
            const { data: atleta } = await supabase
                .from('atletas')
                .select('auth_user_id')
                .eq('id', target_atleta_id)
                .maybeSingle();
            auth_user_id = atleta?.auth_user_id;
        }

        // Fallback: Tentativa via Token do Supabase (App Real)
        if (!auth_user_id) {
            const authHeader = req.headers.get('Authorization');
            if (authHeader?.includes('Bearer ey')) {
                const { data: { user } } = await supabase.auth.getUser(authHeader.split(' ')[1]);
                auth_user_id = user?.id;
            }
        }

        if (!auth_user_id) {
            console.error("[Scanner] 🛑 Nenhuma identificação encontrada.");
            return new Response(JSON.stringify({ error: "Identificação ausente" }), { 
                status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            });
        }

        const { data: atleta } = await supabase
            .from('atletas')
            .select('id, nome, status')
            .eq('auth_user_id', auth_user_id)
            .single();

        console.log(`[Scanner] ✅ Atleta: ${atleta?.nome}`);

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
        console.error('[Scanner] 🧨 Erro:', error.message);
        return new Response(JSON.stringify({ error: error.message }), { 
            status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
    }
})