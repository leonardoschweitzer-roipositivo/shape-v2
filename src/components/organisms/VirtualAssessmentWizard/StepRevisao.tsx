/**
 * StepRevisao - Step 3 do Wizard
 * 
 * Preview das 4 fotos antes do envio com opção de refazer.
 */

import React, { memo } from 'react';
import { Eye, RefreshCcw } from 'lucide-react';
import type { PhotoSlotId } from './StepUploadFotos';

interface StepRevisaoProps {
    photos: Record<PhotoSlotId, string | null>;
    peso: number;
    referenceLabel: string;
    onRefazer: (slotId: PhotoSlotId) => void;
    onSubmit: () => void;
    onBack: () => void;
    isSubmitting: boolean;
}

const LABELS: Record<PhotoSlotId, string> = {
    frontal: 'Frontal',
    costas: 'Costas',
    lateralEsq: 'Lateral Esquerda',
    lateralDir: 'Lateral Direita',
};

export const StepRevisao = memo(function StepRevisao({
    photos,
    peso,
    referenceLabel,
    onRefazer,
    onSubmit,
    onBack,
    isSubmitting,
}: StepRevisaoProps) {
    return (
        <div className="px-4 py-6 space-y-5 overflow-hidden">
            {/* Header — left-aligned */}
            <div>
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Eye size={20} className="text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-white uppercase tracking-wider">Revisão</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Confira as fotos e dados antes de enviar
                        </p>
                    </div>
                </div>
                <div className="mt-4 h-px bg-white/5" />
            </div>

            {/* Dados resumidos */}
            <div className="bg-white/3 rounded-xl p-3 flex justify-between">
                <div>
                    <p className="text-[10px] text-gray-500 uppercase">Peso</p>
                    <p className="text-sm font-bold text-white">{peso} kg</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-gray-500 uppercase">Referência</p>
                    <p className="text-sm font-bold text-white">{referenceLabel}</p>
                </div>
            </div>

            {/* Grid 4 fotos */}
            <div className="grid grid-cols-2 gap-2">
                {(Object.keys(LABELS) as PhotoSlotId[]).map((slotId) => (
                    <div key={slotId} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/10">
                        {photos[slotId] && (
                            <img
                                src={photos[slotId]!}
                                alt={LABELS[slotId]}
                                className="w-full h-full object-cover"
                            />
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 flex items-end justify-between">
                            <p className="text-[10px] font-bold text-white uppercase">
                                {LABELS[slotId]}
                            </p>
                            <button
                                onClick={() => onRefazer(slotId)}
                                className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-amber-500/50 transition-colors"
                                title="Refazer foto"
                            >
                                <RefreshCcw size={10} className="text-white" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                <p className="text-[10px] text-amber-300 leading-relaxed">
                    ⚠️ As medidas geradas são <strong>estimativas</strong> baseadas em análise de imagem por IA.
                    Para medidas precisas, consulte seu Personal Trainer.
                </p>
            </div>

            {/* Botões */}
            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-xl bg-white/5 text-gray-400 text-sm font-bold border border-white/5 hover:border-white/10 transition-all disabled:opacity-50"
                >
                    ← Voltar
                </button>
                <button
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className={`flex-1 py-3.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${isSubmitting
                        ? 'bg-indigo-600/50 text-indigo-300 cursor-wait'
                        : 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[0.98]'
                        }`}
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Analisando...
                        </span>
                    ) : (
                        '🔬 Analisar com IA'
                    )}
                </button>
            </div>
        </div>
    );
});
