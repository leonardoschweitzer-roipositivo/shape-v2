import React from 'react';
import { AssessmentForm } from './AssessmentForm';
import { Activity } from 'lucide-react';

interface AssessmentPageProps {
    onConfirm: () => void;
}

export const AssessmentPage: React.FC<AssessmentPageProps> = ({ onConfirm }) => {
    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar flex flex-col">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10 flex-1 w-full">
                {/* Page Title */}
                <div className="flex flex-col animate-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">AVALIAÇÃO IA</h2>
                    <p className="text-gray-400 mt-2 font-light">Insira seus dados para uma análise completa de simetria e proporção.</p>
                </div>

                <div className="h-px w-full bg-white/10" />

                {/* Form Card */}
                <div className="bg-[#131B2C] border border-white/10 rounded-2xl shadow-2xl p-6 md:p-10 animate-fade-in-up">
                    {/* Internal Form Header - Match design from Image 0 */}
                    <div className="mb-10 flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <Activity className="text-primary" size={20} />
                                <h2 className="text-xl font-bold text-white tracking-wide uppercase">MEDIDAS CORPORAIS</h2>
                            </div>
                            <p className="text-sm text-gray-400">Insira os dados métricos para análise de simetria bilateral e proporção áurea.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="px-3 py-1 rounded border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold tracking-widest">
                                PROTOCOLO V.2.0
                            </span>
                        </div>
                    </div>

                    <AssessmentForm onConfirm={onConfirm} isModal={false} />
                </div>
            </div>
        </div>
    );
};
