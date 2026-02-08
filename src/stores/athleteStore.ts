import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    AthleteProfile,
    ProfileCompletion,
    LifestyleData,
    HealthData,
    SupplementsData,
    TrainingData,
    NutritionData,
    Gender,
    UserGoal
} from '../types/athlete';
import {
    AthleteSettings,
    DEFAULT_ATHLETE_SETTINGS,
    NotificationSettings,
    PrivacySettings,
    ProfilePreferences
} from '../types/settings';

// ============================================
// HELPER: Calculate profile completion
// ============================================

function calculateCompletion(profile: Partial<AthleteProfile>): ProfileCompletion {
    const hasBasic = !!(profile.name && profile.email && profile.gender && profile.goal && profile.birthDate);
    const hasStructural = !!(profile.altura && profile.punho && profile.tornozelo);
    const hasLifestyle = !!profile.lifestyle;
    const hasHealth = !!profile.health;
    const hasSupplements = !!profile.supplements;
    const hasTraining = !!profile.training;
    const hasNutrition = !!profile.nutrition;

    const sections = [hasBasic, hasStructural, hasLifestyle, hasHealth, hasSupplements, hasTraining, hasNutrition];
    const completedSections = sections.filter(Boolean).length;
    const percent = Math.round((completedSections / sections.length) * 100);

    return {
        basic: hasBasic,
        structural: hasStructural,
        lifestyle: hasLifestyle,
        health: hasHealth,
        supplements: hasSupplements,
        training: hasTraining,
        nutrition: hasNutrition,
        percent,
        canUseVitruvio: percent >= 80,
    };
}

// ============================================
// STORE INTERFACE
// ============================================

interface AthleteState {
    profile: AthleteProfile | null;
    settings: AthleteSettings;
    isLoading: boolean;

    // Actions
    initializeProfile: (data: {
        name: string;
        email: string;
        gender: Gender;
        birthDate: Date;
        goal: UserGoal;
    }) => void;

    updateBasicInfo: (data: {
        name?: string;
        email?: string;
        gender?: Gender;
        birthDate?: Date;
        goal?: UserGoal;
        avatarUrl?: string;
    }) => void;

    updateStructuralMeasures: (data: {
        altura: number;
        punho: number;
        tornozelo: number;
    }) => void;

    updateLifestyle: (data: LifestyleData) => void;
    updateHealth: (data: HealthData) => void;
    updateSupplements: (data: SupplementsData) => void;
    updateTraining: (data: TrainingData) => void;
    updateNutrition: (data: NutritionData) => void;

    updateLatestScore: (score: { overall: number; ratio: number; classification: string }) => void;

    // Settings actions
    updateNotifications: (data: Partial<NotificationSettings>) => void;
    updatePrivacy: (data: Partial<PrivacySettings>) => void;
    updatePreferences: (data: Partial<ProfilePreferences>) => void;

    clearProfile: () => void;
}

// ============================================
// CREATE STORE WITH PERSISTENCE
// ============================================

export const useAthleteStore = create<AthleteState>()(
    persist(
        (set, get) => ({
            profile: null,
            settings: DEFAULT_ATHLETE_SETTINGS,
            isLoading: false,

            initializeProfile: (data) => {
                const newProfile: AthleteProfile = {
                    id: `athlete-${Date.now()}`,
                    email: data.email,
                    createdAt: new Date(),
                    name: data.name,
                    gender: data.gender,
                    birthDate: data.birthDate,
                    goal: data.goal,
                    altura: 0,
                    punho: 0,
                    tornozelo: 0,
                    profileCompletion: calculateCompletion({
                        name: data.name,
                        email: data.email,
                        gender: data.gender,
                        birthDate: data.birthDate,
                        goal: data.goal,
                    }),
                };
                set({ profile: newProfile });
            },

            updateBasicInfo: (data) => {
                const current = get().profile;
                if (!current) return;

                const updated = {
                    ...current,
                    ...data,
                    birthDate: data.birthDate || current.birthDate,
                };
                updated.profileCompletion = calculateCompletion(updated);
                set({ profile: updated });
            },

            updateStructuralMeasures: (data) => {
                const current = get().profile;
                if (!current) return;

                const updated = {
                    ...current,
                    altura: data.altura,
                    punho: data.punho,
                    tornozelo: data.tornozelo,
                };
                updated.profileCompletion = calculateCompletion(updated);
                set({ profile: updated });
            },

            updateLifestyle: (data) => {
                const current = get().profile;
                if (!current) return;

                const updated = { ...current, lifestyle: data };
                updated.profileCompletion = calculateCompletion(updated);
                set({ profile: updated });
            },

            updateHealth: (data) => {
                const current = get().profile;
                if (!current) return;

                const updated = { ...current, health: data };
                updated.profileCompletion = calculateCompletion(updated);
                set({ profile: updated });
            },

            updateSupplements: (data) => {
                const current = get().profile;
                if (!current) return;

                const updated = { ...current, supplements: data };
                updated.profileCompletion = calculateCompletion(updated);
                set({ profile: updated });
            },

            updateTraining: (data) => {
                const current = get().profile;
                if (!current) return;

                const updated = { ...current, training: data };
                updated.profileCompletion = calculateCompletion(updated);
                set({ profile: updated });
            },

            updateNutrition: (data) => {
                const current = get().profile;
                if (!current) return;

                const updated = { ...current, nutrition: data };
                updated.profileCompletion = calculateCompletion(updated);
                set({ profile: updated });
            },

            updateLatestScore: (score) => {
                const current = get().profile;
                if (!current) return;

                set({ profile: { ...current, latestScore: score } });
            },

            // Settings actions
            updateNotifications: (data) => {
                const current = get().settings;
                set({
                    settings: {
                        ...current,
                        notifications: { ...current.notifications, ...data },
                    },
                });
            },

            updatePrivacy: (data) => {
                const current = get().settings;
                set({
                    settings: {
                        ...current,
                        privacy: {
                            ...current.privacy,
                            public: { ...current.privacy.public, ...data.public },
                            personal: { ...current.privacy.personal, ...data.personal },
                            data: { ...current.privacy.data, ...data.data },
                        },
                    },
                });
            },

            updatePreferences: (data) => {
                const current = get().settings;
                set({
                    settings: {
                        ...current,
                        preferences: { ...current.preferences, ...data },
                    },
                });
            },

            clearProfile: () => {
                set({ profile: null, settings: DEFAULT_ATHLETE_SETTINGS });
            },
        }),
        {
            name: 'vitru-athlete-storage',
            // Custom serializer for Date objects
            storage: {
                getItem: (name) => {
                    const str = localStorage.getItem(name);
                    if (!str) return null;
                    const data = JSON.parse(str);
                    // Rehydrate Date objects
                    if (data.state?.profile) {
                        if (data.state.profile.createdAt) {
                            data.state.profile.createdAt = new Date(data.state.profile.createdAt);
                        }
                        if (data.state.profile.birthDate) {
                            data.state.profile.birthDate = new Date(data.state.profile.birthDate);
                        }
                    }
                    return data;
                },
                setItem: (name, value) => {
                    localStorage.setItem(name, JSON.stringify(value));
                },
                removeItem: (name) => {
                    localStorage.removeItem(name);
                },
            },
        }
    )
);
