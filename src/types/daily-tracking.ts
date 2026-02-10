/**
 * Daily Tracking Types
 * 
 * Tipos para o sistema de acompanhamento diário do Coach IA
 */
import React from 'react'

// ==========================================
// TRACKER TYPES
// ==========================================

export type TrackerType =
    | 'refeicao'
    | 'treino'
    | 'agua'
    | 'sono'
    | 'dor'
    | 'suplemento'
    | 'peso'
    | 'energia'

export type TrackerStatus = 'pendente' | 'parcial' | 'completo' | 'alerta'

export interface TrackerButton {
    id: TrackerType
    icon: string | React.ReactNode
    label: string
    status: TrackerStatus

    // Dados de progresso (opcional)
    atual?: number
    meta?: number
    unidade?: string

    // Dados específicos
    detalhe?: string              // "PEITO", "7h", etc.
    horario?: string              // "14:00"

    // Visual
    corBorda: string
    corFundo: string
    corIcone: string
}

// ==========================================
// REFEIÇÃO
// ==========================================

export type TipoRefeicao =
    | 'cafe'
    | 'lanche_manha'
    | 'almoco'
    | 'lanche_tarde'
    | 'jantar'
    | 'ceia'
    | 'outro'

export interface Alimento {
    nome: string
    quantidade: number
    unidade: 'g' | 'ml' | 'unidade' | 'colher' | 'xicara'
    calorias: number
    proteina: number
    carboidrato: number
    gordura: number
}

export interface Refeicao {
    id: string
    atletaId: string
    data: Date
    tipo: TipoRefeicao
    horario: Date

    // Descrição
    descricao?: string
    fotoUrl?: string

    // Macros (calculados ou inputados)
    calorias: number
    proteina: number
    carboidrato: number
    gordura: number
    fibra?: number

    // Alimentos detalhados (opcional)
    alimentos?: Alimento[]

    // Metadata
    fonte: 'manual' | 'foto_ia' | 'busca' | 'favorito'
    confianca?: number              // 0-100% (para estimativas da IA)

    createdAt: Date
    updatedAt: Date
}

// ==========================================
// TREINO DIÁRIO
// ==========================================

export interface ExercicioExecutado {
    exercicioId: string
    nome: string
    series: {
        repeticoes: number
        carga: number
        unidade: 'kg' | 'lb'
        rpe?: number                // Rate of Perceived Exertion 1-10
    }[]
}

export interface TreinoDiario {
    id: string
    atletaId: string
    data: Date

    // Treino planejado
    treinoPlanoId?: string          // Referência ao plano de treino
    grupamento: string              // "Peito + Tríceps"

    // Status
    status: 'pendente' | 'completo' | 'parcial' | 'pulado' | 'substituido'
    seguiuPlano: boolean

    // Execução
    horarioInicio?: Date
    horarioFim?: Date
    duracao?: number                // minutos

    // Feedback
    intensidadePercebida: 1 | 2 | 3 | 4   // 1=difícil, 4=excelente
    energiaDurante: number          // 1-10

    // Cargas (opcional - para tracking de progressão)
    exerciciosExecutados?: ExercicioExecutado[]

    // Dor/Desconforto
    reportouDor: boolean
    dorId?: string                  // Referência ao registro de dor

    // Observações
    observacoes?: string

    createdAt: Date
    updatedAt: Date
}

// ==========================================
// ÁGUA
// ==========================================

export interface RegistroAgua {
    id: string
    atletaId: string
    data: Date
    horario: Date
    quantidade: number              // ml

    createdAt: Date
}

// ==========================================
// SONO
// ==========================================

export interface RegistroSono {
    id: string
    atletaId: string
    data: Date                      // Data de referência (dia que acordou)

    horarioDormiu: Date
    horarioAcordou: Date
    duracaoTotal: number            // minutos

    qualidade: 1 | 2 | 3 | 4 | 5    // 1=péssimo, 5=excelente
    acordouDuranteNoite: 0 | 1 | 2 | 3  // vezes

    energiaAoAcordar: number        // 1-10

    observacoes?: string

    createdAt: Date
    updatedAt: Date
}

// ==========================================
// DOR / LESÃO
// ==========================================

export type TipoDor = 'aguda' | 'latejante' | 'queimacao' | 'formigamento' | 'outro'

export type RegiaoDor =
    | 'cabeca'
    | 'pescoco'
    | 'ombro_esquerdo'
    | 'ombro_direito'
    | 'peito'
    | 'lombar'
    | 'braco_esquerdo'
    | 'braco_direito'
    | 'antebraco_esquerdo'
    | 'antebraco_direito'
    | 'coxa_esquerda'
    | 'coxa_direita'
    | 'joelho_esquerdo'
    | 'joelho_direito'
    | 'panturrilha_esquerda'
    | 'panturrilha_direita'

export interface RegistroDor {
    id: string
    atletaId: string

    // Localização
    regiao: RegiaoDor
    lado?: 'esquerdo' | 'direito' | 'bilateral' | 'central'

    // Características
    intensidade: number             // 1-10
    tipo: TipoDor

    // Temporal
    dataInicio: Date
    duracaoEstimada?: 'hoje' | 'ontem' | 'esta_semana' | 'mais_tempo'

    // Gatilhos
    pioraCom: string[]              // ["movimento", "carga", "frio", etc.]

