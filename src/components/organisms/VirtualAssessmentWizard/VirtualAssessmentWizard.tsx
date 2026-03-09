/**
 * VirtualAssessmentWizard - Wizard de Avaliação Corporal Virtual
 * 
 * Modal fullscreen com 4 steps:
 * 1. Dados Básicos (peso + referência)
 * 2. Upload de 4 Fotos
 * 3. Revisão
 * 4. Resultado com medidas estimadas
 * 
 * Integra com virtualAssessment.service para envio ao Edge Function.
 */

import React, { memo, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { StepDadosBasicos } from './StepDadosBasicos';
import { StepUploadFotos, type PhotoSlotId } from './StepUploadFotos';
import { StepRevisao } from './StepRevisao';
import { StepResultado } from './StepResultado';
import {
    virtualAssessmentService,
    type ReferenceObject,
    type VirtualAssessmentResult,
} from '@/services/virtualAssessment.service';
import { supabase } from '@/services/supabase';

// ===== TYPES =====

type WizardStep = 'dados' | 'fotos' | 'revisao' | 'resultado';

interface VirtualAssessmentWizardProps {
    atletaId: string;
    sexo: 'M' | 'F';
    altura: number;
    pesoInicial?: number;
    dataNascimentoInicial?: string;
    onComplete: () => void;
    onClose: () => void;
}

const REFERENCE_LABELS: Record<ReferenceObject, string> = {
    credit_card: 'Cartão de Crédito',
    a4_paper: 'Folha A4',
    tape_measure: 'Fita Métrica',
};

const STEPS: WizardStep[] = ['dados', 'fotos', 'revisao', 'resultado'];

// ===== COMPONENT =====

export const VirtualAssessmentWizard = memo(function VirtualAssessmentWizard({
    atletaId,
    sexo,
    altura,
    pesoInicial,
    dataNascimentoInicial,
    onComplete,
    onClose,
}: VirtualAssessmentWizardProps) {
    // State
    const [step, setStep] = useState<WizardStep>('dados');
    const [dataNascimento, setDataNascimento] = useState(dataNascimentoInicial || '');
    const [alturaState, setAlturaState] = useState(altura || 0);
    const [peso, setPeso] = useState(pesoInicial ?? 0);
    const [referenceObject, setReferenceObject] = useState<ReferenceObject>('credit_card');
    const [photos, setPhotos] = useState<Record<PhotoSlotId, string | null>>({
        frontal: null,
        costas: null,
        lateralEsq: null,
        lateralDir: null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<VirtualAssessmentResult | null>(null);

    // Progress
    const currentIndex = STEPS.indexOf(step);
    const progress = ((currentIndex + 1) / STEPS.length) * 100;

    // Handlers
    const handlePhotoSelect = useCallback((slotId: PhotoSlotId, base64: string) => {
        setPhotos((prev) => ({ ...prev, [slotId]: base64 }));
    }, []);

    const handlePhotoRemove = useCallback((slotId: PhotoSlotId) => {
        setPhotos((prev) => ({ ...prev, [slotId]: null }));
    }, []);

    const handleRefazer = useCallback((slotId: PhotoSlotId) => {
        setPhotos((prev) => ({ ...prev, [slotId]: null }));
        setStep('fotos');
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!photos.frontal || !photos.costas || !photos.lateralEsq || !photos.lateralDir) {
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await virtualAssessmentService.submit({
                frontalImage: photos.frontal,
                costasImage: photos.costas,
                lateralEsqImage: photos.lateralEsq,
                lateralDirImage: photos.lateralDir,
                referenceObject,
                weightKg: peso,
                heightCm: alturaState,
                sexo,
                atletaId,
            });

            setResult(res);
            setStep('resultado');

            // Salvar data_nascimento e altura na ficha do atleta
            try {
                const fichaUpdate: Record<string, unknown> = {
                    altura: alturaState,
                };
                if (dataNascimento) {
                    fichaUpdate.data_nascimento = dataNascimento;
                }
                await supabase
                    .from('fichas')
                    .update(fichaUpdate)
                    .eq('atleta_id', atletaId);
                console.info('[VirtualAssessmentWizard] ✅ Ficha atualizada: altura + data_nascimento');
            } catch (fichaErr) {
                console.warn('[VirtualAssessmentWizard] Aviso ao atualizar ficha:', fichaErr);
            }
        } catch (err) {
            console.error('[VirtualAssessmentWizard] Submit error:', err);
            setResult({
                success: false,
                error: err instanceof Error ? err.message : 'Erro inesperado',
            });
            setStep('resultado');
        } finally {
            setIsSubmitting(false);
        }
    }, [photos, referenceObject, peso, alturaState, sexo, atletaId, dataNascimento]);

    const handleViewAssessment = useCallback(() => {
        onComplete();
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-50 bg-background-dark flex flex-col">
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <h2 className="text-sm font-black text-white uppercase tracking-wider">
                    📸 Avaliação Virtual
                </h2>
                {step !== 'resultado' && (
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-white/5">
                <div
                    className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
                {step === 'dados' && (
                    <StepDadosBasicos
                        dataNascimento={dataNascimento}
                        altura={alturaState}
                        peso={peso}
                        referenceObject={referenceObject}
                        onDataNascimentoChange={setDataNascimento}
                        onAlturaChange={setAlturaState}
                        onPesoChange={setPeso}
                        onReferenceChange={setReferenceObject}
                        onNext={() => setStep('fotos')}
                    />
                )}

                {step === 'fotos' && (
                    <StepUploadFotos
                        photos={photos}
                        sexo={sexo}
                        onPhotoSelect={handlePhotoSelect}
                        onPhotoRemove={handlePhotoRemove}
                        onNext={() => setStep('revisao')}
                        onBack={() => setStep('dados')}
                    />
                )}

                {step === 'revisao' && (
                    <StepRevisao
                        photos={photos}
                        peso={peso}
                        referenceLabel={REFERENCE_LABELS[referenceObject]}
                        onRefazer={handleRefazer}
                        onSubmit={handleSubmit}
                        onBack={() => setStep('fotos')}
                        isSubmitting={isSubmitting}
                    />
                )}

                {step === 'resultado' && result && (
                    <StepResultado
                        result={result}
                        onViewAssessment={handleViewAssessment}
                        onClose={onClose}
                    />
                )}
            </div>
        </div>
    );
});
