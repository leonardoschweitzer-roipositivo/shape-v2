/**
 * Tipos do Sistema de Notificações do Personal — VITRU IA
 */

// ===== Categorias =====

export type CategoriaNotificacao = 'treino' | 'medidas' | 'conquistas' | 'portal' | 'resumo'

// ===== Tipos de Evento =====

export type TipoNotificacao =
    // Treino
    | 'TREINO_COMPLETO'
    | 'TREINO_PULADO'
    | 'STREAK_ALUNO'
    | 'STREAK_QUEBRADA'
    | 'SEM_TREINO_3D'
    | 'SEM_TREINO_7D'
    // Medidas
    | 'NOVA_MEDICAO_PORTAL'
    | 'SCORE_SUBIU'
    | 'SCORE_CAIU'
    | 'GORDURA_REDUZIDA'
    | 'GORDURA_AUMENTOU'
    | 'SHAPE_V_MELHOROU'
    | 'ASSIMETRIA_DETECTADA'
    | 'ASSIMETRIA_CORRIGIDA'
    | 'SEM_MEDICAO_14D'
    | 'SEM_MEDICAO_30D'
    // Conquistas
    | 'META_ATINGIDA'
    | 'MUDOU_CLASSIFICACAO'
    | 'TOP_RANKING'
    | 'RECORDE_PESSOAL'
    | 'MELHOR_MES'
    | 'PESO_META'
    | 'PROPORCAO_IDEAL'
    // Portal
    | 'PRIMEIRO_ACESSO'
    | 'ACESSO_PORTAL'
    | 'PORTAL_INATIVO_7D'
    | 'PORTAL_INATIVO_30D'
    | 'DOR_REPORTADA'
    | 'CONTEXTO_PREENCHIDO'
    | 'REGISTRO_RAPIDO'
    | 'FEEDBACK_TREINO'
    // Resumos
    | 'RESUMO_DIARIO'
    | 'RESUMO_SEMANAL'
    | 'RESUMO_MENSAL'

// ===== Prioridade =====

export type PrioridadeNotificacao = 'urgente' | 'alerta' | 'destaque' | 'normal' | 'baixa'

// ===== Interfaces =====

export interface Notificacao {
    id: string
    personal_id: string
    atleta_id?: string | null

    tipo: TipoNotificacao
    categoria: CategoriaNotificacao
    prioridade: PrioridadeNotificacao

    titulo: string
    mensagem: string
    dados?: Record<string, unknown> | null

    lida: boolean
    lida_em?: string | null

    acao_url?: string | null
    acao_label?: string | null

    grupo_id?: string | null
    agrupada: boolean

    created_at: string
    expires_at?: string | null

    // Campos derivados (join com atletas — preenchidos no frontend)
    atleta_nome?: string
    atleta_foto?: string
}

export interface CriarNotificacaoDTO {
    personal_id: string
    atleta_id?: string
    tipo: TipoNotificacao
    categoria: CategoriaNotificacao
    prioridade: PrioridadeNotificacao
    titulo: string
    mensagem: string
    dados?: Record<string, unknown>
    acao_url?: string
    acao_label?: string
    grupo_id?: string
    agrupada?: boolean
}

// ===== Filtros =====

export interface FiltroNotificacao {
    categoria?: CategoriaNotificacao
    prioridade?: PrioridadeNotificacao
    periodo?: 'hoje' | 'semana' | 'mes' | 'tudo'
    lida?: boolean
    atletaId?: string
    busca?: string
    limit?: number
    offset?: number
}

// ===== Configuração =====

export interface ConfigTreinoNotificacao {
    ativo: boolean
    agrupar: boolean
    alertarPulados: boolean
    alertarInatividade: boolean
}

export interface ConfigMedidasNotificacao {
    ativo: boolean
    alertarRegressao: boolean
    alertarInatividade: boolean
}

export interface ConfigConquistasNotificacao {
    ativo: boolean
}

export interface ConfigPortalNotificacao {
    ativo: boolean
    alertarInatividade: boolean
    notificarDor: boolean
}

export interface ConfigResumosNotificacao {
    diario: boolean
    semanal: boolean
    mensal: boolean
}

export interface ConfigNotificacoesPersonal {
    treino: ConfigTreinoNotificacao
    medidas: ConfigMedidasNotificacao
    conquistas: ConfigConquistasNotificacao
    portal: ConfigPortalNotificacao
    resumos: ConfigResumosNotificacao
    horarioInicio: string
    horarioFim: string
    canalPrincipal: 'in_app' | 'push' | 'email'
}

// ===== Constantes de Prioridade =====

export const PRIORIDADE_CONFIG: Record<PrioridadeNotificacao, {
    cor: string
    icone: string
    badge: boolean
}> = {
    urgente: { cor: '#EF4444', icone: '🚨', badge: true },
    alerta: { cor: '#F59E0B', icone: '⚠️', badge: true },
    destaque: { cor: '#22C55E', icone: '🌟', badge: true },
    normal: { cor: '#3B82F6', icone: 'ℹ️', badge: true },
    baixa: { cor: '#6B7280', icone: '📝', badge: false },
}

// ===== Constantes de Categoria =====

export const CATEGORIA_CONFIG: Record<CategoriaNotificacao, {
    label: string
    icone: string
    cor: string
}> = {
    treino: { label: 'Treino', icone: '🏋️', cor: '#3B82F6' },
    medidas: { label: 'Medidas', icone: '📏', cor: '#8B5CF6' },
    conquistas: { label: 'Conquistas', icone: '🏆', cor: '#F59E0B' },
    portal: { label: 'Portal', icone: '👤', cor: '#22C55E' },
    resumo: { label: 'Resumos', icone: '📊', cor: '#6B7280' },
}
