/**
 * Assessment Evaluation Types
 * 
 * Tipos para a tela de Avaliação do Portal do Atleta
 * Seções: Diagnóstico Estético, Proporções Áureas, Análise de Assimetria
 */

// ==========================================
// CLASSIFICAÇÕES (Escala 75-110%)
// ==========================================

export type ClassificacaoId = 'INICIO' | 'CAMINHO' | 'QUASE_LA' | 'META' | 'ELITE'

export interface ClassificacaoProporcao {
    id: ClassificacaoId
    label: string
    labelCurto: string
    cor: string
    corTexto: string
    emoji: string
    minPercent: number
    maxPercent: number
}

// ==========================================
// DIAGNÓSTICO ESTÉTICO (Composição Corporal)
// ==========================================

export interface DiagnosticoEstetico {
    /** Percentual de gordura corporal */
    bf: number
    /** Score do BF (0-100) */
    scoreBF: number
    /** Fat-Free Mass Index */
    ffmi: number
    /** Score do FFMI (0-100) */
    scoreFFMI: number
    /** Massa magra em kg */
    massaMagra: number
    /** Massa gorda em kg */
    massaGorda: number
    /** Peso relativo (kg/cm) */
    pesoRelativo: number
    /** Score do peso relativo (0-100) */
    scorePesoRelativo: number
    /** Score total de composição (0-100) */
    scoreTotal: number
    /** Classificação geral */
    classificacao: string
    /** Emoji da classificação */
    emoji: string
}

// ==========================================
// PROPORÇÕES ÁUREAS
// ==========================================

export interface ProporcaoDetalhe {
    /** Nome da proporção ex: "Shape-V", "Peitoral" */
    nome: string
    /** Categoria da proporção ex: "ESCALA SHAPE-V" */
    categoria: string
    /** Índice atual calculado */
    indiceAtual: number
    /** Índice meta/ideal */
    indiceMeta: number
    /** Percentual do ideal (0-110+) */
    percentualDoIdeal: number
    /** Classificação (INÍCIO, CAMINHO, QUASE LÁ, META, ELITE) */
    classificacao: ClassificacaoProporcao
    /** Posição na barra visual (0-100%) */
    posicaoBarra: number
    /** Se é proporção inversa (menor é melhor) */
    ehInversa: boolean
    /** Fórmula base ex: "Ombros ÷ Cintura" */
    formulaBase: string
    /** Medida atual em cm (se aplicável) */
    medidaAtual?: number
    /** Medida meta em cm (se aplicável) */
    medidaMeta?: number
    /** Diferença em cm (meta - atual) */
    diferencaCm?: number
}

// ==========================================
// ANÁLISE DE ASSIMETRIA
// ==========================================

export type AssimetriaStatus = 'simetrico' | 'leve' | 'moderada' | 'significativa'

export interface AssimetriaItem {
    /** Nome do membro ex: "Braço" */
    membro: string
    /** Medida lado esquerdo em cm */
    ladoEsquerdo: number
    /** Medida lado direito em cm */
    ladoDireito: number
    /** Diferença absoluta em cm */
    diferencaCm: number
    /** Diferença percentual */
    diferencaPercentual: number
    /** Status de simetria */
    status: AssimetriaStatus
    /** Emoji do status */
    emoji: string
    /** Label do status */
    label: string
}

export interface AssimetriaGeral {
    /** Lista de membros analisados */
    membros: AssimetriaItem[]
    /** Score geral de simetria (0-100) */
    scoreGeral: number
    /** Classificação geral */
    classificacao: string
    /** Emoji geral */
    emoji: string
}

// ==========================================
// DADOS COMPLETOS DA AVALIAÇÃO
// ==========================================

export interface AvaliacaoDados {
    /** ID da avaliação no Supabase */
    id: string
    /** Data da avaliação */
    data: Date
    /** Score geral (0-100) */
    scoreGeral: number
    /** Classificação geral */
    classificacaoGeral: string
    /** Emoji da classificação */
    emojiGeral: string
    /** Scores individuais dos 3 pilares */
    scores: {
        proporcoes: { valor: number; peso: number; contribuicao: number }
        composicao: { valor: number; peso: number; contribuicao: number }
        simetria: { valor: number; peso: number; contribuicao: number }
    }
    /** Penalizações aplicadas após a média ponderada */
    penalizacoes: { vTaper: number; cintura: number }
    /** Seção: Diagnóstico Estético */
    diagnostico: DiagnosticoEstetico
    /** Seção: Proporções Áureas */
    proporcoes: ProporcaoDetalhe[]
    /** Seção: Análise de Assimetria */
    assimetria: AssimetriaGeral
}
