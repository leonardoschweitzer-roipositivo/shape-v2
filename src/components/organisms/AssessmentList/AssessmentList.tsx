import React, { useState } from 'react';
import { GlassPanel } from '@/components/atoms';
import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight, CalendarPlus, Sparkles, TrendingDown } from 'lucide-react';

export interface Assessment {
    id: string;
    date: string;
    timeAgo: string;
    weight: number;
    bodyFat: number;
    shapeVScore: number;
    asymmetryAvg: number;
}

// Mock data para demonstração
export const mockAssessments: Assessment[] = [
    {
        id: '1',
        date: '15 Out 2023',
        timeAgo: 'Há 2 semanas',
        weight: 88.5,
        bodyFat: 12.4,
        shapeVScore: 8.9,
        asymmetryAvg: 2.1,
    },
    {
        id: '2',
        date: '01 Set 2023',
        timeAgo: 'Há 1 mês',
        weight: 87.2,
        bodyFat: 13.1,
        shapeVScore: 8.2,
        asymmetryAvg: 2.4,
    },
    {
        id: '3',
        date: '15 Ago 2023',
        timeAgo: 'Há 2 meses',
        weight: 86.5,
        bodyFat: 13.5,
        shapeVScore: 7.9,
        asymmetryAvg: 2.8,
    },
    {
        id: '4',
        date: '10 Jul 2023',
        timeAgo: 'Há 3 meses',
        weight: 85.0,
        bodyFat: 14.2,
        shapeVScore: 7.5,
        asymmetryAvg: 3.1,
    },
];

const getScoreColor = (score: number): { bg: string; text: string; border: string } => {
    if (score >= 9.0) return { bg: 'bg-[#16332D]', text: 'text-[#00FFA3]', border: 'border-[#00FFA3]/30' };
    if (score >= 8.0) return { bg: 'bg-[#0F2F44]', text: 'text-[#00C9A7]', border: 'border-[#00C9A7]/30' };
    if (score >= 7.0) return { bg: 'bg-[#2E1F5E]', text: 'text-[#A78BFA]', border: 'border-[#A78BFA]/30' };
    if (score >= 6.0) return { bg: 'bg-[#3D2E10]', text: 'text-[#FBBF24]', border: 'border-[#FBBF24]/30' };
    return { bg: 'bg-[#3D1F1F]', text: 'text-[#F87171]', border: 'border-[#F87171]/30' };
};

interface AssessmentListProps {
    assessments?: Assessment[];
}

export const AssessmentList: React.FC<AssessmentListProps> = ({ assessments = mockAssessments }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const totalPages = Math.ceil(assessments.length / itemsPerPage);

    const currentAssessments = assessments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="flex flex-col gap-6">
            {/* Assessments Table */}
            <GlassPanel className="p-0 rounded-2xl overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[1fr_120px_120px_140px_140px_100px] gap-4 px-6 py-4 border-b border-white/10 bg-[#0D1320]">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Data Avaliação
                    </div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                        Peso (Kg)
                    </div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                        Gordura (%)
                    </div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                        Shape-V Score
                    </div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                        Assimetria Média
                    </div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                        Ações
                    </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-white/5">
                    {currentAssessments.map((assessment, index) => {
                        const scoreColors = getScoreColor(assessment.shapeVScore);

                        return (
                            <div
                                key={assessment.id}
                                className="grid grid-cols-[1fr_120px_120px_140px_140px_100px] gap-4 px-6 py-5 items-center hover:bg-white/[0.02] transition-colors group"
                            >
                                {/* Date Column */}
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white">
                                            {assessment.date}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {assessment.timeAgo}
                                        </div>
                                    </div>
                                </div>

                                {/* Weight */}
                                <div className="text-center">
                                    <span className="text-sm font-bold text-white">
                                        {assessment.weight.toFixed(1)} kg
                                    </span>
                                </div>

                                {/* Body Fat */}
                                <div className="text-center">
                                    <span className="text-sm font-bold text-white">
                                        {assessment.bodyFat.toFixed(1)}%
                                    </span>
                                </div>

                                {/* Shape-V Score */}
                                <div className="flex justify-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${scoreColors.bg} ${scoreColors.text} border ${scoreColors.border}`}>
                                        {assessment.shapeVScore.toFixed(1)} / 10
                                    </span>
                                </div>

                                {/* Asymmetry */}
                                <div className="text-center">
                                    <span className="text-sm font-bold text-primary">
                                        {assessment.asymmetryAvg.toFixed(1)}%
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                                        title="Visualizar"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                                        title="Editar"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                        title="Excluir"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Table Footer - Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#0D1320]">
                    <div className="text-xs text-gray-500">
                        Mostrando 1 a {currentAssessments.length} de {assessments.length} registros
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-white/10 text-gray-500 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === page
                                    ? 'bg-primary text-[#0A0F1C]'
                                    : 'border border-white/10 text-gray-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-white/10 text-gray-500 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </GlassPanel>

            {/* Bottom Cards Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Insight Card */}
                <GlassPanel className="p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-secondary/50" />

                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Sparkles className="text-primary" size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                                Insight Rápido
                            </h3>
                        </div>
                    </div>

                    <p className="text-sm text-gray-400 leading-relaxed">
                        Sua <span className="text-primary font-semibold">Assimetria Média</span> reduziu{' '}
                        <span className="text-primary font-bold">1,0%</span> nos últimos 3 meses. Ótimo trabalho corrigindo o lado esquerdo.
                    </p>

                    <div className="flex items-center gap-2 mt-4">
                        <TrendingDown size={14} className="text-primary" />
                        <span className="text-xs text-primary font-bold">Tendência de Melhoria</span>
                    </div>
                </GlassPanel>

                {/* Next Assessment Card */}
                <GlassPanel className="p-6 rounded-2xl relative overflow-hidden">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                Próxima Avaliação
                            </div>
                            <div className="text-3xl font-bold text-white tracking-tight">
                                15 Nov 2023
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                Faltam 30 dias
                            </div>
                        </div>

                        <button className="w-12 h-12 rounded-xl bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/30 flex items-center justify-center transition-all group">
                            <CalendarPlus size={24} className="text-gray-500 group-hover:text-primary transition-colors" />
                        </button>
                    </div>

                    {/* Progress bar to next assessment */}
                    <div className="mt-6">
                        <div className="flex justify-between text-xs text-gray-500 mb-2">
                            <span>Última: 15 Out</span>
                            <span>Próxima: 15 Nov</span>
                        </div>
                        <div className="h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                                style={{ width: '50%' }}
                            />
                        </div>
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
};

export default AssessmentList;
