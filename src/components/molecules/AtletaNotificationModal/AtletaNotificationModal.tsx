/**
 * AtletaNotificationModal — Modal de detalhes da notificação no Portal do Aluno
 *
 * Mostra a notificação completa e a thread de comentários
 * permitindo ao atleta responder ao personal.
 */

import React, { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import {
    X,
    MessageSquare,
    FileEdit,
    Bell,
    Send,
    User,
    Dumbbell,
} from 'lucide-react'
import type { Notificacao } from '@/types/notificacao.types'
import { comentarioService, type Comentario } from '@/services/comentario.service'

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface AtletaNotificationModalProps {
    notificacao: Notificacao
    atletaId: string
    onFechar: () => void
}

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

function getModalIcon(tipo: string): React.ReactNode {
    switch (tipo) {
        case 'TREINO_EDITADO':
            return <FileEdit size={24} className="text-indigo-400" />
        case 'RESPOSTA_PERSONAL':
            return <MessageSquare size={24} className="text-emerald-400" />
        case 'MENSAGEM_PERSONAL':
            return <MessageSquare size={24} className="text-sky-400" />
        default:
            return <Bell size={24} className="text-gray-400" />
    }
}

function getCorTipo(tipo: string): string {
    switch (tipo) {
        case 'TREINO_EDITADO': return '#6366F1'
        case 'RESPOSTA_PERSONAL': return '#10B981'
        case 'MENSAGEM_PERSONAL': return '#0EA5E9'
        default: return '#6B7280'
    }
}

function getLabelTipo(tipo: string): string {
    switch (tipo) {
        case 'TREINO_EDITADO': return 'Treino Editado'
        case 'RESPOSTA_PERSONAL': return 'Resposta'
        case 'MENSAGEM_PERSONAL': return 'Mensagem'
        default: return 'Notificação'
    }
}

function stripHtml(html: string): string {
    return html.replace(/<[^>]+>/g, '')
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

export function AtletaNotificationModal({ notificacao, atletaId, onFechar }: AtletaNotificationModalProps) {
    const [comentarios, setComentarios] = useState<Comentario[]>([])
    const [novoComentario, setNovoComentario] = useState('')
    const [enviando, setEnviando] = useState(false)
    const [carregando, setCarregando] = useState(false)

    const corTipo = getCorTipo(notificacao.tipo)

    // Trava scroll do body
    useEffect(() => {
        const original = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = original }
    }, [])

    // Carregar comentários
    useEffect(() => {
        setCarregando(true)
        comentarioService.listar(notificacao.id).then(data => {
            setComentarios(data)
            setCarregando(false)
        })
    }, [notificacao.id])

    // Enviar resposta
    const handleEnviar = useCallback(async () => {
        if (!novoComentario.trim() || enviando) return
        setEnviando(true)

        const criado = await comentarioService.criar({
            notificacao_id: notificacao.id,
            autor_id: atletaId,
            autor_tipo: 'atleta',
            mensagem: novoComentario.trim(),
        })

        if (criado) {
            setComentarios(prev => [...prev, criado])
            setNovoComentario('')
        }
        setEnviando(false)
    }, [novoComentario, atletaId, notificacao.id, enviando])

    // ─── Dados contextuais ──────────────────────────────
    const dados = notificacao.dados || {}

    const renderDadosContextuais = () => {
        switch (notificacao.tipo) {
            case 'TREINO_EDITADO':
                return (
                    <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-4 flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                            <Dumbbell size={18} className="text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Treino Atualizado</p>
                            <p className="text-sm text-gray-300 mt-1 leading-relaxed">
                                {String(dados.descricao || 'Seu personal fez alterações no seu treino. Confira na próxima sessão!')}
                            </p>
                        </div>
                    </div>
                )

            case 'RESPOSTA_PERSONAL':
                return (
                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 relative">
                        <MessageSquare className="absolute -top-3 -left-2 text-emerald-500 opacity-15" size={40} />
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 relative z-10">
                            Resposta do Personal
                        </p>
                        <p className="text-sm text-gray-200 leading-relaxed italic relative z-10">
                            "{String(dados.mensagemCompleta || notificacao.mensagem)}"
                        </p>
                    </div>
                )

            default:
                return (
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                        <p className="text-sm text-gray-400 italic text-center">
                            {notificacao.mensagem}
                        </p>
                    </div>
                )
        }
    }

    // ═══════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════

    const modalContent = (
        <div
            className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/85 backdrop-blur-md animate-fade-in"
            onClick={onFechar}
        >
            <div
                className="bg-surface-deep border border-white/10 rounded-t-3xl w-full max-h-[85dvh] overflow-hidden shadow-2xl animate-slide-up flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Barra de cor */}
                <div className="h-1.5 w-full" style={{ backgroundColor: corTipo }} />

                {/* Handle de arraste visual */}
                <div className="flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 rounded-full bg-white/10" />
                </div>

                {/* Header */}
                <div className="px-5 pt-2 pb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center"
                            style={{ backgroundColor: `${corTipo}15`, border: `1px solid ${corTipo}30` }}
                        >
                            {getModalIcon(notificacao.tipo)}
                        </div>
                        <div>
                            <h3 className="text-base font-black text-white tracking-tight leading-tight">
                                {stripHtml(notificacao.titulo)}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span
                                    className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md"
                                    style={{ backgroundColor: `${corTipo}15`, color: corTipo, border: `1px solid ${corTipo}30` }}
                                >
                                    {getLabelTipo(notificacao.tipo)}
                                </span>
                                <span className="text-[9px] text-gray-600 font-medium">
                                    {new Date(notificacao.created_at).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onFechar}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto px-5 pb-4">
                    {/* Dados contextuais */}
                    <div className="mb-5">
                        {renderDadosContextuais()}
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full bg-white/5 mb-4" />

                    {/* Seção de Comentários */}
                    <div>
                        <h5 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <MessageSquare size={12} />
                            Conversa
                            {comentarios.length > 0 && (
                                <span className="bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded text-[9px]">
                                    {comentarios.length}
                                </span>
                            )}
                        </h5>

                        {carregando ? (
                            <p className="text-zinc-600 text-xs text-center py-4">Carregando...</p>
                        ) : comentarios.length > 0 ? (
                            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                                {comentarios.map(c => (
                                    <div
                                        key={c.id}
                                        className={`rounded-2xl p-3 max-w-[85%] ${c.autor_tipo === 'personal'
                                                ? 'bg-emerald-500/5 border border-emerald-500/10 mr-auto'
                                                : 'bg-indigo-500/5 border border-indigo-500/10 ml-auto'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${c.autor_tipo === 'personal' ? 'text-emerald-400' : 'text-indigo-400'
                                                }`}>
                                                {c.autor_tipo === 'personal' ? 'Personal' : 'Você'}
                                            </span>
                                            <span className="text-[9px] text-zinc-600 font-medium">
                                                {new Date(c.created_at).toLocaleDateString('pt-BR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-zinc-300 leading-relaxed">{c.mensagem}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-zinc-600 text-[10px] text-center py-3 mb-3">
                                Nenhuma mensagem ainda. Escreva para seu personal!
                            </p>
                        )}
                    </div>
                </div>

                {/* Input de resposta — fixo no rodapé */}
                <div className="p-4 bg-white/[0.02] border-t border-white/5 safe-area-inset-bottom">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={novoComentario}
                            onChange={e => setNovoComentario(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleEnviar()}
                            placeholder="Responder ao personal..."
                            className="flex-1 bg-background-dark text-white text-sm placeholder-zinc-700 rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:border-indigo-500/30 transition-all"
                        />
                        <button
                            onClick={handleEnviar}
                            disabled={!novoComentario.trim() || enviando}
                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-95 ${!novoComentario.trim() || enviando
                                    ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                                    : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                }`}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

    return createPortal(modalContent, document.body)
}
