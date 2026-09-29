import React, { useState } from 'react';
import { Check, KeyRound, X } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

interface AlterarSenhaModalProps {
    aberto: boolean;
    onFechar: () => void;
}

const SENHA_MIN = 8;

const inputClass =
    'w-full rounded-lg border border-white/10 bg-[#0E1424] px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-primary/50 focus:outline-none';

/** Troca de senha com reautenticação (pede a senha atual). */
export const AlterarSenhaModal: React.FC<AlterarSenhaModalProps> = ({ aberto, onFechar }) => {
    const changePassword = useAuthStore(s => s.changePassword);
    const [atual, setAtual] = useState('');
    const [nova, setNova] = useState('');
    const [confirmacao, setConfirmacao] = useState('');
    const [erro, setErro] = useState<string | null>(null);
    const [salvando, setSalvando] = useState(false);
    const [sucesso, setSucesso] = useState(false);

    if (!aberto) return null;

    const fechar = () => {
        setAtual('');
        setNova('');
        setConfirmacao('');
        setErro(null);
        setSucesso(false);
        onFechar();
    };

    const salvar = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro(null);
        if (nova.length < SENHA_MIN) return setErro(`A nova senha precisa ter pelo menos ${SENHA_MIN} caracteres.`);
        if (nova !== confirmacao) return setErro('As senhas não conferem.');
        if (nova === atual) return setErro('A nova senha precisa ser diferente da atual.');

        setSalvando(true);
        const { error } = await changePassword(atual, nova);
        setSalvando(false);
        if (error) {
            setErro(error instanceof Error ? error.message : 'Não foi possível alterar a senha.');
            return;
        }
        setSucesso(true);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4" onClick={fechar}>
            <div
                className="w-full max-w-sm space-y-5 rounded-2xl border border-white/10 bg-surface p-6 text-white"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-lg font-bold">
                        <KeyRound size={18} className="text-primary" /> Alterar senha
                    </h3>
                    <button type="button" onClick={fechar} className="text-gray-500 hover:text-white" aria-label="Fechar">
                        <X size={18} />
                    </button>
                </div>

                {sucesso ? (
                    <div className="space-y-4">
                        <p className="flex items-center gap-2 text-sm text-emerald-400">
                            <Check size={16} /> Senha alterada com sucesso.
                        </p>
                        <button type="button" onClick={fechar} className="w-full rounded-xl border border-white/10 py-3 text-sm hover:bg-white/5">
                            Fechar
                        </button>
                    </div>
                ) : (
                    <form onSubmit={salvar} className="space-y-3">
                        <input type="password" className={inputClass} placeholder="Senha atual" autoComplete="current-password" value={atual} onChange={e => setAtual(e.target.value)} required />
                        <input type="password" className={inputClass} placeholder={`Nova senha (mín. ${SENHA_MIN})`} autoComplete="new-password" value={nova} onChange={e => setNova(e.target.value)} required />
                        <input type="password" className={inputClass} placeholder="Confirme a nova senha" autoComplete="new-password" value={confirmacao} onChange={e => setConfirmacao(e.target.value)} required />
                        {erro && <p className="text-sm text-red-400">{erro}</p>}
                        <button
                            type="submit"
                            disabled={salvando}
                            className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-xs font-black uppercase tracking-widest disabled:opacity-50"
                        >
                            {salvando ? 'Salvando...' : 'Salvar nova senha'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};
