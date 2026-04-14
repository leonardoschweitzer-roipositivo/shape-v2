/**
 * BlocoPrescricaoSeries — Editor de prescrição detalhada série-a-série.
 *
 * Renderiza: inputs de top set + dropdown de template + botão IA + tabela editável.
 *
 * Uso dentro de SecaoTreinosEditavel, ativado via toggle "Prescrição detalhada".
 */

import React, { useState } from 'react'
import { Plus, Minus, Sparkles, Loader2, Trash2, HelpCircle } from 'lucide-react'
import type { Exercicio } from '@/services/calculations/treino'
import type { SeriePrescrita, TemplateId } from '@/types/prescricao'
import type { TipoSet } from '@/types/athlete-portal'
import { rampaClassica, topSetBackoff, piramideReversa, straightSets } from '@/services/prescricao/templates'
import { sugerirPrescricaoIA } from '@/services/prescricao/gerarViaIA'

const TIPO_OPTIONS: Array<{ value: TipoSet; label: string }> = [
    { value: 'aquecimento', label: 'Aquec' },
    { value: 'reconhecimento', label: 'Recon' },
    { value: 'valida', label: 'Válida' },
    { value: 'top', label: 'Top' },
    { value: 'backoff', label: 'Backoff' },
    { value: 'drop', label: 'Drop' },
    { value: 'falha', label: 'Falha' },
]

const TEMPLATE_OPTIONS: Array<{ value: TemplateId | ''; label: string }> = [
    { value: '', label: 'Aplicar template…' },
    { value: 'rampa-classica', label: 'Rampa clássica' },
    { value: 'top-set-backoff', label: 'Top + Backoff' },
    { value: 'piramide-reversa', label: 'Pirâmide reversa' },
    { value: 'straight-sets', label: 'Straight sets' },
]

interface BlocoPrescricaoSeriesProps {
    ex: Exercicio
    onUpdate: (ex: Exercicio) => void
    contextoIA?: {
        grupoMuscular?: string
        nivel?: 'iniciante' | 'intermediario' | 'avancado'
        objetivo?: string
        mesocicloNome?: string
        rpeAlvoMesociclo?: [number, number]
        volumeRelativo?: number
    }
}

