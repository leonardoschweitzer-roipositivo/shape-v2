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
}

// ===== Ficha Rápida do Aluno =====

export interface ProporçãoResumo {
    nome: string
    valor: number
    meta: number
    percentual: number // 0-100
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
