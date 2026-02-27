import type {
    Measurements,
    IdealMeasurements,
    ProportionItem,
    ComparisonMode,
    ProportionRatioSnapshot
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
    if (percentual >= 82) return 'QUASE LÁ';
    if (percentual >= 65) return 'BOA BASE';
    if (percentual >= 40) return 'CAMINHO';
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
    peitoral: 4.8,       // peito/punho destreinado (~84cm / 17.5cm)
    braco: 1.5,          // braco/punho destreinado (~26cm / 17.5cm)
    antebraco: 0.70,     // antebraco/braco destreinado
    coxa: 1.2,           // coxa/joelho destreinado (~46cm / 38cm)
    legRatio: 1.15,      // coxa/panturrilha destreinado
    panturrilha: 1.45,   // panturrilha/tornozelo destreinado (~32cm / 22cm)
    costas: 1.0,         // costas ≈ cintura
    upperLower: 1.0,     // destreinado: upper ≈ lower (sem desenvolvimento diferenciado)
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
 * Extracts pure ratio data for database persistence or consumption by other services.
 */
export const extractProportionRatios = (
    userMeasurements: Measurements,
    comparisonMode: ComparisonMode
): ProportionRatioSnapshot[] => {
    // Select constants based on mode
    const config = comparisonMode === 'golden' ? GOLDEN_RATIO :
        comparisonMode === 'classic' ? CLASSIC_PHYSIQUE :
            comparisonMode === 'mens' ? MENS_PHYSIQUE : OPEN_BODYBUILDING;

    // ─── Baselines fisiológicos (piso realista de pessoa destreinada) ───
    // A escala vai de baseline (0%) → ideal (100%), não de zero
    const BASELINES: Record<string, number> = {
        'Shape-V': 1.0,            // ombros ≈ cintura (cilindro)
        'Costas': 1.0,             // costas ≈ cintura (sem lat spread)
        'Peitoral': 4.8,           // peito/punho destreinado (~84cm / 17.5cm)
        'Braço': 1.5,              // braço/punho destreinado (~26cm / 17.5cm)
        'Antebraço': 0.70,         // antebraço/braço destreinado
        'Tríade': 70,              // score de harmonia destreinado
        'Cintura': 1.05,           // cintura/pélvis com sobrepeso (INVERSO)
        'Coxa': 1.2,               // coxa/joelho destreinado (~46cm / 38cm)
        'Coxa vs Pantur.': 1.15,   // coxa ≈ panturrilha destreinado
        'Panturrilha': 1.45,       // pant/tornozelo destreinado (~32cm / 22cm)
        'Upper vs Lower': 1.0,     // upper ≈ lower destreinado (INVERSO)
    };

    /**
     * Calcula % calibrado: baseline (0%) → ideal (100%)
     * Para proporções normais (maior = melhor): (atual - baseline) / (ideal - baseline)
     * Para proporções inversas (menor = melhor): (baseline - atual) / (baseline - ideal)
     */
    const getCalibratedPct = (atual: number, ideal: number, baseline: number, inverse = false) => {
        if (inverse) {
            // Cintura, Upper vs Lower: menor = melhor
            const range = baseline - ideal;
            if (range <= 0) return 100;
            const progress = baseline - atual;
            return Math.max(0, Math.min(115, Math.round((progress / range) * 100)));
        }
        // Normal: maior = melhor
        const range = ideal - baseline;
        if (range <= 0) return 100;
        const progress = atual - baseline;
        return Math.max(0, Math.min(115, Math.round((progress / range) * 100)));
    };

    const results: ProportionRatioSnapshot[] = [];

    // 1. Shape-V (Ombros / Cintura)
    const shapeVAtual = userMeasurements.ombros / userMeasurements.cintura;
    const shapeVTarget = (config as any).OMBROS_CINTURA || (config as any).PHI || GOLDEN_RATIO.PHI;
    const shapeVPct = getCalibratedPct(shapeVAtual, shapeVTarget, BASELINES['Shape-V']);
    results.push({
        nome: 'Shape-V',
        atual: shapeVAtual,
        ideal: shapeVTarget,
        pct: shapeVPct,
        status: getStatus(shapeVPct)
    });

    // 2. Costas (Costas / Cintura)
    const costasRatio = userMeasurements.costas / userMeasurements.cintura;
    const costasTarget = (config as any).COSTAS_CINTURA || 1.6;
    const costasPct = getCalibratedPct(costasRatio, costasTarget, BASELINES['Costas']);
    results.push({
        nome: 'Costas',
        atual: costasRatio,
        ideal: costasTarget,
        pct: costasPct,
        status: getStatus(costasPct)
    });

    // 3. Peitoral (Peitoral / Punho)
    const peitoralRatio = userMeasurements.peito / userMeasurements.punho;
    const peitoralTarget = config.PEITO_PUNHO;
    const peitoralPct = getCalibratedPct(peitoralRatio, peitoralTarget, BASELINES['Peitoral']);
    results.push({
        nome: 'Peitoral',
        atual: peitoralRatio,
        ideal: peitoralTarget,
        pct: peitoralPct,
        status: getStatus(peitoralPct)
    });

    // 4. Braço (Braço / Punho)
    const bracoRatio = userMeasurements.braco / userMeasurements.punho;
    const bracoTarget = (config as any).BRACO_PUNHO || config.PEITO_PUNHO;
    const bracoPct = getCalibratedPct(bracoRatio, bracoTarget, BASELINES['Braço']);
    results.push({
        nome: 'Braço',
        atual: bracoRatio,
        ideal: bracoTarget,
        pct: bracoPct,
        status: getStatus(bracoPct)
    });

    // 5. Antebraço (Antebraço / Braço)
    const antebracoRatio = userMeasurements.antebraco / userMeasurements.braco;
    const antebracoTarget = config.ANTEBRACO_BRACO;
    const antebracoPct = getCalibratedPct(antebracoRatio, antebracoTarget, BASELINES['Antebraço']);
    results.push({
        nome: 'Antebraço',
        atual: antebracoRatio,
        ideal: antebracoTarget,
        pct: antebracoPct,
        status: getStatus(antebracoPct)
    });

    // 6. Tríade (Harmonia entre Pescoço, Braço, Panturrilha)
    const triadeMedia = (userMeasurements.braco + userMeasurements.panturrilha + userMeasurements.pescoco) / 3;
    const triadeDesvio = (Math.abs(userMeasurements.braco - triadeMedia) +
        Math.abs(userMeasurements.panturrilha - triadeMedia) +
        Math.abs(userMeasurements.pescoco - triadeMedia)) / triadeMedia / 3;
    const triadeScore = Math.max(0, (1 - triadeDesvio) * 100);
    const triadePct = getCalibratedPct(triadeScore, 100, BASELINES['Tríade']);
    results.push({
        nome: 'Tríade',
        atual: triadeScore,  // Score de harmonia (0-100), NÃO a média em cm
        ideal: 100,
        pct: triadePct,
        status: getStatus(triadePct)
    });

    // 7. Cintura (INVERSO: menor = melhor)
    let cinturaRatio: number;
    let cinturaTarget: number;
    if (comparisonMode === 'golden') {
        cinturaRatio = userMeasurements.cintura / userMeasurements.pelvis;
        cinturaTarget = GOLDEN_RATIO.CINTURA_PELVIS;
    } else {
        cinturaRatio = userMeasurements.cintura / userMeasurements.altura;
        cinturaTarget = (config as any).CINTURA_ALTURA;
    }
    const cinturaPct = getCalibratedPct(cinturaRatio, cinturaTarget, BASELINES['Cintura'], true);
    results.push({
        nome: 'Cintura',
        atual: cinturaRatio,
        ideal: cinturaTarget,
        pct: cinturaPct,
        status: getStatus(cinturaPct)
    });

    // 8. Coxa (Coxa / Joelho)
    const coxaRatio = userMeasurements.coxa / userMeasurements.joelho;
    const coxaTarget = (config as any).COXA_JOELHO || 1.75;
    const coxaPct = getCalibratedPct(coxaRatio, coxaTarget, BASELINES['Coxa']);
    results.push({
        nome: 'Coxa',
        atual: coxaRatio,
        ideal: coxaTarget,
        pct: coxaPct,
        status: getStatus(coxaPct)
    });

    // 9. Coxa vs Panturrilha
    const legRatio = userMeasurements.coxa / userMeasurements.panturrilha;
    const legTarget = (config as any).COXA_PANTURRILHA || 1.50;
    const legPct = getCalibratedPct(legRatio, legTarget, BASELINES['Coxa vs Pantur.']);
    results.push({
        nome: 'Coxa vs Pantur.',
        atual: legRatio,
        ideal: legTarget,
        pct: legPct,
        status: getStatus(legPct)
    });

    // 10. Panturrilha
    let pantRatio: number;
    let pantTarget: number;
    if (comparisonMode === 'golden' || comparisonMode === 'mens') {
        pantRatio = userMeasurements.panturrilha / userMeasurements.tornozelo;
        pantTarget = (config as any).PANTURRILHA_TORNOZELO;
    } else {
        pantRatio = userMeasurements.panturrilha / userMeasurements.braco;
        pantTarget = (config as any).PANTURRILHA_BRACO;
    }
    const pantPct = pantRatio > 0 ? getCalibratedPct(pantRatio, pantTarget, BASELINES['Panturrilha']) : 0;
    results.push({
        nome: 'Panturrilha',
        atual: pantRatio,
        ideal: pantTarget,
        pct: pantPct,
        status: getStatus(pantPct)
    });

    // 11. Upper vs Lower (INVERSO: menor = melhor)
    const upperVolume = userMeasurements.braco + userMeasurements.antebraco;
    const lowerVolume = userMeasurements.coxa + userMeasurements.panturrilha;
    const upperLowerRatio = lowerVolume > 0 ? upperVolume / lowerVolume : 0;
    const upperLowerTarget = (config as any).UPPER_LOWER_RATIO || 0.75;
    const upperLowerPct = getCalibratedPct(upperLowerRatio, upperLowerTarget, BASELINES['Upper vs Lower'], true);
    results.push({
        nome: 'Upper vs Lower',
        atual: upperLowerRatio,
        ideal: upperLowerTarget,
        pct: upperLowerPct,
        status: getStatus(upperLowerPct)
    });

    return results;

};

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
    const snapshots = extractProportionRatios(userMeasurements, comparisonMode);

    // Helper functions inside getProportionItems to reuse existing logic for 12m projections
    const findSnapshot = (nome: string) => snapshots.find(s => s.nome === nome)!;

    // ─── 12-Month Projected Variables ────────────────────────
    const ombros12m = calc12m(userMeasurements.ombros, ideais.ombros, 'ombros');
    const cintura12m = calc12m(userMeasurements.cintura, ideais.cintura, 'cintura');
    const shapeV12mRatio = (ombros12m / cintura12m).toFixed(2);

    const peito12m = ideais.peito ? calc12m(userMeasurements.peito, ideais.peito, 'peito') : userMeasurements.peito;
    const peito12mRatio = (peito12m / userMeasurements.punho).toFixed(2);

    const braco12m = calc12m(userMeasurements.braco, ideais.braco, 'braco');
    const braco12mRatio = (braco12m / userMeasurements.punho).toFixed(2);

    const antebraco12m = ideais.antebraco ? calc12m(userMeasurements.antebraco, ideais.antebraco, 'antebraco') : userMeasurements.antebraco;
    const antebraco12mRatio = (antebraco12m / braco12m).toFixed(2);

    const triadeArr = [
        { name: 'Pescoço', val: userMeasurements.pescoco, part: 'pescoco' },
        { name: 'Braço', val: userMeasurements.braco, part: 'braco' },
        { name: 'Panturrilha', val: userMeasurements.panturrilha, part: 'panturrilha' }
    ];
    const triadeMax = Math.max(...triadeArr.map(t => t.val));
    const triadeWeakest = triadeArr.reduce((a, b) => a.val < b.val ? a : b);
    const triadeWeakest12m = calc12m(triadeWeakest.val, triadeMax, triadeWeakest.part);

    const cinturaBase = comparisonMode === 'golden' ? userMeasurements.pelvis : userMeasurements.altura;
    const cintura12mRatio = (cintura12m / cinturaBase).toFixed(2);

    const coxa12m = ideais.coxa ? calc12m(userMeasurements.coxa, ideais.coxa, 'coxa') : userMeasurements.coxa;
    const coxa12mRatio = ideais.coxa ? (coxa12m / userMeasurements.joelho).toFixed(2) : 'N/A';

    const pant12m = calc12m(userMeasurements.panturrilha, ideais.panturrilha, 'panturrilha');
    const leg12mRatio = (coxa12m / pant12m).toFixed(2);
    const pantBase12m = (comparisonMode === 'golden' || comparisonMode === 'mens') ? userMeasurements.tornozelo : braco12m;
    const pant12mRatio = (pant12m / pantBase12m).toFixed(2);

    const costas12m = ideais.costas ? calc12m(userMeasurements.costas, ideais.costas, 'costas') : userMeasurements.costas;
    const costas12mRatio = (costas12m / cintura12m).toFixed(2);

    const upper12m = braco12m + antebraco12m;
    const lower12m = coxa12m + pant12m;
    const upperLower12mRatio = lower12m > 0 ? (upper12m / lower12m).toFixed(2) : 'N/A';

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
                currentValue: findSnapshot('Shape-V').atual.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: `V-Taper Index: A proporção estética entre ombros e cintura. No modo ${methodLabel}, a meta é ${findSnapshot('Shape-V').ideal.toFixed(3)}.`,
                statusLabel: findSnapshot('Shape-V').status,
                userPosition: Math.round(findSnapshot('Shape-V').pct),
                goalPosition: 100,
                image: "/images/widgets/masculino_shape-v.png",
                overlayStyle: 'v-taper',
                rawImage: true
            },
            ai: {
                analysis: makeAnalysis(findSnapshot('Shape-V').atual, findSnapshot('Shape-V').ideal, RATIO_BASELINES.shapeV),
                suggestion: "Maximize o trabalho de deltoides laterais e controle a linha de cintura para elevar o ratio.",
                goal12m: `Ombros: <strong>${cm(userMeasurements.ombros)} → ${cm(ombros12m)}cm</strong> | Cintura: <strong>${cm(userMeasurements.cintura)} → ${cm(cintura12m)}cm</strong> — Ratio projetado: <strong>${shapeV12mRatio}</strong>`
            }
        },
        // 2. Costas
        {
            card: {
                title: "Costas",
                badge: "AMPLITUDE V-TAPER",
                metrics: [
                    { label: 'Costas', value: `${Number(userMeasurements.costas).toFixed(1)}cm` },
                    { label: 'Cintura', value: `${userMeasurements.cintura}cm` }
                ],
                currentValue: findSnapshot('Costas').atual.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: `Largura das dorsais (lat spread). Meta em CM: ${ideais.costas?.toFixed(1)}cm (atual: ${Number(userMeasurements.costas).toFixed(1)}cm).`,
                statusLabel: findSnapshot('Costas').status,
                userPosition: Math.round(findSnapshot('Costas').pct),
                goalPosition: 100,
                image: "/images/widgets/masculino_costas.png",
                rawImage: true
            },
            ai: {
                analysis: makeAnalysis(findSnapshot('Costas').atual, findSnapshot('Costas').ideal, RATIO_BASELINES.costas),
                suggestion: "Puxadas frontais e remadas curvadas para ganhar largura e densidade nas dorsais.",
                goal12m: `Costas: <strong>${cm(userMeasurements.costas)} → ${cm(costas12m)}cm</strong> | Cintura: <strong>${cm(userMeasurements.cintura)} → ${cm(cintura12m)}cm</strong> — Ratio projetado: <strong>${costas12mRatio}</strong>`
            }
        },
        // 3. Peitoral
        {
            card: {
                title: "Peitoral",
                badge: "PODER DE TRONCO",
                metrics: [
                    { label: 'Peitoral', value: `${userMeasurements.peito}cm` },
                    { label: 'Punho', value: `${userMeasurements.punho}cm` }
                ],
                currentValue: findSnapshot('Peitoral').atual.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: `Volume e densidade torácica. Para atingir o ratio ${findSnapshot('Peitoral').ideal.toFixed(2)}, seu peitoral deve ser de ${ideais.peito?.toFixed(1)}cm (atual: ${userMeasurements.peito}cm).`,
                statusLabel: findSnapshot('Peitoral').status,
                userPosition: Math.round(findSnapshot('Peitoral').pct),
                goalPosition: 100,
                image: "/images/widgets/masculino_peitoral.png",
                overlayStyle: 'chest',
                rawImage: true
            },
            ai: {
                analysis: makeAnalysis(findSnapshot('Peitoral').atual, findSnapshot('Peitoral').ideal, RATIO_BASELINES.peitoral),
                suggestion: "Incorpore variações de supino inclinado para preencher a porção superior do peito.",
                goal12m: `Peitoral: <strong>${cm(userMeasurements.peito)} → ${cm(peito12m)}cm</strong> — Ratio projetado: <strong>${peito12mRatio}</strong>`
            }
        },
        // 4. Braço
        {
            card: {
                title: "Braço",
                badge: "VOLUME MUSCULAR",
                metrics: [
                    { label: 'Braço', value: `${userMeasurements.braco}cm` },
                    { label: 'Punho', value: `${userMeasurements.punho}cm` }
                ],
                currentValue: findSnapshot('Braço').atual.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: `Volume de braço relativo ao punho. Valor ideal em CM: ${ideais.braco.toFixed(1)}cm (atual: ${userMeasurements.braco}cm).`,
                statusLabel: findSnapshot('Braço').status,
                userPosition: Math.round(findSnapshot('Braço').pct),
                goalPosition: 100,
                image: "/images/widgets/masculino_braco.png",
                overlayStyle: 'arm',
                rawImage: true
            },
            ai: {
                analysis: makeAnalysis(findSnapshot('Braço').atual, findSnapshot('Braço').ideal, RATIO_BASELINES.braco),
                suggestion: "Foque na cabeça longa do tríceps para adicionar volume lateral visível de frente.",
                goal12m: `Braço: <strong>${cm(userMeasurements.braco)} → ${cm(braco12m)}cm</strong> — Ratio projetado: <strong>${braco12mRatio}</strong>`
            }
        },
        // 5. Antebraço
        {
            card: {
                title: "Antebraço",
                badge: "DENSIDADE DE BRAÇO",
                metrics: [
                    { label: 'Antebraço', value: `${userMeasurements.antebraco}cm` },
                    { label: 'Braço', value: `${userMeasurements.braco}cm` }
                ],
                currentValue: findSnapshot('Antebraço').atual.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: `Proporção ideal: ${Math.round(findSnapshot('Antebraço').ideal * 100)}% do braço. Valor ideal: ${ideais.antebraco?.toFixed(1)}cm (atual: ${userMeasurements.antebraco}cm).`,
                statusLabel: findSnapshot('Antebraço').status,
                userPosition: Math.round(findSnapshot('Antebraço').pct),
                goalPosition: 100,
                image: "/images/widgets/masculino_antebraco.png",
                rawImage: true
            },
            ai: {
                analysis: makeAnalysis(findSnapshot('Antebraço').atual, findSnapshot('Antebraço').ideal, RATIO_BASELINES.antebraco),
                suggestion: "Rosca inversa e extensão de punho ajudam a equilibrar o volume com o braço.",
                goal12m: `Antebraço: <strong>${cm(userMeasurements.antebraco)} → ${cm(antebraco12m)}cm</strong> — Ratio projetado: <strong>${antebraco12mRatio}</strong>`
            }
        },
        // 6. Tríade
        {
            card: {
                title: "Tríade",
                badge: "A TRINDADE",
                metrics: [
                    { label: 'Pescoço', value: `${userMeasurements.pescoco}cm` },
                    { label: 'Braço', value: `${userMeasurements.braco}cm` },
                    { label: 'Pant.', value: `${userMeasurements.panturrilha}cm` }
                ],
                currentValue: findSnapshot('Tríade').pct.toFixed(1),
                valueUnit: "%",
                description: comparisonMode === 'mens'
                    ? "Tríade não é julgada na categoria Men's Physique."
                    : "Equilíbrio absoluto entre Pescoço, Braço e Panturrilha.",
                statusLabel: comparisonMode === 'mens' ? "N/A" : findSnapshot('Tríade').status,
                userPosition: comparisonMode === 'mens' ? 0 : Math.round(findSnapshot('Tríade').pct),
                goalPosition: 100,
                image: "/images/widgets/masculino_triade.png",
                overlayStyle: 'triad',
                rawImage: true
            },
            ai: {
                analysis: comparisonMode === 'mens'
                    ? "Tríade não é avaliada na categoria Men's Physique."
                    : `Score de harmonia: <span class='text-primary font-bold'>${findSnapshot('Tríade').pct.toFixed(0)}%</span>. ${findSnapshot('Tríade').pct >= 95 ? 'Simetria quase perfeita.' : `Desequilíbrio detectado — ${triadeWeakest.name} é o ponto mais fraco (${cm(triadeWeakest.val)}cm).`}`,
                suggestion: "Manter o equilíbrio é a chave do físico clássico.",
                goal12m: comparisonMode === 'mens'
                    ? "Sem meta específica para esta categoria."
                    : `Equilibrar ${triadeWeakest.name}: <strong>${cm(triadeWeakest.val)} → ${cm(triadeWeakest12m)}cm</strong>. Diferença atual: ${cm(triadeMax - triadeWeakest.val)}cm`
            }
        },
        // 7. Cintura
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
                currentValue: findSnapshot('Cintura').atual.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: `Proporção da cintura. A base do V-Taper. Valor ideal: ${ideais.cintura.toFixed(1)}cm (atual: ${userMeasurements.cintura}cm).`,
                statusLabel: findSnapshot('Cintura').status,
                userPosition: Math.round(findSnapshot('Cintura').pct),
                goalPosition: 100,
                image: "/images/widgets/masculino_cintura.png",
                overlayStyle: 'waist',
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
        // 8. Coxa
        {
            card: {
                title: "Coxa",
                badge: "POTÊNCIA DE PERNAS",
                metrics: (comparisonMode !== 'mens' && ideais.coxa) ? [
                    { label: 'Coxa', value: `${userMeasurements.coxa}cm` },
                    { label: 'Joelho', value: `${userMeasurements.joelho}cm` }
                ] : [],
                currentValue: (comparisonMode === 'mens' || !ideais.coxa) ? "N/A" : findSnapshot('Coxa').atual.toFixed(2),
                valueLabel: (comparisonMode === 'mens' || !ideais.coxa) ? "" : "RATIO ATUAL",
                description: comparisonMode === 'mens' ? "Pernas não são julgadas nesta categoria." : `Desenvolvimento de quadríceps. Meta em CM: ${ideais.coxa?.toFixed(1)}cm (atual: ${userMeasurements.coxa}cm).`,
                statusLabel: (comparisonMode === 'mens' || !ideais.coxa) ? "NÃO JULGADO" : findSnapshot('Coxa').status,
                userPosition: (comparisonMode === 'mens' || !ideais.coxa) ? 0 : Math.round(findSnapshot('Coxa').pct),
                goalPosition: 100,
                image: "/images/widgets/masculino_coxa.png",
                overlayStyle: 'legs',
                rawImage: true
            },
            ai: {
                analysis: comparisonMode === 'mens'
                    ? "Pernas não são avaliadas na categoria Men's Physique."
                    : makeAnalysis(findSnapshot('Coxa').atual, findSnapshot('Coxa').ideal, RATIO_BASELINES.coxa),
                suggestion: comparisonMode === 'mens' ? "Pernas cobertas por bermudas, foco total no tronco." : "Agachamento hack e extensora para detalhamento de quadríceps.",
                goal12m: comparisonMode === 'mens'
                    ? "Foco no desenvolvimento do tronco superior."
                    : `Coxa: <strong>${cm(userMeasurements.coxa)} → ${cm(coxa12m)}cm</strong> — Ratio projetado: <strong>${coxa12mRatio}</strong>`
            }
        },
        // 9. Coxa vs Panturrilha
        {
            card: {
                title: "Coxa vs Panturrilha",
                badge: "SIMETRIA INFERIOR",
                metrics: (comparisonMode !== 'mens' && ideais.coxa) ? [
                    { label: 'Coxa', value: `${userMeasurements.coxa}cm` },
                    { label: 'Panturrilha', value: `${userMeasurements.panturrilha}cm` }
                ] : [],
                currentValue: (comparisonMode === 'mens' || !ideais.coxa) ? "N/A" : findSnapshot('Coxa vs Pantur.').atual.toFixed(2),
                valueLabel: (comparisonMode === 'mens' || !ideais.coxa) ? "" : "RATIO ATUAL",
                description: `Proporção clássica entre membros inferiores. Meta ideal para ${methodLabel}: ${findSnapshot('Coxa vs Pantur.').ideal.toFixed(2)}.`,
                statusLabel: (comparisonMode === 'mens' || !ideais.coxa) ? "NÃO JULGADO" : findSnapshot('Coxa vs Pantur.').status,
                userPosition: Math.round(findSnapshot('Coxa vs Pantur.').pct),
                goalPosition: 100,
                image: "/images/widgets/masculino_leg-ratio.png",
                rawImage: true
            },
            ai: {
                analysis: (comparisonMode === 'mens' || !ideais.coxa)
                    ? "Proporção de perna não é prioridade nesta categoria."
                    : makeAnalysis(findSnapshot('Coxa vs Pantur.').atual, findSnapshot('Coxa vs Pantur.').ideal, RATIO_BASELINES.legRatio),
                suggestion: "O equilíbrio entre coxa e panturrilha é o que define o 'flow' das pernas.",
                goal12m: (comparisonMode === 'mens' || !ideais.coxa)
                    ? "Sem meta específica para membros inferiores."
                    : `Coxa: <strong>${cm(userMeasurements.coxa)} → ${cm(coxa12m)}cm</strong> | Pant: <strong>${cm(userMeasurements.panturrilha)} → ${cm(pant12m)}cm</strong> — Ratio projetado: <strong>${leg12mRatio}</strong>`
            }
        },
        // 10. Panturrilha
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
                currentValue: findSnapshot('Panturrilha').atual.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: `Proporção da panturrilha. Meta em CM: ${ideais.panturrilha.toFixed(1)}cm (atual: ${userMeasurements.panturrilha}cm).`,
                statusLabel: findSnapshot('Panturrilha').status,
                userPosition: Math.round(findSnapshot('Panturrilha').pct),
                goalPosition: 100,
                image: "/images/widgets/masculino_panturrilha.png",
                rawImage: true
            },
            ai: {
                analysis: makeAnalysis(findSnapshot('Panturrilha').atual, findSnapshot('Panturrilha').ideal, RATIO_BASELINES.panturrilha),
                suggestion: "Realize panturrilha em pé com máxima extensão para atingir fibras mais profundas.",
                goal12m: `Panturrilha: <strong>${cm(userMeasurements.panturrilha)} → ${cm(pant12m)}cm</strong> — Ratio projetado: <strong>${pant12mRatio}</strong>`
            }
        },
        // 11. Upper vs Lower
        {
            card: {
                title: "Upper vs Lower",
                badge: "EQUILÍBRIO CORPORAL",
                metrics: (comparisonMode !== 'mens' && ideais.coxa) ? [
                    { label: 'Braço+Ante.', value: `${(userMeasurements.braco + userMeasurements.antebraco).toFixed(1)}cm` },
                    { label: 'Coxa+Pant.', value: `${(userMeasurements.coxa + userMeasurements.panturrilha).toFixed(1)}cm` }
                ] : [],
                currentValue: (comparisonMode === 'mens' || !ideais.coxa) ? "N/A" : findSnapshot('Upper vs Lower').atual.toFixed(2),
                valueLabel: (comparisonMode === 'mens' || !ideais.coxa) ? "" : "RATIO ATUAL",
                description: comparisonMode === 'mens'
                    ? "Proporção não avaliada — pernas não são julgadas nesta categoria."
                    : `Volume dos membros superiores vs inferiores. Meta ${methodLabel}: ${findSnapshot('Upper vs Lower').ideal.toFixed(2)}. Quanto menor, mais desenvolvidas as pernas.`,
                statusLabel: (comparisonMode === 'mens' || !ideais.coxa) ? "NÃO JULGADO" : findSnapshot('Upper vs Lower').status,
                userPosition: (comparisonMode === 'mens' || !ideais.coxa) ? 0 : Math.round(findSnapshot('Upper vs Lower').pct),
                goalPosition: 100,
                image: "/images/widgets/masculino_upper-lower.png",
                rawImage: true
            },
            ai: {
                analysis: (comparisonMode === 'mens' || !ideais.coxa)
                    ? "Proporção Upper vs Lower não é avaliada na categoria Men's Physique."
                    : findSnapshot('Upper vs Lower').atual > findSnapshot('Upper vs Lower').ideal * 1.10
                        ? `Ratio <span class='text-primary font-bold'>${findSnapshot('Upper vs Lower').atual.toFixed(2)}</span> — membros superiores <strong>desproporcionalmente volumosos</strong> em relação aos inferiores. Meta: ${findSnapshot('Upper vs Lower').ideal.toFixed(2)}. Priorize treino de pernas.`
                        : findSnapshot('Upper vs Lower').atual <= findSnapshot('Upper vs Lower').ideal
                            ? `Ratio <span class='text-primary font-bold'>${findSnapshot('Upper vs Lower').atual.toFixed(2)}</span> — excelente equilíbrio entre membros superiores e inferiores. Meta: ${findSnapshot('Upper vs Lower').ideal.toFixed(2)}.`
                            : `Ratio <span class='text-primary font-bold'>${findSnapshot('Upper vs Lower').atual.toFixed(2)}</span> — ${Math.round(((findSnapshot('Upper vs Lower').atual / findSnapshot('Upper vs Lower').ideal) - 1) * 100)}% acima da meta (${findSnapshot('Upper vs Lower').ideal.toFixed(2)}). Desenvolva mais os membros inferiores.`,
                suggestion: "Equilibre o volume com agachamentos, leg press e panturrilha em pé. Evite pular o dia de pernas!",
                goal12m: (comparisonMode === 'mens' || !ideais.coxa)
                    ? "Sem meta específica para esta categoria."
                    : `Upper: <strong>${(userMeasurements.braco + userMeasurements.antebraco).toFixed(1)} → ${upper12m.toFixed(1)}cm</strong> | Lower: <strong>${(userMeasurements.coxa + userMeasurements.panturrilha).toFixed(1)} → ${lower12m.toFixed(1)}cm</strong> — Ratio projetado: <strong>${upperLower12mRatio}</strong>`
            }
        },
    ];
};
