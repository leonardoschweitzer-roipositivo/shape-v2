// Personal Ranking Store - VITRU IA
// Zustand store for Personal Trainers Ranking

import { create } from 'zustand';
import {
    PersonalRankingItem,
    PersonalPublicProfile,
    RankingFilters,
    RankingStats,
    DEFAULT_FILTERS,
    RankingCategory,
} from '../types/personalRanking';

// ============================================
// STORE INTERFACE
// ============================================

interface PersonalRankingStore {
    // State
    personals: PersonalRankingItem[];
    filteredPersonals: PersonalRankingItem[];
    selectedPersonal: PersonalPublicProfile | null;
    filters: RankingFilters;
    stats: RankingStats;
    isLoading: boolean;
    page: number;
    hasMore: boolean;

    // Actions
    setFilters: (filters: Partial<RankingFilters>) => void;
    resetFilters: () => void;
    selectPersonal: (personalId: string | null) => void;
    loadMore: () => void;
    applyFilters: () => void;
}

// ============================================
// MOCK DATA
// ============================================

const MOCK_PERSONALS: PersonalRankingItem[] = [
    {
        position: 1,
        personalId: 'p1',
        name: 'João Carlos Silva',
        avatarUrl: null,
        cref: '012345-G/SP',
        crefVerified: true,
        city: 'São Paulo',
        state: 'SP',
        score: 96.8,
        avgEvolution: 15.1,
        athleteCount: 28,
        specialties: ['hipertrofia', 'fisiculturismo'],
        badges: ['rank_1', 'elite', 'transformer'],
        tier: 'elite',
    },
    {
        position: 2,
        personalId: 'p2',
        name: 'Maria Clara Santos',
        avatarUrl: null,
        cref: '023456-G/RJ',
        crefVerified: true,
        city: 'Rio de Janeiro',
        state: 'RJ',
        score: 94.2,
        avgEvolution: 12.3,
        athleteCount: 32,
        specialties: ['emagrecimento', 'funcional'],
        badges: ['rank_2', 'elite', 'veteran'],
        tier: 'elite',
    },
    {
        position: 3,
        personalId: 'p3',
        name: 'Pedro Henrique Costa',
        avatarUrl: null,
        cref: '034567-G/MG',
        crefVerified: true,
        city: 'Belo Horizonte',
        state: 'MG',
        score: 91.5,
        avgEvolution: 10.8,
        athleteCount: 45,
        specialties: ['hipertrofia', 'forca'],
        badges: ['rank_3', 'expert', 'mentor'],
        tier: 'expert',
    },
    {
        position: 4,
        personalId: 'p4',
        name: 'Ana Paula Oliveira',
        avatarUrl: null,
        cref: '045678-G/SP',
        crefVerified: true,
        city: 'Campinas',
        state: 'SP',
        score: 89.3,
        avgEvolution: 9.5,
        athleteCount: 18,
        specialties: ['funcional', 'reabilitacao'],
        badges: ['top_10', 'expert'],
        tier: 'expert',
    },
    {
        position: 5,
        personalId: 'p5',
        name: 'Lucas Fernandes',
        avatarUrl: null,
        cref: '056789-G/PR',
        crefVerified: true,
        city: 'Curitiba',
        state: 'PR',
        score: 87.1,
        avgEvolution: 8.9,
        athleteCount: 22,
        specialties: ['hipertrofia'],
        badges: ['top_10', 'expert', 'rising_star'],
        tier: 'expert',
    },
    {
        position: 6,
        personalId: 'p6',
        name: 'Carla Souza Lima',
        avatarUrl: null,
        cref: '067890-G/RS',
        crefVerified: true,
        city: 'Porto Alegre',
        state: 'RS',
        score: 85.4,
        avgEvolution: 8.2,
        athleteCount: 15,
        specialties: ['emagrecimento'],
        badges: ['top_10', 'expert'],
        tier: 'expert',
    },
    {
        position: 7,
        personalId: 'p7',
        name: 'Rafael Lima Pereira',
        avatarUrl: null,
        cref: '078901-G/BA',
        crefVerified: false,
        city: 'Salvador',
        state: 'BA',
        score: 83.9,
        avgEvolution: 7.8,
        athleteCount: 31,
        specialties: ['forca', 'hipertrofia'],
        badges: ['top_10', 'veteran'],
        tier: 'professional',
    },
    {
        position: 8,
        personalId: 'p8',
        name: 'Fernanda Alves',
        avatarUrl: null,
        cref: '089012-G/SC',
        crefVerified: true,
        city: 'Florianópolis',
        state: 'SC',
        score: 82.1,
        avgEvolution: 7.4,
        athleteCount: 12,
        specialties: ['funcional', 'emagrecimento'],
        badges: ['top_10', 'symmetry_master'],
        tier: 'professional',
    },
    {
        position: 9,
        personalId: 'p9',
        name: 'Marcos Rodrigues',
        avatarUrl: null,
        cref: '090123-G/SP',
        crefVerified: true,
        city: 'Santos',
        state: 'SP',
        score: 80.5,
        avgEvolution: 7.1,
        athleteCount: 27,
        specialties: ['fisiculturismo'],
        badges: ['top_10', 'consistent'],
        tier: 'professional',
    },
    {
        position: 10,
        personalId: 'p10',
        name: 'Julia Mendes',
        avatarUrl: null,
        cref: '101234-G/RJ',
        crefVerified: true,
        city: 'Niterói',
        state: 'RJ',
        score: 79.8,
        avgEvolution: 6.9,
        athleteCount: 19,
        specialties: ['reabilitacao', 'funcional'],
        badges: ['top_10'],
        tier: 'professional',
    },
    {
        position: 11,
        personalId: 'p11',
        name: 'Thiago Martins',
        avatarUrl: null,
        cref: '112345-G/GO',
        crefVerified: true,
        city: 'Goiânia',
        state: 'GO',
        score: 78.2,
        avgEvolution: 6.5,
        athleteCount: 14,
        specialties: ['hipertrofia', 'forca'],
        badges: ['top_50'],
        tier: 'professional',
    },
    {
        position: 12,
        personalId: 'p12',
        name: 'Camila Ribeiro',
        avatarUrl: null,
        cref: '123456-G/PE',
        crefVerified: true,
        city: 'Recife',
        state: 'PE',
        score: 76.9,
        avgEvolution: 6.1,
        athleteCount: 21,
        specialties: ['emagrecimento', 'funcional'],
        badges: ['top_50'],
        tier: 'professional',
    },
];

