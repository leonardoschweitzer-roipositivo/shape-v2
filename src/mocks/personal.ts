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
        // New measurements for full analysis
        wristRight: number;
        wristLeft: number;
        kneeRight: number;
        kneeLeft: number;
        ankleRight: number;
        ankleLeft: number;
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
    totalAthletes: 8,
    maxAthletes: 20,
    measuredThisWeek: 8,
    averageScore: 78.5,
    scoreVariation: 2.1,
    needsAttention: 2,
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
        id: 'athlete-7',
        name: 'João Ogro Silva',
        email: 'joao.ogro@email.com',
        avatarUrl: null,
        score: 45,
        scoreVariation: -5,
        lastMeasurement: '2026-02-09',
        reason: 'Proporções abaixo do esperado e BF elevado.',
    },
    {
        id: 'athlete-8',
        name: 'Maria Curva Oliveira',
        email: 'maria.curva@email.com',
        avatarUrl: null,
        score: 48,
        scoreVariation: -3,
        lastMeasurement: '2026-02-09',
        reason: 'WHR desalinhado e baixo tônus muscular.',
    }
];

export const mockTopPerformers: TopPerformer[] = [
    { id: 'athlete-1', name: 'Ricardo Souza', score: 92, ratio: 1.62, position: 1 },
    { id: 'athlete-2', name: 'Fernanda Lima', score: 89, ratio: 1.58, position: 2 },
    { id: 'athlete-3', name: 'Bruno Silva', score: 85, ratio: 1.55, position: 3 },
];

export const mockRecentActivity: RecentActivity[] = [
    { id: '1', athleteName: 'João Ogro Silva', action: 'Registrou medidas', timestamp: '2026-02-09T10:30:00', type: 'measurement' },
    { id: '2', athleteName: 'Maria Curva Oliveira', action: 'Registrou medidas', timestamp: '2026-02-09T09:15:00', type: 'measurement' },
];

// --- MALE ATHLETES ---

const m1_current: MeasurementHistory = {
    id: 'm1-curr', date: '2026-02-08',
    measurements: { weight: 95.5, height: 182, neck: 44, shoulders: 142, chest: 125, waist: 82, hips: 102, armRight: 46.5, armLeft: 46.5, forearmRight: 36, forearmLeft: 36, thighRight: 68, thighLeft: 68, calfRight: 42, calfLeft: 42, wristRight: 18, wristLeft: 18, kneeRight: 42, kneeLeft: 42, ankleRight: 24, ankleLeft: 24 },
    skinfolds: { tricep: 8, subscapular: 10, chest: 6, axillary: 8, suprailiac: 8, abdominal: 10, thigh: 8 }
};
const m1_old: MeasurementHistory = {
    id: 'm1-old', date: '2025-08-08',
    measurements: { weight: 92.0, height: 182, neck: 43, shoulders: 138, chest: 120, waist: 86, hips: 103, armRight: 45.0, armLeft: 44.0, forearmRight: 35, forearmLeft: 34.5, thighRight: 66, thighLeft: 66, calfRight: 41, calfLeft: 41, wristRight: 18, wristLeft: 18, kneeRight: 41, kneeLeft: 41, ankleRight: 24, ankleLeft: 24 },
    skinfolds: { tricep: 12, subscapular: 14, chest: 9, axillary: 11, suprailiac: 14, abdominal: 16, thigh: 12 }
};

const m2_current: MeasurementHistory = {
    id: 'm2-curr', date: '2026-02-05',
    measurements: { weight: 82.0, height: 175, neck: 40, shoulders: 132, chest: 112, waist: 76, hips: 94, armRight: 41, armLeft: 41, forearmRight: 32, forearmLeft: 32, thighRight: 58, thighLeft: 58, calfRight: 38, calfLeft: 38, wristRight: 17, wristLeft: 17, kneeRight: 38, kneeLeft: 38, ankleRight: 22, ankleLeft: 22 },
    skinfolds: { tricep: 7, subscapular: 9, chest: 5, axillary: 7, suprailiac: 6, abdominal: 8, thigh: 8 }
};
const m2_old: MeasurementHistory = {
    id: 'm2-old', date: '2025-08-05',
    measurements: { weight: 78.0, height: 175, neck: 39, shoulders: 125, chest: 108, waist: 80, hips: 95, armRight: 39, armLeft: 38.5, forearmRight: 31, forearmLeft: 31, thighRight: 56, thighLeft: 56, calfRight: 37, calfLeft: 37, wristRight: 17, wristLeft: 17, kneeRight: 37, kneeLeft: 37, ankleRight: 22, ankleLeft: 22 },
    skinfolds: { tricep: 10, subscapular: 12, chest: 8, axillary: 10, suprailiac: 12, abdominal: 14, thigh: 10 }
};

