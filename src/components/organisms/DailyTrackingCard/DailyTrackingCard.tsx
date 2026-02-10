/**
 * DailyTrackingCard - Organism Component
 * 
 * Card principal de acompanhamento diário do atleta
 * Conectado ao Zustand store
 */

import React from 'react'
import { DailyTrackerHeader } from '../../molecules/DailyTrackerHeader'
import { TrackerButton } from '../../molecules/TrackerButton'
import { NutritionalSummary } from '../../molecules/NutritionalSummary'
import { DailyInsightCard } from '../../molecules/DailyInsightCard'
import { ConversationalInput } from '../../molecules/ConversationalInput'
import { DailyScoreCard } from '../../molecules/DailyScoreCard'
import { RegistrarRefeicaoModal } from '../modals/RegistrarRefeicaoModal'
import { RegistrarTreinoModal } from '../modals/RegistrarTreinoModal'
import { RegistrarAguaModal } from '../modals/RegistrarAguaModal'
import { RegistrarSonoModal } from '../modals/RegistrarSonoModal'
import { ReportarDorModal } from '../modals/ReportarDorModal'
import type { TrackerButton as TrackerButtonType, TrackerType } from '../../../types/daily-tracking'
import { TRACKER_CONFIG, STATUS_STYLES } from '../../../config/tracker-config'
import { useDailyTrackingStore } from '../../../stores/useDailyTrackingStore'
import { calcularScoreDiario, classificarScore, getInsightPrincipal } from '../../../services/daily-score'
import { calcularNivel, calcularXPSystem } from '../../../services/gamification'
import { mockGamificationProfiles } from '../../../mocks/gamification-profiles'

export interface DailyTrackingCardProps {
    nomeAtleta: string
    className?: string
}

/**
 * Card de acompanhamento diário - componente principal
 * Agora conectado ao Zustand store para state management
 * 
 * @example
 * <DailyTrackingCard nomeAtleta="João Silva" />
 */
