import type {
    AvaliacaoGeralInput,
    AvaliacaoGeralOutput,
    ProportionScoreDetails,
    CompositionScoreDetails,
    SymmetryScoreDetails,
    ProporcaoDetalhe,
    GrupoSimetriaDetalhe,
    Insights,
    Classificacao,
    ProportionData,
    TriadeData
} from '../../types/assessment.ts';
import type { ComparisonMode } from '../../types/proportions.ts';

// ═══════════════════════════════════════════════════════════
// CONSTANTS & CONFIGURATION
// ═══════════════════════════════════════════════════════════

const PESOS_AVALIACAO = {
    PADRAO: {
        proporcoes: 0.40,
        composicao: 0.35,
        simetria: 0.25,
    },
};

const CLASSIFICACOES_AVALIACAO = [
    { min: 95, nivel: 'ELITE', emoji: '👑', cor: '#FFD700', descricao: 'Físico excepcional - nível competitivo' },
    { min: 85, nivel: 'AVANÇADO', emoji: '🥇', cor: '#10B981', descricao: 'Muito acima da média' },
    { min: 75, nivel: 'ATLÉTICO', emoji: '💪', cor: '#3B82F6', descricao: 'Físico atlético bem desenvolvido' },
    { min: 65, nivel: 'INTERMEDIÁRIO', emoji: '🏃', cor: '#8B5CF6', descricao: 'Bom desenvolvimento geral' },
    { min: 50, nivel: 'INICIANTE', emoji: '🌱', cor: '#F59E0B', descricao: 'Em desenvolvimento' },
    { min: 0, nivel: 'COMEÇANDO', emoji: '🚀', cor: '#6B7280', descricao: 'Início da jornada' },
];

const PESOS_PROPORCOES: Record<ComparisonMode, Record<string, number>> = {
    'golden': {
        vTaper: 20,
        peitoral: 15,
        braco: 12,
        antebraco: 5,
        triade: 12,
        cintura: 15,
        coxa: 10,
        coxaPanturrilha: 5,
        panturrilha: 6,
    },
    'classic': {
        vTaper: 18,
        peitoral: 14,
        braco: 14,
        antebraco: 4,
        triade: 10,
        cintura: 18,
        coxa: 10,
        coxaPanturrilha: 5,
        panturrilha: 7,
        costas: 0
    },
    'mens': {
        vTaper: 25,
        peitoral: 22,
        braco: 25,
        antebraco: 6,
        triade: 0,
        cintura: 17,
        coxa: 0,
        coxaPanturrilha: 0,
        panturrilha: 5,
        costas: 0
    },
    'open': {
        vTaper: 16,
        peitoral: 14,
        braco: 14,
        antebraco: 4,
        triade: 8,
        cintura: 12,
        coxa: 14,
        coxaPanturrilha: 8,
        panturrilha: 6,
        costas: 4,
    },
};

const PESOS_COMPOSICAO = {
    bf: 0.50,
    ffmi: 0.30,
    pesoRelativo: 0.20,
};

const FAIXAS_BF = {
    MALE: {
        competicao: { min: 3, max: 6 },
        atletico: { min: 6, max: 13 },
        fitness: { min: 13, max: 17 },
        normal: { min: 17, max: 24 },
        acima: { min: 24, max: 30 },
        obesidade: { min: 30, max: 100 },
    },
    FEMALE: {
        competicao: { min: 8, max: 12 },
        atletico: { min: 12, max: 20 },
        fitness: { min: 20, max: 24 },
        normal: { min: 24, max: 31 },
        acima: { min: 31, max: 40 },
        obesidade: { min: 40, max: 100 },
    },
};

const FAIXAS_FFMI = {
    MALE: {
        elite: { min: 25, score: 100 },
        excelente: { min: 22, score: 90 },
        acimaMedia: { min: 20, score: 80 },
        normal: { min: 18, score: 70 },
        abaixo: { min: 16, score: 55 },
        muitoAbaixo: { min: 0, score: 40 },
    },
    FEMALE: {
        elite: { min: 22, score: 100 },
        excelente: { min: 19, score: 90 },
        acimaMedia: { min: 17, score: 80 },
        normal: { min: 15, score: 70 },
        abaixo: { min: 13, score: 55 },
        muitoAbaixo: { min: 0, score: 40 },
    },
};

