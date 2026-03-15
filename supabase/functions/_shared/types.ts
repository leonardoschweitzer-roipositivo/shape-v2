/**
 * VITRU IA — Tipos Compartilhados
 * 
 * Definições de tipos TypeScript para todas as Edge Functions.
 * Baseado no schema do banco de dados Supabase.
 * 
 * @version 1.0.0
 */

// ═══════════════════════════════════════════════════════════════
// ENUMS (Baseados no banco de dados)
// ═══════════════════════════════════════════════════════════════

export type UserRole = 'ATLETA' | 'PERSONAL' | 'ACADEMIA'

export type StatusTipo = 'ativo' | 'inativo' | 'pendente' | 'suspenso'

export type SexoTipo = 'M' | 'F'

export type ObjetivoTipo =
    | 'hipertrofia'
    | 'emagrecimento'
    | 'condicionamento'
    | 'saude'
    | 'performance'

export type CategoriaTipo =
    | 'bodybuilding'
    | 'classic_physique'
    | 'mens_physique'
    | 'wellness'
    | 'bikini'
    | 'figure'

export type ClassificacaoTipo =
    | 'elite'
    | 'meta'
    | 'quase_la'
    | 'caminho'
    | 'inicio'

export type RegistroTipo =
    | 'treino'
    | 'refeicao'
    | 'checkin'
    | 'medida'
    | 'foto'

// ═══════════════════════════════════════════════════════════════
// ENTIDADES PRINCIPAIS
// ═══════════════════════════════════════════════════════════════

export interface Academia {
    id: string
    auth_user_id: string
    nome: string
    razao_social?: string
    cnpj?: string
    email: string
    telefone?: string
    endereco_rua?: string
    endereco_numero?: string
    endereco_complemento?: string
    endereco_bairro?: string
    endereco_cidade?: string
    endereco_estado?: string
    endereco_cep?: string
    plano?: string
    limite_personais?: number
    limite_atletas?: number
    logo_url?: string
    status: StatusTipo
    data_vencimento?: string
    created_at: string
    updated_at: string
}

export interface Personal {
    id: string
    auth_user_id: string
    academia_id?: string
    nome: string
    email: string
    telefone?: string
    cpf?: string
    cref?: string
    foto_url?: string
    plano?: string
    limite_atletas?: number
    status: StatusTipo
    data_vinculo?: string
    created_at: string
    updated_at: string
}

export interface Atleta {
    id: string
    auth_user_id?: string
    personal_id: string
    academia_id?: string
    nome: string
    email?: string
    telefone?: string
    foto_url?: string
    portal_token?: string
    portal_token_expira?: string
    portal_acessos?: number
    portal_ultimo_acesso?: string
    status: StatusTipo
    created_at: string
    updated_at: string
}

export interface Ficha {
    id: string
    atleta_id: string
    data_nascimento?: string
    sexo?: SexoTipo
    altura?: number
    punho?: number
    tornozelo?: number
    joelho?: number
    pelve?: number
    objetivo?: ObjetivoTipo
    categoria_preferida?: CategoriaTipo
    observacoes?: string
    restricoes?: string[]
    contexto?: Record<string, any>
    onboarding_completo?: boolean
    metodo_medidas?: string
    nivel_atividade?: string
    created_at: string
    updated_at: string
}

// ═══════════════════════════════════════════════════════════════
// MEDIDAS E AVALIAÇÕES
// ═══════════════════════════════════════════════════════════════

export interface Medidas {
    id: string
    atleta_id: string
    data: string
    peso?: number
    gordura_corporal?: number
    // Circunferências
    ombros?: number
    peitoral?: number
    cintura?: number
    quadril?: number
    abdomen?: number
    pescoco?: number
    // Membros (bilateral)
    braco_esquerdo?: number
    braco_direito?: number
    antebraco_esquerdo?: number
    antebraco_direito?: number
    coxa_esquerda?: number
    coxa_direita?: number
    panturrilha_esquerda?: number
    panturrilha_direita?: number
    // Dobras cutâneas
    dobra_tricipital?: number
    dobra_subescapular?: number
    dobra_peitoral?: number
    dobra_axilar_media?: number
    dobra_suprailiaca?: number
    dobra_abdominal?: number
    dobra_coxa?: number
    // Scores calculados
    score?: number
    ratio?: number
    // Metadata
    registrado_por?: string
    personal_id?: string
    created_at: string
}

export interface Avaliacao {
    id: string
    atleta_id: string
    medidas_id?: string
    data: string
    peso?: number
    gordura_corporal?: number
    massa_magra?: number
    massa_gorda?: number
    imc?: number
    ffmi?: number
    score_geral?: number
    classificacao_geral?: ClassificacaoTipo
    proporcoes?: Record<string, any>
    simetria?: Record<string, any>
    comparacao_anterior?: Record<string, any>
    created_at: string
}

// ═══════════════════════════════════════════════════════════════
// TREINO E DIETA
// ═══════════════════════════════════════════════════════════════

