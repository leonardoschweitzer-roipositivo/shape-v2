/**
 * ConversationalInput - Input conversacional para registro rápido
 */

import React, { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Bot, MessageSquare } from 'lucide-react'
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
        <div className="flex flex-col gap-6">
            {/* Coach IA Header */}
            <div className="flex items-center gap-4">
                <div className="p-2.5 bg-surface-alt rounded-xl border border-white/5 text-blue-400 shadow-lg">
                    <Bot size={22} className="animate-pulse" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white tracking-tight uppercase">
                        Coach IA — Registro Inteligente
                    </h3>
                    <p className="text-sm text-gray-500 font-light">
                        Registre refeições, água ou treinos via texto livre
                    </p>
                </div>
            </div>

            <div className="bg-surface-alt rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
                {/* Histórico de Mensagens */}
                {messages.length > 0 && (
                    <div className="max-h-64 overflow-y-auto p-6 space-y-4 border-b border-white/5 bg-surface/30 custom-scrollbar">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                            >
                                <div
                                    className={`
                                        max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed
                                        ${msg.type === 'user'
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                            : 'bg-surface text-gray-300 border border-white/5 shadow-inner'
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
                <form onSubmit={handleSubmit} className="p-4 flex gap-4 items-center">
                    <div className="flex-1 flex items-center gap-4 bg-surface rounded-xl px-6 py-5 border border-white/5 focus-within:border-blue-500/50 transition-all shadow-inner group">
                        <Sparkles size={20} className="text-blue-400 group-focus-within:scale-110 transition-transform" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Descreva sua atividade (ex: 'comi 2 ovos e 1 pão')..."
                            disabled={isProcessing}
                            className="flex-1 bg-transparent text-white placeholder-gray-600 outline-none text-base font-medium"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!input.trim() || isProcessing}
                        className="p-5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 
                            transition-all shadow-lg shadow-blue-900/20 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed
                            active:scale-95"
                    >
                        {isProcessing ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Send size={24} />
                        )}
                    </button>
                </form>

                {/* Sugestões rápidas */}
                {messages.length === 0 && (
                    <div className="px-6 pb-6 flex gap-2 flex-wrap">
                        {['bebi 500ml de água', 'comi 200g de frango', 'treino de hoje rendeu', 'ajuda'].map((suggestion) => (
                            <button
                                key={suggestion}
                                onClick={() => setInput(suggestion)}
                                className="text-[10px] uppercase tracking-widest font-bold px-4 py-2 rounded-lg bg-surface text-gray-500 
                                    border border-white/5 hover:border-blue-500/30 hover:text-blue-400 transition-all"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ConversationalInput
