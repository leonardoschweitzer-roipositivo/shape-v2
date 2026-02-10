import React from 'react';
import { SymmetryData } from '../../../features/dashboard/types';
import { Scale, ChevronRight } from 'lucide-react';

interface SymmetryWidgetProps {
    data: SymmetryData;
}

export const SymmetryWidget: React.FC<SymmetryWidgetProps> = ({ data }) => {
    const { items, overallSymmetry } = data;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'symmetric': return 'bg-emerald-500';
            case 'moderate': return 'bg-amber-500';
            case 'asymmetric': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const statusText = (status: string) => {
        switch (status) {
            case 'symmetric': return 'text-emerald-500';
            case 'moderate': return 'text-amber-500';
            case 'asymmetric': return 'text-red-500';
            default: return 'text-gray-500';
        }
    }

    return (
        <div className="bg-[#131B2C] rounded-2xl p-6 border border-white/5 shadow-lg relative overflow-hidden flex flex-col h-full group hover:border-pink-500/30 transition-colors">

            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <h4 className="text-gray-400 text-xs font-bold tracking-wider uppercase flex items-center gap-2">
                    <Scale size={14} className="text-pink-500" />
                    SIMETRIA
                </h4>
                <div className={`text-xl font-bold ${overallSymmetry >= 90 ? 'text-emerald-500' : overallSymmetry >= 75 ? 'text-amber-500' : 'text-red-500'}`}>
                    {overallSymmetry}%
                </div>
            </div>

            {/* Comparison Table */}
            <div className="flex-1 space-y-3 mb-6 z-10">
                <div className="grid grid-cols-[1fr_50px_50px_60px] text-[10px] items-center text-gray-500 uppercase font-bold px-2 mb-2">
                    <span>Muscle</span>
                    <span className="text-center">L</span>
                    <span className="text-center">R</span>
                    <span className="text-right">Diff</span>
                </div>

                {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-[1fr_50px_50px_60px] text-xs items-center px-2 py-1.5 rounded hover:bg-white/5 transition-colors">
                        <span className="text-gray-300 font-medium">{item.muscle}</span>
                        <span className="text-center text-gray-400 font-mono">{Number(item.left).toFixed(1)}</span>
                        <span className="text-center text-gray-400 font-mono">{Number(item.right).toFixed(1)}</span>
                        <div className="flex justify-end items-center gap-1.5">
                            <span className={`font-mono font-bold ${statusText(item.status)}`}>
                                {item.diff >= 0 ? '+' : ''}{Number(item.diff).toFixed(1)}
                            </span>
                            <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(item.status)}`}></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-auto pt-4 border-t border-white/10">
                <button className="w-full flex items-center justify-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors bg-[#0A0F1C] py-2 rounded-lg border border-white/5 hover:border-white/20">
                    ANÁLISE COMPLETA
                    <ChevronRight size={14} />
                </button>
            </div>

            {/* Background Decor */}
            <div className="absolute top-1/2 left-0 w-24 h-24 bg-pink-500/5 rounded-full blur-[50px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        </div>
    );
};