export const DailyTrackingCard: React.FC<DailyTrackingCardProps> = ({
    nomeAtleta,
    className = '',
}) => {
    // Conectar ao store
    const { resumoDiario, insightAtual, modalAberto, abrirModal } = useDailyTrackingStore()

    // Gamificação (mock - em produção virá do backend)
    const gamificationProfile = mockGamificationProfiles['1'] // João Silva
    const nivelAtual = calcularNivel(gamificationProfile.xp.totalXP)
    const xpSystem = calcularXPSystem(gamificationProfile.xp.totalXP)

    // Gerar trackers baseado nos dados do store
    const trackers: TrackerButtonType[] = [
        {
            id: 'refeicao',
            icon: TRACKER_CONFIG.refeicao.icon!,
            label: TRACKER_CONFIG.refeicao.label!,
            status: resumoDiario.nutricao.refeicoes >= 3 ? 'completo' :
                resumoDiario.nutricao.refeicoes > 0 ? 'parcial' : 'pendente',
            atual: resumoDiario.nutricao.refeicoes,
            meta: TRACKER_CONFIG.refeicao.meta,
            unidade: TRACKER_CONFIG.refeicao.unidade,
            corBorda: STATUS_STYLES[resumoDiario.nutricao.refeicoes >= 3 ? 'completo' :
                resumoDiario.nutricao.refeicoes > 0 ? 'parcial' : 'pendente'].corBorda,
            corFundo: STATUS_STYLES[resumoDiario.nutricao.refeicoes >= 3 ? 'completo' :
                resumoDiario.nutricao.refeicoes > 0 ? 'parcial' : 'pendente'].corFundo,
            corIcone: STATUS_STYLES[resumoDiario.nutricao.refeicoes >= 3 ? 'completo' :
                resumoDiario.nutricao.refeicoes > 0 ? 'parcial' : 'pendente'].corTexto,
        },
        {
            id: 'treino',
            icon: TRACKER_CONFIG.treino.icon!,
            label: TRACKER_CONFIG.treino.label!,
            status: resumoDiario.treino.realizado ? 'completo' :
                resumoDiario.treino.planejado ? 'pendente' : 'pendente',
            detalhe: resumoDiario.treino.tipo?.split(' ')[0],
            horario: resumoDiario.treino.planejado ? '14:00' : undefined,
            corBorda: STATUS_STYLES[resumoDiario.treino.realizado ? 'completo' : 'pendente'].corBorda,
            corFundo: STATUS_STYLES[resumoDiario.treino.realizado ? 'completo' : 'pendente'].corFundo,
            corIcone: STATUS_STYLES[resumoDiario.treino.realizado ? 'completo' : 'pendente'].corTexto,
        },
        {
            id: 'agua',
            icon: TRACKER_CONFIG.agua.icon!,
            label: TRACKER_CONFIG.agua.label!,
            status: resumoDiario.hidratacao.totalMl >= resumoDiario.hidratacao.metaMl ? 'completo' :
                resumoDiario.hidratacao.totalMl >= resumoDiario.hidratacao.metaMl * 0.5 ? 'parcial' : 'pendente',
            atual: resumoDiario.hidratacao.totalMl / 1000,
            meta: resumoDiario.hidratacao.metaMl / 1000,
            unidade: 'L',
            corBorda: STATUS_STYLES[resumoDiario.hidratacao.totalMl >= resumoDiario.hidratacao.metaMl ? 'completo' :
                resumoDiario.hidratacao.totalMl >= resumoDiario.hidratacao.metaMl * 0.5 ? 'parcial' : 'pendente'].corBorda,
            corFundo: STATUS_STYLES[resumoDiario.hidratacao.totalMl >= resumoDiario.hidratacao.metaMl ? 'completo' :
                resumoDiario.hidratacao.totalMl >= resumoDiario.hidratacao.metaMl * 0.5 ? 'parcial' : 'pendente'].corFundo,
            corIcone: STATUS_STYLES[resumoDiario.hidratacao.totalMl >= resumoDiario.hidratacao.metaMl ? 'completo' :
                resumoDiario.hidratacao.totalMl >= resumoDiario.hidratacao.metaMl * 0.5 ? 'parcial' : 'pendente'].corTexto,
        },
        {
            id: 'sono',
            icon: TRACKER_CONFIG.sono.icon!,
            label: TRACKER_CONFIG.sono.label!,
            status: resumoDiario.sono.horas >= 7 ? 'completo' :
                resumoDiario.sono.horas >= 6 ? 'parcial' : 'alerta',
            atual: resumoDiario.sono.horas,
            meta: 8,
            unidade: 'h',
            corBorda: STATUS_STYLES[resumoDiario.sono.horas >= 7 ? 'completo' :
                resumoDiario.sono.horas >= 6 ? 'parcial' : 'alerta'].corBorda,
            corFundo: STATUS_STYLES[resumoDiario.sono.horas >= 7 ? 'completo' :
                resumoDiario.sono.horas >= 6 ? 'parcial' : 'alerta'].corFundo,
            corIcone: STATUS_STYLES[resumoDiario.sono.horas >= 7 ? 'completo' :
                resumoDiario.sono.horas >= 6 ? 'parcial' : 'alerta'].corTexto,
        },
        {
            id: 'dor',
            icon: TRACKER_CONFIG.dor.icon!,
            label: TRACKER_CONFIG.dor.label!,
            status: resumoDiario.doresAtivas > 0 ? 'alerta' : 'completo',
            detalhe: resumoDiario.doresAtivas > 0 ? `${resumoDiario.doresAtivas}` : 'OK',
            corBorda: STATUS_STYLES[resumoDiario.doresAtivas > 0 ? 'alerta' : 'completo'].corBorda,
            corFundo: STATUS_STYLES[resumoDiario.doresAtivas > 0 ? 'alerta' : 'completo'].corFundo,
            corIcone: STATUS_STYLES[resumoDiario.doresAtivas > 0 ? 'alerta' : 'completo'].corTexto,
        },
    ]

    // Calcular score do dia
    const score = calcularScoreDiario(resumoDiario)
    const scoreInfo = classificarScore(score)

    // Gerar insight principal
    const insightGerado = getInsightPrincipal(resumoDiario)

    // Usar insight do store ou gerar um padrão
    const insight = insightAtual || insightGerado || {
        tipo: 'dica' as const,
        prioridade: 5 as const,
        icone: '💪',
        mensagem: 'Continue registrando suas atividades diárias!',
    }

    // Handler para click dos trackers
    const handleTrackerClick = (trackerId: TrackerType) => {
        switch (trackerId) {
            case 'refeicao':
            case 'treino':
            case 'agua':
            case 'sono':
            case 'dor':
                abrirModal(trackerId)
                break
            default:
                console.log(`Clicked tracker: ${trackerId}`)
        }
    }

    return (
        <div
            className={`
        bg-gradient-to-br from-gray-900/50 to-gray-800/50
        border border-gray-700/50
        rounded-2xl shadow-2xl
        p-6
        ${className}
      `}
        >
            {/* Header */}
            <DailyTrackerHeader
                nomeAtleta={nomeAtleta}
                streak={resumoDiario.streakAtual}
                nivel={nivelAtual}
                xpSystem={xpSystem}
                className="mb-6"
            />

            {/* Score do Dia */}
            <div className="mb-6">
                <DailyScoreCard
                    score={score}
                    categoria={scoreInfo.categoria}
                    cor={scoreInfo.cor}
                    emoji={scoreInfo.emoji}
                    mensagem={scoreInfo.mensagem}
                />
            </div>

            {/* Grid de Trackers */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {trackers.map((tracker) => (
                    <TrackerButton
                        key={tracker.id}
                        tracker={tracker}
                        onClick={() => handleTrackerClick(tracker.id)}
                    />
                ))}
            </div>

            {/* Resumo Nutricional */}
            <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700/30">
                <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">
                    📊 Resumo Nutricional
                </h3>
                <NutritionalSummary
                    calorias={{
                        atual: resumoDiario.nutricao.totalCalorias,
                        meta: resumoDiario.nutricao.metaCalorias
                    }}
                    proteina={{
                        atual: resumoDiario.nutricao.totalProteina,
                        meta: resumoDiario.nutricao.metaProteina,
                    }}
                    carboidratos={{
                        atual: resumoDiario.nutricao.totalCarboidrato,
                        meta: resumoDiario.nutricao.metaCarboidrato,
                    }}
                    gordura={{
                        atual: resumoDiario.nutricao.totalGordura,
                        meta: resumoDiario.nutricao.metaGordura,
                    }}
                />
            </div>

            {/* Insight Card */}
            <DailyInsightCard insight={insight} />

            {/* Conversational Input */}
            <div className="mt-6">
                <ConversationalInput />
            </div>

            {/* Modals */}
            {modalAberto === 'refeicao' && <RegistrarRefeicaoModal />}
            {modalAberto === 'treino' && <RegistrarTreinoModal />}
            {modalAberto === 'agua' && <RegistrarAguaModal />}
            {modalAberto === 'sono' && <RegistrarSonoModal />}
            {modalAberto === 'dor' && <ReportarDorModal />}
        </div>
    )
}

export default DailyTrackingCard
