/**
 * Análise de Treino IA — gera uma análise do treino concluído usando Gemini,
 * combinada com métricas calculadas localmente (gasto calórico, volume total).
 *
 * Resultado é cacheado em localStorage por `treinoId` para evitar re-geração.
 */
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { WorkoutOfDay, ExercicioTreino, SetExecutado } from '@/types/athlete-portal'

export interface AnaliseTreino {
    gastoCaloricoKcal: number          // estimativa calorias gastas
    volumeTotalKg: number               // soma de (carga × reps) de todos sets válidos
    musculaturas: string[]              // ex: ["Quadríceps", "Glúteos", "Isquiotibiais"]
    destaque: string                    // 1 frase — ponto forte da sessão
    observacao: string                  // 2-3 frases — análise do coach
    recomendacaoProximo: string         // 1 frase — orientação para próxima sessão
    geradoEm: string                    // ISO
}

const MET_MUSCULACAO = 5.5               // MET médio para musculação moderada-intensa
const PESO_DEFAULT_KG = 72               // fallback se aluno não tem peso registrado
const CACHE_PREFIX = 'shape:analise-treino:'

function chaveCache(treinoId: string): string {
    return `${CACHE_PREFIX}${treinoId}`
}

export function carregarAnaliseCacheada(treinoId: string): AnaliseTreino | null {
    try {
        const raw = localStorage.getItem(chaveCache(treinoId))
        return raw ? (JSON.parse(raw) as AnaliseTreino) : null
    } catch {
        return null
    }
}

function salvarAnaliseCacheada(treinoId: string, analise: AnaliseTreino): void {
    try {
        localStorage.setItem(chaveCache(treinoId), JSON.stringify(analise))
    } catch {
        // quota pode estourar — falha silenciosa
    }
}

function calcularGastoCalorico(duracaoMin: number, pesoKg: number, intensidade?: 1 | 2 | 3 | 4): number {
    const fatorIntensidade = intensidade === 1 ? 0.85 : intensidade === 4 ? 1.15 : intensidade === 3 ? 1.05 : 1
    const met = MET_MUSCULACAO * fatorIntensidade
    const horas = duracaoMin / 60
    return Math.round(met * pesoKg * horas)
}

function calcularVolumeTotal(exercicios: ExercicioTreino[]): number {
    let total = 0
    for (const ex of exercicios) {
        const sets = (ex as unknown as { sets?: SetExecutado[] }).sets ?? []
        for (const s of sets) {
            if (typeof s.carga === 'number' && typeof s.reps === 'number' && s.carga > 0 && s.reps > 0) {
                total += s.carga * s.reps
            }
        }
    }
    return Math.round(total)
}

