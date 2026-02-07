import React, { useState } from 'react';
import { BodyHeatmapData, RegionData } from '../../../features/dashboard/types';

interface BodyHeatmapProps {
    data: BodyHeatmapData;
}

const BodyPath = ({
    d,
    fill,
    onClick,
    onMouseEnter,
    onMouseLeave
}: {
    d: string,
    fill: string,
    onClick?: () => void,
    onMouseEnter?: (e: React.MouseEvent) => void,
    onMouseLeave?: () => void
}) => (
    <path
        d={d}
        fill={fill}
        stroke="#1F2937"
        strokeWidth="1"
        className="transition-all duration-300 hover:opacity-80 cursor-pointer hover:stroke-white/50"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
    />
);

export const BodyHeatmap: React.FC<BodyHeatmapProps> = ({ data }) => {
    const { regions } = data;
    const [hoveredRegion, setHoveredRegion] = useState<RegionData | null>(null);

    const getColorForStatus = (status: RegionData['status']) => {
        switch (status) {
            case 'excellent': return '#10B981'; // emerald-500
            case 'good': return '#00C9A7'; // teal
            case 'attention': return '#F59E0B'; // amber-500
            case 'critical': return '#EF4444'; // red-500
            default: return '#374151'; // gray-700
        }
    };

    const handleMouseEnter = (regionKey: string) => {
        if (regions[regionKey]) {
            setHoveredRegion(regions[regionKey]);
        }
    };

    return (
        <div className="bg-[#131B2C] rounded-2xl p-6 border border-white/5 shadow-lg relative flex flex-col items-center h-[380px]">

            {/* Header */}
            <div className="w-full flex justify-between items-start mb-4 z-10">
                <h4 className="text-gray-400 text-xs font-bold tracking-wider uppercase">MAPA DE CALOR CORPORAL</h4>
                <div className="text-[10px] text-gray-500">Clique para detalhes</div>
            </div>

            {/* Legend */}
            <div className="w-full flex justify-center gap-3 mb-6 z-10">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><span className="text-[10px] text-gray-400">Excellent</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#00C9A7]"></div><span className="text-[10px] text-gray-400">Good</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div><span className="text-[10px] text-gray-400">Attention</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="text-[10px] text-gray-400">Critical</span></div>
            </div>

            {/* Body SVG */}
            <div className="relative flex-1 w-full max-w-[280px] flex justify-center items-center z-10">
                <svg viewBox="0 0 200 280" className="h-full drop-shadow-2xl">
                    {/* Silhouette paths - Simplified for demo */}
                    <g transform="translate(50, 20)">
                        {/* Head - Neutral */}
                        <circle cx="50" cy="25" r="15" fill="#374151" />

                        {/* Shoulders / Traps */}
                        <BodyPath
                            d="M35 40 L65 40 L85 55 L15 55 Z"
                            fill={getColorForStatus(regions.ombros?.status || 'good')}
                            onMouseEnter={() => handleMouseEnter('ombros')}
                            onMouseLeave={() => setHoveredRegion(null)}
                        />

                        {/* Chest */}
                        <BodyPath
                            d="M15 55 L85 55 L80 85 L20 85 Z"
                            fill={getColorForStatus(regions.peitoral?.status || 'good')}
                            onMouseEnter={() => handleMouseEnter('peitoral')}
                            onMouseLeave={() => setHoveredRegion(null)}
                        />

                        {/* Arms (Left/Right combined representation) */}
                        <BodyPath
                            d="M15 55 L0 75 L10 120 L20 85 Z"
                            fill={getColorForStatus(regions.bracos?.status || 'good')}
                            onMouseEnter={() => handleMouseEnter('bracos')}
                            onMouseLeave={() => setHoveredRegion(null)}
                        />
                        <BodyPath
                            d="M85 55 L100 75 L90 120 L80 85 Z"
                            fill={getColorForStatus(regions.bracos?.status || 'good')}
                            onMouseEnter={() => handleMouseEnter('bracos')}
                            onMouseLeave={() => setHoveredRegion(null)}
                        />

                        {/* Waist / Abs */}
                        <BodyPath
                            d="M20 85 L80 85 L75 115 L25 115 Z"
                            fill={getColorForStatus(regions.cintura?.status || 'good')}
                            onMouseEnter={() => handleMouseEnter('cintura')}
                            onMouseLeave={() => setHoveredRegion(null)}
                        />

                        {/* Thighs */}
                        <BodyPath
                            d="M25 115 L50 115 L50 180 L30 170 Z"
                            fill={getColorForStatus(regions.coxas?.status || 'good')}
                            onMouseEnter={() => handleMouseEnter('coxas')}
                            onMouseLeave={() => setHoveredRegion(null)}
                        />
                        <BodyPath
                            d="M50 115 L75 115 L70 170 L50 180 Z"
                            fill={getColorForStatus(regions.coxas?.status || 'good')}
                            onMouseEnter={() => handleMouseEnter('coxas')}
                            onMouseLeave={() => setHoveredRegion(null)}
                        />

                        {/* Calves */}
                        <BodyPath
                            d="M30 170 L50 180 L45 230 L35 230 Z"
                            fill={getColorForStatus(regions.panturrilhas?.status || 'good')}
                            onMouseEnter={() => handleMouseEnter('panturrilhas')}
                            onMouseLeave={() => setHoveredRegion(null)}
                        />
                        <BodyPath
                            d="M70 170 L50 180 L55 230 L65 230 Z"
                            fill={getColorForStatus(regions.panturrilhas?.status || 'good')}
                            onMouseEnter={() => handleMouseEnter('panturrilhas')}
                            onMouseLeave={() => setHoveredRegion(null)}
                        />
                    </g>
                </svg>

                {/* Hover Tooltip */}
                {hoveredRegion && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900/90 backdrop-blur-sm border border-white/10 p-4 rounded-xl shadow-2xl z-20 min-w-[160px] pointer-events-none animate-fadeIn">
                        <h5 className="text-white font-bold text-lg mb-1">{hoveredRegion.name}</h5>
                        <div className={`text-xs font-bold uppercase tracking-wider mb-3 ${hoveredRegion.status === 'excellent' ? 'text-emerald-500' :
                            hoveredRegion.status === 'good' ? 'text-teal-400' :
                                hoveredRegion.status === 'attention' ? 'text-amber-500' : 'text-red-500'
                            }`}>
                            {hoveredRegion.status}
                        </div>
                        <div className="space-y-1 text-xs text-gray-300">
                            <div className="flex justify-between">
                                <span>Score:</span>
                                <span className="font-mono text-white">{hoveredRegion.score}/100</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Atual:</span>
                                <span className="font-mono text-white">{hoveredRegion.atual} cm</span>
                            </div>
                            <div className="flex justify-between border-t border-white/10 pt-1 mt-1">
                                <span>Gap:</span>
                                <span className="font-mono text-red-400">-{hoveredRegion.diferenca} cm</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Background Radial */}
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-[#00C9A7]/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        </div>
    );
};
