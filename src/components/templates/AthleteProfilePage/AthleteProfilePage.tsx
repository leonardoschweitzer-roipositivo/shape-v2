import React, { useState, useEffect } from 'react';
import {
    User,
    Edit3,
    Check,
    X,
    Sparkles,
    AlertCircle,
    ChevronRight,
    Activity,
    Dumbbell,
    Utensils,
    Heart,
    Pill,
    Plus,
    Calendar
} from 'lucide-react';
import {
    AthleteProfile,
    ProfileCompletion,
    Gender,
    UserGoal,
    EXPERIENCIA_LABELS
} from '@/types/athlete';
import { useAthleteStore } from '@/stores/athleteStore';
import {
    ProgressiveProfilingModal,
    LifestyleForm,
    TrainingForm,
    NutritionForm,
    HealthForm,
    SupplementsForm
} from '@/components/organisms';

// ============================================
// HELPER FUNCTIONS
// ============================================

function calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

// ============================================
// SUB-COMPONENTS
// ============================================

interface ProfileHeaderProps {
    profile: AthleteProfile;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
    const initials = profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

    return (
        <div className="flex items-center gap-6 p-6 bg-card-bg rounded-2xl border border-card-border">
            {/* Avatar */}
            <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-white/10 flex items-center justify-center">
                    {profile.avatarUrl ? (
                        <img
                            src={profile.avatarUrl}
                            alt={profile.name}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <span className="text-2xl font-bold text-primary">{initials}</span>
                    )}
                </div>
                {/* <button className="absolute -bottom-1 -right-1 p-1.5 bg-card-bg border border-card-border rounded-full hover:bg-white/5 transition-colors">
                    <Edit3 size={12} className="text-gray-400" />
                </button> */}
            </div>

            {/* Info */}
            <div className="flex-1">
                <h2 className="text-xl font-bold text-white">{profile.name}</h2>
                <p className="text-sm text-gray-400">{profile.email}</p>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">Membro desde {formatDate(profile.createdAt)}</span>
                </div>
            </div>

            {/* Score Badge */}
            {profile.latestScore && (
                <div className="flex flex-col items-center p-4 bg-primary/5 border border-white/10 rounded-xl">
                    <span className="text-3xl font-bold text-primary">{profile.latestScore.overall}</span>
                    <span className="text-xs text-gray-400">Score Geral</span>
                    <span className="text-xs font-medium text-primary mt-1">{profile.latestScore.classification}</span>
                </div>
            )}
        </div>
    );
};

interface ProfileCompletionBarProps {
    completion: ProfileCompletion;
    onComplete: () => void;
}

