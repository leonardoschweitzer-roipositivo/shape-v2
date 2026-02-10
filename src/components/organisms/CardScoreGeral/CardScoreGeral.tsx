/**
 * CardScoreGeral Component
 * 
 * Card do score geral do atleta com classificação e variação
 */

import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { ScoreGeral } from '../../../types/athlete-portal'

interface CardScoreGeralProps {
    score: ScoreGeral
}

const CLASSIFICATION_COLORS = {
    'INICIANTE': 'text-gray-400',
    'EVOLUINDO': 'text-blue-400',
    'QUASE LÁ': 'text-yellow-400',
    'SHAPE MODELO': 'text-teal-400',
    'DEUS GREGO': 'text-purple-400'
}

export function CardScoreGeral({ score }: CardScoreGeralProps) {
    const classificationColor = CLASSIFICATION_COLORS[score.classificacao] || 'text-gray-400'
    const isPositive = score.variacaoVsMes >= 0

    return (
        <div className="bg-gradient-to-br from-teal-500/10 to-purple-500/10 rounded-xl p-6 border border-teal-500/30">
            {/* Emoji e Classificação */}
            <div className="text-center mb-4">
                <div className="text-6xl mb-3">{score.emoji}</div>
                <h3 className={`text-xl font-bold uppercase tracking-wider ${classificationColor}`}>
                    {score.classificacao}
                </h3>
            </div>

            {/* Score */}
            <div className="text-center mb-4">
                <div className="text-5xl font-bold text-white mb-1">
                    {score.score}
                </div>
                <p className="text-sm text-gray-400">Score Geral</p>
            </div>

            {/* Variação */}
            <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-700">
                {isPositive ? (
                    <TrendingUp size={18} className="text-green-400" />
                ) : (
                    <TrendingDown size={18} className="text-red-400" />
                )}
                <span className={`text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? '+' : ''}{score.variacaoVsMes} pontos
                </span>
                <span className="text-xs text-gray-500">vs mês passado</span>
            </div>
        </div>
    )
}
