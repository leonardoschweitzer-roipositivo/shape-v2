/**
 * TrackersRapidos Component
 * 
 * Grid de 4 trackers para registros rápidos (água, sono, peso, dor)
 */

import React from 'react'
import { TrackerRapido } from '../../../types/athlete-portal'

interface TrackersRapidosProps {
    trackers: TrackerRapido[]
    onTrackerClick: (tipo: TrackerRapido['id']) => void
}

export function TrackersRapidos({ trackers, onTrackerClick }: TrackersRapidosProps) {
    return (
        <div className="bg-[#0C1220] rounded-2xl p-6 border border-white/5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
                ⚡ RÁPIDO
            </h3>

            <div className="grid grid-cols-4 gap-3">
                {trackers.map((tracker) => {
                    const isPendente = tracker.status === 'pendente'

                    return (
                        <button
                            key={tracker.id}
                            onClick={() => onTrackerClick(tracker.id)}
                            className={`
                flex flex-col items-center gap-2 p-3 rounded-lg transition-all
                ${isPendente
                                    ? 'bg-white/5 border border-white/10 hover:bg-white/10'
                                    : 'bg-indigo-500/10 border border-indigo-500/30'
                                }
              `}
                        >
                            {/* Emoji Icon */}
                            <span className="text-2xl">
                                {tracker.icone}
                            </span>

                            {/* Label */}
                            <span className={`text-xs font-medium ${isPendente ? 'text-gray-400' : 'text-indigo-400'
                                }`}>
                                {tracker.label}
                            </span>

                            {/* Valor */}
                            {tracker.valor && (
                                <span className={`text-xs font-semibold ${isPendente ? 'text-gray-500' : 'text-white'
                                    }`}>
                                    {tracker.valor}{tracker.unidade}
                                </span>
                            )}

                            {/* Indicador de pendente */}
                            {isPendente && !tracker.valor && (
                                <span className="text-[10px] text-gray-600">
                                    +
                                </span>
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
