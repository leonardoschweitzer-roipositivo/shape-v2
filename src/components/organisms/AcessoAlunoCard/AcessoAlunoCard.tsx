import React, { useState } from 'react';
import { Check, Copy, KeyRound, Mail, MessageCircle, RefreshCw } from 'lucide-react';
import {
    alunoService,
    statusAcessoAluno,
    type LinkAcessoAluno,
} from '@/services/aluno.service';

// ============================================
// Card com o link gerado
// ============================================

interface AcessoAlunoCardProps {
    nomeAluno: string;
    acesso: LinkAcessoAluno;
}

function formatarValidade(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

/** Link de uso único para o aluno criar a senha — copiar / WhatsApp / e-mail. Nunca exibe senha. */
export const AcessoAlunoCard: React.FC<AcessoAlunoCardProps> = ({ nomeAluno, acesso }) => {
    const [copiado, setCopiado] = useState(false);
    const primeiroNome = nomeAluno.trim().split(' ')[0] || nomeAluno;

    const mensagem =
        acesso.tipo === 'invite'
            ? `Olá ${primeiroNome}! 🏋️\n\nSeu acesso ao VITRU IA está pronto. Crie sua senha neste link (válido até ${formatarValidade(acesso.expiraEm)}):\n\n${acesso.link}\n\nDepois é só entrar com o e-mail ${acesso.email}.`
            : `Olá ${primeiroNome}! 🏋️\n\nUse este link para criar uma nova senha no VITRU IA (válido até ${formatarValidade(acesso.expiraEm)}):\n\n${acesso.link}`;

    const copiar = () => {
        navigator.clipboard.writeText(acesso.link).then(() => {
            setCopiado(true);
            setTimeout(() => setCopiado(false), 2000);
        });
    };

    return (
        <div className="p-5 bg-background-dark border border-indigo-500/30 rounded-2xl space-y-4">
            <div className="flex items-center gap-2">
                <KeyRound className="text-indigo-400" size={16} />
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    {acesso.tipo === 'invite' ? 'Convite para o Portal do Aluno' : 'Link para nova senha'}
                </span>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
                Envie o link para <span className="text-white font-semibold">{acesso.email}</span>. O aluno cria a própria
                senha — o link vale uma vez, até {formatarValidade(acesso.expiraEm)}.
            </p>

            <div className="flex items-center gap-2">
                <input
                    type="text"
                    readOnly
                    value={acesso.link}
                    onFocus={e => e.currentTarget.select()}
                    className="flex-1 min-w-0 bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-white text-xs font-mono truncate"
                />
                <button
                    type="button"
                    onClick={copiar}
                    className={`px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition-all ${copiado ? 'bg-emerald-500 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
                >
                    {copiado ? <Check size={12} /> : <Copy size={12} />}
                    {copiado ? 'Copiado' : 'Copiar'}
                </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <a
                    href={`https://wa.me/?text=${encodeURIComponent(mensagem)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 border border-emerald-600/30 rounded-lg text-emerald-400 hover:bg-emerald-600/30 transition-all text-xs font-bold"
                >
                    <MessageCircle size={14} /> WhatsApp
                </a>
                <a
                    href={`mailto:${acesso.email}?subject=${encodeURIComponent('Seu acesso ao VITRU IA')}&body=${encodeURIComponent(mensagem)}`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-all text-xs font-bold"
                >
                    <Mail size={14} /> E-mail
                </a>
            </div>
        </div>
    );
};

// ============================================
// Status + botão "Gerar / Reenviar link"
// ============================================

interface GerarAcessoAlunoProps {
    atletaId: string;
    nomeAluno: string;
    emailAtual?: string | null;
    authUserId?: string | null;
    conviteEnviadoEm?: string | null;
    acessoAtivadoEm?: string | null;
    /** Chamado após gerar o link (ex.: recarregar dados do aluno). */
    onGerado?: () => void;
}

const STATUS_LABEL = {
    ativo: { texto: 'Acesso ativo', classe: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    pendente: { texto: 'Convite pendente', classe: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    sem_acesso: { texto: 'Sem acesso ao portal', classe: 'text-gray-400 bg-white/5 border-white/10' },
} as const;

/**
 * Bloco de acesso ao portal na ficha do aluno: mostra o status e gera/reenvia o link.
 * Se o aluno ainda não tem e-mail, pede o e-mail antes de gerar.
 */
export const GerarAcessoAluno: React.FC<GerarAcessoAlunoProps> = ({
    atletaId,
    nomeAluno,
    emailAtual,
    authUserId,
    conviteEnviadoEm,
    acessoAtivadoEm,
    onGerado,
}) => {
    const [email, setEmail] = useState(emailAtual ?? '');
    const [gerando, setGerando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [acesso, setAcesso] = useState<LinkAcessoAluno | null>(null);

    const status = statusAcessoAluno({
        auth_user_id: authUserId,
        convite_enviado_em: conviteEnviadoEm,
        acesso_ativado_em: acessoAtivadoEm,
    });
    const badge = STATUS_LABEL[status];

    const gerar = async () => {
        setGerando(true);
        setErro(null);
        const r = await alunoService.gerarLinkAcesso(atletaId, email || undefined);
        setGerando(false);
        if (!r.ok) {
            setErro(r.erro);
            return;
        }
        setAcesso(r.data);
        onGerado?.();
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${badge.classe}`}>
                    {badge.texto}
                </span>
                {!acesso && (
                    <button
                        type="button"
                        onClick={gerar}
                        disabled={gerando || !email.trim()}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider disabled:opacity-40"
                    >
                        <RefreshCw size={12} className={gerando ? 'animate-spin' : ''} />
                        {gerando ? 'Gerando...' : status === 'sem_acesso' ? 'Gerar link de acesso' : 'Gerar novo link'}
                    </button>
                )}
            </div>

            {/* Pede e-mail quando ainda não há login, ou quando o aluno antigo tem login mas nenhum e-mail no cadastro
                (nesse caso precisa ser o e-mail do login dele — a Edge Function confere). */}
            {(!authUserId || !emailAtual) && !acesso && (
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="E-mail do aluno"
                    className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-primary/50 outline-none"
                />
            )}

            {status === 'ativo' && !acesso && (
                <p className="text-[11px] text-gray-500">
                    Esqueceu a senha? Gere um novo link — a senha antiga deixa de valer quando o aluno criar a nova.
                </p>
            )}

            {erro && <p className="text-xs text-red-400">{erro}</p>}
            {acesso && <AcessoAlunoCard nomeAluno={nomeAluno} acesso={acesso} />}
        </div>
    );
};
