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

/**
 * v1.2: Cálculo para proporções inversas (cintura)
 * Se atual < ideal → Bom (100% ou mais)
 * Se atual > ideal → Ruim (penalização 2x por cada 1% acima)
 */
function calcularPercentualProporcaoInversa(indiceAtual: number, indiceIdeal: number): number {
    if (indiceAtual <= 0 || indiceIdeal <= 0) return 0;

    // Cintura MENOR ou IGUAL ao ideal = ÓTIMO (Bônus até 110%)
    if (indiceAtual <= indiceIdeal) {
        const bonus = (indiceIdeal - indiceAtual) / indiceIdeal;
        return Math.min(110, 100 + (bonus * 50));
    }

    // v1.2: Cintura MAIOR que o ideal = RUIM
    // Cada 1% acima do ideal = -2.0% no score (mais agressivo que v1.1)
    const excessoPercent = ((indiceAtual - indiceIdeal) / indiceIdeal) * 100;
    const penalidade = excessoPercent * 2.0;

    return Math.max(0, 100 - penalidade);
}

/**
 * v1.2: Multiplicador V-Taper — penalização mais agressiva
 * V-Taper é O pilar central do físico. 1.30 (ombros mal passam da cintura) = -18%
 */
function calcularMultiplicadorVTaper(vTaperAtual: number): number {
    if (vTaperAtual >= 1.55) return 1.00;   // Excelente
    if (vTaperAtual >= 1.45) return 0.96;   // Bom
    if (vTaperAtual >= 1.35) return 0.90;   // Regular
    if (vTaperAtual >= 1.25) return 0.82;   // Fraco
    if (vTaperAtual >= 1.15) return 0.70;   // Ruim
    return 0.55;                             // Péssimo (< 1.15)
}

/**
 * v1.2: Penalização por cintura absoluta (saúde e estética)
 * Referência OMS: >94cm masculino = risco aumentado
 */
function penalizacaoCinturaAbsoluta(cinturaCm: number, genero: 'MALE' | 'FEMALE'): number {
    if (cinturaCm <= 0) return 1.0;

    if (genero === 'MALE') {
        if (cinturaCm <= 78) return 1.00;   // Atlético ideal
        if (cinturaCm <= 84) return 0.98;   // Bom
        if (cinturaCm <= 90) return 0.95;   // Aceitável
        if (cinturaCm <= 95) return 0.86;   // Atenção (OMS: >94 = risco)
        if (cinturaCm <= 102) return 0.82;  // Acima
        if (cinturaCm <= 110) return 0.72;  // Alto risco
        return 0.60;
    } else {
        if (cinturaCm <= 65) return 1.00;
        if (cinturaCm <= 72) return 0.98;
        if (cinturaCm <= 78) return 0.95;
        if (cinturaCm <= 85) return 0.90;
        if (cinturaCm <= 92) return 0.82;
        if (cinturaCm <= 100) return 0.72;
        return 0.60;
    }
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

    // v1.1: Calcular multiplicador V-Taper primeiro
    const vTaperAtual = proporcoes.vTaper?.indiceAtual || 0;
    const multiplicadorVTaper = calcularMultiplicadorVTaper(vTaperAtual);

    for (const [prop, peso] of Object.entries(pesos)) {
        if (peso === 0) continue;

        const key = prop as keyof typeof proporcoes;
        const dados = proporcoes[key];

        if (!dados) continue;

        let percentual: number;

        if (prop === 'triade') {
            percentual = (dados as TriadeData).harmoniaPercentual;
        } else if (prop === 'cintura') {
            // v1.1: Tratamento especial para proporções INVERSAS (cintura)
            percentual = calcularPercentualProporcaoInversa(
                (dados as ProportionData).indiceAtual,
                (dados as ProportionData).indiceMeta
            );
        } else {
            // v1.1: Permitir valores até 115% para que a régua mostre o status Freak adequadamente
            // O clamping visual será feito no componente ScaleRuler
            percentual = Math.min(115, (dados as ProportionData).percentualDoIdeal);
        }

        const contribuicao = (percentual * peso) / 100;
        scoreAcumulado += contribuicao;
        pesoAcumulado += peso;

        detalhes.push({
            proporcao: prop,
            peso,
            percentualDoIdeal: percentual,
            contribuicao,
            valor: prop === 'triade'
                ? (dados as TriadeData).harmoniaPercentual
                : (dados as ProportionData).indiceAtual
        });
    }

    // Score base
    let scoreFinal = pesoAcumulado > 0 ? (scoreAcumulado / pesoAcumulado) * 100 : 0;

    // v1.1: Aplicar multiplicador de V-Taper
    scoreFinal = scoreFinal * multiplicadorVTaper;

    const sorted = [...detalhes].sort((a, b) => b.percentualDoIdeal - a.percentualDoIdeal);

    return {
        score: Math.round(Math.max(0, Math.min(100, scoreFinal)) * 10) / 10,
        detalhes,
        proporcaoMaisForte: sorted.length > 0 ? sorted[0].proporcao : '',
        proporcaoMaisFraca: sorted.length > 0 ? sorted[sorted.length - 1].proporcao : '',
        multiplicadorVTaper,
    };
}

