/**
 * RegistrarTreinoModal - Modal para registrar treino
 */

import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useDailyTrackingStore } from '../../../stores/useDailyTrackingStore'

export const RegistrarTreinoModal: React.FC = () => {
    const { fecharModal, registrarTreino, resumoDiario } = useDailyTrackingStore()

    const [seguiuPlano, setSeguiuPlano] = useState<'sim' | 'parcial' | 'nao'>('sim')
    const [intensidade, setIntensidade] = useState<1 | 2 | 3 | 4>(3)
    const [duracao, setDuracao] = useState(60)
    const [temDor, setTemDor] = useState(false)
    const [observacoes, setObservacoes] = useState('')

    const intensidadeEmojis = {
        1: '😰',
        2: '😓',
        3: '💪',
        4: '🔥',
    }

    const intensidadeLabels = {
        1: 'Muito difícil',
        2: 'Difícil',
        3: 'Ótimo',
        4: 'Excelente',
    }

    const handleRegistrar = () => {
        registrarTreino({
            status: 'completo',
            seguiuPlano: seguiuPlano === 'sim',
            intensidadePercebida: intensidade,
            duracao,
            reportouDor: temDor,
            observacoes: observacoes || undefined,
        })
        fecharModal()
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl max-w-lg w-full border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-white">🏋️ Registrar Treino</h2>
                        <p className="text-sm text-gray-400">{resumoDiario.treino.tipo}</p>
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
                    {/* Treino Sugerido */}
                    {resumoDiario.treino.planejado && (
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                            <div className="text-blue-300 font-semibold mb-1">Treino Planejado:</div>
                            <div className="text-white">{resumoDiario.treino.tipo}</div>
                        </div>
                    )}

                    {/* Seguiu o plano? */}
                    <div>
                        <div className="text-sm text-gray-400 mb-2">Seguiu o plano?</div>
                        <div className="grid grid-cols-3 gap-2">
                            {(['sim', 'parcial', 'nao'] as const).map((opcao) => (
                                <button
                                    key={opcao}
                                    onClick={() => setSeguiuPlano(opcao)}
                                    className={`
                    p-3 rounded-lg border-2 transition-all capitalize
                    ${seguiuPlano === opcao
                                            ? 'border-green-500 bg-green-500/20 text-green-300'
                                            : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-green-500/50'
                                        }
                  `}
                                >
                                    {opcao === 'nao' ? 'Não' : opcao}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Como foi? */}
                    <div>
                        <div className="text-sm text-gray-400 mb-2">Como foi o treino?</div>
                        <div className="grid grid-cols-4 gap-2">
                            {([1, 2, 3, 4] as const).map((nivel) => (
                                <button
                                    key={nivel}
                                    onClick={() => setIntensidade(nivel)}
                                    className={`
                    p-4 rounded-lg border-2 transition-all
                    ${intensidade === nivel
                                            ? 'border-purple-500 bg-purple-500/20'
                                            : 'border-gray-700 bg-gray-800 hover:border-purple-500/50'
                                        }
                  `}
                                >
                                    <div className="text-3xl mb-1">{intensidadeEmojis[nivel]}</div>
                                    <div className="text-[10px] text-gray-400">{intensidadeLabels[nivel]}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Duração */}
                    <div>
                        <label className="text-sm text-gray-400 block mb-2">
                            Duração (minutos):
                        </label>
                        <input
                            type="number"
                            value={duracao}
                            onChange={(e) => setDuracao(Number(e.target.value))}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    {/* Dor/Desconforto */}
                    <div>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={temDor}
                                onChange={(e) => setTemDor(e.target.checked)}
                                className="w-5 h-5"
                            />
                            <span className="text-gray-300">Sentiu dor ou desconforto durante o treino</span>
                        </label>
                    </div>

                    {/* Observações */}
                    <div>
                        <label className="text-sm text-gray-400 block mb-2">
                            Observações (opcional):
                        </label>
                        <textarea
                            value={observacoes}
                            onChange={(e) => setObservacoes(e.target.value)}
                            placeholder="Ex: Aumentei carga no supino, senti bem..."
                            rows={3}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                        />
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
                        className="flex-1 px-4 py-3 rounded-lg bg-purple-500 text-white font-bold
              hover:bg-purple-600 transition-colors"
                    >
                        Registrar Treino
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RegistrarTreinoModal
