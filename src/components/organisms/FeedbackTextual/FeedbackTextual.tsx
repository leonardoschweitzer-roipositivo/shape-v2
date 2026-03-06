/**
 * FeedbackTextual — Campo de relato diário do atleta
 *
 * Abaixo dos TrackersRápidos na tela HOJE.
 * Permite ao aluno escrever como está se sentindo (sono, dieta, disposição, etc.)
 * Salva como registro diário tipo 'feedback' na tabela registros_diarios.
 * Se o texto contiver palavras-chave de alerta (dor, lesão, etc.), notifica o personal.
 */

import React, { useState } from 'react'
import { Send, Loader2, CheckCircle2, MessageSquare } from 'lucide-react'
import { registrarTracker } from '@/services/portalDataService'

interface FeedbackTextualProps {
    atletaId: string
    personalId?: string
}

/** Palavras-chave que disparam notificação urgente ao personal */
const KEYWORDS_ALERTA = [
    'dor', 'lesão', 'lesao', 'machucado', 'machuc',
    'cirurgia', 'hospital', 'pronto-socorro',
    'tontura', 'desmai', 'vômito', 'vomit',
    'febre', 'infecç', 'inflamaç',
]

function textoTemAlerta(texto: string): boolean {
    const lower = texto.toLowerCase()
    return KEYWORDS_ALERTA.some(kw => lower.includes(kw))
}

export function FeedbackTextual({ atletaId, personalId }: FeedbackTextualProps) {
    const [texto, setTexto] = useState('')
    const [enviando, setEnviando] = useState(false)
    const [enviado, setEnviado] = useState(false)

    const handleEnviar = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!texto.trim()) return
        setEnviando(true)

        const ehAlerta = textoTemAlerta(texto)

        await registrarTracker(atletaId, 'feedback', {
            texto: texto.trim(),
            alerta: ehAlerta,
        })

        // Notificar o personal em todo feedback (com flag de alerta se necessário)
        try {
            const { onFeedbackTreino } = await import('@/services/notificacaoTriggers')
            await onFeedbackTreino(atletaId, {
                texto: texto.trim(),
                alerta: ehAlerta,
                personalId
            })
        } catch (err) {
            console.warn('[FeedbackTextual] Erro ao notificar personal:', err)
        }

        setEnviando(false)
        setEnviado(true)
        setTexto('')

        // Reset o estado de sucesso após 3s
        setTimeout(() => setEnviado(false), 3000)
    }

    return (
        <div className="bg-surface-deep rounded-2xl p-5 border border-white/5">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
                <MessageSquare size={14} className="text-indigo-400" />
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Feedback sobre o Treino
                </h3>
            </div>

            {/* Input + Botão */}
            <form onSubmit={handleEnviar} className="flex gap-2">
                <textarea
                    value={texto}
                    onChange={e => setTexto(e.target.value)}
                    placeholder="Dormi mal, estou com dor no joelho, dieta em dia..."
                    rows={2}
                    disabled={enviando}
                    className="flex-1 bg-white/[0.03] text-white text-sm rounded-xl border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 outline-none p-3 resize-none placeholder-gray-600 transition-all font-light leading-relaxed disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={!texto.trim() || enviando}
                    className={`self-end px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${enviado
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                        : texto.trim()
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 active:scale-95'
                            : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
                        }`}
                >
                    {enviando ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : enviado ? (
                        <CheckCircle2 size={14} />
                    ) : (
                        <Send size={14} />
                    )}
                </button>
            </form>

            {/* Mensagem de sucesso */}
            {enviado && (
                <p className="text-[10px] text-emerald-400/70 mt-2 text-center animate-in fade-in duration-300">
                    ✅ Feedback enviado! Seu Personal pode ver.
                </p>
            )}
        </div>
    )
}
