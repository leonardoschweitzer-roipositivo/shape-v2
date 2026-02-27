import React, { useState } from 'react';
import { TrendingUp, User, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Evolution } from '../Evolution';
import { PersonalAthleteSelector } from './PersonalAthleteSelector';
import { PersonalAthlete } from '@/mocks/personal';
import { useDataStore } from '@/stores/dataStore';
import { calculateAge } from '@/utils/dateUtils';

interface PersonalEvolutionViewProps {
    initialAthleteId?: string | null;
}

export const PersonalEvolutionView: React.FC<PersonalEvolutionViewProps> = ({ initialAthleteId }) => {
    const { personalAthletes } = useDataStore();
    const [selectedAthlete, setSelectedAthlete] = useState<PersonalAthlete | null>(() => {
        if (initialAthleteId) {
            return personalAthletes.find(a => a.id === initialAthleteId) || null;
        }
        return null;
    });

    React.useEffect(() => {
        if (initialAthleteId) {
            const athlete = personalAthletes.find(a => a.id === initialAthleteId);
            if (athlete) setSelectedAthlete(athlete);
        } else {
            // Optional: If initialAthleteId becomes null, do we want to reset? 
            // Ideally yes if we want to force selection, but usually this component mounts with a specific ID.
            // Let's keep current state if id is null/undefined to avoid resetting when just navigating back/forth if app state persists it differently.
            // But for the use case "Click Sidebar -> Show Selector", we might want to pass null.
            setSelectedAthlete(null);
        }
    }, [initialAthleteId, personalAthletes]);

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar flex flex-col">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10 flex-1 w-full">
                {/* Page Title */}
                <div className="flex flex-col animate-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">EVOLUÇÃO DOS ALUNOS</h2>
                    <p className="text-gray-400 mt-2 font-light">Selecione um aluno para analisar o progresso físico e histórico de medidas.</p>
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
                                <p className="text-sm text-gray-400">Escolha um aluno para visualizar seus gráficos de evolução.</p>
                            </div>
                        </div>

                        <PersonalAthleteSelector onSelect={setSelectedAthlete} />
                    </div>
                ) : (
                    /* Step 2: Evolution Charts */
                    <div className="flex flex-col gap-8 animate-fade-in">
                        <div className="bg-[#131B2C] border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setSelectedAthlete(null)}
                                    className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                                    title="Trocar Aluno"
                                >
                                    <ArrowLeft size={18} />
                                </button>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                        <User size={18} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">EVOLUÇÃO DE</p>
                                        <h3 className="text-white font-bold uppercase">{selectedAthlete.name}</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs font-medium">
                                <CheckCircle2 size={14} />
                                DADOS CARREGADOS
                            </div>
                        </div>

                        {/* Rendering the original Evolution component inside */}
                        {/* In a real app, we would pass athleteId to Evolution */}
                        <div className="-mx-4 md:-mx-8">
                            <Evolution
                                hideHeader={true}
                                gender={selectedAthlete.gender === 'FEMALE' ? 'FEMALE' : 'MALE'}
                                assessments={selectedAthlete.assessments}
                                age={selectedAthlete.birthDate ? calculateAge(selectedAthlete.birthDate) : undefined}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
