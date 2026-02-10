/**
 * Nutrit

ionalSummary - Molecule Component
 * 
 * Resumo nutricional do dia com macros e progresso
 */

import React from 'react'
import { ProgressBar } from '../../atoms/ProgressBar'

export interface NutritionalSummaryProps {
    calorias: { atual: number; meta: number }
    proteina: { atual: number; meta: number }
    carboidratos: { atual: number; meta: number }
    gordura: { atual: number; meta: number }
    className?: string
}

/**
 * Resumo nutricional do dia
 * 
 * @example
 * <NutritionalSummary
 *   calorias={{ atual: 1200, meta: 2500 }}
 *   proteina={{ atual: 80, meta: 180 }}
 *   carboidratos={{ atual: 120, meta: 280 }}
 *   gordura={{ atual: 45, meta: 70 }}
 * />
 */
export const NutritionalSummary: React.FC<NutritionalSummaryProps> = ({
    calorias,
    proteina,
    carboidratos,
    gordura,
    className = '',
}) => {
    const macros = [
        { label: 'Calorias', ...calorias, unidade: '' },
        { label: 'Proteína', ...proteina, unidade: 'g' },
        { label: 'Carbos', ...carboidratos, unidade: 'g' },
        { label: 'Gordura', ...gordura, unidade: 'g' },
    ]

    return (
        <div className={`grid grid-cols-4 gap-4 ${className}`}>
            {macros.map((macro) => {
                const percentual = (macro.atual / macro.meta) * 100

                return (
                    <div key={macro.label} className="flex flex-col gap-2">
                        <div className="text-xs text-gray-400 font-semibold uppercase">
                            {macro.label}
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <div className="text-2xl font-bold text-white">
                                {Math.round(macro.atual)}{macro.unidade}
                            </div>
                            <div className="text-xs text-gray-500">
                                ────────
                            </div>
                            <div className="text-sm text-gray-400">
                                {Math.round(macro.meta)}{macro.unidade}
                            </div>
                        </div>

                        <ProgressBar
                            value={percentual}
                            height="sm"
                            progressColor={
                                percentual >= 90 ? 'bg-green-500' :
                                    percentual >= 60 ? 'bg-amber-500' :
                                        'bg-red-500'
                            }
                        />

                        <div className={`
              text-xs font-bold text-center
              ${percentual >= 90 ? 'text-green-400' :
                                percentual >= 60 ? 'text-amber-400' :
                                    'text-red-400'}
            `}>
                            {Math.round(percentual)}%
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default NutritionalSummary
