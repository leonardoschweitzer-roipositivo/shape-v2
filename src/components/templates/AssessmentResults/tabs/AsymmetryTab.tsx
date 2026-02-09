import React, { useState } from 'react';
import { Accessibility, Hand, Dumbbell, Activity, Footprints } from 'lucide-react';
import { GlassPanel } from '@/components/atoms';
import { AsymmetryCard, AiInsightCard, AsymmetryRadar } from '@/components/organisms';
import { colors as designColors, typography as designTypography, spacing as designSpacing } from '@/tokens';
import { MeasurementHistory } from '@/mocks/personal';

// Token styles (shared with parent)
const tokenStyles = {
    iconBadge: {
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: `${designColors.brand.primary}1A`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${designColors.brand.primary}33`
    },
    sectionTitle: {
        color: designColors.text.primary,
        fontWeight: designTypography.fontWeight.bold,
        fontSize: designTypography.fontSize.lg,
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const
    },
    description: {
        color: designColors.text.muted,
        fontSize: designTypography.fontSize.sm,
        lineHeight: designTypography.lineHeight.relaxed
    },
    filterContainer: {
        display: 'flex',
        gap: designSpacing[2],
        flexWrap: 'wrap' as const
    },
    filterButton: (isActive: boolean) => ({
        display: 'flex',
        alignItems: 'center',
        gap: designSpacing[2],
        padding: `${designSpacing[2]} ${designSpacing[4]}`,
        borderRadius: '8px',
        fontSize: designTypography.fontSize.xs,
        fontWeight: designTypography.fontWeight.bold,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em',
        transition: 'all 0.2s',
        border: isActive ? `1px solid ${designColors.brand.primary}` : '1px solid rgba(255, 255, 255, 0.1)',
        background: isActive ? `${designColors.brand.primary}1A` : 'rgba(255, 255, 255, 0.03)',
        color: isActive ? designColors.brand.primary : designColors.text.secondary,
        cursor: 'pointer'
    })
};

interface AsymmetryTabProps {
    assessment?: MeasurementHistory;
}

export const AsymmetryTab: React.FC<AsymmetryTabProps> = ({ assessment }) => {
    const [view, setView] = useState<'total' | 'membros' | 'tronco'>('total');

    const formatVal = (val: number) => val.toFixed(1).replace('.', ',');
    const formatDiff = (diff: number) => (diff > 0 ? '+' : '') + diff.toFixed(1).replace('.', ',');
    const getStatus = (v1: number, v2: number) => {
        const diff = Math.abs(v1 - v2);
        const maxVal = Math.max(v1, v2);
        if (maxVal === 0) return 'symmetrical';
        const pct = (diff / maxVal) * 100;

        if (pct >= 5.0) return 'high';
        if (pct >= 1.0) return 'moderate';
        return 'symmetrical';
    };

    const defaultAsymmetryItems = [
        { id: 'braco', category: 'membros', icon: <Accessibility size={20} />, title: "BRAÇO", subtitle: "BÍCEPS RELAXADO", leftVal: "41,0", rightVal: "44,5", diff: "+3,5", status: "high" },
        { id: 'antebraco', category: 'membros', icon: <Hand size={20} />, title: "ANTEBRAÇO", subtitle: "PORÇÃO MEDIAL", leftVal: "32,0", rightVal: "32,2", diff: "+0,2", status: "symmetrical" },
        { id: 'ombros', category: 'tronco', icon: <Dumbbell size={20} />, title: "OMBROS", subtitle: "DELTOIDE LATERAL", leftVal: "133,0", rightVal: "132,5", diff: "-0,5", status: "symmetrical" },
        { id: 'peito', category: 'tronco', icon: <Activity size={20} />, title: "PEITORAL", subtitle: "PORÇÃO SUPERIOR", leftVal: "60,0", rightVal: "59,2", diff: "-0,8", status: "moderate" },
        { id: 'coxa', category: 'membros', icon: <Activity size={20} />, title: "COXA", subtitle: "MEDIDA PROXIMAL", leftVal: "62,0", rightVal: "60,5", diff: "+1,5", status: "moderate" },
        { id: 'panturrilha', category: 'membros', icon: <Footprints size={20} />, title: "PANTURRILHA", subtitle: "GASTROCNÊMIO", leftVal: "38,0", rightVal: "38,0", diff: "0,0", status: "symmetrical" },
    ];

    let asymmetryItems = defaultAsymmetryItems;

    if (assessment) {
        const m = assessment.measurements;
        // Only include items we have L/R data for
        asymmetryItems = [
            {
                id: 'braco',
                category: 'membros',
                icon: <Accessibility size={20} />,
                title: "BRAÇO",
                subtitle: "BÍCEPS RELAXADO",
                leftVal: formatVal(m.armLeft),
                rightVal: formatVal(m.armRight),
                diff: formatDiff(m.armRight - m.armLeft),
                status: getStatus(m.armLeft, m.armRight)
            },
            {
                id: 'antebraco',
                category: 'membros',
                icon: <Hand size={20} />,
                title: "ANTEBRAÇO",
                subtitle: "PORÇÃO MEDIAL",
                leftVal: formatVal(m.forearmLeft),
                rightVal: formatVal(m.forearmRight),
                diff: formatDiff(m.forearmRight - m.forearmLeft),
                status: getStatus(m.forearmLeft, m.forearmRight)
            },
            {
                id: 'coxa',
                category: 'membros',
                icon: <Activity size={20} />,
                title: "COXA",
                subtitle: "MEDIDA PROXIMAL",
                leftVal: formatVal(m.thighLeft),
                rightVal: formatVal(m.thighRight),
                diff: formatDiff(m.thighRight - m.thighLeft),
                status: getStatus(m.thighLeft, m.thighRight)
            },
            {
                id: 'panturrilha',
                category: 'membros',
                icon: <Footprints size={20} />,
                title: "PANTURRILHA",
                subtitle: "GASTROCNÊMIO",
                leftVal: formatVal(m.calfLeft),
                rightVal: formatVal(m.calfRight),
                diff: formatDiff(m.calfRight - m.calfLeft),
                status: getStatus(m.calfLeft, m.calfRight)
            }
        ];
    }

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
                        title={assessment ? (filteredItems.some(item => item.status !== 'symmetrical') ? "Assimetria Detectada" : "Físico Simétrico") : "Dominância do Hemicorpo Direito"}
                        description={
                            assessment ? (
                                filteredItems.some(item => item.status !== 'symmetrical') ?
                                    `Identificamos desequilíbrios em: ${filteredItems.filter(item => item.status !== 'symmetrical').map(item => item.title).join(', ')}.` :
                                    "Seus membros apresentam excelente equilíbrio bilateral."
                            ) : (
                                <>
                                    Identificamos uma assimetria significativa no <strong className="text-orange-400">Braço Direito (+3,5cm)</strong> que pode estar relacionada à compensação em exercícios de empurrar.
                                </>
                            )
                        }
                    />
                </div>
            </div>
        </div>
    );
};
