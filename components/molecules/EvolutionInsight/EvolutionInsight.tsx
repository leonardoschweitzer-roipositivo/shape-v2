import React from 'react';
import { Bot, ArrowRight, Clock } from 'lucide-react';
import { GlassPanel } from '../../GlassPanel';

export interface EvolutionInsightProps {
    insight: {
        summary: string;
        highlights: {
            positive: string[];
            attention: string[];
        };
        projection?: string;
        generatedAt: Date;
    };
    onViewFullAnalysis?: () => void;
}

export const EvolutionInsight: React.FC<EvolutionInsightProps> = ({ insight, onViewFullAnalysis }) => {

    // Formatting date helper
    const formatTimeAgo = (date: Date) => {
        // Simple mock implementation
        return "2 horas";
    };

    return (
        <section className="flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 ml-1">
                <div className="p-2 bg-[#131B2C] rounded-xl text-primary border border-white/10 shadow-lg">
                    <Bot size={20} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">ANÁLISE DO COACH IA</h3>
                    <p className="text-[10px] text-gray-500 font-medium">Insights e recomendações baseadas no seu progresso</p>
                </div>
            </div>

            <GlassPanel className="p-6 rounded-2xl relative overflow-hidden">
                <p className="text-lg text-white font-medium mb-6 leading-relaxed">
                    "{insight.summary}"
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {insight.highlights.positive.length > 0 && (
                        <div className="bg-green-500/5 border border-green-500/10 rounded-xl p-4">
                            <h4 className="flex items-center gap-2 text-green-400 text-sm font-bold uppercase mb-3">
                                📈 DESTAQUES POSITIVOS
                            </h4>
                            <ul className="space-y-2">
                                {insight.highlights.positive.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                        <span className="text-green-500 mt-1">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {insight.highlights.attention.length > 0 && (
                        <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-4">
                            <h4 className="flex items-center gap-2 text-yellow-500 text-sm font-bold uppercase mb-3">
                                ⚠️ PONTOS DE ATENÇÃO
                            </h4>
                            <ul className="space-y-2">
                                {insight.highlights.attention.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                        <span className="text-yellow-500 mt-1">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {insight.projection && (
                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-6">
                        <h4 className="flex items-center gap-2 text-primary text-sm font-bold uppercase mb-2">
                            🎯 PROJEÇÃO
                        </h4>
                        <p className="text-sm text-gray-300">
                            {insight.projection}
                        </p>
                    </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <button
                        onClick={onViewFullAnalysis}
                        className="text-primary text-xs font-bold hover:underline flex items-center gap-1 uppercase tracking-wider"
                    >
                        Ver análise completa <ArrowRight size={12} />
                    </button>

                    <div className="flex items-center gap-1 text-[10px] text-gray-600">
                        <Clock size={10} />
                        Gerado há {formatTimeAgo(insight.generatedAt)}
                    </div>
                </div>
            </GlassPanel>
        </section>
    );
};
