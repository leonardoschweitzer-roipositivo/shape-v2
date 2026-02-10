/**
 * Serviço de cálculos para tela de Personal (visão Academia)
 * SPEC: tela-visao-geral-personal-academia.md
 */

import type {
    RankingPersonal,
    AlunoAtencao,
    DistribuicaoClassificacao,
    AlunoResumo
} from '@/types/personal-academy'
import { CLASSIFICACOES, MOTIVOS_ATENCAO } from '@/types/personal-academy'

interface Personal {
    id: string
    scoreMedio: number
    evolucaoMedia: number
    alunosAtivos: number
    avaliacoesMes: number
}

/**
 * Calcula o score de ranking de um personal para ordenação
 * Pesos: 40% score médio + 30% evolução + 20% alunos ativos + 10% avaliações/mês
 */
export function calcularScoreRanking(personal: Personal): number {
    const PESO_SCORE_MEDIO = 0.4
    const PESO_EVOLUCAO = 0.3
    const PESO_ALUNOS_ATIVOS = 0.2
    const PESO_AVALIACOES_MES = 0.1

    return (
        personal.scoreMedio * PESO_SCORE_MEDIO +
        personal.evolucaoMedia * 10 * PESO_EVOLUCAO +  // Normalizado
        personal.alunosAtivos * PESO_ALUNOS_ATIVOS +
        personal.avaliacoesMes * PESO_AVALIACOES_MES
    )
}

/**
 * Calcula o ranking de um personal específico dentro da academia
 */
export function calcularRankingPersonal(
    personalId: string,
    personais: Personal[]
): RankingPersonal {
    // Calcular score de ranking para cada personal
    const rankings = personais.map(p => ({
        personalId: p.id,
        scoreRanking: calcularScoreRanking(p)
    }))

    // Ordenar por score (maior primeiro)
    rankings.sort((a, b) => b.scoreRanking - a.scoreRanking)

    // Encontrar posição do personal
    const posicao = rankings.findIndex(r => r.personalId === personalId) + 1
    const totalPersonais = personais.length
    const percentil = Math.round((1 - (posicao - 1) / totalPersonais) * 100)

    // Definir medalha
    let medalha: '🥇' | '🥈' | '🥉' | null = null
    if (posicao === 1) medalha = '🥇'
    else if (posicao === 2) medalha = '🥈'
    else if (posicao === 3) medalha = '🥉'

    return {
        posicao,
        totalPersonais,
        percentil,
        medalha
    }
}

/**
 * Identifica alunos que precisam de atenção
 */
export function identificarAlunosAtencao(alunos: AlunoResumo[]): AlunoAtencao[] {
    const atencao: AlunoAtencao[] = []
    const hoje = new Date()

    for (const aluno of alunos) {
        // Regra 1: Mais de 30 dias sem avaliação
        const diasSemAvaliacao = Math.floor(
            (hoje.getTime() - new Date(aluno.ultimaAvaliacao).getTime()) / (1000 * 60 * 60 * 24)
        )

        if (diasSemAvaliacao > 30 && aluno.status === 'ATIVO') {
            atencao.push({
                id: aluno.id,
                nome: aluno.nome,
                fotoUrl: aluno.fotoUrl,
                motivo: 'SEM_AVALIACAO',
                icone: MOTIVOS_ATENCAO.SEM_AVALIACAO.icone,
                descricao: MOTIVOS_ATENCAO.SEM_AVALIACAO.template(diasSemAvaliacao),
                diasSemAvaliacao
            })
            continue
        }

        // Regra 2: Score caindo nas últimas 2 avaliações (evolucaoUltimoMes negativo)
        if (aluno.evolucaoUltimoMes < -3) {
            atencao.push({
                id: aluno.id,
                nome: aluno.nome,
                fotoUrl: aluno.fotoUrl,
                motivo: 'SCORE_CAINDO',
                icone: MOTIVOS_ATENCAO.SCORE_CAINDO.icone,
                descricao: MOTIVOS_ATENCAO.SCORE_CAINDO.template(Math.abs(aluno.evolucaoUltimoMes)),
                quedaScore: aluno.evolucaoUltimoMes
            })
            continue
        }

        // Regra 3: Inativo há mais de 30 dias
        if (aluno.status === 'INATIVO' && diasSemAvaliacao > 30) {
            atencao.push({
                id: aluno.id,
                nome: aluno.nome,
                fotoUrl: aluno.fotoUrl,
                motivo: 'INATIVO',
                icone: MOTIVOS_ATENCAO.INATIVO.icone,
                descricao: MOTIVOS_ATENCAO.INATIVO.template(diasSemAvaliacao),
                diasInativo: diasSemAvaliacao
            })
        }
    }

    return atencao
}

/**
 * Calcula a distribuição de alunos por classificação
 */
export function calcularDistribuicaoClassificacao(
    alunos: AlunoResumo[]
): DistribuicaoClassificacao[] {
    const total = alunos.length
    if (total === 0) return []

    // Contar alunos por classificação
    const contagem: Record<string, number> = {
        'ELITE': 0,
        'META': 0,
        'QUASE_LA': 0,
        'CAMINHO': 0,
        'INICIO': 0
    }

    alunos.forEach(aluno => {
        const classificacaoUpper = aluno.classificacao.toUpperCase().replace(/\s+/g, '_')
        if (classificacaoUpper in contagem) {
            contagem[classificacaoUpper]++
        }
    })

    // Criar distribuição
    return CLASSIFICACOES.map(config => ({
        classificacao: config.classificacao,
        emoji: config.emoji,
        quantidade: contagem[config.classificacao] || 0,
        percentual: total > 0 ? Math.round((contagem[config.classificacao] / total) * 100) : 0,
        corBarra: config.cor
    }))
}

/**
 * Processa dados históricos para gráficos de evolução
 */
export interface DadosEvolucaoMensal {
    scoreMedio: { periodo: string; valor: number }[]
    totalAlunos: { periodo: string; valor: number }[]
    avaliacoes: { periodo: string; valor: number }[]
}

export function calcularEvolucaoMensal(
    historico: {
        mes: string
        scoreMedio: number
        totalAlunos: number
        avaliacoes: number
    }[],
    periodo: '3_MESES' | '6_MESES' | '12_MESES'
): DadosEvolucaoMensal {
    const meses = periodo === '3_MESES' ? 3 : periodo === '6_MESES' ? 6 : 12
    const dadosRecentes = historico.slice(-meses)

    return {
        scoreMedio: dadosRecentes.map(d => ({
            periodo: d.mes,
            valor: d.scoreMedio
        })),
        totalAlunos: dadosRecentes.map(d => ({
            periodo: d.mes,
            valor: d.totalAlunos
        })),
        avaliacoes: dadosRecentes.map(d => ({
            periodo: d.mes,
            valor: d.avaliacoes
        }))
    }
}

/**
 * Calcula tendência de um conjunto de dados
 */
export function calcularTendencia(
    dados: number[]
): { valor: number; direcao: 'UP' | 'DOWN' | 'STABLE' } {
    if (dados.length < 2) {
        return { valor: 0, direcao: 'STABLE' }
    }

    // Calcular tendência linear simples
    const n = dados.length
    const x = Array.from({ length: n }, (_, i) => i)
    const y = dados

    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0)
    const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)

    // Determinar direção
    let direcao: 'UP' | 'DOWN' | 'STABLE' = 'STABLE'
    if (slope > 0.5) direcao = 'UP'
    else if (slope < -0.5) direcao = 'DOWN'

    return {
        valor: parseFloat(slope.toFixed(2)),
        direcao
    }
}
