/**
 * AIUsageChart — Gráfico de Uso da IA
 *
 * Exibe linhas de uso de consultorias nos últimos 30 dias,
 * separadas por tipo (Diagnóstico, Treino, Dieta, Chat).
 * Canvas nativo.
 */

import React, { useRef, useEffect } from 'react';
import type { UsoIADiario } from '@/services/godDashboard.service';

interface AIUsageChartProps {
    data: UsoIADiario[];
    isLoading?: boolean;
}

const SERIES = [
    { key: 'diagnostico' as const, label: 'Diagnóstico', color: '#f59e0b' },
    { key: 'treino' as const, label: 'Treino', color: '#818cf8' },
    { key: 'dieta' as const, label: 'Dieta', color: '#34d399' },
    { key: 'chat' as const, label: 'Chat', color: '#f472b6' },
];

export const AIUsageChart: React.FC<AIUsageChartProps> = ({ data, isLoading = false }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (isLoading || data.length === 0) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const W = rect.width;
        const H = rect.height;
        const padding = { top: 10, right: 10, bottom: 30, left: 30 };
        const chartW = W - padding.left - padding.right;
        const chartH = H - padding.top - padding.bottom;

        ctx.clearRect(0, 0, W, H);

        // Max value
        const allVals = data.flatMap(d => SERIES.map(s => d[s.key]));
        const maxVal = Math.max(...allVals, 1);

        // Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 3; i++) {
            const y = padding.top + (chartH / 3) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(W - padding.right, y);
            ctx.stroke();
        }

        // X labels (show every 5 days)
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.font = '9px system-ui';
        ctx.textAlign = 'center';
        data.forEach((d, i) => {
            if (i % 5 === 0 || i === data.length - 1) {
                const x = padding.left + (chartW / (data.length - 1)) * i;
                const dateLabel = d.data.slice(5).replace('-', '/');
                ctx.fillText(dateLabel, x, H - 8);
            }
        });

        // Draw each series
        SERIES.forEach(series => {
            ctx.strokeStyle = series.color;
            ctx.lineWidth = 2;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.globalAlpha = 0.8;
            ctx.beginPath();

            data.forEach((d, i) => {
                const x = padding.left + (chartW / (data.length - 1)) * i;
                const y = padding.top + chartH - (d[series.key] / maxVal) * chartH;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
            ctx.globalAlpha = 1;
        });
    }, [data, isLoading]);

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 animate-pulse">
                <div className="h-4 w-32 bg-white/5 rounded mb-4" />
                <div className="h-48 bg-white/5 rounded" />
            </div>
        );
    }

    const isEmpty = data.every(d => d.diagnostico === 0 && d.treino === 0 && d.dieta === 0 && d.chat === 0);
    const totalConsultas = data.reduce((s, d) => s + d.diagnostico + d.treino + d.dieta + d.chat, 0);

    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm font-bold text-white">Uso da IA</h3>
                    <p className="text-[10px] text-gray-500">
                        {totalConsultas} consultas nos últimos 30 dias
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {SERIES.map(s => (
                        <div key={s.key} className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                            <span className="text-[10px] text-gray-500">{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>
            {isEmpty ? (
                <div className="h-48 flex items-center justify-center text-gray-600 text-sm">
                    Nenhuma consultoria registrada
                </div>
            ) : (
                <canvas ref={canvasRef} className="w-full h-48" />
            )}
        </div>
    );
};
