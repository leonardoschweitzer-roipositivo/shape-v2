import React, { useState, useEffect } from 'react';
import {
    X,
    ChevronRight,
    ChevronLeft,
    Check,
    Activity,
    Heart,
    Pill,
    Dumbbell,
    Utensils,
    AlertCircle,
    Sparkles
} from 'lucide-react';
import { useAthleteStore } from '../stores/athleteStore';
import {
    LifestyleData,
    HealthData,
    SupplementsData,
    TrainingData,
    NutritionData,
    RotinaDiaria,
    NivelEstresse,
    ExperienciaTreino,
    LocalTreino,
    TipoDieta,
    OrcamentoAlimentacao
} from '../types/athlete';

// Common Styles
const INPUT_CLASS = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all";
const LABEL_CLASS = "block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2";
const BUTTON_PRIMARY_CLASS = "flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-[#0A0F1C] font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(0,201,167,0.2)] hover:shadow-[0_0_20px_rgba(0,201,167,0.4)]";
const BUTTON_SECONDARY_CLASS = "flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors uppercase tracking-widest";

// ============================================
// STEP COMPONENTS
// ============================================

const StepLayout: React.FC<{
    title: string;
    description: string;
    icon: React.ElementType;
    children: React.ReactNode;
}> = ({ title, description, icon: Icon, children }) => (
    <div className="space-y-8 animate-fade-in">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                <Icon size={28} className="text-primary" />
            </div>
            <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
                <p className="text-sm text-gray-400">{description}</p>
            </div>
        </div>
        <div className="space-y-5 px-1 custom-scrollbar">
            {children}
        </div>
    </div>
);

// --- LIFESTYLE FORM ---

export interface LifestyleFormProps {
    initialData?: LifestyleData;
    onSave: (data: LifestyleData) => void;
    formId?: string;
}

