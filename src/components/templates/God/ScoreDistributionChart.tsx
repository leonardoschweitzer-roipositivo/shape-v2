/**
 * ScoreDistributionChart — Gráfico Donut de distribuição de classificações
 *
 * Exibe proporção de atletas por classificação (INICIO → ELITE).
 * Canvas nativo sem dependências externas.
 */

import React, { useRef, useEffect } from 'react';
import type { DistribuicaoScore } from '@/services/godDashboard.service';

interface ScoreDistributionChartProps {
    data: DistribuicaoScore[];
    isLoading?: boolean;
}

export const ScoreDistributionChart: React.FC<ScoreDistributionChartProps> = ({ data, isLoading = false }) => {
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
        const cx = W / 2;
        const cy = H / 2;
        const outerR = Math.min(W, H) / 2 - 10;
        const innerR = outerR * 0.6;

        ctx.clearRect(0, 0, W, H);

        const total = data.reduce((s, d) => s + d.quantidade, 0);
        if (total === 0) return;

        let startAngle = -Math.PI / 2;

        data.forEach(segment => {
            const sliceAngle = (segment.quantidade / total) * Math.PI * 2;

            ctx.beginPath();
            ctx.arc(cx, cy, outerR, startAngle, startAngle + sliceAngle);
            ctx.arc(cx, cy, innerR, startAngle + sliceAngle, startAngle, true);
            ctx.closePath();
            ctx.fillStyle = segment.cor;
            ctx.fill();

            startAngle += sliceAngle;
        });

        // Center text
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(total), cx, cy - 6);
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = '10px system-ui';
        ctx.fillText('ATLETAS', cx, cy + 14);
    }, [data, isLoading]);

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 animate-pulse">
                <div className="h-4 w-40 bg-white/5 rounded mb-4" />
                <div className="h-48 bg-white/5 rounded" />
            </div>
        );
    }

    const total = data.reduce((s, d) => s + d.quantidade, 0);
    const isEmpty = total === 0;

    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-sm font-bold text-white mb-4">Distribuição de Scores</h3>
            {isEmpty ? (
                <div className="h-48 flex items-center justify-center text-gray-600 text-sm">
                    Nenhuma avaliação registrada
                </div>
            ) : (
                <div className="flex items-center gap-6">
                    <canvas ref={canvasRef} className="w-40 h-40 flex-shrink-0" />
                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                        {data.map(d => (
                            <div key={d.classificacao} className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.cor }} />
                                <span className="text-xs text-gray-400 truncate flex-1">{d.classificacao}</span>
                                <span className="text-xs font-bold text-white">{d.quantidade}</span>
                                <span className="text-[10px] text-gray-600 w-8 text-right">
                                    {total > 0 ? `${Math.round((d.quantidade / total) * 100)}%` : '0%'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
