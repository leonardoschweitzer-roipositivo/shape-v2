import React, { useMemo } from 'react';

interface CalendarHeatmapProps {
    checkins: string[]; // ['2026-03-01', '2026-03-03']
    ano?: number;
}

const CORES = {
    treinou: '#3B82F6', // Blue
    naoTreinou: '#1F2937', // Dark
    hoje: '#22C55E', // Green
    pendente: '#374151', // Gray
};

export function CalendarHeatmap({ checkins, ano = new Date().getFullYear() }: CalendarHeatmapProps) {
    const cellSize = 10;
    const gap = 2;
    const totalSize = cellSize + gap;

    // Mostrar as últimas 12 semanas (aprox 3 meses) para o Personal ter uma visão rápida
    const numSemanas = 16;

    const grade = useMemo(() => {
        const checkinsSet = new Set(checkins);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const hojeKey = hoje.toISOString().split('T')[0];

        // Calcular data de início (hoje - numSemanas)
        const startDate = new Date(hoje);
        startDate.setDate(startDate.getDate() - (numSemanas * 7));
        // Ajustar para a segunda-feira daquela semana
        const day = startDate.getDay();
        const offset = day === 0 ? 6 : day - 1;
        startDate.setDate(startDate.getDate() - offset);

        const semanas = [];
        const cursor = new Date(startDate);

        for (let w = 0; w < numSemanas; w++) {
            const dias = [];
            for (let d = 0; d < 7; d++) {
                const key = cursor.toISOString().split('T')[0];
                let cor = CORES.naoTreinou;

                if (key === hojeKey) {
                    cor = checkinsSet.has(key) ? CORES.hoje : CORES.pendente;
                } else if (checkinsSet.has(key)) {
                    cor = CORES.treinou;
                }

                dias.push({ key, cor });
                cursor.setDate(cursor.getDate() + 1);
            }
            semanas.push(dias);
        }
        return semanas;
    }, [checkins, numSemanas]);

    return (
        <div className="w-full overflow-hidden">
            <svg
                width="100%"
                viewBox={`0 0 ${numSemanas * totalSize} ${7 * totalSize}`}
                preserveAspectRatio="xMinYMin meet"
                className="w-full h-auto"
            >
                {grade.map((semana, wIdx) =>
                    semana.map((dia, dIdx) => (
                        <rect
                            key={dia.key}
                            x={wIdx * totalSize}
                            y={dIdx * totalSize}
                            width={cellSize}
                            height={cellSize}
                            rx={1.5}
                            fill={dia.cor}
                        />
                    ))
                )}
            </svg>
            <div className="flex justify-between mt-2 text-[8px] font-bold text-gray-500 uppercase tracking-widest">
                <span>{numSemanas} semanas atrás</span>
                <span>Hoje</span>
            </div>
        </div>
    );
}
