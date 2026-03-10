import React, { useState, useEffect } from 'react'
import { Dumbbell, ChevronDown, ChevronUp, Clock, Target, Zap, Pencil } from 'lucide-react'
import type { PlanoTreino, TreinoDetalhado } from '@/services/calculations/treino'
import { getUltimoTreinoIndex } from '@/services/portal/portalContext'

interface CardTreinosAccordionProps {
    planoTreino: PlanoTreino | null
    atletaId: string
    onEditar?: () => void
}

export function CardTreinosAccordion({ planoTreino, atletaId, onEditar }: CardTreinosAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null)
    const [lastCompletedIndex, setLastCompletedIndex] = useState<number>(-1)

    useEffect(() => {
        if (atletaId) {
            getUltimoTreinoIndex(atletaId).then(setLastCompletedIndex)
        }
    }, [atletaId])

    if (!planoTreino || !planoTreino.treinos || planoTreino.treinos.length === 0) {
        return (
            <div className="bg-surface-deep rounded-3xl p-6 border border-white/5 text-center">
                <Dumbbell className="mx-auto text-gray-600 mb-2" size={24} />
                <p className="text-gray-500 text-sm italic">Nenhum plano de treino ativo para este aluno.</p>
            </div>
        )
    }

    const treinosOriginal = planoTreino.treinos
    const totalTreinos = treinosOriginal.length
    const nextIndex = (lastCompletedIndex + 1) % totalTreinos

    // Reordenar para que o treino do dia (nextIndex) seja o primeiro
    const treinosOrdenados = [
        ...treinosOriginal.slice(nextIndex),
        ...treinosOriginal.slice(0, nextIndex)
    ]

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between px-1 mb-2">
                <div className="flex items-center gap-2">
                    <Dumbbell size={16} className="text-[var(--color-accent)]" />
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Treinos do Aluno</h3>
                </div>
                {onEditar && (
                    <button
                        onClick={onEditar}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all"
                    >
                        <Pencil size={10} />
                        Editar
                    </button>
                )}
            </div>

            {treinosOrdenados.map((treino, idx) => {
                const isOpen = openIndex === idx
                const isHoje = idx === 0 // O primeiro da lista reordenada é o de hoje

                return (
                    <div
                        key={treino.id}
                        className={`bg-surface-deep rounded-2xl border transition-all overflow-hidden ${isOpen ? 'border-white/10 ring-1 ring-white/5' : 'border-white/5 hover:border-white/10'
                            }`}
                    >
                        {/* Accordion Header */}
                        <button
                            onClick={() => setOpenIndex(isOpen ? null : idx)}
                            className="w-full flex items-center justify-between p-4 text-left active:bg-white/5"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${isHoje
                                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                    : 'bg-white/5 text-gray-400'
                                    }`}>
                                    {treino.letra}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-black text-white uppercase tracking-tight">
                                            {treino.nome}
                                        </h4>
                                        {isHoje && (
                                            <span className="bg-emerald-500/10 text-emerald-500 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest border border-emerald-400/20">
                                                Treino do Dia
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                                        {treino.blocos.map(b => b.nomeGrupo).join(' + ')}
                                    </p>
                                </div>
                            </div>
                            {isOpen ? <ChevronUp size={18} className="text-gray-600" /> : <ChevronDown size={18} className="text-gray-600" />}
                        </button>

                        {/* Accordion Content */}
                        {isOpen && (
                            <div className="px-4 pb-4 animate-in slide-in-from-top-1 duration-200">
                                <div className="h-px bg-white/5 mb-4" />

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-indigo-400" />
                                        <span className="text-[11px] text-gray-400 font-medium">~{treino.duracaoMinutos} min</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Target size={14} className="text-orange-400" />
                                        <span className="text-[11px] text-gray-400 font-medium">{treino.blocos.length} blocos focais</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {treino.blocos.map((bloco, bIdx) => (
                                        <div key={bIdx} className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1 w-1 rounded-full bg-indigo-500" />
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                    {bloco.nomeGrupo} {bloco.isPrioridade && '🔥'}
                                                </span>
                                            </div>
                                            <div className="bg-white/[0.02] rounded-xl border border-white/5 divide-y divide-white/5">
                                                {bloco.exercicios.map((ex, eIdx) => (
                                                    <div key={eIdx} className="p-3 flex items-center justify-between">
                                                        <div className="flex-1 min-w-0 pr-3">
                                                            <div className="text-[11px] font-black text-gray-200 truncate uppercase">
                                                                {ex.nome}
                                                            </div>
                                                            {ex.tecnica && (
                                                                <div className="text-[9px] text-orange-400 font-bold uppercase mt-0.5">
                                                                    {ex.tecnica}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-3 text-right">
                                                            <div className="flex flex-col items-center">
                                                                <span className="text-[10px] text-gray-500 font-bold uppercase">Séries</span>
                                                                <span className="text-xs text-white font-black">{ex.series}</span>
                                                            </div>
                                                            <div className="w-px h-6 bg-white/10" />
                                                            <div className="flex flex-col items-center">
                                                                <span className="text-[10px] text-gray-500 font-bold uppercase">Reps</span>
                                                                <span className="text-xs text-white font-black">{ex.repeticoes}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
