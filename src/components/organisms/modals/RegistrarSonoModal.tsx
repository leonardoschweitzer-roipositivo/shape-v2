/**
 * RegistrarSonoModal - Modal para registrar sono
 */

import React, { useState } from 'react'
import { X } from 'lucide-react'
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

    const qualidadeEmojis = {
        1: '😫',
        2: '😴',
        3: '😊',
        4: '😃',
        5: '🤩',
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl max-w-lg w-full border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-white">😴 Registrar Sono</h2>
                        <p className="text-sm text-gray-400">Como foi sua noite de sono?</p>
                    </div>
                    <button
                        onClick={fecharModal}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Horários */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-400 block mb-2">
                                Que horas dormiu?
                            </label>
                            <input
                                type="time"
                                value={horarioDormiu}
                                onChange={(e) => setHorarioDormiu(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                  text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 block mb-2">
                                Que horas acordou?
                            </label>
                            <input
                                type="time"
                                value={horarioAcordou}
                                onChange={(e) => setHorarioAcordou(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                  text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Duração Calculada */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                        <div className="text-blue-300 text-sm mb-1">Total de Sono</div>
                        <div className="text-3xl font-bold text-white">
                            {horasTotal}h {minutosTotal > 0 && `${minutosTotal}min`}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                            {duracaoTotal < 420 && '⚠️ Menos de 7 horas'}
                            {duracaoTotal >= 420 && duracaoTotal < 540 && '✓ Bom'}
                            {duracaoTotal >= 540 && '✓ Ótimo'}
                        </div>
                    </div>

                    {/* Qualidade do Sono */}
                    <div>
                        <div className="text-sm text-gray-400 mb-3">Qualidade do sono:</div>
                        <div className="grid grid-cols-5 gap-2">
                            {([1, 2, 3, 4, 5] as const).map((nivel) => (
                                <button
                                    key={nivel}
                                    onClick={() => setQualidade(nivel)}
                                    className={`
                    p-3 rounded-lg border-2 transition-all
                    ${qualidade === nivel
                                            ? 'border-blue-500 bg-blue-500/20'
                                            : 'border-gray-700 bg-gray-800 hover:border-blue-500/50'
                                        }
                  `}
                                >
                                    <div className="text-2xl mb-1">{qualidadeEmojis[nivel]}</div>
                                    <div className="text-[10px] text-gray-400">{qualidadeLabels[nivel]}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Acordou durante a noite */}
                    <div>
                        <label className="flex items-center gap-3 cursor-pointer mb-3">
                            <input
                                type="checkbox"
                                checked={acordouNoite}
                                onChange={(e) => setAcordouNoite(e.target.checked)}
                                className="w-5 h-5"
                            />
                            <span className="text-gray-300">Acordou durante a noite</span>
                        </label>

                        {acordouNoite && (
                            <div>
                                <label className="text-sm text-gray-400 block mb-2">
                                    Quantas vezes?
                                </label>
                                <input
                                    type="number"
                                    value={vezesAcordou}
                                    onChange={(e) => setVezesAcordou(Number(e.target.value))}
                                    min={1}
                                    max={10}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                    text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        )}
                    </div>

                    {/* Energia ao acordar */}
                    <div>
                        <label className="text-sm text-gray-400 block mb-2">
                            Energia ao acordar: <span className="text-white font-bold">{energiaAoAcordar}/10</span>
                        </label>
                        <input
                            type="range"
                            min={1}
                            max={10}
                            value={energiaAoAcordar}
                            onChange={(e) => setEnergiaAoAcordar(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer 
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
                [&::-webkit-slider-thumb]:bg-blue-500"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Péssima</span>
                            <span>Excelente</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-gray-700 sticky bottom-0 bg-gray-900">
                    <button
                        onClick={fecharModal}
                        className="flex-1 px-4 py-3 rounded-lg border border-gray-700 text-gray-300
              hover:bg-gray-800 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleRegistrar}
                        className="flex-1 px-4 py-3 rounded-lg bg-blue-500 text-white font-bold
              hover:bg-blue-600 transition-colors"
                    >
                        Registrar Sono
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RegistrarSonoModal
