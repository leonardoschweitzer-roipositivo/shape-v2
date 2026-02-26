import { MeasurementHistory } from '@/mocks/personal';
import { AvaliacaoGeralInput, AvaliacaoGeralOutput } from '@/types/assessment';
import { calcularAvaliacaoGeral } from './assessment';

/**
 * Maps a MeasurementHistory object to AvaliacaoGeralInput
 */
export function mapMeasurementToInput(
    assessment: MeasurementHistory,
    gender: 'MALE' | 'FEMALE' = 'MALE'
): AvaliacaoGeralInput {
    const m = assessment.measurements;
    const { weight, waist, neck, hips } = m;
    // Safeguard: se altura veio em metros (< 3), converter para cm
    const height = m.height > 0 && m.height < 3 ? Math.round(m.height * 100) : m.height;

    // U.S. Navy Method — Hodgdon & Beckett (Metric/cm)
    // Uses body density equation, NOT the linear approximation (which is for inches)
    let bf = 0;
    if (gender === 'MALE') {
        bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    } else {
        bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + (hips || waist) - neck) + 0.22100 * Math.log10(height)) - 450;
    }

    bf = Math.max(2, Math.min(60, bf)); // Clamp entre 2% e 60%
    const fatMass = weight * (bf / 100);
    const leanMass = weight - fatMass;

    const getRatioPercent = (current: number, target: number, inverse = false) => {
        if (!target || !current) return 0;
        if (inverse) return current <= target ? 100 : Math.round(Math.max(0, (target / current) * 100) * 10) / 10;
        return Math.round(Math.min(100, (current / target) * 100) * 10) / 10;
    };

    const punho = (m.wristLeft + m.wristRight) / 2 || 17;
    const joelho = (m.kneeLeft + m.kneeRight) / 2 || 40;
    const tornozelo = (m.ankleLeft + m.ankleRight) / 2 || 22;
    const bracoMedio = (m.armLeft + m.armRight) / 2;
    const pantMedio = (m.calfLeft + m.calfRight) / 2;
    const coxaMedia = (m.thighLeft + m.thighRight) / 2;

    const vTaperAtual = m.shoulders / m.waist;
    const vTaperMeta = 1.618;
    const vTaperScore = getRatioPercent(vTaperAtual, vTaperMeta);

    const peitoRatio = m.chest / punho;
    const peitoMeta = 6.5;
    const peitoScore = getRatioPercent(peitoRatio, peitoMeta);

    const bracoRatio = bracoMedio / punho;
    const bracoMeta = 2.5;
    const bracoScore = getRatioPercent(bracoRatio, bracoMeta);

    const cinturaRatio = m.waist / height;
    const cinturaMeta = 0.45;
    const cinturaScore = getRatioPercent(cinturaRatio, cinturaMeta, true);

    const triadeMedia = (bracoMedio + pantMedio + neck) / 3;
    const triadeDesvio = (Math.abs(bracoMedio - triadeMedia) + Math.abs(pantMedio - triadeMedia) + Math.abs(neck - triadeMedia)) / triadeMedia / 3;
    const triadeScore = Math.max(0, Math.round((1 - triadeDesvio) * 100 * 10) / 10);

    return {
        proporcoes: {
            metodo: 'golden',
            vTaper: { indiceAtual: vTaperAtual, indiceMeta: vTaperMeta, percentualDoIdeal: vTaperScore, classificacao: 'NORMAL' },
            peitoral: { indiceAtual: peitoRatio, indiceMeta: peitoMeta, percentualDoIdeal: peitoScore, classificacao: 'NORMAL' },
            braco: { indiceAtual: bracoRatio, indiceMeta: bracoMeta, percentualDoIdeal: bracoScore, classificacao: 'NORMAL' },
            antebraco: { indiceAtual: (m.forearmLeft + m.forearmRight) / 2 / bracoMedio, indiceMeta: 0.8, percentualDoIdeal: getRatioPercent((m.forearmLeft + m.forearmRight) / 2 / bracoMedio, 0.8), classificacao: 'NORMAL' },
            triade: { harmoniaPercentual: triadeScore, pescoco: neck, braco: bracoMedio, panturrilha: pantMedio },
            cintura: { indiceAtual: cinturaRatio, indiceMeta: cinturaMeta, percentualDoIdeal: cinturaScore, classificacao: 'NORMAL' },
            coxa: { indiceAtual: coxaMedia / joelho, indiceMeta: 1.75, percentualDoIdeal: getRatioPercent(coxaMedia / joelho, 1.75), classificacao: 'NORMAL' },
            coxaPanturrilha: { indiceAtual: coxaMedia / pantMedio, indiceMeta: 1.5, percentualDoIdeal: getRatioPercent(coxaMedia / pantMedio, 1.5), classificacao: 'NORMAL' },
            panturrilha: { indiceAtual: pantMedio / tornozelo, indiceMeta: 1.9, percentualDoIdeal: getRatioPercent(pantMedio / tornozelo, 1.9), classificacao: 'NORMAL' },
        },
        composicao: {
            peso: weight,
            altura: height,
            idade: 30, // Mock age
            genero: gender,
            bf,
            metodo_bf: 'NAVY',
            pesoMagro: leanMass,
            pesoGordo: fatMass,
            cintura: waist,
        },
        assimetrias: {
            braco: { esquerdo: m.armLeft, direito: m.armRight, diferenca: Math.abs(m.armLeft - m.armRight), diferencaPercentual: (Math.abs(m.armLeft - m.armRight) / ((m.armLeft + m.armRight) / 2)) * 100, status: 'SIMETRICO' },
            antebraco: { esquerdo: m.forearmLeft, direito: m.forearmRight, diferenca: Math.abs(m.forearmLeft - m.forearmRight), diferencaPercentual: (Math.abs(m.forearmLeft - m.forearmRight) / ((m.forearmLeft + m.forearmRight) / 2)) * 100, status: 'SIMETRICO' },
            coxa: { esquerdo: m.thighLeft, direito: m.thighRight, diferenca: Math.abs(m.thighLeft - m.thighRight), diferencaPercentual: (Math.abs(m.thighLeft - m.thighRight) / ((m.thighLeft + m.thighRight) / 2)) * 100, status: 'SIMETRICO' },
            panturrilha: { esquerdo: m.calfLeft, direito: m.calfRight, diferenca: Math.abs(m.calfLeft - m.calfRight), diferencaPercentual: (Math.abs(m.calfLeft - m.calfRight) / ((m.calfLeft + m.calfRight) / 2)) * 100, status: 'SIMETRICO' },
        }
    };
}

