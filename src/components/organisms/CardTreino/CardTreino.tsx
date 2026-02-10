/**
 * CardTreino Component
 * 
 * Card do treino do dia com 4 estados possíveis:
 * - pendente: Treino disponível
 * - completo: Treino finalizado
 * - pulado: Treino pulado
 * - descanso: Dia de descanso
 */

import React from 'react'
import { Dumbbell, Check, SkipForward, Moon, Play } from 'lucide-react'
import { WorkoutOfDay } from '../../../types/athlete-portal'

interface CardTreinoProps {
    treino: WorkoutOfDay
    onVerTreino: () => void
    onCompletei: () => void
    onPular: () => void
}

const INTENSIDADE_EMOJI: Record<1 | 2 | 3 | 4, string> = {
    1: '😫',
    2: '😐',
    3: '💪',
    4: '🔥'
}

const INTENSIDADE_LABEL: Record<1 | 2 | 3 | 4, string> = {
    1: 'Difícil',
    2: 'Normal',
    3: 'Bom',
    4: 'Ótimo'
}

export function CardTreino({ treino, onVerTreino, onCompletei, onPular }: CardTreinoProps) {
    // Estado: DESCANSO
    if (treino.status === 'descanso') {
        return (
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center">
                        <Moon size={20} className="text-gray-400" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-gray-300">DIA DE DESCANSO</h3>
                    </div>
                </div>

                <p className="text-sm text-gray-400 mb-4">
                    Recuperação é essencial para os ganhos!
                </p>

                <p className="text-xs text-gray-500">
                    Próximo treino: Segunda (COSTAS)
                </p>
            </div>
        )
    }

    // Estado: COMPLETO
    if (treino.status === 'completo') {
        return (
            <div className="bg-green-500/10 rounded-xl p-6 border border-green-500/30">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check size={20} className="text-green-500" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-green-400">TREINO COMPLETO!</h3>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-300 mb-4">
                    <span>{treino.titulo}</span>
                    <span className="text-gray-600">•</span>
                    <span>{treino.duracao}min</span>
                    {treino.intensidade && (
                        <>
                            <span className="text-gray-600">•</span>
                            <span>
                                {INTENSIDADE_EMOJI[treino.intensidade]} {INTENSIDADE_LABEL[treino.intensidade]}
                            </span>
                        </>
                    )}
                </div>

                <button
                    onClick={onVerTreino}
                    className="text-sm text-green-400 hover:text-green-300 transition-colors"
                >
                    VER DETALHES →
                </button>
            </div>
        )
    }

    // Estado: PULADO
    if (treino.status === 'pulado') {
        return (
            <div className="bg-orange-500/10 rounded-xl p-6 border border-orange-500/30">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <SkipForward size={20} className="text-orange-500" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-orange-400">TREINO PULADO</h3>
                    </div>
                </div>

                <p className="text-sm text-gray-400">
                    {treino.titulo}
                </p>
            </div>
        )
    }

    // Estado: PENDENTE (padrão)
    return (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Dumbbell size={20} className="text-blue-400" />
                </div>
                <div className="flex-1">
                    <h3 className="text-base font-semibold text-white">TREINO DE HOJE</h3>
                </div>
                <span className="text-xs text-gray-400">
                    Dia {treino.diaAtual}/{treino.diasTotal}
                </span>
            </div>

            <div className="mb-4">
                <p className="text-lg font-semibold text-white mb-1">
                    {treino.titulo}
                </p>
                {treino.subtitulo && (
                    <p className="text-sm text-gray-400">
                        {treino.subtitulo}
                    </p>
                )}
            </div>

            <button
                onClick={onVerTreino}
                className="w-full py-2.5 px-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg text-sm font-medium text-blue-400 transition-colors mb-3 flex items-center justify-center gap-2"
            >
                <Play size={16} />
                VER TREINO COMPLETO
            </button>

            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={onCompletei}
                    className="py-2.5 px-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg text-sm font-medium text-green-400 transition-colors flex items-center justify-center gap-2"
                >
                    <Check size={16} />
                    COMPLETEI
                </button>

                <button
                    onClick={onPular}
                    className="py-2.5 px-4 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 transition-colors flex items-center justify-center gap-2"
                >
                    <SkipForward size={16} />
                    PULAR HOJE
                </button>
            </div>
        </div>
    )
}
