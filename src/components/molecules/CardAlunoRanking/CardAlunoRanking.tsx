import React from 'react'
import { ChevronRight } from 'lucide-react'

export interface CardAlunoRankingProps {
    posicao: number
    medalha?: '🥇' | '🥈' | '🥉'
    aluno: {
        id?: string
        nome: string
        fotoUrl?: string
        score: number
        classificacao: string
        emoji: string
    }
    onVerDetalhes: () => void
}

/**
 * Card de aluno para ranking (Top Alunos)
 * Design refinado: minimalista e elegante.
 */
export const CardAlunoRanking: React.FC<CardAlunoRankingProps> = ({
    posicao,
    medalha,
    aluno,
    onVerDetalhes
}) => {
    return (
        <div
            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/10 transition-all group cursor-pointer"
            onClick={onVerDetalhes}
        >
            {/* Posição / Medalha */}
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/5 font-black text-white italic tracking-tighter">
                {medalha ? (
                    <span className="text-2xl filter drop-shadow-md">{medalha}</span>
                ) : (
                    <span className="text-sm opacity-50">{posicao}º</span>
                )}
            </div>

            {/* Foto */}
            <div className="flex-shrink-0">
                {aluno.fotoUrl ? (
                    <img
                        src={aluno.fotoUrl}
                        alt={aluno.nome}
                        className="w-10 h-10 rounded-lg object-cover border border-white/10 group-hover:border-primary/30 transition-all"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 flex items-center justify-center">
                        <span className="text-primary font-bold text-sm uppercase">
                            {aluno.nome.charAt(0)}
                        </span>
                    </div>
                )}
            </div>

            {/* Informações */}
            <div className="flex-1 min-w-0">
                <h4 className="text-white font-bold uppercase tracking-tight truncate leading-none mb-1 group-hover:text-primary transition-colors">
                    {aluno.nome}
                </h4>
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] opacity-70 group-hover:opacity-100 transition-opacity">{aluno.emoji}</span>
                    <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">{aluno.classificacao}</span>
                </div>
            </div>

            {/* Score */}
            <div className="flex-shrink-0 text-right px-4">
                <div className="text-xl font-black text-white tracking-tighter leading-none">
                    {aluno.score}
                </div>
                <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                    pontos
                </div>
            </div>

            {/* Seta */}
            <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 group-hover:text-primary group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                    <ChevronRight className="w-4 h-4" />
                </div>
            </div>
        </div>
    )
}
