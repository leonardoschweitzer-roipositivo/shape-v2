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
// import { calcularNivel, calcularXPSystem } from '../../../services/gamification' // DISABLED - Feature para depois
// import { mockGamificationProfiles } from '../../../mocks/gamification-profiles' // DISABLED - Feature para depois

import { Utensils, Dumbbell, Droplet, Moon, Activity, Apple, ChevronRight, Target } from 'lucide-react'

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

    // Gamificação DISABLED - Feature para depois
    // const gamificationProfile = mockGamificationProfiles['1'] // João Silva
    // const nivelAtual = calcularNivel(gamificationProfile.xp.totalXP)
    // const xpSystem = calcularXPSystem(gamificationProfile.xp.totalXP)
    const nivelAtual = 1 // Mock simples
    const xpSystem = { totalXP: 0, nivel: 1, percentualNivel: 0, xpAtual: 0, xpProximoNivel: 100 }

    // Gerar trackers baseado nos dados do store
    const trackers: TrackerButtonType[] = [
        {
            id: 'refeicao',
            icon: <Utensils size={20} />,
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
            icon: <Dumbbell size={20} />,
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
            icon: <Droplet size={20} />,
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
            icon: <Moon size={20} />,
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
            icon: <Activity size={20} />,
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
        icone: '', // Ignorado agora
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
        <div className={`w-full flex flex-col gap-10 ${className}`}>
            {/* Top Section: Header & Score */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Header Card */}
                <div className="bg-[#0D121F] border border-white/5 rounded-xl p-6 flex flex-col justify-center">
                    <DailyTrackerHeader
                        nomeAtleta={nomeAtleta}
                        streak={resumoDiario.streakAtual}
                        nivel={nivelAtual}
                        xpSystem={xpSystem}
                    />
                </div>

                {/* Score Card */}
                <DailyScoreCard
                    score={score}
                    categoria={scoreInfo.categoria}
                    cor={scoreInfo.cor}
                    mensagem={scoreInfo.mensagem}
                />
            </div>


            {/* Section Header: Metas do Dia */}
            <div className="flex items-center gap-4">
                <div className="p-2.5 bg-[#131B2C] rounded-xl border border-white/5 text-blue-400 shadow-lg">
                    <Target size={22} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white tracking-tight uppercase">
                        Monitoramento Diário
                    </h3>
                    <p className="text-sm text-gray-500 font-light">
                        Registre suas atividades para manter o foco
                    </p>
                </div>
            </div>

            {/* Grid de Trackers */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {trackers.map((tracker) => (
                    <TrackerButton
                        key={tracker.id}
                        tracker={tracker}
                        onClick={() => handleTrackerClick(tracker.id)}
                    />
                ))}
            </div>

            {/* Resumo Nutricional Section */}
            <div className="p-6 bg-[#0D121F] rounded-2xl border border-white/5">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-[#131B2C] rounded-xl border border-white/5 text-emerald-400 shadow-lg">
                            <Apple size={22} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white tracking-tight uppercase">
                                Nutrição & Metabolismo
                            </h3>
                            <p className="text-sm text-gray-500 font-light">
                                Resumo de macros e ingestão calórica
                            </p>
                        </div>
                    </div>
                    <button className="text-emerald-400 p-2 hover:bg-emerald-400/10 rounded-lg transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>

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
            <div>
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
