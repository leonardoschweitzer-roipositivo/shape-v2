/**
 * DefinirSenhaPage — rota /definir-senha
 *
 * Usada em dois fluxos:
 *  • Convite do aluno (Fase 2): ?th=<token_hash>&type=invite
 *  • Recuperação de senha:      ?th=<token_hash>&type=recovery  (template de e-mail recomendado)
 *                               ou sessão no hash da URL (template padrão do Supabase)
 *
 * O token só é consumido no ENVIO do formulário (verifyOtp) — a prévia de link do
 * WhatsApp/e-mail faz GET na página e não pode "queimar" o link de uso único.
 */
import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, KeyRound, LogOut } from 'lucide-react';
import { supabase } from '@/services/supabase';
import { consumirMarcaRecuperacao, useAuthStore } from '@/stores/authStore';
import { redirecionarPosLogin } from '@/utils/redirecionarPosLogin';

type TipoLink = 'invite' | 'recovery';
type Modo = 'carregando' | 'token' | 'sessao' | 'invalido';

const SENHA_MIN = 8;

/**
 * Hash da URL no carregamento do app (antes do supabase-js processar e limpar).
 * O modo "sessão" (sem token) só vale quando a página foi aberta por um link de
 * recuperação/convite — nunca para uma sessão qualquer já aberta no navegador
 * (senão alguém numa sessão esquecida trocaria a senha sem saber a atual).
 */
const HASH_INICIAL = typeof window !== 'undefined' ? window.location.hash : '';
const VEIO_DE_LINK_DE_SENHA = /type=(recovery|invite)/.test(HASH_INICIAL);

function lerParametros(): { tokenHash: string | null; tipo: TipoLink } {
    const params = new URLSearchParams(window.location.search);
    const tipo = params.get('type') === 'invite' ? 'invite' : 'recovery';
    return { tokenHash: params.get('th'), tipo };
}

export const DefinirSenhaPage: React.FC = () => {
    const { tokenHash, tipo } = lerParametros();
    const usuarioLogado = useAuthStore(s => s.user);
    const signOut = useAuthStore(s => s.signOut);
    const checkSession = useAuthStore(s => s.checkSession);

    const [modo, setModo] = useState<Modo>('carregando');
    const [senha, setSenha] = useState('');
    const [confirmacao, setConfirmacao] = useState('');
    const [mostrar, setMostrar] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [salvando, setSalvando] = useState(false);
    const [confirmouTroca, setConfirmouTroca] = useState(false);

    useEffect(() => {
        if (tokenHash) {
            setModo('token');
            return;
        }
        // Sem token: só aceita a sessão criada pelo link de recuperação (#access_token...&type=recovery)
        const veioDeRecuperacao = VEIO_DE_LINK_DE_SENHA || consumirMarcaRecuperacao();
        if (!veioDeRecuperacao) {
            setModo('invalido');
            return;
        }
        supabase.auth.getSession().then(({ data }) => setModo(data.session ? 'sessao' : 'invalido'));
    }, [tokenHash]);

    // Link de convite/recuperação aberto com outra conta logada neste navegador
    const logadoComOutraConta = modo === 'token' && !!usuarioLogado && !confirmouTroca;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro(null);

        if (senha.length < SENHA_MIN) {
            setErro(`A senha precisa ter pelo menos ${SENHA_MIN} caracteres.`);
            return;
        }
        if (senha !== confirmacao) {
            setErro('As senhas não conferem.');
            return;
        }

        setSalvando(true);
        try {
            if (modo === 'token' && tokenHash) {
                const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: tipo });
                if (error) {
                    setModo('invalido');
                    return;
                }
                // Token de uso único já consumido: novas tentativas (ex.: senha igual à antiga) usam a sessão
                setModo('sessao');
            }

            const { error } = await supabase.auth.updateUser({ password: senha });
            if (error) {
                setErro(
                    error.message.toLowerCase().includes('different')
                        ? 'A nova senha precisa ser diferente da anterior.'
                        : 'Não foi possível salvar a senha. Tente novamente.'
                );
                return;
            }

            // Aluno: registra que o acesso foi ativado (no-op para outros papéis)
            await supabase.rpc('app_marcar_acesso_ativado').then(() => undefined, () => undefined);

            await checkSession();
            window.history.replaceState(null, '', '/');
            redirecionarPosLogin();
        } finally {
            setSalvando(false);
        }
    };

    const titulo = tipo === 'invite' ? 'Crie sua senha' : 'Defina uma nova senha';

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background-dark px-4 text-white">
            <div className="w-full max-w-sm space-y-6">
                <div className="space-y-3 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <KeyRound size={22} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">{titulo}</h1>
                    {modo !== 'invalido' && (
                        <p className="text-sm text-gray-400">
                            {tipo === 'invite'
                                ? 'Bem-vindo ao VITRU IA! Escolha a senha que você vai usar para entrar.'
                                : 'Escolha uma senha nova para a sua conta.'}
                        </p>
                    )}
                </div>

                {modo === 'carregando' && (
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                )}

                {modo === 'invalido' && (
                    <div className="space-y-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-300">
                        <p className="font-semibold">Link expirado ou já utilizado.</p>
                        <p className="text-amber-200/80">
                            {tipo === 'invite'
                                ? 'Peça ao seu personal para gerar um novo link de acesso.'
                                : 'Volte ao login e clique em "Esqueci minha senha" para receber um novo link.'}
                        </p>
                        <a href="/" className="inline-block text-xs font-bold uppercase tracking-wider text-white underline">
                            Ir para o login
                        </a>
                    </div>
                )}

                {logadoComOutraConta && (
                    <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm">
                        <p className="text-gray-300">
                            Você está logado como <span className="font-semibold text-white">{usuarioLogado?.email}</span>.
                            Para usar este link, saia dessa conta.
                        </p>
                        <button
                            type="button"
                            onClick={async () => {
                                await signOut();
                                setConfirmouTroca(true);
                            }}
                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-white/5"
                        >
                            <LogOut size={14} /> Sair e continuar
                        </button>
                    </div>
                )}

                {(modo === 'token' || modo === 'sessao') && !logadoComOutraConta && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <input
                                type={mostrar ? 'text' : 'password'}
                                value={senha}
                                onChange={e => setSenha(e.target.value)}
                                placeholder={`Nova senha (mín. ${SENHA_MIN} caracteres)`}
                                autoComplete="new-password"
                                className="w-full rounded-lg border border-white/10 bg-[#0E1424] px-4 py-3.5 pr-12 text-sm text-white placeholder-gray-600 focus:border-primary/50 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setMostrar(m => !m)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                aria-label={mostrar ? 'Ocultar senha' : 'Mostrar senha'}
                            >
                                {mostrar ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <input
                            type={mostrar ? 'text' : 'password'}
                            value={confirmacao}
                            onChange={e => setConfirmacao(e.target.value)}
                            placeholder="Confirme a senha"
                            autoComplete="new-password"
                            className="w-full rounded-lg border border-white/10 bg-[#0E1424] px-4 py-3.5 text-sm text-white placeholder-gray-600 focus:border-primary/50 focus:outline-none"
                        />

                        {erro && (
                            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">{erro}</div>
                        )}

                        <button
                            type="submit"
                            disabled={salvando}
                            className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-4 text-sm font-black uppercase tracking-widest text-white disabled:opacity-50"
                        >
                            {salvando ? 'Salvando...' : 'Salvar senha e entrar'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default DefinirSenhaPage;
