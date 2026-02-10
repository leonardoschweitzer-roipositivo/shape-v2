/**
 * GamificationPanel - Painel de gamificação com XP, Nível, Streak e Badges
 */

import React, { useState } from 'react'
import { Trophy, Zap, Award } from 'lucide-react'
import { LevelBadge } from '../../molecules/LevelBadge'
import { StreakDisplay } from '../../molecules/StreakDisplay'
import { BadgeCard } from '../../molecules/BadgeCard'
import type { GamificationProfile } from '../../../types/gamification'
import { calcularNivel, calcularXPSystem } from '../../../services/gamification'

interface GamificationPanelProps {
    profile: GamificationProfile
}

export const GamificationPanel: React.FC<GamificationPanelProps> = ({ profile }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'badges'>('overview')

    const nivelAtual = calcularNivel(profile.xp.totalXP)
    const xpSystem = calcularXPSystem(profile.xp.totalXP)

    const badgesDesbloqueados = profile.badges.filter(b => b.desbloqueado)
    const badgesPorCategoria = {
        streak: profile.badges.filter(b => b.categoria === 'streak'),
        treino: profile.badges.filter(b => b.categoria === 'treino'),
        nutricao: profile.badges.filter(b => b.categoria === 'nutricao'),
        progresso: profile.badges.filter(b => b.categoria === 'progresso'),
        especial: profile.badges.filter(b => b.categoria === 'especial'),
    }

    return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-6 border-b border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Trophy size={28} className="text-yellow-500" />
                        Progresso & Conquistas
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Nível */}
                    <div className="bg-black/20 rounded-xl p-4 border border-white/10">
                        <LevelBadge nivel={nivelAtual} xpSystem={xpSystem} />
                    </div>

                    {/* Streak */}
                    <div className="bg-black/20 rounded-xl p-4 border border-white/10">
                        <StreakDisplay streak={profile.streak} />
                    </div>

                    {/* Stats Rápidas */}
                    <div className="bg-black/20 rounded-xl p-4 border border-white/10">
                        <div className="text-sm text-gray-400 mb-3 font-semibold">CONQUISTAS</div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300 text-sm">Badges</span>
                                <span className="text-white font-bold">
                                    {badgesDesbloqueados.length}/{profile.totalBadges}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300 text-sm">Treinos</span>
                                <span className="text-white font-bold">
                                    {profile.stats.treinosCompletados}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300 text-sm">Dias Ativos</span>
                                <span className="text-white font-bold">
                                    {profile.stats.diasAtivos}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-700">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`
            flex-1 px-6 py-3 font-semibold transition-colors
            ${activeTab === 'overview'
                            ? 'bg-gray-800 text-white border-b-2 border-blue-500'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                        }
          `}
                >
                    <div className="flex items-center justify-center gap-2">
                        <Zap size={18} />
                        <span>Visão Geral</span>
                    </div>
                </button>

                <button
                    onClick={() => setActiveTab('badges')}
                    className={`
            flex-1 px-6 py-3 font-semibold transition-colors
            ${activeTab === 'badges'
                            ? 'bg-gray-800 text-white border-b-2 border-purple-500'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                        }
          `}
                >
                    <div className="flex items-center justify-center gap-2">
                        <Award size={18} />
                        <span>Badges ({badgesDesbloqueados.length})</span>
                    </div>
                </button>
            </div>

            {/* Content */}
            <div className="p-6">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Progresso de XP Detalhado */}
                        <div>
                            <h3 className="text-white font-semibold mb-3">Progressão de XP</h3>
                            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-400 text-sm">XP Total</span>
                                    <span className="text-white font-bold">
                                        {xpSystem.totalXP.toLocaleString()} XP
                                    </span>
                                </div>

                                <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${xpSystem.percentualNivel}%`,
                                            background: `linear-gradient(90deg, ${nivelAtual.cor}80, ${nivelAtual.cor})`,
                                        }}
                                    />
                                </div>

                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-gray-500 text-xs">
                                        Nível {nivelAtual.nivel}
                                    </span>
                                    <span className="text-gray-500 text-xs">
                                        Nível {nivelAtual.nivel + 1}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Últimas Conquistas */}
                        <div>
                            <h3 className="text-white font-semibold mb-3">Últimas Conquistas</h3>
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                {badgesDesbloqueados
                                    .sort((a, b) =>
                                        new Date(b.dataDesbloqueio!).getTime() - new Date(a.dataDesbloqueio!).getTime()
                                    )
                                    .slice(0, 5)
                                    .map(badge => (
                                        <BadgeCard key={badge.id} badge={badge} size="sm" showProgress={false} />
                                    ))}

                                {badgesDesbloqueados.length === 0 && (
                                    <div className="col-span-full text-center text-gray-400 py-8">
                                        Nenhuma conquista desbloqueada ainda. Continue registrando suas atividades!
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Estatísticas */}
                        <div>
                            <h3 className="text-white font-semibold mb-3">Estatísticas Gerais</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                                    <div className="text-3xl mb-1">🏋️</div>
                                    <div className="text-2xl font-bold text-white">
                                        {profile.stats.treinosCompletados}
                                    </div>
                                    <div className="text-xs text-gray-400">Treinos</div>
                                </div>

                                <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                                    <div className="text-3xl mb-1">🍽️</div>
                                    <div className="text-2xl font-bold text-white">
                                        {profile.stats.refeicõesRegistradas}
                                    </div>
                                    <div className="text-xs text-gray-400">Refeições</div>
                                </div>

                                <div className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-500/30">
                                    <div className="text-3xl mb-1">💧</div>
                                    <div className="text-2xl font-bold text-white">
                                        {profile.stats.litrosAguaBebidos}L
                                    </div>
                                    <div className="text-xs text-gray-400">Água</div>
                                </div>

                                <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                                    <div className="text-3xl mb-1">😴</div>
                                    <div className="text-2xl font-bold text-white">
                                        {profile.stats.horasDormidas}h
                                    </div>
                                    <div className="text-xs text-gray-400">Sono</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'badges' && (
                    <div className="space-y-6">
                        {/* Badges por Categoria */}
                        {Object.entries(badgesPorCategoria).map(([categoria, badges]) => {
                            const desbloqueados = badges.filter(b => b.desbloqueado).length

                            return (
                                <div key={categoria}>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-white font-semibold capitalize">
                                            {categoria === 'streak' && '🔥 Streaks'}
                                            {categoria === 'treino' && '🏋️ Treino'}
                                            {categoria === 'nutricao' && '🍽️ Nutrição'}
                                            {categoria === 'progresso' && '📈 Progresso'}
                                            {categoria === 'especial' && '⭐ Especiais'}
                                        </h3>
                                        <span className="text-sm text-gray-400">
                                            {desbloqueados}/{badges.length}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                        {badges.map(badge => (
                                            <BadgeCard key={badge.id} badge={badge} size="md" />
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default GamificationPanel
