// Mock data para Personal Trainer

export interface PersonalStats {
    totalAthletes: number;
    maxAthletes: number;
    measuredThisWeek: number;
    averageScore: number;
    scoreVariation: number;
    needsAttention: number;
}

export interface AthleteNeedingAttention {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    score: number;
    scoreVariation: number;
    lastMeasurement: string;
    reason: string;
}

export interface TopPerformer {
    id: string;
    name: string;
    score: number;
    ratio: number;
    position: number;
}

export interface RecentActivity {
    id: string;
    athleteName: string;
    action: string;
    timestamp: string;
    type: 'measurement' | 'goal' | 'record';
}

export interface MeasurementHistory {
    id: string;
    date: string;
    measurements: {
        weight: number;
        height: number;
        neck: number;
        shoulders: number;
        chest: number;
        waist: number;
        hips: number;
        armRight: number;
        armLeft: number;
        forearmRight: number;
        forearmLeft: number;
        thighRight: number;
        thighLeft: number;
        calfRight: number;
        calfLeft: number;
    };
    skinfolds: {
        tricep: number;
        subscapular: number;
        chest: number;
        axillary: number;
        suprailiac: number;
        abdominal: number;
        thigh: number;
    };
}

export interface PersonalAthlete {
    id: string;
    name: string;
    email: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    avatarUrl: string | null;
    score: number;
    scoreVariation: number;
    ratio: number;
    lastMeasurement: string;
    status: 'active' | 'inactive' | 'attention';
    linkedSince: string;
    assessments: MeasurementHistory[];
}

export interface PersonalProfile {
    id: string;
    name: string;
    email: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    avatarUrl: string | null;
    cref: string;
    specialties: string[];
    bio: string;
    createdAt: string;
    stats: PersonalStats;
    instagram?: string;
    whatsapp?: string;
}

export const mockPersonalStats: PersonalStats = {
    totalAthletes: 12,
    maxAthletes: 20,
    measuredThisWeek: 8,
    averageScore: 76.5,
    scoreVariation: 2.3,
    needsAttention: 3,
};

export const mockPersonalProfile: PersonalProfile = {
    id: 'personal-1',
    name: 'Professor Carlos Lima',
    email: 'carlos.lima@vitruia.com',
    gender: 'MALE',
    avatarUrl: null,
    cref: '012345-G/SP',
    specialties: ['Bodybuilding', 'Alta Performance', 'Bioestimulação'],
    bio: 'Especialista em biomecânica aplicada ao fisiculturismo com mais de 10 anos de experiência transformando físicos através da matemática das proporções.',
    createdAt: '2022-03-15',
    stats: mockPersonalStats,
    instagram: '@carlos.limatrainer',
    whatsapp: '(11) 98765-4321',
};

export const mockAthletesNeedingAttention: AthleteNeedingAttention[] = [
    {
        id: 'athlete-3',
        name: 'João Silva',
        email: 'joao@email.com',
        avatarUrl: null,
        score: 72,
        scoreVariation: -3,
        lastMeasurement: '2026-01-20',
        reason: 'Última medição: 18 dias atrás',
    },
    {
        id: 'athlete-6',
        name: 'Maria Santos',
        email: 'maria@email.com',
        avatarUrl: null,
        score: 68,
        scoreVariation: 0,
        lastMeasurement: '2026-02-05',
        reason: 'Assimetria alta: Braço 9.2%',
    },
    {
        id: 'athlete-8',
        name: 'Pedro Costa',
        email: 'pedro@email.com',
        avatarUrl: null,
        score: 65,
        scoreVariation: -5,
        lastMeasurement: '2026-02-04',
        reason: 'Score caiu 5pts no último mês',
    },
];

export const mockTopPerformers: TopPerformer[] = [
    {
        id: 'athlete-1',
        name: 'Ana Lima',
        score: 92,
        ratio: 1.58,
        position: 1,
    },
    {
        id: 'athlete-2',
        name: 'Carlos Souza',
        score: 88,
        ratio: 1.52,
        position: 2,
    },
    {
        id: 'athlete-4',
        name: 'Fernanda Dias',
        score: 85,
        ratio: 1.49,
        position: 3,
    },
    {
        id: 'athlete-5',
        name: 'Lucas Alves',
        score: 83,
        ratio: 1.47,
        position: 4,
    },
    {
        id: 'athlete-7',
        name: 'Julia Rocha',
        score: 81,
        ratio: 1.45,
        position: 5,
    },
];

