/**
 * Tipos do Portal do Personal — VITRU IA
 *
 * Espelha a filosofia do Portal do Atleta: Mobile First, essencial para o dia-a-dia.
 */

// ===== Navegação =====

export type PersonalPortalTab = 'home' | 'alunos' | 'alertas' | 'perfil'

// ===== Aluno Resumido (para lista e cards) =====

export type StatusAluno = 'ATIVO' | 'ATENCAO' | 'INATIVO'

export interface AlunoCard {
    id: string
    nome: string
    email: string
    fotoUrl?: string | null
    score: number
    nivel: string | null
    status: StatusAluno
    ultimaMedicao: string | null // ISO date string
    evolucaoSemana: number       // delta de pontos na semana, ex: +8.2 ou -2.1
    streak: number
    checkinsMes: number
    totalDiasMes: number
}

// ===== Ficha Rápida do Aluno =====

export interface ProporçãoResumo {
    nome: string
    valor: number         // valor atual em cm
    valorAnterior: number // valor anterior (0 se não tem histórico)
    meta: number
    percentual: number    // 0-100 relativo à meta
}

export interface FichaAlunoResumo {
    id: string
    nome: string
    email: string
    telefone?: string | null
    fotoUrl?: string | null
    score: number
    nivel: string | null
    evolucaoSemana: number
    streak: number
    checkinsMes: number
    totalDiasMes: number
    proporcoes: ProporçãoResumo[]    // top 3-4 métricas
    insightIA?: string | null        // gerado sob demanda pelo Vitruvius
    pessoalId: string
    sexo?: 'M' | 'F'
    altura?: number
    peso?: number
    gorduraPct?: number
    massaMagra?: number
    scoreMeta3M?: number
    scoreMeta6M?: number
    scoreMeta12M?: number
    checkins: string[]
    // Métricas de Consistência (Athlete Standard)
    consistencia: number
    recorde: number
    totalTreinos: number
    tempoTotalMinutos: number
    proximoBadge?: {
        nome: string
        emoji: string
        diasFaltando: number
    } | null
    // Dados para Metas do Trimestre
    medidas?: any
    diagnosticoDados?: any
    ultimosRegistros: RegistroAtividade[]
    metasProporcoes: MetaProporcao[]
}

export interface RegistroAtividade {
    id: string
    tipo: 'TREINO' | 'REFEICAO' | 'AGUA' | 'SONO' | 'PESO' | 'DOR' | 'FEEDBACK'
    data: string
    valor: string | number
    descricao?: string
    emoji?: string
}

export interface MetaProporcao {
    grupo: string
    atual: number
    meta3M: number
    meta6M: number
    meta9M: number
    meta12M: number
    idealFinal: number
}

// ===== Contexto do Portal =====

export interface PersonalPortalContext {
    personalId: string
    nome: string
    email: string
    fotoUrl?: string | null
    totalAlunos: number
    alunosAtivos: number
    alunosAtencao: number
    alunosInativos: number
    scoreMedio: number
}

// ===== Atividade Recente =====

export type TipoAtividade = 'TREINO_COMPLETO' | 'TREINO_PULADO' | 'NOVA_MEDICAO' | 'FEEDBACK' | 'REGISTRO_RAPIDO'

export interface AtividadeRecente {
    id: string
    tipo: TipoAtividade
    alunoId: string
    alunoNome: string
    descricao: string
    criadoEm: string // ISO date string
}