const MOCK_STATS: RankingStats = {
    totalPersonals: 1234,
    avgScore: 72.4,
    avgEvolution: 6.2,
    topSpecialty: 'hipertrofia',
    topRegion: 'Sudeste',
};

// Mock profile generator
const generateMockProfile = (item: PersonalRankingItem): PersonalPublicProfile => ({
    ...item,
    bio: `Personal trainer especializado em ${item.specialties.join(' e ')} com anos de experiência transformando vidas através do treino personalizado.`,
    instagram: `@${item.name.toLowerCase().replace(/\s/g, '.')}`,
    website: null,
    phone: item.position <= 3 ? '(11) 99999-9999' : null,
    yearsExperience: item.athleteCount > 30 ? '5+ anos' : '2-5 anos',
    scoreBreakdown: {
        athleteEvolution: {
            score: Math.round(item.score * 0.95),
            weight: 0.40,
            metrics: {
                avgScoreImprovement: item.avgEvolution,
                athletesImproved: 85 + Math.random() * 10,
                topImprovement: item.avgEvolution + 8,
            },
        },
        consistency: {
            score: Math.round(item.score * 0.92),
            weight: 0.25,
            metrics: {
                measurementFrequency: 0.8 + Math.random() * 0.2,
                athleteRetention: 75 + Math.random() * 20,
                activeMonitoring: 70 + Math.random() * 25,
            },
        },
        symmetryCorrection: {
            score: Math.round(item.score * 0.88),
            weight: 0.20,
            metrics: {
                asymmetriesFixed: Math.floor(item.athleteCount * 0.6),
                avgSymmetryImprovement: 2 + Math.random() * 3,
            },
        },
        engagement: {
            score: Math.round(item.score * 0.96),
            weight: 0.15,
            metrics: {
                avgAthleteSessions: 4 + Math.random() * 4,
                responseRate: 85 + Math.random() * 15,
                platformUsage: 70 + Math.random() * 30,
            },
        },
    },
    achievements: item.badges.map(b => ({
        id: b,
        icon: getAchievementIcon(b),
        name: getAchievementName(b),
        description: getAchievementDescription(b),
    })),
    evolutionDistribution: [
        { range: '+20 ou mais', count: Math.floor(item.athleteCount * 0.15) },
        { range: '+15 a +20', count: Math.floor(item.athleteCount * 0.25) },
        { range: '+10 a +15', count: Math.floor(item.athleteCount * 0.30) },
        { range: '+5 a +10', count: Math.floor(item.athleteCount * 0.20) },
        { range: '0 a +5', count: Math.floor(item.athleteCount * 0.07) },
        { range: 'Sem melhoria', count: Math.floor(item.athleteCount * 0.03) },
    ],
    methodology: {
        approach: ['Sobrecarga progressiva', 'Periodização ondulada', 'Foco em composição'],
        targetAudience: item.specialties.includes('fisiculturismo')
            ? ['Intermediários', 'Avançados', 'Competidores']
            : ['Iniciantes', 'Intermediários'],
    },
});

