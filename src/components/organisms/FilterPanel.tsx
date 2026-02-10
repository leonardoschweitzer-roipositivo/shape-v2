import React from 'react';
import type { FiltrosListaAlunos } from '@/types/academy';

export interface FilterPanelProps {
    filtros: FiltrosListaAlunos;
    onChange: (filtros: FiltrosListaAlunos) => void;
    personaisDisponiveis: { id: string; nome: string }[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
    filtros,
    onChange,
    personaisDisponiveis
}) => {
    const handleChange = (key: keyof FiltrosListaAlunos, value: string) => {
        onChange({ ...filtros, [key]: value });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Filtro por Personal */}
            <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">PERSONAL</label>
                <select
                    value={filtros.personal}
                    onChange={(e) => handleChange('personal', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-all font-light"
                >
                    <option value="todos">Todos</option>
                    {personaisDisponiveis.map(p => (
                        <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                </select>
            </div>

            {/* Filtro por Status */}
            <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">STATUS</label>
                <select
                    value={filtros.status}
                    onChange={(e) => handleChange('status', e.target.value as any)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-all font-light"
                >
                    <option value="todos">Todos</option>
                    <option value="ativos">Ativos</option>
                    <option value="inativos">Inativos</option>
                </select>
            </div>

            {/* Filtro por Classificação */}
            <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">CLASSIFICAÇÃO</label>
                <select
                    value={filtros.classificacao}
                    onChange={(e) => handleChange('classificacao', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-all font-light"
                >
                    <option value="todas">Todas</option>
                    <option value="ELITE">ELITE 👑</option>
                    <option value="META">META 🎯</option>
                    <option value="QUASE_LA">QUASE LÁ 💪</option>
                    <option value="CAMINHO">CAMINHO 🛤️</option>
                    <option value="INICIO">INÍCIO 🚀</option>
                </select>
            </div>

            {/* Ordenar por */}
            <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">ORDENAR POR</label>
                <select
                    value={filtros.ordenarPor}
                    onChange={(e) => handleChange('ordenarPor', e.target.value as any)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-all font-light"
                >
                    <option value="ultima_avaliacao_desc">Última avaliação (mais recente)</option>
                    <option value="ultima_avaliacao_asc">Última avaliação (mais antiga)</option>
                    <option value="score_desc">Score (maior)</option>
                    <option value="score_asc">Score (menor)</option>
                    <option value="nome_asc">Nome (A-Z)</option>
                    <option value="nome_desc">Nome (Z-A)</option>
                </select>
            </div>

            {/* Período */}
            <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">PERÍODO</label>
                <select
                    value={filtros.periodo}
                    onChange={(e) => handleChange('periodo', e.target.value as any)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-all font-light"
                >
                    <option value="todos">Todos</option>
                    <option value="ultimos_7_dias">Últimos 7 dias</option>
                    <option value="ultimos_30_dias">Últimos 30 dias</option>
                    <option value="mais_30_dias">Mais de 30 dias</option>
                </select>
            </div>
        </div>
    );
};
