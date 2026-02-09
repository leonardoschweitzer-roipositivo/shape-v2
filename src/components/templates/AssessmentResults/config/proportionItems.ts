import type {
    Measurements,
    IdealMeasurements,
    ProportionItem,
    ComparisonMode,
    ProportionDifference
} from '../types';
import { calcularDiferenca } from '@/services/calculations';

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
    }
};

// Helper function to get status label
export const getStatus = (percentual: number): string => {
    if (percentual >= 98) return `IDEAL CLÁSSICO (${Math.round(percentual)}%)`;
    if (percentual >= 90) return `QUASE LÁ (${Math.round(percentual)}%)`;
    if (percentual >= 80) return `EM PROGRESSO (${Math.round(percentual)}%)`;
    if (percentual >= 60) return `DESENVOLVENDO (${Math.round(percentual)}%)`;
    return `INICIANDO (${Math.round(percentual)}%)`;
};

/**
 * Generates proportion items configuration based on user measurements and comparison mode
 */
export const getProportionItems = (
    userMeasurements: Measurements,
    ideais: IdealMeasurements,
    comparisonMode: ComparisonMode
): ProportionItem[] => {
    // Calculate differences for each proportion
    const diferencas: Record<string, ProportionDifference> = {};
    const campos = ['ombros', 'peito', 'braco', 'antebraco', 'cintura', 'coxa', 'panturrilha', 'pescoco', 'costas'];

    for (const campo of campos) {
        const ideal = ideais[campo as keyof typeof ideais];
        const atual = userMeasurements[campo as keyof typeof userMeasurements] as number;

        if (typeof ideal === 'number' && typeof atual === 'number') {
            diferencas[campo] = calcularDiferenca(atual, ideal);
        } else if (ideal === null) {
            // Caso de Men's Physique para coxa
            diferencas[campo] = { percentual: 0, necessario: 'manter', diferenca: 0 };
        }
    }

    const methodLabel = getMethodLabel(comparisonMode);

    // Calculate derived values
    const shapeVAtual = userMeasurements.ombros / userMeasurements.cintura;

    // Target Shape-V por categoria
    const shapeVTarget = comparisonMode === 'golden' ? 1.618 :
        comparisonMode === 'classic' ? 1.70 :
            comparisonMode === 'mens' ? 1.55 : 1.75;

    const shapeVPercentual = Math.min(100, (shapeVAtual / shapeVTarget) * 100);

    const triadeMedia = (userMeasurements.braco + userMeasurements.panturrilha + userMeasurements.pescoco) / 3;
    const triadeDesvio = (Math.abs(userMeasurements.braco - triadeMedia) +
        Math.abs(userMeasurements.panturrilha - triadeMedia) +
        Math.abs(userMeasurements.pescoco - triadeMedia)) / triadeMedia / 3;
    const triadeScore = Math.max(0, (1 - triadeDesvio) * 100);

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
                metrics: [{ label: methodLabel, value: `${ideais.peito.toFixed(1)}cm` }],
                currentValue: String(userMeasurements.peito),
                valueUnit: "CM",
                description: "Volume e densidade torácica em relação à estrutura óssea.",
                statusLabel: getStatus(diferencas.peito?.percentual || 0),
                userPosition: diferencas.peito?.percentual || 0,
                goalPosition: 100,
                image: "/images/widgets/peitoral.png",
                rawImage: true,
                measurementsUsed: ['Peitoral', 'Punho']
            },
            ai: {
                weakness: diferencas.peito?.necessario === 'aumentar'
                    ? `O <strong class='text-white'>Peitoral</strong> está em ${diferencas.peito?.percentual}% da meta. Volume torácico é fundamental para o V-Taper.`
                    : undefined,
                strength: diferencas.peito?.necessario !== 'aumentar'
                    ? `Seu <span class='text-primary font-bold'>Peitoral</span> atingiu a densidade ideal para o padrão ${methodLabel}.`
                    : undefined,
                suggestion: "Incorpore variações de supino inclinado para preencher a porção superior do peito."
            }
        },
        // 3. Braço
        {
            card: {
                title: "Braço",
                badge: "VOLUME MUSCULAR",
                metrics: [{ label: methodLabel, value: `${ideais.braco.toFixed(1)}cm` }],
                currentValue: String(userMeasurements.braco),
                valueUnit: "CM",
                description: comparisonMode === 'golden'
                    ? "Braço ideal baseado na estrutura do punho (2.52x)."
                    : `Braço ideal para ${methodLabel} escalado pela sua altura.`,
                statusLabel: getStatus(diferencas.braco?.percentual || 0),
                userPosition: diferencas.braco?.percentual || 0,
                goalPosition: 100,
                image: "/images/widgets/braco.png",
                rawImage: true,
                measurementsUsed: ['Braço', comparisonMode === 'golden' ? 'Punho' : 'Altura']
            },
            ai: {
                strength: `Seu <span class='text-primary font-bold'>Braço</span> de ${userMeasurements.braco}cm está em harmonia com sua estrutura física.`,
                suggestion: "Foque na cabeça longa do tríceps para adicionar volume lateral visível de frente."
            }
        },
        // 4. Antebraço
        {
            card: {
                title: "Antebraço",
                badge: "PROPORÇÃO #4",
                metrics: [{ label: methodLabel, value: `${ideais.antebraco.toFixed(1)}cm` }],
                currentValue: String(userMeasurements.antebraco),
                valueUnit: "CM",
                description: `Proporção ideal: ${comparisonMode === 'open' ? '78%' : '80%'} do braço.`,
                statusLabel: getStatus(diferencas.antebraco?.percentual || 0),
                userPosition: diferencas.antebraco?.percentual || 0,
                goalPosition: 100,
                image: "/images/widgets/braco.png",
                rawImage: true,
                measurementsUsed: ['Antebraço', 'Braço']
            },
            ai: {
                strength: (diferencas.antebraco?.percentual || 0) >= 95
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
                metrics: [{ label: methodLabel, value: `${ideais.cintura.toFixed(1)}cm` }],
                currentValue: String(userMeasurements.cintura),
                valueUnit: "CM",
                description: "A base do V-Taper. Quanto mais estreita, mais larga parece a dorsal.",
                statusLabel: userMeasurements.cintura <= ideais.cintura
                    ? `DENTRO DA META`
                    : `${(userMeasurements.cintura - ideais.cintura).toFixed(1)}cm acima`,
                userPosition: Math.min(100, Math.round((ideais.cintura / userMeasurements.cintura) * 100)),
                goalPosition: 100,
                image: "/images/widgets/cintura.png",
                rawImage: true,
                measurementsUsed: ['Cintura', comparisonMode === 'golden' ? 'Pélvis' : 'Altura']
            },
            ai: {
                weakness: userMeasurements.cintura > ideais.cintura
                    ? `Sua <strong class='text-orange-400'>Cintura</strong> está ${(userMeasurements.cintura - ideais.cintura).toFixed(1)}cm acima da meta ideal para ${methodLabel}.`
                    : undefined,
                suggestion: "Foque em exercícios de vácuo abdominal para fortalecer o transverso pulmonar e afinar a linha."
            }
        },
        // 7. Coxa
        {
            card: {
                title: "Coxa",
                badge: "POTÊNCIA DE PERNAS",
                metrics: ideais.coxa ? [{ label: methodLabel, value: `${ideais.coxa.toFixed(1)}cm` }] : [],
                currentValue: comparisonMode === 'mens' ? "N/A" : String(userMeasurements.coxa),
                valueUnit: comparisonMode === 'mens' ? "" : "CM",
                description: comparisonMode === 'mens' ? "Pernas não são julgadas nesta categoria." : "Desenvolvimento do quadríceps e isquiotibiais.",
                statusLabel: comparisonMode === 'mens' ? "NÃO JULGADO" : getStatus(diferencas.coxa?.percentual || 0),
                userPosition: comparisonMode === 'mens' ? 0 : (diferencas.coxa?.percentual || 0),
                goalPosition: 100,
                image: "/images/widgets/coxa.png",
                rawImage: true,
                measurementsUsed: ['Coxa', comparisonMode === 'golden' || comparisonMode === 'open' ? 'Joelho' : 'Cintura']
            },
            ai: {
                strength: comparisonMode !== 'mens' && (diferencas.coxa?.percentual || 0) >= 90
                    ? `Suas <span class='text-primary font-bold'>Coxas</span> possuem volume compatível com o tronco.`
                    : undefined,
                suggestion: comparisonMode === 'mens' ? "Pernas cobertas por bermudas, foco total no tronco." : "Agachamento hack e extensora para detalhamento de quadríceps."
            }
        },
        // 8. Coxa vs Panturrilha
        {
            card: {
                title: "Coxa vs Panturrilha",
                badge: "SIMETRIA INFERIOR",
                metrics: [{ label: 'Ratio Atual', value: (userMeasurements.coxa / userMeasurements.panturrilha).toFixed(2) }],
                currentValue: comparisonMode === 'mens' ? "N/A" : (userMeasurements.coxa / userMeasurements.panturrilha).toFixed(2),
                valueUnit: comparisonMode === 'mens' ? "" : ":1",
                description: `Proporção clássica de pernas. Meta: ${comparisonMode === 'open' ? '1.55' : '1.50'}.`,
                statusLabel: comparisonMode === 'mens' ? "NÃO JULGADO" : "PROPORÇÃO DE PERNA",
                userPosition: 90,
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
                metrics: [{ label: methodLabel, value: `${ideais.panturrilha.toFixed(1)}cm` }],
                currentValue: String(userMeasurements.panturrilha),
                valueUnit: "CM",
                description: "Desenvolvimento da panturrilha em relação à estrutura óssea ou volume do braço.",
                statusLabel: getStatus(diferencas.panturrilha?.percentual || 0),
                userPosition: diferencas.panturrilha?.percentual || 0,
                goalPosition: 100,
                image: "/images/widgets/leg-ratio.png",
                rawImage: true,
                measurementsUsed: ['Panturrilha', comparisonMode === 'golden' || comparisonMode === 'mens' ? 'Tornozelo' : 'Braço']
            },
            ai: {
                weakness: (diferencas.panturrilha?.percentual || 0) < 85
                    ? "Volume de panturrilha abaixo do ideal clássico."
                    : undefined,
                suggestion: "Realize panturrilha em pé com máxima extensão para atingir fibras mais profundas."
            }
        },
        // 10. Costas (NOVO v3.0)
        {
            card: {
                title: "Costas",
                badge: "AMPLITUDE V-TAPER",
                metrics: ideais.costas ? [{ label: methodLabel, value: `${ideais.costas.toFixed(1)}cm` }] : [],
                currentValue: ideais.costas ? String(userMeasurements.costas) : "N/A",
                valueUnit: ideais.costas ? "CM" : "",
                description: "Largura das dorsais (lat spread). Essencial para o V-Taper extremo.",
                statusLabel: ideais.costas ? getStatus(diferencas.costas?.percentual || 0) : "N/A",
                userPosition: ideais.costas ? (diferencas.costas?.percentual || 0) : 0,
                goalPosition: 100,
                image: "/images/widgets/shape-v.png",
                rawImage: true,
                measurementsUsed: ['Costas', 'Cintura']
            },
            ai: {
                strength: comparisonMode === 'open' && (diferencas.costas?.percentual || 0) >= 90
                    ? `Sua <span class='text-primary font-bold'>Amplitude de Costas</span> é digna da categoria Open.`
                    : undefined,
                suggestion: "Puxadas frontais e remadas curvadas para ganhar largura e densidade nas dorsais."
            }
        }
    ];
};
