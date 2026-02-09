// Types for Assessment Results
export type ComparisonMode =
    | 'golden'
    | 'classic'
    | 'mens'
    | 'open'
    // Female Modes
    | 'female_golden'
    | 'bikini'
    | 'wellness'
    | 'figure'
    | 'womens_physique'
    | 'womens_bodybuilding';

export type TabType = 'diagnostic' | 'golden' | 'asymmetry';
export type FilterType = 'geral' | 'comp' | 'metrics';

export interface Measurements {
    altura: number;
    peso: number;
    ombros: number;
    peito: number;
    busto: number; // Específico feminino (na linha do mamilo)
    costas: number; // Adicionado v3.0
    cintura: number;
    quadril: number; // Essencial para feminino
    abaixo_busto?: number; // Opcional (calculado ou input)
    braco: number;
    antebraco: number;
    punho: number;
    pescoco: number;
    coxa: number;
    joelho: number;
    panturrilha: number;
    tornozelo: number;
    pelvis: number; // Usado como "quadril ósseo" em alguns cálculos masculinos, mas "quadril" é a circunferência máxima
    cabeca: number;
    gluteo_dobra?: number; // Opcional para Wellness
}

export interface IdealMeasurements {
    ombros: number;
    peito?: number; // Pode não ter ideal em algumas categorias femininas
    busto?: number; // Específico feminino
    cintura: number;
    quadril?: number; // Específico feminino
    braco: number;
    antebraco?: number;
    pescoco?: number;
    coxa: number | null;
    panturrilha: number;
    costas?: number; // Adicionado v3.0
    gluteo?: number; // Específico feminino (Wellness/Bikini)
}


export interface ProportionDifference {
    percentual: number;
    necessario: 'aumentar' | 'diminuir' | 'manter';
    diferenca: number;
}

export interface ProportionCardData {
    title: string;
    badge: string;
    metrics: { label: string; value: string }[];
    currentValue: number | string;
    valueUnit?: string;
    valueLabel?: string;
    description: string;
    statusLabel: string;
    userPosition: number;
    goalPosition: number;
    goalLabel?: string;
    image: string;
    overlayStyle?: 'v-taper' | 'chest' | 'arm' | 'triad' | 'waist' | 'legs';
    rawImage?: boolean;
    measurementsUsed?: string[];
}

export interface ProportionAIAnalysis {
    strength?: string;
    weakness?: string;
    suggestion?: string;
}

export interface ProportionItem {
    card: ProportionCardData;
    ai: ProportionAIAnalysis;
}
