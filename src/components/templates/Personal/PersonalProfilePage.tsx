import React, { useState } from 'react';
import {
    User,
    Mail,
    Award,
    Briefcase,
    Calendar,
    Users,
    TrendingUp,
    Shield,
    ChevronRight,
    Edit3,
    Check,
    X,
    Instagram,
    MessageCircle
} from 'lucide-react';
import { mockPersonalProfile, PersonalProfile } from '@/mocks/personal';

// ============================================
// SUB-COMPONENTS
// ============================================

const ProfileHeader: React.FC<{ profile: PersonalProfile }> = ({ profile }) => {
    const initials = profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

    return (
        <div className="flex items-center gap-6 p-6 bg-[#131B2C] rounded-2xl border border-white/10 shadow-xl animate-fade-in-up">
            {/* Avatar */}
            <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30 flex items-center justify-center">
                    {profile.avatarUrl ? (
                        <img
                            src={profile.avatarUrl}
                            alt={profile.name}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <span className="text-3xl font-bold text-primary">{initials}</span>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                    <div className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-[10px] font-bold text-primary uppercase tracking-widest">
                        PERSONAL TRAINER
                    </div>
                </div>
                <p className="text-gray-400 font-light">{profile.email}</p>
                <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar size={14} className="text-gray-600" />
                        Membro desde Março 2022
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Shield size={14} className="text-gray-600" />
                        CREF: {profile.cref}
                    </div>
                </div>
            </div>

            {/* Plan Badge */}
            <div className="hidden md:flex flex-col items-end gap-2">
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center min-w-[120px]">
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">PLANO ATUAL</span>
                    <span className="text-lg font-bold text-white uppercase tracking-tight">PROFISSIONAL PRO</span>
                    <div className="text-[10px] text-primary mt-1 font-medium">ATÉ 50 ALUNOS</div>
                </div>
                <button className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1">
                    Gerenciar Assinatura <ChevronRight size={12} />
                </button>
            </div>
        </div>
    );
};

const InfoCard: React.FC<{
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
    onEdit?: () => void;
}> = ({ title, icon: Icon, children, onEdit }) => (
    <div className="bg-[#131B2C] border border-white/10 rounded-2xl p-6 shadow-lg hover:border-white/20 transition-all">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                    <Icon size={20} className="text-primary" />
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">{title}</h3>
            </div>
            {onEdit && (
                <button
                    onClick={onEdit}
                    className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors"
                >
                    <Edit3 size={18} />
                </button>
            )}
        </div>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const InfoRow: React.FC<{ label: string; value: string | React.ReactNode; icon?: React.ElementType }> = ({ label, value, icon: Icon }) => (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors rounded-lg px-2 -mx-2">
        <div className="flex items-center gap-3 text-gray-400">
            {Icon && <Icon size={16} className="text-gray-500" />}
            <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm font-bold text-white text-right">{value}</span>
    </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

export const PersonalProfilePage: React.FC = () => {
    const profile = mockPersonalProfile;

    return (
        <div className="flex-1 p-4 md:p-8 pb-20 overflow-y-auto">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">

                {/* Page Title */}
                <div className="flex flex-col animate-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">MEU PERFIL PROFISSIONAL</h2>
                    <p className="text-gray-400 mt-2 font-light">
                        Gerencie sua identidade visual, informações profissionais e credenciais de acesso.
                    </p>
                </div>

                <div className="h-px w-full bg-white/10" />

                {/* Header Section */}
                <ProfileHeader profile={profile} />

                {/* Grid Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* 1. Dados Pessoais */}
                    <InfoCard title="Dados de Acesso" icon={User}>
                        <InfoRow label="Nome Completo" value={profile.name} icon={User} />
                        <InfoRow label="Email Profissional" value={profile.email} icon={Mail} />
                        <InfoRow label="Status da Conta" value={
                            <span className="flex items-center gap-1.5 text-primary">
                                <Check size={14} /> Ativa
                            </span>
                        } />
                    </InfoCard>

                    {/* 2. Dados Profissionais */}
                    <InfoCard title="Credenciais" icon={Award}>
                        <InfoRow label="CREF" value={profile.cref} icon={Shield} />
                        <InfoRow label="Data de Registro" value="15 de Março, 2022" icon={Calendar} />
                        <InfoRow label="Especialidades" value={
                            <div className="flex flex-wrap gap-2 justify-end">
                                {profile.specialties.map(s => (
                                    <span key={s} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-gray-300">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        } />
                    </InfoCard>

                    {/* 3. Redes Sociais e Contato */}
                    <InfoCard title="Contato e Redes Sociais" icon={Instagram}>
                        <InfoRow label="WhatsApp (Comercial)" value={profile.whatsapp || 'Não cadastrado'} icon={MessageCircle} />
                        <InfoRow label="Instagram" value={profile.instagram || 'Não cadastrado'} icon={Instagram} />
                        <div className="mt-2 p-3 bg-primary/5 border border-primary/20 rounded-xl">
                            <p className="text-[10px] text-primary font-medium leading-relaxed">
                                💡 Essas informações serão utilizadas para que alunos em potencial possam entrar em contato com você através do Ranking.
                            </p>
                        </div>
                    </InfoCard>

                    {/* 4. Bio / Apresentação */}
                    <InfoCard title="Biografia e Perfil" icon={Briefcase}>
                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                            <p className="text-sm text-gray-300 leading-relaxed font-light italic">
                                "{profile.bio}"
                            </p>
                        </div>
                    </InfoCard>

                    {/* 5. Resumo de Atividade */}
                    <InfoCard title="Resumo de Atividade" icon={TrendsUp}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center">
                                <Users size={20} className="text-primary mb-2" />
                                <span className="text-2xl font-bold text-white">{profile.stats.totalAthletes}</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Alunos Ativos</span>
                            </div>
                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center">
                                <TrendingUp size={20} className="text-secondary mb-2" />
                                <span className="text-2xl font-bold text-white">{profile.stats.averageScore}</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Score Médio</span>
                            </div>
                        </div>
                    </InfoCard>

                    {/* 6. Segurança da Conta */}
                    <InfoCard title="Segurança da Conta" icon={Shield}>
                        <div className="flex flex-col gap-4">
                            <p className="text-sm text-gray-400 font-light px-2">
                                Mantenha sua senha e verificação em duas etapas atualizadas para garantir a proteção dos seus dados.
                            </p>
                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                                <Shield size={14} className="text-yellow-500" />
                                Alterar Senha
                            </button>
                        </div>
                    </InfoCard>
                </div>
            </div>
        </div>
    );
};

// Help for the missing icon in InfoCard
const TrendsUp = ({ size, className }: { size?: number, className?: string }) => (
    <TrendingUp size={size} className={className} />
);
