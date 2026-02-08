import React from 'react';
import {
    ShapeVRatioCard,
    AvaliacaoGeralCard,
    EvolutionCard,
    InsightCard,
    AchievementsCard,
    SymmetryWidget,
    BodyCompositionCard,
} from '@/components/molecules';
import {
    HeroCard,
    BodyHeatmap,
    ScoreBreakdown,
    MetricsGrid,
    DashboardLoading,
    DashboardError,
    type ProfileType
} from '@/components/organisms';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { Target, BarChart2, Ruler, Zap, Trophy, Scale, Layout, Activity } from 'lucide-react';
import { getHeroContent } from '@/features/dashboard/utils/heroContent';

const SectionHeader: React.FC<{
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    action?: React.ReactNode;
}> = ({ icon, title, subtitle, action }) => (
    <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
            <div className="p-2.5 bg-[#131B2C] rounded-xl border border-white/5 text-primary shadow-lg">
                {icon}
            </div>
            <div>
                <h3 className="text-xl font-bold text-white tracking-tight uppercase">{title}</h3>
                <p className="text-sm text-gray-500 font-light">{subtitle}</p>
            </div>
        </div>
        {action}
    </div>
);

export const DashboardView: React.FC<{ userProfile?: ProfileType }> = ({ userProfile = 'atleta' }) => {
    const { data, isLoading, error } = useDashboard();

    if (isLoading) {
        return (
            <div className="flex-1 p-4 md:p-8 flex flex-col">
                <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10 flex-1 w-full">
                    {/* Title Skeleton */}
                    <div className="flex flex-col animate-pulse">
                        <div className="h-10 bg-gray-800 rounded w-48 mb-2"></div>
                        <div className="h-4 bg-gray-800 rounded w-96"></div>
                    </div>
                    <div className="h-px w-full bg-white/10" />
                    <DashboardLoading />
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex-1 p-4 md:p-8 flex flex-col">
                <DashboardError />
            </div>
        );
    }

    const heroContent = getHeroContent(data);

    return (
        <div className="flex-1 p-4 md:p-8 flex flex-col">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10 flex-1 w-full">

                {/* Header Section */}
                <div className="flex flex-col animate-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">INÍCIO</h2>
                    <p className="text-gray-400 mt-2 font-light">
                        {userProfile === 'academia' && "Gestão completa da sua academia e rede de profissionais."}
                        {userProfile === 'personal' && "Gestão de seus alunos e planilhamento de evoluções."}
                        {userProfile === 'atleta' && "Visão geral da sua simetria e progresso atual."}
                    </p>
                </div>

                <div className="h-px w-full bg-white/10" />

                {/* Hero Card */}
                <HeroCard content={heroContent} />

                <div className="h-px w-full bg-white/5 mt-4" />

                {/* KPIs Row */}
                <section>
                    <SectionHeader
                        icon={<Target size={22} />}
                        title="KPIs de Performance"
                        subtitle="Seus principais indicadores de estética e proporção"
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr">
                        <ShapeVRatioCard data={data.kpi.ratio} />
                        <AvaliacaoGeralCard data={data.kpi.score} />
                        <EvolutionCard data={data.evolution} />
                    </div>
                </section>

                <div className="h-px w-full bg-white/5" />

                {/* Body Composition Row */}
                {data.bodyComposition && (
                    <section>
                        <SectionHeader
                            icon={<Scale size={22} />}
                            title="Composição Corporal"
                            subtitle="Acompanhamento de peso e gordura corporal"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <BodyCompositionCard
                                title="Peso Corporal"
                                current={data.bodyComposition.weight.current}
                                start={data.bodyComposition.weight.start}
                                goal={data.bodyComposition.weight.goal}
                                unit={data.bodyComposition.weight.unit}
                                trend={data.bodyComposition.weight.trend}
                                icon={<Scale size={16} />}
                            />
                            <BodyCompositionCard
                                title="Gordura Corporal"
                                current={data.bodyComposition.bodyFat.current}
                                start={data.bodyComposition.bodyFat.start}
                                goal={data.bodyComposition.bodyFat.goal}
                                unit={data.bodyComposition.bodyFat.unit}
                                trend={data.bodyComposition.bodyFat.trend}
                                classification={data.bodyComposition.bodyFat.classification}
                                icon={<Activity size={16} />}
                            />
                        </div>
                    </section>
                )}

                <div className="h-px w-full bg-white/5" />

                {/* Visualization Row (Heatmap + Breakdown) */}
                <section>
                    <SectionHeader
                        icon={<BarChart2 size={22} />}
                        title="Análise Visual"
                        subtitle="Detalhamento anatômico e distribuição do score"
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-5 flex flex-col h-full">
                            <BodyHeatmap data={data.heatmap} />
                        </div>
                        <div className="lg:col-span-7 flex flex-col h-full">
                            <ScoreBreakdown data={data.currentScores.breakdown} />
                        </div>
                    </div>
                </section>

                <div className="h-px w-full bg-white/5" />

                {/* Metrics Grid */}
                <section>
                    <SectionHeader
                        icon={<Ruler size={22} />}
                        title="Métricas de Medição"
                        subtitle="Acompanhamento detalhado das suas medidas corporais"
                        action={
                            <button className="text-[#00C9A7] text-xs font-bold hover:underline uppercase tracking-wider transition-colors pt-1">
                                Ver todas medidas
                            </button>
                        }
                    />
                    <MetricsGrid metrics={data.metricsGrid} hideHeader />
                </section>

                <div className="h-px w-full bg-white/5" />

                {/* Bottom Row (Insights, Gamification, Symmetry) */}
                <section>
                    <SectionHeader
                        icon={<Layout size={22} />}
                        title="Insights & Gamificação"
                        subtitle="Dicas da IA, conquistas e análise de simetria bilateral"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                        {data.insights.length > 0 && (
                            <InsightCard insight={data.insights[0]} />
                        )}
                        <AchievementsCard data={data.gamification} />
                        {data.symmetry && (
                            <SymmetryWidget data={data.symmetry} />
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};
