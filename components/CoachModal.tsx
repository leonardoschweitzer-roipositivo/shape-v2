import React, { useState } from 'react';
import { X, Send, Bot, Sparkles } from 'lucide-react';

interface CoachModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CoachModal: React.FC<CoachModalProps> = ({ isOpen, onClose }) => {
    const [question, setQuestion] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;
        // Simulate sending
        console.log('Question sent:', question);
        setQuestion('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#050810]/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-[#131B2C] border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-up">

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-start justify-between bg-[#131B2C]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Bot className="text-primary" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                                COACH IA
                                <Sparkles size={14} className="text-secondary animate-pulse" />
                            </h2>
                            <p className="text-xs text-gray-400">Dúvida rápida sobre seu físico ou treino?</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    <div className="relative group">
                        <textarea
                            autoFocus
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Ex: Como posso melhorar meu V-Taper? Ou: Minhas panturrilhas estão assimétricas, o que fazer?"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none min-h-[120px]"
                        />
                        <div className="absolute bottom-3 right-3 flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                            <span>SHIFT + ENTER PARA ADICIONAR LINHA</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!question.trim()}
                        className="w-full h-12 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-[#0A0F1C] rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,201,167,0.2)] hover:shadow-[0_0_20px_rgba(0,201,167,0.4)]"
                    >
                        <Send size={18} />
                        PERGUNTAR AO COACH
                    </button>

                    <p className="text-[10px] text-center text-gray-500 uppercase tracking-widest font-bold opacity-50">
                        RESPOSTA INSTANTÂNEA BASEADA NO SEU PERFIL ATUAL
                    </p>
                </form>
            </div>
        </div>
    );
};
