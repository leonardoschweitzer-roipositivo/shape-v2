import { UserRole } from './auth';

export type InviteType = 'LINK_GENERIC' | 'LINK_EMAIL' | 'WHATSAPP' | 'QR_CODE' | 'MANUAL';
export type InviteStatus = 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'EXHAUSTED';

export interface Invite {
    id: string;
    type: InviteType;
    createdById: string;
    createdByRole: UserRole;
    targetRole: UserRole;
    targetEmail?: string;
    code: string;
    url: string;
    expiresAt: Date;
    maxUses: number | null;
    usedCount: number;
    status: InviteStatus;
    createdAt: Date;
    updatedAt: Date;
    qrCodeUrl?: string; // Mocked URL for QR code image
    whatsappUrl?: string; // Mocked deep link
}

export interface CreateInviteRequest {
    type: InviteType;
    targetRole: UserRole;
    targetEmail?: string;
    customMessage?: string;
    expiresInDays?: number;
    maxUses?: number;
}

export interface ManualRegistrationData {
    name: string;
    email?: string;
    phone?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    birthDate?: string;
    cref?: string; // Only for Personal
    specialties?: string[]; // Only for Personal
    goal?: string; // Only for Client
    sendInviteEmail?: boolean;
}