async function gerarAnaliseComGemini(
    treino: WorkoutOfDay,
    metricas: { gastoCaloricoKcal: number; volumeTotalKg: number }
): Promise<Pick<AnaliseTreino, 'musculaturas' | 'destaque' | 'observacao' | 'recomendacaoProximo'>> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    const nomesExercicios = (treino.exercicios ?? []).map(ex => `${ex.nome} (${ex.series}×${ex.repeticoes})`).join(', ')
    const fallback = {
        musculaturas: inferirMusculaturasFallback(treino.titulo),
        destaque: `Volume sólido em ${treino.titulo.toLowerCase()}`,
        observacao: `Sessão de ${treino.duracao}min concluída com intensidade boa. Continue priorizando execução técnica.`,
        recomendacaoProximo: 'Mantenha o descanso de 48h para os grupos trabalhados.',
    }

    if (!apiKey) return fallback

    try {
        const ai = new GoogleGenerativeAI(apiKey)
        const model = ai.getGenerativeModel({
            model: 'gemini-2.0-flash',
            generationConfig: {
                maxOutputTokens: 600,
                temperature: 0.6,
                responseMimeType: 'application/json',
            },
        })

        const prompt = `Você é um treinador de alta performance sênior. Analise o treino concluído abaixo e retorne um JSON.

Treino: ${treino.titulo}
Duração: ${treino.duracao} minutos
Intensidade relatada: ${treino.intensidade ?? 'não informada'} (escala 1=difícil, 2=normal, 3=bom, 4=ótimo)
Exercícios: ${nomesExercicios || 'não informado'}
Volume total estimado: ${metricas.volumeTotalKg}kg
Gasto calórico estimado: ${metricas.gastoCaloricoKcal}kcal

Retorne EXATAMENTE este JSON, sem markdown, sem explicações extras:
{
  "musculaturas": ["..."],
  "destaque": "uma frase curta (até 12 palavras) destacando o ponto forte da sessão",
  "observacao": "2 a 3 frases (até 45 palavras) com análise técnica do coach: o que foi bem trabalhado, ponto de atenção",
  "recomendacaoProximo": "uma frase (até 18 palavras) com orientação prática para o próximo treino deste grupo"
}

Regras:
- "musculaturas": liste 2 a 5 grupos musculares principais realmente trabalhados pelos exercícios listados (em português, ex: "Quadríceps", "Glúteos", "Isquiotibiais")
- Linguagem objetiva, tom de coach experiente, sem emojis, sem clichês genéricos
- Não invente dados que não estão no prompt`

        const result = await model.generateContent(prompt)
        const texto = result.response.text().trim()
        const parsed = JSON.parse(texto) as Partial<AnaliseTreino>

        return {
            musculaturas: Array.isArray(parsed.musculaturas) && parsed.musculaturas.length > 0
                ? parsed.musculaturas.slice(0, 5).map(m => String(m))
                : fallback.musculaturas,
            destaque: typeof parsed.destaque === 'string' && parsed.destaque.trim() ? parsed.destaque.trim() : fallback.destaque,
            observacao: typeof parsed.observacao === 'string' && parsed.observacao.trim() ? parsed.observacao.trim() : fallback.observacao,
            recomendacaoProximo: typeof parsed.recomendacaoProximo === 'string' && parsed.recomendacaoProximo.trim()
                ? parsed.recomendacaoProximo.trim()
                : fallback.recomendacaoProximo,
        }
    } catch (err) {
        console.error('[analiseTreinoIA] Falha ao gerar análise via Gemini', err)
        return fallback
    }
}

/** Fallback simples baseado no título quando IA indisponível. */
function inferirMusculaturasFallback(titulo: string): string[] {
    const t = titulo.toLowerCase()
    if (t.includes('pern') || t.includes('quadr') || t.includes('posterior')) return ['Quadríceps', 'Glúteos', 'Isquiotibiais']
    if (t.includes('peito') || t.includes('tríceps')) return ['Peitoral', 'Tríceps', 'Deltoide anterior']
    if (t.includes('costas') || t.includes('bíceps')) return ['Dorsal', 'Bíceps', 'Trapézio']
    if (t.includes('ombro')) return ['Deltoide', 'Trapézio']
    if (t.includes('core') || t.includes('abdom')) return ['Reto abdominal', 'Oblíquos', 'Core']
    return ['Corpo completo']
}

export async function gerarAnaliseTreino(
    treino: WorkoutOfDay,
    pesoAlunoKg?: number,
    forcarRegenerar = false
): Promise<AnaliseTreino> {
    if (!forcarRegenerar) {
        const cached = carregarAnaliseCacheada(treino.id)
        if (cached) return cached
    }

    const peso = pesoAlunoKg && pesoAlunoKg > 0 ? pesoAlunoKg : PESO_DEFAULT_KG
    const duracao = treino.duracao ?? 60
    const gastoCaloricoKcal = calcularGastoCalorico(duracao, peso, treino.intensidade)
    const volumeTotalKg = calcularVolumeTotal(treino.exercicios ?? [])

    const ia = await gerarAnaliseComGemini(treino, { gastoCaloricoKcal, volumeTotalKg })

    const analise: AnaliseTreino = {
        gastoCaloricoKcal,
        volumeTotalKg,
        ...ia,
        geradoEm: new Date().toISOString(),
    }

    salvarAnaliseCacheada(treino.id, analise)
    return analise
}
