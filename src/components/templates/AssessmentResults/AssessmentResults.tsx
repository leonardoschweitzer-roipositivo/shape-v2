import React, { useState } from 'react';
import {
    Download,
    Share2,
    Save,
    ChevronLeft
} from 'lucide-react';

// Import extracted tab components
import { DiagnosticTab, ProportionsTab, AsymmetryTab } from './tabs';

// Import design tokens
import { colors as designColors, typography as designTypography, spacing as designSpacing, borders as designBorders } from '@/tokens';

interface AssessmentResultsProps {
    onBack: () => void;
}

// Token styles for main component
const tokenStyles = {
    headerTitle: {
        fontSize: designTypography.fontSize['3xl'],
        fontWeight: designTypography.fontWeight.bold,
        color: designColors.text.primary,
        letterSpacing: designTypography.letterSpacing.tight,
        textTransform: 'uppercase' as const
    },
    primaryButton: {
        display: 'flex',
        alignItems: 'center',
        gap: designSpacing[2],
        padding: `${designSpacing[3]} ${designSpacing[6]}`,
        borderRadius: designBorders.radius.lg,
        fontSize: designTypography.fontSize.sm,
        fontWeight: designTypography.fontWeight.bold,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em',
        transition: 'all 0.2s',
        border: `1px solid ${designColors.brand.primary}`,
        background: `${designColors.brand.primary}1A`,
        color: designColors.brand.primary,
        cursor: 'pointer'
    },
    secondaryButton: {
        display: 'flex',
        alignItems: 'center',
        gap: designSpacing[2],
        padding: `${designSpacing[3]} ${designSpacing[6]}`,
        borderRadius: designBorders.radius.lg,
        fontSize: designTypography.fontSize.sm,
        fontWeight: designTypography.fontWeight.bold,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em',
        transition: 'all 0.2s',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(255, 255, 255, 0.03)',
        color: designColors.text.secondary,
        cursor: 'pointer'
    },
    tabsContainer: {
        width: '100%',
        overflowX: 'auto' as const,
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'thin' as const
    },
    tabsScroll: {
        display: 'flex',
        gap: designSpacing[2],
        minWidth: 'min-content',
        paddingBottom: designSpacing[2]
    },
    tabButton: (isActive: boolean) => ({
        padding: `${designSpacing[3]} ${designSpacing[6]}`,
        borderRadius: designBorders.radius.lg,
        fontSize: designTypography.fontSize.sm,
        fontWeight: designTypography.fontWeight.bold,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap' as const,
        border: isActive ? `2px solid ${designColors.brand.primary}` : '2px solid rgba(255, 255, 255, 0.1)',
        background: isActive ? `${designColors.brand.primary}1A` : 'rgba(255, 255, 255, 0.03)',
        color: isActive ? designColors.brand.primary : designColors.text.secondary,
        cursor: 'pointer'
    })
};

export const AssessmentResults: React.FC<AssessmentResultsProps> = ({
    onBack,
    studentName,
    gender
}) => {
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
        <div className="flex-1 p-4 md:p-8 flex flex-col">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10 flex-1 w-full">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex flex-col animate-fade-in-up">
                        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-2 transition-colors text-xs font-bold uppercase tracking-wider w-fit">
                            <ChevronLeft size={14} /> Voltar para Dashboard
                        </button>
                        <h2 style={tokenStyles.headerTitle}>RESULTADOS DA AVALIAÇÃO</h2>
                        <p className="text-sm text-gray-400 flex items-center gap-2 mt-2 font-light">
                            Análise completa do físico de <strong className="text-gray-200 font-medium">{studentName || 'João Silva'}</strong> • {new Date().toLocaleDateString()}
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

                {/* Main Content - Render active tab */}
                <div className="flex flex-col gap-6">
                    {activeTab === 'diagnostic' && <DiagnosticTab />}
                    {activeTab === 'golden' && <ProportionsTab gender={gender} />}
                    {activeTab === 'asymmetry' && <AsymmetryTab />}
                </div>
            </div>
        </div>
    );
};