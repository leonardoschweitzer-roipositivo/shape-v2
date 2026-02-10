/**
 * DailyScoreCard - Card visual do score do dia
 */

import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface DailyScoreCardProps {
    score: number
    categoria: 'excelente' | 'bom' | 'regular' | 'ruim'
    cor: string
    emoji: string
    mensagem: string
    variacao?: number  // Comparado com ontem (ex: +5, -3)
}

export const DailyScoreCard: React.FC<DailyScoreCardProps> = ({
    score,
    categoria,
    cor,
    emoji,
    mensagem,
    variacao,
}) => {
    const getCircunferencia = () => 2 * Math.PI * 45 // raio = 45
    const getOffset = () => {
        const circunferencia = getCircunferencia()
        return circunferencia - (score / 100) * circunferencia
    }

    return (
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Score do Dia</h3>
                <div className="text-2xl">{emoji}</div>
            </div>

            <div className="flex items-center gap-6">
                {/* Score Circle */}
                <div className="relative w-32 h-32 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                        {/* Background circle */}
                        <circle
                            cx="64"
                            cy="64"
                            r="45"
                            stroke="#374151"
                            strokeWidth="8"
                            fill="none"
                        />

                        {/* Progress circle */}
                        <circle
                            cx="64"
                            cy="64"
                            r="45"
                            stroke={cor}
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={getCircunferencia()}
                            strokeDashoffset={getOffset()}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>

                    {/* Score number */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-4xl font-bold text-white">
                            {score}
                        </div>
                        <div className="text-xs text-gray-400">/ 100</div>
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div
                            className="text-lg font-bold capitalize"
                            style={{ color: cor }}
                        >
                            {categoria}
                        </div>

                        {/* Variação vs ontem */}
                        {variacao !== undefined && variacao !== 0 && (
                            <div className={`
                flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full
                ${variacao > 0 ? 'bg-green-500/20 text-green-400' :
                                    variacao < 0 ? 'bg-red-500/20 text-red-400' :
                                        'bg-gray-500/20 text-gray-400'}
              `}>
                                {variacao > 0 ? <TrendingUp size={14} /> :
                                    variacao < 0 ? <TrendingDown size={14} /> :
                                        <Minus size={14} />}
                                {variacao > 0 ? '+' : ''}{variacao}
                            </div>
                        )}
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed">
                        {mensagem}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default DailyScoreCard
