/**
 * ReportarDorModal - Modal para reportar dor/desconforto
 */

import React, { useState } from 'react'
import { X, Activity, Hand, Bone, Footprints, Frown, Megaphone, AlertTriangle, Calendar, Search } from 'lucide-react'
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

    const locaisDor: { value: RegiaoDor; label: string; icon: React.ReactNode }[] = [
        { value: 'ombro_esquerdo', label: 'Ombro Esq', icon: <Activity size={18} /> },
        { value: 'ombro_direito', label: 'Ombro Dir', icon: <Activity size={18} /> },
        { value: 'braco_esquerdo', label: 'Braço Esq', icon: <Activity size={18} /> },
        { value: 'braco_direito', label: 'Braço Dir', icon: <Activity size={18} /> },
        { value: 'antebraco_esquerdo', label: 'Antebraço Esq', icon: <Hand size={18} /> },
        { value: 'antebraco_direito', label: 'Antebraço Dir', icon: <Hand size={18} /> },
        { value: 'lombar', label: 'Lombar', icon: <Bone size={18} /> },
        { value: 'peito', label: 'Peito', icon: <Bone size={18} /> },
        { value: 'coxa_esquerda', label: 'Coxa Esq', icon: <Activity size={18} /> },
        { value: 'coxa_direita', label: 'Coxa Dir', icon: <Activity size={18} /> },
        { value: 'joelho_esquerdo', label: 'Joelho Esq', icon: <Activity size={18} /> },
        { value: 'joelho_direito', label: 'Joelho Dir', icon: <Activity size={18} /> },
        { value: 'panturrilha_esquerda', label: 'Panturrilha Esq', icon: <Footprints size={18} /> },
        { value: 'panturrilha_direita', label: 'Panturrilha Dir', icon: <Footprints size={18} /> },
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-[#131B2C] rounded-2xl max-w-2xl w-full border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-[#131B2C] z-10">
                    <div>
                        <div className="flex items-center gap-2">
                            <Activity size={20} className="text-red-400" />
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Reportar Dor</h2>
                        </div>
                        <p className="text-sm text-gray-500 font-light mt-1">Informe local e intensidade da dor</p>
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
                    {/* Local da Dor */}
                    <div>
                        <div className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">Onde está a dor?</div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {locaisDor.map((local) => (
                                <button
                                    key={local.value}
                                    onClick={() => setLocalDor(local.value)}
                                    className={`
                                        flex flex-col items-center justify-center p-3 rounded-xl border transition-all
                                        ${localDor === local.value
                                            ? 'border-red-500 bg-red-500/10 text-red-400'
                                            : 'border-white/5 bg-[#0D121F] text-gray-500 hover:border-white/20'
                                        }
                                    `}
                                >
                                    <div className="mb-2">{local.icon}</div>
                                    <div className="text-[10px] font-bold uppercase text-center">{local.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Intensidade da Dor */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Intensidade da dor</label>
                            <span className="text-2xl font-bold text-white tracking-tighter">{intensidade}/10</span>
                        </div>
                        <input
                            type="range"
                            min={1}
                            max={10}
                            value={intensidade}
                            onChange={(e) => setIntensidade(Number(e.target.value))}
                            className="w-full h-3 bg-[#0D121F] rounded-full appearance-none cursor-pointer accent-red-500
                                border border-white/5"
                        />
                        <div className="flex justify-between text-[10px] font-bold text-gray-600 mt-3 uppercase tracking-widest">
                            <span>Leve</span>
                            <span>Moderada</span>
                            <span>Severa</span>
                        </div>

                        {/* Visual Indicators */}
                        <div className="flex justify-between mt-6 px-1">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((nivel) => (
                                <div
                                    key={nivel}
                                    className={`w-1.5 h-6 rounded-full transition-all duration-300
                                        ${intensidade >= nivel
                                            ? nivel <= 3 ? 'bg-emerald-500' : nivel <= 7 ? 'bg-amber-500' : 'bg-red-500'
                                            : 'bg-white/5'}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Tipo de Dor */}
                    <div>
                        <div className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">Como é a dor?</div>
                        <div className="grid grid-cols-2 gap-3">
                            {tiposDor.map((tipoDor) => (
                                <button
                                    key={tipoDor.value}
                                    onClick={() => setTipo(tipoDor.value)}
                                    className={`
                                        p-4 rounded-xl border-2 transition-all text-xs font-bold uppercase tracking-tight
                                        ${tipo === tipoDor.value
                                            ? `border-${tipoDor.color}-500 bg-${tipoDor.color}-500/10 text-${tipoDor.color}-400`
                                            : 'border-white/5 bg-[#0D121F] text-gray-500 hover:border-white/10'
                                        }
                                    `}
                                >
                                    {tipoDor.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Quando começou */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 block mb-3 uppercase tracking-wider flex items-center gap-2">
                                <Calendar size={14} className="text-red-400" />
                                Quando começou?
                            </label>
                            <select
                                value={quandoComecou}
                                onChange={(e) => setQuandoComecou(e.target.value)}
                                className="w-full bg-[#0D121F] border border-white/5 rounded-xl px-4 py-3
                                    text-white focus:outline-none focus:border-red-500/50 appearance-none font-medium"
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
                            <label className="text-xs font-bold text-gray-500 block mb-3 uppercase tracking-wider flex items-center gap-2">
                                <Search size={14} className="text-red-400" />
                                O que piora a dor?
                            </label>
                            <input
                                type="text"
                                value={oquePiora}
                                onChange={(e) => setOquePiora(e.target.value)}
                                placeholder="Ex: movimento específico..."
                                className="w-full bg-[#0D121F] border border-white/5 rounded-xl px-4 py-3
                                    text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 font-medium"
                            />
                        </div>
                    </div>

                    {/* Descrição */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 block mb-3 uppercase tracking-wider">
                            Descrição adicional (opcional):
                        </label>
                        <textarea
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Descreva melhor a dor..."
                            rows={3}
                            className="w-full bg-[#0D121F] border border-white/5 rounded-2xl px-5 py-4
                                text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 
                                resize-none transition-all text-base leading-relaxed"
                        />
                    </div>

                    {/* Aviso */}
                    <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 flex gap-4 items-start">
                        <AlertTriangle className="text-red-500 shrink-0" size={20} />
                        <div className="text-red-400 text-xs font-medium leading-relaxed">
                            <strong>Importante:</strong> Dores persistentes ou intensas devem ser avaliadas por um profissional de saúde.
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
                        className="flex-1 px-6 py-4 rounded-xl bg-red-600 text-white font-bold
                            hover:bg-red-500 transition-all shadow-lg shadow-red-900/20"
                    >
                        Reportar Dor
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ReportarDorModal
