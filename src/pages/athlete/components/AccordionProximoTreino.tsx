
import React, { useState } from 'react'
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import type { ProximoTreino } from '../../../services/portalDataService'

interface AccordionProximoTreinoProps {
    treino: ProximoTreino
}

export function AccordionProximoTreino({ treino }: AccordionProximoTreinoProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="bg-surface-deep/40 rounded-2xl border border-white/5 overflow-hidden transition-all">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                        <Calendar size={14} className="text-gray-400" />
                    </div>
                    <div className="text-left">
                        <span className="text-sm font-bold text-white uppercase tracking-wide">
                            {treino.letraLabel}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                            {treino.grupoMuscular}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest hidden sm:block">
                        Ver Detalhes
                    </span>
                    {isOpen
                        ? <ChevronUp size={16} className="text-gray-500" />
                        : <ChevronDown size={16} className="text-gray-500" />
                    }
                </div>
            </button>

            {isOpen && (
                <div className="px-6 pb-5 space-y-4 animate-in slide-in-from-top-1 duration-200">
                    <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                        <h4 className="text-xs font-black text-indigo-400 mb-3 uppercase tracking-widest">
                            {treino.nomeTreino}
                        </h4>

                        <div className="space-y-2">
                            {treino.exercicios.map((ex, i) => (
                                <div
                                    key={ex.id}
                                    className="flex items-center gap-3 py-1.5 border-b border-white/[0.02] last:border-0"
                                >
                                    <span className="text-[10px] text-indigo-500/50 font-mono w-5 text-right">
                                        {(i + 1).toString().padStart(2, '0')}
                                    </span>
                                    <div className="flex-1">
                                        <span className="text-sm text-gray-300">
                                            {ex.nome}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-gray-500 font-mono bg-white/5 px-1.5 py-0.5 rounded">
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
