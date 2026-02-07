
import React, { useState } from 'react';
import { ProfileSelector, ProfileType } from './ProfileSelector';
import {
    Building2,
    User,
    Dumbbell,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Hexagon,
    Sparkles,
    FlaskConical
} from 'lucide-react';
import { InputField } from './InputField';

interface LoginProps {
    onLogin: (profile: ProfileType) => void;
}



export const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [isNewUser, setIsNewUser] = useState(false);
    const [profile, setProfile] = useState<ProfileType>('atleta');
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('dev@shape.v');
    const [password, setPassword] = useState('123456');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isNewUser && profile !== 'atleta') {
            alert('Acesso restrito: Por favor, entre como Atleta.');
            return;
        }
        onLogin(profile);
    };

    const handleNewUserFlow = (type: ProfileType) => {
        // According to instructions: 
        // Atleta -> Onboarding (direct to platform for now)
        // Academia/Personal -> Registration (direct to platform for now)
        onLogin(type);
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
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content Container */}
                <div className="relative z-10 p-12 flex flex-col items-start max-w-xl">
                    {/* Logo */}
                    <div className="absolute top-12 left-12">
                        <img src="/logo-vitru.png" alt="VITRU IA Logo" className="h-[1.8rem] w-auto" />
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

                    {!isNewUser ? (
                        <>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tight">Acesse o Painel</h2>
                                <p className="text-gray-400">Entre com suas credenciais para continuar sua evolução.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                {/* Profile Selector */}
                                <ProfileSelector
                                    selected={profile}
                                    onSelect={setProfile}
                                />

                                {/* Inputs */}
                                <div className="space-y-4">
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

                                <div className="flex justify-end">
                                    <button type="button" className="text-xs text-primary hover:text-primary/80 transition-colors font-medium">
                                        Esqueci minha senha
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-primary/90 text-[#0A0F1C] font-bold py-3.5 rounded-lg transition-all shadow-[0_0_20px_rgba(0,201,167,0.2)] flex items-center justify-center gap-2 group"
                                >
                                    ENTRAR
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>

                                <div className="relative flex items-center justify-center py-2">
                                    <div className="absolute w-full h-px bg-white/5"></div>
                                    <span className="relative bg-[#0B101D] px-2 text-xs text-gray-500">ou</span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsNewUser(true)}
                                    className="w-full bg-transparent border border-white/10 hover:bg-white/5 text-white font-medium py-3.5 rounded-lg transition-all text-sm"
                                >
                                    Criar conta gratuitamente
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tight">Criar sua Conta</h2>
                                <p className="text-gray-400">Escolha o seu perfil para começar.</p>
                            </div>

                            <div className="flex flex-col gap-6">
                                <ProfileSelector
                                    selected={profile}
                                    onSelect={setProfile}
                                />

                                <div className="space-y-4">
                                    {profile === 'atleta' ? (
                                        <button
                                            onClick={() => handleNewUserFlow('atleta')}
                                            className="w-full bg-primary hover:bg-primary/90 text-[#0A0F1C] font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(0,201,167,0.2)] flex flex-col items-center justify-center gap-1 group"
                                        >
                                            <span className="flex items-center gap-2">
                                                INICIAR AVALIAÇÃO & ONBOARDING
                                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </span>
                                            <span className="text-[10px] opacity-70 font-medium">RESULTADO INSTANTÂNEO COM IA</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleNewUserFlow(profile)}
                                            className="w-full bg-white/5 border border-white/10 hover:border-primary/50 text-white font-bold py-4 rounded-xl transition-all flex flex-col items-center justify-center gap-1 group"
                                        >
                                            <span className="flex items-center gap-2">
                                                CADASTRAR COMO {profile.toUpperCase()}
                                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </span>
                                            <span className="text-[10px] text-gray-500 font-medium">CRIE SEU AMBIENTE PROFISSIONAL</span>
                                        </button>
                                    )}
                                </div>

                                <div className="text-center">
                                    <button
                                        onClick={() => setIsNewUser(false)}
                                        className="text-sm text-gray-400 hover:text-white transition-colors"
                                    >
                                        Já possui uma conta? <span className="text-primary font-medium">Entre aqui</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

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
