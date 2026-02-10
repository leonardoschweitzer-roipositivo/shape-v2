/**
 * CoachScreen - Tela COACH do Portal do Atleta
 * 
 * Chat com o Vitrúvio (Coach IA)
 */

import React, { useState } from 'react'
import { ChatMessages } from '../../components/organisms/ChatMessages'
import { AcoesRapidasChat, ACOES_RAPIDAS } from '../../components/molecules/AcoesRapidasChat'
import { ChatInput } from '../../components/molecules/ChatInput'
import { ChatMessage, AcaoRapidaChatItem } from '../../types/athlete-portal'

interface CoachScreenProps {
    initialMessages?: ChatMessage[]
    onSendMessage?: (message: string) => Promise<string>
}

export function CoachScreen({ initialMessages = [], onSendMessage }: CoachScreenProps) {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
    const [isTyping, setIsTyping] = useState(false)

    const handleSendMessage = async (content: string) => {
        // Add user message
        const userMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content,
            timestamp: new Date(),
            status: 'sent'
        }

        setMessages(prev => [...prev, userMessage])
        setIsTyping(true)

        // Simulate AI response
        try {
            // If callback provided, use it; otherwise use mock response
            const responseContent = onSendMessage
                ? await onSendMessage(content)
                : await getMockResponse(content)

            // Add assistant message after delay
            setTimeout(() => {
                const assistantMessage: ChatMessage = {
                    id: `msg-${Date.now()}-assistant`,
                    role: 'assistant',
                    content: responseContent,
                    timestamp: new Date()
                }

                setMessages(prev => [...prev, assistantMessage])
                setIsTyping(false)
            }, 1000 + Math.random() * 1000) // 1-2 seconds delay
        } catch (error) {
            setIsTyping(false)
            console.error('Error sending message:', error)
        }
    }

    const handleQuickAction = (actionId: AcaoRapidaChatItem['id']) => {
        const action = ACOES_RAPIDAS.find(a => a.id === actionId)
        if (action?.mensagemPadrao) {
            handleSendMessage(action.mensagemPadrao)
        }
    }

    return (
        <div className="h-screen bg-gray-900 flex flex-col pb-16">
            {/* Header */}
            <div className="bg-gray-900/50 border-b border-gray-800 px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                    <span className="text-xl">🤖</span>
                </div>
                <div>
                    <h2 className="text-base font-semibold text-white">Vitrúvio</h2>
                    <p className="text-xs text-gray-400">Coach IA • Sempre online</p>
                </div>
            </div>

            {/* Messages */}
            <ChatMessages messages={messages} isTyping={isTyping} />

            {/* Quick Actions */}
            <AcoesRapidasChat onActionClick={handleQuickAction} />

            {/* Input */}
            <ChatInput
                onSendMessage={handleSendMessage}
                disabled={isTyping}
                placeholder="Digite sua mensagem..."
            />
        </div>
    )
}

// Mock AI response function
async function getMockResponse(userMessage: string): Promise<string> {
    const lowerMessage = userMessage.toLowerCase()

    // Refeição
    if (lowerMessage.includes('refeição') || lowerMessage.includes('comer')) {
        return 'Ótimo! Registrar sua refeição é importante para acompanhar seus macros. O que você comeu? Pode descrever ou tirar uma foto! 📸'
    }

    // Treino
    if (lowerMessage.includes('treino') || lowerMessage.includes('treinar')) {
        return 'Showw! Como foi o treino de hoje? Me conta:\n\n1. Como você se sentiu? (😫 Difícil / 💪 Bom / 🔥 Ótimo)\n2. Quanto tempo durou?\n3. Alguma dor ou desconforto?'
    }

    // Água
    if (lowerMessage.includes('água') || lowerMessage.includes('bebi')) {
        return 'Perfeito! Hidratação é fundamental. Você já bateu sua meta de 3L hoje? 💧'
    }

    // Dúvida genérica
    if (lowerMessage.includes('dúvida') || lowerMessage.includes('duvida') || lowerMessage.includes('?')) {
        return 'Claro! Estou aqui para ajudar. Pode perguntar sobre treino, dieta, suplementação, técnica de exercícios, ou qualquer coisa relacionada aos seus objetivos! 💪'
    }

    // Proteína
    if (lowerMessage.includes('proteína') || lowerMessage.includes('proteina')) {
        return 'Sua meta de proteína hoje é 180g. Até agora você consumiu 80g (44%). Que tal um shake pós-treino com 2 scoops de whey (50g)? Isso te deixaria em 130g! 🥤'
    }

    // Motivação
    if (lowerMessage.includes('cansado') || lowerMessage.includes('desanimado')) {
        return 'Entendo que às vezes bate o cansaço, mas lembre-se: você já está no dia 7 de streak! 🔥 Cada dia de consistência te aproxima do seu objetivo. Pequenos progressos diários = grandes resultados! 💪'
    }

    // Default
    return 'Entendi! Vou te ajudar com isso. Baseado no seu perfil e histórico, sugiro:\n\n✅ Manter a consistência no treino\n✅ Focar em atingir sua meta de proteína (faltam 100g hoje)\n✅ Dormir bem (você dormiu 7h ontem, ótimo!)\n\nPrecisa de algo mais específico?'
}
