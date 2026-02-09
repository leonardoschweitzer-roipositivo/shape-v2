import { ManualRegistrationData } from '@/types/invites';
import { UserRole } from '@/types/auth';

// Mock database
const MOCK_USERS: any[] = [];

export const registrationService = {
    async registerManual(role: UserRole, data: ManualRegistrationData): Promise<{ success: boolean; userId: string; message: string }> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const userId = `${role.toLowerCase().substring(0, 3)}_${Math.random().toString(36).substr(2, 9)}`;

        const newUser = {
            id: userId,
            role,
            ...data,
            createdAt: new Date(),
            status: 'PENDING' // Pending verify email or login
        };

        MOCK_USERS.push(newUser);

        // Simulate sending email logic
        if (data.sendInviteEmail && data.email) {
            console.log(`[MOCK EMAIL SERVICE] Sending invite email to ${data.email} with temp credentials...`);
        }

        return {
            success: true,
            userId,
            message: data.sendInviteEmail
                ? `Cadastro realizado! Um email de convite foi enviado para ${data.email}.`
                : 'Cadastro realizado com sucesso! Gere as credenciais temporárias para o acesso inicial.'
        };
    }
};
