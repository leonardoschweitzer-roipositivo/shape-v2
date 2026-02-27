import React from 'react';

/**
 * Categorias de gordura corporal baseadas no padrão ACE (American Council on Exercise).
 * 
 * Masculino: Essencial <6%, Atleta 6-13%, Fitness 14-17%, Aceitável 18-24%, Acima 25-29%, Obesidade 30%+
 * Feminino:  Essencial <14%, Atleta 14-20%, Fitness 21-24%, Aceitável 25-31%, Acima 32-38%, Obesidade 39%+
 */

interface BFCategory {
    label: string;
    color: string;
    min: number;
    max: number;
}

const BF_CATEGORIES_MALE: BFCategory[] = [
    { label: 'Essencial', color: '#9CA3AF', min: 0, max: 6 },
    { label: 'Atleta', color: '#00C9A7', min: 6, max: 13 },
    { label: 'Fitness', color: '#3B82F6', min: 13, max: 17 },
    { label: 'Aceitável', color: '#F59E0B', min: 17, max: 25 },
    { label: 'Acima', color: '#EF4444', min: 25, max: 30 },
    { label: 'Obesidade', color: '#B91C1C', min: 30, max: 50 },
];

const BF_CATEGORIES_FEMALE: BFCategory[] = [
    { label: 'Essencial', color: '#9CA3AF', min: 0, max: 14 },
    { label: 'Atleta', color: '#00C9A7', min: 14, max: 21 },
    { label: 'Fitness', color: '#3B82F6', min: 21, max: 25 },
    { label: 'Aceitável', color: '#F59E0B', min: 25, max: 32 },
    { label: 'Acima', color: '#EF4444', min: 32, max: 39 },
    { label: 'Obesidade', color: '#B91C1C', min: 39, max: 60 },
];

interface BodyFatGaugeProps {
    value: number;
    method?: 'navy' | 'pollock';
    onMethodChange?: (method: 'navy' | 'pollock') => void;
    gender?: 'male' | 'female';
}

