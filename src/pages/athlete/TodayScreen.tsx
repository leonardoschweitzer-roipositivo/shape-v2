/**
 * TodayScreen - Tela HOJE do Portal do Atleta
 * 
 * Tela principal do dia-a-dia com treino, dieta, trackers e dica do coach
 */

import React from 'react'
import { HeaderIdentidade } from './components/HeaderIdentidade'
import { CardTreino } from '../../components/organisms/CardTreino'
import { CardDieta } from '../../components/organisms/CardDieta'
import { TrackersRapidos } from '../../components/organisms/TrackersRapidos'
import { FeedbackTextual } from '../../components/organisms/FeedbackTextual'
import { DicaCoach } from '../../components/molecules/DicaCoach'
import { TodayScreenData, TrackerRapido } from '../../types/athlete-portal'
import type { ExercicioTimerState } from '../../types/athlete-portal'
import type { ProximoTreino } from '../../services/portalDataService'

interface TodayScreenProps {
    atletaId: string
    data: TodayScreenData
    proximoTreino?: ProximoTreino | null
    sexo?: string
    altura?: number
    peso?: number
    personalNome?: string
    exerciciosFeitos: Record<string, boolean>
    exercicioTimers: Record<string, ExercicioTimerState>
    onExercicioTimersChange: (timers: Record<string, ExercicioTimerState>) => void
    onVerTreino: () => void
    onCompletarTreino: (dataOverride?: string) => void
    onPularTreino: (continuarHoje?: boolean) => void
    onRegistrarRefeicao: () => void
    onTrackerClick: (tipo: TrackerRapido['id']) => void
    onFalarComCoach: () => void
}

export function TodayScreen({
    atletaId,
    data,
    proximoTreino,
    sexo,
    altura,
    peso,
    personalNome,
    exerciciosFeitos,
    exercicioTimers,
    onExercicioTimersChange,
    onVerTreino,
    onCompletarTreino,
    onPularTreino,
    onRegistrarRefeicao,
    onTrackerClick,
    onFalarComCoach
}: TodayScreenProps) {
    const [modalPularOpen, setModalPularOpen] = React.useState(false)

    const handleConfirmPular = (continuar: boolean) => {
        setModalPularOpen(false)
        onPularTreino(continuar)
    }

    return (
        <div className="min-h-screen bg-[#060B18] pb-20 relative">
            {/* Header */}
            <HeaderIdentidade
                nome={data.atleta.nome}
                sexo={sexo === 'M' ? 'MASCULINO' : 'FEMININO'}
                altura={altura ?? 0}
                peso={peso ?? 0}
                fotoUrl={undefined}
                personalNome={personalNome}
                personalRanking={3}
            />

            {/* Content */}
            <div className="px-4 py-4 space-y-4">
                {/* Card de Treino */}
                <CardTreino
                    treino={data.treino}
                    proximoTreino={proximoTreino}
                    exerciciosFeitos={exerciciosFeitos}
                    exercicioTimers={exercicioTimers}
                    onExercicioTimersChange={onExercicioTimersChange}
                    onVerTreino={onVerTreino}
                    onCompletei={onCompletarTreino}
                    onPular={() => setModalPularOpen(true)}
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

                {/* Feedback Textual - Relato do dia */}
                <FeedbackTextual atletaId={atletaId} />

                {/* Dica do Coach */}
                <DicaCoach
                    dica={data.dicaCoach}
                    onFalarComCoach={onFalarComCoach}
                />
            </div>

            {/* Modal de Pular Treino/Descanso */}
            {modalPularOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-surface-deep border border-white/10 rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex flex-shrink-0 items-center justify-center">
                                <span className="text-orange-500 text-lg">⏭️</span>
                            </div>
                            <h3 className="text-lg font-black text-white uppercase tracking-wide">
                                Avançar Calendário?
                            </h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                            Você pode optar por <strong>descansar o resto do dia</strong> (pulando a atividade atual) ou avançar para <strong>fazer o próximo treino da sequência hoje mesmo</strong>.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => handleConfirmPular(true)}
                                className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                            >
                                FAZER O PRÓXIMO TREINO HOJE
                            </button>
                            <button
                                onClick={() => handleConfirmPular(false)}
                                className="w-full py-3.5 px-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                DESCANSAR HOJE
                            </button>
                            <button
                                onClick={() => setModalPularOpen(false)}
                                className="w-full py-2.5 px-4 text-gray-500 hover:text-white font-bold text-sm transition-colors mt-2 uppercase tracking-wider"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