export const BlocoPrescricaoSeries: React.FC<BlocoPrescricaoSeriesProps> = ({ ex, onUpdate, contextoIA }) => {
    const [iaLoading, setIaLoading] = useState(false)
    const series = ex.prescricaoSeries ?? []
    const topSetKg = ex.topSetKg ?? 0
    const topSetReps = ex.topSetReps ?? 8

    const setSeries = (novas: SeriePrescrita[]) => onUpdate({ ...ex, prescricaoSeries: novas })
    const setTop = (kg: number, reps: number) => onUpdate({ ...ex, topSetKg: kg, topSetReps: reps })

    const aplicarTemplate = (id: TemplateId) => {
        if (!topSetKg || topSetKg <= 0) {
            alert('Defina o top set alvo primeiro (kg e reps).')
            return
        }
        const totalSeries = series.length > 0 ? series.length : Math.max(4, ex.series || 5)
        let geradas: SeriePrescrita[] = []
        switch (id) {
            case 'rampa-classica':
                geradas = rampaClassica({ totalSeries, repsValida: topSetReps, topKg: topSetKg })
                break
            case 'top-set-backoff':
                geradas = topSetBackoff({
                    topKg: topSetKg,
                    repsTop: topSetReps,
                    repsBackoff: topSetReps + 2,
                    backoffSeries: Math.max(1, totalSeries - 4),
                    numAquec: 3,
                })
                break
            case 'piramide-reversa':
                geradas = piramideReversa({
                    topKg: topSetKg,
                    series: Math.max(2, totalSeries - 3),
                    repsTop: topSetReps,
                    numAquec: 3,
                })
                break
            case 'straight-sets':
                geradas = straightSets({ series: totalSeries, reps: topSetReps, cargaKg: topSetKg })
                break
        }
        setSeries(geradas)
    }

    const gerarIA = async () => {
        setIaLoading(true)
        try {
            const resultado = await sugerirPrescricaoIA({
                exercicioNome: ex.nome,
                grupoMuscular: contextoIA?.grupoMuscular,
                nivel: contextoIA?.nivel,
                objetivo: contextoIA?.objetivo,
                mesocicloNome: contextoIA?.mesocicloNome,
                rpeAlvoMesociclo: contextoIA?.rpeAlvoMesociclo,
                volumeRelativo: contextoIA?.volumeRelativo,
                topSetKg: topSetKg > 0 ? topSetKg : undefined,
                repsTop: topSetReps,
                totalSeriesDesejado: Math.max(4, series.length || ex.series || 5),
            })
            setSeries(resultado)
        } finally {
            setIaLoading(false)
        }
    }

    const updateSerie = (idx: number, patch: Partial<SeriePrescrita>) => {
        const novas = series.map((s, i) => (i === idx ? { ...s, ...patch } : s))
        setSeries(novas)
    }

    const addSerie = () => {
        const ultima = series[series.length - 1]
        const nova: SeriePrescrita = ultima
            ? { ...ultima, ordem: series.length + 1 }
            : { ordem: 1, tipo: 'valida', reps: topSetReps, cargaKg: topSetKg, descansoSegundos: 120 }
        setSeries([...series, nova])
    }

    const removeSerie = (idx: number) => {
        const novas = series.filter((_, i) => i !== idx).map((s, i) => ({ ...s, ordem: i + 1 }))
        setSeries(novas)
    }

    return (
        <div className="space-y-3 border-t border-indigo-500/15 pt-3 mt-2">
            {/* Cabeçalho: top set + actions */}
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Top:</span>
                <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={topSetKg || ''}
                    onChange={e => setTop(Number(e.target.value) || 0, topSetReps)}
                    placeholder="kg"
                    className="w-20 h-9 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-indigo-300 font-mono text-center placeholder-gray-600 outline-none focus:border-indigo-500/50"
                />
                <span className="text-sm text-zinc-600">×</span>
                <input
                    type="number"
                    min="1"
                    value={topSetReps || ''}
                    onChange={e => setTop(topSetKg, Number(e.target.value) || 0)}
                    placeholder="reps"
                    className="w-16 h-9 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-indigo-300 font-mono text-center placeholder-gray-600 outline-none focus:border-indigo-500/50"
                />
                <select
                    value=""
                    onChange={e => { if (e.target.value) aplicarTemplate(e.target.value as TemplateId) }}
                    className="h-9 bg-white/[0.03] border border-white/10 rounded-lg text-xs text-gray-300 px-2 outline-none focus:border-indigo-500/50"
                >
                    {TEMPLATE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value} className="bg-surface-deep">{opt.label}</option>
                    ))}
                </select>
                <button
                    type="button"
                    onClick={gerarIA}
                    disabled={iaLoading}
                    className="h-9 px-3 flex items-center gap-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                    title="Sugerir prescrição com IA"
                >
                    {iaLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    IA
                </button>
            </div>

            {/* Tabela de séries */}
            {series.length === 0 ? (
                <p className="text-xs text-zinc-600 italic py-2">
                    Nenhuma série prescrita. Aplique um template ou clique em IA.
                </p>
            ) : (
                <div className="space-y-1.5">
                    <div className="grid grid-cols-[24px_96px_68px_80px_56px_64px_24px] gap-2 items-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                        <span>#</span>
                        <span>Tipo</span>
                        <span className="text-center">Reps</span>
                        <span className="text-center">Carga</span>
                        <span className="text-center flex items-center justify-center gap-1">
                            RIR
                            <span title="Reps In Reserve — reps que sobram antes da falha. 0=até a falha, 2=poderia fazer mais 2. (Zourdos 2016)" className="cursor-help">
                                <HelpCircle size={10} />
                            </span>
                        </span>
                        <span className="text-center">Desc</span>
                        <span></span>
                    </div>
                    {series.map((s, idx) => (
                        <div key={idx} className="grid grid-cols-[24px_96px_68px_80px_56px_64px_24px] gap-2 items-center">
                            <span className="text-xs text-zinc-500 font-mono">{idx + 1}</span>
                            <select
                                value={s.tipo}
                                onChange={e => updateSerie(idx, { tipo: e.target.value as TipoSet })}
                                className="h-9 bg-white/[0.03] border border-white/10 rounded-lg text-xs text-gray-200 px-1.5 outline-none focus:border-indigo-500/50"
                            >
                                {TIPO_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value} className="bg-surface-deep">{opt.label}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                min="1"
                                value={s.reps || ''}
                                onChange={e => updateSerie(idx, { reps: Number(e.target.value) || 1 })}
                                className="h-9 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-indigo-300 font-mono text-center outline-none focus:border-indigo-500/50"
                            />
                            <div className="flex items-center gap-1">
                                <input
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    value={s.cargaKg > 0 ? s.cargaKg : ''}
                                    placeholder="kg"
                                    onChange={e => updateSerie(idx, { cargaKg: Number(e.target.value) || 0 })}
                                    className="w-14 h-9 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-indigo-300 font-mono text-center placeholder-gray-600 outline-none focus:border-indigo-500/50"
                                />
                                <span className="text-[10px] text-zinc-600">kg</span>
                            </div>
                            <input
                                type="number"
                                min="0"
                                max="5"
                                value={s.rirAlvo ?? ''}
                                onChange={e => {
                                    const v = e.target.value === '' ? undefined : Math.max(0, Math.min(5, Number(e.target.value)))
                                    updateSerie(idx, { rirAlvo: v })
                                }}
                                className="h-9 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-amber-300 font-mono text-center outline-none focus:border-indigo-500/50"
                            />
                            <div className="flex items-center gap-1">
                                <input
                                    type="number"
                                    min="0"
                                    step="15"
                                    value={s.descansoSegundos || ''}
                                    onChange={e => updateSerie(idx, { descansoSegundos: Number(e.target.value) || 0 })}
                                    className="w-12 h-9 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-gray-300 font-mono text-center outline-none focus:border-indigo-500/50"
                                />
                                <span className="text-[10px] text-zinc-600">s</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeSerie(idx)}
                                className="text-zinc-600 hover:text-red-400 transition-colors"
                                title="Remover série"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
                <button
                    type="button"
                    onClick={addSerie}
                    className="h-8 px-3 flex items-center gap-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-gray-300 text-[11px] font-bold uppercase tracking-wider transition-colors"
                >
                    <Plus size={12} />
                    Série
                </button>
                {series.length > 1 && (
                    <button
                        type="button"
                        onClick={() => removeSerie(series.length - 1)}
                        className="h-8 px-3 flex items-center gap-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-gray-400 text-[11px] font-bold uppercase tracking-wider transition-colors"
                    >
                        <Minus size={12} />
                        Última
                    </button>
                )}
            </div>
        </div>
    )
}
