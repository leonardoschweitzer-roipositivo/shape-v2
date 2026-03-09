/**
 * StepResultado - Step 4 do Wizard
 * 
 * Exibe medidas estimadas com badges de confiança.
 * Permite navegar para a avaliação completa.
 */

import React, { memo } from 'react';
import { Sparkles, ArrowRight, AlertTriangle } from 'lucide-react';
import { ConfidenceBadge } from './ConfidenceBadge';
import type { VirtualAssessmentResult, ConfidenceLevel } from '@/services/virtualAssessment.service';

interface StepResultadoProps {
    result: VirtualAssessmentResult;
    onViewAssessment: () => void;
    onClose: () => void;
}

interface MedidaDisplay {
    key: string;
    label: string;
    grupo: string;
}

const MEDIDAS_DISPLAY: MedidaDisplay[] = [
    // Tronco
    { key: 'ombros', label: 'Ombros', grupo: 'Tronco' },
    { key: 'peitoral', label: 'Peitoral', grupo: 'Tronco' },
    { key: 'cintura', label: 'Cintura', grupo: 'Tronco' },
    { key: 'quadril', label: 'Quadril', grupo: 'Tronco' },
    { key: 'abdomen', label: 'Abdômen', grupo: 'Tronco' },
    { key: 'pescoco', label: 'Pescoço', grupo: 'Tronco' },
    // Braços
    { key: 'braco_esquerdo', label: 'Braço E', grupo: 'Braços' },
    { key: 'braco_direito', label: 'Braço D', grupo: 'Braços' },
    { key: 'antebraco_esquerdo', label: 'Antebraço E', grupo: 'Braços' },
    { key: 'antebraco_direito', label: 'Antebraço D', grupo: 'Braços' },
    // Pernas
    { key: 'coxa_esquerda', label: 'Coxa E', grupo: 'Pernas' },
    { key: 'coxa_direita', label: 'Coxa D', grupo: 'Pernas' },
    { key: 'panturrilha_esquerda', label: 'Panturrilha E', grupo: 'Pernas' },
    { key: 'panturrilha_direita', label: 'Panturrilha D', grupo: 'Pernas' },
];

export const StepResultado = memo(function StepResultado({
    result,
    onViewAssessment,
    onClose,
}: StepResultadoProps) {
    if (!result.success || !result.measurements) {
        return (
            <div className="px-4 py-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto">
                    <AlertTriangle size={24} className="text-red-400" />
                </div>
                <h3 className="text-lg font-black text-white">Erro na Análise</h3>
                <p className="text-sm text-gray-400">{result.error || 'Erro desconhecido'}</p>
                <button
                    onClick={onClose}
                    className="w-full py-3 rounded-xl bg-white/5 text-gray-300 text-sm font-bold border border-white/5"
                >
                    Fechar
                </button>
            </div>
        );
    }

    const measurements = result.measurements;
    const confidence = result.confidence;
    const grupos = [...new Set(MEDIDAS_DISPLAY.map((m) => m.grupo))];

    return (
        <div className="px-4 py-6 space-y-5">
            {/* Header de sucesso */}
            <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                    <Sparkles size={24} className="text-emerald-400" />
                </div>
                <h3 className="text-lg font-black text-white uppercase">Análise Completa!</h3>
                <p className="text-xs text-gray-500 mt-1">
                    Estimativas geradas em {((result.processingTimeMs ?? 0) / 1000).toFixed(1)}s
                </p>
            </div>

            {/* Confiança geral */}
            <div className="flex justify-center">
                <div className="bg-white/3 rounded-xl px-4 py-2 flex items-center gap-2">
                    <span className="text-xs text-gray-400">Confiança geral:</span>
                    <ConfidenceBadge level={confidence?.overall ?? 'medium'} size="md" />
                </div>
            </div>

            {/* BF% */}
            {result.gordura_corporal !== undefined && (
                <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-3 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase">Gordura Corporal Estimada</p>
                        <p className="text-xl font-black text-white">{result.gordura_corporal}%</p>
                    </div>
                    <ConfidenceBadge
                        level={confidence?.perMeasurement?.gordura_corporal as ConfidenceLevel ?? 'medium'}
                        size="md"
                    />
                </div>
            )}

            {/* Medidas agrupadas */}
            {grupos.map((grupo) => (
                <div key={grupo}>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        {grupo}
                    </h4>
                    <div className="bg-white/3 rounded-xl overflow-hidden divide-y divide-white/5">
                        {MEDIDAS_DISPLAY.filter((m) => m.grupo === grupo).map((medida) => {
                            const value = measurements[medida.key];
                            const conf = confidence?.perMeasurement?.[medida.key] as ConfidenceLevel | undefined;
                            if (value === undefined || value === null) return null;
                            return (
                                <div
                                    key={medida.key}
                                    className="flex items-center justify-between px-3 py-2"
                                >
                                    <span className="text-xs text-gray-300">{medida.label}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-white">
                                            {typeof value === 'number' ? value.toFixed(1) : value} cm
                                        </span>
                                        {conf && <ConfidenceBadge level={conf} />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Notas da análise */}
            {result.analysisNotes && result.analysisNotes.length > 0 && (
                <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Observações da IA
                    </h4>
                    <div className="bg-white/3 rounded-xl p-3 space-y-1">
                        {result.analysisNotes.map((note, i) => (
                            <p key={i} className="text-[11px] text-gray-400">
                                • {note}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            {/* Botão principal */}
            <button
                onClick={onViewAssessment}
                className="w-full py-3.5 rounded-xl bg-indigo-600 text-white text-sm font-black uppercase tracking-wider hover:bg-indigo-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
                Ver Avaliação Completa
                <ArrowRight size={16} />
            </button>

            {/* Disclaimer */}
            <p className="text-[9px] text-gray-600 text-center leading-relaxed">
                * Medidas estimadas por IA. Margem de erro: ±2-5cm dependendo da qualidade das fotos.
                Para medições precisas, consulte seu Personal Trainer.
            </p>
        </div>
    );
});
