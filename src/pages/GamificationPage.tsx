/**
 * Gamification Page
 * Página dedicada para visualizar progresso, badges e conquistas
 */

import React from 'react'
import { GamificationPanel } from '../components/organisms/GamificationPanel'
import { mockGamificationProfiles } from '../mocks/gamification-profiles'

export const GamificationPage: React.FC = () => {
    // Em produção, pegar o ID do atleta logado
    const athleteId = '1' // João Silva
    const gamificationProfile = mockGamificationProfiles[athleteId as keyof typeof mockGamificationProfiles]

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                        <span className="text-5xl">🎮</span>
                        Gamificação
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Acompanhe seu progresso, conquiste badges e suba de nível!
                    </p>
                </div>

                {/* Gamification Panel */}
                <GamificationPanel profile={gamificationProfile} />
            </div>
        </div>
    )
}

export default GamificationPage
