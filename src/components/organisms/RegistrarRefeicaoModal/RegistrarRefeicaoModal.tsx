/**
 * RegistrarRefeicaoModal — Modal para registrar refeição via texto OU foto
 * 
 * Dois modos:
 * 1. TEXTO: O atleta descreve o que comeu → sistema estima macros → confirma → salva
 * 2. FOTO: O atleta tira foto → Gemini Vision analisa → confirma → salva
 */

import React, { useState, useRef, useEffect } from 'react'
import { X, Send, Check, Edit3, UtensilsCrossed, Loader2, Camera, Type, RotateCcw, AlertCircle } from 'lucide-react'
import { estimarMacros, ResultadoEstimativa, MacroEstimativa } from '../../../services/macroEstimator'
import {
    analisarFotoRefeicao,
    redimensionarImagem,
    getConfiancaBadge,
    type AlimentoIdentificado,
    type ResultadoFotoAnalise,
} from '../../../services/foodVisionService'

type InputMode = 'texto' | 'foto'
type ModalStep = 'input' | 'analyzing' | 'review' | 'saved'

interface RegistrarRefeicaoModalProps {
    isOpen: boolean
    initialMode?: InputMode
    onClose: () => void
    onSave: (macros: {
        calorias: number
        proteina: number
        carboidrato: number
        gordura: number
        descricao: string
        fotoBase64?: string
        fonte: 'manual' | 'foto_ia'
        confianca?: number
    }) => void
}

const EXEMPLOS = [
    '200g frango, arroz e salada',
    '3 ovos, 2 fatias pão, café',
    'Shake whey, banana, aveia',
    '150g carne, batata doce, brócolis',
]

