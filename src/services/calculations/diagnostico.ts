/**
 * Diagnóstico - Serviço de Cálculos (Etapa 1 do Plano de Evolução)
 * 
 * Responsável por:
 * - Calcular TMB (Mifflin-St Jeor)
 * - Calcular TDEE (TMB + NEAT + EAT)
 * - Projetar metas de composição corporal (12 meses)
 * - Gerar diagnóstico completo para persistência
 * 
 * @see docs/specs/plano-evolucao-etapa-1-diagnostico.md
 */

import { supabase } from '@/services/supabase';
import { PotencialAtleta } from './potencial';
import { gerarConteudoIA } from '@/services/vitruviusAI';
import { type PerfilAtletaIA, perfilParaTexto, diagnosticoParaTexto, getFontesCientificas } from '@/services/vitruviusContext';
import { buildDiagnosticoPrompt } from '@/services/vitruviusPrompts';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface TaxasMetabolicas {
    tmb: number;
    tmbAjustada: number;
    neat: number;
    eat: number;
    tdee: number;
    fatoresConsiderados: string[];
}

export interface ComposicaoAtual {
    peso: number;
    gorduraPct: number;
    massaMagra: number;
    massaGorda: number;
}

export interface ProjecaoMensal {
    mes: number;
    peso: number;
    gorduraPct: number;
    massaMagra: number;
    massaGorda: number;
}

export interface MetasComposicao {
    peso6Meses: number;
    peso12Meses: number;
    gordura6Meses: number;
    gordura12Meses: number;
    projecaoMensal: ProjecaoMensal[];
}

export interface ProporcoesGrupo {
    grupo: string;
    atual: number;
    ideal: number;
    pct: number;
    status: string;
}

export interface AnaliseSimetriaItem {
    grupo: string;
    direito: number;
    esquerdo: number;
    diffPct: number;
}

export interface AnaliseEstetica {
    scoreAtual: number;
    classificacaoAtual: string;
    scoreMeta6M: number;
    scoreMeta12M: number;
    proporcoes: ProporcoesGrupo[];
    simetria: {
        scoreGeral: number;
        status: string;
        itens: AnaliseSimetriaItem[];
    };
}

export interface Prioridade {
    grupo: string;
    nivel: 'ALTA' | 'MEDIA' | 'BAIXA';
    pctAtual: number;
    meta: number;
    obs: string;
}

export interface MetaProporcao {
    grupo: string;
    atual: number;
    meta3M: number;
    meta6M: number;
    meta9M: number;
    meta12M: number;
    idealFinal: number;
}

export interface DiagnosticoDados {
    taxas: TaxasMetabolicas;
    composicaoAtual: ComposicaoAtual;
    metasComposicao: MetasComposicao;
    analiseEstetica: AnaliseEstetica;
    prioridades: Prioridade[];
    metasProporcoes: MetaProporcao[];
    resumoVitruvio: string;
    recomendacoesIA?: string[];
    insightsPorSecao?: {
        taxas?: string;
        composicao?: string;
        proporcoes?: string;
        prioridades?: string;
    };
    _medidas?: Record<string, number>;
    geradoEm: string;
}

export interface DiagnosticoInput {
    peso: number;
    altura: number;
    idade: number;
    sexo: 'M' | 'F';
    gorduraPct: number;
    score: number;
    classificacao: string;
    ratio: number;
    freqTreino: number;
    nivelAtividade: 'SEDENTARIO' | 'LEVE' | 'MODERADO';
    usaAnabolizantes: boolean;
    usaTermogenicos: boolean;
    nomeAtleta: string;
    medidas: {
        ombros: number;
        cintura: number;
        peitoral: number;
        costas: number;
        bracoD: number;
        bracoE: number;
        antebracoD: number;
        antebracoE: number;
        coxaD: number;
        coxaE: number;
        panturrilhaD: number;
        panturrilhaE: number;
        punho: number;
        joelho: number;
        tornozelo: number;
        pelvis: number;
        pescoco: number;
    };
    proporcoesPreCalculadas?: any[];
}

