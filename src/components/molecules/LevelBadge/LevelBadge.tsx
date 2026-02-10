/**
 * LevelBadge - Badge visual do nível do atleta
 */

import React from 'react'
import type { Nivel, XPSystem } from '../../../types/gamification'

interface LevelBadgeProps {
    nivel: Nivel
    xpSystem: XPSystem
    size?: 'sm' | 'md' | 'lg'
    showProgress?: boolean
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({
    nivel,
    xpSystem,
    size = 'md',
    showProgress = true,
}) => {
    const sizeClasses = {
        sm: 'w-12 h-12 text-lg',
        md: 'w-16 h-16 text-2xl',
        lg: 'w-20 h-20 text-3xl',
    }

    const textSizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    }

    return (
        <div className="flex items-center gap-3">
            {/* Badge circular */}
            <div className="relative">
                <div
                    className={`
            ${sizeClasses[size]}
            rounded-full
            flex items-center justify-center
            font-bold
            border-2
            relative
            shadow-lg
          `}
                    style={{
                        backgroundColor: `${nivel.cor}20`,
                        borderColor: nivel.cor,
                        color: nivel.cor,
                    }}
                >
                    <span>{nivel.icone}</span>

                    {/* Número do nível */}
                    <div
                        className="
              absolute -bottom-1 -right-1
              w-6 h-6 rounded-full
              bg-gray-900 border-2
              flex items-center justify-center
              text-xs font-bold text-white
            "
                        style={{ borderColor: nivel.cor }}
                    >
                        {nivel.nivel}
                    </div>
                </div>

                {/* Círculo de progresso */}
                {showProgress && (
                    <svg
                        className="absolute inset-0 -rotate-90"
                        viewBox="0 0 100 100"
                    >
                        <circle
                            cx="50"
                            cy="50"
                            r="48"
                            fill="none"
                            stroke="#1F2937"
                            strokeWidth="2"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="48"
                            fill="none"
                            stroke={nivel.cor}
                            strokeWidth="2"
                            strokeDasharray={`${xpSystem.percentualNivel * 3.01} 301`}
                            strokeLinecap="round"
                            className="transition-all duration-500"
                        />
                    </svg>
                )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
                <div className={`font-bold ${textSizeClasses[size]}`} style={{ color: nivel.cor }}>
                    {nivel.nome}
                </div>

                {showProgress && (
                    <>
                        <div className="text-xs text-gray-400">
                            Nível {nivel.nivel}
                        </div>

                        {/* Barra de progresso */}
                        <div className="mt-1 w-32 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${xpSystem.percentualNivel}%`,
                                    backgroundColor: nivel.cor,
                                }}
                            />
                        </div>

                        <div className="text-xs text-gray-500 mt-0.5">
                            {xpSystem.xpAtual.toLocaleString()} / {xpSystem.xpProximoNivel.toLocaleString()} XP
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default LevelBadge
