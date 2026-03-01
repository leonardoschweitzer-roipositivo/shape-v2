/**
 * RegistrarRefeicaoModal — Modal para registrar refeição via texto
 * 
 * O atleta descreve o que comeu → sistema estima macros → confirma → salva
 */

import React, { useState, useRef, useEffect } from 'react'
import { X, Send, Check, Edit3, UtensilsCrossed, Loader2 } from 'lucide-react'
import { estimarMacros, ResultadoEstimativa, MacroEstimativa } from '../../../services/macroEstimator'

type ModalStep = 'input' | 'review' | 'saved'

interface RegistrarRefeicaoModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (macros: { calorias: number; proteina: number; carboidrato: number; gordura: number; descricao: string }) => void
}

const EXEMPLOS = [
    '200g frango, arroz e salada',
    '3 ovos, 2 fatias pão, café',
    'Shake whey, banana, aveia',
    '150g carne, batata doce, brócolis',
]

export function RegistrarRefeicaoModal({ isOpen, onClose, onSave }: RegistrarRefeicaoModalProps) {
    const [step, setStep] = useState<ModalStep>('input')
    const [texto, setTexto] = useState('')
    const [estimativa, setEstimativa] = useState<ResultadoEstimativa | null>(null)
    const [editandoItem, setEditandoItem] = useState<number | null>(null)
    const [saving, setSaving] = useState(false)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    // Focus on open
    useEffect(() => {
        if (isOpen && step === 'input') {
            setTimeout(() => inputRef.current?.focus(), 200)
        }
    }, [isOpen, step])

    // Reset on close
    useEffect(() => {
        if (!isOpen) {
            setStep('input')
            setTexto('')
            setEstimativa(null)
            setEditandoItem(null)
        }
    }, [isOpen])

    if (!isOpen) return null

    const handleEstimar = () => {
        if (!texto.trim()) return
        const resultado = estimarMacros(texto)
        setEstimativa(resultado)
        setStep('review')
    }

    const handleSalvar = async () => {
        if (!estimativa) return
        setSaving(true)
        await onSave({
            calorias: estimativa.total.calorias,
            proteina: estimativa.total.proteina,
            carboidrato: estimativa.total.carboidrato,
            gordura: estimativa.total.gordura,
            descricao: estimativa.textoOriginal,
        })
        setSaving(false)
        setStep('saved')
        setTimeout(() => onClose(), 1500)
    }

    const handleAjustarPorcao = (index: number, novaPorcao: number) => {
        if (!estimativa) return

        const item = estimativa.itens[index]
        const fator = novaPorcao / item.porcaoG

        const novoItem: MacroEstimativa = {
            ...item,
            porcaoG: novaPorcao,
            calorias: Math.round(item.calorias * fator),
            proteina: Math.round(item.proteina * fator * 10) / 10,
            carboidrato: Math.round(item.carboidrato * fator * 10) / 10,
            gordura: Math.round(item.gordura * fator * 10) / 10,
        }

        const novosItens = [...estimativa.itens]
        novosItens[index] = novoItem

        const novoTotal = novosItens.reduce(
            (acc, i) => ({
                calorias: acc.calorias + i.calorias,
                proteina: acc.proteina + i.proteina,
                carboidrato: acc.carboidrato + i.carboidrato,
                gordura: acc.gordura + i.gordura,
            }),
            { calorias: 0, proteina: 0, carboidrato: 0, gordura: 0 }
        )

        setEstimativa({ ...estimativa, itens: novosItens, total: novoTotal })
        setEditandoItem(null)
    }

    const handleExemplo = (ex: string) => {
        setTexto(ex)
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg mx-auto bg-[#0A0F1C] border border-white/10 rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                            <UtensilsCrossed size={18} className="text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                                Registrar Refeição
                            </h3>
                            <p className="text-[10px] text-gray-500">
                                {step === 'input' && 'Descreva o que comeu'}
                                {step === 'review' && 'Confira a estimativa'}
                                {step === 'saved' && 'Registrado!'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                        <X size={16} className="text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-5">

                    {/* Step 1: Input */}
                    {step === 'input' && (
                        <div className="space-y-5">
                            <textarea
                                ref={inputRef}
                                value={texto}
                                onChange={(e) => setTexto(e.target.value)}
                                placeholder="Ex: 200g frango grelhado, arroz, salada e suco"
                                className="w-full h-28 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 resize-none transition-all"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        handleEstimar()
                                    }
                                }}
                            />

                            {/* Exemplos */}
                            <div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                                    Exemplos rápidos
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {EXEMPLOS.map((ex) => (
                                        <button
                                            key={ex}
                                            onClick={() => handleExemplo(ex)}
                                            className="text-[11px] px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:text-white hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all"
                                        >
                                            {ex}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <p className="text-[10px] text-gray-600 leading-relaxed">
                                💡 Separe os itens por vírgula. Inclua porções quando possível (ex: "200g frango").
                                Se não informar, usaremos a porção padrão.
                            </p>
                        </div>
                    )}

                    {/* Step 2: Review */}
                    {step === 'review' && estimativa && (
                        <div className="space-y-5">
                            {/* Itens encontrados */}
                            {estimativa.itens.length > 0 ? (
                                <div className="space-y-2">
                                    {estimativa.itens.map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/5 rounded-xl"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <span className="text-sm font-semibold text-white capitalize block truncate">
                                                    {item.alimento}
                                                </span>
                                                <div className="flex items-center gap-3 mt-1">
                                                    {editandoItem === i ? (
                                                        <input
                                                            type="number"
                                                            defaultValue={item.porcaoG}
                                                            autoFocus
                                                            className="w-16 bg-white/10 border border-indigo-500/50 rounded px-2 py-0.5 text-xs text-white text-center"
                                                            onBlur={(e) => handleAjustarPorcao(i, Number(e.target.value) || item.porcaoG)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    handleAjustarPorcao(i, Number((e.target as HTMLInputElement).value) || item.porcaoG)
                                                                }
                                                            }}
                                                        />
                                                    ) : (
                                                        <button
                                                            onClick={() => setEditandoItem(i)}
                                                            className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                                                        >
                                                            <Edit3 size={10} />
                                                            {item.porcaoG}g
                                                        </button>
                                                    )}
                                                    <span className="text-[10px] text-gray-500">
                                                        {item.calorias} kcal
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <div className="text-[10px] text-gray-400 space-x-2">
                                                    <span className="text-purple-400">P {item.proteina}g</span>
                                                    <span className="text-orange-400">C {item.carboidrato}g</span>
                                                    <span className="text-yellow-400">G {item.gordura}g</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-sm text-gray-400">Nenhum alimento reconhecido 😕</p>
                                    <p className="text-xs text-gray-600 mt-1">Tente descrever de outra forma</p>
                                </div>
                            )}

                            {/* Total */}
                            {estimativa.itens.length > 0 && (
                                <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
                                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-3">
                                        Total estimado
                                    </span>
                                    <div className="grid grid-cols-4 gap-3">
                                        <div className="text-center">
                                            <span className="text-lg font-black text-white block">{estimativa.total.calorias}</span>
                                            <span className="text-[9px] text-gray-500 uppercase">kcal</span>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-lg font-black text-purple-400 block">{estimativa.total.proteina}</span>
                                            <span className="text-[9px] text-gray-500 uppercase">Proteína</span>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-lg font-black text-orange-400 block">{estimativa.total.carboidrato}</span>
                                            <span className="text-[9px] text-gray-500 uppercase">Carbs</span>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-lg font-black text-yellow-400 block">{estimativa.total.gordura}</span>
                                            <span className="text-[9px] text-gray-500 uppercase">Gordura</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <p className="text-[10px] text-gray-600 text-center">
                                Toque na porção para ajustar • Valores são estimativas
                            </p>
                        </div>
                    )}

                    {/* Step 3: Saved */}
                    {step === 'saved' && (
                        <div className="text-center py-10 space-y-4">
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                                <Check size={32} className="text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Refeição Registrada!</h3>
                                <p className="text-sm text-gray-400 mt-1">
                                    +{estimativa?.total.calorias} kcal adicionadas
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer actions */}
                {step !== 'saved' && (
                    <div className="px-6 pb-6 pt-2">
                        {step === 'input' && (
                            <button
                                onClick={handleEstimar}
                                disabled={!texto.trim()}
                                className="w-full py-3.5 px-4 bg-indigo-500 hover:bg-indigo-600 disabled:bg-white/5 disabled:text-gray-600 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                            >
                                <Send size={16} />
                                ANALISAR REFEIÇÃO
                            </button>
                        )}

                        {step === 'review' && estimativa && estimativa.itens.length > 0 && (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep('input')}
                                    className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-gray-400 transition-all"
                                >
                                    VOLTAR
                                </button>
                                <button
                                    onClick={handleSalvar}
                                    disabled={saving}
                                    className="flex-[2] py-3 px-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2"
                                >
                                    {saving ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Check size={16} />
                                    )}
                                    CONFIRMAR
                                </button>
                            </div>
                        )}

                        {step === 'review' && estimativa && estimativa.itens.length === 0 && (
                            <button
                                onClick={() => setStep('input')}
                                className="w-full py-3.5 px-4 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-sm font-bold text-white transition-all"
                            >
                                TENTAR NOVAMENTE
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
