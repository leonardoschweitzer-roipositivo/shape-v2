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
import { CoachPillarCard } from '@/components/molecules';
import { HeroCard } from '@/components/organisms';
import { HeroContent } from '@/features/dashboard/types';

interface CoachIAProps {
    onOpenChat?: () => void;
    hideHeader?: boolean;
    isPersonalMode?: boolean;
}

export const CoachIA: React.FC<CoachIAProps> = ({ onOpenChat, hideHeader = false, isPersonalMode = false }) => {
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

    const heroContent: HeroContent = {
        badge: { label: isPersonalMode ? 'MODO CONSULTORIA PERSONAL' : 'VITRÚVIO COACH IA', variant: 'primary' },
        date: new Date(),
        title: isPersonalMode ? 'INTELIGÊNCIA PARA \n SEUS ALUNOS' : 'TRANSFORME SEUS \n DADOS EM ESTÉTICA',
        description: isPersonalMode
            ? 'Utilize o poder da IA para otimizar os resultados da sua consultoria. O Vitrúvio analisa os dados biométricos dos seus alunos e sugere as melhores estratégias de treino e nutrição.'
            : 'Sua análise completa de proporções e simetria está pronta. O Vitrúvio utiliza a matemática clássica para gerar planos de ação personalizados para o seu físico ideal.',
        cta: { label: 'Consultar o Coach', href: '#' },
        image: {
            src: '/images/robot-coach.png',
            alt: 'Coach IA Banner',
            position: 'background'
        }
    };

    return (
        <div className={`flex-1 flex flex-col ${hideHeader ? 'p-0' : 'p-4 md:p-8'}`}>
            <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10 flex-1 w-full">

                {!hideHeader && (
                    <>
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
                    </>
                )}

                {/* Hero Card Banner */}
                <HeroCard content={heroContent} />

                <div className="h-px w-full bg-white/5" />

                {/* Quick Stats & Context */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-[#131B2C] rounded-xl border border-white/5 text-primary shadow-lg">
                                <Bot size={22} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight uppercase">
                                    Quem é o Vitrúvio?
                                </h3>
                                <p className="text-sm text-gray-500 font-light">
                                    Seu guia na busca pela harmonia clássica das proporções
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-300 leading-relaxed text-sm md:text-base bg-white/5 p-6 rounded-2xl border border-white/10">
                            Olá! Sou o <span className="text-primary font-semibold">Vitrúvio</span>, seu coach virtual inteligente.
                            Minha missão é <span className="text-white font-medium">cruzar seus dados</span> — histórico de avaliações,
                            proporções atuais, assimetrias e objetivos — para gerar planos de ação personalizados que te ajudem a atingir o físico ideal.
                            Tudo baseado nos princípios que inspiraram o Homem Vitruviano de Da Vinci.
                        </p>
                    </div>

                    <div className="lg:col-span-4 grid grid-cols-1 gap-4 h-full">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                            <Target size={20} className="text-primary shrink-0" />
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Análises</p>
                                <p className="text-sm font-bold text-white">Proporções Atuais</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                            <TrendingUp size={20} className="text-emerald-400 shrink-0" />
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Evolução</p>
                                <p className="text-sm font-bold text-white">Histórico de Dados</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                            <AlertTriangle size={20} className="text-amber-400 shrink-0" />
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Correção</p>
                                <p className="text-sm font-bold text-white">Foco em Assimetrias</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                            <Sparkles size={20} className="text-violet-400 shrink-0" />
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Planos</p>
                                <p className="text-sm font-bold text-white">Nutrição & Treino</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="h-px w-full bg-white/10" />

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
