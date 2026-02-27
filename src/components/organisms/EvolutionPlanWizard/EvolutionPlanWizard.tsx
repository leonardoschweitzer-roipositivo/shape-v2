/**
 * EvolutionPlanWizard - Wizard de 3 etapas para montar plano de evolução
 * 
 * Fluxo: Diagnóstico → Treino → Dieta
 * O Vitrúvio analisa o atleta e gera cada etapa sequencialmente.
 * 
 * @example
 * <EvolutionPlanWizard
 *   atletaId="abc-123"
 *   atletaNome="João Silva"
 *   onClose={() => setWizardOpen(false)}
 *   onComplete={() => handleComplete()}
 * />
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
    X,
    ArrowLeft,
    ArrowRight,
    Stethoscope,
    Dumbbell,
    Salad,
    Sparkles,
    Loader2,
    Check,
    Target,
    AlertTriangle,
    TrendingUp,
} from 'lucide-react';
import { useDataStore } from '@/stores/dataStore';

// ===== TYPES =====

interface EvolutionPlanWizardProps {
    atletaId: string;
    atletaNome: string;
    onClose: () => void;
    onComplete: () => void;
}

type WizardStep = 'diagnostico' | 'treino' | 'dieta';

interface StepConfig {
    id: WizardStep;
    number: number;
    icon: React.ElementType;
    title: string;
    subtitle: string;
    description: string;
    buttonLabel: string;
}

interface StepResult {
    generated: boolean;
    content: string;
}

// ===== CONSTANTS =====

const STEPS: StepConfig[] = [
    {
        id: 'diagnostico',
        number: 1,
        icon: Stethoscope,
        title: 'Diagnóstico',
        subtitle: 'Análise completa do físico atual',
        description: 'O Vitrúvio analisa suas medidas, proporções, score e assimetrias para identificar pontos fortes, fracos e prioridades de desenvolvimento.',
        buttonLabel: 'Gerar Diagnóstico',
    },
    {
        id: 'treino',
        number: 2,
        icon: Dumbbell,
        title: 'Plano de Treino',
        subtitle: 'Estratégia trimestral (12 semanas)',
        description: 'Com base no diagnóstico, o Vitrúvio cria um plano trimestral focado nos gaps de proporção e assimetrias identificadas, respeitando sua frequência e nível.',
        buttonLabel: 'Gerar Plano de Treino',
    },
    {
        id: 'dieta',
        number: 3,
        icon: Salad,
        title: 'Plano de Dieta',
        subtitle: 'Estratégia mensal (4 semanas)',
        description: 'O último passo: uma dieta mensal alinhada com seu treino e objetivo, calculando calorias e macros ideais para a fase atual.',
        buttonLabel: 'Gerar Plano de Dieta',
    },
];

/** Classifica score em nível */
const getClassificacao = (score: number): string => {
    if (score >= 85) return 'Avançado';
    if (score >= 70) return 'Intermediário';
    if (score >= 55) return 'Iniciante';
    return 'Iniciante';
};

interface MockAtletaData {
    nome: string;
    score: number;
    ratio: number;
    peso?: number;
}

/** Gera resultados mock com dados reais do atleta */
const getMockResults = (data: MockAtletaData): Record<WizardStep, string> => {
    const { nome, score, ratio } = data;
    const classificacao = getClassificacao(score);
    const peso = data.peso || 80;
    const proteina = Math.round(peso * 2.2);
    const calorias = classificacao === 'Avançado' ? 2800 : classificacao === 'Intermediário' ? 2500 : 2200;
    const fase = score >= 75 ? 'lean bulk (superávit leve)' : 'recomposição corporal';

    return {
        diagnostico: `## Diagnóstico de ${nome}

**Score Geral:** ${score} • **Classificação:** ${classificacao} • **Ratio:** ${ratio.toFixed(2)}

### Pontos Fortes
• Ombros proporcionais à estrutura óssea
• Boa simetria bilateral nos braços

### Pontos Fracos (Prioridade)
1. **Panturrilhas** — abaixo do ideal para o ratio atual
2. **Cintura** — acima do ideal (impacta proporções)
3. **Coxas** — possível assimetria bilateral

### Recomendação Geral
Fase de **${fase}** para **${nome}**: ${score >= 75 ? 'manter proporções fortes enquanto trabalha gaps menores. Periodização com foco em refinamento.' : 'reduzir cintura enquanto desenvolve panturrilhas e corrige assimetria das coxas. Periodização com foco em hipertrofia corretiva.'}`,

        treino: `## Plano de Treino de ${nome} — Trimestre 1

**Divisão:** ${score >= 75 ? 'ABCDE (5x/semana)' : 'ABCD (4x/semana)'}
**Periodização:** Ondulada
**Foco:** ${score >= 75 ? 'Refinamento Proporcional' : 'Hipertrofia Corretiva'}

### Divisão Semanal
• **A** → Peito + Tríceps
• **B** → Costas + Bíceps
• **C** → Ombros + Trapézio
• **D** → Quadríceps + Panturrilha (prioridade)
${score >= 75 ? '• **E** → Posterior + Panturrilha (prioridade)' : ''}

### Destaques
• Panturrilhas treinadas 2x por semana (prioridade)
• Coxas com exercícios unilaterais para corrigir assimetria
• Volume ${score >= 75 ? 'moderado em todos os grupos' : 'alto nos grupos fracos, moderado nos fortes'}`,

        dieta: `## Plano de Dieta de ${nome} — Mês 1

**Fase:** ${fase.charAt(0).toUpperCase() + fase.slice(1)}
**Calorias:** ${calorias} kcal/dia
**Peso atual:** ${peso}kg

### Macros
• **Proteína:** ${proteina}g (2.2g/kg) — ${Math.round(proteina * 4 / calorias * 100)}%
• **Carboidrato:** ${Math.round(calorias * 0.4 / 4)}g — 40%
• **Gordura:** ${Math.round(calorias * 0.27 / 9)}g — 27%

### Estrutura (5 refeições)
1. Café: ovos + aveia + frutas
2. Lanche: whey + banana
3. Almoço: arroz + frango + salada
4. Lanche: iogurte + granola
5. Jantar: batata doce + carne + legumes

### Refeição Livre
• 1x por semana, sem exageros`,
    };
};

