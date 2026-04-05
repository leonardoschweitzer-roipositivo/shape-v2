/**
 * AthletePortal - Container principal do Portal do Atleta
 * 
 * Gerencia a navegação entre as 4 telas: HOJE, COACH, PROGRESSO, PERFIL
 * Agora conectado a dados reais via portalDataService
 */

import React, { useState, useEffect, useRef } from 'react'
import { BottomNavigation } from '../components/organisms/BottomNavigation'
import { useAuthStore } from '@/stores/authStore'
import { TodayScreen, CoachScreen, ProgressScreen, ProfileScreen, AssessmentScreen, DietScreen } from './athlete'
import { NotificacoesAtletaScreen } from './athlete/NotificacoesAtletaScreen'
import { portalNotificacaoService } from '@/services/portal/portalNotificacaoService'
import { AthletePortalTab } from '../types/athlete-portal'
import type { TodayScreenData, ScoreGeral, GraficoEvolucaoData, ProporcaoResumo, ChatMessage, MeuPersonal, DadosBasicos, ExercicioTimerState, ExercicioTreino, SetExecutado, UltimasExecucoesMap } from '../types/athlete-portal'
import { Loader2, Bell } from 'lucide-react'
import { RegistrarRefeicaoModal } from '../components/organisms/RegistrarRefeicaoModal'
import { RegistrarTrackerModal } from '../components/organisms/RegistrarTrackerModal/RegistrarTrackerModal'
import { VirtualAssessmentWizard } from '../components/organisms/VirtualAssessmentWizard'
import { TrackerRapidoType } from '../types/athlete-portal'
import { enviarMensagemIA, limparSessaoChat, type AtletaContextoIA } from '../services/vitruviusAI'
import {
    carregarContextoPortal,
    montarDadosHoje,
    derivarProximoTreino,
    buscarTodosDadosSecundarios,
    buscarMensagensChat,
    salvarMensagemChat,
    registrarTracker,
    completarTreino,
    pularTreino,
    extrairDadosBasicos,
    type PortalContext,
    type ProximoTreino,
    derivarProximosTreinos,
} from '../services/portalDataService'

interface AthletePortalProps {
    atletaId: string;
    atletaNome?: string;
    initialTab?: AthletePortalTab;
    onGoToHome?: () => void;
    onGoToContexto?: () => void;
}

