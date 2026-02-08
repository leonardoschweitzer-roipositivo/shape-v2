import React, { useState } from 'react';
import {
    User,
    Mail,
    Building2,
    Calendar,
    Users,
    Shield,
    ChevronRight,
    Edit3,
    Check,
    X,
    MapPin,
    Phone
} from 'lucide-react';

// ============================================
// SUB-COMPONENTS
0. // ============================================

const ProfileHeader: React.FC<{ name: string; email: string }> = ({ name, email }) => {
    const initials = name
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
                    <span className="text-3xl font-bold text-primary">{initials}</span>
                </div>
            </div>

            {/* Info */}
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-white">{name}</h2>
                    <div className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-[10px] font-bold text-primary uppercase tracking-widest">
                        ACADEMIA PARCEIRA
                    </div>
                </div>
                <p className="text-gray-400 font-light">{email}</p>
                <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar size={14} className="text-gray-600" />
                        Membro desde Fevereiro 2024
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Building2 size={14} className="text-gray-600" />
                        CNPJ: 12.345.678/0001-90
                    </div>
                </div>
            </div>

            {/* Plan Badge */}
            <div className="hidden md:flex flex-col items-end gap-2">
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center min-w-[120px]">
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">PLANO ATUAL</span>
                    <span className="text-lg font-bold text-white uppercase tracking-tight">ACADEMIA PREMIUM</span>
                    <div className="text-[10px] text-primary mt-1 font-medium">ATÉ 20 PERSONAIS</div>
                </div>
                <button className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1">
                    Upgrade de Plano <ChevronRight size={12} />
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

export const AcademyProfilePage: React.FC = () => {
    return (
        <div className="flex-1 p-4 md:p-8 pb-20 overflow-y-auto w-full">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 w-full">

                {/* Page Title */}
                <div className="flex flex-col animate-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">PERFIL DA ACADEMIA</h2>
                    <p className="text-gray-400 mt-2 font-light">
                        Gerencie as informações institucionais, dados do responsável e configurações de conta.
                    </p>
                </div>

                <div className="h-px w-full bg-white/10" />

                {/* Header Section */}
                <ProfileHeader name="Iron Paradise Gym" email="contato@ironparadise.com" />

                {/* Grid Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* 1. Dados do Responsável - GENERO ADDED HERE */}
                    <InfoCard title="Responsável Técnico" icon={User}>
                        <InfoRow label="Nome Completo" value="Rodrigo Santoro" icon={User} />
                        <InfoRow label="Gênero" value="Masculino" icon={User} />
                        <InfoRow label="Email Direto" value="rodrigo@ironparadise.com" icon={Mail} />
                        <InfoRow label="Cargo" value="Diretor Técnico / Proprietário" icon={Shield} />
                    </InfoCard>

                    {/* 2. Dados da Empresa */}
                    <InfoCard title="Informações da Unidade" icon={Building2}>
                        <InfoRow label="Razão Social" value="Iron Paradise Fitness LTDA" icon={Building2} />
                        <InfoRow label="CNPJ" value="12.345.678/0001-90" icon={Shield} />
                        <InfoRow label="Endereço" value="Av. Paulista, 1000 - São Paulo, SP" icon={MapPin} />
                        <InfoRow label="Telefone" value="(11) 3214-5566" icon={Phone} />
                    </InfoCard>

                    {/* 3. Segurança e Acesso */}
                    <InfoCard title="Segurança da Conta" icon={Shield}>
                        <div className="flex flex-col gap-4">
                            <p className="text-sm text-gray-400 font-light px-2">
                                Gerencie as credenciais de acesso da administração e chaves de API para integrações.
                            </p>
                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                                <Shield size={14} className="text-yellow-500" />
                                Alterar Senha de Admin
                            </button>
                        </div>
                    </InfoCard>

                    {/* 4. Estatísticas Consolidadas */}
                    <InfoCard title="Resumo Operacional" icon={Users}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center">
                                <Users size={20} className="text-primary mb-2" />
                                <span className="text-2xl font-bold text-white">8</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Personais</span>
                            </div>
                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center">
                                <Users size={20} className="text-secondary mb-2" />
                                <span className="text-2xl font-bold text-white">145</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Alunos Totais</span>
                            </div>
                        </div>
                    </InfoCard>
                </div>
            </div>
        </div>
    );
};
