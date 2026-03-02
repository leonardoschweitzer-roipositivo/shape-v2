/**
 * AthleteContextSection
 * 
 * Seção de "Contexto" na ficha do atleta.
 * Permite ao personal registrar informações qualitativas essenciais
 * para treino e dieta: saúde, medicações, lesões, estilo de vida, etc.
 * 
 * Os dados são armazenados como JSONB no campo `contexto` da tabela `fichas`.
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
    Heart,
    Pill,
    AlertTriangle,
    FileText,
    Sun,
    Briefcase,
    Dumbbell,
    UtensilsCrossed,
    Edit3,
    Check,
    X,
    Loader2,
    ClipboardList,
    Mic,
    MicOff
} from 'lucide-react';
import { atletaService } from '@/services/atleta.service';
import { useSpeechToText } from '@/hooks/useSpeechToText';

// ===== TYPES =====

export interface ContextoAtleta {
    problemas_saude: string;
    medicacoes: string;
    dores_lesoes: string;
    exames: string;
    estilo_vida: string;
    profissao: string;
    historico_treino: string;
    historico_dietas: string;
    atualizado_em?: string;
    atualizado_por?: string;
}

interface ContextoFieldConfig {
    key: keyof Omit<ContextoAtleta, 'atualizado_em' | 'atualizado_por'>;
    label: string;
    icon: React.ElementType;
    placeholder: string;
    description: string;
}

interface AthleteContextSectionProps {
    athleteId: string;
    contexto: ContextoAtleta | null;
    onContextoUpdated?: (contexto: ContextoAtleta) => void;
    onDraftChange?: (draft: ContextoAtleta) => void;
    isInsideAccordion?: boolean;
    globalIsEditing?: boolean;
}

// ===== CONFIG =====

const CONTEXT_FIELDS: ContextoFieldConfig[] = [
    {
        key: 'problemas_saude',
        label: 'Problemas de Saúde',
        icon: Heart,
        placeholder: 'Descreva condições de saúde relevantes (ex: diabetes, hipertensão, hipotireoidismo...)',
        description: 'Condições que afetam gasto calórico, treino e dieta'
    },
    {
        key: 'medicacoes',
        label: 'Medicações em Uso',
        icon: Pill,
        placeholder: 'Medicamentos, hormônios ou substâncias em uso (ex: Tirzepatida 5mg/semana, TRT 200mg/semana, Losartana 50mg...)',
        description: 'Medicamentos que influenciam metabolismo e performance'
    },
    {
        key: 'dores_lesoes',
        label: 'Dores e Lesões',
        icon: AlertTriangle,
        placeholder: 'Dores atuais, lesões ou restrições de movimento (ex: Dor no ombro esquerdo ao elevar acima de 90°...)',
        description: 'Restrições que impactam exercícios e recuperação'
    },
    {
        key: 'exames',
        label: 'Exames',
        icon: FileText,
        placeholder: 'Exames recentes e resultados relevantes (ex: Hemograma 01/2026 - tudo normal, Testosterona total: 450ng/dL...)',
        description: 'Resultados laboratoriais e exames de imagem'
    },
    {
        key: 'estilo_vida',
        label: 'Estilo de Vida',
        icon: Sun,
        placeholder: 'Rotina diária, nível de atividade, qualidade do sono (ex: Sedentário, dorme 6h/noite, muito estressado...)',
        description: 'Fatores do dia a dia que afetam resultados'
    },
    {
        key: 'profissao',
        label: 'Profissão',
        icon: Briefcase,
        placeholder: 'Profissão e tipo de trabalho (ex: Programador, home office, sentado 10h/dia...)',
        description: 'Atividade laboral e gasto calórico ocupacional'
    },
    {
        key: 'historico_treino',
        label: 'Histórico de Treino',
        icon: Dumbbell,
        placeholder: 'Tempo de treino, modalidades, frequência (ex: Treina musculação há 3 anos, parou 6 meses, voltou há 2 meses, 4x/semana...)',
        description: 'Experiência e background de treinamento'
    },
    {
        key: 'historico_dietas',
        label: 'Histórico de Dietas',
        icon: UtensilsCrossed,
        placeholder: 'Dietas anteriores, resultados e dificuldades (ex: Fez low carb 3 meses, perdeu 5kg mas não sustentou. Tentou jejum intermitente...)',
        description: 'Experiências alimentares passadas e aprendizados'
    },
];

const EMPTY_CONTEXTO: ContextoAtleta = {
    problemas_saude: '',
    medicacoes: '',
    dores_lesoes: '',
    exames: '',
    estilo_vida: '',
    profissao: '',
    historico_treino: '',
    historico_dietas: '',
};

// ===== SUBCOMPONENTS =====

interface ContextFieldProps {
    config: ContextoFieldConfig;
    value: string;
    isEditing: boolean;
    onChange: (value: string) => void;
}

const ContextField: React.FC<ContextFieldProps> = ({
    config,
    value,
    isEditing,
    onChange,
}) => {
    const Icon = config.icon;
    const hasContent = value.trim().length > 0;

    // Speech-to-text per field
    const speech = useSpeechToText({
        language: 'pt-BR',
        onResult: (text: string) => {
            // Append transcribed text to existing value
            const separator = value.trim().length > 0 ? ' ' : '';
            onChange(value + separator + text);
        },
    });

    const toggleMic = () => {
        if (speech.isListening) {
            speech.stopListening();
        } else {
            speech.startListening();
        }
    };

    return (
        <div className={`bg-[#0A0F1C] rounded-xl border transition-all ${isEditing
            ? 'border-primary/30 shadow-[0_0_10px_rgba(0,201,167,0.05)]'
            : hasContent
                ? 'border-white/10 hover:border-white/20'
                : 'border-white/5 hover:border-white/10'
            }`}>
            {/* Header */}
            <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${hasContent
                    ? 'bg-primary/10 text-primary'
                    : 'bg-white/5 text-gray-500'
                    }`}>
                    <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest">
                        {config.label}
                    </h4>
                    <p className="text-[10px] text-gray-600 truncate">{config.description}</p>
                </div>
                {/* Mic button (edit mode only) */}
                {isEditing && speech.isSupported && (
                    <button
                        type="button"
                        onClick={toggleMic}
                        title={speech.isListening ? 'Parar gravação' : 'Ditar por voz'}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${speech.isListening
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                            : 'bg-white/5 text-gray-500 hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20'
                            }`}
                    >
                        {speech.isListening ? <MicOff size={14} /> : <Mic size={14} />}
                    </button>
                )}
                {hasContent && !isEditing && (
                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" title="Preenchido" />
                )}
            </div>

            {/* Listening indicator */}
            {speech.isListening && isEditing && (
                <div className="mx-4 mb-2 flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Ouvindo...</span>
                    {speech.transcript && (
                        <span className="text-[10px] text-gray-400 italic truncate flex-1">
                            {speech.transcript}
                        </span>
                    )}
                </div>
            )}

            {/* Content */}
            <div className="px-4 pb-4">
                {isEditing ? (
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={config.placeholder}
                        rows={3}
                        className="w-full bg-white/[0.03] text-white text-sm rounded-lg border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none p-3 resize-none placeholder-gray-600 transition-all font-light leading-relaxed"
                    />
                ) : (
                    <p className={`text-sm leading-relaxed px-1 ${hasContent ? 'text-gray-300 font-light' : 'text-gray-600 italic'
                        }`}>
                        {hasContent ? value : 'Não informado'}
                    </p>
                )}
            </div>
        </div>
    );
};