// ===== SUBCOMPONENTS =====

/** Stepper visual no topo do wizard */
const WizardStepper: React.FC<{ currentStep: WizardStep; results: Record<WizardStep, StepResult> }> = ({ currentStep, results }) => {
    const currentIndex = STEPS.findIndex(s => s.id === currentStep);

    return (
        <div className="flex items-center justify-center gap-2 py-4">
            {STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = results[step.id].generated;
                const isPast = idx < currentIndex;

                return (
                    <React.Fragment key={step.id}>
                        {idx > 0 && (
                            <div className={`w-12 h-px transition-all ${isPast || isCompleted ? 'bg-primary' : 'bg-white/10'}`} />
                        )}
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${isActive
                            ? 'bg-primary/10 border border-primary/30 text-primary'
                            : isCompleted
                                ? 'bg-primary/5 border border-primary/20 text-primary/70'
                                : 'bg-white/5 border border-white/5 text-gray-500'
                            }`}>
                            {isCompleted ? (
                                <Check size={14} />
                            ) : (
                                <Icon size={14} />
                            )}
                            <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">
                                {step.title}
                            </span>
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
    );
};

/** Conteúdo da etapa (antes de gerar) */
const StepPrompt: React.FC<{
    step: StepConfig;
    isGenerating: boolean;
    onGenerate: () => void;
}> = ({ step, isGenerating, onGenerate }) => {
    const Icon = step.icon;

    return (
        <div className="flex flex-col items-center text-center gap-6 py-8 animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Icon size={36} className="text-primary" />
            </div>

            <div className="max-w-md">
                <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-2">
                    {step.title}
                </h3>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">
                    {step.subtitle}
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">
                    {step.description}
                </p>
            </div>

            <button
                onClick={onGenerate}
                disabled={isGenerating}
                className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${isGenerating
                    ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                    : 'bg-primary text-[#0A0F1C] shadow-[0_0_20px_rgba(0,201,167,0.3)] hover:shadow-[0_0_30px_rgba(0,201,167,0.5)] hover:scale-105 active:scale-95'
                    }`}
            >
                {isGenerating ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        Gerando...
                    </>
                ) : (
                    <>
                        <Sparkles size={18} />
                        {step.buttonLabel}
                    </>
                )}
            </button>
        </div>
    );
};

/** Resultado gerado (após gerar) */
const StepResultView: React.FC<{ content: string }> = ({ content }) => {
    // Simple markdown-to-JSX rendering for headings, bold, bullet points
    const renderContent = (text: string): React.ReactNode[] => {
        return text.split('\n').map((line, i) => {
            const trimmed = line.trim();

            if (trimmed.startsWith('## ')) {
                return (
                    <h2 key={i} className="text-xl font-bold text-white uppercase tracking-tight mt-6 mb-3 flex items-center gap-2">
                        {trimmed.replace('## ', '')}
                    </h2>
                );
            }

            if (trimmed.startsWith('### ')) {
                return (
                    <h3 key={i} className="text-sm font-bold text-primary uppercase tracking-widest mt-4 mb-2">
                        {trimmed.replace('### ', '')}
                    </h3>
                );
            }

            if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
                const text = trimmed.replace(/^[•\-]\s/, '');
                // Handle bold inside bullets
                const parts = text.split(/\*\*(.*?)\*\*/g);
                return (
                    <div key={i} className="flex items-start gap-2 py-0.5 text-sm text-gray-300">
                        <span className="text-primary mt-1 shrink-0">•</span>
                        <span>
                            {parts.map((part, j) =>
                                j % 2 === 1
                                    ? <strong key={j} className="text-white font-semibold">{part}</strong>
                                    : part
                            )}
                        </span>
                    </div>
                );
            }

            if (/^\d+\.\s/.test(trimmed)) {
                const text = trimmed.replace(/^\d+\.\s/, '');
                const num = trimmed.match(/^(\d+)\./)?.[1];
                const parts = text.split(/\*\*(.*?)\*\*/g);
                return (
                    <div key={i} className="flex items-start gap-2 py-0.5 text-sm text-gray-300">
                        <span className="text-primary font-bold shrink-0 w-5">{num}.</span>
                        <span>
                            {parts.map((part, j) =>
                                j % 2 === 1
                                    ? <strong key={j} className="text-white font-semibold">{part}</strong>
                                    : part
                            )}
                        </span>
                    </div>
                );
            }

            if (trimmed === '') {
                return <div key={i} className="h-2" />;
            }

            // Bold handling for regular text
            const parts = trimmed.split(/\*\*(.*?)\*\*/g);
            return (
                <p key={i} className="text-sm text-gray-300 py-0.5">
                    {parts.map((part, j) =>
                        j % 2 === 1
                            ? <strong key={j} className="text-white font-semibold">{part}</strong>
                            : part
                    )}
                </p>
            );
        });
    };

    return (
        <div className="bg-[#0A0F1C] border border-white/10 rounded-2xl p-6 md:p-8 animate-fade-in max-h-[50vh] overflow-y-auto custom-scrollbar">
            {renderContent(content)}
        </div>
    );
};

