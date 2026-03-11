
import React, { useState } from 'react';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Sparkles,
    FlaskConical,
    User as UserIcon,
    CheckCircle2
} from 'lucide-react';
import { ProfileSelector, ProfileType } from '@/components/organisms';
import { useAuthStore } from '@/stores/authStore';
import { isMobileDevice } from '@/utils/mobileDetect';
import { isGodEmail } from '@/types/auth';

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
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [autoLoginAttempted, setAutoLoginAttempted] = useState(false);

    const { signIn, signUp } = useAuthStore();

    // 🔗 Auto-preencher credenciais da URL (link gerado pelo Personal no cadastro do aluno)
    // Formato: /atleta?email=xxx&p=yyy
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlEmail = params.get('email');
        const urlPassword = params.get('p');

        if (urlEmail) {
            setEmail(decodeURIComponent(urlEmail));
        }
        if (urlPassword) {
            setPassword(decodeURIComponent(urlPassword));
        }

        // Auto-login se ambos estão presentes e ainda não tentamos
        if (urlEmail && urlPassword && !autoLoginAttempted) {
            setAutoLoginAttempted(true);
            setIsLoading(true);

            signIn(decodeURIComponent(urlEmail), decodeURIComponent(urlPassword))
                .then(({ error: signInError }) => {
                    if (signInError) {
                        setError('Credenciais inválidas. Tente manualmente.');
                        setIsLoading(false);
                    } else {
                        // Redirecionamento inteligente pós-login
                        // Pequeno delay para garantir que o authStore atualizou
                        setTimeout(() => {
                            handleSmartRedirect();
                            setIsLoading(false);
                        }, 500);
                    }
                })
                .catch(() => {
                    setError('Erro ao conectar. Tente manualmente.');
                    setIsLoading(false);
                });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Redirecionamento inteligente pós-login.
     * Decide o destino baseado no role do usuário + dispositivo (mobile/desktop).
     */
    const handleSmartRedirect = () => {
        const state = useAuthStore.getState();
        const userRole = state.profile?.role?.toUpperCase();
        const userEmail = state.profile?.email || '';
        const mobile = isMobileDevice();

        // GOD check (email whitelist)
        if (userEmail && isGodEmail(userEmail)) {
            if (mobile) {
                window.location.replace('/god');
                return;
            }
            onLogin('god');
            return;
        }

        switch (userRole) {
            case 'PERSONAL': {
                const personalId = state.entity?.personal?.id;
                if (mobile && personalId) {
                    window.location.replace(`/personal/${personalId}`);
                    return;
                }
                onLogin('personal');
                return;
            }
            case 'ATLETA': {
                const atleta = state.entity?.atleta;
                const isVinculado = !!atleta?.personal_id;
                if (isVinculado) {
                    // Atleta vinculado → sempre Portal do Aluno
                    window.location.replace('/atleta');
                    return;
                }
                // Atleta independente → mobile vai pro portal, desktop fica no app
                if (mobile) {
                    window.location.replace('/meu-portal');
                    return;
                }
                onLogin('atleta');
                return;
            }
            case 'ACADEMIA': {
                const academiaId = state.entity?.academia?.id;
                if (mobile && academiaId) {
                    window.location.replace(`/academia/${academiaId}`);
                    return;
                }
                onLogin('academia');
                return;
            }
            default:
                onLogin('atleta');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        try {
            if (isNewUser) {
                // Sign Up Flow
                const { error: signUpError } = await signUp(email, password, {
                    fullName,
                    role: profile.toUpperCase() as 'PERSONAL' | 'ATLETA' | 'ACADEMIA'
                });

                if (signUpError) {
                    throw new Error(signUpError instanceof Error ? signUpError.message : String(signUpError));
                }

                setSuccess('Cadastro realizado com sucesso!');
                setIsNewUser(false); // Switch back to login
            } else {
                // Sign In Flow
                const { error: signInError } = await signIn(email, password);

                if (signInError) {
                    throw new Error('Email ou senha inválidos.');
                }

                // Redirecionamento inteligente baseado no role + dispositivo
                handleSmartRedirect();
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao autenticar');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-background-dark text-white font-sans overflow-hidden">
            {/* Left Side - Hero Section */}
            <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-background-dark to-surface items-center justify-center overflow-hidden">
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
                        <h1 className="text-2xl font-black flex items-center gap-2">
                            <span className="bg-gradient-to-br from-indigo-600 to-purple-600 text-[#0E1424] px-2 py-0.5 rounded-lg shadow-lg shadow-indigo-600/20">V</span>
                            <span className="tracking-tighter text-white">VITRU</span>
                            <span className="tracking-tighter text-indigo-500 text-sm mt-1.5">IA</span>
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
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background-dark">
                <div className="max-w-md w-full flex flex-col gap-8">

                    <div className="space-y-3 text-center lg:text-left">
                        {/* Mobile view logic */}
                        <div className="flex justify-center lg:hidden">
                            {isNewUser ? (
                                <h2 className="text-3xl font-bold tracking-tight text-white font-sans uppercase tracking-[0.15em]">
                                    Selecione seu Perfil
                                </h2>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <h1 className="text-4xl font-black flex items-center gap-2">
                                        <span className="bg-gradient-to-br from-indigo-600 to-purple-600 text-[#0E1424] px-2.5 py-1 rounded-xl shadow-lg shadow-indigo-600/20">V</span>
                                        <div className="flex items-baseline">
                                            <span className="tracking-tighter text-white">VITRU</span>
                                            <span className="tracking-tighter text-indigo-500 text-base ml-1">IA</span>
                                        </div>
                                    </h1>
                                </div>
                            )}
                        </div>

                        {/* Desktop: Text title */}
                        <h2 className="hidden lg:block text-3xl font-bold tracking-tight">
                            {isNewUser ? 'Selecione seu Perfil' : 'Acesse o Painel'}
                        </h2>

                        <p className="text-gray-400 text-sm lg:text-base">
                            {isNewUser
                                ? 'Preencha os dados abaixo para começar.'
                                : 'Acesse o Painel ou Crie uma Conta Gratuitamente'}
                        </p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm animate-in fade-in slide-in-from-top-1 duration-300">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-4 bg-primary/10 border border-primary/20 text-primary rounded-lg text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-300">
                            <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
                            <div>
                                <p className="font-bold">Seja bem-vindo!</p>
                                <p className="text-xs text-gray-400 mt-1">Sua conta foi criada com sucesso. Use seu e-mail e senha para acessar o painel.</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        {/* Profile Selector (Only for Sign Up to choose role) */}
                        {isNewUser && (
                            <div className="space-y-1">
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
                            <div className="flex justify-center lg:justify-end">
                                <button type="button" className="text-xs text-primary hover:text-primary/80 transition-colors font-medium">
                                    Esqueci minha senha
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black py-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(79,70,229,0.25)] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest active:scale-[0.98]"
                        >
                            {isLoading ? 'CARREGANDO...' : (isNewUser ? 'CRIAR CONTA' : 'ENTRAR')}
                            {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </button>

                        <div className="relative flex items-center justify-center py-1">
                            <div className="absolute w-full h-px bg-white/5"></div>
                            <span className="relative bg-background-dark px-2 text-xs text-gray-500">ou</span>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setIsNewUser(!isNewUser);
                                setError(null);
                                setSuccess(null);
                            }}
                            className="w-full bg-transparent border border-white/10 hover:bg-white/5 text-white font-medium py-3.5 rounded-lg transition-all text-sm"
                        >
                            {isNewUser ? 'Já tenho uma conta' : 'Criar conta gratuitamente'}
                        </button>

                        {/* Branding Labels - Mobile Only */}
                        {!isNewUser && (
                            <div className="flex justify-center gap-3 mt-1 lg:hidden">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                                    <FlaskConical size={12} /> Science Based
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-[10px] font-bold uppercase tracking-wider">
                                    <Sparkles size={12} /> AI Powered
                                </div>
                            </div>
                        )}
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
