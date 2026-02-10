/**
 * GraficoEvolucao Component
 * 
 * Gráfico simples de evolução do score ao longo do tempo
 */

import React from 'react'
import { TrendingUp } from 'lucide-react'
import { GraficoEvolucaoData } from '../../../types/athlete-portal'

interface GraficoEvolucaoProps {
    dados: GraficoEvolucaoData
}

export function GraficoEvolucao({ dados }: GraficoEvolucaoProps) {
    if (!dados || dados.dados.length === 0) {
        return (
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Evolução do Score
                </h3>
                <div className="h-48 flex items-center justify-center">
                    <p className="text-sm text-gray-500">Sem dados suficientes para exibir gráfico</p>
                </div>
            </div>
        )
    }

    // Calcular valores para a visualização
    const maxValor = Math.max(...dados.dados.map(d => d.valor), 100)
    const minValor = Math.min(...dados.dados.map(d => d.valor), 0)
    const range = maxValor - minValor || 1

    // Formatar mês
    const formatMes = (date: Date) => {
        return new Date(date).toLocaleDateString('pt-BR', { month: 'short' })
    }

    return (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Evolução do Score
                </h3>
                <TrendingUp size={18} className="text-teal-400" />
            </div>

            {/* Gráfico simplificado com barras */}
            <div className="relative h-48 mb-4">
                {/* Grid de fundo */}
                <div className="absolute inset-0 flex flex-col justify-between">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="border-t border-gray-700/50" />
                    ))}
                </div>

                {/* Barras */}
                <div className="absolute inset-0 flex items-end justify-around gap-1 px-2">
                    {dados.dados.map((ponto, index) => {
                        const height = ((ponto.valor - minValor) / range) * 100
                        const isLast = index === dados.dados.length - 1

                        return (
                            <div
                                key={index}
                                className="flex-1 flex flex-col items-center"
                                style={{ maxWidth: '60px' }}
                            >
                                <div className="w-full relative group">
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap border border-gray-700">
                                            {ponto.valor} pts
                                        </div>
                                    </div>

                                    {/* Barra */}
                                    <div
                                        className={`w-full rounded-t transition-all duration-300 ${isLast ? 'bg-teal-500' : 'bg-gray-600'
                                            } hover:opacity-80`}
                                        style={{ height: `${Math.max(height, 5)}%` }}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Labels dos meses */}
            <div className="flex items-center justify-around gap-1 px-2">
                {dados.dados.map((ponto, index) => (
                    <div key={index} className="flex-1 text-center" style={{ maxWidth: '60px' }}>
                        <span className="text-[10px] text-gray-500 uppercase">
                            {formatMes(ponto.data)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