const m3_current: MeasurementHistory = {
    id: 'm3-curr', date: '2026-02-01',
    measurements: { weight: 105.0, height: 178, neck: 46, shoulders: 140, chest: 130, waist: 95, hips: 110, armRight: 48, armLeft: 48, forearmRight: 38, forearmLeft: 38, thighRight: 72, thighLeft: 72, calfRight: 45, calfLeft: 45, wristRight: 19, wristLeft: 19, kneeRight: 44, kneeLeft: 44, ankleRight: 26, ankleLeft: 26 },
    skinfolds: { tricep: 14, subscapular: 16, chest: 10, axillary: 12, suprailiac: 15, abdominal: 18, thigh: 14 }
};
const m3_old: MeasurementHistory = {
    id: 'm3-old', date: '2025-08-01',
    measurements: { weight: 115.0, height: 178, neck: 46, shoulders: 138, chest: 132, waist: 108, hips: 115, armRight: 47, armLeft: 47, forearmRight: 37, forearmLeft: 37, thighRight: 74, thighLeft: 74, calfRight: 45, calfLeft: 45, wristRight: 19, wristLeft: 19, kneeRight: 44, kneeLeft: 44, ankleRight: 26, ankleLeft: 26 },
    skinfolds: { tricep: 20, subscapular: 24, chest: 18, axillary: 20, suprailiac: 25, abdominal: 28, thigh: 20 }
};

const m4_current: MeasurementHistory = {
    id: 'm4-curr', date: '2026-02-09',
    measurements: { weight: 110.0, height: 175, neck: 42, shoulders: 115, chest: 105, waist: 112, hips: 115, armRight: 36, armLeft: 35.5, forearmRight: 28, forearmLeft: 28, thighRight: 60, thighLeft: 59, calfRight: 38, calfLeft: 38, wristRight: 18.5, wristLeft: 18.5, kneeRight: 42, kneeLeft: 42, ankleRight: 25, ankleLeft: 25 },
    skinfolds: { tricep: 25, subscapular: 30, chest: 22, axillary: 28, suprailiac: 35, abdominal: 40, thigh: 25 }
};

// --- FEMALE ATHLETES ---

const f1_current: MeasurementHistory = {
    id: 'f1-curr', date: '2026-02-08',
    measurements: { weight: 68.0, height: 165, neck: 32, shoulders: 108, chest: 92, waist: 64, hips: 105, armRight: 31, armLeft: 31, forearmRight: 25, forearmLeft: 25, thighRight: 64, thighLeft: 64, calfRight: 38, calfLeft: 38, wristRight: 15, wristLeft: 15, kneeRight: 36, kneeLeft: 36, ankleRight: 21, ankleLeft: 21 },
    skinfolds: { tricep: 12, subscapular: 14, chest: 8, axillary: 10, suprailiac: 10, abdominal: 12, thigh: 14 }
};
const f1_old: MeasurementHistory = {
    id: 'f1-old', date: '2025-08-08',
    measurements: { weight: 64.0, height: 165, neck: 31, shoulders: 105, chest: 90, waist: 68, hips: 98, armRight: 29, armLeft: 29, forearmRight: 24, forearmLeft: 24, thighRight: 59, thighLeft: 59, calfRight: 36, calfLeft: 36, wristRight: 15, wristLeft: 15, kneeRight: 35, kneeLeft: 35, ankleRight: 21, ankleLeft: 21 },
    skinfolds: { tricep: 15, subscapular: 16, chest: 10, axillary: 12, suprailiac: 14, abdominal: 16, thigh: 18 }
};

const f2_current: MeasurementHistory = {
    id: 'f2-curr', date: '2026-02-06',
    measurements: { weight: 56.0, height: 162, neck: 30, shoulders: 102, chest: 88, waist: 60, hips: 92, armRight: 28, armLeft: 28, forearmRight: 23, forearmLeft: 23, thighRight: 54, thighLeft: 54, calfRight: 34, calfLeft: 34, wristRight: 14, wristLeft: 14, kneeRight: 34, kneeLeft: 34, ankleRight: 20, ankleLeft: 20 },
    skinfolds: { tricep: 10, subscapular: 10, chest: 6, axillary: 8, suprailiac: 8, abdominal: 9, thigh: 11 }
};
const f2_old: MeasurementHistory = {
    id: 'f2-old', date: '2025-08-06',
    measurements: { weight: 60.0, height: 162, neck: 30, shoulders: 98, chest: 90, waist: 66, hips: 94, armRight: 26, armLeft: 26, forearmRight: 22, forearmLeft: 22, thighRight: 56, thighLeft: 56, calfRight: 35, calfLeft: 35, wristRight: 14, wristLeft: 14, kneeRight: 34, kneeLeft: 34, ankleRight: 20, ankleLeft: 20 },
    skinfolds: { tricep: 14, subscapular: 15, chest: 10, axillary: 12, suprailiac: 14, abdominal: 16, thigh: 16 }
};

