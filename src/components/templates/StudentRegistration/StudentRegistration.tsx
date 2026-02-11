import React, { useState, useMemo } from 'react';
import { ArrowLeft, ChevronRight, Check, User, Ruler, Activity, Mail, Scale, Layers, GitCommit, Sparkles } from 'lucide-react';
import { Button } from '@/components/atoms/Button/Button';
import { InputField } from '@/components/atoms';
import { supabase } from '@/services/supabase';
import { portalService } from '@/services/portalService';
import { useAuthStore } from '@/stores/authStore';
import { useDataStore } from '@/stores/dataStore';

interface StudentRegistrationProps {
    onBack: () => void;
    onComplete: () => void;
}

type RegistrationStep = 1 | 2 | 3;

interface RegistrationData {
    // Step 1: Basic Info
    name: string;
    email: string;
    phone: string;
    gender: 'MALE' | 'FEMALE';
    birthDate: string;

    // Step 2: Ficha Atlética (Assessment Data)
    weight: string;
    height: string;
    age: string;

    // Trunk & Core
    neck: string;
    shoulders: string;
    chest: string;
    waist: string;
    hips: string;

    // Symmetry (Left/Right)
    leftArm: string; rightArm: string;
    leftForearm: string; rightForearm: string;
    leftWrist: string; rightWrist: string;
    leftThigh: string; rightThigh: string;
    leftKnee: string; rightKnee: string;
    leftCalf: string; rightCalf: string;
    leftAnkle: string; rightAnkle: string;

    // Skinfolds
    subscapular: string;
    tricipital: string;
    chestSkinfold: string;
    axillary: string;
    suprailiac: string;
    abdominal: string;
    thighSkinfold: string;

    // Category
    category: 'GOLDEN_RATIO' | 'CLASSIC_PHYSIQUE' | 'MENS_PHYSIQUE' | 'WELLNESS';

    // Step 3: Access
    sendInviteEmail: boolean;
    generateTempCredentials: boolean;
}

const initialData: RegistrationData = {
    name: '',
    email: '',
    phone: '',
    gender: 'MALE',
    birthDate: '',
    weight: '',
    height: '',
    age: '',
    neck: '',
    shoulders: '',
    chest: '',
    waist: '',
    hips: '',
    leftArm: '', rightArm: '',
    leftForearm: '', rightForearm: '',
    leftWrist: '', rightWrist: '',
    leftThigh: '', rightThigh: '',
    leftKnee: '', rightKnee: '',
    leftCalf: '', rightCalf: '',
    leftAnkle: '', rightAnkle: '',
    subscapular: '',
    tricipital: '',
    chestSkinfold: '',
    axillary: '',
    suprailiac: '',
    abdominal: '',
    thighSkinfold: '',
    category: 'GOLDEN_RATIO',
    sendInviteEmail: true,
    generateTempCredentials: false,
};

const SymmetryRow: React.FC<{
    label: string,
    leftValue: string,
    rightValue: string,
    onLeftChange: (val: string) => void,
    onRightChange: (val: string) => void
}> = ({ label, leftValue, rightValue, onLeftChange, onRightChange }) => (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
        <div className="relative">
            <input
                type="number"
                value={leftValue}
                onChange={(e) => onLeftChange(e.target.value)}
                className="w-full bg-[#0A0F1C] border border-white/10 rounded-lg px-4 py-2.5 text-right text-white placeholder-gray-700 focus:border-primary/50 focus:outline-none text-sm font-mono"
                placeholder="00.0"
            />
        </div>
        <span className="text-gray-400 text-sm font-medium w-32 text-center">{label}</span>
        <div className="relative">
            <input
                type="number"
                value={rightValue}
                onChange={(e) => onRightChange(e.target.value)}
                className="w-full bg-[#0A0F1C] border border-white/10 rounded-lg px-4 py-2.5 text-left text-white placeholder-gray-700 focus:border-primary/50 focus:outline-none text-sm font-mono"
                placeholder="00.0"
            />
        </div>
    </div>
);