// ===== MAIN COMPONENT =====

export const EvolutionPlanWizard: React.FC<EvolutionPlanWizardProps> = ({
    atletaId,
    atletaNome,
    onClose,
    onComplete,
}) => {
    const [currentStep, setCurrentStep] = useState<WizardStep>('diagnostico');
    const [isGenerating, setIsGenerating] = useState(false);
    const [results, setResults] = useState<Record<WizardStep, StepResult>>({
        diagnostico: { generated: false, content: '' },
        treino: { generated: false, content: '' },
        dieta: { generated: false, content: '' },
    });

    // Buscar dados reais do atleta no store
    const { personalAthletes } = useDataStore();
    const atletaData = useMemo((): MockAtletaData => {
        const atleta = personalAthletes.find(a => a.id === atletaId);
        return {
            nome: atletaNome,
            score: atleta?.score ?? 0,
            ratio: atleta?.ratio ?? 0,
            peso: atleta?.assessments?.[0]?.measurements?.weight,
        };
    }, [atletaId, atletaNome, personalAthletes]);

    const currentStepConfig = STEPS.find(s => s.id === currentStep)!;
    const currentIndex = STEPS.findIndex(s => s.id === currentStep);
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === STEPS.length - 1;
    const hasGenerated = results[currentStep].generated;

    const handleGenerate = useCallback(async () => {
        setIsGenerating(true);

        // Simulate AI generation delay
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

        setResults(prev => ({
            ...prev,
            [currentStep]: {
                generated: true,
                content: getMockResults(atletaData)[currentStep],
            },
        }));

        setIsGenerating(false);
    }, [currentStep, atletaData]);

    const handleNext = useCallback(() => {
        if (isLast) {
            onComplete();
            return;
        }
        const nextStep = STEPS[currentIndex + 1];
        if (nextStep) {
            setCurrentStep(nextStep.id);
        }
    }, [currentIndex, isLast, onComplete]);

    const handlePrev = useCallback(() => {
        if (isFirst) return;
        const prevStep = STEPS[currentIndex - 1];
        if (prevStep) {
            setCurrentStep(prevStep.id);
        }
    }, [currentIndex, isFirst]);

    return (
        <div className="fixed inset-0 z-50 bg-[#050810]/95 backdrop-blur-md flex flex-col animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Target size={18} className="text-primary" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest">
                            Plano de Evolução
                        </h2>
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                            {atletaNome} • Etapa {currentIndex + 1} de {STEPS.length}
                        </p>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all"
                    title="Fechar wizard"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Stepper */}
            <WizardStepper currentStep={currentStep} results={results} />

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="max-w-2xl mx-auto">
                    {!hasGenerated ? (
                        <StepPrompt
                            step={currentStepConfig}
                            isGenerating={isGenerating}
                            onGenerate={handleGenerate}
                        />
                    ) : (
                        <div className="flex flex-col gap-4 animate-fade-in">
                            {/* Step generated badge */}
                            <div className="flex items-center gap-2 text-primary">
                                <Check size={16} />
                                <span className="text-xs font-bold uppercase tracking-widest">
                                    {currentStepConfig.title} gerado com sucesso
                                </span>
                            </div>

                            <StepResultView content={results[currentStep].content} />
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-[#050810]/80">
                <button
                    onClick={isFirst ? onClose : handlePrev}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-wider"
                >
                    <ArrowLeft size={16} />
                    {isFirst ? 'Cancelar' : 'Voltar'}
                </button>

                {hasGenerated && (
                    <button
                        onClick={handleNext}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-[#0A0F1C] font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,201,167,0.3)] hover:shadow-[0_0_25px_rgba(0,201,167,0.5)] transition-all hover:scale-105 active:scale-95"
                    >
                        {isLast ? (
                            <>
                                <Check size={16} />
                                Finalizar
                            </>
                        ) : (
                            <>
                                Próximo
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};
