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
import { calcularAvaliacaoGeral } from '@/services/calculations';
import { AvaliacaoGeralInput } from '@/types/assessment.ts';

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

        const m = assessment.measurements;
        const { weight, height, waist, neck, hips } = m;
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

        // Helper to calculate ratio percentage for General Assessment Input
        const getRatioPercent = (current: number, target: number, inverse = false) => {
            if (!target || !current) return 0;
            if (inverse) return current <= target ? 100 : Math.round(Math.max(0, (target / current) * 100) * 10) / 10;
            return Math.round(Math.min(100, (current / target) * 100) * 10) / 10;
        };

        const punho = (m.wristLeft + m.wristRight) / 2 || 17;
        const joelho = (m.kneeLeft + m.kneeRight) / 2 || 40;
        const tornozelo = (m.ankleLeft + m.ankleRight) / 2 || 22;
        const bracoMedio = (m.armLeft + m.armRight) / 2;
        const pantMedio = (m.calfLeft + m.calfRight) / 2;
        const coxaMedia = (m.thighLeft + m.thighRight) / 2;

        const vTaperAtual = m.shoulders / m.waist;
        const vTaperMeta = 1.618;
        const vTaperScore = getRatioPercent(vTaperAtual, vTaperMeta);

        const peitoRatio = m.chest / punho;
        const peitoMeta = 6.5;
        const peitoScore = getRatioPercent(peitoRatio, peitoMeta);

        const bracoRatio = bracoMedio / punho;
        const bracoMeta = 2.5;
        const bracoScore = getRatioPercent(bracoRatio, bracoMeta);

        const cinturaRatio = m.waist / height;
        const cinturaMeta = 0.45;
        const cinturaScore = getRatioPercent(cinturaRatio, cinturaMeta, true);

        const triadeMedia = (bracoMedio + pantMedio + neck) / 3;
        const triadeDesvio = (Math.abs(bracoMedio - triadeMedia) + Math.abs(pantMedio - triadeMedia) + Math.abs(neck - triadeMedia)) / triadeMedia / 3;
        const triadeScore = Math.max(0, Math.round((1 - triadeDesvio) * 100 * 10) / 10);

        // Map data to AvaliacaoGeralInput
        const assessmentInput: AvaliacaoGeralInput = {
            proporcoes: {
                metodo: 'golden',
                vTaper: { indiceAtual: vTaperAtual, indiceMeta: vTaperMeta, percentualDoIdeal: vTaperScore, classificacao: 'NORMAL' },
                peitoral: { indiceAtual: peitoRatio, indiceMeta: peitoMeta, percentualDoIdeal: peitoScore, classificacao: 'NORMAL' },
                braco: { indiceAtual: bracoRatio, indiceMeta: bracoMeta, percentualDoIdeal: bracoScore, classificacao: 'NORMAL' },
                antebraco: { indiceAtual: (m.forearmLeft + m.forearmRight) / 2 / bracoMedio, indiceMeta: 0.8, percentualDoIdeal: getRatioPercent((m.forearmLeft + m.forearmRight) / 2 / bracoMedio, 0.8), classificacao: 'NORMAL' },
                triade: { harmoniaPercentual: triadeScore, pescoco: neck, braco: bracoMedio, panturrilha: pantMedio },
                cintura: { indiceAtual: cinturaRatio, indiceMeta: cinturaMeta, percentualDoIdeal: cinturaScore, classificacao: 'NORMAL' },
                coxa: { indiceAtual: coxaMedia / joelho, indiceMeta: 1.75, percentualDoIdeal: getRatioPercent(coxaMedia / joelho, 1.75), classificacao: 'NORMAL' },
                coxaPanturrilha: { indiceAtual: coxaMedia / pantMedio, indiceMeta: 1.5, percentualDoIdeal: getRatioPercent(coxaMedia / pantMedio, 1.5), classificacao: 'NORMAL' },
                panturrilha: { indiceAtual: pantMedio / tornozelo, indiceMeta: 1.9, percentualDoIdeal: getRatioPercent(pantMedio / tornozelo, 1.9), classificacao: 'NORMAL' },
            },
            composicao: {
                peso: weight,
                altura: height,
                idade: 30,
                genero: gender === 'female' ? 'FEMALE' : 'MALE',
                bf,
                metodo_bf: bfMethod === 'pollock' ? 'POLLOCK_7' : 'NAVY',
                pesoMagro: leanMass,
                pesoGordo: fatMass,
            },
            assimetrias: {
                braco: { esquerdo: m.armLeft, direito: m.armRight, diferenca: Math.abs(m.armLeft - m.armRight), diferencaPercentual: (Math.abs(m.armLeft - m.armRight) / ((m.armLeft + m.armRight) / 2)) * 100, status: 'SIMETRICO' },
                antebraco: { esquerdo: m.forearmLeft, direito: m.forearmRight, diferenca: Math.abs(m.forearmLeft - m.forearmRight), diferencaPercentual: (Math.abs(m.forearmLeft - m.forearmRight) / ((m.forearmLeft + m.forearmRight) / 2)) * 100, status: 'SIMETRICO' },
                coxa: { esquerdo: m.thighLeft, direito: m.thighRight, diferenca: Math.abs(m.thighLeft - m.thighRight), diferencaPercentual: (Math.abs(m.thighLeft - m.thighRight) / ((m.thighLeft + m.thighRight) / 2)) * 100, status: 'SIMETRICO' },
                panturrilha: { esquerdo: m.calfLeft, direito: m.calfRight, diferenca: Math.abs(m.calfLeft - m.calfRight), diferencaPercentual: (Math.abs(m.calfLeft - m.calfRight) / ((m.calfLeft + m.calfRight) / 2)) * 100, status: 'SIMETRICO' },
            }
        };

        const result = calcularAvaliacaoGeral(assessmentInput);

        return {
            weight,
            leanMass: parseFloat(leanMass.toFixed(1)),
            fatMass: parseFloat(fatMass.toFixed(1)),
            bf: parseFloat(bf.toFixed(1)),
            score: result.avaliacaoGeral,
            classificacao: result.classificacao
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
                            Com base na análise de simetria bilateral, o cliente apresenta um <span className="text-white font-medium">{metrics.score > 80 ? 'excelente equilíbrio' : 'desequilíbrio leve'}</span>. O percentual de gordura ({metrics.bf.toFixed(1)}%) indica necessidade de <span className="text-primary font-bold">{metrics.bf > 25 ? 'foco em redução de gordura (cutting)' : metrics.bf > 15 ? 'recomposição corporal' : 'bulking limpo'}</span> para otimização estética e saúde.
                        </>
                    }
                />
            </div>
        </div>
    );
};
