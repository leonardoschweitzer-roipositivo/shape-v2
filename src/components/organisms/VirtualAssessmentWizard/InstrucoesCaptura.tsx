/**
 * InstrucoesCaptura - Guia visual para o atleta
 * 
 * Mostra instruções de vestuário, pose e posicionamento
 * para cada uma das 4 fotos necessárias.
 */

import React, { memo } from 'react';
import {
    Camera,
    CheckCircle,
    XCircle,
    User,
    ArrowLeft,
    ArrowRight,
    RotateCcw,
} from 'lucide-react';

interface InstrucoesCapturaProps {
    sexo: 'M' | 'F';
}

const POSES = [
    {
        id: 'frontal',
        label: 'Frontal',
        icon: User,
        desc: 'De frente, braços levemente afastados',
    },
    {
        id: 'costas',
        label: 'Costas',
        icon: RotateCcw,
        desc: 'De costas, mesma posição',
    },
    {
        id: 'lateralEsq',
        label: 'Lateral Esquerda',
        icon: ArrowLeft,
        desc: 'Lado esquerdo virado para a câmera',
    },
    {
        id: 'lateralDir',
        label: 'Lateral Direita',
        icon: ArrowRight,
        desc: 'Lado direito virado para a câmera',
    },
] as const;

export const InstrucoesCaptura = memo(function InstrucoesCaptura({
    sexo,
}: InstrucoesCapturaProps) {
    const vestuario = sexo === 'M' ? 'sunga' : 'biquíni';

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2 text-indigo-400">
                <Camera size={18} />
                <h4 className="text-sm font-bold uppercase tracking-wider">
                    Instruções de Captura
                </h4>
            </div>

            {/* Vestuário */}
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3">
                <p className="text-xs text-indigo-300 font-medium">
                    👕 Vestuário recomendado: <span className="text-white font-bold">{vestuario}</span>
                </p>
            </div>

            {/* 4 Poses */}
            <div className="grid grid-cols-2 gap-2">
                {POSES.map((pose) => {
                    const Icon = pose.icon;
                    return (
                        <div
                            key={pose.id}
                            className="bg-surface-dark/50 border border-white/5 rounded-xl p-3 text-center"
                        >
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-2">
                                <Icon size={18} className="text-gray-400" />
                            </div>
                            <p className="text-xs font-bold text-white">{pose.label}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">{pose.desc}</p>
                        </div>
                    );
                })}
            </div>

            {/* Checklist */}
            <div className="space-y-1.5">
                <CheckItem label="Corpo inteiro visível (pés à cabeça)" ok />
                <CheckItem label="Braços levemente afastados (~15°)" ok />
                <CheckItem label="Pés na largura dos ombros" ok />
                <CheckItem label="Ambiente bem iluminado, fundo neutro" ok />
                <CheckItem label="Objeto de referência no chão" ok />
                <CheckItem label="Roupas largas" ok={false} />
                <CheckItem label="Músculos flexionados" ok={false} />
            </div>
        </div>
    );
});

// ===== SUB-COMPONENT =====

function CheckItem({ label, ok }: { label: string; ok: boolean }) {
    return (
        <div className="flex items-center gap-2 text-xs">
            {ok ? (
                <CheckCircle size={14} className="text-emerald-400 shrink-0" />
            ) : (
                <XCircle size={14} className="text-red-400 shrink-0" />
            )}
            <span className={ok ? 'text-gray-300' : 'text-red-300 line-through'}>
                {label}
            </span>
        </div>
    );
}