export const mockRecentActivity: RecentActivity[] = [
    {
        id: '1',
        athleteName: 'João Silva',
        action: 'Registrou medidas',
        timestamp: '2026-02-07T10:30:00',
        type: 'measurement',
    },
    {
        id: '2',
        athleteName: 'Maria Santos',
        action: 'Atingiu meta de cintura',
        timestamp: '2026-02-07T09:15:00',
        type: 'goal',
    },
    {
        id: '3',
        athleteName: 'Pedro Costa',
        action: 'Registrou medidas',
        timestamp: '2026-02-06T18:45:00',
        type: 'measurement',
    },
    {
        id: '4',
        athleteName: 'Ana Lima',
        action: 'Bateu recorde de score',
        timestamp: '2026-02-06T16:20:00',
        type: 'record',
    },
    {
        id: '5',
        athleteName: 'Carlos Souza',
        action: 'Registrou medidas',
        timestamp: '2026-02-05T11:00:00',
        type: 'measurement',
    },
];

const generateAssessments = (gender: 'MALE' | 'FEMALE'): MeasurementHistory[] => {
    const isMale = gender === 'MALE';
    return [
        {
            id: 'ass-1',
            date: '2026-02-07',
            measurements: {
                weight: isMale ? 88.5 : 62.0,
                height: isMale ? 178 : 165,
                neck: isMale ? 42 : 32,
                shoulders: isMale ? 133 : 108,
                chest: isMale ? 120 : 92,
                waist: isMale ? 85 : 64,
                hips: isMale ? 100 : 102,
                armRight: isMale ? 44.5 : 30,
                armLeft: isMale ? 44.0 : 30,
                forearmRight: isMale ? 32.2 : 24,
                forearmLeft: isMale ? 32.0 : 24,
                thighRight: isMale ? 60.5 : 58,
                thighLeft: isMale ? 60.0 : 58,
                calfRight: isMale ? 38.0 : 36,
                calfLeft: isMale ? 38.0 : 36,
            },
            skinfolds: {
                tricep: 12,
                subscapular: 15,
                chest: 8,
                axillary: 10,
                suprailiac: 14,
                abdominal: 18,
                thigh: 12,
            },
        },
        {
            id: 'ass-2',
            date: '2026-01-07',
            measurements: {
                weight: isMale ? 86 : 60.0,
                height: isMale ? 178 : 165,
                neck: isMale ? 41 : 31,
                shoulders: isMale ? 130 : 105,
                chest: isMale ? 118 : 90,
                waist: isMale ? 88 : 66,
                hips: isMale ? 98 : 100,
                armRight: isMale ? 43 : 29,
                armLeft: isMale ? 43 : 29,
                forearmRight: isMale ? 31 : 23,
                forearmLeft: isMale ? 31 : 23,
                thighRight: isMale ? 59 : 57,
                thighLeft: isMale ? 59 : 57,
                calfRight: isMale ? 37 : 35,
                calfLeft: isMale ? 37 : 35,
            },
            skinfolds: {
                tricep: 14,
                subscapular: 16,
                chest: 9,
                axillary: 11,
                suprailiac: 16,
                abdominal: 20,
                thigh: 14,
            },
        },
    ];
};

