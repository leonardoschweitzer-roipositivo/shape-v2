/**
 * BibliotecaExerciciosPage — Página dedicada da Biblioteca de Exercícios
 *
 * Para o personal: navegar por todos os exercícios disponíveis,
 * filtrar por grupo muscular, nível ou equipamento, buscar por nome,
 * e visualizar detalhes (vídeo ou "em breve") de cada exercício.
 *
 * Para o GOD (isGod=true): funcionalidades de gestão adicionais
 * (upload de vídeo, edição de conteúdo).
 */

import React, { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Search, Dumbbell, Video, X, Upload, Pencil } from 'lucide-react'
import { exercicioBibliotecaService } from '@/services/exercicioBiblioteca.service'
import { ExercicioDetalheModal } from '@/components/molecules/ExercicioDetalheModal'
import { VideoUploadModal } from '@/components/molecules/VideoUploadModal/VideoUploadModal'
import type {
    ExercicioBiblioteca,
    FiltroBiblioteca,
    GrupoMuscular,
    NivelExercicio,
} from '@/types/exercicio-biblioteca'
import {
    GRUPO_MUSCULAR_CONFIG,
    NIVEL_CONFIG,
} from '@/types/exercicio-biblioteca'

interface BibliotecaExerciciosPageProps {
    onBack?: () => void
    /** Quando true, habilita funcionalidades de gestão (upload, editar, excluir) — apenas para GOD */
    isGod?: boolean
}

const GRUPOS: GrupoMuscular[] = ['peito', 'costas', 'ombro', 'braco', 'perna', 'gluteo', 'abdomen', 'cardio']

