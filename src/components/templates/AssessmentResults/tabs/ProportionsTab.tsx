import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { ProportionCard, ProportionAiAnalysisCard } from '@/components/organisms';
import { colors as designColors, typography as designTypography, spacing as designSpacing } from '@/tokens';
import type { ComparisonMode, Measurements } from '../types';
import { useProportionCalculations } from '../hooks/useProportionCalculations';
import { extractProportionRatios } from '../config/proportionItems';
import { enriquecerProporcoesComIA, type ProporcoesIA } from '@/services/calculations/assessment';
import { type PerfilAtletaIA } from '@/services/vitruviusContext';

import { useAthleteStore } from '@/stores/athleteStore';
import { useDataStore } from '@/stores/dataStore';

// Mock data - in future this will come from assessment context
const MOCK_MALE_MEASUREMENTS: Measurements = {
    altura: 178,
    peso: 88.5,
    ombros: 130,
    peito: 115,
    busto: 115,
    costas: 122,
    cintura: 82,
    quadril: 100,
    braco: 44,
    antebraco: 32,
    punho: 17.5,
    pescoco: 41,
    coxa: 63,
    joelho: 36,
    panturrilha: 42,
    tornozelo: 22,
    pelvis: 100,
    cabeca: 56
};

// Mock Female Measurements (Wellness/Bikini Profile)
const MOCK_FEMALE_MEASUREMENTS: Measurements = {
    altura: 165,
    peso: 62.0,
    ombros: 108,
    peito: 92, // Busto
    busto: 92,
    costas: 95,
    cintura: 64,
    quadril: 102,
    braco: 30,
    antebraco: 24,
    punho: 15,
    pescoco: 32,
    coxa: 58,
    joelho: 36,
    panturrilha: 36,
    tornozelo: 20,
    pelvis: 90,
    cabeca: 54,
    gluteo_dobra: 102 // Approximated
};


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

interface ProportionsTabProps {
    userMeasurements?: Measurements;
    gender?: 'male' | 'female'; // Optional override
}

