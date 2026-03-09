/**
 * AthleteLogin — Tela de Login do Portal do Aluno
 *
 * Mobile-first, dark premium visual.
 * Pré-preenche email e senha a partir de query params da URL.
 * URL: /atleta?email=xxx&p=yyy
 */

import React, { useState, useEffect } from 'react'
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    LogIn,
    Loader2,
    KeyRound,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

interface AthleteLoginProps {
    onLoginSuccess: (atletaId: string) => void
    initialEmail?: string
    initialPassword?: string
}

const DEFAULT_PASSWORD = 'Shape2026!'

export function AthleteLogin({ onLoginSuccess, initialEmail, initialPassword }: AthleteLoginProps) {
    const { signIn } = useAuthStore()

    const [email, setEmail] = useState(initialEmail || '')
    const [password, setPassword] = useState(initialPassword || '')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Se recebeu credenciais via URL, tenta login automático
    useEffect(() => {
        if (initialEmail && initialPassword) {
            handleLogin(initialEmail, initialPassword)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleLogin = async (loginEmail?: string, loginPassword?: string) => {
        const e = loginEmail || email.trim()
        const p = loginPassword || password

        if (!e || !p) {
            setError('Preencha email e senha.')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const { error: authError } = await signIn(e, p)

            if (authError) {
                const msg = (authError as Error)?.message || ''
                if (msg.includes('Invalid login credentials')) {
                    setError('Email ou senha incorretos.')
                } else if (msg.includes('Email not confirmed')) {
                    setError('Conta não confirmada. Peça ao seu Personal para verificar.')
                } else {
                    setError('Erro ao fazer login. Tente novamente.')
                }
                setLoading(false)
                return
            }

            // Login OK — verificar se é ATLETA
            const state = useAuthStore.getState()
            const atletaId = state.entity?.atleta?.id

            if (!atletaId) {
                setError('Conta encontrada, mas não é uma conta de aluno.')
                setLoading(false)
                return
            }

            onLoginSuccess(atletaId)
        } catch (err) {
            setError('Erro de conexão. Verifique sua internet.')
            console.error('[AthleteLogin] Erro:', err)
            setLoading(false)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        handleLogin()
    }

    const handleForgotPassword = async () => {
        if (!email.trim()) {
            setError('Digite seu email primeiro para redefinir a senha.')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const { supabase } = await import('@/services/supabase')
            const { error } = await supabase.auth.resetPasswordForEmail(email.trim())

            if (error) {
                setError('Erro ao enviar email de redefinição.')
            } else {
                setError(null)
                alert('📧 Email de redefinição enviado! Verifique sua caixa de entrada.')
            }
        } catch {
            setError('Erro ao processar. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center px-6">
            {/* Logo / Brand */}
            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
                    <KeyRound size={28} className="text-white" />
                </div>
                <h1 className="text-2xl font-black text-white uppercase tracking-[0.2em]">
                    VITRU<span className="text-indigo-400">.</span>IA
                </h1>
                <p className="text-gray-500 text-xs mt-1 font-medium tracking-widest uppercase">
                    Portal do Atleta
                </p>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div className="relative">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Seu email"
                            autoComplete="email"
                            className="w-full bg-white/[0.03] text-white text-sm rounded-xl border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 outline-none pl-11 pr-4 py-3.5 placeholder-gray-600 transition-all"
                        />
                    </div>

                    {/* Senha */}
                    <div className="relative">
                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Sua senha"
                            autoComplete="current-password"
                            className="w-full bg-white/[0.03] text-white text-sm rounded-xl border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 outline-none pl-11 pr-12 py-3.5 placeholder-gray-600 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs text-center">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <LogIn size={16} />
                        )}
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                {/* Forgot Password */}
                <button
                    onClick={handleForgotPassword}
                    disabled={loading}
                    className="w-full mt-4 text-center text-gray-600 hover:text-gray-400 text-xs font-medium transition-colors"
                >
                    Esqueci minha senha
                </button>

                {/* Help */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600 text-[10px] leading-relaxed">
                        Sua senha padrão é <strong className="text-gray-400">{DEFAULT_PASSWORD}</strong>
                        <br />
                        Se não funcionar, peça ao seu Personal para reenviar o acesso.
                    </p>
                </div>
            </div>
        </div>
    )
}
