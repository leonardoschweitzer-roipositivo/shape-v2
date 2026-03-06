/**
 * HomeScreen — Tab HOME do Portal do Personal
 *
 * Responde "Como está meu dia?" em 5 segundos.
 * Exibe: resumo rápido, alunos que precisam de atenção, atividade recente.
 */

import React from 'react'
import { Users, AlertTriangle, Activity, ChevronRight, Clock } from 'lucide-react'
import type { AlunoCard, AtividadeRecente, PersonalPortalContext } from '@/types/personal-portal'

interface HomeScreenProps {
    contexto: PersonalPortalContext
    alunosAtencao: AlunoCard[]
    atividadeRecente: AtividadeRecente[]
    onAbrirAluno: (alunoId: string) => void
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

export function HomeScreen({ contexto, alunosAtencao, atividadeRecente, onAbrirAluno }: HomeScreenProps) {
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
                <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                        <p className="text-white text-2xl font-black">{contexto.totalAlunos}</p>
                        <p className="text-gray-500 text-[11px] mt-0.5">Alunos</p>
                    </div>
                    <div className="text-center border-x border-white/5">
                        <p className="text-emerald-400 text-2xl font-black">{contexto.alunosAtivos}</p>
                        <p className="text-gray-500 text-[11px] mt-0.5">Ativos</p>
                    </div>
                    <div className="text-center">
                        <p className="text-red-400 text-2xl font-black">{contexto.alunosAtencao}</p>
                        <p className="text-gray-500 text-[11px] mt-0.5">Atenção</p>
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
                            const diasSemMedir = aluno.ultimaMedicao
                                ? Math.floor((Date.now() - new Date(aluno.ultimaMedicao).getTime()) / 86400000)
                                : null
                            return (
                                <button
                                    key={aluno.id}
                                    onClick={() => onAbrirAluno(aluno.id)}
                                    className={`w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors ${idx < alunosAtencao.slice(0, 3).length - 1 ? 'border-b border-white/5' : ''}`}
                                >
                                    <div>
                                        <p className="text-white text-sm font-semibold">{aluno.nome}</p>
                                        <p className="text-gray-500 text-xs mt-0.5">
                                            {diasSemMedir !== null
                                                ? `Sem medição há ${diasSemMedir}d`
                                                : 'Nunca mediu'}
                                            {aluno.score > 0 ? ` • Score: ${aluno.score}` : ''}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">
                                            ⚠️ ATENÇÃO
                                        </span>
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
