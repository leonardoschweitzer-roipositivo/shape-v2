import React from 'react';
import { Trophy } from 'lucide-react';
import { GlassPanel } from '@/components/atoms';
import { colors, typography, spacing, borders } from '@/tokens';

export interface ScoreWidgetProps {
    score: number;
    label?: string;
    change?: string;
    classification?: {
        nivel: string;
        emoji: string;
        cor: string;
    };
}

export const ScoreWidget: React.FC<ScoreWidgetProps> = ({
    score,
    label = "Pontos",
    change = "+5%",
    classification = { nivel: 'Shape Atlético', emoji: '💪', cor: colors.brand.primary }
}) => {
    return (
        <GlassPanel className="rounded-2xl p-1 relative flex flex-col items-center justify-center min-h-[300px]" hoverEffect={false}>
            <div style={{ position: 'absolute', top: spacing[6], left: spacing[6], fontSize: typography.fontSize.xs, color: colors.text.muted, fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Avaliação Geral</div>
            <Trophy style={{ position: 'absolute', top: spacing[6], right: spacing[6], color: colors.text.disabled }} size={24} />

            <div className="relative w-48 h-48 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full blur-3xl opacity-20" style={{ background: colors.brand.primary }}></div>
                <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 240 240">
                    <circle cx="120" cy="120" r="80" fill="none" stroke={colors.background.card} strokeWidth="16" />
                    <circle
                        cx="120" cy="120" r="80" fill="none" stroke={colors.brand.primary} strokeWidth="16"
                        strokeDasharray="502" strokeDashoffset={502 - (502 * score) / 100}
                        strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${colors.brand.primary}66)` }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span style={{ fontSize: typography.fontSize['5xl'], fontWeight: typography.fontWeight.bold, color: colors.text.primary, letterSpacing: typography.letterSpacing.tight }}>{score}</span>
                    <span style={{ fontSize: '10px', color: colors.text.muted, fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: spacing[1] }}>{label}</span>
                </div>
            </div>

            <div style={{ marginTop: spacing[6], display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing[2] }}>
                <span style={{
                    padding: `${spacing[1]} ${spacing[4]}`,
                    borderRadius: borders.radius.full,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid rgba(255, 255, 255, 0.1)`,
                    color: classification.cor,
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeight.bold,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>{classification.emoji} {classification.nivel}</span>
                <span style={{ fontSize: '10px', color: colors.semantic.success, fontWeight: typography.fontWeight.bold }}>
                    {change} <span style={{ color: colors.text.secondary, fontWeight: typography.fontWeight.medium }}>vs. mês anterior</span>
                </span>
            </div>
        </GlassPanel>
    );
};
