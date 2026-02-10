/**
 * Tipos e interfaces para a tela de visualização do Personal pela Academia
 * SPEC: tela-visao-geral-personal-academia.md
 */

/**
 * Dados básicos do Personal
 */
export interface PersonalBasico {
    id: string
    nome: string
    fotoUrl?: string
    email: string
    telefone: string
    cpf: string
    cref: string
    status: 'ATIVO' | 'INATIVO'
    dataVinculo: Date
    diasNaAcademia: number
}

/**
 * KPIs de desempenho do Personal
 */
export interface KPIsPersonal {
    // Alunos
    alunos: {
        total: number
        ativos: number
        inativos: number
        novosEsteMes: number
    }

    // Score
    score: {
        medio: number
        evolucaoMensal: number      // +/- pts por mês
        tendencia: 'SUBINDO' | 'ESTAVEL' | 'CAINDO'
    }

    // Avaliações
    avaliacoes: {
        esteMes: number
        mesPassado: number
        total: number
        variacaoPercentual: number  // % de variação mês a mês
    }

    // Classificações
    classificacoes: {
        elite: number
        meta: number
        quaseLa: number
        caminho: number
        inicio: number
    }
}

/**
 * Ranking do Personal na Academia
 */
export interface RankingPersonal {
    posicao: number           // 1, 2, 3, etc
    totalPersonais: number    // Total de personais na academia
    percentil: number         // Top X%
    medalha?: '🥇' | '🥈' | '🥉' | null
}

/**
 * Distribuição de alunos por classificação
 */
export interface DistribuicaoClassificacao {
    classificacao: 'ELITE' | 'META' | 'QUASE_LA' | 'CAMINHO' | 'INICIO'
    emoji: string
    quantidade: number
    percentual: number
    corBarra: string
}

/**
 * Resumo de aluno para listagem
 */
export interface AlunoResumo {
    id: string
    nome: string
    fotoUrl?: string
    score: number
    classificacao: string
    ultimaAvaliacao: Date
    evolucaoUltimoMes: number
    status: 'ATIVO' | 'INATIVO'
}

/**
 * Estrutura para Top Alunos (ranking)
 */
export interface TopAluno {
    posicao: number
    medalha?: '🥇' | '🥈' | '🥉'
    aluno: {
        id: string
        nome: string
        fotoUrl?: string
        score: number
        classificacao: string
        emoji: string
    }
}

/**
 * Aluno que precisa de atenção
 */
export interface AlunoAtencao {
    id: string
    nome: string
    fotoUrl?: string

    motivo: 'SEM_AVALIACAO' | 'SCORE_CAINDO' | 'INATIVO'
    icone: '⚠️' | '📉' | '🔴'
    descricao: string

    // Dados específicos
    diasSemAvaliacao?: number
    quedaScore?: number
    diasInativo?: number
}

/**
 * Evolução histórica do Personal
 */
export interface EvolucaoPersonal {
    scoreMedioPorMes: { mes: string; valor: number }[]
    totalAlunosPorMes: { mes: string; valor: number }[]
    avaliacoesPorMes: { mes: string; valor: number }[]
}

/**
 * Dados completos do detalhe do Personal para visualização pela Academia
 */
export interface DetalhePersonalAcademia {
    // Dados do Personal
    personal: PersonalBasico

    // KPIs Principais
    kpis: KPIsPersonal

    // Ranking na Academia
    ranking: RankingPersonal

    // Lista de Alunos (resumida)
    alunos: AlunoResumo[]

    // Top Alunos (5 melhores)
    topAlunos: TopAluno[]

    // Alunos que precisam de atenção
    alunosAtencao: AlunoAtencao[]

    // Evolução histórica
    evolucao: EvolucaoPersonal

    // Distribuição de classificações
    distribuicao: DistribuicaoClassificacao[]
}

/**
 * Constantes de classificação
 */
export const CLASSIFICACOES = [
    { classificacao: 'ELITE' as const, emoji: '👑', cor: '#FFD700', label: 'Elite' },
    { classificacao: 'META' as const, emoji: '🎯', cor: '#10B981', label: 'Meta' },
    { classificacao: 'QUASE_LA' as const, emoji: '💪', cor: '#3B82F6', label: 'Quase Lá' },
    { classificacao: 'CAMINHO' as const, emoji: '🛤️', cor: '#8B5CF6', label: 'Caminho' },
    { classificacao: 'INICIO' as const, emoji: '🚀', cor: '#6B7280', label: 'Início' },
]

/**
 * Motivos de atenção para alunos
 */
export const MOTIVOS_ATENCAO = {
    SEM_AVALIACAO: {
        icone: '⚠️' as const,
        regra: 'Mais de 30 dias sem avaliação',
        template: (dias: number) => `${dias} dias sem avaliação`
    },
    SCORE_CAINDO: {
        icone: '📉' as const,
        regra: 'Score caiu nas últimas 2 avaliações',
        template: (pts: number) => `Score caindo (${pts} pts)`
    },
    INATIVO: {
        icone: '🔴' as const,
        regra: 'Status inativo há mais de 30 dias',
        template: (dias: number) => `Inativo há ${dias} dias`
    }
}
