export type UserRole = 'GOD' | 'ACADEMIA' | 'PERSONAL' | 'ATLETA';

export interface UserPermissions {
    canInvitePersonal: boolean;
    canInviteAtleta: boolean;
    canRemovePersonal: boolean;
    canRemoveAtleta: boolean;
    canViewOwnData: boolean;
    canViewAtletaData: boolean;
    canViewPersonalData: boolean;
    canViewAcademiaData: boolean;
    canCreateMeasurement: boolean;
    canEditAtletaMeasurement: boolean;
    canGenerateReports: boolean;
    canAccessCoachIA: boolean;
    /** Permissão para gerenciar a Biblioteca de Exercícios (CRUD + Upload de Vídeos) */
    canManageExercicios: boolean;
    /** Permissão para visualizar dados globais de toda a plataforma */
    canViewAllData: boolean;
}

export const PERMISSIONS: Record<UserRole, UserPermissions> = {
    GOD: {
        canInvitePersonal: true,
        canInviteAtleta: true,
        canRemovePersonal: true,
        canRemoveAtleta: true,
        canViewOwnData: true,
        canViewAtletaData: true,
        canViewPersonalData: true,
        canViewAcademiaData: true,
        canCreateMeasurement: true,
        canEditAtletaMeasurement: true,
        canGenerateReports: true,
        canAccessCoachIA: true,
        canManageExercicios: true,
        canViewAllData: true,
    },
    ACADEMIA: {
        canInvitePersonal: true,
        canInviteAtleta: false,
        canRemovePersonal: true,
        canRemoveAtleta: false,
        canViewOwnData: true,
        canViewAtletaData: true,
        canViewPersonalData: true,
        canViewAcademiaData: true,
        canCreateMeasurement: false,
        canEditAtletaMeasurement: false,
        canGenerateReports: true,
        canAccessCoachIA: false,
        canManageExercicios: false,
        canViewAllData: false,
    },
    PERSONAL: {
        canInvitePersonal: false,
        canInviteAtleta: true,
        canRemovePersonal: false,
        canRemoveAtleta: true,
        canViewOwnData: true,
        canViewAtletaData: true,
        canViewPersonalData: false,
        canViewAcademiaData: false,
        canCreateMeasurement: true,
        canEditAtletaMeasurement: true,
        canGenerateReports: true,
        canAccessCoachIA: true,
        canManageExercicios: false,
        canViewAllData: false,
    },
    ATLETA: {
        canInvitePersonal: false,
        canInviteAtleta: false,
        canRemovePersonal: false,
        canRemoveAtleta: false,
        canViewOwnData: true,
        canViewAtletaData: false,
        canViewPersonalData: false,
        canViewAcademiaData: false,
        canCreateMeasurement: true,
        canEditAtletaMeasurement: false,
        canGenerateReports: false,
        canAccessCoachIA: true,
        canManageExercicios: false,
        canViewAllData: false,
    },
};

/** Emails autorizados para login como GOD */
export const GOD_WHITELIST: string[] = [
    'leonardo@schweitzer.ai',
    'admin@vitruia.com',
    'god@vitruia.com',
];

/**
 * Verifica se um email pertence ao whitelist GOD.
 * Usado no login para atribuir o role correto.
 */
export const isGodEmail = (email: string): boolean =>
    GOD_WHITELIST.some(e => e.toLowerCase() === email.toLowerCase());
