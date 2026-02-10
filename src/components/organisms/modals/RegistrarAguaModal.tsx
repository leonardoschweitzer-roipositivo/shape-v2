/**
 * RegistrarAguaModal - Modal para registrar consumo de água
 */

import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useDailyTrackingStore } from '../../../stores/useDailyTrackingStore'

export const RegistrarAguaModal: React.FC = () => {
    const { fecharModal, registrarAgua, resumoDiario } = useDailyTrackingStore()
    const [quantidade, setQuantidade] = useState(0)

    const botoes = [200, 300, 500, 750, 1000]

    const handleRegistrar = () => {
        if (quantidade > 0) {
            registrarAgua(quantidade)
            fecharModal()
        }
    }

    const totalAtual = resumoDiario.hidratacao.totalMl
    const meta = resumoDiario.hidratacao.metaMl
    const percentual = Math.min(100, (totalAtual / meta) * 100)

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl max-w-md w-full border border-gray-700 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <div>
                        <h2 className="text-xl font-bold text-white">💧 Registrar Água</h2>
                        <p className="text-sm text-gray-400">Adicione ao seu total diário</p>
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
                    {/* Garrafa Visual */}
                    <div className="flex flex-col items-center">
                        <div className="text-5xl mb-2">💧</div>
                        <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
                            <div
                                className="bg-blue-500 h-full transition-all duration-300"
                                style={{ width: `${percentual}%` }}
                            />
                        </div>
                        <div className="text-center mt-2">
                            <div className="text-2xl font-bold text-white">
                                {(totalAtual / 1000).toFixed(1)}L
                            </div>
                            <div className="text-sm text-gray-400">
                                de {(meta / 1000).toFixed(1)}L ({Math.round(percentual)}%)
                            </div>
                        </div>
                    </div>

                    {/* Botões Rápidos */}
                    <div>
                        <div className="text-sm text-gray-400 mb-2">Quantidade rápida:</div>
                        <div className="grid grid-cols-5 gap-2">
                            {botoes.map((valor) => (
                                <button
                                    key={valor}
                                    onClick={() => setQuantidade(valor)}
                                    className={`
                    p-3 rounded-lg border-2 transition-all
                    ${quantidade === valor
                                            ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                                            : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-blue-500/50'
                                        }
                  `}
                                >
                                    <div className="text-xs font-bold">{valor}</div>
                                    <div className="text-[10px] text-gray-500">ml</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input Manual */}
                    <div>
                        <label className="text-sm text-gray-400 block mb-2">
                            Ou digite a quantidade (ml):
                        </label>
                        <input
                            type="number"
                            value={quantidade || ''}
                            onChange={(e) => setQuantidade(Number(e.target.value))}
                            placeholder="Ex: 350"
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-gray-700">
                    <button
                        onClick={fecharModal}
                        className="flex-1 px-4 py-3 rounded-lg border border-gray-700 text-gray-300
              hover:bg-gray-800 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleRegistrar}
                        disabled={quantidade === 0}
                        className="flex-1 px-4 py-3 rounded-lg bg-blue-500 text-white font-bold
              hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Registrar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RegistrarAguaModal