// ═══════════════════════════════════════════════════════════
// 2. COMPOSITION SCORE CALCULATION
// ═══════════════════════════════════════════════════════════

function calcularScoreBF(bf: number, genero: 'MALE' | 'FEMALE'): number {
    // v1.1: Faixas de BF com penalização mais agressiva conforme SPEC
    const faixas = genero === 'MALE' ? {
        muitoBaixo: { max: 4, score: 85 },
        competicao: { min: 4, max: 8, scoreMin: 95, scoreMax: 100 },
        atletico: { min: 8, max: 14, scoreMin: 80, scoreMax: 95 },
        fitness: { min: 14, max: 18, scoreMin: 65, scoreMax: 80 },
        normal: { min: 18, max: 24, scoreMin: 45, scoreMax: 65 },
        acima: { min: 24, max: 30, scoreMin: 25, scoreMax: 45 },
        obesidade: { min: 30, max: 40, scoreMin: 10, scoreMax: 25 },
        obesidadeSevera: { min: 40, max: 100, score: 5 },
    } : {
        muitoBaixo: { max: 10, score: 85 },
        competicao: { min: 10, max: 15, scoreMin: 95, scoreMax: 100 },
        atletico: { min: 15, max: 22, scoreMin: 80, scoreMax: 95 },
        fitness: { min: 22, max: 27, scoreMin: 65, scoreMax: 80 },
        normal: { min: 27, max: 32, scoreMin: 45, scoreMax: 65 },
        acima: { min: 32, max: 38, scoreMin: 25, scoreMax: 45 },
        obesidade: { min: 38, max: 45, scoreMin: 10, scoreMax: 25 },
        obesidadeSevera: { min: 45, max: 100, score: 5 },
    };

    if (bf < faixas.muitoBaixo.max) return faixas.muitoBaixo.score;

    for (const [key, config] of Object.entries(faixas)) {
        if (key === 'muitoBaixo' || key === 'obesidadeSevera') continue;

        const { min, max, scoreMin, scoreMax } = config as any;
        if (bf >= min && bf < max) {
            // v1.1: Interpolação linear dentro da faixa (scoreMax em min, scoreMin em max)
            return interpolate(bf, min, max, scoreMax, scoreMin);
        }
    }

    if (bf >= faixas.obesidadeSevera.min) return faixas.obesidadeSevera.score;

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
    let scoreFFMI = calcularScoreFFMI(ffmi, genero);

    // v1.1: Se BF > 20%, penalizar FFMI (massa magra pode estar inflada ou retida)
    if (bf > 20) {
        const penalidade = Math.min(30, (bf - 20) * 1.5);
        scoreFFMI = Math.max(40, scoreFFMI - penalidade);
    }

    const scorePesoRelativoResult = calcularScorePesoRelativo(pesoMagro, altura, genero);
    let scorePesoRelativo = scorePesoRelativoResult;

    // v1.1: Se BF > 25%, não dar crédito total por peso relativo alto (provavelmente excesso de gordura)
    if (bf > 25) {
        scorePesoRelativo = Math.min(60, scorePesoRelativo);
    }

    const scoreTotal =
        (scoreBF * PESOS_COMPOSICAO.bf) +
        (scoreFFMI * PESOS_COMPOSICAO.ffmi) +
        (scorePesoRelativo * PESOS_COMPOSICAO.pesoRelativo);

    const classificacaoBF = scoreBF < 25 ? 'OBESIDADE' : scoreBF < 45 ? 'ACIMA_MEDIA' : scoreBF < 80 ? 'NORMAL' : 'ATLETA';

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
    // v1.2: Calibração mais realista — assimetrias moderadas impactam mais o score
    if (diferencaPercent < 1.0) return { score: 100, status: 'SIMETRICO' };
    if (diferencaPercent < 2.0) return { score: 90, status: 'QUASE_SIMETRICO' };
    if (diferencaPercent < 3.5) return { score: 75, status: 'LEVE_ASSIMETRIA' };
    if (diferencaPercent < 5.0) return { score: 60, status: 'ASSIMETRIA_MODERADA' };
    if (diferencaPercent < 8.0) return { score: 40, status: 'ASSIMETRIA' };
    if (diferencaPercent < 12.0) return { score: 25, status: 'ASSIMETRIA_SEVERA' };
    return { score: 10, status: 'ASSIMETRIA_CRITICA' };
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
    // v1.2: Tabela de classificação
    const CLASSIFICACOES = [
        { min: 90, nivel: 'ELITE', emoji: '👑', cor: '#FFD700', descricao: 'Físico excepcional - nível competitivo' },
        { min: 80, nivel: 'AVANÇADO', emoji: '🥇', cor: '#10B981', descricao: 'Muito acima da média' },
        { min: 70, nivel: 'ATLÉTICO', emoji: '💪', cor: '#3B82F6', descricao: 'Físico atlético bem desenvolvido' },
        { min: 60, nivel: 'INTERMEDIÁRIO', emoji: '🏃', cor: '#8B5CF6', descricao: 'Bom desenvolvimento geral' },
        { min: 50, nivel: 'INICIANTE', emoji: '🌱', cor: '#F59E0B', descricao: 'Em desenvolvimento' },
        { min: 0, nivel: 'COMEÇANDO', emoji: '🚀', cor: '#6B7280', descricao: 'Início da jornada' },
    ];

    for (const c of CLASSIFICACOES) {
        if (score >= c.min) {
            return {
                nivel: c.nivel,
                emoji: c.emoji,
                cor: c.cor,
                descricao: c.descricao,
            };
        }
    }
    return CLASSIFICACOES[CLASSIFICACOES.length - 1];
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
            acao: bf > 20 ? `Foque na redução de gordura (cutting). Reduza para ${targetBf}% para melhorar sua estética.` : `Mantenha a recomposição corporal.`
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
            acao: `Dê prioridade para ${proporcoes.proporcaoMaisFraca} no treino para equilibrar o físico.`
        };
    }

    return {
        pontoForte: {
            categoria: pontoForte.categoria,
            valor: pontoForte.valor,
            mensagem: `Seu ponto forte é ${pontoForte.categoria} (${pontoForte.valor} pts).`
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

    // 1. Calcular scores individuais
    const scoreProporcoes = calcularScoreProporcoes(input.proporcoes, input.proporcoes.metodo);
    const scoreComposicao = calcularScoreComposicao(input.composicao);
    const scoreSimetria = calcularScoreSimetria(input.assimetrias);

    // 2. Cálculo base (ponderado)
    const contribuicaoProporcoes = scoreProporcoes.score * pesos.proporcoes;
    const contribuicaoComposicao = scoreComposicao.score * pesos.composicao;
    const contribuicaoSimetria = scoreSimetria.score * pesos.simetria;

    let avaliacaoBase = contribuicaoProporcoes + contribuicaoComposicao + contribuicaoSimetria;

    // 3. v1.1: Penalização por cintura absoluta
    const penalizacaoCinturaVal = penalizacaoCinturaAbsoluta(
        input.composicao.cintura || 0,
        input.composicao.genero
    );

    const avaliacaoFinal = avaliacaoBase * penalizacaoCinturaVal;

    // 4. Classificar e gerar insights
    const classificacao = classificarAvaliacao(avaliacaoFinal);
    const insights = gerarInsights(scoreProporcoes, scoreComposicao, scoreSimetria);

    return {
        avaliacaoGeral: Math.round(avaliacaoFinal * 10) / 10,
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
        penalizacoes: {
            vTaper: scoreProporcoes.multiplicadorVTaper || 1.0,
            cintura: penalizacaoCinturaVal
        },
        insights,
    };
}