// ===== MAIN COMPONENT =====

export const AthleteContextSection: React.FC<AthleteContextSectionProps> = ({
    athleteId,
    contexto,
    onContextoUpdated,
    onDraftChange,
    isInsideAccordion,
    globalIsEditing = false,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [draft, setDraft] = useState<ContextoAtleta>(contexto || EMPTY_CONTEXTO);

    const isActuallyEditing = isEditing || globalIsEditing;

    // Sync with external changes only if not actively editing
    useEffect(() => {
        if (!isActuallyEditing) {
            setDraft(contexto || EMPTY_CONTEXTO);
        }
    }, [contexto, isActuallyEditing]);

    const updateField = useCallback((key: keyof ContextoAtleta, value: string) => {
        setDraft(prev => {
            const next = { ...prev, [key]: value };
            if (onDraftChange) onDraftChange(next);
            return next;
        });
    }, [onDraftChange]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updatedContexto: ContextoAtleta = {
                ...draft,
                atualizado_em: new Date().toISOString(),
            };

            await atletaService.atualizarFicha(athleteId, {
                contexto: updatedContexto as unknown as Record<string, unknown>,
            } as any);

            setDraft(updatedContexto);
            onContextoUpdated?.(updatedContexto);
            setIsEditing(false);
        } catch (error) {
            console.error('[ContextoSection] Erro ao salvar contexto:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setDraft(contexto || EMPTY_CONTEXTO);
        setIsEditing(false);
    };

    // Contar campos preenchidos
    const filledCount = CONTEXT_FIELDS.filter(
        f => (draft[f.key] || '').trim().length > 0
    ).length;

    return (
        <div className={isInsideAccordion ? "" : "pt-6"}>
            {/* Section Header */}
            {isInsideAccordion ? (
                <>
                    {!globalIsEditing && (
                        <div className="flex justify-end gap-2 mb-4">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all font-bold text-[10px] uppercase tracking-wider disabled:opacity-50"
                                    >
                                        <X size={14} />
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all font-bold text-[10px] uppercase tracking-wider
                                        bg-primary text-[#0A0F1C] border-primary shadow-[0_0_15px_rgba(0,201,167,0.3)]
                                        ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[0_0_25px_rgba(0,201,167,0.4)]'}`}
                                    >
                                        {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                        {isSaving ? 'Salvando...' : 'Salvar'}
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:border-white/30 transition-all font-bold text-[10px] uppercase tracking-wider"
                                >
                                    <Edit3 size={14} />
                                    Editar Contexto
                                </button>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <div className="flex items-center justify-between mb-8 group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:border-primary/50 transition-all shadow-lg backdrop-blur-sm">
                            <ClipboardList size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white uppercase tracking-tight leading-none mb-1">
                                Contexto
                            </h2>
                            <p className="text-gray-500 text-sm font-medium">
                                Informações de saúde, estilo de vida e histórico do atleta
                                {filledCount > 0 && (
                                    <span className="ml-2 text-primary/70">
                                        ({filledCount}/{CONTEXT_FIELDS.length} preenchidos)
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {!globalIsEditing && (
                        <div className="flex items-center gap-2">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all font-bold text-xs uppercase tracking-wider disabled:opacity-50"
                                    >
                                        <X size={16} />
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all font-bold text-xs uppercase tracking-wider
                                        bg-primary text-[#0A0F1C] border-primary shadow-[0_0_15px_rgba(0,201,167,0.3)]
                                        ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[0_0_25px_rgba(0,201,167,0.4)]'}`}
                                    >
                                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                        {isSaving ? 'Salvando...' : 'Salvar Contexto'}
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:border-white/30 transition-all font-bold text-xs uppercase tracking-wider"
                                >
                                    <Edit3 size={16} />
                                    Editar Contexto
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Context Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CONTEXT_FIELDS.map((config) => (
                    <ContextField
                        key={config.key}
                        config={config}
                        value={draft[config.key] || ''}
                        isEditing={isActuallyEditing}
                        onChange={(val: string) => updateField(config.key, val)}
                    />
                ))}
            </div>

            {/* Last Updated Info */}
            {draft.atualizado_em && !isEditing && (
                <p className="text-[10px] text-gray-600 mt-4 text-right uppercase tracking-wider">
                    Última atualização: {new Date(draft.atualizado_em).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
            )}
        </div>
    );
};
