import React from 'react';
import { Utensils, Dumbbell, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { GlassPanel } from '@/components/atoms';
import { colors, typography, spacing, borders } from '@/tokens';
import { bgOpacity } from './styles';

export interface MassCardProps {
    label: string;
    value: number;
    unit: string;
    trend: number;
    color?: 'green' | 'red' | 'purple';
}

export const MassCard: React.FC<MassCardProps> = ({ label, value, unit, trend, color = 'green' }) => {
    const isPositive = trend > 0;

    // Map props to tokens
    const getColor = (c: string) => {
        switch (c) {
            case 'green': return colors.brand.primary;
            case 'red': return colors.semantic.error;
            case 'purple': return colors.brand.secondary;
            default: return colors.brand.primary;
        }
    };

    const themeColor = getColor(color);

    return (
        <GlassPanel className="p-5 rounded-xl flex flex-col justify-between relative overflow-hidden">
            <div className="flex justify-between items-start z-10">
                <h4 style={{ fontSize: '10px', color: colors.text.muted, fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</h4>
                {label === "Peso Gordo" ? <Utensils size={14} color={colors.text.disabled} /> : <Dumbbell size={14} color={colors.text.disabled} />}
            </div>

            <div className="z-10 mt-2">
                <div className="flex items-baseline gap-1">
                    <span style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.bold, color: colors.text.primary, letterSpacing: typography.letterSpacing.tight }}>{value}</span>
                    <span style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, fontWeight: typography.fontWeight.medium }}>{unit}</span>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between z-10">
                <div style={{ height: '24px', width: '64px', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
                    <div style={{ width: '25%', borderRadius: `${borders.radius.sm} ${borders.radius.sm} 0 0`, opacity: 0.2, background: themeColor, height: color === 'red' ? '80%' : '40%' }}></div>
                    <div style={{ width: '25%', borderRadius: `${borders.radius.sm} ${borders.radius.sm} 0 0`, opacity: 0.4, background: themeColor, height: color === 'red' ? '60%' : '60%' }}></div>
                    <div style={{ width: '25%', borderRadius: `${borders.radius.sm} ${borders.radius.sm} 0 0`, opacity: 0.6, background: themeColor, height: color === 'red' ? '50%' : '70%' }}></div>
                    <div style={{ width: '25%', borderRadius: `${borders.radius.sm} ${borders.radius.sm} 0 0`, background: themeColor, height: color === 'red' ? '40%' : '90%' }}></div>
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: borders.radius.sm,
                    fontSize: '10px',
                    fontWeight: typography.fontWeight.bold,
                    background: bgOpacity(themeColor, 0.1),
                    color: themeColor
                }}>
                    {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    <span>{Math.abs(trend)}%</span>
                </div>
            </div>
        </GlassPanel>
    );
};