export interface PlanoTreino {
    id: string
    atleta_id: string
    personal_id?: string
    diagnostico_id?: string
    dados: Record<string, any>
    status: string
    created_at: string
}

export interface PlanoDieta {
    id: string
    atleta_id: string
    personal_id?: string
    diagnostico_id?: string
    dados: Record<string, any>
    status: string
    created_at: string
}

export interface ExercicioBiblioteca {
    id: string
    nome: string
    nome_alternativo?: string
    grupo_muscular: string
    subgrupo?: string
    equipamento?: string
    nivel?: string
    url_video?: string
    thumbnail_url?: string
    duracao_video_seg?: number
    descricao?: string
    instrucoes?: string[]
    dicas?: string[]
    erros_comuns?: string[]
    em_breve?: boolean
    ativo: boolean
    created_at: string
    updated_at: string
}

// ═══════════════════════════════════════════════════════════════
// REGISTROS E ACOMPANHAMENTO
// ═══════════════════════════════════════════════════════════════

export interface RegistroDiario {
    id: string
    atleta_id: string
    data: string
    tipo: string
    dados: Record<string, any>
    created_at: string
}

export interface Registro {
    id: string
    atleta_id: string
    data: string
    tipo: RegistroTipo
    dados: Record<string, any>
    origem?: string
    created_at: string
}

export interface ChatMessage {
    id: string
    atleta_id: string
    role: 'user' | 'assistant' | 'system'
    content: string
    metadata?: Record<string, any>
    created_at: string
}

// ═══════════════════════════════════════════════════════════════
// VIEWS (KPIs)
// ═══════════════════════════════════════════════════════════════

export interface KPIsAcademia {
    academia_id: string
    academia_nome: string
    total_personais: number
    personais_ativos: number
    total_atletas: number
    atletas_ativos: number
    score_medio: number
    avaliacoes_mes: number
}

export interface KPIsPersonal {
    personal_id: string
    personal_nome: string
    total_atletas: number
    atletas_ativos: number
    atletas_inativos: number
    score_medio: number
    avaliacoes_mes: number
    atletas_elite: number
    atletas_meta: number
    atletas_quase_la: number
    atletas_caminho: number
    atletas_inicio: number
}

export interface AtletaComAvaliacao {
    id: string
    nome: string
    foto_url?: string
    personal_id: string
    personal_nome: string
    academia_id?: string
    status: StatusTipo
    created_at: string
    ultima_avaliacao_data?: string
    score_geral?: number
    classificacao_geral?: ClassificacaoTipo
    peso?: number
    dias_desde_avaliacao?: number
}

// ═══════════════════════════════════════════════════════════════
// REQUESTS E RESPONSES
// ═══════════════════════════════════════════════════════════════

export interface BaseRequest {
    /** UUID do auth.users do solicitante */
    auth_user_id: string
    /** Role do solicitante (opcional, será descoberto automaticamente) */
    role?: UserRole
}

export interface AtletaRequest extends BaseRequest {
    /** UUID do atleta alvo (opcional para buscas) */
    atleta_id?: string
    /** Nome do atleta (para busca por texto) */
    nome?: string
}

export interface GestaoRequest extends BaseRequest {
    /** UUID da academia (obrigatório para gestão) */
    academia_id?: string
}

export interface SuccessResponse<T = any> {
    success: true
    data: T
}

export interface ErrorResponse {
    success: false
    error: {
        code: string
        message: string
    }
}

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse

// ═══════════════════════════════════════════════════════════════
// SCORES E CÁLCULOS (φ - Razão Áurea)
// ═══════════════════════════════════════════════════════════════

export interface ProporcoesAureas {
    /** Proporção Ombros/Cintura (ideal ≈ φ = 1.618) */
    ombros_cintura: number
    /** Proporção Peito/Cintura (ideal ≈ φ) */
    peito_cintura: number
    /** Proporção Coxa/Panturrilha (ideal ≈ φ) */
    coxa_panturrilha: number
    /** Score geral de proporções (0-100) */
    score_proporcoes: number
}

export interface Simetria {
    /** Diferença % entre braços */
    bracos_diff: number
    /** Diferença % entre antebraços */
    antebracos_diff: number
    /** Diferença % entre coxas */
    coxas_diff: number
    /** Diferença % entre panturrilhas */
    panturrilhas_diff: number
    /** Score geral de simetria (0-100) */
    score_simetria: number
}

export interface ScoreShape {
    /** Score de proporções áureas (0-100) */
    proporcoes: number
    /** Score de simetria bilateral (0-100) */
    simetria: number
    /** Score de composição corporal (0-100) */
    composicao: number
    /** Score geral ponderado (0-100) */
    geral: number
    /** Classificação baseada no score */
    classificacao: ClassificacaoTipo
}

/** Constante φ (Phi) - Razão Áurea */
export const PHI = 1.618033988749895