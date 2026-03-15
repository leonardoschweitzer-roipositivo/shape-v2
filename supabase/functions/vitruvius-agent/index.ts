import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { create } from "https://deno.land/x/djwt@v2.8/mod.ts";

/**
 * Edge Function: vitruvius-agent
 * 
 * Bridge segura entre o app e o Google Cloud Agent (Vertex AI).
 */

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-portal-token",
};

interface AgentRequest {
    atletaId: string;
    mensagem: string;
    historico?: Array<{ role: 'user' | 'model'; content: string }>;
}

Deno.serve(async (req) => {
    // CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const GOOGLE_SERVICE_ACCOUNT_JSON = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
        
        if (!GOOGLE_SERVICE_ACCOUNT_JSON) {
            throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON não configurada nas Secrets do Supabase.");
        }

        const serviceAccount = JSON.parse(GOOGLE_SERVICE_ACCOUNT_JSON);
        
        const PROJECT_ID = Deno.env.get("GOOGLE_CLOUD_PROJECT_ID") || serviceAccount.project_id;
        const LOCATION = Deno.env.get("GOOGLE_CLOUD_LOCATION") || "global";
        const AGENT_ID = Deno.env.get("GOOGLE_CLOUD_AGENT_ID");

        if (!PROJECT_ID || !AGENT_ID) {
            throw new Error("Configurações faltantes: PROJECT_ID ou AGENT_ID não mapeados (verifique as Secrets).");
        }

        const { atletaId, mensagem } = await req.json() as AgentRequest;

        if (!atletaId || !mensagem) {
            throw new Error("atletaId e mensagem são obrigatórios.");
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // 1. Buscar contexto rico do atleta
        const { data: atleta, error: athleteError } = await supabase
            .from("atletas")
            .select(`
                nome,
                personal:personais(nome),
                ficha:fichas(sexo, idade, altura, peso, objetivo, gordura_percentual),
                diagnostico:diagnosticos(dados),
                plano_treino:planos_treino(dados),
                plano_dieta:planos_dieta(dados)
            `)
            .eq("id", atletaId)
            .single();

        if (athleteError || !atleta) {
            console.error("Erro ao buscar contexto do atleta:", athleteError);
            throw new Error("Não foi possível carregar os dados do atleta.");
        }

        // 2. Autenticação com Google Cloud via JWT
        const jwt = await generateGoogleJwt(serviceAccount);
        const accessToken = await getGoogleAccessToken(jwt);

        // 3. Chamar Google Cloud Agent API
        const endpoint = `https://${LOCATION}-discoveryengine.googleapis.com/v1alpha/projects/${PROJECT_ID}/locations/${LOCATION}/collections/default_collection/engines/${AGENT_ID}/servingConfigs/default_serving_config:answer`;

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: { text: mensagem },
                session: `projects/${PROJECT_ID}/locations/${LOCATION}/collections/default_collection/engines/${AGENT_ID}/sessions/${atletaId}`,
                userLabels: {
                    atleta_nome: atleta.nome?.substring(0, 63),
                    objetivo: (atleta.ficha?.objetivo || "geral").substring(0, 63)
                },
                queryParameters: {
                    payload: {
                        atleta_contexto: {
                            nome: atleta.nome,
                            personal: atleta.personal?.nome,
                            ficha: atleta.ficha,
                            tem_plano: !!(atleta.diagnostico || atleta.plano_treino || atleta.plano_dieta)
                        }
                    }
                }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Erro Google Cloud Agent:", errorText);
            throw new Error(`Erro na comunicação com o Coach IA (${response.status})`);
        }

        const result = await response.json();
        const answer = result.answer?.answerText || "Desculpe, tive um problema ao processar sua solicitação.";

        return new Response(JSON.stringify({ response: answer }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error: any) {
        console.error("Error in vitruvius-agent:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});

async function generateGoogleJwt(serviceAccount: any) {
    const header = { alg: "RS256", typ: "JWT" };
    const now = Math.floor(Date.now() / 1000);
    const payload = {
        iss: serviceAccount.client_email,
        sub: serviceAccount.client_email,
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 3600,
        scope: "https://www.googleapis.com/auth/cloud-platform",
    };

    const key = await importPrivateKey(serviceAccount.private_key);
    return await create(header, payload, key);
}

async function importPrivateKey(pem: string) {
    const pemContents = pem
        .replace("-----BEGIN PRIVATE KEY-----", "")
        .replace("-----END PRIVATE KEY-----", "")
        .replace(/\s+/g, "");
    const binary = atob(pemContents);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        buffer[i] = binary.charCodeAt(i);
    }
    return await crypto.subtle.importKey(
        "pkcs8",
        buffer,
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["sign"]
    );
}

async function getGoogleAccessToken(jwt: string) {
    const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion: jwt,
        }),
    });

    const data = await response.json();
    return data.access_token;
}
