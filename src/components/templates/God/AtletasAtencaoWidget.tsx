/**
 * AtletasAtencaoWidget — Widget de atletas que precisam de atenção
 *
 * Lista atletas com mais de 30 dias sem avaliação.
 */

import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import type { AtletaAtencao } from '@/services/godDashboard.service';

interface AtletasAtencaoWidgetProps {
    data: AtletaAtencao[];
    isLoading?: boolean;
}

export const AtletasAtencaoWidget: React.FC<AtletasAtencaoWidgetProps> = ({ data, isLoading = false }) => {
    if (isLoading) {
        return (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 animate-pulse">
                <div className="h-4 w-40 bg-white/5 rounded mb-4" />
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 py-3">
                        <div className="w-8 h-8 rounded-full bg-white/5" />
                        <div className="flex-1 h-3 bg-white/5 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    const isEmpty = data.length === 0;

    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={16} className="text-orange-400" />
                <h3 className="text-sm font-bold text-white">Precisam de Atenção</h3>
                {!isEmpty && (
                    <span className="ml-auto text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full">
                        {data.length}
                    </span>
                )}
            </div>
            {isEmpty ? (
                <div className="py-8 text-center text-gray-600 text-sm">
                    ✅ Todos os atletas estão em dia!
                </div>
            ) : (
                <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                    {data.map(atleta => (
                        <div
                            key={atleta.id}
                            className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/[0.03] transition-colors"
                        >
                            {/* Avatar */}
                            {atleta.foto_url ? (
                                <img
                                    src={atleta.foto_url}
                                    alt={atleta.nome}
                                    className="w-8 h-8 rounded-full object-cover border border-white/10"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                                    <span className="text-xs font-bold text-orange-400">
                                        {atleta.nome.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-medium truncate">
                                    {atleta.nome}
                                </p>
                                <p className="text-[10px] text-gray-500 truncate">
                                    Personal: {atleta.personal_nome}
                                </p>
                            </div>

                            {/* Days badge */}
                            <div className="flex items-center gap-1 text-orange-400">
                                <Clock size={12} />
                                <span className="text-xs font-bold">
                                    {atleta.dias_desde_avaliacao ?? '?'}d
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
