export interface AcademyStats {
    totalPersonals: number;
    maxPersonals: number;
    totalAthletes: number;
    measuredThisWeek: number;
    averageScore: number;
    scoreVariation: number;
}

export interface PersonalSummary {
    id: string;
    name: string;
    avatar?: string;
    athleteCount: number;
    averageStudentScore: number;
    status: 'active' | 'inactive';
}

export interface RecentAcademyActivity {
    id: string;
    type: 'personal_invite' | 'personal_joined' | 'athlete_joined' | 'subscription_update';
    message: string;
    timestamp: string;
}

export const mockAcademyStats: AcademyStats = {
    totalPersonals: 8,
    maxPersonals: 20,
    totalAthletes: 145,
    measuredThisWeek: 92,
    averageScore: 74.8,
    scoreVariation: 2.3,
};

export const mockPersonalsSummary: PersonalSummary[] = [
    {
        id: 'p1',
        name: 'Carlos Souza',
        athleteCount: 24,
        averageStudentScore: 78.5,
        status: 'active',
    },
    {
        id: 'p2',
        name: 'Ana Lima',
        athleteCount: 18,
        averageStudentScore: 82.1,
        status: 'active',
    },
    {
        id: 'p3',
        name: 'Ricardo Silva',
        athleteCount: 15,
        averageStudentScore: 71.4,
        status: 'active',
    },
    {
        id: 'p4',
        name: 'Juliana Costa',
        athleteCount: 22,
        averageStudentScore: 75.9,
        status: 'active',
    },
    {
        id: 'p5',
        name: 'Marcos Oliveira',
        athleteCount: 12,
        averageStudentScore: 68.2,
        status: 'inactive',
    },
];

export const mockRecentAcademyActivity: RecentAcademyActivity[] = [
    {
        id: '1',
        type: 'personal_joined',
        message: 'Carlos Souza aceitou o convite e agora faz parte da sua academia.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    },
    {
        id: '2',
        type: 'athlete_joined',
        message: '5 novos atletas foram cadastrados pelos seus personais hoje.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4h ago
    },
    {
        id: '3',
        type: 'personal_invite',
        message: 'Convite enviado para Fernanda Dias (Personal Trainer).',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
        id: '4',
        type: 'subscription_update',
        message: 'Plano atualizado para Academia Business com sucesso.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    },
];