const ProfileCompletionBar: React.FC<ProfileCompletionBarProps> = ({ completion, onComplete }) => {
    const missingSections: string[] = [];
    if (!completion.lifestyle) missingSections.push('Estilo de vida');
    if (!completion.health) missingSections.push('Saúde');
    if (!completion.supplements) missingSections.push('Suplementos');
    if (!completion.training) missingSections.push('Treino');
    if (!completion.nutrition) missingSections.push('Nutrição');

    return (
        <div className="p-6 bg-card-bg rounded-2xl border border-card-border">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-secondary" />
                    <h3 className="font-semibold text-white">Completude do Perfil</h3>
                </div>
                <span className="text-lg font-bold text-white">{completion.percent}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-4">
                <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                    style={{ width: `${completion.percent}%` }}
                />
            </div>

            {/* Missing sections */}
            {missingSections.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-amber-400/80">
                        <AlertCircle size={14} />
                        <span>Complete para desbloquear o Coach VITRÚVIO</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {missingSections.map((section) => (
                            <span
                                key={section}
                                className="px-2 py-1 text-xs bg-white/5 text-gray-400 rounded-md border border-white/10"
                            >
                                {section}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* CTA Button */}
            {!completion.canUseVitruvio && (
                <button
                    onClick={onComplete}
                    className="mt-4 w-full py-3 px-4 bg-gradient-to-r from-secondary/20 to-primary/20 border border-white/10 rounded-xl text-secondary font-medium hover:from-secondary/30 hover:to-primary/30 transition-all flex items-center justify-center gap-2 group"
                >
                    <Sparkles size={16} />
                    Completar Perfil
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            )}
        </div>
    );
};

interface EditableInfoCardProps {
    title: string;
    icon: React.ElementType;
    isEditing?: boolean;
    onEdit?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
    formId?: string;
    children: React.ReactNode;
}

const EditableInfoCard: React.FC<EditableInfoCardProps> = ({
    title,
    icon: Icon,
    isEditing,
    onEdit,
    onSave,
    onCancel,
    formId,
    children
}) => (
    <div className="p-6 bg-card-bg rounded-2xl border border-card-border">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <Icon size={18} className="text-primary" />
                <h3 className="font-semibold text-white">{title}</h3>
            </div>
            {onEdit && (
                isEditing ? (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onCancel}
                            className="px-3 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1"
                        >
                            <X size={12} />
                            Cancelar
                        </button>
                        <button
                            onClick={onSave}
                            // If formId is provided, this button submits the form.
                            // Otherwise it calls onSave directly (if onSave is passed). 
                            // actually if formId is present, we still want to rely on the form submit triggering the action
                            // so we set type="submit" and form={formId}
                            // But usually, form libraries expect the submit to happen via the form event.
                            // If we use form attribute, clicking this submits the form.
                            type={formId ? "submit" : "button"}
                            form={formId}
                            className="px-3 py-1.5 text-xs text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors flex items-center gap-1"
                        >
                            <Check size={12} />
                            Salvar
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={onEdit}
                        className="px-3 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1"
                    >
                        <Edit3 size={12} />
                        Editar
                    </button>
                )
            )}
        </div>
        {children}
    </div>
);

interface InfoRowProps {
    label: string;
    value: string | React.ReactNode;
    icon?: React.ElementType;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, icon: Icon }) => (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
        <div className="flex items-center gap-2 text-gray-400">
            {Icon && <Icon size={14} />}
            <span className="text-sm">{label}</span>
        </div>
        <span className="text-sm font-medium text-white text-right">{value}</span>
    </div>
);

interface EditableInputProps {
    label: string;
    value: string | number;
    onChange: (value: string) => void;
    type?: 'text' | 'number' | 'email' | 'date';
    icon?: React.ElementType;
}

const EditableInput: React.FC<EditableInputProps> = ({ label, value, onChange, type = 'text', icon: Icon }) => (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
        <div className="flex items-center gap-2 text-gray-400">
            {Icon && <Icon size={14} />}
            <span className="text-sm">{label}</span>
        </div>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white w-48 focus:outline-none focus:border-primary/50"
        />
    </div>
);

// ============================================
// EMPTY STATE COMPONENT
// ============================================

interface EmptyProfileProps {
    onCreateProfile: () => void;
}

const EmptyProfile: React.FC<EmptyProfileProps> = ({ onCreateProfile }) => (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <User size={40} className="text-primary" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Nenhum perfil cadastrado</h2>
        <p className="text-gray-400 text-center mb-6 max-w-md">
            Crie seu perfil para começar a usar o VITRU IA e receber avaliações personalizadas.
        </p>
        <button
            onClick={onCreateProfile}
            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
        >
            <Plus size={18} />
            Criar Perfil
        </button>
    </div>
);

// ============================================
// CREATE PROFILE MODAL
// ============================================

interface CreateProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        name: string;
        email: string;
        gender: Gender;
        birthDate: Date;
        goal: UserGoal;
    }) => void;
}

