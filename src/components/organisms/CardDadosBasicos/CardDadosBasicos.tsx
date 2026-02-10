/**
 * CardDadosBasicos Component
 * 
 * Card com dados básicos do atleta (altura, idade, objetivo)
 */

import React from 'react'
import { Ruler, Calendar, Target } from 'lucide-react'
import { DadosBasicos } from '../../../types/athlete-portal'

interface CardDadosBasicosProps {
    dados: DadosBasicos
}

export function CardDadosBasicos({ dados }: CardDadosBasicosProps) {
    return (
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Dados Básicos
            </h3>

            <div className="space-y-3">
                {/* Altura */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                        <Ruler size={18} className="text-teal-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500">Altura</p>
                        <p className="text-sm font-semibold text-white">{dados.altura} cm</p>
                    </div>
                </div>

                {/* Idade */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Calendar size={18} className="text-purple-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500">Idade</p>
                        <p className="text-sm font-semibold text-white">{dados.idade} anos</p>
                    </div>
                </div>

                {/* Objetivo */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <Target size={18} className="text-orange-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500">Objetivo</p>
                        <p className="text-sm font-semibold text-white">{dados.objetivo}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
