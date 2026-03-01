/**
 * AthletePortal - Container principal do Portal do Atleta
 * 
 * Gerencia a navegação entre as 4 telas: HOJE, COACH, PROGRESSO, PERFIL
 * Agora conectado a dados reais via portalDataService
 */

import React, { useState, useEffect } from 'react'
import { BottomNavigation } from '../components/organisms/BottomNavigation'
import { TodayScreen, CoachScreen, ProgressScreen, ProfileScreen } from './athlete'
import { AthletePortalTab } from '../types/athlete-portal'
import type { TodayScreenData, ScoreGeral, GraficoEvolucaoData, ProporcaoResumo, ChatMessage, MeuPersonal, DadosBasicos } from '../types/athlete-portal'
import { Loader2 } from 'lucide-react'
import { RegistrarRefeicaoModal } from '../components/organisms/RegistrarRefeicaoModal'
import { enviarMensagemIA, type AtletaContextoIA } from '../services/vitruviusAI'
import {
    carregarContextoPortal,
    montarDadosHoje,
    derivarProximoTreino,
    buscarScoreGeral,
    buscarGraficoEvolucao,
    buscarProporcoes,
    buscarHistoricoAvaliacoes,
    buscarMensagensChat,
    salvarMensagemChat,
    registrarTracker,
    completarTreino,
    pularTreino,
    extrairDadosBasicos,
    buscarDadosPersonal,
    type PortalContext,
    type ProximoTreino,
} from '../services/portalDataService'

interface AthletePortalProps {
    atletaId: string;
    atletaNome?: string;
}

