/**
 * HistoricoAvaliacoes Component
 * 
 * Lista das últimas 3 avaliações com link para ver detalhes
 */

import React from 'react'
import { Calendar, ChevronRight } from 'lucide-react'

interface HistoricoAvaliacaoItem {
    id: string
    data: Date
    score: number
    classificacao: string
}

interface HistoricoAvaliacoesProps {
    avaliacoes: HistoricoAvaliacaoItem[]
    onVerDetalhes: (id: string) => void
}

function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

function AvaliacaoItem({ avaliacao, onClick }: { avaliacao: HistoricoAvaliacaoItem; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-gray-800/50 hover:bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors flex items-center justify-between"
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                    <Calendar size={18} className="text-teal-400" />
                </div>
                <div className="text-left">
                    <p className="text-sm font-medium text-white">
                        {formatDate(avaliacao.data)}
                    </p>
                    <p className="text-xs text-gray-400">
                        {avaliacao.classificacao}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="text-right">
                    <p className="text-lg font-bold text-white">{avaliacao.score}</p>
                    <p className="text-xs text-gray-500">score</p>
                </div>
                <ChevronRight size={18} className="text-gray-600" />
            </div>
        </button>
    )
}

export function HistoricoAvaliacoes({ avaliacoes, onVerDetalhes }: HistoricoAvaliacoesProps) {
    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider px-1">
                Histórico de Avaliações
            </h3>

            {avaliacoes.length === 0 ? (
                <div className="bg-gray-800/30 rounded-lg p-8 text-center border border-gray-700 border-dashed">
                    <Calendar size={32} className="text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">
                        Nenhuma avaliação registrada ainda
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {avaliacoes.map((avaliacao) => (
                        <AvaliacaoItem
                            key={avaliacao.id}
                            avaliacao={avaliacao}
                            onClick={() => onVerDetalhes(avaliacao.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
