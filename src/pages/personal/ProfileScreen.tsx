/**
 * ProfileScreen — Tab PERFIL do Portal do Personal
 *
 * Dados básicos do personal + botão de logout.
 */

import React from 'react'
import { LogOut, Mail, User } from 'lucide-react'
import type { PersonalPortalContext } from '@/types/personal-portal'

interface ProfileScreenProps {
    contexto: PersonalPortalContext
    onLogout: () => void
}

export function ProfileScreen({ contexto, onLogout }: ProfileScreenProps) {
    const iniciais = contexto.nome
        .split(' ')
        .slice(0, 2)
        .map(n => n[0]?.toUpperCase() ?? '')
        .join('')

    return (
        <div className="min-h-screen bg-[#060B18] pb-24 px-4 pt-6">
            <h1 className="text-white text-xl font-black mb-6">Perfil</h1>

            {/* Avatar + dados */}
            <div className="bg-[#111827] rounded-2xl p-5 border border-white/5 text-center mb-4">
                <div className="w-20 h-20 rounded-full bg-[var(--color-gold)]/10 border-2 border-[var(--color-gold)]/30 flex items-center justify-center mx-auto mb-4">
                    {contexto.fotoUrl
                        ? <img src={contexto.fotoUrl} alt={contexto.nome} className="w-20 h-20 rounded-full object-cover" />
                        : <span className="text-[var(--color-gold)] text-2xl font-black">{iniciais}</span>
                    }
                </div>
                <h2 className="text-white text-xl font-black">{contexto.nome}</h2>
                <p className="text-gray-400 text-sm mt-1 flex items-center justify-center gap-1.5">
                    <Mail size={13} />
                    {contexto.email}
                </p>
                <div className="mt-4 pt-4 border-t border-white/5 flex justify-center gap-8">
                    <div className="text-center">
                        <p className="text-white text-xl font-black">{contexto.totalAlunos}</p>
                        <p className="text-gray-500 text-xs">Alunos</p>
                    </div>
                    <div className="text-center">
                        <p className="text-emerald-400 text-xl font-black">{contexto.alunosAtivos}</p>
                        <p className="text-gray-500 text-xs">Ativos</p>
                    </div>
                    <div className="text-center">
                        <p className="text-red-400 text-xl font-black">{contexto.alunosAtencao}</p>
                        <p className="text-gray-500 text-xs">Atenção</p>
                    </div>
                </div>
            </div>

            {/* Identificação */}
            <div className="bg-[#111827] rounded-2xl border border-white/5 overflow-hidden mb-4">
                <div className="flex items-center gap-3 p-4 border-b border-white/5">
                    <User size={16} className="text-gray-500" />
                    <div>
                        <p className="text-gray-400 text-xs">Personal Trainer</p>
                        <p className="text-white text-sm font-semibold">{contexto.nome}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-4">
                    <Mail size={16} className="text-gray-500" />
                    <div>
                        <p className="text-gray-400 text-xs">Email</p>
                        <p className="text-white text-sm font-semibold">{contexto.email}</p>
                    </div>
                </div>
            </div>

            {/* Logout */}
            <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl p-4 font-bold hover:bg-red-500/20 transition-colors"
            >
                <LogOut size={18} />
                Sair do Portal
            </button>
        </div>
    )
}
