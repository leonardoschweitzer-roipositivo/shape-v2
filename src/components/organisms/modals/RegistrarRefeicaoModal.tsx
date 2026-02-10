/**
 * RegistrarRefeicaoModal - Modal para registrar refeição
 */

import React, { useState } from 'react'
import { X, Camera, Search, Utensils, Coffee, Cookie, Apple, Soup, Moon, Type, Bot, Lightbulb } from 'lucide-react'
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

    const tiposRefeicao: { value: TipoRefeicao; label: string; icon: React.ReactNode }[] = [
        { value: 'cafe', label: 'Café', icon: <Coffee size={20} /> },
        { value: 'lanche_manha', label: 'Lanche Manhã', icon: <Cookie size={20} /> },
        { value: 'almoco', label: 'Almoço', icon: <Utensils size={20} /> },
        { value: 'lanche_tarde', label: 'Lanche Tarde', icon: <Apple size={20} /> },
        { value: 'jantar', label: 'Jantar', icon: <Soup size={20} /> },
        { value: 'ceia', label: 'Ceia', icon: <Moon size={20} /> },
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-[#131B2C] rounded-2xl max-w-2xl w-full border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-[#131B2C] z-10">
                    <div>
                        <div className="flex items-center gap-2">
                            <Utensils size={20} className="text-emerald-400" />
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Registrar Refeição</h2>
                        </div>
                        <p className="text-sm text-gray-500 font-light mt-1">Adicione sua refeição ao diário</p>
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
                    {/* Tipo de Refeição */}
                    <div>
                        <div className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">Tipo de refeição:</div>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                            {tiposRefeicao.map((t) => (
                                <button
                                    key={t.value}
                                    onClick={() => setTipo(t.value)}
                                    className={`
                                        flex flex-col items-center justify-center p-3 rounded-xl border transition-all
                                        ${tipo === t.value
                                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                                            : 'border-white/5 bg-[#0D121F] text-gray-400 hover:border-white/20'
                                        }
                                    `}
                                >
                                    <div className="mb-2">{t.icon}</div>
                                    <div className="text-[10px] font-bold text-center whitespace-nowrap uppercase">{t.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Método de Input */}
                    <div>
                        <div className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">Como deseja registrar?</div>
                        <div className="grid grid-cols-3 gap-4">
                            <button
                                onClick={() => setMetodo('texto')}
                                className={`
                                    p-6 rounded-2xl border transition-all text-center group
                                    ${metodo === 'texto'
                                        ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                                        : 'border-white/5 bg-[#0D121F] text-gray-400 hover:border-white/20'
                                    }
                                `}
                            >
                                <div className={`mb-3 flex justify-center ${metodo === 'texto' ? 'text-amber-400' : 'text-gray-500 group-hover:text-amber-400'}`}>
                                    <Type size={28} />
                                </div>
                                <div className="text-sm font-bold uppercase tracking-tight">Texto</div>
                                <div className="text-[10px] opacity-60 mt-1">Descrever</div>
                            </button>

                            <button
                                onClick={() => setMetodo('foto')}
                                className={`
                                    p-6 rounded-2xl border transition-all text-center group
                                    ${metodo === 'foto'
                                        ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                                        : 'border-white/5 bg-[#0D121F] text-gray-400 hover:border-white/20'
                                    }
                                `}
                            >
                                <div className={`mb-3 flex justify-center ${metodo === 'foto' ? 'text-amber-400' : 'text-gray-500 group-hover:text-amber-400'}`}>
                                    <Camera size={28} />
                                </div>
                                <div className="text-sm font-bold uppercase tracking-tight">Foto</div>
                                <div className="text-[10px] opacity-60 mt-1">Tirar foto</div>
                            </button>

                            <button
                                onClick={() => setMetodo('busca')}
                                className={`
                                    p-6 rounded-2xl border transition-all text-center group
                                    ${metodo === 'busca'
                                        ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                                        : 'border-white/5 bg-[#0D121F] text-gray-400 hover:border-white/20'
                                    }
                                `}
                            >
                                <div className={`mb-3 flex justify-center ${metodo === 'busca' ? 'text-amber-400' : 'text-gray-500 group-hover:text-amber-400'}`}>
                                    <Search size={28} />
                                </div>
                                <div className="text-sm font-bold uppercase tracking-tight">Buscar</div>
                                <div className="text-[10px] opacity-60 mt-1">Database</div>
                            </button>
                        </div>
                    </div>

                    {/* Input baseado no método */}
                    {metodo === 'texto' && (
                        <div>
                            <label className="text-xs font-bold text-gray-500 block mb-3 uppercase tracking-wider">
                                Descreva sua refeição:
                            </label>
                            <textarea
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                placeholder="Ex: 200g de frango grelhado, 150g de arroz integral, salada..."
                                rows={4}
                                className="w-full bg-[#0D121F] border border-white/5 rounded-2xl px-5 py-4
                                    text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 
                                    resize-none transition-all text-base leading-relaxed"
                            />
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-2 uppercase tracking-wide font-medium">
                                <Lightbulb size={12} className="text-amber-500" />
                                <span>A IA vai estimar os macros automaticamente</span>
                            </div>
                        </div>
                    )}

                    {metodo === 'foto' && (
                        <div className="border-2 border-dashed border-white/5 rounded-2xl p-12 text-center bg-[#0D121F]/50">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Camera className="text-gray-500" size={32} />
                            </div>
                            <div className="text-white font-bold uppercase tracking-tight mb-1">Tire uma foto</div>
                            <div className="text-sm text-gray-500 mb-6 font-light">A IA vai analisar e estimar os macros</div>
                            <button className="px-8 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-500 transition-all shadow-lg shadow-amber-900/20">
                                Abrir Câmera
                            </button>
                        </div>
                    )}

                    {metodo === 'busca' && (
                        <div>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                <input
                                    type="text"
                                    placeholder="Buscar alimento..."
                                    className="w-full bg-[#0D121F] border border-white/5 rounded-2xl pl-12 pr-6 py-4
                                        text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-all font-medium"
                                />
                            </div>
                            <div className="text-[10px] text-gray-500 mt-2 uppercase tracking-wide font-medium">
                                Busque por nome, marca ou categoria
                            </div>
                        </div>
                    )}

                    {/* Estimativa de Macros */}
                    {descricao && metodo === 'texto' && (
                        <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-6">
                            <div className="text-amber-400 font-bold mb-4 flex items-center gap-2 text-xs uppercase tracking-widest">
                                <Bot size={16} />
                                Estimativa da IA
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Calorias</div>
                                    <input
                                        type="number"
                                        value={calorias}
                                        onChange={(e) => setCalorias(Number(e.target.value))}
                                        className="w-full bg-[#131B2C] border border-white/10 rounded-xl px-3 py-2 text-white text-sm font-bold focus:border-amber-500/50 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Proteína (g)</div>
                                    <input
                                        type="number"
                                        value={proteina}
                                        onChange={(e) => setProteina(Number(e.target.value))}
                                        className="w-full bg-[#131B2C] border border-white/10 rounded-xl px-3 py-2 text-white text-sm font-bold focus:border-amber-500/50 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Carbos (g)</div>
                                    <input
                                        type="number"
                                        value={carboidrato}
                                        onChange={(e) => setCarboidrato(Number(e.target.value))}
                                        className="w-full bg-[#131B2C] border border-white/10 rounded-xl px-3 py-2 text-white text-sm font-bold focus:border-amber-500/50 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Gordura (g)</div>
                                    <input
                                        type="number"
                                        value={gordura}
                                        onChange={(e) => setGordura(Number(e.target.value))}
                                        className="w-full bg-[#131B2C] border border-white/10 rounded-xl px-3 py-2 text-white text-sm font-bold focus:border-amber-500/50 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="text-[10px] text-gray-600 mt-4 italic font-light">
                                * Você pode ajustar os valores se necessário
                            </div>
                        </div>
                    )}
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
                        disabled={!descricao}
                        className="flex-1 px-6 py-4 rounded-xl bg-emerald-600 text-white font-bold
                            hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20 
                            disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                        Registrar Refeição
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RegistrarRefeicaoModal
