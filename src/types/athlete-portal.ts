/**
 * Portal do Atleta - Types
 * 
 * Tipos específicos para o portal simplificado do atleta
 */

import { AthleteProfile } from './athlete'
import { ResumoDiario, TreinoDiario, Refeicao, TrackerType } from './daily-tracking'

// ==========================================
// NAVEGAÇÃO E LAYOUT
// ==========================================

export type AthletePortalTab = 'home' | 'hoje' | 'coach' | 'avalicao'

export interface BottomNavItem {
    id: AthletePortalTab
    label: string
    icon: 'Home' | 'MessageCircle' | 'TrendingUp' | 'User'
    activeIcon?: string
}

// ==========================================
// TELA HOJE (HOME)
// ==========================================

export type WorkoutStatus = 'pendente' | 'completo' | 'pulado' | 'descanso'

export interface WorkoutOfDay {
    id: string
    titulo: string              // "PEITO + TRÍCEPS"
    subtitulo?: string          // "Foco: Peitoral superior"
    diaAtual: number            // 3
    diasTotal: number           // 5
    status: WorkoutStatus
    exercicios?: ExercicioTreino[]

    // Se completo
    duracao?: number            // minutos
    intensidade?: 1 | 2 | 3 | 4 // 😫 Difícil, 😐 Normal, 💪 Bom, 🔥 Ótimo
}

export interface ExercicioTreino {
    id: string
    nome: string
    series: number
    repeticoes: string          // "10-12"
    dica?: string
    videoUrl?: string
    foco?: string              // "Peitoral superior"
}

export interface DietOfDay {
    // Metas
    metaCalorias: number
    metaProteina: number
    metaCarbos: number
    metaGordura: number

    // Consumido
    consumidoCalorias: number
    consumidoProteina: number
    consumidoCarbos: number
    consumidoGordura: number

    // Percentuais (calculados)
    percentualCalorias: number
    percentualProteina: number
    percentualCarbos: number
    percentualGordura: number
}

export type TrackerRapidoType = 'agua' | 'sono' | 'peso' | 'dor'

export interface TrackerRapido {
    id: TrackerRapidoType
    icone: string               // Emoji
    label: string
    valor?: string | number
    unidade?: string
    status: 'pendente' | 'registrado'
}

export type DicaCoachTipo = 'dica' | 'alerta' | 'elogio'

export interface DicaCoach {
    tipo: DicaCoachTipo
    mensagem: string
    acao?: {
        label: string
        callback: () => void
    }
}

export interface TodayScreenData {
    atleta: {
        nome: string
        streak: number
    }
    treino: WorkoutOfDay
    dieta: DietOfDay
    trackers: TrackerRapido[]
    dicaCoach: DicaCoach
    dataFormatada: string
}

// ==========================================
// TELA COACH (CHAT)
// ==========================================

export type ChatMessageRole = 'user' | 'assistant'

export interface ChatMessage {
    id: string
    role: ChatMessageRole
    content: string
    timestamp: Date
    status?: 'sending' | 'sent' | 'error'
}

export type AcaoRapidaChat = 'refeicao' | 'treino' | 'agua' | 'duvida'

export interface AcaoRapidaChatItem {
    id: AcaoRapidaChat
    icone: string               // Emoji
    label: string
    mensagemPadrao: string
}

// ==========================================
// TELA PROGRESSO
// ==========================================

export interface ScoreGeral {
    score: number                // 0-100
    classificacao: string        // "QUASE LÁ", "ATLÉTICO", etc.
    emoji: string               // "💪", "🔥", etc.
    variacaoVsMes: number       // +5, -2, etc.
}

export type MetricaEvolucao = 'peso' | 'bf' | 'score' | 'medida'
export type PeriodoEvolucao = '1m' | '3m' | '6m' | '1a' | 'todos'

export interface DadoEvolucao {
    data: Date
    valor: number
}

export interface GraficoEvolucaoData {
    metrica: MetricaEvolucao
    periodo: PeriodoEvolucao
    dados: DadoEvolucao[]
    meta?: number
}

