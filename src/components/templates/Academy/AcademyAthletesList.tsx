import React, { useState, useMemo } from 'react';
import { Users } from 'lucide-react';
import { SearchBar } from '@/components/molecules/SearchBar';
import { FilterPanel } from '@/components/organisms/FilterPanel';
import { CardAlunoLista } from '@/components/molecules/CardAlunoLista';
import { mockAcademyAthletesList } from '@/mocks/academyAthletes';
import type { FiltrosListaAlunos, AlunoResumo } from '@/types/academy';

export interface AcademyAthletesListProps {
    onSelectAthlete: (id: string) => void;
    onViewEvolution: (id: string) => void;
}

export const AcademyAthletesList: React.FC<AcademyAthletesListProps> = ({
    onSelectAthlete,
    onViewEvolution
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filtros, setFiltros] = useState<FiltrosListaAlunos>({
        personal: 'todos',
        status: 'todos',
        classificacao: 'todas',
        ordenarPor: 'ultima_avaliacao_desc',
        periodo: 'todos'
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Aplicar filtros e ordenação
    const alunosFiltrados = useMemo(() => {
        let resultados = [...mockAcademyAthletesList.alunos];

        // Filtro por busca de nome
        if (searchTerm) {
            resultados = resultados.filter(a =>
                a.nome.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtro por Personal
        if (filtros.personal !== 'todos') {
            resultados = resultados.filter(a => a.personalId === filtros.personal);
        }

        // Filtro por Status
        if (filtros.status !== 'todos') {
            if (filtros.status === 'ativos') {
                resultados = resultados.filter(a => a.status === 'ATIVO');
            } else if (filtros.status === 'inativos') {
                resultados = resultados.filter(a => a.status === 'INATIVO');
            }
        }

        // Filtro por Classificação
        if (filtros.classificacao !== 'todas') {
            resultados = resultados.filter(a =>
                a.ultimaAvaliacao?.classificacao === filtros.classificacao
            );
        }

        // Filtro por Período
        if (filtros.periodo !== 'todos') {
            const hoje = new Date('2026-02-10');
            resultados = resultados.filter(a => {
                if (!a.ultimaAvaliacao) return false;
                const diff = hoje.getTime() - a.ultimaAvaliacao.data.getTime();
                const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

                switch (filtros.periodo) {
                    case 'ultimos_7_dias': return dias <= 7;
                    case 'ultimos_30_dias': return dias <= 30;
                    case 'mais_30_dias': return dias > 30;
                    default: return true;
                }
            });
        }

        // Ordenação
        switch (filtros.ordenarPor) {
            case 'ultima_avaliacao_desc':
                resultados.sort((a, b) => {
                    if (!a.ultimaAvaliacao) return 1;
                    if (!b.ultimaAvaliacao) return -1;
                    return b.ultimaAvaliacao.data.getTime() - a.ultimaAvaliacao.data.getTime();
                });
                break;
            case 'ultima_avaliacao_asc':
                resultados.sort((a, b) => {
                    if (!a.ultimaAvaliacao) return 1;
                    if (!b.ultimaAvaliacao) return -1;
                    return a.ultimaAvaliacao.data.getTime() - b.ultimaAvaliacao.data.getTime();
                });
                break;
            case 'score_desc':
                resultados.sort((a, b) => {
                    const scoreA = a.ultimaAvaliacao?.score || 0;
                    const scoreB = b.ultimaAvaliacao?.score || 0;
                    return scoreB - scoreA;
                });
                break;
            case 'score_asc':
                resultados.sort((a, b) => {
                    const scoreA = a.ultimaAvaliacao?.score || 0;
                    const scoreB = b.ultimaAvaliacao?.score || 0;
                    return scoreA - scoreB;
                });
                break;
            case 'nome_asc':
                resultados.sort((a, b) => a.nome.localeCompare(b.nome));
                break;
            case 'nome_desc':
                resultados.sort((a, b) => b.nome.localeCompare(a.nome));
                break;
        }

        return resultados;
    }, [searchTerm, filtros]);

    // Paginação
    const totalPages = Math.ceil(alunosFiltrados.length / itemsPerPage);
    const alunosPaginados = alunosFiltrados.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Totais
    const totalAtivos = mockAcademyAthletesList.alunos.filter(a => a.status === 'ATIVO').length;
    const totalInativos = mockAcademyAthletesList.alunos.filter(a => a.status === 'INATIVO').length;

    return (
        <div className="flex-1 p-4 md:p-8 flex flex-col w-full">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10 flex-1 w-full animate-fade-in-up">
                {/* Header com totais */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Users className="w-8 h-8 text-primary" />
                        <h1 className="text-3xl font-bold text-white tracking-tight uppercase">ALUNOS</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-card-dark border border-card-border rounded-xl p-5 hover:border-primary/30 transition-all">
                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Total de Alunos</div>
                            <div className="text-3xl font-bold text-white tracking-tighter">{mockAcademyAthletesList.totalAlunos}</div>
                        </div>
                        <div className="bg-card-dark border border-card-border rounded-xl p-5 hover:border-primary/30 transition-all">
                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Ativos</div>
                            <div className="text-3xl font-bold text-primary tracking-tighter">{totalAtivos}</div>
                        </div>
                        <div className="bg-card-dark border border-card-border rounded-xl p-5 hover:border-primary/30 transition-all">
                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Inativos</div>
                            <div className="text-3xl font-bold text-red-500/80 tracking-tighter">{totalInativos}</div>
                        </div>
                    </div>
                </div>

                <div className="h-px w-full bg-white/10" />

                {/* Busca e Filtros */}
                <div className="space-y-6">
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Buscar aluno por nome..."
                    />

                    <FilterPanel
                        filtros={filtros}
                        onChange={setFiltros}
                        personaisDisponiveis={mockAcademyAthletesList.personaisDisponiveis}
                    />
                </div>

                <div className="h-px w-full bg-white/10" />

                {/* Lista de alunos */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                            Mostrando <span className="text-white font-medium">{alunosPaginados.length}</span> de <span className="text-white font-medium">{alunosFiltrados.length}</span> alunos
                            {searchTerm && ` (buscando por "${searchTerm}")`}
                        </div>
                    </div>

                    {alunosPaginados.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {alunosPaginados.map(aluno => (
                                <CardAlunoLista
                                    key={aluno.id}
                                    aluno={aluno}
                                    onVerDetalhes={onSelectAthlete}
                                    onVerEvolucao={onViewEvolution}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-card-dark border border-dashed border-card-border rounded-2xl">
                            <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-500">Nenhum aluno encontrado com os filtros aplicados.</p>
                        </div>
                    )}
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-8">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-3 bg-card-dark border border-card-border rounded-xl text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary transition-all"
                        >
                            ←
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-12 h-12 border rounded-xl font-bold transition-all ${currentPage === page
                                    ? 'bg-primary text-background-dark border-primary'
                                    : 'bg-card-dark text-white border-card-border hover:border-primary'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-3 bg-card-dark border border-card-border rounded-xl text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary transition-all"
                        >
                            →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
