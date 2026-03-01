/**
 * HeaderHoje Component
 * 
 * Cabeçalho da tela HOJE com avatar, nome, dados, logo Vitru e personal
 */

import React from 'react'
import { Flame, User, Shield } from 'lucide-react'

interface HeaderHojeProps {
    nomeAtleta: string
    dataFormatada: string
    streak: number
    sexo?: string
    altura?: number
    peso?: number
    personalNome?: string
}

function getSaudacao(): string {
    const hora = new Date().getHours()
    if (hora < 12) return 'Bom dia'
    if (hora < 18) return 'Boa tarde'
    return 'Boa noite'
}

export function HeaderHoje({ nomeAtleta, dataFormatada, streak, sexo, altura, peso, personalNome }: HeaderHojeProps) {
    const saudacao = getSaudacao()
    const primeiroNome = nomeAtleta.split(' ')[0]

    const sexoLabel = sexo === 'MALE' ? 'MASCULINO' : sexo === 'FEMALE' ? 'FEMININO' : ''

    return (
        <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/15 via-indigo-900/5 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/8 via-transparent to-transparent" />

            <div className="relative px-6 pt-6 pb-4 space-y-4">
                {/* Top row: Avatar + Name + Vitru Logo */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0">
                        <User className="text-white" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-lg font-black text-white tracking-tight uppercase truncate">
                            {nomeAtleta}
                        </h1>
                        <div className="flex items-center gap-2 flex-wrap">
                            {sexoLabel && (
                                <span className="text-[9px] font-bold tracking-wider text-gray-500 uppercase">
                                    {sexoLabel}
                                </span>
                            )}
                            {altura && (
                                <>
                                    <span className="text-gray-700">•</span>
                                    <span className="text-[9px] font-bold tracking-wider text-gray-500">
                                        {altura} CM
                                    </span>
                                </>
                            )}
                            {peso && (
                                <>
                                    <span className="text-gray-700">•</span>
                                    <span className="text-[9px] font-bold tracking-wider text-gray-500">
                                        {peso} KG
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Vitru Logo */}
                    <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                        <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-indigo-300 font-black text-sm">V</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                            <span className="text-white font-black text-[8px] tracking-widest">VITRU</span>
                            <span className="text-indigo-400 font-black text-[7px] tracking-widest italic">IA</span>
                        </div>
                    </div>
                </div>

                {/* Personal + Streak row */}
                <div className="flex items-center justify-between">
                    {personalNome && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0A0F1C] rounded-lg border border-white/5">
                            <Shield className="text-indigo-400" size={11} />
                            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">
                                Personal: <span className="text-white">{personalNome}</span>
                            </span>
                        </div>
                    )}

                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-500/10 rounded-full border border-orange-500/20">
                        <Flame size={14} className="text-orange-500" />
                        <span className="text-xs font-bold text-orange-500">
                            {streak}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