export interface ProporcaoResumo {
    nome: string                // "Shape-V"
    atual: number              // 1.52
    meta: number               // 1.62
    percentual: number         // 94
    classificacao: string      // "QUASE LÁ"
    emoji: string              // "💪"
}

export interface HistoricoItemResumo {
    id: string
    data: Date
    score: number
    peso: number
    shapeV: number
}

// ==========================================
// TELA PERFIL
// ==========================================

export interface DadosBasicos {
    altura: number
    idade: number
    objetivo: string
    categoria: string
}

export interface MeuPersonal {
    id: string
    nome: string
    fotoUrl?: string
    cref: string
    telefone: string
    email: string
}

export interface ConfiguracoesAtleta {
    notificacoes: boolean
    modoEscuro: boolean
    unidadeMedida: 'cm' | 'in'
    unidadePeso: 'kg' | 'lb'
}

// ==========================================
// MODAIS
// ==========================================

export type TipoRefeicaoModal = 'cafe' | 'lanche_manha' | 'almoco' | 'lanche_tarde' | 'jantar' | 'ceia'

export interface RegistrarRefeicaoData {
    tipo: TipoRefeicaoModal
    descricao: string
    fotoUrl?: string
}

export type IntensidadeTreino = 1 | 2 | 3 | 4  // 😫 Difícil, 😐 Normal, 💪 Bom, 🔥 Ótimo
export type DuracaoTreino = 45 | 60 | 90 | 120 // minutos

export interface CompletarTreinoData {
    intensidade: IntensidadeTreino
    duracao: DuracaoTreino
    reportouDor: boolean
    observacoes?: string
}

export interface RegistrarTrackerData {
    tipo: TrackerRapidoType
    valor: number
    unidade?: string
}

// ==========================================
// ONBOARDING
// ==========================================

export type OnboardingPasso = 1 | 2 | 3 | 4

export interface OnboardingData {
    // Passo 2 - Dados básicos
    nome: string
    dataNascimento: Date
    sexo: 'MALE' | 'FEMALE'
    altura: number

    // Passo 3 - Objetivo
    objetivo: 'hipertrofia' | 'definicao' | 'recomposicao' | 'competicao'
}

export const OBJETIVO_LABELS: Record<'hipertrofia' | 'definicao' | 'recomposicao' | 'competicao', string> = {
    hipertrofia: 'Ganhar massa muscular',
    definicao: 'Perder gordura',
    recomposicao: 'Recomposição corporal',
    competicao: 'Competição'
}

export const OBJETIVO_ICONS: Record<'hipertrofia' | 'definicao' | 'recomposicao' | 'competicao', string> = {
    hipertrofia: '💪',
    definicao: '🔥',
    recomposicao: '⚖️',
    competicao: '🏆'
}

// ==========================================
// NOTIFICAÇÕES
// ==========================================

export type TipoNotificacaoAtleta =
    | 'treino_lembrete'
    | 'refeicao_almoco'
    | 'proteina_alerta'
    | 'agua_lembrete'
    | 'personal_mensagem'
    | 'checkin_semanal'

export interface NotificacaoAtleta {
    id: TipoNotificacaoAtleta
    titulo: string
    mensagem: string
    horario?: string            // "14:00"
    diasSemana?: number[]       // [0,1,2,3,4,5,6]
    tipo: 'lembrete' | 'alerta' | 'push'
    condicao?: (dados: ResumoDiario) => boolean
}

// ==========================================
// ESTADO DO PORTAL
// ==========================================

export interface AthletePortalState {
    // Navegação
    activeTab: AthletePortalTab

    // Dados do atleta
    atleta: AthleteProfile | null

    // Tela HOJE
    todayData: TodayScreenData | null

    // Tela COACH
    chatMessages: ChatMessage[]
    isTyping: boolean

    // Tela PROGRESSO
    scoreGeral: ScoreGeral | null
    evolucaoData: GraficoEvolucaoData | null
    proporcoes: ProporcaoResumo[]
    historico: HistoricoItemResumo[]

    // Tela PERFIL
    personal: MeuPersonal | null
    configuracoes: ConfiguracoesAtleta

    // Onboarding
    onboardingCompleto: boolean

    // Loading states
    isLoading: boolean
    error: string | null
}
