/**
 * SelfMeasurements — Formulário para o atleta registrar suas próprias medidas
 * 
 * Acessível via Portal do Atleta (link de convite)
 * Salva direto no Supabase com registrado_por = 'APP'
 */

import React, { useState } from 'react';
import {
    Ruler, Scale, CheckCircle, ArrowLeft, Sparkles,
    Activity, Heart
} from 'lucide-react';

interface SelfMeasurementsProps {
    atletaId: string;
    atletaNome: string;
    sexo: string;
    onSave: (measurements: Record<string, number>) => Promise<boolean>;
    onBack: () => void;
}

interface MeasurementField {
    key: string;
    label: string;
    unit: string;
    placeholder: string;
    section: string;
}

const FIELDS: MeasurementField[] = [
    // Básicas
    { key: 'peso', label: 'Peso', unit: 'kg', placeholder: '0.0', section: 'basicas' },

    // Tronco
    { key: 'pescoco', label: 'Pescoço', unit: 'cm', placeholder: '0.0', section: 'tronco' },
    { key: 'ombros', label: 'Ombros', unit: 'cm', placeholder: '0.0', section: 'tronco' },
    { key: 'peitoral', label: 'Peitoral', unit: 'cm', placeholder: '0.0', section: 'tronco' },

    // Core
    { key: 'cintura', label: 'Cintura', unit: 'cm', placeholder: '0.0', section: 'core' },
    { key: 'quadril', label: 'Quadril', unit: 'cm', placeholder: '0.0', section: 'core' },
    { key: 'abdomen', label: 'Abdômen', unit: 'cm', placeholder: '0.0', section: 'core' },

    // Membros (bilaterais)
    { key: 'braco_direito', label: 'Braço Direito', unit: 'cm', placeholder: '0.0', section: 'membros' },
    { key: 'braco_esquerdo', label: 'Braço Esquerdo', unit: 'cm', placeholder: '0.0', section: 'membros' },
    { key: 'antebraco_direito', label: 'Antebraço Direito', unit: 'cm', placeholder: '0.0', section: 'membros' },
    { key: 'antebraco_esquerdo', label: 'Antebraço Esquerdo', unit: 'cm', placeholder: '0.0', section: 'membros' },
    { key: 'coxa_direita', label: 'Coxa Direita', unit: 'cm', placeholder: '0.0', section: 'membros' },
    { key: 'coxa_esquerda', label: 'Coxa Esquerda', unit: 'cm', placeholder: '0.0', section: 'membros' },
    { key: 'panturrilha_direita', label: 'Panturrilha Direita', unit: 'cm', placeholder: '0.0', section: 'membros' },
    { key: 'panturrilha_esquerda', label: 'Panturrilha Esquerda', unit: 'cm', placeholder: '0.0', section: 'membros' },
];

const SECTIONS = [
    { id: 'basicas', label: 'PESO', icon: Scale, color: 'text-emerald-400' },
    { id: 'tronco', label: 'TRONCO', icon: Activity, color: 'text-blue-400' },
    { id: 'core', label: 'CORE', icon: Heart, color: 'text-orange-400' },
    { id: 'membros', label: 'MEMBROS', icon: Ruler, color: 'text-purple-400' },
];

export function SelfMeasurements({ atletaId, atletaNome, sexo, onSave, onBack }: SelfMeasurementsProps) {
    const [values, setValues] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleChange = (key: string, value: string) => {
        setValues(prev => ({ ...prev, [key]: value }));
    };

    const filledCount = Object.values(values).filter(v => v && parseFloat(v) > 0).length;
    const totalFields = FIELDS.length;
    const progress = Math.round((filledCount / totalFields) * 100);

    const handleSubmit = async () => {
        setSaving(true);
        const numericValues: Record<string, number> = {};
        for (const [key, val] of Object.entries(values)) {
            const num = parseFloat(val);
            if (!isNaN(num) && num > 0) {
                numericValues[key] = num;
            }
        }

        if (Object.keys(numericValues).length < 3) {
            alert('Preencha pelo menos 3 medidas antes de enviar.');
            setSaving(false);
            return;
        }

        const success = await onSave(numericValues);
        setSaving(false);
        if (success) setSaved(true);
    };

    if (saved) {
        return (
            <div className="min-h-screen bg-[#060B18] flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
                    <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                        <CheckCircle className="text-emerald-400" size={48} />
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-3xl font-black text-white tracking-tight">
                            MEDIDAS ENVIADAS!
                        </h1>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Suas medidas foram registradas com sucesso, <span className="text-white font-bold">{atletaNome}</span>.
                            Seu personal será notificado e poderá realizar sua avaliação com a <span className="text-indigo-400 font-bold italic">VITRU IA</span>.
                        </p>
                    </div>
                    <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                        <Sparkles className="text-indigo-400 mx-auto mb-2" size={20} />
                        <p className="text-xs text-gray-500">
                            Você pode acessar este link novamente a qualquer momento para atualizar suas medidas.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#060B18]">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-[#060B18]/95 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-2xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                        >
                            <ArrowLeft size={16} />
                            <span>Voltar</span>
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-mono">{filledCount}/{totalFields}</span>
                            <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="text-xs text-emerald-400 font-bold">{progress}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero */}
            <div className="max-w-2xl mx-auto px-6 py-8">
                <div className="space-y-2 mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                            <Ruler className="text-indigo-400" size={16} />
                        </div>
                        <span className="text-[10px] font-bold tracking-[0.2em] text-indigo-400 uppercase">
                            PORTAL DO ATLETA
                        </span>
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tight">
                        REGISTRAR MEDIDAS
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Olá <span className="text-white font-bold">{atletaNome}</span>! Preencha suas medidas abaixo.
                        Use uma fita métrica para maior precisão.
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-8">
                    {SECTIONS.map(section => {
                        const sectionFields = FIELDS.filter(f => f.section === section.id);
                        const SIcon = section.icon;

                        return (
                            <div key={section.id} className="space-y-4">
                                <div className="flex items-center gap-3 pb-2 border-b border-white/5">
                                    <SIcon className={section.color} size={16} />
                                    <h3 className="text-xs font-bold tracking-[0.15em] text-gray-300 uppercase">
                                        {section.label}
                                    </h3>
                                </div>

                                <div className={section.id === 'membros' ? 'grid grid-cols-2 gap-3' : 'grid grid-cols-1 sm:grid-cols-3 gap-3'}>
                                    {sectionFields.map(field => (
                                        <div key={field.key} className="relative">
                                            <label className="block text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-1.5">
                                                {field.label}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={values[field.key] || ''}
                                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                                    placeholder={field.placeholder}
                                                    className="w-full bg-[#0A0F1C] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-700 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 text-sm font-mono transition-all"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-600 font-bold">
                                                    {field.unit}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Submit */}
                <div className="mt-12 pb-12">
                    <button
                        onClick={handleSubmit}
                        disabled={saving || filledCount < 3}
                        className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all ${saving || filledCount < 3
                                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                : 'bg-gradient-to-r from-indigo-500 to-emerald-500 text-white shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] hover:scale-[1.02] active:scale-[0.98]'
                            }`}
                    >
                        {saving ? (
                            <>
                                <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                                <span>Enviando...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle size={18} />
                                <span>Enviar Medidas</span>
                            </>
                        )}
                    </button>
                    {filledCount < 3 && (
                        <p className="text-center text-[10px] text-gray-600 mt-3">
                            Preencha pelo menos 3 campos para enviar
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
