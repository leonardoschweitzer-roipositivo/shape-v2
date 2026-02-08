// Types for Personal Ranking - VITRU IA
// Based on: docs/specs/ranking-personais.md

// ============================================
// ENUMS & CONSTANTS
// ============================================

export type PersonalTier = 'elite' | 'expert' | 'professional' | 'iniciante';

export type RankingCategory =
    | 'geral'
    | 'hipertrofia'
    | 'emagrecimento'
    | 'forca'
    | 'fisiculturismo'
    | 'funcional'
    | 'reabilitacao';

export type RegionFilter =
    | 'nacional'
    | 'regiao'
    | 'estado'
    | 'cidade';

export type RankingPeriod =
    | 'all-time'
    | 'ano-atual'
    | '6-meses'
    | '3-meses'
    | 'mes-atual';

// ============================================
// SCORE COMPONENTS
// ============================================

export interface EvolutionMetrics {
    avgScoreImprovement: number;    // Melhoria média de score
    athletesImproved: number;       // % de atletas que melhoraram
    topImprovement: number;         // Maior melhoria individual
}

export interface ConsistencyMetrics {
    measurementFrequency: number;   // Frequência de medições
    athleteRetention: number;       // % de retenção (6+ meses)
    activeMonitoring: number;       // % atletas com medição recente
}

export interface SymmetryMetrics {
    asymmetriesFixed: number;       // Assimetrias corrigidas
    avgSymmetryImprovement: number; // Melhoria média de simetria
}

export interface EngagementMetrics {
    avgAthleteSessions: number;     // Média de medições por atleta
    responseRate: number;           // Taxa de acompanhamento
    platformUsage: number;          // Uso ativo da plataforma
}

export interface ScoreComponent<T> {
    score: number;     // 0-100
    weight: number;    // 0-1
    metrics: T;
}

export interface PersonalScore {
    totalScore: number;  // 0-100

    components: {
        athleteEvolution: ScoreComponent<EvolutionMetrics>;
        consistency: ScoreComponent<ConsistencyMetrics>;
        symmetryCorrection: ScoreComponent<SymmetryMetrics>;
        engagement: ScoreComponent<EngagementMetrics>;
    };

    calculatedAt: Date;
    athleteCount: number;     // Mínimo 3 para aparecer no ranking
    monthsActive: number;     // Mínimo 3 meses
}

// ============================================
// BADGES
// ============================================

export interface RankingBadge {
    id: string;
    icon: string;
    name: string;
    description: string;
}

export const RANKING_BADGES: Record<string, RankingBadge> = {
    // Posição
    rank_1: { id: 'rank_1', icon: '🥇', name: 'Campeão', description: '#1 no ranking' },
    rank_2: { id: 'rank_2', icon: '🥈', name: 'Vice-campeão', description: '#2 no ranking' },
    rank_3: { id: 'rank_3', icon: '🥉', name: 'Bronze', description: '#3 no ranking' },
    top_10: { id: 'top_10', icon: '🏆', name: 'Top 10', description: 'Entre os 10 melhores' },
    top_50: { id: 'top_50', icon: '⭐', name: 'Top 50', description: 'Entre os 50 melhores' },
    top_100: { id: 'top_100', icon: '✨', name: 'Top 100', description: 'Entre os 100 melhores' },

    // Score
    elite: { id: 'elite', icon: '💎', name: 'Elite', description: 'Score 95+' },
    expert: { id: 'expert', icon: '🔷', name: 'Expert', description: 'Score 85+' },
    professional: { id: 'professional', icon: '🔹', name: 'Profissional', description: 'Score 75+' },

    // Evolução
    transformer: { id: 'transformer', icon: '🔥', name: 'Transformador', description: '10+ atletas com +10 pontos' },
    consistent: { id: 'consistent', icon: '📈', name: 'Consistente', description: '12 meses no top 100' },
    rising_star: { id: 'rising_star', icon: '🌟', name: 'Revelação', description: 'Maior subida do mês' },

    // Assimetria
    symmetry_master: { id: 'symmetry_master', icon: '⚖️', name: 'Mestre da Simetria', description: '20+ assimetrias corrigidas' },

    // Volume
    veteran: { id: 'veteran', icon: '💪', name: 'Veterano', description: '50+ atletas totais' },
    mentor: { id: 'mentor', icon: '👨‍🏫', name: 'Mentor', description: '100+ atletas totais' },
};