export function AthletePortal({ atletaId, atletaNome, initialTab = 'hoje', onGoToHome, onGoToContexto }: AthletePortalProps) {
    const { signOut, user } = useAuthStore()
    const [activeTab, setActiveTab] = useState<AthletePortalTab>(initialTab)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    // Reset scroll to top when tab changes
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo(0, 0)
        }
    }, [activeTab])
    const [loading, setLoading] = useState(true)
    const [ctx, setCtx] = useState<PortalContext | null>(null)

    // Data states for each tab
    const [todayData, setTodayData] = useState<TodayScreenData | null>(null)
    const [scoreGeral, setScoreGeral] = useState<ScoreGeral | null>(null)
    const [graficoEvolucao, setGraficoEvolucao] = useState<GraficoEvolucaoData | null>(null)
    const [proporcoes, setProporcoes] = useState<ProporcaoResumo[]>([])
    const [historicoAvaliacoes, setHistoricoAvaliacoes] = useState<Record<string, unknown>[]>([])
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
    const [dadosBasicos, setDadosBasicos] = useState<DadosBasicos | null>(null)
    const [personal, setPersonal] = useState<MeuPersonal | null>(null)
    const [proximoTreino, setProximoTreino] = useState<ProximoTreino | null>(null)
    const [proximosTreinos, setProximosTreinos] = useState<ProximoTreino[]>([])
    const [lastPeso, setLastPeso] = useState<number | undefined>(undefined)
    const [showRefeicaoModal, setShowRefeicaoModal] = useState(false)
    const [refeicaoMode, setRefeicaoMode] = useState<'texto' | 'foto'>('texto')
    const [avaliacaoDados, setAvaliacaoDados] = useState<any | null>(null)
    const [avaliacaoLoading, setAvaliacaoLoading] = useState(false)
    const [trackerModal, setTrackerModal] = useState<{ isOpen: boolean; tipo: TrackerRapidoType | null }>({
        isOpen: false,
        tipo: null
    })
    const [showVirtualAssessment, setShowVirtualAssessment] = useState(false)
    const [notificacoesBadge, setNotificacoesBadge] = useState(0)

    const timerStorageKey = `exercicioTimers_${atletaId}`
    const [exercicioTimers, setExercicioTimersRaw] = useState<Record<string, ExercicioTimerState>>(() => {
        try {
            const saved = sessionStorage.getItem(timerStorageKey)
            return saved ? JSON.parse(saved) : {}
        } catch { return {} }
    })
    const setExercicioTimers = (timers: Record<string, ExercicioTimerState>) => {
        setExercicioTimersRaw(timers)
        try { sessionStorage.setItem(timerStorageKey, JSON.stringify(timers)) } catch { }
    }

    const sessionTimerStorageKey = `sessionTimer_${atletaId}`
    const [sessionTimer, setSessionTimerRaw] = useState<ExercicioTimerState>(() => {
        try {
            const saved = sessionStorage.getItem(sessionTimerStorageKey)
            return saved ? JSON.parse(saved) : { status: 'idle', tempoAcumuladoMs: 0 }
        } catch { return { status: 'idle', tempoAcumuladoMs: 0 } }
    })
    const setSessionTimer = (timer: ExercicioTimerState) => {
        setSessionTimerRaw(timer)
        try { sessionStorage.setItem(sessionTimerStorageKey, JSON.stringify(timer)) } catch { }
    }

    const treinoHashStorageKey = `exercicioTimersTreinoHash_${atletaId}`
    const hidratacaoRef = useRef<string | null>(null)

    const clearAllTimers = () => {
        setExercicioTimersRaw({})
        setSessionTimerRaw({ status: 'idle', tempoAcumuladoMs: 0 })
        try {
            sessionStorage.removeItem(timerStorageKey)
            sessionStorage.removeItem(sessionTimerStorageKey)
            sessionStorage.removeItem(treinoHashStorageKey)
        } catch { }
        hidratacaoRef.current = null
    }

    // exerciciosFeitos derivado dos timers (compatibilidade)
    const exerciciosFeitos: Record<string, boolean> = Object.fromEntries(
        Object.entries(exercicioTimers).filter(([, t]) => (t as ExercicioTimerState).status === 'done').map(([id]) => [id, true])
    )

    /**
     * Hidratação dos inputs set-by-set:
     *  - Se sessionStorage tem timers do mesmo treino → respeita (aluno pausou e voltou).
     *  - Se é um treino novo (hash de ids mudou) ou não hidratado → inicializa `sets`
     *    com a última execução do mesmo treinoIndex, ou sets vazios de length=ex.series.
     *  - Migra registros legados (apenas `carga` escalar) para `sets[0].carga`.
     */
    useEffect(() => {
        const treino = todayData?.treino
        if (!treino || !treino.exercicios || treino.exercicios.length === 0) return

        // Só hidrata quando o treino está pendente (aluno vai executar agora)
        if (treino.status !== 'pendente') return

        const exercicios = treino.exercicios
        const hashAtual = exercicios.map(e => e.id).join('|')

        // Evita rerun no mesmo render cycle
        if (hidratacaoRef.current === hashAtual) return

        let hashSalvo: string | null = null
        try { hashSalvo = sessionStorage.getItem(treinoHashStorageKey) } catch { }

        const mesmoTreino = hashSalvo === hashAtual
        const ultimas: UltimasExecucoesMap = treino.ultimasExecucoes ?? { porId: {}, porNome: {} }
        const normalizar = (n: string) => n.toLowerCase().trim().replace(/\s+/g, ' ')

        const proximoState: Record<string, ExercicioTimerState> = {}

        for (const ex of exercicios) {
            const existente = exercicioTimers[ex.id]
            const temSetsValidos = existente?.sets && existente.sets.length > 0

            if (mesmoTreino && existente && temSetsValidos) {
                // Respeita o estado atual (aluno já interagiu)
                proximoState[ex.id] = existente
                continue
            }

            // Migração legado: só tinha `carga` escalar
            if (mesmoTreino && existente && typeof existente.carga === 'number' && !temSetsValidos) {
                const setsMigrados: SetExecutado[] = Array.from(
                    { length: Math.max(1, ex.series || 1) },
                    (_, i) => (i === 0 ? { carga: existente.carga } : {}),
                )
                proximoState[ex.id] = { ...existente, sets: setsMigrados }
                continue
            }

            // Hidrata com última execução ou sets vazios
            const ultima =
                ultimas.porId[ex.id] ??
                ultimas.porNome[normalizar(ex.nome)] ??
                null

            let sets: SetExecutado[]
            if (ultima && ultima.sets.length > 0) {
                // Respeita EXATAMENTE a quantidade de séries que o aluno usou na
                // última execução — não trunca nem completa com base em ex.series.
                // Assim, se ele ajustou de 7 para 10 séries no último treino,
                // o próximo já começa com 10.
                sets = ultima.sets.map(s => ({ ...s }))
            } else {
                // Primeira vez: usa a quantidade do plano como ponto de partida.
                sets = Array.from({ length: Math.max(1, ex.series || 1) }, () => ({}))
            }

            proximoState[ex.id] = {
                status: 'idle',
                tempoAcumuladoMs: 0,
                sets,
            }
        }

        setExercicioTimers(proximoState)
        try { sessionStorage.setItem(treinoHashStorageKey, hashAtual) } catch { }
        hidratacaoRef.current = hashAtual
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [todayData?.treino?.id, todayData?.treino?.status])

    // Phase 1: Load critical data (context + today) — show screen ASAP
    useEffect(() => {
        async function loadCritical() {
            setLoading(true)
            try {
                const context = await carregarContextoPortal(atletaId)
                if (!context) {
                    console.error('[AthletePortal] Erro ao carregar contexto')
                    setLoading(false)
                    return
                }
                setCtx(context)

                // Today data is the critical path — load it immediately
                const today = await montarDadosHoje(context)
                setTodayData(today)
                setDadosBasicos(extrairDadosBasicos(context))
                setProximoTreino(derivarProximoTreino(context.planoTreino, today?.treino?.indiceTreino))
                setProximosTreinos(derivarProximosTreinos(context.planoTreino, today?.treino?.indiceTreino))
            } catch (err) {
                console.error('[AthletePortal] Erro ao carregar dados críticos:', err)
            }
            setLoading(false)
        }
        loadCritical()
    }, [atletaId])

    // Phase 2: Load secondary data in background (after screen is visible)
    // OTIMIZADO v2: 3 queries paralelas (antes eram 7 separadas)
    useEffect(() => {
        if (!ctx) return
        async function loadSecondary() {
            try {
                // Personal data already loaded in Phase 1 context — extract here
                setPersonal({
                    id: ctx!.personalId,
                    nome: ctx!.personalNome || 'Personal',
                    cref: '',
                    telefone: '',
                    email: '',
                })

                // 3 queries: assessments+medidas + chat messages + notificações badge
                const [dados, msgs, naoLidas] = await Promise.all([
                    buscarTodosDadosSecundarios(atletaId),
                    buscarMensagensChat(atletaId),
                    portalNotificacaoService.contarNaoLidas(atletaId),
                ])
                setNotificacoesBadge(naoLidas)

                setScoreGeral(dados.score)
                setGraficoEvolucao(dados.grafico)
                setProporcoes(dados.proporcoes)
                setHistoricoAvaliacoes(dados.historico)
                setChatMessages(msgs)
                setAvaliacaoDados(dados.avaliacao)
                if (dados.grafico.dados.length > 0) {
                    setLastPeso(dados.grafico.dados[dados.grafico.dados.length - 1].valor)
                }

                // Limpar sessão de chat para reconstruir com Plano de Evolução completo
                limparSessaoChat(atletaId)
            } catch (err) {
                console.error('[AthletePortal] Erro ao carregar dados secundários:', err)
            }
        }
        loadSecondary()
    }, [ctx, atletaId])


    // Handlers para a tela HOJE
    const handleVerTreino = () => {
        // Noop: detalhes já são mostrados via accordion no CardTreino
    }

    const handleCompletarTreino = async (
        dataOverride?: string,
        exerciciosModificados?: ExercicioTreino[]
    ) => {
        // Calcular duração real a partir do timer de SESSÃO (Global)
        let totalMs = sessionTimer.tempoAcumuladoMs
        if (sessionTimer.status === 'running' && sessionTimer.inicioUltimoPlay) {
            totalMs += Date.now() - sessionTimer.inicioUltimoPlay
        }

        const duracaoMinutos = totalMs > 0 ? Math.max(1, Math.round(totalMs / 60000)) : 60

        // Lista final = edições feitas no card (renome/add/delete). Fallback p/ original.
        const listaFinal: ExercicioTreino[] =
            exerciciosModificados ?? todayData?.treino?.exercicios ?? []

        // Monta snapshot set-by-set + status de conclusão de CADA exercício
        // — inclusive os que o aluno não tocou, para preservar o treino real executado.
        const exerciciosDetalhes = listaFinal.map(ex => {
            const timer = exercicioTimers[ex.id]
            return {
                id: ex.id,
                nome: ex.nome,
                series: ex.series,           // prescrito
                repeticoes: ex.repeticoes,   // prescrito
                sets: timer?.sets ?? [],     // realizados por série (carga + reps)
                concluido: timer?.status === 'done',
            }
        })

        await completarTreino(atletaId, {
            intensidade: 3,
            duracao: duracaoMinutos,
            reportouDor: false,
            treinoIndex: todayData?.treino?.indiceTreino,
            exercicios: exerciciosDetalhes,
        }, dataOverride, ctx?.personalId)

        clearAllTimers() // Reset todos os timers após completar
        // Refresh today data
        if (ctx) {
            const today = await montarDadosHoje(ctx)
            setTodayData(today)
            setProximoTreino(derivarProximoTreino(ctx.planoTreino, today?.treino?.indiceTreino))
            setProximosTreinos(derivarProximosTreinos(ctx.planoTreino, today?.treino?.indiceTreino))
        }
    }

    const handlePularTreino = async (continuarHoje?: boolean) => {
        await pularTreino(atletaId, todayData?.treino?.indiceTreino, continuarHoje, ctx?.personalId)
        clearAllTimers() // Reset timers após pular
        if (ctx) {
            const today = await montarDadosHoje(ctx)
            setTodayData(today)
            setProximoTreino(derivarProximoTreino(ctx.planoTreino, today?.treino?.indiceTreino))
            setProximosTreinos(derivarProximosTreinos(ctx.planoTreino, today?.treino?.indiceTreino))
        }
    }

    const handleRegistrarRefeicao = () => {
        setRefeicaoMode('texto')
        setShowRefeicaoModal(true)
    }

    const handleSalvarRefeicao = async (macros: { calorias: number; proteina: number; carboidrato: number; gordura: number; descricao: string; fotoBase64?: string; fonte?: 'manual' | 'foto_ia'; confianca?: number }) => {
        // Salvar no Supabase
        await registrarTracker(atletaId, 'refeicao', {
            descricao: macros.descricao,
            calorias: macros.calorias,
            proteina: macros.proteina,
            carboidrato: macros.carboidrato,
            gordura: macros.gordura,
        })

        // Notificar personal (await garante execução no mobile)
        try {
            const { onRegistroRapido } = await import('../services/notificacaoTriggers')
            await onRegistroRapido(atletaId, {
                tipo: 'refeicao',
                valor: macros.descricao || `${macros.calorias} kcal`,
                personalId: ctx?.personalId
            })
        } catch (err) {
            console.warn('[AthletePortal] Erro ao notificar registro rápido:', err)
        }


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

    const handleTrackerClick = (tipo: TrackerRapidoType) => {
        setTrackerModal({ isOpen: true, tipo })
    }

    const handleSalvarTracker = async (valor: number | string, extra?: Record<string, any>) => {
        const tipo = trackerModal.tipo
        if (!tipo) return

        if (tipo === 'agua') {
            await registrarTracker(atletaId, 'agua', { quantidade: Number(valor) })

            try {
                const { onRegistroRapido } = await import('../services/notificacaoTriggers')
                await onRegistroRapido(atletaId, {
                    tipo: 'agua',
                    valor: `${valor}ml`,
                    personalId: ctx?.personalId
                })
            } catch (err) {
                console.warn('[AthletePortal] Erro ao notificar registro rápido:', err)
            }
        }

        if (tipo === 'sono') {
            await registrarTracker(atletaId, 'sono', { quantidade: Number(valor) })

            try {
                const { onRegistroRapido } = await import('../services/notificacaoTriggers')
                await onRegistroRapido(atletaId, {
                    tipo: 'sono',
                    valor: `${valor}h`,
                    personalId: ctx?.personalId
                })
            } catch (err) {
                console.warn('[AthletePortal] Erro ao notificar registro rápido:', err)
            }
        }

        if (tipo === 'peso') {
            await registrarTracker(atletaId, 'peso', { quantidade: Number(valor) })

            try {
                const { onRegistroRapido } = await import('../services/notificacaoTriggers')
                await onRegistroRapido(atletaId, {
                    tipo: 'peso',
                    valor: `${valor} kg`,
                    personalId: ctx?.personalId
                })
            } catch (err) {
                console.warn('[AthletePortal] Erro ao notificar registro rápido:', err)
            }
        }

        if (tipo === 'dor') {
            const local = extra?.local || 'Não especificado'
            await registrarTracker(atletaId, 'dor', {
                quantidade: Number(valor),
                local,
            })

            try {
                const { onDorReportada } = await import('../services/notificacaoTriggers')
                await onDorReportada(atletaId, {
                    local,
                    intensidade: Number(valor),
                    personalId: ctx?.personalId
                })
            } catch (err) {
                console.warn('[AthletePortal] Erro ao notificar dor:', err)
            }
        }

        if (ctx) {
            const today = await montarDadosHoje(ctx)
            setTodayData(today)
            setProximoTreino(derivarProximoTreino(ctx.planoTreino, today?.treino?.indiceTreino))
            setProximosTreinos(derivarProximosTreinos(ctx.planoTreino, today?.treino?.indiceTreino))
        }
    }

    const handleFalarComCoach = () => {
        setActiveTab('coach')
    }

    const handleNewConversation = () => {
        setChatMessages([])
        // Mantemos o mesmo sessionId (user.id) para o vínculo do Dialogflow persistir
        
        // Opcional: Notificar serviço de limpeza de cache de sessão se necessário
        limparSessaoChat(atletaId)
    }

    // Handler para chat — agora com IA real (Gemini) + Plano de Evolução completo
    const handleSendMessage = async (message: string): Promise<string> => {
        const { user } = useAuthStore.getState()
        
        // Save user message
        await salvarMensagemChat(atletaId, 'user', message)

        // Montar contexto do atleta para a IA — inclui Plano de Evolução completo
        const contextoIA: AtletaContextoIA = {
            nome: ctx?.atletaNome || atletaNome || 'Atleta',
            sexo: ctx?.ficha?.sexo,
            altura: ctx?.ficha?.altura,
            peso: lastPeso || ctx?.ficha?.peso,
            gorduraPct: ctx?.ficha?.gordura_percentual,
            score: scoreGeral?.score,
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
            // Plano de Evolução completo (diagnóstico + treino + dieta)
            diagnostico: ctx?.diagnostico ?? null,
            planoTreino: ctx?.planoTreino ?? null,
            planoDieta: ctx?.planoDieta ?? null,
        }

        // Montar histórico de mensagens para contexto
        const historico = chatMessages.map(m => ({
            role: m.role as 'user' | 'model',
            content: m.content,
        }))

        const response = await enviarMensagemIA(
            atletaId, 
            message, 
            contextoIA, 
            historico
        )

        // Save assistant message
        await salvarMensagemChat(atletaId, 'assistant', response)

        return response
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
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
                        atletaId={atletaId}
                        data={todayData}
                        proximoTreino={proximoTreino}
                        proximosTreinos={proximosTreinos}
                        sexo={ctx?.ficha?.sexo}
                        altura={ctx?.ficha?.altura}
                        peso={lastPeso}
                        personalId={ctx?.personalId}
                        personalNome={ctx?.personalNome}
                        exerciciosFeitos={exerciciosFeitos}
                        exercicioTimers={exercicioTimers}
                        sessionTimer={sessionTimer}
                        onExercicioTimersChange={setExercicioTimers}
                        onSessionTimerChange={setSessionTimer}
                        onVerTreino={handleVerTreino}
                        onCompletarTreino={handleCompletarTreino}
                        onPularTreino={handlePularTreino}
                        onTrackerClick={handleTrackerClick}
                    />
                ) : null

            case 'coach':
                return (
                    <CoachScreen
                        initialMessages={chatMessages}
                        onSendMessage={handleSendMessage}
                        onClearChat={handleNewConversation}
                    />
                )

            case 'home':
                // Temporário. Como a "Home" antiga (PortalLanding) é um contêiner separado na página de rota,
                // precisaremos gerenciar isso. Por agora, vamos manter 'home' apenas emitindo um evento se precisar
                // ou apenas retornando a Home. Na verdade o PortalLanding RENDERIZA a o AthletePortal como uma folha.
                return (
                    <div className="flex-1 flex flex-col items-center justify-center pt-24">
                        <h2 className="text-white text-xl font-black uppercase">Home</h2>
                        <p className="text-gray-400 mt-2">Clique em Hoje para ver a rotina.</p>
                        <button
                            className="mt-6 px-6 py-2 bg-indigo-600 rounded-lg text-white font-bold"
                            onClick={() => window.location.href = `/atleta/${atletaId}`}
                        >
                            Ir para Dashboard
                        </button>
                    </div>
                )

            case 'avalicao':
                return (
                    <AssessmentScreen
                        avaliacao={avaliacaoDados}
                        isLoading={avaliacaoLoading}
                        nomeAtleta={ctx?.atletaNome || atletaNome}
                        sexo={ctx?.ficha?.sexo}
                        altura={ctx?.ficha?.altura}
                        peso={lastPeso}
                        personalNome={ctx?.personalNome}
                        onStartVirtualAssessment={() => setShowVirtualAssessment(true)}
                        onGoToContexto={onGoToContexto}
                    />
                )

            case 'dieta':
                return todayData ? (
                    <DietScreen
                        dieta={todayData.dieta}
                        dicaCoach={todayData.dicaCoach}
                        planoDieta={ctx?.planoDieta ?? null}
                        isTreinoDay={todayData.treino?.status !== 'descanso'}
                        nome={todayData.atleta.nome}
                        sexo={ctx?.ficha?.sexo}
                        altura={ctx?.ficha?.altura}
                        peso={lastPeso}
                        personalNome={ctx?.personalNome}
                        onRegistrarRefeicao={handleRegistrarRefeicao}
                        onFalarComCoach={handleFalarComCoach}
                    />
                ) : null

            case 'notificacoes':
                return (
                    <NotificacoesAtletaScreen
                        atletaId={atletaId}
                        onAtualizarContador={setNotificacoesBadge}
                    />
                )

            default:
                return null
        }
    }

    const showFloatingBell = ['home', 'hoje', 'avalicao', 'dieta'].includes(activeTab)

    return (
        <div className="relative min-h-screen flex flex-col">
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
                {/* Floating notification bell — top right */}
                {showFloatingBell && (
                    <button
                        onClick={() => setActiveTab('notificacoes')}
                        className="fixed top-8 right-4 z-40 w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all active:scale-90 hover:bg-white/10"
                        aria-label="Notificações"
                    >
                        <Bell size={18} className="text-gray-400" />
                        {notificacoesBadge > 0 && (
                            <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-rose-500 flex items-center justify-center px-1 shadow-lg shadow-rose-500/30">
                                <span className="text-[9px] font-black text-white leading-none">
                                    {notificacoesBadge > 9 ? '9+' : notificacoesBadge}
                                </span>
                            </div>
                        )}
                    </button>
                )}

                {renderActiveScreen()}

                {/* Discreet Logout - Hidden in Coach tab to avoid layout issues */}
                {activeTab !== 'coach' && (
                    <div className="py-8 pb-32 text-center opacity-30 hover:opacity-100 transition-opacity">
                        <button
                            onClick={async () => {
                                await signOut();
                                window.location.replace('/');
                            }}
                            className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium"
                        >
                            Sair da conta
                        </button>
                    </div>
                )}
            </div>
            <BottomNavigation
                activeTab={activeTab}
                onTabChange={(tab) => {
                    if (tab === 'home') {
                        if (onGoToHome) onGoToHome()
                    } else {
                        setActiveTab(tab)
                    }
                }}
                notificacoesBadge={notificacoesBadge}
            />
            <RegistrarRefeicaoModal
                isOpen={showRefeicaoModal}
                initialMode={refeicaoMode}
                onClose={() => setShowRefeicaoModal(false)}
                onSave={handleSalvarRefeicao}
            />

            <RegistrarTrackerModal
                isOpen={trackerModal.isOpen}
                tipo={trackerModal.tipo}
                onClose={() => setTrackerModal({ isOpen: false, tipo: null })}
                onSave={handleSalvarTracker}
            />

            {showVirtualAssessment && (
                <VirtualAssessmentWizard
                    atletaId={atletaId}
                    sexo={(ctx?.ficha?.sexo as 'M' | 'F') || 'M'}
                    altura={ctx?.ficha?.altura || 170}
                    pesoInicial={lastPeso}
                    onComplete={async () => {
                        setShowVirtualAssessment(false)
                        // Refresh assessment data
                        try {
                            const dados = await buscarTodosDadosSecundarios(atletaId)
                            setScoreGeral(dados.score)
                            setGraficoEvolucao(dados.grafico)
                            setProporcoes(dados.proporcoes)
                            setHistoricoAvaliacoes(dados.historico)
                            setAvaliacaoDados(dados.avaliacao)
                        } catch (err) {
                            console.error('[AthletePortal] Erro ao atualizar dados pós-avaliação virtual:', err)
                        }
                    }}
                    onClose={() => setShowVirtualAssessment(false)}
                />
            )}
        </div>
    )
}

// Respostas template removidas — agora usa vitruviusAI.ts (Gemini + fallback contextual)
