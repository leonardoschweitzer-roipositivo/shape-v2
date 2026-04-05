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
import { Dumbbell, Check, SkipForward, Moon, Play, ChevronDown, ChevronUp, Calendar, Clock, Pause, Timer, Video, Plus } from 'lucide-react'
import { WorkoutOfDay, ExercicioTreino } from '../../../types/athlete-portal'
import type { ExercicioTimerState, SetExecutado, UltimaExecucao } from '../../../types/athlete-portal'
import type { ProximoTreino } from '../../../services/portalDataService'
import { ExercicioDetalheModal } from '../../molecules/ExercicioDetalheModal'
import { exercicioBibliotecaService } from '../../../services/exercicioBiblioteca.service'
import type { ExercicioBiblioteca } from '../../../types/exercicio-biblioteca'
import { SwipeableRow } from '../../molecules/SwipeableRow'

interface CardTreinoProps {
    treino: WorkoutOfDay
    proximoTreino?: ProximoTreino | null
    exerciciosFeitos: Record<string, boolean>
    exercicioTimers: Record<string, ExercicioTimerState>
    sessionTimer: ExercicioTimerState
    onExercicioTimersChange: (timers: Record<string, ExercicioTimerState>) => void
    onSessionTimerChange: (timer: ExercicioTimerState) => void
    onVerTreino: () => void
    onCompletei: (dataOverride?: string, exerciciosModificados?: ExercicioTreino[]) => void
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

/**
 * Extrai um único número representativo de uma string de repetições.
 * Ex: "10-12" → "12", "8-10" → "10", "15" → "15", "até a falha" → "".
 * Usa o maior número do range (meta ambiciosa do prescrito).
 */
function extrairRepPlaceholder(repeticoes?: string): string {
    if (!repeticoes) return ''
    const nums = repeticoes.match(/\d+/g)
    if (!nums || nums.length === 0) return ''
    return String(Math.max(...nums.map(Number)))
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
    const [localExercicios, setLocalExercicios] = useState<ExercicioTreino[]>(treino.exercicios || [])
    // Exercícios começam colapsados — aluno expande o que está executando no momento.
    const [expandedExIds, setExpandedExIds] = useState<Set<string>>(new Set())

    useEffect(() => {
        setLocalExercicios(treino.exercicios || [])
        setExpandedExIds(new Set())
    }, [treino.id])

    const toggleExpand = (id: string) => {
        setExpandedExIds(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    /** Busca a última execução registrada para um exercício (id → fallback nome). */
    const getUltimaExecucao = (ex: ExercicioTreino): UltimaExecucao | null => {
        const map = treino.ultimasExecucoes
        if (!map) return null
        const porId = map.porId[ex.id]
        if (porId) return porId
        const chaveNome = ex.nome.toLowerCase().trim().replace(/\s+/g, ' ')
        return map.porNome[chaveNome] ?? null
    }

    /**
     * Retorna os sets do exercício.
     * - Se o timer já tem sets (hidratado ou modificado pelo aluno), respeita exatamente.
     * - Senão (fallback antes da hidratação rodar), usa ex.series como ponto de partida.
     */
    const getSets = (ex: ExercicioTreino): SetExecutado[] => {
        const timer = exercicioTimers[ex.id]
        if (timer?.sets && timer.sets.length > 0) return timer.sets
        return Array.from({ length: Math.max(1, ex.series || 1) }, () => ({}))
    }

    /** Resumo compacto exibido na linha colapsada. */
    const resumoExercicio = (ex: ExercicioTreino): { texto: string; origem: 'atual' | 'ultima' | 'plano' } => {
        const timer = exercicioTimers[ex.id]
        const sets = timer?.sets ?? []
        const setsPreenchidos = sets.filter(s => s.carga != null || s.reps != null)
        if (setsPreenchidos.length > 0) {
            // Denominador = total REAL de séries do exercício (pode ter sido ajustado pelo aluno)
            const totalSets = sets.length || ex.series || setsPreenchidos.length
            const cargas = setsPreenchidos.map(s => s.carga).filter((c): c is number => c != null)
            const cargaLabel = cargas.length > 0 ? `${Math.max(...cargas)}kg` : ''
            return {
                texto: `${setsPreenchidos.length}/${totalSets}${cargaLabel ? ` · ${cargaLabel}` : ''}`,
                origem: 'atual',
            }
        }
        const ultima = getUltimaExecucao(ex)
        if (ultima && ultima.sets.length > 0) {
            const cargas = ultima.sets.map(s => s.carga).filter((c): c is number => c != null)
            const repsPrimeira = ultima.sets[0]?.reps
            const parts: string[] = []
            if (cargas.length > 0) parts.push(`${Math.max(...cargas)}kg`)
            if (repsPrimeira != null) parts.push(`${ultima.sets.length}×${repsPrimeira}`)
            return {
                texto: parts.length > 0 ? `última: ${parts.join(' · ')}` : `${ex.series}×${ex.repeticoes}`,
                origem: parts.length > 0 ? 'ultima' : 'plano',
            }
        }
        return { texto: `${ex.series}×${ex.repeticoes}`, origem: 'plano' }
    }

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

    /** Atualiza um campo (carga ou reps) de uma série específica de um exercício. */
    const handleSetChange = (
        exId: string,
        setIdx: number,
        campo: 'carga' | 'reps',
        val: number | undefined,
    ) => {
        const current = exercicioTimers[exId] ?? { status: 'idle' as const, tempoAcumuladoMs: 0, sets: [] }
        const sets = [...(current.sets ?? [])]
        while (sets.length <= setIdx) sets.push({})
        sets[setIdx] = { ...sets[setIdx], [campo]: val }
        onExercicioTimersChange({
            ...exercicioTimers,
            [exId]: { ...current, sets },
        })
    }

    /** Copia os valores da última execução para o set atual (quando disponível). */
    const repetirUltimoSet = (ex: ExercicioTreino, setIdx: number) => {
        const ultima = getUltimaExecucao(ex)
        const ultimaSet = ultima?.sets[setIdx]
        if (!ultimaSet) return
        const current = exercicioTimers[ex.id] ?? { status: 'idle' as const, tempoAcumuladoMs: 0, sets: [] }
        const sets = [...(current.sets ?? [])]
        while (sets.length <= setIdx) sets.push({})
        sets[setIdx] = { carga: ultimaSet.carga, reps: ultimaSet.reps }
        onExercicioTimersChange({
            ...exercicioTimers,
            [ex.id]: { ...current, sets },
        })
    }

    /** Adiciona uma nova série vazia ao final. */
    const addSet = (exId: string) => {
        const current = exercicioTimers[exId] ?? { status: 'idle' as const, tempoAcumuladoMs: 0, sets: [] }
        const sets = [...(current.sets ?? []), {}]
        onExercicioTimersChange({
            ...exercicioTimers,
            [exId]: { ...current, sets },
        })
    }

    /** Remove a última série (mínimo 1). */
    const removeSet = (exId: string) => {
        const current = exercicioTimers[exId]
        if (!current?.sets || current.sets.length <= 1) return
        const sets = current.sets.slice(0, -1)
        onExercicioTimersChange({
            ...exercicioTimers,
            [exId]: { ...current, sets },
        })
    }

    /** Parse de string para número (ou undefined se vazio/inválido). */
    const parseNumOrUndef = (raw: string): number | undefined => {
        if (raw === '' || raw == null) return undefined
        const n = Number(raw)
        return Number.isFinite(n) ? n : undefined
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

                {/* Lista de Exercícios — colapsável com inputs set-by-set */}
                {localExercicios && localExercicios.length > 0 && (
                    <div className="mb-6 -mx-6 border-y border-white/5 animate-in fade-in duration-300 overflow-hidden">
                        {localExercicios.map((ex, idx) => {
                            const timer = exercicioTimers[ex.id]
                            const isDone = timer?.status === 'done'
                            const isExpanded = expandedExIds.has(ex.id)
                            const sets = getSets(ex)
                            const ultima = getUltimaExecucao(ex)
                            const resumo = resumoExercicio(ex)

                            return (
                                <SwipeableRow
                                    key={ex.id}
                                    className={`transition-all duration-300 ${idx !== localExercicios.length - 1 ? 'border-b border-white/5' : ''} ${isDone ? 'opacity-60' : ''}`}
                                    innerClassName=""
                                    onDelete={() => {
                                        setLocalExercicios(prev => prev.filter(x => x.id !== ex.id))
                                    }}
                                >
                                    {/* Linha 1: checkbox + nome + vídeo + resumo/toggle */}
                                    <div className="flex items-center gap-3 px-6 py-3">
                                        <button
                                            onClick={() => isDone ? handleUndoExercicio(ex.id) : handleDoneExercicio(ex.id)}
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${isDone
                                                ? 'bg-emerald-500/20 hover:bg-emerald-500/30'
                                                : 'bg-white/5 hover:bg-white/10 border border-white/10'
                                                }`}
                                            title={isDone ? 'Desmarcar' : 'Marcar como feito'}
                                        >
                                            <Check
                                                size={16}
                                                className={`transition-all ${isDone ? 'text-emerald-400 scale-110' : 'text-gray-600'}`}
                                                strokeWidth={3}
                                            />
                                        </button>

                                        {/* Nome do exercício */}
                                        <div className="flex-1 min-w-0 flex items-center">
                                            <input
                                                type="text"
                                                value={ex.nome}
                                                onChange={(e) => {
                                                    const nov = [...localExercicios]
                                                    nov[idx] = { ...nov[idx], nome: e.target.value }
                                                    setLocalExercicios(nov)
                                                }}
                                                readOnly={isDone}
                                                className={`w-full bg-transparent text-sm font-medium transition-colors outline-none focus:border-b focus:border-indigo-500/50 ${isDone ? 'text-gray-500 line-through' : 'text-gray-200'}`}
                                            />
                                        </div>

                                        {/* Botão de Vídeo */}
                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation()
                                                let found: ExercicioBiblioteca | null = null
                                                if (ex.bibliotecaId) {
                                                    found = await exercicioBibliotecaService.buscarPorId(ex.bibliotecaId)
                                                }
                                                if (!found) {
                                                    found = await exercicioBibliotecaService.buscarPorNomeSimilar(ex.nome)
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

                                        {/* Resumo + botão de expandir */}
                                        <button
                                            onClick={() => toggleExpand(ex.id)}
                                            className="h-7 px-2 flex items-center gap-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                            title={isExpanded ? 'Recolher' : 'Expandir'}
                                        >
                                            <span className={`text-[11px] font-mono whitespace-nowrap ${resumo.origem === 'atual' ? 'text-indigo-300' : resumo.origem === 'ultima' ? 'text-gray-500' : 'text-gray-400'}`}>
                                                {resumo.texto}
                                            </span>
                                            <ChevronDown
                                                size={12}
                                                className={`text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                            />
                                        </button>
                                    </div>

                                    {/* Linha 2: inputs set-by-set (expandido, modo pendente) */}
                                    {isExpanded && !isDone && treino.status === 'pendente' && (
                                        <div className="px-6 pb-4 pt-1 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                            {sets.map((set, sIdx) => {
                                                const ultimaSet = ultima?.sets[sIdx]
                                                const temUltima = ultimaSet && (ultimaSet.carga != null || ultimaSet.reps != null)
                                                const vazioAtual = set.carga == null && set.reps == null
                                                return (
                                                    <div key={sIdx} className="flex items-center gap-2 ml-11">
                                                        <span className="w-7 text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                                                            #{sIdx + 1}
                                                        </span>

                                                        <input
                                                            type="number"
                                                            inputMode="decimal"
                                                            step="0.5"
                                                            min="0"
                                                            placeholder={ultimaSet?.carga != null ? String(ultimaSet.carga) : 'kg'}
                                                            value={set.carga ?? ''}
                                                            onChange={e => handleSetChange(ex.id, sIdx, 'carga', parseNumOrUndef(e.target.value))}
                                                            onClick={e => e.stopPropagation()}
                                                            className="w-14 h-7 bg-white/[0.03] border border-white/10 rounded-lg text-[10px] text-indigo-300 font-mono text-center placeholder-gray-600 outline-none focus:border-indigo-500/40 transition-colors"
                                                        />
                                                        <span className="text-[9px] text-gray-600">kg</span>

                                                        <span className="text-gray-700 mx-0.5">×</span>

                                                        <input
                                                            type="number"
                                                            inputMode="numeric"
                                                            min="0"
                                                            placeholder={ultimaSet?.reps != null ? String(ultimaSet.reps) : extrairRepPlaceholder(ex.repeticoes)}
                                                            value={set.reps ?? ''}
                                                            onChange={e => handleSetChange(ex.id, sIdx, 'reps', parseNumOrUndef(e.target.value))}
                                                            onClick={e => e.stopPropagation()}
                                                            className="w-12 h-7 bg-white/[0.03] border border-white/10 rounded-lg text-[10px] text-indigo-300 font-mono text-center placeholder-gray-600 outline-none focus:border-indigo-500/40 transition-colors"
                                                        />
                                                        <span className="text-[9px] text-gray-600">reps</span>

                                                        {temUltima && vazioAtual && (
                                                            <button
                                                                onClick={() => repetirUltimoSet(ex, sIdx)}
                                                                className="ml-auto text-[9px] text-indigo-400/60 hover:text-indigo-300 transition-colors uppercase tracking-wider"
                                                                title="Usar valores da última execução"
                                                            >
                                                                usar última
                                                            </button>
                                                        )}
                                                    </div>
                                                )
                                            })}

                                            {/* Stepper único para ajustar quantidade de séries */}
                                            <div className="flex items-center gap-2 ml-11 pt-1.5">
                                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">Séries</span>
                                                <div className="flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-lg p-0.5">
                                                    <button
                                                        onClick={() => removeSet(ex.id)}
                                                        disabled={sets.length <= 1}
                                                        className="w-6 h-6 rounded-md text-gray-400 hover:text-rose-400 hover:bg-white/5 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:bg-transparent transition-colors flex items-center justify-center"
                                                        title="Remover última série"
                                                    >
                                                        <span className="text-sm font-bold leading-none">−</span>
                                                    </button>
                                                    <span className="text-[11px] font-mono text-white tabular-nums w-5 text-center">
                                                        {sets.length}
                                                    </span>
                                                    <button
                                                        onClick={() => addSet(ex.id)}
                                                        className="w-6 h-6 rounded-md text-gray-400 hover:text-indigo-400 hover:bg-white/5 transition-colors flex items-center justify-center"
                                                        title="Adicionar nova série"
                                                    >
                                                        <Plus size={12} strokeWidth={3} />
                                                    </button>
                                                </div>
                                                {ex.series && sets.length !== ex.series && (
                                                    <span className="text-[9px] text-gray-600 uppercase tracking-wider ml-1">
                                                        plano: {ex.series}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Linha 2: modo DONE — revisão read-only dos sets feitos */}
                                    {isExpanded && isDone && sets.some(s => s.carga != null || s.reps != null) && (
                                        <div className="px-6 pb-3 pt-1 space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                            {sets.map((set, sIdx) => (
                                                (set.carga != null || set.reps != null) && (
                                                    <div key={sIdx} className="flex items-center gap-2 ml-11 text-[10px] font-mono text-emerald-400/60">
                                                        <span className="w-7 text-gray-600 uppercase tracking-wider">#{sIdx + 1}</span>
                                                        <span>{set.carga != null ? `${set.carga}kg` : '—'}</span>
                                                        <span className="text-gray-700">×</span>
                                                        <span>{set.reps != null ? `${set.reps} reps` : '—'}</span>
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    )}
                                </SwipeableRow>
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
                                        onCompletei(undefined, localExercicios)
                                    }}
                                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-amber-500/10 transition-colors border-b border-white/5"
                                >
                                    <Check size={16} className="text-amber-500" />
                                    <span className="text-sm font-semibold text-white">HOJE</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setShowCompleteiMenu(false)
                                        onCompletei(getOntemISO(), localExercicios)
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

                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                const novoExId = `custom-ex-${Date.now()}`;
                                setLocalExercicios([...localExercicios, {
                                    id: novoExId,
                                    nome: 'Novo Exercício',
                                    series: 3,
                                    repeticoes: '10-12',
                                    bibliotecaId: undefined,
                                }]);
                            }}
                            className="w-12 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 transition-colors flex items-center justify-center flex-shrink-0"
                            title="Adicionar Exercício"
                        >
                            <Plus size={18} />
                        </button>
                        <button
                            onClick={onPular}
                            className="flex-1 py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-gray-400 transition-colors flex items-center justify-center gap-2"
                        >
                            <SkipForward size={16} />
                            PULAR
                        </button>
                    </div>
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
