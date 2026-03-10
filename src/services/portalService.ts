/**
 * Portal Service — Gerencia tokens de acesso do Portal do Atleta
 * 
 * Responsabilidades:
 * - Gerar portal_token único para cada atleta
 * - Validar tokens e buscar dados do atleta
 * - Servir como base para futuro magic link / email de convite
 */

import { supabase } from '@/services/supabase';

// ==========================================
// SUPABASE ROW TYPES
// ==========================================

interface SupaAtletaRow {
    id: string;
    nome: string;
    email: string | null;
    telefone: string | null;
    personal_id: string;
    portal_token?: string;
    portal_token_expira?: string;
    portal_acessos?: number;
    portal_ultimo_acesso?: string;
    [key: string]: unknown;
}

interface SupaFichaRow {
    id: string;
    atleta_id: string;
    sexo: string;
    altura: number | null;
    data_nascimento: string | null;
    objetivo: string | null;
    punho: number | null;
    tornozelo: number | null;
    joelho: number | null;
    pelve: number | null;
    [key: string]: unknown;
}

interface SupaMedidaRow {
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
    [key: string]: unknown;
}

interface SupaAssessmentRow {
    id: string;
    date: string;
    score: number;
    results: Record<string, unknown>;
    measurements: Record<string, unknown>;
    body_fat?: number;
    weight?: number;
    ratio?: number;
    [key: string]: unknown;
}

interface SupaPersonalRow {
    id?: string;
    nome: string;
    [key: string]: unknown;
}

