import { CreateInviteRequest, Invite, InviteStatus } from '@/types/invites';

// Mock database
let MOCK_INVITES: Invite[] = [];

const generateCode = (length = 6) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

export const inviteService = {
    async createInvite(request: CreateInviteRequest): Promise<Invite> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const code = generateCode(request.type === 'LINK_EMAIL' ? 12 : 6);
        const baseUrl = window.location.origin;

        const invite: Invite = {
            id: `inv_${Math.random().toString(36).substr(2, 9)}`,
            type: request.type,
            createdById: 'current_user_id', // Mock
            createdByRole: 'PERSONAL', // Mock, should come from auth
            targetRole: request.targetRole,
            targetEmail: request.targetEmail,
            code,
            url: `${baseUrl}/convite/${code}`,
            expiresAt: new Date(Date.now() + (request.expiresInDays || 7) * 24 * 60 * 60 * 1000),
            maxUses: request.maxUses || (request.type === 'LINK_EMAIL' ? 1 : null),
            usedCount: 0,
            status: 'ACTIVE',
            createdAt: new Date(),
            updatedAt: new Date(),
            qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent(`${baseUrl}/convite/${code}`),
            whatsappUrl: request.type === 'WHATSAPP'
                ? `https://wa.me/?text=${encodeURIComponent(request.customMessage + '\n\n' + `${baseUrl}/convite/${code}`)}`
                : undefined
        };

        MOCK_INVITES.push(invite);
        return invite;
    },

    async getInvites(role: 'PERSONAL' | 'ACADEMIA'): Promise<Invite[]> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_INVITES.filter(inv => inv.createdByRole === role && inv.status === 'ACTIVE');
    },

    async revokeInvite(id: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 300));
        const invite = MOCK_INVITES.find(inv => inv.id === id);
        if (invite) {
            invite.status = 'REVOKED';
        }
    }
};
