/**
 * StepInstrucoes - Step 2 do Wizard
 * 
 * Tela dedicada com instruções de captura de fotos.
 * Mostra vestuário recomendado, poses e checklist.
 */

import React, { memo } from 'react';
import { BookOpen } from 'lucide-react';
import { InstrucoesCaptura } from './InstrucoesCaptura';

interface StepInstrucoesProps {
    sexo: 'M' | 'F';
    onNext: () => void;
    onBack: () => void;
}

export const StepInstrucoes = memo(function StepInstrucoes({
    sexo,
    onNext,
    onBack,
}: StepInstrucoesProps) {
    return (
        <div className="px-4 py-6 space-y-5 overflow-hidden">
            {/* Header — left-aligned */}
            <div>
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <BookOpen size={20} className="text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-white uppercase tracking-wider">Instruções</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Siga estas orientações para fotos precisas
                        </p>
                    </div>
                </div>
                <div className="mt-4 h-px bg-white/5" />
            </div>

            {/* Conteúdo das instruções */}
            <InstrucoesCaptura sexo={sexo} />

            {/* Botões */}
            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    className="flex-1 py-3 rounded-xl bg-white/5 text-gray-400 text-sm font-bold border border-white/5 hover:border-white/10 transition-all"
                >
                    ← Voltar
                </button>
                <button
                    onClick={onNext}
                    className="flex-1 py-3.5 rounded-xl text-sm font-black uppercase tracking-wider bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[0.98] transition-all"
                >
                    Entendi, Vamos! →
                </button>
            </div>
        </div>
    );
});
