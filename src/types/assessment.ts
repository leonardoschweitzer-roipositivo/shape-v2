// Types for General Assessment (Avaliação Geral do Físico)
import type { ComparisonMode } from './proportions.ts';

// ═══════════════════════════════════════════════════════════
// INPUT DATA STRUCTURES
// ═══════════════════════════════════════════════════════════

export interface ProportionData {
    indiceAtual: number;           // Ex: 1.56
    indiceMeta: number;            // Ex: 1.618
    percentualDoIdeal: number;     // Ex: 96.4%
    classificacao: 'BLOCO' | 'NORMAL' | 'ATLÉTICO' | 'ESTÉTICO' | 'FREAK';
}

export interface TriadeData {
    harmoniaPercentual: number;    // Ex: 98.1%
    pescoco: number;               // cm
    braco: number;                 // cm
    panturrilha: number;           // cm
}

export interface BilateralData {
    esquerdo: number;              // cm
    direito: number;               // cm
    diferenca: number;             // cm (absoluto)
    diferencaPercentual: number;   // %
    status: 'SIMETRICO' | 'LEVE_ASSIMETRIA' | 'ASSIMETRIA' | 'ASSIMETRIA_SEVERA';
}

export interface AvaliacaoGeralInput {
    // PROPORÇÕES ÁUREAS
    proporcoes: {
        metodo: ComparisonMode;
        vTaper: ProportionData | null;
        peitoral: ProportionData | null;
        braco: ProportionData | null;
        antebraco: ProportionData | null;
        triade: TriadeData | null;
        cintura: ProportionData | null;
        coxa: ProportionData | null;        // null se Men's Physique
        coxaPanturrilha: ProportionData | null;
        panturrilha: ProportionData | null;
        costas?: ProportionData | null;     // Added for Open BB support if needed
        upperLower?: ProportionData | null; // Upper vs Lower body volume ratio
    };

    // COMPOSIÇÃO CORPORAL
    composicao: {
        peso: number;              // kg
        altura: number;            // cm
        idade: number;             // anos
        genero: 'MALE' | 'FEMALE';
        bf: number;                // % (Navy ou Pollock)
        metodo_bf: 'NAVY' | 'POLLOCK_7';
        pesoMagro: number;         // kg
        pesoGordo: number;         // kg
        ffmi?: number;             // Fat-Free Mass Index
        cintura?: number;          // cm (para penalização absoluta)
    };

    // SIMETRIA BILATERAL
    assimetrias: {
        braco: BilateralData | null;
        antebraco: BilateralData | null;
        coxa: BilateralData | null;
        panturrilha: BilateralData | null;
        peitoral?: BilateralData | null;
        ombro?: BilateralData | null;
    };
}

// ═══════════════════════════════════════════════════════════
// OUTPUT DATA STRUCTURES
// ═══════════════════════════════════════════════════════════

export interface ProporcaoDetalhe {
    proporcao: string;
    peso: number;
    percentualDoIdeal: number;
    contribuicao: number;
    valor?: number;
}

export interface ProportionScoreDetails {
    score: number;
    detalhes: ProporcaoDetalhe[];
    proporcaoMaisForte: string;
    proporcaoMaisFraca: string;
    multiplicadorVTaper?: number;
}

export interface CompositionComponentDetail {
    valor: number;
    score: number;
    peso: number;
    contribuicao: number;
    classificacao?: string;
}

export interface CompositionScoreDetails {
    score: number;
    detalhes: {
        bf: CompositionComponentDetail;
        ffmi: CompositionComponentDetail;
        pesoRelativo: CompositionComponentDetail;
    };
    pesoMagro: number;
    pesoGordo: number;
}

export interface GrupoSimetriaDetalhe {
    grupo: string;
    esquerdo: number;
    direito: number;
    diferenca: number;
    diferencaPercent: number;
    score: number;
    status: string;
    peso: number;
    contribuicao: number;
    ladoDominante: 'ESQUERDO' | 'DIREITO' | 'IGUAL';
}

export interface SymmetryScoreDetails {
    score: number;
    radarScore: number;
    detalhes: GrupoSimetriaDetalhe[];
    grupoMaisSimetrico: string;
    grupoMenosSimetrico: string;
    assimetriasSignificativas: GrupoSimetriaDetalhe[];
}

export interface InsightItem {
    categoria: string;
    valor: number;
    mensagem: string;
}

export interface ProximaMetaItem {
    categoria: string;
    metaAtual: number;
    metaProxima: number;
    acao: string;
}

export interface Insights {
    pontoForte: InsightItem;
    pontoFraco: InsightItem;
    proximaMeta: ProximaMetaItem;
}

export interface Classificacao {
    nivel: string;
    emoji: string;
    cor: string;
    descricao: string;
}

export interface AvaliacaoGeralOutput {
    avaliacaoGeral: number; // 0-100
    classificacao: Classificacao;

    scores: {
        proporcoes: {
            valor: number;
            peso: number;
            contribuicao: number;
            detalhes: ProportionScoreDetails;
        };
        composicao: {
            valor: number;
            peso: number;
            contribuicao: number;
            detalhes: CompositionScoreDetails;
        };
        simetria: {
            valor: number;
            peso: number;
            contribuicao: number;
            detalhes: SymmetryScoreDetails;
        };
    };
    penalizacoes?: {
        vTaper: number;
        cintura: number;
    };
    insights: Insights;
}
