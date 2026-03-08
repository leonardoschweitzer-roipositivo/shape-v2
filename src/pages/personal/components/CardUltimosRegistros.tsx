import React from 'react';
import { History, MessageSquare, Utensils, Droplets, Moon, Weight, AlertCircle } from 'lucide-react';
import { RegistroAtividade } from '@/types/personal-portal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CardUltimosRegistrosProps {
    registros: RegistroAtividade[];
}

export function CardUltimosRegistros({ registros }: CardUltimosRegistrosProps) {
    if (registros.length === 0) return null;

    const getIcon = (tipo: RegistroAtividade['tipo']) => {
        switch (tipo) {
            case 'TREINO': return <History size={14} className="text-orange-400" />;
            case 'FEEDBACK': return <MessageSquare size={14} className="text-indigo-400" />;
            case 'REFEICAO': return <Utensils size={14} className="text-emerald-400" />;
            case 'AGUA': return <Droplets size={14} className="text-blue-400" />;
            case 'SONO': return <Moon size={14} className="text-purple-400" />;
            case 'PESO': return <Weight size={14} className="text-gray-400" />;
            case 'DOR': return <AlertCircle size={14} className="text-red-400" />;
            default: return <History size={14} className="text-gray-400" />;
        }
    };

    return (
        <div className="bg-surface-deep rounded-3xl p-5 border border-white/5 shadow-xl transition-all hover:border-white/10">
            <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                    <History size={18} className="text-indigo-400" />
                </div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Últimos Registros</h3>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar transition-all">
                {registros.map((reg) => (
                    <div key={reg.id} className="flex gap-4 p-3 bg-white/5 rounded-2xl border border-white/5 transition-colors hover:bg-white/10">
                        <div className="flex-shrink-0 mt-1">
                            {getIcon(reg.tipo)}
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-start">
                                <p className="text-[11px] font-black text-white uppercase tracking-wider">{reg.valor}</p>
                                <span className="text-[9px] font-bold text-gray-500 uppercase">
                                    {format(new Date(reg.data), "dd 'de' MMM", { locale: ptBR })}
                                </span>
                            </div>
                            {reg.descricao && (
                                <p className="text-xs text-gray-400 leading-relaxed italic">"{reg.descricao}"</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