const CreateProfileModal: React.FC<CreateProfileModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState<Gender>('MALE');
    const [birthDate, setBirthDate] = useState('');
    const [goal, setGoal] = useState<UserGoal>('aesthetics');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !birthDate) return;
        onSubmit({
            name,
            email,
            gender,
            birthDate: new Date(birthDate),
            goal,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#050810]/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-[#131B2C] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-up">

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#131B2C]">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                            Criar Perfil
                            <Sparkles size={12} className="text-secondary animate-pulse" />
                        </h2>
                        <p className="text-xs text-gray-400">Preencha seus dados iniciais</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nome completo</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                            placeholder="Seu nome"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                            placeholder="seu@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Sexo</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value as Gender)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                        >
                            <option value="MALE">Masculino</option>
                            <option value="FEMALE">Feminino</option>
                            <option value="OTHER">Outro</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Data de nascimento</label>
                        <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Objetivo principal</label>
                        <select
                            value={goal}
                            onChange={(e) => setGoal(e.target.value as UserGoal)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                        >
                            <option value="aesthetics">Melhorar proporções</option>
                            <option value="hypertrophy">Ganhar massa muscular</option>
                            <option value="definition">Definição / Secar</option>
                            <option value="health">Saúde geral</option>
                            <option value="competition">Competição</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full h-12 bg-primary hover:bg-primary/90 text-[#0A0F1C] rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,201,167,0.2)] hover:shadow-[0_0_20px_rgba(0,201,167,0.4)] mt-2"
                    >
                        CRIAR PERFIL
                    </button>
                </form>
            </div>
        </div>
    );
};

// ============================================
// MAIN COMPONENT
// ============================================

export const AthleteProfilePage: React.FC = () => {
    const {
        profile,
        initializeProfile,
        updateBasicInfo,
        updateStructuralMeasures,
        updateLifestyle,
        updateHealth,
        updateSupplements,
        updateTraining,
        updateNutrition
    } = useAthleteStore();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isProfilingModalOpen, setIsProfilingModalOpen] = useState(false);

    // Edit states
    const [isEditingBasic, setIsEditingBasic] = useState(false);
    const [isEditingStructural, setIsEditingStructural] = useState(false);
    const [isEditingLifestyle, setIsEditingLifestyle] = useState(false);
    const [isEditingTraining, setIsEditingTraining] = useState(false);
    const [isEditingNutrition, setIsEditingNutrition] = useState(false);
    const [isEditingHealth, setIsEditingHealth] = useState(false);
    const [isEditingSupplements, setIsEditingSupplements] = useState(false);

    // Edit state for basic info
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editGender, setEditGender] = useState<Gender>('MALE');
    const [editGoal, setEditGoal] = useState<UserGoal>('aesthetics');

    // Edit state for structural measures
    const [editAltura, setEditAltura] = useState('');
    const [editPunho, setEditPunho] = useState('');
    const [editTornozelo, setEditTornozelo] = useState('');

    useEffect(() => {
        if (profile) {
            setEditName(profile.name || '');
            setEditEmail(profile.email || '');
            setEditGender(profile.gender || 'MALE');
            setEditGoal(profile.goal || 'aesthetics');
            if (profile) {
                setEditAltura(profile.altura?.toString() || '');
                setEditPunho(profile.punho?.toString() || '');
                setEditTornozelo(profile.tornozelo?.toString() || '');
            }
        }
    }, [profile]);

    const handleSaveBasic = () => {
        if (!profile) return;
        updateBasicInfo({
            name: editName,
            email: editEmail,
            gender: editGender,
            goal: editGoal
        });
        setIsEditingBasic(false);
    };

    const handleSaveStructural = () => {
        if (!profile) return;
        updateStructuralMeasures({
            altura: Number(editAltura),
            punho: Number(editPunho),
            tornozelo: Number(editTornozelo)
        });
        setIsEditingStructural(false);
    };

    if (!profile) {
        return (
            <div className="p-6 h-full flex flex-col">
                <EmptyProfile onCreateProfile={() => setIsCreateModalOpen(true)} />
                <CreateProfileModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={(data) => {
                        initializeProfile(data);
                        setIsCreateModalOpen(false);
                    }}
                />
            </div>
        );
    }

    return (
        <div className="flex-1 p-4 md:p-8 pb-20">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">

                {/* Standard Page Header */}
                <div className="flex flex-col animate-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">MEU PERFIL</h2>
                    <p className="text-gray-400 mt-2 font-light">
                        Gerencie suas informações pessoais, medidas e preferências.
                    </p>
                </div>

                <div className="h-px w-full bg-white/10" />

                {/* Profile Header Card */}
                <ProfileHeader profile={profile} />

                {/* Completion Bar */}
                <ProfileCompletionBar
                    completion={profile.profileCompletion}
                    onComplete={() => setIsProfilingModalOpen(true)}
                />

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* 1. BASIC INFO */}
                    <EditableInfoCard
                        title="Dados Básicos"
                        icon={User}
                        isEditing={isEditingBasic}
                        onEdit={() => setIsEditingBasic(true)}
                        onSave={handleSaveBasic}
                        onCancel={() => setIsEditingBasic(false)}
                    >
                        {isEditingBasic ? (
                            <>
                                <EditableInput label="Nome" value={editName} onChange={setEditName} />
                                <EditableInput label="Email" value={editEmail} onChange={setEditEmail} type="email" />
                                <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <span className="text-sm">Gênero</span>
                                    </div>
                                    <select
                                        value={editGender}
                                        onChange={(e) => setEditGender(e.target.value as Gender)}
                                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white w-48 focus:outline-none focus:border-primary/50"
                                    >
                                        <option value="MALE">Masculino</option>
                                        <option value="FEMALE">Feminino</option>
                                        <option value="OTHER">Outro</option>
                                    </select>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <span className="text-sm">Objetivo</span>
                                    </div>
                                    <select
                                        value={editGoal}
                                        onChange={(e) => setEditGoal(e.target.value as UserGoal)}
                                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white w-48 focus:outline-none focus:border-primary/50"
                                    >
                                        <option value="aesthetics">Melhorar proporções</option>
                                        <option value="hypertrophy">Ganhar massa muscular</option>
                                        <option value="definition">Definição / Secar</option>
                                        <option value="health">Saúde geral</option>
                                        <option value="competition">Competição</option>
                                    </select>
                                </div>
                            </>
                        ) : (
                            <>
                                <InfoRow label="Nome" value={profile.name} />
                                <InfoRow label="Idade" value={`${calculateAge(new Date(profile.birthDate))} anos`} icon={Calendar} />
                                <InfoRow label="Sexo" value={profile.gender === 'MALE' ? 'Masculino' : profile.gender === 'FEMALE' ? 'Feminino' : 'Outro'} />
                                <InfoRow label="Objetivo" value={
                                    profile.goal === 'aesthetics' ? 'Melhorar proporções' :
                                        profile.goal === 'hypertrophy' ? 'Ganhar massa' :
                                            profile.goal === 'definition' ? 'Definição' :
                                                profile.goal === 'health' ? 'Saúde' : 'Competição'
                                } />
                            </>
                        )}
                    </EditableInfoCard>

                    {/* 2. STRUCTURAL MEASURES */}
                    <EditableInfoCard
                        title="Medidas Estruturais"
                        icon={Edit3}
                        isEditing={isEditingStructural}
                        onEdit={() => setIsEditingStructural(true)}
                        onSave={handleSaveStructural}
                        onCancel={() => setIsEditingStructural(false)}
                    >
                        {isEditingStructural ? (
                            <>
                                <EditableInput label="Altura (cm)" value={editAltura} onChange={setEditAltura} type="number" />
                                <EditableInput label="Punho (cm)" value={editPunho} onChange={setEditPunho} type="number" />
                                <EditableInput label="Tornozelo (cm)" value={editTornozelo} onChange={setEditTornozelo} type="number" />
                            </>
                        ) : (
                            <>
                                <InfoRow label="Altura" value={`${profile.altura || '-'} cm`} />
                                <InfoRow label="Punho" value={`${profile.punho || '-'} cm`} />
                                <InfoRow label="Tornozelo" value={`${profile.tornozelo || '-'} cm`} />
                            </>
                        )}
                    </EditableInfoCard>

                    {/* --- SUPPLEMENTAL SECTIONS --- */}

                    {/* 1. LIFESTYLE */}
                    {profile.lifestyle && (
                        <EditableInfoCard
                            title="Estilo de Vida"
                            icon={Activity}
                            isEditing={isEditingLifestyle}
                            onEdit={() => setIsEditingLifestyle(true)}
                            onCancel={() => setIsEditingLifestyle(false)}
                            // onSave acts as cancel for the edit mode toggle, actual save happens via form submit
                            // But since we use form attribute on the button, clicking it submits the form.
                            // We need onSave to be undefined or empty if formId is present so it doesn't double trigger?
                            // Actually, if type=submit, onClick still fires. We should probably NOT pass onSave if formId is used, 
                            // or make onSave optional. The button type="submit" will trigger form onSubmit.
                            // The form onSubmit will call handleSaveLifestyle.
                            // To allow the button to just submit, we don't need onSave prop here if we rely on form submission.
                            // However, let's keep it simple: the form submit handler will do the work.
                            formId="lifestyle-form"
                        >
                            {isEditingLifestyle ? (
                                <LifestyleForm
                                    initialData={profile.lifestyle}
                                    onSave={(data) => {
                                        updateLifestyle(data);
                                        setIsEditingLifestyle(false);
                                    }}
                                    formId="lifestyle-form"
                                />
                            ) : (
                                <>
                                    <InfoRow label="Profissão" value={profile.lifestyle.profissao} />
                                    <InfoRow label="Rotina Diária" value={profile.lifestyle.rotinaDiaria.replace('_', ' ')} />
                                    <InfoRow label="Sono" value={`${profile.lifestyle.horasSono}h / noite`} />
                                    <InfoRow label="Estresse" value={profile.lifestyle.nivelEstresse.replace('_', ' ')} />
                                </>
                            )}
                        </EditableInfoCard>
                    )}

                    {/* 2. TRAINING */}
                    {profile.training && (
                        <EditableInfoCard
                            title="Treino"
                            icon={Dumbbell}
                            isEditing={isEditingTraining}
                            onEdit={() => setIsEditingTraining(true)}
                            onCancel={() => setIsEditingTraining(false)}
                            formId="training-form"
                        >
                            {isEditingTraining ? (
                                <TrainingForm
                                    initialData={profile.training}
                                    onSave={(data) => {
                                        updateTraining(data);
                                        setIsEditingTraining(false);
                                    }}
                                    formId="training-form"
                                />
                            ) : (
                                <>
                                    <InfoRow label="Experiência" value={EXPERIENCIA_LABELS[profile.training.tempoTreinando]} />
                                    <InfoRow label="Frequência" value={`${profile.training.frequenciaTreino}x por semana`} />
                                    <InfoRow label="Duração" value={`${profile.training.duracaoTreino} min`} />
                                    <InfoRow label="Local" value={profile.training.localTreino.replace('_', ' ')} />
                                </>
                            )}
                        </EditableInfoCard>
                    )}

                    {/* 3. NUTRITION */}
                    {profile.nutrition && (
                        <EditableInfoCard
                            title="Nutrição"
                            icon={Utensils}
                            isEditing={isEditingNutrition}
                            onEdit={() => setIsEditingNutrition(true)}
                            onCancel={() => setIsEditingNutrition(false)}
                            formId="nutrition-form"
                        >
                            {isEditingNutrition ? (
                                <NutritionForm
                                    initialData={profile.nutrition}
                                    onSave={(data) => {
                                        updateNutrition(data);
                                        setIsEditingNutrition(false);
                                    }}
                                    formId="nutrition-form"
                                />
                            ) : (
                                <>
                                    <InfoRow label="Dieta Atual" value={profile.nutrition.dietaAtual.replace('_', ' ')} />
                                    <InfoRow label="Refeições/dia" value={profile.nutrition.refeicoesdia} />
                                    <InfoRow label="Cozinha?" value={profile.nutrition.cozinha ? 'Sim' : 'Não'} />
                                    <InfoRow label="Alergias" value={profile.nutrition.alergias.length > 0 ? profile.nutrition.alergias.join(', ') : 'Nenhuma'} />
                                </>
                            )}
                        </EditableInfoCard>
                    )}

                    {/* 4. HEALTH */}
                    {profile.health && (
                        <EditableInfoCard
                            title="Saúde"
                            icon={Heart}
                            isEditing={isEditingHealth}
                            onEdit={() => setIsEditingHealth(true)}
                            onCancel={() => setIsEditingHealth(false)}
                            formId="health-form"
                        >
                            {isEditingHealth ? (
                                <HealthForm
                                    initialData={profile.health}
                                    onSave={(data) => {
                                        updateHealth(data);
                                        setIsEditingHealth(false);
                                    }}
                                    formId="health-form"
                                />
                            ) : (
                                <>
                                    <InfoRow label="Condições" value={profile.health.condicoesSaude.length > 0 ? profile.health.condicoesSaude.map(c => c.nome).join(', ') : 'Nenhuma'} />
                                    <InfoRow label="Medicamentos" value={profile.health.medicamentos.length > 0 ? profile.health.medicamentos.map(m => m.nome).join(', ') : 'Nenhum'} />
                                </>
                            )}
                        </EditableInfoCard>
                    )}

                    {/* 5. SUPPLEMENTS */}
                    {profile.supplements && (
                        <EditableInfoCard
                            title="Suplementos"
                            icon={Pill}
                            isEditing={isEditingSupplements}
                            onEdit={() => setIsEditingSupplements(true)}
                            onCancel={() => setIsEditingSupplements(false)}
                            formId="supplements-form"
                        >
                            {isEditingSupplements ? (
                                <SupplementsForm
                                    initialData={profile.supplements}
                                    onSave={(data) => {
                                        updateSupplements(data);
                                        setIsEditingSupplements(false);
                                    }}
                                    formId="supplements-form"
                                />
                            ) : (
                                <>
                                    <InfoRow label="Uso atual" value={profile.supplements.suplementos.length > 0 ? profile.supplements.suplementos.map(s => s.nome).join(', ') : 'Nenhum'} />
                                    <InfoRow label="Ergogênicos" value={profile.supplements.usaErgogenicos ? 'Sim' : 'Não'} />
                                </>
                            )}
                        </EditableInfoCard>
                    )}

                </div>

                {/* Create Profile Modal (for safety, in case state gets reset) */}
                <CreateProfileModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={initializeProfile}
                />

                {/* Progressive Profiling Wizard */}
                <ProgressiveProfilingModal
                    isOpen={isProfilingModalOpen}
                    onClose={() => setIsProfilingModalOpen(false)}
                />
            </div>
        </div>
    );
};
