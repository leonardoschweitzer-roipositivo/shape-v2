
import React, { useState } from 'react';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Sparkles,
    FlaskConical,
    User as UserIcon
} from 'lucide-react';
import { ProfileSelector, ProfileType } from '@/components/organisms';
import { useAuthStore } from '@/stores/authStore';

interface LoginProps {
    onLogin: (profile: ProfileType) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [isNewUser, setIsNewUser] = useState(false);
    const [profile, setProfile] = useState<ProfileType>('atleta'); // Default
    const [showPassword, setShowPassword] = useState(false);

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { signIn, signUp } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            if (isNewUser) {
                // Sign Up Flow
                const { error: signUpError } = await signUp(email, password, {
                    fullName,
                    role: profile.toUpperCase() as any
                });

                if (signUpError) {
                    throw new Error(signUpError.message);
                }

                alert('Cadastro realizado! Verifique seu email para confirmar.');
                setIsNewUser(false); // Switch back to login
            } else {
                // Sign In Flow
                const { error: signInError } = await signIn(email, password);

                if (signInError) {
                    throw new Error('Email ou senha inválidos.');
                }

                // Login successful - The hook will update state, parent component will re-render or we call onLogin
                // For now, let's keep the onLogin prop for callback compatibility
                onLogin(profile);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-[#0A0F1C] text-white font-sans overflow-hidden">
            {/* Left Side - Hero Section */}
            <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-[#0A0F1C] to-[#1a1f2e] items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute top-0 left-0 w-full h-full z-0">
                    <img
                        src="/images/login-bg-v2.jpg"
                        alt="Background"
                        className="w-full h-full object-cover opacity-60"
                    />
                </div>

                {/* Content Container */}
                <div className="relative z-10 p-12 flex flex-col items-start max-w-xl">
                    {/* Logo (Placeholder if image missing) */}
                    <div className="absolute top-12 left-12">
                        <h1 className="text-2xl font-bold tracking-tighter flex items-center gap-2">
                            <span className="bg-primary text-black px-2 py-1 rounded">V</span> VITRU IA
                        </h1>
                    </div>

                    <div className="mt-24 space-y-6">
                        <div className="relative">
                            <div className="w-12 h-1 bg-primary mb-6"></div>
                            <h1 className="text-5xl font-bold leading-tight tracking-tight">
                                {isNewUser ? "Comece sua" : "A Matemática do"} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">
                                    {isNewUser ? "Jornada Vitruviana" : "Físico Perfeito"}
                                </span>
                            </h1>
                        </div>

                        <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                            {isNewUser
                                ? "Selecione seu perfil e descubra como a Inteligência Artificial pode elevar sua performance estética ao próximo nível."
                                : "Inspirado na harmonia vitruviana de Da Vinci, evoluído para a estética moderna e aplicado no seu corpo por Inteligência Artificial."
                            }
                        </p>

                        <div className="flex gap-4 pt-4">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                                <FlaskConical size={14} /> Science Based
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider">
                                <Sparkles size={14} /> AI Powered
                            </div>
                        </div>
                    </div>
                </div>

                <p className="absolute bottom-12 left-12 text-xs text-gray-600 font-mono z-10">v2.4.0-beta</p>
            </div>

            {/* Right Side - Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#0B101D]">
                <div className="max-w-md w-full flex flex-col gap-8">

                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">
                            {isNewUser ? 'Crie sua Conta' : 'Acesse o Painel'}
                        </h2>
                        <p className="text-gray-400">
                            {isNewUser
                                ? 'Preencha os dados abaixo para começar.'
                                : 'Entre com suas credenciais para continuar sua evolução.'}
                        </p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                        {/* Profile Selector (Only for Sign Up to choose role) */}
                        {isNewUser && (
                            <div className="space-y-4">
                                <label className="text-xs text-gray-400 font-medium ml-1 mb-1.5 block">Selecione seu Perfil</label>
                                <ProfileSelector
                                    selected={profile}
                                    onSelect={setProfile}
                                />
                            </div>
                        )}

                        {/* Inputs */}
                        <div className="space-y-4">
                            {isNewUser && (
                                <div>
                                    <label className="text-xs text-gray-400 font-medium ml-1 mb-1.5 block">Nome Completo</label>
                                    <div className="relative group">
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={18} />
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Seu nome completo"
                                            className="w-full bg-[#0E1424] border border-white/10 rounded-lg pl-11 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-all text-sm"
                                            required={isNewUser}
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="text-xs text-gray-400 font-medium ml-1 mb-1.5 block">E-mail</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="seu@email.com"
                                        className="w-full bg-[#0E1424] border border-white/10 rounded-lg pl-11 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-all text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-400 font-medium ml-1 mb-1.5 block">Senha</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-[#0E1424] border border-white/10 rounded-lg pl-11 pr-12 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-all text-sm"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {!isNewUser && (
                            <div className="flex justify-end">
                                <button type="button" className="text-xs text-primary hover:text-primary/80 transition-colors font-medium">
                                    Esqueci minha senha
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary/90 text-[#0A0F1C] font-bold py-3.5 rounded-lg transition-all shadow-[0_0_20px_rgba(0,201,167,0.2)] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'CARREGANDO...' : (isNewUser ? 'CRIAR CONTA' : 'ENTRAR')}
                            {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </button>

                        <div className="relative flex items-center justify-center py-2">
                            <div className="absolute w-full h-px bg-white/5"></div>
                            <span className="relative bg-[#0B101D] px-2 text-xs text-gray-500">ou</span>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setIsNewUser(!isNewUser);
                                setError(null);
                            }}
                            className="w-full bg-transparent border border-white/10 hover:bg-white/5 text-white font-medium py-3.5 rounded-lg transition-all text-sm"
                        >
                            {isNewUser ? 'Já tenho uma conta' : 'Criar conta gratuitamente'}
                        </button>
                    </form>

                    <div className="flex items-center justify-center gap-6 mt-8">
                        <a href="#" className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors">Termos de Uso</a>
                        <span className="text-gray-700 mx-[-12px]">•</span>
                        <a href="#" className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors">Política de Privacidade</a>
                    </div>

                    <div className="text-center">
                        <p className="text-[10px] text-gray-700">© 2024 VITRU IA AI Analytics.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
