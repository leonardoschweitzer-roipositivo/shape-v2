/**
 * ProfileScreen — Tab PERFIL do Portal do Personal
 *
 * Dados básicos do personal + botão de logout.
 */

import React, { useState } from 'react'
import { Crown, KeyRound, LogOut, Mail, User } from 'lucide-react'
import { ScreenHeader } from './components/ScreenHeader'
import type { PersonalPortalContext } from '@/types/personal-portal'
import { useAuthStore } from '@/stores/authStore'
import { AlterarSenhaModal } from '@/components/organisms/AlterarSenhaModal'
import {
    PLANO_PERSONAL_LABEL,
    SUPORTE_WHATSAPP_URL,
    formatarLimiteAlunos,
    percentualUsoPlano,
} from '@/utils/planoPersonal'

interface ProfileScreenProps {
    contexto: PersonalPortalContext
    onLogout: () => void
}

export function ProfileScreen({ contexto, onLogout }: ProfileScreenProps) {
    const personal = useAuthStore(s => s.entity.personal)
    const [senhaAberta, setSenhaAberta] = useState(false)
    const plano = personal?.plano ?? 'FREE'
    const limite = personal?.limite_atletas ?? null
    const ativos = contexto.alunosNoPlano
    const uso = percentualUsoPlano(ativos, limite)
    const iniciais = contexto.nome
        .split(' ')
        .slice(0, 2)
        .map(n => n[0]?.toUpperCase() ?? '')
        .join('')

    return (
        <div className="min-h-screen bg-background-dark pb-24 px-4 pt-8 relative overflow-hidden">
            {/* Efeito de Gradiente de Topo (igual ao Aluno) */}
            <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-indigo-500/10 via-indigo-900/5 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10">
                <ScreenHeader
                    icon={<User size={16} className="text-indigo-400" />}
                    titulo="Perfil"
                    subtitulo="Personal Trainer"
                />

                {/* Avatar + dados Premium */}
                <div className="bg-surface-deep rounded-3xl p-8 border border-white/5 text-center mb-6 shadow-2xl relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all" />

                    <div className="relative">
                        <div className="w-24 h-24 rounded-[2rem] bg-zinc-900 border-2 border-indigo-500/30 flex items-center justify-center mx-auto mb-6 shadow-xl overflow-hidden p-1">
                            <div className="w-full h-full rounded-[1.75rem] overflow-hidden bg-zinc-800 flex items-center justify-center">
                                {contexto.fotoUrl
                                    ? <img src={contexto.fotoUrl} alt={contexto.nome} className="w-full h-full object-cover" />
                                    : <span className="text-indigo-400 text-3xl font-black">{iniciais}</span>
                                }
                            </div>
                        </div>
                    </div>

                    <h2 className="text-white text-2xl font-black tracking-tight">{contexto.nome}</h2>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 flex items-center justify-center gap-2">
                        <Mail size={12} className="text-indigo-400" />
                        {contexto.email}
                    </p>

                    <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <p className="text-white text-2xl font-black">{contexto.totalAlunos}</p>
                            <p className="text-zinc-600 text-[8px] font-black uppercase tracking-widest mt-1">Alunos</p>
                        </div>
                        <div className="text-center">
                            <p className="text-emerald-400 text-2xl font-black">{contexto.alunosAtivos}</p>
                            <p className="text-zinc-600 text-[8px] font-black uppercase tracking-widest mt-1">Ativos</p>
                        </div>
                        <div className="text-center">
                            <p className="text-rose-500 text-2xl font-black">{contexto.alunosAtencao}</p>
                            <p className="text-zinc-600 text-[8px] font-black uppercase tracking-widest mt-1">Atenção</p>
                        </div>
                    </div>
                </div>

                {/* Identificação */}
                <div className="bg-surface rounded-3xl border border-white/5 overflow-hidden mb-4">
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

                {/* Plano */}
                <div className="bg-surface rounded-3xl border border-white/5 p-5 mb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Crown size={16} className="text-amber-400" />
                            <div>
                                <p className="text-gray-400 text-xs">Plano atual</p>
                                <p className="text-white text-sm font-semibold">{PLANO_PERSONAL_LABEL[plano]}</p>
                            </div>
                        </div>
                        <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">{formatarLimiteAlunos(limite)}</p>
                    </div>
                    {uso != null && (
                        <div className="mt-4">
                            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                                <div className={`h-full rounded-full ${uso >= 100 ? 'bg-rose-500' : 'bg-indigo-500'}`} style={{ width: `${uso}%` }} />
                            </div>
                            <p className="text-zinc-500 text-[10px] mt-2">{ativos} de {limite} alunos ativos</p>
                        </div>
                    )}
                    {plano !== 'UNLIMITED' && (
                        <a href={SUPORTE_WHATSAPP_URL} target="_blank" rel="noreferrer" className="block mt-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                            Fazer upgrade
                        </a>
                    )}
                </div>

                <button
                    onClick={() => setSenhaAberta(true)}
                    className="w-full flex items-center justify-center gap-3 bg-white/5 text-gray-300 border border-white/10 rounded-2xl p-5 font-black uppercase tracking-[0.2em] text-[10px] mb-4 active:scale-95 transition-all"
                >
                    <KeyRound size={16} />
                    Alterar senha
                </button>
                <AlterarSenhaModal aberto={senhaAberta} onFechar={() => setSenhaAberta(false)} />

                {/* Logout Premium */}
                <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl p-5 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-rose-500/20 active:scale-95 transition-all shadow-xl"
                >
                    <LogOut size={16} />
                    Sair do Sistema
                </button>
            </div>
        </div>
    )
}
