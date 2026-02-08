import React from 'react';
import { getPoint } from './helpers';

export const AsymmetryRadar: React.FC = () => {
    const size = 260;
    const center = size / 2;
    const radius = 90;
    const angles = [270, 342, 54, 126, 198]; // 5 points
    const labels = ["Braço", "Antebraço", "Panturrilha", "Coxa", "Peitoral"];

    // Left (Purple) Data
    const leftData = [0.8, 0.9, 0.95, 0.95, 0.85];
    // Right (Teal) Data
    const rightData = [1.0, 0.92, 0.95, 0.88, 0.85];

    const leftPath = angles.map((a, i) => getPoint(center, radius, a, leftData[i])).join(" ");
    const rightPath = angles.map((a, i) => getPoint(center, radius, a, rightData[i])).join(" ");

    // Background Grid
    const bgPath = angles.map(a => getPoint(center, radius, a, 1)).join(" ");
    const gridPath1 = angles.map(a => getPoint(center, radius, a, 0.7)).join(" ");
    const gridPath2 = angles.map(a => getPoint(center, radius, a, 0.4)).join(" ");

    return (
        <div className="relative w-full h-full flex flex-col items-center">
            <div className="relative w-full aspect-square max-w-[300px]">
                <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
                    {/* Grid */}
                    <polygon points={bgPath} fill="none" stroke="#1F2937" strokeWidth="1" />
                    <polygon points={gridPath1} fill="none" stroke="#1F2937" strokeWidth="1" />
                    <polygon points={gridPath2} fill="none" stroke="#1F2937" strokeWidth="1" />

                    {/* Axis Lines */}
                    {angles.map((a, i) => (
                        <line key={i} x1={center} y1={center} x2={getPoint(center, radius, a, 1).split(',')[0]} y2={getPoint(center, radius, a, 1).split(',')[1]} stroke="#1F2937" strokeWidth="1" />
                    ))}

                    {/* Left Data (Purple) */}
                    <polygon points={leftPath} fill="none" stroke="#7C3AED" strokeWidth="2" className="drop-shadow-[0_0_4px_rgba(124,58,237,0.5)]" />

                    {/* Right Data (Teal) */}
                    <polygon points={rightPath} fill="none" stroke="#00C9A7" strokeWidth="2" className="drop-shadow-[0_0_4px_rgba(0,201,167,0.5)]" />
                </svg>

                {/* Labels */}
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-[10px] text-gray-400 font-medium">{labels[0]}</span>
                <span className="absolute top-[30%] right-0 translate-x-2 text-[10px] text-gray-400 font-medium">{labels[1]}</span>
                <span className="absolute bottom-[20%] right-2 translate-y-2 text-[10px] text-gray-400 font-medium">{labels[2]}</span>
                <span className="absolute bottom-[20%] left-2 translate-y-2 text-[10px] text-gray-400 font-medium">{labels[3]}</span>
                <span className="absolute top-[30%] left-0 -translate-x-2 text-[10px] text-gray-400 font-medium">{labels[4]}</span>
            </div>
        </div>
    );
};
