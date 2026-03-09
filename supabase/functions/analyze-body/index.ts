/**
 * Edge Function: analyze-body
 * 
 * Processa 4 imagens corporais via Gemini Vision e insere
 * medidas estimadas na tabela `medidas` com registrado_por = 'IA_VISION'.
 * 
 * Input: 4 imagens base64 + altura + peso + sexo + referência
 * Output: medida_id + measurements + confidence
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ===== TYPES =====

interface AnalyzeBodyRequest {
    frontalImageBase64: string;
    costasImageBase64: string;
    lateralEsqImageBase64: string;
    lateralDirImageBase64: string;
    referenceObject: "credit_card" | "a4_paper" | "tape_measure";
    heightCm: number;
    weightKg: number;
    sexo: "M" | "F";
    atletaId: string;
}

interface GeminiMeasurement {
    value: number;
    confidence: "high" | "medium" | "low";
}

interface GeminiResponse {
    scaleDetected: boolean;
    measurements: {
        ombros: GeminiMeasurement;
        peitoral: GeminiMeasurement;
        cintura: GeminiMeasurement;
        quadril: GeminiMeasurement;
        abdomen: GeminiMeasurement;
        pescoco: GeminiMeasurement;
        braco_esquerdo: GeminiMeasurement;
        braco_direito: GeminiMeasurement;
        antebraco_esquerdo: GeminiMeasurement;
        antebraco_direito: GeminiMeasurement;
        coxa_esquerda: GeminiMeasurement;
        coxa_direita: GeminiMeasurement;
        panturrilha_esquerda: GeminiMeasurement;
        panturrilha_direita: GeminiMeasurement;
    };
    gordura_corporal: GeminiMeasurement;
    imageQuality: {
        frontal: { score: number; issues: string[] };
        costas: { score: number; issues: string[] };
        lateralEsq: { score: number; issues: string[] };
        lateralDir: { score: number; issues: string[] };
    };
    notes: string[];
}

// ===== CONSTANTS =====

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type, x-portal-token",
};

const SYSTEM_PROMPT = `Você é um especialista em avaliação física e análise de composição corporal.
Sua tarefa é estimar medidas corporais (circunferências em cm) a partir de 4 fotografias.

## IMAGENS RECEBIDAS (na ordem)
1. FRONTAL - pessoa de frente
2. COSTAS - pessoa de costas
3. LATERAL ESQUERDA - lado esquerdo
4. LATERAL DIREITA - lado direito

## OBJETOS DE REFERÊNCIA
- Cartão de crédito: 85.6mm × 53.98mm
- Folha A4: 210mm × 297mm
- Fita métrica: usar marcações visíveis

## PROTOCOLO DE ANÁLISE

### Passo 1: Calibração de Escala
1. Identifique o objeto de referência
2. Calcule a razão pixels/cm
3. Se objeto não visível, use altura informada como referência

### Passo 2: Estimativa de Circunferências

Da FRONTAL + COSTAS:
- ombros: circunferência total dos ombros
- peitoral: circunferência na linha mamilar
- cintura: menor circunferência abdominal
- quadril: maior circunferência pélvica
- abdomen: circunferência na altura do umbigo
- pescoco: circunferência do pescoço

Da LATERAL ESQUERDA:
- braco_esquerdo: circunferência no ponto médio do braço
- antebraco_esquerdo: maior circunferência do antebraço
- coxa_esquerda: maior circunferência da coxa
- panturrilha_esquerda: maior circunferência da panturrilha

Da LATERAL DIREITA:
- braco_direito: circunferência no ponto médio do braço
- antebraco_direito: maior circunferência do antebraço
- coxa_direita: maior circunferência da coxa
- panturrilha_direita: maior circunferência da panturrilha

### Passo 3: Estimativa de BF%
Use método visual: definição muscular, vascularização, depósitos de gordura regionais.

## FORMATO DE RESPOSTA (JSON puro, sem markdown)
{
  "scaleDetected": true,
  "measurements": {
    "ombros": {"value": 120, "confidence": "high"},
    "peitoral": {"value": 105, "confidence": "medium"},
    "cintura": {"value": 82, "confidence": "high"},
    "quadril": {"value": 98, "confidence": "medium"},
    "abdomen": {"value": 85, "confidence": "medium"},
    "pescoco": {"value": 38, "confidence": "high"},
    "braco_esquerdo": {"value": 35, "confidence": "high"},
    "braco_direito": {"value": 35.5, "confidence": "high"},
    "antebraco_esquerdo": {"value": 28, "confidence": "medium"},
    "antebraco_direito": {"value": 28.5, "confidence": "medium"},
    "coxa_esquerda": {"value": 58, "confidence": "medium"},
    "coxa_direita": {"value": 57.5, "confidence": "medium"},
    "panturrilha_esquerda": {"value": 38, "confidence": "high"},
    "panturrilha_direita": {"value": 38, "confidence": "high"}
  },
  "gordura_corporal": {"value": 14, "confidence": "medium"},
  "imageQuality": {
    "frontal": {"score": 85, "issues": []},
    "costas": {"score": 80, "issues": []},
    "lateralEsq": {"score": 75, "issues": ["slight_rotation"]},
    "lateralDir": {"score": 80, "issues": []}
  },
  "notes": ["Observação 1", "Observação 2"]
}

## NÍVEIS DE CONFIANÇA
- "high": Landmarks claros, boa iluminação, pose correta (±2cm)
- "medium": Alguma ambiguidade (±3-4cm)
- "low": Alta incerteza (±5cm+)

## RESTRIÇÕES
- NUNCA invente medidas se não conseguir estimar
- Retorne erro se qualidade insuficiente
- Seja conservador no BF%
- Considere assimetrias reais entre E e D
- Responda APENAS com JSON válido, sem markdown`;

// ===== MAIN HANDLER =====

serve(async (req) => {
    // CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    const startTime = Date.now();

    try {
        // 1. Validar API key e env vars
        if (!GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY not configured");
        }
        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error("Supabase environment variables not configured");
        }

        // 2. Parse request
        const body: AnalyzeBodyRequest = await req.json();

        // 3. Validar inputs
        validateInput(body);

        // 4. Criar Supabase client (service role p/ bypass RLS)
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // 5. Upload das 4 imagens para o bucket
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const basePath = `${body.atletaId}/${timestamp}`;

        const imagePaths = await uploadAllImages(supabase, basePath, body);

        // 6. Chamar Gemini Vision
        const userPrompt = buildUserPrompt(body);
        const geminiResult = await callGeminiVision(body, userPrompt);

        // 7. Inserir na tabela medidas
        const medidaData = mapToMedidas(geminiResult, body);

        const { data: medida, error: insertError } = await supabase
            .from("medidas")
            .insert(medidaData)
            .select("id")
            .single();

        if (insertError || !medida) {
            console.error("[analyze-body] Insert medidas error:", insertError);
            throw new Error("Falha ao salvar medidas");
        }

        // 8. Inserir metadados IA
        const confidenceMap: Record<string, string> = {};
        for (const [key, val] of Object.entries(geminiResult.measurements)) {
            confidenceMap[key] = (val as GeminiMeasurement).confidence;
        }

        const { error: metaError } = await supabase
            .from("medidas_ia_metadata")
            .insert({
                medida_id: medida.id,
                atleta_id: body.atletaId,
                frontal_image_path: imagePaths.frontal,
                costas_image_path: imagePaths.costas,
                lateral_esq_image_path: imagePaths.lateralEsq,
                lateral_dir_image_path: imagePaths.lateralDir,
                reference_object: body.referenceObject,
                overall_confidence: calculateOverallConfidence(geminiResult),
                image_quality_score: Math.round(
                    (geminiResult.imageQuality.frontal.score +
                        geminiResult.imageQuality.costas.score +
                        geminiResult.imageQuality.lateralEsq.score +
                        geminiResult.imageQuality.lateralDir.score) /
                    4
                ),
                analysis_notes: geminiResult.notes,
                confidence_per_measurement: confidenceMap,
                ai_model_used: "gemini-2.0-flash",
                processing_time_ms: Date.now() - startTime,
            });

        if (metaError) {
            console.error("[analyze-body] Insert metadata error:", metaError);
            // Não falhar por metadata — medida já foi salva
        }

        // 9. Montar resposta
        const measurements: Record<string, number> = {};
        for (const [key, val] of Object.entries(geminiResult.measurements)) {
            measurements[key] = (val as GeminiMeasurement).value;
        }

        return new Response(
            JSON.stringify({
                success: true,
                medidaId: medida.id,
                measurements,
                gordura_corporal: geminiResult.gordura_corporal.value,
                confidence: {
                    overall: calculateOverallConfidence(geminiResult),
                    perMeasurement: confidenceMap,
                },
                analysisNotes: geminiResult.notes,
                processingTimeMs: Date.now() - startTime,
            }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("[analyze-body] Error:", error);
        return new Response(
            JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : "Erro desconhecido",
            }),
            {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});

// ===== HELPER FUNCTIONS =====

function validateInput(body: AnalyzeBodyRequest): void {
    if (
        !body.frontalImageBase64 ||
        !body.costasImageBase64 ||
        !body.lateralEsqImageBase64 ||
        !body.lateralDirImageBase64
    ) {
        throw new Error("Todas as 4 fotos são obrigatórias");
    }

    if (!body.heightCm || body.heightCm < 100 || body.heightCm > 250) {
        throw new Error("Altura deve estar entre 100 e 250 cm");
    }

    if (!body.weightKg || body.weightKg < 30 || body.weightKg > 300) {
        throw new Error("Peso deve estar entre 30 e 300 kg");
    }

    if (!body.atletaId) {
        throw new Error("atletaId é obrigatório");
    }

    if (!["M", "F"].includes(body.sexo)) {
        throw new Error("Sexo deve ser 'M' ou 'F'");
    }

    if (
        !["credit_card", "a4_paper", "tape_measure"].includes(body.referenceObject)
    ) {
        throw new Error("Objeto de referência inválido");
    }
}

function buildUserPrompt(body: AnalyzeBodyRequest): string {
    const vestuario = body.sexo === "M" ? "sunga" : "biquíni";
    const referenceLabels: Record<string, string> = {
        credit_card: "Cartão de crédito (85.6mm × 53.98mm)",
        a4_paper: "Folha A4 (210mm × 297mm)",
        tape_measure: "Fita métrica",
    };

    return `## DADOS DO INDIVÍDUO
- Altura: ${body.heightCm} cm
- Peso: ${body.weightKg} kg
- Sexo: ${body.sexo === "M" ? "Masculino" : "Feminino"}
- Vestuário: ${vestuario}
- Objeto de referência: ${referenceLabels[body.referenceObject]}

## IMAGENS (na ordem)
1. Imagem FRONTAL (primeira)
2. Imagem de COSTAS (segunda)
3. Imagem LATERAL ESQUERDA (terceira)
4. Imagem LATERAL DIREITA (quarta)

Analise as 4 imagens e forneça as estimativas de circunferências conforme o protocolo.
Compare cuidadosamente lado E vs D para detectar assimetrias reais.`;
}

async function callGeminiVision(
    body: AnalyzeBodyRequest,
    userPrompt: string
): Promise<GeminiResponse> {
    const images = [
        body.frontalImageBase64,
        body.costasImageBase64,
        body.lateralEsqImageBase64,
        body.lateralDirImageBase64,
    ];

    const parts: Array<Record<string, unknown>> = [
        { text: SYSTEM_PROMPT },
        { text: userPrompt },
    ];

    // Adicionar as 4 imagens
    for (const img of images) {
        const cleanBase64 = img.replace(/^data:image\/\w+;base64,/, "");
        parts.push({
            inline_data: {
                mime_type: "image/jpeg",
                data: cleanBase64,
            },
        });
    }

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts }],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 4096,
                },
            }),
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        console.error("[analyze-body] Gemini API error:", response.status, errorText);
        throw new Error(`Erro na API Gemini: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
        throw new Error("Sem resposta do Gemini Vision");
    }

    // Parse JSON (remover possíveis markdown wrappers)
    const cleanText = text.replace(/```json\n?|\n?```/g, "").trim();

    try {
        return JSON.parse(cleanText) as GeminiResponse;
    } catch {
        console.error("[analyze-body] Failed to parse Gemini response:", cleanText);
        throw new Error("Formato de resposta inválido do Gemini");
    }
}

function mapToMedidas(
    result: GeminiResponse,
    body: AnalyzeBodyRequest
): Record<string, unknown> {
    const m = result.measurements;

    return {
        atleta_id: body.atletaId,
        data: new Date().toISOString().split("T")[0],
        peso: body.weightKg,
        gordura_corporal: result.gordura_corporal?.value || null,
        ombros: m.ombros?.value || null,
        peitoral: m.peitoral?.value || null,
        cintura: m.cintura?.value || null,
        quadril: m.quadril?.value || null,
        abdomen: m.abdomen?.value || null,
        braco_esquerdo: m.braco_esquerdo?.value || null,
        braco_direito: m.braco_direito?.value || null,
        antebraco_esquerdo: m.antebraco_esquerdo?.value || null,
        antebraco_direito: m.antebraco_direito?.value || null,
        coxa_esquerda: m.coxa_esquerda?.value || null,
        coxa_direita: m.coxa_direita?.value || null,
        panturrilha_esquerda: m.panturrilha_esquerda?.value || null,
        panturrilha_direita: m.panturrilha_direita?.value || null,
        pescoco: m.pescoco?.value || null,
        registrado_por: "IA_VISION",
    };
}

async function uploadAllImages(
    supabase: ReturnType<typeof createClient>,
    basePath: string,
    body: AnalyzeBodyRequest
): Promise<{
    frontal: string;
    costas: string;
    lateralEsq: string;
    lateralDir: string;
}> {
    const imageEntries = [
        { key: "frontal", data: body.frontalImageBase64 },
        { key: "costas", data: body.costasImageBase64 },
        { key: "lateralEsq", data: body.lateralEsqImageBase64 },
        { key: "lateralDir", data: body.lateralDirImageBase64 },
    ] as const;

    const paths: Record<string, string> = {};

    await Promise.all(
        imageEntries.map(async ({ key, data }) => {
            const path = `${basePath}/${key}.jpg`;
            const imageData = data.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Uint8Array.from(atob(imageData), (c) => c.charCodeAt(0));

            const { error } = await supabase.storage
                .from("body-assessment-photos")
                .upload(path, buffer, {
                    contentType: "image/jpeg",
                    upsert: false,
                });

            if (error) {
                console.error(`[analyze-body] Upload error (${key}):`, error);
                throw new Error(`Falha no upload da foto ${key}`);
            }

            paths[key] = path;
        })
    );

    return paths as {
        frontal: string;
        costas: string;
        lateralEsq: string;
        lateralDir: string;
    };
}

function calculateOverallConfidence(
    result: GeminiResponse
): "high" | "medium" | "low" {
    const confidences = Object.values(result.measurements).map(
        (m) => (m as GeminiMeasurement).confidence
    );

    const highCount = confidences.filter((c) => c === "high").length;
    const lowCount = confidences.filter((c) => c === "low").length;
    const total = confidences.length;

    if (lowCount > total / 3) return "low";
    if (highCount > total / 2) return "high";
    return "medium";
}
