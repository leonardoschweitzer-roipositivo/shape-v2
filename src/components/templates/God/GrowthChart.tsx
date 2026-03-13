/**
 * GrowthChart — Gráfico de Crescimento da Plataforma
 *
 * Exibe linhas de crescimento (atletas, personais, academias) nos últimos 6 meses.
 * Usa canvas nativo para renderização leve sem dependências externas.
 */

import React, { useRef, useEffect } from 'react';
import type { CrescimentoMensal } from '@/services/godDashboard.service';

interface GrowthChartProps {
    data: CrescimentoMensal[];
    isLoading?: boolean;
}

const COLORS = {
    atletas: '#818cf8',    // indigo-400
    personais: '#34d399',  // emerald-400
    academias: '#fbbf24',  // amber-400
};

const LEGEND = [
    { key: 'atletas' as const, label: 'Atletas', color: COLORS.atletas },
    { key: 'personais' as const, label: 'Personais', color: COLORS.personais },
    { key: 'academias' as const, label: 'Academias', color: COLORS.academias },
];

export const GrowthChart: React.FC<GrowthChartProps> = ({ data, isLoading = false }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (isLoading || data.length === 0) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // HiDPI support
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const W = rect.width;
        const H = rect.height;
        const padding = { top: 20, right: 20, bottom: 40, left: 40 };
        const chartW = W - padding.left - padding.right;
        const chartH = H - padding.top - padding.bottom;

        // Clear
        ctx.clearRect(0, 0, W, H);

        // Find max value
        const allValues = data.flatMap(d => [d.atletas, d.personais, d.academias]);
        const maxVal = Math.max(...allValues, 1);

        // Grid lines
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (chartH / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(W - padding.right, y);
            ctx.stroke();
        }

        // X axis labels
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = '11px system-ui';
        ctx.textAlign = 'center';
        data.forEach((d, i) => {
            const x = padding.left + (chartW / (data.length - 1 || 1)) * i;
            ctx.fillText(d.label, x, H - 10);
        });

        // Y axis labels
        ctx.textAlign = 'right';
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (chartH / 4) * (4 - i);
            const val = Math.round((maxVal / 4) * i);
            ctx.fillText(String(val), padding.left - 8, y + 4);
        }

        // Draw lines
        const drawLine = (field: 'atletas' | 'personais' | 'academias', color: string) => {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2.5;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.beginPath();

            data.forEach((d, i) => {
                const x = padding.left + (chartW / (data.length - 1 || 1)) * i;
                const y = padding.top + chartH - (d[field] / maxVal) * chartH;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();

            // Dots
            data.forEach((d, i) => {
                const x = padding.left + (chartW / (data.length - 1 || 1)) * i;
                const y = padding.top + chartH - (d[field] / maxVal) * chartH;
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#0a0a0a';
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fill();
            });
        };

        drawLine('atletas', COLORS.atletas);
        drawLine('personais', COLORS.personais);
        drawLine('academias', COLORS.academias);
    }, [data, isLoading]);

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 animate-pulse">
                <div className="h-4 w-40 bg-white/5 rounded mb-4" />
                <div className="h-48 bg-white/5 rounded" />
            </div>
        );
    }

    const isEmpty = data.every(d => d.atletas === 0 && d.personais === 0 && d.academias === 0);

    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">Crescimento da Plataforma</h3>
                <div className="flex items-center gap-4">
                    {LEGEND.map(l => (
                        <div key={l.key} className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                            <span className="text-[10px] text-gray-500">{l.label}</span>
                        </div>
                    ))}
                </div>
            </div>
            {isEmpty ? (
                <div className="h-48 flex items-center justify-center text-gray-600 text-sm">
                    Sem dados de crescimento ainda
                </div>
            ) : (
                <canvas ref={canvasRef} className="w-full h-48" />
            )}
        </div>
    );
};