// ═══════════════════════════════════════════════════════════
// CÁLCULOS - TMB / TDEE
// ═══════════════════════════════════════════════════════════

const FATORES_NEAT: Record<string, number> = {
    SEDENTARIO: 0.15,
    LEVE: 0.30,
    MODERADO: 0.50,
};

/**
 * Calcula TMB pela fórmula de Mifflin-St Jeor.
 * 
 * @param peso - Peso em kg
 * @param altura - Altura em cm
 * @param idade - Idade em anos
 * @param sexo - 'M' ou 'F'
 * @returns TMB em kcal/dia
 */
export function calcularTMB(peso: number, altura: number, idade: number, sexo: 'M' | 'F'): number {
    if (sexo === 'M') {
        return Math.round((10 * peso) + (6.25 * altura) - (5 * idade) + 5);
    }
    return Math.round((10 * peso) + (6.25 * altura) - (5 * idade) - 161);
}

/**
 * Ajusta TMB por uso de medicações.
 * +10% para anabolizantes, +5% para termogênicos.
 */
export function ajustarTMBPorMedicacoes(
    tmb: number,
    usaAnabolizantes: boolean,
    usaTermogenicos: boolean
): { tmbAjustada: number; fatores: string[] } {
    let fator = 1.0;
    const fatores: string[] = [];

    if (usaAnabolizantes) {
        fator += 0.10;
        fatores.push('Anabolizantes (+10% metabolismo)');
    }
    if (usaTermogenicos) {
        fator += 0.05;
        fatores.push('Termogênicos (+5% metabolismo)');
    }

    return {
        tmbAjustada: Math.round(tmb * fator),
        fatores,
    };
}

/**
 * Calcula TDEE completo: TMB + NEAT + EAT.
 */
export function calcularTDEE(
    tmb: number,
    nivelAtividade: string,
    freqTreino: number
): TaxasMetabolicas {
    const neatFactor = FATORES_NEAT[nivelAtividade] ?? FATORES_NEAT.SEDENTARIO;
    const neat = Math.round(tmb * neatFactor);
    const eat = Math.round((350 * freqTreino) / 7);
    const tdee = tmb + neat + eat;

    return {
        tmb,
        tmbAjustada: tmb,
        neat,
        eat,
        tdee,
        fatoresConsiderados: [],
    };
}

// ═══════════════════════════════════════════════════════════
// CÁLCULOS - COMPOSIÇÃO CORPORAL
// ═══════════════════════════════════════════════════════════

/**
 * Calcula composição corporal atual a partir de peso e BF%.
 */
export function calcularComposicao(peso: number, gorduraPct: number): ComposicaoAtual {
    const massaGorda = Math.round((peso * gorduraPct / 100) * 10) / 10;
    const massaMagra = Math.round((peso - massaGorda) * 10) / 10;
    return { peso, gorduraPct, massaMagra, massaGorda };
}

/**
 * Projeta metas de composição corporal para 12 meses.
 * Estimativa conservadora baseada em deficit moderado (~400 kcal/dia).
 */
