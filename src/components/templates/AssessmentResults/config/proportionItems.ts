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
    const campos = ['ombros', 'peito', 'braco', 'antebraco', 'cintura', 'coxa', 'panturrilha', 'pescoco'];

    for (const campo of campos) {
        const ideal = ideais[campo as keyof typeof ideais];
        const atual = userMeasurements[campo as keyof typeof userMeasurements] as number;

        if (typeof ideal === 'number' && typeof atual === 'number') {
            diferencas[campo] = calcularDiferenca(atual, ideal);
        }
    }

    const methodLabel = getMethodLabel(comparisonMode);

    // Calculate derived values
    const shapeVAtual = userMeasurements.ombros / userMeasurements.cintura;
    const shapeVPercentual = Math.min(100, (shapeVAtual / 1.618) * 100);

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
                    { label: 'Ombros', value: `${userMeasurements.ombros}cm` },
                    { label: 'Cintura', value: `${userMeasurements.cintura}cm` }
                ],
                currentValue: shapeVAtual.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: "V-Taper Index: A proporção estética entre a largura dos ombros e a circunferência da cintura, definindo o 'Shape em V'.",
                statusLabel: getStatus(shapeVPercentual),
                userPosition: Math.round(shapeVPercentual),
                goalPosition: 100,
                image: "/images/widgets/shape-v.png",
                rawImage: true,
                measurementsUsed: ['Ombros', 'Cintura']
            },
            ai: {
                strength: `Seu <span class='text-primary font-bold'>Shape-V (${shapeVAtual.toFixed(2)})</span> ${shapeVPercentual >= 90 ? 'está excepcional' : 'está em bom progresso'}. A relação ombro-cintura é ${shapeVPercentual >= 85 ? 'seu maior trunfo estético' : 'uma área de foco'} no momento.`,
                suggestion: "Mantenha o foco em deltoides laterais para preservar essa vantagem visual."
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
                description: "A base do físico. Largura e espessura torácica.",
                statusLabel: getStatus(diferencas.peito?.percentual || 0),
                userPosition: diferencas.peito?.percentual || 0,
                goalPosition: 100,
                image: "/images/widgets/peitoral.png",
                rawImage: true,
                measurementsUsed: ['Peitoral', 'Punho']
            },
            ai: {
                weakness: diferencas.peito?.necessario === 'aumentar'
                    ? `A proporção de <strong class='text-white'>Peitoral</strong> está em ${diferencas.peito?.percentual}%, indicando que o volume do tronco ainda não acompanha a largura dos seus ombros.`
                    : undefined,
                strength: diferencas.peito?.necessario !== 'aumentar'
                    ? `Seu <span class='text-primary font-bold'>Peitoral</span> está bem desenvolvido em relação ao método ${comparisonMode === 'golden' ? 'Golden Ratio' : comparisonMode === 'classic' ? 'Classic Physique' : "Men's Physique"}.`
                    : undefined,
                suggestion: "Priorize supinos com halteres focando na amplitude máxima e crossover para detalhamento."
            }
        },
        // 3. Braço vs Punho
        {
            card: {
                title: "Braço vs Punho",
                badge: "POTENCIAL GENÉTICO",
                metrics: [{ label: 'Ratio Atual', value: (userMeasurements.braco / userMeasurements.punho).toFixed(2) }],
                currentValue: (userMeasurements.braco / userMeasurements.punho).toFixed(2),
                valueUnit: ":1",
                description: "Relação entre circunferência do punho e tamanho do braço. Indica potencial de massa.",
                statusLabel: `${(userMeasurements.braco / userMeasurements.punho).toFixed(2)} (Meta: 2.52)`,
                userPosition: Math.min(100, Math.round((userMeasurements.braco / userMeasurements.punho) / 2.52 * 100)),
                goalPosition: 100,
                image: "/images/widgets/braco.png",
                rawImage: true,
                measurementsUsed: ['Braço', 'Punho']
            },
            ai: {
                strength: `Sua estrutura de <span class='text-primary font-bold'>punho fino</span> (${userMeasurements.punho}cm) permite que seus braços pareçam maiores visualmente.`,
                suggestion: "Aproveite essa vantagem estrutural para maximizar o pico do bíceps."
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
                description: "Volume do antebraço em relação ao braço. Proporção ideal: 80% do braço.",
                statusLabel: getStatus(diferencas.antebraco?.percentual || 0),
                userPosition: diferencas.antebraco?.percentual || 0,
                goalPosition: 100,
                image: "/images/widgets/braco.png",
                rawImage: true,
                measurementsUsed: ['Antebraço', 'Braço']
            },
            ai: {
                strength: (diferencas.antebraco?.percentual || 0) >= 90
                    ? `Seu <span class='text-primary font-bold'>Antebraço</span> está em excelente proporção (${(userMeasurements.antebraco / userMeasurements.braco * 100).toFixed(0)}% do braço).`
                    : undefined,
                weakness: (diferencas.antebraco?.percentual || 0) < 90
                    ? `O antebraço está em ${diferencas.antebraco?.percentual}% da meta. A proporção atual é de ${(userMeasurements.antebraco / userMeasurements.braco * 100).toFixed(0)}% (meta: 80%).`
                    : undefined,
                suggestion: "Trabalhe rosca martelo e rosca inversa para desenvolver os braquiorradiais."
            }
        },
        // 5. Tríade
        {
            card: {
                title: "Tríade",
                badge: "A TRINDADE",
                metrics: [{ label: 'Meta', value: '100%' }],
                currentValue: triadeScore.toFixed(1),
                valueUnit: "%",
                description: comparisonMode === 'mens'
                    ? "Tríade não é prioridade na categoria Men's Physique."
                    : "A Tríade: Pescoço, Braço e Panturrilha em harmonia perfeita.",
                statusLabel: comparisonMode === 'mens' ? "N/A (Men's Physique)" : getStatus(triadeScore),
                userPosition: comparisonMode === 'mens' ? 50 : Math.round(triadeScore),
                goalPosition: 100,
                image: "/images/widgets/peitoral.png",
                rawImage: true,
                measurementsUsed: ['Pescoço', 'Braço', 'Panturrilha']
            },
            ai: {
                strength: comparisonMode !== 'mens' && triadeScore >= 90
                    ? `Sua <span class='text-primary font-bold'>Tríade</span> está extremamente equilibrada, o que garante um visual harmonioso e clássico.`
                    : undefined,
                weakness: comparisonMode !== 'mens' && triadeScore < 90
                    ? `A Tríade está em ${triadeScore.toFixed(0)}%. Trabalhe o equilíbrio entre braço (${userMeasurements.braco}cm), panturrilha (${userMeasurements.panturrilha}cm) e pescoço (${userMeasurements.pescoco}cm).`
                    : undefined,
                suggestion: comparisonMode === 'mens'
                    ? "Na categoria Men's Physique, a Tríade não é prioridade. Foque em deltoides e V-taper."
                    : "Manutenção de carga é suficiente para garantir que essa proporção não se perca."
            }
        },
        // 6. Cintura
        {
            card: {
                title: "Cintura",
                badge: "LINHA DE CINTURA",
                metrics: [{ label: methodLabel, value: `${ideais.cintura.toFixed(1)}cm` }],
                currentValue: String(userMeasurements.cintura),
                valueUnit: "cm",
                description: "Ponto focal da estética. Estreita para acentuar o V-Shape.",
                statusLabel: userMeasurements.cintura <= ideais.cintura
                    ? `IDEAL (${Math.round((ideais.cintura / userMeasurements.cintura) * 100)}%)`
                    : `${(userMeasurements.cintura - ideais.cintura).toFixed(1)}cm acima`,
                userPosition: Math.min(100, Math.round((ideais.cintura / userMeasurements.cintura) * 100)),
                goalPosition: 100,
                image: "/images/widgets/cintura.png",
                rawImage: true,
                measurementsUsed: ['Cintura', comparisonMode === 'golden' ? 'Pélvis' : 'Altura']
            },
            ai: {
                strength: userMeasurements.cintura <= ideais.cintura
                    ? `Sua cintura está <span class='text-primary font-bold'>fina e controlada</span>, o que potencializa visualmente a largura dos seus ombros.`
                    : undefined,
                weakness: userMeasurements.cintura > ideais.cintura
                    ? `A cintura está <strong class='text-orange-400'>${(userMeasurements.cintura - ideais.cintura).toFixed(1)}cm acima</strong> da meta ${methodLabel}. ${comparisonMode === 'classic' ? 'Classic Physique exige cintura extremamente apertada.' : ''}`
                    : undefined,
                suggestion: "Evite treinos de oblíquos com muita carga para não alargar a cintura."
            }
        },
        // 7. Coxa vs Joelho
        {
            card: {
                title: "Coxa vs Joelho",
                badge: "ESTÉTICA DE PERNA",
                metrics: [{ label: 'Ratio Atual', value: (userMeasurements.coxa / userMeasurements.joelho).toFixed(2) }],
                currentValue: (userMeasurements.coxa / userMeasurements.joelho).toFixed(2),
                valueUnit: ":1",
                description: "Proporção que define o formato de 'gota' da coxa em relação ao joelho.",
                statusLabel: comparisonMode === 'mens' ? 'N/A' : `${Math.round((userMeasurements.coxa / userMeasurements.joelho) / 1.75 * 100)}% (Meta: 1.75)`,
                userPosition: Math.min(100, Math.round((userMeasurements.coxa / userMeasurements.joelho) / 1.75 * 100)),
                goalPosition: 100,
                image: "/images/widgets/coxa.png",
                rawImage: true,
                measurementsUsed: ['Coxa', 'Joelho']
            },
            ai: {
                weakness: (userMeasurements.coxa / userMeasurements.joelho) < 1.6
                    ? "A proporção <strong class='text-white'>Coxa/Joelho</strong> pode melhorar com mais volume no vasto medial."
                    : undefined,
                strength: (userMeasurements.coxa / userMeasurements.joelho) >= 1.6
                    ? "A proporção <span class='text-primary font-bold'>Coxa/Joelho</span> está boa, criando o formato de 'gota' desejado."
                    : undefined,
                suggestion: "Agachamentos com base fechada podem ajudar a enfatizar o vasto medial."
            }
        },
        // 8. Coxa vs Panturrilha
        {
            card: {
                title: "Coxa vs Panturrilha",
                badge: "LEG GOLDEN RATIO",
                metrics: [{ label: 'Ratio Atual', value: (userMeasurements.coxa / userMeasurements.panturrilha).toFixed(2) }],
                currentValue: (userMeasurements.coxa / userMeasurements.panturrilha).toFixed(2),
                valueUnit: ":1",
                description: "Equilíbrio entre a porção superior e inferior da perna.",
                statusLabel: comparisonMode === 'mens' ? "N/A (Men's Physique)" : "PROPORÇÃO DE PERNA",
                userPosition: 95,
                goalPosition: 100,
                image: "/images/widgets/leg-ratio.png",
                rawImage: true,
                measurementsUsed: ['Coxa', 'Panturrilha']
            },
            ai: {
                strength: "A relação entre coxa e panturrilha está <span class='text-primary font-bold'>muito boa</span>, criando um fluxo visual contínuo.",
                suggestion: "Trabalhe o sóleo para dar mais volume lateral à panturrilha e destacar a separação."
            }
        },
        // 9. Panturrilha vs Tornozelo
        {
            card: {
                title: "Panturrilha vs Tornozelo",
                badge: "PROPORÇÃO #9",
                metrics: [{ label: methodLabel, value: `${ideais.panturrilha.toFixed(1)}cm` }],
                currentValue: String(userMeasurements.panturrilha),
                valueUnit: "CM",
                description: comparisonMode === 'golden'
                    ? "Panturrilha ideal: Tornozelo × 1.92. Tornozelos finos criam ilusão de volume."
                    : comparisonMode === 'classic'
                        ? "Panturrilha ideal: Braço × 0.96. Deve ter tamanho similar ao braço."
                        : "Estética geral, menos ênfase na categoria Men's Physique.",
                statusLabel: getStatus(diferencas.panturrilha?.percentual || 0),
                userPosition: diferencas.panturrilha?.percentual || 0,
                goalPosition: 100,
                image: "/images/widgets/leg-ratio.png",
                rawImage: true,
                measurementsUsed: ['Panturrilha', 'Tornozelo']
            },
            ai: {
                strength: (diferencas.panturrilha?.percentual || 0) >= 90
                    ? `Sua <span class='text-primary font-bold'>Panturrilha</span> está em excelente proporção para o método ${methodLabel}.`
                    : `Seus <span class='text-primary font-bold'>tornozelos finos</span> (${userMeasurements.tornozelo}cm) são uma grande vantagem genética.`,
                weakness: (diferencas.panturrilha?.percentual || 0) < 85
                    ? `A panturrilha está em ${diferencas.panturrilha?.percentual}% da meta. Faltam <strong class='text-orange-400'>${diferencas.panturrilha?.diferenca}cm</strong>.`
                    : undefined,
                suggestion: "Foque na porção gastrocnêmia para criar um formato de diamante perfeito."
            }
        }
    ];
};
