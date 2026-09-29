/**
 * NovoAlunoScreen — Página dedicada para cadastro de aluno (Mobile)
 *
 * Reutiliza a mesma lógica do StudentRegistration (desktop),
 * mas com layout otimizado para mobile com botão Voltar.
 */

import React from 'react'
import { UserPlus, Check, Sparkles, Loader2, AlertTriangle } from 'lucide-react'
import { ScreenHeader } from './components/ScreenHeader'
import { useCadastroAluno } from '@/hooks/useCadastroAluno'
import { AcessoAlunoCard } from '@/components/organisms/AcessoAlunoCard'

interface NovoAlunoScreenProps {
    onVoltar: () => void
    onCadastrado: () => void
    /** Chamado logo após criar o aluno (recarregar a lista do portal). */
    onAlunoCriado?: () => void
}

export function NovoAlunoScreen({ onVoltar, onCadastrado, onAlunoCriado }: NovoAlunoScreenProps) {
    const { form, atualizar, enviar, enviando: salvando, erro, erroValidacao, resultado } = useCadastroAluno(() => {
        onAlunoCriado?.()
    })
    const sucesso = !!resultado
    const handleChange = atualizar
    const handleSubmit = enviar
    const formValido = !erroValidacao

    // ═══════════════════════════════════════════════════════
    // TELA DE SUCESSO
    // ═══════════════════════════════════════════════════════

    if (sucesso) {
        return (
            <div className="min-h-screen bg-background-dark pb-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-emerald-500/10 via-emerald-900/5 to-transparent pointer-events-none" />

                {/* Header */}
                <div className="relative px-4 pt-6 z-10">
                    <ScreenHeader
                        icon={<Check size={16} className="text-emerald-400" />}
                        titulo="Cadastro Realizado"
                        comVoltar
                        onVoltar={onCadastrado}
                    />
                </div>

                <div className="px-4 pt-4 relative z-10 space-y-6">
                    {/* Ícone de Sucesso */}
                    <div className="text-center space-y-3">
                        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto animate-bounce">
                            <Check className="text-emerald-400" size={28} strokeWidth={3} />
                        </div>
                        <h2 className="text-white text-lg font-black uppercase tracking-wide">Aluno Cadastrado!</h2>
                        <p className="text-zinc-400 text-sm">
                            <span className="text-white font-bold">{form.nome}</span> foi cadastrado(a) com sucesso.
                        </p>
                    </div>

                    {resultado?.acesso && <AcessoAlunoCard nomeAluno={form.nome} acesso={resultado.acesso} />}
                    {resultado?.erroAcesso && (
                        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3 text-xs text-amber-300">
                            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                            <p>Aluno cadastrado, mas o link não foi gerado: {resultado.erroAcesso} Gere depois na ficha do aluno.</p>
                        </div>
                    )}

                    {/* Botão Voltar */}
                    <button
                        onClick={onCadastrado}
                        className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-zinc-300 font-black text-sm uppercase tracking-widest active:scale-[0.98] transition-all"
                    >
                        Voltar para Meus Alunos
                    </button>
                </div>
            </div>
        )
    }

    // ═══════════════════════════════════════════════════════
    // FORMULÁRIO
    // ═══════════════════════════════════════════════════════

    return (
        <div className="min-h-screen bg-background-dark pb-24 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-indigo-500/10 via-indigo-900/5 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="relative px-4 pt-6 z-10">
                <ScreenHeader
                    icon={<UserPlus size={16} className="text-indigo-400" />}
                    titulo="Novo Aluno"
                    subtitulo="Cadastro Rápido"
                    comVoltar
                    onVoltar={onVoltar}
                />
            </div>

            <div className="px-4 relative z-10 space-y-6">
                {/* Card do Formulário */}
                <div className="bg-surface-deep rounded-3xl p-5 border border-white/5 shadow-2xl space-y-5">
                    <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                        <UserPlus size={16} className="text-indigo-400" />
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Dados do Aluno</span>
                    </div>

                    {/* Nome */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Nome Completo *</label>
                        <input
                            type="text"
                            value={form.nome}
                            onChange={e => handleChange('nome', e.target.value)}
                            placeholder="Ex: Maria Oliveira Santos"
                            className="w-full bg-background-dark text-white text-sm font-medium placeholder-zinc-700 rounded-xl px-4 py-3.5 border border-white/5 focus:outline-none focus:border-indigo-500/30 transition-all"
                            autoFocus
                        />
                    </div>

                    {/* Gênero */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Gênero *</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => handleChange('sexo', 'M')}
                                className={`py-3 rounded-xl border font-black text-xs uppercase tracking-widest transition-all ${form.sexo === 'M'
                                    ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                                    : 'bg-background-dark border-white/5 text-zinc-600'
                                    }`}
                            >
                                ♂ Masculino
                            </button>
                            <button
                                type="button"
                                onClick={() => handleChange('sexo', 'F')}
                                className={`py-3 rounded-xl border font-black text-xs uppercase tracking-widest transition-all ${form.sexo === 'F'
                                    ? 'bg-pink-500/20 border-pink-500/40 text-pink-400 shadow-[0_0_12px_rgba(236,72,153,0.15)]'
                                    : 'bg-background-dark border-white/5 text-zinc-600'
                                    }`}
                            >
                                ♀ Feminino
                            </button>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={e => handleChange('email', e.target.value)}
                            placeholder="atleta@dominio.com"
                            className="w-full bg-background-dark text-white text-sm font-medium placeholder-zinc-700 rounded-xl px-4 py-3.5 border border-white/5 focus:outline-none focus:border-indigo-500/30 transition-all"
                        />
                    </div>

                    {/* Telefone */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Telefone / WhatsApp</label>
                        <input
                            type="tel"
                            value={form.telefone}
                            onChange={e => handleChange('telefone', e.target.value)}
                            placeholder="(00) 00000-0000"
                            className="w-full bg-background-dark text-white text-sm font-medium placeholder-zinc-700 rounded-xl px-4 py-3.5 border border-white/5 focus:outline-none focus:border-indigo-500/30 transition-all"
                        />
                    </div>
                </div>

                {/* Toggle: Criar Acesso */}
                <button
                    type="button"
                    onClick={() => handleChange('gerarAcesso', !form.gerarAcesso)}
                    className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all ${form.gerarAcesso
                        ? 'bg-indigo-600/10 border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.1)]'
                        : 'bg-surface-deep border-white/5'
                        }`}
                >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${form.gerarAcesso ? 'border-indigo-500 bg-indigo-500' : 'border-zinc-700'
                        }`}>
                        {form.gerarAcesso && <Check size={12} strokeWidth={3} className="text-white" />}
                    </div>
                    <div className="text-left">
                        <span className="text-white font-black text-xs uppercase tracking-wider block">Criar Acesso ao Portal</span>
                        <span className="text-zinc-500 text-[10px]">
                            O aluno recebe um link para criar a própria senha. Requer e-mail.
                        </span>
                    </div>
                </button>

                {/* Info */}
                <div className="flex items-start gap-3 p-4 bg-indigo-500/5 border border-indigo-500/15 rounded-2xl">
                    <Sparkles className="text-indigo-400 shrink-0 mt-0.5" size={14} />
                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                        Após o cadastro, você poderá realizar a <span className="text-indigo-400 font-bold">Avaliação IA</span> pelo desktop para coletar as medidas corporais.
                    </p>
                </div>

                {/* Erro */}
                {erro && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold">
                        ❌ {erro}
                    </div>
                )}

                {!erro && form.nome.trim().length >= 2 && erroValidacao && (
                    <p className="text-[11px] text-amber-400 px-1">{erroValidacao}</p>
                )}

                {/* Botão Cadastrar */}
                <button
                    onClick={handleSubmit}
                    disabled={salvando || !formValido}
                    className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] ${salvando || !formValido
                        ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                        : 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/30'
                        }`}
                >
                    {salvando ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Salvando...
                        </>
                    ) : (
                        <>
                            <UserPlus size={16} strokeWidth={2.5} />
                            Cadastrar Aluno
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
