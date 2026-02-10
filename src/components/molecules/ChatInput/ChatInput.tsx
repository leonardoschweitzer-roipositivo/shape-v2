/**
 * ChatInput Component
 * 
 * Input de mensagem com botão de envio
 */

import React, { useState, KeyboardEvent } from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
    onSendMessage: (message: string) => void
    disabled?: boolean
    placeholder?: string
}

export function ChatInput({ onSendMessage, disabled, placeholder = 'Digite sua mensagem...' }: ChatInputProps) {
    const [message, setMessage] = useState('')

    const handleSend = () => {
        if (message.trim() && !disabled) {
            onSendMessage(message.trim())
            setMessage('')
        }
    }

    const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="px-4 py-3 bg-gray-900 border-t border-gray-800">
            <div className="flex items-end gap-2">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={1}
                    className="flex-1 bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed max-h-32"
                    style={{
                        minHeight: '44px',
                        maxHeight: '128px'
                    }}
                />

                <button
                    onClick={handleSend}
                    disabled={!message.trim() || disabled}
                    className="w-11 h-11 rounded-lg bg-teal-500 hover:bg-teal-600 disabled:bg-gray-700 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
                    aria-label="Enviar mensagem"
                >
                    <Send size={20} className="text-white" />
                </button>
            </div>
        </div>
    )
}
