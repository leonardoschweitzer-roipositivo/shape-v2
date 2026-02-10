/**
 * RegistrarRefeicaoModal - Modal para registrar refeição
 */

import React, { useState } from 'react'
import { X, Camera, Search } from 'lucide-react'
import { useDailyTrackingStore } from '../../../stores/useDailyTrackingStore'
import type { TipoRefeicao } from '../../../types/daily-tracking'

export const RegistrarRefeicaoModal: React.FC = () => {
    const { fecharModal, registrarRefeicao } = useDailyTrackingStore()

    const [tipo, setTipo] = useState<TipoRefeicao>('almoco')
    const [metodo, setMetodo] = useState<'texto' | 'foto' | 'busca'>('texto')
    const [descricao, setDescricao] = useState('')

    // Estimativa simples (seria feita pela IA no backend)
    const [calorias, setCalorias] = useState(500)
    const [proteina, setProteina] = useState(30)
    const [carboidrato, setCarboidrato] = useState(50)
    const [gordura, setGordura] = useState(15)

    const tiposRefeicao: { value: TipoRefeicao; label: string; emoji: string }[] = [
        { value: 'cafe', label: 'Café', emoji: '☕' },
        { value: 'lanche_manha', label: 'Lanche Manhã', emoji: '🥐' },
        { value: 'almoco', label: 'Almoço', emoji: '🍽️' },
        { value: 'lanche_tarde', label: 'Lanche Tarde', emoji: '🍎' },
        { value: 'jantar', label: 'Jantar', emoji: '🍲' },
        { value: 'ceia', label: 'Ceia', emoji: '🌙' },
    ]

    const handleRegistrar = () => {
        if (!descricao) return

        registrarRefeicao({
            tipo,
            data: new Date(),
            horario: new Date(),
            descricao,
            calorias,
            proteina,
            carboidrato,
            gordura,
            fonte: metodo === 'texto' ? 'manual' : metodo === 'foto' ? 'foto_ia' : 'busca',
        })

        fecharModal()
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl max-w-2xl w-full border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-white">🍽️ Registrar Refeição</h2>
                        <p className="text-sm text-gray-400">Adicione sua refeição ao diário</p>
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
                    {/* Tipo de Refeição */}
                    <div>
                        <div className="text-sm text-gray-400 mb-3">Tipo de refeição:</div>
                        <div className="grid grid-cols-3 gap-2">
                            {tiposRefeicao.map((t) => (
                                <button
                                    key={t.value}
                                    onClick={() => setTipo(t.value)}
                                    className={`
                    p-3 rounded-lg border-2 transition-all
                    ${tipo === t.value
                                            ? 'border-green-500 bg-green-500/20 text-green-300'
                                            : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-green-500/50'
                                        }
                  `}
                                >
                                    <div className="text-xl mb-1">{t.emoji}</div>
                                    <div className="text-xs">{t.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Método de Input */}
                    <div>
                        <div className="text-sm text-gray-400 mb-3">Como deseja registrar?</div>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                onClick={() => setMetodo('texto')}
                                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${metodo === 'texto'
                                        ? 'border-amber-500 bg-amber-500/20'
                                        : 'border-gray-700 bg-gray-800 hover:border-amber-500/50'
                                    }
                `}
                            >
                                <div className="text-2xl mb-2">✍️</div>
                                <div className="text-sm text-white font-semibold">Texto</div>
                                <div className="text-xs text-gray-400">Descrever</div>
                            </button>

                            <button
                                onClick={() => setMetodo('foto')}
                                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${metodo === 'foto'
                                        ? 'border-amber-500 bg-amber-500/20'
                                        : 'border-gray-700 bg-gray-800 hover:border-amber-500/50'
                                    }
                `}
                            >
                                <Camera className="mx-auto mb-2" size={24} />
                                <div className="text-sm text-white font-semibold">Foto</div>
                                <div className="text-xs text-gray-400">Tirar foto</div>
                            </button>

                            <button
                                onClick={() => setMetodo('busca')}
                                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${metodo === 'busca'
                                        ? 'border-amber-500 bg-amber-500/20'
                                        : 'border-gray-700 bg-gray-800 hover:border-amber-500/50'
                                    }
                `}
                            >
                                <Search className="mx-auto mb-2" size={24} />
                                <div className="text-sm text-white font-semibold">Buscar</div>
                                <div className="text-xs text-gray-400">Database</div>
                            </button>
                        </div>
                    </div>

                    {/* Input baseado no método */}
                    {metodo === 'texto' && (
                        <div>
                            <label className="text-sm text-gray-400 block mb-2">
                                Descreva sua refeição:
                            </label>
                            <textarea
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                placeholder="Ex: 200g de frango grelhado, 150g de arroz integral, salada..."
                                rows={4}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                  text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 resize-none"
                            />
                            <div className="text-xs text-gray-500 mt-1">
                                💡 A IA vai estimar os macros automaticamente
                            </div>
                        </div>
                    )}

                    {metodo === 'foto' && (
                        <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                            <Camera className="mx-auto mb-3 text-gray-500" size={48} />
                            <div className="text-gray-300 mb-2">Tire uma foto da sua refeição</div>
                            <div className="text-sm text-gray-500 mb-4">A IA vai analisar e estimar os macros</div>
                            <button className="px-6 py-2 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600">
                                Abrir Câmera
                            </button>
                        </div>
                    )}

                    {metodo === 'busca' && (
                        <div>
                            <input
                                type="text"
                                placeholder="Buscar alimento..."
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                  text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                            />
                            <div className="text-xs text-gray-500 mt-1">
                                🔍 Busque por nome, marca ou categoria
                            </div>
                        </div>
                    )}

                    {/* Estimativa de Macros (se texto foi preenchido) */}
                    {descricao && metodo === 'texto' && (
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                            <div className="text-amber-300 font-semibold mb-3 flex items-center gap-2">
                                <span>🤖</span>
                                Estimativa da IA:
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                <div>
                                    <div className="text-xs text-gray-400">Calorias</div>
                                    <input
                                        type="number"
                                        value={calorias}
                                        onChange={(e) => setCalorias(Number(e.target.value))}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm mt-1"
                                    />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Proteína (g)</div>
                                    <input
                                        type="number"
                                        value={proteina}
                                        onChange={(e) => setProteina(Number(e.target.value))}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm mt-1"
                                    />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Carbos (g)</div>
                                    <input
                                        type="number"
                                        value={carboidrato}
                                        onChange={(e) => setCarboidrato(Number(e.target.value))}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm mt-1"
                                    />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Gordura (g)</div>
                                    <input
                                        type="number"
                                        value={gordura}
                                        onChange={(e) => setGordura(Number(e.target.value))}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm mt-1"
                                    />
                                </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                                Você pode ajustar os valores se necessário
                            </div>
                        </div>
                    )}
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
                        disabled={!descricao}
                        className="flex-1 px-4 py-3 rounded-lg bg-green-500 text-white font-bold
              hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Registrar Refeição
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RegistrarRefeicaoModal
