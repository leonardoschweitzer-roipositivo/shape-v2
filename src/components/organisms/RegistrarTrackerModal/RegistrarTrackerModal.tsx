/**
 * RegistrarTrackerModal — Modal genérico para registros rápidos
 * 
 * Atende: Água, Peso, Sono e Dor.
 */

import React, { useState, useEffect, useRef } from 'react'
import { X, Check, Loader2, Droplets, Scale, Moon, Activity } from 'lucide-react'
import { TrackerRapidoType } from '../../../types/athlete-portal'

interface RegistrarTrackerModalProps {
    isOpen: boolean
    onClose: () => void
    tipo: TrackerRapidoType | null
    onSave: (valor: number | string, extra?: Record<string, any>) => Promise<void>
}

export function RegistrarTrackerModal({ isOpen, onClose, tipo, onSave }: RegistrarTrackerModalProps) {
    const [valor, setValor] = useState('')
    const [extra, setExtra] = useState('') // Para 'local' da dor
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    // Reset ao abrir
    useEffect(() => {
        if (isOpen) {
            setValor('')
            setExtra('')
            setSaved(false)
            setSaving(false)
            setTimeout(() => inputRef.current?.focus(), 200)
        }
    }, [isOpen, tipo])

    if (!isOpen || !tipo) return null

    const config = {
        agua: {
            titulo: 'Hidratação',
            subtitulo: 'Quanto de água você bebeu agora?',
            label: 'Mililitros (ml)',
            placeholder: '250',
            icone: <Droplets className="text-blue-400" size={20} />,
            bgIcone: 'bg-blue-500/20',
            unidade: 'ml'
        },
        peso: {
            titulo: 'Peso Corporal',
            subtitulo: 'Qual seu peso atual hoje?',
            label: 'Quilos (kg)',
            placeholder: '75.5',
            icone: <Scale className="text-emerald-400" size={20} />,
            bgIcone: 'bg-emerald-500/20',
            unidade: 'kg'
        },
        sono: {
            titulo: 'Qualidade do Sono',
            subtitulo: 'Quantas horas você dormiu na última noite?',
            label: 'Horas de sono',
            placeholder: '8',
            icone: <Moon className="text-purple-400" size={20} />,
            bgIcone: 'bg-purple-500/20',
            unidade: 'h'
        },
        dor: {
            titulo: 'Reportar Dor',
            subtitulo: 'Registre qualquer desconforto ou dor',
            label: 'Intensidade (1-10)',
            placeholder: '3',
            icone: <Activity className="text-red-400" size={20} />,
            bgIcone: 'bg-red-500/20',
            unidade: '/10'
        }
    }[tipo]

    const handleSalvar = async () => {
        if (!valor) return
        setSaving(true)

        let extraData = {}
        if (tipo === 'dor') {
            extraData = { local: extra || 'Não especificado' }
        }

        await onSave(valor, extraData)

        setSaving(false)
        setSaved(true)
        setTimeout(() => onClose(), 1500)
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-sm bg-[#111827] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
                {/* Header */}
                <div className="px-6 pt-6 pb-2 flex justify-between items-start">
                    <div className="flex gap-4">
                        <div className={`w-12 h-12 ${config.bgIcone} rounded-2xl flex items-center justify-center`}>
                            {config.icone}
                        </div>
                        <div className="pt-1">
                            <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                                {config.titulo}
                            </h3>
                            <p className="text-xs text-gray-400">
                                {config.subtitulo}
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

                {/* Body */}
                <div className="p-6 pt-4 space-y-6">
                    {tipo === 'dor' && (
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                                Onde você sente dor?
                            </label>
                            <input
                                type="text"
                                value={extra}
                                onChange={e => setExtra(e.target.value)}
                                placeholder="Ex: Ombro Direito, Lombar..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 transition-all"
                            />
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                            {config.label}
                        </label>
                        <div className="relative">
                            <input
                                ref={inputRef}
                                type={tipo === 'dor' || tipo === 'agua' || tipo === 'sono' || tipo === 'peso' ? "number" : "text"}
                                value={valor}
                                onChange={e => setValor(e.target.value)}
                                placeholder={config.placeholder}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-6 text-3xl font-black text-white placeholder-gray-800 focus:outline-none focus:border-indigo-500/50 transition-all text-center"
                                onKeyDown={e => e.key === 'Enter' && handleSalvar()}
                            />
                            {config.unidade && !saved && (
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-600 uppercase">
                                    {config.unidade}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Success Message */}
                    {saved && (
                        <div className="flex items-center justify-center gap-2 text-emerald-400 animate-in zoom-in-95 duration-300">
                            <Check size={20} />
                            <span className="text-sm font-bold uppercase tracking-wider">Registrado com sucesso!</span>
                        </div>
                    )}

                    {/* Action Button */}
                    {!saved && (
                        <button
                            onClick={handleSalvar}
                            disabled={!valor || saving}
                            className={`
                                w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all
                                flex items-center justify-center gap-3
                                ${valor && !saving
                                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20'
                                    : 'bg-white/5 text-gray-600 cursor-not-allowed'}
                            `}
                        >
                            {saving ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>SALVAR REGISTRO</>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
