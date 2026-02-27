/**
 * CoachIA - Tela principal do Vitrúvio IA (Coach Inteligente)
 * 
 * Layout limpo estilo dashboard com:
 * - Lista de recursos disponíveis (Diagnóstico, Treino, Nutrição, Chat)
 * - Seção "Montar Plano de Evolução" com wizard de 3 etapas
 * 
 * @example
 * <CoachIA
 *   atletaId="abc-123"
 *   atletaNome="João Silva"
 *   onOpenChat={() => setModal(true)}
 * />
 */

import React, { useState } from 'react';
import {
    Stethoscope,
    Dumbbell,
    Salad,
    MessageCircle,
    ChevronRight,
    Target,
    Sparkles,
    Play,
    ArrowRight,
} from 'lucide-react';
import { EvolutionPlanWizard } from '@/components/organisms/EvolutionPlanWizard';

// ===== TYPES =====

interface CoachIAProps {
    onOpenChat?: () => void;
    hideHeader?: boolean;
    isPersonalMode?: boolean;
    atletaId?: string;
    atletaNome?: string;
}

interface RecursoItem {
    id: string;
    icon: React.ElementType;
    title: string;
    subtitle: string;
    action: () => void;
    isPro?: boolean;
}

// ===== SUBCOMPONENTS =====

/** Item de recurso na lista */
const RecursoListItem: React.FC<{
    recurso: RecursoItem;
    isLast: boolean;
}> = ({ recurso, isLast }) => {
    const Icon = recurso.icon;

    return (
        <>
            <button
                onClick={recurso.action}
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-white/[0.02] transition-all group rounded-xl"
            >
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-white/5 flex items-center justify-center text-primary group-hover:bg-primary/20 group-hover:border-primary/30 transition-all shrink-0">
                    <Icon size={18} />
                </div>

                <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                            {recurso.title}
                        </h4>
                        {recurso.isPro && (
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-secondary/20 text-secondary border border-secondary/20 flex items-center gap-0.5">
                                <Sparkles size={8} />
                                PRO
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                        {recurso.subtitle}
                    </p>
                </div>

                <ChevronRight
                    size={18}
                    className="text-gray-600 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0"
                />
            </button>

            {!isLast && <div className="h-px bg-white/5 mx-4" />}
        </>
    );
};

// ===== MAIN COMPONENT =====

export const CoachIA: React.FC<CoachIAProps> = ({
    onOpenChat,
    hideHeader = false,
    isPersonalMode = false,
    atletaId,
    atletaNome,
}) => {
    const [isWizardOpen, setIsWizardOpen] = useState(false);

    // Lista de recursos disponíveis
    const recursos: RecursoItem[] = [
        {
            id: 'diagnostico',
            icon: Stethoscope,
            title: 'Diagnóstico Completo',
            subtitle: 'Análise de proporções, assimetrias e pontos fracos',
            action: () => onOpenChat?.(),
        },
        {
            id: 'treino',
            icon: Dumbbell,
            title: 'Estratégia de Treino',
            subtitle: 'Hipertrofia corretiva personalizada via IA',
            action: () => onOpenChat?.(),
            isPro: true,
        },
        {
            id: 'nutricao',
            icon: Salad,
            title: 'Plano Nutricional',
            subtitle: 'Dieta proporcional com macros calculados',
            action: () => onOpenChat?.(),
            isPro: true,
        },
        {
            id: 'chat',
            icon: MessageCircle,
            title: 'Chat Livre',
            subtitle: 'Pergunte qualquer coisa sobre físico ou treino',
            action: () => onOpenChat?.(),
        },
    ];

    return (
        <>
            <div className={`flex-1 flex flex-col ${hideHeader ? 'p-0' : 'p-4 md:p-8'}`}>
                <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10 flex-1 w-full">

                    {/* Header */}
                    {!hideHeader && (
                        <>
                            <div className="flex flex-col animate-fade-in-up">
                                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">
                                    VITRÚVIO IA
                                </h2>
                                <p className="text-gray-400 mt-2 font-light">
                                    Coach inteligente baseado no histórico e objetivos do atleta.
                                </p>
                            </div>
                            <div className="h-px w-full bg-white/10" />
                        </>
                    )}

                    {/* Seção: Recursos Disponíveis */}
                    <div className="animate-fade-in-up">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-[#131B2C] rounded-xl border border-white/5 text-primary">
                                <MessageCircle size={18} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white tracking-tight uppercase">
                                    Recursos Disponíveis
                                </h3>
                                <p className="text-xs text-gray-500 font-light">
                                    Consultoria inteligente baseada nas proporções de Vitrúvio
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#131B2C] border border-white/10 rounded-2xl overflow-hidden">
                            {recursos.map((recurso, idx) => (
                                <RecursoListItem
                                    key={recurso.id}
                                    recurso={recurso}
                                    isLast={idx === recursos.length - 1}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Seção: Montar Plano de Evolução */}
                    <div className="animate-fade-in-up">
                        <div className="bg-[#131B2C] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-primary/20 transition-all">
                            {/* Header da seção */}
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                    <Target size={22} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white tracking-tight uppercase">
                                        Montar Plano de Evolução
                                    </h3>
                                    <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">
                                        Fluxo guiado em 3 etapas
                                    </p>
                                </div>
                            </div>

                            {/* Descrição */}
                            <p className="text-sm text-gray-400 leading-relaxed mb-6">
                                O Vitrúvio vai analisar o atleta e montar um plano completo de evolução personalizado, desde o diagnóstico até a dieta, tudo alinhado com as proporções ideais e os objetivos definidos.
                            </p>

                            {/* Steps preview */}
                            <div className="flex items-center gap-3 mb-8 flex-wrap">
                                {[
                                    { icon: Stethoscope, label: 'Diagnóstico', num: '1' },
                                    { icon: Dumbbell, label: 'Treino', num: '2' },
                                    { icon: Salad, label: 'Dieta', num: '3' },
                                ].map((step, idx) => (
                                    <React.Fragment key={step.num}>
                                        {idx > 0 && (
                                            <ArrowRight size={14} className="text-gray-600 shrink-0" />
                                        )}
                                        <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/5 rounded-lg">
                                            <step.icon size={14} className="text-primary" />
                                            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                                                {step.label}
                                            </span>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* CTA */}
                            <button
                                onClick={() => setIsWizardOpen(true)}
                                className="w-full flex items-center justify-center gap-3 h-14 bg-primary text-[#0A0F1C] rounded-xl font-bold text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(0,201,167,0.2)] hover:shadow-[0_0_30px_rgba(0,201,167,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Play size={18} />
                                Iniciar Plano de Evolução
                            </button>

                            <p className="text-[10px] text-center text-gray-600 mt-3 uppercase tracking-widest">
                                Baseado na última avaliação e dados do contexto do atleta
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Wizard Overlay */}
            {isWizardOpen && (
                <EvolutionPlanWizard
                    atletaId={atletaId || ''}
                    atletaNome={atletaNome || 'Atleta'}
                    onClose={() => setIsWizardOpen(false)}
                    onComplete={() => setIsWizardOpen(false)}
                />
            )}
        </>
    );
};