export function projetarMetas(
    composicaoAtual: ComposicaoAtual,
    gorduraMeta12M: number
): MetasComposicao {
    const { peso, gorduraPct, massaMagra } = composicaoAtual;

    // Ganho de massa magra estimado: 0.2kg/mês (realista para intermediário+)
    const ganhoMMLMensal = 0.2;
    // Perda de gordura necessária para atingir a meta
    const gorduraAtual = peso * gorduraPct / 100;
    const pesoMeta12M = massaMagra + (ganhoMMLMensal * 12) + (gorduraMeta12M / 100) * (massaMagra + ganhoMMLMensal * 12) / (1 - gorduraMeta12M / 100);

    // Simplificar: peso meta = massa magra nova / (1 - bf meta)
    const massaMagra12M = massaMagra + ganhoMMLMensal * 12;
    const pesoFinal12M = Math.round((massaMagra12M / (1 - gorduraMeta12M / 100)) * 10) / 10;
    const massaGorda12M = Math.round((pesoFinal12M - massaMagra12M) * 10) / 10;

    const massaMagra6M = massaMagra + ganhoMMLMensal * 6;
    const gordura6M = gorduraPct - ((gorduraPct - gorduraMeta12M) / 2);
    const pesoFinal6M = Math.round((massaMagra6M / (1 - gordura6M / 100)) * 10) / 10;

    // Projeção mensal
    const projecaoMensal: ProjecaoMensal[] = [];
    for (let mes = 0; mes <= 12; mes += 3) {
        const progresso = mes / 12;
        const mmMes = Math.round((massaMagra + ganhoMMLMensal * mes) * 10) / 10;
        const bfMes = Math.round((gorduraPct - (gorduraPct - gorduraMeta12M) * progresso) * 10) / 10;
        const pesoMes = Math.round((mmMes / (1 - bfMes / 100)) * 10) / 10;
        const mgMes = Math.round((pesoMes - mmMes) * 10) / 10;

        projecaoMensal.push({
            mes,
            peso: pesoMes,
            gorduraPct: bfMes,
            massaMagra: mmMes,
            massaGorda: mgMes,
        });
    }

    return {
        peso6Meses: pesoFinal6M,
        peso12Meses: pesoFinal12M,
        gordura6Meses: Math.round(gordura6M * 10) / 10,
        gordura12Meses: gorduraMeta12M,
        projecaoMensal,
    };
}

// ═══════════════════════════════════════════════════════════
// ANÁLISE ESTÉTICA E PROPORÇÕES
// Usa mesmas constantes de constants.ts (GOLDEN_RATIO)
// ═══════════════════════════════════════════════════════════

const PHI = 1.618;

// Targets oficiais da constante GOLDEN_RATIO em constants.ts
const GR_TARGETS = {
    PEITO_PUNHO: 6.5,
    BRACO_PUNHO: 2.52,
    ANTEBRACO_BRACO: 0.80,
    CINTURA_PELVIS: 0.86,
    COXA_JOELHO: 1.75,
    COXA_PANTURRILHA: 1.5,
    PANTURRILHA_TORNOZELO: 1.92,
    UPPER_LOWER_RATIO: 0.75,
};

/**
 * Gera tabela de proporções baseada em RATIOS (Índices).
 * Usa as mesmas fórmulas e targets da tela de Avaliação (proportionItems.ts)
 * para garantir 100% de consistência nos dados.
 * Total: 11 proporções (mesmas da Avaliação Golden Ratio).
 */
