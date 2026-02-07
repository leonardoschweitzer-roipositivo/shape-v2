// Types for Athlete Profile - VITRU IA

// ============================================
// BASIC ENUMS
// ============================================

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type UserGoal =
    | 'aesthetics'      // Estética / Proporções
    | 'hypertrophy'     // Ganhar massa
    | 'definition'      // Definição / Secar
    | 'health'          // Saúde geral
    | 'competition';    // Competição

// ============================================
// PROGRESSIVE PROFILING TYPES
// ============================================

export type RotinaDiaria = 'sedentaria' | 'leve' | 'moderada' | 'ativa' | 'muito_ativa';
export type NivelEstresse = 'baixo' | 'moderado' | 'alto' | 'muito_alto';
export type ExperienciaTreino = 'menos_1' | '1_3' | '3_5' | '5_10' | 'mais_10';
export type LocalTreino = 'academia_completa' | 'academia_simples' | 'home_gym' | 'ar_livre';
export type TipoDieta = 'sem_dieta' | 'low_carb' | 'cetogenica' | 'vegetariana' | 'vegana' | 'flexivel' | 'outra';
export type OrcamentoAlimentacao = 'baixo' | 'medio' | 'alto';

export interface LifestyleData {
    profissao: string;
    rotinaDiaria: RotinaDiaria;
    horasSono: number;
    nivelEstresse: NivelEstresse;
}

export interface CondicaoSaude {
    nome: string;
    descricao?: string;
}

export interface Lesao {
    local: string;
    tipo: string;
    status: 'recuperando' | 'cronica' | 'curada';
}

export interface Medicamento {
    nome: string;
    dosagem?: string;
    frequencia?: string;
}

export interface HealthData {
    condicoesSaude: CondicaoSaude[];
    lesoes: Lesao[];
    medicamentos: Medicamento[];
}

export interface Suplemento {
    nome: string;
    dosagem?: string;
    momento?: string;
}

export interface SupplementsData {
    suplementos: Suplemento[];
    usaErgogenicos: boolean;
    tipoErgogenico?: string;
}

export interface TrainingData {
    tempoTreinando: ExperienciaTreino;
    frequenciaTreino: number;  // dias por semana
    duracaoTreino: number;     // minutos
    localTreino: LocalTreino;
    equipamentos: string[];
}

export interface NutritionData {
    dietaAtual: TipoDieta;
    refeicoesdia: number;
    alergias: string[];
    cozinha: boolean;
    orcamento: OrcamentoAlimentacao;
}

// ============================================
// PROFILE COMPLETION
// ============================================

export interface ProfileCompletion {
    basic: boolean;           // Nome, email, sexo, objetivo
    structural: boolean;      // Altura, punho, tornozelo
    lifestyle: boolean;
    health: boolean;
    supplements: boolean;
    training: boolean;
    nutrition: boolean;
    percent: number;          // 0-100
    canUseVitruvio: boolean;  // true se >= 80%
}

// ============================================
// MAIN ATHLETE PROFILE
// ============================================

export interface AthleteProfile {
    // Account
    id: string;
    email: string;
    createdAt: Date;

    // Basic Profile
    name: string;
    gender: Gender;
    birthDate: Date;
    goal: UserGoal;
    avatarUrl?: string;

    // Structural measures (não mudam)
    altura: number;     // cm
    punho: number;      // cm
    tornozelo: number;  // cm

    // Progressive Profiling (opcional)
    lifestyle?: LifestyleData;
    health?: HealthData;
    supplements?: SupplementsData;
    training?: TrainingData;
    nutrition?: NutritionData;

    // Completion flags
    profileCompletion: ProfileCompletion;

    // Latest scores (from last assessment)
    latestScore?: {
        overall: number;
        ratio: number;
        classification: string;
    };
}

// ============================================
// UI HELPER TYPES
// ============================================

export const GOAL_LABELS: Record<UserGoal, string> = {
    aesthetics: 'Melhorar proporções',
    hypertrophy: 'Ganhar massa muscular',
    definition: 'Definição / Secar',
    health: 'Saúde geral',
    competition: 'Competição',
};

export const GENDER_LABELS: Record<Gender, string> = {
    MALE: 'Masculino',
    FEMALE: 'Feminino',
    OTHER: 'Outro',
};

export const EXPERIENCIA_LABELS: Record<ExperienciaTreino, string> = {
    menos_1: 'Menos de 1 ano',
    '1_3': '1 a 3 anos',
    '3_5': '3 a 5 anos',
    '5_10': '5 a 10 anos',
    mais_10: 'Mais de 10 anos',
};
