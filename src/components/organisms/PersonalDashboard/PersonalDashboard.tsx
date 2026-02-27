/**
 * PersonalDashboard - Dashboard organism para Personal Trainer
 * Conectado ao dataStore (Supabase) — sem dados mockados
 */

import React, { useState } from 'react'
import { Search, BarChart3, Users, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { AthleteStatusCard } from '../../molecules/AthleteStatusCard'
import { AthleteEvolutionModal } from '../../molecules/AthleteEvolutionModal'
import { usePersonalDashboardStore } from '../../../stores/usePersonalDashboardStore'
import { useDataStore } from '../../../stores/dataStore'
import type { StatusAtleta, AtletaDailyStatus } from '../../../types/daily-tracking'

interface PersonalDashboardProps {
    onAtletaClick?: (atletaId: string) => void
}

const FILTRO_OPTIONS: { value: StatusAtleta | 'todos'; label: string; icon: React.ElementType; color: string }[] = [
    { value: 'todos', label: 'Todos', icon: Users, color: 'blue' },
    { value: 'ativo', label: 'Ativos', icon: CheckCircle, color: 'green' },
    { value: 'atencao', label: 'Atenção', icon: AlertTriangle, color: 'yellow' },
    { value: 'alerta', label: 'Alerta', icon: XCircle, color: 'red' },
    { value: 'inativo', label: 'Inativos', icon: Users, color: 'gray' },
]

export const PersonalDashboard: React.FC<PersonalDashboardProps> = ({ onAtletaClick }) => {
    const {
        filtroStatus,
        setFiltroStatus,
    } = usePersonalDashboardStore()

    const { personalAthletes } = useDataStore()

    const [searchTerm, setSearchTerm] = useState('')
    const [atletaSelecionado, setAtletaSelecionado] = useState<AtletaDailyStatus | null>(null)
    const [mostrarEvolucao, setMostrarEvolucao] = useState(false)

    // Mapear personalAthletes para AtletaDailyStatus
    const atletas: AtletaDailyStatus[] = personalAthletes.map(a => ({
        id: a.id,
        nome: a.name,
        avatar: a.avatarUrl || undefined,
        status: (a.status === 'active' ? 'ativo' : a.status === 'attention' ? 'atencao' : 'inativo') as StatusAtleta,
        ultimaAtividade: a.lastMeasurement ? new Date(a.lastMeasurement) : new Date(),
        resumoHoje: {
            refeicoes: { atual: 0, meta: 5 },
            treino: { realizado: false },
            agua: { atual: 0, meta: 3000 },
            sono: { horas: 0, qualidade: 0 },
        },
        alertas: [],
    }))

    const handleVerEvolucao = (atletaId: string) => {
        const atleta = atletas.find(a => a.id === atletaId)
        if (atleta) {
            setAtletaSelecionado(atleta)
            setMostrarEvolucao(true)
        }
    }

    const atletasFiltrados = atletas.filter(atleta => {
        const matchStatus = filtroStatus === 'todos' || atleta.status === filtroStatus
        const matchSearch = atleta.nome.toLowerCase().includes(searchTerm.toLowerCase())
        return matchStatus && matchSearch
    })

    const stats = {
        total: atletas.length,
        ativos: atletas.filter(a => a.status === 'ativo').length,
        atencao: atletas.filter(a => a.status === 'atencao').length,
        alerta: atletas.filter(a => a.status === 'alerta').length,
        inativos: atletas.filter(a => a.status === 'inativo').length,
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Dashboard de Atletas
                    </h1>
                    <p className="text-gray-400">
                        Acompanhe o progresso e status de seus atletas em tempo real
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-4">
                    <div className="text-blue-300 text-sm mb-1">Total</div>
                    <div className="text-3xl font-bold text-white">{stats.total}</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-4">
                    <div className="text-green-300 text-sm mb-1">Ativos</div>
                    <div className="text-3xl font-bold text-white">{stats.ativos}</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
                    <div className="text-yellow-300 text-sm mb-1">Atenção</div>
                    <div className="text-3xl font-bold text-white">{stats.atencao}</div>
                </div>
                <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30 rounded-xl p-4">
                    <div className="text-red-300 text-sm mb-1">Alerta</div>
                    <div className="text-3xl font-bold text-white">{stats.alerta}</div>
                </div>
                <div className="bg-gradient-to-br from-gray-500/20 to-gray-600/10 border border-gray-500/30 rounded-xl p-4">
                    <div className="text-gray-300 text-sm mb-1">Inativos</div>
                    <div className="text-3xl font-bold text-white">{stats.inativos}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar atleta..."
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-12 pr-4 py-3
              text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {FILTRO_OPTIONS.map(option => (
                        <button
                            key={option.value}
                            onClick={() => setFiltroStatus(option.value)}
                            className={`
                px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors
                ${filtroStatus === option.value
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }
              `}
                        >
                            {option.label}
                            {option.value !== 'todos' && (
                                <span className="ml-2 text-xs opacity-70">
                                    ({stats[option.value as keyof typeof stats]})
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Athletes Grid */}
            {atletasFiltrados.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {atletasFiltrados.map(atleta => (
                        <div key={atleta.id} className="relative group">
                            <AthleteStatusCard
                                atleta={atleta}
                                onClick={() => onAtletaClick?.(atleta.id)}
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleVerEvolucao(atleta.id)
                                }}
                                className="absolute top-2 right-2 p-2 bg-blue-500/80 hover:bg-blue-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                title="Ver evolução"
                            >
                                <BarChart3 size={18} className="text-white" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white/5 border border-dashed border-white/10 rounded-2xl">
                    <Users size={48} className="text-gray-600 mx-auto mb-4" />
                    <div className="text-gray-400 text-lg mb-2">
                        {atletas.length === 0 ? 'Nenhum atleta cadastrado ainda' : 'Nenhum atleta encontrado'}
                    </div>
                    <p className="text-gray-600 text-sm">
                        {atletas.length === 0
                            ? 'Cadastre seus atletas para começar a acompanhar o progresso deles.'
                            : 'Tente ajustar os filtros ou termo de busca'}
                    </p>
                </div>
            )}

            {/* Modal de Evolução */}
            {mostrarEvolucao && atletaSelecionado && (
                <AthleteEvolutionModal
                    isOpen={mostrarEvolucao}
                    onClose={() => {
                        setMostrarEvolucao(false)
                        setAtletaSelecionado(null)
                    }}
                    atleta={atletaSelecionado}
                    historico={[]}
                />
            )}
        </div>
    )
}

export default PersonalDashboard
