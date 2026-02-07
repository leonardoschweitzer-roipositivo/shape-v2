import React, { useState, useMemo } from 'react';
import {
    Download,
    Share2,
    Save, // Added Save icon
    Trophy,
    Bot,
    Dumbbell,
    Utensils,
    ChevronLeft,
    Sparkles,
    Accessibility,
    Hand,
    Activity,
    Footprints
} from 'lucide-react';
import { GlassPanel } from './GlassPanel';
import { RadarChart, BodyFatGauge, AsymmetryRadar } from './AssessmentCharts';
import { MassCard, ProportionCard, AsymmetryCard, ScoreWidget, AiAnalysisWidget, ProportionAiAnalysisCard, AiInsightCard } from './AssessmentCards';
import {
    calcularProportions,
    MOCK_USER_MEASUREMENTS,
    getMethodLabel,
    getStatusLabel
} from '../proportionCalculator';
import { ComparisonMode } from '../types/proportions';

interface AssessmentResultsProps {
    onBack: () => void;
}

// --- TABS CONTENT ---

const DiagnosticTab = () => (
    <div className="flex flex-col gap-6 animate-fade-in-up">
        {/* Top Row: 3 Main Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[340px]">
            {/* 1. General Score */}
            <ScoreWidget score={80} label="Pontos" change="+5%" />

            {/* 2. Radar Chart */}
            <GlassPanel className="rounded-2xl relative">
                <RadarChart />
            </GlassPanel>

            {/* 3. Body Fat */}
            <GlassPanel className="rounded-2xl relative">
                <BodyFatGauge />
            </GlassPanel>
        </div>

        {/* Middle Row: Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MassCard label="Peso Atual" value={88.5} unit="kg" trend={1.2} color="green" />
            <MassCard label="Peso Magro" value={77.1} unit="kg" trend={0.8} color="purple" />
            <MassCard label="Peso Gordo" value={11.4} unit="kg" trend={-0.5} color="red" />
        </div>

        {/* Bottom Row: AI Analysis */}
        <AiAnalysisWidget
            analysis={
                <>
                    Com base na análise de simetria bilateral, o cliente apresenta um <span className="text-white font-medium">desequilíbrio leve no deltoide direito</span> em relação ao esquerdo (aproximadamente 4% de diferença em volume). Recomenda-se adicionar 2 séries de elevação lateral unilateral para correção. O percentual de gordura (12.9%) está em um ponto ideal para iniciar a fase de <span className="text-primary font-bold">bulking limpo</span>, focando em progressão de carga nos compostos principais.
                </>
            }
        />
    </div>
);