    // Status
    ativa: boolean
    dataResolucao?: Date

    // Descrição
    descricao?: string

    // Impacto no treino
    exerciciosAfetados?: string[]   // ["supino", "desenvolvimento", etc.]

    createdAt: Date
    updatedAt: Date
}

// ==========================================
// RESUMO DIÁRIO (agregação)
// ==========================================

export interface ResumoDiario {
    id: string
    atletaId: string
    data: Date

    // Nutrição
    nutricao: {
        refeicoes: number
        totalCalorias: number
        totalProteina: number
        totalCarboidrato: number
        totalGordura: number
        metaCalorias: number
        metaProteina: number
        metaCarboidrato: number
        metaGordura: number
        aderenciaPercentual: number
    }

    // Hidratação
    hidratacao: {
        totalMl: number
        metaMl: number
        aderenciaPercentual: number
    }

    // Treino
    treino: {
        planejado: boolean
        realizado: boolean
        tipo?: string
        duracao?: number
        intensidade?: number
    }

    // Sono (da noite anterior)
    sono: {
        horas: number
        qualidade: number
        energiaResultante: number
    }

    // Dores ativas
    doresAtivas: number

    // Score do dia (0-100)
    scoreDia: number

    // Streak
    streakAtual: number

    createdAt: Date
    updatedAt: Date
}

// ==========================================
// INSIGHTS
// ==========================================

export type TipoInsight = 'alerta' | 'dica' | 'elogio' | 'lembrete'

export interface Insight {
    tipo: TipoInsight
    prioridade: 1 | 2 | 3 | 4 | 5    // 1 = mais urgente
    icone: string
    mensagem: string
    acao?: {
        label: string
        callback: () => void
    }
}

// ==========================================
// NOTIFICAÇÕES
// ==========================================

export interface NotificationConfig {
    id: string
    tipo: TrackerType | 'geral'
    titulo: string
    mensagem: string | ((dados: ResumoDiario) => string)
    horario: string                // "08:00" ou "dinamico"
    diasSemana: number[]           // [0,1,2,3,4,5,6] (0=domingo)
    condicao?: () => boolean       // Se retornar false, não envia
    acao?: {
        label: string
        deepLink: string
    }
}

// ==========================================
// GAMIFICAÇÃO
// ==========================================

export interface StreakSystem {
    atual: number                   // Dias consecutivos
    recorde: number                 // Maior streak já alcançado
    ultimoRegistro: Date

    // Regras
    diasParaManter: TrackerType[]   // Quais trackers contam
    minimoParaContar: number        // Ex: pelo menos 3 de 5 trackers
}

export interface XPSystem {
    totalXP: number
    nivel: number
    xpProximoNivel: number

    // XP por ação
    acoes: {
        registrarRefeicao: number
        registrarTreino: number
        registrarAgua: number
        registrarSono: number
        completarDia: number
        baterMetaProteina: number
        baterMetaAgua: number
        treinarNoDiaPlanejado: number
        fazerCheckinSemanal: number
    }
}

export interface Badge {
    id: string
    nome: string
    icone: string
    descricao: string
    condicao: (dados: any) => boolean
    xpBonus: number
    conquistado?: boolean
    dataConquista?: Date
}

// ==========================================
// CONVERSATIONAL INPUT
// ==========================================

export type TipoInput = 'registro' | 'consulta' | 'comando'

export interface ConversationalInput {
    texto: string
    tipo: TipoInput
    entidade?: TrackerType
    dados?: Record<string, any>
}

// ==========================================
// DASHBOARD PERSONAL
// ==========================================

export type StatusAtleta = 'ativo' | 'atencao' | 'alerta' | 'inativo'

export interface AtletaDailyStatus {
    id: string
    nome: string
    avatar?: string
    ultimaAtividade: Date
    status: StatusAtleta

    // Resumo do dia
    resumoHoje: {
        refeicoes: { atual: number; meta: number }
        treino: { realizado: boolean; tipo?: string }
        agua: { atual: number; meta: number }
        sono: { horas: number; qualidade: number }
    }

    // Alertas
    alertas: string[]
}

export interface Alerta {
    id: string
    atletaId: string
    atletaNome: string
    tipo: 'dor' | 'inativo' | 'energia_baixa' | 'deficit_nutricional' | 'outro'
    mensagem: string
    prioridade: 1 | 2 | 3
    timestamp: Date
    acao?: {
        label: string
        url: string
    }
}

// ==========================================
// HISTÓRICO PARA EVOLUÇÃO
// ==========================================

export interface DailyTrackingDataPoint {
    data: Date
    nutricao: {
        refeicoes: number
        calorias: number
        proteina: number
        carboidrato: number
        gordura: number
    }
    hidratacao: {
        totalMl: number
        metaMl: number
    }
    treino: {
        realizado: boolean
        tipo?: string
        duracao: number
        intensidade?: 1 | 2 | 3 | 4 | 5
    }
    sono: {
        horas: number
        qualidade: 1 | 2 | 3 | 4 | 5
    }
    doresAtivas: number
    streakAtual: number
}

export interface DailyTrackingHistory {
    atletaId: string
    atletaNome: string
    periodo: {
        inicio: Date
        fim: Date
    }
    dados: DailyTrackingDataPoint[]
}