export const BodyFatGauge: React.FC<BodyFatGaugeProps> = ({
    value,
    method = 'navy',
    onMethodChange,
    gender = 'male'
}) => {
    const categories = gender === 'male' ? BF_CATEGORIES_MALE : BF_CATEGORIES_FEMALE;
    const maxRange = gender === 'female' ? 50 : 40;

    // Determine current category based on value
    const getLevelInfo = (val: number): BFCategory => {
        for (const cat of categories) {
            if (val < cat.max) return cat;
        }
        return categories[categories.length - 1];
    };

    const level = getLevelInfo(value);

    // SVG arc geometry constants
    // Arc: M 25 90 A 75 75 0 0 1 175 90 (semi-circle from left to right)
    const arcLength = 235; // total path length of the semi-circle
    const percentage = Math.min(Math.max(value, 0), maxRange) / maxRange;
    const dashValue = percentage * arcLength;

    // Generate zone segments for the background arc
    const generateZoneSegments = () => {
        return categories
            .filter(cat => cat.min < maxRange) // only show categories that fit in the range
            .map(cat => {
                const startPct = Math.min(cat.min, maxRange) / maxRange;
                const endPct = Math.min(cat.max, maxRange) / maxRange;
                const segStart = startPct * arcLength;
                const segLength = (endPct - startPct) * arcLength;

                return (
                    <path
                        key={cat.label}
                        d="M 25 90 A 75 75 0 0 1 175 90"
                        fill="none"
                        stroke={cat.color}
                        strokeWidth="12"
                        strokeLinecap="butt"
                        strokeDasharray={`0 ${segStart} ${segLength} ${arcLength}`}
                        opacity={0.15}
                    />
                );
            });
    };

    // Generate tick marks at category boundaries
    const generateTicks = () => {
        // Get boundary values (exclude 0 and the max, keep only internal boundaries)
        const boundaries = categories
            .map(cat => cat.max)
            .filter(b => b > 0 && b < maxRange);

        return boundaries.map(boundary => {
            const pct = boundary / maxRange;
            // Calculate position on the arc (angle from left to right, 0 = left, PI = right)
            const angle = Math.PI * (1 - pct); // Reverse because arc goes left-to-right
            const cx = 100; // center x
            const cy = 90; // center y
            const r = 75; // radius

            // Point on the arc
            const x = cx + r * Math.cos(angle);
            const y = cy - r * Math.sin(angle);

            // Tick direction (outward from center)
            const dx = Math.cos(angle);
            const dy = -Math.sin(angle);

            // Tick length (outer and inner from the arc edge)
            const tickOuterLen = 9;
            const tickInnerLen = 9;

            const x1 = x + dx * tickOuterLen;
            const y1 = y + dy * tickOuterLen;
            const x2 = x - dx * tickInnerLen;
            const y2 = y - dy * tickInnerLen;

            // Label position (further out)
            const labelX = x + dx * 17;
            const labelY = y + dy * 17;

            return (
                <g key={`tick-${boundary}`}>
                    <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="rgba(255,255,255,0.25)"
                        strokeWidth="1"
                    />
                    <text
                        x={labelX}
                        y={labelY}
                        fill="rgba(255,255,255,0.4)"
                        fontSize="6"
                        fontWeight="600"
                        textAnchor="middle"
                        dominantBaseline="central"
                    >
                        {boundary}%
                    </text>
                </g>
            );
        });
    };

    // Pick 3 representative categories for the bottom legend (first 3 relevant ones)
    const legendCategories = categories.slice(0, 3);

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-6">
            <div className="w-full flex justify-between items-center mb-2">
                <h4 className="text-xs text-gray-400 font-bold uppercase tracking-widest">Gordura Corporal</h4>
                <div className="flex gap-1">
                    <button
                        onClick={() => onMethodChange?.('navy')}
                        className={`px-2 py-0.5 text-[9px] font-bold rounded transition-all ${method === 'navy'
                            ? 'bg-[#00C9A7] text-[#0A0F1C]'
                            : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                            }`}
                    >
                        NAVY
                    </button>
                    <button
                        onClick={() => onMethodChange?.('pollock')}
                        className={`px-2 py-0.5 text-[9px] font-bold rounded transition-all ${method === 'pollock'
                            ? 'bg-[#00C9A7] text-[#0A0F1C]'
                            : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                            }`}
                    >
                        POLLOCK 7
                    </button>
                </div>
            </div>

            <div className="relative w-48 h-28 mt-2 overflow-visible">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 200 120">
                    {/* Background zone segments (colored, low opacity) */}
                    {generateZoneSegments()}

                    {/* Thin dark outline arc for contrast */}
                    <path d="M 25 90 A 75 75 0 0 1 175 90" fill="none" stroke="#1F2937" strokeWidth="13" strokeLinecap="round" opacity={0.5} />

                    {/* Zone segments on top of dark outline */}
                    {generateZoneSegments()}

                    {/* Active value arc */}
                    <path
                        d="M 25 90 A 75 75 0 0 1 175 90"
                        fill="none"
                        stroke={level.color}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${dashValue} ${arcLength}`}
                        className="transition-all duration-1000 ease-out"
                    />

                    {/* Tick marks at zone boundaries */}
                    {generateTicks()}
                </svg>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                    <div className="text-3xl font-bold text-white tracking-tighter">
                        {value.toFixed(1)}<span className="text-sm text-gray-400">%</span>
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: level.color }}>
                        {level.label}
                    </div>
                </div>
            </div>

            {/* Bottom legend showing first 3 categories */}
            <div className="w-full grid grid-cols-3 gap-2 mt-4 border-t border-white/5 pt-4">
                {legendCategories.map(cat => {
                    // Display-friendly ranges (ACE standard labels)
                    const displayMin = cat.min <= 2 ? (gender === 'male' ? 2 : 10) : cat.min;
                    const displayMax = cat.max - 1;
                    const isActive = level.label === cat.label;
                    return (
                        <div key={cat.label} className="text-center">
                            <p className="text-[9px] font-bold uppercase" style={{ color: isActive ? cat.color : '#6B7280' }}>
                                {cat.label}
                            </p>
                            <p className="text-xs font-bold" style={{ color: isActive ? cat.color : '#FFFFFF' }}>
                                {displayMin}-{displayMax}%
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