// Helper functions for achievements
function getAchievementIcon(id: string): string {
    const icons: Record<string, string> = {
        rank_1: '🥇', rank_2: '🥈', rank_3: '🥉',
        top_10: '🏆', top_50: '⭐', top_100: '✨',
        elite: '💎', expert: '🔷', professional: '🔹',
        transformer: '🔥', consistent: '📈', rising_star: '🌟',
        symmetry_master: '⚖️', veteran: '💪', mentor: '👨‍🏫',
    };
    return icons[id] || '🏅';
}

function getAchievementName(id: string): string {
    const names: Record<string, string> = {
        rank_1: 'Campeão', rank_2: 'Vice-campeão', rank_3: 'Bronze',
        top_10: 'Top 10', top_50: 'Top 50', top_100: 'Top 100',
        elite: 'Elite', expert: 'Expert', professional: 'Profissional',
        transformer: 'Transformador', consistent: 'Consistente', rising_star: 'Revelação',
        symmetry_master: 'Mestre da Simetria', veteran: 'Veterano', mentor: 'Mentor',
    };
    return names[id] || id;
}

function getAchievementDescription(id: string): string {
    const descriptions: Record<string, string> = {
        rank_1: '#1 no ranking', rank_2: '#2 no ranking', rank_3: '#3 no ranking',
        top_10: 'Entre os 10 melhores', top_50: 'Entre os 50 melhores', top_100: 'Entre os 100 melhores',
        elite: 'Score 95+', expert: 'Score 85+', professional: 'Score 75+',
        transformer: '10+ atletas com +10 pontos', consistent: '12 meses no top 100', rising_star: 'Maior subida do mês',
        symmetry_master: '20+ assimetrias corrigidas', veteran: '50+ atletas totais', mentor: '100+ atletas totais',
    };
    return descriptions[id] || '';
}

// ============================================
// STORE CREATION
// ============================================

export const usePersonalRankingStore = create<PersonalRankingStore>((set, get) => ({
    // Initial state — dados virão do Supabase futuramente
    personals: [],
    filteredPersonals: [],
    selectedPersonal: null,
    filters: DEFAULT_FILTERS,
    stats: { totalPersonals: 0, avgScore: 0, avgEvolution: 0, topSpecialty: 'geral' as const, topRegion: '-' },
    isLoading: false,
    page: 1,
    hasMore: false,

    // Actions
    setFilters: (newFilters) => {
        set((state) => ({
            filters: { ...state.filters, ...newFilters },
        }));
        get().applyFilters();
    },

    resetFilters: () => {
        set({ filters: DEFAULT_FILTERS });
        get().applyFilters();
    },

    selectPersonal: (personalId) => {
        if (!personalId) {
            set({ selectedPersonal: null });
            return;
        }
        const personal = get().personals.find(p => p.personalId === personalId);
        if (personal) {
            set({ selectedPersonal: generateMockProfile(personal) });
        }
    },

    loadMore: () => {
        // Mock: no more data to load
        set({ hasMore: false });
    },

    applyFilters: () => {
        const { personals, filters } = get();
        let filtered = [...personals];

        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchLower) ||
                p.city.toLowerCase().includes(searchLower) ||
                p.state.toLowerCase().includes(searchLower)
            );
        }

        // Specialty filter
        if (filters.specialty !== 'todas') {
            filtered = filtered.filter(p =>
                p.specialties.includes(filters.specialty as RankingCategory)
            );
        }

        // State filter (if region is 'estado')
        if (filters.region === 'estado' && filters.state) {
            filtered = filtered.filter(p => p.state === filters.state);
        }

        // City filter (if region is 'cidade')
        if (filters.region === 'cidade' && filters.city) {
            filtered = filtered.filter(p => p.city === filters.city);
        }

        // Recalculate positions after filtering
        filtered = filtered.map((p, idx) => ({ ...p, position: idx + 1 }));

        set({ filteredPersonals: filtered, page: 1 });
    },
}));
