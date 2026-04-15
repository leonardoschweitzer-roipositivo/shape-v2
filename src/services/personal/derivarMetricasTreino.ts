/**
 * Helpers puros para derivar métricas de progressão (carga, volume) a partir
 * de registros brutos da tabela `registros_diarios`.
 *
 * Reusa `derivarHistoricoCargas` do portal do aluno para a regra de
 * "preferir séries válidas/top, fallback para qualquer com carga".
 */
import type { SupaRegistroDiario } from '@/services/portal/portalTypes'
import type { SetExecutado, PontoHistoricoCarga } from '@/types/athlete-portal'
import { derivarHistoricoCargas } from '@/services/portal/portalHoje'

export interface PontoVolume {
    data: string
    volume: number       // soma de reps × carga em todas as séries da sessão
    seriesValidas: number
    seriesTotais: number
}

function normalizarNomeExercicio(nome: string): string {
    return nome.toLowerCase().trim().replace(/\s+/g, ' ')
}

/**
 * Carga máxima por exercício ao longo do tempo, para um dado treino do plano.
 * Tenta primeiro por id posicional; se vazio, faz fallback por nome normalizado.
 */
export function derivarCargaPorExercicio(
    registros: SupaRegistroDiario[],
    treinoIndex: number,
    exercicioId: string | undefined,
    exercicioNome: string,
): PontoHistoricoCarga[] {
    const { porId, porNome } = derivarHistoricoCargas(registros, treinoIndex)
    if (exercicioId && porId[exercicioId]?.length) return porId[exercicioId]
    const chave = normalizarNomeExercicio(exercicioNome)
    return porNome[chave] ?? []
}

/**
 * Volume total por sessão (Σ reps × carga em todas as séries do treino).
 * Conta também quantas séries foram concluídas vs. totais — para mostrar
 * adesão lateralmente ao gráfico se quisermos.
 */
export function derivarVolumePorSessao(
    registros: SupaRegistroDiario[],
    treinoIndex: number,
): PontoVolume[] {
    const sessoes = registros
        .filter((r) => {
            const d = r.dados
            return d?.status === 'completo' && d?.treinoIndex === treinoIndex
        })
        .sort((a, b) => a.data.localeCompare(b.data))

    return sessoes.map((reg) => {
        const exercicios = (reg.dados?.exercicios ?? []) as Array<{
            sets?: SetExecutado[]
            carga?: number
            series?: number
        }>

        let volume = 0
        let seriesValidas = 0
        let seriesTotais = 0

        for (const ex of exercicios) {
            const sets: SetExecutado[] = Array.isArray(ex.sets) ? ex.sets : []
            seriesTotais += sets.length || (typeof ex.series === 'number' ? ex.series : 0)

            for (const s of sets) {
                const carga = s.carga ?? 0
                const reps = s.reps ?? 0
                if (s.concluido !== false && carga > 0 && reps > 0) {
                    volume += carga * reps
                    seriesValidas += 1
                }
            }
        }

        return {
            data: reg.data,
            volume: Math.round(volume),
            seriesValidas,
            seriesTotais,
        }
    })
}

/**
 * Delta percentual entre primeiro e último ponto de carga.
 * Retorna null se houver < 2 pontos.
 */
export function calcularDeltaCarga(pontos: PontoHistoricoCarga[]): number | null {
    if (pontos.length < 2) return null
    const inicio = pontos[0].cargaMax
    const fim = pontos[pontos.length - 1].cargaMax
    if (inicio === 0) return null
    return Math.round(((fim - inicio) / inicio) * 100)
}
