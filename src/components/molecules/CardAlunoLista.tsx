import React from 'react';
import { TrendingUp, User } from 'lucide-react';
import { BarraScore } from './BarraScore';

export interface CardAlunoListaProps {
    aluno: {
        id: string;
        nome: string;
        fotoUrl?: string;
        personalNome: string;
        status: 'ATIVO' | 'INATIVO';
        ultimaAvaliacao?: {
            data: Date;
            score: number;
            classificacao: string;
        };
        diasDesdeUltimaAvaliacao: number;
    };
    onVerDetalhes: (id: string) => void;
    onVerEvolucao: (id: string) => void;
}

const getStatusConfig = (status: 'ATIVO' | 'INATIVO', diasDesdeAvaliacao: number) => {
    if (status === 'INATIVO') {
        return { label: 'INATIVO', emoji: '🔴', color: 'text-red-500' };
    }
    if (diasDesdeAvaliacao > 30) {
        return { label: '⚠️ ATENÇÃO', emoji: '⚠️', color: 'text-orange-500' };
    }
    return { label: 'ATIVO', emoji: '🟢', color: 'text-green-500' };
};

const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
};

export const CardAlunoLista: React.FC<CardAlunoListaProps> = ({
    aluno,
    onVerDetalhes,
    onVerEvolucao
}) => {
    const statusConfig = getStatusConfig(aluno.status, aluno.diasDesdeUltimaAvaliacao);
    const iniciais = aluno.nome
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div className="bg-card-dark border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-all group">
            <div className="flex items-start gap-5">
                {/* Avatar */}
                <div className="flex-shrink-0 relative">
                    {aluno.fotoUrl ? (
                        <img
                            src={aluno.fotoUrl}
                            alt={aluno.nome}
                            className="w-20 h-20 rounded-2xl object-cover border border-white/10"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-white/10 flex items-center justify-center">
                            <span className="text-xl font-bold text-primary">{iniciais}</span>
                        </div>
                    )}
                    <span className={`absolute -top-2 -right-2 w-4 h-4 rounded-full border-2 border-background-dark ${statusConfig.color.replace('text-', 'bg-')}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                        <div className="min-w-0 flex-1">
                            <h3 className="text-xl font-bold text-white truncate group-hover:text-primary transition-colors tracking-tight">{aluno.nome}</h3>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                                Personal: <span className="text-white font-medium">{aluno.personalNome}</span>
                            </p>
                        </div>
                    </div>

                    {/* Última Avaliação */}
                    {aluno.ultimaAvaliacao ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-widest">
                                <span>Última avaliação</span>
                                <span>{formatDate(aluno.ultimaAvaliacao.data)}</span>
                            </div>

                            <BarraScore
                                score={aluno.ultimaAvaliacao.score}
                                classificacao={aluno.ultimaAvaliacao.classificacao}
                            />
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic py-2">Sem avaliações registradas</p>
                    )}

                    {/* Botões de Ação */}
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button
                            onClick={() => onVerDetalhes(aluno.id)}
                            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn"
                        >
                            <User size={14} className="text-primary group-hover/btn:scale-110 transition-transform" />
                            Ficha
                        </button>
                        <button
                            onClick={() => onVerEvolucao(aluno.id)}
                            className="px-4 py-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-background-dark border border-primary/20 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn"
                        >
                            <TrendingUp size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                            Evolução
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