export const TIER_CONFIG: Record<PersonalTier, { icon: string; name: string; minScore: number }> = {
    elite: { icon: '💎', name: 'Elite', minScore: 95 },
    expert: { icon: '🔷', name: 'Expert', minScore: 85 },
    professional: { icon: '🔹', name: 'Profissional', minScore: 75 },
    iniciante: { icon: '⚪', name: 'Iniciante', minScore: 0 },
};

// ============================================
// RANKING ITEM
// ============================================

export interface PersonalRankingItem {
    position: number;
    personalId: string;
    name: string;
    avatarUrl: string | null;
    cref: string | null;
    crefVerified: boolean;
    city: string;
    state: string;
    score: number;
    avgEvolution: number;
    athleteCount: number;
    specialties: RankingCategory[];
    badges: string[];
    tier: PersonalTier;
}

// ============================================
// PUBLIC PROFILE
// ============================================

export interface EvolutionDistribution {
    range: string;
    count: number;
}

export interface Achievement {
    id: string;
    icon: string;
    name: string;
    description: string;
}

export interface PersonalPublicProfile extends PersonalRankingItem {
    bio: string | null;
    instagram: string | null;
    website: string | null;
    phone: string | null;
    yearsExperience: string;
    scoreBreakdown: PersonalScore['components'];
    achievements: Achievement[];
    evolutionDistribution: EvolutionDistribution[];
    methodology: {
        approach: string[];
        targetAudience: string[];
    };
}

// ============================================
// FILTERS
// ============================================

export interface RankingFilters {
    search: string;
    category: RankingCategory;
    region: RegionFilter;
    state: string | null;
    city: string | null;
    period: RankingPeriod;
    specialty: RankingCategory | 'todas';
}

export const DEFAULT_FILTERS: RankingFilters = {
    search: '',
    category: 'geral',
    region: 'nacional',
    state: null,
    city: null,
    period: '6-meses',
    specialty: 'todas',
};

// ============================================
// STATS
// ============================================

export interface RankingStats {
    totalPersonals: number;
    avgScore: number;
    avgEvolution: number;
    topSpecialty: RankingCategory;
    topRegion: string;
}

// ============================================
// PRIVACY SETTINGS
// ============================================

export interface RankingPrivacySettings {
    appearInPublicRanking: boolean;
    showPhone: boolean;
    showInstagram: boolean;
    showEmail: boolean;
    showAthleteCount: boolean;
    showDetailedMetrics: boolean;
    allowContact: boolean;
    contactMethod: 'whatsapp' | 'instagram' | 'email' | 'none';
}

export const DEFAULT_PRIVACY_SETTINGS: RankingPrivacySettings = {
    appearInPublicRanking: true,
    showPhone: false,
    showInstagram: true,
    showEmail: false,
    showAthleteCount: true,
    showDetailedMetrics: true,
    allowContact: true,
    contactMethod: 'whatsapp',
};

// ============================================
// UI HELPER LABELS
// ============================================

export const CATEGORY_LABELS: Record<RankingCategory, string> = {
    geral: 'Geral',
    hipertrofia: 'Hipertrofia',
    emagrecimento: 'Emagrecimento',
    forca: 'Força',
    fisiculturismo: 'Fisiculturismo',
    funcional: 'Funcional',
    reabilitacao: 'Reabilitação',
};

export const PERIOD_LABELS: Record<RankingPeriod, string> = {
    'all-time': 'All-time',
    'ano-atual': 'Ano atual',
    '6-meses': 'Últimos 6 meses',
    '3-meses': 'Últimos 3 meses',
    'mes-atual': 'Mês atual',
};

export const REGION_LABELS: Record<RegionFilter, string> = {
    nacional: 'Nacional',
    regiao: 'Por Região',
    estado: 'Por Estado',
    cidade: 'Por Cidade',
};
