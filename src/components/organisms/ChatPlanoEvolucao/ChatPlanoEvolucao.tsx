/**
 * ChatPlanoEvolucao — Chat inline para debater plano de Treino/Dieta
 *
 * Permite ao Personal Trainer conversar com o Vitrúvio IA sobre o plano gerado,
 * questionando, ajustando ou validando aspectos do treino ou dieta.
 *
 * O Vitrúvio responde com base em evidências científicas e no contexto completo
 * do atleta + plano gerado.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, Send, Bot, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { enviarMensagemPlanoReview } from '@/services/vitruviusAI';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    status?: 'sending' | 'sent' | 'error';
}

interface AcaoRapida {
    emoji: string;
    label: string;
    mensagem: string;
}

export interface ChatPlanoEvolucaoProps {
    tipo: 'treino' | 'dieta' | 'diagnostico';
    atletaId: string;
    nomeAtleta: string;
    planoTexto: string;
    perfilTexto: string;
    fontesCientificas: string;
    onAplicarAjustes?: () => void;
    isApplying?: boolean;
}

// ═══════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════

const ACOES_TREINO: AcaoRapida[] = [
    { emoji: '🔄', label: 'Trocar exercício', mensagem: 'Quero discutir a troca de um exercício do plano. Quais alternativas biomecânicas você sugere?' },
    { emoji: '📊', label: 'Ajustar volume', mensagem: 'Preciso discutir o volume semanal de um grupo muscular. Pode justificar a distribuição atual?' },
    { emoji: '⚡', label: 'Técnicas avançadas', mensagem: 'Questiono o uso de técnicas avançadas no plano. Pode explicar a razão da escolha?' },
    { emoji: '📋', label: 'Justificativa', mensagem: 'Pode justificar cientificamente a abordagem geral deste plano de treino?' },
];

const ACOES_DIETA: AcaoRapida[] = [
    { emoji: '🍽️', label: 'Trocar alimento', mensagem: 'Quero substituir um alimento do cardápio. Quais opções mantêm os macros?' },
    { emoji: '📊', label: 'Ajustar macros', mensagem: 'Gostaria de discutir a distribuição de macronutrientes. Pode justificar os valores atuais?' },
    { emoji: '⏱️', label: 'Refeições', mensagem: 'Preciso ajustar a estrutura ou horários das refeições. Pode me orientar?' },
    { emoji: '📋', label: 'Justificativa', mensagem: 'Pode justificar cientificamente a abordagem calórica e de macros deste plano?' },
];

const ACOES_DIAGNOSTICO: AcaoRapida[] = [
    { emoji: '📈', label: 'Metas', mensagem: 'Podemos revisar as metas de proporção de 12 meses? Estão muito agressivas?' },
    { emoji: '⚖️', label: 'Simetria', mensagem: 'Quero discutir as assimetrias detectadas e como priorizá-las no treino.' },
    { emoji: '🎯', label: 'Objetivo', mensagem: 'O objetivo recomendado pelo IA foi adequado para as proporções atuais?' },
    { emoji: '📋', label: 'Justificativa', mensagem: 'Pode justificar cientificamente a recomendação principal do diagnóstico?' },
];

const WELCOME_MSG_TREINO = 'Olá, Personal! 💪 Acabei de gerar o plano de treino. Como profissional responsável, fique à vontade para questionar qualquer aspecto — volume, exercícios, periodização, técnicas. Vou fundamentar minhas respostas com evidências científicas.';
const WELCOME_MSG_DIETA = 'Olá, Personal! 🍽️ Acabei de gerar o plano alimentar. Fique à vontade para debater calorias, macros, cardápio, timing de refeições ou qualquer ajuste. Minhas sugestões são baseadas em evidências, mas você conhece o aluno melhor que eu.';
const WELCOME_MSG_DIAGNOSTICO = 'Olá, Personal! 🩺 O diagnóstico métrico e metabólico está pronto. Posso ajudar a interpretar deficiências de proporção, esclarecer as taxas metabólicas ou justificar as metas de longo prazo. O que quer debater?';

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

export const ChatPlanoEvolucao: React.FC<ChatPlanoEvolucaoProps> = ({
    tipo,
    atletaId,
    nomeAtleta,
    planoTexto,
    perfilTexto,
    fontesCientificas,
    onAplicarAjustes,
    isApplying = false,
}) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: tipo === 'treino' ? WELCOME_MSG_TREINO : tipo === 'dieta' ? WELCOME_MSG_DIETA : WELCOME_MSG_DIAGNOSTICO,
            timestamp: new Date(),
            status: 'sent',
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const acoes = tipo === 'treino' ? ACOES_TREINO : tipo === 'dieta' ? ACOES_DIETA : ACOES_DIAGNOSTICO;

    // Auto-scroll
    useEffect(() => {
        if (isExpanded) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping, isExpanded]);

    // Build history for API call
    const buildHistorico = useCallback(() => {
        return messages
            .filter(m => m.id !== 'welcome')
            .map(m => ({
                role: (m.role === 'user' ? 'user' : 'model') as 'user' | 'model',
                content: m.content,
            }));
    }, [messages]);

    const handleSend = useCallback(async (text?: string) => {
        const msgText = (text || input).trim();
        if (!msgText || isTyping) return;

        // Add user message
        const userMsg: ChatMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: msgText,
            timestamp: new Date(),
            status: 'sending',
        };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Auto-expand if not expanded
        if (!isExpanded) setIsExpanded(true);

        try {
            const historico = buildHistorico();
            const resposta = await enviarMensagemPlanoReview(
                atletaId,
                tipo,
                msgText,
                nomeAtleta,
                planoTexto,
                perfilTexto,
                fontesCientificas,
                historico,
            );

            // Update user msg status
            setMessages(prev =>
                prev.map(m => m.id === userMsg.id ? { ...m, status: 'sent' as const } : m)
            );

            // Add assistant message
            const aiMsg: ChatMessage = {
                id: `ai-${Date.now()}`,
                role: 'assistant',
                content: resposta,
                timestamp: new Date(),
                status: 'sent',
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            console.error('[ChatPlanoEvolucao] Erro:', err);
            setMessages(prev =>
                prev.map(m => m.id === userMsg.id ? { ...m, status: 'error' as const } : m)
            );
        } finally {
            setIsTyping(false);
        }
    }, [input, isTyping, isExpanded, atletaId, tipo, nomeAtleta, planoTexto, perfilTexto, fontesCientificas, buildHistorico]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleAcaoRapida = (acao: AcaoRapida) => {
        setInput(acao.mensagem);
        if (!isExpanded) setIsExpanded(true);
        setTimeout(() => textareaRef.current?.focus(), 100);
    };

    const hasConversation = messages.length > 1;
    const tipoLabel = tipo === 'treino' ? 'Treino' : tipo === 'dieta' ? 'Dieta' : 'Diagnóstico';

    return (
        <div className="bg-[#131B2C] border border-white/10 rounded-2xl overflow-hidden mb-6">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-6 py-5 border-b border-white/10 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 relative">
                        <MessageSquare size={22} className="text-primary" />
                        {hasConversation && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-[#131B2C]" />
                        )}
                    </div>
                    <div className="text-left">
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                            Debater com Vitrúvio IA
                        </h3>
                        <p className="text-sm text-gray-500">
                            Converse sobre ajustes no plano de {tipoLabel.toLowerCase()} de {nomeAtleta}
                        </p>
                    </div>
                </div>
                {isExpanded
                    ? <ChevronUp size={20} className="text-gray-500" />
                    : <ChevronDown size={20} className="text-gray-500" />
                }
            </button>

            {/* Collapsible body */}
            {isExpanded && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Messages area */}
                    <div className="max-h-[420px] overflow-y-auto px-6 py-4 custom-scrollbar">
                        {messages.map((msg) => (
                            <MessageBubble key={msg.id} message={msg} />
                        ))}

                        {isTyping && <TypingIndicator />}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick actions & Apply Actions */}
                    <div className="px-6 py-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-2 flex-1">
                            {acoes.map((acao) => (
                                <button
                                    key={acao.label}
                                    onClick={() => handleAcaoRapida(acao)}
                                    disabled={isTyping || isApplying}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/[0.08] hover:border-primary/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <span>{acao.emoji}</span>
                                    <span>{acao.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Apply Button */}
                        {hasConversation && onAplicarAjustes && (
                            <button
                                onClick={onAplicarAjustes}
                                disabled={isTyping || isApplying}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 text-primary rounded-lg text-sm font-semibold hover:from-primary/30 hover:to-primary/20 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                                {isApplying ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Aplicando Ajustes...
                                    </>
                                ) : (
                                    <>
                                        ✨ Aplicar Ajustes
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Input area */}
                    <div className="px-6 py-4 border-t border-white/10 bg-white/[0.01]">
                        <div className="flex items-end gap-3">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={`Debater plano de ${tipoLabel.toLowerCase()} com o Vitrúvio...`}
                                disabled={isTyping || isApplying}
                                rows={1}
                                className="flex-1 bg-white/[0.05] text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 focus:border-primary/30 transition-all"
                                style={{ minHeight: '44px', maxHeight: '120px' }}
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isTyping || isApplying}
                                className="w-11 h-11 rounded-xl bg-primary hover:bg-primary/80 disabled:bg-white/5 disabled:cursor-not-allowed flex items-center justify-center transition-all shrink-0 shadow-lg shadow-primary/10 disabled:shadow-none"
                                aria-label="Enviar mensagem"
                            >
                                {isTyping
                                    ? <Loader2 size={18} className="text-white animate-spin" />
                                    : <Send size={18} className="text-[#0A0F1C]" />
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ═══════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════

const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            {!isUser && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mr-3 mt-1">
                    <Bot size={16} className="text-primary" />
                </div>
            )}
            <div
                className={`
                    max-w-[80%] rounded-2xl px-4 py-3
                    ${isUser
                        ? 'bg-primary/20 text-white rounded-br-md border border-primary/20'
                        : 'bg-white/[0.04] text-gray-200 rounded-bl-md border border-white/5'
                    }
                `}
            >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <div className={`flex items-center gap-1.5 mt-1.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <span className={`text-[10px] ${isUser ? 'text-primary/60' : 'text-gray-600'}`}>
                        {formatTime(message.timestamp)}
                    </span>
                    {isUser && message.status === 'sending' && (
                        <Loader2 size={10} className="animate-spin text-primary/60" />
                    )}
                    {isUser && message.status === 'error' && (
                        <span className="text-[10px] text-red-400">Erro</span>
                    )}
                </div>
            </div>
        </div>
    );
};

const TypingIndicator: React.FC = () => (
    <div className="flex justify-start mb-4">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mr-3 mt-1">
            <Bot size={16} className="text-primary animate-pulse" />
        </div>
        <div className="bg-white/[0.04] rounded-2xl rounded-bl-md px-4 py-3 border border-white/5">
            <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
        </div>
    </div>
);

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

function formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    });
}
