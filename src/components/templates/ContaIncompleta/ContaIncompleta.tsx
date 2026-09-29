import React from 'react';
import { AlertTriangle, LogOut } from 'lucide-react';

export type ContaIncompletaVariante = 'incompleta' | 'suspensa';

interface ContaIncompletaProps {
    variante?: ContaIncompletaVariante;
    email?: string | null;
    onSair: () => void;
}

const TEXTOS: Record<ContaIncompletaVariante, { titulo: string; descricao: string }> = {
    incompleta: {
        titulo: 'Conta incompleta',
        descricao:
            'Seu login existe, mas o cadastro não foi concluído. Fale com o suporte do VITRU IA para finalizarmos sua conta.',
    },
    suspensa: {
        titulo: 'Conta suspensa',
        descricao:
            'O acesso desta conta está suspenso no momento. Fale com o suporte do VITRU IA para reativá-la.',
    },
};

/**
 * Tela exibida quando o usuário está autenticado mas não tem o cadastro
 * necessário (profile ou entidade ausente) — em vez de cair no dashboard
 * do atleta com dados de exemplo.
 */
export const ContaIncompleta: React.FC<ContaIncompletaProps> = ({ variante = 'incompleta', email, onSair }) => {
    const { titulo, descricao } = TEXTOS[variante];

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-black px-4 text-white">
            <div className="w-full max-w-sm space-y-6 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                    <AlertTriangle size={24} />
                </div>
                <div className="space-y-2">
                    <h1 className="text-lg font-semibold">{titulo}</h1>
                    <p className="text-sm text-gray-400">{descricao}</p>
                    {email && <p className="text-xs text-gray-500">Logado como {email}</p>}
                </div>
                <button
                    type="button"
                    onClick={onSair}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5"
                >
                    <LogOut size={16} />
                    Sair
                </button>
            </div>
        </div>
    );
};
