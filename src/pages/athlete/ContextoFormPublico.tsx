/**
 * ContextoFormPublico — Formulário de Contexto para o Atleta
 *
 * Acessível via link público (sem login).
 * O aluno preenche: saúde, medicações, lesões, estilo de vida, etc.
 * Ao submeter, salva no campo JSONB `contexto` da tabela `fichas`
 * e notifica o personal.
 *
 * Mobile-first, visual premium, reutiliza os mesmos campos do AthleteContextSection.
 */

import React, { useState } from 'react'
import {
    ArrowLeft,
    Heart,
    Pill,
    AlertTriangle,
    FileText,
    Sun,
    Briefcase,
    Dumbbell,
    UtensilsCrossed,
    Send,
    Loader2,
    CheckCircle2,
    ClipboardList,
} from 'lucide-react'
import { portalService } from '@/services/portalService'

// ===== TYPES =====

interface ContextoFormPublicoProps {
    atletaId: string
    atletaNome: string
    onBack: () => void
}

interface ContextoField {
    key: string
    label: string
    icon: React.ElementType
    placeholder: string
    description: string
}

// ===== CONFIG =====
// Mesmos 8 campos do AthleteContextSection (DRY via mesma estrutura)

const CONTEXT_FIELDS: ContextoField[] = [
    {
        key: 'problemas_saude',
        label: 'Problemas de Saúde',
        icon: Heart,
        placeholder: 'Ex: diabetes, hipertensão, hipotireoidismo...',
        description: 'Condições que afetam seu treino e dieta',
    },
    {
        key: 'medicacoes',
        label: 'Medicações em Uso',
        icon: Pill,
        placeholder: 'Ex: Losartana 50mg, Metformina...',
        description: 'Medicamentos que influenciam metabolismo',
    },
    {
        key: 'dores_lesoes',
        label: 'Dores e Lesões',
        icon: AlertTriangle,
        placeholder: 'Ex: Dor no ombro esquerdo ao elevar acima de 90°...',
        description: 'Restrições que impactam exercícios',
    },
    {
        key: 'exames',
        label: 'Exames Recentes',
        icon: FileText,
        placeholder: 'Ex: Hemograma 01/2026 - normal, Testosterona 450ng/dL...',
        description: 'Resultados laboratoriais relevantes',
    },
    {
        key: 'estilo_vida',
        label: 'Estilo de Vida',
        icon: Sun,
        placeholder: 'Ex: Sedentário, dorme 6h/noite, estressado...',
        description: 'Rotina, sono e nível de atividade',
    },
    {
        key: 'profissao',
        label: 'Profissão',
        icon: Briefcase,
        placeholder: 'Ex: Programador, home office, sentado 10h/dia...',
        description: 'Atividade laboral e gasto calórico',
    },
    {
        key: 'historico_treino',
        label: 'Histórico de Treino',
        icon: Dumbbell,
        placeholder: 'Ex: Treina musculação há 3 anos, voltou há 2 meses...',
        description: 'Experiência e background de treinamento',
    },
    {
        key: 'historico_dietas',
        label: 'Histórico de Dietas',
        icon: UtensilsCrossed,
        placeholder: 'Ex: Fez low carb 3 meses, perdeu 5kg mas não sustentou...',
        description: 'Experiências alimentares passadas',
    },
]

type FormData = Record<string, string>

const EMPTY_FORM: FormData = CONTEXT_FIELDS.reduce((acc, f) => {
    acc[f.key] = ''
    return acc
}, {} as FormData)

// ===== COMPONENT =====