const f3_current: MeasurementHistory = {
    id: 'f3-curr', date: '2026-02-03',
    measurements: { weight: 72.0, height: 170, neck: 34, shoulders: 118, chest: 100, waist: 70, hips: 102, armRight: 35, armLeft: 35, forearmRight: 28, forearmLeft: 28, thighRight: 62, thighLeft: 62, calfRight: 40, calfLeft: 40, wristRight: 16, wristLeft: 16, kneeRight: 38, kneeLeft: 38, ankleRight: 22, ankleLeft: 22 },
    skinfolds: { tricep: 9, subscapular: 10, chest: 6, axillary: 8, suprailiac: 9, abdominal: 10, thigh: 10 }
};
const f3_old: MeasurementHistory = {
    id: 'f3-old', date: '2025-08-03',
    measurements: { weight: 70.0, height: 170, neck: 33, shoulders: 112, chest: 98, waist: 74, hips: 104, armRight: 33, armLeft: 32.5, forearmRight: 27, forearmLeft: 27, thighRight: 60, thighLeft: 60, calfRight: 39, calfLeft: 39, wristRight: 16, wristLeft: 16, kneeRight: 37, kneeLeft: 37, ankleRight: 22, ankleLeft: 22 },
    skinfolds: { tricep: 12, subscapular: 14, chest: 10, axillary: 12, suprailiac: 14, abdominal: 16, thigh: 14 }
};

const f4_current: MeasurementHistory = {
    id: 'f4-curr', date: '2026-02-09',
    measurements: { weight: 85.0, height: 160, neck: 36, shoulders: 95, chest: 100, waist: 98, hips: 110, armRight: 34, armLeft: 33.5, forearmRight: 26, forearmLeft: 26, thighRight: 62, thighLeft: 61, calfRight: 37, calfLeft: 37, wristRight: 15.5, wristLeft: 15.5, kneeRight: 38, kneeLeft: 38, ankleRight: 22, ankleLeft: 22 },
    skinfolds: { tricep: 28, subscapular: 32, chest: 24, axillary: 30, suprailiac: 38, abdominal: 45, thigh: 35 }
};

export const mockPersonalAthletes: PersonalAthlete[] = [
    { id: 'athlete-1', name: 'Ricardo Souza', email: 'ricardo@email.com', gender: 'MALE', avatarUrl: null, score: 92, scoreVariation: 5, ratio: 1.62, lastMeasurement: '2026-02-08', status: 'active', linkedSince: '2024-01-15', assessments: [m1_current, m1_old] },
    { id: 'athlete-2', name: 'Fernanda Lima', email: 'fernanda@email.com', gender: 'FEMALE', avatarUrl: null, score: 89, scoreVariation: 4, ratio: 1.58, lastMeasurement: '2026-02-08', status: 'active', linkedSince: '2024-02-20', assessments: [f1_current, f1_old] },
    { id: 'athlete-3', name: 'Bruno Silva', email: 'bruno@email.com', gender: 'MALE', avatarUrl: null, score: 85, scoreVariation: 8, ratio: 1.55, lastMeasurement: '2026-02-05', status: 'active', linkedSince: '2023-11-10', assessments: [m2_current, m2_old] },
    { id: 'athlete-4', name: 'Camila Rocha', email: 'camila@email.com', gender: 'FEMALE', avatarUrl: null, score: 88, scoreVariation: 7, ratio: 1.52, lastMeasurement: '2026-02-06', status: 'active', linkedSince: '2023-10-05', assessments: [f2_current, f2_old] },
    { id: 'athlete-5', name: 'Gabriel Torres', email: 'gabriel@email.com', gender: 'MALE', avatarUrl: null, score: 78, scoreVariation: 12, ratio: 1.45, lastMeasurement: '2026-02-01', status: 'active', linkedSince: '2024-03-01', assessments: [m3_current, m3_old] },
    { id: 'athlete-6', name: 'Larissa Mendes', email: 'larissa@email.com', gender: 'FEMALE', avatarUrl: null, score: 84, scoreVariation: 6, ratio: 1.50, lastMeasurement: '2026-02-03', status: 'active', linkedSince: '2023-12-12', assessments: [f3_current, f3_old] },
    { id: 'athlete-7', name: 'João Ogro Silva', email: 'joao.ogro@email.com', gender: 'MALE', avatarUrl: null, score: 45, scoreVariation: -5, ratio: 1.02, lastMeasurement: '2026-02-09', status: 'attention', linkedSince: '2024-05-01', assessments: [m4_current] },
    { id: 'athlete-8', name: 'Maria Curva Oliveira', email: 'maria.curva@email.com', gender: 'FEMALE', avatarUrl: null, score: 48, scoreVariation: -3, ratio: 0.97, lastMeasurement: '2026-02-09', status: 'attention', linkedSince: '2024-05-10', assessments: [f4_current] },
];
