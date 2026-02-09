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
        pelvis: number;
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
        ankleRightProp?: number;
        ankleLeftProp?: number;
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
    averageScore: 61.2,
    scoreVariation: -1.5,
    needsAttention: 4,
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
        score: 42,
        scoreVariation: 6,
        lastMeasurement: '2026-02-09',
        reason: 'BF elevado e V-Taper inexistente.',
    },
    {
        id: 'athlete-5',
        name: 'Gabriel Torres',
        email: 'gabriel@email.com',
        avatarUrl: null,
        score: 48,
        scoreVariation: 4,
        lastMeasurement: '2026-02-01',
        reason: 'Acima do peso ideal e simetria comprometida.',
    },
    {
        id: 'athlete-8',
        name: 'Maria Curva Oliveira',
        email: 'maria.curva@email.com',
        avatarUrl: null,
        score: 44,
        scoreVariation: 5,
        lastMeasurement: '2026-02-09',
        reason: 'WHR desalinhado e baixo tônus muscular.',
    }
];

export const mockTopPerformers: TopPerformer[] = [
    { id: 'athlete-1', name: 'Ricardo Souza', score: 92, ratio: 1.62, position: 1 },
    { id: 'athlete-2', name: 'Fernanda Lima', score: 89, ratio: 1.58, position: 2 },
    { id: 'athlete-6', name: 'Larissa Mendes', score: 58, ratio: 1.25, position: 3 },
];

export const mockRecentActivity: RecentActivity[] = [
    { id: '1', athleteName: 'Leonardo Schiwetzer', action: 'Registrou medidas', timestamp: '2026-02-09T10:30:00', type: 'measurement' },
    { id: '2', athleteName: 'João Ogro Silva', action: 'Registrou medidas', timestamp: '2026-02-09T10:25:00', type: 'measurement' },
    { id: '3', athleteName: 'Maria Curva Oliveira', action: 'Registrou medidas', timestamp: '2026-02-09T09:15:00', type: 'measurement' },
];

// --- MALE ATHLETES ---

const m1_current: MeasurementHistory = {
    id: 'm1-curr', date: '2026-02-08',
    measurements: { weight: 95.5, height: 182, neck: 44, shoulders: 142, chest: 125, waist: 82, hips: 102, pelvis: 98, armRight: 46.5, armLeft: 46.5, forearmRight: 36, forearmLeft: 36, thighRight: 68, thighLeft: 68, calfRight: 42, calfLeft: 42, wristRight: 18, wristLeft: 18, kneeRight: 42, kneeLeft: 42, ankleRight: 24, ankleLeft: 24 },
    skinfolds: { tricep: 8, subscapular: 10, chest: 6, axillary: 8, suprailiac: 8, abdominal: 10, thigh: 8 }
};
const m1_old: MeasurementHistory = {
    id: 'm1-old', date: '2025-08-08',
    measurements: { weight: 92.0, height: 182, neck: 43, shoulders: 138, chest: 120, waist: 86, hips: 103, pelvis: 99, armRight: 45.0, armLeft: 44.0, forearmRight: 35, forearmLeft: 34.5, thighRight: 66, thighLeft: 66, calfRight: 41, calfLeft: 41, wristRight: 18, wristLeft: 18, kneeRight: 41, kneeLeft: 41, ankleRight: 24, ankleLeft: 24 },
    skinfolds: { tricep: 12, subscapular: 14, chest: 9, axillary: 11, suprailiac: 14, abdominal: 16, thigh: 12 }
};

