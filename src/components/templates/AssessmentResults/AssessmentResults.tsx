import React, { useState } from 'react';
import {
    Download,
    Share2,
    Save,
    ChevronLeft
} from 'lucide-react';
import { MeasurementHistory } from '@/mocks/personal';
import { Measurements } from './types';
import { supabase } from '@/services/supabase';
import { mapMeasurementToInput } from '@/services/calculations/evolutionProcessor';
import { calcularAvaliacaoGeral } from '@/services/calculations/assessment';

// Import extracted tab components
import { DiagnosticTab, ProportionsTab, AsymmetryTab } from './tabs';

// Import design tokens
import { colors as designColors, typography as designTypography, spacing as designSpacing, borders as designBorders } from '@/tokens';

interface AssessmentResultsProps {
    onBack: () => void;
    studentName?: string;
    gender?: 'male' | 'female';
    assessment?: MeasurementHistory;
    birthDate?: string;
    athleteId?: string;
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
    gender,
    assessment,
    birthDate,
    athleteId
}) => {
    const [activeTab, setActiveTab] = useState<'diagnostic' | 'golden' | 'asymmetry'>('diagnostic');
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const tabs = [
        { id: 'diagnostic', label: 'Diagnóstico Estético' },
        { id: 'golden', label: 'Proporções Áureas' },
        { id: 'asymmetry', label: 'Análise de Assimetrias' }
    ];

    // Map assessment data to local Measurements format
    const userMeasurements: Measurements | undefined = assessment ? {
        altura: assessment.measurements.height,
        peso: assessment.measurements.weight,
        ombros: assessment.measurements.shoulders,
        peito: assessment.measurements.chest,
        busto: assessment.measurements.chest, // Using chest as bust for now, as they are usually same circle
        costas: assessment.measurements.chest * 1.05, // Approximation
        cintura: assessment.measurements.waist,
        quadril: assessment.measurements.hips,
        braco: Math.max(assessment.measurements.armRight, assessment.measurements.armLeft),
        antebraco: Math.max(assessment.measurements.forearmRight, assessment.measurements.forearmLeft),
        punho: (assessment.measurements.wristRight + assessment.measurements.wristLeft) / 2 || 17,
        pescoco: assessment.measurements.neck,
        coxa: Math.max(assessment.measurements.thighRight, assessment.measurements.thighLeft),
        joelho: (assessment.measurements.kneeRight + assessment.measurements.kneeLeft) / 2 || 40,
        panturrilha: Math.max(assessment.measurements.calfRight, assessment.measurements.calfLeft),
        tornozelo: (assessment.measurements.ankleRight + assessment.measurements.ankleLeft) / 2 || 22,
        pelvis: assessment.measurements.hips,
        cabeca: 56 // Default
    } : undefined;

    const handleSaveAssessment = async () => {
        if (!assessment || !athleteId) {
            alert('Dados insuficientes para salvar. Verifique se o atleta e a avaliação estão carregados.');
            return;
        }

        setIsSaving(true);
        setSaveStatus('idle');

        try {
            // Calcular idade real
            let age = 30;
            if (birthDate) {
                const birth = new Date(birthDate);
                const now = new Date();
                age = now.getFullYear() - birth.getFullYear();
                const m = now.getMonth() - birth.getMonth();
                if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
            }

            // Calcular resultados completos
            const genderInput = gender === 'female' ? 'FEMALE' : 'MALE';
            const calcInput = mapMeasurementToInput(assessment, genderInput as 'MALE' | 'FEMALE', age);
            const result = calcularAvaliacaoGeral(calcInput);

            // Sanitizar resultados
            const safeResults = JSON.parse(JSON.stringify({
                avaliacaoGeral: result.avaliacaoGeral,
                classificacao: result.classificacao,
                scores: result.scores,
                penalizacoes: result.penalizacoes,
                insights: result.insights,
            }, (_, v) => typeof v === 'number' && !isFinite(v) ? 0 : v));

            const heightCm = assessment.measurements.height > 0 && assessment.measurements.height < 3
                ? Math.round(assessment.measurements.height * 100)
                : assessment.measurements.height;

            const hasSkinfolds = assessment.skinfolds && Object.values(assessment.skinfolds).some(v => v > 0);
            const bfMethod = hasSkinfolds ? 'POLLOCK_7' : 'NAVY';

            const assessmentInsert = {
                athlete_id: athleteId,
                date: assessment.date || new Date().toISOString(),
                weight: Math.round(assessment.measurements.weight * 100) / 100,
                height: heightCm,
                age,
                gender: genderInput,
                body_fat: Math.round(result.scores.composicao.detalhes.detalhes.bf.valor * 100) / 100,
                body_fat_method: bfMethod,
                measurements: {
                    linear: assessment.measurements,
                    skinfolds: assessment.skinfolds,
                },
                results: safeResults,
            };

            const { error } = await supabase
                .from('assessments')
                .insert(assessmentInsert as any);

            if (error) {
                console.error('[AssessmentResults] ❌ Erro ao salvar:', error.message, error.details);
                setSaveStatus('error');
                alert(`Erro ao salvar avaliação: ${error.message}`);
            } else {
                console.info('[AssessmentResults] ✅ Avaliação salva com sucesso na tabela assessments');
                setSaveStatus('success');
                alert('Avaliação salva com sucesso na ficha do aluno!');
            }
        } catch (err) {
            console.error('[AssessmentResults] ❌ Exceção:', err);
            setSaveStatus('error');
            alert('Erro ao salvar avaliação. Verifique o console para detalhes.');
        } finally {
            setIsSaving(false);
        }
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
                            Análise completa do físico de <strong className="text-gray-200 font-medium">{studentName || 'João Silva'}</strong> • {assessment ? new Date(assessment.date).toLocaleDateString() : new Date().toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <button
                            onClick={handleSaveAssessment}
                            disabled={isSaving}
                            style={{
                                ...tokenStyles.primaryButton,
                                opacity: isSaving ? 0.6 : 1,
                                cursor: isSaving ? 'not-allowed' : 'pointer',
                            }}
                        >
                            <Save size={16} /> {isSaving ? 'SALVANDO...' : saveStatus === 'success' ? '✅ SALVO' : 'SALVAR AVALIAÇÃO IA'}
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
                    {activeTab === 'diagnostic' && <DiagnosticTab assessment={assessment} gender={gender} birthDate={birthDate} />}
                    {activeTab === 'golden' && <ProportionsTab gender={gender} userMeasurements={userMeasurements} />}
                    {activeTab === 'asymmetry' && <AsymmetryTab assessment={assessment} />}
                </div>
            </div>
        </div>
    );
};