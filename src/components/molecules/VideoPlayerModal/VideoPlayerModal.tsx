/**
 * VideoPlayerModal — Modal reutilizável para reprodução de vídeo do YouTube
 *
 * Usado no Portal do Atleta e na Biblioteca de Exercícios.
 * Suporta links do YouTube com player limpo (sem branding, sem sugestões).
 */

import React, { useEffect } from 'react'
import { X, ExternalLink } from 'lucide-react'

interface VideoPlayerModalProps {
    /** URL do vídeo do YouTube */
    urlVideo: string
    /** Título do exercício (exibido no header do modal) */
    titulo: string
    /** Callback ao fechar o modal */
    onFechar: () => void
}

/**
 * Extrai o videoId de uma URL do YouTube.
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

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ urlVideo, titulo, onFechar }) => {
    const videoId = extrairYouTubeId(urlVideo)

    // Fechar com ESC
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onFechar() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onFechar])

    if (!videoId) {
        return null
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&autoplay=1`

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(e) => e.target === e.currentTarget && onFechar()}
        >
            <div className="w-full max-w-3xl bg-[#0B101D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                    <h3 className="text-sm font-bold text-white truncate pr-4">{titulo}</h3>
                    <button
                        onClick={onFechar}
                        className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors flex-shrink-0"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Video */}
                <div className="relative w-full aspect-video bg-black">
                    <iframe
                        src={embedUrl}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={titulo}
                    />
                </div>
            </div>
        </div>
    )
}