// Bruno Silva - Normal/Overweight
const m2_current: MeasurementHistory = {
    id: 'm2-curr', date: '2026-02-05',
    measurements: { weight: 92.0, height: 175, neck: 39, shoulders: 118, chest: 105, waist: 96, hips: 108, pelvis: 104, armRight: 35, armLeft: 35, forearmRight: 29, forearmLeft: 29, thighRight: 62, thighLeft: 62, calfRight: 38, calfLeft: 38, wristRight: 17, wristLeft: 17, kneeRight: 38, kneeLeft: 38, ankleRight: 22, ankleLeft: 22 },
    skinfolds: { tricep: 18, subscapular: 20, chest: 15, axillary: 18, suprailiac: 22, abdominal: 25, thigh: 18 }
};
const m2_old: MeasurementHistory = {
    id: 'm2-old', date: '2025-08-05',
    measurements: { weight: 95.0, height: 175, neck: 38, shoulders: 115, chest: 102, waist: 104, hips: 112, pelvis: 108, armRight: 34, armLeft: 34, forearmRight: 28, forearmLeft: 28, thighRight: 64, thighLeft: 64, calfRight: 37, calfLeft: 37, wristRight: 17, wristLeft: 17, kneeRight: 37, kneeLeft: 37, ankleRight: 22, ankleLeft: 22 },
    skinfolds: { tricep: 22, subscapular: 25, chest: 18, axillary: 22, suprailiac: 28, abdominal: 32, thigh: 20 }
};

// Gabriel Torres - Obese/Overweight
const m3_current: MeasurementHistory = {
    id: 'm3-curr', date: '2026-02-01',
    measurements: { weight: 105.0, height: 178, neck: 40, shoulders: 122, chest: 110, waist: 108, hips: 115, pelvis: 110, armRight: 37, armLeft: 36.5, forearmRight: 30, forearmLeft: 30, thighRight: 68, thighLeft: 68, calfRight: 40, calfLeft: 40, wristRight: 19, wristLeft: 19, kneeRight: 42, kneeLeft: 42, ankleRight: 25, ankleLeft: 25 },
    skinfolds: { tricep: 22, subscapular: 26, chest: 20, axillary: 24, suprailiac: 30, abdominal: 35, thigh: 22 }
};
const m3_old: MeasurementHistory = {
    id: 'm3-old', date: '2025-08-01',
    measurements: { weight: 110.0, height: 178, neck: 40, shoulders: 118, chest: 108, waist: 115, hips: 120, pelvis: 115, armRight: 36, armLeft: 36, forearmRight: 29, forearmLeft: 29, thighRight: 70, thighLeft: 70, calfRight: 40, calfLeft: 40, wristRight: 19, wristLeft: 19, kneeRight: 42, kneeLeft: 42, ankleRight: 25, ankleLeft: 25 },
    skinfolds: { tricep: 26, subscapular: 30, chest: 24, axillary: 28, suprailiac: 35, abdominal: 40, thigh: 25 }
};

// João Ogro Silva - Obese
const m4_current: MeasurementHistory = {
    id: 'm4-curr', date: '2026-02-09',
    measurements: { weight: 115.0, height: 175, neck: 42, shoulders: 115, chest: 105, waist: 118, hips: 122, pelvis: 118, armRight: 36, armLeft: 35.5, forearmRight: 28, forearmLeft: 28, thighRight: 62, thighLeft: 61, calfRight: 38, calfLeft: 38, wristRight: 18.5, wristLeft: 18.5, kneeRight: 42, kneeLeft: 42, ankleRight: 25, ankleLeft: 25 },
    skinfolds: { tricep: 28, subscapular: 32, chest: 25, axillary: 30, suprailiac: 38, abdominal: 45, thigh: 28 }
};
const m4_old: MeasurementHistory = {
    id: 'm4-old', date: '2025-09-09',
    measurements: { weight: 120.0, height: 175, neck: 42, shoulders: 112, chest: 108, waist: 125, hips: 128, pelvis: 122, armRight: 35, armLeft: 35, forearmRight: 27, forearmLeft: 27, thighRight: 64, thighLeft: 63, calfRight: 38, calfLeft: 38, wristRight: 18.5, wristLeft: 18.5, kneeRight: 42, kneeLeft: 42, ankleRight: 25, ankleLeft: 25 },
    skinfolds: { tricep: 32, subscapular: 36, chest: 30, axillary: 35, suprailiac: 42, abdominal: 50, thigh: 32 }
};

