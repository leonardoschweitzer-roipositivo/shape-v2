/**
 * AtletaIndependentePortal — Portal Mobile do Atleta Independente
 *
 * Placeholder para atletas que criaram conta diretamente (sem personal_id).
 * Rota: /meu-portal
 * Mobile-first, estilo VITRU premium.
 */

import React from 'react'
import { Dumbbell, LogOut, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

interface AtletaIndependentePortalProps {
    onLogout?: () => void
}

export function AtletaIndependentePortal({ onLogout }: AtletaIndependentePortalProps) {
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
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20">
                    <Dumbbell size={36} className="text-white" />
                </div>
                <h1 className="text-2xl font-black text-white uppercase tracking-[0.2em]">
                    VITRU<span className="text-indigo-400">.</span>IA
                </h1>
                <p className="text-gray-500 text-xs mt-1 font-medium tracking-widest uppercase">
                    Portal do Atleta
                </p>
            </div>

            {/* Welcome Card */}
            <div className="w-full max-w-sm bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-indigo-400">
                    <Sparkles size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Em Breve</span>
                </div>

                <h2 className="text-xl font-bold text-white">
                    Olá{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 👋
                </h2>

                <p className="text-gray-400 text-sm leading-relaxed">
                    Seu portal exclusivo está sendo preparado com funcionalidades incríveis para acompanhar sua evolução.
                </p>

                <div className="pt-2 space-y-2 text-left">
                    <div className="flex items-center gap-3 text-gray-500 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        Acompanhamento de medidas e evolução
                    </div>
                    <div className="flex items-center gap-3 text-gray-500 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        Score Vitruviano e métricas IA
                    </div>
                    <div className="flex items-center gap-3 text-gray-500 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Planos de treino e dieta personalizados
                    </div>
                </div>
            </div>

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="mt-8 flex items-center gap-2 text-gray-600 hover:text-gray-400 text-xs font-medium transition-colors"
            >
                <LogOut size={14} />
                Sair da conta
            </button>
        </div>
    )
}