const PESOS_SIMETRIA = {
    braco: 25,
    antebraco: 15,
    coxa: 25,
    panturrilha: 20,
    peitoral: 15,
};

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

function interpolate(valor: number, inMin: number, inMax: number, outAtMin: number, outAtMax: number): number {
    if (inMax === inMin) return outAtMin;
    const ratio = (valor - inMin) / (inMax - inMin);
    const result = outAtMin + (ratio * (outAtMax - outAtMin));

    // Clamp result between the output range bounds
    const minBound = Math.min(outAtMin, outAtMax);
    const maxBound = Math.max(outAtMin, outAtMax);

    return Math.max(minBound, Math.min(result, maxBound));
}

// ═══════════════════════════════════════════════════════════
// 1. PROPORTION SCORE CALCULATION
// ═══════════════════════════════════════════════════════════

function calcularScoreProporcoes(
    proporcoes: AvaliacaoGeralInput['proporcoes'],
    metodo: ComparisonMode = 'golden'
): ProportionScoreDetails {
    const pesos = PESOS_PROPORCOES[metodo] || PESOS_PROPORCOES.golden;

    let scoreAcumulado = 0;
    let pesoAcumulado = 0;
    const detalhes: ProporcaoDetalhe[] = [];

    for (const [prop, peso] of Object.entries(pesos)) {
        if (peso === 0) continue;

        // Type safety: access property dynamically
        const key = prop as keyof typeof proporcoes;
        const dados = proporcoes[key];

        if (!dados) continue;

        let percentual: number;

        if (prop === 'triade') {
            percentual = (dados as TriadeData).harmoniaPercentual;
        } else {
            // For standard proportions, use percentualDoIdeal
            // Cap at 100% unless specified otherwise (spec says cap at 100)
            percentual = Math.min(100, (dados as ProportionData).percentualDoIdeal);
        }

        const contribuicao = (percentual * peso) / 100;
        scoreAcumulado += contribuicao;
        pesoAcumulado += peso;

        detalhes.push({
            proporcao: prop,
            peso,
            percentualDoIdeal: percentual,
            contribuicao,
        });
    }

    const scoreFinal = pesoAcumulado > 0 ? (scoreAcumulado / pesoAcumulado) * 100 : 0;

    // Find strongest/weakest
    // Sort logic to be defined, here simple max/min
    const sorted = [...detalhes].sort((a, b) => b.percentualDoIdeal - a.percentualDoIdeal);

    return {
        score: Math.round(scoreFinal * 10) / 10,
        detalhes,
        proporcaoMaisForte: sorted.length > 0 ? sorted[0].proporcao : '',
        proporcaoMaisFraca: sorted.length > 0 ? sorted[sorted.length - 1].proporcao : '',
    };
}

// ═══════════════════════════════════════════════════════════
// 2. COMPOSITION SCORE CALCULATION
// ═══════════════════════════════════════════════════════════

function calcularScoreBF(bf: number, genero: 'MALE' | 'FEMALE'): number {
    const faixas = FAIXAS_BF[genero];

    // Special case for very low BF (risky)
    if ((genero === 'MALE' && bf < 3) || (genero === 'FEMALE' && bf < 8)) {
        return 85;
    }

    if (bf < faixas.competicao.max) return interpolate(bf, faixas.competicao.min, faixas.competicao.max, 95, 100); // 100 -> 95 logic inverted in helper? No, helper is minOutput + ratio... wait.
    // Spec: "Competição (3-6%): 100 pts". Actually 3% is best? 
    // Usually defined ranges: min is best.
    // Let's assume lower bound of range is ideal for low ranges.
    // Re-reading spec: interpolate(bf, min, max, 100, 95) -> min gets 100, max gets 95.
    // My interpolate function: minOutput + ratio * (maxOutput - minOutput). 
    // If I want minInput to map to 100 and maxInput to map to 95:
    // ratio 0 -> 100. ratio 1 -> 95.
    // minOutput should be 100, maxOutput should be 95? No.
    // Typically interpolate(val, inMin, inMax, outMin, outMax).
    // If val = inMin, returns outMin.
    // So if I want inMin -> 100, then call interpolate(bf, min, max, 100, 95).

    // Correct implementation of interpolate for this usage:
    // function interpolate(val, inMin, inMax, outStart, outEnd)
    // return outStart + (val - inMin)/(inMax-inMin) * (outEnd - outStart)

    // Competicao
    if (bf >= faixas.competicao.min && bf < faixas.competicao.max)
        return interpolate(bf, faixas.competicao.min, faixas.competicao.max, 100, 95);

    // Atletico
    if (bf >= faixas.atletico.min && bf < faixas.atletico.max)
        return interpolate(bf, faixas.atletico.min, faixas.atletico.max, 95, 80);

    // Fitness
    if (bf >= faixas.fitness.min && bf < faixas.fitness.max)
        return interpolate(bf, faixas.fitness.min, faixas.fitness.max, 80, 65);

    // Normal
    if (bf >= faixas.normal.min && bf < faixas.normal.max)
        return interpolate(bf, faixas.normal.min, faixas.normal.max, 60, 40);

    // Acima
    if (bf >= faixas.acima.min && bf < faixas.acima.max)
        return interpolate(bf, faixas.acima.min, faixas.acima.max, 40, 20);

    // Obesidade
    if (bf >= faixas.obesidade.min) {
        return Math.max(0, interpolate(bf, faixas.obesidade.min, 45, 20, 0)); // 45%+ BF gets 0 for this component
    }

    return 0; // Default fallback
}

