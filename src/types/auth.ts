export type UserRole = 'ACADEMIA' | 'PERSONAL' | 'ATLETA';

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
}

export const PERMISSIONS: Record<UserRole, UserPermissions> = {
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
    },
};
