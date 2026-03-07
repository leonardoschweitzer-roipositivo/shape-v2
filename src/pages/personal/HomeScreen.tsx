/**
 * HomeScreen — Tab HOME do Portal do Personal
 *
 * Responde "Como está meu dia?" em 5 segundos.
 * Exibe: resumo rápido, alunos que precisam de atenção, atividade recente.
 */

import React from 'react'
import { Users, AlertTriangle, Activity, ChevronRight, Clock, Bell, User, Play } from 'lucide-react'
import type { AlunoCard, AtividadeRecente, PersonalPortalContext } from '@/types/personal-portal'
import type { Notificacao } from '@/types/notificacao.types'
import { PRIORIDADE_CONFIG } from '@/types/notificacao.types'

interface HomeScreenProps {
    contexto: PersonalPortalContext
    alunosAtencao: AlunoCard[]
    todosAlunos: AlunoCard[]
    atividadeRecente: AtividadeRecente[]
    onAbrirAluno: (alunoId: string) => void
    notificacoesRecentes?: Notificacao[]
    onVerAlertas?: () => void
    onVerAlunos?: () => void
}

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
}

function formatarTempo(isoDate: string): string {
    const diff = Date.now() - new Date(isoDate).getTime()
    const h = Math.floor(diff / 3600000)
    const d = Math.floor(diff / 86400000)
    if (h < 1) return 'Agora'
    if (h < 24) return `Há ${h}h`
    if (d === 1) return 'Ontem'
    return `Há ${d} dias`
}

