/**
 * Geração de prescrição série-a-série via Gemini.
 *
 * LLM retorna array SeriePrescrita[] com reps + carga em kg + RIR + descanso
 * por série, baseado em princípios científicos (Haun/Schoenfeld/Zourdos/Helms).
 *
 * Fallback: rampaClassica determinística se JSON for inválido.
 */

import { gerarConteudoIA } from '../vitruviusAI'
import type { SeriePrescrita } from '../../types/prescricao'
import type { TipoSet } from '../../types/athlete-portal'
import { rampaClassica } from './templates'

export interface SugerirPrescricaoParams {
    exercicioNome: string
    grupoMuscular?: string
    nivel?: 'iniciante' | 'intermediario' | 'avancado'
    objetivo?: string
    mesocicloNome?: string
    rpeAlvoMesociclo?: [number, number]
    volumeRelativo?: number
    topSetKg?: number                // opcional; IA estima se ausente
    repsTop?: number
    totalSeriesDesejado?: number
    historicoUltimaCarga?: number
}

const TIPOS_VALIDOS: TipoSet[] = ['valida', 'aquecimento', 'reconhecimento', 'top', 'backoff', 'drop', 'falha']

function validarSerie(raw: unknown, idx: number): SeriePrescrita | null {
    if (!raw || typeof raw !== 'object') return null
    const r = raw as Record<string, unknown>
    const tipo = TIPOS_VALIDOS.includes(r.tipo as TipoSet) ? (r.tipo as TipoSet) : 'valida'
    const reps = Number(r.reps ?? r.repsAlvoMax ?? r.repsAlvoMin)
    const cargaKg = Number(r.cargaKg)
    const descansoSegundos = Number(r.descansoSegundos)
    if (!Number.isFinite(reps) || !Number.isFinite(descansoSegundos)) return null
    const rirAlvoRaw = r.rirAlvo != null ? Number(r.rirAlvo) : undefined
    return {
        ordem: idx + 1,
        tipo,
        reps: Math.max(1, Math.round(reps)),
        cargaKg: Number.isFinite(cargaKg) ? Math.round(cargaKg * 2) / 2 : 0,
        rirAlvo: rirAlvoRaw != null && Number.isFinite(rirAlvoRaw) ? Math.max(0, Math.min(5, Math.round(rirAlvoRaw))) : undefined,
        descansoSegundos: Math.max(15, Math.round(descansoSegundos)),
    }
}

function validarArray(raw: unknown): SeriePrescrita[] | null {
    let candidato: unknown = raw
    if (raw && typeof raw === 'object' && 'series' in raw) {
        candidato = (raw as { series: unknown }).series
    } else if (raw && typeof raw === 'object' && 'prescricaoSeries' in raw) {
        candidato = (raw as { prescricaoSeries: unknown }).prescricaoSeries
    }
    if (!Array.isArray(candidato) || candidato.length === 0) return null
    const series = candidato.map((s, i) => validarSerie(s, i)).filter(Boolean) as SeriePrescrita[]
    return series.length > 0 ? series : null
}

export async function sugerirPrescricaoIA(params: SugerirPrescricaoParams): Promise<SeriePrescrita[]> {
    const totalSeries = params.totalSeriesDesejado ?? 5
    const repsTop = params.repsTop ?? 10
    const topInfo = params.topSetKg && params.topSetKg > 0
        ? `Top set alvo: ${params.topSetKg}kg × ${repsTop} reps.`
        : `Top set alvo: estime a carga apropriada em kg para o nível do aluno (${params.nivel ?? 'intermediario'}) fazendo ${repsTop} reps em RIR 0-1. Seja realista para ${params.exercicioNome}.`

    const prompt = `Você é um treinador S&C com base científica. Prescreva a execução série-a-série de UMA sessão de UM exercício, com cargas concretas em kg.

CONTEXTO:
- Exercício: ${params.exercicioNome}${params.grupoMuscular ? ` (${params.grupoMuscular})` : ''}
- Nível: ${params.nivel ?? 'intermediario'}
- Objetivo: ${params.objetivo ?? 'RECOMP'}
- Mesociclo: ${params.mesocicloNome ?? 'Acumulação'}${params.rpeAlvoMesociclo ? ` (RPE alvo ${params.rpeAlvoMesociclo[0]}-${params.rpeAlvoMesociclo[1]})` : ''}
- ${topInfo}
- Total de séries: ${totalSeries}
${params.historicoUltimaCarga != null ? `- Última carga executada: ${params.historicoUltimaCarga}kg\n` : ''}
DIRETRIZES CIENTÍFICAS:
- Aquecimento Haun/Schoenfeld: 50%×12 / 70%×8 / 85%×5 / 95%×3 do top.
- RIR (Zourdos 2016): aquec 3-4, válida 1-2, top 0-1.
- Descanso Schoenfeld 2016: aquec 60-90s, válida 120-180s, top 240-300s, backoff 150-180s.
- Adaptação → rampa clássica RIR 2-3. Acumulação → rampa ou top+backoff RIR 1-2. Intensificação → top+backoff RIR 0-1.
- Backoff: 80-85% do top, 2-3 séries, mais reps.

RESPOSTA: devolva SOMENTE JSON válido (sem texto antes/depois) no formato:
{"series":[{"tipo":"aquecimento|reconhecimento|valida|top|backoff|drop|falha","reps":N,"cargaKg":N,"rirAlvo":0..5,"descansoSegundos":N}]}

Cargas SEMPRE em kg absoluto arredondado a 0.5kg. Nunca use percentagens. Reps um número exato (não range).`

    try {
        const resposta = await gerarConteudoIA<unknown>(prompt)
        const validado = validarArray(resposta)
        if (validado) return validado
    } catch (err) {
        console.warn('[sugerirPrescricaoIA] falha, usando fallback determinístico', err)
    }
    return rampaClassica({
        totalSeries,
        repsValida: repsTop,
        topKg: params.topSetKg && params.topSetKg > 0 ? params.topSetKg : 40,
    })
}

/**
 * Bulk: gera prescrição série-a-série para múltiplos exercícios em paralelo.
 * Ignora exercícios sem nome. Retorna novo array na mesma ordem do input.
 */
export async function sugerirPrescricaoLote(
    exercicios: Array<SugerirPrescricaoParams>,
): Promise<Array<{ params: SugerirPrescricaoParams; series: SeriePrescrita[] }>> {
    return Promise.all(exercicios.map(async params => ({
        params,
        series: await sugerirPrescricaoIA(params),
    })))
}
