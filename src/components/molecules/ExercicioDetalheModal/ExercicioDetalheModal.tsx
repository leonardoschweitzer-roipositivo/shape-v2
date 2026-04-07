/**
 * ExercicioDetalheModal — Modal de detalhes de um exercício da biblioteca
 *
 * Exibe vídeo (quando disponível) ou tela "em breve",
 * instruções passo a passo, dicas e erros comuns.
 */

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Play, Video, AlertCircle, CheckCircle, Lightbulb, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { ExercicioBiblioteca } from '@/types/exercicio-biblioteca'
import { GRUPO_MUSCULAR_CONFIG, NIVEL_CONFIG, EQUIPAMENTO_CONFIG } from '@/types/exercicio-biblioteca'

interface InstrucoesGeradas {
    instrucoes: string[]
    dicas: string[]
    erros_comuns: string[]
}

async function gerarInstrucoesIA(nome: string, grupoMuscular: string): Promise<InstrucoesGeradas | null> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) return null
    const ai = new GoogleGenerativeAI(apiKey)
    const model = ai.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: { maxOutputTokens: 512, temperature: 0.5, responseMimeType: 'application/json' },
    })
    const prompt = `Você é um personal trainer expert. Para o exercício "${nome}" (grupo muscular: ${grupoMuscular}), retorne um JSON com exatamente este formato:
{
  "instrucoes": ["passo 1", "passo 2", "passo 3", "passo 4", "passo 5"],
  "dicas": ["dica 1", "dica 2", "dica 3"],
  "erros_comuns": ["erro 1", "erro 2", "erro 3"]
}
Seja direto e técnico. Máximo 1 frase por item. Responda apenas o JSON.`
    try {
        const result = await model.generateContent(prompt)
        const text = result.response.text().trim()
        const json = JSON.parse(text.replace(/```json\n?|```/g, ''))
        return json as InstrucoesGeradas
    } catch {
        return null
    }
}

interface ExercicioDetalheModalProps {
    exercicio: ExercicioBiblioteca
    onFechar: () => void
}