/**
 * Process history to get evolution results
 */
export function processEvolutionHistory(
    history: MeasurementHistory[],
    gender: 'MALE' | 'FEMALE' = 'MALE'
) {
    if (!history || history.length === 0) return null;

    // Sort by date ascending for processing
    const sortedHistory = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const processedPoints = sortedHistory.map(h => {
        const input = mapMeasurementToInput(h, gender);
        const output = calcularAvaliacaoGeral(input);
        return {
            date: h.date,
            input,
            output,
            measurements: h.measurements
        };
    });

    // Comparison summary (first vs last)
    const first = processedPoints[0];
    const last = processedPoints[processedPoints.length - 1];

    const kpis = {
        ratio: {
            label: gender === 'MALE' ? 'SHAPE-V RATIO' : 'WAIST-HIP RATIO',
            startValue: first.output.scores.proporcoes.detalhes.detalhes.find(d => d.proporcao === 'vTaper' || d.proporcao === 'cintura')?.percentualDoIdeal || 0, // Fallback
            endValue: last.output.scores.proporcoes.detalhes.detalhes.find(d => d.proporcao === 'vTaper' || d.proporcao === 'cintura')?.percentualDoIdeal || 0,
            startRatio: gender === 'MALE' ? (first.measurements.shoulders / first.measurements.waist) : (first.measurements.waist / first.measurements.hips),
            endRatio: gender === 'MALE' ? (last.measurements.shoulders / last.measurements.waist) : (last.measurements.waist / last.measurements.hips),
        },
        score: {
            label: 'SCORE GERAL',
            startValue: first.output.avaliacaoGeral,
            endValue: last.output.avaliacaoGeral,
            change: last.output.avaliacaoGeral - first.output.avaliacaoGeral,
            status: last.output.avaliacaoGeral >= first.output.avaliacaoGeral ? 'positive' : 'warning'
        },
    };

    // Calculate best and worst evolution
    // Compare each metric in ProporcaoDetalhe
    const allMetrics = last.output.scores.proporcoes.detalhes.detalhes.map(d => d.proporcao);
    let bestMetric = '';
    let bestChange = -Infinity;
    let worstMetric = '';
    let worstChange = Infinity;

    allMetrics.forEach(m => {
        const startVal = first.output.scores.proporcoes.detalhes.detalhes.find(d => d.proporcao === m)?.percentualDoIdeal || 0;
        const endVal = last.output.scores.proporcoes.detalhes.detalhes.find(d => d.proporcao === m)?.percentualDoIdeal || 0;
        const change = endVal - startVal;

        if (change > bestChange) {
            bestChange = change;
            bestMetric = m;
        }

        if (change < worstChange) {
            worstChange = change;
            worstMetric = m;
        }
    });

    return {
        points: processedPoints,
        summary: {
            kpis,
            bestEvolution: {
                metric: bestMetric,
                change: bestChange
            },
            attentionEvolution: {
                metric: worstMetric,
                change: worstChange
            },
            period: {
                start: new Date(first.date),
                end: new Date(last.date),
                label: `${processedPoints.length} avaliações`
            }
        }
    };
}
