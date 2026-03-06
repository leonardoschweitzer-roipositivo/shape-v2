/**
 * AlunosScreen — Tab ALUNOS do Portal do Personal
 *
 * Lista de alunos com busca e filtros rápidos.
 * Ao tocar num aluno, exibe a Ficha Rápida.
 */

import React, { useState, useMemo } from 'react'
import { Search, ChevronRight, ChevronLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { AlunoCard, StatusAluno } from '@/types/personal-portal'
import { AlunoFichaScreen } from './AlunoFichaScreen'

type FiltroStatus = 'todos' | StatusAluno

interface AlunosScreenProps {
    alunos: AlunoCard[]
    onVoltar?: () => void
    alunoInicialId?: string          // navega direto para a ficha ao montar
    onAlunoFechou?: () => void       // notifica quando a ficha fecha
}

function getStatusConfig(status: StatusAluno) {
    const cfg: Record<StatusAluno, { label: string; cor: string; dot: string }> = {
        ATIVO: { label: 'Ativo', cor: 'text-emerald-400', dot: 'bg-emerald-400' },
        ATENCAO: { label: 'Atenção', cor: 'text-red-400', dot: 'bg-red-400' },
        INATIVO: { label: 'Inativo', cor: 'text-gray-500', dot: 'bg-gray-500' },
    }
    return cfg[status]
}

function formatarUltimaMedicao(iso: string | null): string {
    if (!iso) return 'Nunca mediu'
    const dias = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
    if (dias === 0) return 'Hoje'
    if (dias === 1) return 'Ontem'
    return `Há ${dias} dias`
}

export function AlunosScreen({ alunos, onVoltar, alunoInicialId, onAlunoFechou }: AlunosScreenProps) {
    const [busca, setBusca] = useState('')
    const [filtro, setFiltro] = useState<FiltroStatus>('todos')
    const [alunoSelecionado, setAlunoSelecionado] = useState<string | null>(alunoInicialId ?? null)

    // Ordenação: ATENCAO primeiro, depois ATIVO, depois INATIVO
    const ORDEM_STATUS: Record<StatusAluno, number> = { ATENCAO: 0, ATIVO: 1, INATIVO: 2 }

    const alunosFiltrados = useMemo(() => {
        return alunos
            .filter(a => {
                const passaBusca = a.nome.toLowerCase().includes(busca.toLowerCase()) ||
                    a.email.toLowerCase().includes(busca.toLowerCase())
                const passaFiltro = filtro === 'todos' || a.status === filtro
                return passaBusca && passaFiltro
            })
            .sort((a, b) => ORDEM_STATUS[a.status] - ORDEM_STATUS[b.status])
    }, [alunos, busca, filtro])

    const contadores = useMemo(() => ({
        todos: alunos.length,
        ATIVO: alunos.filter(a => a.status === 'ATIVO').length,
        ATENCAO: alunos.filter(a => a.status === 'ATENCAO').length,
        INATIVO: alunos.filter(a => a.status === 'INATIVO').length,
    }), [alunos])

    // Sub-tela: Ficha do Aluno
    if (alunoSelecionado) {
        return (
            <AlunoFichaScreen
                alunoId={alunoSelecionado}
                onVoltar={() => setAlunoSelecionado(null)}
            />
        )
    }

    const filtros: { id: FiltroStatus; label: string; count: number }[] = [
        { id: 'todos', label: 'Todos', count: contadores.todos },
        { id: 'ATIVO', label: 'Ativos', count: contadores.ATIVO },
        { id: 'ATENCAO', label: 'Atenção', count: contadores.ATENCAO },
        { id: 'INATIVO', label: 'Inativos', count: contadores.INATIVO },
    ]

    return (
        <div className="min-h-screen bg-[#060B18] pb-24">
            {/* Header fixo */}
            <div className="sticky top-0 bg-[#060B18] pt-6 pb-3 px-4 z-10 border-b border-white/5">
                <h1 className="text-white text-xl font-black mb-4">Meus Alunos</h1>

                {/* Busca */}
                <div className="relative mb-3">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou email..."
                        value={busca}
                        onChange={e => setBusca(e.target.value)}
                        className="w-full bg-[#111827] text-white text-sm placeholder-gray-600 rounded-xl pl-9 pr-4 py-2.5 border border-white/5 focus:outline-none focus:border-[var(--color-gold)]/50"
                    />
                </div>

                {/* Filtros (chips) */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {filtros.map(f => (
                        <button
                            key={f.id}
                            onClick={() => setFiltro(f.id)}
                            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${filtro === f.id
                                ? 'bg-[var(--color-gold)] text-black border-[var(--color-gold)]'
                                : 'bg-transparent text-gray-400 border-white/10'
                                }`}
                        >
                            {f.label}
                            <span className={`text-[10px] ${filtro === f.id ? 'opacity-70' : 'opacity-50'}`}>
                                {f.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Lista */}
            <div className="px-4 pt-4">
                {alunosFiltrados.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-sm">Nenhum aluno encontrado.</p>
                    </div>
                ) : (
                    <div className="bg-[#111827] rounded-2xl border border-white/5 overflow-hidden">
                        {alunosFiltrados.map((aluno, idx) => {
                            const status = getStatusConfig(aluno.status)
                            const temEvolucao = aluno.evolucaoSemana !== 0
                            return (
                                <button
                                    key={aluno.id}
                                    onClick={() => setAlunoSelecionado(aluno.id)}
                                    className={`w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors ${idx < alunosFiltrados.length - 1 ? 'border-b border-white/5' : ''}`}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Avatar */}
                                        <div className="w-10 h-10 rounded-full bg-[var(--color-surface)] flex items-center justify-center shrink-0 border border-white/10">
                                            {aluno.fotoUrl
                                                ? <img src={aluno.fotoUrl} alt={aluno.nome} className="w-10 h-10 rounded-full object-cover" />
                                                : <span className="text-gray-400 text-sm font-bold">{aluno.nome[0].toUpperCase()}</span>
                                            }
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-white text-sm font-semibold">{aluno.nome}</p>
                                                {aluno.nivel && (
                                                    <span className="text-[10px] text-[var(--color-gold)] font-bold">
                                                        {aluno.nivel}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                                <span className={`text-xs ${status.cor}`}>{status.label}</span>
                                                {aluno.score > 0 && (
                                                    <span className="text-gray-600 text-xs">• {aluno.score} pts</span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 text-[11px] mt-0.5">
                                                {formatarUltimaMedicao(aluno.ultimaMedicao)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {temEvolucao && (
                                            <div className={`flex items-center gap-0.5 text-xs font-bold ${aluno.evolucaoSemana > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {aluno.evolucaoSemana > 0
                                                    ? <TrendingUp size={12} />
                                                    : <TrendingDown size={12} />
                                                }
                                                {aluno.evolucaoSemana > 0 ? '+' : ''}{aluno.evolucaoSemana}
                                            </div>
                                        )}
                                        {!temEvolucao && <Minus size={12} className="text-gray-700" />}
                                        <ChevronRight size={16} className="text-gray-600" />
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
