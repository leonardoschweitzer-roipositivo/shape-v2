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
    scoreMeta3M: number;
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
    proporcoesPreCalculadas?: (ProporcoesGrupo | any)[]
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

    // ─── Se recebeu dados do banco, usar atual/ideal/pct já calculados (preserva regras de sexo) ───
    if (proporcoesPreCalculadas?.length && proporcoesPreCalculadas[0]?.nome) {
        console.info('[Diagnostico] ✅ USANDO ratios do banco (preservando % e status femininos/masculinos)');
        return proporcoesPreCalculadas.map(p => {
            return {
                grupo: p.nome,
                atual: Math.round(p.atual * 100) / 100,
                ideal: p.ideal,
                pct: p.pct,
                status: p.status,
            };
        });
    }

    console.info('[Diagnostico] ⚠️ FALLBACK: calculando proporções localmente');
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
                    pct >= 75 ? 'MUITO BOM' :
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
        'SHR': 2.5,               // ombros (feminino)
        'Peitoral': 3,            // circunferência torácica
        'Braço': 1.5,             // braço (grupo menor, cresce menos em cm)
        'Proporção de Braço': 1.5, // braço (feminino)
        'Antebraço': 0.5,         // muito limitado geneticamente
        'Coxa': 2.5,              // grupo grande, responde bem
        'Desenvolvimento de Coxa': 2.5, // coxa (feminino)
        'Coxa vs Pantur.': 2.5,   // coxa
        'Proporção de Perna': 2.5, // perna inteira (feminino)
        'Panturrilha': 0.8,       // grupo mais resistente a hipertrofia
        'Desenvolvimento de Panturrilha': 0.8, // panturrilha (feminino)
        'Hip-Thigh': 2.5,         // coxa / quadril
        'Tríade': 5,              // pontos de score (não cm)
        'Ampulheta': 5,           // pontos de score (não cm)
        'Upper vs Lower': 1.5,    // combinação de grupos
    };

    // ─── Denominador fixo de cada proporção (medida estrutural/referência) ───
    const getDenominador = (grupo: string): number => {
        if (!medidas) return 0;
        switch (grupo) {
            case 'Costas':
            case 'Shape-V':
                return medidas.cintura;
            case 'SHR':
            case 'Hip-Thigh':
                return (medidas as any).quadril || medidas.cintura * 1.1;
            case 'Peitoral':
            case 'Proporção de Braço':
                return medidas.punho;
            case 'Braço':
                return Math.max(medidas.bracoD, medidas.bracoE) || medidas.punho;
            case 'Antebraço':
                return Math.max(medidas.bracoD, medidas.bracoE);
            case 'Coxa':
            case 'Desenvolvimento de Coxa':
                return medidas.joelho;
            case 'Coxa vs Pantur.':
            case 'Proporção de Perna':
                return Math.max(medidas.panturrilhaD, medidas.panturrilhaE);
            case 'Panturrilha':
            case 'Desenvolvimento de Panturrilha':
                return medidas.tornozelo;
            default:
                return 0;
        }
    };

    return proporcoes
        .filter(p => p.pct < 100 && p.grupo !== 'Cintura' && p.grupo !== 'WHR')
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
// PROJEÇÃO DE SCORE META (3 PILARES)
// ═══════════════════════════════════════════════════════════

/**
 * Projeta o Score Meta para 6 e 12 meses estimando melhorias REAIS nos 3 pilares:
 * - Composição Corporal (BF projetado, massa magra projetada)
 * - Proporções Áureas (metas trimestrais já calculadas)
 * - Simetria Bilateral (convergência das assimetrias)
 *
 * Abordagem: estima o DELTA de melhoria em cada pilar e soma ao score atual.
 * Isso evita problemas de gênero (ex: V-Taper masculino aplicado a mulheres)
 * pois usa o score atual (já corretamente calculado) como baseline.
 */