// --- FEMALE ATHLETES ---

const f1_current: MeasurementHistory = {
    id: 'f1-curr', date: '2026-02-08',
    measurements: { weight: 68.0, height: 165, neck: 32, shoulders: 108, chest: 92, waist: 64, hips: 105, pelvis: 92, armRight: 31, armLeft: 31, forearmRight: 25, forearmLeft: 25, thighRight: 64, thighLeft: 64, calfRight: 38, calfLeft: 38, wristRight: 15, wristLeft: 15, kneeRight: 36, kneeLeft: 36, ankleRight: 21, ankleLeft: 21 },
    skinfolds: { tricep: 12, subscapular: 14, chest: 8, axillary: 10, suprailiac: 10, abdominal: 12, thigh: 14 }
};
const f1_old: MeasurementHistory = {
    id: 'f1-old', date: '2025-08-08',
    measurements: { weight: 64.0, height: 165, neck: 31, shoulders: 105, chest: 90, waist: 68, hips: 98, pelvis: 88, armRight: 29, armLeft: 29, forearmRight: 24, forearmLeft: 24, thighRight: 59, thighLeft: 59, calfRight: 36, calfLeft: 36, wristRight: 15, wristLeft: 15, kneeRight: 35, kneeLeft: 35, ankleRight: 21, ankleLeft: 21 },
    skinfolds: { tricep: 15, subscapular: 16, chest: 10, axillary: 12, suprailiac: 14, abdominal: 16, thigh: 18 }
};

// Camila Rocha - Normal/Overweight
const f2_current: MeasurementHistory = {
    id: 'f2-curr', date: '2026-02-06',
    measurements: { weight: 74.0, height: 162, neck: 32, shoulders: 100, chest: 96, waist: 82, hips: 108, pelvis: 96, armRight: 29, armLeft: 29, forearmRight: 23, forearmLeft: 23, thighRight: 58, thighLeft: 58, calfRight: 35, calfLeft: 35, wristRight: 14, wristLeft: 14, kneeRight: 34, kneeLeft: 34, ankleRight: 20, ankleLeft: 20 },
    skinfolds: { tricep: 20, subscapular: 22, chest: 14, axillary: 18, suprailiac: 22, abdominal: 26, thigh: 24 }
};
const f2_old: MeasurementHistory = {
    id: 'f2-old', date: '2025-08-06',
    measurements: { weight: 78.0, height: 162, neck: 32, shoulders: 98, chest: 94, waist: 88, hips: 112, pelvis: 100, armRight: 28, armLeft: 28, forearmRight: 22, forearmLeft: 22, thighRight: 60, thighLeft: 60, calfRight: 35, calfLeft: 35, wristRight: 14, wristLeft: 14, kneeRight: 34, kneeLeft: 34, ankleRight: 20, ankleLeft: 20 },
    skinfolds: { tricep: 24, subscapular: 26, chest: 18, axillary: 22, suprailiac: 28, abdominal: 32, thigh: 28 }
};

// Larissa Mendes - Normal/Overweight
const f3_current: MeasurementHistory = {
    id: 'f3-curr', date: '2026-02-03',
    measurements: { weight: 82.0, height: 170, neck: 34, shoulders: 110, chest: 100, waist: 88, hips: 112, pelvis: 98, armRight: 33, armLeft: 33, forearmRight: 27, forearmLeft: 27, thighRight: 64, thighLeft: 64, calfRight: 40, calfLeft: 40, wristRight: 16, wristLeft: 16, kneeRight: 38, kneeLeft: 38, ankleRight: 22, ankleLeft: 22 },
    skinfolds: { tricep: 18, subscapular: 20, chest: 15, axillary: 18, suprailiac: 22, abdominal: 28, thigh: 20 }
};
const f3_old: MeasurementHistory = {
    id: 'f3-old', date: '2025-08-03',
    measurements: { weight: 86.0, height: 170, neck: 34, shoulders: 108, chest: 102, waist: 94, hips: 116, pelvis: 104, armRight: 33, armLeft: 32.5, forearmRight: 27, forearmLeft: 27, thighRight: 66, thighLeft: 66, calfRight: 40, calfLeft: 40, wristRight: 16, wristLeft: 16, kneeRight: 38, kneeLeft: 38, ankleRight: 22, ankleLeft: 22 },
    skinfolds: { tricep: 22, subscapular: 25, chest: 18, axillary: 22, suprailiac: 28, abdominal: 35, thigh: 25 }
};

