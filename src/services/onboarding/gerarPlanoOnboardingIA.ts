/**
 * Gerador silencioso de Treino + Dieta para alunos que optam por VITRU IA
 * no onboarding (sem fazer avaliação completa).
 *
 * Fluxo:
 *  1. Estima BF via fórmula Navy (com fallback Deurenberg).
 *  2. Calcula Potencial → Diagnóstico em memória (NÃO persiste diagnóstico).
 *  3. Gera plano de treino e dieta determinísticos.
 *  4. Marca planos anteriores como inativos (idempotência) e salva novos.
 *  5. Dispara enriquecimento IA em background (não bloqueante).
 */

import { supabase } from '@/services/supabase';
import { estimarBodyFat } from '@/services/calculations/bfEstimation';
import { calcularPotencialAtleta } from '@/services/calculations/potencial';
import {
    gerarDiagnosticoCompleto,
    type DiagnosticoInput,
} from '@/services/calculations/diagnostico';
import {
    gerarPlanoTreino,
    salvarPlanoTreino,
    enriquecerTreinoComIA,
} from '@/services/calculations/treino';
import {
    gerarPlanoDieta,
    salvarPlanoDieta,
    enriquecerDietaComIA,
} from '@/services/calculations/dieta';
import { enriquecerPrescricaoComIA } from '@/services/prescricao/enriquecer';
import type { ObjetivoVitruvio } from '@/services/calculations/objetivos';
import type { ContextoAtleta } from '@/services/calculations/potencial';
import type { PerfilAtletaIA } from '@/services/vitruviusContext';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export type ObjetivoOnboarding = 'HIPERTROFIA' | 'EMAGRECIMENTO' | 'SAUDE' | 'COMPETICAO';
export type NivelAtividadeOnboarding = 'SEDENTARIO' | 'LEVE' | 'MODERADO' | 'INTENSO';

export interface GerarPlanoOnboardingInput {
    atletaId: string;
    personalId?: string | null; // se omitido, é buscado em atletas.personal_id
    nome: string;
    sexo: 'M' | 'F';
    dataNascimento: string; // ISO (yyyy-mm-dd)
    altura: number;          // cm
    peso: number;             // kg
    cintura?: number;
    quadril?: number;
    pescoco?: number;
    nivelAtividade: NivelAtividadeOnboarding;
    objetivo: ObjetivoOnboarding;
    contexto?: ContextoAtleta;
}

export interface GerarPlanoOnboardingResult {
    treinoId: string | null;
    dietaId: string | null;
    objetivoVitruvio: ObjetivoVitruvio;
    bodyFat: number;
    bodyFatMetodo: 'NAVY' | 'DEURENBERG' | 'DEFAULT';
}

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

const OBJETIVO_MAP: Record<ObjetivoOnboarding, ObjetivoVitruvio> = {
    HIPERTROFIA: 'BULK',
    EMAGRECIMENTO: 'CUT',
    SAUDE: 'RECOMP',
    COMPETICAO: 'RECOMP',
};

// Diagnóstico internamente exige nivelAtividade simplificado (3 níveis).
const NIVEL_MAP: Record<NivelAtividadeOnboarding, 'SEDENTARIO' | 'LEVE' | 'MODERADO'> = {
    SEDENTARIO: 'SEDENTARIO',
    LEVE: 'LEVE',
    MODERADO: 'MODERADO',
    INTENSO: 'MODERADO',
};

function calcularIdade(dataNascimento: string): number {
    const nasc = new Date(dataNascimento);
    const diffMs = Date.now() - nasc.getTime();
    return Math.floor(diffMs / 31557600000);
}

/**
 * Marca planos ativos anteriores como inativos, garantindo apenas 1 plano ativo por atleta.
 */
async function desativarPlanosAnteriores(atletaId: string, tabela: 'planos_treino' | 'planos_dieta'): Promise<void> {
    try {
        await supabase
            .from(tabela)
            .update({ status: 'inativo' } as Record<string, unknown>)
            .eq('atleta_id', atletaId)
            .eq('status', 'ativo');
    } catch (err) {
        console.warn(`[OnboardingIA] Falha ao desativar ${tabela}:`, err);
    }
}

/**
 * Constrói DiagnosticoInput a partir dos dados mínimos do onboarding.
 * Medidas de membros são inferidas com valores razoáveis (proporção antropométrica básica)
 * para permitir rodar o pipeline sem travar — não são exibidas ao aluno.
 */
function buildDiagnosticoInputOnboarding(
    input: GerarPlanoOnboardingInput,
    idade: number,
    bodyFat: number,
): DiagnosticoInput {
    const { peso, altura, sexo, nivelAtividade, nome } = input;
    const cintura = input.cintura ?? altura * 0.45;
    const quadril = input.quadril ?? cintura * 1.05;
    const pescoco = input.pescoco ?? (sexo === 'M' ? 38 : 32);

    // Estimativas razoáveis para membros (usadas só como input para cálculos internos).
    const ombros = altura * 0.28;
    const peitoral = altura * 0.57;
    const costas = altura * 0.54;
    const braco = altura * 0.19;
    const antebraco = altura * 0.15;
    const coxa = altura * 0.32;
    const panturrilha = altura * 0.21;

    return {
        peso,
        altura,
        idade,
        sexo,
        gorduraPct: bodyFat,
        score: 50,
        classificacao: 'INICIANTE',
        ratio: 0,
        freqTreino: 3,
        nivelAtividade: NIVEL_MAP[nivelAtividade],
        usaAnabolizantes: false,
        usaTermogenicos: false,
        nomeAtleta: nome,
        medidas: {
            ombros,
            cintura,
            peitoral,
            costas,
            bracoD: braco,
            bracoE: braco,
            antebracoD: antebraco,
            antebracoE: antebraco,
            coxaD: coxa,
            coxaE: coxa,
            panturrilhaD: panturrilha,
            panturrilhaE: panturrilha,
            punho: 17.5,
            joelho: 38,
            tornozelo: 22,
            pelvis: quadril,
            pescoco,
        },
    };
}

