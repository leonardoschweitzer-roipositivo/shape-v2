/**
 * CardTreino Component
 * 
 * Card do treino do dia com 4 estados possíveis:
 * - pendente: Treino disponível
 * - completo: Treino finalizado
 * - pulado: Treino pulado
 * - descanso: Dia de descanso (com accordion do próximo treino)
 */

import React, { useState, useRef, useEffect } from 'react'
import { Dumbbell, Check, SkipForward, Moon, Play, ChevronDown, ChevronUp, Calendar, Clock, Pause, Timer, Video } from 'lucide-react'
import { WorkoutOfDay } from '../../../types/athlete-portal'
import type { ExercicioTimerState } from '../../../types/athlete-portal'
import type { ProximoTreino } from '../../../services/portalDataService'
import { ExercicioDetalheModal } from '../../molecules/ExercicioDetalheModal'
import { exercicioBibliotecaService } from '../../../services/exercicioBiblioteca.service'
import type { ExercicioBiblioteca } from '../../../types/exercicio-biblioteca'

interface CardTreinoProps {
    treino: WorkoutOfDay
    proximoTreino?: ProximoTreino | null
    exerciciosFeitos: Record<string, boolean>
    exercicioTimers: Record<string, ExercicioTimerState>
    onExercicioTimersChange: (timers: Record<string, ExercicioTimerState>) => void
    onVerTreino: () => void
    onCompletei: (dataOverride?: string) => void
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

/** Formata milissegundos em mm:ss */
function formatTime(ms: number): string {
    const totalSec = Math.floor(ms / 1000)
    const min = Math.floor(totalSec / 60)
    const sec = totalSec % 60
    return `${min}:${sec.toString().padStart(2, '0')}`
}

export function CardTreino({ treino, proximoTreino, exerciciosFeitos, exercicioTimers, onExercicioTimersChange, onVerTreino, onCompletei, onPular }: CardTreinoProps) {
    const [accordionOpen, setAccordionOpen] = useState(treino.status === 'pendente')
    const [showCompleteiMenu, setShowCompleteiMenu] = useState(false)
    const completeiMenuRef = useRef<HTMLDivElement>(null)
    const [, forceUpdate] = useState(0) // for timer ticking
    const [exercicioBiblioteca, setExercicioBiblioteca] = useState<ExercicioBiblioteca | null>(null)

    // Fechar menu ao clicar fora
    useEffect(() => {
        if (!showCompleteiMenu) return
        const handleClickOutside = (e: MouseEvent) => {
            if (completeiMenuRef.current && !completeiMenuRef.current.contains(e.target as Node)) {
                setShowCompleteiMenu(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [showCompleteiMenu])

    // Tick interval para atualizar timers rodando
    useEffect(() => {
        const hasRunning = Object.values(exercicioTimers).some(t => t.status === 'running')
        if (!hasRunning) return
        const interval = setInterval(() => forceUpdate(n => n + 1), 1000)
        return () => clearInterval(interval)
    }, [exercicioTimers])

    // Data de ontem em 'YYYY-MM-DD'
    const getOntemISO = (): string => {
        const d = new Date()
        d.setDate(d.getDate() - 1)
        return d.toISOString().split('T')[0]
    }

    // Calcular tempo atual de um exercício (incluindo tempo rodando)
    const getTempoAtual = (timer: ExercicioTimerState | undefined): number => {
        if (!timer) return 0
        if (timer.status === 'running' && timer.inicioUltimoPlay) {
            return timer.tempoAcumuladoMs + (Date.now() - timer.inicioUltimoPlay)
        }
        return timer.tempoAcumuladoMs
    }

    // Ações do timer
    const handlePlayExercicio = (id: string) => {
        const current = exercicioTimers[id] || { status: 'idle', tempoAcumuladoMs: 0 }
        onExercicioTimersChange({
            ...exercicioTimers,
            [id]: { ...current, status: 'running', inicioUltimoPlay: Date.now() },
        })
    }

    const handlePauseExercicio = (id: string) => {
        const current = exercicioTimers[id]
        if (!current || current.status !== 'running') return
        const elapsed = current.inicioUltimoPlay ? Date.now() - current.inicioUltimoPlay : 0
        onExercicioTimersChange({
            ...exercicioTimers,
            [id]: { ...current, status: 'paused', tempoAcumuladoMs: current.tempoAcumuladoMs + elapsed, inicioUltimoPlay: undefined },
        })
    }

    const handleDoneExercicio = (id: string) => {
        const current = exercicioTimers[id] || { status: 'idle', tempoAcumuladoMs: 0 }
        let finalMs = current.tempoAcumuladoMs
        if (current.status === 'running' && current.inicioUltimoPlay) {
            finalMs += Date.now() - current.inicioUltimoPlay
        }
        const updated = {
            ...exercicioTimers,
            [id]: { status: 'done' as const, tempoAcumuladoMs: finalMs, inicioUltimoPlay: undefined },
        }
        onExercicioTimersChange(updated)

        // Verificar se todos os exercícios foram concluídos
        if (treino.exercicios && treino.exercicios.length > 0) {
            const todosFeitos = treino.exercicios.every(ex => updated[ex.id]?.status === 'done')
            if (todosFeitos) {
                setTimeout(() => onCompletei(), 600)
            }
        }
    }

    const handleUndoExercicio = (id: string) => {
        const current = exercicioTimers[id]
        if (!current || current.status !== 'done') return

        onExercicioTimersChange({
            ...exercicioTimers,
            [id]: { ...current, status: 'paused', inicioUltimoPlay: undefined },
        })
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

                                {/* Botão para treinar no dia de descanso */}
                                <div className="pt-2">
                                    <button
                                        onClick={onPular}
                                        className="w-full py-2.5 px-4 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-sm font-bold text-indigo-400 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Dumbbell size={16} />
                                        TREINAR HOJE (PULAR DESCANSO)
                                    </button>
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
        <>
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

                {/* Lista de Exercícios com Timer */}
                {treino.exercicios && treino.exercicios.length > 0 && (
                    <div className="mb-6 space-y-3 animate-in fade-in duration-300">
                        <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                            <h4 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-[0.2em]">
                                Lista de Exercícios
                            </h4>
                            <div className="space-y-3">
                                {treino.exercicios.map((ex) => {
                                    const timer = exercicioTimers[ex.id]
                                    const timerStatus = timer?.status || 'idle'
                                    const tempoMs = getTempoAtual(timer)
                                    const isDone = timerStatus === 'done'
                                    const isRunning = timerStatus === 'running'
                                    const isPaused = timerStatus === 'paused'

                                    return (
                                        <div
                                            key={ex.id}
                                            className={`rounded-xl p-3 transition-all duration-300 ${isDone
                                                ? 'bg-emerald-500/5 border border-emerald-500/10'
                                                : isRunning
                                                    ? 'bg-indigo-500/5 border border-indigo-500/20'
                                                    : 'bg-white/[0.02] border border-white/5'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {/* Botão de ação do timer */}
                                                {isDone ? (
                                                    <button
                                                        onClick={() => handleUndoExercicio(ex.id)}
                                                        className="w-8 h-8 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 flex items-center justify-center flex-shrink-0 transition-colors group/undo"
                                                        title="Desmarcar exercício"
                                                    >
                                                        <Check size={16} className="text-emerald-400 group-hover/undo:scale-90 transition-transform" strokeWidth={3} />
                                                    </button>
                                                ) : isRunning ? (
                                                    <button
                                                        onClick={() => handlePauseExercicio(ex.id)}
                                                        className="w-8 h-8 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 flex items-center justify-center flex-shrink-0 transition-colors"
                                                    >
                                                        <Pause size={16} className="text-amber-400" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handlePlayExercicio(ex.id)}
                                                        className="w-8 h-8 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 flex items-center justify-center flex-shrink-0 transition-colors"
                                                    >
                                                        <Play size={14} className="text-indigo-400 ml-0.5" />
                                                    </button>
                                                )}

                                                {/* Nome do exercício */}
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-medium transition-colors ${isDone ? 'text-gray-500 line-through' : 'text-gray-200'
                                                        }`}>
                                                        {ex.nome}
                                                    </p>
                                                    {ex.foco && !isDone && (
                                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">
                                                            {ex.foco}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Botão de Vídeo 🎬 */}
                                                <button
                                                    onClick={async (e) => {
                                                        e.stopPropagation()
                                                        // Busca na biblioteca pelo nome do exercício
                                                        const found = await exercicioBibliotecaService.buscarPorNomeSimilar(ex.nome)
                                                        setExercicioBiblioteca(found ?? {
                                                            id: ex.id,
                                                            nome: ex.nome,
                                                            grupo_muscular: 'peito',
                                                            nivel: 'intermediario',
                                                            em_breve: true,
                                                            ativo: true,
                                                            descricao: ex.dica || undefined,
                                                            created_at: new Date().toISOString(),
                                                            updated_at: new Date().toISOString(),
                                                        } as ExercicioBiblioteca)
                                                    }}
                                                    className="w-7 h-7 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 transition-colors"
                                                    title="Ver vídeo"
                                                >
                                                    <Video size={13} className="text-indigo-400" />
                                                </button>

                                                {/* Timer ou Séries */}
                                                {(isRunning || isPaused || isDone) && tempoMs > 0 ? (
                                                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${isDone ? 'bg-emerald-500/10' : isRunning ? 'bg-indigo-500/10' : 'bg-white/5'
                                                        }`}>
                                                        <Timer size={12} className={isDone ? 'text-emerald-400' : isRunning ? 'text-indigo-400 animate-pulse' : 'text-gray-400'} />
                                                        <span className={`text-xs font-mono font-bold ${isDone ? 'text-emerald-400' : isRunning ? 'text-indigo-300' : 'text-gray-300'
                                                            }`}>
                                                            {formatTime(tempoMs)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="px-2 py-1 rounded-md bg-white/5">
                                                        <span className="text-[11px] font-mono text-gray-400">
                                                            {ex.series}×{ex.repeticoes}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Botão FEITO (só aparece quando running ou paused) */}
                                                {(isRunning || isPaused) && (
                                                    <button
                                                        onClick={() => handleDoneExercicio(ex.id)}
                                                        className="w-8 h-8 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 flex items-center justify-center flex-shrink-0 transition-colors"
                                                    >
                                                        <Check size={16} className="text-emerald-400" strokeWidth={3} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                    {/* Botão COMPLETEI com mini-menu retroativo */}
                    <div className="relative" ref={completeiMenuRef}>
                        <button
                            onClick={() => setShowCompleteiMenu(!showCompleteiMenu)}
                            className="w-full py-2.5 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-sm font-bold text-emerald-400 transition-colors flex items-center justify-center gap-2"
                        >
                            <Check size={16} />
                            COMPLETEI
                            <ChevronDown size={14} className={`transition-transform duration-200 ${showCompleteiMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown: HOJE / ONTEM */}
                        {showCompleteiMenu && (
                            <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#0C1220] border border-white/10 rounded-xl overflow-hidden shadow-xl shadow-black/40 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                <button
                                    onClick={() => {
                                        setShowCompleteiMenu(false)
                                        onCompletei()
                                    }}
                                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-emerald-500/10 transition-colors border-b border-white/5"
                                >
                                    <Check size={16} className="text-emerald-400" />
                                    <span className="text-sm font-semibold text-white">HOJE</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setShowCompleteiMenu(false)
                                        onCompletei(getOntemISO())
                                    }}
                                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-indigo-500/10 transition-colors"
                                >
                                    <Clock size={16} className="text-indigo-400" />
                                    <span className="text-sm font-semibold text-white">ONTEM</span>
                                    <span className="text-[10px] text-gray-500 ml-auto">Esqueci de marcar</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={onPular}
                        className="py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-gray-400 transition-colors flex items-center justify-center gap-2"
                    >
                        <SkipForward size={16} />
                        PULAR HOJE
                    </button>
                </div>
            </div>

            {/* Modal de detalhes/vídeo do exercício */}
            {
                exercicioBiblioteca && (
                    <ExercicioDetalheModal
                        exercicio={exercicioBiblioteca}
                        onFechar={() => setExercicioBiblioteca(null)}
                    />
                )
            }
        </>
    )
}
