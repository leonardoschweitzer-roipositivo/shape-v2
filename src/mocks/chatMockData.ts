/**
 * Mock Chat Data for Coach Screen
 */

import { ChatMessage } from '../types/athlete-portal'

export const mockChatMessages: ChatMessage[] = [
    {
        id: 'msg-1',
        role: 'assistant',
        content: 'Olá João! 👋 Vi que você completou o treino de hoje. Parabéns pelos 90 minutos de dedicação! Como você se sentiu?',
        timestamp: new Date(Date.now() - 3600000) // 1 hour ago
    },
    {
        id: 'msg-2',
        role: 'user',
        content: 'Foi ótimo! Senti bastante o peitoral superior hoje.',
        timestamp: new Date(Date.now() - 3540000)
    },
    {
        id: 'msg-3',
        role: 'assistant',
        content: 'Excelente! O supino inclinado está fazendo efeito no gap que identificamos. Continue focando nele e no crucifixo inclinado.\n\nSobre a dieta: vi que você está em 48% das calorias. Faltam 100g de proteína para bater a meta. Que tal um shake agora? 🥤',
        timestamp: new Date(Date.now() - 3480000)
    },
    {
        id: 'msg-4',
        role: 'user',
        content: 'Boa ideia! Vou tomar agora.',
        timestamp: new Date(Date.now() - 3420000)
    },
    {
        id: 'msg-5',
        role: 'assistant',
        content: 'Perfeito! Com 2 scoops de whey você adiciona 50g de proteína. Não esqueça de registrar no app! 📱',
        timestamp: new Date(Date.now() - 3360000)
    }
]

// Empty conversation for new users
export const mockEmptyChatMessages: ChatMessage[] = []
