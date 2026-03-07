import React from 'react';
import { Activity, TrendingUp, TrendingDown, Target } from 'lucide-react';

interface CardDiagnosticoEsteticoProps {
    score: number;
    scoreMeta6M?: number;
    scoreMeta12M?: number;
    evolucaoSemana: number;
    bf: number;
    massaMagra: number;
    nivel: string | null;
}

export function CardDiagnosticoEstetico({
    score,
    scoreMeta6M,
    scoreMeta12M,
    evolucaoSemana,
    bf,
    massaMagra,
    nivel
}: CardDiagnosticoEsteticoProps) {
    const isEvolucaoPositiva = evolucaoSemana > 0;
    const isEvolucaoNegativa = evolucaoSemana < 0;

    return (
        <div className="bg-surface-deep rounded-3xl p-5 border border-white/5 shadow-xl transition-all hover:border-white/10">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <Activity size={18} className="text-emerald-400" />
                    </div>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Diagnóstico Estético</h3>
                </div>
                {nivel && (
                    <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">{nivel}</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-[var(--color-accent)]">{score.toFixed(1)}</span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">pts</span>
                    </div>
                    <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${isEvolucaoPositiva ? 'text-emerald-400' : isEvolucaoNegativa ? 'text-red-400' : 'text-gray-500'}`}>
                        {isEvolucaoPositiva && <TrendingUp size={12} />}
                        {isEvolucaoNegativa && <TrendingDown size={12} />}
                        <span>{isEvolucaoPositiva ? '+' : ''}{evolucaoSemana.toFixed(1)} esta semana</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Gordura (BF)</span>
                        <span className="text-sm font-black text-white">{bf.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Massa Magra</span>
                        <span className="text-sm font-black text-white">{massaMagra.toFixed(1)}kg</span>
                    </div>
                </div>
            </div>

            {/* Metas de Score */}
            {(scoreMeta6M || scoreMeta12M) && (
                <div className="pt-5 border-t border-white/5 bg-white/5 -mx-5 px-5 pb-5 rounded-b-3xl">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Target size={10} className="text-indigo-400" />
                        Projeção de Evolução
                    </p>
                    <div className="flex gap-4">
                        {scoreMeta6M && (
                            <div className="flex-1 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                                <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Meta 6 Meses</p>
                                <p className="text-lg font-black text-white">{scoreMeta6M.toFixed(1)} <span className="text-[10px] text-gray-400 font-bold">pts</span></p>
                            </div>
                        )}
                        {scoreMeta12M && (
                            <div className="flex-1 p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                                <p className="text-[8px] font-black text-purple-400 uppercase tracking-widest mb-1">Meta 12 Meses</p>
                                <p className="text-lg font-black text-white">{scoreMeta12M.toFixed(1)} <span className="text-[10px] text-gray-400 font-bold">pts</span></p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
