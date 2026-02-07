import React from 'react';

export type ProportionMethod = 'golden_ratio' | 'classic_physique' | 'mens_physique';

export type ScoreClassification = 'ELITE' | 'AVANÇADO' | 'INTERMEDIÁRIO' | 'INICIANTE' | 'EM DESENVOLVIMENTO';

export type RatioClassification = 'BLOCO' | 'NORMAL' | 'ATLÉTICO' | 'ESTÉTICO' | 'FREAK';

export type Grade = 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'E';

export interface UserProfile {
    id: string;
    name: string;
    isPro: boolean;
    hasCompleteProfile: boolean;
    photoUrl?: string; // Optional user photo
}

export interface Measurement {
    date: Date;
    weight: number;
    bodyFat: number;
    // Add other necessary measurement fields if needed for the dashboard summary
}

export interface HeroContent {
    badge: {
        label: string;
        variant: 'primary' | 'secondary' | 'warning';
    };
    date: Date;
    title: string;
    description: string;
    cta: {
        label: string;
        href: string;
        icon?: React.ReactNode;
    };
    image?: {
        src: string;
        alt: string;
        position: 'right' | 'background';
    };
    gradient?: boolean;
}

export interface KPIData {
    ratio: {
        current: number;
        target: number;
        previous?: number;
        classification: RatioClassification;
        distanceToTarget: number;
        evolution: number; // Positive implies improvement
    };
    score: {
        total: number;
        max: number;
        change: number;
        changePeriod: string;
        grades: {
            simetria: Grade;
            proporcao: Grade;
            estetica: Grade;
            evolucao: Grade;
        };
        classification: ScoreClassification;
        aiSummary?: string;
    };
}

export interface EvolutionMetric {
    name: string;
    previous: number;
    current: number;
    change: number;
    changePercent: number;
    status: 'up' | 'down' | 'stable';
    isPositive: boolean;
    unit: string; // e.g., 'cm', 'kg', '%'
}

export interface EvolutionData {
    period: '7d' | '30d' | '90d';
    metrics: EvolutionMetric[];
    scoreChange: number;
    ratioChange: number;
    overallTrend: 'improving' | 'stable' | 'declining';
}

export interface RegionData {
    name: string; // e.g., 'ombros', 'peitoral'
    score: number; // 0-100
    atual: number; // cm
    ideal: number; // cm
    diferenca: number; // cm
    evolution?: number;
    status: 'excellent' | 'good' | 'attention' | 'critical';
}

export interface BodyHeatmapData {
    regions: Record<string, RegionData>;
    mode: 'score' | 'evolution' | 'asymmetry';
}

export interface ProportionBreakdownItem {
    id: string;
    nome: string;
    score: number;
    maxScore: number;
    percentage: number;
    status: 'excellent' | 'good' | 'attention' | 'critical';
    trend?: 'up' | 'down' | 'stable';
}

export interface ScoreBreakdownData {
    method: ProportionMethod;
    totalScore: number;
    proportions: ProportionBreakdownItem[];
}

export interface MetricCardData {
    metric: string;
    label: string;
    value: number;
    unit: string;
    ideal?: number;
    status: 'onTarget' | 'close' | 'far';
    statusLabel: string;
    trend?: {
        value: number;
        period: string;
    };
}

export interface Insight {
    id: string; // Unique ID for key
    type: 'tip' | 'warning' | 'achievement' | 'analysis';
    title: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
    icon: string; // Could be an icon name or component
    action?: {
        label: string;
        href: string;
    };
    isPro: boolean;
    createdAt: Date;
}

export interface Achievement {
    id: string;
    name: string;
    icon: string;
    progress: number;
    requirement: string;
    unlockedAt?: Date;
}

export interface GamificationData {
    level: number;
    currentXp: number;
    nextLevelXp: number;
    totalXp: number;
    streak: {
        current: number;
        best: number;
        isActive: boolean;
    };
    upcomingAchievements: Achievement[];
}

export interface SymmetryItem {
    muscle: string;
    left: number;
    right: number;
    diff: number;
    diffPercent: number;
    status: 'symmetric' | 'moderate' | 'asymmetric';
}

export interface SymmetryData {
    items: SymmetryItem[];
    overallSymmetry: number;
}

export interface WeeklyFocus {
    muscleGroup: string;
    reason: string;
    suggestedExercises: string[];
}

export interface DashboardResponse {
    user: UserProfile;
    latestMeasurement: Measurement | null; // Use specific type or generic object if Measurement type is complex
    lastMeasurementDate: Date | null;
    daysSinceLastMeasurement: number;

    currentScores: {
        method: ProportionMethod;
        scoreTotal: number;
        ratio: number;
        classification: ScoreClassification;
        ratioClassification: RatioClassification;
        breakdown: ScoreBreakdownData;
        // complex ideals structure might be simplified or typed as any/record if dynamic
        ideals: Record<string, number>;
    };

    kpi: KPIData; // Grouping KPI specific data

    evolution: EvolutionData;

    heatmap: BodyHeatmapData;

    metricsGrid: MetricCardData[];

    symmetry: SymmetryData | null;

    gamification: GamificationData;

    insights: Insight[];

    weeklyFocus: WeeklyFocus;
}
