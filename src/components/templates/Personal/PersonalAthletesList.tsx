import React, { useState, useMemo } from 'react';
import { Search, UserPlus, Eye, Activity, MoreVertical, TrendingUp, ClipboardList, Trash2, AlertTriangle, X, User } from 'lucide-react';
import { mockPersonalAthletes, PersonalAthlete } from '@/mocks/personal';

interface PersonalAthletesListProps {
    onSelectAthlete: (athleteId: string) => void;
    onViewEvolution: (athleteId: string) => void;
    onInviteAthlete: () => void;
    onRegisterStudent: () => void;
    onRegisterMeasurement: (athleteId: string) => void;
    onViewLatestAssessment: (athleteId: string) => void;
    onDeleteAthlete?: (athleteId: string) => void;
    athletes?: PersonalAthlete[];
}

type AthleteStatus = 'all' | 'active' | 'inactive' | 'attention';

export const PersonalAthletesList: React.FC<PersonalAthletesListProps> = ({
    onSelectAthlete,
    onViewEvolution,
    onInviteAthlete,
    onRegisterStudent,
    onRegisterMeasurement,
    onViewLatestAssessment,
    onDeleteAthlete,
    athletes = mockPersonalAthletes,
}) => {
    const [athleteToDelete, setAthleteToDelete] = useState<PersonalAthlete | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    // State for student details modal

    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<AthleteStatus>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredAthletes = useMemo(() => {
        let result = athletes;

        // Filtro por status
        if (filter !== 'all') {
            result = result.filter((a) => a.status === filter);
        }

        // Filtro por busca
        if (searchQuery) {
            result = result.filter(
                (a) =>
                    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    a.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return result;
    }, [athletes, filter, searchQuery]);

    const paginatedAthletes = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredAthletes.slice(startIndex, endIndex);
    }, [filteredAthletes, currentPage]);

    const totalPages = Math.ceil(filteredAthletes.length / itemsPerPage);

    const getStatusBadge = (status: string) => {
        const config = {
            active: {
                label: 'Ativo',
                color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
                icon: '🟣',
            },
            inactive: {
                label: 'Inativo',
                color: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
                icon: '⚪',
            },
            attention: {
                label: 'Atenção',
                color: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
                icon: '🟠',
            },
        };

        const statusConfig = config[status as keyof typeof config] || config.active;

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color} flex items-center gap-1`}>
                <span>{statusConfig.icon}</span>
                {statusConfig.label}
            </span>
        );
    };

    const formatRelativeDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Hoje';
        if (diffDays === 1) return 'Ontem';
        if (diffDays < 7) return `${diffDays} dias`;
        return `${Math.floor(diffDays / 7)} semanas`;
    };

    return (
        <div className="flex-1 p-4 md:p-8 flex flex-col w-full">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10 flex-1 w-full">
                {/* Header Section */}
                <div className="flex items-center justify-between animate-fade-in-up">
                    <div className="flex flex-col">
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">MEUS ALUNOS</h1>
                        <p className="text-gray-400 mt-2 font-light">
                            {filteredAthletes.length} {filteredAthletes.length === 1 ? 'aluno' : 'alunos'} vinculados ao seu perfil
                        </p>
                    </div>
                </div>

                <div className="h-px w-full bg-white/10" />

                {/* Busca e Filtros */}
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Campo de Busca */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar aluno por nome ou email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    {/* Filtro por Status */}
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as AthleteStatus)}
                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary transition-colors cursor-pointer"
                    >
                        <option value="all">Todos os Status</option>
                        <option value="active">Ativos</option>
                        <option value="inactive">Inativos</option>
                        <option value="attention">Precisam Atenção</option>
                    </select>
                </div>

                {/* Tabela de Alunos */}
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5 border-b border-card-border">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Aluno
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Score
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Ratio
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Última Medição
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-card-border">
                                {paginatedAthletes.map((athlete) => (
                                    <tr
                                        key={athlete.id}
                                        className="hover:bg-white/5 transition-colors cursor-pointer"
                                        onClick={() => onSelectAthlete(athlete.id)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 overflow-hidden shadow-lg">
                                                    {athlete.avatarUrl ? <img src={athlete.avatarUrl} alt={athlete.name} className="w-full h-full object-cover" /> : <User size={24} />}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{athlete.name}</p>
                                                    <p className="text-sm text-gray-400">{athlete.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="text-white font-semibold text-lg">{athlete.score}</span>
                                                {athlete.scoreVariation !== 0 && (
                                                    <span
                                                        className={`text-sm ${athlete.scoreVariation > 0 ? 'text-green-500' : 'text-red-500'
                                                            }`}
                                                    >
                                                        ({athlete.scoreVariation > 0 ? '+' : ''}
                                                        {athlete.scoreVariation})
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-white font-mono">{typeof athlete.ratio === 'number' ? athlete.ratio.toFixed(2) : athlete.ratio}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-gray-300">{formatRelativeDate(athlete.lastMeasurement)}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center">{getStatusBadge(athlete.status)}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onSelectAthlete(athlete.id);
                                                    }}
                                                    className="flex flex-col items-center gap-0.5 p-1.5 hover:bg-white/10 rounded-lg transition-colors group"
                                                    title="Visualizar Ficha"
                                                >
                                                    <Eye size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                                                    <span className="text-[9px] text-gray-500 group-hover:text-primary transition-colors font-medium">Ficha</span>
                                                </button>

                                                {athlete.assessments && athlete.assessments.length > 0 && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onViewLatestAssessment(athlete.id);
                                                        }}
                                                        className="flex flex-col items-center gap-0.5 p-1.5 hover:bg-white/10 rounded-lg transition-colors group"
                                                        title="Visualizar Última Avaliação"
                                                    >
                                                        <Activity size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                                                        <span className="text-[9px] text-gray-500 group-hover:text-primary transition-colors font-medium">Resultado</span>
                                                    </button>
                                                )}

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setAthleteToDelete(athlete);
                                                    }}
                                                    className="flex flex-col items-center gap-0.5 p-1.5 hover:bg-rose-500/10 rounded-lg transition-colors group"
                                                    title="Excluir Aluno"
                                                >
                                                    <Trash2 size={16} className="text-gray-400 group-hover:text-rose-500 transition-colors" />
                                                    <span className="text-[9px] text-gray-500 group-hover:text-rose-500 transition-colors font-medium">Excluir</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginação */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-card-border flex items-center justify-between">
                            <p className="text-sm text-gray-400">
                                Mostrando {(currentPage - 1) * itemsPerPage + 1} a{' '}
                                {Math.min(currentPage * itemsPerPage, filteredAthletes.length)} de {filteredAthletes.length} alunos
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
                                >
                                    Anterior
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-4 py-2 rounded-lg transition-colors ${currentPage === page
                                            ? 'bg-primary text-white'
                                            : 'bg-white/5 hover:bg-white/10 text-gray-300'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
                                >
                                    Próxima
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Empty State */}
                {filteredAthletes.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-lg">Nenhum aluno encontrado</p>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="mt-4 text-primary hover:text-primary/80 transition-colors"
                            >
                                Limpar busca
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Modal de Confirmação de Exclusão */}
            {
                athleteToDelete && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                            onClick={() => !isDeleting && setAthleteToDelete(null)}
                        />
                        <div className="relative bg-zinc-900 border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-300">
                            <div className="p-6 pb-2 flex justify-between items-start">
                                <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center">
                                    <AlertTriangle className="text-rose-500" size={24} />
                                </div>
                                <button
                                    onClick={() => setAthleteToDelete(null)}
                                    className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 pt-2">
                                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Excluir Aluno</h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                    Tem certeza que deseja excluir <span className="text-white font-semibold">{athleteToDelete.name}</span>?
                                    <br />
                                    <span className="text-rose-500/80 font-medium">Esta ação é irreversível e apagará todo o histórico de medidas e avaliações.</span>
                                </p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setAthleteToDelete(null)}
                                        disabled={isDeleting}
                                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all disabled:opacity-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (onDeleteAthlete) {
                                                setIsDeleting(true);
                                                try {
                                                    await onDeleteAthlete(athleteToDelete.id);
                                                } finally {
                                                    setIsDeleting(false);
                                                    setAthleteToDelete(null);
                                                }
                                            }
                                        }}
                                        disabled={isDeleting}
                                        className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-rose-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isDeleting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Excluindo...
                                            </>
                                        ) : (
                                            'Sim, Excluir'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};
