/**
 * ProgressBar - Atom Component
 * 
 * Barra de progresso genérica com cores personalizáveis
 */

import React from 'react'

export interface ProgressBarProps {
    /** Valor atual (0-100) */
    value: number
    /** Valor máximo (default: 100) */
    max?: number
    /** Cor de fundo da barra */
    backgroundColor?: string
    /** Cor da barra de progresso */
    progressColor?: string
    /** Altura da barra */
    height?: 'sm' | 'md' | 'lg'
    /** Mostrar texto com percentual */
    showPercentage?: boolean
    className?: string
}

const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
}

/**
 * Barra de progresso para trackers
 * 
 * @example
 * <ProgressBar value={75} progressColor="bg-green-500" />
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
    value,
    max = 100,
    backgroundColor = 'bg-gray-700',
    progressColor = 'bg-primary',
    height = 'sm',
    showPercentage = false,
    className = '',
}) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100))

    return (
        <div className={`w-full ${className}`}>
            <div className={`w-full ${backgroundColor} rounded-full overflow-hidden ${heightClasses[height]}`}>
                <div
                    className={`${progressColor} h-full transition-all duration-300 rounded-full`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {showPercentage && (
                <div className="text-xs text-gray-400 mt-1 text-right">
                    {Math.round(percentage)}%
                </div>
            )}
        </div>
    )
}

export default ProgressBar