export function BibliotecaExerciciosPage({ onBack, isGod = false }: BibliotecaExerciciosPageProps) {
    const [exercicios, setExercicios] = useState<ExercicioBiblioteca[]>([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({ total: 0, comVideo: 0, emBreve: 0 })

    const [busca, setBusca] = useState('')
    const [buscaAtiva, setBuscaAtiva] = useState('')
    const [grupoAtivo, setGrupoAtivo] = useState<GrupoMuscular | undefined>()
    const [nivelAtivo, setNivelAtivo] = useState<NivelExercicio | undefined>()

    const [exercicioSelecionado, setExercicioSelecionado] = useState<ExercicioBiblioteca | null>(null)
    const [exercicioEditVideo, setExercicioEditVideo] = useState<ExercicioBiblioteca | null>(null)

    // ===== Carrega exercícios =====
    const carregarExercicios = useCallback(async () => {
        setLoading(true)
        const filtro: FiltroBiblioteca = {
            grupo: grupoAtivo,
            nivel: nivelAtivo,
            busca: buscaAtiva || undefined,
        }
        const data = await exercicioBibliotecaService.buscar(filtro)
        setExercicios(data)
        setLoading(false)
    }, [grupoAtivo, nivelAtivo, buscaAtiva])

    // Carrega stats uma vez
    useEffect(() => {
        exercicioBibliotecaService.stats().then(setStats)
    }, [])

    useEffect(() => {
        carregarExercicios()
    }, [carregarExercicios])

    const handleBuscar = (e: React.FormEvent) => {
        e.preventDefault()
        setBuscaAtiva(busca)
    }

    const limparFiltros = () => {
        setBusca('')
        setBuscaAtiva('')
        setGrupoAtivo(undefined)
        setNivelAtivo(undefined)
    }

    const handleVideoSalvo = useCallback(() => {
        carregarExercicios()
        exercicioBibliotecaService.stats().then(setStats)
    }, [carregarExercicios])

    const temFiltroAtivo = grupoAtivo || nivelAtivo || buscaAtiva

    // Agrupar exercícios por grupo muscular
    const exerciciosPorGrupo = React.useMemo(() => {
        if (grupoAtivo) {
            return { [grupoAtivo]: exercicios }
        }
        return exercicios.reduce<Record<string, ExercicioBiblioteca[]>>((acc, ex) => {
            const grupo = ex.grupo_muscular
            if (!acc[grupo]) acc[grupo] = []
            acc[grupo].push(ex)
            return acc
        }, {})
    }, [exercicios, grupoAtivo])

    return (
        <div className="flex-1 p-4 md:p-8 flex flex-col w-full">
            <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-10 flex-1 w-full">

                {/* Header */}
                <div className="flex items-center gap-4 animate-fade-in-up">
                    {onBack && (
                        <button
                            onClick={onBack}
                            id="btn-voltar-biblioteca"
                            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${isGod
                                ? 'bg-amber-500/10 border-amber-500/20'
                                : 'bg-indigo-500/10 border-indigo-500/20'
                                }`}>
                                <Video size={20} className={isGod ? 'text-amber-400' : 'text-indigo-400'} />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">
                                    Biblioteca de Exercícios
                                </h1>
                                <p className="text-gray-400 mt-0.5 font-light text-sm">
                                    {stats.total} exercícios · {stats.comVideo} com vídeo · {stats.emBreve} em breve
                                    {isGod && <span className="ml-2 text-amber-400/60 text-[10px] font-bold uppercase">· Modo GOD</span>}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-px w-full bg-white/10" />

                {/* Busca */}
                <form onSubmit={handleBuscar} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            id="input-busca-exercicio"
                            type="text"
                            value={busca}
                            onChange={e => setBusca(e.target.value)}
                            placeholder="Buscar exercício por nome..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2.5 bg-indigo-600/80 hover:bg-indigo-600 rounded-lg text-sm font-bold text-white transition-colors"
                    >
                        Buscar
                    </button>
                    {temFiltroAtivo && (
                        <button
                            type="button"
                            onClick={limparFiltros}
                            className="px-3 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 border border-white/10"
                        >
                            <X size={14} />
                            Limpar
                        </button>
                    )}
                </form>

                {/* Filtros por grupo muscular */}
                <div className="flex gap-2 flex-wrap">
                    <button
                        id="filtro-grupo-todos"
                        onClick={() => setGrupoAtivo(undefined)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${!grupoAtivo
                            ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                            : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20 hover:text-white'
                            }`}
                    >
                        Todos
                    </button>
                    {GRUPOS.map(grupo => {
                        const config = GRUPO_MUSCULAR_CONFIG[grupo]
                        return (
                            <button
                                key={grupo}
                                id={`filtro-grupo-${grupo}`}
                                onClick={() => setGrupoAtivo(grupoAtivo === grupo ? undefined : grupo)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border flex items-center gap-1.5 ${grupoAtivo === grupo
                                    ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                                    : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20 hover:text-white'
                                    }`}
                            >
                                <span>{config.emoji}</span>
                                {config.label}
                            </button>
                        )
                    })}
                </div>

                {/* Filtros secundários: nível */}
                <div className="flex gap-2">
                    <span className="text-xs text-gray-600 self-center uppercase tracking-wider font-bold">Nível:</span>
                    {(['iniciante', 'intermediario', 'avancado'] as NivelExercicio[]).map(nivel => {
                        const config = NIVEL_CONFIG[nivel]
                        return (
                            <button
                                key={nivel}
                                id={`filtro-nivel-${nivel}`}
                                onClick={() => setNivelAtivo(nivelAtivo === nivel ? undefined : nivel)}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${nivelAtivo === nivel
                                    ? nivel === 'iniciante'
                                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                        : nivel === 'intermediario'
                                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                                    : 'bg-white/5 text-gray-500 border-white/10 hover:text-white hover:border-white/20'
                                    }`}
                            >
                                {config.label}
                            </button>
                        )
                    })}
                </div>

                {/* Conteúdo */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-48 gap-3">
                        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-gray-500">Carregando exercícios...</p>
                    </div>
                ) : exercicios.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                            <Dumbbell size={28} className="text-gray-600" />
                        </div>
                        <div>
                            <p className="text-base font-medium text-gray-400">Nenhum exercício encontrado</p>
                            <p className="text-sm text-gray-600 mt-1">Tente ajustar os filtros de busca.</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {(Object.entries(exerciciosPorGrupo) as [string, ExercicioBiblioteca[]][]).map(([grupo, listaExercicios]) => {
                            const config = GRUPO_MUSCULAR_CONFIG[grupo as GrupoMuscular]
                            return (
                                <section key={grupo}>
                                    {/* Título do grupo */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-lg">{config?.emoji}</span>
                                        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                                            {config?.label}
                                        </h2>
                                        <span className="text-xs text-gray-600 ml-1">
                                            ({listaExercicios.length})
                                        </span>
                                    </div>

                                    {/* Grid de cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                        {listaExercicios.map((ex: ExercicioBiblioteca) => (
                                            <ExercicioCard
                                                key={ex.id}
                                                exercicio={ex}
                                                isGod={isGod}
                                                onClick={() => setExercicioSelecionado(ex)}
                                                onEditVideo={() => setExercicioEditVideo(ex)}
                                            />
                                        ))}
                                    </div>
                                </section>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Modal de detalhes */}
            {exercicioSelecionado && (
                <ExercicioDetalheModal
                    exercicio={exercicioSelecionado}
                    onFechar={() => setExercicioSelecionado(null)}
                />
            )}

            {/* Modal de upload de vídeo (GOD) */}
            {exercicioEditVideo && isGod && (
                <VideoUploadModal
                    exercicio={exercicioEditVideo}
                    onFechar={() => setExercicioEditVideo(null)}
                    onSalvo={handleVideoSalvo}
                />
            )}
        </div>
    )
}

// ===== Sub-componente: Card de Exercício =====

interface ExercicioCardProps {
    exercicio: ExercicioBiblioteca
    isGod?: boolean
    onClick: () => void
    onEditVideo?: () => void
}

const ExercicioCard: React.FC<ExercicioCardProps> = ({ exercicio, isGod = false, onClick, onEditVideo }) => {
    const nivelConfig = NIVEL_CONFIG[exercicio.nivel]
    const temVideo = !!exercicio.url_video && !exercicio.em_breve

    return (
        <div className="group relative w-full text-left bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 rounded-xl transition-all duration-200">
            <button
                id={`exercicio-card-${exercicio.id}`}
                onClick={onClick}
                className="w-full text-left p-4 flex flex-col gap-3"
            >
                {/* Thumbnail ou placeholder */}
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-white/[0.03]">
                    {(() => {
                        // Tentar thumbnail_url salva, ou gerar do YouTube
                        let thumbSrc = exercicio.thumbnail_url || ''
                        if (!thumbSrc && exercicio.url_video) {
                            const match = exercicio.url_video.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/)
                            if (match) thumbSrc = `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
                        }
                        return thumbSrc ? (
                            <img
                                src={thumbSrc}
                                alt={exercicio.nome}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Video size={24} className="text-gray-700" />
                            </div>
                        )
                    })()}

                    {/* Badge em breve */}
                    {exercicio.em_breve && (
                        <div className="absolute top-2 right-2">
                            <span className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-[10px] font-bold text-indigo-400 backdrop-blur-sm">
                                Em breve
                            </span>
                        </div>
                    )}

                    {/* Badge com vídeo (GOD mode) */}
                    {isGod && temVideo && (
                        <div className="absolute top-2 left-2">
                            <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-[10px] font-bold text-emerald-400 backdrop-blur-sm">
                                ✓ Vídeo
                            </span>
                        </div>
                    )}

                    {/* Ícone de play (quando tem vídeo) */}
                    {!exercicio.em_breve && exercicio.url_video && (
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <Video size={16} className="text-white" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Informações */}
                <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-bold text-white leading-tight group-hover:text-indigo-300 transition-colors">
                        {exercicio.nome}
                    </p>
                    {exercicio.descricao && (
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                            {exercicio.descricao}
                        </p>
                    )}
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${exercicio.nivel === 'iniciante'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : exercicio.nivel === 'intermediario'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>
                            {nivelConfig.label}
                        </span>
                        {exercicio.equipamento && (
                            <span className="px-2 py-0.5 rounded-full border border-white/10 text-[10px] text-gray-500 bg-white/5">
                                {exercicio.equipamento.replace('_', ' ')}
                            </span>
                        )}
                    </div>
                </div>
            </button>

            {/* GOD: Botão de upload/editar vídeo */}
            {isGod && onEditVideo && (
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onEditVideo()
                    }}
                    title={temVideo ? 'Editar vídeo' : 'Adicionar vídeo'}
                    className={`absolute bottom-3 right-3 p-2 rounded-lg transition-all z-10 ${temVideo
                        ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20'
                        : 'bg-white/5 text-gray-500 hover:text-amber-400 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/20'
                        }`}
                >
                    {temVideo ? <Pencil size={14} /> : <Upload size={14} />}
                </button>
            )}
        </div>
    )
}