function calcularFFMI(pesoMagro: number, alturaCm: number): number {
    const alturaM = alturaCm / 100;
    const ffmiBruto = pesoMagro / (alturaM * alturaM);
    const ffmiNormalizado = ffmiBruto + (6.1 * (1.80 - alturaM));
    return Math.round(ffmiNormalizado * 10) / 10;
}

function calcularScoreFFMI(ffmi: number, genero: 'MALE' | 'FEMALE'): number {
    const faixas = FAIXAS_FFMI[genero];

    if (ffmi >= faixas.elite.min) return faixas.elite.score;
    if (ffmi >= faixas.excelente.min) return interpolate(ffmi, faixas.excelente.min, faixas.elite.min, faixas.excelente.score, faixas.elite.score);
    if (ffmi >= faixas.acimaMedia.min) return interpolate(ffmi, faixas.acimaMedia.min, faixas.excelente.min, faixas.acimaMedia.score, faixas.excelente.score);
    if (ffmi >= faixas.normal.min) return interpolate(ffmi, faixas.normal.min, faixas.acimaMedia.min, faixas.normal.score, faixas.acimaMedia.score);
    if (ffmi >= faixas.abaixo.min) return interpolate(ffmi, faixas.abaixo.min, faixas.normal.min, faixas.abaixo.score, faixas.normal.score);

    return faixas.muitoAbaixo.score;
}

function calcularScorePesoRelativo(pesoMagro: number, alturaCm: number, genero: 'MALE' | 'FEMALE'): number {
    const relacao = pesoMagro / alturaCm;

    const faixas = genero === 'MALE'
        ? { excelente: 0.45, bom: 0.40, normal: 0.35, minimo: 0.30 }
        : { excelente: 0.38, bom: 0.34, normal: 0.30, minimo: 0.26 };

    if (relacao >= faixas.excelente) return 100;
    if (relacao >= faixas.bom) return interpolate(relacao, faixas.bom, faixas.excelente, 80, 100);
    if (relacao >= faixas.normal) return interpolate(relacao, faixas.normal, faixas.bom, 65, 80);
    if (relacao >= faixas.minimo) return interpolate(relacao, faixas.minimo, faixas.normal, 50, 65);

    return 40;
}

