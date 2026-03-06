/**
 * PlanoEvolucaoHelpers — Shared logic for TreinoView and DietaView
 *
 * Extracted to eliminate code duplication between the two pipeline views.
 */

import type { DiagnosticoDados, DiagnosticoInput } from '@/services/calculations/diagnostico';
import { gerarDiagnosticoCompleto } from '@/services/calculations/diagnostico';
import type { PotencialAtleta } from '@/services/calculations/potencial';

/**
 * Derives the Vitrúvio classification string from a numeric score.
 */
export function getClassificacao(score: number): string {
    if (score >= 90) return 'ELITE';
    if (score >= 80) return 'AVANÇADO';
    if (score >= 70) return 'ATLÉTICO';
    if (score >= 60) return 'INTERMEDIÁRIO';
    return 'INICIANTE';
}

/**
 * Athlete profile payload used by IA enrichment functions.
 */
export interface PerfilIA {
    nome: string;
    sexo: 'M' | 'F';
    idade: number;
    altura: number;
    peso: number;
    gorduraPct: number;
    score: number;
    classificacao: string;
    medidas: Record<string, number>;
    contexto: Record<string, unknown>;
}

/**
 * Builds the PerfilIA object from basic athlete + assessment data.
 */
export function buildPerfilIA(
    nome: string,
    gender: string,
    birthDate: string | undefined,
    measurements: Record<string, number>,
    bf: number,
    score: number,
    contexto: unknown,
): PerfilIA {
    const idade = birthDate
        ? Math.floor((Date.now() - new Date(birthDate).getTime()) / 31557600000)
        : 30;
    const sexo = (gender === 'FEMALE' ? 'F' : 'M') as 'M' | 'F';
    return {
        nome,
        sexo,
        idade,
        altura: measurements.height ?? 170,
        peso: measurements.weight ?? 70,
        gorduraPct: bf,
        score,
        classificacao: getClassificacao(score),
        medidas: measurements,
        contexto: contexto as Record<string, unknown>,
    };
}

/**
 * Builds DiagnosticoInput from athlete + assessment data.
 * Eliminates the duplicated measurement-mapping logic from TreinoView / DietaView.
 */
export function buildDiagnosticoInput(
    atleta: {
        name: string;
        gender: string;
        birthDate?: string;
        score: number;
        ratio?: number;
        contexto?: unknown;
    },
    measurements: Record<string, unknown>,
    bf: number,
    potencial: PotencialAtleta,
    nivelAtividade: string = 'SEDENTARIO',
    proporcoesPreCalculadas?: unknown[],
): DiagnosticoInput {
    const m = measurements as Record<string, number>;
    const anyM = measurements as Record<string, unknown>;
    const classificacao = getClassificacao(atleta.score);
    const idade = atleta.birthDate
        ? Math.floor((Date.now() - new Date(atleta.birthDate).getTime()) / 31557600000)
        : 30;
    const sexo = atleta.gender === 'FEMALE' ? 'F' : 'M';

    return {
        peso: m.weight,
        altura: m.height,
        idade,
        sexo,
        gorduraPct: bf,
        score: atleta.score,
        classificacao,
        ratio: atleta.ratio ?? 0,
        freqTreino: potencial.frequenciaSemanal,
        nivelAtividade: nivelAtividade as DiagnosticoInput['nivelAtividade'],
        usaAnabolizantes: (() => {
            const ctx = atleta.contexto as Record<string, unknown> | undefined;
            const medUso = ctx?.medicacoesUso as Record<string, string> | undefined;
            const medStr = ctx?.medicacoes as string | undefined;
            return /testosterona|trt|anaboliz|durateston/i.test(medUso?.descricao || medStr || '');
        })(),
        usaTermogenicos: false,
        nomeAtleta: atleta.name,
        medidas: {
            ombros: m.shoulders,
            cintura: m.waist,
            peitoral: m.chest || (anyM.peito as number),
            costas: (anyM.costas as number) || m.chest || (m.shoulders * 0.9),
            bracoD: m.armRight || (anyM.braco as number),
            bracoE: m.armLeft || (anyM.braco as number),
            antebracoD: m.forearmRight || (anyM.antebraco as number),
            antebracoE: m.forearmLeft || (anyM.antebraco as number),
            coxaD: m.thighRight || (anyM.coxa as number),
            coxaE: m.thighLeft || (anyM.coxa as number),
            panturrilhaD: m.calfRight || (anyM.panturrilha as number),
            panturrilhaE: m.calfLeft || (anyM.panturrilha as number),
            punho: m.wrist || 17.5,
            joelho: m.knee || 38,
            tornozelo: m.ankle || 22,
            pelvis: m.pelvis || m.waist * 1.1,
            pescoco: m.neck || 40,
        },
        proporcoesPreCalculadas: Array.isArray(proporcoesPreCalculadas) ? proporcoesPreCalculadas : undefined,
    };
}

/**
 * Full diagnostico generation helper (wraps buildDiagnosticoInput + gerarDiagnosticoCompleto)
 */
export function gerarDiagnosticoLocal(
    atleta: {
        name: string;
        gender: string;
        birthDate?: string;
        score: number;
        ratio?: number;
        contexto?: unknown;
    },
    measurements: Record<string, unknown>,
    bf: number,
    potencial: PotencialAtleta,
    nivelAtividade?: string,
    proporcoesPreCalculadas?: unknown[],
): DiagnosticoDados {
    const input = buildDiagnosticoInput(atleta, measurements, bf, potencial, nivelAtividade, proporcoesPreCalculadas);
    return gerarDiagnosticoCompleto(input, potencial);
}
