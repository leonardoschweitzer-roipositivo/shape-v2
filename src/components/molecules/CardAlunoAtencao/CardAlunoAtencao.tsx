import React from 'react'
import { ChevronRight, AlertCircle, AlertTriangle } from 'lucide-react'

export interface CardAlunoAtencaoProps {
    aluno: {
        id?: string
        nome: string
        fotoUrl?: string
    }
    motivo: {
        icone: string
        descricao: string
        tipo: 'WARNING' | 'DANGER'
    }
    onVerDetalhes: () => void
}

/**
 * Card de aluno que precisa de atenção
 * Design refinado: minimalista e elegante com alertas contextuais.
 */
export const CardAlunoAtencao: React.FC<CardAlunoAtencaoProps> = ({
    aluno,
    motivo,
    onVerDetalhes
}) => {
    const isDanger = motivo.tipo === 'DANGER'

    return (
        <div
            className={`flex items-center gap-4 p-4 rounded-xl transition-all group cursor-pointer border ${isDanger
                    ? 'bg-red-500/5 border-red-500/10 hover:border-red-500/30 hover:bg-red-500/10'
                    : 'bg-yellow-500/5 border-yellow-500/10 hover:border-yellow-500/30 hover:bg-yellow-500/10'
                }`}
            onClick={onVerDetalhes}
        >
            {/* Ícone de alerta */}
            <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg border shadow-sm ${isDanger
                    ? 'bg-red-500/10 border-red-500/20 text-red-500'
                    : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                }`}>
                <span className="text-xl">{motivo.icone}</span>
            </div>

            {/* Foto */}
            <div className="flex-shrink-0">
                {aluno.fotoUrl ? (
                    <img
                        src={aluno.fotoUrl}
                        alt={aluno.nome}
                        className="w-10 h-10 rounded-lg object-cover border border-white/10"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                        <span className="text-gray-500 font-bold text-sm uppercase">
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
                <p className={`text-[10px] font-black uppercase tracking-widest ${isDanger ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                    {motivo.descricao}
                </p>
            </div>

            {/* Seta */}
            <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${isDanger
                        ? 'bg-red-500/10 border-red-500/10 text-red-500 group-hover:bg-red-500/20 group-hover:border-red-500/30'
                        : 'bg-yellow-500/10 border-yellow-500/10 text-yellow-500 group-hover:bg-yellow-500/20 group-hover:border-yellow-500/30'
                    }`}>
                    <ChevronRight className="w-4 h-4" />
                </div>
            </div>
        </div>
    )
}