function calcularScoreComposicao(composicao: AvaliacaoGeralInput['composicao']): CompositionScoreDetails {
    const { bf, pesoMagro, altura, genero, peso } = composicao;

    const scoreBF = calcularScoreBF(bf, genero);

    const ffmi = calcularFFMI(pesoMagro, altura);
    const scoreFFMI = calcularScoreFFMI(ffmi, genero);

    const scorePesoRelativo = calcularScorePesoRelativo(pesoMagro, altura, genero);

    const scoreTotal =
        (scoreBF * PESOS_COMPOSICAO.bf) +
        (scoreFFMI * PESOS_COMPOSICAO.ffmi) +
        (scorePesoRelativo * PESOS_COMPOSICAO.pesoRelativo);

    const classificacaoBF = scoreBF < 50 ? 'OBESIDADE' : scoreBF < 70 ? 'ACIMA_MEDIA' : 'NORMAL'; // Simplified logic for classification string, ideally should reuse ranges

    return {
        score: Math.round(scoreTotal * 10) / 10,
        detalhes: {
            bf: {
                valor: bf,
                score: scoreBF,
                peso: PESOS_COMPOSICAO.bf,
                contribuicao: scoreBF * PESOS_COMPOSICAO.bf,
                classificacao: classificacaoBF,
            },
            ffmi: {
                valor: ffmi,
                score: scoreFFMI,
                peso: PESOS_COMPOSICAO.ffmi,
                contribuicao: scoreFFMI * PESOS_COMPOSICAO.ffmi,
            },
            pesoRelativo: {
                valor: pesoMagro / altura,
                score: scorePesoRelativo,
                peso: PESOS_COMPOSICAO.pesoRelativo,
                contribuicao: scorePesoRelativo * PESOS_COMPOSICAO.pesoRelativo,
            },
        },
        pesoMagro,
        pesoGordo: peso - pesoMagro,
    };
}

// ═══════════════════════════════════════════════════════════
// 3. SYMMETRY SCORE CALCULATION
// ═══════════════════════════════════════════════════════════

function classificarAssimetria(diferencaPercent: number): { score: number, status: string } {
    if (diferencaPercent <= 2) return { score: 100, status: 'SIMETRICO' };
    if (diferencaPercent <= 5) return { score: 85, status: 'SIMETRICO' };
    if (diferencaPercent <= 10) return { score: 70, status: 'LEVE_ASSIMETRIA' };
    if (diferencaPercent <= 15) return { score: 50, status: 'ASSIMETRIA' };
    return { score: 30, status: 'ASSIMETRIA_SEVERA' };
}

function calcularScoreSimetria(assimetrias: AvaliacaoGeralInput['assimetrias']): SymmetryScoreDetails {
    const detalhes: GrupoSimetriaDetalhe[] = [];
    let scoreAcumulado = 0;
    let pesoAcumulado = 0;

    for (const [grupo, peso] of Object.entries(PESOS_SIMETRIA)) {
        const key = grupo as keyof typeof assimetrias;
        const dados = assimetrias[key];

        if (!dados) continue;

        const { esquerdo, direito } = dados;
        const media = (esquerdo + direito) / 2;
        const diferenca = Math.abs(esquerdo - direito);
        const diferencaPercent = media > 0 ? (diferenca / media) * 100 : 0;

        const { score, status } = classificarAssimetria(diferencaPercent);

        const contribuicao = (score * peso) / 100;
        scoreAcumulado += contribuicao;
        pesoAcumulado += peso;

        detalhes.push({
            grupo,
            esquerdo,
            direito,
            diferenca,
            diferencaPercent: Math.round(diferencaPercent * 10) / 10,
            score,
            status,
            peso,
            contribuicao,
            ladoDominante: esquerdo > direito ? 'ESQUERDO' : direito > esquerdo ? 'DIREITO' : 'IGUAL',
        });
    }

    const scoreFinal = pesoAcumulado > 0 ? (scoreAcumulado / pesoAcumulado) * 100 : 100;

    const radarScore = detalhes.length > 0
        ? detalhes.reduce((acc, d) => acc + d.score, 0) / detalhes.length
        : 100;

    // Find min/max symmetry
    const sorted = [...detalhes].sort((a, b) => a.diferencaPercent - b.diferencaPercent);

    return {
        score: Math.round(scoreFinal * 10) / 10,
        radarScore: Math.round(radarScore),
        detalhes,
        grupoMaisSimetrico: sorted.length > 0 ? sorted[0].grupo : '',
        grupoMenosSimetrico: sorted.length > 0 ? sorted[sorted.length - 1].grupo : '',
        assimetriasSignificativas: detalhes.filter(d => d.diferencaPercent > 5),
    };
}

// ═══════════════════════════════════════════════════════════
// 4. MAIN AGGREGATION & INSIGHTS
// ═══════════════════════════════════════════════════════════

