import type {
    Measurements,
    IdealMeasurements,
    ProportionItem,
    ComparisonMode
} from '../types';
import {
    METAS_FEMININAS
} from '@/services/calculations';

// ─── Helper: Status label ───────────────────────────────────
const getStatus = (percentual: number): string => {
    if (percentual >= 103) return 'ELITE';
    if (percentual >= 97) return 'META';
    if (percentual >= 90) return 'QUASE LÁ';
    if (percentual >= 82) return 'CAMINHO';
    return 'INÍCIO';
};

// ─── Helper: Method label ───────────────────────────────────
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

// ─── Helper: Monthly growth rates (cm/month, realistic for female) ──
const GROWTH_RATES: Record<string, number> = {
    ombros: 0.2,
    peito: 0.15,
    costas: 0.2,
    braco: 0.1,
    antebraco: 0.06,
    coxa: 0.2,
    panturrilha: 0.06,
    cintura: 0.25,
    quadril: 0.15,
    pescoco: 0.03,
};

/** Calculate realistic 12-month cm target */
const calc12m = (currentCm: number, idealCm: number, part: string): number => {
    const rate = GROWTH_RATES[part] || 0.1;
    const gap = idealCm - currentCm;
    if (Math.abs(gap) < 0.3) return Math.round(currentCm * 10) / 10;
    const maxChange = rate * 12;
    const change = Math.sign(gap) * Math.min(Math.abs(gap), maxChange);
    return Math.round((currentCm + change) * 10) / 10;
};

/**
 * Baselines realistas para cada tipo de ratio feminino (valor médio destreinada).
 */
const RATIO_BASELINES = {
    shr: 0.85,           // ombros/quadril destreinada
    braco: 0.55,         // antebraco/braco destreinada
    hipThigh: 0.40,      // coxa/quadril destreinada
    coxaJoelho: 1.2,     // coxa/joelho destreinada
    coxaPant: 1.2,       // coxa/panturrilha destreinada
    pantTorn: 1.3,       // panturrilha/tornozelo destreinada
};

/** Generate calibrated analysis text using realistic baseline range */
const makeAnalysis = (currentRatio: number, targetRatio: number, baseline: number): string => {
    const range = targetRatio - baseline;
    const progress = currentRatio - baseline;
    const calibratedPct = range > 0
        ? Math.max(0, Math.min(120, (progress / range) * 100))
        : 100;
    const p = Math.round(calibratedPct);
    const ratioStr = currentRatio.toFixed(2);
    const target = targetRatio.toFixed(2);

    if (p >= 100) return `Ratio <span class='text-primary font-bold'>${ratioStr}</span> — acima da meta (${target}). Nível de elite.`;
    if (p >= 85) return `Ratio <span class='text-primary font-bold'>${ratioStr}</span> — ${p}% da meta (${target}). Muito próxima do ideal.`;
    if (p >= 65) return `Ratio <span class='text-primary font-bold'>${ratioStr}</span> — ${p}% da meta (${target}). Boa base construída.`;
    if (p >= 40) return `Ratio <span class='text-primary font-bold'>${ratioStr}</span> — ${p}% da meta (${target}). Evolução consistente possível.`;
    if (p >= 20) return `Ratio <span class='text-primary font-bold'>${ratioStr}</span> — ${p}% da meta (${target}). Estágio de desenvolvimento.`;
    return `Ratio <span class='text-primary font-bold'>${ratioStr}</span> — ${p}% da meta (${target}). Prioridade de desenvolvimento.`;
};

