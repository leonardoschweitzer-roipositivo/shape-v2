import type {
    Measurements,
    IdealMeasurements,
    ProportionItem,
    ComparisonMode
} from '../types';
import {
    GOLDEN_RATIO,
    CLASSIC_PHYSIQUE,
    MENS_PHYSIQUE,
    OPEN_BODYBUILDING
} from '@/services/calculations';

// ─── Helper: Method label ───────────────────────────────────
export const getMethodLabel = (mode: ComparisonMode): string => {
    switch (mode) {
        case 'golden':
            return 'Golden Ratio';
        case 'classic':
            return 'Classic Physique';
        case 'mens':
            return "Men's Physique";
        case 'open':
            return "Open Bodybuilding";
        default:
            return "Golden Ratio";
    }
};

// ─── Helper: Status label ───────────────────────────────────
export const getStatus = (percentual: number): string => {
    if (percentual >= 103) return 'ELITE';
    if (percentual >= 97) return 'META';
    if (percentual >= 90) return 'QUASE LÁ';
    if (percentual >= 82) return 'CAMINHO';
    return 'INÍCIO';
};

// ─── Helper: Monthly growth rates (cm/month, realistic) ────
const GROWTH_RATES: Record<string, number> = {
    ombros: 0.3,
    peito: 0.25,
    costas: 0.25,
    braco: 0.15,
    antebraco: 0.08,
    coxa: 0.25,
    panturrilha: 0.08,
    cintura: 0.25,
    pescoco: 0.05,
};

/** Calculate realistic 12-month cm target */
const calc12m = (currentCm: number, idealCm: number, part: string): number => {
    const rate = GROWTH_RATES[part] || 0.15;
    const gap = idealCm - currentCm;
    if (Math.abs(gap) < 0.3) return Math.round(currentCm * 10) / 10;
    const maxChange = rate * 12;
    const change = Math.sign(gap) * Math.min(Math.abs(gap), maxChange);
    return Math.round((currentCm + change) * 10) / 10;
};

/**
 * Baselines realistas para cada tipo de ratio (valor de uma pessoa média destreinada).
 * Usado para calcular porcentagem calibrada: % = (atual - baseline) / (meta - baseline)
 */
const RATIO_BASELINES = {
    shapeV: 1.0,         // ombros ≈ cintura
    peitoral: 5.0,       // peito/punho destreinado
    braco: 1.7,          // braco/punho destreinado
    antebraco: 0.55,     // antebraco/braco destreinado
    coxa: 1.2,           // coxa/joelho destreinado
    legRatio: 1.1,       // coxa/panturrilha destreinado
    panturrilha: 1.3,    // panturrilha/tornozelo destreinado
    costas: 1.0,         // costas ≈ cintura
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
    if (p >= 85) return `Ratio <span class='text-primary font-bold'>${ratioStr}</span> — ${p}% da meta (${target}). Muito próximo do ideal.`;
    if (p >= 65) return `Ratio <span class='text-primary font-bold'>${ratioStr}</span> — ${p}% da meta (${target}). Boa base construída.`;
    if (p >= 40) return `Ratio <span class='text-primary font-bold'>${ratioStr}</span> — ${p}% da meta (${target}). Evolução consistente possível.`;
    if (p >= 20) return `Ratio <span class='text-primary font-bold'>${ratioStr}</span> — ${p}% da meta (${target}). Estágio de desenvolvimento.`;
    return `Ratio <span class='text-primary font-bold'>${ratioStr}</span> — ${p}% da meta (${target}). Prioridade de desenvolvimento.`;
};

/** Format cm value */
const cm = (v: number) => v.toFixed(1);

/**
 * Generates proportion items configuration based on user measurements and comparison mode
 * FOCUS: Ratios (Indices) as primary display.
 */