// Maria Curva Oliveira - Overweight/Obese
const f4_current: MeasurementHistory = {
    id: 'f4-curr', date: '2026-02-09',
    measurements: { weight: 90.0, height: 160, neck: 36, shoulders: 95, chest: 102, waist: 98, hips: 115, pelvis: 105, armRight: 34, armLeft: 33.5, forearmRight: 26, forearmLeft: 26, thighRight: 64, thighLeft: 63, calfRight: 37, calfLeft: 37, wristRight: 15.5, wristLeft: 15.5, kneeRight: 38, kneeLeft: 38, ankleRight: 22, ankleLeft: 22 },
    skinfolds: { tricep: 28, subscapular: 32, chest: 24, axillary: 30, suprailiac: 38, abdominal: 45, thigh: 35 }
};
const f4_old: MeasurementHistory = {
    id: 'f4-old', date: '2025-10-09',
    measurements: { weight: 95.0, height: 160, neck: 36, shoulders: 92, chest: 100, waist: 104, hips: 118, pelvis: 108, armRight: 33, armLeft: 33, forearmRight: 25, forearmLeft: 25, thighRight: 66, thighLeft: 65, calfRight: 38, calfLeft: 38, wristRight: 15.5, wristLeft: 15.5, kneeRight: 38, kneeLeft: 38, ankleRight: 22, ankleLeft: 22 },
    skinfolds: { tricep: 32, subscapular: 36, chest: 30, axillary: 35, suprailiac: 42, abdominal: 52, thigh: 38 }
};

// --- LEONARDO SCHIWETZER ---
const leo_current: MeasurementHistory = {
    id: 'leo-curr', date: '2026-02-09',
    measurements: { weight: 88.8, height: 180, neck: 43, shoulders: 133.5, chest: 122.5, waist: 84.5, hips: 102.5, pelvis: 88, armRight: 42.5, armLeft: 42.0, forearmRight: 33, forearmLeft: 32.5, thighRight: 62.5, thighLeft: 61.5, calfRight: 43, calfLeft: 41.5, wristRight: 17.5, wristLeft: 17, kneeRight: 38, kneeLeft: 37, ankleRight: 23, ankleLeft: 23 },
    skinfolds: { tricep: 0, subscapular: 0, chest: 0, axillary: 0, suprailiac: 0, abdominal: 0, thigh: 0 }
};

const leo_hist_1: MeasurementHistory = {
    id: 'leo-hist-1', date: '2025-02-14',
    measurements: { weight: 96.2, height: 180, neck: 44, shoulders: 130, chest: 117, waist: 90, hips: 105, pelvis: 86, armRight: 41, armLeft: 42, forearmRight: 32, forearmLeft: 31, thighRight: 61, thighLeft: 60.5, calfRight: 40.5, calfLeft: 42, wristRight: 17.5, wristLeft: 17, kneeRight: 38, kneeLeft: 37, ankleRight: 23, ankleLeft: 23 },
    skinfolds: { tricep: 4.0, subscapular: 12.0, chest: 8.5, axillary: 0, suprailiac: 6.5, abdominal: 14.5, thigh: 11.0 }
};

