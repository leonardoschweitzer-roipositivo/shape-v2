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
const CACHE_VERSION = 'v2'               // bump quando o shape da análise muda
const CACHE_PREFIX = `shape:analise-treino:${CACHE_VERSION}:`

function chaveCache(treinoId: string, volumeTotalKg: number): string {
    // inclui volume no key para invalidar quando o aluno registrar mais sets
    return `${CACHE_PREFIX}${treinoId}:${volumeTotalKg}`
}

export function carregarAnaliseCacheada(treinoId: string, volumeTotalKg: number): AnaliseTreino | null {
    try {
        const raw = localStorage.getItem(chaveCache(treinoId, volumeTotalKg))
        return raw ? (JSON.parse(raw) as AnaliseTreino) : null
    } catch {
        return null
    }
}

function salvarAnaliseCacheada(treinoId: string, volumeTotalKg: number, analise: AnaliseTreino): void {
    try {
        localStorage.setItem(chaveCache(treinoId, volumeTotalKg), JSON.stringify(analise))
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

interface ExercicioAnalisado {
    nome: string
    seriesRealizadas: number
    repeticoesPrescritas: string
    sets: SetExecutado[]
    volumeExercicioKg: number
    cargaMaxKg: number
    cargaMediaKg: number
    repsTotais: number
    tiposDeSerie: string[]
    descansoSegundos?: number
}

function analisarExercicios(exercicios: ExercicioTreino[]): { detalhes: ExercicioAnalisado[]; volumeTotalKg: number } {
    let volumeTotal = 0
    const detalhes: ExercicioAnalisado[] = []

    for (const ex of exercicios) {
        const sets = ex.sets ?? []
        let volumeEx = 0
        let cargaMax = 0
        let somaCarga = 0
        let countCarga = 0
        let repsTotais = 0
        const tipos = new Set<string>()

        for (const s of sets) {
            const carga = typeof s.carga === 'number' ? s.carga : 0
            const reps = typeof s.reps === 'number' ? s.reps : 0
            if (carga > 0 && reps > 0) volumeEx += carga * reps
            if (carga > cargaMax) cargaMax = carga
            if (carga > 0) { somaCarga += carga; countCarga++ }
            if (reps > 0) repsTotais += reps
            if (s.tipo && s.tipo !== 'valida') tipos.add(s.tipo)
        }

        volumeTotal += volumeEx

        detalhes.push({
            nome: ex.nome,
            seriesRealizadas: sets.filter(s => (s.carga ?? 0) > 0 || (s.reps ?? 0) > 0).length,
            repeticoesPrescritas: ex.repeticoes,
            sets,
            volumeExercicioKg: Math.round(volumeEx),
            cargaMaxKg: cargaMax,
            cargaMediaKg: countCarga > 0 ? Math.round((somaCarga / countCarga) * 10) / 10 : 0,
            repsTotais,
            tiposDeSerie: Array.from(tipos),
            descansoSegundos: ex.descansoSegundos,
        })
    }

    return { detalhes, volumeTotalKg: Math.round(volumeTotal) }
}

function formatarExerciciosParaPrompt(detalhes: ExercicioAnalisado[]): string {
    return detalhes.map((d, i) => {
        const setsResumo = d.sets
            .filter(s => (s.carga ?? 0) > 0 || (s.reps ?? 0) > 0)
            .map((s, idx) => {
                const tag = s.tipo && s.tipo !== 'valida' ? ` [${s.tipo}]` : ''
                return `S${idx + 1}: ${s.carga ?? 0}kg×${s.reps ?? 0}${tag}`
            })
            .join(' | ')
        const descanso = d.descansoSegundos ? ` | descanso prescrito: ${d.descansoSegundos}s` : ''
        const volume = d.volumeExercicioKg > 0 ? ` | volume: ${d.volumeExercicioKg}kg` : ''
        return `${i + 1}. ${d.nome} (prescrito ${d.repeticoesPrescritas}): ${setsResumo || 'sem dados de série'}${volume}${descanso}`
    }).join('\n')
}

async function gerarAnaliseComGemini(
    treino: WorkoutOfDay,
    metricas: { gastoCaloricoKcal: number; volumeTotalKg: number; detalhes: ExercicioAnalisado[] }
): Promise<Pick<AnaliseTreino, 'musculaturas' | 'destaque' | 'observacao' | 'recomendacaoProximo'>> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    const fallback = {
        musculaturas: inferirMusculaturasFallback(treino.titulo),
        destaque: `Volume sólido em ${treino.titulo.toLowerCase()}`,
        observacao: `Sessão de ${treino.duracao}min concluída. Continue priorizando execução técnica e progressão de carga.`,
        recomendacaoProximo: 'Mantenha o descanso de 48h para os grupos trabalhados.',
    }

    if (!apiKey) return fallback

    const exerciciosFormatados = formatarExerciciosParaPrompt(metricas.detalhes)

    try {
        const ai = new GoogleGenerativeAI(apiKey)
        const model = ai.getGenerativeModel({
            model: 'gemini-2.0-flash',
            generationConfig: {
                maxOutputTokens: 900,
                temperature: 0.55,
                responseMimeType: 'application/json',
            },
        })

        const prompt = `Você é um treinador de alta performance sênior analisando uma sessão de musculação concluída. Retorne APENAS um JSON válido.

=== DADOS DA SESSÃO ===
Treino: ${treino.titulo}
Duração: ${treino.duracao} minutos
Intensidade relatada pelo aluno: ${treino.intensidade ?? 'não informada'} (1=difícil, 2=normal, 3=bom, 4=ótimo)
Volume total calculado: ${metricas.volumeTotalKg}kg
Gasto calórico estimado: ${metricas.gastoCaloricoKcal}kcal

=== EXERCÍCIOS EXECUTADOS (série-a-série) ===
${exerciciosFormatados}

Legenda dos tipos de série (quando marcados): aquecimento, reconhecimento, top (mais pesada do dia), backoff (volume pós-top), drop (drop set), falha (até falha muscular). Ausência de tag = série válida principal.

=== FORMATO DA RESPOSTA ===
Retorne EXATAMENTE este JSON (sem markdown, sem blocos de código, sem comentários):
{
  "musculaturas": ["..."],
  "destaque": "frase curta (≤14 palavras) sobre o ponto mais forte da sessão; cite um número concreto (carga, volume, ou reps) quando possível",
  "observacao": "3 a 4 frases (≤75 palavras) analisando tecnicamente as cargas, progressão série-a-série, distribuição de volume, tipos de série usados e intervalos; aponte 1 força e 1 ponto de atenção concreto",
  "recomendacaoProximo": "frase (≤22 palavras) com ação prática e específica para o próximo treino deste grupo (ex: aumentar carga em X, ajustar descanso, adicionar drop set)"
}

=== REGRAS ===
- "musculaturas": 2 a 5 grupos REAIS trabalhados, derivados dos exercícios executados (ex: "Quadríceps", "Glúteos", "Isquiotibiais", "Eretores da espinha")
- Linguagem de coach sênior: direta, técnica, sem clichês motivacionais, sem emojis
- Use os números reais dos sets (cargas em kg, reps, volumes) — não invente dados
- Se um exercício foi prescrito mas veio "sem dados de série", ele foi PULADO ou não teve carga registrada — mencione apenas se for relevante
- Se volume total estiver em 0kg, não invente; foque em duração, exercícios e intensidade`

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
    const { detalhes, volumeTotalKg } = analisarExercicios(treino.exercicios ?? [])

    if (!forcarRegenerar) {
        const cached = carregarAnaliseCacheada(treino.id, volumeTotalKg)
        if (cached) return cached
    }

    const peso = pesoAlunoKg && pesoAlunoKg > 0 ? pesoAlunoKg : PESO_DEFAULT_KG
    const duracao = treino.duracao ?? 60
    const gastoCaloricoKcal = calcularGastoCalorico(duracao, peso, treino.intensidade)

    const ia = await gerarAnaliseComGemini(treino, { gastoCaloricoKcal, volumeTotalKg, detalhes })

    const analise: AnaliseTreino = {
        gastoCaloricoKcal,
        volumeTotalKg,
        ...ia,
        geradoEm: new Date().toISOString(),
    }

    salvarAnaliseCacheada(treino.id, volumeTotalKg, analise)
    return analise
}
