/**
 * AthleteStatusCard - Card de status do atleta no dashboard do personal
 */

import React from 'react'
import { User, Droplet, Utensils, Dumbbell, Moon, AlertTriangle, Clock } from 'lucide-react'
import type { AtletaDailyStatus } from '../../../types/daily-tracking'

interface AthleteStatusCardProps {
    atleta: AtletaDailyStatus
    onClick?: () => void
}

const STATUS_STYLES = {
    ativo: {
        border: 'border-green-500/50',
        bg: 'bg-green-500/10',
        dot: 'bg-green-500',
        label: 'Ativo',
    },
    atencao: {
        border: 'border-yellow-500/50',
        bg: 'bg-yellow-500/10',
        dot: 'bg-yellow-500',
        label: 'Atenção',
    },
    alerta: {
        border: 'border-red-500/50',
        bg: 'bg-red-500/10',
        dot: 'bg-red-500',
        label: 'Alerta',
    },
    inativo: {
        border: 'border-gray-500/50',
        bg: 'bg-gray-500/10',
        dot: 'bg-gray-500',
        label: 'Inativo',
    },
}

export const AthleteStatusCard: React.FC<AthleteStatusCardProps> = ({ atleta, onClick }) => {
    const statusStyle = STATUS_STYLES[atleta.status]

    const formatUltimaAtividade = (data: Date) => {
        const agora = new Date()
        const diff = agora.getTime() - data.getTime()
        const minutos = Math.floor(diff / (1000 * 60))
        const horas = Math.floor(minutos / 60)
        const dias = Math.floor(horas / 24)

        if (dias > 0) return `${dias}d atrás`
        if (horas > 0) return `${horas}h atrás`
        if (minutos > 0) return `${minutos}min atrás`
        return 'Agora'
    }

    return (
        <div
            onClick={onClick}
            className={`
        relative p-4 rounded-xl border-2 ${statusStyle.border} ${statusStyle.bg}
        cursor-pointer transition-all duration-200
        hover:scale-[1.02] hover:shadow-xl
        bg-gradient-to-br from-gray-900/90 to-gray-800/90
      `}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {atleta.avatar ? (
                            <img src={atleta.avatar} alt={atleta.nome} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <User size={24} />
                        )}
                    </div>

                    {/* Nome e Status */}
                    <div>
                        <h3 className="text-white font-semibold text-lg">{atleta.nome}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <div className={`w-2 h-2 rounded-full ${statusStyle.dot} animate-pulse`} />
                            <span className="text-xs text-gray-400">{statusStyle.label}</span>
                        </div>
                    </div>
                </div>

                {/* Última Atividade */}
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Clock size={12} />
                    <span>{formatUltimaAtividade(atleta.ultimaAtividade)}</span>
                </div>
            </div>

            {/* Métricas Rápidas */}
            <div className="grid grid-cols-2 gap-3 mb-3">
                {/* Refeições */}
                <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-2">
                    <Utensils size={16} className={`
            ${atleta.resumoHoje.refeicoes.atual >= atleta.resumoHoje.refeicoes.meta * 0.6
                            ? 'text-green-400'
                            : 'text-red-400'
                        }
          `} />
                    <div className="flex-1">
                        <div className="text-[10px] text-gray-400 uppercase">Refeições</div>
                        <div className="text-sm font-semibold text-white">
                            {atleta.resumoHoje.refeicoes.atual}/{atleta.resumoHoje.refeicoes.meta}
                        </div>
                    </div>
                </div>

                {/* Água */}
                <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-2">
                    <Droplet size={16} className={`
            ${atleta.resumoHoje.agua.atual >= atleta.resumoHoje.agua.meta * 0.8
                            ? 'text-blue-400'
                            : 'text-red-400'
                        }
          `} />
                    <div className="flex-1">
                        <div className="text-[10px] text-gray-400 uppercase">Água</div>
                        <div className="text-sm font-semibold text-white">
                            {(atleta.resumoHoje.agua.atual / 1000).toFixed(1)}L
                        </div>
                    </div>
                </div>

                {/* Treino */}
                <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-2">
                    <Dumbbell size={16} className={`
            ${atleta.resumoHoje.treino.realizado
                            ? 'text-green-400'
                            : 'text-gray-400'
                        }
          `} />
                    <div className="flex-1">
                        <div className="text-[10px] text-gray-400 uppercase">Treino</div>
                        <div className="text-xs font-semibold text-white truncate">
                            {atleta.resumoHoje.treino.realizado
                                ? atleta.resumoHoje.treino.tipo || 'Completo'
                                : 'Pendente'
                            }
                        </div>
                    </div>
                </div>

                {/* Sono */}
                <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-2">
                    <Moon size={16} className={`
            ${atleta.resumoHoje.sono.horas >= 7
                            ? 'text-purple-400'
                            : 'text-yellow-400'
                        }
          `} />
                    <div className="flex-1">
                        <div className="text-[10px] text-gray-400 uppercase">Sono</div>
                        <div className="text-sm font-semibold text-white">
                            {atleta.resumoHoje.sono.horas}h
                        </div>
                    </div>
                </div>
            </div>

            {/* Alertas */}
            {atleta.alertas.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-700/50">
                    <div className="flex items-center gap-2 text-yellow-400 text-xs">
                        <AlertTriangle size={14} />
                        <span className="font-semibold">{atleta.alertas.length} alerta(s):</span>
                    </div>
                    <div className="mt-1 space-y-1">
                        {atleta.alertas.slice(0, 2).map((alerta, index) => (
                            <div key={index} className="text-xs text-gray-400 truncate">
                                • {alerta}
                            </div>
                        ))}
                        {atleta.alertas.length > 2 && (
                            <div className="text-xs text-gray-500">
                                +{atleta.alertas.length - 2} mais...
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default AthleteStatusCard
