/**
 * useSpeechToText
 * 
 * Hook reutilizável para transcrição de voz usando Web Speech API nativa.
 * Funciona em Chrome/Edge (Chromium). Degrada graciosamente em outros browsers.
 * 
 * @example
 * // Uso básico
 * const { transcript, isListening, startListening, stopListening, isSupported } = useSpeechToText();
 * 
 * @example
 * // Com callback de resultado
 * const speech = useSpeechToText({
 *   language: 'pt-BR',
 *   onResult: (text) => setFieldValue(prev => prev + ' ' + text),
 * });
 */
import { useState, useCallback, useRef, useEffect } from 'react';

// ===== TYPES =====

interface UseSpeechToTextOptions {
    /** Idioma de reconhecimento (default: 'pt-BR') */
    language?: string;
    /** Se deve retornar resultados parciais enquanto fala (default: true) */
    interimResults?: boolean;
    /** Callback chamado quando um resultado final é obtido */
    onResult?: (transcript: string) => void;
    /** Callback chamado em caso de erro */
    onError?: (error: string) => void;
}

interface UseSpeechToTextReturn {
    /** Se o browser suporta Web Speech API */
    isSupported: boolean;
    /** Se está gravando/ouvindo */
    isListening: boolean;
    /** Texto transcrito (parcial ou final) */
    transcript: string;
    /** Inicia a gravação */
    startListening: () => void;
    /** Para a gravação */
    stopListening: () => void;
    /** Reseta o transcript */
    resetTranscript: () => void;
}

// ===== SPEECH API TYPES =====

// Web Speech API types (não incluídos no TypeScript por padrão)
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

interface SpeechRecognitionInstance extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    abort: () => void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
    onstart: (() => void) | null;
}

// ===== HELPERS =====

/**
 * Retorna o construtor do SpeechRecognition, se disponível no browser.
 */
function getSpeechRecognition(): SpeechRecognitionConstructor | null {
    const w = window as any;
    return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

// ===== HOOK =====

export function useSpeechToText(options: UseSpeechToTextOptions = {}): UseSpeechToTextReturn {
    const {
        language = 'pt-BR',
        interimResults = true,
        onResult,
        onError,
    } = options;

    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
    const isSupported = typeof window !== 'undefined' && getSpeechRecognition() !== null;

    // Cleanup na desmontagem
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
                recognitionRef.current = null;
            }
        };
    }, []);

    const startListening = useCallback(() => {
        const SpeechRecognition = getSpeechRecognition();
        if (!SpeechRecognition) {
            onError?.('Web Speech API não suportada neste browser. Use Chrome ou Edge.');
            return;
        }

        // Se já está ouvindo, pare primeiro
        if (recognitionRef.current) {
            recognitionRef.current.abort();
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = interimResults;
        recognition.lang = language;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript;
                } else {
                    interimTranscript += result[0].transcript;
                }
            }

            if (finalTranscript) {
                setTranscript(finalTranscript);
                onResult?.(finalTranscript);
            } else if (interimTranscript) {
                setTranscript(interimTranscript);
            }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            // 'no-speech' e 'aborted' são erros esperados, não propagar
            if (event.error !== 'no-speech' && event.error !== 'aborted') {
                const errorMsg = event.error === 'not-allowed'
                    ? 'Permissão de microfone negada. Habilite nas configurações do browser.'
                    : `Erro no reconhecimento de voz: ${event.error}`;
                onError?.(errorMsg);
            }
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
            recognitionRef.current = null;
        };

        recognitionRef.current = recognition;

        try {
            recognition.start();
        } catch (err) {
            onError?.('Não foi possível iniciar o reconhecimento de voz.');
            setIsListening(false);
        }
    }, [language, interimResults, onResult, onError]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        setIsListening(false);
    }, []);

    const resetTranscript = useCallback(() => {
        setTranscript('');
    }, []);

    return {
        isSupported,
        isListening,
        transcript,
        startListening,
        stopListening,
        resetTranscript,
    };
}
