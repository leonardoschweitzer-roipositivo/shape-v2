/**
 * Portal Context — Carregamento inicial de contexto do atleta
 */
import { supabase } from '@/services/supabase';
import type {
    SupaAtleta, SupaPersonal, SupaFicha, SupaDiagnostico,
    SupaPlanoTreino, SupaPlanoDieta, SupaRegistroDiario, PortalContext
} from './portalTypes';

export async function carregarContextoPortal(atletaId: string): Promise<PortalContext | null> {
    try {
        // 1. Buscar atleta primeiro (precisa do personal_id)
        const { data: atletaRaw } = await supabase
            .from('atletas')
            .select('*')
            .eq('id', atletaId)
            .single();
        if (!atletaRaw) return null;
        const atleta = atletaRaw as unknown as SupaAtleta;

        // 2-6. Todas as queries restantes em PARALELO
        const [
            { data: personalRaw },
            { data: fichaRaw },
            { data: diagRaw },
            { data: treinoRaw },
            { data: dietaRaw },
        ] = await Promise.all([
            supabase
                .from('personais')
                .select('id, nome')
                .eq('id', atleta.personal_id)
                .single(),
            supabase
                .from('fichas')
                .select('*')
                .eq('atleta_id', atletaId)
                .single(),
            supabase
                .from('diagnosticos')
                .select('dados')
                .eq('atleta_id', atletaId)
                .eq('status', 'confirmado')
                .order('created_at', { ascending: false })
                .limit(1)
                .single(),
            supabase
                .from('planos_treino')
                .select('dados')
                .eq('atleta_id', atletaId)
                .eq('status', 'ativo')
                .order('created_at', { ascending: false })
                .limit(1)
                .single(),
            supabase
                .from('planos_dieta')
                .select('dados')
                .eq('atleta_id', atletaId)
                .eq('status', 'ativo')
                .order('created_at', { ascending: false })
                .limit(1)
                .single(),
        ]);

        const personal = personalRaw as unknown as SupaPersonal | null;
        const ficha = fichaRaw as unknown as SupaFicha | null;
        const diag = diagRaw as unknown as SupaDiagnostico | null;
        const treino = treinoRaw as unknown as SupaPlanoTreino | null;
        const dieta = dietaRaw as unknown as SupaPlanoDieta | null;

        console.info('[PortalDataService] Diagnóstico:', diag ? 'ENCONTRADO' : 'NÃO ENCONTRADO');
        console.info('[PortalDataService] Plano Treino:', treino ? 'ENCONTRADO' : 'NÃO ENCONTRADO');
        console.info('[PortalDataService] Plano Dieta:', dieta ? 'ENCONTRADO' : 'NÃO ENCONTRADO');

        return {
            atletaId,
            atletaNome: atleta.nome || 'Atleta',
            personalId: personal?.id || '',
            personalNome: personal?.nome || 'Personal',
            ficha: ficha || null,
            diagnostico: diag?.dados ?? null,
            planoTreino: treino?.dados ?? null,
            planoDieta: dieta?.dados ?? null,
        };
    } catch (err) {
        console.error('[PortalDataService] Erro ao carregar contexto:', err);
        return null;
    }
}

// ==== Função Helper Auxiliar para pegar o Histórico ====
export async function getUltimoTreinoIndex(atletaId: string): Promise<number> {
    const { data } = await supabase
        .from('registros_diarios')
        .select('dados, data')
        .eq('atleta_id', atletaId)
        .eq('tipo', 'treino')
        .order('data', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(30);

    if (!data || data.length === 0) return -1;

    // Procura o último treino completo ou pulado
    for (const record of data) {
        const rec = record as unknown as SupaRegistroDiario;
        const d = rec.dados;
        if (d && (d.status === 'completo' || d.status === 'pulado')) {
            if (typeof d.treinoIndex === 'number') {
                return d.treinoIndex;
            }
            // Fallback para registros antigos (antes do treinoIndex existir)
            if (rec.data) {
                const parts = rec.data.split('-');
                if (parts.length === 3) {
                    const dataRecordLocal = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
                    let tsIndex = dataRecordLocal.getDay() - 1;
                    if (tsIndex < 0) tsIndex = 0;
                    return tsIndex;
                }
            }
        }
    }
    return -1;
}
