/**
 * Consistência Service — Calcula streak, recorde, heatmap e métricas
 *
 * Lê registros da tabela `registros_diarios` (tipo='treino', status='completo')
 * e calcula tudo em memória. Nenhuma tabela nova necessária.
 */

import { supabase } from './supabase'

// ==========================================
// TIPOS
// ==========================================

export interface DadosConsistencia {
    ano: number
    checkins: string[]            // Datas ISO 'YYYY-MM-DD' que treinou
    streakAtual: number           // Dias consecutivos até hoje
    recorde: number               // Maior streak do histórico
    proximoBadge: BadgeProximo | null
    totalTreinos: number
    consistencia: number          // % (treinos / dias passados no ano)
    tempoTotalMinutos: number
}

export interface BadgeProximo {
    nome: string
    emoji: string
    diasFaltando: number
}

// ==========================================
// BADGES
// ==========================================

const BADGES = [
    { dias: 3, nome: 'Primeiros Passos', emoji: '🌱' },
    { dias: 7, nome: 'Uma Semana', emoji: '🔥' },
    { dias: 14, nome: 'Duas Semanas', emoji: '🔥🔥' },
    { dias: 30, nome: 'Um Mês', emoji: '💪' },
    { dias: 60, nome: 'Dois Meses', emoji: '⚡' },
    { dias: 90, nome: 'Trimestre', emoji: '🏆' },
    { dias: 180, nome: 'Semestre', emoji: '👑' },
    { dias: 365, nome: 'Lendário', emoji: '🏅' },
]

// ==========================================
// HELPERS
// ==========================================

/** Retorna 'YYYY-MM-DD' de um Date */
function toDateKey(d: Date): string {
    return d.toISOString().split('T')[0]
}

/** Emoji baseado no streak */
export function getEmojiStreak(dias: number): string {
    if (dias >= 30) return '🔥🔥🔥'
    if (dias >= 14) return '🔥🔥'
    if (dias >= 7) return '🔥'
    if (dias >= 3) return '✨'
    return '💪'
}

/** Formata minutos em "Xh YYm" */
export function formatarTempo(minutos: number): string {
    const h = Math.floor(minutos / 60)
    const m = minutos % 60
    return `${h}h${m.toString().padStart(2, '0')}m`
}

/** Calcula streak atual (dias consecutivos até hoje, de trás pra frente) */
function calcularStreakAtual(checkinsSet: Set<string>, hoje: Date): number {
    let streak = 0
    const dia = new Date(hoje)
    dia.setHours(0, 0, 0, 0)

    while (true) {
        const key = toDateKey(dia)
        if (checkinsSet.has(key)) {
            streak++
            dia.setDate(dia.getDate() - 1)
        } else {
            break
        }
    }
    return streak
}

/** Calcula recorde (maior sequência consecutiva no histórico) */
function calcularRecorde(datasOrdenadas: string[]): number {
    if (datasOrdenadas.length === 0) return 0

    let recorde = 1
    let streakAtual = 1

    for (let i = 1; i < datasOrdenadas.length; i++) {
        const anterior = new Date(datasOrdenadas[i - 1] + 'T00:00:00')
        const atual = new Date(datasOrdenadas[i] + 'T00:00:00')
        const diffDias = Math.round((atual.getTime() - anterior.getTime()) / (1000 * 60 * 60 * 24))

        if (diffDias === 1) {
            streakAtual++
            if (streakAtual > recorde) recorde = streakAtual
        } else if (diffDias > 1) {
            streakAtual = 1
        }
        // diffDias === 0 (mesmo dia) => ignora, já contado
    }

    return recorde
}

/** Identifica próximo badge a conquistar */
function calcularProximoBadge(streakAtual: number): BadgeProximo | null {
    const proximo = BADGES.find(b => b.dias > streakAtual)
    if (!proximo) return null
    return {
        nome: proximo.nome,
        emoji: proximo.emoji,
        diasFaltando: proximo.dias - streakAtual,
    }
}

// ==========================================
// FUNÇÃO PRINCIPAL
// ==========================================

/**
 * Busca e calcula todos os dados de consistência do atleta para um ano.
 */
export async function buscarDadosConsistencia(
    atletaId: string,
    ano: number = new Date().getFullYear()
): Promise<DadosConsistencia> {
    // Buscar registros de treino do ano
    const inicioAno = `${ano}-01-01`
    const fimAno = `${ano}-12-31`

    const { data: registros, error } = await supabase
        .from('registros_diarios')
        .select('data, dados')
        .eq('atleta_id', atletaId)
        .eq('tipo', 'treino')
        .gte('data', inicioAno)
        .lte('data', fimAno)
        .order('data', { ascending: true })

    if (error) {
        console.error('[ConsistenciaService] Erro ao buscar registros:', error)
    }

    // Filtrar apenas treinos completos e extrair datas únicas
    const treinosCompletos = (registros ?? []).filter(
        (r: any) => r.dados?.status === 'completo'
    )

    const datasUnicas = [...new Set(treinosCompletos.map((r: any) => r.data as string))]
    const checkinsSet = new Set(datasUnicas)

    // Calcular streak atual
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const streakAtual = calcularStreakAtual(checkinsSet, hoje)

    // Calcular recorde
    const recorde = Math.max(streakAtual, calcularRecorde(datasUnicas))

    // Próximo badge
    const proximoBadge = calcularProximoBadge(streakAtual)

    // Métricas
    const totalTreinos = datasUnicas.length

    // Dias passados no ano até hoje
    const inicioDate = new Date(ano, 0, 1)
    const hojeFim = new Date(Math.min(hoje.getTime(), new Date(ano, 11, 31).getTime()))
    const diasPassados = Math.max(1, Math.floor((hojeFim.getTime() - inicioDate.getTime()) / (1000 * 60 * 60 * 24)) + 1)
    const consistencia = Math.round((totalTreinos / diasPassados) * 100)

    // Tempo total (soma duração de cada treino, default 60min se não informado)
    const tempoTotalMinutos = treinosCompletos.reduce((acc: number, r: any) => {
        return acc + (r.dados?.duracao ?? 60)
    }, 0)

    return {
        ano,
        checkins: datasUnicas,
        streakAtual,
        recorde,
        proximoBadge,
        totalTreinos,
        consistencia,
        tempoTotalMinutos,
    }
}
