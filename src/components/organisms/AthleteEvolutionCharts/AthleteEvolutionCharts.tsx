/**
 * AthleteEvolutionCharts - Gráficos de evolução do atleta
 */

import React, { useState } from 'react'
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    AreaChart,
} from 'recharts'
import type { DailyTrackingHistory } from '../../../types/daily-tracking'

interface AthleteEvolutionChartsProps {
    historico: DailyTrackingHistory
    periodo?: 7 | 14 | 30
}

type MetricaVis = 'hydration' | 'nutrition' | 'training' | 'sleep'

export const AthleteEvolutionCharts: React.FC<AthleteEvolutionChartsProps> = ({
    historico,
    periodo = 7,
}) => {
    const [metricaSelecionada, setMetricaSelecionada] = useState<MetricaVis>('hydration')

    // Filtrar dados pelo período
    const dadosFiltrados = historico.dados.slice(-periodo)

    // Preparar dados para os gráficos
    const dadosGrafico = dadosFiltrados.map(dia => ({
        data: dia.data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        // Hidratação
        agua: dia.hidratacao.totalMl / 1000, // converter para litros
        metaAgua: dia.hidratacao.metaMl / 1000,
        // Nutrição
        refeicoes: dia.nutricao.refeicoes,
        calorias: dia.nutricao.calorias,
        proteina: dia.nutricao.proteina,
        // Treino
        treinou: dia.treino.realizado ? 1 : 0,
        duracaoTreino: dia.treino.duracao || 0,
        intensidade: dia.treino.intensidade || 0,
        // Sono
        horasSono: dia.sono.horas,
        qualidadeSono: dia.sono.qualidade,
        // Outros
        dores: dia.doresAtivas,
    }))

    const metricas = [
        { id: 'hydration' as MetricaVis, label: '💧 Hidratação', icon: '💧' },
        { id: 'nutrition' as MetricaVis, label: '🍴 Nutrição', icon: '🍴' },
        { id: 'training' as MetricaVis, label: '💪 Treino', icon: '💪' },
        { id: 'sleep' as MetricaVis, label: '😴 Sono', icon: '😴' },
    ]

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
                    <p className="text-white font-semibold mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: <span className="font-bold">{entry.value.toFixed(1)}</span>
                            {entry.unit || ''}
                        </p>
                    ))}
                </div>
            )
        }
        return null
    }

    return (
        <div className="space-y-6">
            {/* Seletor de Métrica */}
            <div className="flex gap-2 flex-wrap">
                {metricas.map(metrica => (
                    <button
                        key={metrica.id}
                        onClick={() => setMetricaSelecionada(metrica.id)}
                        className={`
              px-4 py-2 rounded-lg font-medium transition-all
              ${metricaSelecionada === metrica.id
                                ? 'bg-blue-500 text-white shadow-lg scale-105'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }
            `}
                    >
                        {metrica.icon} {metrica.label}
                    </button>
                ))}
            </div>

            {/* Gráfico de Hidratação */}
            {metricaSelecionada === 'hydration' && (
                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        💧 Evolução da Hidratação ({periodo} dias)
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={dadosGrafico}>
                            <defs>
                                <linearGradient id="colorAgua" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="data" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" label={{ value: 'Litros', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line type="monotone" dataKey="metaAgua" stroke="#10b981" strokeDasharray="5 5" name="Meta" />
                            <Area type="monotone" dataKey="agua" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAgua)" name="Água (L)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Gráfico de Nutrição */}
            {metricaSelecionada === 'nutrition' && (
                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        🍴 Evolução Nutricional ({periodo} dias)
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dadosGrafico}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="data" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line type="monotone" dataKey="refeicoes" stroke="#10b981" name="Refeições" strokeWidth={2} />
                            <Line type="monotone" dataKey="proteina" stroke="#8b5cf6" name="Proteína (g)" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                    <div className="mt-4">
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={dadosGrafico}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="data" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="calorias" fill="#f59e0b" name="Calorias" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Gráfico de Treino */}
            {metricaSelecionada === 'training' && (
                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        💪 Frequência e Intensidade de Treino ({periodo} dias)
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dadosGrafico}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="data" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="duracaoTreino" fill="#3b82f6" name="Duração (min)" />
                            <Bar dataKey="intensidade" fill="#ef4444" name="Intensidade (1-5)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Gráfico de Sono */}
            {metricaSelecionada === 'sleep' && (
                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        😴 Qualidade do Sono ({periodo} dias)
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dadosGrafico}>
                            <defs>
                                <linearGradient id="colorSono" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="data" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line type="monotone" dataKey={() => 7} stroke="#10b981" strokeDasharray="5 5" name="Meta (7h)" />
                            <Area type="monotone" dataKey="horasSono" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorSono)" name="Horas" />
                            <Line type="monotone" dataKey="qualidadeSono" stroke="#f59e0b" name="Qualidade (1-5)" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Estatísticas Resumidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-4">
                    <div className="text-blue-300 text-xs mb-1">Média Água</div>
                    <div className="text-2xl font-bold text-white">
                        {(dadosGrafico.reduce((acc, d) => acc + d.agua, 0) / dadosGrafico.length).toFixed(1)}L
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-4">
                    <div className="text-green-300 text-xs mb-1">Média Refeições</div>
                    <div className="text-2xl font-bold text-white">
                        {(dadosGrafico.reduce((acc, d) => acc + d.refeicoes, 0) / dadosGrafico.length).toFixed(1)}
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-xl p-4">
                    <div className="text-purple-300 text-xs mb-1">Média Sono</div>
                    <div className="text-2xl font-bold text-white">
                        {(dadosGrafico.reduce((acc, d) => acc + d.horasSono, 0) / dadosGrafico.length).toFixed(1)}h
                    </div>
                </div>
                <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-xl p-4">
                    <div className="text-orange-300 text-xs mb-1">Aderência Treino</div>
                    <div className="text-2xl font-bold text-white">
                        {Math.round((dadosGrafico.filter(d => d.treinou).length / dadosGrafico.length) * 100)}%
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AthleteEvolutionCharts
