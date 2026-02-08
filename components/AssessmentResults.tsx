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

// Nova estrutura: usar services centralizados
import {
    calcularIdeaisGoldenRatio,
    calcularIdeaisClassicPhysique,
    calcularIdeaisMensPhysique,
} from '../src/services/calculations';
import {
    calcularDiferenca,
    getStatusLabel,
} from '../src/services/calculations/utils';
import { ComparisonMode } from '../types/proportions';
import { useTokens } from '../src/hooks/useTokens';

// Mock measurements (temporário - será substituído por dados reais)
const MOCK_USER_MEASUREMENTS = {
    // Medidas estruturais
    altura: 180,
    punho: 17.5,
    tornozelo: 23,
    joelho: 38,
    pelvis: 98,
    cabeca: 58,
    // Medidas variáveis
    cintura: 82,
    ombros: 120,
    peito: 108,
    braco: 40,
    antebraco: 32,
    coxa: 60,
    panturrilha: 38,
    pescoco: 40
};

interface AssessmentResultsProps {
    onBack: () => void;
}

// Helper: Get method label for display
const getMethodLabel = (mode: ComparisonMode): string => {
    switch (mode) {
        case 'golden': return 'Meta Golden';
        case 'classic': return 'Meta CBum';
        case 'mens': return 'Meta MP';
    }
};

// --- TOKENIZED STYLES ---
/**
 * Estilos centralizados usando design tokens
 * Substitui classes Tailwind hardcoded por valores dos tokens
 */
import { colors as designColors, typography as designTypography, spacing as designSpacing, borders as designBorders } from '../src/tokens';