export const mockPersonalAthletes: PersonalAthlete[] = [
    {
        id: 'athlete-1',
        name: 'Ana Lima',
        email: 'ana@email.com',
        gender: 'FEMALE',
        avatarUrl: null,
        score: 92,
        scoreVariation: 3,
        ratio: 1.58,
        lastMeasurement: '2026-02-07',
        status: 'active',
        linkedSince: '2023-03-10',
        assessments: generateAssessments('FEMALE'),
    },
    {
        id: 'athlete-2',
        name: 'Carlos Souza',
        email: 'carlos@email.com',
        gender: 'MALE',
        avatarUrl: null,
        score: 88,
        scoreVariation: 1,
        ratio: 1.52,
        lastMeasurement: '2026-02-05',
        status: 'active',
        linkedSince: '2023-05-22',
        assessments: generateAssessments('MALE'),
    },
    {
        id: 'athlete-3',
        name: 'João Silva',
        email: 'joao@email.com',
        gender: 'MALE',
        avatarUrl: null,
        score: 72,
        scoreVariation: -3,
        ratio: 1.42,
        lastMeasurement: '2026-01-20',
        status: 'inactive',
        linkedSince: '2023-08-15',
        assessments: generateAssessments('MALE'),
    },
    {
        id: 'athlete-4',
        name: 'Fernanda Dias',
        email: 'fernanda@email.com',
        gender: 'FEMALE',
        avatarUrl: null,
        score: 85,
        scoreVariation: 2,
        ratio: 1.49,
        lastMeasurement: '2026-02-02',
        status: 'active',
        linkedSince: '2023-06-18',
        assessments: generateAssessments('FEMALE'),
    },
    {
        id: 'athlete-5',
        name: 'Lucas Alves',
        email: 'lucas@email.com',
        gender: 'MALE',
        avatarUrl: null,
        score: 83,
        scoreVariation: 0,
        ratio: 1.47,
        lastMeasurement: '2026-02-06',
        status: 'active',
        linkedSince: '2023-09-05',
        assessments: generateAssessments('MALE'),
    },
    {
        id: 'athlete-6',
        name: 'Maria Santos',
        email: 'maria@email.com',
        gender: 'FEMALE',
        avatarUrl: null,
        score: 68,
        scoreVariation: 0,
        ratio: 1.38,
        lastMeasurement: '2026-02-05',
        status: 'attention',
        linkedSince: '2024-01-12',
        assessments: generateAssessments('FEMALE'),
    },
    {
        id: 'athlete-7',
        name: 'Julia Rocha',
        email: 'julia@email.com',
        gender: 'FEMALE',
        avatarUrl: null,
        score: 81,
        scoreVariation: 4,
        ratio: 1.45,
        lastMeasurement: '2026-02-07',
        status: 'active',
        linkedSince: '2023-11-20',
        assessments: generateAssessments('FEMALE'),
    },
    {
        id: 'athlete-8',
        name: 'Pedro Costa',
        email: 'pedro@email.com',
        gender: 'MALE',
        avatarUrl: null,
        score: 65,
        scoreVariation: -5,
        ratio: 1.35,
        lastMeasurement: '2026-02-04',
        status: 'attention',
        linkedSince: '2024-02-08',
        assessments: generateAssessments('MALE'),
    },
    {
        id: 'athlete-9',
        name: 'Beatriz Oliveira',
        email: 'beatriz@email.com',
        gender: 'FEMALE',
        avatarUrl: null,
        score: 79,
        scoreVariation: 1,
        ratio: 1.43,
        lastMeasurement: '2026-02-06',
        status: 'active',
        linkedSince: '2023-10-30',
        assessments: generateAssessments('FEMALE'),
    },
    {
        id: 'athlete-10',
        name: 'Rafael Mendes',
        email: 'rafael@email.com',
        gender: 'MALE',
        avatarUrl: null,
        score: 76,
        scoreVariation: 2,
        ratio: 1.41,
        lastMeasurement: '2026-02-03',
        status: 'active',
        linkedSince: '2024-03-15',
        assessments: generateAssessments('MALE'),
    },
    {
        id: 'athlete-11',
        name: 'Camila Ferreira',
        email: 'camila@email.com',
        gender: 'FEMALE',
        avatarUrl: null,
        score: 74,
        scoreVariation: -1,
        ratio: 1.40,
        lastMeasurement: '2026-01-28',
        status: 'inactive',
        linkedSince: '2024-04-22',
        assessments: generateAssessments('FEMALE'),
    },
    {
        id: 'athlete-12',
        name: 'Thiago Martins',
        email: 'thiago@email.com',
        gender: 'MALE',
        avatarUrl: null,
        score: 70,
        scoreVariation: 0,
        ratio: 1.39,
        lastMeasurement: '2026-02-01',
        status: 'active',
        linkedSince: '2024-05-10',
        assessments: generateAssessments('MALE'),
    },
];