export function AthletePortal({ atletaId, atletaNome }: AthletePortalProps) {
    const [activeTab, setActiveTab] = useState<AthletePortalTab>('hoje')
    const [loading, setLoading] = useState(true)
    const [ctx, setCtx] = useState<PortalContext | null>(null)

    // Data states for each tab
    const [todayData, setTodayData] = useState<TodayScreenData | null>(null)
    const [scoreGeral, setScoreGeral] = useState<ScoreGeral | null>(null)
    const [graficoEvolucao, setGraficoEvolucao] = useState<GraficoEvolucaoData | null>(null)
    const [proporcoes, setProporcoes] = useState<ProporcaoResumo[]>([])
    const [historicoAvaliacoes, setHistoricoAvaliacoes] = useState<any[]>([])
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
    const [dadosBasicos, setDadosBasicos] = useState<DadosBasicos | null>(null)
    const [personal, setPersonal] = useState<MeuPersonal | null>(null)
    const [proximoTreino, setProximoTreino] = useState<ProximoTreino | null>(null)
    const [lastPeso, setLastPeso] = useState<number | undefined>(undefined)
    const [showRefeicaoModal, setShowRefeicaoModal] = useState(false)

    // Load initial data
    useEffect(() => {
        async function load() {
            setLoading(true)
            try {
                const context = await carregarContextoPortal(atletaId)
                if (!context) {
                    console.error('[AthletePortal] Erro ao carregar contexto')
                    setLoading(false)
                    return
                }
                setCtx(context)

                // Load all tabs data in parallel
                const [today, score, grafico, props, historico, msgs, personalData] = await Promise.all([
                    montarDadosHoje(context),
                    buscarScoreGeral(atletaId),
                    buscarGraficoEvolucao(atletaId),
                    buscarProporcoes(atletaId),
                    buscarHistoricoAvaliacoes(atletaId),
                    buscarMensagensChat(atletaId),
                    buscarDadosPersonal(context.personalId),
                ])

                setTodayData(today)
                setScoreGeral(score)
                setGraficoEvolucao(grafico)
                setProporcoes(props)
                setHistoricoAvaliacoes(historico)
                setChatMessages(msgs)
                setDadosBasicos(extrairDadosBasicos(context))
                setPersonal(personalData)
                setProximoTreino(derivarProximoTreino(context.planoTreino))
                // Get last weight from grafico data
                if (grafico.dados.length > 0) {
                    setLastPeso(grafico.dados[grafico.dados.length - 1].valor)
                }
            } catch (err) {
                console.error('[AthletePortal] Erro geral:', err)
            }
            setLoading(false)
        }
        load()
    }, [atletaId])

    // Handlers para a tela HOJE
    const handleVerTreino = () => {
        console.log('Ver treino completo')
    }

    const handleCompletarTreino = async () => {
        await completarTreino(atletaId, { intensidade: 3, duracao: 60, reportouDor: false })
        // Refresh today data
        if (ctx) {
            const today = await montarDadosHoje(ctx)
            setTodayData(today)
        }
    }

    const handlePularTreino = async () => {
        await pularTreino(atletaId)
        if (ctx) {
            const today = await montarDadosHoje(ctx)
            setTodayData(today)
        }
    }

    const handleRegistrarRefeicao = () => {
        setShowRefeicaoModal(true)
    }

    const handleSalvarRefeicao = async (macros: { calorias: number; proteina: number; carboidrato: number; gordura: number; descricao: string }) => {
        // Salvar no Supabase
        await registrarTracker(atletaId, 'refeicao', {
            descricao: macros.descricao,
            calorias: macros.calorias,
            proteina: macros.proteina,
            carboidrato: macros.carboidrato,
            gordura: macros.gordura,
        })

        // Atualizar macros consumidos na tela HOJE
        if (todayData) {
            setTodayData({
                ...todayData,
                dieta: {
                    ...todayData.dieta,
                    consumidoCalorias: todayData.dieta.consumidoCalorias + macros.calorias,
                    consumidoProteina: todayData.dieta.consumidoProteina + macros.proteina,
                    consumidoCarbos: todayData.dieta.consumidoCarbos + macros.carboidrato,
                    consumidoGordura: todayData.dieta.consumidoGordura + macros.gordura,
                    percentualCalorias: todayData.dieta.metaCalorias > 0
                        ? Math.round(((todayData.dieta.consumidoCalorias + macros.calorias) / todayData.dieta.metaCalorias) * 100)
                        : 0,
                    percentualProteina: todayData.dieta.metaProteina > 0
                        ? Math.round(((todayData.dieta.consumidoProteina + macros.proteina) / todayData.dieta.metaProteina) * 100)
                        : 0,
                    percentualCarbos: todayData.dieta.metaCarbos > 0
                        ? Math.round(((todayData.dieta.consumidoCarbos + macros.carboidrato) / todayData.dieta.metaCarbos) * 100)
                        : 0,
                    percentualGordura: todayData.dieta.metaGordura > 0
                        ? Math.round(((todayData.dieta.consumidoGordura + macros.gordura) / todayData.dieta.metaGordura) * 100)
                        : 0,
                },
            })
        }
    }

    const handleTrackerClick = async (tipo: string) => {
        if (tipo === 'agua') {
            await registrarTracker(atletaId, 'agua', { quantidade: 250 }) // 250ml
            if (ctx) {
                const today = await montarDadosHoje(ctx)
                setTodayData(today)
            }
        }

        if (tipo === 'sono') {
            const horas = prompt('Quantas horas dormiu ontem à noite?', '7')
            if (horas && !isNaN(Number(horas))) {
                await registrarTracker(atletaId, 'sono', { quantidade: Number(horas) })
                if (ctx) {
                    const today = await montarDadosHoje(ctx)
                    setTodayData(today)
                }
            }
        }

        if (tipo === 'peso') {
            const peso = prompt('Qual seu peso hoje? (kg)', '94')
            if (peso && !isNaN(Number(peso))) {
                await registrarTracker(atletaId, 'peso', { quantidade: Number(peso) })
                if (ctx) {
                    const today = await montarDadosHoje(ctx)
                    setTodayData(today)
                }
            }
        }

        if (tipo === 'dor') {
            const local = prompt('Onde está a dor? (ex: ombro direito, lombar)')
            if (local) {
                const intensidade = prompt('Intensidade de 1 a 10?', '3')
                if (intensidade && !isNaN(Number(intensidade))) {
                    await registrarTracker(atletaId, 'dor', {
                        quantidade: Number(intensidade),
                        local,
                    })
                    if (ctx) {
                        const today = await montarDadosHoje(ctx)
                        setTodayData(today)
                    }
                }
            }
        }
    }

    const handleFalarComCoach = () => {
        setActiveTab('coach')
    }

    // Handler para chat — agora com IA real (Gemini)
    const handleSendMessage = async (message: string): Promise<string> => {
        // Save user message
        await salvarMensagemChat(atletaId, 'user', message)

        // Montar contexto do atleta para a IA
        const contextoIA: AtletaContextoIA = {
            nome: ctx?.atletaNome || atletaNome || 'Atleta',
            sexo: ctx?.ficha?.sexo,
            altura: ctx?.ficha?.altura,
            peso: lastPeso || ctx?.ficha?.peso,
            gorduraPct: ctx?.ficha?.gordura_percentual,
            score: undefined, // TODO: pegar do scoreGeral
            objetivo: ctx?.ficha?.objetivo,
            personalNome: ctx?.personalNome,
            // Dados de hoje
            treinoHoje: todayData?.treino?.titulo,
            treinoStatus: todayData?.treino?.status,
            caloriasConsumidas: todayData?.dieta?.consumidoCalorias,
            caloriasMeta: todayData?.dieta?.metaCalorias,
            proteinaConsumida: todayData?.dieta?.consumidoProteina,
            proteinaMeta: todayData?.dieta?.metaProteina,
            aguaLitros: todayData?.trackers?.find(t => t.id === 'agua')?.valor ? Number(todayData.trackers.find(t => t.id === 'agua')?.valor) : undefined,
            sonoHoras: todayData?.trackers?.find(t => t.id === 'sono')?.valor ? Number(todayData.trackers.find(t => t.id === 'sono')?.valor) : undefined,
            dorLocal: todayData?.trackers?.find(t => t.id === 'dor')?.valor as string | undefined,
        }

        // Montar histórico de mensagens para contexto
        const historico = chatMessages.map(m => ({
            role: m.role as 'user' | 'model',
            content: m.content,
        }))

        // Enviar para IA (Gemini ou fallback)
        const response = await enviarMensagemIA(atletaId, message, contextoIA, historico)

        // Save assistant message
        await salvarMensagemChat(atletaId, 'assistant', response)

        return response
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-[#060B18] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="text-indigo-400 mx-auto animate-spin" size={40} />
                    <p className="text-gray-500 text-sm">Carregando seu portal...</p>
                </div>
            </div>
        )
    }

    const renderActiveScreen = () => {
        switch (activeTab) {
            case 'hoje':
                return todayData ? (
                    <TodayScreen
                        data={todayData}
                        proximoTreino={proximoTreino}
                        sexo={ctx?.ficha?.sexo}
                        altura={ctx?.ficha?.altura}
                        peso={lastPeso}
                        personalNome={ctx?.personalNome}
                        onVerTreino={handleVerTreino}
                        onCompletarTreino={handleCompletarTreino}
                        onPularTreino={handlePularTreino}
                        onRegistrarRefeicao={handleRegistrarRefeicao}
                        onTrackerClick={handleTrackerClick}
                        onFalarComCoach={handleFalarComCoach}
                    />
                ) : null

            case 'coach':
                return (
                    <CoachScreen
                        initialMessages={chatMessages}
                        onSendMessage={handleSendMessage}
                    />
                )

            case 'progresso':
                return scoreGeral && graficoEvolucao ? (
                    <ProgressScreen
                        scoreGeral={scoreGeral}
                        graficoEvolucao={graficoEvolucao}
                        proporcoes={proporcoes}
                        historicoAvaliacoes={historicoAvaliacoes}
                        onVerDetalhesAvaliacao={(id) => console.log('Ver avaliação:', id)}
                    />
                ) : null

            case 'perfil':
                return dadosBasicos ? (
                    <ProfileScreen
                        nome={ctx?.atletaNome || atletaNome || 'Atleta'}
                        email=""
                        dadosBasicos={dadosBasicos}
                        personal={personal}
                        onSettings={() => console.log('Configurações')}
                        onHelp={() => console.log('Ajuda')}
                        onLogout={() => {
                            window.location.href = '/'
                        }}
                    />
                ) : null

            default:
                return null
        }
    }

    return (
        <div className="relative">
            {renderActiveScreen()}
            <BottomNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
            <RegistrarRefeicaoModal
                isOpen={showRefeicaoModal}
                onClose={() => setShowRefeicaoModal(false)}
                onSave={handleSalvarRefeicao}
            />
        </div>
    )
}

// Respostas template removidas — agora usa vitruviusAI.ts (Gemini + fallback contextual)
