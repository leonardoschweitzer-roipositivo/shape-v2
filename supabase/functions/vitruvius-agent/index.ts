import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { create } from "https://deno.land/x/djwt@v2.8/mod.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-portal-token",
};

Deno.serve(async (req) => {
    console.log("--- NOVA REQUISIÇÃO RECEBIDA ---");
    console.log("Método:", req.method);

    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const GOOGLE_SERVICE_ACCOUNT_JSON = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
        const AGENT_ID = Deno.env.get("GOOGLE_CLOUD_AGENT_ID");
        const PROJECT_ID_ENV = Deno.env.get("GOOGLE_CLOUD_PROJECT_ID");

        console.log("Variáveis presentes:", {
            hasJson: !!GOOGLE_SERVICE_ACCOUNT_JSON,
            hasAgentId: !!AGENT_ID,
            projectIdEnv: PROJECT_ID_ENV
        });

        if (!GOOGLE_SERVICE_ACCOUNT_JSON || !AGENT_ID) {
            throw new Error(`Configurações faltando: JSON(${!!GOOGLE_SERVICE_ACCOUNT_JSON}) AGENT_ID(${!!AGENT_ID})`);
        }

        const body = await req.json();
        console.log("Body recebido:", JSON.stringify(body));

        const { atletaId, mensagem } = body;

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        console.log("Buscando contexto do atleta:", atletaId);
        const { data: atleta, error: athleteError } = await supabase
            .from("atletas")
            .select(`nome`)
            .eq("id", atletaId)
            .single();

        if (athleteError) {
            console.error("Erro no banco:", athleteError);
            throw new Error("Erro ao buscar atleta no banco");
        }

        console.log("Atleta encontrado:", atleta.nome);

        // 2. Autenticação (Vou simplificar para testar se chega aqui)
        const serviceAccount = JSON.parse(GOOGLE_SERVICE_ACCOUNT_JSON);
        const PROJECT_ID = PROJECT_ID_ENV || serviceAccount.project_id;

        console.log("Iniciando Auth Google Cloud...");
        const jwt = await generateGoogleJwt(serviceAccount);
        const accessToken = await getGoogleAccessToken(jwt);
        console.log("AccessToken obtido com sucesso!");

        // 3. Chamada final (Dialogflow CX)
        const LOCATION = Deno.env.get("GOOGLE_CLOUD_LOCATION") || "us-central1";
        const endpoint = `https://${LOCATION}-dialogflow.googleapis.com/v3/projects/${PROJECT_ID}/locations/${LOCATION}/agents/${AGENT_ID}/sessions/${atletaId}:detectIntent`;

        console.log("Chamando endpoint Dialogflow CX:", endpoint);

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
            console.error("Erro Dialogflow CX:", errorText);
            throw new Error(`Erro na comunicação com o Coach IA (${response.status})`);
        }

        const result = await response.json();
        console.log("Resposta do Dialogflow recebida!");

        // Dialogflow CX retorna uma lista de mensagens
        const messages = result.queryResult?.responseMessages || [];
        const answerText = messages
            .filter((m: any) => m.text)
            .map((m: any) => m.text.text[0])
            .join("\n") || "Desculpe, não consegui processar uma resposta agora.";

        return new Response(JSON.stringify({ response: answerText }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error: any) {
        console.error("ERRO FATAL NA FUNÇÃO:", error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});

// Funções de JWT mantidas iguais (sem alterações)
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