export function ExercicioDetalheModal({ exercicio, onFechar }: ExercicioDetalheModalProps) {
    const [videoAberto, setVideoAberto] = useState(false)
    const [secaoAberta, setSecaoAberta] = useState<'instrucoes' | 'dicas' | 'erros' | null>('instrucoes')
    const [instrucoesIA, setInstrucoesIA] = useState<InstrucoesGeradas | null>(null)
    const [gerandoInstrucoes, setGerandoInstrucoes] = useState(false)

    const temInstrucoesOriginais =
        (exercicio.instrucoes && exercicio.instrucoes.length > 0) ||
        (exercicio.dicas && exercicio.dicas.length > 0) ||
        (exercicio.erros_comuns && exercicio.erros_comuns.length > 0)

    // Gera instruções via IA quando o modal abre e o exercício não tem dados técnicos
    useEffect(() => {
        if (temInstrucoesOriginais) return
        setGerandoInstrucoes(true)
        const grupoConfig = GRUPO_MUSCULAR_CONFIG[exercicio.grupo_muscular]
        gerarInstrucoesIA(exercicio.nome, grupoConfig?.label ?? exercicio.grupo_muscular).then(resultado => {
            if (resultado) setInstrucoesIA(resultado)
        }).finally(() => setGerandoInstrucoes(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [exercicio.nome])

    const instrucoes = exercicio.instrucoes?.length ? exercicio.instrucoes : (instrucoesIA?.instrucoes ?? [])
    const dicas = exercicio.dicas?.length ? exercicio.dicas : (instrucoesIA?.dicas ?? [])
    const erros = exercicio.erros_comuns?.length ? exercicio.erros_comuns : (instrucoesIA?.erros_comuns ?? [])

    const grupoConfig = GRUPO_MUSCULAR_CONFIG[exercicio.grupo_muscular]
    const nivelConfig = NIVEL_CONFIG[exercicio.nivel]
    const equipConfig = exercicio.equipamento ? EQUIPAMENTO_CONFIG[exercicio.equipamento] : null

    // Trava o scroll do body quando o modal está aberto
    useEffect(() => {
        const originalOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = originalOverflow
        }
    }, [])

    // Converte URL do YouTube para embed
    const getYouTubeEmbedUrl = (url: string): string => {
        const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/)
        if (match) {
            // controls=0: esconde controles
            // modestbranding=1: reduz logo (em 2024+ é menos eficaz, mas ajuda)
            // rel=0: apenas vídeos do mesmo canal ao pausar
            // iv_load_policy=3: esconde anotações
            // mute=1 & autoplay=1: necessário para autoplay funcionar em todos browsers
            // loop=1 & playlist=ID: necessário para loop funcionar no embed
            return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&loop=1&playlist=${match[1]}&showinfo=0`
        }
        return url
    }

    const modalContent = (
        <div
            className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85"
            style={{
                WebkitBackdropFilter: 'blur(8px)',
                backdropFilter: 'blur(8px)',
                height: '100dvh',
            }}
            onClick={onFechar}
        >
            <div
                className="bg-surface-deep border border-white/10 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300"
                style={{
                    maxHeight: '85dvh',
                    WebkitOverflowScrolling: 'touch',
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-surface-deep border-b border-white/5 px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{grupoConfig?.emoji}</span>
                        <div>
                            <h2 className="text-base font-black text-white uppercase tracking-wide leading-tight">
                                {exercicio.nome}
                            </h2>
                            {exercicio.nome_alternativo && (
                                <p className="text-xs text-gray-500 mt-0.5">{exercicio.nome_alternativo}</p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onFechar}
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors flex-shrink-0"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Tags */}
                <div className="px-5 py-3 flex flex-wrap gap-2 border-b border-white/5">
                    {/* Grupo muscular */}
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20`}>
                        {grupoConfig?.emoji} {grupoConfig?.label}
                    </span>

                    {/* Nível */}
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${exercicio.nivel === 'iniciante'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : exercicio.nivel === 'intermediario'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                        {nivelConfig?.label}
                    </span>

                    {/* Equipamento */}
                    {equipConfig && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/5 text-gray-400 border border-white/10">
                            {equipConfig.emoji} {equipConfig.label}
                        </span>
                    )}
                </div>

                {/* Área de Vídeo */}
                <div className="px-5 pt-4 pb-2">
                    {exercicio.em_breve || !exercicio.url_video ? (
                        /* Estado: Em Breve */
                        <div className="relative w-full aspect-video rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-white/5 flex flex-col items-center justify-center gap-3 overflow-hidden">
                            {/* Fundo decorativo */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-indigo-500 blur-3xl" />
                            </div>
                            <div className="relative z-10 flex flex-col items-center gap-2 text-center px-4">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                    <Video size={24} className="text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Vídeo em breve</p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Estamos produzindo os vídeos demonstrativos 🎬
                                    </p>
                                </div>
                                <span className="mt-1 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                                    Em breve
                                </span>
                            </div>
                        </div>
                    ) : !videoAberto ? (
                        /* Thumbnail com botão de play */
                        <button
                            onClick={() => setVideoAberto(true)}
                            className="relative w-full aspect-video rounded-2xl overflow-hidden group"
                        >
                            {(() => {
                                let thumbSrc = exercicio.thumbnail_url || ''
                                if (!thumbSrc && exercicio.url_video) {
                                    const match = exercicio.url_video.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/)
                                    if (match) thumbSrc = `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
                                }
                                return thumbSrc ? (
                                    <img
                                        src={thumbSrc}
                                        alt={exercicio.nome}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-900/40 to-purple-900/40 flex items-center justify-center">
                                        <Video size={32} className="text-indigo-400" />
                                    </div>
                                )
                            })()}
                            {/* Overlay de play */}
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Play size={28} className="text-white ml-1" fill="white" />
                                </div>
                            </div>
                        </button>
                    ) : (
                        /* Player de vídeo — YouTube embed ou vídeo nativo */
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
                            {exercicio.url_video.includes('youtube') || exercicio.url_video.includes('youtu.be') ? (
                                <iframe
                                    src={getYouTubeEmbedUrl(exercicio.url_video)}
                                    // Técnica de Clipping: iframe maior que o container para esconder bordas (título e logo)
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[140%] pointer-events-none"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    title={exercicio.nome}
                                />
                            ) : (
                                <video
                                    src={exercicio.url_video}
                                    controls
                                    autoPlay
                                    className="w-full h-full object-contain"
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* Descrição */}
                {exercicio.descricao && (
                    <div className="px-5 py-3">
                        <p className="text-sm text-gray-400 leading-relaxed">{exercicio.descricao}</p>
                    </div>
                )}

                {/* Seções expansíveis */}
                <div className="px-5 pb-24 sm:pb-5 space-y-2">

                    {/* Loading state */}
                    {gerandoInstrucoes && (
                        <div className="bg-white/[0.02] rounded-xl border border-white/5 p-5 flex flex-col items-center gap-3">
                            <Loader2 size={22} className="text-indigo-400 animate-spin" />
                            <p className="text-xs text-gray-500">Gerando instruções com IA...</p>
                        </div>
                    )}

                    {/* Instruções */}
                    {instrucoes.length > 0 && (
                        <div className="bg-white/[0.03] rounded-xl border border-white/5 overflow-hidden">
                            <button
                                onClick={() => setSecaoAberta(secaoAberta === 'instrucoes' ? null : 'instrucoes')}
                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <CheckCircle size={15} className="text-emerald-400 flex-shrink-0" />
                                    <span className="text-sm font-bold text-white">Passo a Passo</span>
                                    <span className="text-xs text-gray-600">({instrucoes.length} passos)</span>
                                </div>
                                {secaoAberta === 'instrucoes'
                                    ? <ChevronUp size={16} className="text-gray-500" />
                                    : <ChevronDown size={16} className="text-gray-500" />
                                }
                            </button>
                            {secaoAberta === 'instrucoes' && (
                                <div className="px-4 pb-4 space-y-2 border-t border-white/5 pt-3">
                                    {instrucoes.map((instrucao, i) => (
                                        <div key={i} className="flex gap-3">
                                            <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                                {i + 1}
                                            </span>
                                            <p className="text-sm text-gray-300 leading-relaxed">{instrucao}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Dicas */}
                    {dicas.length > 0 && (
                        <div className="bg-white/[0.03] rounded-xl border border-white/5 overflow-hidden">
                            <button
                                onClick={() => setSecaoAberta(secaoAberta === 'dicas' ? null : 'dicas')}
                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Lightbulb size={15} className="text-amber-400 flex-shrink-0" />
                                    <span className="text-sm font-bold text-white">Dicas de Execução</span>
                                </div>
                                {secaoAberta === 'dicas'
                                    ? <ChevronUp size={16} className="text-gray-500" />
                                    : <ChevronDown size={16} className="text-gray-500" />
                                }
                            </button>
                            {secaoAberta === 'dicas' && (
                                <div className="px-4 pb-4 space-y-2 border-t border-white/5 pt-3">
                                    {dicas.map((dica, i) => (
                                        <div key={i} className="flex gap-3">
                                            <span className="text-amber-400 mt-0.5 flex-shrink-0">💡</span>
                                            <p className="text-sm text-gray-300 leading-relaxed">{dica}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Erros comuns */}
                    {erros.length > 0 && (
                        <div className="bg-white/[0.03] rounded-xl border border-white/5 overflow-hidden">
                            <button
                                onClick={() => setSecaoAberta(secaoAberta === 'erros' ? null : 'erros')}
                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
                                    <span className="text-sm font-bold text-white">Erros Comuns</span>
                                    <span className="text-xs text-gray-600">(evite!)</span>
                                </div>
                                {secaoAberta === 'erros'
                                    ? <ChevronUp size={16} className="text-gray-500" />
                                    : <ChevronDown size={16} className="text-gray-500" />
                                }
                            </button>
                            {secaoAberta === 'erros' && (
                                <div className="px-4 pb-4 space-y-2 border-t border-white/5 pt-3">
                                    {erros.map((erro, i) => (
                                        <div key={i} className="flex gap-3">
                                            <span className="text-red-400 mt-0.5 flex-shrink-0">⚠️</span>
                                            <p className="text-sm text-gray-300 leading-relaxed">{erro}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

    return createPortal(modalContent, document.body)
}