export function ContextoFormPublico({ atletaId, atletaNome, onBack }: ContextoFormPublicoProps) {
    const [form, setForm] = useState<FormData>(EMPTY_FORM)
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)

    const updateField = (key: string, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }))
    }

    const filledCount = CONTEXT_FIELDS.filter(f => (form[f.key] || '').trim().length > 0).length

    const handleSubmit = async () => {
        setSaving(true)
        const result = await portalService.saveContexto(atletaId, {
            problemas_saude: form.problemas_saude || '',
            medicacoes: form.medicacoes || '',
            dores_lesoes: form.dores_lesoes || '',
            exames: form.exames || '',
            estilo_vida: form.estilo_vida || '',
            profissao: form.profissao || '',
            historico_treino: form.historico_treino || '',
            historico_dietas: form.historico_dietas || '',
        })
        setSaving(false)

        if (result.success) {
            setSuccess(true)
        }
    }

    // ---- Estado: Sucesso ----
    if (success) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="text-emerald-400" size={40} />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-black text-white uppercase tracking-wider">
                            Contexto Enviado!
                        </h1>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Obrigado, <strong className="text-white">{atletaNome}</strong>! Seu Personal
                            foi notificado e vai usar essas informações para personalizar
                            ainda mais o seu plano. 🎯
                        </p>
                    </div>
                    <button
                        onClick={onBack}
                        className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold uppercase tracking-widest transition-all"
                    >
                        Voltar ao Portal
                    </button>
                </div>
            </div>
        )
    }

    // ---- Formulário ----
    const currentField = CONTEXT_FIELDS[currentStep]
    const isLast = currentStep === CONTEXT_FIELDS.length - 1
    const CurrentIcon = currentField.icon

    return (
        <div className="min-h-screen bg-background-dark text-white flex flex-col">
            {/* Header */}
            <div className="px-4 pt-4 pb-3">
                <div className="flex items-center gap-3 mb-4">
                    <button
                        onClick={currentStep > 0 ? () => setCurrentStep(prev => prev - 1) : onBack}
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <ClipboardList size={16} className="text-indigo-400" />
                            <h1 className="text-sm font-black uppercase tracking-widest text-white">
                                Seu Contexto
                            </h1>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                            Passo {currentStep + 1} de {CONTEXT_FIELDS.length} · {filledCount} preenchidos
                        </p>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="flex gap-1">
                    {CONTEXT_FIELDS.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < currentStep ? 'bg-indigo-500'
                                    : i === currentStep ? 'bg-indigo-400'
                                        : (form[CONTEXT_FIELDS[i].key] || '').trim() ? 'bg-indigo-500/30'
                                            : 'bg-white/10'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Card do campo atual */}
            <div className="flex-1 flex flex-col px-4 pb-4">
                <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
                    {/* Ícone + Label */}
                    <div className="text-center mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-3">
                            <CurrentIcon size={24} className="text-indigo-400" />
                        </div>
                        <h2 className="text-lg font-black text-white uppercase tracking-wider">
                            {currentField.label}
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">
                            {currentField.description}
                        </p>
                    </div>

                    {/* Textarea */}
                    <textarea
                        value={form[currentField.key] || ''}
                        onChange={e => updateField(currentField.key, e.target.value)}
                        placeholder={currentField.placeholder}
                        rows={5}
                        autoFocus
                        className="w-full bg-white/[0.03] text-white text-sm rounded-xl border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 outline-none p-4 resize-none placeholder-gray-600 transition-all font-light leading-relaxed"
                    />

                    {/* Dica */}
                    <p className="text-[10px] text-gray-600 mt-2 text-center">
                        💡 Quanto mais detalhes, melhor o plano do seu Personal
                    </p>
                </div>

                {/* Navegação */}
                <div className="flex gap-3 mt-6">
                    {/* Pular */}
                    {!isLast && (
                        <button
                            onClick={() => setCurrentStep(prev => prev + 1)}
                            className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all border border-white/5"
                        >
                            Pular
                        </button>
                    )}

                    {/* Avançar ou Enviar */}
                    {isLast ? (
                        <button
                            onClick={handleSubmit}
                            disabled={saving || filledCount === 0}
                            className={`flex-1 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${filledCount === 0
                                    ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20 active:scale-95'
                                }`}
                        >
                            {saving ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Send size={14} />
                            )}
                            {saving ? 'Enviando...' : `Enviar (${filledCount}/${CONTEXT_FIELDS.length})`}
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentStep(prev => prev + 1)}
                            className="flex-1 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                        >
                            Avançar →
                        </button>
                    )}
                </div>

                {/* Quick nav: pontinhos para navegação rápida */}
                <div className="flex justify-center gap-2 mt-4">
                    {CONTEXT_FIELDS.map((f, i) => {
                        const filled = (form[f.key] || '').trim().length > 0
                        return (
                            <button
                                key={i}
                                onClick={() => setCurrentStep(i)}
                                className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentStep
                                        ? 'bg-indigo-400 scale-125'
                                        : filled
                                            ? 'bg-indigo-500/50 hover:bg-indigo-500/70'
                                            : 'bg-white/10 hover:bg-white/20'
                                    }`}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
