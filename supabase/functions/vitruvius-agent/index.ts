import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { create } from "https://deno.land/x/djwt@v2.8/mod.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-portal-token",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    console.log("!!! [COACH-IA] REQUISIÇÃO RECEBIDA !!!");

    try {
        const saJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
        const agentId = Deno.env.get("GOOGLE_CLOUD_AGENT_ID");
        
        if (!saJson || !agentId) {
            throw new Error("Configurações do Google Cloud faltando (JSON ou AgentID)");
        }

        const { atletaId, mensagem } = await req.json();
        
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        // Busca contexto do atleta
        const { data: atleta } = await supabase
            .from("atletas")
            .select("nome")
            .eq("id", atletaId)
            .single();

        const sa = JSON.parse(saJson);
        const projectId = Deno.env.get("GOOGLE_CLOUD_PROJECT_ID") || sa.project_id;
        const location = Deno.env.get("GOOGLE_CLOUD_LOCATION") || "us-central1";

        // Auth Google
        const jwt = await generateGoogleJwt(sa);
        const accessToken = await getGoogleAccessToken(jwt);

        // Dialogflow CX Detect Intent
        const endpoint = `https://${location}-dialogflow.googleapis.com/v3/projects/${projectId}/locations/${location}/agents/${agentId}/sessions/${atletaId}:detectIntent`;

        console.log(`[Coach] Chamando Dialogflow para ${atleta?.nome || 'Atleta'}`);

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                queryInput: {
                    text: { text: mensagem },
                    languageCode: "pt-BR"
                },
                queryParams: {
                    payload: {
                        atleta_id: atletaId,
                        atleta_nome: atleta?.nome
                    }
                }
            }),
        });

        const result = await response.json();
        const answer = result.queryResult?.responseMessages
            ?.filter((m: any) => m.text)
            .map((m: any) => m.text.text[0])
            .join("\n") || "O Vitrúvio está pensando... tente novamente em instantes.";

        return new Response(JSON.stringify({ response: answer }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error: any) {
        console.error("[Coach] ERRO:", error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});

async function generateGoogleJwt(sa: any) {
    const header = { alg: "RS256", typ: "JWT" };
    const now = Math.floor(Date.now() / 1000);
    const payload = {
        iss: sa.client_email,
        sub: sa.client_email,
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 3600,
        scope: "https://www.googleapis.com/auth/cloud-platform",
    };
    const key = await importPrivateKey(sa.private_key);
    return await create(header, payload, key);
}

async function importPrivateKey(pem: string) {
    const pemContents = pem.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s+/g, "");
    const binary = atob(pemContents);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) buffer[i] = binary.charCodeAt(i);
    return await crypto.subtle.importKey("pkcs8", buffer, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
}

async function getGoogleAccessToken(jwt: string) {
    const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt }),
    });
    const d = await res.json();
    return d.access_token;
}
