/**
 * HomeScreen — Tab HOME do Portal do Personal
 *
 * Responde "Como está meu dia?" em 5 segundos.
 * Exibe: resumo rápido, alunos que precisam de atenção, atividade recente.
 */

import React from 'react'
import { Users, AlertTriangle, Activity, ChevronRight, Clock, Bell } from 'lucide-react'
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

export function HomeScreen({ contexto, alunosAtencao, todosAlunos, atividadeRecente, onAbrirAluno, notificacoesRecentes = [], onVerAlertas }: HomeScreenProps) {
    const saudacao = () => {
        const hora = new Date().getHours()
        if (hora < 12) return 'Bom dia'
        if (hora < 18) return 'Boa tarde'
        return 'Boa noite'
    }

    const nomeCurto = contexto.nome.split(' ')[0]

    return (
        <div className="min-h-screen bg-[#060B18] pb-24 px-4 pt-6">
            {/* Header */}
            <div className="mb-6">
                <p className="text-gray-400 text-sm">{saudacao()},</p>
                <h1 className="text-white text-2xl font-black">{nomeCurto} 👋</h1>
            </div>

            {/* Resumo do Dia */}
            <div className="bg-[#111827] rounded-2xl p-4 mb-5 border border-white/5">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">
                    📊 Resumo do Dia
                </p>
                <div className="grid grid-cols-4 gap-2">
                    <div className="text-center">
                        <p className="text-white text-xl font-black">{contexto.totalAlunos}</p>
                        <p className="text-gray-500 text-[10px] mt-0.5">Alunos</p>
                    </div>
                    <div className="text-center border-x border-white/5">
                        <p className="text-emerald-400 text-xl font-black">{contexto.alunosAtivos}</p>
                        <p className="text-gray-500 text-[10px] mt-0.5">Ativos</p>
                    </div>
                    <div className="text-center border-r border-white/5">
                        <p className="text-[var(--color-gold)] text-xl font-black">{contexto.scoreMedio}</p>
                        <p className="text-gray-500 text-[10px] mt-0.5">Score Médio</p>
                    </div>
                    <div className="text-center">
                        <p className="text-red-400 text-xl font-black">{alunosAtencao.length}</p>
                        <p className="text-gray-500 text-[10px] mt-0.5">Atenção</p>
                    </div>
                </div>
            </div>

            {/* Precisam de Atenção */}
            {alunosAtencao.length > 0 && (
                <div className="mb-5">
                    <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle size={14} className="text-red-400" />
                        <p className="text-gray-300 text-xs font-bold uppercase tracking-wider">
                            Precisam de Atenção
                        </p>
                    </div>
                    <div className="bg-[#111827] rounded-2xl border border-white/5 overflow-hidden">
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
                                    className={`w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors ${idx < alunosAtencao.slice(0, 3).length - 1 ? 'border-b border-white/5' : ''}`}
                                >
                                    <div>
                                        <p className="text-white text-sm font-semibold">{aluno.nome}</p>
                                        <p className="text-gray-500 text-xs mt-0.5">{reason}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {aluno.score > 0 && (
                                            <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold">
                                                Score: {aluno.score}
                                            </span>
                                        )}
                                        <ChevronRight size={16} className="text-gray-600" />
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Sem alertas */}
            {alunosAtencao.length === 0 && (
                <div className="bg-[#111827] rounded-2xl p-5 mb-5 border border-white/5 text-center">
                    <div className="text-emerald-400 text-2xl mb-2">✅</div>
                    <p className="text-emerald-400 text-sm font-semibold">Todos os alunos em dia!</p>
                    <p className="text-gray-500 text-xs mt-1">Nenhum aluno precisa de atenção agora.</p>
                </div>
            )}

            {/* Alertas Recentes (não lidos) */}
            {notificacoesRecentes.length > 0 && (
                <div className="mb-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Bell size={14} className="text-[var(--color-gold)]" />
                            <p className="text-gray-300 text-xs font-bold uppercase tracking-wider">
                                Alertas Recentes
                            </p>
                        </div>
                        {onVerAlertas && (
                            <button onClick={onVerAlertas} className="text-[var(--color-gold)] text-xs font-semibold flex items-center gap-0.5">
                                Ver todos <ChevronRight size={12} />
                            </button>
                        )}
                    </div>
                    <div className="bg-[#111827] rounded-2xl border border-white/5 overflow-hidden">
                        {notificacoesRecentes.slice(0, 3).map((notif, idx) => {
                            const prioConfig = PRIORIDADE_CONFIG[notif.prioridade]
                            return (
                                <button
                                    key={notif.id}
                                    onClick={() => notif.atleta_id && onAbrirAluno(notif.atleta_id)}
                                    className={`w-full flex items-start gap-3 p-3.5 text-left hover:bg-white/5 transition-colors ${idx < Math.min(3, notificacoesRecentes.length) - 1 ? 'border-b border-white/5' : ''}`}
                                >
                                    <span className="text-base shrink-0 mt-0.5">{prioConfig.icone}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-xs font-semibold leading-snug truncate">
                                            {stripHtml(notif.titulo)}
                                        </p>
                                        <p className="text-gray-500 text-[11px] mt-0.5 leading-relaxed line-clamp-1">
                                            {stripHtml(notif.mensagem)}
                                        </p>
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] shrink-0 mt-1.5" />
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Atividade Recente */}
            {atividadeRecente.length > 0 && (
                <div className="mb-5">
                    <div className="flex items-center gap-2 mb-3">
                        <Activity size={14} className="text-gray-400" />
                        <p className="text-gray-300 text-xs font-bold uppercase tracking-wider">
                            Atividade Recente
                        </p>
                    </div>
                    <div className="bg-[#111827] rounded-2xl border border-white/5 overflow-hidden">
                        {atividadeRecente.map((ativ, idx) => (
                            <button
                                key={ativ.id}
                                onClick={() => onAbrirAluno(ativ.alunoId)}
                                className={`w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors ${idx < atividadeRecente.length - 1 ? 'border-b border-white/5' : ''}`}
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-base mt-0.5">
                                        {ativ.tipo === 'TREINO_COMPLETO' ? '✅' :
                                            ativ.tipo === 'TREINO_PULADO' ? '⏭️' :
                                                ativ.tipo === 'NOVA_MEDICAO' ? '📏' : '📝'}
                                    </span>
                                    <div>
                                        <p className="text-white text-sm font-semibold">{ativ.alunoNome}</p>
                                        <p className="text-gray-500 text-xs mt-0.5">{ativ.descricao}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-gray-600 text-xs shrink-0">
                                    <Clock size={11} />
                                    <span>{formatarTempo(ativ.criadoEm)}</span>
                                </div>
                            </button>
                        ))}
                    </div>
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
                    <div className="mb-5">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm">🏆</span>
                            <p className="text-gray-300 text-xs font-bold uppercase tracking-wider">
                                Top Performers
                            </p>
                        </div>
                        <div className="bg-[#111827] rounded-2xl border border-white/5 overflow-hidden">
                            {topPerformers.map((aluno, idx) => (
                                <button
                                    key={aluno.id}
                                    onClick={() => onAbrirAluno(aluno.id)}
                                    className={`w-full flex items-center justify-between p-3.5 text-left hover:bg-white/5 transition-colors ${idx < topPerformers.length - 1 ? 'border-b border-white/5' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">{medals[idx]}</span>
                                        <div>
                                            <p className="text-white text-sm font-semibold">{aluno.nome}</p>
                                            <p className="text-gray-500 text-xs mt-0.5">{aluno.nivel ?? 'Sem avaliação'}</p>
                                        </div>
                                    </div>
                                    <span className="text-[var(--color-gold)] text-sm font-bold">{aluno.score} pts</span>
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
    )
}