function classificarAvaliacao(score: number): Classificacao {
    for (const c of CLASSIFICACOES_AVALIACAO) {
        if (score >= c.min) {
            return {
                nivel: c.nivel,
                emoji: c.emoji,
                cor: c.cor,
                descricao: c.descricao,
            };
        }
    }
    return CLASSIFICACOES_AVALIACAO[CLASSIFICACOES_AVALIACAO.length - 1];
}

function gerarInsights(
    proporcoes: ProportionScoreDetails,
    composicao: CompositionScoreDetails,
    simetria: SymmetryScoreDetails
): Insights {
    // Determine Strongest point
    const scores = [
        { categoria: 'Proporções Áureas', valor: proporcoes.score },
        { categoria: 'Composição Corporal', valor: composicao.score },
        { categoria: 'Simetria Bilateral', valor: simetria.score },
    ];

    scores.sort((a, b) => b.valor - a.valor);
    const pontoForte = scores[0];
    const pontoFraco = scores[scores.length - 1];

    let proximaMeta: any = { categoria: '', metaAtual: 0, metaProxima: 0, acao: '' };

    // Simple heuristic for "Action"
    if (pontoFraco.categoria === 'Composição Corporal') {
        const bf = composicao.detalhes.bf.valor;
        const targetBf = Math.max(10, Math.floor(bf - 5));
        proximaMeta = {
            categoria: 'Composição Corporal',
            metaAtual: bf,
            metaProxima: targetBf,
            acao: `Reduza o BF% para ${targetBf}% para melhorar sua avaliação.`
        };
    } else if (pontoFraco.categoria === 'Simetria Bilateral') {
        proximaMeta = {
            categoria: 'Simetria Bilateral',
            metaAtual: simetria.score,
            metaProxima: 100,
            acao: `Foque em exercícios unilaterais para corrigir ${simetria.grupoMenosSimetrico}.`
        };
    } else {
        proximaMeta = {
            categoria: 'Proporções Áureas',
            metaAtual: proporcoes.score,
            metaProxima: 100,
            acao: `Dê prioridade para ${proporcoes.proporcaoMaisFraca} no treino.`
        };
    }

    return {
        pontoForte: {
            categoria: pontoForte.categoria,
            valor: pontoForte.valor,
            mensagem: `Seu ponto forte é ${pontoForte.categoria} com ${pontoForte.valor} pontos.`
        },
        pontoFraco: {
            categoria: pontoFraco.categoria,
            valor: pontoFraco.valor,
            mensagem: `Atenção para ${pontoFraco.categoria} (${pontoFraco.valor} pts).`
        },
        proximaMeta
    };
}

export function calcularAvaliacaoGeral(input: AvaliacaoGeralInput): AvaliacaoGeralOutput {
    const pesos = PESOS_AVALIACAO.PADRAO;

    const scoreProporcoes = calcularScoreProporcoes(input.proporcoes, input.proporcoes.metodo);
    const scoreComposicao = calcularScoreComposicao(input.composicao);
    const scoreSimetria = calcularScoreSimetria(input.assimetrias);

    const contribuicaoProporcoes = scoreProporcoes.score * pesos.proporcoes;
    const contribuicaoComposicao = scoreComposicao.score * pesos.composicao;
    const contribuicaoSimetria = scoreSimetria.score * pesos.simetria;

    const avaliacaoGeral = contribuicaoProporcoes + contribuicaoComposicao + contribuicaoSimetria;
    const classificacao = classificarAvaliacao(avaliacaoGeral);
    const insights = gerarInsights(scoreProporcoes, scoreComposicao, scoreSimetria);

    return {
        avaliacaoGeral: Math.round(avaliacaoGeral * 10) / 10,
        classificacao,
        scores: {
            proporcoes: {
                valor: scoreProporcoes.score,
                peso: pesos.proporcoes,
                contribuicao: Math.round(contribuicaoProporcoes * 10) / 10,
                detalhes: scoreProporcoes,
            },
            composicao: {
                valor: scoreComposicao.score,
                peso: pesos.composicao,
                contribuicao: Math.round(contribuicaoComposicao * 10) / 10,
                detalhes: scoreComposicao,
            },
            simetria: {
                valor: scoreSimetria.score,
                peso: pesos.simetria,
                contribuicao: Math.round(contribuicaoSimetria * 10) / 10,
                detalhes: scoreSimetria,
            },
        },
        insights,
    };
}
