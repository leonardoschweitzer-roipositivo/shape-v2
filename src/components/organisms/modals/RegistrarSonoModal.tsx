/**
 * RegistrarSonoModal - Modal para registrar sono
 */

import React, { useState } from 'react'
import { X, Moon, Frown, Cloud, Meh, Smile, Zap, Timer, BedDouble, Sun } from 'lucide-react'
import { useDailyTrackingStore } from '../../../stores/useDailyTrackingStore'

export const RegistrarSonoModal: React.FC = () => {
    const { fecharModal, registrarSono } = useDailyTrackingStore()

    const [horarioDormiu, setHorarioDormiu] = useState('23:00')
    const [horarioAcordou, setHorarioAcordou] = useState('07:00')
    const [qualidade, setQualidade] = useState<1 | 2 | 3 | 4 | 5>(3)
    const [acordouNoite, setAcordouNoite] = useState(false)
    const [vezesAcordou, setVezesAcordou] = useState(1)
    const [energiaAoAcordar, setEnergiaAoAcordar] = useState(5)

    // Calcular duração total
    const calcularDuracao = () => {
        const [hDormiu, mDormiu] = horarioDormiu.split(':').map(Number)
        const [hAcordou, mAcordou] = horarioAcordou.split(':').map(Number)

        let duracao = (hAcordou * 60 + mAcordou) - (hDormiu * 60 + mDormiu)
        if (duracao < 0) duracao += 24 * 60 // atravessou a meia-noite

        return duracao
    }

    const duracaoTotal = calcularDuracao()
    const horasTotal = Math.floor(duracaoTotal / 60)
    const minutosTotal = duracaoTotal % 60

    const qualidadeIcons = {
        1: <Frown size={24} />,
        2: <Cloud size={24} />,
        3: <Meh size={24} />,
        4: <Smile size={24} />,
        5: <Zap size={24} />,
    }

    const qualidadeLabels = {
        1: 'Péssimo',
        2: 'Ruim',
        3: 'OK',
        4: 'Bom',
        5: 'Excelente',
    }

    const handleRegistrar = () => {
        const [hDormiu, mDormiu] = horarioDormiu.split(':').map(Number)
        const [hAcordou, mAcordou] = horarioAcordou.split(':').map(Number)

        const hoje = new Date()
        const ontem = new Date(hoje)
        ontem.setDate(hoje.getDate() - 1)

        const dormiu = new Date(ontem)
        dormiu.setHours(hDormiu, mDormiu, 0, 0)

        const acordou = new Date(hoje)
        acordou.setHours(hAcordou, mAcordou, 0, 0)

        registrarSono({
            data: hoje,
            horarioDormiu: dormiu,
            horarioAcordou: acordou,
            duracaoTotal,
            qualidade,
            acordouDuranteNoite: (acordouNoite ? Math.min(vezesAcordou, 3) : 0) as 0 | 1 | 2 | 3,
            energiaAoAcordar,
        })

        fecharModal()
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-[#131B2C] rounded-2xl max-w-lg w-full border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-[#131B2C] z-10">
                    <div>
                        <div className="flex items-center gap-2">
                            <Moon size={20} className="text-indigo-400" />
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Registrar Sono</h2>
                        </div>
                        <p className="text-sm text-gray-500 font-light mt-1">Como foi sua noite de sono?</p>
                    </div>
                    <button
                        onClick={fecharModal}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-8">
                    {/* Horários */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <BedDouble size={14} className="text-indigo-400" />
                                Dormiu às
                            </label>
                            <input
                                type="time"
                                value={horarioDormiu}
                                onChange={(e) => setHorarioDormiu(e.target.value)}
                                className="w-full bg-[#0D121F] border border-white/5 rounded-xl px-4 py-3
                                    text-white focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <Sun size={14} className="text-amber-400" />
                                Acordou às
                            </label>
                            <input
                                type="time"
                                value={horarioAcordou}
                                onChange={(e) => setHorarioAcordou(e.target.value)}
                                className="w-full bg-[#0D121F] border border-white/5 rounded-xl px-4 py-3
                                    text-white focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Duração Calculada */}
                    <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-6 text-center">
                        <div className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                            <Timer size={14} />
                            Tempo total de sono
                        </div>
                        <div className="text-4xl font-bold text-white tracking-tight">
                            {horasTotal}h {minutosTotal > 0 && `${minutosTotal}min`}
                        </div>
                        <div className="text-[10px] text-gray-500 mt-2 uppercase tracking-wide font-medium">
                            {duracaoTotal < 420 && <span className="text-amber-400">⚠️ Atenção: Menos de 7 horas</span>}
                            {duracaoTotal >= 420 && duracaoTotal < 540 && <span className="text-indigo-400">✓ Meta atingida</span>}
                            {duracaoTotal >= 540 && <span className="text-emerald-400">✓ Recuperação excelente</span>}
                        </div>
                    </div>

                    {/* Qualidade do Sono */}
                    <div>
                        <div className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">Qualidade do sono:</div>
                        <div className="grid grid-cols-5 gap-2">
                            {([1, 2, 3, 4, 5] as const).map((nivel) => (
                                <button
                                    key={nivel}
                                    onClick={() => setQualidade(nivel)}
                                    className={`
                                        flex flex-col items-center justify-center p-4 rounded-xl border transition-all
                                        ${qualidade === nivel
                                            ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                                            : 'border-white/5 bg-[#0D121F] text-gray-500 hover:border-white/20'
                                        }
                                    `}
                                >
                                    <div className="mb-2">{qualidadeIcons[nivel]}</div>
                                    <div className="text-[10px] font-bold uppercase whitespace-nowrap">{qualidadeLabels[nivel]}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Acordou durante a noite */}
                    <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={acordouNoite}
                                    onChange={(e) => setAcordouNoite(e.target.checked)}
                                    className="sr-only"
                                />
                                <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center
                                    ${acordouNoite ? 'bg-indigo-600 border-indigo-600' : 'border-white/10 bg-[#0D121F] group-hover:border-white/20'}`}>
                                    {acordouNoite && <BedDouble size={14} className="text-white" />}
                                </div>
                            </div>
                            <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors uppercase tracking-tight font-bold">Acordou durante a noite</span>
                        </label>

                        {acordouNoite && (
                            <div className="animate-fade-in pl-9">
                                <label className="text-[10px] font-bold text-gray-500 block mb-2 uppercase tracking-widest">
                                    Quantas vezes?
                                </label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 10].map((v) => (
                                        <button
                                            key={v}
                                            onClick={() => setVezesAcordou(v)}
                                            className={`p-2 w-10 h-10 rounded-xl border transition-all text-xs font-bold
                                                ${vezesAcordou === v
                                                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                                                    : 'border-white/5 bg-[#0D121F] text-gray-500 hover:border-white/20'
                                                }`}
                                        >
                                            {v === 10 ? '5+' : v}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Energia ao acordar */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <Zap size={14} className="text-amber-400" />
                                Energia ao acordar
                            </label>
                            <span className="text-xl font-bold text-white tracking-tighter">{energiaAoAcordar}/10</span>
                        </div>
                        <input
                            type="range"
                            min={1}
                            max={10}
                            value={energiaAoAcordar}
                            onChange={(e) => setEnergiaAoAcordar(Number(e.target.value))}
                            className="w-full h-2 bg-[#0D121F] rounded-full appearance-none cursor-pointer accent-indigo-500
                                border border-white/5"
                        />
                        <div className="flex justify-between text-[10px] font-bold text-gray-600 mt-3 uppercase tracking-widest">
                            <span>Péssima</span>
                            <span>Excelente</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-4 p-6 border-t border-white/5 sticky bottom-0 bg-[#131B2C]">
                    <button
                        onClick={fecharModal}
                        className="flex-1 px-6 py-4 rounded-xl border border-white/5 text-gray-400
                            hover:bg-white/5 transition-all font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleRegistrar}
                        className="flex-1 px-6 py-4 rounded-xl bg-indigo-600 text-white font-bold
                            hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/20"
                    >
                        Registrar Sono
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RegistrarSonoModal
