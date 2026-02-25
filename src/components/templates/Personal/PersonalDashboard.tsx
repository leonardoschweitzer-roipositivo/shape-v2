import React from 'react';
import { Users, Activity, TrendingUp, AlertCircle, Trophy, Clock, Calendar } from 'lucide-react';
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
                return '📏';
            case 'goal':
                return '🎯';
            case 'record':
                return '🏆';
            default:
                return '📊';
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
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">
                        👋 OLÁ, {personalName.split(' ')[0].toUpperCase()}!
                    </h1>
                    <p className="text-gray-400 mt-2 font-light">
                        Você tem <span className="text-primary font-semibold">{stats.totalAthletes} alunos ativos</span> de {stats.maxAthletes} no seu plano.
                        {dataSource === 'SUPABASE' && <span className="text-xs text-green-500 ml-2">● Dados reais</span>}
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
                        value={(stats.measuredThisWeek / stats.totalAthletes) * 100}
                        unit="%"
                        icon={Activity}
                        color="success"
                        showProgress
                        target={80}
                    />
                    <PersonalStatsCard
                        title="Score Médio"
                        value={stats.averageScore}
                        variation={stats.scoreVariation}
                        icon={TrendingUp}
                        color="success"
                    />
                    <PersonalStatsCard
                        title="Precisam de Atenção"
                        value={stats.needsAttention}
                        icon={AlertCircle}
                        color="warning"
                    />
                </div>

                {/* Alunos que Precisam de Atenção */}
                {athletesNeedingAttention.length > 0 && (
                    <div className="bg-card-bg border border-card-border rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <AlertCircle className="text-amber-500" size={24} />
                                Alunos que Precisam de Atenção
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {athletesNeedingAttention.map((athlete) => (
                                <div
                                    key={athlete.id}
                                    className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer"
                                    onClick={() => onNavigateToAthlete(athlete.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xl">
                                                👤
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold">{athlete.name}</h3>
                                                <p className="text-sm text-gray-400">{athlete.reason}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-2">
                                                <span className="text-white font-semibold">Score: {athlete.score}</span>
                                                {athlete.scoreVariation !== 0 && (
                                                    <span className={`text-sm ${athlete.scoreVariation > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                        ({athlete.scoreVariation > 0 ? '+' : ''}{athlete.scoreVariation})
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Última medição: {formatRelativeDate(athlete.lastMeasurement)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Grid: Top Performers + Atividade Recente */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Performers */}
                    <div className="bg-card-bg border border-card-border rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Trophy className="text-amber-500" size={24} />
                                Top Performers
                            </h2>
                            <button
                                onClick={onNavigateToAthletes}
                                className="text-sm text-primary hover:text-primary/80 transition-colors"
                            >
                                Ver ranking completo →
                            </button>
                        </div>

                        <div className="space-y-3">
                            {topPerformers.map((athlete) => (
                                <div
                                    key={athlete.id}
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                                    onClick={() => onNavigateToAthlete(athlete.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{getMedalEmoji(athlete.position)}</span>
                                        <div>
                                            <p className="text-white font-medium">{athlete.name}</p>
                                            <p className="text-xs text-gray-400">Ratio: {athlete.ratio}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-primary">{athlete.score} pts</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Atividade Recente */}
                    <div className="bg-card-bg border border-card-border rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Clock className="text-primary" size={24} />
                                Atividade Recente
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {recentActivity.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-all"
                                >
                                    <span className="text-xl">{getActivityIcon(activity.type)}</span>
                                    <div className="flex-1">
                                        <p className="text-white text-sm">
                                            <span className="font-semibold">{activity.athleteName}</span> {activity.action.toLowerCase()}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formatActivityTime(activity.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Próximas Ações */}
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                        <Calendar className="text-primary" size={24} />
                        Próximas Ações
                    </h2>
                    <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{stats.totalAthletes - stats.measuredThisWeek} alunos não medem há mais de 7 dias</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>2 alunos próximos de bater meta</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>1 aluno com aniversário esta semana 🎂</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
