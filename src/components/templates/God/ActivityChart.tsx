/**
 * ActivityChart — Gráfico de Atividade Diária dos Atletas
 *
 * Barras empilhadas mostrando registros de treino, água, sono e refeição
 * nos últimos 7 dias. Canvas nativo.
 */

import React, { useRef, useEffect } from 'react';
import type { AtividadeDiaria } from '@/services/godDashboard.service';

interface ActivityChartProps {
    data: AtividadeDiaria[];
    isLoading?: boolean;
}

const CATEGORIES = [
    { key: 'treino' as const, label: 'Treino', color: '#818cf8' },
    { key: 'refeicao' as const, label: 'Refeição', color: '#34d399' },
    { key: 'agua' as const, label: 'Água', color: '#38bdf8' },
    { key: 'sono' as const, label: 'Sono', color: '#a78bfa' },
];

export const ActivityChart: React.FC<ActivityChartProps> = ({ data, isLoading = false }) => {
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
        const padding = { top: 10, right: 10, bottom: 30, left: 10 };
        const chartW = W - padding.left - padding.right;
        const chartH = H - padding.top - padding.bottom;

        ctx.clearRect(0, 0, W, H);

        // Calc max stacked value
        const maxVal = Math.max(
            ...data.map(d => d.treino + d.agua + d.sono + d.refeicao),
            1
        );

        const barW = Math.min(chartW / data.length * 0.6, 40);
        const gap = (chartW - barW * data.length) / (data.length + 1);

        const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

        data.forEach((d, i) => {
            const x = padding.left + gap + (barW + gap) * i;
            let yOffset = padding.top + chartH;

            CATEGORIES.forEach(cat => {
                const val = d[cat.key];
                if (val === 0) return;
                const barH = (val / maxVal) * chartH;

                ctx.fillStyle = cat.color;
                ctx.beginPath();
                // Rounded top only for last segment
                const radius = 3;
                ctx.roundRect(x, yOffset - barH, barW, barH, [radius, radius, 0, 0]);
                ctx.fill();

                yOffset -= barH;
            });

            // Day label
            const dateObj = new Date(d.data + 'T12:00:00');
            const dayLabel = DIAS_SEMANA[dateObj.getDay()];
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.font = '10px system-ui';
            ctx.textAlign = 'center';
            ctx.fillText(dayLabel, x + barW / 2, H - 8);
        });
    }, [data, isLoading]);

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 animate-pulse">
                <div className="h-4 w-40 bg-white/5 rounded mb-4" />
                <div className="h-48 bg-white/5 rounded" />
            </div>
        );
    }

    const isEmpty = data.every(d => d.treino === 0 && d.agua === 0 && d.sono === 0 && d.refeicao === 0);

    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">Atividade dos Atletas</h3>
                <div className="flex items-center gap-3">
                    {CATEGORIES.map(c => (
                        <div key={c.key} className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                            <span className="text-[10px] text-gray-500">{c.label}</span>
                        </div>
                    ))}
                </div>
            </div>
            {isEmpty ? (
                <div className="h-48 flex items-center justify-center text-gray-600 text-sm">
                    Sem registros nos últimos 7 dias
                </div>
            ) : (
                <canvas ref={canvasRef} className="w-full h-48" />
            )}
        </div>
    );
};
