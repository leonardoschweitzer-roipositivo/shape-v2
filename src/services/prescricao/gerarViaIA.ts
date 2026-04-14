/**
 * Geração de prescrição série-a-série via Gemini.
 *
 * O LLM recebe contexto do exercício + objetivo + mesociclo atual + histórico
 * e retorna um array SeriePrescrita[] em JSON. Validado contra schema e com
 * fallback determinístico (rampaClassica) se a resposta for inválida.
 *
 * Princípios científicos incorporados no system prompt:
 * - Aquec 50/70/85/95% reps 12/8/5/3 (Haun 2019; Schoenfeld 2016)
 * - RIR 3-4 aquec, 1-2 válida, 0-1 top (Zourdos 2016)
 * - Top + backoffs 80-85% (Helms, Israetel)
 * - Adaptação → rampa; Acumulação → rampa ou top+backoff; Intensificação → top+backoff RIR 0-1
 */

import { gerarConteudoIA } from '../vitruviusAI'
import type { SeriePrescrita, FonteCarga } from '../../types/prescricao'
import type { TipoSet } from '../../types/athlete-portal'
import { rampaClassica } from './templates'

export interface SugerirPrescricaoParams {
    exercicioNome: string
    grupoMuscular?: string
    nivel?: 'iniciante' | 'intermediario' | 'avancado'
    objetivo?: string                // BULK/CUT/RECOMP/GOLDEN_RATIO/...
    mesocicloNome?: string           // "Adaptação" | "Acumulação" | "Intensificação"
    rpeAlvoMesociclo?: [number, number]
    volumeRelativo?: number          // 0..1
    topSetKg: number
    repsTop: number
    totalSeriesDesejado?: number     // default 5
    historicoUltimaCarga?: number    // kg da última execução do top set
}

const TIPOS_VALIDOS: TipoSet[] = ['valida', 'aquecimento', 'reconhecimento', 'top', 'backoff', 'drop', 'falha']
const FONTES_VALIDAS: FonteCarga[] = ['kg', 'pctTopSet']

function validarSerie(raw: unknown, idx: number, topKg: number): SeriePrescrita | null {
    if (!raw || typeof raw !== 'object') return null
    const r = raw as Record<string, unknown>
    const tipo = TIPOS_VALIDOS.includes(r.tipo as TipoSet) ? (r.tipo as TipoSet) : 'valida'
    const repsAlvoMin = Number(r.repsAlvoMin)
    const repsAlvoMax = Number(r.repsAlvoMax)
    const descansoSegundos = Number(r.descansoSegundos)
    if (!Number.isFinite(repsAlvoMin) || !Number.isFinite(repsAlvoMax) || !Number.isFinite(descansoSegundos)) return null
    const fonteCarga: FonteCarga = FONTES_VALIDAS.includes(r.fonteCarga as FonteCarga) ? (r.fonteCarga as FonteCarga) : 'kg'
    const cargaKg = r.cargaKg != null ? Number(r.cargaKg) : undefined
    const cargaPercentTopSet = r.cargaPercentTopSet != null ? Number(r.cargaPercentTopSet) : undefined
    const rirAlvo = r.rirAlvo != null ? Number(r.rirAlvo) : undefined

    const serie: SeriePrescrita = {
        ordem: idx + 1,
        tipo,
        repsAlvoMin: Math.max(1, Math.round(repsAlvoMin)),
        repsAlvoMax: Math.max(repsAlvoMin, Math.round(repsAlvoMax)),
        fonteCarga,
        descansoSegundos: Math.max(15, Math.round(descansoSegundos)),
    }
    if (fonteCarga === 'pctTopSet' && Number.isFinite(cargaPercentTopSet)) {
        serie.cargaPercentTopSet = Math.min(1.2, Math.max(0, cargaPercentTopSet!))
        serie.cargaKg = Math.round(topKg * serie.cargaPercentTopSet * 2) / 2
    } else if (Number.isFinite(cargaKg)) {
        serie.cargaKg = Math.round(cargaKg! * 2) / 2
    }
    if (rirAlvo != null && Number.isFinite(rirAlvo)) {
        serie.rirAlvo = Math.max(0, Math.min(5, Math.round(rirAlvo)))
    }
    if (typeof r.observacao === 'string' && r.observacao.trim()) {
        serie.observacao = r.observacao.trim()
    }
    return serie
}

