/**
 * AudioInputButton — Botão de input por voz via Web Speech API
 * 
 * Usa SpeechRecognition para transcrever fala em texto (pt-BR).
 * Não renderiza se a API não é suportada pelo browser.
 * 
 * @example
 * <AudioInputButton onTranscript={(text) => appendToField(text)} />
 */

import React, { memo, useState, useCallback, useRef } from 'react'
import { Mic, MicOff } from 'lucide-react'

// ===== TYPES =====

interface AudioInputButtonProps {
    onTranscript: (text: string) => void
    lang?: string
}

// Web Speech API isn't in all TS libs — declare minimal interface
interface SpeechRecognitionInstance {
    lang: string
    interimResults: boolean
    continuous: boolean
    maxAlternatives: number
    onresult: ((event: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null
    onerror: ((event: { error: string }) => void) | null
    onend: (() => void) | null
    start: () => void
    stop: () => void
}

// ===== HELPERS =====

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionInstance) | null {
    const w = window as unknown as Record<string, unknown>
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition
    return SR ? (SR as new () => SpeechRecognitionInstance) : null
}

// ===== COMPONENT =====

export const AudioInputButton = memo(function AudioInputButton({
    onTranscript,
    lang = 'pt-BR',
}: AudioInputButtonProps) {
    const [isRecording, setIsRecording] = useState(false)
    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

    // Check browser support — hide button if not available
    const SRCtor = getSpeechRecognitionCtor()
    if (!SRCtor) return null

    const handleToggle = useCallback(() => {
        if (isRecording && recognitionRef.current) {
            recognitionRef.current.stop()
            setIsRecording(false)
            return
        }

        const Ctor = getSpeechRecognitionCtor()
        if (!Ctor) return

        const recognition = new Ctor()
        recognition.lang = lang
        recognition.interimResults = false
        recognition.continuous = false
        recognition.maxAlternatives = 1
        recognitionRef.current = recognition

        recognition.onresult = (event) => {
            const transcript = event.results[0]?.[0]?.transcript
            if (transcript) {
                onTranscript(transcript)
            }
        }

        recognition.onerror = (event) => {
            console.warn('[AudioInput] Speech recognition error:', event.error)
            setIsRecording(false)
        }

        recognition.onend = () => {
            setIsRecording(false)
        }

        try {
            recognition.start()
            setIsRecording(true)
        } catch (err) {
            console.warn('[AudioInput] Failed to start:', err)
            setIsRecording(false)
        }
    }, [isRecording, lang, onTranscript])

    return (
        <button
            type="button"
            onClick={handleToggle}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isRecording
                    ? 'bg-red-500/20 border border-red-500/40 text-red-400 animate-pulse'
                    : 'bg-white/5 border border-white/10 text-gray-500 hover:text-indigo-400 hover:border-indigo-500/30'
                }`}
            title={isRecording ? 'Parar gravação' : 'Falar para preencher'}
        >
            {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
        </button>
    )
})
