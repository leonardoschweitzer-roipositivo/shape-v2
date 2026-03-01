/**
 * HeaderHoje Component
 * 
 * Cabeçalho da tela HOJE com saudação personalizada e streak
 */

import React from 'react'
import { Flame } from 'lucide-react'

interface HeaderHojeProps {
    nomeAtleta: string
    dataFormatada: string
    streak: number
}

function getSaudacao(): string {
    const hora = new Date().getHours()
    if (hora < 12) return 'Bom dia'
    if (hora < 18) return 'Boa tarde'
    return 'Boa noite'
}

export function HeaderHoje({ nomeAtleta, dataFormatada, streak }: HeaderHojeProps) {
    const saudacao = getSaudacao()
    const primeiroNome = nomeAtleta.split(' ')[0]

    return (
        <div className="flex items-center justify-between px-6 py-4 bg-[#060B18] border-b border-white/5">
            <div>
                <h1 className="text-lg font-black text-white tracking-tight">
                    {saudacao}, {primeiroNome}! 👋
                </h1>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-500/10 rounded-full border border-orange-500/20">
                <Flame size={16} className="text-orange-500" />
                <span className="text-sm font-bold text-orange-500">
                    {streak}
                </span>
            </div>
        </div>
    )
}
