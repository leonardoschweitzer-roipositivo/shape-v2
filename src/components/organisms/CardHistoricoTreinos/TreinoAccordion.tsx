import { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { TreinoDetalhado } from '@/services/calculations/treino'
import type { SupaRegistroDiario } from '@/services/portal/portalTypes'
import {
    derivarCargaPorExercicio,
    derivarVolumePorSessao,
    calcularDeltaCarga,
} from '@/services/personal/derivarMetricasTreino'
import { GraficoVolumeTreino } from '@/components/molecules/GraficoVolumeTreino/GraficoVolumeTreino'
import { GraficoCargaExercicio } from '@/components/molecules/GraficoCargaExercicio/GraficoCargaExercicio'

interface TreinoAccordionProps {
    treino: TreinoDetalhado
    treinoIndex: number
    registros: SupaRegistroDiario[]
}

interface ExercicioRow {
    id: string
    nome: string
}

function DeltaBadge({ delta }: { delta: number | null }) {
    if (delta === null) {
        return (
            <span className="inline-flex items-center gap-1 text-[9px] text-gray-500 font-bold">
                <Minus size={10} /> —
            </span>
        )
    }
    if (delta > 0) {
        return (
            <span className="inline-flex items-center gap-1 text-[9px] text-emerald-400 font-black">
                <TrendingUp size={10} /> +{delta}%
            </span>
        )
    }
    if (delta < 0) {
        return (
            <span className="inline-flex items-center gap-1 text-[9px] text-red-400 font-black">
                <TrendingDown size={10} /> {delta}%
            </span>
        )
    }
    return (
        <span className="inline-flex items-center gap-1 text-[9px] text-gray-400 font-bold">
            <Minus size={10} /> 0%
        </span>
    )
}

export function TreinoAccordion({ treino, treinoIndex, registros }: TreinoAccordionProps) {
    const [aberto, setAberto] = useState(false)
    const [exercicioAberto, setExercicioAberto] = useState<string | null>(null)

    const sessoes = useMemo(
        () => derivarVolumePorSessao(registros, treinoIndex),
        [registros, treinoIndex],
    )

    const exercicios: ExercicioRow[] = useMemo(() => {
        const rows: ExercicioRow[] = []
        treino.blocos.forEach((bloco, bIdx) => {
            bloco.exercicios.forEach((ex, eIdx) => {
                rows.push({
                    id: `ex-${bIdx}-${eIdx}`,
                    nome: ex.nome,
                })
            })
        })
        return rows
    }, [treino])

    return (
        <div
            className={`bg-surface-deep rounded-2xl border transition-all overflow-hidden ${aberto ? 'border-white/10 ring-1 ring-white/5' : 'border-white/5 hover:border-white/10'
                }`}
        >
            <button
                onClick={() => setAberto(!aberto)}
                className="w-full flex items-center justify-between p-4 text-left active:bg-white/5"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 text-gray-300 flex items-center justify-center font-black text-sm">
                        {treino.letra}
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-tight">{treino.nome}</h4>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                            {sessoes.length} {sessoes.length === 1 ? 'sessão' : 'sessões'} no período
                        </p>
                    </div>
                </div>
                {aberto ? <ChevronUp size={18} className="text-gray-600" /> : <ChevronDown size={18} className="text-gray-600" />}
            </button>

            {aberto && (
                <div className="px-4 pb-4 animate-in slide-in-from-top-1 duration-200">
                    <div className="h-px bg-white/5 mb-4" />

                    <div className="mb-4">
                        <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
                            Volume por sessão
                        </h5>
                        <GraficoVolumeTreino pontos={sessoes} />
                    </div>

                    <div>
                        <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
                            Carga por exercício
                        </h5>
                        <div className="bg-white/[0.02] rounded-xl border border-white/5 divide-y divide-white/5">
                            {exercicios.map((ex) => {
                                const pontos = derivarCargaPorExercicio(registros, treinoIndex, ex.id, ex.nome)
                                const delta = calcularDeltaCarga(pontos)
                                const estaAberto = exercicioAberto === ex.id
                                return (
                                    <div key={ex.id}>
                                        <button
                                            onClick={() => setExercicioAberto(estaAberto ? null : ex.id)}
                                            className="w-full p-3 flex items-center justify-between active:bg-white/5"
                                        >
                                            <div className="flex-1 min-w-0 pr-3 text-left">
                                                <div className="text-[11px] font-black text-gray-200 truncate uppercase">
                                                    {ex.nome}
                                                </div>
                                                <div className="mt-0.5 flex items-center gap-2">
                                                    <span className="text-[9px] text-gray-500 font-medium">
                                                        {pontos.length} {pontos.length === 1 ? 'sessão' : 'sessões'}
                                                    </span>
                                                    <DeltaBadge delta={delta} />
                                                </div>
                                            </div>
                                            {estaAberto ? <ChevronUp size={14} className="text-gray-600" /> : <ChevronDown size={14} className="text-gray-600" />}
                                        </button>
                                        {estaAberto && (
                                            <div className="px-3 pb-3">
                                                <GraficoCargaExercicio pontos={pontos} />
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
