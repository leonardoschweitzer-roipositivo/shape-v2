import type {
    Measurements,
    IdealMeasurements,
    ProportionItem,
    ComparisonMode
} from '../types';
import {
    METAS_FEMININAS
} from '@/services/calculations';

// Helper function to get status label
const getStatus = (percentual: number): string => {
    if (percentual >= 103) return 'ELITE';
    if (percentual >= 97) return 'META';
    if (percentual >= 90) return 'QUASE LÁ';
    if (percentual >= 82) return 'CAMINHO';
    return 'INÍCIO';
};

// Helper function to get method label
const getMethodLabel = (mode: ComparisonMode): string => {
    switch (mode) {
        case 'female_golden': return 'Golden Ratio ♀';
        case 'bikini': return 'Bikini';
        case 'wellness': return 'Wellness';
        case 'figure': return 'Figure';
        case 'womens_physique': return "Women's Physique";
        case 'womens_bodybuilding': return "Women's BB";
        default: return 'Padrão';
    }
};

/**
 * Generates proportion items configuration for female athletes based on SPEC v1.0
 */
export const getFemaleProportionItems = (
    userMeasurements: Measurements,
    ideais: IdealMeasurements,
    comparisonMode: ComparisonMode
): ProportionItem[] => {

    const methodLabel = getMethodLabel(comparisonMode);

    // Determine category key for METAS_FEMININAS
    const cat = comparisonMode === 'female_golden' ? 'golden_ratio' :
        comparisonMode as keyof typeof METAS_FEMININAS.whr;

    // Helper for percent calculation (v1.1 logic)
    const getRatioPercent = (current: number, target: number, inverse = false) => {
        if (!target || target <= 0) return 0;
        if (inverse) {
            if (current <= target) {
                const bonus = (target - current) / target;
                return Math.min(110, 100 + (bonus * 50));
            }
            const excessoPercent = ((current - target) / target) * 100;
            return Math.max(0, 100 - (excessoPercent * 1.5));
        }
        return Math.min(115, (current / target) * 100);
    };

    // 1. WHR (Waist-to-Hip Ratio)
    const whrAtual = userMeasurements.cintura / userMeasurements.quadril;
    const whrTarget = METAS_FEMININAS.whr[cat];
    const whrPercentual = getRatioPercent(whrAtual, whrTarget, true);

    // 2. Ampulheta (Harmonia Index)
    const bustoCinturaRatio = (userMeasurements.busto || userMeasurements.peito) / userMeasurements.cintura;
    const quadrilCinturaRatio = userMeasurements.quadril / userMeasurements.cintura;
    const bustoQuadrilRatio = (userMeasurements.busto || userMeasurements.peito) / userMeasurements.quadril;

    const idealBC = METAS_FEMININAS.bustoCintura[cat];
    const idealQC = METAS_FEMININAS.quadrilCintura[cat];
    const idealBQ = METAS_FEMININAS.bustoQuadril[cat];

    const desvioBC = Math.abs(bustoCinturaRatio - idealBC) / idealBC;
    const desvioQC = Math.abs(quadrilCinturaRatio - idealQC) / idealQC;
    const desvioBQ = Math.abs(bustoQuadrilRatio - idealBQ) / idealBQ;

    const hgScore = Math.max(0, Math.min(100, (1 - ((desvioBC * 0.3) + (desvioQC * 0.4) + (desvioBQ * 0.3))) * 100));

    // 3. Shoulder-Hip Ratio
    const shrAtual = userMeasurements.ombros / userMeasurements.quadril;
    const shrTarget = METAS_FEMININAS.ombrosQuadril[cat];
    const shrPercentual = getRatioPercent(shrAtual, shrTarget);

    // 4. Proporção de Braço (Antebraço ÷ Braço)
    const brRatioAtual = userMeasurements.antebraco / userMeasurements.braco;
    const brRatioTarget = METAS_FEMININAS.antebracoBraco[cat];
    const brRatioPercentual = getRatioPercent(brRatioAtual, brRatioTarget);

    // 5. Hip-Thigh Ratio (Coxa ÷ Quadril)
    const htrAtual = userMeasurements.coxa / userMeasurements.quadril;
    const htrTarget = METAS_FEMININAS.coxaQuadril[cat];
    const htrPercentual = getRatioPercent(htrAtual, htrTarget);

    // 6. Desenvolvimento de Coxa (Coxa ÷ Joelho)
    const cjAtual = userMeasurements.coxa / userMeasurements.joelho;
    const cjTarget = METAS_FEMININAS.coxaJoelho[cat];
    const cjPercentual = getRatioPercent(cjAtual, cjTarget);

    // 7. Proporção de Perna (Coxa ÷ Panturrilha)
    const cpAtual = userMeasurements.coxa / userMeasurements.panturrilha;
    const cpTarget = METAS_FEMININAS.coxaPanturrilha[cat];
    const cpPercentual = getRatioPercent(cpAtual, cpTarget);

    // 8. Desenvolvimento de Panturrilha (Panturrilha ÷ Tornozelo)
    const ptAtual = userMeasurements.panturrilha / userMeasurements.tornozelo;
    const ptTarget = METAS_FEMININAS.panturrilhaTornozelo[cat];
    const ptPercentual = getRatioPercent(ptAtual, ptTarget);

    return [
        // 1. WHR
        {
            card: {
                title: "WHR (Waist-Hip Ratio)",
                badge: "MÉTRICA #1",
                metrics: [
                    { label: 'Ratio Atual', value: whrAtual.toFixed(2) },
                    { label: 'Meta', value: whrTarget.toFixed(2) }
                ],
                currentValue: whrAtual.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: `Relação cintura-quadril. A base da silhueta feminina. Meta para ${methodLabel}: ${whrTarget}.`,
                statusLabel: getStatus(whrPercentual),
                userPosition: Math.round(whrPercentual),
                goalPosition: 100,
                image: "/images/widgets/Cintura_x_Quadril.jpg",
                rawImage: true,
                measurementsUsed: ['Cintura', 'Quadril']
            },
            ai: {
                strength: whrPercentual >= 90 ? `Excelente linha de cintura para o padrão ${methodLabel}.` : undefined,
                suggestion: "Foque no controle da circunferência abdominal e desenvolvimento lateral de glúteos."
            }
        },
        // 2. Ampulheta
        {
            card: {
                title: "Ampulheta",
                badge: "HARMONIA X-SHAPE",
                metrics: [
                    { label: 'Harmonia', value: `${hgScore.toFixed(1)}%` }
                ],
                currentValue: hgScore.toFixed(0),
                valueUnit: "%",
                valueLabel: "SCORE HARMONIA",
                description: "Equilíbrio entre Busto, Cintura e Quadril. Mede a simetria lateral absoluta.",
                statusLabel: getStatus(hgScore),
                userPosition: Math.round(hgScore),
                goalPosition: 100,
                image: "/images/widgets/Busto_vs_Cintura_vs_Quadril.jpg",
                rawImage: true,
                measurementsUsed: ['Busto', 'Cintura', 'Quadril']
            },
            ai: {
                strength: hgScore >= 95 ? "Simetria de ampulheta perfeita encontrada." : undefined,
                suggestion: "Busque equilibrar o desenvolvimento dos dorsais com o volume dos glúteos."
            }
        },
        // 3. Shoulder-Hip Ratio
        {
            card: {
                title: "Shoulder-Hip Ratio",
                badge: "EQUILÍBRIO SUPERIOR",
                metrics: [
                    { label: 'Ratio Atual', value: shrAtual.toFixed(2) },
                    { label: 'Meta', value: shrTarget.toFixed(2) }
                ],
                currentValue: shrAtual.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: `Proporção entre ombros e quadril. Define o "flow" do tronco para as pernas.`,
                statusLabel: getStatus(shrPercentual),
                userPosition: Math.round(shrPercentual),
                goalPosition: 100,
                image: "/images/widgets/Ombros_vs_Quadril.jpg",
                rawImage: true,
                measurementsUsed: ['Ombros', 'Quadril']
            },
            ai: {
                suggestion: "Elevações laterais ajudam a equilibrar ombros com um quadril mais largo."
            }
        },
        // 4. Proporção de Braço
        {
            card: {
                title: "Proporção de Braço",
                badge: "MEMBROS SUPERIORES",
                metrics: [
                    { label: 'Ratio Atual', value: brRatioAtual.toFixed(2) },
                    { label: 'Meta', value: brRatioTarget.toFixed(2) }
                ],
                currentValue: brRatioAtual.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: `Desenvolvimento harmônico entre braço e antebraço. Meta: ${brRatioTarget}.`,
                statusLabel: getStatus(brRatioPercentual),
                userPosition: Math.round(brRatioPercentual),
                goalPosition: 100,
                image: "/images/widgets/Braco_vs_Antebraco.jpg",
                rawImage: true,
                measurementsUsed: ['Braço', 'Antebraço']
            },
            ai: {
                suggestion: "Rosca martelo e extensões de punho para melhorar a densidade dos antebraços."
            }
        },
        // 5. Hip-Thigh Ratio
        {
            card: {
                title: "Hip-Thigh Ratio",
                badge: "TRANSIÇÃO INFERIOR",
                metrics: [
                    { label: 'Ratio Atual', value: htrAtual.toFixed(2) },
                    { label: 'Meta', value: htrTarget.toFixed(2) }
                ],
                currentValue: htrAtual.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: "Proporção entre coxa e quadril. Crucial para as categorias Wellness e Bikini.",
                statusLabel: getStatus(htrPercentual),
                userPosition: Math.round(htrPercentual),
                goalPosition: 100,
                image: "/images/widgets/Quadril_vs_Coxa.jpg",
                rawImage: true,
                measurementsUsed: ['Coxa', 'Quadril']
            },
            ai: {
                strength: cat === 'wellness' && htrPercentual >= 90 ? "Volume de coxa dominante compatível com Wellness." : undefined,
                suggestion: "Foque em glúteo médio para preencher a lateral do quadril."
            }
        },
        // 6. Desenvolvimento de Coxa
        {
            card: {
                title: "Desenvolvimento de Coxa",
                badge: "POTÊNCIA MUSCULAR",
                metrics: [
                    { label: 'Ratio Atual', value: cjAtual.toFixed(2) },
                    { label: 'Meta', value: cjTarget.toFixed(2) }
                ],
                currentValue: cjAtual.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: "Volume muscular da coxa relativo à estrutura óssea do joelho.",
                statusLabel: getStatus(cjPercentual),
                userPosition: Math.round(cjPercentual),
                goalPosition: 100,
                image: "/images/widgets/Coxa_vs_Joelho.jpg",
                rawImage: true,
                measurementsUsed: ['Coxa', 'Joelho']
            },
            ai: {
                suggestion: "Agachamento hack e extensora para isolar o quadríceps."
            }
        },
        // 7. Proporção de Perna
        {
            card: {
                title: "Proporção de Perna",
                badge: "SIMETRIA INFERIOR",
                metrics: [
                    { label: 'Ratio Atual', value: cpAtual.toFixed(2) },
                    { label: 'Meta', value: cpTarget.toFixed(2) }
                ],
                currentValue: cpAtual.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: "Equilíbrio visual entre coxa e panturrilha.",
                statusLabel: getStatus(cpPercentual),
                userPosition: Math.round(cpPercentual),
                goalPosition: 100,
                image: "/images/widgets/Coxa_vs_Panturrilha.jpg",
                rawImage: true,
                measurementsUsed: ['Coxa', 'Panturrilha']
            },
            ai: {
                suggestion: "O equilíbrio aqui define o 'flow' das pernas em poses de frente."
            }
        },
        // 8. Desenvolvimento de Panturrilha
        {
            card: {
                title: "Desenvolvimento de Panturrilha",
                badge: "DETALHAMENTO FINAL",
                metrics: [
                    { label: 'Ratio Atual', value: ptAtual.toFixed(2) },
                    { label: 'Meta', value: ptTarget.toFixed(2) }
                ],
                currentValue: ptAtual.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: "Desenvolvimento muscular da panturrilha relativo ao tornozelo.",
                statusLabel: getStatus(ptPercentual),
                userPosition: Math.round(ptPercentual),
                goalPosition: 100,
                image: "/images/widgets/Panturrilha_vs_Tornozelo.jpg",
                rawImage: true,
                measurementsUsed: ['Panturrilha', 'Tornozelo']
            },
            ai: {
                suggestion: "Trabalhe panturrilhas em pé e sentado para atingir gastrocnêmio e sóleo."
            }
        }
    ];
};
