/**
 * CardTreino Component
 * 
 * Card do treino do dia com 4 estados possíveis:
 * - pendente: Treino disponível
 * - completo: Treino finalizado
 * - pulado: Treino pulado
 * - descanso: Dia de descanso (com accordion do próximo treino)
 */

import React, { useState } from 'react'
import { Dumbbell, Check, SkipForward, Moon, Play, ChevronDown, ChevronUp, Calendar } from 'lucide-react'
import { WorkoutOfDay } from '../../../types/athlete-portal'
import type { ProximoTreino } from '../../../services/portalDataService'

interface CardTreinoProps {
    treino: WorkoutOfDay
    proximoTreino?: ProximoTreino | null
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

export function CardTreino({ treino, proximoTreino, onVerTreino, onCompletei, onPular }: CardTreinoProps) {
    const [accordionOpen, setAccordionOpen] = useState(treino.status === 'pendente')
    const [exerciciosFeitos, setExerciciosFeitos] = useState<Record<string, boolean>>({})

    const handleToggleExercicio = (id: string) => {
        const novoEstado = { ...exerciciosFeitos, [id]: !exerciciosFeitos[id] }
        setExerciciosFeitos(novoEstado)

        // Verificar se todos os exercícios do treino foram marcados
        if (treino.exercicios && treino.exercicios.length > 0) {
            const todosFeitos = treino.exercicios.every(ex => novoEstado[ex.id])
            if (todosFeitos) {
                // Pequeno delay para o aluno ver o último checkbox marcar antes de completar
                setTimeout(() => {
                    onCompletei()
                }, 400)
            }
        }
    }

    // Estado: DESCANSO (mesmo código anterior)
    if (treino.status === 'descanso') {
        return (
            <div className="bg-[#0C1220] rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
                            <Moon size={20} className="text-indigo-300" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white uppercase tracking-wide">DIA DE DESCANSO</h3>
                        </div>
                    </div>

                    <p className="text-sm text-gray-400 mb-2">
                        Recuperação é essencial para os ganhos!
                    </p>
                </div>

                {/* Accordion: Próximo Treino */}
                {proximoTreino && (
                    <div className="border-t border-white/5">
                        <button
                            onClick={() => setAccordionOpen(!accordionOpen)}
                            className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Calendar size={16} className="text-indigo-400" />
                                <div className="text-left">
                                    <span className="text-sm font-semibold text-white">
                                        Próximo: {proximoTreino.letraLabel}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-2">
                                        ({proximoTreino.grupoMuscular})
                                    </span>
                                </div>
                            </div>
                            {accordionOpen
                                ? <ChevronUp size={18} className="text-gray-500" />
                                : <ChevronDown size={18} className="text-gray-500" />
                            }
                        </button>

                        {accordionOpen && (
                            <div className="px-6 pb-5 space-y-3 animate-in slide-in-from-top-1">
                                {/* Data e nome */}
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                                        📅 {proximoTreino.data}
                                    </span>
                                </div>

                                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                                    <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wide">
                                        {proximoTreino.grupoMuscular}
                                    </h4>

                                    <div className="space-y-2">
                                        {proximoTreino.exercicios.map((ex, i) => (
                                            <div
                                                key={ex.id}
                                                className="flex items-center gap-3 py-1.5"
                                            >
                                                <span className="text-xs text-indigo-400 font-mono w-5 text-right">
                                                    {(i + 1).toString().padStart(2, '0')}
                                                </span>
                                                <div className="flex-1">
                                                    <span className="text-sm text-gray-300">
                                                        {ex.nome}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-500 font-mono">
                                                    {ex.series}×{ex.repeticoes}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        )
    }

    // Estado: COMPLETO (mesmo código anterior)
    if (treino.status === 'completo') {
        return (
            <div className="bg-emerald-500/10 rounded-2xl p-6 border border-emerald-500/20">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Check size={20} className="text-emerald-500" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-emerald-400 uppercase tracking-wide">TREINO COMPLETO!</h3>
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
                    onClick={() => {
                        setAccordionOpen(!accordionOpen)
                        onVerTreino()
                    }}
                    className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-bold flex items-center gap-1"
                >
                    {accordionOpen ? 'OCULTAR DETALHES' : 'VER DETALHES'}
                    {accordionOpen ? <ChevronUp size={14} /> : <span>→</span>}
                </button>

                {accordionOpen && treino.exercicios && treino.exercicios.length > 0 && (
                    <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/10">
                            <div className="space-y-3">
                                {treino.exercicios.map((ex, i) => (
                                    <div
                                        key={ex.id}
                                        className="flex items-center gap-3 py-1 border-b border-emerald-500/5 last:border-0 pb-2 last:pb-0"
                                    >
                                        <span className="text-xs text-emerald-500/40 font-mono w-5">
                                            {(i + 1).toString().padStart(2, '0')}
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-sm text-emerald-100 font-medium line-through decoration-emerald-500/50">
                                                {ex.nome}
                                            </p>
                                        </div>
                                        <div className="bg-emerald-500/10 px-2 py-1 rounded-md">
                                            <span className="text-[11px] text-emerald-400 font-mono">
                                                {ex.series}×{ex.repeticoes}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    // Estado: PULADO
    if (treino.status === 'pulado') {
        return (
            <div className="bg-orange-500/10 rounded-2xl p-6 border border-orange-500/20">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <SkipForward size={20} className="text-orange-500" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-orange-400 uppercase tracking-wide">TREINO PULADO</h3>
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
        <div className="bg-[#0C1220] rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <Dumbbell size={20} className="text-indigo-400" />
                </div>
                <div className="flex-1">
                    <h3 className="text-base font-bold text-white uppercase tracking-wide">TREINO DE HOJE</h3>
                </div>
                <span className="text-xs text-gray-400">
                    Dia {treino.diaAtual}/{treino.diasTotal}
                </span>
            </div>

            <div className="mb-6">
                <p className="text-lg font-semibold text-white mb-1">
                    {treino.titulo}
                </p>
                {treino.subtitulo && (
                    <p className="text-sm text-gray-400">
                        {treino.subtitulo}
                    </p>
                )}
            </div>

            {/* Lista de Exercícios (Fixa e com Checkboxes) */}
            {treino.exercicios && treino.exercicios.length > 0 && (
                <div className="mb-6 space-y-3 animate-in fade-in duration-300">
                    <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                        <h4 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-[0.2em]">
                            Lista de Exercícios
                        </h4>
                        <div className="space-y-4">
                            {treino.exercicios.map((ex, i) => (
                                <div
                                    key={ex.id}
                                    className="flex items-center gap-4 group cursor-pointer"
                                    onClick={() => handleToggleExercicio(ex.id)}
                                >
                                    {/* Custom Checkbox */}
                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${exerciciosFeitos[ex.id]
                                            ? 'bg-indigo-500 border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                                            : 'border-white/10 bg-white/5 group-hover:border-white/20'
                                        }`}>
                                        {exerciciosFeitos[ex.id] && <Check size={14} className="text-white" strokeWidth={3} />}
                                    </div>

                                    <div className="flex-1">
                                        <p className={`text-sm font-medium transition-colors ${exerciciosFeitos[ex.id] ? 'text-gray-500 line-through' : 'text-gray-200'
                                            }`}>
                                            {ex.nome}
                                        </p>
                                        {ex.foco && !exerciciosFeitos[ex.id] && (
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">
                                                {ex.foco}
                                            </p>
                                        )}
                                    </div>

                                    <div className={`px-2 py-1 rounded-md transition-colors ${exerciciosFeitos[ex.id] ? 'bg-white/[0.02]' : 'bg-white/5'
                                        }`}>
                                        <span className={`text-[11px] font-mono transition-colors ${exerciciosFeitos[ex.id] ? 'text-gray-700' : 'text-gray-400'
                                            }`}>
                                            {ex.series}×{ex.repeticoes}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={onCompletei}
                    className="py-2.5 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-sm font-bold text-emerald-400 transition-colors flex items-center justify-center gap-2"
                >
                    <Check size={16} />
                    COMPLETEI
                </button>

                <button
                    onClick={onPular}
                    className="py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-gray-400 transition-colors flex items-center justify-center gap-2"
                >
                    <SkipForward size={16} />
                    PULAR HOJE
                </button>
            </div>
        </div>
    )
}