interface SupaDiagnosticoRow {
    id: string;
    dados: Record<string, unknown>;
    [key: string]: unknown;
}

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
        results?: Record<string, unknown>;
        measurements?: Record<string, unknown>;
        gordura?: number;
    }>;
    diagnostico?: {
        id: string;
        dados: Record<string, unknown>;
    } | null;
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
            } as Record<string, unknown>)
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
     * OTIMIZADO: todas as queries rodam em paralelo via Promise.all
     */
    async validateToken(token: string): Promise<PortalAthleteData | null> {
        // 1. Buscar atleta pelo token (obrigatório primeiro)
        const { data: atleta, error: atletaError } = await supabase
            .from('atletas')
            .select('*')
            .eq('portal_token', token)
            .single();

        if (atletaError || !atleta) {
            console.warn('[PortalService] Token inválido ou não encontrado');
            return null;
        }
        const a = atleta as unknown as SupaAtletaRow;

        // 2. Verificar expiração
        const expira = a.portal_token_expira;
        if (expira && new Date(expira) < new Date()) {
            console.warn('[PortalService] Token expirado');
            return null;
        }

        return this._fetchSecondaryDataAndFormat(a, true);
    },

    /**
     * Retorna os dados completos do atleta via ID (Usado no fluxo autenticado)
     */
    async getAthleteDataById(atletaId: string): Promise<PortalAthleteData | null> {
        const { data: atleta, error: atletaError } = await supabase
            .from('atletas')
            .select('*')
            .eq('id', atletaId)
            .single();

        if (atletaError || !atleta) {
            console.warn('[PortalService] Atleta não encontrado para o ID fornecido');
            return null;
        }

        return this._fetchSecondaryDataAndFormat(atleta as unknown as SupaAtletaRow, false);
    },

    async _fetchSecondaryDataAndFormat(a: SupaAtletaRow, isFirstAccessCheck: boolean): Promise<PortalAthleteData | null> {
        const atletaId = a.id;
        const personalId = a.personal_id;

        // 3. Incrementar acessos + notificar personal (fire-and-forget)
        if (isFirstAccessCheck) {
            (async () => {
                try {
                    const acessosAnteriores = a.portal_acessos || 0;
                    await supabase
                        .from('atletas')
                        .update({
                            portal_acessos: acessosAnteriores + 1,
                            portal_ultimo_acesso: new Date().toISOString(),
                        } as Record<string, unknown>)
                        .eq('id', atletaId);

                    // Primeiro acesso ao portal? Notificar personal!
                    if (acessosAnteriores === 0) {
                        import('./notificacaoTriggers').then(({ onPrimeiroAcessoPortal }) => {
                            onPrimeiroAcessoPortal(atletaId).catch(err =>
                                console.warn('[PortalService] Erro ao notificar primeiro acesso:', err)
                            );
                        });
                    }
                } catch (err) {
                    console.warn('[PortalService] Erro ao incrementar acessos:', err);
                }
            })();
        }

        // 4-8. Todas as queries em PARALELO
        const [
            { data: ficha },
            { data: medidas },
            { data: assessments },
            { data: personal },
            { data: diagnostico },
        ] = await Promise.all([
            supabase
                .from('fichas')
                .select('*')
                .eq('atleta_id', atletaId)
                .single(),
            supabase
                .from('medidas')
                .select('*')
                .eq('atleta_id', atletaId)
                .order('data', { ascending: false })
                .order('created_at', { ascending: false })
                .limit(5),
            supabase
                .from('assessments')
                .select('*')
                .eq('atleta_id', atletaId)
                .order('date', { ascending: false })
                .order('created_at', { ascending: false })
                .limit(5),
            supabase
                .from('personais')
                .select('nome')
                .eq('id', personalId)
                .single(),
            supabase
                .from('diagnosticos')
                .select('*')
                .eq('atleta_id', atletaId)
                .eq('status', 'confirmado')
                .order('created_at', { ascending: false })
                .limit(1)
                .single(),
        ]);

        console.info(`[PortalService] ✅ Atleta validado: ${a.nome}`);

        const fichaTyped = ficha as unknown as SupaFichaRow | null;
        const personalTyped = personal as unknown as SupaPersonalRow | null;
        const medidasTyped = (medidas || []) as unknown as SupaMedidaRow[];
        const assessmentsTyped = (assessments || []) as unknown as SupaAssessmentRow[];
        const diagnosticoTyped = diagnostico as unknown as SupaDiagnosticoRow | null;

        return {
            id: atletaId,
            nome: a.nome,
            email: a.email,
            telefone: a.telefone,
            personal_id: personalId,
            personalNome: personalTyped?.nome || 'Personal',
            ficha: fichaTyped ? {
                id: fichaTyped.id,
                sexo: fichaTyped.sexo,
                altura: fichaTyped.altura,
                data_nascimento: fichaTyped.data_nascimento,
                objetivo: fichaTyped.objetivo,
                punho: fichaTyped.punho,
                tornozelo: fichaTyped.tornozelo,
                joelho: fichaTyped.joelho,
                pelve: fichaTyped.pelve,
            } : null,
            medidas: medidasTyped.map(m => ({
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
            avaliacoes: assessmentsTyped.map(av => {
                const res = av.results || {};
                const classif = res?.classificacao as Record<string, unknown> | undefined;
                const comp = res?.composicao as Record<string, unknown> | undefined;
                return {
                    id: av.id,
                    data: av.date,
                    score_geral: av.score,
                    classificacao_geral: (classif?.nivel as string) || '',
                    results: av.results,
                    measurements: av.measurements,
                    gordura: Number(comp?.gorduraPct) || Number(av.body_fat) || 0,
                    ratio: av.ratio,
                    peso: av.weight,
                };
            }),
            diagnostico: diagnosticoTyped ? {
                id: diagnosticoTyped.id,
                dados: diagnosticoTyped.dados,
            } : null,
        };
    },

    /**
     * Salva medidas enviadas pelo próprio atleta via portal
     */
    async saveMeasurements(atletaId: string, measurements: {
        peso?: number;
        altura?: number;
        punho_direito?: number;
        punho_esquerdo?: number;
        joelho_direito?: number;
        joelho_esquerdo?: number;
        tornozelo_direito?: number;
        tornozelo_esquerdo?: number;
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
        const {
            altura,
            punho_direito, punho_esquerdo,
            joelho_direito, joelho_esquerdo,
            tornozelo_direito, tornozelo_esquerdo,
            ...medidasRestantes
        } = measurements;

        const calcMean = (valA?: number, valB?: number) => {
            if (valA !== undefined && valB !== undefined) return (valA + valB) / 2;
            return valA ?? valB;
        };

        const punhoMedia = calcMean(punho_direito, punho_esquerdo);
        const joelhoMedia = calcMean(joelho_direito, joelho_esquerdo);
        const tornozeloMedia = calcMean(tornozelo_direito, tornozelo_esquerdo);

        // Se o atleta preencheu a altura ou medidas ósseas, salva na ficha dele
        if (altura !== undefined || punhoMedia !== undefined || joelhoMedia !== undefined || tornozeloMedia !== undefined) {
            const updates: Record<string, unknown> = {};
            if (altura !== undefined) updates.altura = altura;
            if (punhoMedia !== undefined) updates.punho = punhoMedia;
            if (joelhoMedia !== undefined) updates.joelho = joelhoMedia;
            if (tornozeloMedia !== undefined) updates.tornozelo = tornozeloMedia;

            const { data: fichaData, error: fichaError } = await supabase
                .from('fichas')
                .update(updates)
                .eq('atleta_id', atletaId)
                .select('id');

            if (fichaError) {
                console.error('[PortalService] Erro ao salvar medidas estruturais na ficha:', fichaError.code, fichaError.message);
            } else if (!fichaData || fichaData.length === 0) {
                console.error('[PortalService] ❌ Ficha NÃO atualizou medidas estruturais — possível bloqueio de RLS');
            }
        }

        const { data, error } = await supabase
            .from('medidas')
            .insert({
                atleta_id: atletaId,
                data: new Date().toISOString().split('T')[0],
                ...medidasRestantes,
                registrado_por: 'APP', // Registrado pelo próprio atleta
            } as Record<string, unknown>)
            .select()
            .single();

        if (error) {
            console.error('[PortalService] Erro ao salvar medidas:', error);
            return { success: false };
        }

        console.info(`[PortalService] ✅ Medidas salvas para atleta ${atletaId}`);
        return { success: true, medidaId: (data as Record<string, unknown>)?.id as string };
    },

    /**
     * Salva o contexto (anamnese) preenchido pelo próprio atleta via link público.
     * Os dados são armazenados como JSONB no campo `contexto` da tabela `fichas`.
     */
    async saveContexto(
        atletaId: string,
        contexto: {
            problemas_saude: string;
            medicacoes: string;
            dores_lesoes: string;
            exames: string;
            estilo_vida: string;
            profissao: string;
            historico_treino: string;
            historico_dietas: string;
        }
    ): Promise<{ success: boolean }> {
        const contextoComMeta = {
            ...contexto,
            atualizado_em: new Date().toISOString(),
            atualizado_por: 'ALUNO',
        };

        const { data, error } = await supabase
            .from('fichas')
            .update({ contexto: contextoComMeta } as Record<string, unknown>)
            .eq('atleta_id', atletaId)
            .select('id');

        if (error) {
            console.error('[PortalService] Erro ao salvar contexto:', error.code, error.message, error.hint);
            return { success: false };
        }

        // RLS pode bloquear silenciosamente (0 rows afetadas sem erro)
        if (!data || data.length === 0) {
            console.error('[PortalService] ❌ Contexto NÃO gravou — possível bloqueio de RLS. atleta_id:', atletaId);
            return { success: false };
        }

        // Notificar o personal que o aluno preencheu o contexto
        try {
            const { onContextoPreenchido } = await import('./notificacaoTriggers');
            await onContextoPreenchido(atletaId);
        } catch (err) {
            console.warn('[PortalService] Erro ao notificar contexto preenchido:', err);
        }

        console.info(`[PortalService] ✅ Contexto salvo para atleta ${atletaId}`);
        return { success: true };
    },
};