const leo_hist_2: MeasurementHistory = {
    id: 'leo-hist-2', date: '2025-01-17',
    measurements: { weight: 96.5, height: 180, neck: 44, shoulders: 128, chest: 114, waist: 88, hips: 105, pelvis: 87, armRight: 41, armLeft: 42, forearmRight: 32, forearmLeft: 31, thighRight: 61.75, thighLeft: 61, calfRight: 40.75, calfLeft: 43, wristRight: 17.5, wristLeft: 17, kneeRight: 38, kneeLeft: 37, ankleRight: 23, ankleLeft: 23 },
    skinfolds: { tricep: 4.5, subscapular: 13.0, chest: 8.5, axillary: 0, suprailiac: 7.5, abdominal: 15.0, thigh: 0 }
};

export const mockPersonalAthletes: PersonalAthlete[] = [
    { id: 'athlete-leonardo', name: 'Leonardo Schiwetzer', email: 'leonardo@email.com', gender: 'MALE', avatarUrl: null, score: 78, scoreVariation: 12, ratio: 1.55, lastMeasurement: '2026-02-09', status: 'active', linkedSince: '2024-01-01', assessments: [leo_current, leo_hist_1, leo_hist_2] },
    { id: 'athlete-1', name: 'Ricardo Souza', email: 'ricardo@email.com', gender: 'MALE', avatarUrl: null, score: 92, scoreVariation: 5, ratio: 1.62, lastMeasurement: '2026-02-08', status: 'active', linkedSince: '2024-01-15', assessments: [m1_current, m1_old] },
    { id: 'athlete-2', name: 'Fernanda Lima', email: 'fernanda@email.com', gender: 'FEMALE', avatarUrl: null, score: 89, scoreVariation: 4, ratio: 1.58, lastMeasurement: '2026-02-08', status: 'active', linkedSince: '2024-02-20', assessments: [f1_current, f1_old] },
    { id: 'athlete-3', name: 'Bruno Silva', email: 'bruno@email.com', gender: 'MALE', avatarUrl: null, score: 55, scoreVariation: 8, ratio: 1.22, lastMeasurement: '2026-02-05', status: 'active', linkedSince: '2023-11-10', assessments: [m2_current, m2_old] },
    { id: 'athlete-4', name: 'Camila Rocha', email: 'camila@email.com', gender: 'FEMALE', avatarUrl: null, score: 52, scoreVariation: 6, ratio: 1.25, lastMeasurement: '2026-02-06', status: 'attention', linkedSince: '2023-10-05', assessments: [f2_current, f2_old] },
    { id: 'athlete-5', name: 'Gabriel Torres', email: 'gabriel@email.com', gender: 'MALE', avatarUrl: null, score: 48, scoreVariation: 4, ratio: 1.12, lastMeasurement: '2026-02-01', status: 'attention', linkedSince: '2024-03-01', assessments: [m3_current, m3_old] },
    { id: 'athlete-6', name: 'Larissa Mendes', email: 'larissa@email.com', gender: 'FEMALE', avatarUrl: null, score: 58, scoreVariation: 5, ratio: 1.25, lastMeasurement: '2026-02-03', status: 'active', linkedSince: '2023-12-12', assessments: [f3_current, f3_old] },
    { id: 'athlete-7', name: 'João Ogro Silva', email: 'joao.ogro@email.com', gender: 'MALE', avatarUrl: null, score: 42, scoreVariation: 6, ratio: 0.98, lastMeasurement: '2026-02-09', status: 'attention', linkedSince: '2024-05-01', assessments: [m4_current, m4_old] },
    { id: 'athlete-8', name: 'Maria Curva Oliveira', email: 'maria.curva@email.com', gender: 'FEMALE', avatarUrl: null, score: 44, scoreVariation: 5, ratio: 0.96, lastMeasurement: '2026-02-09', status: 'attention', linkedSince: '2024-05-10', assessments: [f4_current, f4_old] },
];
