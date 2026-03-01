/**
 * HeaderHoje Component
 * 
 * Cabeçalho da tela HOJE com avatar, nome, personal, logo Vitru e streak
 */

import React from 'react'
import { Flame, User } from 'lucide-react'

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

export function HeaderHoje({ nomeAtleta, dataFormatada, streak, personalNome }: HeaderHojeProps) {
    return (
        <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/15 via-indigo-900/5 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/8 via-transparent to-transparent" />

            <div className="relative px-5 pt-6 pb-4">
                {/* Single row: Avatar + Name/Personal + Streak + Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0">
                        <User className="text-white" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-lg font-black text-white tracking-tight uppercase truncate">
                            {nomeAtleta}
                        </h1>
                        {personalNome && (
                            <span className="text-[10px] text-gray-500 font-bold tracking-wider uppercase">
                                Personal: <span className="text-gray-400">{personalNome}</span>
                            </span>
                        )}
                    </div>

                    {/* Streak + Vitru Logo */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Streak */}
                        <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/10 rounded-full border border-orange-500/20">
                            <Flame size={13} className="text-orange-500" />
                            <span className="text-[11px] font-bold text-orange-500">
                                {streak}
                            </span>
                        </div>

                        {/* Vitru Logo */}
                        <div className="flex flex-col items-center gap-0.5">
                            <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                                <span className="text-indigo-300 font-black text-sm">V</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                                <span className="text-white font-black text-[7px] tracking-widest">VITRU</span>
                                <span className="text-indigo-400 font-black text-[6px] tracking-widest italic">IA</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
