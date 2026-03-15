import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { create } from "https://deno.land/x/djwt@v2.8/mod.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-portal-token",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
    // 1. Handling CORS
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    console.log(`[vitruvius-agent] 📥 Recebendo requisição ${req.method}...`);

    try {
        const GOOGLE_SERVICE_ACCOUNT_JSON = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
        const AGENT_ID = Deno.env.get("GOOGLE_CLOUD_AGENT_ID");
        const PROJECT_ID_ENV = Deno.env.get("GOOGLE_CLOUD_PROJECT_ID");

        if (!GOOGLE_SERVICE_ACCOUNT_JSON || !AGENT_ID) {
            throw new Error("Faltam variáveis de ambiente (SERVICE_ACCOUNT ou AGENT_ID)");
        }

        const body = await req.json();
        const { atletaId, mensagem } = body;

        console.log(`[vitruvius-agent] Atleta: ${atletaId} | Mensagem: ${mensagem}`);

        if (!atletaId || !mensagem) {
            throw new Error("atletaId e mensagem são obrigatórios no body");
        }

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        // Buscar contexto básico
        const { data: atleta, error: athleteError } = await supabase
            .from("atletas")
            .select(`nome`)
            .eq("id", atletaId)
            .single();

        if (athleteError || !atleta) throw new Error("Atleta não encontrado no banco.");

        // Auth Google
        const serviceAccount = JSON.parse(GOOGLE_SERVICE_ACCOUNT_JSON);
        const PROJECT_ID = PROJECT_ID_ENV || serviceAccount.project_id;
        const LOCATION = Deno.env.get("GOOGLE_CLOUD_LOCATION") || "us-central1";

        const jwt = await generateGoogleJwt(serviceAccount);
        const accessToken = await getGoogleAccessToken(jwt);

        // Agente Dialogflow CX
        const endpoint = `https://${LOCATION}-dialogflow.googleapis.com/v3/projects/${PROJECT_ID}/locations/${LOCATION}/agents/${AGENT_ID}/sessions/${atletaId}:detectIntent`;

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
                    // Passamos o ID do atleta no payload para que as ferramentas do agente saibam quem ele é
                    payload: {
                        atleta_id: atletaId,
                        atleta_nome: atleta.nome
                    }
                }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("[vitruvius-agent] Erro Dialogflow API:", errorText);
            throw new Error(`Google API falou: ${response.status}`);
        }

        const result = await response.json();
        const answerText = result.queryResult?.responseMessages
            ?.filter((m: any) => m.text)
            .map((m: any) => m.text.text[0])
            .join("\n") || "Desculpe, tive um problema ao processar sua resposta.";

        console.log("[vitruvius-agent] ✅ Resposta enviada com sucesso!");

        return new Response(JSON.stringify({ response: answerText }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error: any) {
        console.error("[vitruvius-agent] 🛑 ERRO:", error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});

// Auxiliares de Segurança (JWT)
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