export const StudentRegistration: React.FC<StudentRegistrationProps> = ({ onBack, onComplete }) => {
    const [step, setStep] = useState<RegistrationStep>(1);
    const [formData, setFormData] = useState<RegistrationData>(initialData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [portalLink, setPortalLink] = useState<string | null>(null);
    const [linkCopied, setLinkCopied] = useState(false);

    const { entity } = useAuthStore();
    const { loadFromSupabase } = useDataStore();

    const handleInputChange = (field: keyof RegistrationData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (step < 3) setStep((prev) => (prev + 1) as RegistrationStep);
    };

    const handlePrev = () => {
        if (step > 1) setStep((prev) => (prev - 1) as RegistrationStep);
        else onBack();
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitError(null);

        const personalId = entity.personal?.id;
        if (!personalId) {
            setSubmitError('Personal não identificado. Relogue e tente novamente.');
            setIsSubmitting(false);
            return;
        }

        try {
            console.info('[Cadastro] Criando atleta no Supabase...');

            // 1. Inserir atleta (trigger auto-cria ficha)
            const { data: atleta, error: atletaError } = await supabase
                .from('atletas')
                .insert({
                    personal_id: personalId,
                    academia_id: entity.personal?.academia_id || null,
                    nome: formData.name,
                    email: formData.email || null,
                    telefone: formData.phone || null,
                    status: 'ATIVO',
                } as any)
                .select()
                .single();

            if (atletaError) throw new Error(`Erro ao criar atleta: ${atletaError.message}`);
            console.info('[Cadastro] ✅ Atleta criado:', atleta.id);

            // 2. Atualizar ficha (auto-criada pelo trigger)
            const sexo = formData.gender === 'MALE' ? 'M' : 'F';
            const { error: fichaError } = await supabase
                .from('fichas')
                .update({
                    sexo,
                    data_nascimento: formData.birthDate || null,
                    altura: parseFloat(formData.height) || null,
                    punho: parseFloat(formData.leftWrist) || null,
                    tornozelo: parseFloat(formData.leftAnkle) || null,
                    joelho: parseFloat(formData.leftKnee) || null,
                    pelve: parseFloat(formData.hips) || null,
                    objetivo: 'HIPERTROFIA',
                } as any)
                .eq('atleta_id', atleta.id);

            if (fichaError) console.warn('[Cadastro] Aviso ficha:', fichaError.message);
            else console.info('[Cadastro] ✅ Ficha atualizada');

            // 3. Inserir medidas (se preenchidas)
            const hasMeasurements = formData.weight || formData.shoulders || formData.chest;
            if (hasMeasurements) {
                const { error: medidaError } = await supabase
                    .from('medidas')
                    .insert({
                        atleta_id: atleta.id,
                        data: new Date().toISOString().split('T')[0],
                        peso: parseFloat(formData.weight) || null,
                        pescoco: parseFloat(formData.neck) || null,
                        ombros: parseFloat(formData.shoulders) || null,
                        peitoral: parseFloat(formData.chest) || null,
                        cintura: parseFloat(formData.waist) || null,
                        quadril: parseFloat(formData.hips) || null,
                        braco_direito: parseFloat(formData.rightArm) || null,
                        braco_esquerdo: parseFloat(formData.leftArm) || null,
                        antebraco_direito: parseFloat(formData.rightForearm) || null,
                        antebraco_esquerdo: parseFloat(formData.leftForearm) || null,
                        coxa_direita: parseFloat(formData.rightThigh) || null,
                        coxa_esquerda: parseFloat(formData.leftThigh) || null,
                        panturrilha_direita: parseFloat(formData.rightCalf) || null,
                        panturrilha_esquerda: parseFloat(formData.leftCalf) || null,
                        registrado_por: 'PERSONAL',
                        personal_id: personalId,
                    } as any);

                if (medidaError) console.warn('[Cadastro] Aviso medidas:', medidaError.message);
                else console.info('[Cadastro] ✅ Medidas inseridas');
            }

            // 4. Gerar portal token se enviar convite
            if (formData.sendInviteEmail) {
                try {
                    const { url } = await portalService.generateToken(atleta.id);
                    console.info('[Cadastro] ✅ Portal token gerado:', url);
                    setPortalLink(url);
                } catch (tokenErr) {
                    console.warn('[Cadastro] Aviso token:', tokenErr);
                }
            }

            // 5. Recarregar dados no store
            await loadFromSupabase(personalId);
            console.info('[Cadastro] ✅ Store atualizado — novo atleta visível!');

            setIsSubmitting(false);

            // Se gerou link de convite, mostra tela de sucesso
            // Senão, volta pra lista
            if (!formData.sendInviteEmail) {
                onComplete();
            } else {
                setStep(3); // Ficamos no step 3 mas mostramos a tela de sucesso via portalLink
            }
        } catch (err: any) {
            console.error('[Cadastro] ❌ Erro:', err);
            setSubmitError(err.message || 'Erro ao cadastrar aluno.');
            setIsSubmitting(false);
        }
    };

    // Derived age logic
    useMemo(() => {
        if (formData.birthDate && step === 1) {
            const birth = new Date(formData.birthDate);
            const now = new Date();
            let age = now.getFullYear() - birth.getFullYear();
            const m = now.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
                age--;
            }
            if (age > 0) handleInputChange('age', age.toString());
        }
    }, [formData.birthDate, step]);

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center mb-12">
            <div className="flex items-center w-full max-w-2xl px-4">
                {/* Step 1 */}
                <div className={`flex flex-col items-center relative z-10 ${step >= 1 ? 'text-primary' : 'text-gray-600'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition-all ${step >= 1 ? 'bg-primary text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-[#1A2234] border border-white/10'
                        }`}>
                        {step > 1 ? <Check size={20} /> : '1'}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">Cadastro</span>
                </div>

                {/* Connector 1-2 */}
                <div className={`flex-1 h-0.5 mx-4 transition-all duration-500 ${step >= 2 ? 'bg-primary' : 'bg-white/10'}`} />

                {/* Step 2 */}
                <div className={`flex flex-col items-center relative z-10 ${step >= 2 ? 'text-primary' : 'text-gray-600'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition-all ${step >= 2 ? 'bg-primary text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-[#1A2234] border border-white/10'
                        }`}>
                        {step > 2 ? <Check size={20} /> : '2'}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap">Ficha Atlética</span>
                </div>

                {/* Connector 2-3 */}
                <div className={`flex-1 h-0.5 mx-4 transition-all duration-500 ${step >= 3 ? 'bg-primary' : 'bg-white/10'}`} />

                {/* Step 3 */}
                <div className={`flex flex-col items-center relative z-10 ${step >= 3 ? 'text-primary' : 'text-gray-600'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition-all ${step >= 3 ? 'bg-primary text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-[#1A2234] border border-white/10'
                        }`}>
                        3
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">Convite</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-dark animate-fade-in">
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-white/5 bg-[#0A0F1C]/50 sticky top-0 z-20 backdrop-blur-md">
                <div className="max-w-7xl mx-auto flex items-center gap-4 w-full">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Cadastro de Aluno</h1>
                        <p className="text-gray-400 text-sm">Registro completo de perfil e medidas antropométricas.</p>
                    </div>
                </div>
            </div>

            {/* Main scrollable content area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-7xl mx-auto p-6 md:p-8 flex flex-col">
                    {renderStepIndicator()}

                    {/* Form Container */}
                    <div className="bg-[#131B2C] border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden flex flex-col w-full">

                        {/* Step 1: Basic Info */}
                        {step === 1 && (
                            <div className="space-y-10 animate-fade-in w-full">
                                <div className="flex items-center gap-3 mb-2 pb-4 border-b border-white/5">
                                    <User className="text-primary" size={20} />
                                    <h2 className="text-xl font-bold text-white uppercase tracking-wide">DADOS PESSOAIS</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-300 uppercase tracking-widest">Nome Completo *</label>
                                        <input
                                            type="text"
                                            className="w-full bg-[#0A0F1C] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-700"
                                            placeholder="Ex: Maria Oliveira Santos"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-300 uppercase tracking-widest">Data de Nascimento *</label>
                                        <input
                                            type="date"
                                            className="w-full bg-[#0A0F1C] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all calendar-picker-indicator-white"
                                            value={formData.birthDate}
                                            onChange={(e) => handleInputChange('birthDate', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-300 uppercase tracking-widest">Gênero *</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                className={`flex items-center justify-center gap-2 py-3 rounded-lg border transition-all font-bold text-sm uppercase tracking-wide ${formData.gender === 'MALE'
                                                    ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                                                    : 'bg-[#0A0F1C] border-white/10 text-gray-500 hover:bg-white/5'
                                                    }`}
                                                onClick={() => handleInputChange('gender', 'MALE')}
                                            >
                                                ♂ Masculino
                                            </button>
                                            <button
                                                className={`flex items-center justify-center gap-2 py-3 rounded-lg border transition-all font-bold text-sm uppercase tracking-wide ${formData.gender === 'FEMALE'
                                                    ? 'bg-pink-500/20 border-pink-500 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.2)]'
                                                    : 'bg-[#0A0F1C] border-white/10 text-gray-500 hover:bg-white/5'
                                                    }`}
                                                onClick={() => handleInputChange('gender', 'FEMALE')}
                                            >
                                                ♀ Feminino
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-300 uppercase tracking-widest">Email</label>
                                        <input
                                            type="email"
                                            className="w-full bg-[#0A0F1C] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-700"
                                            placeholder="atleta@dominio.com"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-300 uppercase tracking-widest">Telefone / WhatsApp</label>
                                        <input
                                            type="tel"
                                            className="w-full bg-[#0A0F1C] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-700"
                                            placeholder="(00) 00000-0000"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Ficha Atlética (Assessment Layout) */}
                        {step === 2 && (
                            <div className="space-y-10 animate-fade-in w-full">
                                <div className="flex items-center justify-between mb-2 pb-4 border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <Activity className="text-primary" size={20} />
                                        <h2 className="text-xl font-bold text-white uppercase tracking-wide">FICHA ATLÉTICA</h2>
                                    </div>
                                    <span className="px-3 py-1 rounded border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold tracking-widest">
                                        PRIMEIRA AVALIAÇÃO
                                    </span>
                                </div>

                                {/* Basics Section */}
                                <div className="space-y-6">
                                    <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                        <Scale size={14} /> Básico
                                    </h3>
                                    <div className="h-[1px] w-full bg-white/5"></div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <InputField
                                            label="Peso"
                                            unit="kg"
                                            placeholder="00.0"
                                            value={formData.weight}
                                            onChange={(e) => handleInputChange('weight', e.target.value)}
                                        />
                                        <InputField
                                            label="Altura"
                                            unit="cm"
                                            placeholder="000"
                                            value={formData.height}
                                            onChange={(e) => handleInputChange('height', e.target.value)}
                                        />
                                        <InputField
                                            label="Idade"
                                            unit="anos"
                                            placeholder="00"
                                            value={formData.age}
                                            onChange={(e) => handleInputChange('age', e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Measures Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {/* Trunk */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest">Tronco</h3>
                                        <div className="h-[1px] w-full bg-white/5"></div>
                                        <div className="space-y-4">
                                            <InputField label="Pescoço" unit="cm" value={formData.neck} onChange={(e) => handleInputChange('neck', e.target.value)} />
                                            <InputField label="Ombros" unit="cm" value={formData.shoulders} onChange={(e) => handleInputChange('shoulders', e.target.value)} />
                                            <InputField label="Peitoral" unit="cm" value={formData.chest} onChange={(e) => handleInputChange('chest', e.target.value)} />
                                        </div>
                                    </div>

                                    {/* Core */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                            <Layers size={14} /> Core
                                        </h3>
                                        <div className="h-[1px] w-full bg-white/5"></div>
                                        <div className="space-y-4">
                                            <InputField label="Cintura" unit="cm" value={formData.waist} onChange={(e) => handleInputChange('waist', e.target.value)} />
                                            <InputField label="Quadril" unit="cm" value={formData.hips} onChange={(e) => handleInputChange('hips', e.target.value)} />
                                        </div>
                                    </div>
                                </div>

                                {/* Symmetry Table */}
                                <div className="space-y-6">
                                    <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                        <GitCommit size={14} /> Simetria de Membros
                                    </h3>
                                    <div className="bg-[#0A0F1C]/50 rounded-xl p-6 border border-white/5">
                                        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 mb-4 px-1">
                                            <span className="text-[10px] font-bold text-primary uppercase text-right">Esquerda (cm)</span>
                                            <span className="text-[10px] font-bold text-gray-500 uppercase text-center w-32">Região</span>
                                            <span className="text-[10px] font-bold text-primary uppercase text-left">Direita (cm)</span>
                                        </div>

                                        <div className="space-y-3">
                                            <SymmetryRow
                                                label="Braço"
                                                leftValue={formData.leftArm}
                                                rightValue={formData.rightArm}
                                                onLeftChange={(v) => handleInputChange('leftArm', v)}
                                                onRightChange={(v) => handleInputChange('rightArm', v)}
                                            />
                                            <SymmetryRow
                                                label="Antebraço"
                                                leftValue={formData.leftForearm}
                                                rightValue={formData.rightForearm}
                                                onLeftChange={(v) => handleInputChange('leftForearm', v)}
                                                onRightChange={(v) => handleInputChange('rightForearm', v)}
                                            />
                                            <SymmetryRow
                                                label="Punho"
                                                leftValue={formData.leftWrist}
                                                rightValue={formData.rightWrist}
                                                onLeftChange={(v) => handleInputChange('leftWrist', v)}
                                                onRightChange={(v) => handleInputChange('rightWrist', v)}
                                            />
                                            <SymmetryRow
                                                label="Coxa"
                                                leftValue={formData.leftThigh}
                                                rightValue={formData.rightThigh}
                                                onLeftChange={(v) => handleInputChange('leftThigh', v)}
                                                onRightChange={(v) => handleInputChange('rightThigh', v)}
                                            />
                                            <SymmetryRow
                                                label="Joelho"
                                                leftValue={formData.leftKnee}
                                                rightValue={formData.rightKnee}
                                                onLeftChange={(v) => handleInputChange('leftKnee', v)}
                                                onRightChange={(v) => handleInputChange('rightKnee', v)}
                                            />
                                            <SymmetryRow
                                                label="Panturrilha"
                                                leftValue={formData.leftCalf}
                                                rightValue={formData.rightCalf}
                                                onLeftChange={(v) => handleInputChange('leftCalf', v)}
                                                onRightChange={(v) => handleInputChange('rightCalf', v)}
                                            />
                                            <SymmetryRow
                                                label="Tornozelo"
                                                leftValue={formData.leftAnkle}
                                                rightValue={formData.rightAnkle}
                                                onLeftChange={(v) => handleInputChange('leftAnkle', v)}
                                                onRightChange={(v) => handleInputChange('rightAnkle', v)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Skinfolds Grid */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                            <Ruler size={14} /> Protocolo 7 Dobras
                                        </h3>
                                        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Unidade: MM</span>
                                    </div>
                                    <div className="h-[1px] w-full bg-white/5"></div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                                        <InputField label="Subescap." placeholder="0" value={formData.subscapular} onChange={(e) => handleInputChange('subscapular', e.target.value)} />
                                        <InputField label="Tricipital" placeholder="0" value={formData.tricipital} onChange={(e) => handleInputChange('tricipital', e.target.value)} />
                                        <InputField label="Peitoral" placeholder="0" value={formData.chestSkinfold} onChange={(e) => handleInputChange('chestSkinfold', e.target.value)} />
                                        <InputField label="Axilar M." placeholder="0" value={formData.axillary} onChange={(e) => handleInputChange('axillary', e.target.value)} />
                                        <InputField label="Supra-ilíaca" placeholder="0" value={formData.suprailiac} onChange={(e) => handleInputChange('suprailiac', e.target.value)} />
                                        <InputField label="Abdominal" placeholder="0" value={formData.abdominal} onChange={(e) => handleInputChange('abdominal', e.target.value)} />
                                        <InputField label="Coxa" placeholder="0" value={formData.thighSkinfold} onChange={(e) => handleInputChange('thighSkinfold', e.target.value)} />
                                    </div>
                                </div>

                                {/* Category Selector */}
                                <div className="pt-6 border-t border-white/5">
                                    <label className="text-xs font-bold text-gray-300 uppercase tracking-widest block mb-4">Categoria de Referência</label>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        {[
                                            { id: 'GOLDEN_RATIO', label: 'Golden Ratio', icon: '🏛️' },
                                            { id: 'CLASSIC_PHYSIQUE', label: 'Classic Physique', icon: '💪' },
                                            { id: 'MENS_PHYSIQUE', label: "Men's Physique", icon: '👕' },
                                            { id: 'WELLNESS', label: 'Wellness', icon: '🍑' },
                                        ].map((cat) => (
                                            <button
                                                key={cat.id}
                                                className={`p-4 rounded-xl border text-left transition-all ${formData.category === cat.id
                                                    ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                                                    : 'bg-[#0A0F1C] border-white/10 text-gray-500 hover:bg-white/5'
                                                    }`}
                                                onClick={() => handleInputChange('category', cat.id)}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-2xl">{cat.icon}</span>
                                                    {formData.category === cat.id && <Check size={16} className="text-primary" />}
                                                </div>
                                                <span className={`font-bold text-xs uppercase tracking-wide ${formData.category === cat.id ? 'text-white' : 'text-gray-500'}`}>
                                                    {cat.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Access or Success */}
                        {step === 3 && (
                            portalLink ? (
                                /* ===== SUCCESS SCREEN WITH INVITE LINK ===== */
                                <div className="space-y-8 animate-fade-in w-full">
                                    <div className="text-center space-y-4">
                                        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                                            <Check className="text-emerald-400" size={36} strokeWidth={3} />
                                        </div>
                                        <h2 className="text-2xl font-black text-white uppercase tracking-wide">
                                            CADASTRO REALIZADO!
                                        </h2>
                                        <p className="text-gray-400 text-sm max-w-md mx-auto">
                                            <span className="text-white font-bold">{formData.name}</span> foi cadastrado(a) com sucesso.
                                            Envie o link abaixo para que o aluno acesse o portal e registre suas próprias medidas.
                                        </p>
                                    </div>

                                    {/* Link Box */}
                                    <div className="p-6 bg-[#0A0F1C] border border-primary/30 rounded-2xl space-y-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Mail className="text-primary" size={16} />
                                            <span className="text-xs font-bold text-primary uppercase tracking-wider">Link de Convite</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                readOnly
                                                value={portalLink}
                                                className="flex-1 bg-[#060B18] border border-white/10 rounded-lg px-4 py-3 text-white text-xs font-mono truncate"
                                            />
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(portalLink);
                                                    setLinkCopied(true);
                                                    setTimeout(() => setLinkCopied(false), 2000);
                                                }}
                                                className={`px-5 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${linkCopied
                                                    ? 'bg-emerald-500 text-white'
                                                    : 'bg-primary hover:bg-primary/80 text-[#0A0F1C]'
                                                    }`}
                                            >
                                                {linkCopied ? '✓ Copiado!' : 'Copiar'}
                                            </button>
                                        </div>

                                        {/* Share buttons */}
                                        <div className="flex items-center gap-3 pt-2">
                                            <a
                                                href={`https://wa.me/?text=${encodeURIComponent(`Olá ${formData.name}! 🏋️\n\nSeu cadastro na VITRU IA foi realizado.\nAcesse o link abaixo para registrar suas medidas:\n\n${portalLink}`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 border border-emerald-600/30 rounded-lg text-emerald-400 hover:bg-emerald-600/30 transition-all text-xs font-bold"
                                            >
                                                📱 WhatsApp
                                            </a>
                                            {formData.email && (
                                                <a
                                                    href={`mailto:${formData.email}?subject=Acesso VITRU IA&body=${encodeURIComponent(`Olá ${formData.name}!\n\nSeu cadastro na VITRU IA foi realizado.\nAcesse o link abaixo para registrar suas medidas:\n\n${portalLink}`)}`}
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-all text-xs font-bold"
                                                >
                                                    ✉️ Email
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-start gap-3">
                                        <Sparkles className="text-primary mt-0.5" size={16} />
                                        <p className="text-xs text-gray-400 leading-relaxed">
                                            O link é válido por <span className="text-white font-bold">30 dias</span>. O aluno poderá registrar medidas e acompanhar seu progresso pelo portal.
                                        </p>
                                    </div>

                                    <button
                                        onClick={onComplete}
                                        className="w-full flex items-center justify-center gap-3 px-10 py-4 rounded-xl font-bold text-sm uppercase tracking-widest bg-primary hover:bg-primary/90 text-[#0A0F1C] transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                                    >
                                        Voltar para Meus Alunos
                                    </button>
                                </div>
                            ) : (
                                /* ===== NORMAL STEP 3: ACCESS OPTIONS ===== */
                                <div className="space-y-10 animate-fade-in w-full">
                                    <div className="flex items-center gap-3 mb-2 pb-4 border-b border-white/5">
                                        <Mail className="text-primary" size={20} />
                                        <h2 className="text-xl font-bold text-white uppercase tracking-wide">ACESSO DO ALUNO</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <label className={`flex items-start gap-4 p-6 rounded-2xl border cursor-pointer transition-all ${formData.sendInviteEmail ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'bg-[#0A0F1C] border-white/10 hover:bg-white/5'}`}
                                            onClick={() => {
                                                handleInputChange('sendInviteEmail', true);
                                                handleInputChange('generateTempCredentials', false);
                                            }}>
                                            <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.sendInviteEmail ? 'border-primary bg-primary text-[#0A0F1C]' : 'border-gray-700'}`}>
                                                {formData.sendInviteEmail && <Check size={14} strokeWidth={3} />}
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-white font-bold block text-sm uppercase tracking-wider">Gerar Link de Convite</span>
                                                <span className="text-gray-500 text-xs leading-relaxed">O aluno receberá um link para acessar o portal e registrar suas medidas.</span>
                                            </div>
                                        </label>

                                        <label className={`flex items-start gap-4 p-6 rounded-2xl border cursor-pointer transition-all ${formData.generateTempCredentials ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'bg-[#0A0F1C] border-white/10 hover:bg-white/5'}`}
                                            onClick={() => {
                                                handleInputChange('sendInviteEmail', false);
                                                handleInputChange('generateTempCredentials', true);
                                            }}>
                                            <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.generateTempCredentials ? 'border-primary bg-primary text-[#0A0F1C]' : 'border-gray-700'}`}>
                                                {formData.generateTempCredentials && <Check size={14} strokeWidth={3} />}
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-white font-bold block text-sm uppercase tracking-wider">Cadastro Sem Convite</span>
                                                <span className="text-gray-500 text-xs leading-relaxed">Cadastra o aluno sem gerar link. As medidas deverão ser inseridas pelo personal.</span>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl flex items-start gap-4">
                                        <Sparkles className="text-primary mt-1" size={20} />
                                        <p className="text-sm text-gray-400 leading-relaxed">
                                            Ao finalizar o cadastro, os dados da <span className="text-white font-bold">Ficha Atlética</span> serão processados pela <span className="text-primary font-bold tracking-widest italic">VITRU IA</span> para gerar o Score inicial do atleta.
                                        </p>
                                    </div>
                                </div>
                            )
                        )}

                        {/* Error Display */}
                        {submitError && (
                            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                                ❌ {submitError}
                            </div>
                        )}

                        {/* Actions (hidden on success screen) */}
                        {!portalLink && (
                            <div className="mt-12 flex items-center justify-between pt-8 border-t border-white/10">
                                {step > 1 ? (
                                    <button
                                        onClick={handlePrev}
                                        className="px-8 py-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all border border-white/5"
                                    >
                                        Voltar
                                    </button>
                                ) : (
                                    <div></div>
                                )}

                                <button
                                    onClick={step === 3 ? handleSubmit : handleNext}
                                    disabled={isSubmitting}
                                    className={`flex items-center gap-3 px-10 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all transform active:scale-[0.98] ${isSubmitting
                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                        : 'bg-primary hover:bg-primary/90 text-[#0A0F1C] shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:scale-[1.02]'
                                        }`}
                                >
                                    {isSubmitting ? 'Salvando...' : step === 3 ? 'Finalizar Cadastro' : 'Próximo Passo'}
                                    {!isSubmitting && step < 3 && <ChevronRight size={18} strokeWidth={3} />}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
