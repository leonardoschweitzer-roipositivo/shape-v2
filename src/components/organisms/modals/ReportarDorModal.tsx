/**
 * ReportarDorModal - Modal para reportar dor/desconforto
 */

import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useDailyTrackingStore } from '../../../stores/useDailyTrackingStore'
import type { RegiaoDor, TipoDor } from '../../../types/daily-tracking'

export const ReportarDorModal: React.FC = () => {
    const { fecharModal, reportarDor } = useDailyTrackingStore()

    const [localDor, setLocalDor] = useState<RegiaoDor>('ombro_direito')
    const [intensidade, setIntensidade] = useState(5)
    const [tipo, setTipo] = useState<TipoDor>('aguda')
    const [quandoComecou, setQuandoComecou] = useState('hoje')
    const [oquePiora, setOquePiora] = useState('')
    const [descricao, setDescricao] = useState('')

    const locaisDor: { value: RegiaoDor; label: string; emoji: string }[] = [
        { value: 'ombro_esquerdo', label: 'Ombro Esq', emoji: '💪' },
        { value: 'ombro_direito', label: 'Ombro Dir', emoji: '💪' },
        { value: 'braco_esquerdo', label: 'Braço Esq', emoji: '💪' },
        { value: 'braco_direito', label: 'Braço Dir', emoji: '💪' },
        { value: 'antebraco_esquerdo', label: 'Antebraço Esq', emoji: '✋' },
        { value: 'antebraco_direito', label: 'Antebraço Dir', emoji: '✋' },
        { value: 'lombar', label: 'Lombar', emoji: '🦴' },
        { value: 'peito', label: 'Peito', emoji: '🦴' },
        { value: 'coxa_esquerda', label: 'Coxa Esq', emoji: '🦵' },
        { value: 'coxa_direita', label: 'Coxa Dir', emoji: '🦵' },
        { value: 'joelho_esquerdo', label: 'Joelho Esq', emoji: '🦵' },
        { value: 'joelho_direito', label: 'Joelho Dir', emoji: '🦵' },
        { value: 'panturrilha_esquerda', label: 'Panturrilha Esq', emoji: '🦶' },
        { value: 'panturrilha_direita', label: 'Panturrilha Dir', emoji: '🦶' },
    ]

    const tiposDor: { value: TipoDor; label: string; color: string }[] = [
        { value: 'aguda', label: 'Aguda (pontada)', color: 'red' },
        { value: 'latejante', label: 'Latejante', color: 'orange' },
        { value: 'queimacao', label: 'Queimação', color: 'yellow' },
        { value: 'formigamento', label: 'Formigamento', color: 'purple' },
    ]

    const handleRegistrar = () => {
        reportarDor({
            regiao: localDor,
            intensidade,
            tipo,
            dataInicio: new Date(),
            duracaoEstimada: quandoComecou as 'hoje' | 'ontem' | 'esta_semana' | 'mais_tempo' | undefined,
            pioraCom: oquePiora ? [oquePiora] : [],
            ativa: true,
            descricao: descricao || undefined,
        })

        fecharModal()
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl max-w-2xl w-full border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-white">🤕 Reportar Dor</h2>
                        <p className="text-sm text-gray-400">Informe local e intensidade da dor</p>
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
                    {/* Local da Dor */}
                    <div>
                        <div className="text-sm text-gray-400 mb-3">Onde está a dor?</div>
                        <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                            {locaisDor.map((local) => (
                                <button
                                    key={local.value}
                                    onClick={() => setLocalDor(local.value)}
                                    className={`
                    p-3 rounded-lg border-2 transition-all text-left
                    ${localDor === local.value
                                            ? 'border-red-500 bg-red-500/20 text-red-300'
                                            : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-red-500/50'
                                        }
                  `}
                                >
                                    <div className="text-lg mb-1">{local.emoji}</div>
                                    <div className="text-xs font-semibold">{local.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Intensidade da Dor */}
                    <div>
                        <label className="text-sm text-gray-400 block mb-2">
                            Intensidade da dor: <span className="text-white font-bold">{intensidade}/10</span>
                        </label>
                        <input
                            type="range"
                            min={1}
                            max={10}
                            value={intensidade}
                            onChange={(e) => setIntensidade(Number(e.target.value))}
                            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer 
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 
                [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full 
                [&::-webkit-slider-thumb]:bg-red-500"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Leve</span>
                            <span>Moderada</span>
                            <span>Severa</span>
                        </div>

                        {/* Escala Visual */}
                        <div className="flex justify-between mt-2 text-2xl">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((nivel) => (
                                <span
                                    key={nivel}
                                    className={`transition-opacity ${intensidade >= nivel ? 'opacity-100' : 'opacity-20'
                                        }`}
                                >
                                    {nivel <= 3 && '😐'}
                                    {nivel > 3 && nivel <= 6 && '😣'}
                                    {nivel > 6 && nivel <= 8 && '😫'}
                                    {nivel > 8 && '😭'}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Tipo de Dor */}
                    <div>
                        <div className="text-sm text-gray-400 mb-3">Como é a dor?</div>
                        <div className="grid grid-cols-2 gap-2">
                            {tiposDor.map((tipoDor) => (
                                <button
                                    key={tipoDor.value}
                                    onClick={() => setTipo(tipoDor.value)}
                                    className={`
                    p-3 rounded-lg border-2 transition-all
                    ${tipo === tipoDor.value
                                            ? `border-${tipoDor.color}-500 bg-${tipoDor.color}-500/20`
                                            : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                                        }
                  `}
                                >
                                    <div className="text-sm text-white">{tipoDor.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quando começou */}
                    <div>
                        <label className="text-sm text-gray-400 block mb-2">
                            Quando começou?
                        </label>
                        <select
                            value={quandoComecou}
                            onChange={(e) => setQuandoComecou(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                text-white focus:outline-none focus:border-red-500"
                        >
                            <option value="agora">Agora</option>
                            <option value="hoje">Hoje</option>
                            <option value="ontem">Ontem</option>
                            <option value="esta_semana">Esta semana</option>
                            <option value="semana_passada">Semana passada</option>
                            <option value="mais_tempo">Há mais tempo</option>
                        </select>
                    </div>

                    {/* O que piora */}
                    <div>
                        <label className="text-sm text-gray-400 block mb-2">
                            O que piora a dor? (opcional)
                        </label>
                        <input
                            type="text"
                            value={oquePiora}
                            onChange={(e) => setOquePiora(e.target.value)}
                            placeholder="Ex: movimento específico, carga, alongamento..."
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                        />
                    </div>

                    {/* Descrição */}
                    <div>
                        <label className="text-sm text-gray-400 block mb-2">
                            Descrição adicional (opcional):
                        </label>
                        <textarea
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Descreva melhor a dor..."
                            rows={3}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                text-white placeholder-gray-500 focus:outline-none focus:border-red-500 resize-none"
                        />
                    </div>

                    {/* Aviso */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <div className="text-red-300 text-sm">
                            ⚠️ <strong>Importante:</strong> Dores persistentes ou intensas devem ser avaliadas por um profissional de saúde.
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
                        className="flex-1 px-4 py-3 rounded-lg bg-red-500 text-white font-bold
              hover:bg-red-600 transition-colors"
                    >
                        Reportar Dor
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ReportarDorModal