export const getProportionItems = (
    userMeasurements: Measurements,
    ideais: IdealMeasurements,
    comparisonMode: ComparisonMode
): ProportionItem[] => {
    const methodLabel = getMethodLabel(comparisonMode);

    // Select constants based on mode
    const config = comparisonMode === 'golden' ? GOLDEN_RATIO :
        comparisonMode === 'classic' ? CLASSIC_PHYSIQUE :
            comparisonMode === 'mens' ? MENS_PHYSIQUE : OPEN_BODYBUILDING;

    // Helper to calculate ratio percentage
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

    // 1. Shape-V (Ombros / Cintura)
    const shapeVAtual = userMeasurements.ombros / userMeasurements.cintura;
    const shapeVTarget = (config as any).OMBROS_CINTURA || (config as any).PHI;
    const shapeVPercentual = getRatioPercent(shapeVAtual, shapeVTarget);

    // 2. Peitoral (Peitoral / Punho)
    const peitoralRatio = userMeasurements.peito / userMeasurements.punho;
    const peitoralTarget = config.PEITO_PUNHO;
    const peitoralPercentual = getRatioPercent(peitoralRatio, peitoralTarget);

    // 3. Braço (Braço / Punho)
    const bracoRatio = userMeasurements.braco / userMeasurements.punho;
    const bracoTarget = (config as any).BRACO_PUNHO || config.PEITO_PUNHO;
    const bracoPercentual = getRatioPercent(bracoRatio, bracoTarget);

    // 4. Antebraço (Antebraço / Braço)
    const antebracoRatio = userMeasurements.antebraco / userMeasurements.braco;
    const antebracoTarget = config.ANTEBRACO_BRACO;
    const antebracoPercentual = getRatioPercent(antebracoRatio, antebracoTarget);

    // 5. Tríade (Harmonia entre Pescoço, Braço, Panturrilha)
    const triadeMedia = (userMeasurements.braco + userMeasurements.panturrilha + userMeasurements.pescoco) / 3;
    const triadeDesvio = (Math.abs(userMeasurements.braco - triadeMedia) +
        Math.abs(userMeasurements.panturrilha - triadeMedia) +
        Math.abs(userMeasurements.pescoco - triadeMedia)) / triadeMedia / 3;
    const triadeScore = Math.max(0, (1 - triadeDesvio) * 100);

    // 6. Cintura (Base varies)
    let cinturaRatio: number;
    let cinturaTarget: number;
    let cinturaBaseLabel: string;

    if (comparisonMode === 'golden') {
        cinturaRatio = userMeasurements.cintura / userMeasurements.pelvis;
        cinturaTarget = GOLDEN_RATIO.CINTURA_PELVIS;
        cinturaBaseLabel = 'Cintura ÷ Pélvis';
    } else {
        cinturaRatio = userMeasurements.cintura / userMeasurements.altura;
        cinturaTarget = (config as any).CINTURA_ALTURA;
        cinturaBaseLabel = 'Cintura ÷ Altura';
    }
    const cinturaPercentual = getRatioPercent(cinturaRatio, cinturaTarget, true);

    // 7. Coxa (Coxa / Joelho)
    const coxaRatio = userMeasurements.coxa / userMeasurements.joelho;
    const coxaTarget = (config as any).COXA_JOELHO || 1.75;
    const coxaPercentual = getRatioPercent(coxaRatio, coxaTarget);

    // 8. Coxa vs Panturrilha (Coxa / Panturrilha)
    const legRatio = userMeasurements.coxa / userMeasurements.panturrilha;
    const legTarget = (config as any).COXA_PANTURRILHA || 1.50;
    const legPercentual = getRatioPercent(legRatio, legTarget);

    // 9. Panturrilha (Base varies)
    let pantRatio: number;
    let pantTarget: number;
    let pantBaseLabel: string;

    if (comparisonMode === 'golden' || comparisonMode === 'mens') {
        pantRatio = userMeasurements.panturrilha / userMeasurements.tornozelo;
        pantTarget = (config as any).PANTURRILHA_TORNOZELO;
        pantBaseLabel = 'Panturrilha ÷ Tornozelo';
    } else {
        pantRatio = userMeasurements.panturrilha / userMeasurements.braco;
        pantTarget = (config as any).PANTURRILHA_BRACO;
        pantBaseLabel = 'Panturrilha ÷ Braço';
    }
    const pantPercentual = getRatioPercent(pantRatio, pantTarget);

    // 10. Costas (Costas / Cintura)
    const costasRatio = userMeasurements.costas / userMeasurements.cintura;
    const costasTarget = (config as any).COSTAS_CINTURA || 1.6;
    const costasPercentual = getRatioPercent(costasRatio, costasTarget);

    // ─── 12-Month Realistic Targets ──────────────────────────

    const ombros12m = calc12m(userMeasurements.ombros, ideais.ombros, 'ombros');
    const cintura12m = calc12m(userMeasurements.cintura, ideais.cintura, 'cintura');
    const shapeV12mRatio = (ombros12m / cintura12m).toFixed(2);

    const peito12m = ideais.peito ? calc12m(userMeasurements.peito, ideais.peito, 'peito') : userMeasurements.peito;
    const peito12mRatio = (peito12m / userMeasurements.punho).toFixed(2);

    const braco12m = calc12m(userMeasurements.braco, ideais.braco, 'braco');
    const braco12mRatio = (braco12m / userMeasurements.punho).toFixed(2);

    const antebraco12m = ideais.antebraco ? calc12m(userMeasurements.antebraco, ideais.antebraco, 'antebraco') : userMeasurements.antebraco;
    const antebraco12mRatio = (antebraco12m / braco12m).toFixed(2);

    // Tríade: find weakest limb
    const triadeArr = [
        { name: 'Pescoço', val: userMeasurements.pescoco, part: 'pescoco' },
        { name: 'Braço', val: userMeasurements.braco, part: 'braco' },
        { name: 'Panturrilha', val: userMeasurements.panturrilha, part: 'panturrilha' }
    ];
    const triadeMax = Math.max(...triadeArr.map(t => t.val));
    const triadeWeakest = triadeArr.reduce((a, b) => a.val < b.val ? a : b);
    const triadeWeakest12m = calc12m(triadeWeakest.val, triadeMax, triadeWeakest.part);

    // Cintura
    const cinturaBase = comparisonMode === 'golden' ? userMeasurements.pelvis : userMeasurements.altura;
    const cintura12mRatio = (cintura12m / cinturaBase).toFixed(2);

    // Coxa
    const coxa12m = ideais.coxa ? calc12m(userMeasurements.coxa, ideais.coxa, 'coxa') : userMeasurements.coxa;
    const coxa12mRatio = ideais.coxa ? (coxa12m / userMeasurements.joelho).toFixed(2) : 'N/A';

    // Panturrilha
    const pant12m = calc12m(userMeasurements.panturrilha, ideais.panturrilha, 'panturrilha');
    const leg12mRatio = (coxa12m / pant12m).toFixed(2);

    const pantBase12m = (comparisonMode === 'golden' || comparisonMode === 'mens') ? userMeasurements.tornozelo : braco12m;
    const pant12mRatio = (pant12m / pantBase12m).toFixed(2);

    // Costas
    const costas12m = ideais.costas ? calc12m(userMeasurements.costas, ideais.costas, 'costas') : userMeasurements.costas;
    const costas12mRatio = (costas12m / cintura12m).toFixed(2);

    // ─── Return Items ────────────────────────────────────────

    return [
        // 1. Shape-V
        {
            card: {
                title: "Shape-V",
                badge: "ESCALA SHAPE-V",
                metrics: [
                    { label: 'Ombros', value: `${userMeasurements.ombros}cm` },
                    { label: 'Cintura', value: `${userMeasurements.cintura}cm` }
                ],
                currentValue: shapeVAtual.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: `V-Taper Index: A proporção estética entre ombros e cintura. No modo ${methodLabel}, a meta é ${shapeVTarget}.`,
                statusLabel: getStatus(shapeVPercentual),
                userPosition: Math.round(shapeVPercentual),
                goalPosition: 100,
                image: "/images/widgets/masculino_shape-v.png",
                rawImage: true
            },
            ai: {
                analysis: makeAnalysis(shapeVAtual, shapeVTarget, RATIO_BASELINES.shapeV),
                suggestion: "Maximize o trabalho de deltoides laterais e controle a linha de cintura para elevar o ratio.",
                goal12m: `Ombros: <strong>${cm(userMeasurements.ombros)} → ${cm(ombros12m)}cm</strong> | Cintura: <strong>${cm(userMeasurements.cintura)} → ${cm(cintura12m)}cm</strong> — Ratio projetado: <strong>${shapeV12mRatio}</strong>`
            }
        },
        // 2. Peitoral
        {
            card: {
                title: "Peitoral",
                badge: "PODER DE TRONCO",
                metrics: [
                    { label: 'Peitoral', value: `${userMeasurements.peito}cm` },
                    { label: 'Punho', value: `${userMeasurements.punho}cm` }
                ],
                currentValue: peitoralRatio.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: `Volume e densidade torácica. Para atingir o ratio ${peitoralTarget}, seu peitoral deve ser de ${ideais.peito?.toFixed(1)}cm (atual: ${userMeasurements.peito}cm).`,
                statusLabel: getStatus(peitoralPercentual),
                userPosition: Math.round(peitoralPercentual),
                goalPosition: 100,
                image: "/images/widgets/masculino_peitoral.png",
                rawImage: true
            },
            ai: {
                analysis: makeAnalysis(peitoralRatio, peitoralTarget, RATIO_BASELINES.peitoral),
                suggestion: "Incorpore variações de supino inclinado para preencher a porção superior do peito.",
                goal12m: `Peitoral: <strong>${cm(userMeasurements.peito)} → ${cm(peito12m)}cm</strong> — Ratio projetado: <strong>${peito12mRatio}</strong>`
            }
        },
        // 3. Braço
        {
            card: {
                title: "Braço",
                badge: "VOLUME MUSCULAR",
                metrics: [
                    { label: 'Braço', value: `${userMeasurements.braco}cm` },
                    { label: 'Punho', value: `${userMeasurements.punho}cm` }
                ],
                currentValue: bracoRatio.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: `Volume de braço relativo ao punho. Valor ideal em CM: ${ideais.braco.toFixed(1)}cm (atual: ${userMeasurements.braco}cm).`,
                statusLabel: getStatus(bracoPercentual),
                userPosition: Math.round(bracoPercentual),
                goalPosition: 100,
                image: "/images/widgets/masculino_braco.png",
                rawImage: true
            },
            ai: {
                analysis: makeAnalysis(bracoRatio, bracoTarget, RATIO_BASELINES.braco),
                suggestion: "Foque na cabeça longa do tríceps para adicionar volume lateral visível de frente.",
                goal12m: `Braço: <strong>${cm(userMeasurements.braco)} → ${cm(braco12m)}cm</strong> — Ratio projetado: <strong>${braco12mRatio}</strong>`
            }
        },
        // 4. Antebraço
        {
            card: {
                title: "Antebraço",
                badge: "PROPORÇÃO #4",
                metrics: [
                    { label: 'Antebraço', value: `${userMeasurements.antebraco}cm` },
                    { label: 'Braço', value: `${userMeasurements.braco}cm` }
                ],
                currentValue: antebracoRatio.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: `Proporção ideal: ${Math.round(antebracoTarget * 100)}% do braço. Valor ideal: ${ideais.antebraco?.toFixed(1)}cm (atual: ${userMeasurements.antebraco}cm).`,
                statusLabel: getStatus(antebracoPercentual),
                userPosition: Math.round(antebracoPercentual),
                goalPosition: 100,
                image: "/images/widgets/masculino_antebraco.png",
                rawImage: true
            },
            ai: {
                analysis: makeAnalysis(antebracoRatio, antebracoTarget, RATIO_BASELINES.antebraco),
                suggestion: "Rosca inversa e extensão de punho ajudam a equilibrar o volume com o braço.",
                goal12m: `Antebraço: <strong>${cm(userMeasurements.antebraco)} → ${cm(antebraco12m)}cm</strong> — Ratio projetado: <strong>${antebraco12mRatio}</strong>`
            }
        },
        // 5. Tríade
        {
            card: {
                title: "Tríade",
                badge: "A TRINDADE",
                metrics: [
                    { label: 'Pescoço', value: `${userMeasurements.pescoco}cm` },
                    { label: 'Braço', value: `${userMeasurements.braco}cm` },
                    { label: 'Pant.', value: `${userMeasurements.panturrilha}cm` }
                ],
                currentValue: triadeScore.toFixed(1),
                valueUnit: "%",
                description: comparisonMode === 'mens'
                    ? "Tríade não é julgada na categoria Men's Physique."
                    : "Equilíbrio absoluto entre Pescoço, Braço e Panturrilha.",
                statusLabel: comparisonMode === 'mens' ? "N/A" : getStatus(triadeScore),
                userPosition: comparisonMode === 'mens' ? 0 : Math.round(triadeScore),
                goalPosition: 100,
                image: "/images/widgets/masculino_triade.png",
                rawImage: true
            },
            ai: {
                analysis: comparisonMode === 'mens'
                    ? "Tríade não é avaliada na categoria Men's Physique."
                    : `Score de harmonia: <span class='text-primary font-bold'>${triadeScore.toFixed(0)}%</span>. ${triadeScore >= 95 ? 'Simetria quase perfeita.' : `Desequilíbrio detectado — ${triadeWeakest.name} é o ponto mais fraco (${cm(triadeWeakest.val)}cm).`}`,
                suggestion: "Manter o equilíbrio é a chave do físico clássico.",
                goal12m: comparisonMode === 'mens'
                    ? "Sem meta específica para esta categoria."
                    : `Equilibrar ${triadeWeakest.name}: <strong>${cm(triadeWeakest.val)} → ${cm(triadeWeakest12m)}cm</strong>. Diferença atual: ${cm(triadeMax - triadeWeakest.val)}cm`
            }
        },
        // 6. Cintura
        {
            card: {
                title: "Cintura",
                badge: "LINHA DE CINTURA",
                metrics: comparisonMode === 'golden'
                    ? [
                        { label: 'Cintura', value: `${userMeasurements.cintura}cm` },
                        { label: 'Pélvis', value: `${userMeasurements.pelvis}cm` }
                    ]
                    : [
                        { label: 'Cintura', value: `${userMeasurements.cintura}cm` },
                        { label: 'Altura', value: `${userMeasurements.altura}cm` }
                    ],
                currentValue: cinturaRatio.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: `${cinturaBaseLabel}. A base do V-Taper. Valor ideal: ${ideais.cintura.toFixed(1)}cm (atual: ${userMeasurements.cintura}cm).`,
                statusLabel: getStatus(cinturaPercentual),
                userPosition: Math.round(cinturaPercentual),
                goalPosition: 100,
                image: "/images/widgets/masculino_cintura.png",
                rawImage: true
            },
            ai: {
                analysis: userMeasurements.cintura > ideais.cintura
                    ? `Cintura em <span class='text-primary font-bold'>${cm(userMeasurements.cintura)}cm</span> — <strong>${cm(userMeasurements.cintura - ideais.cintura)}cm acima</strong> da meta ideal (${cm(ideais.cintura)}cm) para ${methodLabel}.`
                    : `Cintura em <span class='text-primary font-bold'>${cm(userMeasurements.cintura)}cm</span> — dentro ou abaixo da meta ideal (${cm(ideais.cintura)}cm). Excelente controle.`,
                suggestion: "Foque em exercícios de vácuo abdominal para fortalecer o transverso e afinar a linha.",
                goal12m: `Cintura: <strong>${cm(userMeasurements.cintura)} → ${cm(cintura12m)}cm</strong> — Ratio projetado: <strong>${cintura12mRatio}</strong>`
            }
        },
        // 7. Coxa
        {
            card: {
                title: "Coxa",
                badge: "POTÊNCIA DE PERNAS",
                metrics: (comparisonMode !== 'mens' && ideais.coxa) ? [
                    { label: 'Coxa', value: `${userMeasurements.coxa}cm` },
                    { label: 'Joelho', value: `${userMeasurements.joelho}cm` }
                ] : [],
                currentValue: (comparisonMode === 'mens' || !ideais.coxa) ? "N/A" : coxaRatio.toFixed(2),
                valueLabel: (comparisonMode === 'mens' || !ideais.coxa) ? "" : "RATIO ATUAL",
                description: comparisonMode === 'mens' ? "Pernas não são julgadas nesta categoria." : `Desenvolvimento de quadríceps. Meta em CM: ${ideais.coxa?.toFixed(1)}cm (atual: ${userMeasurements.coxa}cm).`,
                statusLabel: (comparisonMode === 'mens' || !ideais.coxa) ? "NÃO JULGADO" : getStatus(coxaPercentual),
                userPosition: (comparisonMode === 'mens' || !ideais.coxa) ? 0 : Math.round(coxaPercentual),
                goalPosition: 100,
                image: "/images/widgets/masculino_coxa.png",
                rawImage: true
            },
            ai: {
                analysis: comparisonMode === 'mens'
                    ? "Pernas não são avaliadas na categoria Men's Physique."
                    : makeAnalysis(coxaRatio, coxaTarget, RATIO_BASELINES.coxa),
                suggestion: comparisonMode === 'mens' ? "Pernas cobertas por bermudas, foco total no tronco." : "Agachamento hack e extensora para detalhamento de quadríceps.",
                goal12m: comparisonMode === 'mens'
                    ? "Foco no desenvolvimento do tronco superior."
                    : `Coxa: <strong>${cm(userMeasurements.coxa)} → ${cm(coxa12m)}cm</strong> — Ratio projetado: <strong>${coxa12mRatio}</strong>`
            }
        },
        // 8. Coxa vs Panturrilha
        {
            card: {
                title: "Coxa vs Panturrilha",
                badge: "SIMETRIA INFERIOR",
                metrics: (comparisonMode !== 'mens' && ideais.coxa) ? [
                    { label: 'Coxa', value: `${userMeasurements.coxa}cm` },
                    { label: 'Panturrilha', value: `${userMeasurements.panturrilha}cm` }
                ] : [],
                currentValue: (comparisonMode === 'mens' || !ideais.coxa) ? "N/A" : legRatio.toFixed(2),
                valueLabel: (comparisonMode === 'mens' || !ideais.coxa) ? "" : "RATIO ATUAL",
                description: `Proporção clássica entre membros inferiores. Meta ideal para ${methodLabel}: ${legTarget}.`,
                statusLabel: (comparisonMode === 'mens' || !ideais.coxa) ? "NÃO JULGADO" : getStatus(legPercentual),
                userPosition: Math.round(legPercentual),
                goalPosition: 100,
                image: "/images/widgets/masculino_leg-ratio.png",
                rawImage: true
            },
            ai: {
                analysis: (comparisonMode === 'mens' || !ideais.coxa)
                    ? "Proporção de perna não é prioridade nesta categoria."
                    : makeAnalysis(legRatio, legTarget, RATIO_BASELINES.legRatio),
                suggestion: "O equilíbrio entre coxa e panturrilha é o que define o 'flow' das pernas.",
                goal12m: (comparisonMode === 'mens' || !ideais.coxa)
                    ? "Sem meta específica para membros inferiores."
                    : `Coxa: <strong>${cm(userMeasurements.coxa)} → ${cm(coxa12m)}cm</strong> | Pant: <strong>${cm(userMeasurements.panturrilha)} → ${cm(pant12m)}cm</strong> — Ratio projetado: <strong>${leg12mRatio}</strong>`
            }
        },
        // 9. Panturrilha
        {
            card: {
                title: "Panturrilha",
                badge: "DETALHAMENTO",
                metrics: (comparisonMode === 'golden' || comparisonMode === 'mens')
                    ? [
                        { label: 'Panturrilha', value: `${userMeasurements.panturrilha}cm` },
                        { label: 'Tornozelo', value: `${userMeasurements.tornozelo}cm` }
                    ]
                    : [
                        { label: 'Panturrilha', value: `${userMeasurements.panturrilha}cm` },
                        { label: 'Braço', value: `${userMeasurements.braco}cm` }
                    ],
                currentValue: pantRatio.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: `${pantBaseLabel}. Meta em CM: ${ideais.panturrilha.toFixed(1)}cm (atual: ${userMeasurements.panturrilha}cm).`,
                statusLabel: getStatus(pantPercentual),
                userPosition: Math.round(pantPercentual),
                goalPosition: 100,
                image: "/images/widgets/masculino_panturrilha.png",
                rawImage: true
            },
            ai: {
                analysis: makeAnalysis(pantRatio, pantTarget, RATIO_BASELINES.panturrilha),
                suggestion: "Realize panturrilha em pé com máxima extensão para atingir fibras mais profundas.",
                goal12m: `Panturrilha: <strong>${cm(userMeasurements.panturrilha)} → ${cm(pant12m)}cm</strong> — Ratio projetado: <strong>${pant12mRatio}</strong>`
            }
        },
        // 10. Costas
        {
            card: {
                title: "Costas",
                badge: "AMPLITUDE V-TAPER",
                metrics: [
                    { label: 'Costas', value: `${userMeasurements.costas}cm` },
                    { label: 'Cintura', value: `${userMeasurements.cintura}cm` }
                ],
                currentValue: costasRatio.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: `Largura das dorsais (lat spread). Meta em CM: ${ideais.costas?.toFixed(1)}cm (atual: ${userMeasurements.costas}cm).`,
                statusLabel: getStatus(costasPercentual),
                userPosition: Math.round(costasPercentual),
                goalPosition: 100,
                image: "/images/widgets/masculino_costas.png",
                rawImage: true
            },
            ai: {
                analysis: makeAnalysis(costasRatio, costasTarget, RATIO_BASELINES.costas),
                suggestion: "Puxadas frontais e remadas curvadas para ganhar largura e densidade nas dorsais.",
                goal12m: `Costas: <strong>${cm(userMeasurements.costas)} → ${cm(costas12m)}cm</strong> | Cintura: <strong>${cm(userMeasurements.cintura)} → ${cm(cintura12m)}cm</strong> — Ratio projetado: <strong>${costas12mRatio}</strong>`
            }
        }
    ];
};