export const LifestyleForm: React.FC<LifestyleFormProps> = ({ initialData, onSave, formId = 'step-form' }) => {
    const [data, setData] = useState<LifestyleData>(initialData || {
        profissao: '',
        rotinaDiaria: 'moderada',
        horasSono: 7,
        nivelEstresse: 'moderado'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(data);
    };

    return (
        <form id={formId} onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className={LABEL_CLASS}>Profissão</label>
                <input
                    type="text"
                    value={data.profissao}
                    onChange={e => setData({ ...data, profissao: e.target.value })}
                    className={INPUT_CLASS}
                    placeholder="Ex: Desenvolvedor, Estudante..."
                    required
                />
            </div>

            <div>
                <label className={LABEL_CLASS}>Rotina Diária (Nível de Atividade)</label>
                <select
                    value={data.rotinaDiaria}
                    onChange={e => setData({ ...data, rotinaDiaria: e.target.value as RotinaDiaria })}
                    className={INPUT_CLASS}
                >
                    <option value="sedentaria">Sedentária (Trabalho sentado, pouco movimento)</option>
                    <option value="leve">Leve (Caminhadas ocasionais, trabalho de pé)</option>
                    <option value="moderada">Moderada (Exercício regular 3-5x)</option>
                    <option value="ativa">Ativa (Trabalho físico ou exercício intenso diário)</option>
                    <option value="muito_ativa">Muito Ativa (Atleta ou trabalho pesado)</option>
                </select>
            </div>

            <div>
                <label className={LABEL_CLASS}>Horas de Sono (Média)</label>
                <input
                    type="number"
                    min="1"
                    max="24"
                    value={data.horasSono}
                    onChange={e => setData({ ...data, horasSono: Number(e.target.value) })}
                    className={INPUT_CLASS}
                />
            </div>

            <div>
                <label className={LABEL_CLASS}>Nível de Estresse</label>
                <select
                    value={data.nivelEstresse}
                    onChange={e => setData({ ...data, nivelEstresse: e.target.value as NivelEstresse })}
                    className={INPUT_CLASS}
                >
                    <option value="baixo">Baixo</option>
                    <option value="moderado">Moderado</option>
                    <option value="alto">Alto</option>
                    <option value="muito_alto">Muito Alto</option>
                </select>
            </div>
        </form>
    );
};

// --- HEALTH FORM ---

export interface HealthFormProps {
    initialData?: HealthData;
    onSave: (data: HealthData) => void;
    formId?: string;
}

export const HealthForm: React.FC<HealthFormProps> = ({ initialData, onSave, formId = 'step-form' }) => {
    const [data, setData] = useState<HealthData>(initialData || {
        condicoesSaude: [],
        lesoes: [],
        medicamentos: []
    });

    const [newCondition, setNewCondition] = useState('');
    const [newMedication, setNewMedication] = useState('');

    const addCondition = () => {
        if (newCondition.trim()) {
            setData({
                ...data,
                condicoesSaude: [...data.condicoesSaude, { nome: newCondition }]
            });
            setNewCondition('');
        }
    };

    const addMedication = () => {
        if (newMedication.trim()) {
            setData({
                ...data,
                medicamentos: [...data.medicamentos, { nome: newMedication }]
            });
            setNewMedication('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(data);
    };

    return (
        <form id={formId} onSubmit={handleSubmit} className="space-y-6">
            {/* Condições de Saúde */}
            <div>
                <label className={LABEL_CLASS}>Condições de Saúde</label>
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={newCondition}
                        onChange={e => setNewCondition(e.target.value)}
                        className={INPUT_CLASS}
                        placeholder="Ex: Diabetes, Hipertensão..."
                    />
                    <button
                        type="button"
                        onClick={addCondition}
                        className="px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-colors"
                    >
                        Adicionar
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {data.condicoesSaude.map((c, i) => (
                        <span key={i} className="pl-3 pr-2 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-lg text-sm flex items-center gap-2">
                            {c.nome}
                            <button
                                type="button"
                                onClick={() => setData({ ...data, condicoesSaude: data.condicoesSaude.filter((_, idx) => idx !== i) })}
                                className="hover:text-red-400 p-1"
                            >
                                <X size={14} />
                            </button>
                        </span>
                    ))}
                    {data.condicoesSaude.length === 0 && (
                        <span className="text-xs text-gray-500 italic block mt-1">Nenhuma condição adicionada (assumiremos saudável)</span>
                    )}
                </div>
            </div>

            {/* Medicamentos */}
            <div>
                <label className={LABEL_CLASS}>Medicamentos de uso contínuo</label>
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={newMedication}
                        onChange={e => setNewMedication(e.target.value)}
                        className={INPUT_CLASS}
                        placeholder="Nome do medicamento..."
                    />
                    <button
                        type="button"
                        onClick={addMedication}
                        className="px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-colors"
                    >
                        Adicionar
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {data.medicamentos.map((m, i) => (
                        <span key={i} className="pl-3 pr-2 py-1.5 bg-secondary/10 border border-secondary/20 text-secondary rounded-lg text-sm flex items-center gap-2">
                            {m.nome}
                            <button
                                type="button"
                                onClick={() => setData({ ...data, medicamentos: data.medicamentos.filter((_, idx) => idx !== i) })}
                                className="hover:text-red-400 p-1"
                            >
                                <X size={14} />
                            </button>
                        </span>
                    ))}
                </div>
            </div>
        </form>
    );
};

// --- SUPPLEMENTS FORM ---

export interface SupplementsFormProps {
    initialData?: SupplementsData;
    onSave: (data: SupplementsData) => void;
    formId?: string;
}

export const SupplementsForm: React.FC<SupplementsFormProps> = ({ initialData, onSave, formId = 'step-form' }) => {
    const [data, setData] = useState<SupplementsData>(initialData || {
        suplementos: [],
        usaErgogenicos: false,
        tipoErgogenico: ''
    });

    const [newSupplement, setNewSupplement] = useState('');

    const addSupplement = () => {
        if (newSupplement.trim()) {
            setData({
                ...data,
                suplementos: [...data.suplementos, { nome: newSupplement }]
            });
            setNewSupplement('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(data);
    };

    return (
        <form id={formId} onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className={LABEL_CLASS}>Suplementos atuais</label>
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={newSupplement}
                        onChange={e => setNewSupplement(e.target.value)}
                        className={INPUT_CLASS}
                        placeholder="Ex: Whey, Creatina..."
                    />
                    <button
                        type="button"
                        onClick={addSupplement}
                        className="px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-colors"
                    >
                        Adicionar
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {data.suplementos.map((s, i) => (
                        <span key={i} className="pl-3 pr-2 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-lg text-sm flex items-center gap-2">
                            {s.nome}
                            <button
                                type="button"
                                onClick={() => setData({ ...data, suplementos: data.suplementos.filter((_, idx) => idx !== i) })}
                                className="hover:text-red-400 p-1"
                            >
                                <X size={14} />
                            </button>
                        </span>
                    ))}
                    {data.suplementos.length === 0 && (
                        <span className="text-xs text-gray-500 italic block mt-1">Nenhum suplemento adicionado</span>
                    )}
                </div>
            </div>

            <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                <label className="flex items-center gap-4 cursor-pointer">
                    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${data.usaErgogenicos ? 'bg-primary border-primary' : 'border-gray-600 bg-black/20'}`}>
                        {data.usaErgogenicos && <Check size={14} className="text-background-dark" />}
                    </div>
                    <input
                        type="checkbox"
                        className="hidden"
                        checked={data.usaErgogenicos}
                        onChange={e => setData({ ...data, usaErgogenicos: e.target.checked })}
                    />
                    <span className="text-base font-medium text-white">Faz uso de ergogênicos hormonais?</span>
                </label>

                {data.usaErgogenicos && (
                    <div className="mt-4 pl-10">
                        <label className={LABEL_CLASS}>Qual/Quais? (Opcional - para melhor análise)</label>
                        <input
                            type="text"
                            value={data.tipoErgogenico || ''}
                            onChange={e => setData({ ...data, tipoErgogenico: e.target.value })}
                            className={INPUT_CLASS}
                            placeholder="Descreva brevemente..."
                        />
                    </div>
                )}
            </div>
        </form>
    );
};

// --- TRAINING FORM ---

export interface TrainingFormProps {
    initialData?: TrainingData;
    onSave: (data: TrainingData) => void;
    formId?: string;
}

export const TrainingForm: React.FC<TrainingFormProps> = ({ initialData, onSave, formId = 'step-form' }) => {
    const [data, setData] = useState<TrainingData>(initialData || {
        tempoTreinando: '1_3',
        frequenciaTreino: 4,
        duracaoTreino: 60,
        localTreino: 'academia_completa',
        equipamentos: []
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(data);
    };

    return (
        <form id={formId} onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className={LABEL_CLASS}>Tempo de Treino</label>
                <select
                    value={data.tempoTreinando}
                    onChange={e => setData({ ...data, tempoTreinando: e.target.value as ExperienciaTreino })}
                    className={INPUT_CLASS}
                >
                    <option value="menos_1">Menos de 1 ano</option>
                    <option value="1_3">1 a 3 anos</option>
                    <option value="3_5">3 a 5 anos</option>
                    <option value="5_10">5 a 10 anos</option>
                    <option value="mais_10">Mais de 10 anos</option>
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={LABEL_CLASS}>Freq. Semanal (dias)</label>
                    <input
                        type="number"
                        min="1"
                        max="7"
                        value={data.frequenciaTreino}
                        onChange={e => setData({ ...data, frequenciaTreino: Number(e.target.value) })}
                        className={INPUT_CLASS}
                    />
                </div>
                <div>
                    <label className={LABEL_CLASS}>Duração Média (min)</label>
                    <input
                        type="number"
                        min="10"
                        step="5"
                        value={data.duracaoTreino}
                        onChange={e => setData({ ...data, duracaoTreino: Number(e.target.value) })}
                        className={INPUT_CLASS}
                    />
                </div>
            </div>

            <div>
                <label className={LABEL_CLASS}>Local de Treino</label>
                <select
                    value={data.localTreino}
                    onChange={e => setData({ ...data, localTreino: e.target.value as LocalTreino })}
                    className={INPUT_CLASS}
                >
                    <option value="academia_completa">Academia Completa</option>
                    <option value="academia_simples">Academia Simples (Bairro/Condomínio)</option>
                    <option value="home_gym">Home Gym / Em casa</option>
                    <option value="ar_livre">Ao Ar Livre / Calistenia</option>
                </select>
            </div>
        </form>
    );
};

// --- NUTRITION FORM ---

export interface NutritionFormProps {
    initialData?: NutritionData;
    onSave: (data: NutritionData) => void;
    formId?: string;
}

export const NutritionForm: React.FC<NutritionFormProps> = ({ initialData, onSave, formId = 'step-form' }) => {
    const [data, setData] = useState<NutritionData>(initialData || {
        dietaAtual: 'sem_dieta',
        refeicoesdia: 3,
        alergias: [],
        cozinha: true,
        orcamento: 'medio'
    });

    const [newAllergy, setNewAllergy] = useState('');

    const addAllergy = () => {
        if (newAllergy.trim()) {
            setData({
                ...data,
                alergias: [...data.alergias, newAllergy]
            });
            setNewAllergy('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(data);
    };

    return (
        <form id={formId} onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className={LABEL_CLASS}>Dieta Atual</label>
                <select
                    value={data.dietaAtual}
                    onChange={e => setData({ ...data, dietaAtual: e.target.value as TipoDieta })}
                    className={INPUT_CLASS}
                >
                    <option value="sem_dieta">Sem dieta específica (Como o que tem)</option>
                    <option value="flexivel">Dieta Flexível (Conto macros)</option>
                    <option value="low_carb">Low Carb</option>
                    <option value="cetogenica">Cetogênica</option>
                    <option value="vegetariana">Vegetariana</option>
                    <option value="vegana">Vegana</option>
                    <option value="outra">Outra</option>
                </select>
            </div>

            <div>
                <label className={LABEL_CLASS}>Refeições por dia</label>
                <input
                    type="number"
                    min="1"
                    max="8"
                    value={data.refeicoesdia}
                    onChange={e => setData({ ...data, refeicoesdia: Number(e.target.value) })}
                    className={INPUT_CLASS}
                />
            </div>

            <div>
                <label className={LABEL_CLASS}>Alergias / Intolerâncias</label>
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={newAllergy}
                        onChange={e => setNewAllergy(e.target.value)}
                        className={INPUT_CLASS}
                        placeholder="Ex: Lactose, Glúten..."
                    />
                    <button
                        type="button"
                        onClick={addAllergy}
                        className="px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-colors"
                    >
                        Adicionar
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {data.alergias.map((a, i) => (
                        <span key={i} className="pl-3 pr-2 py-1.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm flex items-center gap-2">
                            {a}
                            <button
                                type="button"
                                onClick={() => setData({ ...data, alergias: data.alergias.filter((_, idx) => idx !== i) })}
                                className="hover:text-red-400 p-1"
                            >
                                <X size={14} />
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            <div>
                <label className={LABEL_CLASS}>Orçamento para Alimentação</label>
                <div className="grid grid-cols-3 gap-3">
                    {['baixo', 'medio', 'alto'].map((opt) => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => setData({ ...data, orcamento: opt as OrcamentoAlimentacao })}
                            className={`py-3 px-3 rounded-xl border text-sm font-bold uppercase tracking-wide transition-all ${data.orcamento === opt
                                ? 'bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(0,201,167,0.2)]'
                                : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10 hover:text-gray-300'
                                }`}
                        >
                            {opt === 'baixo' ? 'Baixo' : opt === 'medio' ? 'Médio' : 'Alto'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/10 mt-2">
                <label className="flex items-center gap-4 cursor-pointer w-full">
                    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${data.cozinha ? 'bg-primary border-primary' : 'border-gray-600 bg-black/20'}`}>
                        {data.cozinha && <Check size={14} className="text-background-dark" />}
                    </div>
                    <input
                        type="checkbox"
                        className="hidden"
                        checked={data.cozinha}
                        onChange={e => setData({ ...data, cozinha: e.target.checked })}
                    />
                    <div>
                        <span className="text-base font-medium text-white block">Sabe/Gosta de cozinhar?</span>
                        <span className="text-xs text-gray-500">Ajuda a montar dietas mais complexas.</span>
                    </div>
                </label>
            </div>
        </form>
    );
};

// ============================================
// MAIN MODAL COMPONENT
// ============================================

interface ProgressiveProfilingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 'lifestyle' | 'health' | 'supplements' | 'training' | 'nutrition';

const STEPS: { id: Step; title: string; icon: React.ElementType; description: string }[] = [
    { id: 'lifestyle', title: 'Estilo de Vida', icon: Activity, description: 'Como é o seu dia a dia, sono e estresse.' },
    { id: 'health', title: 'Saúde', icon: Heart, description: 'Condições preexistentes, lesões e medicamentos.' },
    { id: 'supplements', title: 'Suplementação', icon: Pill, description: 'O que você já toma ou gostaria de tomar.' },
    { id: 'training', title: 'Treino', icon: Dumbbell, description: 'Sua experiência, frequência e local de treino.' },
    { id: 'nutrition', title: 'Nutrição', icon: Utensils, description: 'Suas preferências alimentares e rotina.' },
];

export const ProgressiveProfilingModal: React.FC<ProgressiveProfilingModalProps> = ({ isOpen, onClose }) => {
    const {
        profile,
        updateLifestyle,
        updateHealth,
        updateSupplements,
        updateTraining,
        updateNutrition
    } = useAthleteStore();

    // Find the first incomplete step or default to lifestyle
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    useEffect(() => {
        if (isOpen && profile) {
            // Determine starting step based on what's missing
            const completion = profile.profileCompletion;
            if (!completion.lifestyle) setCurrentStepIndex(0);
            else if (!completion.health) setCurrentStepIndex(1);
            else if (!completion.supplements) setCurrentStepIndex(2);
            else if (!completion.training) setCurrentStepIndex(3);
            else if (!completion.nutrition) setCurrentStepIndex(4);
            else setCurrentStepIndex(0); // All done, start from beginning to review? or 0
        }
    }, [isOpen, profile]);

    if (!isOpen || !profile) return null;

    const currentStep = STEPS[currentStepIndex];
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === STEPS.length - 1;

    const handleNext = () => {
        // Trigger form submission via Ref or ID selector (simplified here using form ID)
        const form = document.getElementById('step-form') as HTMLFormElement;
        if (form) form.requestSubmit();
    };

    const handleBack = () => {
        if (!isFirstStep) setCurrentStepIndex(prev => prev - 1);
    };

    const onSaveStep = (data: any) => {
        // Save data based on current step definition
        switch (currentStep.id) {
            case 'lifestyle': updateLifestyle(data); break;
            case 'health': updateHealth(data); break;
            case 'supplements': updateSupplements(data); break;
            case 'training': updateTraining(data); break;
            case 'nutrition': updateNutrition(data); break;
        }

        if (isLastStep) {
            onClose();
        } else {
            setCurrentStepIndex(prev => prev + 1);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#050810]/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-[#131B2C] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#131B2C]">
                    <div className="flex flex-col gap-2 w-full max-w-md">
                        <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                            <span>Passo {currentStepIndex + 1} de {STEPS.length}</span>
                            <span>{Math.round(((currentStepIndex + 1) / STEPS.length) * 100)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-500 ease-out shadow-[0_0_10px_rgba(0,201,167,0.5)]"
                                style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
                            />
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-6 p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                    <StepLayout title={currentStep.title} description={currentStep.description} icon={currentStep.icon}>
                        {currentStep.id === 'lifestyle' && (
                            <LifestyleForm initialData={profile.lifestyle} onSave={onSaveStep} />
                        )}
                        {currentStep.id === 'health' && (
                            <HealthForm initialData={profile.health} onSave={onSaveStep} />
                        )}
                        {currentStep.id === 'supplements' && (
                            <SupplementsForm initialData={profile.supplements} onSave={onSaveStep} />
                        )}
                        {currentStep.id === 'training' && (
                            <TrainingForm initialData={profile.training} onSave={onSaveStep} />
                        )}
                        {currentStep.id === 'nutrition' && (
                            <NutritionForm initialData={profile.nutrition} onSave={onSaveStep} />
                        )}
                    </StepLayout>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 flex justify-between items-center bg-[#0A0F1C]/30 rounded-b-2xl">
                    <button
                        onClick={handleBack}
                        disabled={isFirstStep}
                        className={BUTTON_SECONDARY_CLASS}
                        style={{ opacity: isFirstStep ? 0 : 1 }}
                    >
                        <ChevronLeft size={16} />
                        Voltar
                    </button>

                    <button
                        onClick={handleNext}
                        className={BUTTON_PRIMARY_CLASS}
                    >
                        {isLastStep ? 'FINALIZAR' : 'PRÓXIMO'}
                        {isLastStep ? <Check size={18} /> : <ChevronRight size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
};
