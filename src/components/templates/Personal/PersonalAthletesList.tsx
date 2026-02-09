import React, { useState, useMemo } from 'react';
import { Search, UserPlus, Eye, Activity, MoreVertical } from 'lucide-react';
import { mockPersonalAthletes, PersonalAthlete } from '@/mocks/personal';

interface PersonalAthletesListProps {
    onSelectAthlete: (athleteId: string) => void;
    onInviteAthlete: () => void;
    onRegisterMeasurement: (athleteId: string) => void;
}

type AthleteStatus = 'all' | 'active' | 'inactive' | 'attention';

export const PersonalAthletesList: React.FC<PersonalAthletesListProps> = ({
    onSelectAthlete,
    onInviteAthlete,
    onRegisterMeasurement,
}) => {
    // State for student details modal
    const [selectedStudentForDetails, setSelectedStudentForDetails] = useState<PersonalAthlete | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<AthleteStatus>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const athletes = mockPersonalAthletes;

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
        const ATHLETE_DATA = [
            { id: '1', name: 'João Silva', status: 'active', lastCheckin: 'Hoje, 09:30', plan: 'Pro', gender: 'male' },
            { id: '2', name: 'Maria Oliveira', status: 'active', lastCheckin: 'Ontem', plan: 'Basic', gender: 'female' },
            { id: '3', name: 'Pedro Santos', status: 'inactive', lastCheckin: 'Há 5 dias', plan: 'Pro', gender: 'male' },
            { id: '4', name: 'Ana Costa', status: 'active', lastCheckin: 'Hoje, 14:00', plan: 'Premium', gender: 'female' },
        ];
        const config = {
            active: {
                label: 'Ativo',
                color: 'bg-green-500/20 text-green-400 border-green-500/30',
                icon: '🟢',
            },
            inactive: {
                label: 'Inativo',
                color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
                icon: '🟡',
            },
            attention: {
                label: 'Atenção',
                color: 'bg-red-500/20 text-red-400 border-red-500/30',
                icon: '🔴',
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

    // Modal Component (Inline for simplicity, can be extracted later)
    const StudentDetailsModal = ({ athlete, onClose }: { athlete: PersonalAthlete; onClose: () => void }) => {
        const [activeTab, setActiveTab] = useState<'basic' | 'measurements' | 'history'>('basic');

        if (!athlete) return null;

        const latestAssessment = athlete.assessments?.[0];

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                <div className="bg-[#131B2C] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">

                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#1A2234]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xl">
                                {athlete.avatarUrl ? <img src={athlete.avatarUrl} alt={athlete.name} className="w-full h-full rounded-full" /> : '👤'}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white uppercase tracking-wide">{athlete.name}</h2>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <span>{athlete.email}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                    <span>{athlete.gender === 'MALE' ? 'Masculino' : athlete.gender === 'FEMALE' ? 'Feminino' : 'Outro'}</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                            ✕
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-white/5 bg-[#1A2234]/50">
                        <button
                            onClick={() => setActiveTab('basic')}
                            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'basic' ? 'border-primary text-primary bg-white/5' : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            Informações Básicas
                        </button>
                        <button
                            onClick={() => setActiveTab('measurements')}
                            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'measurements' ? 'border-primary text-primary bg-white/5' : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            Últimas Medidas
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'history' ? 'border-primary text-primary bg-white/5' : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            Histórico de Avaliações
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-[#0A0F1C]/30">

                        {/* Tab: Basic Info */}
                        {activeTab === 'basic' && (
                            <div className="animate-fade-in">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Resumo do Aluno</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    <div className="bg-[#0A0F1C] p-4 rounded-xl border border-white/5">
                                        <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">Score Atual</span>
                                        <div className="text-2xl font-bold text-white mt-1">{athlete.score}</div>
                                    </div>
                                    <div className="bg-[#0A0F1C] p-4 rounded-xl border border-white/5">
                                        <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">Ratio</span>
                                        <div className="text-2xl font-bold text-white mt-1">{athlete.ratio}</div>
                                    </div>
                                    <div className="bg-[#0A0F1C] p-4 rounded-xl border border-white/5">
                                        <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">Status</span>
                                        <div className="mt-1">{getStatusBadge(athlete.status)}</div>
                                    </div>
                                    <div className="bg-[#0A0F1C] p-4 rounded-xl border border-white/5">
                                        <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">Desde</span>
                                        <div className="text-lg font-medium text-white mt-1">{new Date(athlete.linkedSince).getFullYear()}</div>
                                    </div>
                                </div>

                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contato & Detalhes</h3>
                                <div className="bg-[#0A0F1C] p-6 rounded-xl border border-white/5 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <span className="text-gray-500 text-xs uppercase block mb-1">E-mail</span>
                                            <span className="text-white font-medium">{athlete.email}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 text-xs uppercase block mb-1">Telefone</span>
                                            <span className="text-white font-medium">-</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 text-xs uppercase block mb-1">Plano</span>
                                            <span className="text-white font-medium">Consultoria Pro</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 text-xs uppercase block mb-1">Último Check-in</span>
                                            <span className="text-white font-medium">{formatRelativeDate(athlete.lastMeasurement)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab: Latest Measurements */}
                        {activeTab === 'measurements' && (
                            <div className="animate-fade-in">
                                {latestAssessment ? (
                                    <>
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                Medidas de {new Date(latestAssessment.date).toLocaleDateString()}
                                            </h3>
                                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                                                Avaliação Mais Recente
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {/* Helper to render measurement item */}
                                            {Object.entries(latestAssessment.measurements).map(([key, value]) => (
                                                <div key={key} className="bg-[#0A0F1C] p-4 rounded-xl border border-white/5 flex justify-between items-center">
                                                    <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </span>
                                                    <span className="text-white font-mono font-bold text-lg">
                                                        {value} <span className="text-xs text-gray-500 font-normal">
                                                            {key === 'weight' ? 'kg' : 'cm'}
                                                        </span>
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-8 mb-4">Dobras Cutâneas</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {Object.entries(latestAssessment.skinfolds).map(([key, value]) => (
                                                <div key={key} className="bg-[#0A0F1C] p-3 rounded-xl border border-white/5 text-center">
                                                    <span className="text-white font-mono font-bold text-lg block">{value}mm</span>
                                                    <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">
                                                        {key}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-400">Nenhuma medida registrada recente.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab: History */}
                        {activeTab === 'history' && (
                            <div className="animate-fade-in space-y-4">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Histórico Completo</h3>
                                {athlete.assessments && athlete.assessments.length > 0 ? (
                                    athlete.assessments.map((assessment, index) => (
                                        <div key={assessment.id} className="bg-[#0A0F1C]/50 border border-white/5 rounded-xl p-5 hover:border-primary/30 transition-all group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded mb-2 inline-block">
                                                        AVALIAÇÃO {athlete.assessments.length - index}
                                                    </span>
                                                    <p className="text-white font-medium text-lg">
                                                        {new Date(assessment.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                    </p>
                                                </div>
                                                <button className="text-xs font-bold text-white uppercase border border-white/20 px-3 py-1.5 rounded hover:bg-white/5 transition-colors">
                                                    Ver Detalhes
                                                </button>
                                            </div>

                                            {/* Measurement Preview Grid */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-sm">
                                                <div className="bg-[#131B2C] p-2 rounded border border-white/5">
                                                    <span className="text-gray-500 text-[10px] block uppercase">Peso</span>
                                                    <span className="text-white font-mono">{assessment.measurements.weight}kg</span>
                                                </div>
                                                <div className="bg-[#131B2C] p-2 rounded border border-white/5">
                                                    <span className="text-gray-500 text-[10px] block uppercase">Cintura</span>
                                                    <span className="text-white font-mono">{assessment.measurements.waist}cm</span>
                                                </div>
                                                <div className="bg-[#131B2C] p-2 rounded border border-white/5">
                                                    <span className="text-gray-500 text-[10px] block uppercase">Quadril</span>
                                                    <span className="text-white font-mono">{assessment.measurements.hips}cm</span>
                                                </div>
                                                <div className="bg-[#131B2C] p-2 rounded border border-white/5">
                                                    <span className="text-gray-500 text-[10px] block uppercase">Peitoral</span>
                                                    <span className="text-white font-mono">{assessment.measurements.chest}cm</span>
                                                </div>
                                                <div className="bg-[#131B2C] p-2 rounded border border-white/5">
                                                    <span className="text-gray-500 text-[10px] block uppercase">% GC Est.</span>
                                                    <span className="text-white font-mono">12%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 bg-[#0A0F1C]/30 rounded-xl border border-white/5 border-dashed">
                                        <p className="text-gray-400">Nenhuma avaliação registrada.</p>
                                        <button
                                            onClick={() => {
                                                onClose();
                                                onRegisterMeasurement(athlete.id);
                                            }}
                                            className="mt-2 text-primary text-sm font-bold hover:underline"
                                        >
                                            Registrar Primeira Avaliação
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        );
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
                    <button
                        onClick={onInviteAthlete}
                        className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold flex items-center gap-2 transition-all hover:scale-105"
                    >
                        <UserPlus size={20} />
                        Convidar Aluno
                    </button>
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
                            className="w-full pl-12 pr-4 py-3 bg-card-bg border border-card-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    {/* Filtro por Status */}
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as AthleteStatus)}
                        className="px-4 py-3 bg-card-bg border border-card-border rounded-lg text-white focus:outline-none focus:border-primary transition-colors cursor-pointer"
                    >
                        <option value="all">Todos os Status</option>
                        <option value="active">Ativos</option>
                        <option value="inactive">Inativos</option>
                        <option value="attention">Precisam Atenção</option>
                    </select>
                </div>

                {/* Tabela de Alunos */}
                <div className="bg-card-bg border border-card-border rounded-xl overflow-hidden">
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
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-lg">
                                                    {athlete.avatarUrl ? <img src={athlete.avatarUrl} alt={athlete.name} className="w-full h-full rounded-full" /> : '👤'}
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
                                            <span className="text-white font-mono">{athlete.ratio}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-gray-300">{formatRelativeDate(athlete.lastMeasurement)}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center">{getStatusBadge(athlete.status)}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedStudentForDetails(athlete);
                                                    }}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Ver Perfil"
                                                >
                                                    <Eye size={18} className="text-gray-400 hover:text-primary" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onRegisterMeasurement(athlete.id);
                                                    }}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Registrar Medição"
                                                >
                                                    <Activity size={18} className="text-gray-400 hover:text-primary" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Mais Opções"
                                                >
                                                    <MoreVertical size={18} className="text-gray-400 hover:text-primary" />
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

            {/* Modal Injection */}
            {selectedStudentForDetails && (
                <StudentDetailsModal
                    athlete={selectedStudentForDetails}
                    onClose={() => setSelectedStudentForDetails(null)}
                />
            )}
        </div>
    );
};
