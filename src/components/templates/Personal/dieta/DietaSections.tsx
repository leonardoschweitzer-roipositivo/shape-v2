/**
 * DietaView — Section Components
 */
import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { SectionCard, InsightBox } from '../PlanoEvolucaoShared';
import { type PlanoDieta, type RefeicaoEstrutura, type MacroSet } from '@/services/calculations/dieta';
import { colors } from '@/tokens';
import { EditableField } from '@/components/atoms/EditableField/EditableField';

export const MacroCard: React.FC<{
    label: string;
    emoji: string;
    gramas: number;
    gKg: number;
    kcal: number;
    pct: number;
    color: string;
}> = ({ label, emoji, gramas, gKg, kcal, pct, color }) => (
    <div className={`bg-white/[0.03] rounded-xl border ${color} p-5 text-center`}>
        <p className="text-2xl mb-2">{emoji}</p>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{label}</p>
        <p className="text-3xl font-black text-white mb-1">{gramas}g</p>
        <p className="text-xs text-gray-500 mb-3">{gKg} g/kg</p>
        <div className="border-t border-white/5 pt-3 space-y-1">
            <p className="text-sm font-bold text-gray-400">{kcal} kcal</p>
            <p className="text-xs text-gray-600">{pct}%</p>
        </div>
    </div>
);

export const MacroBar: React.FC<{ macros: MacroSet }> = ({ macros }) => (
    <div className="flex rounded-full overflow-hidden h-3 mt-4">
        <div className="bg-blue-500/70 transition-all" style={{ width: `${macros.proteina.pct}%` }} title={`Proteína ${macros.proteina.pct}%`} />
        <div className="bg-amber-500/70 transition-all" style={{ width: `${macros.carboidrato.pct}%` }} title={`Carbo ${macros.carboidrato.pct}%`} />
        <div className="bg-rose-500/70 transition-all" style={{ width: `${macros.gordura.pct}%` }} title={`Gordura ${macros.gordura.pct}%`} />
    </div>
);