export function HomeScreen({ contexto, alunosAtencao, todosAlunos, atividadeRecente, onAbrirAluno, notificacoesRecentes = [], onVerAlertas, onVerAlunos }: HomeScreenProps) {
    const saudacao = () => {
        const hora = new Date().getHours()
        if (hora < 12) return 'Bom dia'
        if (hora < 18) return 'Boa tarde'
        return 'Boa noite'
    }

    const nomeCurto = contexto.nome.split(' ')[0]

    return (
        <div className="min-h-screen bg-background-dark pb-24 relative overflow-hidden">
            {/* Efeito de Gradiente de Topo (igual ao Aluno) */}
            <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-indigo-500/10 via-indigo-900/5 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

            {/* Header (Identidade Premium) */}
            <div className="relative px-6 pt-10 pb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Avatar Premium */}
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 p-1">
                        <div className="w-full h-full rounded-[1.25rem] bg-zinc-900 flex items-center justify-center overflow-hidden">
                            {contexto.fotoUrl ? (
                                <img src={contexto.fotoUrl} alt={contexto.nome} className="w-full h-full object-cover" />
                            ) : (
                                <User className="text-indigo-400" size={24} />
                            )}
                        </div>
                    </div>

                    <div>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">{saudacao()},</p>
                        <h1 className="text-white text-3xl font-black tracking-tight leading-none uppercase">
                            {nomeCurto}
                        </h1>
                    </div>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-md shadow-xl">
                    <span className="text-xl">🔥</span>
                </div>
            </div>

            <div className="px-4 relative z-10">

                {/* Resumo do Dia (Cockpit Style) */}
                <div className="bg-surface-deep rounded-3xl p-6 mb-4 border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Activity size={80} className="text-indigo-400" />
                    </div>

                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                            <Activity size={12} className="text-indigo-400" />
                        </div>
                        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            Performance do Dia
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <p className="text-white text-3xl font-black">{contexto.totalAlunos}</p>
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Alunos Totais</p>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <p className="text-emerald-400 text-3xl font-black">{contexto.alunosAtivos}</p>
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Alunos Ativos</p>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="flex items-baseline gap-1">
                                <p className="text-indigo-400 text-3xl font-black">{contexto.scoreMedio}</p>
                                <span className="text-[10px] font-bold text-zinc-600 uppercase">pts</span>
                            </div>
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Score Médio</p>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <p className="text-rose-500 text-3xl font-black">{alunosAtencao.length}</p>
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Sob Atenção</p>
                        </div>
                    </div>
                </div>

                {/* Botão Premium VER MEUS ALUNOS */}
                <button
                    onClick={onVerAlunos}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl py-5 px-6 flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all mb-10 group"
                >
                    <Play size={18} className="text-white fill-white group-hover:translate-x-0.5 transition-transform" />
                    <span className="text-white text-sm font-black uppercase tracking-[0.2em]">Ver Meus Alunos</span>
                </button>


                {/* Alertas Recentes (não lidas) */}
                {notificacoesRecentes.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4 px-1">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                    <Bell size={12} className="text-indigo-400" />
                                </div>
                                <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                    Alertas Estratégicos
                                </p>
                            </div>
                            {onVerAlertas && (
                                <button onClick={onVerAlertas} className="text-indigo-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:text-indigo-300 transition-colors">
                                    Todos <ChevronRight size={12} />
                                </button>
                            )}
                        </div>
                        <div className="bg-surface-deep rounded-3xl border border-white/5 overflow-hidden shadow-xl">
                            {notificacoesRecentes.slice(0, 3).map((notif, idx) => {
                                const prioConfig = PRIORIDADE_CONFIG[notif.prioridade]
                                return (
                                    <button
                                        key={notif.id}
                                        onClick={() => notif.atleta_id && onAbrirAluno(notif.atleta_id)}
                                        className={`w-full flex items-start gap-4 p-5 text-left hover:bg-white/5 transition-all active:scale-[0.98] ${idx < Math.min(3, notificacoesRecentes.length) - 1 ? 'border-b border-white/5' : ''}`}
                                    >
                                        <span className="text-xl shrink-0">{prioConfig.icone}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-xs font-black tracking-tight leading-snug truncate">
                                                {stripHtml(notif.titulo)}
                                            </p>
                                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mt-1 leading-relaxed line-clamp-1">
                                                {stripHtml(notif.mensagem)}
                                            </p>
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)] shrink-0 mt-1" />
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Atividade Recente */}
                {atividadeRecente.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4 px-1">
                            <div className="w-6 h-6 rounded-lg bg-zinc-500/10 flex items-center justify-center">
                                <Activity size={12} className="text-zinc-500" />
                            </div>
                            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                Linha do Tempo
                            </p>
                        </div>
                        <div className="bg-surface-deep rounded-3xl border border-white/5 overflow-hidden shadow-xl">
                            {atividadeRecente.map((ativ, idx) => (
                                <button
                                    key={ativ.id}
                                    onClick={() => onAbrirAluno(ativ.alunoId)}
                                    className={`w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-all active:scale-[0.98] ${idx < atividadeRecente.length - 1 ? 'border-b border-white/5' : ''}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-xl shrink-0">
                                            {ativ.tipo === 'TREINO_COMPLETO' ? '✅' :
                                                ativ.tipo === 'TREINO_PULADO' ? '⏭️' :
                                                    ativ.tipo === 'NOVA_MEDICAO' ? '📏' : '📝'}
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-black tracking-tight">{ativ.alunoNome}</p>
                                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mt-1">{ativ.descricao}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-zinc-600 text-[10px] font-black uppercase tracking-widest shrink-0">
                                        <Clock size={11} className="text-zinc-700" />
                                        <span>{formatarTempo(ativ.criadoEm)}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Precisam de Atenção (Movido para depois da Linha do Tempo) */}
                {alunosAtencao.length > 0 ? (
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4 px-1">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-rose-500/20 flex items-center justify-center">
                                    <AlertTriangle size={12} className="text-rose-400" />
                                </div>
                                <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                    Alunos Sob Atenção
                                </p>
                            </div>
                            <span className="text-[10px] font-black bg-rose-500/10 text-rose-400 px-2.5 py-1 rounded-full border border-rose-500/20 uppercase tracking-wider">
                                {alunosAtencao.length} Críticos
                            </span>
                        </div>
                        <div className="bg-surface-deep rounded-3xl border border-white/5 overflow-hidden shadow-xl">
                            {alunosAtencao.slice(0, 3).map((aluno, idx) => {
                                const reason = aluno.score > 0 && aluno.score < 50
                                    ? 'Score crítico, agendar reavaliação'
                                    : aluno.score > 0 && aluno.score < 60
                                        ? 'Score abaixo da média'
                                        : 'Sem atividade recente'
                                return (
                                    <button
                                        key={aluno.id}
                                        onClick={() => onAbrirAluno(aluno.id)}
                                        className={`w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-all active:scale-[0.98] ${idx < alunosAtencao.slice(0, 3).length - 1 ? 'border-b border-white/5' : ''}`}
                                    >
                                        <div>
                                            <p className="text-white text-base font-black tracking-tight leading-none">{aluno.nome}</p>
                                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mt-2 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                                                {reason}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {aluno.score > 0 && (
                                                <div className="flex flex-col items-end">
                                                    <span className="text-base font-black text-white leading-none">{aluno.score}</span>
                                                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-1">PTS</span>
                                                </div>
                                            )}
                                            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-rose-500/10 transition-colors">
                                                <ChevronRight size={18} className="text-zinc-600" />
                                            </div>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="bg-surface-deep/50 rounded-3xl p-8 mb-8 border border-white/5 text-center backdrop-blur-sm">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl">✅</span>
                        </div>
                        <p className="text-emerald-400 text-[11px] font-black uppercase tracking-widest">Todos em dia!</p>
                        <p className="text-zinc-600 text-[10px] font-medium mt-1">Nenhum aluno precisa de atenção agora.</p>
                    </div>
                )}

                {/* Top Performers */}
                {(() => {
                    const topPerformers = [...todosAlunos]
                        .filter(a => a.score > 0)
                        .sort((a, b) => b.score - a.score)
                        .slice(0, 3)
                    const medals = ['🥇', '🥈', '🥉']
                    return topPerformers.length > 0 ? (
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4 px-1">
                                <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center text-xs">
                                    🏆
                                </div>
                                <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                    Ranking Elite
                                </p>
                            </div>
                            <div className="bg-surface-deep rounded-3xl border border-white/5 overflow-hidden shadow-xl">
                                {topPerformers.map((aluno, idx) => (
                                    <button
                                        key={aluno.id}
                                        onClick={() => onAbrirAluno(aluno.id)}
                                        className={`w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-all active:scale-[0.98] ${idx < topPerformers.length - 1 ? 'border-b border-white/5' : ''}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-xl shrink-0">{medals[idx]}</span>
                                            <div>
                                                <p className="text-white text-sm font-black tracking-tight">{aluno.nome}</p>
                                                <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mt-1">{aluno.nivel ?? 'Analista'}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-lg font-black text-white">{aluno.score}</span>
                                            <span className="text-[8px] font-black text-zinc-600 uppercase">SCORE</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : null
                })()}

                {/* Estado vazio geral */}
                {atividadeRecente.length === 0 && alunosAtencao.length === 0 && (
                    <div className="text-center py-8">
                        <Users size={40} className="text-gray-700 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">Nenhuma atividade hoje.</p>
                        <p className="text-gray-600 text-xs mt-1">Seus alunos aparecerão aqui quando treinarem.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
