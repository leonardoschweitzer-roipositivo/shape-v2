/**
 * RegistrarAguaModal - Modal para registrar consumo de água
 */

import React, { useState } from 'react'
import { X, Droplet } from 'lucide-react'
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-[#131B2C] rounded-2xl max-w-md w-full border border-white/10 shadow-2xl animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div>
                        <div className="flex items-center gap-2">
                            <Droplet size={20} className="text-blue-400" />
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Registrar Água</h2>
                        </div>
                        <p className="text-sm text-gray-500 font-light mt-1">Adicione ao seu total diário</p>
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
                    {/* Visual Progress */}
                    <div className="flex flex-col items-center">
                        <div className="relative mb-6">
                            <div className="p-5 bg-blue-500/10 rounded-full border border-blue-500/20 text-blue-400">
                                <Droplet size={48} className="fill-blue-400/20" />
                            </div>
                        </div>

                        <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/5">
                            <div
                                className="bg-blue-500 h-full transition-all duration-500"
                                style={{ width: `${percentual}%` }}
                            />
                        </div>

                        <div className="text-center mt-4">
                            <div className="text-4xl font-bold text-white tracking-tight">
                                {(totalAtual / 1000).toFixed(1)}L
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                meta de {(meta / 1000).toFixed(1)}L ({Math.round(percentual)}%)
                            </div>
                        </div>
                    </div>

                    {/* Quick Selection */}
                    <div>
                        <div className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Quantidade rápida:</div>
                        <div className="grid grid-cols-5 gap-2">
                            {botoes.map((valor) => (
                                <button
                                    key={valor}
                                    onClick={() => setQuantidade(valor)}
                                    className={`
                                        p-3 rounded-xl border transition-all
                                        ${quantidade === valor
                                            ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                                            : 'border-white/5 bg-[#0D121F] text-gray-400 hover:border-white/20'
                                        }
                                    `}
                                >
                                    <div className="text-sm font-bold">{valor}</div>
                                    <div className="text-[10px] opacity-60 uppercase">ml</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Manual Input */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 block mb-3 uppercase tracking-wider">
                            Ou digite a quantidade (ml):
                        </label>
                        <input
                            type="number"
                            value={quantidade || ''}
                            onChange={(e) => setQuantidade(Number(e.target.value))}
                            placeholder="Ex: 350"
                            className="w-full bg-[#0D121F] border border-white/5 rounded-xl px-4 py-4
                                text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 
                                transition-all text-lg font-medium"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-4 p-6 border-t border-white/5">
                    <button
                        onClick={fecharModal}
                        className="flex-1 px-6 py-4 rounded-xl border border-white/5 text-gray-400
                            hover:bg-white/5 transition-all font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleRegistrar}
                        disabled={quantidade === 0}
                        className="flex-1 px-6 py-4 rounded-xl bg-blue-600 text-white font-bold
                            hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 
                            disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                        Registrar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RegistrarAguaModal