function validarArray(raw: unknown, topKg: number): SeriePrescrita[] | null {
    let candidato: unknown = raw
    if (raw && typeof raw === 'object' && 'series' in raw) {
        candidato = (raw as { series: unknown }).series
    } else if (raw && typeof raw === 'object' && 'prescricaoSeries' in raw) {
        candidato = (raw as { prescricaoSeries: unknown }).prescricaoSeries
    }
    if (!Array.isArray(candidato) || candidato.length === 0) return null
    const series = candidato.map((s, i) => validarSerie(s, i, topKg)).filter(Boolean) as SeriePrescrita[]
    return series.length > 0 ? series : null
}

export async function sugerirPrescricaoIA(params: SugerirPrescricaoParams): Promise<SeriePrescrita[]> {
    const totalSeries = params.totalSeriesDesejado ?? 5
    const prompt = `Você é um treinador S&C com base científica. Prescreva a execução série-a-série para UMA sessão de UM exercício.

CONTEXTO:
- Exercício: ${params.exercicioNome}${params.grupoMuscular ? ` (${params.grupoMuscular})` : ''}
- Nível do aluno: ${params.nivel ?? 'intermediario'}
- Objetivo: ${params.objetivo ?? 'RECOMP'}
- Mesociclo atual: ${params.mesocicloNome ?? 'Acumulação'}${params.rpeAlvoMesociclo ? ` (RPE alvo ${params.rpeAlvoMesociclo[0]}-${params.rpeAlvoMesociclo[1]})` : ''}
- Volume relativo do mesociclo: ${params.volumeRelativo != null ? `${Math.round(params.volumeRelativo * 100)}%` : 'N/A'}
- Top set alvo desta sessão: ${params.topSetKg}kg × ${params.repsTop} reps
- Total de séries desejado: ${totalSeries}
${params.historicoUltimaCarga != null ? `- Última carga executada (top set): ${params.historicoUltimaCarga}kg\n` : ''}
DIRETRIZES CIENTÍFICAS:
- Aquecimento progressivo Haun/Schoenfeld: tipicamente 50%×12 / 70%×8 / 85%×5 / 95%×3 do top.
- RIR (Zourdos 2016): aquec 3-4, válida 1-2, top/falha 0-1.
- Descanso (Schoenfeld 2016): aquec 60-90s, válida 120-180s, top composto 240-300s, backoff 150-180s.
- Adaptação → rampa clássica RIR 2-3. Acumulação → rampa OU top+backoff RIR 1-2. Intensificação → top+backoff RIR 0-1.
- Backoff típico: 80-85% do top, 2-3 séries, mais reps que o top.

RESPOSTA: devolva SOMENTE JSON válido (sem texto antes/depois) no formato:
{"series":[{"tipo":"aquecimento|reconhecimento|valida|top|backoff|drop|falha","repsAlvoMin":N,"repsAlvoMax":N,"fonteCarga":"kg"|"pctTopSet","cargaKg":N,"cargaPercentTopSet":0..1,"rirAlvo":0..5,"descansoSegundos":N}]}

Para aquecimentos use fonteCarga="pctTopSet" com cargaPercentTopSet. Para válidas/top/backoff use fonteCarga="kg" com cargaKg absoluto (arredondado a 0.5kg).`

    try {
        const resposta = await gerarConteudoIA<unknown>(prompt)
        const validado = validarArray(resposta, params.topSetKg)
        if (validado) return validado
    } catch (err) {
        console.warn('[sugerirPrescricaoIA] falha, usando fallback determinístico', err)
    }
    return rampaClassica({
        totalSeries,
        repsValida: params.repsTop,
        topKg: params.topSetKg,
    })
}
