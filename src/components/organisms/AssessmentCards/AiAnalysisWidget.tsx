import React from 'react';
import { Bot, Dumbbell, Utensils } from 'lucide-react';
import { colors } from '@/tokens';

export interface AiAnalysisWidgetProps {
    title?: string;
    analysis: React.ReactNode;
    onCorrection?: () => void;
    onMacros?: () => void;
}

export const AiAnalysisWidget: React.FC<AiAnalysisWidgetProps> = ({
    title = "ANÁLISE DA INTELIGÊNCIA ARTIFICIAL",
    analysis,
    onCorrection,
    onMacros
}) => {
    return (
        <div className="w-full rounded-2xl bg-gradient-to-r from-[#1E293B] to-[#131B2C] border border-white/10 p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-full bg-primary/5 -skew-x-12 translate-x-16"></div>

            <div className="flex flex-col md:flex-row gap-6 relative z-10">
                <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Bot size={28} className="text-white" />
                    </div>
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-bold text-white">{title}</h3>
                        <span className="px-1.5 py-0.5 rounded bg-white/10 text-gray-400 text-[10px] font-bold border border-white/10">BETA</span>
                    </div>

                    <div className="text-gray-300 text-sm leading-relaxed mb-6 max-w-4xl">
                        {analysis}
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button onClick={onCorrection} className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-xs font-bold transition-all hover:border-primary/50 group/btn">
                            <Dumbbell size={16} className="text-primary group-hover/btn:text-white transition-colors" />
                            Gerar Treino Corretivo
                        </button>
                        <button onClick={onMacros} className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-xs font-bold transition-all hover:border-secondary/50 group/btn">
                            <Utensils size={16} className="text-secondary group-hover/btn:text-white transition-colors" />
                            Ajustar Macros
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