export function analisarProporcoes(
    medidas: DiagnosticoInput['medidas'],
    proporcoesPreCalculadas?: any[]
): ProporcoesGrupo[] {
    // ─── Baselines fisiológicos compartilhados ───
    const BASELINES: Record<string, { baseline: number; inverse?: boolean }> = {
        'Shape-V': { baseline: 1.0 },
        'Costas': { baseline: 1.0 },
        'Peitoral': { baseline: 4.8 },
        'Braço': { baseline: 1.5 },
        'Antebraço': { baseline: 0.70 },
        'Tríade': { baseline: 70 },
        'Cintura': { baseline: 1.05, inverse: true },
        'Coxa': { baseline: 1.2 },
        'Coxa vs Pantur.': { baseline: 1.15 },
        'Panturrilha': { baseline: 1.45 },
        'Upper vs Lower': { baseline: 1.0, inverse: true },
    };

    const calcPct = (atual: number, ideal: number, baseline: number, inverse = false) => {
        if (inverse) {
            const range = baseline - ideal;
            if (range <= 0) return 100;
            const progress = baseline - atual;
            return Math.max(0, Math.min(115, Math.round((progress / range) * 100)));
        }
        const range = ideal - baseline;
        if (range <= 0) return 100;
        const progress = atual - baseline;
        return Math.max(0, Math.min(115, Math.round((progress / range) * 100)));
    };

    // ─── Se recebeu dados do banco, usar atual/ideal e recalcular % com baselines ───
    if (proporcoesPreCalculadas?.length && proporcoesPreCalculadas[0]?.nome) {
        console.log('[Diagnostico] ✅ USANDO ratios do banco + recalculando % com baselines');
        return proporcoesPreCalculadas.map(p => {
            const bl = BASELINES[p.nome] || { baseline: 0 };
            const pct = calcPct(p.atual, p.ideal, bl.baseline, bl.inverse);
            return {
                grupo: p.nome,
                atual: Math.round(p.atual * 100) / 100,
                ideal: p.ideal,
                pct,
                status: pct >= 103 ? 'ELITE' :
                    pct >= 97 ? 'META' :
                        pct >= 90 ? 'QUASE LÁ' :
                            pct >= 82 ? 'CAMINHO' : 'INÍCIO',
            };
        });
    }

    console.log('[Diagnostico] ⚠️ FALLBACK: calculando proporções localmente');
    // ─── Fallback: cálculo local (atletas sem dados gravados) ───
    const proporcoes: ProporcoesGrupo[] = [];

    // ─── Baselines fisiológicos (piso realista de pessoa destreinada) ───
    // A escala vai de baseline → ideal, não de 0 → ideal
    const getCalibratedPct = (atual: number, ideal: number, baseline: number) => {
        if (ideal === baseline) return 100;

        // Caso normal (ratio: ideal > baseline → maior = melhor)
        if (ideal > baseline) {
            const range = ideal - baseline;
            const progress = atual - baseline;
            return Math.max(0, Math.min(110, Math.round((progress / range) * 100)));
        }
        // Caso inverso (cintura, upper/lower: ideal < baseline → menor = melhor)
        else {
            const range = baseline - ideal;
            const progress = baseline - atual;
            return Math.max(0, Math.min(110, Math.round((progress / range) * 100)));
        }
    };

    // Médias bilaterais (para uso nos cálculos)
    const bracoMD = (medidas.bracoD + medidas.bracoE) / 2;
    const antebracoMD = (medidas.antebracoD + medidas.antebracoE) / 2;
    const coxaMD = (medidas.coxaD + medidas.coxaE) / 2;
    const panturrilhaMD = (medidas.panturrilhaD + medidas.panturrilhaE) / 2;

    // ─── 11 Proporções (Mesmas fórmulas/targets da Avaliação Golden Ratio) ──
    // Cada item tem um baseline = valor fisiológico de uma pessoa média destreinada.
    // A escala de % vai de baseline (0%) até ideal (100%).

    const items: { nome: string; atual: number; ideal: number; baseline: number }[] = [
        // 1. Shape-V (Ombros ÷ Cintura)
        //    Destreinado: ombros ≈ cintura → ratio ~1.0 (cilindro)
        {
            nome: 'Shape-V',
            atual: medidas.ombros / medidas.cintura,
            ideal: PHI,                          // 1.618
            baseline: 1.0,
        },
        // 2. Costas (Costas ÷ Cintura)
        //    Destreinado: costas ≈ cintura → ~1.0 (sem lat spread)
        {
            nome: 'Costas',
            atual: medidas.costas / medidas.cintura,
            ideal: 1.6,
            baseline: 1.0,
        },
        // 3. Peitoral (Peito ÷ Punho)
        //    Destreinado: peito ~84cm / punho ~17.5cm → ~4.8
        {
            nome: 'Peitoral',
            atual: medidas.peitoral / medidas.punho,
            ideal: GR_TARGETS.PEITO_PUNHO,       // 6.5
            baseline: 4.8,
        },
        // 4. Braço (Braço ÷ Punho)
        //    Destreinado: braço ~26cm / punho ~17.5cm → ~1.5
        {
            nome: 'Braço',
            atual: bracoMD / medidas.punho,
            ideal: GR_TARGETS.BRACO_PUNHO,       // 2.52
            baseline: 1.5,
        },
        // 5. Antebraço (Antebraço ÷ Braço)
        //    Destreinado: ante ~25cm / braço ~34cm → ~0.74, chão em 0.70
        {
            nome: 'Antebraço',
            atual: antebracoMD / bracoMD,
            ideal: GR_TARGETS.ANTEBRACO_BRACO,   // 0.80
            baseline: 0.70,
        },
        // 6. Tríade (Score de Harmonia Pescoço/Braço/Panturrilha)
        //    Destreinado com desequilíbrio alto → ~70%
        {
            nome: 'Tríade',
            atual: (() => {
                const media = (medidas.pescoco + bracoMD + panturrilhaMD) / 3;
                const desvio = (Math.abs(medidas.pescoco - media) + Math.abs(bracoMD - media) + Math.abs(panturrilhaMD - media)) / media / 3;
                return Math.max(0, (1 - desvio) * 100);
            })(),
            ideal: 100,
            baseline: 70,
        },
        // 7. Cintura (Cintura ÷ Pélvis) — INVERSO (menor = melhor)
        //    Destreinado/sobrepeso: cintura ≈ pélvis → 1.0
        {
            nome: 'Cintura',
            atual: medidas.cintura / medidas.pelvis,
            ideal: GR_TARGETS.CINTURA_PELVIS,    // 0.86
            baseline: 1.05,
        },
        // 8. Coxa (Coxa ÷ Joelho)
        //    Destreinado: coxa ~46cm / joelho ~38cm → ~1.21
        {
            nome: 'Coxa',
            atual: coxaMD / medidas.joelho,
            ideal: GR_TARGETS.COXA_JOELHO,       // 1.75
            baseline: 1.2,
        },
        // 9. Coxa vs Panturrilha (Coxa ÷ Panturrilha)
        //    Destreinado: coxa e panturrilha parecidas → ~1.15
        {
            nome: 'Coxa vs Pantur.',
            atual: coxaMD / panturrilhaMD,
            ideal: GR_TARGETS.COXA_PANTURRILHA,  // 1.50
            baseline: 1.15,
        },
        // 10. Panturrilha (Panturrilha ÷ Tornozelo)
        //     Destreinado: pant ~32cm / tornozelo ~22cm → ~1.45
        {
            nome: 'Panturrilha',
            atual: panturrilhaMD / medidas.tornozelo,
            ideal: GR_TARGETS.PANTURRILHA_TORNOZELO,  // 1.92
            baseline: 1.45,
        },
        // 11. Upper vs Lower — INVERSO (menor = melhor)
        //     Destreinado: upper ≈ lower → ~1.0
        {
            nome: 'Upper vs Lower',
            atual: (bracoMD + antebracoMD) / (coxaMD + panturrilhaMD),
            ideal: GR_TARGETS.UPPER_LOWER_RATIO, // 0.75
            baseline: 1.0,
        },
    ];

    for (const item of items) {
        const pct = getCalibratedPct(item.atual, item.ideal, item.baseline);
        proporcoes.push({
            grupo: item.nome,
            atual: Math.round(item.atual * 100) / 100,
            ideal: item.ideal,
            pct,
            status: pct >= 100 ? 'ELITE' :
                pct >= 90 ? 'META' :
                    pct >= 75 ? 'QUASE LÁ' :
                        pct >= 50 ? 'CAMINHO' : 'INÍCIO',
        });
    }
    return proporcoes;
}


