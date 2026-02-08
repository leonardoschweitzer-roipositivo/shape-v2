// Types for Settings - VITRU IA
// Based on: docs/specs/settings.md

// ============================================
// SETTINGS SECTIONS
// ============================================

export interface SettingsSection {
    id: string;
    icon: string;
    label: string;
    description: string;
    badge?: 'PRO' | 'VITRÚVIO';
}

export const ATHLETE_SETTINGS_SECTIONS: SettingsSection[] = [
    { id: 'account', icon: 'User', label: 'Conta', description: 'Email, senha e dados de acesso' },
    { id: 'appearance', icon: 'Layout', label: 'Aparência', description: 'Personalize as cores da interface' },
    { id: 'notifications', icon: 'Bell', label: 'Notificações', description: 'Alertas e lembretes' },
    { id: 'privacy', icon: 'Shield', label: 'Privacidade', description: 'Visibilidade e compartilhamento' },
    { id: 'security', icon: 'Lock', label: 'Segurança', description: 'Senha, 2FA e sessões' },
    { id: 'plan', icon: 'CreditCard', label: 'Plano', description: 'Assinatura e pagamentos' },
    { id: 'data', icon: 'Database', label: 'Meus Dados', description: 'Exportar ou excluir dados' },
];

export type SettingsSectionId =
    | 'account'
    | 'appearance'
    | 'notifications'
    | 'privacy'
    | 'security'
    | 'plan'
    | 'data';

// ============================================
// NOTIFICATION SETTINGS
// ============================================

export interface NotificationChannel {
    push: boolean;
    email: boolean;
}

export interface NotificationSettings {
    medicaoLembrete: NotificationChannel & { frequency: 'off' | 'daily' | 'weekly' | 'monthly' };
    insightsVitruvio: NotificationChannel;
    conquistasMarcos: NotificationChannel;
    relatorioSemanal: NotificationChannel;
    novidadesApp: NotificationChannel;
    promocoes: NotificationChannel;
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
    medicaoLembrete: { push: true, email: false, frequency: 'weekly' },
    insightsVitruvio: { push: true, email: true },
    conquistasMarcos: { push: true, email: false },
    relatorioSemanal: { push: false, email: true },
    novidadesApp: { push: true, email: false },
    promocoes: { push: false, email: false },
};

// ============================================
// PRIVACY SETTINGS
// ============================================

export interface PrivacySettings {
    public: {
        aparecerHallDeuses: boolean;
        mostrarFotoRanking: boolean;
        permitirComparacoesAnonimas: boolean;
    };
    personal: {
        fotosProgresso: boolean;
    };
    data: {
        analyticsDeUso: boolean;
        dadosParaPesquisa: boolean;
    };
}

export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
    public: {
        aparecerHallDeuses: true,
        mostrarFotoRanking: false,
        permitirComparacoesAnonimas: true,
    },
    personal: {
        fotosProgresso: true,
    },
    data: {
        analyticsDeUso: true,
        dadosParaPesquisa: false,
    },
};

// ============================================
// PROFILE PREFERENCES
// ============================================

export type UnitSystem = 'metric' | 'imperial';
export type ProportionMethod = 'golden_ratio' | 'classic_physique' | 'mens_physique';
export type ThemeMode = 'dark' | 'light' | 'system';

export interface ProfilePreferences {
    unitSystem: UnitSystem;
    proportionMethod: ProportionMethod;
    theme: ThemeMode;
    language: 'pt-BR' | 'en-US';
    primaryColor: string;
}

export const DEFAULT_PROFILE_PREFERENCES: ProfilePreferences = {
    unitSystem: 'metric',
    proportionMethod: 'golden_ratio',
    theme: 'dark',
    language: 'pt-BR',
    primaryColor: '#00C9A7', // Default Teal
};

// ============================================
// ACCOUNT STATUS
// ============================================

export interface AccountStatus {
    emailVerified: boolean;
    connectedAccounts: {
        google: boolean;
        apple: boolean;
    };
    linkedPersonal?: {
        id: string;
        name: string;
        linkedAt: Date;
    };
}

// ============================================
// PLAN INFO
// ============================================

export type PlanType = 'FREE' | 'PRO';

export interface PlanInfo {
    type: PlanType;
    nextBillingDate?: Date;
    paymentMethod?: string;
    coveredByPersonal: boolean;
}

export const DEFAULT_PLAN_INFO: PlanInfo = {
    type: 'FREE',
    coveredByPersonal: false,
};

// ============================================
// COMPLETE ATHLETE SETTINGS
// ============================================

export interface AthleteSettings {
    notifications: NotificationSettings;
    privacy: PrivacySettings;
    preferences: ProfilePreferences;
    plan: PlanInfo;
}

export const DEFAULT_ATHLETE_SETTINGS: AthleteSettings = {
    notifications: DEFAULT_NOTIFICATION_SETTINGS,
    privacy: DEFAULT_PRIVACY_SETTINGS,
    preferences: DEFAULT_PROFILE_PREFERENCES,
    plan: DEFAULT_PLAN_INFO,
};
