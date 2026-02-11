import React, { useState } from 'react';
import { Search, ChevronRight, User } from 'lucide-react';
import { PersonalAthlete } from '@/mocks/personal';
import { useDataStore } from '@/stores/dataStore';

interface PersonalAthleteSelectorProps {
    onSelect: (athlete: PersonalAthlete) => void;
}

export const PersonalAthleteSelector: React.FC<PersonalAthleteSelectorProps> = ({ onSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const athletes = useDataStore((s) => s.personalAthletes);

    const filteredAthletes = athletes.filter(
        (a) =>
            a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Buscar aluno por nome ou e-mail..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#0E1424] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredAthletes.map((athlete) => (
                    <button
                        key={athlete.id}
                        onClick={() => onSelect(athlete)}
                        className="flex items-center gap-4 p-4 bg-[#0E1424] border border-white/5 hover:border-primary/30 rounded-xl transition-all group text-left"
                    >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/5 flex items-center justify-center text-lg shadow-inner">
                            <User size={20} className="text-primary group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium truncate uppercase tracking-tight text-sm">{athlete.name}</h4>
                            <p className="text-xs text-gray-500 truncate">{athlete.email}</p>
                        </div>
                        <ChevronRight size={18} className="text-gray-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </button>
                ))}
            </div>

            {filteredAthletes.length === 0 && (
                <div className="text-center py-8 bg-[#0E1424] rounded-xl border border-dashed border-white/10">
                    <p className="text-gray-500 text-sm">Nenhum aluno encontrado.</p>
                </div>
            )}
        </div>
    );
};
