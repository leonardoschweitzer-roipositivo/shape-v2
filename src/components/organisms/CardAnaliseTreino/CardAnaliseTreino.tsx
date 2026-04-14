/**
 * CardAnaliseTreino — Card de análise pós-treino
 *
 * Renderiza abaixo do CardTreino quando `treino.status === 'completo'`.
 * Mostra gasto calórico, volume, musculatura atingida e análise do coach (IA Gemini).
 */
import React, { useEffect, useState } from 'react'
import { Sparkles, Flame, Dumbbell, Target, TrendingUp } from 'lucide-react'
import type { WorkoutOfDay } from '@/types/athlete-portal'
import { gerarAnaliseTreino, type AnaliseTreino } from '@/services/analiseTreinoIA'

interface CardAnaliseTreinoProps {
    treino: WorkoutOfDay
    pesoAlunoKg?: number
}

export function CardAnaliseTreino({ treino, pesoAlunoKg }: CardAnaliseTreinoProps) {
    const [analise, setAnalise] = useState<AnaliseTreino | null>(null)
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        let ativo = true
        setCarregando(true)
        gerarAnaliseTreino(treino, pesoAlunoKg)
            .then(result => {
                if (ativo) setAnalise(result)
            })
            .finally(() => {
                if (ativo) setCarregando(false)
            })
        return () => { ativo = false }
    }, [treino.id, pesoAlunoKg])

    if (carregando && !analise) {
        return (
            <div className="bg-indigo-500/5 rounded-2xl p-6 border border-indigo-500/20 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full bg-indigo-500/20 flex items-center justify-center">
                        <Sparkles size={16} className="text-indigo-400" />
                    </div>
                    <div className="flex-1">
                        <div className="h-3 bg-indigo-500/20 rounded w-40 mb-2" />
                        <div className="h-2 bg-indigo-500/10 rounded w-28" />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="h-2 bg-white/5 rounded w-full" />
                    <div className="h-2 bg-white/5 rounded w-5/6" />
                    <div className="h-2 bg-white/5 rounded w-4/6" />
                </div>
            </div>
        )
    }

    if (!analise) return null

    return (
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 rounded-2xl p-6 border border-indigo-500/20">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={16} className="text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wide">ANÁLISE DO TREINO</h3>
                    <p className="text-[11px] text-indigo-400/60">Coach IA · avaliação da sua sessão</p>
                </div>
            </div>

            {/* Métricas principais */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                        <Flame size={14} className="text-orange-400" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Gasto calórico</span>
                    </div>
                    <p className="text-lg font-black text-white">
                        {analise.gastoCaloricoKcal}
                        <span className="text-xs font-bold text-gray-500 ml-1">kcal</span>
                    </p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                        <Dumbbell size={14} className="text-amber-400" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Volume total</span>
                    </div>
                    <p className="text-lg font-black text-white">
                        {analise.volumeTotalKg > 0 ? analise.volumeTotalKg.toLocaleString('pt-BR') : '—'}
                        <span className="text-xs font-bold text-gray-500 ml-1">kg</span>
                    </p>
                </div>
            </div>

            {/* Musculatura atingida */}
            {analise.musculaturas.length > 0 && (
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Target size={12} className="text-indigo-400" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Musculatura atingida</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {analise.musculaturas.map((m) => (
                            <span
                                key={m}
                                className="text-[11px] font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-md px-2 py-1"
                            >
                                {m}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Destaque */}
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 mb-3">
                <p className="text-sm font-semibold text-indigo-100 leading-snug">
                    "{analise.destaque}"
                </p>
            </div>

            {/* Observação do coach */}
            <div className="mb-3">
                <p className="text-[13px] text-gray-300 leading-relaxed">
                    {analise.observacao}
                </p>
            </div>

            {/* Recomendação próximo treino */}
            <div className="flex items-start gap-2 pt-3 border-t border-white/5">
                <TrendingUp size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-wider mb-0.5">
                        Próximo treino deste grupo
                    </p>
                    <p className="text-[13px] text-gray-300 leading-relaxed">
                        {analise.recomendacaoProximo}
                    </p>
                </div>
            </div>
        </div>
    )
}