export const TabelaRefeicoes: React.FC<{
    refeicoes: RefeicaoEstrutura[];
    isEditing?: boolean;
    onUpdateRefeicoes?: (refeicoes: RefeicaoEstrutura[]) => void;
}> = ({ refeicoes, isEditing = false, onUpdateRefeicoes }) => {
    const updateRefeicao = (idx: number, field: keyof RefeicaoEstrutura, value: string | number) => {
        if (!onUpdateRefeicoes) return;
        const updated = refeicoes.map((r, i) => {
            if (i !== idx) return r;
            const newR = { ...r, [field]: value };
            // Auto-recalcular kcal quando macros mudam
            if (['proteina', 'carboidrato', 'gordura'].includes(field)) {
                newR.kcal = Math.round(newR.proteina * 4 + newR.carboidrato * 4 + newR.gordura * 9);
            }
            return newR;
        });
        onUpdateRefeicoes(updated);
    };

    const addRefeicao = () => {
        if (!onUpdateRefeicoes) return;
        const nova: RefeicaoEstrutura = {
            numero: refeicoes.length + 1,
            nome: 'Nova Refeição',
            emoji: '🍽️',
            horario: '12:00',
            proteina: 30,
            carboidrato: 40,
            gordura: 10,
            kcal: 370,
        };
        onUpdateRefeicoes([...refeicoes, nova]);
    };

    const removeRefeicao = (idx: number) => {
        if (!onUpdateRefeicoes || refeicoes.length <= 2) return;
        const updated = refeicoes.filter((_, i) => i !== idx).map((r, i) => ({ ...r, numero: i + 1 }));
        onUpdateRefeicoes(updated);
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-white/5">
                        <th className="text-left text-[10px] text-gray-600 uppercase tracking-widest font-bold pb-3 pr-4">#</th>
                        <th className="text-left text-[10px] text-gray-600 uppercase tracking-widest font-bold pb-3 pr-4">Refeição</th>
                        <th className="text-left text-[10px] text-gray-600 uppercase tracking-widest font-bold pb-3 pr-4">Horário</th>
                        <th className="text-right text-[10px] text-gray-600 uppercase tracking-widest font-bold pb-3 pr-4">Prot.</th>
                        <th className="text-right text-[10px] text-gray-600 uppercase tracking-widest font-bold pb-3 pr-4">Carb.</th>
                        <th className="text-right text-[10px] text-gray-600 uppercase tracking-widest font-bold pb-3 pr-4">Gord.</th>
                        <th className="text-right text-[10px] text-gray-600 uppercase tracking-widest font-bold pb-3">Kcal</th>
                        {isEditing && <th className="w-8" />}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                    {refeicoes.map((r, idx) => (
                        <tr key={r.numero} className={`transition-colors ${isEditing ? 'bg-primary/[0.02]' : 'hover:bg-white/[0.02]'}`}>
                            <td className="py-3 pr-4 text-gray-500">{r.numero}</td>
                            <td className="py-3 pr-4">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={r.nome}
                                        onChange={(e) => updateRefeicao(idx, 'nome', e.target.value)}
                                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-gray-300 font-medium w-full focus:border-primary/50 focus:outline-none"
                                    />
                                ) : (
                                    <>
                                        <span className="mr-2">{r.emoji}</span>
                                        <span className="text-gray-300 font-medium">{r.nome}</span>
                                        {r.observacao && (
                                            <p className="text-[10px] text-gray-600 mt-0.5">{r.observacao}</p>
                                        )}
                                    </>
                                )}
                            </td>
                            <td className="py-3 pr-4 text-gray-500 text-xs">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={r.horario}
                                        onChange={(e) => updateRefeicao(idx, 'horario', e.target.value)}
                                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-gray-500 w-16 text-center focus:border-primary/50 focus:outline-none"
                                    />
                                ) : r.horario}
                            </td>
                            <td className="py-3 pr-4 text-right text-blue-400 font-bold">
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={r.proteina}
                                        onChange={(e) => updateRefeicao(idx, 'proteina', Number(e.target.value))}
                                        className="bg-white/5 border border-white/10 rounded-lg px-1 py-1 text-sm text-blue-400 font-bold w-14 text-center focus:border-primary/50 focus:outline-none"
                                        min={0}
                                    />
                                ) : <>{r.proteina}g</>}
                            </td>
                            <td className="py-3 pr-4 text-right text-amber-400 font-bold">
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={r.carboidrato}
                                        onChange={(e) => updateRefeicao(idx, 'carboidrato', Number(e.target.value))}
                                        className="bg-white/5 border border-white/10 rounded-lg px-1 py-1 text-sm text-amber-400 font-bold w-14 text-center focus:border-primary/50 focus:outline-none"
                                        min={0}
                                    />
                                ) : <>{r.carboidrato}g</>}
                            </td>
                            <td className="py-3 pr-4 text-right text-rose-400 font-bold">
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={r.gordura}
                                        onChange={(e) => updateRefeicao(idx, 'gordura', Number(e.target.value))}
                                        className="bg-white/5 border border-white/10 rounded-lg px-1 py-1 text-sm text-rose-400 font-bold w-14 text-center focus:border-primary/50 focus:outline-none"
                                        min={0}
                                    />
                                ) : <>{r.gordura}g</>}
                            </td>
                            <td className="py-3 text-right text-gray-400 font-bold">{r.kcal}</td>
                            {isEditing && (
                                <td className="py-3 pl-2">
                                    {refeicoes.length > 2 && (
                                        <button
                                            onClick={() => removeRefeicao(idx)}
                                            className="p-1 text-gray-600 hover:text-red-400 transition-colors"
                                            title="Remover refeição"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                    <tr className="border-t border-white/10">
                        <td colSpan={3} className="pt-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">TOTAL</td>
                        <td className="pt-3 text-right text-blue-400 font-black">{refeicoes.reduce((s, r) => s + r.proteina, 0)}g</td>
                        <td className="pt-3 text-right text-amber-400 font-black">{refeicoes.reduce((s, r) => s + r.carboidrato, 0)}g</td>
                        <td className="pt-3 text-right text-rose-400 font-black">{refeicoes.reduce((s, r) => s + r.gordura, 0)}g</td>
                        <td className="pt-3 text-right text-white font-black">{refeicoes.reduce((s, r) => s + r.kcal, 0)}</td>
                        {isEditing && <td />}
                    </tr>
                </tbody>
            </table>
            {isEditing && (
                <button
                    onClick={addRefeicao}
                    className="flex items-center gap-2 mt-3 text-xs font-bold text-primary uppercase tracking-wider hover:bg-primary/10 px-4 py-2 rounded-xl transition-all"
                >
                    <Plus size={14} />
                    Adicionar Refeição
                </button>
            )}
        </div>
    );
};
