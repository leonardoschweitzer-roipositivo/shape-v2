/**
 * GodDashboard — Dashboard principal do administrador GOD
 *
 * Visão geral da plataforma com acesso rápido a:
 * - Biblioteca de Exercícios (gestão de conteúdo/vídeos)
 * - KPIs globais (futuro)
 */

import React, { useState, useEffect } from 'react';
import { Video, BookOpen, Users, BarChart3, Settings, Shield } from 'lucide-react';
import { ThemeSwitcher } from '@/components/organisms/ThemeSwitcher/ThemeSwitcher';
import { applyTheme, DEFAULT_THEME_ID, type ThemeId } from '@/config/themes';

interface GodDashboardProps {
    onNavigate: (view: string) => void;
}

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
        className={`group relative flex flex-col gap-4 p-6 rounded-2xl border border-white/10 bg-white/[0.02]
            hover:bg-white/[0.05] hover:border-${accentColor}-500/30 hover:shadow-lg hover:shadow-${accentColor}-500/5
            transition-all duration-300 text-left w-full`}
    >
        {badge && (
            <span className={`absolute top-4 right-4 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider
                rounded-full bg-${accentColor}-500/15 text-${accentColor}-400 border border-${accentColor}-500/20`}>
                {badge}
            </span>
        )}
        <div className={`w-12 h-12 rounded-xl bg-${accentColor}-500/10 border border-${accentColor}-500/20
            flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={24} className={`text-${accentColor}-400`} />
        </div>
        <div className="space-y-1">
            <h3 className="text-white font-semibold text-base">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
    </button>
);

const THEME_STORAGE_KEY = 'vitru-theme-id';

export const GodDashboard: React.FC<GodDashboardProps> = ({ onNavigate }) => {
    const [currentThemeId, setCurrentThemeId] = useState<ThemeId>(() => {
        return (localStorage.getItem(THEME_STORAGE_KEY) as ThemeId) || DEFAULT_THEME_ID;
    });

    const handleThemeChange = async (themeId: ThemeId) => {
        localStorage.setItem(THEME_STORAGE_KEY, themeId);
        setCurrentThemeId(themeId);
    };

    return (
        <div className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                        <Shield size={22} className="text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Painel GOD</h1>
                        <p className="text-gray-400 text-sm">Administração da plataforma VITRU IA</p>
                    </div>
                </div>
            </div>

            {/* Action Cards Grid */}
            <div className="space-y-6">
                {/* Seção: Conteúdo */}
                <div>
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-1">
                        Gestão de Conteúdo
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <ActionCard
                            icon={Video}
                            title="Biblioteca de Exercícios"
                            description="Gerenciar exercícios, fazer upload de vídeos e editar conteúdo textual."
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

                {/* Seção: Aparência */}
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

                {/* Seção: Gestão (futuro) */}
                <div>
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-1">
                        Gestão da Plataforma
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <ActionCard
                            icon={Users}
                            title="Academias e Personais"
                            description="Visualizar todas as academias e personais cadastrados."
                            onClick={() => { }}
                            accentColor="emerald"
                            badge="Em breve"
                        />
                        <ActionCard
                            icon={BarChart3}
                            title="KPIs Globais"
                            description="Métricas e indicadores de performance da plataforma."
                            onClick={() => { }}
                            accentColor="purple"
                            badge="Em breve"
                        />
                        <ActionCard
                            icon={Settings}
                            title="Configurações Globais"
                            description="Configurações gerais da plataforma e parâmetros do sistema."
                            onClick={() => { }}
                            accentColor="gray"
                            badge="Em breve"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
