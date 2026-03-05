import React from 'react';

export interface CardMedidaBilateralProps {
    label: string;
    valorDireito: number;
    valorEsquerdo: number;
    unidade: string;
}

export const CardMedidaBilateral: React.FC<CardMedidaBilateralProps> = ({
    label,
    valorDireito,
    valorEsquerdo,
    unidade
}) => {
    const diferenca = Math.abs(valorDireito - valorEsquerdo);
    const diferencaPercentual = ((diferenca / Math.max(valorDireito, valorEsquerdo)) * 100).toFixed(1);
    const isAssimetrico = diferenca > 0.5;

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-primary/20 transition-all group">
            <h4 className="text-sm font-semibold text-gray-400 mb-3">{label}</h4>

            <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">Esquerdo</div>
                    <div className="text-lg font-bold text-white">
                        {valorEsquerdo} {unidade}
                    </div>
                </div>

                <div className="flex items-center justify-center">
                    {isAssimetrico ? (
                        <span className="text-orange-500 text-xs">⚠️ {diferencaPercentual}%</span>
                    ) : (
                        <span className="text-green-500 text-xs">✓</span>
                    )}
                </div>

                <div className="flex-1 text-right">
                    <div className="text-xs text-gray-500 mb-1">Direito</div>
                    <div className="text-lg font-bold text-white">
                        {valorDireito} {unidade}
                    </div>
                </div>
            </div>

            {isAssimetrico && (
                <div className="mt-2 text-xs text-orange-400">
                    Diferença: {diferenca.toFixed(1)} {unidade}
                </div>
            )}
        </div>
    );
};
