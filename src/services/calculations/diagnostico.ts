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
}

export interface DiagnosticoDados {
    taxas: TaxasMetabolicas;
    composicaoAtual: ComposicaoAtual;
    metasComposicao: MetasComposicao;
    analiseEstetica: AnaliseEstetica;
    prioridades: Prioridade[];
    metasProporcoes: MetaProporcao[];
    resumoVitruvio: string;
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
// ═══════════════════════════════════════════════════════════

const GOLDEN_RATIO = 1.618;

interface ProporcaoIdeal {
    grupo: string;
    calcularIdeal: (medidas: DiagnosticoInput['medidas'], punho: number) => number;
    getAtual: (medidas: DiagnosticoInput['medidas']) => number;
}

/**
 * Gera tabela de proporções baseada em RATIOS (Índices), consistente com a avaliação principal.
 */
export function analisarProporcoes(
    medidas: DiagnosticoInput['medidas']
): ProporcoesGrupo[] {
    const proporcoes: ProporcoesGrupo[] = [];

    // Helper: Calcula porcentagem calibrada (da base até a meta)
    const getCalibratedPct = (atual: number, ideal: number, baseline: number) => {
        if (ideal === baseline) return 100;

        // Caso normal (músculo/ratio: ideal > baseline)
        if (ideal > baseline) {
            const range = ideal - baseline;
            const progress = atual - baseline;
            return Math.max(0, Math.min(100, Math.round((progress / range) * 100)));
        }
        // Caso inverso (cintura: ideal < baseline)
        else {
            const range = baseline - ideal;
            const progress = baseline - atual;
            return Math.max(0, Math.min(100, Math.round((progress / range) * 100)));
        }
    };

    // 1. Shape-V (Ratio Ombros/Cintura)
    const shapeVAtual = medidas.ombros / medidas.cintura;
    const shapeVTarget = GOLDEN_RATIO;
    const shapeVBaseline = 1.0;
    const shapeVPct = getCalibratedPct(shapeVAtual, shapeVTarget, shapeVBaseline);

    proporcoes.push({
        grupo: 'Shape-V',
        atual: Math.round(shapeVAtual * 100) / 100,
        ideal: shapeVTarget,
        pct: shapeVPct,
        status: shapeVPct >= 95 ? 'ELITE' : shapeVPct >= 85 ? 'META' : shapeVPct >= 70 ? 'CAMINHO' : 'INÍCIO',
    });

    // 2. Grupos baseados em Ratios (Índices)
    // Baselines = valor fisiológico mínimo de uma pessoa DESTREINADA
    const r = [
        {
            nome: 'Peitoral',                                         // Peito / Punho
            atual: medidas.peitoral / medidas.punho,
            ideal: 6.5,
            baseline: 4.8                                              // destreinado: peito ~84cm / punho ~17.5cm
        },
        {
            nome: 'Braço (MD)',                                        // Braço / Punho
            atual: ((medidas.bracoD + medidas.bracoE) / 2) / medidas.punho,
            ideal: 2.5,
            baseline: 1.5                                              // destreinado: braço ~26cm / punho ~17.5cm
        },
        {
            nome: 'Antebraço (MD)',                                    // Antebraço / Braço
            atual: ((medidas.antebracoD + medidas.antebracoE) / 2) / ((medidas.bracoD + medidas.bracoE) / 2),
            ideal: 0.81,
            baseline: 0.70                                             // destreinado: ante ~25cm / braço ~34cm = ~0.74, chão em 0.70
        },
        {
            nome: 'Coxa (MD)',                                         // Coxa / Joelho
            atual: ((medidas.coxaD + medidas.coxaE) / 2) / medidas.joelho,
            ideal: 1.75,
            baseline: 1.2                                              // destreinado: coxa ~46cm / joelho ~38cm = ~1.21
        },
        {
            nome: 'Panturrilha (MD)',                                  // Panturrilha / Tornozelo
            atual: ((medidas.panturrilhaD + medidas.panturrilhaE) / 2) / medidas.tornozelo,
            ideal: 1.62,
            baseline: 1.45                                             // destreinado: pant ~32cm / tornozelo ~22cm = ~1.45
        },
        {
            nome: 'Cintura',                                          // Cintura / Pélvis (INVERSO: menor = melhor)
            atual: medidas.cintura / medidas.pelvis,
            ideal: 0.62,
            baseline: 1.0                                              // destreinado/sobrepeso: cintura ≈ pélvis (1:1)
        },
        {
            nome: 'Costas',                                           // Costas / Cintura
            atual: medidas.costas / medidas.cintura,
            ideal: 1.62,
            baseline: 1.0                                              // destreinado: costas ≈ cintura (sem lat spread)
        }
    ];

    for (const item of r) {
        const pct = getCalibratedPct(item.atual, item.ideal, item.baseline);
        proporcoes.push({
            grupo: item.nome,
            atual: Math.round(item.atual * 100) / 100,
            ideal: item.ideal,
            pct,
            status: pct >= 95 ? 'ELITE' : pct >= 85 ? 'META' : pct >= 70 ? 'CAMINHO' : 'INÍCIO',
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
        .filter(p => p.grupo !== 'Shape-V' && p.grupo !== 'Cintura')
        .sort((a, b) => a.pct - b.pct)
        .slice(0, 4)
        .map((p, idx) => ({
            grupo: p.grupo,
            nivel: idx < 2 ? 'ALTA' as const : idx < 3 ? 'MEDIA' as const : 'BAIXA' as const,
            pctAtual: p.pct,
            meta: p.ideal,
            obs: `${p.atual}cm → ${p.ideal}cm`,
        }));
}

/**
 * Gera metas de proporção trimestrais para 12 meses.
 */
export function gerarMetasProporcoes(proporcoes: ProporcoesGrupo[]): MetaProporcao[] {
    return proporcoes
        .filter(p => p.pct < 100 && p.grupo !== 'Cintura')
        .slice(0, 5)
        .map(p => {
            const diff = p.ideal - p.atual;
            return {
                grupo: p.grupo,
                atual: p.atual,
                meta3M: Math.round((p.atual + diff * 0.25) * 10) / 10,
                meta6M: Math.round((p.atual + diff * 0.50) * 10) / 10,
                meta9M: Math.round((p.atual + diff * 0.75) * 10) / 10,
                meta12M: Math.round(p.ideal * 10) / 10,
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
export function gerarDiagnosticoCompleto(input: DiagnosticoInput): DiagnosticoDados {
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
    const proporcoes = analisarProporcoes(input.medidas);
    const simetria = analisarSimetria(input.medidas);

    // Meta de score: +6 pontos em 12 meses (realista)
    const scoreMeta12M = Math.min(100, input.score + 6);
    const scoreMeta6M = Math.min(100, input.score + 3);
    const classificacaoMeta = scoreMeta12M >= 95 ? 'ELITE' : scoreMeta12M >= 85 ? 'META' : 'CAMINHO';

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
    const metasProporcoes = gerarMetasProporcoes(proporcoes);

    // 5. Resumo do Vitrúvio
    const resumoVitruvio = `${input.nomeAtleta}, você está na classificação ${input.classificacao.toUpperCase()} com score ${input.score}. Em 12 meses, com foco nos pontos fracos identificados, você pode atingir score ${scoreMeta12M}+ (${classificacaoMeta}). Na composição corporal, a meta é uma recomposição: reduzir gordura de ${input.gorduraPct}% para ${gorduraMeta12M}% enquanto ganha massa magra. Com consistência e dedicação, essas metas são desafiadoras mas realistas. Vamos montar o plano de treino para fazer isso acontecer!`;

    return {
        taxas,
        composicaoAtual,
        metasComposicao,
        analiseEstetica,
        prioridades,
        metasProporcoes,
        resumoVitruvio,
        geradoEm: new Date().toISOString(),
    };
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
