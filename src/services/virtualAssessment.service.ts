/**
 * Virtual Assessment Service
 * 
 * Gerencia o envio de fotos para análise corporal por IA.
 * Comprime imagens client-side antes do envio.
 * 
 * Fluxo: Component → Service → Edge Function → medidas table
 */

import { supabase } from '@/services/supabase';
import type { MedidaIAMetadata } from '@/lib/database.types';

// ===== TYPES =====

export type ReferenceObject = 'credit_card' | 'a4_paper' | 'tape_measure';
export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface VirtualAssessmentInput {
    frontalImage: string;     // base64
    costasImage: string;      // base64
    lateralEsqImage: string;  // base64
    lateralDirImage: string;  // base64
    referenceObject: ReferenceObject;
    weightKg: number;
    heightCm: number;
    sexo: 'M' | 'F';
    atletaId: string;
}

export interface VirtualAssessmentResult {
    success: boolean;
    medidaId?: string;
    measurements?: Record<string, number>;
    gordura_corporal?: number;
    confidence?: {
        overall: ConfidenceLevel;
        perMeasurement: Record<string, ConfidenceLevel>;
    };
    analysisNotes?: string[];
    processingTimeMs?: number;
    error?: string;
}

// ===== CONSTANTS =====

const MAX_IMAGE_WIDTH = 1200;
const IMAGE_QUALITY = 0.8;

// ===== SERVICE =====

export const virtualAssessmentService = {
    /**
     * Envia 4 fotos para análise corporal por IA.
     * Comprime imagens antes do envio para reduzir payload.
     * 
     * @param input - Dados de entrada (fotos + dados básicos)
     * @returns Resultado da análise com medidas estimadas
     */
    async submit(input: VirtualAssessmentInput): Promise<VirtualAssessmentResult> {
        try {
            // 1. Comprimir todas as imagens em paralelo
            const [frontal, costas, lateralEsq, lateralDir] = await Promise.all([
                compressImage(input.frontalImage),
                compressImage(input.costasImage),
                compressImage(input.lateralEsqImage),
                compressImage(input.lateralDirImage),
            ]);

            // 2. Chamar Edge Function
            const { data, error } = await supabase.functions.invoke('analyze-body', {
                body: {
                    frontalImageBase64: frontal,
                    costasImageBase64: costas,
                    lateralEsqImageBase64: lateralEsq,
                    lateralDirImageBase64: lateralDir,
                    referenceObject: input.referenceObject,
                    heightCm: input.heightCm,
                    weightKg: input.weightKg,
                    sexo: input.sexo,
                    atletaId: input.atletaId,
                },
            });

            if (error) {
                console.error('[VirtualAssessment] Edge function error:', error);
                return {
                    success: false,
                    error: error.message || 'Erro ao processar avaliação',
                };
            }

            if (!data?.success) {
                return {
                    success: false,
                    error: data?.error || 'Erro desconhecido na análise',
                };
            }

            return {
                success: true,
                medidaId: data.medidaId,
                measurements: data.measurements,
                gordura_corporal: data.gordura_corporal,
                confidence: data.confidence,
                analysisNotes: data.analysisNotes,
                processingTimeMs: data.processingTimeMs,
            };
        } catch (err) {
            console.error('[VirtualAssessment] Submit error:', err);
            return {
                success: false,
                error: err instanceof Error ? err.message : 'Erro inesperado',
            };
        }
    },

    /**
     * Busca metadados IA de uma medida específica.
     */
    async getMetadata(medidaId: string): Promise<MedidaIAMetadata | null> {
        const { data, error } = await supabase
            .from('medidas_ia_metadata')
            .select('*')
            .eq('medida_id', medidaId)
            .single();

        if (error) {
            console.error('[VirtualAssessment] Get metadata error:', error.message);
            return null;
        }

        return data;
    },

    /**
     * Verifica se uma medida foi gerada por IA.
     */
    async isIAGenerated(medidaId: string): Promise<boolean> {
        const { count, error } = await supabase
            .from('medidas_ia_metadata')
            .select('id', { count: 'exact', head: true })
            .eq('medida_id', medidaId);

        if (error) return false;
        return (count ?? 0) > 0;
    },
};

// ===== UTILS =====

/**
 * Comprime uma imagem base64 usando Canvas API.
 * Reduz para max 1200px de largura mantendo aspect ratio.
 * 
 * @param base64 - Imagem em base64
 * @returns Imagem comprimida em base64
 */
async function compressImage(base64: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Redimensionar se necessário
                if (width > MAX_IMAGE_WIDTH) {
                    const ratio = MAX_IMAGE_WIDTH / width;
                    width = MAX_IMAGE_WIDTH;
                    height = Math.round(height * ratio);
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Canvas context não disponível'));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);
                const compressed = canvas.toDataURL('image/jpeg', IMAGE_QUALITY);
                resolve(compressed);
            } catch (err) {
                reject(err);
            }
        };
        img.onerror = () => reject(new Error('Erro ao carregar imagem'));
        img.src = base64;
    });
}
