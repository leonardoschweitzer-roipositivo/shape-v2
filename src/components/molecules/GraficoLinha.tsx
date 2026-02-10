import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface GraficoLinhaProps {
    titulo: string
    icone: React.ReactNode
    dados: { periodo: string; valor: number }[]
    tendencia: {
        valor: number
        unidade: string
        direcao: 'UP' | 'DOWN' | 'STABLE'
    }
    periodos: ('3_MESES' | '6_MESES' | '12_MESES')[]
    periodoSelecionado: '3_MESES' | '6_MESES' | '12_MESES'
    onPeriodoChange: (periodo: '3_MESES' | '6_MESES' | '12_MESES') => void
}

/**
 * Gráfico de linha reutilizável para evolução temporal
 * Usado para mostrar evolução de score médio, total de alunos, avaliações, etc
 */
export function GraficoLinha({
    titulo,
    icone,
    dados,
    tendencia,
    periodos,
    periodoSelecionado,
    onPeriodoChange
}: GraficoLinhaProps) {
    const getTendenciaColor = () => {
        if (tendencia.direcao === 'UP') return 'text-green-400'
        if (tendencia.direcao === 'DOWN') return 'text-red-400'
        return 'text-gray-400'
    }

    const getTendenciaIcon = () => {
        if (tendencia.direcao === 'UP') return <TrendingUp className="w-4 h-4" />
        if (tendencia.direcao === 'DOWN') return <TrendingDown className="w-4 h-4" />
        return <Minus className="w-4 h-4" />
    }

    const getPeriodoLabel = (periodo: '3_MESES' | '6_MESES' | '12_MESES') => {
        switch (periodo) {
            case '3_MESES': return '3 meses'
            case '6_MESES': return '6 meses'
            case '12_MESES': return '12 meses'
        }
    }

    return (
        <div className="card-dark p-6 rounded-xl">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="text-primary text-2xl">
                        {icone}
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                        {titulo}
                    </h3>
                </div>

                {/* Seletor de Período */}
                <select
                    value={periodoSelecionado}
                    onChange={(e) => onPeriodoChange(e.target.value as '3_MESES' | '6_MESES' | '12_MESES')}
                    className="bg-dark-base border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                    {periodos.map((periodo) => (
                        <option key={periodo} value={periodo}>
                            {getPeriodoLabel(periodo)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Gráfico */}
            <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dados}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="periodo"
                            stroke="#9CA3AF"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis
                            stroke="#9CA3AF"
                            style={{ fontSize: '12px' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#F3F4F6'
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="valor"
                            stroke="#00D9A5"
                            strokeWidth={3}
                            dot={{ fill: '#00D9A5', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Tendência */}
            <div className={`flex items-center gap-2 text-sm font-medium ${getTendenciaColor()}`}>
                {getTendenciaIcon()}
                <span>
                    Tendência: {tendencia.valor >= 0 ? '+' : ''}{tendencia.valor} {tendencia.unidade}
                </span>
            </div>
        </div>
    )
}
