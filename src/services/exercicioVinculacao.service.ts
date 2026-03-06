/**
 * exercicioVinculacao.service.ts
 *
 * Serviço responsável por vincular exercícios de um treino gerado
 * aos vídeos da Biblioteca de Exercícios, usando busca por nome similar.
 *
 * Etapa 4 do Plano de Upload de Vídeos.
 */

import { supabase } from '@/services/supabase'
import type { ExercicioBiblioteca } from '@/types/exercicio-biblioteca'
import type { Exercicio, PlanoTreino, TreinoDetalhado } from '@/services/calculations/treino'

/**
 * Normaliza um nome de exercício para melhorar o matching.
 * Remove acentos, converte para lowercase, normaliza abreviações.
 */
function normalizarNome(nome: string): string {
    return nome
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove acentos
        .replace(/\s+/g, ' ')
        .trim()
}

/**
 * Cache local da biblioteca para evitar N+1 queries.
 * Carregada uma vez e reutilizada durante a vinculação.
 */
let _cacheBiblioteca: ExercicioBiblioteca[] | null = null

async function carregarBiblioteca(): Promise<ExercicioBiblioteca[]> {
    if (_cacheBiblioteca) return _cacheBiblioteca

    const { data, error } = await supabase
        .from('exercicios_biblioteca')
        .select('id, nome, nome_alternativo, url_video, grupo_muscular')
        .eq('ativo', true)

    if (error) {
        console.error('[vinculacao] Erro ao carregar biblioteca:', error.message)
        return []
    }

    _cacheBiblioteca = (data || []) as ExercicioBiblioteca[]
    return _cacheBiblioteca
}

/** Invalida o cache (chamado quando o GOD faz upload de vídeo) */
export function invalidarCacheBiblioteca(): void {
    _cacheBiblioteca = null
}

/**
 * Encontra o melhor match na biblioteca para um nome de exercício.
 * Estratégia:
 *   1. Match exato (normalizado)
 *   2. Match parcial (nome do plano contido no nome da biblioteca ou vice-versa)
 *   3. Match pelo nome_alternativo
 */
function encontrarMatch(
    nomeExercicio: string,
    biblioteca: ExercicioBiblioteca[]
): ExercicioBiblioteca | null {
    const nomeNorm = normalizarNome(nomeExercicio)

    // 1. Match exato
    const exato = biblioteca.find(ex =>
        normalizarNome(ex.nome) === nomeNorm
    )
    if (exato) return exato

    // 2. Match parcial (containment)
    const parcial = biblioteca.find(ex => {
        const nBib = normalizarNome(ex.nome)
        return nBib.includes(nomeNorm) || nomeNorm.includes(nBib)
    })
    if (parcial) return parcial

    // 3. Match pelo nome_alternativo
    const alternativo = biblioteca.find(ex => {
        if (!ex.nome_alternativo) return false
        const nAlt = normalizarNome(ex.nome_alternativo)
        return nAlt === nomeNorm || nAlt.includes(nomeNorm) || nomeNorm.includes(nAlt)
    })
    if (alternativo) return alternativo

    // 4. Fallback: match por palavras-chave (pelo menos 2 palavras em comum)
    const palavrasExercicio = nomeNorm.split(' ').filter(p => p.length > 2)
    if (palavrasExercicio.length >= 2) {
        let melhorMatch: ExercicioBiblioteca | null = null
        let melhorScore = 0

        for (const ex of biblioteca) {
            const palavrasBib = normalizarNome(ex.nome).split(' ').filter(p => p.length > 2)
            const comuns = palavrasExercicio.filter(p => palavrasBib.includes(p)).length
            if (comuns >= 2 && comuns > melhorScore) {
                melhorScore = comuns
                melhorMatch = ex
            }
        }

        return melhorMatch
    }

    return null
}

/**
 * Vincula exercícios de um treino ao seus correspondentes na biblioteca.
 * Retorna os exercícios com `bibliotecaId` e `urlVideo` preenchidos quando
 * houver match.
 */
export async function vincularExercicios(exercicios: Exercicio[]): Promise<Exercicio[]> {
    const biblioteca = await carregarBiblioteca()

    if (biblioteca.length === 0) return exercicios

    return exercicios.map(ex => {
        // Já vinculado? Pula
        if (ex.bibliotecaId) return ex

        const match = encontrarMatch(ex.nome, biblioteca)

        if (match) {
            return {
                ...ex,
                bibliotecaId: match.id,
                urlVideo: match.url_video || undefined,
            }
        }

        return ex
    })
}

/**
 * Vincula todos os exercícios de um PlanoTreino completo.
 * Percorre todos os treinos e blocos, vinculando cada exercício.
 */
export async function vincularPlanoTreino(plano: PlanoTreino): Promise<PlanoTreino> {
    const biblioteca = await carregarBiblioteca()

    if (biblioteca.length === 0) return plano

    const treinosVinculados: TreinoDetalhado[] = plano.treinos.map(treino => ({
        ...treino,
        blocos: treino.blocos.map(bloco => ({
            ...bloco,
            exercicios: bloco.exercicios.map(ex => {
                if (ex.bibliotecaId) return ex

                const match = encontrarMatch(ex.nome, biblioteca)
                if (match) {
                    return {
                        ...ex,
                        bibliotecaId: match.id,
                        urlVideo: match.url_video || undefined,
                    }
                }
                return ex
            }),
        })),
    }))

    return {
        ...plano,
        treinos: treinosVinculados,
    }
}
