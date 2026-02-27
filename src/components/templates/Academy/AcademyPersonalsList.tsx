import React, { useState } from 'react';
import { Search, Plus, Filter, MoreVertical, GraduationCap, Mail, Phone, Calendar, UserCheck, ArrowUpRight } from 'lucide-react';
import { useDataStore } from '@/stores/dataStore';

interface AcademyPersonalsListProps {
    onSelectPersonal?: (id: string) => void;
    onInvitePersonal?: () => void;
}

export const AcademyPersonalsList: React.FC<AcademyPersonalsListProps> = ({
    onSelectPersonal,
    onInvitePersonal,
}) => {
    const { personals } = useDataStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

    const filteredPersonals = personals.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex-1 p-4 md:p-8 flex flex-col w-full">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10 flex-1 w-full">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">
                            PERSONAIS DA ACADEMIA
                        </h1>
                        <p className="text-gray-400 mt-2 font-light">
                            Gerencie os profissionais de educação física vinculados à sua unidade.
                        </p>
                    </div>
                    <button
                        onClick={onInvitePersonal}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-background-dark font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,201,167,0.2)]"
                    >
                        <Plus size={20} />
                        CONVIDAR PERSONAL
                    </button>
                </div>

                <div className="h-px w-full bg-white/10" />

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar personal por nome..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-1 flex">
                            {(['all', 'active', 'inactive'] as const).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${filterStatus === status
                                        ? 'bg-primary/20 text-primary'
                                        : 'text-gray-500 hover:text-gray-300'
                                        }`}
                                >
                                    {status === 'all' ? 'Todos' : status === 'active' ? 'Ativos' : 'Inativos'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Personals Table/Grid */}
                <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-card-border bg-white/[0.02]">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Personal</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Alunos</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Score Alunos</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredPersonals.map((personal) => (
                                    <tr key={personal.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary font-bold border border-white/10">
                                                    {personal.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-white font-semibold group-hover:text-primary transition-colors">{personal.name}</p>
                                                    <p className="text-xs text-gray-500">CREF: 012345-G/SP</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-white font-medium">{personal.athleteCount}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="text-primary font-bold">{personal.averageStudentScore}</span>
                                                <div className="w-16 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary"
                                                        style={{ width: `${personal.averageStudentScore}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${personal.status === 'active'
                                                ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                                                }`}>
                                                {personal.status === 'active' ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => onSelectPersonal && onSelectPersonal(personal.id)}
                                                    className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-primary transition-all"
                                                    title="Ver Detalhes"
                                                >
                                                    <ArrowUpRight size={18} />
                                                </button>
                                                <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredPersonals.length === 0 && (
                        <div className="py-20 flex flex-col items-center justify-center text-gray-500">
                            <GraduationCap size={48} className="mb-4 opacity-20" />
                            <p>Nenhum personal encontrado com esses filtros.</p>
                        </div>
                    )}

                    <div className="px-6 py-4 bg-white/[0.01] border-t border-card-border flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                            Mostrando <span className="text-gray-300 font-medium">{filteredPersonals.length}</span> de <span className="text-gray-300 font-medium">{personals.length}</span> personais
                        </p>
                        <div className="flex gap-2">
                            <button disabled className="px-3 py-1 rounded border border-white/10 text-xs text-gray-600 disabled:opacity-50">Anterior</button>
                            <button disabled className="px-3 py-1 rounded border border-white/10 text-xs text-gray-600 disabled:opacity-50">Próximo</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
