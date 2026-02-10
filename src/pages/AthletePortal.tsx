/**
 * AthletePortal - Container principal do Portal do Atleta
 * 
 * Gerencia a navegação entre as 4 telas: HOJE, COACH, PROGRESSO, PERFIL
 */

import React, { useState } from 'react'
import { BottomNavigation } from '../components/organisms/BottomNavigation'
import { TodayScreen, CoachScreen, ProgressScreen, ProfileScreen } from './athlete'
import { AthletePortalTab } from '../types/athlete-portal'
import { mockTodayData } from '../mocks/athletePortalMockData'
import { mockChatMessages } from '../mocks/chatMockData'
import { mockScoreGeral, mockGraficoEvolucao, mockProporcoesResumo, mockHistoricoAvaliacoes } from '../mocks/progressMockData'
import { mockProfileData, mockDadosBasicos, mockMeuPersonal } from '../mocks/profileMockData'

export function AthletePortal() {
    const [activeTab, setActiveTab] = useState<AthletePortalTab>('hoje')

    // Handlers para a tela HOJE
    const handleVerTreino = () => {
        console.log('Ver treino completo')
        // TODO: Abrir modal com detalhes do treino
    }

    const handleCompletarTreino = () => {
        console.log('Completar treino')
        // TODO: Abrir modal de feedback de treino
    }

    const handlePularTreino = () => {
        console.log('Pular treino')
        // TODO: Confirmar e marcar como pulado
    }

    const handleRegistrarRefeicao = () => {
        console.log('Registrar refeição')
        // TODO: Abrir modal de registro de refeição
    }

    const handleTrackerClick = (tipo: string) => {
        console.log('Tracker clicado:', tipo)
        // TODO: Abrir modal específico do tracker
    }

    const handleFalarComCoach = () => {
        console.log('Falar com coach')
        // Navegar para aba de coach
        setActiveTab('coach')
    }

    const renderActiveScreen = () => {
        switch (activeTab) {
            case 'hoje':
                return (
                    <TodayScreen
                        data={mockTodayData}
                        onVerTreino={handleVerTreino}
                        onCompletarTreino={handleCompletarTreino}
                        onPularTreino={handlePularTreino}
                        onRegistrarRefeicao={handleRegistrarRefeicao}
                        onTrackerClick={handleTrackerClick}
                        onFalarComCoach={handleFalarComCoach}
                    />
                )

            case 'coach':
                return (
                    <CoachScreen initialMessages={mockChatMessages} />
                )

            case 'progresso':
                return (
                    <ProgressScreen
                        scoreGeral={mockScoreGeral}
                        graficoEvolucao={mockGraficoEvolucao}
                        proporcoes={mockProporcoesResumo}
                        historicoAvaliacoes={mockHistoricoAvaliacoes}
                        onVerDetalhesAvaliacao={(id) => console.log('Ver avaliação:', id)}
                    />
                )

            case 'perfil':
                return (
                    <ProfileScreen
                        nome={mockProfileData.nome}
                        email={mockProfileData.email}
                        fotoUrl={mockProfileData.fotoUrl}
                        dadosBasicos={mockDadosBasicos}
                        personal={mockMeuPersonal}
                        onSettings={() => console.log('Abrir configurações')}
                        onHelp={() => console.log('Abrir ajuda')}
                        onLogout={() => console.log('Logout')}
                    />
                )

            default:
                return null
        }
    }

    return (
        <div className="relative">
            {/* Active Screen */}
            {renderActiveScreen()}

            {/* Bottom Navigation */}
            <BottomNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
        </div>
    )
}
