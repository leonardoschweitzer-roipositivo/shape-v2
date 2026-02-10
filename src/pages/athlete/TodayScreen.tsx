/**
 * TodayScreen - Tela HOJE do Portal do Atleta
 * 
 * Tela principal do dia-a-dia com treino, dieta, trackers e dica do coach
 */

import React from 'react'
import { HeaderHoje } from '../../components/molecules/HeaderHoje'
import { CardTreino } from '../../components/organisms/CardTreino'
import { CardDieta } from '../../components/organisms/CardDieta'
import { TrackersRapidos } from '../../components/organisms/TrackersRapidos'
import { DicaCoach } from '../../components/molecules/DicaCoach'
import { TodayScreenData, TrackerRapido } from '../../types/athlete-portal'

interface TodayScreenProps {
    data: TodayScreenData
    onVerTreino: () => void
    onCompletarTreino: () => void
    onPularTreino: () => void
    onRegistrarRefeicao: () => void
    onTrackerClick: (tipo: TrackerRapido['id']) => void
    onFalarComCoach: () => void
}

export function TodayScreen({
    data,
    onVerTreino,
    onCompletarTreino,
    onPularTreino,
    onRegistrarRefeicao,
    onTrackerClick,
    onFalarComCoach
}: TodayScreenProps) {
    return (
        <div className="min-h-screen bg-gray-900 pb-20">
            {/* Header */}
            <HeaderHoje
                nomeAtleta={data.atleta.nome}
                dataFormatada={data.dataFormatada}
                streak={data.atleta.streak}
            />

            {/* Content */}
            <div className="px-4 py-4 space-y-4">
                {/* Card de Treino */}
                <CardTreino
                    treino={data.treino}
                    onVerTreino={onVerTreino}
                    onCompletei={onCompletarTreino}
                    onPular={onPularTreino}
                />

                {/* Card de Dieta */}
                <CardDieta
                    dieta={data.dieta}
                    onRegistrarRefeicao={onRegistrarRefeicao}
                />

                {/* Trackers Rápidos */}
                <TrackersRapidos
                    trackers={data.trackers}
                    onTrackerClick={onTrackerClick}
                />

                {/* Dica do Coach */}
                <DicaCoach
                    dica={data.dicaCoach}
                    onFalarComCoach={onFalarComCoach}
                />
            </div>
        </div>
    )
}