/**
 * Analisa simetria bilateral (braço, antebraço, coxa, panturrilha).
 */
export function analisarSimetria(medidas: DiagnosticoInput['medidas']): {
    scoreGeral: number;
    status: string;
    itens: AnaliseSimetriaItem[];
} {
    const pares: { grupo: string; d: number; e: number }[] = [
        { grupo: 'Braço', d: medidas.bracoD, e: medidas.bracoE },
        { grupo: 'Antebraço', d: medidas.antebracoD, e: medidas.antebracoE },
        { grupo: 'Coxa', d: medidas.coxaD, e: medidas.coxaE },
        { grupo: 'Panturrilha', d: medidas.panturrilhaD, e: medidas.panturrilhaE },
    ];

    const itens: AnaliseSimetriaItem[] = pares.map(({ grupo, d, e }) => {
        const media = (d + e) / 2;
        const diffPct = media > 0 ? Math.round(Math.abs(d - e) / media * 1000) / 10 : 0;
        return { grupo, direito: d, esquerdo: e, diffPct };
    });

    const scores = itens.map(i => i.diffPct < 1 ? 100 : i.diffPct < 2 ? 95 : i.diffPct < 3 ? 85 : i.diffPct < 5 ? 70 : 50);
    const scoreGeral = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) / 10;

    return {
        scoreGeral,
        status: scoreGeral >= 95 ? 'EXCELENTE' : scoreGeral >= 85 ? 'BOM' : scoreGeral >= 70 ? 'REGULAR' : 'ATENÇÃO',
        itens,
    };
}

