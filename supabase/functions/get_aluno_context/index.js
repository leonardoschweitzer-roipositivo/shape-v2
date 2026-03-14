import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // O Vitruvius vai enviar o nome do aluno via JSON
        const { nome_aluno } = await req.json()

        // 1. Busca o Atleta
        const { data: atleta, error: e1 } = await supabase
            .from('atletas')
            .select('id, nome, objetivo')
            .ilike('nome', `%${nome_aluno}%`)
            .limit(1)
            .single()

        if (!atleta) return new Response(JSON.stringify({ error: 'Atleta não encontrado' }), { status: 404, headers: corsHeaders })

        // 2. Busca Medidas, Diagnóstico e Planos (buscando o mais recente de cada)
        const [medidas, diagnostico, treino, dieta] = await Promise.all([
            supabase.from('medidas').select('*').eq('atleta_id', atleta.id).order('created_at', { ascending: false }).limit(1).single(),
            supabase.from('diagnosticos').select('*').eq('atleta_id', atleta.id).order('created_at', { ascending: false }).limit(1).single(),
            supabase.from('planos_treino').select('*').eq('atleta_id', atleta.id).order('created_at', { ascending: false }).limit(1).single(),
            supabase.from('planos_dieta').select('*').eq('atleta_id', atleta.id).order('created_at', { ascending: false }).limit(1).single()
        ])

        return new Response(JSON.stringify({
            atleta,
            medidas: medidas.data,
            diagnostico: diagnostico.data,
            plano_treino: treino.data,
            plano_dieta: dieta.data
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})