import type {
    Measurements,
    IdealMeasurements,
    ProportionItem,
    ComparisonMode,
    ProportionDifference
} from '../types';
import { calcularDiferenca } from '@/services/calculations';
import {
    FEMALE_GOLDEN_RATIO,
    BIKINI_CONSTANTS,
    WELLNESS_CONSTANTS,
    FIGURE_CONSTANTS
} from '@/services/calculations';

// Helper function to get status label
const getStatus = (percentual: number): string => {
    if (percentual >= 98) return `IDEAL CLÁSSICO (${Math.round(percentual)}%)`;
    if (percentual >= 90) return `QUASE LÁ (${Math.round(percentual)}%)`;
    if (percentual >= 80) return `EM PROGRESSO (${Math.round(percentual)}%)`;
    if (percentual >= 60) return `DESENVOLVENDO (${Math.round(percentual)}%)`;
    return `INICIANDO (${Math.round(percentual)}%)`;
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
 * Generates proportion items configuration for female athletes
 */
export const getFemaleProportionItems = (
    userMeasurements: Measurements,
    ideais: IdealMeasurements,
    comparisonMode: ComparisonMode
): ProportionItem[] => {

    const diferencas: Record<string, ProportionDifference> = {};
    const campos = ['ombros', 'busto', 'cintura', 'quadril', 'coxa', 'panturrilha', 'braco'];

    // Map 'busto' to 'peito' in measurements if needed, or ensure userMeasurements has busto.
    // Assuming userMeasurements.peito is used as busto for now or we expect busto property.
    // In the types update we added 'peito' but not explictly 'busto' on Measurements, 
    // but we can treat 'peito' as 'busto' for simplicity or access it if added.
    // Let's safe access.

    // Note: In the Types step, I added 'peito' to Measurements and 'busto' to IdealMeasurements.
    // Ideally 'peito' in Measurements represents circumference of chest/bust.

    const measurements = {
        ...userMeasurements,
        busto: userMeasurements.peito // Alias for clarity
    };

    for (const campo of campos) {
        // @ts-ignore
        const ideal = ideais[campo];
        // @ts-ignore
        const atual = measurements[campo];

        if (typeof ideal === 'number' && typeof atual === 'number') {
            diferencas[campo] = calcularDiferenca(atual, ideal);
        }
    }

    const methodLabel = getMethodLabel(comparisonMode);

    // 1. WHR (Waist-to-Hip Ratio) - The most important metric
    const whrAtual = measurements.cintura / measurements.quadril;
    let whrTarget = FEMALE_GOLDEN_RATIO.WHR;
    if (comparisonMode === 'bikini') whrTarget = BIKINI_CONSTANTS.WHR_TARGET;
    if (comparisonMode === 'wellness') whrTarget = WELLNESS_CONSTANTS.WHR_TARGET;
    if (comparisonMode === 'figure') whrTarget = FIGURE_CONSTANTS.WHR_TARGET;

    // Invert calculation for score: closer to target is better
    const whrDiff = Math.abs(whrAtual - whrTarget);
    const whrScore = Math.max(0, 100 - (whrDiff * 200)); // Rough scoring

    // 2. Hourglass Index
    const hourglassAtual = (measurements.peito + measurements.quadril) / (2 * measurements.cintura);
    let hourglassTarget = FEMALE_GOLDEN_RATIO.HOURGLASS_INDEX;
    if (comparisonMode === 'bikini') hourglassTarget = BIKINI_CONSTANTS.HOURGLASS_TARGET;
    if (comparisonMode === 'wellness') hourglassTarget = WELLNESS_CONSTANTS.HOURGLASS_TARGET;

    const hgScore = Math.max(0, 100 - (Math.abs(hourglassAtual - hourglassTarget) * 100));

    return [
        // 1. WHR - Waist to Hip Ratio (Metrics #1)
        {
            card: {
                title: "WHR (Cintura-Quadril)",
                badge: "MÉTRICA PRINCIPAL",
                metrics: [
                    { label: 'Ratio Atual', value: whrAtual.toFixed(2) },
                    { label: 'Meta', value: whrTarget.toFixed(2) }
                ],
                currentValue: whrAtual.toFixed(2),
                valueLabel: "RATIO ATUAL",
                description: `A proporção áurea feminina. Para ${methodLabel}, o ideal é ${whrTarget}.`,
                statusLabel: getStatus(whrScore),
                userPosition: Math.round(whrScore),
                goalPosition: 100,
                image: "/images/widgets/cintura.png", // Reuse appropriate image
                rawImage: true,
                measurementsUsed: ['Cintura', 'Quadril']
            },
            ai: {
                strength: whrScore >= 90 ? `Seu <span class='text-primary font-bold'>WHR</span> está perfeito para a categoria.` : undefined,
                suggestion: "Mantenha a cintura controlada e foque no desenvolvimento de glúteos para melhorar o ratio."
            }
        },
        // 2. Hourglass Index
        {
            card: {
                title: "Índice Ampulheta",
                badge: "HARMONIA",
                metrics: [
                    { label: 'Índice Atual', value: hourglassAtual.toFixed(2) },
                    { label: 'Meta', value: hourglassTarget.toFixed(2) }
                ],
                currentValue: hourglassAtual.toFixed(2),
                valueUnit: "",
                description: "Equilíbrio entre Busto e Quadril em relação à Cintura.",
                statusLabel: getStatus(hgScore),
                userPosition: Math.round(hgScore),
                goalPosition: 100,
                image: "/images/widgets/shape-v.png", // Reuse V-shape image as it implies torso shape
                rawImage: true,
                measurementsUsed: ['Busto', 'Quadril', 'Cintura']
            },
            ai: {
                strength: hgScore >= 90 ? "Formato de ampulheta (X-Shape) bem estabelecido." : undefined,
                suggestion: "Busque equilibrar o volume de busto/costas com o quadril."
            }
        },
        // 3. Glúteos (Destaque para Wellness/Bikini)
        {
            card: {
                title: "Glúteos",
                badge: "VOLUME INFERIOR",
                metrics: ideais.gluteo ? [{ label: 'Meta', value: `${ideais.gluteo.toFixed(1)}cm` }] : [],
                currentValue: ideais.gluteo ? String(ideais.gluteo) : "N/A", // Placeholder since we don't have glute measurement in standard set yet, using calculation
                valueUnit: "CM",
                description: comparisonMode === 'wellness'
                    ? "Ponto focal da categoria Wellness."
                    : "Proporção de glúteos em relação à cintura.",
                statusLabel: "EM DESENVOLVIMENTO",
                userPosition: 70, // Mock
                goalPosition: 100,
                image: "/images/widgets/coxa.png", // Reuse
                rawImage: true,
                measurementsUsed: ['Quadril', 'Cintura']
            },
            ai: {
                suggestion: "Elevação pélvica e agachamento profundo para máxima ativação."
            }
        },
        // 4. Cintura
        {
            card: {
                title: "Cintura",
                badge: "LINHA CENTRAL",
                metrics: [{ label: 'Meta', value: `${ideais.cintura.toFixed(1)}cm` }],
                currentValue: String(measurements.cintura),
                valueUnit: "CM",
                description: "Cintura fina é essencial para acentuar as curvas.",
                statusLabel: getStatus(diferencas.cintura?.percentual || 0),
                userPosition: diferencas.cintura?.percentual || 0,
                goalPosition: 100,
                image: "/images/widgets/cintura.png",
                rawImage: true,
                measurementsUsed: ['Cintura']
            },
            ai: {
                weakness: measurements.cintura > ideais.cintura ? "Cintura acima do ideal estético." : undefined,
                suggestion: "Vácuo abdominal e controle de dieta."
            }
        },
        // 5. Coxas
        {
            card: {
                title: "Coxas",
                badge: "DESENVOLVIMENTO",
                metrics: ideais.coxa ? [{ label: 'Meta', value: `${ideais.coxa.toFixed(1)}cm` }] : [],
                currentValue: String(measurements.coxa),
                valueUnit: "CM",
                description: "Volume de pernas harmonioso com o quadril.",
                statusLabel: getStatus(diferencas.coxa?.percentual || 0),
                userPosition: diferencas.coxa?.percentual || 0,
                goalPosition: 100,
                image: "/images/widgets/coxa.png",
                rawImage: true,
                measurementsUsed: ['Coxa']
            },
            ai: {
                suggestion: "Varie entre exercícios compostos e isoladores."
            }
        },
        // 6. Ombros (Simetria)
        {
            card: {
                title: "Ombros",
                badge: "ESTRUTURA SUPERIOR",
                metrics: [{ label: 'Meta', value: `${ideais.ombros.toFixed(1)}cm` }],
                currentValue: String(measurements.ombros),
                valueUnit: "CM",
                description: comparisonMode === 'wellness'
                    ? "Menos dominantes que o quadril."
                    : "Largura para criar a ilusão de cintura mais fina.",
                statusLabel: getStatus(diferencas.ombros?.percentual || 0),
                userPosition: diferencas.ombros?.percentual || 0,
                goalPosition: 100,
                image: "/images/widgets/shape-v.png",
                rawImage: true,
                measurementsUsed: ['Ombros', 'Quadril']
            },
            ai: {
                suggestion: "Elevações laterais para 'caps' de ombro mais desenhados."
            }
        }
    ];
};
