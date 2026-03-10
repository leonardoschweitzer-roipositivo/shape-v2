/**
 * AcademiaPortal — Portal Mobile da Academia
 *
 * Placeholder para academias acessando via mobile.
 * Rota: /academia/:academiaId
 * Mobile-first, estilo VITRU premium.
 */

import React from 'react'
import { Building2, LogOut, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

interface AcademiaPortalProps {
    academiaId: string
    onLogout?: () => void
}

export function AcademiaPortal({ academiaId, onLogout }: AcademiaPortalProps) {
    const { signOut, entity } = useAuthStore()

    const nomeAcademia = entity?.academia?.nome || 'Academia'

    const handleLogout = async () => {
        await signOut()
        if (onLogout) onLogout()
        else window.location.href = '/'
    }

    return (
        <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center px-6">
            {/* Logo */}
            <div className="text-center mb-10">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/20">
                    <Building2 size={36} className="text-white" />
                </div>
                <h1 className="text-2xl font-black text-white uppercase tracking-[0.2em]">
                    VITRU<span className="text-amber-400">.</span>IA
                </h1>
                <p className="text-gray-500 text-xs mt-1 font-medium tracking-widest uppercase">
                    Portal da Academia
                </p>
            </div>

            {/* Welcome Card */}
            <div className="w-full max-w-sm bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-amber-400">
                    <Sparkles size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Em Breve</span>
                </div>

                <h2 className="text-xl font-bold text-white">
                    {nomeAcademia} 🏋️
                </h2>

                <p className="text-gray-400 text-sm leading-relaxed">
                    O portal mobile da sua academia está sendo desenvolvido para facilitar a gestão no dia a dia.
                </p>

                <div className="pt-2 space-y-2 text-left">
                    <div className="flex items-center gap-3 text-gray-500 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Visão geral dos personais e alunos
                    </div>
                    <div className="flex items-center gap-3 text-gray-500 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                        Alertas e notificações rápidas
                    </div>
                    <div className="flex items-center gap-3 text-gray-500 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                        Métricas de performance da academia
                    </div>
                </div>
            </div>

            {/* Tip */}
            <div className="mt-6 w-full max-w-sm text-center">
                <p className="text-gray-600 text-[10px] leading-relaxed">
                    💻 Para funcionalidades completas, acesse pelo computador em <strong className="text-gray-400">app.vitruia.com</strong>
                </p>
            </div>

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="mt-6 flex items-center gap-2 text-gray-600 hover:text-gray-400 text-xs font-medium transition-colors"
            >
                <LogOut size={14} />
                Sair da conta
            </button>
        </div>
    )
}
