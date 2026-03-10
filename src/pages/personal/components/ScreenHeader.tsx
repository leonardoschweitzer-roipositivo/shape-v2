/**
 * ScreenHeader — Cabeçalho padronizado para todas as telas do Portal do Personal
 *
 * Padrão: Ícone indigo + Título + Subtítulo + Linha divisória suave + Botão opcional à direita
 * Variante com botão Voltar para sub-telas.
 */

import React from 'react'
import { ChevronLeft } from 'lucide-react'

interface ScreenHeaderProps {
    /** Ícone Lucide à esquerda do título */
    icon: React.ReactNode
    /** Título principal */
    titulo: string
    /** Subtítulo opcional (ex.: contagem, status) */
    subtitulo?: string
    /** Se true, mostra botão voltar; requer onVoltar */
    comVoltar?: boolean
    onVoltar?: () => void
    /** Conteúdo à direita (botão, badge, etc.) */
    rightContent?: React.ReactNode
}

export function ScreenHeader({
    icon,
    titulo,
    subtitulo,
    comVoltar = false,
    onVoltar,
    rightContent,
}: ScreenHeaderProps) {
    return (
        <div className="mb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {comVoltar && onVoltar ? (
                        <button
                            onClick={onVoltar}
                            className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 active:scale-95 transition-transform shrink-0"
                        >
                            <ChevronLeft size={18} className="text-zinc-400" />
                        </button>
                    ) : (
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                            {icon}
                        </div>
                    )}
                    <div>
                        <h1 className="text-white text-xl font-black tracking-tight uppercase leading-tight">
                            {titulo}
                        </h1>
                        {subtitulo && (
                            <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-[0.2em] mt-0.5">
                                {subtitulo}
                            </p>
                        )}
                    </div>
                </div>
                {rightContent && (
                    <div className="shrink-0">{rightContent}</div>
                )}
            </div>
            {/* Linha divisória suave */}
            <div className="h-px w-full bg-white/[0.04] mt-4" />
        </div>
    )
}
