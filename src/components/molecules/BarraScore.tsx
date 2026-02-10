import React from 'react';

export interface BarraScoreProps {
    score: number; // 0-100
    classificacao: string;
    mostrarEscala?: boolean;
}

const getClassificacaoConfig = (classificacao: string) => {
    const configs: Record<string, { label: string; emoji: string; color: string }> = {
        'ELITE': { label: 'ELITE', emoji: '👑', color: '#9333EA' },
        'META': { label: 'META', emoji: '🎯', color: '#10B981' },
        'QUASE_LA': { label: 'QUASE LÁ', emoji: '💪', color: '#3B82F6' },
        'CAMINHO': { label: 'CAMINHO', emoji: '🛤️', color: '#F59E0B' },
        'INICIO': { label: 'INÍCIO', emoji: '🚀', color: '#EF4444' }
    };
    return configs[classificacao] || configs['CAMINHO'];
};

export const BarraScore: React.FC<BarraScoreProps> = ({
    score,
    classificacao,
    mostrarEscala = false
}) => {
    const config = getClassificacaoConfig(classificacao);
    const percentage = Math.min(Math.max(score, 0), 100);

    return (
        <div className="space-y-3">
            {/* Barra de progresso */}
            <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(0,0,0,0.3)]"
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: config.color
                    }}
                />
            </div>

            {/* Labels de escala */}
            {mostrarEscala && (
                <div className="flex justify-between text-[8px] font-bold text-gray-500 uppercase tracking-widest">
                    <span>Início</span>
                    <span>Caminho</span>
                    <span>Quase Lá</span>
                    <span>Meta</span>
                    <span>Elite</span>
                </div>
            )}

            {/* Classificação atual */}
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: config.color }}>
                    {config.emoji} {config.label}
                </span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">({score} pts)</span>
            </div>
        </div>
    );
};
