import React from 'react';
import { KPIData, Grade } from '../../../features/dashboard/types';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface AvaliacaoChartProps {
    data: KPIData['score'];
}

export const AvaliacaoGeralCard: React.FC<AvaliacaoChartProps> = ({ data }) => {
    const { total, change, changePeriod, grades } = data;

    const getGradeColor = (grade: Grade) => {
        if (grade.startsWith('A')) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
        if (grade.startsWith('B')) return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
        if (grade.startsWith('C')) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
        if (grade.startsWith('D')) return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
        return 'text-red-400 bg-red-400/10 border-red-400/20';
    };

    const getEvolutionIcon = () => {
        if (change > 0) return <ArrowUpRight size={16} className="text-emerald-500" />;
        if (change < 0) return <ArrowDownRight size={16} className="text-red-500" />;
        return <Minus size={16} className="text-gray-500" />;
    };

    return (
        <div className="bg-[#131B2C] rounded-2xl p-6 border border-white/5 shadow-lg relative overflow-hidden h-full flex flex-col justify-between group hover:border-blue-500/30 transition-colors">

            {/* Header */}
            <div className="flex justify-between items-start mb-6 z-10 relative">
                <h4 className="text-gray-400 text-xs font-bold tracking-wider uppercase">AVALIAÇÃO GERAL</h4>
                <div className="flex items-center gap-1.5 text-xs font-medium">
                    {getEvolutionIcon()}
                    <span className={change > 0 ? 'text-emerald-500' : change < 0 ? 'text-red-500' : 'text-gray-500'}>
                        {change > 0 ? '+' : ''}{change}%
                    </span>
                    <span className="text-gray-500">{changePeriod}</span>
                </div>
            </div>

            {/* Main Score (Center) */}
            <div className="flex-1 flex justify-center items-center mb-6 z-10 relative">
                <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Simple Circular Progress (SVG) */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="56" fill="transparent" stroke="#1F2937" strokeWidth="8" />
                        <circle cx="64" cy="64" r="56" fill="transparent" stroke="#3B82F6" strokeWidth="8"
                            strokeDasharray={351.86}
                            strokeDashoffset={351.86 - (351.86 * total) / 100}
                            strokeLinecap="round"
                            className="drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-white">{total}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">PONTOS</span>
                    </div>
                </div>
            </div>

            {/* Grades Grid */}
            <div className="grid grid-cols-2 gap-3 z-10 relative">
                <div className="bg-[#0A0F1C]/50 rounded-lg p-2.5 border border-white/5 flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 uppercase font-medium">SIMETRIA</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getGradeColor(grades.simetria)}`}>
                        {grades.simetria}
                    </span>
                </div>
                <div className="bg-[#0A0F1C]/50 rounded-lg p-2.5 border border-white/5 flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 uppercase font-medium">PROPORÇÃO</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getGradeColor(grades.proporcao)}`}>
                        {grades.proporcao}
                    </span>
                </div>
                <div className="bg-[#0A0F1C]/50 rounded-lg p-2.5 border border-white/5 flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 uppercase font-medium">ESTÉTICA</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getGradeColor(grades.estetica)}`}>
                        {grades.estetica}
                    </span>
                </div>
                <div className="bg-[#0A0F1C]/50 rounded-lg p-2.5 border border-white/5 flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 uppercase font-medium">EVOLUÇÃO</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getGradeColor(grades.evolucao)}`}>
                        {grades.evolucao}
                    </span>
                </div>
            </div>

            {/* Background Decor */}
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        </div>
    );
};
