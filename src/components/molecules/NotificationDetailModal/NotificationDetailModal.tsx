/**
 * NotificationDetailModal — Modal de detalhes de uma notificação
 * 
 * Exibe informações contextuais baseadas no tipo da notificação,
 * como deltas de medidas, detalhes do treino ou feedback do aluno.
 */

import React, { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import {
    X,
    User,
    Trophy,
    Dumbbell,
    Ruler,
    AlertTriangle,
    MessageSquare,
    Calendar,
    ChevronRight,
    TrendingUp,
    TrendingDown,
    Target,
    Flame,
    ArrowRight
} from 'lucide-react'
import type { Notificacao } from '@/types/notificacao.types'
import { CATEGORIA_CONFIG, PRIORIDADE_CONFIG } from '@/types/notificacao.constants'

interface NotificationDetailModalProps {
    notificacao: Notificacao
    onFechar: () => void
    onAcao?: (url: string) => void
}

export function NotificationDetailModal({ notificacao, onFechar, onAcao }: NotificationDetailModalProps) {
    const categoriaConfig = CATEGORIA_CONFIG[notificacao.categoria]
    const prioridadeConfig = PRIORIDADE_CONFIG[notificacao.prioridade]

    // Trava o scroll do body
    useEffect(() => {
        const originalOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = originalOverflow
        }
    }, [])

    const handleAcao = () => {
        if (notificacao.acao_url && onAcao) {
            onAcao(notificacao.acao_url)
            onFechar()
        }
    }

    // ===== Renderizadores de Conteúdo Contextual =====

    const renderContextContent = useMemo(() => {
        const dados = notificacao.dados || {}
        const tipo = notificacao.tipo

        switch (tipo) {
            case 'TREINO_COMPLETO':
            case 'TREINO_PULADO':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Treino</p>
                                <p className="text-sm text-white font-medium mt-1">{String(dados.grupo || 'Geral')}</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Status</p>
                                <p className={`text-sm font-medium mt-1 flex items-center gap-1.5 ${tipo === 'TREINO_COMPLETO' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {tipo === 'TREINO_COMPLETO' ? (
                                        <><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" /> Concluído</>
                                    ) : (
                                        <><span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" /> {dados.continuarHoje ? 'Avançado' : 'Pulado'}</>
                                    )}
                                </p>
                            </div>
                        </div>
                        {dados.duracao && (
                            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Duração</p>
                                <p className="text-sm text-white font-medium mt-1">{String(dados.duracao)}</p>
                            </div>
                        )}
                        {dados.continuarHoje && (
                            <p className="text-xs text-gray-400 italic">
                                * O aluno decidiu pular este treino mas continuou para o próximo da sequência hoje.
                            </p>
                        )}
                    </div>
                )

            case 'SCORE_SUBIU':
            case 'SCORE_CAIU':
                const diffScore = Number(dados.diff || 0)
                return (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="text-center flex-1">
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider text-center">Anterior</p>
                                <p className="text-xl text-gray-400 font-black mt-1 text-center">{Number(dados.scoreAnterior || 0).toFixed(1)}</p>
                            </div>
                            <div className="px-4">
                                <ArrowRight className="text-gray-700" size={20} />
                            </div>
                            <div className="text-center flex-1">
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider text-center">Atual</p>
                                <p className={`text-xl font-black mt-1 text-center ${diffScore > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {Number(dados.scoreAtual || 0).toFixed(1)}
                                </p>
                            </div>
                        </div>
                        <div className={`flex items-center gap-2 justify-center py-2 px-4 rounded-full border w-fit mx-auto ${diffScore > 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                            {diffScore > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                            <span className="text-sm font-bold">{diffScore > 0 ? '+' : ''}{diffScore.toFixed(1)} pontos</span>
                        </div>
                    </div>
                )

            case 'GORDURA_REDUZIDA':
            case 'GORDURA_AUMENTOU':
                const diffGord = Number(dados.diff || 0)
                return (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="text-center flex-1">
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Antiga</p>
                                <p className="text-xl text-gray-400 font-black mt-1">{Number(dados.gorduraAnterior || 0).toFixed(1)}%</p>
                            </div>
                            <div className="px-4 text-gray-700">
                                <ChevronRight size={20} />
                            </div>
                            <div className="text-center flex-1">
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Atual</p>
                                <p className={`text-xl font-black mt-1 ${diffGord < 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {Number(dados.gorduraAtual || 0).toFixed(1)}%
                                </p>
                            </div>
                        </div>
                        <p className="text-center text-sm text-gray-400">
                            Variação de <span className={`font-bold ${diffGord < 0 ? 'text-emerald-400' : 'text-red-400'}`}>{diffGord > 0 ? '+' : ''}{diffGord.toFixed(1)}%</span> na gordura corporal.
                        </p>
                    </div>
                )

            case 'DOR_REPORTADA':
                return (
                    <div className="space-y-4">
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 flex-shrink-0 font-black text-xl">
                                {String(dados.intensidade || '!')}
                            </div>
                            <div>
                                <p className="text-xs text-red-400 font-bold uppercase tracking-wider">Intensidade da Dor</p>
                                <p className="text-sm text-white mt-0.5">Reportado em: <span className="font-bold">{String(dados.local || 'Não especificado')}</span></p>
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-2 text-center">Nível de Alerta</p>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden flex">
                                <div
                                    className={`h-full ${Number(dados.intensidade) > 7 ? 'bg-red-500' : Number(dados.intensidade) > 4 ? 'bg-amber-500' : 'bg-blue-500'}`}
                                    style={{ width: `${(Number(dados.intensidade) || 0) * 10}%` }}
                                />
                            </div>
                            <div className="flex justify-between mt-1 text-[9px] text-gray-600 font-bold uppercase">
                                <span>Leve</span>
                                <span>Moderada</span>
                                <span>Insuportável</span>
                            </div>
                        </div>
                    </div>
                )

            case 'FEEDBACK_TREINO':
                return (
                    <div className="space-y-4">
                        <div className="bg-white/5 rounded-2xl p-5 border border-white/5 relative">
                            <MessageSquare className="absolute -top-3 -left-2 text-primary opacity-20" size={40} />
                            <p className="text-sm text-gray-200 leading-relaxed italic relative z-10">"{String(dados.texto || 'Mensagem vazia')}"</p>
                        </div>
                        {dados.alerta && (
                            <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 border border-amber-400/20 p-3 rounded-xl">
                                <AlertTriangle size={16} />
                                <p className="text-xs font-bold uppercase tracking-tight">IA Detectou alerta de atenção no feedback</p>
                            </div>
                        )}
                    </div>
                )

            case 'META_ATINGIDA':
            case 'RECORDE_PESSOAL':
                return (
                    <div className="flex flex-col items-center py-4 space-y-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gold blur-3xl opacity-20 animate-pulse" />
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center text-white relative border-4 border-white/10 shadow-2xl">
                                <Trophy size={40} />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-surface-deep border-4 border-white/5 flex items-center justify-center">
                                <Flame size={20} className="text-orange-500" />
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-black text-white italic tracking-tighter uppercase">PARABÉNS!</p>
                            <p className="text-sm text-gray-400 mt-1">O aluno atingiu o marco de <span className="text-gold font-bold">{Number(dados.scoreAtual || 0).toFixed(1)} pts</span></p>
                            {dados.scoreMeta && <p className="text-xs text-gray-500">Meta anterior: {Number(dados.scoreMeta).toFixed(0)}</p>}
                            {dados.maxScoreHistorico && <p className="text-xs text-gray-500">Recorde anterior: {Number(dados.maxScoreHistorico).toFixed(1)}</p>}
                        </div>
                    </div>
                )

            case 'SEM_TREINO_7D':
            case 'SEM_TREINO_3D':
                return (
                    <div className="space-y-4">
                        <div className="bg-white/5 rounded-2xl p-5 border border-white/5 flex flex-col items-center gap-2">
                            <Calendar className="text-gray-600 mb-1" size={32} />
                            <p className="text-2xl font-black text-white">{String(dados.diasSemTreino || '?')} dias</p>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest text-center">Sem registrar nenhum treino</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Último comparecimento</p>
                            <p className="text-sm text-white font-medium mt-0.5">
                                {dados.ultimoTreino ? new Date(String(dados.ultimoTreino)).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Nunca registrou'}
                            </p>
                        </div>
                    </div>
                )

            default:
                // Fallback genérico para outros tipos
                return (
                    <div className="py-4 px-2">
                        <p className="text-sm text-gray-400 italic text-center">
                            Esta notificação contém informações automáticas sobre o progresso do aluno.
                        </p>
                    </div>
                )
        }
    }, [notificacao])

    const modalContent = (
        <div
            className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
            onClick={onFechar}
        >
            <div
                className="bg-surface-deep border border-white/10 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md overflow-hidden shadow-2xl animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                {/* Banner de Categoria / Gradiente Superior */}
                <div
                    className="h-2 w-full"
                    style={{ backgroundColor: categoriaConfig.cor }}
                />

                {/* Header - Info do Aluno */}
                <div className="px-6 pt-6 pb-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-12 h-12 rounded-full border-2 border-white/10 p-0.5 overflow-hidden flex-shrink-0"
                            >
                                {notificacao.atleta_foto ? (
                                    <img
                                        src={notificacao.atleta_foto}
                                        alt={notificacao.atleta_nome || ''}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center text-gray-500">
                                        <User size={20} />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white tracking-tight leading-tight uppercase">
                                    {notificacao.atleta_nome || 'Sistema'}
                                </h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-white/5 text-gray-500 border border-white/10">
                                        {categoriaConfig.icone} {categoriaConfig.label}
                                    </span>
                                    <span
                                        className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border"
                                        style={{ backgroundColor: `${prioridadeConfig.cor}15`, color: prioridadeConfig.cor, borderColor: `${prioridadeConfig.cor}30` }}
                                    >
                                        {notificacao.prioridade}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onFechar}
                            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Conteúdo Principal */}
                <div className="px-6 py-2 overflow-y-auto max-h-[60dvh]">
                    {/* Título e Mensagem da Notificação */}
                    <div className="mb-6">
                        <h4
                            className="text-white font-bold text-lg leading-tight"
                            dangerouslySetInnerHTML={{ __html: notificacao.titulo }}
                        />
                        <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                            {notificacao.mensagem}
                        </p>
                    </div>

                    <div className="h-px w-full bg-white/5 mb-6" />

                    {/* Área de Dados Contextuais (Diferenciada por tipo) */}
                    <div className="mb-8">
                        <h5 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4">DETALHES RELEVANTES</h5>
                        {renderContextContent}
                    </div>
                </div>

                {/* Footer - Ações */}
                <div className="p-6 bg-white/[0.02] border-t border-white/5 flex flex-col gap-3">
                    {notificacao.acao_label && (
                        <button
                            onClick={handleAcao}
                            className="w-full py-4 rounded-2xl bg-primary text-black font-black uppercase tracking-tighter text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
                        >
                            {notificacao.acao_label.replace('→', '').trim()}
                            <ArrowRight size={18} strokeWidth={3} />
                        </button>
                    )}
                    <button
                        onClick={onFechar}
                        className="w-full py-3 text-gray-500 font-bold text-xs uppercase hover:text-white transition-colors"
                    >
                        Fechar detalhes
                    </button>
                </div>
            </div>
        </div>
    )

    return createPortal(modalContent, document.body)
}
