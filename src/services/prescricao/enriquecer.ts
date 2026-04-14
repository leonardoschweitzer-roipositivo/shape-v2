/**
 * Enriquecimento pós-geração do plano: chama IA em lote para preencher
 * prescricaoSeries de cada exercício com cargas/reps/RIR/descanso concretos.
 *
 * Roda async após gerarPlanoTreino — UI mostra o plano placeholder imediatamente
 * e atualiza quando o IA resolve.
 */

import type { PlanoTreino, Exercicio } from '../calculations/treino'
import { sugerirPrescricaoIA } from './gerarViaIA'

/**
 * Chama IA para cada exercício do plano em paralelo, atualizando prescricaoSeries.
 * Retorna uma nova instância de PlanoTreino. Se IA falhar em algum exercício,
 * mantém a prescrição atual (placeholder) — não quebra o plano.
 */
export async function enriquecerPrescricaoComIA(plano: PlanoTreino): Promise<PlanoTreino> {
    const nivel = inferirNivel(plano)
    const objetivo = plano.objetivo
    const mesociclo = plano.trimestreAtual?.mesociclos?.[0]

    const novosTreinos = await Promise.all(plano.treinos.map(async treino => {
        const novosBlocos = await Promise.all(treino.blocos.map(async bloco => {
            const exEnriquecidos = await Promise.all(bloco.exercicios.map(async (ex): Promise<Exercicio> => {
                try {
                    const repsMatch = ex.repeticoes.match(/\d+/g)
                    const repsTop = ex.topSetReps ?? (repsMatch ? Math.max(...repsMatch.map(Number)) : 10)
                    const series = await sugerirPrescricaoIA({
                        exercicioNome: ex.nome,
                        grupoMuscular: bloco.nomeGrupo,
                        nivel,
                        objetivo,
                        mesocicloNome: mesociclo?.nome,
                        rpeAlvoMesociclo: mesociclo?.rpeAlvo,
                        volumeRelativo: mesociclo?.volumeRelativo,
                        topSetKg: ex.topSetKg && ex.topSetKg > 0 ? ex.topSetKg : undefined,
                        repsTop,
                        totalSeriesDesejado: Math.max(4, ex.series || 5),
                    })
                    // Deriva topSetKg da maior carga gerada (para o personal ver a referência)
                    const topKg = series.reduce((max, s) => Math.max(max, s.cargaKg), 0)
                    return {
                        ...ex,
                        prescricaoSeries: series,
                        topSetKg: ex.topSetKg && ex.topSetKg > 0 ? ex.topSetKg : topKg,
                        topSetReps: ex.topSetReps ?? repsTop,
                    }
                } catch {
                    return ex
                }
            }))
            return { ...bloco, exercicios: exEnriquecidos }
        }))
        return { ...treino, blocos: novosBlocos }
    }))

    return { ...plano, treinos: novosTreinos }
}

function inferirNivel(_plano: PlanoTreino): 'iniciante' | 'intermediario' | 'avancado' {
    // Placeholder simples — poderia olhar para plano.visaoAnual ou scoreEsperado.
    return 'intermediario'
}
