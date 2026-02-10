/**
 * TrackerButton - Molecule Component
 * 
 * Botão de tracker individual com status, progresso e visual dinâmico
 */

import React from 'react'
import { ProgressBar } from '../../atoms/ProgressBar'
import type { TrackerButton as TrackerButtonType } from '../../../types/daily-tracking'
import { STATUS_STYLES } from '../../../config/tracker-config'

export interface TrackerButtonProps {
    tracker: TrackerButtonType
    onClick: () => void
}

/**
 * Botão de tracker para acompanhamento diário
 * 
 * @example
 * <TrackerButton 
 *   tracker={{
 *     id: 'refeicao',
 *     icon: '🍽️',
 *     label: 'Refeição',
 *     status: 'parcial',
 *     atual: 2,
 *     meta: 5
 *   }}
 *   onClick={() => console.log('clicked')}
 * />
 */
export const TrackerButton: React.FC<TrackerButtonProps> = ({
    tracker,
    onClick
}) => {
    const styles = STATUS_STYLES[tracker.status]

    // Calcular progresso
    const progresso = tracker.meta
        ? Math.min(100, ((tracker.atual || 0) / tracker.meta) * 100)
        : 0

    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center gap-2 p-3 rounded-lg
        transition-all duration-200 hover:scale-105 hover:shadow-lg
        min-w-[100px]"
            style={{
                borderWidth: '2px',
                borderColor: styles.corBorda,
                backgroundColor: styles.corFundo,
            }}
        >
            {/* Ícone */}
            <span className="text-3xl">{tracker.icon}</span>

            {/* Label */}
            <span
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: styles.corTexto }}
            >
                {tracker.label}
            </span>

            {/* Valor/Status */}
            <div className="text-sm font-bold" style={{ color: styles.corTexto }}>
                {tracker.atual !== undefined && tracker.meta ? (
                    <span>{tracker.atual}/{tracker.meta}{tracker.unidade}</span>
                ) : tracker.detalhe ? (
                    <span>{tracker.detalhe}</span>
                ) : tracker.status === 'completo' ? (
                    <span>✓</span>
                ) : (
                    <span className="text-gray-500">+</span>
                )}
            </div>

            {/* Barra de progresso */}
            {tracker.meta && (
                <ProgressBar
                    value={progresso}
                    height="sm"
                    backgroundColor="bg-gray-800"
                    progressColor={
                        tracker.status === 'completo' ? 'bg-green-500' :
                            tracker.status === 'parcial' ? 'bg-amber-500' :
                                tracker.status === 'alerta' ? 'bg-red-500' :
                                    'bg-gray-600'
                    }
                    className="w-full"
                />
            )}

            {/* Horário (para treino) */}
            {tracker.horario && (
                <span className="text-[10px] text-gray-500">
                    {tracker.horario}
                </span>
            )}

            {/* Ícone extra de status */}
            {styles.iconeExtra && (
                <span className="absolute top-1 right-1 text-xs">
                    {styles.iconeExtra}
                </span>
            )}
        </button>
    )
}

export default TrackerButton
