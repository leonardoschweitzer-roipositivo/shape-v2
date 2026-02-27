/**
 * Portal Service — Gerencia tokens de acesso do Portal do Atleta
 * 
 * Responsabilidades:
 * - Gerar portal_token único para cada atleta
 * - Validar tokens e buscar dados do atleta
 * - Servir como base para futuro magic link / email de convite
 */

import { supabase } from '@/services/supabase';

// Gera um token alfanumérico único (URL-safe)
function generatePortalToken(length = 32): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
        result += chars[array[i] % chars.length];
    }
    return result;
}

export interface PortalAthleteData {
    id: string;
    nome: string;
    email: string | null;
    telefone: string | null;
    personal_id: string;
    personalNome?: string;
    ficha: {
        id: string;
        sexo: string;
        altura: number | null;
        data_nascimento: string | null;
        objetivo: string | null;
        punho: number | null;
        tornozelo: number | null;
        joelho: number | null;
        pelve: number | null;
    } | null;
    medidas: Array<{
        id: string;
        data: string;
        peso: number | null;
        pescoco: number | null;
        ombros: number | null;
        peitoral: number | null;
        cintura: number | null;
        quadril: number | null;
        braco_direito: number | null;
        braco_esquerdo: number | null;
        antebraco_direito: number | null;
        antebraco_esquerdo: number | null;
        coxa_direita: number | null;
        coxa_esquerda: number | null;
        panturrilha_direita: number | null;
        panturrilha_esquerda: number | null;
    }>;
    avaliacoes: Array<{
        id: string;
        data: string;
        score_geral: number | null;
        classificacao_geral: string | null;
    }>;
}

export const portalService = {
    /**
     * Gera um portal_token para um atleta e salva no Supabase
     * Retorna o token e a URL de acesso
     */
    async generateToken(atletaId: string): Promise<{
        token: string;
        url: string;
        expiresAt: string;
    }> {
        const token = generatePortalToken();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 dias

        const { error } = await supabase
            .from('atletas')
            .update({
                portal_token: token,
                portal_token_expira: expiresAt.toISOString(),
            } as any)
            .eq('id', atletaId);

        if (error) {
            console.error('[PortalService] Erro ao gerar token:', error);
            throw new Error('Erro ao gerar token de acesso');
        }

        const baseUrl = window.location.origin;
        const url = `${baseUrl}/?token=${token}`;

        console.info(`[PortalService] ✅ Token gerado para atleta ${atletaId}`);
        console.info(`[PortalService] 🔗 URL: ${url}`);

        return { token, url, expiresAt: expiresAt.toISOString() };
    },

    /**
     * Valida um portal_token e retorna os dados completos do atleta
     * Inclui ficha, medidas e avaliações
     */
    async validateToken(token: string): Promise<PortalAthleteData | null> {
        // 1. Buscar atleta pelo token
        const { data: atleta, error: atletaError } = await supabase
            .from('atletas')
            .select('*')
            .eq('portal_token', token)
            .single();

        if (atletaError || !atleta) {
            console.warn('[PortalService] Token inválido ou não encontrado');
            return null;
        }

        // 2. Verificar expiração
        const expira = (atleta as any).portal_token_expira;
        if (expira && new Date(expira) < new Date()) {
            console.warn('[PortalService] Token expirado');
            return null;
        }

        // 3. Incrementar acessos
        await supabase
            .from('atletas')
            .update({
                portal_acessos: ((atleta as any).portal_acessos || 0) + 1,
                portal_ultimo_acesso: new Date().toISOString(),
            } as any)
            .eq('id', (atleta as any).id);

        // 4. Buscar ficha
        const { data: ficha } = await supabase
            .from('fichas')
            .select('*')
            .eq('atleta_id', (atleta as any).id)
            .single();

        // 5. Buscar medidas (últimas 5)
        const { data: medidas } = await supabase
            .from('medidas')
            .select('*')
            .eq('atleta_id', (atleta as any).id)
            .order('data', { ascending: false })
            .limit(5);

        // 6. Buscar avaliações (tabela consolidada)
        const { data: assessments } = await supabase
            .from('assessments')
            .select('*')
            .eq('atleta_id', (atleta as any).id)
            .order('date', { ascending: false })
            .limit(5);

        // 7. Buscar nome do personal
        const { data: personal } = await supabase
            .from('personais')
            .select('nome')
            .eq('id', (atleta as any).personal_id)
            .single();

        console.info(`[PortalService] ✅ Atleta validado: ${(atleta as any).nome}`);

        return {
            id: (atleta as any).id,
            nome: (atleta as any).nome,
            email: (atleta as any).email,
            telefone: (atleta as any).telefone,
            personal_id: (atleta as any).personal_id,
            personalNome: (personal as any)?.nome || 'Personal',
            ficha: ficha ? {
                id: (ficha as any).id,
                sexo: (ficha as any).sexo,
                altura: (ficha as any).altura,
                data_nascimento: (ficha as any).data_nascimento,
                objetivo: (ficha as any).objetivo,
                punho: (ficha as any).punho,
                tornozelo: (ficha as any).tornozelo,
                joelho: (ficha as any).joelho,
                pelve: (ficha as any).pelve,
            } : null,
            medidas: (medidas || []).map((m: any) => ({
                id: m.id,
                data: m.data,
                peso: m.peso,
                pescoco: m.pescoco,
                ombros: m.ombros,
                peitoral: m.peitoral,
                cintura: m.cintura,
                quadril: m.quadril,
                braco_direito: m.braco_direito,
                braco_esquerdo: m.braco_esquerdo,
                antebraco_direito: m.antebraco_direito,
                antebraco_esquerdo: m.antebraco_esquerdo,
                coxa_direita: m.coxa_direita,
                coxa_esquerda: m.coxa_esquerda,
                panturrilha_direita: m.panturrilha_direita,
                panturrilha_esquerda: m.panturrilha_esquerda,
            })),
            avaliacoes: (assessments || []).map((a: any) => ({
                id: a.id,
                data: a.date,
                score_geral: a.score,
                classificacao_geral: a.results?.classificacao?.nivel || '',
            })),
        };
    },

    /**
     * Salva medidas enviadas pelo próprio atleta via portal
     */
    async saveMeasurements(atletaId: string, measurements: {
        peso?: number;
        pescoco?: number;
        ombros?: number;
        peitoral?: number;
        cintura?: number;
        quadril?: number;
        abdomen?: number;
        braco_direito?: number;
        braco_esquerdo?: number;
        antebraco_direito?: number;
        antebraco_esquerdo?: number;
        coxa_direita?: number;
        coxa_esquerda?: number;
        panturrilha_direita?: number;
        panturrilha_esquerda?: number;
    }): Promise<{ success: boolean; medidaId?: string }> {
        const { data, error } = await supabase
            .from('medidas')
            .insert({
                atleta_id: atletaId,
                data: new Date().toISOString().split('T')[0],
                ...measurements,
                registrado_por: 'APP', // Registrado pelo próprio atleta
            } as any)
            .select()
            .single();

        if (error) {
            console.error('[PortalService] Erro ao salvar medidas:', error);
            return { success: false };
        }

        console.info(`[PortalService] ✅ Medidas salvas para atleta ${atletaId}`);
        return { success: true, medidaId: (data as any)?.id };
    },
};