// ═══════════════════════════════════════════════════════════
// PRIORIDADES E METAS
// ═══════════════════════════════════════════════════════════

/**
 * Identifica pontos fortes e fracos e gera prioridades de treino.
 */
export function gerarPrioridades(proporcoes: ProporcoesGrupo[]): Prioridade[] {
    return proporcoes
        .sort((a, b) => a.pct - b.pct)
        .map((p) => ({
            grupo: p.grupo,
            nivel: p.pct < 50 ? 'ALTA' as const
                : p.pct < 75 ? 'MEDIA' as const
                    : 'BAIXA' as const,
            pctAtual: p.pct,
            meta: p.ideal,
            obs: `${p.atual} → ${p.ideal} (${p.pct}%)`,
        }));
}

/**
 * Gera metas de proporção trimestrais para 12 meses.
 * 
 * Baseado em dados científicos de crescimento muscular natural:
 * - Grupos grandes (peito, costas, ombros, coxa): +2-3cm/ano para intermediários
 * - Grupos médios (braço): +1.5-2cm/ano
 * - Panturrilha: +0.5-1cm/ano (grupo mais resistente a hipertrofia)
 * - Redução cintura: -2-4cm/ano com dieta adequada
 * 
 * Refs: Schoenfeld (2010), ACSM Position Stand, Wernbom et al. (2007)
 */
export function gerarMetasProporcoes(
    proporcoes: ProporcoesGrupo[],
    medidas?: DiagnosticoInput['medidas']
): MetaProporcao[] {
    // ─── Crescimento máximo realista em CM por grupo em 12 meses ───
    // Valores para praticantes intermediários naturais
    const MAX_CM_12M: Record<string, number> = {
        'Costas': 3,              // circunferência torácica (lat spread)
        'Shape-V': 2.5,           // circunferência de ombros
        'Peitoral': 3,            // circunferência torácica
        'Braço': 1.5,             // braço (grupo menor, cresce menos em cm)
        'Antebraço': 0.5,         // muito limitado geneticamente
        'Coxa': 2.5,              // grupo grande, responde bem
        'Coxa vs Pantur.': 2.5,   // coxa
        'Panturrilha': 0.8,       // grupo mais resistente a hipertrofia
        'Tríade': 5,              // pontos de score (não cm)
        'Upper vs Lower': 1.5,    // combinação de grupos
    };

    // ─── Denominador fixo de cada proporção (medida estrutural/referência) ───
    const getDenominador = (grupo: string): number => {
        if (!medidas) return 0;
        switch (grupo) {
            case 'Costas':
            case 'Shape-V':
                return medidas.cintura;
            case 'Peitoral':
            case 'Braço':
                return medidas.punho;
            case 'Antebraço':
                return Math.max(medidas.bracoD, medidas.bracoE);
            case 'Coxa':
                return medidas.joelho;
            case 'Coxa vs Pantur.':
                return Math.max(medidas.panturrilhaD, medidas.panturrilhaE);
            case 'Panturrilha':
                return medidas.tornozelo;
            default:
                return 0;
        }
    };

    return proporcoes
        .filter(p => p.pct < 100 && p.grupo !== 'Cintura')
        .slice(0, 5)
        .map(p => {
            const diff = p.ideal - p.atual;
            const maxCm = MAX_CM_12M[p.grupo] || 2;
            const denominador = getDenominador(p.grupo);

            let ganho12M: number;

            if (denominador > 0) {
                // Calcular ganho máximo em ratio baseado no cap de cm
                const maxRatioGain = maxCm / denominador;
                // Usar o menor: cap de cm OU gap restante (não ultrapassar o ideal)
                ganho12M = Math.min(maxRatioGain, diff);
            } else {
                // Fallback: Tríade, Upper vs Lower, etc. → 15% do gap
                ganho12M = diff * 0.15;
            }

            const meta12M = p.atual + ganho12M;

            return {
                grupo: p.grupo,
                atual: p.atual,
                meta3M: Math.round((p.atual + ganho12M * 0.25) * 100) / 100,
                meta6M: Math.round((p.atual + ganho12M * 0.50) * 100) / 100,
                meta9M: Math.round((p.atual + ganho12M * 0.75) * 100) / 100,
                meta12M: Math.round(meta12M * 100) / 100,
                idealFinal: Math.round(p.ideal * 100) / 100,
            };
        });
}

