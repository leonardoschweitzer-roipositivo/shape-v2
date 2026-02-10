/**
 * ChatMessages Component
 * 
 * Lista de mensagens do chat com scroll automático
 */

import React, { useEffect, useRef } from 'react'
import { ChatMessage as ChatMessageType } from '../../../types/athlete-portal'
import { Loader2, AlertCircle } from 'lucide-react'

interface ChatMessagesProps {
    messages: ChatMessageType[]
    isTyping?: boolean
}

function formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    })
}

function ChatMessageBubble({ message }: { message: ChatMessageType }) {
    const isUser = message.role === 'user'

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`
          max-w-[80%] rounded-2xl px-4 py-3
          ${isUser
                        ? 'bg-teal-500 text-white rounded-br-md'
                        : 'bg-gray-800 text-gray-100 rounded-bl-md'
                    }
        `}
            >
                {/* Message content */}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                </p>

                {/* Time and status */}
                <div className={`flex items-center gap-1.5 mt-1.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <span className={`text-[10px] ${isUser ? 'text-teal-100' : 'text-gray-500'}`}>
                        {formatTime(message.timestamp)}
                    </span>

                    {isUser && message.status && (
                        <>
                            {message.status === 'sending' && (
                                <Loader2 size={10} className="animate-spin text-teal-100" />
                            )}
                            {message.status === 'error' && (
                                <AlertCircle size={10} className="text-red-400" />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export function ChatMessages({ messages, isTyping }: ChatMessagesProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    return (
        <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
            {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                    <div className="w-16 h-16 rounded-full bg-teal-500/10 flex items-center justify-center mb-4">
                        <span className="text-3xl">🤖</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                        Olá! Sou o Vitrúvio
                    </h3>
                    <p className="text-sm text-gray-400 max-w-xs">
                        Seu coach pessoal de IA. Estou aqui para te ajudar com treino, dieta, dúvidas e motivação!
                    </p>
                </div>
            ) : (
                <>
                    {messages.map((message) => (
                        <ChatMessageBubble key={message.id} message={message} />
                    ))}

                    {isTyping && (
                        <div className="flex justify-start mb-4">
                            <div className="bg-gray-800 rounded-2xl rounded-bl-md px-4 py-3">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            <div ref={messagesEndRef} />
        </div>
    )
}