/** Format cm value */
const cm = (v: number) => v.toFixed(1);

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

    // ─── Ratio Calculations ──────────────────────────────────

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

    // ─── 12-Month Realistic Targets ──────────────────────────

    const cintura12m = calc12m(userMeasurements.cintura, ideais.cintura, 'cintura');
    const quadril12m = ideais.quadril ? calc12m(userMeasurements.quadril, ideais.quadril, 'quadril') : userMeasurements.quadril;
    const whr12m = (cintura12m / quadril12m).toFixed(2);

    const busto = userMeasurements.busto || userMeasurements.peito;
    const ombros12m = calc12m(userMeasurements.ombros, ideais.ombros, 'ombros');

    const braco12m = calc12m(userMeasurements.braco, ideais.braco, 'braco');
    const antebraco12m = ideais.antebraco ? calc12m(userMeasurements.antebraco, ideais.antebraco, 'antebraco') : userMeasurements.antebraco;
    const brRatio12m = (antebraco12m / braco12m).toFixed(2);

    const coxa12m = ideais.coxa ? calc12m(userMeasurements.coxa, ideais.coxa, 'coxa') : userMeasurements.coxa;
    const pant12m = calc12m(userMeasurements.panturrilha, ideais.panturrilha, 'panturrilha');

    return [
        // 1. WHR
        {
            card: {
                title: "WHR (Waist-Hip Ratio)",
                badge: "MÉTRICA #1",
                metrics: [
                    { label: 'Cintura', value: `${userMeasurements.cintura}cm` },
                    { label: 'Quadril', value: `${userMeasurements.quadril}cm` }
                ],
                currentValue: whrAtual.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: `Relação cintura-quadril. A base da silhueta feminina. Meta para ${methodLabel}: ${whrTarget}.`,
                statusLabel: getStatus(whrPercentual),
                userPosition: Math.round(whrPercentual),
                goalPosition: 100,
                image: "/images/widgets/Cintura_x_Quadril.jpg",
                rawImage: true
            },
            ai: {
                analysis: userMeasurements.cintura > ideais.cintura
                    ? `WHR em <span class='text-primary font-bold'>${whrAtual.toFixed(2)}</span> — Cintura <strong>${cm(userMeasurements.cintura - ideais.cintura)}cm acima</strong> da meta ideal (${cm(ideais.cintura)}cm).`
                    : `WHR em <span class='text-primary font-bold'>${whrAtual.toFixed(2)}</span> — ${Math.round(whrPercentual)}% da meta (${whrTarget}). ${whrPercentual >= 95 ? 'Excelente controle.' : 'Em evolução.'}`,
                suggestion: "Foque no controle da circunferência abdominal e desenvolvimento lateral de glúteos.",
                goal12m: `Cintura: <strong>${cm(userMeasurements.cintura)} → ${cm(cintura12m)}cm</strong> | Quadril: <strong>${cm(userMeasurements.quadril)} → ${cm(quadril12m)}cm</strong> — WHR projetado: <strong>${whr12m}</strong>`
            }
        },
        // 2. Ampulheta
        {
            card: {
                title: "Ampulheta",
                badge: "HARMONIA X-SHAPE",
                metrics: [
                    { label: 'Busto', value: `${busto}cm` },
                    { label: 'Cintura', value: `${userMeasurements.cintura}cm` },
                    { label: 'Quadril', value: `${userMeasurements.quadril}cm` }
                ],
                currentValue: hgScore.toFixed(0),
                valueUnit: "%",
                valueLabel: "SCORE HARMONIA",
                description: "Equilíbrio entre Busto, Cintura e Quadril. Mede a simetria lateral absoluta.",
                statusLabel: getStatus(hgScore),
                userPosition: Math.round(hgScore),
                goalPosition: 100,
                image: "/images/widgets/Busto_vs_Cintura_vs_Quadril.jpg",
                rawImage: true
            },
            ai: {
                analysis: `Score de harmonia: <span class='text-primary font-bold'>${hgScore.toFixed(0)}%</span>. ${hgScore >= 95 ? 'Simetria de ampulheta perfeita.' : hgScore >= 85 ? 'Boa proporção, ajustes finos necessários.' : 'Espaço para melhorar o equilíbrio entre as medidas.'}`,
                suggestion: "Busque equilibrar o desenvolvimento dos dorsais com o volume dos glúteos.",
                goal12m: `Cintura: <strong>${cm(userMeasurements.cintura)} → ${cm(cintura12m)}cm</strong> | Quadril: <strong>${cm(userMeasurements.quadril)} → ${cm(quadril12m)}cm</strong> — Foco no equilíbrio da silhueta`
            }
        },
        // 3. Shoulder-Hip Ratio
        {
            card: {
                title: "Shoulder-Hip Ratio",
                badge: "EQUILÍBRIO SUPERIOR",
                metrics: [
                    { label: 'Ombros', value: `${userMeasurements.ombros}cm` },
                    { label: 'Quadril', value: `${userMeasurements.quadril}cm` }
                ],
                currentValue: shrAtual.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: `Proporção entre ombros e quadril. Define o "flow" do tronco para as pernas.`,
                statusLabel: getStatus(shrPercentual),
                userPosition: Math.round(shrPercentual),
                goalPosition: 100,
                image: "/images/widgets/Ombros_vs_Quadril.jpg",
                rawImage: true
            },
            ai: {
                analysis: makeAnalysis(shrAtual, shrTarget, RATIO_BASELINES.shr),
                suggestion: "Elevações laterais ajudam a equilibrar ombros com um quadril mais largo.",
                goal12m: `Ombros: <strong>${cm(userMeasurements.ombros)} → ${cm(ombros12m)}cm</strong> | Quadril: <strong>${cm(userMeasurements.quadril)} → ${cm(quadril12m)}cm</strong> — Ratio projetado: <strong>${(ombros12m / quadril12m).toFixed(2)}</strong>`
            }
        },
        // 4. Proporção de Braço
        {
            card: {
                title: "Proporção de Braço",
                badge: "MEMBROS SUPERIORES",
                metrics: [
                    { label: 'Braço', value: `${userMeasurements.braco}cm` },
                    { label: 'Antebraço', value: `${userMeasurements.antebraco}cm` }
                ],
                currentValue: brRatioAtual.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: `Desenvolvimento harmônico entre braço e antebraço. Meta: ${brRatioTarget}.`,
                statusLabel: getStatus(brRatioPercentual),
                userPosition: Math.round(brRatioPercentual),
                goalPosition: 100,
                image: "/images/widgets/Braco_vs_Antebraco.jpg",
                rawImage: true
            },
            ai: {
                analysis: makeAnalysis(brRatioAtual, brRatioTarget, RATIO_BASELINES.braco),
                suggestion: "Rosca martelo e extensões de punho para melhorar a densidade dos antebraços.",
                goal12m: `Braço: <strong>${cm(userMeasurements.braco)} → ${cm(braco12m)}cm</strong> | Antebraço: <strong>${cm(userMeasurements.antebraco)} → ${cm(antebraco12m)}cm</strong> — Ratio projetado: <strong>${brRatio12m}</strong>`
            }
        },
        // 5. Hip-Thigh Ratio
        {
            card: {
                title: "Hip-Thigh Ratio",
                badge: "TRANSIÇÃO INFERIOR",
                metrics: [
                    { label: 'Coxa', value: `${userMeasurements.coxa}cm` },
                    { label: 'Quadril', value: `${userMeasurements.quadril}cm` }
                ],
                currentValue: htrAtual.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: "Proporção entre coxa e quadril. Crucial para as categorias Wellness e Bikini.",
                statusLabel: getStatus(htrPercentual),
                userPosition: Math.round(htrPercentual),
                goalPosition: 100,
                image: "/images/widgets/Quadril_vs_Coxa.jpg",
                rawImage: true
            },
            ai: {
                analysis: makeAnalysis(htrAtual, htrTarget, RATIO_BASELINES.hipThigh),
                suggestion: "Foque em glúteo médio para preencher a lateral do quadril.",
                goal12m: `Coxa: <strong>${cm(userMeasurements.coxa)} → ${cm(coxa12m)}cm</strong> | Quadril: <strong>${cm(userMeasurements.quadril)} → ${cm(quadril12m)}cm</strong> — Ratio projetado: <strong>${(coxa12m / quadril12m).toFixed(2)}</strong>`
            }
        },
        // 6. Desenvolvimento de Coxa
        {
            card: {
                title: "Desenvolvimento de Coxa",
                badge: "POTÊNCIA MUSCULAR",
                metrics: [
                    { label: 'Coxa', value: `${userMeasurements.coxa}cm` },
                    { label: 'Joelho', value: `${userMeasurements.joelho}cm` }
                ],
                currentValue: cjAtual.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: "Volume muscular da coxa relativo à estrutura óssea do joelho.",
                statusLabel: getStatus(cjPercentual),
                userPosition: Math.round(cjPercentual),
                goalPosition: 100,
                image: "/images/widgets/Coxa_vs_Joelho.jpg",
                rawImage: true
            },
            ai: {
                analysis: makeAnalysis(cjAtual, cjTarget, RATIO_BASELINES.coxaJoelho),
                suggestion: "Agachamento hack e extensora para isolar o quadríceps.",
                goal12m: `Coxa: <strong>${cm(userMeasurements.coxa)} → ${cm(coxa12m)}cm</strong> — Ratio projetado: <strong>${(coxa12m / userMeasurements.joelho).toFixed(2)}</strong>`
            }
        },
        // 7. Proporção de Perna
        {
            card: {
                title: "Proporção de Perna",
                badge: "SIMETRIA INFERIOR",
                metrics: [
                    { label: 'Coxa', value: `${userMeasurements.coxa}cm` },
                    { label: 'Panturrilha', value: `${userMeasurements.panturrilha}cm` }
                ],
                currentValue: cpAtual.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: "Equilíbrio visual entre coxa e panturrilha.",
                statusLabel: getStatus(cpPercentual),
                userPosition: Math.round(cpPercentual),
                goalPosition: 100,
                image: "/images/widgets/Coxa_vs_Panturrilha.jpg",
                rawImage: true
            },
            ai: {
                analysis: makeAnalysis(cpAtual, cpTarget, RATIO_BASELINES.coxaPant),
                suggestion: "O equilíbrio aqui define o 'flow' das pernas em poses de frente.",
                goal12m: `Coxa: <strong>${cm(userMeasurements.coxa)} → ${cm(coxa12m)}cm</strong> | Pant: <strong>${cm(userMeasurements.panturrilha)} → ${cm(pant12m)}cm</strong> — Ratio projetado: <strong>${(coxa12m / pant12m).toFixed(2)}</strong>`
            }
        },
        // 8. Desenvolvimento de Panturrilha
        {
            card: {
                title: "Desenvolvimento de Panturrilha",
                badge: "DETALHAMENTO FINAL",
                metrics: [
                    { label: 'Panturrilha', value: `${userMeasurements.panturrilha}cm` },
                    { label: 'Tornozelo', value: `${userMeasurements.tornozelo}cm` }
                ],
                currentValue: ptAtual.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: "Desenvolvimento muscular da panturrilha relativo ao tornozelo.",
                statusLabel: getStatus(ptPercentual),
                userPosition: Math.round(ptPercentual),
                goalPosition: 100,
                image: "/images/widgets/Panturrilha_vs_Tornozelo.jpg",
                rawImage: true
            },
            ai: {
                analysis: makeAnalysis(ptAtual, ptTarget, RATIO_BASELINES.pantTorn),
                suggestion: "Trabalhe panturrilhas em pé e sentado para atingir gastrocnêmio e sóleo.",
                goal12m: `Panturrilha: <strong>${cm(userMeasurements.panturrilha)} → ${cm(pant12m)}cm</strong> — Ratio projetado: <strong>${(pant12m / userMeasurements.tornozelo).toFixed(2)}</strong>`
            }
        }
    ];
};