const tokenStyles = {
    iconBadge: {
        width: '32px',
        height: '32px',
        borderRadius: designBorders.radius.lg,
        background: `${designColors.brand.primary}1A`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${designColors.brand.primary}33`,
        boxShadow: '0 0 15px rgba(0, 201, 167, 0.1)'
    },
    sectionTitle: {
        fontSize: designTypography.fontSize.xl,
        fontWeight: designTypography.fontWeight.bold,
        color: designColors.text.primary,
        letterSpacing: designTypography.letterSpacing.tight,
        textTransform: 'uppercase' as const
    },
    description: {
        fontSize: designTypography.fontSize.sm,
        color: designColors.text.secondary,
        lineHeight: designTypography.lineHeight.relaxed,
        fontWeight: designTypography.fontWeight.normal
    },
    filterContainer: {
        display: 'flex',
        background: designColors.background.dark,
        border: `1px solid rgba(255, 255, 255, 0.1)`,
        borderRadius: designBorders.radius.lg,
        padding: designSpacing[1]
    },
    filterButton: (isActive: boolean) => ({
        padding: `${designSpacing[2]} ${designSpacing[4]}`,
        borderRadius: designBorders.radius.md,
        fontSize: designTypography.fontSize.xs,
        fontWeight: designTypography.fontWeight.bold,
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: designSpacing[2],
        background: isActive ? designColors.background.card : 'transparent',
        color: isActive ? designColors.text.primary : designColors.text.muted,
        border: isActive ? `1px solid rgba(255, 255, 255, 0.05)` : 'none',
        cursor: 'pointer'
    }),
    // Main Component Styles
    pageContainer: {
        flex: 1,
        padding: `${designSpacing[4]} ${designSpacing[4]}`, // mobile default
        display: 'flex',
        flexDirection: 'column' as const,
        background: designColors.background.dark
    },
    contentWrapper: {
        maxWidth: '80rem', // 7xl
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: designSpacing[8],
        paddingBottom: designSpacing[10],
        flex: 1,
        width: '100%'
    },
    headerTitle: {
        fontSize: designTypography.fontSize['3xl'],
        fontWeight: designTypography.fontWeight.bold,
        color: designColors.text.primary,
        letterSpacing: designTypography.letterSpacing.tight
    },
    primaryButton: {
        display: 'flex',
        alignItems: 'center',
        gap: designSpacing[2],
        padding: `${designSpacing[2]} ${designSpacing[6]}`,
        borderRadius: designBorders.radius.lg,
        background: designColors.brand.primary,
        color: '#0A0F1C',
        fontSize: designTypography.fontSize.xs,
        fontWeight: designTypography.fontWeight.bold,
        transition: 'all 0.2s ease',
        boxShadow: '0 0 15px rgba(0, 201, 167, 0.3)',
        cursor: 'pointer',
        border: 'none'
    },
    secondaryButton: {
        display: 'flex',
        alignItems: 'center',
        gap: designSpacing[2],
        padding: `${designSpacing[2]} ${designSpacing[4]}`,
        borderRadius: designBorders.radius.lg,
        border: `1px solid rgba(255, 255, 255, 0.1)`,
        background: 'transparent',
        color: designColors.text.secondary,
        fontSize: designTypography.fontSize.xs,
        fontWeight: designTypography.fontWeight.bold,
        transition: 'all 0.2s ease',
        cursor: 'pointer'
    },
    // Tabs Navigation Styles
    tabsContainer: {
        borderBottom: `1px solid rgba(255, 255, 255, 0.1)`
    },
    tabsScroll: {
        display: 'flex',
        gap: designSpacing[8],
        overflowX: 'auto' as const,
        paddingBottom: designSpacing[1]
    },
    tabButton: (isActive: boolean) => ({
        padding: `${designSpacing[4]} 0`,
        fontSize: designTypography.fontSize.sm,
        fontWeight: designTypography.fontWeight.bold,
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap' as const,
        background: 'transparent',
        border: 'none',
        borderBottom: isActive ? `2px solid ${designColors.brand.primary}` : '2px solid transparent',
        color: isActive ? designColors.brand.primary : designColors.text.muted,
        cursor: 'pointer'
    })
};

// --- TABS CONTENT ---

const DiagnosticTab = () => {
    const [filter, setFilter] = useState<'geral' | 'comp' | 'metrics'>('geral');

    return (
        <div className="flex flex-col gap-8 animate-fade-in-up">
            {/* Header Description & Control Bar */}
            {/* Header Description & Control Bar */}
            <div className="flex flex-col lg:flex-row justify-between items-end gap-6 mb-2">
                <div className="flex-1 animate-fade-in-up">
                    <div className="flex items-center gap-3 mb-2">
                        <div style={tokenStyles.iconBadge}>
                            <Activity size={16} color={designColors.brand.primary} />
                        </div>
                        <h3 style={tokenStyles.sectionTitle}>DIAGNÓSTICO ESTÉTICO</h3>
                    </div>
                    <p style={tokenStyles.description} className="max-w-2xl">
                        {filter === 'geral' && "Uma visão holística do seu estado atual. Analisamos a pontuação de pontos, o equilíbrio via radar e a composição de massas."}
                        {filter === 'comp' && "Análise detalhada da composição corporal. Foco no percentual de gordura e distribuição de massa magra vs gorda."}
                        {filter === 'metrics' && "Mapeamento biométrico completo. Visualização do equilíbrio muscular e volumetria através do gráfico de radar."}
                    </p>
                </div>

                <div style={tokenStyles.filterContainer}>
                    <button
                        onClick={() => setFilter('geral')}
                        style={tokenStyles.filterButton(filter === 'geral')}
                    >
                        {filter === 'geral' && <Activity size={12} color={designColors.brand.primary} />}
                        Geral
                    </button>
                    <button
                        onClick={() => setFilter('comp')}
                        style={tokenStyles.filterButton(filter === 'comp')}
                    >
                        Composição
                    </button>
                    <button
                        onClick={() => setFilter('metrics')}
                        style={tokenStyles.filterButton(filter === 'metrics')}
                    >
                        Métricas
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {/* Top Row: Main Cards (Filtered) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[340px]">
                    {(filter === 'geral' || filter === 'metrics') && (
                        <ScoreWidget score={80} label="Pontos" change="+5%" />
                    )}

                    {(filter === 'geral' || filter === 'metrics') && (
                        <GlassPanel className="rounded-2xl relative">
                            <RadarChart />
                        </GlassPanel>
                    )}

                    {(filter === 'geral' || filter === 'comp') && (
                        <GlassPanel className="rounded-2xl relative">
                            <BodyFatGauge />
                        </GlassPanel>
                    )}
                </div>

                {/* Middle Row: Metrics (Filtered) */}
                {(filter === 'comp' || filter === 'metrics') && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                        <MassCard label="Peso Atual" value={88.5} unit="kg" trend={1.2} color="green" />
                        <MassCard label="Peso Magro" value={77.1} unit="kg" trend={0.8} color="purple" />
                        <MassCard label="Peso Gordo" value={11.4} unit="kg" trend={-0.5} color="red" />
                    </div>
                )}

                {/* Bottom Row: AI Analysis */}
                <AiAnalysisWidget
                    analysis={
                        <>
                            Com base na análise de simetria bilateral, o cliente apresenta um <span className="text-white font-medium">desequilíbrio leve no deltoide direito</span> em relação ao esquerdo (aproximadamente 4% de diferença em volume). Recomenda-se adicionar 2 séries de elevação lateral unilateral para correção. O percentual de gordura (12.9%) está em um ponto ideal para iniciar a fase de <span className="text-primary font-bold">bulking limpo</span>, focando em progressão de carga nos compostos principais.
                        </>
                    }
                />
            </div>
        </div>
    );
};

const GoldenRatioTab = () => {
    const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('golden');

    // Use mock data for now - in future this will come from assessment context
    const userMeasurements = MOCK_USER_MEASUREMENTS;

    // Calculate proportions dynamically based on selected mode
    const ideais = useMemo(() => {
        switch (comparisonMode) {
            case 'golden':
                return calcularIdeaisGoldenRatio(userMeasurements);
            case 'classic':
                return calcularIdeaisClassicPhysique(userMeasurements);
            case 'mens':
                return calcularIdeaisMensPhysique(userMeasurements);
        }
    }, [comparisonMode]);

    // Calculate differences for each proportion
    const diferencas = useMemo(() => {
        const diffs: Record<string, any> = {};
        const campos = ['ombros', 'peito', 'braco', 'antebraco', 'cintura', 'coxa', 'panturrilha', 'pescoco'];

        for (const campo of campos) {
            const ideal = ideais[campo as keyof typeof ideais];
            const atual = userMeasurements[campo as keyof typeof userMeasurements] as number;

            if (typeof ideal === 'number' && typeof atual === 'number') {
                diffs[campo] = calcularDiferenca(atual, ideal);
            }
        }

        return diffs;
    }, [ideais, userMeasurements]);

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

    // Calculate derived values
    const shapeVAtual = userMeasurements.ombros / userMeasurements.cintura;
    const shapeVPercentual = Math.min(100, (shapeVAtual / 1.618) * 100);

    const triadeMedia = (userMeasurements.braco + userMeasurements.panturrilha + userMeasurements.pescoco) / 3;
    const triadeDesvio = (Math.abs(userMeasurements.braco - triadeMedia) +
        Math.abs(userMeasurements.panturrilha - triadeMedia) +
        Math.abs(userMeasurements.pescoco - triadeMedia)) / triadeMedia / 3;
    const triadeScore = Math.max(0, (1 - triadeDesvio) * 100);

    const proportionItems = [
        // 1. Shape-V
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

    return (
        <div className="flex flex-col gap-8 animate-fade-in-up w-full">
            {/* Header Description & Control Bar */}
            <div className="flex flex-col lg:flex-row justify-between items-end gap-6 mb-2">
                <div className="flex-1 animate-fade-in-up">
                    <div className="flex items-center gap-3 mb-2">
                        <div style={tokenStyles.iconBadge}>
                            <Sparkles size={16} color={designColors.brand.primary} />
                        </div>
                        <h3 style={tokenStyles.sectionTitle}>DIMENSÕES ÁUREAS</h3>
                    </div>
                    <p style={tokenStyles.description} className="max-w-2xl">
                        Mapeamento matemático do seu físico em relação aos ideais clássicos. O <span style={{ color: designColors.brand.primary, fontWeight: designTypography.fontWeight.medium }}>Shape-V</span> é o pilar central da sua jornada, definindo a harmonia estética através da convergência entre largura de ombros e linha de cintura.
                    </p>
                </div>

                <div style={tokenStyles.filterContainer}>
                    <button
                        onClick={() => setComparisonMode('golden')}
                        style={tokenStyles.filterButton(comparisonMode === 'golden')}
                    >
                        {comparisonMode === 'golden' && <Sparkles size={12} color={designColors.brand.primary} />}
                        Golden Ratio
                    </button>
                    <button
                        onClick={() => setComparisonMode('classic')}
                        style={tokenStyles.filterButton(comparisonMode === 'classic')}
                    >
                        Classic Physique
                    </button>
                    <button
                        onClick={() => setComparisonMode('mens')}
                        style={tokenStyles.filterButton(comparisonMode === 'mens')}
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

const AsymmetryTab = () => {
    const [view, setView] = useState<'total' | 'membros' | 'tronco'>('total');

    const asymmetryItems = [
        { id: 'braco', category: 'membros', icon: <Accessibility size={20} />, title: "BRAÇO", subtitle: "BÍCEPS RELAXADO", leftVal: "41,0", rightVal: "44,5", diff: "+3,5", status: "high" },
        { id: 'antebraco', category: 'membros', icon: <Hand size={20} />, title: "ANTEBRAÇO", subtitle: "PORÇÃO MEDIAL", leftVal: "32,0", rightVal: "32,2", diff: "+0,2", status: "symmetrical" },
        { id: 'ombros', category: 'tronco', icon: <Dumbbell size={20} />, title: "OMBROS", subtitle: "DELTOIDE LATERAL", leftVal: "133,0", rightVal: "132,5", diff: "-0,5", status: "symmetrical" },
        { id: 'peito', category: 'tronco', icon: <Activity size={20} />, title: "PEITORAL", subtitle: "PORÇÃO SUPERIOR", leftVal: "60,0", rightVal: "59,2", diff: "-0,8", status: "moderate" },
        { id: 'coxa', category: 'membros', icon: <Activity size={20} />, title: "COXA", subtitle: "MEDIDA PROXIMAL", leftVal: "62,0", rightVal: "60,5", diff: "+1,5", status: "moderate" },
        { id: 'panturrilha', category: 'membros', icon: <Footprints size={20} />, title: "PANTURRILHA", subtitle: "GASTROCNÊMIO", leftVal: "38,0", rightVal: "38,0", diff: "0,0", status: "symmetrical" },
    ];

    const filteredItems = asymmetryItems.filter(item =>
        view === 'total' || item.category === view
    );

    return (
        <div className="flex flex-col gap-8 animate-fade-in-up">
            {/* Header Description & Control Bar */}
            <div className="flex flex-col lg:flex-row justify-between items-end gap-6 mb-2">
                <div className="flex-1 animate-fade-in-up">
                    <div className="flex items-center gap-3 mb-2">
                        <div style={tokenStyles.iconBadge}>
                            <Accessibility size={16} color={designColors.brand.primary} />
                        </div>
                        <h3 style={tokenStyles.sectionTitle}>ANÁLISE DE ASSIMETRIAS</h3>
                    </div>
                    <p style={tokenStyles.description} className="max-w-2xl">
                        {view === 'total' && "Mapeamento completo de desequilíbrios musculares laterais em todo o corpo."}
                        {view === 'membros' && "Foco na simetria de braços, antebraços e pernas, essenciais para o equilíbrio estético."}
                        {view === 'tronco' && "Análise da linha de ombros e peitoral, fundamentais para a estrutura em V."}
                    </p>
                </div>

                <div style={tokenStyles.filterContainer}>
                    <button
                        onClick={() => setView('total')}
                        style={tokenStyles.filterButton(view === 'total')}
                    >
                        {view === 'total' && <Accessibility size={12} color={designColors.brand.primary} />}
                        Total
                    </button>
                    <button
                        onClick={() => setView('membros')}
                        style={tokenStyles.filterButton(view === 'membros')}
                    >
                        Membros
                    </button>
                    <button
                        onClick={() => setView('tronco')}
                        style={tokenStyles.filterButton(view === 'tronco')}
                    >
                        Tronco
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-full">
                <div className="w-full lg:w-2/3 flex flex-col gap-4">
                    {filteredItems.map(item => (
                        <AsymmetryCard
                            key={item.id}
                            icon={item.icon}
                            title={item.title}
                            subtitle={item.subtitle}
                            leftVal={item.leftVal}
                            rightVal={item.rightVal}
                            diff={item.diff}
                            status={item.status as any}
                        />
                    ))}
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
        </div>
    );
};

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
        <div style={tokenStyles.pageContainer}>
            <div style={tokenStyles.contentWrapper}>
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex flex-col animate-fade-in-up">
                        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-2 transition-colors text-xs font-bold uppercase tracking-wider w-fit">
                            <ChevronLeft size={14} /> Voltar para Dashboard
                        </button>
                        <h2 style={tokenStyles.headerTitle}>RESULTADOS DA AVALIAÇÃO</h2>
                        <p className="text-sm text-gray-400 flex items-center gap-2 mt-2 font-light">
                            Análise completa do físico de <strong className="text-gray-200 font-medium">João Silva</strong> • 24/10/2023
                        </p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <button
                            onClick={handleSaveAssessment}
                            style={tokenStyles.primaryButton}
                        >
                            <Save size={16} /> SALVAR AVALIAÇÃO IA
                        </button>
                        <button style={tokenStyles.secondaryButton}>
                            <Download size={16} /> Exportar PDF
                        </button>
                        <button style={tokenStyles.secondaryButton}>
                            <Share2 size={16} /> Compartilhar
                        </button>
                    </div>
                </div>

                <div className="h-px w-full bg-white/10" />

                {/* Navigation Tabs */}
                <div style={tokenStyles.tabsContainer}>
                    <div className="custom-scrollbar" style={tokenStyles.tabsScroll}>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                style={tokenStyles.tabButton(activeTab === tab.id)}
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