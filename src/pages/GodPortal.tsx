/**
 * GodPortal — Portal Mobile do GOD (Admin)
 *
 * Placeholder para admins acessando via mobile.
 * Rota: /god
 * Mobile-first, estilo VITRU premium.
 */

import React from 'react'
import { Shield, LogOut, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

interface GodPortalProps {
    onLogout?: () => void
}

export function GodPortal({ onLogout }: GodPortalProps) {
    const { signOut, profile } = useAuthStore()

    const handleLogout = async () => {
        await signOut()
        if (onLogout) onLogout()
        else window.location.href = '/'
    }

    return (
        <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center px-6">
            {/* Logo */}
            <div className="text-center mb-10">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-400/20">
                    <Shield size={36} className="text-white" />
                </div>
                <h1 className="text-2xl font-black text-white uppercase tracking-[0.2em]">
                    VITRU<span className="text-amber-400">.</span>IA
                </h1>
                <p className="text-amber-400/60 text-xs mt-1 font-medium tracking-widest uppercase">
                    Portal GOD
                </p>
            </div>

            {/* Welcome Card */}
            <div className="w-full max-w-sm bg-white/[0.03] border border-amber-500/20 rounded-2xl p-8 text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-amber-400">
                    <Sparkles size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Em Breve</span>
                </div>

                <h2 className="text-xl font-bold text-white">
                    Olá{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''} 🔱
                </h2>

                <p className="text-gray-400 text-sm leading-relaxed">
                    O painel GOD mobile está em desenvolvimento para controle rápido de onde estiver.
                </p>

                <div className="pt-2 space-y-2 text-left">
                    <div className="flex items-center gap-3 text-gray-500 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        Visão global de academias e personais
                    </div>
                    <div className="flex items-center gap-3 text-gray-500 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Métricas do sistema em tempo real
                    </div>
                    <div className="flex items-center gap-3 text-gray-500 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                        Gestão de usuários e permissões
                    </div>
                </div>
            </div>

            {/* Tip */}
            <div className="mt-6 w-full max-w-sm text-center">
                <p className="text-gray-600 text-[10px] leading-relaxed">
                    💻 Para funcionalidades completas, acesse pelo computador.
                </p>
            </div>

            {/* Footer Logout */}
            <div className="mt-auto py-10 text-center opacity-30 hover:opacity-100 transition-opacity">
                <button
                    onClick={handleLogout}
                    className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium"
                >
                    Sair da conta
                </button>
            </div>
        </div>
    )
}