export const ProportionsTab: React.FC<ProportionsTabProps> = ({
    userMeasurements,
    gender
}) => {
    const { profile } = useAthleteStore();
    const { personalAthletes } = useDataStore();

    // Determine effective gender: prop > store > default(male)
    const effectiveGender = gender || (profile?.gender === 'FEMALE' ? 'female' : 'male');

    // Determine initial mode based on gender
    const [comparisonMode, setComparisonMode] = useState<ComparisonMode>(
        effectiveGender === 'female' ? 'female_golden' : 'golden'
    );

    // AI state
    const [proporcoesIA, setProporcoesIA] = useState<ProporcoesIA | null>(null);
    const [iaLoading, setIaLoading] = useState(false);

    // Use mock data if not provided, selecting based on gender
    const activeMeasurements = userMeasurements || (effectiveGender === 'female' ? MOCK_FEMALE_MEASUREMENTS : MOCK_MALE_MEASUREMENTS);

    // Use custom hook for calculations
    const { proportionItems } = useProportionCalculations(activeMeasurements, comparisonMode);

    // Enriquecer proporções com IA
    useEffect(() => {
        if (!proportionItems.length) return;

        // Build proportion data for AI
        const snapshots = extractProportionRatios(activeMeasurements, comparisonMode);
        const proportionData = snapshots.map(s => ({
            title: s.nome,
            ratio: s.atual,
            ideal: s.ideal,
            pct: s.pct,
            status: s.status,
        }));

        // Build athlete profile
        const athlete = personalAthletes.find(a => a.id === profile?.id) || personalAthletes[0];
        const perfil: PerfilAtletaIA = {
            nome: athlete?.name || profile?.name || 'Atleta',
            sexo: effectiveGender === 'female' ? 'F' : 'M',
            idade: athlete?.birthDate ? Math.floor((Date.now() - new Date(athlete.birthDate).getTime()) / 31557600000) : 30,
            altura: activeMeasurements.altura,
            peso: activeMeasurements.peso,
            gorduraPct: 15, // fallback
            score: profile?.latestScore?.overall || 0,
            classificacao: 'N/A',
            medidas: activeMeasurements as Record<string, number>,
            contexto: athlete?.contexto as any,
        };

        setIaLoading(true);
        setProporcoesIA(null);
        enriquecerProporcoesComIA(proportionData, perfil)
            .then(result => {
                if (result) {
                    console.info('[ProportionsTab] 🤖 Proporções enriquecidas com IA');
                    setProporcoesIA(result);
                }
            })
            .finally(() => setIaLoading(false));
    }, [activeMeasurements, comparisonMode]);

    return (
        <div className="flex flex-col gap-8 animate-fade-in-up w-full">
            {/* Header Description & Control Bar */}
            <div className="flex flex-col lg:flex-row justify-between items-end gap-6 mb-2">
                <div className="flex-1 animate-fade-in-up">
                    <div className="flex items-center gap-3 mb-2">
                        <div style={tokenStyles.iconBadge}>
                            <Sparkles size={16} color={designColors.brand.primary} />
                        </div>
                        <h3 style={tokenStyles.sectionTitle}>DIMENSÕES ÁUREAS {effectiveGender === 'female' && 'FEMININAS'}</h3>
                    </div>
                    <p style={tokenStyles.description} className="max-w-2xl">
                        Mapeamento matemático do seu físico em relação aos ideais clássicos.
                        {effectiveGender === 'female'
                            ? " Foco em WHR (Cintura-Quadril) e harmonia de silhueta (Ampulheta)."
                            : <><span style={{ color: designColors.brand.primary, fontWeight: designTypography.fontWeight.medium }}> Shape-V</span> é o pilar central, definindo a harmonia estética.</>
                        }
                    </p>
                </div>

                <div style={tokenStyles.filterContainer}>
                    {effectiveGender === 'female' ? (
                        <>
                            <button
                                onClick={() => setComparisonMode('female_golden')}
                                style={tokenStyles.filterButton(comparisonMode === 'female_golden')}
                            >
                                {comparisonMode === 'female_golden' && <Sparkles size={12} color={designColors.brand.primary} />}
                                Golden ♀
                            </button>
                            <button
                                onClick={() => setComparisonMode('bikini')}
                                style={tokenStyles.filterButton(comparisonMode === 'bikini')}
                            >
                                🩱 Bikini
                            </button>
                            <button
                                onClick={() => setComparisonMode('wellness')}
                                style={tokenStyles.filterButton(comparisonMode === 'wellness')}
                            >
                                🏃 Wellness
                            </button>
                            <button
                                onClick={() => setComparisonMode('figure')}
                                style={tokenStyles.filterButton(comparisonMode === 'figure')}
                            >
                                👙 Figure
                            </button>
                            <button
                                onClick={() => setComparisonMode('womens_physique')}
                                style={tokenStyles.filterButton(comparisonMode === 'womens_physique')}
                            >
                                💪 Physique
                            </button>
                            <button
                                onClick={() => setComparisonMode('womens_bodybuilding')}
                                style={tokenStyles.filterButton(comparisonMode === 'womens_bodybuilding')}
                            >
                                🏆 W.BB
                            </button>
                        </>
                    ) : (
                        <>
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
                            <button
                                onClick={() => setComparisonMode('open')}
                                style={tokenStyles.filterButton(comparisonMode === 'open')}
                            >
                                Open
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Widgets Pairs */}
            <div className="flex flex-col gap-8">
                {proportionItems.map((item, index) => {
                    // Resolve AI data for this proportion if available
                    const aiData = proporcoesIA?.proporcoes?.[item.card.title];

                    return (
                        <div key={index}>
                            <div className="flex flex-col lg:flex-row gap-6 w-full items-stretch">
                                {/* Left: Proportion Card */}
                                <div className="flex-1 min-w-0">
                                    <ProportionCard {...item.card} />
                                </div>

                                {/* Right: AI Analysis Card (Matched Height) */}
                                <div className="w-full lg:w-80 flex-shrink-0">
                                    {iaLoading ? (
                                        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 h-full flex items-center gap-3">
                                            <Loader2 size={18} className="text-primary animate-spin" />
                                            <p className="text-xs text-gray-500">Analisando {item.card.title}...</p>
                                        </div>
                                    ) : (
                                        <ProportionAiAnalysisCard
                                            analysis={aiData?.analysis || item.ai.analysis}
                                            suggestion={aiData?.suggestion || item.ai.suggestion}
                                            goal12m={aiData?.goal12m || item.ai.goal12m}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Divider between rows (not after the last one) */}
                            {index < proportionItems.length - 1 && (
                                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent mt-8"></div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
