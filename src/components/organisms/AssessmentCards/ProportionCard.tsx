import React from 'react';
import { Trophy } from 'lucide-react';
import { GlassPanel } from '@/components/atoms';
import { ScaleRuler } from '@/components/molecules';
import { colors, typography, spacing, borders, colors as designColors } from '@/tokens';
import { cardStyles } from './styles';

export interface ProportionCardProps {
    title: string;
    badge: string;
    metrics: { label: string; value: string }[];
    currentValue: number | string;
    valueUnit?: string;
    valueLabel?: string;
    description: string;
    statusLabel: string;
    userPosition: number; // 0-100%
    goalPosition: number; // 0-100%
    goalLabel?: string;
    image: string;
    overlayStyle?: 'v-taper' | 'chest' | 'arm' | 'triad' | 'waist' | 'legs';
    rawImage?: boolean;
    measurementsUsed?: { label: string; value: string }[];
}

export const ProportionCard: React.FC<ProportionCardProps> = ({
    title, badge, metrics, currentValue, valueUnit, valueLabel, description, statusLabel, userPosition, goalPosition, goalLabel = "GOLDEN", image, overlayStyle, rawImage = false, measurementsUsed
}) => {
    return (
        <GlassPanel className="rounded-2xl overflow-hidden border border-white/5 flex flex-col md:flex-row h-auto md:h-72" hoverEffect={false}>
            {/* Visual Section */}
            <div className="w-full md:w-1/4 relative bg-[#050810] flex items-center justify-center overflow-hidden group">
                <div className="absolute inset-0 flex items-center justify-center bg-[#050810]">
                    <img
                        src={image}
                        alt={title}
                        className={`h-full w-full object-contain transition-opacity duration-500 ${rawImage ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}
                    />
                </div>
                {!rawImage && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#050810]/20 to-[#131B2C]/90"></div>}

                {/* Anatomy Overlays */}
                <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
                    {overlayStyle === 'v-taper' && (
                        <div className="flex flex-col items-center gap-12 w-full px-8 mt-4">
                            <div className="w-full border-t border-dashed border-white/60 relative"></div>
                            <div className="h-20 w-full border-x border-blue-500/30 rounded-[50%]"></div>
                            <div className="w-2/3 border-t border-dashed border-blue-400 relative"></div>
                        </div>
                    )}
                    {/* Add more overlay styles here if needed */}

                    {overlayStyle && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-900/40 border border-blue-500/30 rounded text-[10px] font-bold text-blue-400 uppercase tracking-widest backdrop-blur-sm">
                            {badge}
                        </div>
                    )}
                </div>
            </div>

            {/* Data Section */}
            <div className="w-full md:w-3/4 p-5 flex flex-col justify-between relative h-full">
                <div className="flex justify-between items-start">
                    <div>
                        <span style={{ ...cardStyles.badge.base, ...cardStyles.badge.primary, marginBottom: spacing[0.5] }}>
                            {badge}
                        </span>
                        <h3 style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginBottom: spacing[1], lineHeight: 1.1 }}>
                            {title}
                        </h3>
                        <div style={{ display: 'flex', gap: spacing[2], marginBottom: spacing[1] }}>
                            {metrics.map((m, i) => (
                                <span key={i} style={{
                                    background: colors.background.dark,
                                    padding: `${spacing[0.5]} ${spacing[2]}`,
                                    borderRadius: borders.radius.sm,
                                    border: `1px solid rgba(255, 255, 255, 0.05)`,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: spacing[1]
                                }}>
                                    <span style={cardStyles.metricLabel}>{m.label}:</span>
                                    <strong style={cardStyles.metricValue}>{m.value}</strong>
                                </span>
                            ))}
                        </div>
                        {measurementsUsed && measurementsUsed.length > 0 && (
                            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium opacity-80 flex-wrap">
                                <span className="uppercase tracking-wide font-bold">Medidas:</span>
                                {measurementsUsed.map((m, idx) => (
                                    <span key={idx} style={{
                                        background: 'rgba(255,255,255,0.04)',
                                        padding: '1px 6px',
                                        borderRadius: '4px',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '3px'
                                    }}>
                                        <span style={{ color: colors.text.muted }}>{m.label}:</span>
                                        <strong style={{ color: colors.text.secondary }}>{m.value}</strong>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="text-right">
                        <div style={{ fontSize: typography.fontSize['4xl'], fontWeight: typography.fontWeight.bold, color: colors.semantic.info, lineHeight: 1 }}>
                            {currentValue}
                            {valueUnit && <span style={{ fontSize: typography.fontSize.lg, color: `${colors.semantic.info}80`, marginLeft: spacing[1] }}>{valueUnit}</span>}
                        </div>
                        {valueLabel && (
                            <div style={{ fontSize: '10px', color: colors.text.muted, textTransform: 'uppercase', fontWeight: typography.fontWeight.bold, letterSpacing: '0.1em', marginTop: spacing[1] }}>
                                {valueLabel}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-3 mb-1 relative flex-1 flex flex-col justify-center">
                    <ScaleRuler
                        value={Number(userPosition)}
                        goal={Number(goalPosition)}
                        goalLabel={goalLabel}
                    />
                </div>

                <div className="flex justify-between items-end gap-4 mt-auto">
                    <p style={{ fontSize: typography.fontSize.xs, color: colors.text.muted, maxWidth: '28rem', lineHeight: typography.lineHeight.snug }} className="line-clamp-2">
                        {description}
                    </p>
                    <button style={{
                        padding: `${spacing[1.5]} ${spacing[3]}`,
                        background: colors.background.dark,
                        border: `1px solid ${colors.semantic.info}4D`,
                        color: colors.semantic.info,
                        borderRadius: borders.radius.lg,
                        fontSize: '10px',
                        fontWeight: typography.fontWeight.bold,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        height: 'fit-content'
                    }}>
                        {statusLabel}
                    </button>
                </div>
            </div>
        </GlassPanel>
    );
};
