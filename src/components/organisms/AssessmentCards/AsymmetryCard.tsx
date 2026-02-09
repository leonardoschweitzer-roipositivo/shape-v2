import React from 'react';
import { GlassPanel } from '@/components/atoms';
import { colors, typography, spacing, borders } from '@/tokens';

export interface AsymmetryCardProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    leftVal: string;
    rightVal: string;
    diff: string;
    status: 'high' | 'moderate' | 'symmetrical';
}

export const AsymmetryCard: React.FC<AsymmetryCardProps> = ({ icon, title, subtitle, leftVal, rightVal, diff, status }) => {
    const statusConfig = {
        high: {
            text: 'ASSIMETRIA ALTA',
            color: colors.semantic.orange,
            bgColor: `${colors.semantic.orange}1A`,
            borderColor: `${colors.semantic.orange}4D`
        },
        moderate: {
            text: 'ASSIMETRIA MODERADA',
            color: colors.semantic.warning,
            bgColor: `${colors.semantic.warning}1A`,
            borderColor: `${colors.semantic.warning}4D`
        },
        symmetrical: {
            text: 'SIMÉTRICO',
            color: colors.brand.primary,
            bgColor: `${colors.brand.primary}1A`,
            borderColor: `${colors.brand.primary}4D`
        }
    };

    const config = statusConfig[status];
    const rightValNum = parseFloat(rightVal.replace(',', '.'));
    const leftValNum = parseFloat(leftVal.replace(',', '.'));
    const diffNum = rightValNum - leftValNum;
    const absDiff = Math.abs(diffNum);
    const isRightHeavy = diffNum > 0;
    const isBalanced = absDiff < 0.1;

    return (
        <GlassPanel className="p-5 rounded-2xl border border-white/5 flex flex-col gap-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: borders.radius.full,
                        background: colors.background.card,
                        border: `1px solid rgba(255, 255, 255, 0.1)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.text.muted
                    }}>
                        {icon}
                    </div>
                    <div>
                        <h4 style={{ color: colors.text.primary, fontWeight: typography.fontWeight.bold, fontSize: typography.fontSize.sm, letterSpacing: '0.025em' }}>{title}</h4>
                        <p style={{ color: colors.text.secondary, fontSize: '10px', fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{subtitle}</p>
                    </div>
                </div>
                <span style={{
                    padding: `${spacing[1]} ${spacing[2]}`,
                    borderRadius: borders.radius.sm,
                    fontSize: '10px',
                    fontWeight: typography.fontWeight.bold,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    border: `1px solid ${config.borderColor}`,
                    color: config.color,
                    background: config.bgColor
                }}>
                    {config.text}
                </span>
            </div>

            <div className="flex items-center justify-between mt-2 gap-4">
                <div className="text-center w-24">
                    <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.brand.secondary, letterSpacing: typography.letterSpacing.tight }}>
                        {leftVal} <span style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, fontWeight: typography.fontWeight.normal }}>cm</span>
                    </div>
                    <div style={{ fontSize: '9px', color: colors.text.secondary, fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '2px' }}>Esquerdo</div>
                </div>

                <div className="flex-1 flex flex-col items-center gap-2">
                    <div style={{
                        width: '100%',
                        height: '10px',
                        background: colors.background.dark,
                        borderRadius: borders.radius.full,
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        border: `1px solid rgba(255, 255, 255, 0.05)`
                    }}>
                        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: '2px', height: '100%', background: colors.text.disabled, zIndex: 10 }}></div>
                        {!isBalanced && (
                            <div
                                style={{
                                    height: '100%',
                                    borderRadius: borders.radius.full,
                                    position: 'absolute',
                                    background: isRightHeavy ? colors.brand.primary : colors.brand.secondary,
                                    width: `${Math.min(absDiff * 20, 48)}%`,
                                    ...(isRightHeavy ? { left: '50%', transformOrigin: 'left' } : { right: '50%', transform: 'translateX(0%)', transformOrigin: 'right' })
                                }}
                            ></div>
                        )}
                        {isBalanced && (
                            <div style={{
                                position: 'absolute',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '6px',
                                height: '6px',
                                borderRadius: borders.radius.full,
                                background: colors.brand.primary,
                                boxShadow: `0 0 5px ${colors.brand.primary}CC`
                            }}></div>
                        )}
                    </div>

                    <span style={{
                        padding: `${spacing[1]} ${spacing[2]}`,
                        borderRadius: borders.radius.sm,
                        fontSize: '10px',
                        fontWeight: typography.fontWeight.bold,
                        color: config.color,
                        background: config.bgColor
                    }}>
                        {absDiff < 0.1 ? '0,0 cm' : `${diff} cm`}
                    </span>
                </div>

                <div className="text-center w-24">
                    <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.brand.primary, letterSpacing: typography.letterSpacing.tight }}>
                        {rightVal} <span style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, fontWeight: typography.fontWeight.normal }}>cm</span>
                    </div>
                    <div style={{ fontSize: '9px', color: colors.text.secondary, fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '2px' }}>Direito</div>
                </div>
            </div>
        </GlassPanel>
    );
};