const GoldenRatioTab = () => {
    const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('golden');

    // Use mock data for now - in future this will come from assessment context
    const userMeasurements = MOCK_USER_MEASUREMENTS;

    // Calculate proportions dynamically based on selected mode
    const proportionData = useMemo(() =>
        calcularProportions(userMeasurements, comparisonMode),
        [comparisonMode]
    );

    // Helper to get method label
    const methodLabel = getMethodLabel(comparisonMode);

    // Helper to get status
    const getStatus = (percentual: number) => {
        if (percentual >= 98) return `IDEAL CLÁSSICO (${Math.round(percentual)}%)`;
        if (percentual >= 90) return `QUASE LÁ (${Math.round(percentual)}%)`;
        if (percentual >= 80) return `EM PROGRESSO (${Math.round(percentual)}%)`;
        if (percentual >= 60) return `DESENVOLVENDO (${Math.round(percentual)}%)`;
        return `INICIANDO (${Math.round(percentual)}%)`;
    };

    // Get calculated values
    const { ideais, diferencas } = proportionData;

    // Calculate derived values
    const shapeVAtual = userMeasurements.ombros / userMeasurements.cintura;
    const shapeVPercentual = Math.min(100, (shapeVAtual / 1.618) * 100);

    const triadeMedia = (userMeasurements.braco + userMeasurements.panturrilha + userMeasurements.pescoco) / 3;
    const triadeDesvio = (Math.abs(userMeasurements.braco - triadeMedia) +
        Math.abs(userMeasurements.panturrilha - triadeMedia) +
        Math.abs(userMeasurements.pescoco - triadeMedia)) / triadeMedia / 3;
    const triadeScore = Math.max(0, (1 - triadeDesvio) * 100);

    const proportionItems = [
        {
            card: {
                title: "Shape-V",
                badge: "ESCALA SHAPE-V",
                metrics: [{ label: 'Ombros', value: `${userMeasurements.ombros}cm` }, { label: 'Cintura', value: `${userMeasurements.cintura}cm` }],
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
        {
            card: {
                title: "Braço",
                badge: "BÍCEPS FLEXIONADO",
                metrics: [{ label: methodLabel, value: `${ideais.braco.toFixed(1)}cm` }],
                currentValue: String(userMeasurements.braco),
                valueUnit: "CM",
                description: "Volume do braço flexionado. Simetria com pescoço e panturrilha.",
                statusLabel: getStatus(diferencas.braco?.percentual || 0),
                userPosition: diferencas.braco?.percentual || 0,
                goalPosition: 100,
                image: "/images/widgets/braco.png",
                rawImage: true,
                measurementsUsed: ['Braço', comparisonMode === 'golden' ? 'Punho' : 'Altura']
            },
            ai: {
                strength: (diferencas.braco?.percentual || 0) >= 90
                    ? `Volume de braço está em <span class='text-primary font-bold'>excelente proporção</span> para o método ${comparisonMode === 'golden' ? 'Golden Ratio' : comparisonMode === 'classic' ? 'Classic Physique' : "Men's Physique"}.`
                    : undefined,
                weakness: (diferencas.braco?.percentual || 0) < 90
                    ? `O braço está em ${diferencas.braco?.percentual}% da meta. Faltam <strong class='text-orange-400'>${diferencas.braco?.diferenca}cm</strong> para a meta ${methodLabel}.`
                    : undefined,
                suggestion: "Foque em exercícios de pico de bíceps para melhorar a estética quando contraído."
            }
        },
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
        {
            card: {
                title: "Coxa",
                badge: comparisonMode === 'mens' ? "NÃO JULGADA" : "COXAS",
                metrics: [{ label: methodLabel, value: ideais.coxa !== null ? `${ideais.coxa.toFixed(1)}cm` : 'N/A' }],
                currentValue: comparisonMode === 'mens' ? 'N/A' : String(userMeasurements.coxa),
                valueUnit: comparisonMode === 'mens' ? '' : "CM",
                description: comparisonMode === 'mens'
                    ? "Coxa não é julgada na categoria Men's Physique (usa board shorts)."
                    : "Volume superior. Fluxo para proporção total do quadril ao joelho.",
                statusLabel: comparisonMode === 'mens'
                    ? "N/A (Board Shorts)"
                    : getStatus(diferencas.coxa?.percentual || 0),
                userPosition: comparisonMode === 'mens' ? 50 : (diferencas.coxa?.percentual || 0),
                goalPosition: 100,
                image: "/images/widgets/coxa.png",
                rawImage: true,
                measurementsUsed: ['Coxa', comparisonMode === 'golden' ? 'Joelho' : 'Cintura']
            },
            ai: {
                strength: comparisonMode === 'mens'
                    ? "Na categoria Men's Physique, as coxas são cobertas por board shorts e não são julgadas."
                    : (diferencas.coxa?.percentual || 0) >= 90
                        ? `Suas coxas estão em <span class='text-primary font-bold'>excelente proporção</span>.`
                        : undefined,
                weakness: comparisonMode !== 'mens' && (diferencas.coxa?.percentual || 0) < 90
                    ? `O volume de coxa está bom, mas ainda <strong class='text-orange-400'>${diferencas.coxa?.diferenca}cm abaixo</strong> da meta ideal.`
                    : undefined,
                suggestion: comparisonMode === 'mens'
                    ? "Foque no upper body e mantenha pernas proporcionais ao conjunto."
                    : "Intensifique o treino de pernas com agachamentos profundos e leg press pesado."
            }
        },
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
        {
            card: {
                title: "Panturrilha vs Tornozelo",
                badge: "HIGH CALVES",
                metrics: [{ label: 'Ratio Atual', value: (userMeasurements.panturrilha / userMeasurements.tornozelo).toFixed(2) }],
                currentValue: (userMeasurements.panturrilha / userMeasurements.tornozelo).toFixed(2),
                valueUnit: ":1",
                description: "Tornozelos finos criam a ilusão de panturrilhas maiores (High Calves).",
                statusLabel: `${Math.round((userMeasurements.panturrilha / userMeasurements.tornozelo) / 1.92 * 100)}% (Meta: 1.92)`,
                userPosition: Math.min(100, Math.round((userMeasurements.panturrilha / userMeasurements.tornozelo) / 1.92 * 100)),
                goalPosition: 100,
                image: "/images/widgets/leg-ratio.png",
                rawImage: true,
                measurementsUsed: ['Panturrilha', 'Tornozelo']
            },
            ai: {
                strength: `Seus <span class='text-primary font-bold'>tornozelos finos</span> (${userMeasurements.tornozelo}cm) são uma grande vantagem genética.`,
                suggestion: "Foque na porção gastrocnêmia para criar um formato de diamante perfeito."
            }
        }
    ];

    return (
        <div className="flex flex-col gap-8 animate-fade-in-up w-full">
            {/* Control Bar */}
            <div className="flex justify-end">
                <div className="flex bg-[#0A0F1C] border border-white/10 rounded-lg p-1">
                    <button
                        onClick={() => setComparisonMode('golden')}
                        className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${comparisonMode === 'golden' ? 'bg-[#1E293B] text-white shadow-sm border border-white/5' : 'text-gray-500 hover:text-white'}`}
                    >
                        {comparisonMode === 'golden' && <Sparkles size={12} className="text-primary" />}
                        Golden Ratio
                    </button>
                    <button
                        onClick={() => setComparisonMode('classic')}
                        className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${comparisonMode === 'classic' ? 'bg-[#1E293B] text-white shadow-sm border border-white/5' : 'text-gray-500 hover:text-white'}`}
                    >
                        Classic Physique
                    </button>
                    <button
                        onClick={() => setComparisonMode('mens')}
                        className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${comparisonMode === 'mens' ? 'bg-[#1E293B] text-white shadow-sm border border-white/5' : 'text-gray-500 hover:text-white'}`}
                    >
                        Men's Physique
                    </button>
                </div>
            </div>

            {/* Widgets Pairs */}
            <div className="flex flex-col gap-8">
                {proportionItems.map((item, index) => (
                    <div key={index}>
                        <div className="flex flex-col lg:flex-row gap-6 w-full items-stretch">
                            {/* Left: Proportion Card */}
                            <div className="flex-1 min-w-0">
                                <ProportionCard {...item.card} />
                            </div>

                            {/* Right: AI Analysis Card (Matched Height) */}
                            <div className="w-full lg:w-80 flex-shrink-0">
                                <ProportionAiAnalysisCard
                                    strength={item.ai.strength}
                                    weakness={item.ai.weakness}
                                    suggestion={item.ai.suggestion}
                                />
                            </div>
                        </div>

                        {/* Divider between rows (not after the last one) */}
                        {index < proportionItems.length - 1 && (
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent mt-8"></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const AsymmetryTab = () => (
    <div className="flex flex-col lg:flex-row gap-6 animate-fade-in-up h-full">
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
            <AsymmetryCard icon={<Accessibility size={20} />} title="BRAÇO" subtitle="BÍCEPS RELAXADO" leftVal="41,0" rightVal="44,5" diff="+3,5" status="high" />
            <AsymmetryCard icon={<Hand size={20} />} title="ANTEBRAÇO" subtitle="PORÇÃO MEDIAL" leftVal="32,0" rightVal="32,2" diff="+0,2" status="symmetrical" />
            <AsymmetryCard icon={<Activity size={20} />} title="COXA" subtitle="MEDIDA PROXIMAL" leftVal="62,0" rightVal="60,5" diff="+1,5" status="moderate" />
            <AsymmetryCard icon={<Footprints size={20} />} title="PANTURRILHA" subtitle="GASTROCNÊMIO" leftVal="38,0" rightVal="38,0" diff="0,0" status="symmetrical" />
        </div>

        <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <GlassPanel className="p-6 rounded-2xl border border-white/5 flex flex-col items-center flex-1 min-h-[400px]">
                <h4 className="text-white font-bold text-sm tracking-wide self-start mb-6">RADAR DE DESEQUILÍBRIO</h4>
                <div className="flex-1 w-full flex items-center justify-center">
                    <AsymmetryRadar />
                </div>
                <div className="flex gap-6 mt-6">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-secondary"></span>
                        <span className="text-xs text-gray-400 font-medium">Lado Esquerdo</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-primary"></span>
                        <span className="text-xs text-gray-400 font-medium">Lado Direito</span>
                    </div>
                </div>
            </GlassPanel>

            <AiInsightCard
                type="AI Insight"
                title="Dominância do Hemicorpo Direito"
                description={
                    <>
                        Identificamos uma assimetria significativa no <strong className="text-orange-400">Braço Direito (+3,5cm)</strong> que pode estar relacionada à compensação em exercícios de empurrar.
                    </>
                }
            />
        </div>
    </div>
);

// --- MAIN COMPONENT ---

export const AssessmentResults: React.FC<AssessmentResultsProps> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<'diagnostic' | 'golden' | 'asymmetry'>('diagnostic');
    const tabs = [
        { id: 'diagnostic', label: 'Diagnóstico Estético' },
        { id: 'golden', label: 'Proporções Áureas' },
        { id: 'asymmetry', label: 'Análise de Assimetrias' }
    ];

    const handleSaveAssessment = () => {
        // Data to be saved (filtered as per requirements)
        // SAVED: Linear measurements, Skinfolds
        // EXCLUDED: Aesthetic diagnosis, Golden ratios, Asymmetry analysis (recalculated on read)

        const assessmentPayload = {
            studentId: "student_123", // Context variable
            date: new Date().toISOString(),
            // 1. LINEAR MEASUREMENTS (Medidas Lineares)
            measurements: {
                height: 178, // cm
                weight: 88.5, // kg
                neck: 42,
                shoulders: 133,
                chest: 120,
                waist: 85,
                hips: 100,
                arms: { left: 41.0, right: 44.5 },
                forearms: { left: 32.0, right: 32.2 },
                thighs: { left: 62.0, right: 60.5 },
                knees: { left: 40.0, right: 40.0 },
                calves: { left: 38.0, right: 38.0 },
                ankles: { left: 22.0, right: 22.0 },
                wrists: { left: 17.0, right: 17.0 }
            },
            // 2. SKINFOLDS (Dobras Cutâneas)
            skinfolds: {
                tricep: 12,
                subscapular: 15,
                chest: 8,
                axillary: 10,
                suprailiac: 14,
                abdominal: 18,
                thigh: 12
            }
        };

        console.log("Saving Assessment (Measurements Only):", assessmentPayload);
        alert("Avaliação salva com sucesso na ficha do aluno!");
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar flex flex-col bg-background-dark">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10 flex-1 w-full">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex flex-col animate-fade-in-up">
                        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-2 transition-colors text-xs font-bold uppercase tracking-wider w-fit">
                            <ChevronLeft size={14} /> Voltar para Dashboard
                        </button>
                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">RESULTADOS DA AVALIAÇÃO</h2>
                        <p className="text-sm text-gray-400 flex items-center gap-2 mt-2 font-light">
                            Análise completa do físico de <strong className="text-gray-200 font-medium">João Silva</strong> • 24/10/2023
                        </p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <button
                            onClick={handleSaveAssessment}
                            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 text-[#0A0F1C] text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,201,167,0.3)] hover:shadow-[0_0_25px_rgba(0,201,167,0.5)] transform hover:scale-105"
                        >
                            <Save size={16} /> SALVAR AVALIAÇÃO IA
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-gray-300 text-xs font-bold transition-all">
                            <Download size={16} /> Exportar PDF
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-gray-300 text-xs font-bold transition-all">
                            <Share2 size={16} /> Compartilhar
                        </button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="border-b border-white/10">
                    <div className="flex gap-8 overflow-x-auto custom-scrollbar pb-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`py-4 text-sm font-bold transition-colors whitespace-nowrap ${activeTab === tab.id ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-col gap-6">
                    {activeTab === 'diagnostic' && <DiagnosticTab />}
                    {activeTab === 'golden' && <GoldenRatioTab />}
                    {activeTab === 'asymmetry' && <AsymmetryTab />}
                </div>
            </div>
        </div>
    );
};