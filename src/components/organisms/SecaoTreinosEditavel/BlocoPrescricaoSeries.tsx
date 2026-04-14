/**
 * BlocoPrescricaoSeries — Editor de prescrição detalhada série-a-série.
 *
 * Renderiza: inputs de top set + dropdown de template + botão IA + tabela editável.
 *
 * Uso dentro de SecaoTreinosEditavel, ativado via toggle "Prescrição detalhada".
 */

import React, { useState } from 'react'
import { Plus, Minus, Sparkles, Loader2, Trash2 } from 'lucide-react'
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
    /** Contexto opcional para melhorar sugestão via IA. */
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
        if (!topSetKg || topSetKg <= 0) {
            alert('Defina o top set alvo primeiro (kg e reps).')
            return
        }
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
                topSetKg,
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
            : { ordem: 1, tipo: 'valida', repsAlvoMin: topSetReps, repsAlvoMax: topSetReps, fonteCarga: 'kg', cargaKg: topSetKg, descansoSegundos: 120 }
        setSeries([...series, nova])
    }

    const removeSerie = (idx: number) => {
        const novas = series.filter((_, i) => i !== idx).map((s, i) => ({ ...s, ordem: i + 1 }))
        setSeries(novas)
    }

    return (
        <div className="space-y-2 border-t border-indigo-500/15 pt-2 mt-1">
            {/* Cabeçalho: top set + actions */}
            <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[8px] text-zinc-600 uppercase tracking-wider font-bold">Top:</span>
                <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={topSetKg || ''}
                    onChange={e => setTop(Number(e.target.value) || 0, topSetReps)}
                    placeholder="kg"
                    className="w-14 h-6 bg-white/[0.03] border border-white/10 rounded-md text-[10px] text-indigo-300 font-mono text-center placeholder-gray-600 outline-none focus:border-indigo-500/50"
                />
                <span className="text-[9px] text-zinc-600">×</span>
                <input
                    type="number"
                    min="1"
                    value={topSetReps || ''}
                    onChange={e => setTop(topSetKg, Number(e.target.value) || 0)}
                    placeholder="reps"
                    className="w-12 h-6 bg-white/[0.03] border border-white/10 rounded-md text-[10px] text-indigo-300 font-mono text-center placeholder-gray-600 outline-none focus:border-indigo-500/50"
                />
                <select
                    value=""
                    onChange={e => { if (e.target.value) aplicarTemplate(e.target.value as TemplateId) }}
                    className="h-6 bg-white/[0.03] border border-white/10 rounded-md text-[9px] text-gray-300 px-1.5 outline-none focus:border-indigo-500/50"
                >
                    {TEMPLATE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value} className="bg-surface-deep">{opt.label}</option>
                    ))}
                </select>
                <button
                    type="button"
                    onClick={gerarIA}
                    disabled={iaLoading}
                    className="h-6 px-2 flex items-center gap-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[9px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                    title="Sugerir prescrição com IA"
                >
                    {iaLoading ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                    IA
                </button>
            </div>

            {/* Tabela de séries */}
            {series.length === 0 ? (
                <p className="text-[9px] text-zinc-600 italic py-1.5">
                    Nenhuma série prescrita. Aplique um template ou clique em IA.
                </p>
            ) : (
                <div className="space-y-1">
                    <div className="grid grid-cols-[16px_60px_58px_60px_32px_40px_16px] gap-1 items-center text-[7px] text-zinc-600 font-bold uppercase tracking-wider">
                        <span>#</span>
                        <span>Tipo</span>
                        <span className="text-center">Reps</span>
                        <span className="text-center">Carga</span>
                        <span className="text-center">RIR</span>
                        <span className="text-center">Desc</span>
                        <span></span>
                    </div>
                    {series.map((s, idx) => (
                        <div key={idx} className="grid grid-cols-[16px_60px_58px_60px_32px_40px_16px] gap-1 items-center">
                            <span className="text-[9px] text-zinc-500 font-mono">{idx + 1}</span>
                            <select
                                value={s.tipo}
                                onChange={e => updateSerie(idx, { tipo: e.target.value as TipoSet })}
                                className="h-6 bg-white/[0.03] border border-white/10 rounded-md text-[9px] text-gray-300 outline-none focus:border-indigo-500/50"
                            >
                                {TIPO_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value} className="bg-surface-deep">{opt.label}</option>
                                ))}
                            </select>
                            <div className="flex items-center gap-0.5">
                                <input
                                    type="number"
                                    min="1"
                                    value={s.repsAlvoMin || ''}
                                    onChange={e => updateSerie(idx, { repsAlvoMin: Number(e.target.value) || 1 })}
                                    className="w-6 h-6 bg-white/[0.03] border border-white/10 rounded-md text-[9px] text-indigo-300 font-mono text-center outline-none focus:border-indigo-500/50"
                                />
                                <span className="text-[8px] text-zinc-600">-</span>
                                <input
                                    type="number"
                                    min="1"
                                    value={s.repsAlvoMax || ''}
                                    onChange={e => updateSerie(idx, { repsAlvoMax: Number(e.target.value) || 1 })}
                                    className="w-6 h-6 bg-white/[0.03] border border-white/10 rounded-md text-[9px] text-indigo-300 font-mono text-center outline-none focus:border-indigo-500/50"
                                />
                            </div>
                            {s.fonteCarga === 'pctTopSet' ? (
                                <div className="flex items-center gap-0.5">
                                    <input
                                        type="number"
                                        step="5"
                                        min="0"
                                        max="120"
                                        value={s.cargaPercentTopSet != null ? Math.round(s.cargaPercentTopSet * 100) : ''}
                                        onChange={e => {
                                            const pct = Math.max(0, Math.min(1.2, Number(e.target.value) / 100))
                                            const kg = Math.round(topSetKg * pct * 2) / 2
                                            updateSerie(idx, { cargaPercentTopSet: pct, cargaKg: kg })
                                        }}
                                        className="w-9 h-6 bg-white/[0.03] border border-white/10 rounded-md text-[9px] text-indigo-300 font-mono text-center outline-none focus:border-indigo-500/50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => updateSerie(idx, { fonteCarga: 'kg' })}
                                        className="text-[7px] text-amber-400/80 hover:text-amber-300 uppercase"
                                        title="Mudar para kg absoluto"
                                    >%TS</button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-0.5">
                                    <input
                                        type="number"
                                        step="0.5"
                                        min="0"
                                        value={s.cargaKg ?? ''}
                                        onChange={e => updateSerie(idx, { cargaKg: Number(e.target.value) || 0 })}
                                        className="w-9 h-6 bg-white/[0.03] border border-white/10 rounded-md text-[9px] text-indigo-300 font-mono text-center outline-none focus:border-indigo-500/50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => updateSerie(idx, { fonteCarga: 'pctTopSet' })}
                                        className="text-[7px] text-zinc-600 hover:text-indigo-300 uppercase"
                                        title="Mudar para %TopSet"
                                    >kg</button>
                                </div>
                            )}
                            <input
                                type="number"
                                min="0"
                                max="5"
                                value={s.rirAlvo ?? ''}
                                onChange={e => {
                                    const v = e.target.value === '' ? undefined : Math.max(0, Math.min(5, Number(e.target.value)))
                                    updateSerie(idx, { rirAlvo: v })
                                }}
                                className="h-6 bg-white/[0.03] border border-white/10 rounded-md text-[9px] text-amber-300 font-mono text-center outline-none focus:border-indigo-500/50"
                            />
                            <input
                                type="number"
                                min="0"
                                step="15"
                                value={s.descansoSegundos || ''}
                                onChange={e => updateSerie(idx, { descansoSegundos: Number(e.target.value) || 0 })}
                                className="h-6 bg-white/[0.03] border border-white/10 rounded-md text-[9px] text-gray-300 font-mono text-center outline-none focus:border-indigo-500/50"
                            />
                            <button
                                type="button"
                                onClick={() => removeSerie(idx)}
                                className="text-zinc-600 hover:text-red-400 transition-colors"
                                title="Remover série"
                            >
                                <Trash2 size={10} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-1 pt-1">
                <button
                    type="button"
                    onClick={addSerie}
                    className="h-6 px-2 flex items-center gap-1 rounded-md bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-gray-300 text-[9px] font-bold uppercase tracking-wider transition-colors"
                >
                    <Plus size={10} />
                    Série
                </button>
                {series.length > 1 && (
                    <button
                        type="button"
                        onClick={() => removeSerie(series.length - 1)}
                        className="h-6 px-2 flex items-center gap-1 rounded-md bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-gray-400 text-[9px] font-bold uppercase tracking-wider transition-colors"
                    >
                        <Minus size={10} />
                        Última
                    </button>
                )}
            </div>
        </div>
    )
}
