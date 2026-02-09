// Types for Proportion Calculator

export type ComparisonMode = 'golden' | 'classic' | 'mens' | 'open';

export interface UserMeasurements {
    // Medidas estruturais (não mudam com treino)
    altura: number;      // cm
    punho: number;       // cm
    tornozelo: number;   // cm
    joelho: number;      // cm
    pelvis: number;      // cm
    peso: number;        // kg - Adicionado v3.0

    // Medidas variáveis (mudam com treino/dieta)
    cintura: number;     // cm
    ombros: number;      // cm
    peito: number;       // cm
    costas: number;      // cm - Adicionado v3.0
    braco: number;       // cm
    antebraco: number;   // cm
    coxa: number;        // cm
    panturrilha: number; // cm
    pescoco: number;     // cm
}

export interface ProportionIdeals {
    ombros: number;
    peito: number;
    braco: number;
    antebraco: number;
    cintura: number;
    coxa: number | null;  // null para Men's Physique (não julgada)
    panturrilha: number;
    pescoco: number;
    costas?: number;      // Adicionado v3.0
    triade?: {
        valor_ideal: number;
        regra: string;
    };
    coxa_panturrilha?: {  // Proporção #8: Coxa = Panturrilha × 1.5
        coxa_ideal: number;
        panturrilha_ref: number;
        ratio: number;
    };
    peso_maximo?: number; // Para Classic e Open
}

export interface ProportionDiff {
    diferenca: number;
    necessario: 'aumentar' | 'diminuir' | 'manter';
    percentual: number;
}

export interface ProportionScore {
    ombros: number;
    peito: number;
    braco: number;
    antebraco: number;
    cintura: number;
    coxa: number;
    coxa_panturrilha: number;
    panturrilha: number;
    pescoco: number;
    costas: number;       // Adicionado v3.0
    triade: number;
}

export interface ProportionResult {
    metodo: ComparisonMode; // Adicionado v3.0
    ideais: ProportionIdeals;
    diferencas: Record<string, ProportionDiff>;
    scores: ProportionScore;
    score_total: number;
    notas?: Record<string, string>;
}

export interface ProportionCardData {
    title: string;
    badge: string;
    metrics: { label: string; value: string }[];
    currentValue: string;
    valueUnit?: string;
    valueLabel?: string;
    description: string;
    statusLabel: string;
    userPosition: number;
    goalPosition: number;
    image: string;
    rawImage?: boolean;
    isNA?: boolean; // Para Men's Physique - coxa não julgada
}
