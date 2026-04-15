import { useEffect, useMemo, useState } from 'react'
import { LineChart, Loader2 } from 'lucide-react'
import type { PlanoTreino } from '@/services/calculations/treino'
import { buscarPlanoTreino } from '@/services/calculations/treino'
import type { SupaRegistroDiario } from '@/services/portal/portalTypes'
import {
    buscarHistoricoTreinos,
    calcularDataInicio,
    type PeriodoHistorico,
} from '@/services/personal/historicoTreinosService'
import { TreinoAccordion } from './TreinoAccordion'

interface CardHistoricoTreinosProps {
    atletaId: string
    /** Plano já carregado. Se omitido, o componente busca via buscarPlanoTreino. */
    planoTreino?: PlanoTreino | null
    /** 'card' aplica chrome de card mobile; 'plain' renderiza nu para encaixe em layouts desktop. */
    variant?: 'card' | 'plain'
}

const PERIODOS: { valor: PeriodoHistorico; label: string }[] = [
    { valor: '1m', label: '1m' },
    { valor: '3m', label: '3m' },
    { valor: '6m', label: '6m' },
    { valor: 'tudo', label: 'Tudo' },
]

export function CardHistoricoTreinos({ atletaId, planoTreino: planoExterno, variant = 'card' }: CardHistoricoTreinosProps) {
    const [periodo, setPeriodo] = useState<PeriodoHistorico>('3m')
    const [registros, setRegistros] = useState<SupaRegistroDiario[]>([])
    const [loading, setLoading] = useState(true)
    const [planoInterno, setPlanoInterno] = useState<PlanoTreino | null>(null)
    const planoFoiPassado = planoExterno !== undefined

    useEffect(() => {
        let cancelado = false
        setLoading(true)
        buscarHistoricoTreinos(atletaId, calcularDataInicio(periodo)).then((data) => {
            if (cancelado) return
            setRegistros(data)
            setLoading(false)
        })
        return () => { cancelado = true }
    }, [atletaId, periodo])

    useEffect(() => {
        if (planoFoiPassado) return
        let cancelado = false
        buscarPlanoTreino(atletaId).then((plano) => {
            if (!cancelado) setPlanoInterno(plano)
        })
        return () => { cancelado = true }
    }, [atletaId, planoFoiPassado])

    const planoTreino = planoFoiPassado ? planoExterno : planoInterno
    const treinos = useMemo(() => planoTreino?.treinos ?? [], [planoTreino])

    if (!planoTreino || treinos.length === 0) {
        return null
    }

    const seletor = (
        <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
            {PERIODOS.map((p) => (
                <button
                    key={p.valor}
                    onClick={() => setPeriodo(p.valor)}
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg transition-all ${periodo === p.valor
                        ? 'bg-white/10 text-white'
                        : 'text-gray-500 hover:text-gray-300'
                        }`}
                >
                    {p.label}
                </button>
            ))}
        </div>
    )

    const corpo = loading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-gray-500">
            <Loader2 size={14} className="animate-spin" />
            <span className="text-[11px] font-medium">Carregando histórico…</span>
        </div>
    ) : registros.length === 0 ? (
        <div className="py-10 text-center">
            <p className="text-[11px] text-gray-500 italic">
                Nenhum treino completado neste período.
            </p>
        </div>
    ) : (
        <div className="space-y-3">
            {treinos.map((treino, idx) => (
                <TreinoAccordion
                    key={treino.id}
                    treino={treino}
                    treinoIndex={idx}
                    registros={registros}
                />
            ))}
        </div>
    )

    if (variant === 'plain') {
        return (
            <div>
                <div className="flex justify-end mb-4">{seletor}</div>
                {corpo}
            </div>
        )
    }

    return (
        <div className="bg-surface-deep rounded-3xl p-5 border border-white/5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <LineChart size={16} className="text-emerald-400" />
                    </div>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                        Histórico de Treinos
                    </h3>
                </div>
                {seletor}
            </div>
            {corpo}
        </div>
    )
}