function projetarScoreMeta(
    input: DiagnosticoInput,
    proporcoes: ProporcoesGrupo[],
    simetria: ReturnType<typeof analisarSimetria>,
    metasComposicao: MetasComposicao,
    metasProporcoes: MetaProporcao[],
    gorduraMeta12M: number,
    fallbackDelta: number
): { scoreMeta3M: number; scoreMeta6M: number; scoreMeta12M: number } {
    try {
        const isFemale = input.sexo === 'F';

        // ═══════════════════════════════════════════════════════════
        // 1. DELTA COMPOSIÇÃO (peso = 35% do score geral)
        // ═══════════════════════════════════════════════════════════
        // Estimar melhoria no score de BF usando as mesmas faixas de assessment.ts
        const estimarScoreBF = (bf: number): number => {
            if (isFemale) {
                if (bf < 10) return 85;
                if (bf < 15) return 95 + (15 - bf) / 5 * 5;     // 95-100
                if (bf < 22) return 80 + (22 - bf) / 7 * 15;    // 80-95
                if (bf < 27) return 65 + (27 - bf) / 5 * 15;    // 65-80
                if (bf < 32) return 45 + (32 - bf) / 5 * 20;    // 45-65
                if (bf < 38) return 25 + (38 - bf) / 6 * 20;    // 25-45
                return 15;
            } else {
                if (bf < 4) return 85;
                if (bf < 8) return 95 + (8 - bf) / 4 * 5;       // 95-100
                if (bf < 14) return 80 + (14 - bf) / 6 * 15;    // 80-95
                if (bf < 18) return 65 + (18 - bf) / 4 * 15;    // 65-80
                if (bf < 24) return 45 + (24 - bf) / 6 * 20;    // 45-65
                if (bf < 30) return 25 + (30 - bf) / 6 * 20;    // 25-45
                return 15;
            }
        };

        const scoreBFAtual = estimarScoreBF(input.gorduraPct);
        const scoreBFMeta = estimarScoreBF(gorduraMeta12M);
        const deltaBF = Math.max(0, scoreBFMeta - scoreBFAtual);

        // FFMI melhoria: ~2.4kg lean mass em 12 meses → FFMI sobe ~0.8-1 ponto → ~5-8 score pts
        const ganhoMML12M = 0.2 * 12; // kg
        const alturaM = input.altura / 100;
        const ffmiAtual = (input.peso * (1 - input.gorduraPct / 100)) / (alturaM * alturaM);
        const ffmiMeta = ((input.peso * (1 - input.gorduraPct / 100)) + ganhoMML12M) / (alturaM * alturaM);
        const deltaFFMI = Math.min(10, Math.max(0, (ffmiMeta - ffmiAtual) * 5)); // ~5 pts per FFMI point

        // Peso relativo melhoria: segue lean mass gain
        const deltaPesoRel = Math.min(5, ganhoMML12M / input.altura * 100); // Pequeno ganho

        // Delta composição total (ponderado internamente: BF 50%, FFMI 30%, pesoRel 20%)
        const deltaComposicao = (deltaBF * 0.50 + deltaFFMI * 0.30 + deltaPesoRel * 0.20);

        // ═══════════════════════════════════════════════════════════
        // 2. DELTA PROPORÇÕES (peso = 40% do score geral)
        // ═══════════════════════════════════════════════════════════
        // Calcular melhoria média de % do ideal nos grupos projetados
        let totalPctImprovement = 0;
        let countGroupsWithImprovement = 0;

        for (const mp of metasProporcoes) {
            const current = proporcoes.find(p => p.grupo === mp.grupo);
            if (current && current.ideal > 0) {
                // Calcular o novo pct do ideal com a meta projetada
                const currentPct = current.pct;
                const newPct = Math.min(115, (mp.meta12M / current.ideal) * 100);
                const improvement = Math.max(0, newPct - currentPct);
                totalPctImprovement += improvement;
                countGroupsWithImprovement++;
            }
        }

        // Proporções que já estão boas (>= 100%) também contribuem positivamente mantendo o score
        // A melhoria média dos grupos que TÊM meta é um bom proxy do delta de proporções
        const avgPctImprovement = countGroupsWithImprovement > 0
            ? totalPctImprovement / countGroupsWithImprovement
            : 0;

        // Conversão: cada 1 pct de melhoria média ≈ 0.8 pontos no score de proporções
        // (considerando que os grupos com meta são os mais fracos, portanto têm mais impacto)
        const deltaProportionScore = avgPctImprovement * 0.8;

        // ═══════════════════════════════════════════════════════════
        // 3. DELTA SIMETRIA (peso = 25% do score geral)
        // ═══════════════════════════════════════════════════════════
        const currentSymScore = simetria.scoreGeral;
        // Projetar: convergência de 60% das assimetrias em 12 meses (conservador)
        const projectedSymScore = currentSymScore + (100 - currentSymScore) * 0.60;
        const deltaSymmetry = projectedSymScore - currentSymScore;

        // ═══════════════════════════════════════════════════════════
        // SCORE FINAL PROJETADO
        // ═══════════════════════════════════════════════════════════
        // Aplicar os pesos de cada pilar (mesmos de assessment.ts)
        const deltaTotal12M =
            deltaComposicao * 0.35 +           // 35% composição
            deltaProportionScore * 0.40 +      // 40% proporções
            deltaSymmetry * 0.25;              // 25% simetria

        // Ganho front-loaded: 3 meses ≈ 30% do ganho total, 6 meses ≈ 55%
        const deltaTotal3M = deltaTotal12M * 0.30;
        const deltaTotal6M = deltaTotal12M * 0.55;

        console.info(`[ScoreMeta] Deltas calculados (${isFemale ? 'F' : 'M'}):`,
            `Composição=${deltaComposicao.toFixed(1)} (BF:${deltaBF.toFixed(1)}, FFMI:${deltaFFMI.toFixed(1)}, PR:${deltaPesoRel.toFixed(1)})`,
            `| Proporções=${deltaProportionScore.toFixed(1)} (avg +${avgPctImprovement.toFixed(1)}%, ${countGroupsWithImprovement} grupos)`,
            `| Simetria=${deltaSymmetry.toFixed(1)} (${currentSymScore} → ${projectedSymScore.toFixed(1)})`,
            `| Total 12M=${deltaTotal12M.toFixed(1)}, 6M=${deltaTotal6M.toFixed(1)}`
        );

        const scoreMeta3M = Math.min(100, Math.round((input.score + deltaTotal3M) * 10) / 10);
        const scoreMeta6M = Math.min(100, Math.round((input.score + deltaTotal6M) * 10) / 10);
        const scoreMeta12M = Math.min(100, Math.round((input.score + deltaTotal12M) * 10) / 10);

        // Segurança: meta deve ser pelo menos 0.5 pontos acima do score atual
        return {
            scoreMeta3M: Math.max(input.score + 0.3, scoreMeta3M),
            scoreMeta6M: Math.max(input.score + 0.6, scoreMeta6M),
            scoreMeta12M: Math.max(input.score + 1.2, scoreMeta12M),
        };
    } catch (error) {
        console.error('[Diagnostico] Erro ao projetar Score Meta, usando fallback:', error);
        // Fallback: método antigo (delta flat)
        const deltaScore3M = Math.round(fallbackDelta * 0.30 * 10) / 10;
        const deltaScore6M = Math.round(fallbackDelta * 0.55 * 10) / 10;
        const deltaScore12M = fallbackDelta; // Assuming fallbackDelta is for 12M
        return {
            scoreMeta3M: Math.min(100, Math.round((input.score + deltaScore3M) * 10) / 10),
            scoreMeta6M: Math.min(100, Math.round((input.score + deltaScore6M) * 10) / 10),
            scoreMeta12M: Math.min(100, Math.round((input.score + deltaScore12M) * 10) / 10),
        };
    }
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

    // 4. Prioridades e metas (precisam estar antes do cálculo de Score Meta)
    const prioridades = gerarPrioridades(proporcoes);
    const metasProporcoes = gerarMetasProporcoes(proporcoes, input.medidas);

    // 5. Meta de score: SIMULAÇÃO CONTEXTUALIZADA via 3 pilares
    //    Projeta melhorias reais em composição, proporções e simetria
    //    e calcula o score resultante via calcularAvaliacaoGeral.
    const fallbackDelta = potencial?.deltaPotencialScore12M ?? 6;
    const { scoreMeta3M, scoreMeta6M, scoreMeta12M } = projetarScoreMeta(
        input, proporcoes, simetria, metasComposicao, metasProporcoes, gorduraMeta12M, fallbackDelta
    );
    const deltaScore = Math.round((scoreMeta12M - input.score) * 10) / 10;
    const classificacaoMeta = scoreMeta12M >= 95 ? 'ELITE' : scoreMeta12M >= 85 ? 'META' : 'CAMINHO';
    const labelNivel = potencial?.nivel ?? input.classificacao.toUpperCase();

    const analiseEstetica: AnaliseEstetica = {
        scoreAtual: input.score,
        classificacaoAtual: input.classificacao,
        scoreMeta3M,
        scoreMeta6M,
        scoreMeta12M,
        proporcoes,
        simetria,
    };

    // 6. Resumo do Vitrúvio — contextualizado com nível e meta real
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
