/**
 * ConversationalInput - Input conversacional para registro rápido
 */

import React, { useState, useRef, useEffect } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { processarInput } from '../../../services/nlp/conversational-input'
import { useDailyTrackingStore } from '../../../stores/useDailyTrackingStore'

interface Message {
    id: string
    type: 'user' | 'system'
    text: string
    timestamp: Date
}

export const ConversationalInput: React.FC = () => {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState<Message[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const { registrarRefeicao, registrarAgua, registrarTreino, registrarSono, abrirModal } = useDailyTrackingStore()

    // Auto-scroll para última mensagem
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const addMessage = (type: 'user' | 'system', text: string) => {
        const message: Message = {
            id: Date.now().toString(),
            type,
            text,
            timestamp: new Date(),
        }
        setMessages(prev => [...prev, message])
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isProcessing) return

        const userInput = input.trim()
        setInput('')
        setIsProcessing(true)

        // Adicionar mensagem do usuário
        addMessage('user', userInput)

        // Processar com NLP
        try {
            const resultado = processarInput(userInput)

            if (!resultado) {
                addMessage('system', '🤔 Não entendi. Tente algo como "comi 200g de frango" ou "bebi 500ml de água".')
                setIsProcessing(false)
                return
            }

            // Executar ação baseada no tipo
            switch (resultado.tipo) {
                case 'registro':
                    await handleRegistro(resultado)
                    break

                case 'consulta':
                    handleConsulta(resultado)
                    break

                case 'comando':
                    handleComando(resultado)
                    break

                default:
                    addMessage('system', '❓ Tipo de comando não reconhecido.')
            }
        } catch (error) {
            console.error('Erro ao processar input:', error)
            addMessage('system', '⚠️ Ops! Algo deu errado. Tente novamente.')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleRegistro = async (resultado: any) => {
        const { entidade, dados } = resultado

        switch (entidade) {
            case 'refeicao':
                registrarRefeicao({
                    tipo: dados.tipo || 'outro',
                    data: new Date(),
                    horario: new Date(),
                    descricao: dados.descricao,
                    calorias: dados.calorias || 0,
                    proteina: dados.proteina || 0,
                    carboidrato: dados.carboidrato || 0,
                    gordura: dados.gordura || 0,
                    fonte: 'manual',
                })
                addMessage('system', `✅ Registrei: ${dados.descricao}. ${dados.calorias ? `~${dados.calorias} kcal` : ''}`)
                break

            case 'agua':
                registrarAgua(dados.quantidade)
                addMessage('system', `💧 Registrei ${dados.quantidade}ml de água!`)
                break

            case 'treino':
                registrarTreino({
                    status: 'completo',
                    seguiuPlano: true,
                    intensidadePercebida: 3,
                    duracao: dados.duracao || 60,
                    reportouDor: false,
                    observacoes: dados.descricao,
                })
                addMessage('system', `💪 Treino registrado! ${dados.descricao || ''}`)
                break

            case 'sono':
                // Para sono, abrir modal pois precisa de mais detalhes
                addMessage('system', '😴 Vou abrir o modal de sono para você completar os detalhes...')
                setTimeout(() => abrirModal('sono'), 1000)
                break

            default:
                addMessage('system', `📝 Tipo de registro "${entidade}" ainda não suportado.`)
        }
    }

    const handleConsulta = (resultado: any) => {
        // Implementar consultas futuras
        addMessage('system', '📊 Consultas ainda não implementadas. Em breve!')
    }

    const handleComando = (resultado: any) => {
        const { acao } = resultado.dados

        switch (acao) {
            case 'limpar':
                setMessages([])
                addMessage('system', '🧹 Histórico limpo!')
                break

            case 'ajuda':
                addMessage('system', `💡 **Exemplos de comandos:**
• "comi 200g de frango com arroz"
• "bebi 500ml de água"
• "treino de peito completo"
• "dormi 8 horas"
• "limpar" - limpa o histórico`)
                break

            default:
                addMessage('system', '❓ Comando não reconhecido.')
        }
    }

    return (
        <div className="bg-gray-800/30 rounded-lg border border-gray-700/30 overflow-hidden">
            {/* Histórico de Mensagens */}
            {messages.length > 0 && (
                <div className="max-h-48 overflow-y-auto p-4 space-y-2 border-b border-gray-700/30">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`
                  max-w-[80%] rounded-lg px-3 py-2 text-sm
                  ${msg.type === 'user'
                                        ? 'bg-blue-500/20 text-blue-200 border border-blue-500/30'
                                        : 'bg-gray-700/50 text-gray-300 border border-gray-600/30'
                                    }
                `}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-3 flex gap-2 items-center">
                <div className="flex-1 flex items-center gap-2 bg-gray-800/50 rounded-lg px-4 py-2 border border-gray-700/50 focus-within:border-blue-500/50 transition-colors">
                    <Sparkles size={16} className="text-blue-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="💬 Ex: 'comi 200g de frango' ou 'bebi 500ml de água'..."
                        disabled={isProcessing}
                        className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm"
                    />
                </div>

                <button
                    type="submit"
                    disabled={!input.trim() || isProcessing}
                    className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 
            transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isProcessing ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Send size={20} />
                    )}
                </button>
            </form>

            {/* Sugestões rápidas */}
            {messages.length === 0 && (
                <div className="px-4 pb-3 flex gap-2 flex-wrap">
                    {['bebi 500ml', 'comi frango', 'ajuda'].map((suggestion) => (
                        <button
                            key={suggestion}
                            onClick={() => setInput(suggestion)}
                            className="text-xs px-3 py-1 rounded-full bg-gray-700/50 text-gray-400 
                hover:bg-gray-600/50 hover:text-gray-300 transition-colors"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ConversationalInput
