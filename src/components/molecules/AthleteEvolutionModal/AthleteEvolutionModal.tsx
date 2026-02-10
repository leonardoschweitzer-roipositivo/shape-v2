/**
 * AthleteEvolutionModal - Modal para visualizar evolução detalhada do atleta
 */

import React, { useState } from 'react'
import { X, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { AthleteEvolutionCharts } from '../../organisms/AthleteEvolutionCharts'
import type { DailyTrackingHistory, AtletaDailyStatus } from '../../../types/daily-tracking'

interface AthleteEvolutionModalProps {
    isOpen: boolean
    onClose: () => void
    atleta: AtletaDailyStatus
    historico: DailyTrackingHistory
}

export const AthleteEvolutionModal: React.FC<AthleteEvolutionModalProps> = ({
    isOpen,
    onClose,
    atleta,
    historico,
}) => {
    const [periodo, setPeriodo] = useState<7 | 14 | 30>(7)

    if (!isOpen) return null

    // Calcular tendências
    const calcularTendencia = (metrica: 'agua' | 'refeicoes' | 'sono' | 'treino') => {
        const dadosPeriodo = historico.dados.slice(-periodo)
        if (dadosPeriodo.length < 2) return 'estavel'

        const metade = Math.floor(dadosPeriodo.length / 2)
        const primeiraMetade = dadosPeriodo.slice(0, metade)
        const segundaMetade = dadosPeriodo.slice(metade)

        let mediaPrimeira = 0
        let mediaSegunda = 0

        switch (metrica) {
            case 'agua':
                mediaPrimeira = primeiraMetade.reduce((acc, d) => acc + d.hidratacao.totalMl, 0) / primeiraMetade.length
                mediaSegunda = segundaMetade.reduce((acc, d) => acc + d.hidratacao.totalMl, 0) / segundaMetade.length
                break
            case 'refeicoes':
                mediaPrimeira = primeiraMetade.reduce((acc, d) => acc + d.nutricao.refeicoes, 0) / primeiraMetade.length
                mediaSegunda = segundaMetade.reduce((acc, d) => acc + d.nutricao.refeicoes, 0) / segundaMetade.length
                break
            case 'sono':
                mediaPrimeira = primeiraMetade.reduce((acc, d) => acc + d.sono.horas, 0) / primeiraMetade.length
                mediaSegunda = segundaMetade.reduce((acc, d) => acc + d.sono.horas, 0) / segundaMetade.length
                break
            case 'treino':
                mediaPrimeira = primeiraMetade.filter(d => d.treino.realizado).length / primeiraMetade.length
                mediaSegunda = segundaMetade.filter(d => d.treino.realizado).length / segundaMetade.length
                break
        }

        const diferenca = ((mediaSegunda - mediaPrimeira) / mediaPrimeira) * 100

        if (diferenca > 5) return 'subindo'
        if (diferenca < -5) return 'descendo'
        return 'estavel'
    }

    const tendencias = {
        agua: calcularTendencia('agua'),
        refeicoes: calcularTendencia('refeicoes'),
        sono: calcularTendencia('sono'),
        treino: calcularTendencia('treino'),
    }

    const TrendIcon = ({ trend }: { trend: string }) => {
        if (trend === 'subindo') return <TrendingUp className="text-green-500" size={20} />
        if (trend === 'descendo') return <TrendingDown className="text-red-500" size={20} />
        return <Minus className="text-gray-500" size={20} />
    }

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-center justify-between z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                            {atleta.avatar ? (
                                <img src={atleta.avatar} alt={atleta.nome} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                atleta.nome.charAt(0)
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{atleta.nome}</h2>
                            <p className="text-gray-400">Evolução e Tendências</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X size={24} className="text-gray-400" />
                    </button>
                </div>

                {/* Seletor de Período */}
                <div className="p-6 border-b border-gray-700">
                    <div className="flex gap-2">
                        {[7, 14, 30].map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriodo(p as 7 | 14 | 30)}
                                className={`
                  px-6 py-2 rounded-lg font-medium transition-all
                  ${periodo === p
                                        ? 'bg-blue-500 text-white shadow-lg'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                    }
                `}
                            >
                                Últimos {p} dias
                            </button>
                        ))}
                    </div>
                </div>

                {/* Resumo de Tendências */}
                <div className="p-6 bg-gray-800/50 border-b border-gray-700">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        📊 Resumo de Tendências ({periodo} dias)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                            <div>
                                <div className="text-gray-400 text-sm">Hidratação</div>
                                <div className="text-white font-semibold mt-1">
                                    {tendencias.agua === 'subindo' ? 'Melhorando' :
                                        tendencias.agua === 'descendo' ? 'Piorando' : 'Estável'}
                                </div>
                            </div>
                            <TrendIcon trend={tendencias.agua} />
                        </div>

                        <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                            <div>
                                <div className="text-gray-400 text-sm">Refeições</div>
                                <div className="text-white font-semibold mt-1">
                                    {tendencias.refeicoes === 'subindo' ? 'Melhorando' :
                                        tendencias.refeicoes === 'descendo' ? 'Piorando' : 'Estável'}
                                </div>
                            </div>
                            <TrendIcon trend={tendencias.refeicoes} />
                        </div>

                        <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                            <div>
                                <div className="text-gray-400 text-sm">Sono</div>
                                <div className="text-white font-semibold mt-1">
                                    {tendencias.sono === 'subindo' ? 'Melhorando' :
                                        tendencias.sono === 'descendo' ? 'Piorando' : 'Estável'}
                                </div>
                            </div>
                            <TrendIcon trend={tendencias.sono} />
                        </div>

                        <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                            <div>
                                <div className="text-gray-400 text-sm">Aderência Treino</div>
                                <div className="text-white font-semibold mt-1">
                                    {tendencias.treino === 'subindo' ? 'Melhorando' :
                                        tendencias.treino === 'descendo' ? 'Piorando' : 'Estável'}
                                </div>
                            </div>
                            <TrendIcon trend={tendencias.treino} />
                        </div>
                    </div>
                </div>

                {/* Gráficos */}
                <div className="p-6">
                    <AthleteEvolutionCharts historico={historico} periodo={periodo} />
                </div>

                {/* Footer com ações */}
                <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 p-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                    >
                        Fechar
                    </button>
                    <button
                        className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                    >
                        💬 Enviar Mensagem
                    </button>
                    <button
                        className="flex-1 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors"
                    >
                        📋 Ajustar Plano
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AthleteEvolutionModal