// ═══════════════════════════════════════════════════════════
// GERADOR PRINCIPAL
// ═══════════════════════════════════════════════════════════

/**
 * Gera diagnóstico completo a partir dos dados do atleta.
 * 
 * @param input - Dados do atleta (peso, altura, medidas, contexto)
 * @returns DiagnosticoDados pronto para exibição e persistência
 */
export function gerarDiagnosticoCompleto(
    input: DiagnosticoInput,
    potencial?: PotencialAtleta
): DiagnosticoDados {
    // 1. Taxas metabólicas
    const tmbBase = calcularTMB(input.peso, input.altura, input.idade, input.sexo);
    const { tmbAjustada, fatores } = ajustarTMBPorMedicacoes(tmbBase, input.usaAnabolizantes, input.usaTermogenicos);
    const taxas = calcularTDEE(tmbAjustada, input.nivelAtividade, input.freqTreino);
    taxas.tmb = tmbBase;
    taxas.tmbAjustada = tmbAjustada;
    taxas.fatoresConsiderados = fatores;

    // 2. Composição corporal
    const composicaoAtual = calcularComposicao(input.peso, input.gorduraPct);

    // Meta de gordura: atlético (10-12%) para homens, fitness (18-20%) para mulheres
    const gorduraMeta12M = input.sexo === 'M'
        ? Math.max(10, input.gorduraPct - 6)
        : Math.max(18, input.gorduraPct - 5);
    const metasComposicao = projetarMetas(composicaoAtual, gorduraMeta12M);

    // 3. Análise estética
    const proporcoes = analisarProporcoes(input.medidas, input.proporcoesPreCalculadas);
    const simetria = analisarSimetria(input.medidas);

    // Meta de score: dinâmica via PotencialAtleta (se disponível) ou fallback conservador
    const deltaScore = potencial?.deltaPotencialScore12M ?? 6;
    const deltaScore6M = Math.round(deltaScore * 0.55 * 10) / 10;
    const scoreMeta12M = Math.min(100, Math.round((input.score + deltaScore) * 10) / 10);
    const scoreMeta6M = Math.min(100, Math.round((input.score + deltaScore6M) * 10) / 10);
    const classificacaoMeta = scoreMeta12M >= 95 ? 'ELITE' : scoreMeta12M >= 85 ? 'META' : 'CAMINHO';
    const labelNivel = potencial?.nivel ?? input.classificacao.toUpperCase();

    const analiseEstetica: AnaliseEstetica = {
        scoreAtual: input.score,
        classificacaoAtual: input.classificacao,
        scoreMeta6M,
        scoreMeta12M,
        proporcoes,
        simetria,
    };

    // 4. Prioridades e metas
    const prioridades = gerarPrioridades(proporcoes);
    const metasProporcoes = gerarMetasProporcoes(proporcoes, input.medidas);

    // 5. Resumo do Vitrúvio — contextualizado com nível e meta real
    const resumoVitruvio = `${input.nomeAtleta}, você está classificado como ${labelNivel} com score ${input.score}. Com base no seu perfil, histórico e contexto, a meta realista em 12 meses é atingir score ${scoreMeta12M}+ (${classificacaoMeta}) — um ganho de ${deltaScore} pontos. Na composição corporal, a meta é reduzir gordura de ${input.gorduraPct}% para ${gorduraMeta12M}% enquanto ganha massa magra. Com consistência e o plano correto para o seu nível, essas metas são desafiadoras mas totalmente alcançáveis. Vamos montar o plano de treino para fazer isso acontecer!`;

    return {
        taxas,
        composicaoAtual,
        metasComposicao,
        analiseEstetica,
        prioridades,
        metasProporcoes,
        resumoVitruvio,
        recomendacoesIA: undefined,
        geradoEm: new Date().toISOString(),
        _medidas: input.medidas, // Para referência em cm na UI
    };
}

