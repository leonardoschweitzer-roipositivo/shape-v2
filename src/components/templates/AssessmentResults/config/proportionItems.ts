import type {
    Measurements,
    IdealMeasurements,
    ProportionItem,
    ComparisonMode,
    ProportionDifference
} from '../types';
import {
    calcularDiferenca,
    GOLDEN_RATIO,
    CLASSIC_PHYSIQUE,
    MENS_PHYSIQUE,
    OPEN_BODYBUILDING
} from '@/services/calculations';

// Helper function to get method label
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

// Helper function to get status label based on percentage
export const getStatus = (percentual: number): string => {
    if (percentual >= 103) return 'ELITE';
    if (percentual >= 97) return 'META';
    if (percentual >= 90) return 'QUASE LÁ';
    if (percentual >= 82) return 'CAMINHO';
    return 'INÍCIO';
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

    // Select constants based on mode
    const config = comparisonMode === 'golden' ? GOLDEN_RATIO :
        comparisonMode === 'classic' ? CLASSIC_PHYSIQUE :
            comparisonMode === 'mens' ? MENS_PHYSIQUE : OPEN_BODYBUILDING;

    // Helper to calculate ratio percentage
    // For waist, lower is better. For others, higher is better (up to 100).
    const getRatioPercent = (current: number, target: number, inverse = false) => {
        if (!target || target <= 0) return 0;

        if (inverse) {
            // v1.1 calculation for inverse proportions (lower is better)
            if (current <= target) {
                const bonus = (target - current) / target;
                return Math.min(110, 100 + (bonus * 50));
            }
            // Penalty: 1.5% for each 1% over target
            const excessoPercent = ((current - target) / target) * 100;
            return Math.max(0, 100 - (excessoPercent * 1.5));
        }

        // Normal proportions (higher is better, up to 115% for "Elite" status on ruler)
        return Math.min(115, (current / target) * 100);
    };

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
    const bracoTarget = (config as any).BRACO_PUNHO || config.PEITO_PUNHO; // Fallback to avoid crash if constant missing
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

    return [
        // 1. Shape-V
        {
            card: {
                title: "Shape-V",
                badge: "ESCALA SHAPE-V",
                metrics: [
                    { label: 'Ratio Atual', value: shapeVAtual.toFixed(2) },
                    { label: 'Meta', value: shapeVTarget.toFixed(2) }
                ],
                currentValue: shapeVAtual.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: `V-Taper Index: A proporção estética entre ombros e cintura. No modo ${methodLabel}, a meta é ${shapeVTarget}.`,
                statusLabel: getStatus(shapeVPercentual),
                userPosition: Math.round(shapeVPercentual),
                goalPosition: 100,
                image: "/images/widgets/shape-v.png",
                rawImage: true,
                measurementsUsed: ['Ombros', 'Cintura']
            },
            ai: {
                strength: `Seu <span class='text-primary font-bold'>Shape-V (${shapeVAtual.toFixed(2)})</span> para o modo ${methodLabel} está ${shapeVPercentual >= 90 ? 'excelente' : 'em evolução'}.`,
                suggestion: "Maximize o trabalho de deltoides laterais e controle a linha de cintura para elevar o ratio."
            }
        },
        // 2. Peitoral
        {
            card: {
                title: "Peitoral",
                badge: "PODER DE TRONCO",
                metrics: [
                    { label: 'Ratio Atual', value: peitoralRatio.toFixed(2) },
                    { label: 'Meta', value: peitoralTarget.toFixed(2) }
                ],
                currentValue: peitoralRatio.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: `Volume e densidade torácica. Para atingir o ratio ${peitoralTarget}, seu peitoral deve ser de ${ideais.peito?.toFixed(1)}cm (atual: ${userMeasurements.peito}cm).`,
                statusLabel: getStatus(peitoralPercentual),
                userPosition: Math.round(peitoralPercentual),
                goalPosition: 100,
                image: "/images/widgets/peitoral.png",
                rawImage: true,
                measurementsUsed: ['Peitoral', 'Punho']
            },
            ai: {
                weakness: peitoralPercentual < 90
                    ? `O <strong class='text-white'>Peitoral</strong> está em ${Math.round(peitoralPercentual)}% da meta de ratio. Volume torácico é fundamental para o V-Taper.`
                    : undefined,
                strength: peitoralPercentual >= 95
                    ? `Seu <span class='text-primary font-bold'>Peitoral</span> atingiu a densidade ideal de ratio para o padrão ${methodLabel}.`
                    : undefined,
                suggestion: "Incorpore variações de supino inclinado para preencher a porção superior do peito."
            }
        },
        // 3. Braço
        {
            card: {
                title: "Braço",
                badge: "VOLUME MUSCULAR",
                metrics: [
                    { label: 'Ratio Atual', value: bracoRatio.toFixed(2) },
                    { label: 'Meta', value: bracoTarget.toFixed(2) }
                ],
                currentValue: bracoRatio.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: `Volume de braço relativo ao punho. Valor ideal em CM: ${ideais.braco.toFixed(1)}cm (atual: ${userMeasurements.braco}cm).`,
                statusLabel: getStatus(bracoPercentual),
                userPosition: Math.round(bracoPercentual),
                goalPosition: 100,
                image: "/images/widgets/braco.png",
                rawImage: true,
                measurementsUsed: ['Braço', 'Punho']
            },
            ai: {
                strength: `Seu <span class='text-primary font-bold'>Braço</span> (Ratio ${bracoRatio.toFixed(2)}) está em harmonia com sua estrutura física para ${methodLabel}.`,
                suggestion: "Foque na cabeça longa do tríceps para adicionar volume lateral visível de frente."
            }
        },
        // 4. Antebraço
        {
            card: {
                title: "Antebraço",
                badge: "PROPORÇÃO #4",
                metrics: [
                    { label: 'Ratio Atual', value: antebracoRatio.toFixed(2) },
                    { label: 'Meta', value: antebracoTarget.toFixed(2) }
                ],
                currentValue: antebracoRatio.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: `Proporção ideal: ${Math.round(antebracoTarget * 100)}% do braço. Valor ideal: ${ideais.antebraco?.toFixed(1)}cm (atual: ${userMeasurements.antebraco}cm).`,
                statusLabel: getStatus(antebracoPercentual),
                userPosition: Math.round(antebracoPercentual),
                goalPosition: 100,
                image: "/images/widgets/braco.png",
                rawImage: true,
                measurementsUsed: ['Antebraço', 'Braço']
            },
            ai: {
                strength: antebracoPercentual >= 95
                    ? `Seu <span class='text-primary font-bold'>Antebraço</span> é um ponto forte de simetria.`
                    : undefined,
                suggestion: "Rosca inversa e extensão de punho ajudam a equilibrar o volume com o braço."
            }
        },
        // 5. Tríade
        {
            card: {
                title: "Tríade",
                badge: "A TRINDADE",
                metrics: [{ label: 'Meta', value: '100% Harmonia' }],
                currentValue: triadeScore.toFixed(1),
                valueUnit: "%",
                description: comparisonMode === 'mens'
                    ? "Tríade não é julgada na categoria Men's Physique."
                    : "Equilíbrio absoluto entre Pescoço, Braço e Panturrilha.",
                statusLabel: comparisonMode === 'mens' ? "N/A" : getStatus(triadeScore),
                userPosition: comparisonMode === 'mens' ? 0 : Math.round(triadeScore),
                goalPosition: 100,
                image: "/images/widgets/peitoral.png",
                rawImage: true,
                measurementsUsed: ['Pescoço', 'Braço', 'Panturrilha']
            },
            ai: {
                strength: comparisonMode !== 'mens' && triadeScore >= 95
                    ? `Sua <span class='text-primary font-bold'>Tríade Clássica</span> é perfeita. Simetria de elite.`
                    : undefined,
                suggestion: "Manter o equilíbrio é a chave do físico clássico."
            }
        },
        // 6. Cintura
        {
            card: {
                title: "Cintura",
                badge: "LINHA DE CINTURA",
                metrics: [
                    { label: 'Ratio Atual', value: cinturaRatio.toFixed(2) },
                    { label: 'Meta', value: cinturaTarget.toFixed(2) }
                ],
                currentValue: cinturaRatio.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: `${cinturaBaseLabel}. A base do V-Taper. Valor ideal: ${ideais.cintura.toFixed(1)}cm (atual: ${userMeasurements.cintura}cm).`,
                statusLabel: getStatus(cinturaPercentual),
                userPosition: Math.round(cinturaPercentual),
                goalPosition: 100,
                image: "/images/widgets/cintura.png",
                rawImage: true,
                measurementsUsed: ['Cintura', 'Base Estrutural']
            },
            ai: {
                weakness: userMeasurements.cintura > ideais.cintura
                    ? `Sua <strong class='text-orange-400'>Cintura</strong> está ${(userMeasurements.cintura - ideais.cintura).toFixed(1)}cm acima da meta ideal para ${methodLabel}.`
                    : undefined,
                suggestion: "Foque em exercícios de vácuo abdominal para fortalecer o transverso e afinar a linha."
            }
        },
        // 7. Coxa
        {
            card: {
                title: "Coxa",
                badge: "POTÊNCIA DE PERNAS",
                metrics: (comparisonMode !== 'mens' && ideais.coxa) ? [
                    { label: 'Ratio Atual', value: coxaRatio.toFixed(2) },
                    { label: 'Meta', value: coxaTarget.toFixed(2) }
                ] : [],
                currentValue: (comparisonMode === 'mens' || !ideais.coxa) ? "N/A" : coxaRatio.toFixed(2),
                valueLabel: (comparisonMode === 'mens' || !ideais.coxa) ? "" : "RATIO ATUAL",
                description: comparisonMode === 'mens' ? "Pernas não são julgadas nesta categoria." : `Desenvolvimento de quadríceps. Meta em CM: ${ideais.coxa?.toFixed(1)}cm (atual: ${userMeasurements.coxa}cm).`,
                statusLabel: (comparisonMode === 'mens' || !ideais.coxa) ? "NÃO JULGADO" : getStatus(coxaPercentual),
                userPosition: (comparisonMode === 'mens' || !ideais.coxa) ? 0 : Math.round(coxaPercentual),
                goalPosition: 100,
                image: "/images/widgets/coxa.png",
                rawImage: true,
                measurementsUsed: ['Coxa', 'Joelho']
            },
            ai: {
                strength: comparisonMode !== 'mens' && coxaPercentual >= 90
                    ? `Suas <span class='text-primary font-bold'>Coxas</span> possuem volume compatível com sua estrutura óssea.`
                    : undefined,
                suggestion: comparisonMode === 'mens' ? "Pernas cobertas por bermudas, foco total no tronco." : "Agachamento hack e extensora para detalhamento de quadríceps."
            }
        },
        // 8. Coxa vs Panturrilha
        {
            card: {
                title: "Coxa vs Panturrilha",
                badge: "SIMETRIA INFERIOR",
                metrics: (comparisonMode !== 'mens' && ideais.coxa) ? [
                    { label: 'Ratio Atual', value: legRatio.toFixed(2) },
                    { label: 'Meta', value: legTarget.toFixed(2) }
                ] : [],
                currentValue: (comparisonMode === 'mens' || !ideais.coxa) ? "N/A" : legRatio.toFixed(2),
                valueLabel: (comparisonMode === 'mens' || !ideais.coxa) ? "" : "RATIO ATUAL",
                description: `Proporção clássica entre membros inferiores. Meta ideal para ${methodLabel}: ${legTarget}.`,
                statusLabel: (comparisonMode === 'mens' || !ideais.coxa) ? "NÃO JULGADO" : getStatus(legPercentual),
                userPosition: Math.round(legPercentual),
                goalPosition: 100,
                image: "/images/widgets/leg-ratio.png",
                rawImage: true,
                measurementsUsed: ['Coxa', 'Panturrilha']
            },
            ai: {
                suggestion: "O equilíbrio entre coxa e panturrilha é o que define o 'flow' das pernas."
            }
        },
        // 9. Panturrilha
        {
            card: {
                title: "Panturrilha",
                badge: "DETALHAMENTO",
                metrics: [
                    { label: 'Ratio Atual', value: pantRatio.toFixed(2) },
                    { label: 'Meta', value: pantTarget.toFixed(2) }
                ],
                currentValue: pantRatio.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: `${pantBaseLabel}. Meta em CM: ${ideais.panturrilha.toFixed(1)}cm (atual: ${userMeasurements.panturrilha}cm).`,
                statusLabel: getStatus(pantPercentual),
                userPosition: Math.round(pantPercentual),
                goalPosition: 100,
                image: "/images/widgets/leg-ratio.png",
                rawImage: true,
                measurementsUsed: ['Panturrilha', 'Base de Proporção']
            },
            ai: {
                weakness: pantPercentual < 85
                    ? "Volume de panturrilha abaixo do ideal clássico."
                    : undefined,
                suggestion: "Realize panturrilha em pé com máxima extensão para atingir fibras mais profundas."
            }
        },
        // 10. Costas
        {
            card: {
                title: "Costas",
                badge: "AMPLITUDE V-TAPER",
                metrics: [
                    { label: 'Ratio Atual', value: costasRatio.toFixed(2) },
                    { label: 'Meta', value: costasTarget.toFixed(2) }
                ],
                currentValue: costasRatio.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: `Largura das dorsais (lat spread). Meta em CM: ${ideais.costas?.toFixed(1)}cm (atual: ${userMeasurements.costas}cm).`,
                statusLabel: getStatus(costasPercentual),
                userPosition: Math.round(costasPercentual),
                goalPosition: 100,
                image: "/images/widgets/shape-v.png",
                rawImage: true,
                measurementsUsed: ['Costas', 'Cintura']
            },
            ai: {
                strength: comparisonMode === 'open' && costasPercentual >= 90
                    ? `Sua <span class='text-primary font-bold'>Amplitude de Costas</span> é digna da categoria Open.`
                    : undefined,
                suggestion: "Puxadas frontais e remadas curvadas para ganhar largura e densidade nas dorsais."
            }
        }
    ];
};
