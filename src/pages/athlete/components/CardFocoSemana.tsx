import React from 'react'
import { Target, Play, CheckCircle, ChevronRight } from 'lucide-react'
import { CardFocoSemanaProps } from './HomeAtletaTypes'

export function CardFocoSemana({
    areaPrioritaria,
    diferencaCm,
    quantidadeTreinos,
    grupamentoFoco,
    proximoTreinoNome,
    temTreinoHoje,
    treinoConcluido,
    onVerTreino,
}: CardFocoSemanaProps) {
    const renderCTA = () => {
        if (treinoConcluido) {
            return (
                <button
                    disabled
                    className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-sm uppercase tracking-wider"
                >
                    <CheckCircle size={16} />
                    Treino de Hoje Concluído ✓
                </button>
            )
        }

        if (temTreinoHoje) {
            return (
                <button
                    onClick={onVerTreino}
                    className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm uppercase tracking-wider transition-all active:scale-[0.97] shadow-lg shadow-indigo-500/20"
                >
                    <Play size={14} />
                    VER TREINO DE HOJE: {proximoTreinoNome}
                </button>
            )
        }

        return (
            <button
                onClick={onVerTreino}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-sm uppercase tracking-wider border border-white/5 transition-all"
            >
                Ver Meu Plano de Treino
                <ChevronRight size={14} />
            </button>
        )
    }

    return (
        <div className="max-w-2xl mx-auto px-6 mt-4">
            <div className="p-5 bg-gradient-to-br from-[#0C1220] to-[#0A0F1C] rounded-2xl border border-white/5 shadow-xl">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                    <Target className="text-indigo-400" size={16} />
                    <span className="text-white font-black text-sm tracking-wider uppercase">
                        Foco desta Semana
                    </span>
                </div>

                {/* Descrição */}
                <p className="text-gray-300 text-sm leading-relaxed">
                    Seu <strong className="text-white">{areaPrioritaria}</strong> está{' '}
                    {diferencaCm && (
                        <strong className="text-orange-400">{diferencaCm}cm abaixo</strong>
                    )}{' '}
                    da proporção ideal. Esta semana o Coach IA preparou{' '}
                    <strong className="text-white">{quantidadeTreinos} treinos</strong> focados em{' '}
                    <strong className="text-white">{grupamentoFoco}</strong> para acelerar sua evolução.
                </p>

                {/* CTA */}
                {renderCTA()}
            </div>
        </div>
    )
}
