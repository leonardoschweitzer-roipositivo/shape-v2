/**
 * RegistrarTreinoModal - Modal para registrar treino
 */

import React, { useState } from 'react'
import { X, Dumbbell, Activity, Flame, AlertCircle, TrendingDown, Clock, MessageSquare, ClipboardCheck } from 'lucide-react'
import { useDailyTrackingStore } from '../../../stores/useDailyTrackingStore'

export const RegistrarTreinoModal: React.FC = () => {
    const { fecharModal, registrarTreino, resumoDiario } = useDailyTrackingStore()

    const [seguiuPlano, setSeguiuPlano] = useState<'sim' | 'parcial' | 'nao'>('sim')
    const [intensidade, setIntensidade] = useState<1 | 2 | 3 | 4>(3)
    const [duracao, setDuracao] = useState(60)
    const [temDor, setTemDor] = useState(false)
    const [observacoes, setObservacoes] = useState('')

    const intensidadeIcons = {
        1: <AlertCircle size={24} />,
        2: <TrendingDown size={24} />,
        3: <Activity size={24} />,
        4: <Flame size={24} />,
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-[#131B2C] rounded-2xl max-w-lg w-full border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-[#131B2C] z-10">
                    <div>
                        <div className="flex items-center gap-2">
                            <Dumbbell size={20} className="text-purple-400" />
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Registrar Treino</h2>
                        </div>
                        <p className="text-sm text-gray-500 font-light mt-1">{resumoDiario.treino.tipo}</p>
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
                    {/* Treino Sugerido */}
                    {resumoDiario.treino.planejado && (
                        <div className="bg-purple-500/5 border border-purple-500/10 rounded-2xl p-6">
                            <div className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                <ClipboardCheck size={14} />
                                Treino Planejado
                            </div>
                            <div className="text-white font-bold text-lg">{resumoDiario.treino.tipo}</div>
                        </div>
                    )}

                    {/* Seguiu o plano? */}
                    <div>
                        <div className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">Seguiu o plano?</div>
                        <div className="grid grid-cols-3 gap-3">
                            {(['sim', 'parcial', 'nao'] as const).map((opcao) => (
                                <button
                                    key={opcao}
                                    onClick={() => setSeguiuPlano(opcao)}
                                    className={`
                                        p-4 rounded-xl border transition-all font-bold uppercase tracking-tight text-xs
                                        ${seguiuPlano === opcao
                                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold'
                                            : 'border-white/5 bg-[#0D121F] text-gray-500 hover:border-white/20'
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
                        <div className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">Como foi o treino?</div>
                        <div className="grid grid-cols-4 gap-2">
                            {([1, 2, 3, 4] as const).map((nivel) => (
                                <button
                                    key={nivel}
                                    onClick={() => setIntensidade(nivel)}
                                    className={`
                                        flex flex-col items-center justify-center p-4 rounded-xl border transition-all
                                        ${intensidade === nivel
                                            ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                                            : 'border-white/5 bg-[#0D121F] text-gray-500 hover:border-white/20'
                                        }
                                    `}
                                >
                                    <div className="mb-2">{intensidadeIcons[nivel]}</div>
                                    <div className="text-[10px] font-bold uppercase whitespace-nowrap">{intensidadeLabels[nivel]}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Duração */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 block mb-3 uppercase tracking-wider flex items-center gap-2">
                            <Clock size={14} className="text-purple-400" />
                            Duração (minutos):
                        </label>
                        <input
                            type="number"
                            value={duracao}
                            onChange={(e) => setDuracao(Number(e.target.value))}
                            className="w-full bg-[#0D121F] border border-white/5 rounded-xl px-4 py-3
                                text-white focus:outline-none focus:border-purple-500/50 transition-all font-medium"
                        />
                    </div>

                    {/* Dor/Desconforto */}
                    <div>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={temDor}
                                    onChange={(e) => setTemDor(e.target.checked)}
                                    className="sr-only"
                                />
                                <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center
                                    ${temDor ? 'bg-red-600 border-red-600' : 'border-white/10 bg-[#0D121F] group-hover:border-white/20'}`}>
                                    {temDor && <AlertCircle size={14} className="text-white" />}
                                </div>
                            </div>
                            <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors uppercase tracking-tight font-bold">Sentiu dor ou desconforto</span>
                        </label>
                    </div>

                    {/* Observações */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 block mb-3 uppercase tracking-wider flex items-center gap-2">
                            <MessageSquare size={14} className="text-purple-400" />
                            Observações (opcional):
                        </label>
                        <textarea
                            value={observacoes}
                            onChange={(e) => setObservacoes(e.target.value)}
                            placeholder="Ex: Aumentei carga no supino, senti bem..."
                            rows={3}
                            className="w-full bg-[#0D121F] border border-white/5 rounded-2xl px-5 py-4
                                text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 
                                resize-none transition-all text-base leading-relaxed"
                        />
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
                        className="flex-1 px-6 py-4 rounded-xl bg-purple-600 text-white font-bold
                            hover:bg-purple-500 transition-all shadow-lg shadow-purple-900/20"
                    >
                        Registrar Treino
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RegistrarTreinoModal
