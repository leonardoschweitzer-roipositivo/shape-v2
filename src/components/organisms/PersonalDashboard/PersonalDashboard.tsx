/**
 * PersonalDashboard - Dashboard organism para Personal Trainer
 */

import React, { useEffect, useState } from 'react'
import { Search, Filter, Bell, BarChart3 } from 'lucide-react'
import { AthleteStatusCard } from '../../molecules/AthleteStatusCard'
import { AthleteEvolutionModal } from '../../molecules/AthleteEvolutionModal'
import { usePersonalDashboardStore } from '../../../stores/usePersonalDashboardStore'
import { mockAtletas, mockAlertas } from '../../../mocks/personal-dashboard'
import { mockHistoricoAtletas } from '../../../mocks/daily-tracking-history'
import type { StatusAtleta, AtletaDailyStatus } from '../../../types/daily-tracking'

interface PersonalDashboardProps {
    onAtletaClick?: (atletaId: string) => void
}

const FILTRO_OPTIONS: { value: StatusAtleta | 'todos'; label: string; count?: number }[] = [
    { value: 'todos', label: 'Todos' },
    { value: 'ativo', label: 'Ativos' },
    { value: 'atencao', label: 'Atenção' },
    { value: 'alerta', label: 'Alerta' },
    { value: 'inativo', label: 'Inativos' },
]

export const PersonalDashboard: React.FC<PersonalDashboardProps> = ({ onAtletaClick }) => {
    const {
        atletas,
        setAtletas,
        filtroStatus,
        setFiltroStatus,
        alertasNaoLidas,
    } = usePersonalDashboardStore()

    const [searchTerm, setSearchTerm] = useState('')
    const [mostrarAlertas, setMostrarAlertas] = useState(false)
    const [atletaSelecionado, setAtletaSelecionado] = useState<AtletaDailyStatus | null>(null)
    const [mostrarEvolucao, setMostrarEvolucao] = useState(false)

    // Handler para visualizar evolução do atleta
    const handleVerEvolucao = (atletaId: string) => {
        const atleta = atletas.find(a => a.id === atletaId)
        if (atleta) {
            setAtletaSelecionado(atleta)
            setMostrarEvolucao(true)
        }
    }

    // Carregar dados mock
    useEffect(() => {
        setAtletas(mockAtletas)
        // Simular alertas não lidos
        usePersonalDashboardStore.setState({
            alertas: mockAlertas,
            alertasNaoLidas: mockAlertas.length,
        })
    }, [setAtletas])

    // Filtrar atletas
    const atletasFiltrados = atletas.filter(atleta => {
        const matchStatus = filtroStatus === 'todos' || atleta.status === filtroStatus
        const matchSearch = atleta.nome.toLowerCase().includes(searchTerm.toLowerCase())
        return matchStatus && matchSearch
    })

    // Estatísticas
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

                {/* Botão de Alertas */}
                <button
                    onClick={() => setMostrarAlertas(!mostrarAlertas)}
                    className="relative p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                    <Bell size={24} className="text-gray-300" />
                    {alertasNaoLidas > 0 && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {alertasNaoLidas}
                        </div>
                    )}
                </button>
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
                {/* Search */}
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

                {/* Status Filter */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {atletasFiltrados.map(atleta => (
                    <div key={atleta.id} className="relative group">
                        <AthleteStatusCard
                            atleta={atleta}
                            onClick={() => onAtletaClick?.(atleta.id)}
                        />
                        {/* Botão de evolução */}
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

            {/* Empty State */}
            {atletasFiltrados.length === 0 && (
                <div className="text-center py-16">
                    <div className="text-gray-500 text-lg mb-2">
                        Nenhum atleta encontrado
                    </div>
                    <p className="text-gray-600 text-sm">
                        Tente ajustar os filtros ou termo de busca
                    </p>
                </div>
            )}

            {/* Alertas Sidebar (Modal Simplificado) */}
            {mostrarAlertas && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-end p-6">
                    <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-700 sticky top-0 bg-gray-900">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white">Alertas</h3>
                                <button
                                    onClick={() => setMostrarAlertas(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            {mockAlertas.map(alerta => (
                                <div
                                    key={alerta.id}
                                    className={`
                    p-4 rounded-lg border-l-4
                    ${alerta.prioridade === 1 ? 'border-red-500 bg-red-500/10' :
                                            alerta.prioridade === 2 ? 'border-yellow-500 bg-yellow-500/10' :
                                                'border-blue-500 bg-blue-500/10'
                                        }
                  `}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="font-semibold text-white text-sm">
                                            {alerta.atletaNome}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(alerta.timestamp).toLocaleTimeString('pt-BR', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </div>
                                    </div>
                                    <div className="text-gray-300 text-sm mb-3">
                                        {alerta.mensagem}
                                    </div>
                                    {alerta.acao && (
                                        <button className="text-blue-400 text-sm hover:underline">
                                            {alerta.acao.label} →
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Evolução */}
            {mostrarEvolucao && atletaSelecionado && mockHistoricoAtletas[atletaSelecionado.id as keyof typeof mockHistoricoAtletas] && (
                <AthleteEvolutionModal
                    isOpen={mostrarEvolucao}
                    onClose={() => {
                        setMostrarEvolucao(false)
                        setAtletaSelecionado(null)
                    }}
                    atleta={atletaSelecionado}
                    historico={mockHistoricoAtletas[atletaSelecionado.id as keyof typeof mockHistoricoAtletas]}
                />
            )}
        </div>
    )
}

export default PersonalDashboard
