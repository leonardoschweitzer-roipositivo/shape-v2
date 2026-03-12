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
import { Dumbbell, Check, SkipForward, Moon, Play, ChevronDown, ChevronUp, Calendar, Clock, Pause, Timer, Video, Weight } from 'lucide-react'
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
    sessionTimer: ExercicioTimerState
    onExercicioTimersChange: (timers: Record<string, ExercicioTimerState>) => void
    onSessionTimerChange: (timer: ExercicioTimerState) => void
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

export function CardTreino({
    treino,
    proximoTreino,
    exerciciosFeitos,
    exercicioTimers,
    sessionTimer,
    onExercicioTimersChange,
    onSessionTimerChange,
    onVerTreino,
    onCompletei,
    onPular
}: CardTreinoProps) {
    const [accordionOpen, setAccordionOpen] = useState(treino.status === 'pendente')
    const [showCompleteiMenu, setShowCompleteiMenu] = useState(false)
    const completeiMenuRef = useRef<HTMLDivElement>(null)
    const [, forceUpdate] = useState(0) // for timer ticking
    const [exercicioBiblioteca, setExercicioBiblioteca] = useState<ExercicioBiblioteca | null>(null)

    // Fechar menu ao clicar fora
    useEffect(() => {
        if (!showCompleteiMenu) return undefined
        const handleClickOutside = (e: MouseEvent) => {
            if (completeiMenuRef.current && !completeiMenuRef.current.contains(e.target as Node)) {
                setShowCompleteiMenu(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [showCompleteiMenu])

    // Tick interval para atualizar timer global rodando
    useEffect(() => {
        if (sessionTimer.status !== 'running') return undefined
        const interval = setInterval(() => forceUpdate(n => n + 1), 1000)
        return () => clearInterval(interval)
    }, [sessionTimer.status])

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

    // Ações do timer GLOBAL
    const handleToggleGlobalTimer = () => {
        if (sessionTimer.status === 'running') {
            const elapsed = sessionTimer.inicioUltimoPlay ? Date.now() - sessionTimer.inicioUltimoPlay : 0
            onSessionTimerChange({
                ...sessionTimer,
                status: 'paused',
                tempoAcumuladoMs: sessionTimer.tempoAcumuladoMs + elapsed,
                inicioUltimoPlay: undefined,
            })
        } else {
            onSessionTimerChange({
                ...sessionTimer,
                status: 'running',
                inicioUltimoPlay: Date.now(),
            })
        }
    }

    const handleDoneExercicio = (id: string) => {
        const current = exercicioTimers[id] || { status: 'idle', tempoAcumuladoMs: 0 }
        const updated = {
            ...exercicioTimers,
            [id]: { ...current, status: 'done' as const },
        }
        onExercicioTimersChange(updated)

        // Verificar se todos os exercícios foram concluídos
        if (treino.exercicios && treino.exercicios.length > 0) {
            const todosFeitos = treino.exercicios.every(ex => updated[ex.id]?.status === 'done')
            if (todosFeitos) {
                // Se o timer global não estiver rodando, nem iniciamos a lógica de auto-complete total por enquanto
                // para não surpreender o usuário que quer clicar no botão grande.
            }
        }
    }

    const handleUndoExercicio = (id: string) => {
        const current = exercicioTimers[id]
        if (!current || current.status !== 'done') return

        onExercicioTimersChange({
            ...exercicioTimers,
            [id]: { ...current, status: 'idle' },
        })
    }

    // Handler para registrar carga (kg) do exercício
    const handleCargaChange = (id: string, carga: number | undefined) => {
        const current = exercicioTimers[id] || { status: 'idle', tempoAcumuladoMs: 0 }
        onExercicioTimersChange({
            ...exercicioTimers,
            [id]: { ...current, carga },
        })
    }

    // Estado: DESCANSO (mesmo código anterior)
    if (treino.status === 'descanso') {
        return (
            <div className="bg-surface-deep rounded-2xl border border-white/5 overflow-hidden">
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
            <div className="bg-amber-500/10 rounded-2xl p-6 border border-amber-500/20">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <Check size={20} className="text-amber-500" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-amber-500 uppercase tracking-wide">TREINO COMPLETO!</h3>
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
                    className="text-sm text-amber-500 hover:text-amber-400 transition-colors font-bold flex items-center gap-1"
                >
                    {accordionOpen ? 'OCULTAR DETALHES' : 'VER DETALHES'}
                    {accordionOpen ? <ChevronUp size={14} /> : <span>→</span>}
                </button>

                {accordionOpen && treino.exercicios && treino.exercicios.length > 0 && (
                    <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="bg-amber-500/5 rounded-xl p-4 border border-amber-500/10">
                            <div className="space-y-3">
                                {treino.exercicios.map((ex, i) => (
                                    <div
                                        key={ex.id}
                                        className="flex items-center gap-3 py-1 border-b border-amber-500/5 last:border-0 pb-2 last:pb-0"
                                    >
                                        <span className="text-xs text-amber-500/40 font-mono w-5">
                                            {(i + 1).toString().padStart(2, '0')}
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-sm text-amber-100/70 font-medium line-through decoration-amber-500/50">
                                                {ex.nome}
                                            </p>
                                        </div>
                                        <div className="bg-amber-500/10 px-2 py-1 rounded-md">
                                            <span className="text-[11px] text-amber-500 font-mono">
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
            <div className="bg-surface-deep rounded-2xl p-6 border border-white/5">
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

                <div className="flex items-start justify-between mb-6">
                    <div>
                        <p className="text-lg font-semibold text-white mb-1">
                            {treino.subtitulo?.includes(' — ') ? treino.subtitulo.split(' — ')[1] : treino.subtitulo}
                        </p>
                        <p className="text-sm text-gray-400">
                            {treino.titulo}
                        </p>
                    </div>

                    {/* Botão Global de Play/Pause e Timer */}
                    <div className="flex items-center gap-3">
                        {getTempoAtual(sessionTimer) > 0 && (
                            <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
                                <Timer size={14} className={sessionTimer.status === 'running' ? 'text-indigo-400 animate-pulse' : 'text-gray-500'} />
                                <span className="text-sm font-mono font-bold text-white">
                                    {formatTime(getTempoAtual(sessionTimer))}
                                </span>
                            </div>
                        )}

                        <button
                            onClick={handleToggleGlobalTimer}
                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-lg border ${sessionTimer.status === 'running'
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-amber-500/10'
                                : 'bg-indigo-600 border-indigo-500 text-white shadow-indigo-600/20 hover:bg-indigo-500'
                                }`}
                            title={sessionTimer.status === 'running' ? "Pausar Treino" : "Iniciar Treino"}
                        >
                            {sessionTimer.status === 'running' ? <Pause size={22} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                        </button>
                    </div>
                </div>

                {/* Lista de Exercícios Simplificada */}
                {treino.exercicios && treino.exercicios.length > 0 && (
                    <div className="mb-6 -mx-6 border-y border-white/5 animate-in fade-in duration-300">
                        {treino.exercicios.map((ex, idx) => {
                            const timer = exercicioTimers[ex.id]
                            const isDone = timer?.status === 'done'

                            return (
                                <div
                                    key={ex.id}
                                    className={`flex items-center gap-3 px-6 py-4 transition-all duration-300 ${idx !== treino.exercicios!.length - 1 ? 'border-b border-white/5' : ''
                                        } ${isDone ? 'opacity-50' : ''}`}
                                >
                                    {/* Botão de Check (Independente do Cronômetro) */}
                                    <button
                                        onClick={() => isDone ? handleUndoExercicio(ex.id) : handleDoneExercicio(ex.id)}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${isDone
                                            ? 'bg-emerald-500/20 hover:bg-emerald-500/30'
                                            : 'bg-white/5 hover:bg-white/10 border border-white/10'
                                            }`}
                                        title={isDone ? "Desmarcar" : "Marcar como feito"}
                                    >
                                        <Check
                                            size={16}
                                            className={`transition-all ${isDone ? 'text-emerald-400 scale-110' : 'text-gray-600'}`}
                                            strokeWidth={3}
                                        />
                                    </button>

                                    {/* Nome do exercício */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium transition-colors ${isDone ? 'text-gray-500 line-through' : 'text-gray-200'
                                            }`}>
                                            {ex.nome}
                                        </p>
                                    </div>

                                    {/* Controles e Info (Alinhados lateralmente) */}
                                    <div className="flex items-center gap-2">
                                        {/* Input de Carga (kg) - Próximo ao Vídeo */}
                                        {!isDone && treino.status === 'pendente' && (
                                            <input
                                                type="number"
                                                inputMode="decimal"
                                                step="0.5"
                                                min="0"
                                                placeholder="kg"
                                                value={timer?.carga ?? ''}
                                                onChange={e => {
                                                    const val = e.target.value
                                                    handleCargaChange(ex.id, val === '' ? undefined : Number(val))
                                                }}
                                                onClick={e => e.stopPropagation()}
                                                className="w-12 h-7 bg-white/[0.03] border border-white/10 rounded-lg text-[11px] text-indigo-300 font-mono placeholder-gray-600 outline-none focus:border-indigo-500/40 transition-colors text-center"
                                            />
                                        )}
                                        {isDone && timer?.carga !== undefined && timer.carga > 0 && (
                                            <span className="text-[10px] text-emerald-400/60 font-mono mr-1">
                                                {timer.carga}kg
                                            </span>
                                        )}

                                        {/* Botão de Vídeo 🎬 */}
                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation()
                                                // Busca na biblioteca por nome similar para garantir dados completos (vídeo, instruções, etc)
                                                // Se o exercício já tem bibliotecaId, usamos buscarPorId, senão buscarPorNomeSimilar
                                                let found: ExercicioBiblioteca | null = null;

                                                if (ex.bibliotecaId) {
                                                    found = await exercicioBibliotecaService.buscarPorId(ex.bibliotecaId);
                                                }

                                                if (!found) {
                                                    found = await exercicioBibliotecaService.buscarPorNomeSimilar(ex.nome);
                                                }

                                                setExercicioBiblioteca(found ?? {
                                                    id: ex.id,
                                                    nome: ex.nome,
                                                    grupo_muscular: (ex.foco?.toLowerCase().includes('peito') ? 'peito'
                                                        : ex.foco?.toLowerCase().includes('costas') ? 'costas'
                                                            : ex.foco?.toLowerCase().includes('ombro') ? 'ombros'
                                                                : ex.foco?.toLowerCase().includes('bíceps') || ex.foco?.toLowerCase().includes('biceps') ? 'biceps'
                                                                    : ex.foco?.toLowerCase().includes('tríceps') || ex.foco?.toLowerCase().includes('triceps') ? 'triceps'
                                                                        : ex.foco?.toLowerCase().includes('perna') || ex.foco?.toLowerCase().includes('coxa') ? 'quadriceps'
                                                                            : ex.foco?.toLowerCase().includes('glut') ? 'gluteos'
                                                                                : ex.foco?.toLowerCase().includes('abd') ? 'abdomen'
                                                                                    : 'peito') as never,
                                                    nivel: 'intermediario',
                                                    em_breve: !ex.videoUrl,
                                                    url_video: ex.videoUrl || null,
                                                    ativo: true,
                                                    descricao: ex.dica || undefined,
                                                    instrucoes: [],
                                                    dicas: [],
                                                    erros_comuns: [],
                                                    created_at: new Date().toISOString(),
                                                    updated_at: new Date().toISOString(),
                                                } as ExercicioBiblioteca)
                                            }}
                                            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${ex.videoUrl
                                                ? 'bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30'
                                                : 'bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20'
                                                }`}
                                            title={ex.videoUrl ? 'Assistir vídeo' : 'Ver detalhes'}
                                        >
                                            <Video size={13} className="text-indigo-400" />
                                        </button>

                                        {/* Timer ou Séries (Apenas Séries Agora) */}
                                        <div className="h-7 px-2 flex items-center rounded-lg bg-white/5">
                                            <span className="text-[11px] font-mono text-gray-400 whitespace-nowrap">
                                                {ex.series}×{ex.repeticoes}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                    {/* Botão COMPLETEI com mini-menu retroativo */}
                    <div className="relative" ref={completeiMenuRef}>
                        <button
                            onClick={() => setShowCompleteiMenu(!showCompleteiMenu)}
                            className="w-full py-2.5 px-4 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 rounded-xl text-sm font-bold text-amber-500 shadow-lg shadow-amber-500/10 transition-all flex items-center justify-center gap-2"
                        >
                            <Check size={16} strokeWidth={3} />
                            COMPLETEI
                            <ChevronDown size={14} className={`transition-transform duration-200 ${showCompleteiMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown: HOJE / ONTEM */}
                        {showCompleteiMenu && (
                            <div className="absolute bottom-full left-0 right-0 mb-2 bg-surface-deep border border-white/10 rounded-xl overflow-hidden shadow-xl shadow-black/40 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                <button
                                    onClick={() => {
                                        setShowCompleteiMenu(false)
                                        onCompletei()
                                    }}
                                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-amber-500/10 transition-colors border-b border-white/5"
                                >
                                    <Check size={16} className="text-amber-500" />
                                    <span className="text-sm font-semibold text-white">HOJE</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setShowCompleteiMenu(false)
                                        onCompletei(getOntemISO())
                                    }}
                                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-amber-500/10 transition-colors"
                                >
                                    <Clock size={16} className="text-amber-500/60" />
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
