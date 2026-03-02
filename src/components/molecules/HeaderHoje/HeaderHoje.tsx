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
        <div className="relative overflow-hidden mb-2">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/15 via-indigo-900/5 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/8 via-transparent to-transparent" />

            <div className="relative px-6 pt-8 pb-2">
                <div className="flex justify-between items-center">
                    <div className="flex-1">
                        <span className="text-[9px] font-bold tracking-[0.2em] text-indigo-400 uppercase">
                            {dataFormatada}
                        </span>
                        <h1 className="text-xl font-black text-white tracking-tight uppercase leading-tight mt-1">
                            O Que Temos <br className="hidden sm:block" />Para Hoje
                        </h1>

                        <div className="flex items-center gap-2 mt-2">
                            <User size={12} className="text-gray-500" />
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                Atleta: <span className="text-white">{nomeAtleta}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 flex-shrink-0">
                        {/* Streak Badge */}
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-500/10 rounded-full border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
                            <Flame size={12} className="text-orange-500" />
                            <span className="text-[10px] font-black tracking-widest text-orange-400">
                                {streak} DIAS
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
