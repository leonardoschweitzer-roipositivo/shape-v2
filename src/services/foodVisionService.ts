/**
 * Food Vision Service — Análise de foto de refeição via Gemini Vision
 *
 * Usa o Gemini 2.0 Flash (multimodal) para identificar alimentos,
 * estimar porções e calcular macronutrientes a partir de uma foto.
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

// ==========================================
// TYPES
// ==========================================

export interface AlimentoIdentificado {
    alimento: string
    porcaoG: number
    calorias: number
    proteina: number
    carboidrato: number
    gordura: number
    confianca: number // 0-100
}

export interface ResultadoFotoAnalise {
    itens: AlimentoIdentificado[]
    total: {
        calorias: number
        proteina: number
        carboidrato: number
        gordura: number
    }
    confiancaGeral: number // 0-100
    observacao?: string
}

// ==========================================
// CONFIGURAÇÃO
// ==========================================

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

let genAI: GoogleGenerativeAI | null = null

function getVisionModel() {
    if (!API_KEY) {
        console.warn('[FoodVision] VITE_GEMINI_API_KEY não configurada')
        return null
    }

    if (!genAI) {
        genAI = new GoogleGenerativeAI(API_KEY)
    }

    return genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: {
            temperature: 0.3,
            topP: 0.85,
            maxOutputTokens: 4096,
            responseMimeType: 'application/json',
        },
        safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        ],
    })
}

// ==========================================
// PROMPT ESPECIALIZADO
// ==========================================

const FOOD_ANALYSIS_PROMPT = `Você é um nutricionista especialista em análise visual de alimentos. Analise a foto da refeição e identifique TODOS os alimentos visíveis.

## Instruções
1. Identifique cada alimento separadamente
2. Estime a porção em gramas usando referências visuais (tamanho do prato, proporção entre itens)
3. Calcule os macronutrientes usando a tabela TACO (Tabela Brasileira de Composição de Alimentos)
4. Diferencie o método de preparo quando visível (grelhado vs frito, por exemplo — isso altera as calorias)
5. Atribua um nível de confiança (0 a 100) para cada item identificado:
   - 90-100: alimento claramente visível e reconhecível
   - 70-89: alimento provável, mas com alguma incerteza
   - 50-69: estimativa baseada em aparência geral
   - <50: palpite, difícil de identificar

## Formato de Resposta (JSON)
{
  "itens": [
    {
      "alimento": "nome do alimento e preparo",
      "porcaoG": 150,
      "calorias": 248,
      "proteina": 31,
      "carboidrato": 0,
      "gordura": 3.6,
      "confianca": 92
    }
  ],
  "confiancaGeral": 85,
  "observacao": "observação breve sobre a refeição (opcional, max 1 frase)"
}

## Regras
- Sempre responda em português brasileiro
- Porções em GRAMAS (não colheres, xícaras etc.)
- Macros por ITEM (não por 100g)
- Se vir molho, tempero ou óleo, contabilize separadamente
- Se a imagem NÃO for de comida, retorne: { "itens": [], "confiancaGeral": 0, "observacao": "Não foi possível identificar alimentos na imagem" }
- Valores arredondados (inteiros para calorias, 1 casa decimal para macros)`

// ==========================================
// FUNÇÃO PRINCIPAL
// ==========================================

/**
 * Analisa uma foto de refeição via Gemini Vision.
 *
 * @param imageBase64 - Imagem em base64 (sem o prefixo data:image/...)
 * @param mimeType - Tipo MIME da imagem (ex: 'image/jpeg')
 * @returns Resultado da análise com items, totais e confiança
 */
export async function analisarFotoRefeicao(
    imageBase64: string,
    mimeType: string = 'image/jpeg'
): Promise<ResultadoFotoAnalise | null> {
    const model = getVisionModel()

    if (!model) {
        console.error('[FoodVision] Modelo não disponível')
        return null
    }

    try {
        console.info('[FoodVision] 🚀 Analisando foto da refeição...')

        const result = await model.generateContent([
            { text: FOOD_ANALYSIS_PROMPT },
            {
                inlineData: {
                    mimeType,
                    data: imageBase64,
                },
            },
        ])

        const response = result.response
        const text = response.text()

        if (!text) {
            console.warn('[FoodVision] Resposta vazia do Gemini')
            return null
        }

        // Parse JSON robusto
        let jsonContent = text.trim()
        const firstBrace = jsonContent.indexOf('{')
        const lastBrace = jsonContent.lastIndexOf('}')

        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            jsonContent = jsonContent.substring(firstBrace, lastBrace + 1)
        }

        const parsed = JSON.parse(jsonContent) as {
            itens: AlimentoIdentificado[]
            confiancaGeral: number
            observacao?: string
        }

        // Calcular totais
        const total = parsed.itens.reduce(
            (acc, item) => ({
                calorias: acc.calorias + (item.calorias || 0),
                proteina: acc.proteina + (item.proteina || 0),
                carboidrato: acc.carboidrato + (item.carboidrato || 0),
                gordura: acc.gordura + (item.gordura || 0),
            }),
            { calorias: 0, proteina: 0, carboidrato: 0, gordura: 0 }
        )

        // Arredondar
        total.proteina = Math.round(total.proteina * 10) / 10
        total.carboidrato = Math.round(total.carboidrato * 10) / 10
        total.gordura = Math.round(total.gordura * 10) / 10

        console.info(`[FoodVision] ✅ ${parsed.itens.length} alimentos identificados (confiança: ${parsed.confiancaGeral}%)`)

        return {
            itens: parsed.itens,
            total,
            confiancaGeral: parsed.confiancaGeral,
            observacao: parsed.observacao,
        }
    } catch (error) {
        console.error('[FoodVision] ❌ Erro na análise:', error)
        return null
    }
}

// ==========================================
// HELPERS
// ==========================================

/**
 * Converte um File (da câmera/input) para base64 string.
 */
export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            const result = reader.result as string
            // Remove o prefixo "data:image/jpeg;base64,"
            const base64 = result.split(',')[1]
            resolve(base64)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

/**
 * Redimensiona imagem antes de enviar (evita payload enorme).
 * Mantém qualidade suficiente para identificação de alimentos.
 */
export function redimensionarImagem(file: File, maxWidth: number = 1024): Promise<{ base64: string; mimeType: string }> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        const reader = new FileReader()

        reader.onload = () => {
            img.src = reader.result as string
        }

        img.onload = () => {
            const canvas = document.createElement('canvas')
            let { width, height } = img

            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width)
                width = maxWidth
            }

            canvas.width = width
            canvas.height = height

            const ctx = canvas.getContext('2d')
            if (!ctx) {
                reject(new Error('Canvas context not available'))
                return
            }

            ctx.drawImage(img, 0, 0, width, height)

            // JPEG com qualidade 0.85 — bom equilíbrio entre tamanho e qualidade
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
            const base64 = dataUrl.split(',')[1]

            resolve({ base64, mimeType: 'image/jpeg' })
        }

        img.onerror = reject
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

/**
 * Retorna a cor/emoji de badge com base na confiança.
 */
export function getConfiancaBadge(confianca: number): { emoji: string; cor: string; label: string } {
    if (confianca >= 80) return { emoji: '🟢', cor: 'text-emerald-400', label: 'Alta' }
    if (confianca >= 50) return { emoji: '🟡', cor: 'text-amber-400', label: 'Média' }
    return { emoji: '🔴', cor: 'text-rose-400', label: 'Baixa' }
}
