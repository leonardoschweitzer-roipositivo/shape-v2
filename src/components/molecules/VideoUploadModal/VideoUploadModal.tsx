/**
 * VideoUploadModal — Modal para o GOD adicionar/editar URL de vídeo de um exercício
 *
 * Suporta links do YouTube (não-listado).
 * Extrai automaticamente o videoId para embed e thumbnail.
 */

import React, { useState, useEffect, useCallback } from 'react'
import { X, Video, ExternalLink, Trash2, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { exercicioBibliotecaService } from '@/services/exercicioBiblioteca.service'
import type { ExercicioBiblioteca } from '@/types/exercicio-biblioteca'

interface VideoUploadModalProps {
    exercicio: ExercicioBiblioteca
    onFechar: () => void
    onSalvo: () => void
}

/**
 * Extrai o videoId de uma URL do YouTube.
 * Suporta: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID
 */
function extrairYouTubeId(url: string): string | null {
    if (!url) return null
    const patterns = [
        /youtu\.be\/([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    ]
    for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) return match[1]
    }
    return null
}

/**
 * Gera URL de embed sem branding para o YouTube.
 * modestbranding=1, rel=0 — sem sugestões e sem link externo.
 */
function gerarEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`
}

/**
 * Gera URL da thumbnail do YouTube (alta qualidade).
 */
function gerarThumbnailUrl(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}

export const VideoUploadModal: React.FC<VideoUploadModalProps> = ({ exercicio, onFechar, onSalvo }) => {
    const [urlVideo, setUrlVideo] = useState(exercicio.url_video || '')
    const [duracao, setDuracao] = useState(exercicio.duracao_video_seg?.toString() || '')
    const [salvando, setSalvando] = useState(false)
    const [removendo, setRemovendo] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [mensagem, setMensagem] = useState('')

    const videoId = extrairYouTubeId(urlVideo)
    const temVideo = !!exercicio.url_video

    // Fechar com ESC
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onFechar() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onFechar])

    const handleSalvar = useCallback(async () => {
        if (!videoId) {
            setStatus('error')
            setMensagem('URL do YouTube inválida. Cole um link válido.')
            return
        }

        setSalvando(true)
        setStatus('idle')

        const sucesso = await exercicioBibliotecaService.atualizarVideo(
            exercicio.id,
            urlVideo.trim(),
            duracao ? parseInt(duracao, 10) : undefined
        )

        if (sucesso) {
            setStatus('success')
            setMensagem('Vídeo salvo com sucesso!')
            setTimeout(() => {
                onSalvo()
                onFechar()
            }, 800)
        } else {
            setStatus('error')
            setMensagem('Erro ao salvar. Verifique as permissões (RLS).')
        }

        setSalvando(false)
    }, [videoId, urlVideo, duracao, exercicio.id, onSalvo, onFechar])

    const handleRemover = useCallback(async () => {
        if (!confirm('Tem certeza que deseja remover o vídeo deste exercício?')) return

        setRemovendo(true)
        const sucesso = await exercicioBibliotecaService.removerVideo(exercicio.id)

        if (sucesso) {
            setStatus('success')
            setMensagem('Vídeo removido.')
            setTimeout(() => {
                onSalvo()
                onFechar()
            }, 800)
        } else {
            setStatus('error')
            setMensagem('Erro ao remover. Verifique as permissões.')
        }

        setRemovendo(false)
    }, [exercicio.id, onSalvo, onFechar])

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(e) => e.target === e.currentTarget && onFechar()}
        >
            <div className="w-full max-w-lg bg-background-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                            <Video size={18} className="text-amber-400" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white">
                                {temVideo ? 'Editar Vídeo' : 'Adicionar Vídeo'}
                            </h2>
                            <p className="text-xs text-gray-500 truncate max-w-[280px]">{exercicio.nome}</p>
                        </div>
                    </div>
                    <button
                        onClick={onFechar}
                        className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-5">
                    {/* URL do YouTube */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            URL do YouTube (não-listado)
                        </label>
                        <input
                            type="url"
                            value={urlVideo}
                            onChange={(e) => {
                                setUrlVideo(e.target.value)
                                setStatus('idle')
                            }}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                        />
                    </div>

                    {/* Preview */}
                    {videoId && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                Preview
                                <span className="text-emerald-400 text-[10px] font-normal normal-case">✓ URL válida</span>
                            </label>
                            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-black">
                                <iframe
                                    src={gerarEmbedUrl(videoId)}
                                    className="absolute inset-0 w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title={`Preview: ${exercicio.nome}`}
                                />
                            </div>
                        </div>
                    )}

                    {/* Duração (opcional) */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Duração (segundos) <span className="text-gray-600 font-normal normal-case">— opcional</span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={duracao}
                            onChange={(e) => setDuracao(e.target.value)}
                            placeholder="Ex: 45"
                            className="w-32 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                        />
                    </div>

                    {/* Status message */}
                    {status !== 'idle' && (
                        <div className={`flex items-center gap-2 text-xs p-3 rounded-lg border ${status === 'success'
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                : 'bg-red-500/10 border-red-500/20 text-red-400'
                            }`}>
                            {status === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                            {mensagem}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-5 border-t border-white/5 bg-white/[0.02]">
                    <div>
                        {temVideo && (
                            <button
                                onClick={handleRemover}
                                disabled={removendo || salvando}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {removendo ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                Remover Vídeo
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onFechar}
                            className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSalvar}
                            disabled={!videoId || salvando || removendo}
                            className="px-5 py-2 bg-amber-600/80 hover:bg-amber-600 rounded-lg text-xs font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                        >
                            {salvando ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                            {salvando ? 'Salvando...' : 'Salvar Vídeo'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
