import React, { useState, useMemo } from 'react';
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
}

export const DiagnosticTab: React.FC<DiagnosticTabProps> = ({ assessment, gender = 'male' }) => {
    const [filter, setFilter] = useState<'todos' | 'comp' | 'metrics'>('todos');
    const [bfMethod, setBfMethod] = useState<'navy' | 'pollock'>('navy');

    // Calculate metrics
    const metrics = useMemo(() => {
        if (!assessment) return {
            weight: 88.5,
            leanMass: 77.1,
            fatMass: 11.4,
            bf: 12.9,
            score: 80
        };

        const { weight, height, waist, neck, hips } = assessment.measurements;
        let bf = 0;

        if (bfMethod === 'pollock') {
            const s = assessment.skinfolds;
            const sumSkinfolds = s.tricep + s.subscapular + s.chest + s.axillary + s.suprailiac + s.abdominal + s.thigh;
            const age = 30; // Default age as we don't have it in props yet

            // Pollock 7-site formula
            let bodyDensity;
            if (gender === 'male') {
                bodyDensity = 1.112 - 0.00043499 * sumSkinfolds + 0.00000055 * sumSkinfolds * sumSkinfolds - 0.00028826 * age;
            } else {
                bodyDensity = 1.097 - 0.00046971 * sumSkinfolds + 0.00000056 * sumSkinfolds * sumSkinfolds - 0.00012828 * age;
            }
            bf = Math.max(0, (495 / bodyDensity) - 450);
        } else {
            // Navy Method
            // Formula from PRD: BF% = 86.010 × log10(cintura - pescoço) - 70.041 × log10(altura) + 36.76
            // Note: This is the metric version coefficients
            if (gender === 'male') {
                bf = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
            } else {
                // Female Navy (Metric): 163.205 × log10(waist + hip - neck) - 97.684 × log10(height) - 104.912
                bf = 163.205 * Math.log10(waist + (hips || waist) - neck) - 97.684 * Math.log10(height) - 104.912;
            }
        }

        bf = Math.max(2, bf); // Minimum 2%
        const fatMass = weight * (bf / 100);
        const leanMass = weight - fatMass;

        // Simple score calculation based on symmetry and bf (mock logic)
        const score = Math.min(100, Math.max(50, 85 - (bf - 10) * 0.5));

        return {
            weight,
            leanMass: parseFloat(leanMass.toFixed(1)),
            fatMass: parseFloat(fatMass.toFixed(1)),
            bf: parseFloat(bf.toFixed(1)),
            score: Math.round(score)
        };
    }, [assessment, gender, bfMethod]);

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
                        <ScoreWidget score={metrics.score} label="Pontos" change="+5%" />
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
                            Com base na análise de simetria bilateral, o cliente apresenta um <span className="text-white font-medium">desequilíbrio leve</span>. O percentual de gordura ({metrics.bf.toFixed(1)}%) está em um ponto {metrics.bf < 15 ? 'excelente' : 'bom'} para focar em <span className="text-primary font-bold">{metrics.bf < 12 ? 'ganho de massa limpa' : 'recomposição corporal'}</span>, focando em progressão de carga nos compostos principais.
                        </>
                    }
                />
            </div>
        </div>
    );
};
