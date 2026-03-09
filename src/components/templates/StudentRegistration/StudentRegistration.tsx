import React, { useState } from 'react';
import { ArrowLeft, Check, User, Mail, Sparkles, UserPlus, Activity, KeyRound, Copy } from 'lucide-react';
import { supabase } from '@/services/supabase';
import { useAuthStore } from '@/stores/authStore';
import { useDataStore } from '@/stores/dataStore';

const DEFAULT_ATHLETE_PASSWORD = 'Shape2026!';

interface StudentRegistrationProps {
    onBack: () => void;
    onComplete: (atletaId?: string) => void;
}

interface RegistrationData {
    name: string;
    email: string;
    phone: string;
    gender: 'MALE' | 'FEMALE';
    sendInvite: boolean;
}

const initialData: RegistrationData = {
    name: '',
    email: '',
    phone: '',
    gender: 'MALE',
    sendInvite: false,
};

export const StudentRegistration: React.FC<StudentRegistrationProps> = ({ onBack, onComplete }) => {
    const [formData, setFormData] = useState<RegistrationData>(initialData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [loginLink, setLoginLink] = useState<string | null>(null);
    const [linkCopied, setLinkCopied] = useState(false);
    const [createdAtletaId, setCreatedAtletaId] = useState<string | null>(null);
    const [athleteEmail, setAthleteEmail] = useState<string | null>(null);

    const { entity } = useAuthStore();
    const { loadFromSupabase } = useDataStore();

    const handleInputChange = (field: keyof RegistrationData, value: string | number | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const isFormValid = formData.name.trim().length >= 2 && formData.gender;

    const handleSubmit = async () => {
        if (!isFormValid) return;

        setIsSubmitting(true);
        setSubmitError(null);

        const personalId = entity.personal?.id;
        if (!personalId) {
            setSubmitError('Personal não identificado. Relogue e tente novamente.');
            setIsSubmitting(false);
            return;
        }

        try {
            console.info('[Cadastro Rápido] Criando atleta no Supabase...');

            // 1. Inserir atleta (trigger auto-cria ficha)
            const { data: atleta, error: atletaError } = await supabase
                .from('atletas')
                .insert({
                    personal_id: personalId,
                    academia_id: entity.personal?.academia_id || null,
                    nome: formData.name.trim(),
                    email: formData.email.trim() || null,
                    telefone: formData.phone.trim() || null,
                    status: 'ATIVO',
                } as Record<string, unknown>)
                .select()
                .single();

            if (atletaError) throw new Error(`Erro ao criar atleta: ${atletaError.message}`);
            console.info('[Cadastro Rápido] ✅ Atleta criado:', atleta.id);

            // 2. Atualizar ficha (auto-criada pelo trigger)
            const sexo = formData.gender === 'MALE' ? 'M' : 'F';

            const { error: fichaError } = await supabase
                .from('fichas')
                .update({
                    sexo,
                    objetivo: 'HIPERTROFIA',
                    objetivo_vitruvio: 'RECOMP',
                } as Record<string, unknown>)
                .eq('atleta_id', atleta.id);

            if (fichaError) console.warn('[Cadastro Rápido] Aviso ficha:', fichaError.message);
            else console.info('[Cadastro Rápido] ✅ Ficha atualizada');

            // 3. Criar conta de acesso ao Portal se o aluno tem email
            const athleteEmailTrimmed = formData.email.trim();
            if (formData.sendInvite && athleteEmailTrimmed) {
                try {
                    console.info('[Cadastro Rápido] Criando conta Auth para o aluno...');

                    // Salvar sessão do Personal
                    const { data: { session: personalSession } } = await supabase.auth.getSession();

                    // Criar conta do aluno via signUp
                    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                        email: athleteEmailTrimmed,
                        password: DEFAULT_ATHLETE_PASSWORD,
                        options: {
                            data: {
                                full_name: formData.name.trim(),
                                role: 'ATLETA',
                            },
                        },
                    });

                    // Restaurar sessão do Personal IMEDIATAMENTE
                    if (personalSession) {
                        await supabase.auth.setSession({
                            access_token: personalSession.access_token,
                            refresh_token: personalSession.refresh_token,
                        });
                        console.info('[Cadastro Rápido] ✅ Sessão do Personal restaurada');
                    }

                    if (signUpError) {
                        console.warn('[Cadastro Rápido] Aviso ao criar conta:', signUpError.message);
                    } else if (signUpData.user) {
                        // Vincular auth_user_id ao atleta
                        await supabase
                            .from('atletas')
                            .update({ auth_user_id: signUpData.user.id } as Record<string, unknown>)
                            .eq('id', atleta.id);

                        console.info('[Cadastro Rápido] ✅ Conta Auth criada e vinculada:', signUpData.user.id);

                        // Gerar link de login com credenciais pré-preenchidas
                        const baseUrl = window.location.origin;
                        const loginUrl = `${baseUrl}/atleta?email=${encodeURIComponent(athleteEmailTrimmed)}&p=${encodeURIComponent(DEFAULT_ATHLETE_PASSWORD)}`;
                        setLoginLink(loginUrl);
                        setAthleteEmail(athleteEmailTrimmed);
                    }
                } catch (tokenErr) {
                    console.warn('[Cadastro Rápido] Aviso ao criar conta:', tokenErr);
                    // Restaurar sessão do Personal em caso de erro
                    const { data: { session: fallbackSession } } = await supabase.auth.getSession();
                    if (!fallbackSession) {
                        console.error('[Cadastro Rápido] ❌ Sessão do Personal perdida! Recarregue a página.');
                    }
                }
            }

            // 4. Recarregar dados no store
            await loadFromSupabase(personalId);
            console.info('[Cadastro Rápido] ✅ Store atualizado — novo atleta visível!');

            setCreatedAtletaId(atleta.id);
            setIsSubmitting(false);

        } catch (err: unknown) {
            console.error('[Cadastro Rápido] ❌ Erro:', err);
            setSubmitError(err instanceof Error ? err.message : 'Erro ao cadastrar aluno.');
            setIsSubmitting(false);
        }
    };

    // ===== SUCCESS SCREEN =====
    if (createdAtletaId) {
        return (
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-dark animate-fade-in">
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-white/5 bg-background-dark/50 sticky top-0 z-20 backdrop-blur-md">
                    <div className="max-w-3xl mx-auto flex items-center gap-4 w-full">
                        <button
                            onClick={() => onComplete()}
                            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Cadastro Realizado</h1>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="max-w-3xl mx-auto p-6 md:p-8">
                        <div className="bg-surface border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl space-y-8">
                            {/* Success Icon */}
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto animate-fade-in-up">
                                    <Check className="text-emerald-400" size={36} strokeWidth={3} />
                                </div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-wide">
                                    Aluno Cadastrado!
                                </h2>
                                <p className="text-gray-400 text-sm max-w-md mx-auto">
                                    <span className="text-white font-bold">{formData.name}</span> foi cadastrado(a) com sucesso.
                                    Agora você pode realizar a primeira avaliação IA.
                                </p>
                            </div>

                            {/* Login Credentials (if account created) */}
                            {loginLink && athleteEmail && (
                                <div className="p-6 bg-background-dark border border-indigo-500/30 rounded-2xl space-y-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <KeyRound className="text-indigo-400" size={16} />
                                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Acesso ao Portal do Aluno</span>
                                    </div>

                                    {/* Credentials */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-lg border border-white/5">
                                            <Mail size={14} className="text-gray-500" />
                                            <div className="flex-1">
                                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">Email</span>
                                                <p className="text-white text-sm font-mono">{athleteEmail}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-lg border border-white/5">
                                            <KeyRound size={14} className="text-gray-500" />
                                            <div className="flex-1">
                                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">Senha</span>
                                                <p className="text-white text-sm font-mono">{DEFAULT_ATHLETE_PASSWORD}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Login Link */}
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            readOnly
                                            value={loginLink}
                                            className="flex-1 bg-background-dark border border-white/10 rounded-lg px-4 py-3 text-white text-xs font-mono truncate"
                                        />
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(loginLink);
                                                setLinkCopied(true);
                                                setTimeout(() => setLinkCopied(false), 2000);
                                            }}
                                            className={`px-5 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1 ${linkCopied
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                                                }`}
                                        >
                                            <Copy size={12} />
                                            {linkCopied ? 'Copiado!' : 'Copiar'}
                                        </button>
                                    </div>

                                    {/* Share buttons */}
                                    <div className="flex items-center gap-3 pt-2">
                                        <a
                                            href={`https://wa.me/?text=${encodeURIComponent(`Olá ${formData.name}! 🏋️\n\nSeu acesso ao Portal VITRU IA foi criado!\n\n📧 Email: ${athleteEmail}\n🔑 Senha: ${DEFAULT_ATHLETE_PASSWORD}\n\nAcesse aqui:\n${loginLink}`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 border border-emerald-600/30 rounded-lg text-emerald-400 hover:bg-emerald-600/30 transition-all text-xs font-bold"
                                        >
                                            📱 WhatsApp
                                        </a>
                                        <a
                                            href={`mailto:${athleteEmail}?subject=Acesso VITRU IA&body=${encodeURIComponent(`Olá ${formData.name}!\n\nSeu acesso ao Portal VITRU IA foi criado!\n\nEmail: ${athleteEmail}\nSenha: ${DEFAULT_ATHLETE_PASSWORD}\n\nAcesse aqui: ${loginLink}`)}`}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-all text-xs font-bold"
                                        >
                                            ✉️ Email
                                        </a>
                                    </div>

                                    <div className="p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-xl flex items-start gap-3">
                                        <Sparkles className="text-indigo-400 mt-0.5" size={14} />
                                        <p className="text-xs text-gray-400 leading-relaxed">
                                            O aluno pode alterar a senha a qualquer momento pelo <span className="text-white font-bold">"Esqueci minha senha"</span> na tela de login.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button
                                    onClick={() => onComplete(createdAtletaId)}
                                    className="flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest bg-primary hover:bg-primary/90 text-black transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
                                >
                                    <Activity size={18} strokeWidth={2.5} />
                                    Realizar Avaliação IA
                                </button>

                                <button
                                    onClick={() => onComplete()}
                                    className="flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all"
                                >
                                    Voltar para Meus Alunos
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ===== REGISTRATION FORM =====
    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-dark animate-fade-in">
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-white/5 bg-background-dark/50 sticky top-0 z-20 backdrop-blur-md">
                <div className="max-w-3xl mx-auto flex items-center gap-4 w-full">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Cadastro Rápido de Aluno</h1>
                        <p className="text-gray-400 text-sm">Registre os dados básicos. As medidas serão coletadas na Avaliação IA.</p>
                    </div>
                </div>
            </div>

            {/* Main scrollable content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-3xl mx-auto p-6 md:p-8">
                    <div className="bg-surface border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden">

                        {/* Section: Dados Pessoais */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 mb-2 pb-4 border-b border-white/5">
                                <UserPlus className="text-primary" size={20} />
                                <h2 className="text-xl font-bold text-white uppercase tracking-wide">Dados do Aluno</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nome */}
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-gray-300 uppercase tracking-widest">Nome Completo *</label>
                                    <input
                                        type="text"
                                        className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-700"
                                        placeholder="Ex: Maria Oliveira Santos"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        autoFocus
                                    />
                                </div>

                                {/* Gênero */}
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-gray-300 uppercase tracking-widest">Gênero *</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            className={`flex items-center justify-center gap-2 py-3 rounded-lg border transition-all font-bold text-sm uppercase tracking-wide ${formData.gender === 'MALE'
                                                ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                                                : 'bg-background-dark border-white/10 text-gray-500 hover:bg-white/5'
                                                }`}
                                            onClick={() => handleInputChange('gender', 'MALE')}
                                        >
                                            ♂ Masculino
                                        </button>
                                        <button
                                            type="button"
                                            className={`flex items-center justify-center gap-2 py-3 rounded-lg border transition-all font-bold text-sm uppercase tracking-wide ${formData.gender === 'FEMALE'
                                                ? 'bg-pink-500/20 border-pink-500 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.2)]'
                                                : 'bg-background-dark border-white/10 text-gray-500 hover:bg-white/5'
                                                }`}
                                            onClick={() => handleInputChange('gender', 'FEMALE')}
                                        >
                                            ♀ Feminino
                                        </button>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-300 uppercase tracking-widest">Email</label>
                                    <input
                                        type="email"
                                        className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-700"
                                        placeholder="atleta@dominio.com"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                    />
                                </div>

                                {/* Telefone */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-300 uppercase tracking-widest">Telefone / WhatsApp</label>
                                    <input
                                        type="tel"
                                        className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-700"
                                        placeholder="(00) 00000-0000"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Invite Toggle */}
                        <div className="mt-8 pt-6 border-t border-white/5">
                            <label
                                className={`flex items-center gap-4 p-5 rounded-xl border cursor-pointer transition-all ${formData.sendInvite
                                    ? 'bg-primary/10 border-primary/40 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                                    : 'bg-background-dark border-white/10 hover:bg-white/5'
                                    }`}
                                onClick={() => handleInputChange('sendInvite', !formData.sendInvite)}
                            >
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${formData.sendInvite ? 'border-primary bg-primary text-black' : 'border-gray-700'
                                    }`}>
                                    {formData.sendInvite && <Check size={12} strokeWidth={3} />}
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-white font-bold block text-sm uppercase tracking-wider">Criar Acesso ao Portal</span>
                                    <span className="text-gray-500 text-xs">Cria login com email e senha padrão (<strong className="text-gray-300">{DEFAULT_ATHLETE_PASSWORD}</strong>). Requer email preenchido.</span>
                                </div>
                            </label>
                        </div>

                        {/* Info Box */}
                        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-start gap-3">
                            <Sparkles className="text-primary mt-0.5" size={16} />
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Após o cadastro, você poderá realizar a <span className="text-primary font-bold">Avaliação IA</span> para coletar as medidas corporais e gerar o Score do atleta.
                            </p>
                        </div>

                        {/* Error Display */}
                        {submitError && (
                            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                                ❌ {submitError}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="mt-10 flex items-center justify-end">
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !isFormValid}
                                className={`flex items-center gap-3 px-10 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all transform active:scale-[0.98] ${isSubmitting || !isFormValid
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-primary hover:bg-primary/90 text-black shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:scale-[1.02]'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={18} strokeWidth={2.5} />
                                        Cadastrar Aluno
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
