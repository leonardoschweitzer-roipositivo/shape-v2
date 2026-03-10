/**
 * AlunosScreen — Tab ALUNOS do Portal do Personal
 *
 * Lista de alunos com busca e filtros rápidos.
 * Ao tocar num aluno, exibe a Ficha Rápida.
 */

import React, { useState, useMemo } from 'react'
import { Search, ChevronRight, ChevronLeft, TrendingUp, TrendingDown, Minus, Users, UserPlus } from 'lucide-react'
import type { AlunoCard, StatusAluno } from '@/types/personal-portal'
import { AlunoFichaScreen } from './AlunoFichaScreen'
import { NovoAlunoScreen } from './NovoAlunoScreen'
import { ScreenHeader } from './components/ScreenHeader'

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
    const [cadastrando, setCadastrando] = useState(false)

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

    // Sub-tela: Cadastro de Novo Aluno
    if (cadastrando) {
        return (
            <NovoAlunoScreen
                onVoltar={() => setCadastrando(false)}
                onCadastrado={() => setCadastrando(false)}
            />
        )
    }

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
        <div className="min-h-screen bg-background-dark pb-24 px-4 pt-8 relative overflow-hidden">
            {/* Efeito de Gradiente de Topo (igual ao Aluno) */}
            <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-indigo-500/10 via-indigo-900/5 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10">
                <ScreenHeader
                    icon={<Users size={16} className="text-indigo-400" />}
                    titulo="Meus Alunos"
                    subtitulo={`${alunos.length} aluno${alunos.length !== 1 ? 's' : ''}`}
                    rightContent={
                        <button
                            onClick={() => setCadastrando(true)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
                        >
                            <UserPlus size={14} strokeWidth={2.5} />
                            Novo Aluno
                        </button>
                    }
                />

                {/* Busca Premium */}
                <div className="relative mb-6 group">
                    <div className="absolute inset-0 bg-indigo-500/5 rounded-2xl blur-xl group-focus-within:bg-indigo-500/10 transition-all opacity-0 group-focus-within:opacity-100" />
                    <div className="relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou email..."
                            value={busca}
                            onChange={e => setBusca(e.target.value)}
                            className="w-full bg-surface-deep text-white text-sm font-medium placeholder-zinc-600 rounded-2xl pl-12 pr-4 py-4 border border-white/5 focus:outline-none focus:border-indigo-500/30 transition-all shadow-inner shadow-black/20"
                        />
                    </div>
                </div>

                {/* Filtros (chips) */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                    {filtros.map(f => (
                        <button
                            key={f.id}
                            onClick={() => setFiltro(f.id)}
                            className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${filtro === f.id
                                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20'
                                : 'bg-surface-deep text-zinc-500 border-white/5 hover:border-white/10'
                                }`}
                        >
                            {f.label}
                            <span className={`px-1.5 py-0.5 rounded-md ${filtro === f.id ? 'bg-white/20 text-white' : 'bg-white/5 text-zinc-600'}`}>
                                {f.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Lista */}
                <div>
                    {alunosFiltrados.length === 0 ? (
                        <div className="text-center py-16 bg-surface-deep rounded-3xl border border-white/5 mx-1">
                            <Users size={40} className="text-zinc-800 mx-auto mb-4" />
                            <p className="text-zinc-500 text-sm font-medium">Nenhum aluno encontrado.</p>
                        </div>
                    ) : (
                        <div className="bg-surface-deep rounded-3xl border border-white/5 overflow-hidden shadow-2xl relative">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                                <Users size={120} className="text-white" />
                            </div>

                            <div className="divide-y divide-white/5">
                                {alunosFiltrados.map((aluno) => {
                                    const status = getStatusConfig(aluno.status)
                                    const temEvolucao = aluno.evolucaoSemana !== 0
                                    return (
                                        <button
                                            key={aluno.id}
                                            onClick={() => setAlunoSelecionado(aluno.id)}
                                            className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-all active:scale-[0.99] group relative"
                                        >
                                            <div className="flex items-center gap-4 relative z-10">
                                                {/* Avatar Premium */}
                                                <div className="relative shrink-0">
                                                    <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center border border-white/10 shadow-lg overflow-hidden group-hover:border-indigo-500/30 transition-colors">
                                                        {aluno.fotoUrl
                                                            ? <img src={aluno.fotoUrl} alt={aluno.nome} className="w-14 h-14 object-cover" />
                                                            : <span className="text-zinc-500 text-lg font-black">{aluno.nome[0].toUpperCase()}</span>
                                                        }
                                                    </div>
                                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#09090b] ${status.dot} shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
                                                </div>

                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-white text-base font-black tracking-tight">{aluno.nome}</p>
                                                        {aluno.nivel && (
                                                            <span className="text-[9px] font-black bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-md border border-indigo-500/20 uppercase tracking-widest">
                                                                {aluno.nivel}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${status.cor}`}>{status.label}</span>
                                                        {aluno.score > 0 && (
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-zinc-700 text-[10px]">•</span>
                                                                <span className="text-white text-[10px] font-black">{aluno.score}</span>
                                                                <span className="text-zinc-600 text-[9px] font-bold uppercase">PTS</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest mt-1">
                                                        Treinou {formatarUltimaMedicao(aluno.ultimaMedicao)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 relative z-10">
                                                {temEvolucao && (
                                                    <div className={`flex flex-col items-end ${aluno.evolucaoSemana > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                        <div className="flex items-center gap-0.5 font-black text-xs">
                                                            {aluno.evolucaoSemana > 0 ? '+' : ''}{aluno.evolucaoSemana}
                                                            {aluno.evolucaoSemana > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                                        </div>
                                                        <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">SEMANA</span>
                                                    </div>
                                                )}
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/10 transition-colors">
                                                    <ChevronRight size={20} className="text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                                                </div>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    )
}