// ═══════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════

export async function gerarPlanoOnboardingIA(
    input: GerarPlanoOnboardingInput,
): Promise<GerarPlanoOnboardingResult> {
    const idade = calcularIdade(input.dataNascimento);
    const objetivoVitruvio = OBJETIVO_MAP[input.objetivo];

    let personalId: string | null = input.personalId ?? null;
    if (!personalId) {
        try {
            const { data } = await supabase
                .from('atletas')
                .select('personal_id')
                .eq('id', input.atletaId)
                .single();
            personalId = (data as { personal_id?: string } | null)?.personal_id ?? null;
        } catch (err) {
            console.warn('[OnboardingIA] Não foi possível buscar personal_id:', err);
        }
    }

    // 1. BF estimado
    const { bodyFat, metodo: bodyFatMetodo } = estimarBodyFat({
        sexo: input.sexo,
        altura: input.altura,
        peso: input.peso,
        idade,
        cintura: input.cintura,
        quadril: input.quadril,
        pescoco: input.pescoco,
    });

    // 2. Potencial + Diagnóstico (in-memory)
    const potencial = calcularPotencialAtleta('INICIANTE', 50, input.contexto);
    const diagInput = buildDiagnosticoInputOnboarding(input, idade, bodyFat);
    const diagnostico = gerarDiagnosticoCompleto(diagInput, potencial);

    // 3. Geração determinística de treino e dieta
    const planoTreinoBase = gerarPlanoTreino(
        input.atletaId,
        input.nome,
        diagnostico,
        potencial,
        objetivoVitruvio,
        input.contexto,
        input.sexo,
    );
    const planoDietaBase = gerarPlanoDieta(
        input.atletaId,
        input.nome,
        diagnostico,
        potencial,
        objetivoVitruvio,
        input.contexto,
    );

    // 4. Desativar planos antigos (idempotência) e salvar novos
    await Promise.all([
        desativarPlanosAnteriores(input.atletaId, 'planos_treino'),
        desativarPlanosAnteriores(input.atletaId, 'planos_dieta'),
    ]);

    const [treinoSaved, dietaSaved] = await Promise.all([
        salvarPlanoTreino(input.atletaId, personalId, planoTreinoBase).catch(err => {
            console.error('[OnboardingIA] Erro ao salvar treino:', err);
            return null;
        }),
        salvarPlanoDieta(input.atletaId, personalId, planoDietaBase).catch(err => {
            console.error('[OnboardingIA] Erro ao salvar dieta:', err);
            return null;
        }),
    ]);

    const treinoId = treinoSaved?.id ?? null;
    const dietaId = dietaSaved?.id ?? null;

    // 5. Enriquecimento IA em background — não aguarda, não bloqueia onboarding
    const perfilIA: PerfilAtletaIA = {
        nome: input.nome,
        sexo: input.sexo,
        idade,
        altura: input.altura,
        peso: input.peso,
        gorduraPct: bodyFat,
        score: 50,
        classificacao: 'INICIANTE',
        medidas: { height: input.altura, weight: input.peso },
        contexto: input.contexto,
    };

    if (treinoId) {
        Promise.all([
            enriquecerTreinoComIA(planoTreinoBase, perfilIA).catch(err => {
                console.warn('[OnboardingIA] Enriquecimento treino falhou:', err);
                return null;
            }),
            enriquecerPrescricaoComIA(planoTreinoBase).catch(err => {
                console.warn('[OnboardingIA] Enriquecimento prescrição falhou:', err);
                return null;
            }),
        ]).then(async ([comInsights, comPrescricao]) => {
            if (!comInsights && !comPrescricao) return;
            const merged = {
                ...(comInsights ?? planoTreinoBase),
                treinos: (comPrescricao ?? planoTreinoBase).treinos,
            };
            await supabase
                .from('planos_treino')
                .update({ dados: JSON.parse(JSON.stringify(merged)) } as Record<string, unknown>)
                .eq('id', treinoId);
        }).catch(err => console.warn('[OnboardingIA] Merge treino IA falhou:', err));
    }

    if (dietaId) {
        enriquecerDietaComIA(planoDietaBase, perfilIA)
            .then(async (dietaEnriquecida) => {
                if (!dietaEnriquecida) return;
                await supabase
                    .from('planos_dieta')
                    .update({ dados: JSON.parse(JSON.stringify(dietaEnriquecida)) } as Record<string, unknown>)
                    .eq('id', dietaId);
            })
            .catch(err => console.warn('[OnboardingIA] Enriquecimento dieta falhou:', err));
    }

    return { treinoId, dietaId, objetivoVitruvio, bodyFat, bodyFatMetodo };
}
