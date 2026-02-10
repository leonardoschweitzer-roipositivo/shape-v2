import React from 'react';
import { Users, Activity, TrendingUp, Building2, UserCheck, Calendar, Clock, ArrowUpRight } from 'lucide-react';
import { PersonalStatsCard } from '../Personal/PersonalStatsCard';
import { HeroCard } from '@/components/organisms/HeroCard';
import { HeroContent } from '@/features/dashboard/types';
import { useDataStore } from '@/stores/dataStore';
import {
    mockRecentAcademyActivity,
} from '@/mocks/academy';

interface AcademyDashboardProps {
    onNavigateToPersonals: () => void;
    onNavigateToAthletes: () => void;
}

export const AcademyDashboard: React.FC<AcademyDashboardProps> = ({
    onNavigateToPersonals,
    onNavigateToAthletes,
}) => {
    const { personals, academyStats: stats } = useDataStore();
    const activities = mockRecentAcademyActivity;

    const heroContent: HeroContent = {
        badge: { label: 'GESTÃO EMPRESARIAL', variant: 'primary' },
        date: new Date(),
        title: 'EXPANDA O POTENCIAL \n DA SUA ACADEMIA',
        description: 'Gerencie sua rede de personais, acompanhe a evolução dos alunos e utilize a inteligência de Vitrúvio para elevar o padrão técnico da sua equipe.',
        cta: { label: 'Gerenciar Personais', href: '#', onClick: onNavigateToPersonals },
        image: {
            src: '/images/academy-hero.png',
            alt: 'Academy Dashboard Banner',
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
        return `${Math.floor(diffDays / 7)} semanas atrás`;
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'personal_joined': return '🤝';
            case 'athlete_joined': return '👤';
            case 'personal_invite': return '📨';
            case 'subscription_update': return '💳';
            default: return '📊';
        }
    };

    return (
        <div className="flex-1 p-4 md:p-8 flex flex-col w-full">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10 flex-1 w-full">
                {/* Header Section */}
                <div className="flex flex-col animate-fade-in-up">
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">
                        🏢 DASHBOARD ACADEMIA
                    </h1>
                    <p className="text-gray-400 mt-2 font-light">
                        Bem-vindo, <span className="text-primary font-semibold">Iron Paradise Gym</span>. Gestão ativa de {stats.totalPersonals} personais e {stats.totalAthletes} alunos.
                    </p>
                </div>

                <HeroCard content={heroContent} />

                <div className="h-px w-full bg-white/10" />

                {/* Resumo de KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <PersonalStatsCard
                        title="Personais Ativos"
                        value={stats.totalPersonals}
                        icon={UserCheck}
                        color="primary"
                        showProgress
                        target={stats.maxPersonals}
                    />
                    <PersonalStatsCard
                        title="Total Alunos Rede"
                        value={stats.totalAthletes}
                        icon={Users}
                        color="success"
                    />
                    <PersonalStatsCard
                        title="Score Médio Rede"
                        value={stats.averageScore}
                        variation={stats.scoreVariation}
                        icon={TrendingUp}
                        color="success"
                    />
                    <PersonalStatsCard
                        title="Atividade Semanal"
                        value={(stats.measuredThisWeek / stats.totalAthletes) * 100}
                        unit="%"
                        icon={Activity}
                        color="primary"
                        showProgress
                        target={85}
                    />
                </div>

                <div className="h-px w-full bg-white/10" />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Lista de Personais (Overview) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Building2 className="text-primary" size={24} />
                                Desempenho por Personal
                            </h2>
                            <button
                                onClick={onNavigateToPersonals}
                                className="text-sm text-primary hover:underline font-medium"
                            >
                                Ver todos →
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {personals.slice(0, 4).map((p) => (
                                <div key={p.id} className="bg-card-bg border border-white/10 rounded-xl p-5 hover:border-primary/30 transition-all group">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-white/10">
                                                {p.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold group-hover:text-primary transition-colors">{p.name}</h3>
                                                <p className="text-xs text-gray-400">{p.athleteCount} alunos vinculados</p>
                                            </div>
                                        </div>
                                        <span className={`w-2 h-2 rounded-full ${p.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`} />
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Score Alunos</p>
                                            <p className="text-2xl font-bold text-white tracking-tighter">{p.averageStudentScore}</p>
                                        </div>
                                        <div className="p-2 bg-white/5 rounded-lg group-hover:bg-primary/10 transition-colors">
                                            <ArrowUpRight size={16} className="text-gray-400 group-hover:text-primary" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Atividade Recente & Próximas Ações */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Clock className="text-primary" size={24} />
                            Atividade
                        </h2>
                        <div className="bg-card-bg border border-card-border rounded-xl p-6 space-y-4">
                            {activities.map((activity) => (
                                <div key={activity.id} className="flex gap-3">
                                    <span className="text-xl flex-shrink-0">{getActivityIcon(activity.type)}</span>
                                    <div>
                                        <p className="text-sm text-gray-200 leading-tight">{activity.message}</p>
                                        <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
                                            {formatRelativeDate(activity.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/10 rounded-xl p-6">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                                <Calendar className="text-primary" size={20} />
                                Gestão do Plano
                            </h2>
                            <ul className="space-y-3">
                                <li className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Vagas Personais</span>
                                    <span className="text-white font-medium">{stats.totalPersonals} / {stats.maxPersonals}</span>
                                </li>
                                <li className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Próximo Vencimento</span>
                                    <span className="text-white font-medium">12/03/2026</span>
                                </li>
                                <li className="mt-4 pt-4 border-t border-white/10">
                                    <button className="w-full py-2 bg-primary/20 text-primary border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-primary/30 transition-all">
                                        Upgrade de Plano
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
