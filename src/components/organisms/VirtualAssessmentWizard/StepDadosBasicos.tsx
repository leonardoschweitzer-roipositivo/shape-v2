/**
 * StepDadosBasicos - Step 1 do Wizard
 * 
 * Coleta altura, peso atual e seleção de objeto de referência.
 * Valores pré-preenchidos se disponíveis na ficha.
 */

import React, { memo, useState } from 'react';
import { Scale, CreditCard, FileText, Ruler } from 'lucide-react';
import type { ReferenceObject } from '@/services/virtualAssessment.service';

interface StepDadosBasicosProps {
    altura: number;
    peso: number;
    referenceObject: ReferenceObject;
    onAlturaChange: (altura: number) => void;
    onPesoChange: (peso: number) => void;
    onReferenceChange: (ref: ReferenceObject) => void;
    onNext: () => void;
}

const REFERENCE_OPTIONS: Array<{
    id: ReferenceObject;
    label: string;
    desc: string;
    icon: typeof CreditCard;
}> = [
        {
            id: 'credit_card',
            label: 'Cartão de Crédito',
            desc: '85.6mm × 53.98mm',
            icon: CreditCard,
        },
        {
            id: 'a4_paper',
            label: 'Folha A4',
            desc: '210mm × 297mm',
            icon: FileText,
        },
        {
            id: 'tape_measure',
            label: 'Fita Métrica',
            desc: 'Fixada na parede ou chão',
            icon: Ruler,
        },
    ];

export const StepDadosBasicos = memo(function StepDadosBasicos({
    altura,
    peso,
    referenceObject,
    onAlturaChange,
    onPesoChange,
    onReferenceChange,
    onNext,
}: StepDadosBasicosProps) {
    const [alturaInput, setAlturaInput] = useState(altura > 0 ? String(altura) : '');
    const [pesoInput, setPesoInput] = useState(peso > 0 ? String(peso) : '');

    const handleAlturaChange = (value: string) => {
        setAlturaInput(value);
        const num = parseFloat(value);
        if (!isNaN(num) && num > 0) {
            onAlturaChange(num);
        }
    };

    const handlePesoChange = (value: string) => {
        setPesoInput(value);
        const num = parseFloat(value);
        if (!isNaN(num) && num > 0) {
            onPesoChange(num);
        }
    };

    const alturaNum = parseFloat(alturaInput);
    const pesoNum = parseFloat(pesoInput);
    const isAlturaValid = alturaNum >= 100 && alturaNum <= 250;
    const isPesoValid = pesoNum >= 30 && pesoNum <= 300;
    const isValid = isAlturaValid && isPesoValid;

    return (
        <div className="px-4 py-6 space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-3">
                    <Scale size={24} className="text-indigo-400" />
                </div>
                <h3 className="text-lg font-black text-white uppercase">Dados Básicos</h3>
                <p className="text-xs text-gray-500 mt-1">
                    Informe sua altura, peso atual e escolha o objeto de referência
                </p>
            </div>

            {/* Altura */}
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                    Altura (cm)
                </label>
                <div className="relative">
                    <input
                        type="number"
                        inputMode="decimal"
                        step="0.1"
                        min="100"
                        max="250"
                        value={alturaInput}
                        onChange={(e) => handleAlturaChange(e.target.value)}
                        placeholder="Ex: 175"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-lg font-bold placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                        cm
                    </span>
                </div>
                {alturaInput && !isAlturaValid && (
                    <p className="text-xs text-red-400 mt-1">Altura deve ser entre 100 e 250 cm</p>
                )}
            </div>

            {/* Peso */}
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                    Peso Atual (kg)
                </label>
                <div className="relative">
                    <input
                        type="number"
                        inputMode="decimal"
                        step="0.1"
                        min="30"
                        max="300"
                        value={pesoInput}
                        onChange={(e) => handlePesoChange(e.target.value)}
                        placeholder="Ex: 82.5"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-lg font-bold placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                        kg
                    </span>
                </div>
                {pesoInput && !isPesoValid && (
                    <p className="text-xs text-red-400 mt-1">Peso deve ser entre 30 e 300 kg</p>
                )}
            </div>

            {/* Objeto de Referência */}
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                    Objeto de Referência
                </label>
                <p className="text-[10px] text-gray-600 mb-3">
                    Coloque este objeto no chão, visível nas fotos, para calibrar a escala
                </p>
                <div className="space-y-2">
                    {REFERENCE_OPTIONS.map((option) => {
                        const Icon = option.icon;
                        const isSelected = referenceObject === option.id;
                        return (
                            <button
                                key={option.id}
                                onClick={() => onReferenceChange(option.id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${isSelected
                                    ? 'bg-indigo-500/10 border-indigo-500/30 ring-1 ring-indigo-500/20'
                                    : 'bg-white/3 border-white/5 hover:border-white/10'
                                    }`}
                            >
                                <div
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-indigo-500/20' : 'bg-white/5'
                                        }`}
                                >
                                    <Icon
                                        size={18}
                                        className={isSelected ? 'text-indigo-400' : 'text-gray-500'}
                                    />
                                </div>
                                <div className="text-left flex-1">
                                    <p className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                        {option.label}
                                    </p>
                                    <p className="text-[10px] text-gray-600">{option.desc}</p>
                                </div>
                                <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-white/20'
                                        }`}
                                >
                                    {isSelected && (
                                        <div className="w-2 h-2 rounded-full bg-white" />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Botão Próximo */}
            <button
                onClick={onNext}
                disabled={!isValid}
                className={`w-full py-3.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${isValid
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[0.98]'
                    : 'bg-white/5 text-gray-600 cursor-not-allowed'
                    }`}
            >
                Próximo →
            </button>
        </div>
    );
});
