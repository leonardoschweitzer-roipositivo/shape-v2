import React from 'react';
import { getPoint } from './helpers';

export const RadarChart: React.FC = () => {
    const size = 200;
    const center = size / 2;
    const radius = 70;
    const angles = [270, 330, 30, 90, 150, 210];
    const labels = ["Pescoço", "Bíceps", "Antebraço", "Panturrilha", "Coxa", "Peito"];

    const leftSide = [0.9, 0.8, 0.85, 0.9, 0.95, 0.85];
    const rightSide = [0.9, 0.95, 0.85, 0.9, 0.95, 0.7];

    const leftPath = angles.map((a, i) => getPoint(center, radius, a, leftSide[i])).join(" ");
    const rightPath = angles.map((a, i) => getPoint(center, radius, a, rightSide[i])).join(" ");
    const bgPath = angles.map(a => getPoint(center, radius, a, 1)).join(" ");
    const gridPath = angles.map(a => getPoint(center, radius, a, 0.6)).join(" ");

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
            <h4 className="absolute top-4 left-6 text-xs text-gray-400 font-bold uppercase tracking-widest">Radar de Simetria</h4>
            <span className="absolute top-4 right-6 text-lg font-bold text-[#7C3AED]">94%</span>

            <div className="relative w-[260px] h-[220px] mt-4">
                <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
                    <polygon points={bgPath} fill="none" stroke="#2a303c" strokeWidth="1" />
                    <polygon points={gridPath} fill="none" stroke="#2a303c" strokeWidth="1" strokeDasharray="4 2" />
                    {angles.map((a, i) => (
                        <line key={i} x1={center} y1={center} x2={getPoint(center, radius, a, 1).split(',')[0]} y2={getPoint(center, radius, a, 1).split(',')[1]} stroke="#2a303c" strokeWidth="1" />
                    ))}
                    <polygon points={leftPath} fill="rgba(124, 58, 237, 0.2)" stroke="#7C3AED" strokeWidth="2" />
                    <polygon points={rightPath} fill="transparent" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="2 2" />
                </svg>
                {/* Labels positioning logic */}
                <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] text-gray-400">{labels[0]}</span>
                <span className="absolute top-[25%] right-2 text-[9px] text-gray-400">{labels[1]}</span>
                <span className="absolute bottom-[25%] right-0 text-[9px] text-gray-400">{labels[2]}</span>
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] text-gray-400">{labels[3]}</span>
                <span className="absolute bottom-[25%] left-4 text-[9px] text-gray-400">{labels[4]}</span>
                <span className="absolute top-[25%] left-8 text-[9px] text-gray-400">{labels[5]}</span>
            </div>

            <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#7C3AED]"></span>
                    <span className="text-[10px] text-gray-400">Esquerdo</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full border border-white/30"></span>
                    <span className="text-[10px] text-gray-400">Direito (Ref)</span>
                </div>
            </div>
        </div>
    );
};
