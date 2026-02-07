import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface DashboardErrorProps {
    onRetry?: () => void;
}

export const DashboardError: React.FC<DashboardErrorProps> = ({ onRetry }) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center h-[500px]">
            <div className="bg-red-500/10 p-6 rounded-full mb-6 border border-red-500/20">
                <AlertTriangle size={48} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Ops! Algo deu errado</h2>
            <p className="text-gray-400 mb-8 max-w-md">Não conseguimos carregar os dados do seu dashboard. Por favor, verifique sua conexão e tente novamente.</p>

            <button
                onClick={onRetry || (() => window.location.reload())}
                className="flex items-center gap-2 bg-[#0A0F1C] hover:bg-[#131B2C] text-white px-6 py-3 rounded-lg border border-white/10 transition-colors font-bold"
            >
                <RefreshCw size={18} />
                Tentar novamente
            </button>
        </div>
    );
};
