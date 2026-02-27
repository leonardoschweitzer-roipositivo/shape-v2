import React, { useState, useMemo, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { GlassPanel } from '@/components/atoms';
import {
    ScoreWidget,
    MassCard,
    AiAnalysisWidget,
    RadarChart,
    BodyFatGauge
} from '@/components/organisms';
import { colors as designColors, typography as designTypography, spacing as designSpacing } from '@/tokens';
import { MeasurementHistory } from '@/mocks/personal';
import { calcularAvaliacaoGeral } from '@/services/calculations';
import { mapMeasurementToInput } from '@/services/calculations/evolutionProcessor';
import { calculateAge } from '@/utils/dateUtils';
import { useDataStore } from '@/stores/dataStore';

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

interface DiagnosticTabProps {
    assessment?: MeasurementHistory;
    gender?: 'male' | 'female';
    birthDate?: string;
    age?: number;
}

export const DiagnosticTab: React.FC<DiagnosticTabProps> = ({ assessment, gender = 'male', birthDate, age: ageProp }) => {
    const [filter, setFilter] = useState<'todos' | 'comp' | 'metrics'>('todos');

    // Resolve birthDate: prop first, then search in store for the athlete owning this assessment
    const { personalAthletes } = useDataStore();
    const resolvedBirthDate = useMemo(() => {
        if (birthDate) return birthDate;
        if (assessment?.id) {
            const owner = personalAthletes.find(a =>
                a.assessments.some(ass => ass.id === assessment.id)
            );
            if (owner?.birthDate) return owner.birthDate;
        }
        return undefined;
    }, [birthDate, assessment?.id, personalAthletes]);

    // Auto-select method based on skinfold availability
    const hasSkinfolds = useMemo(() => {
        if (!assessment?.skinfolds) return false;
        return Object.values(assessment.skinfolds).some((v) => Number(v) > 0);
    }, [assessment]);

    const [bfMethod, setBfMethod] = useState<'navy' | 'pollock'>(hasSkinfolds ? 'pollock' : 'navy');

    // Sync method when assessment changes (e.g. switching between historical evaluations)
    useEffect(() => {
        setBfMethod(hasSkinfolds ? 'pollock' : 'navy');
    }, [hasSkinfolds]);

    // Calculate metrics using the SAME shared mapper used by dashboard/store
    const metrics = useMemo(() => {
        if (!assessment) return {
            weight: 88.5,
            leanMass: 77.1,
            fatMass: 11.4,
            bf: 12.9,
            score: 80
        };

        const m = assessment.measurements;
        const { weight, waist, neck, hips } = m;
        const height = m.height > 0 && m.height < 3 ? Math.round(m.height * 100) : m.height;

        // Priority: 1) age prop from form, 2) calculated from birthDate, 3) from store, 4) fallback 30
        const age = ageProp || calculateAge(resolvedBirthDate) || 30;

        const genderUpper = (gender === 'female' ? 'FEMALE' : 'MALE') as 'MALE' | 'FEMALE';

        // Use the SAME shared mapper that dashboard uses
        const sharedInput = mapMeasurementToInput(assessment, genderUpper, age);

        // The shared mapper auto-detects BF method. If user explicitly chose a different method,
        // we need to recalculate BF and override it.
        const sharedHasSkinfolds = assessment.skinfolds && Object.values(assessment.skinfolds).some(v => Number(v) > 0);
        const sharedDetectedMethod = sharedHasSkinfolds ? 'pollock' : 'navy';

        let bf = sharedInput.composicao.bf;

        if (bfMethod !== sharedDetectedMethod) {
            // User manually switched method, recalculate BF
            if (bfMethod === 'pollock' && assessment.skinfolds) {
                const s = assessment.skinfolds;
                const sumSkinfolds = s.tricep + s.subscapular + s.chest + s.axillary + s.suprailiac + s.abdominal + s.thigh;
                let bodyDensity;
                if (gender === 'male') {
                    bodyDensity = 1.112 - 0.00043499 * sumSkinfolds + 0.00000055 * sumSkinfolds * sumSkinfolds - 0.00028826 * age;
                } else {
                    bodyDensity = 1.097 - 0.00046971 * sumSkinfolds + 0.00000056 * sumSkinfolds * sumSkinfolds - 0.00012828 * age;
                }
                bf = Math.max(2, Math.min(60, (495 / bodyDensity) - 450));
            } else {
                // Navy method
                if (gender === 'male') {
                    bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
                } else {
                    bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + (hips || waist) - neck) + 0.22100 * Math.log10(height)) - 450;
                }
                bf = Math.max(2, Math.min(60, bf));
            }

            // Update composition in input with overridden BF
            const overrideFatMass = weight * (bf / 100);
            const overrideLeanMass = weight - overrideFatMass;
            sharedInput.composicao.bf = bf;
            sharedInput.composicao.metodo_bf = bfMethod === 'pollock' ? 'POLLOCK_7' : 'NAVY';
            sharedInput.composicao.pesoMagro = overrideLeanMass;
            sharedInput.composicao.pesoGordo = overrideFatMass;
        }

        const fatMass = weight * (bf / 100);
        const leanMass = weight - fatMass;

        const result = calcularAvaliacaoGeral(sharedInput);

        return {
            weight,
            leanMass: parseFloat(leanMass.toFixed(1)),
            fatMass: parseFloat(fatMass.toFixed(1)),
            bf: parseFloat(bf.toFixed(1)),
            score: result.avaliacaoGeral,
            classificacao: result.classificacao
        };
    }, [assessment, gender, bfMethod, resolvedBirthDate, ageProp]);

    return (
        <div className="flex flex-col gap-8 animate-fade-in-up">
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
                        {filter === 'todos' && "Uma visão holística do seu estado atual. Analisamos a pontuação de pontos, o equilíbrio via radar e a composição de massas."}
                        {filter === 'comp' && "Análise detalhada da composição corporal. Foco no percentual de gordura e distribuição de massa magra vs gorda."}
                        {filter === 'metrics' && "Mapeamento biométrico completo. Visualização do equilíbrio muscular e volumetria através do gráfico de radar."}
                    </p>
                </div>

                <div style={tokenStyles.filterContainer}>
                    <button
                        onClick={() => setFilter('todos')}
                        style={tokenStyles.filterButton(filter === 'todos')}
                    >
                        {filter === 'todos' && <Activity size={12} color={designColors.brand.primary} />}
                        Todos
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
                    {(filter === 'todos' || filter === 'metrics') && (
                        <ScoreWidget
                            score={metrics.score}
                            classification={metrics.classificacao}
                            label="Pontos"
                            change="+5%"
                        />
                    )}

                    {(filter === 'todos' || filter === 'metrics') && (
                        <GlassPanel className="rounded-2xl relative">
                            <RadarChart />
                        </GlassPanel>
                    )}

                    {(filter === 'todos' || filter === 'comp') && (
                        <GlassPanel className="rounded-2xl relative">
                            <BodyFatGauge
                                value={metrics.bf}
                                method={bfMethod}
                                onMethodChange={setBfMethod}
                                gender={gender}
                            />
                        </GlassPanel>
                    )}
                </div>

                {/* Middle Row: Metrics (Filtered) */}
                {(filter === 'todos' || filter === 'comp' || filter === 'metrics') && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                        <MassCard label="Peso Atual" value={metrics.weight} unit="kg" trend={1.2} color="green" />
                        <MassCard label="Peso Magro" value={metrics.leanMass} unit="kg" trend={0.8} color="purple" />
                        <MassCard label="Peso Gordo" value={metrics.fatMass} unit="kg" trend={-0.5} color="red" />
                    </div>
                )}

                {/* Bottom Row: AI Analysis */}
                <AiAnalysisWidget
                    analysis={
                        <>
                            Com base na análise de simetria bilateral, o cliente apresenta um <span className="text-white font-medium">{metrics.score > 80 ? 'excelente equilíbrio' : 'desequilíbrio leve'}</span>. O percentual de gordura ({metrics.bf.toFixed(1)}%) indica necessidade de <span className="text-primary font-bold">
                                {gender === 'male'
                                    ? (metrics.bf > 25 ? 'foco em redução de gordura (cutting)' : metrics.bf > 15 ? 'recomposição corporal' : 'bulking limpo')
                                    : (metrics.bf > 32 ? 'foco em redução de gordura (cutting)' : metrics.bf > 22 ? 'recomposição corporal' : 'bulking limpo')
                                }
                            </span> para otimização estética e saúde.
                        </>
                    }
                />
            </div>
        </div>
    );
};
