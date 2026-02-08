// Types for Assessment Results
export type ComparisonMode = 'golden' | 'classic' | 'mens' | 'open';
export type TabType = 'diagnostic' | 'golden' | 'asymmetry';
export type FilterType = 'geral' | 'comp' | 'metrics';

export interface Measurements {
    altura: number;
    peso: number;
    ombros: number;
    peito: number;
    cintura: number;
    braco: number;
    antebraco: number;
    punho: number;
    pescoco: number;
    coxa: number;
    joelho: number;
    panturrilha: number;
    tornozelo: number;
    pelvis: number;
    cabeca: number;
}

export interface IdealMeasurements {
    ombros: number;
    peito: number;
    cintura: number;
    braco: number;
    antebraco: number;
    pescoco: number;
    coxa: number;
    panturrilha: number;
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
