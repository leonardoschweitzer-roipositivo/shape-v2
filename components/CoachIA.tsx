import React, { useState } from 'react';
import {
    Bot,
    Sparkles,
    MessageCircle,
    Stethoscope,
    Dumbbell,
    Salad,
    Target,
    TrendingUp,
    AlertTriangle,
    ChevronRight
} from 'lucide-react';
import { CoachPillarCard } from './molecules/CoachPillarCard';

interface CoachIAProps {
    onOpenChat?: () => void;
}

export const CoachIA: React.FC<CoachIAProps> = ({ onOpenChat }) => {
    const [isGenerating, setIsGenerating] = useState<string | null>(null);

    const handleDiagnostico = () => {
        onOpenChat?.();
    };

    const handleTreino = () => {
        setIsGenerating('treino');
        // TODO: Integrar com geração de plano de treino via IA
        setTimeout(() => setIsGenerating(null), 2000);
    };

    const handleNutricao = () => {
        setIsGenerating('nutricao');
        // TODO: Integrar com geração de plano nutricional via IA
        setTimeout(() => setIsGenerating(null), 2000);
    };

    return (
        <div className="flex-1 p-4 md:p-8 flex flex-col">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10 flex-1 w-full">

                {/* Header Section */}
                <div className="flex flex-col animate-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">
                        COACH IA
                    </h2>
                    <p className="text-gray-400 mt-2 font-light">
                        Consultoria inteligente baseada no seu histórico e objetivos.
                    </p>
                </div>

                <div className="h-px w-full bg-white/10" />

                {/* Vitrúvio Introduction Card */}
                <div className="bg-[#131B2C] border border-white/10 rounded-2xl p-6 md:p-8 animate-fade-in-up">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                                <Bot size={40} className="text-primary" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#131B2C] rounded-full border-2 border-primary flex items-center justify-center">
                                <Sparkles size={14} className="text-primary animate-pulse" />
                            </div>
                        </div>

                        {/* Intro Text */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-2xl font-bold text-white tracking-wide">VITRÚVIO</h3>
                                <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-primary/20 text-primary border border-primary/20">
                                    COACH IA
                                </span>
                            </div>
                            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                                Olá! Sou o <span className="text-primary font-semibold">Vitrúvio</span>,
                                seu coach virtual inteligente. Meu nome é uma homenagem a Marcus Vitruvius Pollio,
                                o arquiteto romano que definiu as proporções ideais do corpo humano — os mesmos
                                princípios que inspiraram o Homem Vitruviano de Da Vinci.
                            </p>
                            <p className="text-gray-400 leading-relaxed text-sm mt-3">
                                Minha missão é <span className="text-white font-medium">cruzar seus dados</span> —
                                histórico de avaliações, proporções atuais, assimetrias e objetivos — para gerar
                                planos de ação personalizados que te ajudem a atingir o físico ideal.
                            </p>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/5">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                            <Target size={18} className="text-primary shrink-0" />
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Análises</p>
                                <p className="text-sm font-bold text-white">Proporções</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                            <TrendingUp size={18} className="text-emerald-400 shrink-0" />
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Evolução</p>
                                <p className="text-sm font-bold text-white">Histórico</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                            <AlertTriangle size={18} className="text-amber-400 shrink-0" />
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Correção</p>
                                <p className="text-sm font-bold text-white">Assimetrias</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                            <Sparkles size={18} className="text-violet-400 shrink-0" />
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Planos</p>
                                <p className="text-sm font-bold text-white">Personalizados</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-px w-full bg-white/5" />

                {/* Section Header */}
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-[#131B2C] rounded-xl border border-white/5 text-primary shadow-lg">
                        <MessageCircle size={22} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight uppercase">
                            Consultoria Inteligente
                        </h3>
                        <p className="text-sm text-gray-500 font-light">
                            Nossa IA cruza seus dados biométricos com as proporções de Vitrúvio e a Era de Ouro
                        </p>
                    </div>
                </div>

                {/* 3 Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <CoachPillarCard
                        number="01"
                        icon={Stethoscope}
                        title="Diagnóstico"
                        subtitle="Insights do Coach IA"
                        description="Avaliação Estrutural — Gera conselhos acionáveis via IA baseados na sua estrutura óssea específica e desenvolvimento muscular atual. Identifica gaps para as proporções ideais."
                        buttonText="Consultar o Coach"
                        onButtonClick={handleDiagnostico}
                    />

                    <CoachPillarCard
                        number="02"
                        icon={Dumbbell}
                        title="Estratégia"
                        subtitle="Hipertrofia Corretiva"
                        description="Personalização Total — A IA analisa seus pontos fracos (gaps de proporção) e assimetrias para criar uma rotina de especialização, enquanto mantém seus pontos fortes."
                        buttonText="Gerar Estratégia de Treino"
                        onButtonClick={handleTreino}
                        isPro
                        isDisabled={isGenerating === 'treino'}
                    />

                    <CoachPillarCard
                        number="03"
                        icon={Salad}
                        title="Nutrição"
                        subtitle="Combustível Metabólico"
                        description="Dieta Proporcional — A IA calcula macros específicos para afinar a cintura ou preencher grupos musculares fracos. Bulking ou Cutting inteligente baseado no seu objetivo."
                        buttonText="Gerar Dieta"
                        onButtonClick={handleNutricao}
                        isPro
                        isDisabled={isGenerating === 'nutricao'}
                    />
                </div>

                <div className="h-px w-full bg-white/5" />

                {/* Data Sources Info */}
                <div className="bg-[#0D1321] border border-white/5 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                            <Target size={20} className="text-primary" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-white uppercase tracking-wide mb-2">
                                Fontes de Dados para Personalização
                            </h4>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Os planos são gerados cruzando: <span className="text-white">última avaliação</span> (diagnóstico atual),
                                <span className="text-white"> histórico completo</span> (tendências de evolução),
                                <span className="text-white"> proporções ideais</span> (9 métricas áureas),
                                <span className="text-white"> assimetrias bilaterais</span> (L/R por grupo),
                                <span className="text-white"> métricas básicas</span> (BF%, peso, Shape-V), e
                                <span className="text-white"> seus objetivos</span> definidos no perfil.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Chat CTA */}
                <button
                    onClick={onOpenChat}
                    className="w-full bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/40 rounded-2xl p-6 transition-all group flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <MessageCircle size={20} className="text-primary" />
                        </div>
                        <div className="text-left">
                            <h4 className="text-base font-bold text-white">Dúvida rápida?</h4>
                            <p className="text-sm text-gray-400">Pergunte qualquer coisa sobre seu físico ou treino</p>
                        </div>
                    </div>
                    <ChevronRight size={24} className="text-primary group-hover:translate-x-2 transition-transform" />
                </button>

            </div>
        </div>
    );
};
