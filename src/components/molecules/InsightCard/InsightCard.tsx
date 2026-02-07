import React from 'react';
import { Insight } from '../../../features/dashboard/types';
import { Lightbulb, AlertTriangle, Trophy, BarChart2, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface InsightCardProps {
    insight: Insight;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
    const { type, title, message, priority, action, isPro, createdAt } = insight;

    const getTypeStyles = () => {
        switch (type) {
            case 'tip': return {
                icon: <Lightbulb size={20} className="text-teal-400" />,
                border: 'border-teal-500/20',
                bg: 'bg-teal-500/5',
                title: 'text-teal-400'
            };
            case 'warning': return {
                icon: <AlertTriangle size={20} className="text-amber-400" />,
                border: 'border-amber-500/20',
                bg: 'bg-amber-500/5',
                title: 'text-amber-400'
            };
            case 'achievement': return {
                icon: <Trophy size={20} className="text-yellow-400" />,
                border: 'border-yellow-500/20',
                bg: 'bg-yellow-500/5',
                title: 'text-yellow-400'
            };
            case 'analysis':
            default: return {
                icon: <BarChart2 size={20} className="text-purple-400" />,
                border: 'border-purple-500/20',
                bg: 'bg-purple-500/5',
                title: 'text-purple-400'
            };
        }
    };

    const styles = getTypeStyles();

    return (
        <div className={`rounded-2xl p-6 border ${styles.border} ${styles.bg} shadow-lg relative overflow-hidden h-full flex flex-col`}>
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-[#0A0F1C] border border-white/5`}>
                        {styles.icon}
                    </div>
                    <div>
                        <h4 className="text-gray-400 text-xs font-bold tracking-wider uppercase">INSIGHT DO COACH IA</h4>
                        <div className={`font-bold text-lg ${styles.title}`}>{title}</div>
                    </div>
                </div>
                {isPro && (
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        PRO
                    </span>
                )}
            </div>

            {/* Message */}
            <p className="text-gray-300 text-sm leading-relaxed mb-6 flex-1">
                {message}
            </p>

            {/* Footer */}
            <div className="flex justify-between items-center mt-auto">
                {action ? (
                    <button className="text-xs font-bold text-white flex items-center gap-1.5 hover:gap-2 transition-all group">
                        {action.label.toUpperCase()}
                        <ArrowRight size={14} className="text-primary group-hover:text-white transition-colors" />
                    </button>
                ) : <div></div>}

                <span className="text-[10px] text-gray-500">
                    Gerado {formatDistanceToNow(createdAt, { addSuffix: true, locale: ptBR })}
                </span>
            </div>

            {/* Texture Overlay */}
            <div className="absolute inset-0 bg-white/5 pointer-events-none opacity-0 hover:opacity-100 transition-opacity"></div>
        </div>
    );
};
