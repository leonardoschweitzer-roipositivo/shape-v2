/**
 * GodDashboard — Dashboard principal do administrador GOD
 *
 * Painel de comando completo com:
 * - KPIs macro (academias, personais, atletas, avaliações)
 * - Gráficos (crescimento, scores, atividade, uso IA)
 * - Widgets de gestão (top personais, atletas atenção)
 * - Ações rápidas (bibliotecas, tema)
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
    Building2, Users, UserCheck, Activity,
    Video, BookOpen, Shield, RefreshCw,
} from 'lucide-react';
import { ThemeSwitcher } from '@/components/organisms/ThemeSwitcher/ThemeSwitcher';
import { DEFAULT_THEME_ID, type ThemeId } from '@/config/themes';

import { KPICard } from './KPICard';
import { GrowthChart } from './GrowthChart';
import { ScoreDistributionChart } from './ScoreDistributionChart';
import { ActivityChart } from './ActivityChart';
import { AIUsageChart } from './AIUsageChart';
import { TopPersonaisWidget } from './TopPersonaisWidget';
import { AtletasAtencaoWidget } from './AtletasAtencaoWidget';

import {
    godDashboardService,
    type KPIsMacro,
    type CrescimentoMensal,
    type DistribuicaoScore,
    type AtividadeDiaria,
    type UsoIADiario,
    type PersonalRanking,
    type AtletaAtencao,
    type AcademiasPorPlano,
} from '@/services/godDashboard.service';

// ===== TYPES =====

interface GodDashboardProps {
    onNavigate: (view: string) => void;
}

interface DashboardState {
    kpis: KPIsMacro | null;
    crescimento: CrescimentoMensal[];
    scores: DistribuicaoScore[];
    atividade: AtividadeDiaria[];
    usoIA: UsoIADiario[];
    topPersonais: PersonalRanking[];
    atletasAtencao: AtletaAtencao[];
    academiasPorPlano: AcademiasPorPlano[];
    isLoading: boolean;
}

// ===== ACTION CARD =====

interface ActionCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    onClick: () => void;
    accentColor?: string;
    badge?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ icon: Icon, title, description, onClick, accentColor = 'amber', badge }) => (
    <button
        onClick={onClick}
        className={`group relative flex flex-col gap-4 p-5 rounded-2xl border border-white/10 bg-white/[0.02]
            hover:bg-white/[0.05] hover:border-${accentColor}-500/30 hover:shadow-lg hover:shadow-${accentColor}-500/5
            transition-all duration-300 text-left w-full`}
    >
        {badge && (
            <span className={`absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider
                rounded-full bg-${accentColor}-500/15 text-${accentColor}-400 border border-${accentColor}-500/20`}>
                {badge}
            </span>
        )}
        <div className={`w-10 h-10 rounded-xl bg-${accentColor}-500/10 border border-${accentColor}-500/20
            flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={20} className={`text-${accentColor}-400`} />
        </div>
        <div className="space-y-1">
            <h3 className="text-white font-semibold text-sm">{title}</h3>
            <p className="text-gray-400 text-xs leading-relaxed">{description}</p>
        </div>
    </button>
);

// ===== ACADEMY PLAN CARDS =====

interface AcademyPlanCardsProps {
    data: AcademiasPorPlano[];
    isLoading: boolean;
}

const PLAN_CONFIG: Record<string, { color: string; label: string }> = {
    BASIC: { color: 'gray', label: 'Basic' },
    PRO: { color: 'indigo', label: 'Pro' },
    ENTERPRISE: { color: 'amber', label: 'Enterprise' },
};

const AcademyPlanCards: React.FC<AcademyPlanCardsProps> = ({ data, isLoading }) => (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <div className="flex items-center gap-2 mb-4">
            <Building2 size={16} className="text-purple-400" />
            <h3 className="text-sm font-bold text-white">Academias por Plano</h3>
        </div>
        {isLoading ? (
            <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
                ))}
            </div>
        ) : (
            <div className="grid grid-cols-3 gap-3">
                {data.map(item => {
                    const cfg = PLAN_CONFIG[item.plano] || { color: 'gray', label: item.plano };
                    return (
                        <div
                            key={item.plano}
                            className={`p-3 rounded-xl border border-${cfg.color}-500/20 bg-${cfg.color}-500/5 text-center`}
                        >
                            <div className={`text-xl font-black text-${cfg.color}-400`}>
                                {item.quantidade}
                            </div>
                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">
                                {cfg.label}
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
    </div>
);

// ===== MAIN DASHBOARD =====

const THEME_STORAGE_KEY = 'vitru-theme-id';

export const GodDashboard: React.FC<GodDashboardProps> = ({ onNavigate }) => {
    const [currentThemeId, setCurrentThemeId] = useState<ThemeId>(() => {
        return (localStorage.getItem(THEME_STORAGE_KEY) as ThemeId) || DEFAULT_THEME_ID;
    });

    const [state, setState] = useState<DashboardState>({
        kpis: null,
        crescimento: [],
        scores: [],
        atividade: [],
        usoIA: [],
        topPersonais: [],
        atletasAtencao: [],
        academiasPorPlano: [],
        isLoading: true,
    });

    const handleThemeChange = async (themeId: ThemeId) => {
        localStorage.setItem(THEME_STORAGE_KEY, themeId);
        setCurrentThemeId(themeId);
    };

    const loadData = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true }));
        try {
            const [kpis, crescimento, scores, atividade, usoIA, topPersonais, atletasAtencao, academiasPorPlano] =
                await Promise.all([
                    godDashboardService.fetchKPIsMacro(),
                    godDashboardService.fetchCrescimentoPorMes(),
                    godDashboardService.fetchDistribuicaoScores(),
                    godDashboardService.fetchAtividadeDiaria(),
                    godDashboardService.fetchUsoIA(),
                    godDashboardService.fetchTopPersonais(),
                    godDashboardService.fetchAtletasAtencao(),
                    godDashboardService.fetchAcademiasPorPlano(),
                ]);

            setState({
                kpis,
                crescimento,
                scores,
                atividade,
                usoIA,
                topPersonais,
                atletasAtencao,
                academiasPorPlano,
                isLoading: false,
            });
        } catch (err) {
            console.error('[GodDashboard] Erro ao carregar dados:', err);
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // KPI trend calculation
    const avalTrend = state.kpis
        ? state.kpis.avaliacoesMesAnterior > 0
            ? ((state.kpis.avaliacoesMes - state.kpis.avaliacoesMesAnterior) / state.kpis.avaliacoesMesAnterior) * 100
            : state.kpis.avaliacoesMes > 0 ? 100 : 0
        : undefined;

    return (
        <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                        <Shield size={22} className="text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Painel GOD</h1>
                        <p className="text-gray-400 text-sm">Administração da plataforma VITRU IA</p>
                    </div>
                </div>
                <button
                    onClick={loadData}
                    disabled={state.isLoading}
                    className="p-2.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all text-gray-400 hover:text-white disabled:opacity-50"
                    title="Atualizar dados"
                >
                    <RefreshCw size={18} className={state.isLoading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <KPICard
                    icon={Building2}
                    title="Academias"
                    value={state.kpis?.academias.total ?? 0}
                    subtitle={`${state.kpis?.academias.ativas ?? 0} ativas`}
                    accentColor="purple"
                    isLoading={state.isLoading}
                />
                <KPICard
                    icon={UserCheck}
                    title="Personais"
                    value={state.kpis?.personais.total ?? 0}
                    subtitle={`${state.kpis?.personais.ativos ?? 0} ativos`}
                    accentColor="emerald"
                    isLoading={state.isLoading}
                />
                <KPICard
                    icon={Users}
                    title="Atletas"
                    value={state.kpis?.atletas.total ?? 0}
                    subtitle={`${state.kpis?.atletas.ativos ?? 0} ativos`}
                    accentColor="indigo"
                    isLoading={state.isLoading}
                />
                <KPICard
                    icon={Activity}
                    title="Avaliações/Mês"
                    value={state.kpis?.avaliacoesMes ?? 0}
                    trend={avalTrend}
                    subtitle="vs mês anterior"
                    accentColor="amber"
                    isLoading={state.isLoading}
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <GrowthChart data={state.crescimento} isLoading={state.isLoading} />
                <ScoreDistributionChart data={state.scores} isLoading={state.isLoading} />
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                <ActivityChart data={state.atividade} isLoading={state.isLoading} />
                <AIUsageChart data={state.usoIA} isLoading={state.isLoading} />
            </div>

            {/* Widgets Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                <TopPersonaisWidget data={state.topPersonais} isLoading={state.isLoading} />
                <AtletasAtencaoWidget data={state.atletasAtencao} isLoading={state.isLoading} />
                <AcademyPlanCards data={state.academiasPorPlano} isLoading={state.isLoading} />
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
                {/* Content Management */}
                <div>
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-1">
                        Gestão de Conteúdo
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <ActionCard
                            icon={Video}
                            title="Biblioteca de Exercícios"
                            description="Gerenciar exercícios, upload de vídeos e editar conteúdo."
                            onClick={() => onNavigate('exercicios-biblioteca')}
                            accentColor="amber"
                            badge="Principal"
                        />
                        <ActionCard
                            icon={BookOpen}
                            title="Biblioteca Científica"
                            description="Visualizar artigos e fontes científicas da plataforma."
                            onClick={() => onNavigate('library')}
                            accentColor="blue"
                        />
                    </div>
                </div>

                {/* Appearance */}
                <div>
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-1">
                        Aparência Global
                    </h2>
                    <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                        <ThemeSwitcher
                            currentThemeId={currentThemeId}
                            onThemeChange={handleThemeChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
