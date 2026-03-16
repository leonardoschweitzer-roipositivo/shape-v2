import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { create } from "https://deno.land/x/djwt@v2.8/mod.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-portal-token',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

Deno.serve(async (req) => {
    // 1. Tratamento de preflight CORS (Início imediato)
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        console.log("!!! [COACH-IA] NOVA REQUISIÇÃO !!!");

        // 2. Extração segura do body
        let body;
        try {
            body = await req.json();
            console.log(`[Coach] Payload bruto:`, JSON.stringify(body, null, 2));
        } catch (e) {
            console.error("[Coach] Erro ao parsear JSON:", e.message);
            return new Response(JSON.stringify({ error: "JSON inválido" }), { 
                status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } 
            });
        }

        const { atletaId, mensagem, auth_user_id, role, sessionId } = body;

        // O sessionId agora PRECISA ser o UUID do usuário para o Dialogflow CX injetar corretamente
        const finalAuthId = auth_user_id || sessionId;

        console.info(`[Coach] 🔍 Auditoria de IDs: AtletaId: ${atletaId}, AuthId: ${finalAuthId}, SessionId: ${sessionId}, Role: ${role}`);

        if (!mensagem || !atletaId) {
            return new Response(JSON.stringify({ error: "atletaId e mensagem são obrigatórios" }), { 
                status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } 
            });
        }

        // --- BUSCA DE DADOS DO ATLETA ---
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        const { data: atleta, error: dbError } = await supabase
            .from("atletas")
            .select("nome")
            .eq("id", atletaId)
            .maybeSingle();

        if (dbError) console.warn("[Coach] Erro ao buscar nome do atleta:", dbError.message);

        const saJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
        const agentId = Deno.env.get("GOOGLE_CLOUD_AGENT_ID");
        
        if (!saJson || !agentId) {
            throw new Error("Configurações do Google Cloud faltando");
        }

        const sa = JSON.parse(saJson);
        const projectId = sa.project_id;
        const location = Deno.env.get("GOOGLE_CLOUD_LOCATION") || "us-central1";

        console.log("[Coach] Gerando token Google...");
        const jwt = await generateGoogleJwt(sa);
        const accessToken = await getGoogleAccessToken(jwt);

        // ESSENCIAL: O finalSessionId DEVE ser o UUID real para o webhook receber o auth_user_id correto
        const finalSessionId = sessionId || finalAuthId; 
        const endpoint = `https://${location}-dialogflow.googleapis.com/v3/projects/${projectId}/locations/${location}/agents/${agentId}/sessions/${finalSessionId}:detectIntent`;

        console.log(`[Coach] Enviando para Dialogflow: ${endpoint}`);

        const mensagemComContexto = `[SISTEMA: AtletaID=${atletaId}] ${mensagem}`;

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                "x-atleta-id": atletaId
            },
            body: JSON.stringify({
                queryInput: {
                    text: { text: mensagemComContexto },
                    languageCode: "pt-BR"
                },
                queryParams: {
                    parameters: {
                        atleta_id: atletaId,
                        nome_atleta: atleta?.nome || "Atleta",
                        auth_user_id: finalAuthId || null,
                        role: role || 'ATLETA'
                    }
                }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("[Coach] Erro na resposta do Dialogflow:", errorText);
            throw new Error(`Dialogflow error: ${response.status}`);
        }

        const result = await response.json();
        const answer = result.queryResult?.responseMessages
            ?.filter((m: any) => m.text)
            .map((m: any) => m.text.text[0])
            .join("\n") || "Sem resposta do assistente.";

        return new Response(JSON.stringify({ response: answer }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error: any) {
        console.error("[Coach] 🧨 CRASH CRÍTICO:", error?.stack || error?.message || error);
        return new Response(JSON.stringify({ 
            response: "Erro interno no servidor (500). Por favor, tente novamente.",
            debug: error.message
        }), { 
            status: 500, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
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