/**
 * Enriquece o diagnóstico com IA (Gemini).
 * Substitui o resumoVitruvio por geração personalizada e adiciona recomendações e insights por seção.
 * Fallback: mantém o template string se IA falhar.
 */
export async function enriquecerDiagnosticoComIA(
    diagnostico: DiagnosticoDados,
    perfil: PerfilAtletaIA,
    diretrizesAdicionais?: string
): Promise<DiagnosticoDados> {
    try {
        const perfilTexto = perfilParaTexto(perfil);
        const dadosTexto = diagnosticoParaTexto(diagnostico);
        const fontesTexto = getFontesCientificas('diagnostico');

        const prompt = buildDiagnosticoPrompt(perfilTexto, dadosTexto, fontesTexto, diretrizesAdicionais);
        const resultado = await gerarConteudoIA<{
            resumoVitruvio: string;
            insightsPorSecao?: {
                taxas?: string;
                composicao?: string;
                proporcoes?: string;
                prioridades?: string;
            };
            recomendacoesIA: string[];
        }>(prompt);

        if (resultado) {
            return {
                ...diagnostico,
                resumoVitruvio: resultado.resumoVitruvio || diagnostico.resumoVitruvio,
                recomendacoesIA: resultado.recomendacoesIA || [],
                insightsPorSecao: resultado.insightsPorSecao || undefined,
            };
        }
    } catch (error) {
        console.error('[Diagnostico] Erro ao enriquecer com IA:', error);
    }

    // Fallback: retorna diagnóstico sem alteração
    return diagnostico;
}

// ═══════════════════════════════════════════════════════════
// PERSISTÊNCIA - SUPABASE
// ═══════════════════════════════════════════════════════════

/**
 * Salva diagnóstico no Supabase (tabela diagnosticos).
 */
export async function salvarDiagnostico(
    atletaId: string,
    personalId: string | null,
    dados: DiagnosticoDados
): Promise<{ id: string } | null> {
    try {
        const { data, error } = await supabase
            .from('diagnosticos')
            .insert({
                atleta_id: atletaId,
                personal_id: personalId,
                dados,
                status: 'confirmado',
            })
            .select('id')
            .single();

        if (error) {
            console.error('[Diagnostico] Erro ao salvar:', error);
            return null;
        }
        return data;
    } catch (err) {
        console.error('[Diagnostico] Exceção ao salvar:', err);
        return null;
    }
}

/**
 * Busca último diagnóstico confirmado de um atleta.
 */
export async function buscarDiagnostico(atletaId: string): Promise<DiagnosticoDados | null> {
    try {
        const { data, error } = await supabase
            .from('diagnosticos')
            .select('dados')
            .eq('atleta_id', atletaId)
            .eq('status', 'confirmado')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error || !data) return null;
        return data.dados as DiagnosticoDados;
    } catch {
        return null;
    }
}
