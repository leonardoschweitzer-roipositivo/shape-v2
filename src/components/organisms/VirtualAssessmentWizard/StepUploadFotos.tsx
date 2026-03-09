/**
 * StepUploadFotos - Step 3 do Wizard
 * 
 * 4 slots de upload com preview.
 * Cada slot permite refazer a foto individualmente.
 */

import React, { memo, useCallback, useRef } from 'react';
import { Camera, X, User, RotateCcw, ArrowLeft, ArrowRight } from 'lucide-react';

export type PhotoSlotId = 'frontal' | 'costas' | 'lateralEsq' | 'lateralDir';

interface StepUploadFotosProps {
    photos: Record<PhotoSlotId, string | null>;
    sexo: 'M' | 'F';
    onPhotoSelect: (slotId: PhotoSlotId, base64: string) => void;
    onPhotoRemove: (slotId: PhotoSlotId) => void;
    onNext: () => void;
    onBack: () => void;
}

const SLOTS: Array<{
    id: PhotoSlotId;
    label: string;
    icon: typeof User;
}> = [
        { id: 'frontal', label: 'Frontal', icon: User },
        { id: 'costas', label: 'Costas', icon: RotateCcw },
        { id: 'lateralEsq', label: 'Lateral E', icon: ArrowLeft },
        { id: 'lateralDir', label: 'Lateral D', icon: ArrowRight },
    ];

export const StepUploadFotos = memo(function StepUploadFotos({
    photos,
    sexo,
    onPhotoSelect,
    onPhotoRemove,
    onNext,
    onBack,
}: StepUploadFotosProps) {
    const allPhotosReady = SLOTS.every((s) => photos[s.id] !== null);

    return (
        <div className="px-4 py-6 space-y-5 overflow-hidden">
            {/* Header — left-aligned */}
            <div>
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Camera size={20} className="text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-white uppercase tracking-wider">Suas Fotos</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Envie 4 fotos seguindo as instruções
                        </p>
                    </div>
                </div>
                <div className="mt-4 h-px bg-white/5" />
            </div>

            {/* Grid de 4 slots */}
            <div className="grid grid-cols-2 gap-3">
                {SLOTS.map((slot) => (
                    <PhotoSlot
                        key={slot.id}
                        slotId={slot.id}
                        label={slot.label}
                        Icon={slot.icon}
                        photo={photos[slot.id]}
                        onSelect={onPhotoSelect}
                        onRemove={onPhotoRemove}
                    />
                ))}
            </div>

            {/* Contador */}
            <div className="text-center">
                <p className="text-xs text-gray-500">
                    {SLOTS.filter((s) => photos[s.id]).length} de 4 fotos
                </p>
            </div>

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
                    disabled={!allPhotosReady}
                    className={`flex-1 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${allPhotosReady
                        ? 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[0.98]'
                        : 'bg-white/5 text-gray-600 cursor-not-allowed'
                        }`}
                >
                    Revisar →
                </button>
            </div>
        </div>
    );
});

// ===== SUB-COMPONENT =====

interface PhotoSlotProps {
    slotId: PhotoSlotId;
    label: string;
    Icon: typeof User;
    photo: string | null;
    onSelect: (slotId: PhotoSlotId, base64: string) => void;
    onRemove: (slotId: PhotoSlotId) => void;
}

function PhotoSlot({ slotId, label, Icon, photo, onSelect, onRemove }: PhotoSlotProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    onSelect(slotId, reader.result);
                }
            };
            reader.readAsDataURL(file);

            // Reset input para permitir re-seleção do mesmo arquivo
            e.target.value = '';
        },
        [slotId, onSelect]
    );

    if (photo) {
        return (
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-emerald-500/30">
                <img
                    src={photo}
                    alt={label}
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <p className="text-[10px] font-bold text-emerald-400 uppercase">
                        ✓ {label}
                    </p>
                </div>
                <button
                    onClick={() => onRemove(slotId)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-red-500/80 transition-colors"
                >
                    <X size={12} />
                </button>
            </div>
        );
    }

    return (
        <>
            <button
                onClick={() => inputRef.current?.click()}
                className="aspect-[3/4] rounded-xl border-2 border-dashed border-white/10 hover:border-indigo-500/30 bg-white/2 flex flex-col items-center justify-center gap-2 transition-all hover:bg-indigo-500/5 active:scale-[0.97]"
            >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <Icon size={18} className="text-gray-500" />
                </div>
                <p className="text-xs font-bold text-gray-400">{label}</p>
                <p className="text-[10px] text-gray-600">Toque para enviar</p>
            </button>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
        </>
    );
}
