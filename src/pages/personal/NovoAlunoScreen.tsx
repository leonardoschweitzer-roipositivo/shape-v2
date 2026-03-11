/**
 * NovoAlunoScreen — Página dedicada para cadastro de aluno (Mobile)
 *
 * Reutiliza a mesma lógica do StudentRegistration (desktop),
 * mas com layout otimizado para mobile com botão Voltar.
 */

import React, { useState } from 'react'
import { ChevronLeft, UserPlus, Check, KeyRound, Copy, Mail, Sparkles, Loader2 } from 'lucide-react'
import { ScreenHeader } from './components/ScreenHeader'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/authStore'
import { useDataStore } from '@/stores/dataStore'

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

const DEFAULT_ATHLETE_PASSWORD = 'Shape2026!'

interface NovoAlunoScreenProps {
    onVoltar: () => void
    onCadastrado: () => void
}

interface FormData {
    nome: string
    email: string
    telefone: string
    sexo: 'MALE' | 'FEMALE'
    criarAcesso: boolean
}

const FORM_INICIAL: FormData = {
    nome: '',
    email: '',
    telefone: '',
    sexo: 'MALE',
    criarAcesso: false,
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

export function NovoAlunoScreen({ onVoltar, onCadastrado }: NovoAlunoScreenProps) {
    const [form, setForm] = useState<FormData>(FORM_INICIAL)
    const [salvando, setSalvando] = useState(false)
    const [erro, setErro] = useState<string | null>(null)

    // Estado de sucesso
    const [sucesso, setSucesso] = useState(false)
    const [loginLink, setLoginLink] = useState<string | null>(null)
    const [emailAluno, setEmailAluno] = useState<string | null>(null)
    const [linkCopiado, setLinkCopiado] = useState(false)

    const { entity } = useAuthStore()
    const { loadFromSupabase } = useDataStore()

    const formValido = form.nome.trim().length >= 2

    const handleChange = (campo: keyof FormData, valor: string | boolean) => {
        setForm(prev => ({ ...prev, [campo]: valor }))
    }

    // ─── Submissão ───────────────────────────────────────
    const handleSubmit = async () => {
        if (!formValido || salvando) return

        setSalvando(true)
        setErro(null)

        const personalId = entity.personal?.id
        if (!personalId) {
            setErro('Personal não identificado. Relogue e tente novamente.')
            setSalvando(false)
            return
        }

        try {
            // 1. Inserir atleta (trigger auto-cria ficha)
            const { data: atleta, error: atletaErr } = await supabase
                .from('atletas')
                .insert({
                    personal_id: personalId,
                    academia_id: entity.personal?.academia_id || null,
                    nome: form.nome.trim(),
                    email: form.email.trim() || null,
                    telefone: form.telefone.trim() || null,
                    status: 'ATIVO',
                } as Record<string, unknown>)
                .select()
                .single()

            if (atletaErr) throw new Error(`Erro ao criar atleta: ${atletaErr.message}`)

            // 2. Atualizar ficha (auto-criada pelo trigger)
            const sexoBD = form.sexo === 'MALE' ? 'M' : 'F'
            await supabase
                .from('fichas')
                .update({
                    sexo: sexoBD,
                    objetivo: 'HIPERTROFIA',
                    objetivo_vitruvio: 'RECOMP',
                } as Record<string, unknown>)
                .eq('atleta_id', atleta.id)

            // 3. Criar conta Auth se solicitado
            const emailTrimmed = form.email.trim()
            if (form.criarAcesso && emailTrimmed) {
                try {
                    const { data: { session: personalSession } } = await supabase.auth.getSession()

                    const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
                        email: emailTrimmed,
                        password: DEFAULT_ATHLETE_PASSWORD,
                        options: {
                            data: {
                                full_name: form.nome.trim(),
                                role: 'ATLETA',
                            },
                        },
                    })

                    // Restaurar sessão do Personal imediatamente
                    if (personalSession) {
                        await supabase.auth.setSession({
                            access_token: personalSession.access_token,
                            refresh_token: personalSession.refresh_token,
                        })
                    }

                    const baseUrl = window.location.origin

                    if (signUpErr) {
                        if (signUpErr.message.includes('already registered')) {
                            const { data: linkedUserId } = await supabase
                                .rpc('link_existing_user_to_atleta', {
                                    p_email: emailTrimmed,
                                    p_atleta_id: atleta.id,
                                })
                            if (linkedUserId) {
                                setLoginLink(`${baseUrl}/atleta?email=${encodeURIComponent(emailTrimmed)}`)
                                setEmailAluno(emailTrimmed)
                            }
                        }
                    } else if (signUpData?.user) {
                        await supabase
                            .from('atletas')
                            .update({ auth_user_id: signUpData.user.id } as Record<string, unknown>)
                            .eq('id', atleta.id)

                        setLoginLink(`${baseUrl}/atleta?email=${encodeURIComponent(emailTrimmed)}&p=${encodeURIComponent(DEFAULT_ATHLETE_PASSWORD).replace(/!/g, '%21')}`)
                        setEmailAluno(emailTrimmed)
                    }
                } catch {
                    // Erro não-crítico: aluno já criado, apenas acesso falhou
                    console.warn('[NovoAluno] Aviso ao criar conta Auth')
                }
            }

            // 4. Recarregar dados no store
            await loadFromSupabase(personalId)

            setSucesso(true)
        } catch (err: unknown) {
            setErro(err instanceof Error ? err.message : 'Erro ao cadastrar aluno.')
        } finally {
            setSalvando(false)
        }
    }

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

                    {/* Credenciais de Acesso */}
                    {loginLink && emailAluno && (
                        <div className="bg-surface-deep rounded-3xl p-5 border border-indigo-500/20 space-y-4">
                            <div className="flex items-center gap-2">
                                <KeyRound className="text-indigo-400" size={14} />
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Acesso ao Portal</span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/5">
                                    <Mail size={14} className="text-zinc-500" />
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Email</span>
                                        <p className="text-white text-xs font-mono truncate">{emailAluno}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/5">
                                    <KeyRound size={14} className="text-zinc-500" />
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Senha</span>
                                        <p className="text-white text-xs font-mono">{DEFAULT_ATHLETE_PASSWORD}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Copiar Link */}
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(loginLink)
                                    setLinkCopiado(true)
                                    setTimeout(() => setLinkCopiado(false), 2000)
                                }}
                                className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${linkCopiado
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                                    }`}
                            >
                                <Copy size={12} />
                                {linkCopiado ? 'Link Copiado!' : 'Copiar Link de Acesso'}
                            </button>

                            {/* WhatsApp */}
                            <a
                                href={`https://wa.me/?text=${encodeURIComponent(
                                    `Olá ${form.nome}! 🏋️\n\nSeu acesso ao Portal VITRU IA foi criado!\n\n📧 Email: ${emailAluno}\n🔑 Senha: ${DEFAULT_ATHLETE_PASSWORD}\n\nAcesse aqui:\n${loginLink}`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 bg-emerald-600/20 border border-emerald-600/30 text-emerald-400 active:scale-95 transition-all"
                            >
                                📱 Enviar via WhatsApp
                            </a>
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
                                onClick={() => handleChange('sexo', 'MALE')}
                                className={`py-3 rounded-xl border font-black text-xs uppercase tracking-widest transition-all ${form.sexo === 'MALE'
                                    ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                                    : 'bg-background-dark border-white/5 text-zinc-600'
                                    }`}
                            >
                                ♂ Masculino
                            </button>
                            <button
                                type="button"
                                onClick={() => handleChange('sexo', 'FEMALE')}
                                className={`py-3 rounded-xl border font-black text-xs uppercase tracking-widest transition-all ${form.sexo === 'FEMALE'
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
                    onClick={() => handleChange('criarAcesso', !form.criarAcesso)}
                    className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all ${form.criarAcesso
                        ? 'bg-indigo-600/10 border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.1)]'
                        : 'bg-surface-deep border-white/5'
                        }`}
                >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${form.criarAcesso ? 'border-indigo-500 bg-indigo-500' : 'border-zinc-700'
                        }`}>
                        {form.criarAcesso && <Check size={12} strokeWidth={3} className="text-white" />}
                    </div>
                    <div className="text-left">
                        <span className="text-white font-black text-xs uppercase tracking-wider block">Criar Acesso ao Portal</span>
                        <span className="text-zinc-500 text-[10px]">
                            Login com email e senha padrão (<span className="text-zinc-300 font-bold">{DEFAULT_ATHLETE_PASSWORD}</span>). Requer email.
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