export function RegistrarRefeicaoModal({ isOpen, initialMode = 'texto', onClose, onSave }: RegistrarRefeicaoModalProps) {
    const [mode, setMode] = useState<InputMode>(initialMode)
    const [step, setStep] = useState<ModalStep>('input')
    const [texto, setTexto] = useState('')
    const [estimativa, setEstimativa] = useState<ResultadoEstimativa | null>(null)
    const [fotoAnalise, setFotoAnalise] = useState<ResultadoFotoAnalise | null>(null)
    const [fotoPreview, setFotoPreview] = useState<string | null>(null)
    const [fotoBase64, setFotoBase64] = useState<string | null>(null)
    const [editandoItem, setEditandoItem] = useState<number | null>(null)
    const [saving, setSaving] = useState(false)
    const [erroFoto, setErroFoto] = useState<string | null>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Focus on open
    useEffect(() => {
        if (isOpen && step === 'input' && mode === 'texto') {
            setTimeout(() => inputRef.current?.focus(), 200)
        }
    }, [isOpen, step, mode])

    // Reset on close
    useEffect(() => {
        if (!isOpen) {
            setStep('input')
            setMode(initialMode)
            setTexto('')
            setEstimativa(null)
            setFotoAnalise(null)
            setFotoPreview(null)
            setFotoBase64(null)
            setEditandoItem(null)
            setErroFoto(null)
        }
    }, [isOpen, initialMode])

    if (!isOpen) return null

    // ─── HANDLERS TEXTO ───────────────────────────────

    const handleEstimar = () => {
        if (!texto.trim()) return
        const resultado = estimarMacros(texto)
        setEstimativa(resultado)
        setStep('review')
    }

    // ─── HANDLERS FOTO ────────────────────────────────

    const handleCapturarFoto = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setErroFoto(null)
        setStep('analyzing')

        try {
            // Preview imediato
            const previewUrl = URL.createObjectURL(file)
            setFotoPreview(previewUrl)

            // Redimensionar e converter para base64
            const { base64, mimeType } = await redimensionarImagem(file, 1024)
            setFotoBase64(base64)

            // Analisar via Gemini Vision
            const resultado = await analisarFotoRefeicao(base64, mimeType)

            if (!resultado || resultado.itens.length === 0) {
                setErroFoto('Não foi possível identificar alimentos na foto. Tente novamente com melhor iluminação ou use o modo texto.')
                setStep('input')
                return
            }

            setFotoAnalise(resultado)
            setStep('review')
        } catch (err) {
            console.error('[RegistrarRefeicao] Erro ao analisar foto:', err)
            setErroFoto('Erro ao analisar a foto. Verifique sua conexão e tente novamente.')
            setStep('input')
        }

        // Reset input para permitir re-captura
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    // ─── HANDLERS REVIEW ──────────────────────────────

    const getReviewItens = (): Array<{ alimento: string; porcaoG: number; calorias: number; proteina: number; carboidrato: number; gordura: number; confianca?: number }> => {
        if (mode === 'foto' && fotoAnalise) return fotoAnalise.itens
        if (mode === 'texto' && estimativa) return estimativa.itens.map(i => ({ ...i, confianca: undefined }))
        return []
    }

    const getReviewTotal = () => {
        if (mode === 'foto' && fotoAnalise) return fotoAnalise.total
        if (mode === 'texto' && estimativa) return estimativa.total
        return { calorias: 0, proteina: 0, carboidrato: 0, gordura: 0 }
    }

    const handleAjustarPorcao = (index: number, novaPorcao: number) => {
        const itens = getReviewItens()
        const item = itens[index]
        if (!item || novaPorcao <= 0) return

        const fator = novaPorcao / item.porcaoG
        const novoItem = {
            ...item,
            porcaoG: novaPorcao,
            calorias: Math.round(item.calorias * fator),
            proteina: Math.round(item.proteina * fator * 10) / 10,
            carboidrato: Math.round(item.carboidrato * fator * 10) / 10,
            gordura: Math.round(item.gordura * fator * 10) / 10,
        }

        if (mode === 'foto' && fotoAnalise) {
            const novosItens = [...fotoAnalise.itens]
            novosItens[index] = { ...novosItens[index], ...novoItem }
            const novoTotal = recalcularTotal(novosItens)
            setFotoAnalise({ ...fotoAnalise, itens: novosItens, total: novoTotal })
        } else if (mode === 'texto' && estimativa) {
            const novosItens = [...estimativa.itens]
            novosItens[index] = novoItem as MacroEstimativa
            const novoTotal = recalcularTotal(novosItens)
            setEstimativa({ ...estimativa, itens: novosItens, total: novoTotal })
        }

        setEditandoItem(null)
    }

    const recalcularTotal = (itens: Array<{ calorias: number; proteina: number; carboidrato: number; gordura: number }>) => {
        return itens.reduce(
            (acc, i) => ({
                calorias: acc.calorias + i.calorias,
                proteina: Math.round((acc.proteina + i.proteina) * 10) / 10,
                carboidrato: Math.round((acc.carboidrato + i.carboidrato) * 10) / 10,
                gordura: Math.round((acc.gordura + i.gordura) * 10) / 10,
            }),
            { calorias: 0, proteina: 0, carboidrato: 0, gordura: 0 }
        )
    }

    // ─── SALVAR ───────────────────────────────────────

    const handleSalvar = async () => {
        const total = getReviewTotal()
        if (total.calorias === 0) return

        setSaving(true)

        const descricao = mode === 'foto'
            ? fotoAnalise?.itens.map(i => `${i.porcaoG}g ${i.alimento}`).join(', ') || 'Refeição via foto'
            : estimativa?.textoOriginal || ''

        await onSave({
            calorias: total.calorias,
            proteina: total.proteina,
            carboidrato: total.carboidrato,
            gordura: total.gordura,
            descricao,
            fotoBase64: mode === 'foto' ? fotoBase64 || undefined : undefined,
            fonte: mode === 'foto' ? 'foto_ia' : 'manual',
            confianca: mode === 'foto' ? fotoAnalise?.confiancaGeral : undefined,
        })

        setSaving(false)
        setStep('saved')
        setTimeout(() => onClose(), 1500)
    }

    const handleExemplo = (ex: string) => {
        setTexto(ex)
    }

    const handleModeChange = (newMode: InputMode) => {
        setMode(newMode)
        setStep('input')
        setEstimativa(null)
        setFotoAnalise(null)
        setFotoPreview(null)
        setFotoBase64(null)
        setErroFoto(null)
        setEditandoItem(null)
    }

    // ─── RENDER ───────────────────────────────────────

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg mx-auto bg-background-dark border border-white/10 rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
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
                                {step === 'input' && mode === 'texto' && 'Descreva o que comeu'}
                                {step === 'input' && mode === 'foto' && 'Tire uma foto do prato'}
                                {step === 'analyzing' && 'Analisando sua refeição...'}
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

                {/* Mode Toggle (only on input step) */}
                {step === 'input' && (
                    <div className="px-6 pt-4">
                        <div className="flex bg-white/[0.03] rounded-xl p-1 border border-white/5">
                            <button
                                onClick={() => handleModeChange('texto')}
                                className={`flex-1 py-2.5 px-3 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${mode === 'texto'
                                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                                    : 'text-gray-500 border border-transparent'
                                    }`}
                            >
                                <Type size={14} />
                                Texto
                            </button>
                            <button
                                onClick={() => handleModeChange('foto')}
                                className={`flex-1 py-2.5 px-3 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${mode === 'foto'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'text-gray-500 border border-transparent'
                                    }`}
                            >
                                <Camera size={14} />
                                Foto
                            </button>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-5">

                    {/* ═══ Step: INPUT TEXTO ═══ */}
                    {step === 'input' && mode === 'texto' && (
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

                    {/* ═══ Step: INPUT FOTO ═══ */}
                    {step === 'input' && mode === 'foto' && (
                        <div className="space-y-5">
                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            {/* Area de captura */}
                            <button
                                onClick={handleCapturarFoto}
                                className="w-full aspect-[4/3] bg-white/[0.03] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group"
                            >
                                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                                    <Camera size={32} className="text-emerald-400" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold text-white uppercase tracking-wider">
                                        Tirar Foto
                                    </p>
                                    <p className="text-[10px] text-gray-500 mt-1">
                                        Fotografe seu prato para análise automática
                                    </p>
                                </div>
                            </button>

                            {/* Erro */}
                            {erroFoto && (
                                <div className="flex items-start gap-3 p-3.5 bg-rose-500/5 border border-rose-500/20 rounded-xl">
                                    <AlertCircle size={16} className="text-rose-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-[11px] text-rose-300 leading-relaxed">{erroFoto}</p>
                                </div>
                            )}

                            <p className="text-[10px] text-gray-600 leading-relaxed text-center">
                                📸 Dicas: boa iluminação, foto de cima, prato inteiro visível
                            </p>
                        </div>
                    )}

                    {/* ═══ Step: ANALYZING ═══ */}
                    {step === 'analyzing' && (
                        <div className="space-y-5">
                            {/* Preview da foto */}
                            {fotoPreview && (
                                <div className="rounded-2xl overflow-hidden border border-white/10">
                                    <img
                                        src={fotoPreview}
                                        alt="Foto da refeição"
                                        className="w-full aspect-[4/3] object-cover opacity-80"
                                    />
                                </div>
                            )}

                            {/* Loading */}
                            <div className="text-center py-4 space-y-3">
                                <Loader2 size={32} className="text-emerald-400 animate-spin mx-auto" />
                                <div>
                                    <p className="text-sm font-bold text-white">Analisando sua refeição...</p>
                                    <p className="text-[10px] text-gray-500 mt-1">
                                        A IA está identificando os alimentos e calculando os macros
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ═══ Step: REVIEW ═══ */}
                    {step === 'review' && (
                        <div className="space-y-5">
                            {/* Preview da foto (modo foto) */}
                            {mode === 'foto' && fotoPreview && (
                                <div className="rounded-2xl overflow-hidden border border-white/10">
                                    <img
                                        src={fotoPreview}
                                        alt="Foto da refeição"
                                        className="w-full aspect-[4/3] object-cover"
                                    />
                                    {fotoAnalise?.observacao && (
                                        <div className="px-3.5 py-2.5 bg-white/[0.03]">
                                            <p className="text-[10px] text-gray-400 italic">
                                                🤖 {fotoAnalise.observacao}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Itens encontrados */}
                            {getReviewItens().length > 0 ? (
                                <div className="space-y-2">
                                    {getReviewItens().map((item, i) => {
                                        const badge = item.confianca !== undefined ? getConfiancaBadge(item.confianca) : null
                                        return (
                                            <div
                                                key={i}
                                                className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/5 rounded-xl"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-white capitalize block truncate">
                                                            {item.alimento}
                                                        </span>
                                                        {badge && (
                                                            <span
                                                                className={`text-[9px] font-bold ${badge.cor}`}
                                                                title={`Confiança: ${item.confianca}%`}
                                                            >
                                                                {badge.emoji}
                                                            </span>
                                                        )}
                                                    </div>
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
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-sm text-gray-400">Nenhum alimento reconhecido 😕</p>
                                    <p className="text-xs text-gray-600 mt-1">Tente descrever de outra forma</p>
                                </div>
                            )}

                            {/* Total */}
                            {getReviewItens().length > 0 && (
                                <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                                            Total estimado
                                        </span>
                                        {mode === 'foto' && fotoAnalise && (
                                            <span className="text-[9px] text-gray-500">
                                                {getConfiancaBadge(fotoAnalise.confiancaGeral).emoji} Confiança {fotoAnalise.confiancaGeral}%
                                            </span>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-4 gap-3">
                                        <div className="text-center">
                                            <span className="text-lg font-black text-white block">{getReviewTotal().calorias}</span>
                                            <span className="text-[9px] text-gray-500 uppercase">kcal</span>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-lg font-black text-purple-400 block">{getReviewTotal().proteina}</span>
                                            <span className="text-[9px] text-gray-500 uppercase">Proteína</span>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-lg font-black text-orange-400 block">{getReviewTotal().carboidrato}</span>
                                            <span className="text-[9px] text-gray-500 uppercase">Carbs</span>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-lg font-black text-yellow-400 block">{getReviewTotal().gordura}</span>
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

                    {/* ═══ Step: SAVED ═══ */}
                    {step === 'saved' && (
                        <div className="text-center py-10 space-y-4">
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                                <Check size={32} className="text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Refeição Registrada!</h3>
                                <p className="text-sm text-gray-400 mt-1">
                                    +{getReviewTotal().calorias} kcal adicionadas
                                </p>
                                {mode === 'foto' && (
                                    <p className="text-[10px] text-emerald-400/70 mt-1">📸 via análise de foto</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer actions */}
                {step !== 'saved' && step !== 'analyzing' && (
                    <div className="px-6 pb-6 pt-2">
                        {/* Botão INPUT TEXTO */}
                        {step === 'input' && mode === 'texto' && (
                            <button
                                onClick={handleEstimar}
                                disabled={!texto.trim()}
                                className="w-full py-3.5 px-4 bg-indigo-500 hover:bg-indigo-600 disabled:bg-white/5 disabled:text-gray-600 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                            >
                                <Send size={16} />
                                ANALISAR REFEIÇÃO
                            </button>
                        )}

                        {/* Botão INPUT FOTO (já captura via câmera acima) - nenhum botão extra necessário */}

                        {/* Botões REVIEW */}
                        {step === 'review' && getReviewItens().length > 0 && (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setStep('input')
                                        if (mode === 'foto') {
                                            setFotoAnalise(null)
                                            setFotoPreview(null)
                                            setFotoBase64(null)
                                        }
                                    }}
                                    className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-gray-400 transition-all flex items-center justify-center gap-2"
                                >
                                    <RotateCcw size={14} />
                                    {mode === 'foto' ? 'NOVA FOTO' : 'VOLTAR'}
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

                        {step === 'review' && getReviewItens().length === 0 && (
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
