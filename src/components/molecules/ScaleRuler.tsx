import React from 'react';
import { Trophy } from 'lucide-react';
import { colors, typography, spacing, borders } from '@/tokens';

export interface ScaleZone {
    label: string;
    min: number;
    max: number;
    color: string;
}

export interface ScaleRulerProps {
    value: number; // 0-100 (percentage position)
    goal?: number; // 0-100
    goalLabel?: string;
    zones?: ScaleZone[];
    currentValueLabel?: string;
}

const DEFAULT_ZONES: ScaleZone[] = [
    { label: 'INÍCIO', min: 75, max: 82, color: '#1E3A5F' },
    { label: 'CAMINHO', min: 82, max: 90, color: '#2563EB' },
    { label: 'QUASE LÁ', min: 90, max: 97, color: '#3B82F6' },
    { label: 'META', min: 97, max: 103, color: '#8B5CF6' },
    { label: 'ELITE', min: 103, max: 110, color: '#EAB308' }
];

export const ScaleRuler: React.FC<ScaleRulerProps> = ({
    value,
    goal = 100,
    goalLabel = "GOLDEN",
    zones = DEFAULT_ZONES,
    currentValueLabel = "VOCÊ"
}) => {
    // Definimos o range da régua: de 75% a 110%
    const minScale = 75;
    const maxScale = 110;

    // Função para mapear o valor (75-105) para a posição percentual da barra (0-100)
    const getPercentage = (val: number) => {
        const percentage = ((val - minScale) / (maxScale - minScale)) * 100;
        return Math.max(0, Math.min(100, percentage));
    };

    const userPos = getPercentage(value);
    const goalPos = getPercentage(goal);

    return (
        <div className="relative w-full py-6">
            {/* The Track */}
            <div className="relative h-2.5 w-full rounded-full overflow-hidden flex border border-white/5 bg-[#050810]/50">
                {zones.map((zone, idx) => {
                    const zoneStart = getPercentage(zone.min);
                    const zoneEnd = getPercentage(zone.max);
                    const zoneWidth = zoneEnd - zoneStart;

                    if (zoneWidth <= 0) return null;

                    return (
                        <div
                            key={idx}
                            style={{
                                width: `${zoneWidth}%`,
                                height: '100%',
                                background: zone.color,
                                borderRight: '1px solid rgba(10, 15, 28, 0.2)'
                            }}
                        />
                    );
                })}

                {/* Precision Ticks Overlay */}
                <div className="absolute inset-0 flex justify-between px-0.5 pointer-events-none opacity-20">
                    {[...Array(31)].map((_, i) => (
                        <div key={i} className={`w-px bg-white ${i % 10 === 0 ? 'h-full' : i % 5 === 0 ? 'h-2/3 mt-auto' : 'h-1/3 mt-auto'}`} />
                    ))}
                </div>
            </div>

            {/* Labels below the track */}
            <div className="relative w-full mt-2 h-3">
                {zones.map((zone, idx) => {
                    const zoneStart = getPercentage(zone.min);
                    const zoneEnd = getPercentage(zone.max);
                    const center = zoneStart + (zoneEnd - zoneStart) / 2;

                    if (center < 0 || center > 100) return null;

                    return (
                        <span
                            key={idx}
                            style={{
                                position: 'absolute',
                                left: `${center}%`,
                                transform: 'translateX(-50%)',
                                fontSize: '8px',
                                fontWeight: typography.fontWeight.bold,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                color: value >= zone.min && value < zone.max ? colors.text.primary : colors.text.muted,
                                opacity: value >= zone.min && value < zone.max ? 1 : 0.4,
                                transition: 'all 0.3s ease',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {zone.label}
                        </span>
                    );
                })}
            </div>

            {/* User Marker (VOCÊ) */}
            <div
                className="absolute top-0 transition-all duration-1000 ease-out z-20"
                style={{ left: `${userPos}%`, transform: 'translateX(-50%)' }}
            >
                <div className="flex flex-col items-center">
                    <div style={{
                        padding: '1px 6px',
                        background: colors.text.primary,
                        color: colors.background.dark,
                        fontSize: '9px',
                        fontWeight: typography.fontWeight.bold,
                        borderRadius: borders.radius.sm,
                        marginBottom: '4px',
                        boxShadow: `0 0 10px ${colors.text.primary}40`,
                        whiteSpace: 'nowrap',
                        border: `1px solid ${colors.background.dark}`
                    }}>
                        {currentValueLabel}
                    </div>
                    {/* Diamond Pointer */}
                    <div style={{
                        width: '10px',
                        height: '10px',
                        background: colors.text.primary,
                        transform: 'rotate(45deg)',
                        border: `2px solid ${colors.background.dark}`,
                        boxShadow: `0 0 12px ${colors.text.primary}80`
                    }} />
                </div>
            </div>

            {/* Goal Marker (GOLDEN) */}
            <div
                className="absolute top-0 z-10"
                style={{ left: `${goalPos}%`, transform: 'translateX(-50%)' }}
            >
                <div className="flex flex-col items-center">
                    <Trophy size={10} color={colors.semantic.warning} style={{ marginBottom: 2, filter: 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.4))' }} />
                    <div style={{
                        fontSize: '7px',
                        fontWeight: typography.fontWeight.bold,
                        color: colors.semantic.warning,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginBottom: '4px'
                    }}>
                        {goalLabel}
                    </div>
                    {/* Vertical dashed line */}
                    <div style={{
                        width: '1px',
                        height: '24px',
                        background: `linear-gradient(to bottom, ${colors.semantic.warning}, transparent)`,
                        opacity: 0.8,
                        borderRight: `1px dashed ${colors.semantic.warning}60`
                    }} />
                </div>
            </div>
        </div>
    );
};
