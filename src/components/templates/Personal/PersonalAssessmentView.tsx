import React, { useState } from 'react';
import { Activity, User, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AssessmentForm } from '@/components/organisms/AssessmentForm';
import { PersonalAthleteSelector } from './PersonalAthleteSelector';
import { PersonalAthlete } from '@/mocks/personal';
import { calculateAge } from '@/utils/dateUtils';

interface PersonalAssessmentViewProps {
    onConfirm: (data: {
        studentId: string;
        gender: 'male' | 'female';
        studentName: string;
        measurements: any;
        skinfolds: any;
        age?: number;
    }) => void;
    initialAthlete?: PersonalAthlete | null;
}

export const PersonalAssessmentView: React.FC<PersonalAssessmentViewProps> = ({ onConfirm, initialAthlete }) => {
    const [selectedAthlete, setSelectedAthlete] = useState<PersonalAthlete | null>(initialAthlete || null);

    const handleConfirm = (formData: { measurements: any; skinfolds: any; age?: number }) => {
        if (!selectedAthlete) return;

        const gender: 'male' | 'female' = selectedAthlete.gender === 'FEMALE' ? 'female' : 'male';

        onConfirm({
            studentId: selectedAthlete.id,
            studentName: selectedAthlete.name,
            gender: gender,
            measurements: formData.measurements,
            skinfolds: formData.skinfolds,
            age: formData.age || athleteAge
        });
    };

    const athleteAge = selectedAthlete ? calculateAge(selectedAthlete.birthDate) : undefined;

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar flex flex-col">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10 flex-1 w-full">
                {/* Page Title */}
                <div className="flex flex-col animate-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">REALIZAR AVALIAÇÃO</h2>
                    <p className="text-gray-400 mt-2 font-light">Selecione o aluno e insira os dados métricos para uma análise completa.</p>
                </div>

                <div className="h-px w-full bg-white/10" />

                {!selectedAthlete ? (
                    /* Step 1: Select Athlete */
                    <div className="bg-[#131B2C] border border-white/10 rounded-2xl shadow-2xl p-6 md:p-10 animate-fade-in-up">
                        <div className="mb-10 flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <User className="text-primary" size={20} />
                                    <h2 className="text-xl font-bold text-white tracking-wide uppercase">SELECIONAR ALUNO</h2>
                                </div>
                                <p className="text-sm text-gray-400">Escolha para qual aluno deseja realizar a avaliação agora.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1 rounded border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold tracking-widest uppercase">
                                    PASSO 1 DE 2
                                </span>
                            </div>
                        </div>

                        <PersonalAthleteSelector onSelect={setSelectedAthlete} />
                    </div>
                ) : (
                    /* Step 2: Assessment Form */
                    <div className="bg-[#131B2C] border border-white/10 rounded-2xl shadow-2xl p-6 md:p-10 animate-fade-in-up">
                        <div className="mb-10 flex items-start justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setSelectedAthlete(null)}
                                    className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                                >
                                    <ArrowLeft size={18} />
                                </button>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <Activity className="text-primary" size={20} />
                                        <h2 className="text-xl font-bold text-white tracking-wide uppercase">DADOS DE {selectedAthlete.name}</h2>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-gray-400">Preencha as medidas corporais coletadas para análise de simetria.</p>
                                        <span className="text-[10px] font-bold bg-white/5 border border-white/10 px-2 py-0.5 rounded text-primary uppercase tracking-widest">
                                            {selectedAthlete.gender === 'FEMALE' ? 'Sexo: Feminino' : 'Sexo: Masculino'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs font-medium">
                                <CheckCircle2 size={14} />
                                ALUNO SELECIONADO
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1 rounded border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold tracking-widest uppercase">
                                    PASSO 2 DE 2
                                </span>
                            </div>
                        </div>

                        <AssessmentForm
                            onConfirm={handleConfirm}
                            isModal={false}
                            initialData={selectedAthlete.assessments?.[0] ? {
                                measurements: selectedAthlete.assessments[0].measurements,
                                skinfolds: selectedAthlete.assessments[0].skinfolds
                            } : undefined}
                            initialAge={athleteAge}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
