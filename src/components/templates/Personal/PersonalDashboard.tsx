import React from 'react';
import { Users, Activity, TrendingUp, AlertCircle, Trophy, Clock, Calendar, Sparkles, User, Ruler, Target, ChevronRight } from 'lucide-react';
import { PersonalStatsCard } from './PersonalStatsCard';
import { HeroCard } from '@/components/organisms/HeroCard';
import { HeroContent } from '@/features/dashboard/types';
import { useDataStore } from '@/stores/dataStore';
import { useAuthStore } from '@/stores/authStore';

interface PersonalDashboardProps {
    onNavigateToAthlete: (athleteId: string) => void;
    onNavigateToAthletes: () => void;
}

export const PersonalDashboard: React.FC<PersonalDashboardProps> = ({
    onNavigateToAthlete,
    onNavigateToAthletes,
}) => {
    const { personalAthletes, dataSource } = useDataStore();
    const { profile: authProfile, entity } = useAuthStore();

    // Nome do personal: vem do entity (Supabase) ou profile (Auth)
    const personalName = entity.personal?.nome || authProfile?.full_name || 'Personal';

    // Calculate stats from store
    const totalAthletes = personalAthletes.length;

    // Calcula o score médio baseado nos scores que não são zero
    const athletesWithScore = personalAthletes.filter(a => (a.score || 0) > 0);
    const averageScore = athletesWithScore.length > 0
        ? Math.round(athletesWithScore.reduce((acc, a) => acc + (a.score || 0), 0) / athletesWithScore.length * 10) / 10
        : 0;

    const measuredThisWeek = personalAthletes.filter(a => {
        if (!a.lastMeasurement) return false;
        const lastDate = new Date(a.lastMeasurement);
        const diff = Date.now() - lastDate.getTime();
        return diff < 7 * 24 * 60 * 60 * 1000;
    }).length;

    const stats = {
        totalAthletes,
        maxAthletes: 50, // Limite do plano (pode vir do perfil no futuro)
        measuredThisWeek,
        averageScore,
        scoreVariation: 0, // Variação média global será calculada a partir do histórico no futuro
        needsAttention: personalAthletes.filter(a => (a.score || 0) > 0 && (a.score || 0) < 60).length
    };

    const athletesNeedingAttention = personalAthletes
        .filter(a => (a.score || 0) < 60 && a.assessments?.length > 0)
        .slice(0, 3)
        .map(a => ({
            id: a.id,
            name: a.name,
            score: a.score,
            scoreVariation: a.scoreVariation,
            lastMeasurement: a.lastMeasurement,
            reason: a.score < 50 ? 'Score crítico, agendar reavaliação' : 'Score abaixo da média'
        }));

    const topPerformers = [...personalAthletes]
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 5)
        .map((a, idx) => ({
            id: a.id,
            name: a.name,
            score: a.score,
            ratio: a.ratio,
            position: idx + 1
        }));

    const recentActivity = personalAthletes
        .filter(a => a.lastMeasurement)
        .sort((a, b) => new Date(b.lastMeasurement).getTime() - new Date(a.lastMeasurement).getTime())
        .slice(0, 5)
        .map((a, idx) => ({
            id: `activity-${idx}`,
            type: 'measurement',
            athleteName: a.name,
            action: 'registrou nova medição',
            timestamp: a.lastMeasurement,
        }));

    const heroContent: HeroContent = {
        badge: { label: 'GESTÃO E PERFORMANCE', variant: 'primary' },
        date: new Date(),
        title: 'POTENCIALIZE OS RESULTADOS \n DOS SEUS ALUNOS',
        description: 'Utilize a inteligência de Vitrúvio para acompanhar métricas, identificar assimetrias e gerar planos de ação baseados em proporções áureas para cada um de seus atletas.',
        cta: { label: 'Gerenciar Alunos', href: '#', onClick: onNavigateToAthletes },
        image: {
            src: '/images/personal-hero.png',
            alt: 'Personal Dashboard Banner',
            position: 'background'
        }
    };

    const formatRelativeDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Hoje';
        if (diffDays === 1) return 'Ontem';
        if (diffDays < 7) return `${diffDays} dias atrás`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
        return `${Math.floor(diffDays / 30)} meses atrás`;
    };

    const formatActivityTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffMinutes < 60) return `${diffMinutes}min atrás`;
        if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h atrás`;
        return formatRelativeDate(timestamp);
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'measurement':
                return <Ruler size={18} className="text-amber-500" />;
            case 'goal':
                return <Target size={18} className="text-amber-500" />;
            case 'record':
                return <Trophy size={18} className="text-amber-500" />;
            default:
                return <Activity size={18} className="text-amber-500" />;
        }
    };

    const getMedalEmoji = (position: number) => {
        switch (position) {
            case 1:
                return '🥇';
            case 2:
                return '🥈';
            case 3:
                return '🥉';
            default:
                return '';
        }
    };

    return (
        <div className="flex-1 p-4 md:p-8 flex flex-col w-full">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10 flex-1 w-full">
                {/* Header de Boas-Vindas */}
                <div className="flex flex-col animate-fade-in-up">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                            <Sparkles size={20} className="text-indigo-400" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none">
                            OLÁ, {personalName.split(' ')[0].toUpperCase()}
                            <span className="text-indigo-500 mx-1">.</span>
                        </h1>
                    </div>
                    <p className="text-zinc-500 mt-3 font-bold text-[11px] uppercase tracking-[0.25em] flex items-center gap-2">
                        Você tem <span className="text-indigo-400 font-black">{stats.totalAthletes} alunos ativos</span> de {stats.maxAthletes} no seu plano.
                        {dataSource === 'SUPABASE' && <span className="text-[10px] text-emerald-500 flex items-center gap-1.5 ml-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Dados reais
                        </span>}
                    </p>
                </div>

                <HeroCard content={heroContent} />

                <div className="h-px w-full bg-white/10" />

                {/* Cards de Resumo */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <PersonalStatsCard
                        title="Alunos Ativos"
                        value={stats.totalAthletes}
                        icon={Users}
                        color="primary"
                        showProgress
                        target={stats.maxAthletes}
                    />
                    <PersonalStatsCard
                        title="Mediram esta Semana"
                        value={(stats.measuredThisWeek / (stats.totalAthletes || 1)) * 100}
                        unit="%"
                        icon={Activity}
                        color="primary"
                        showProgress
                        target={80}
                    />
                    <PersonalStatsCard
                        title="Score Médio"
                        value={stats.averageScore}
                        variation={stats.scoreVariation}
                        icon={TrendingUp}
                        color="primary"
                    />
                    <PersonalStatsCard
                        title="Precisam de Atenção"
                        value={stats.needsAttention}
                        icon={AlertCircle}
                        color="warning"
                    />
                </div>

                {/* Alunos que Precisam de Atenção */}
                <div className="bg-slate-950/25 backdrop-blur-sm border border-white/5 rounded-3xl p-8 shadow-2xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-xl shadow-amber-500/10">
                            <AlertCircle className="text-amber-500" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-none">
                                Alunos Sob Atenção
                            </h2>
                            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-1.5">
                                Casos críticos que exigem ação estratégica imediata
                            </p>
                        </div>
                    </div>

                    {athletesNeedingAttention.map((athlete) => (
                        <div
                            key={athlete.id}
                            className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5 hover:bg-zinc-800/50 hover:border-indigo-500/30 transition-all cursor-pointer group mb-4 last:mb-0"
                            onClick={() => onNavigateToAthlete(athlete.id)}
                        >
                            <div className="flex items-center justify-between group-hover:translate-x-1 transition-transform">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-black text-sm uppercase tracking-tight">{athlete.name}</h3>
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1.5">{athlete.reason}</p>
                                        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-1">
                                            Última medição: {formatRelativeDate(athlete.lastMeasurement)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end gap-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-2xl font-black text-indigo-400 tracking-tighter">{athlete.score}</p>
                                        {athlete.scoreVariation !== 0 && (
                                            <span className={`text-[10px] font-black ${athlete.scoreVariation > 0 ? 'text-emerald-500' : 'text-rose-500'} flex items-center gap-0.5 bg-white/5 px-2 py-0.5 rounded-full`}>
                                                {athlete.scoreVariation > 0 ? '↑' : '↓'} {Math.abs(athlete.scoreVariation)}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Score Vitru</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Grid: Top Performers + Atividade Recente */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Performers */}
                    <div className="bg-slate-950/25 backdrop-blur-sm border border-white/5 rounded-3xl p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-xl shadow-indigo-500/10">
                                    <Trophy className="text-indigo-400" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-none">
                                        Top Performers
                                    </h2>
                                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-1.5">
                                        Ranking de elite baseado no score Vitru de proporções
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onNavigateToAthletes}
                                className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2"
                            >
                                Ver ranking completo <ChevronRight size={14} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {topPerformers.map((athlete, idx) => (
                                <div
                                    key={athlete.id}
                                    className="p-4 rounded-2xl bg-zinc-900/30 border border-transparent hover:bg-zinc-800/40 hover:border-white/5 transition-all cursor-pointer group"
                                    onClick={() => onNavigateToAthlete(athlete.id)}
                                >
                                    <div className="flex items-center justify-between group-hover:translate-x-1 transition-transform">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-zinc-900/50 flex items-center justify-center border border-white/5 text-xl group-hover:border-indigo-500/30 transition-colors">
                                                {idx === 0 ? <Trophy size={20} className="text-amber-500" /> :
                                                    idx === 1 ? <Trophy size={20} className="text-zinc-400" /> :
                                                        idx === 2 ? <Trophy size={20} className="text-amber-700" /> :
                                                            <User size={18} className="text-zinc-600" />}
                                            </div>
                                            <div>
                                                <p className="text-white font-black text-sm uppercase tracking-tight">{athlete.name}</p>
                                                <p className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-widest mt-0.5">Ratio: {typeof athlete.ratio === 'number' ? athlete.ratio.toFixed(2) : athlete.ratio}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-1">
                                            <p className="text-xl font-black text-indigo-400 tracking-tighter">{athlete.score}</p>
                                            <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-[0.2em]">PONTOS</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Atividade Recente */}
                    <div className="bg-slate-950/25 backdrop-blur-sm border border-white/5 rounded-3xl p-8 shadow-2xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-xl shadow-indigo-500/10">
                                <Clock className="text-indigo-400" size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-none">
                                    Atividade Recente
                                </h2>
                                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-1.5">
                                    Histórico de interações e registros nas últimas 24h
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {recentActivity.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/30 border border-transparent hover:bg-zinc-800/40 hover:border-white/5 transition-all cursor-pointer group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-900/50 flex items-center justify-center border border-white/5 group-hover:border-amber-500/30 transition-colors">
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white text-sm font-black uppercase tracking-tight">
                                            {activity.athleteName}
                                        </p>
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                                            {activity.action.toLowerCase()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-1.5">
                                            <Clock size={10} />
                                            {formatActivityTime(activity.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-950/25 backdrop-blur-sm border border-white/5 rounded-3xl p-8 shadow-2xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-xl shadow-indigo-500/10">
                            <Calendar className="text-indigo-400" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-none">
                                Próximas Ações
                            </h2>
                            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-1.5">
                                Sugestões de atendimento e acompanhamento para hoje
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-5 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-indigo-500/20 transition-all group">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-3 group-hover:bg-indigo-500/20 transition-colors">
                                <AlertCircle size={16} className="text-indigo-400" />
                            </div>
                            <p className="text-xs font-bold text-white uppercase tracking-tight leading-relaxed">
                                <span className="text-indigo-400 font-black">{stats.totalAthletes - stats.measuredThisWeek} alunos</span> sem medidas há mais de 7 dias
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-emerald-500/20 transition-all group">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3 group-hover:bg-emerald-500/20 transition-colors">
                                <Target size={16} className="text-emerald-400" />
                            </div>
                            <p className="text-xs font-bold text-white uppercase tracking-tight leading-relaxed">
                                <span className="text-emerald-400 font-black">2 alunos</span> extremamente próximos de bater suas metas
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-amber-500/20 transition-all group">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3 group-hover:bg-amber-500/20 transition-colors">
                                <Sparkles size={16} className="text-amber-400" />
                            </div>
                            <p className="text-xs font-bold text-white uppercase tracking-tight leading-relaxed">
                                <span className="text-amber-400 font-black">1 aluno</span> celebrando aniversário especial esta semana
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
