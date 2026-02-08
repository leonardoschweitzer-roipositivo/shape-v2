import React from 'react';
import { Sparkles } from 'lucide-react';
import { GlassPanel } from '@/components/atoms';
import { colors, typography, spacing, borders } from '@/tokens';

export interface AiInsightCardProps {
    type?: string;
    title: string;
    description: React.ReactNode;
}

export const AiInsightCard: React.FC<AiInsightCardProps> = ({ type = "AI Insight", title, description }) => {
    return (
        <GlassPanel className="p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-[#131B2C] to-[#0A0F1C] relative overflow-hidden" hoverEffect={false}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none" style={{ background: `${colors.brand.primary}0D` }}></div>
            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing[2],
                padding: `${spacing[1]} ${spacing[2]}`,
                borderRadius: borders.radius.sm,
                background: `${colors.brand.primary}1A`,
                border: `1px solid ${colors.brand.primary}33`,
                color: colors.brand.primary,
                fontSize: '10px',
                fontWeight: typography.fontWeight.bold,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: spacing[3]
            }}>
                <Sparkles size={10} /> {type}
            </div>
            <h4 style={{ color: colors.text.primary, fontWeight: typography.fontWeight.bold, fontSize: typography.fontSize.sm, marginBottom: spacing[2] }}>{title}</h4>
            <div style={{ color: colors.text.muted, fontSize: typography.fontSize.xs, lineHeight: typography.lineHeight.relaxed }}>
                {description}
            </div>
        </GlassPanel>
    );
};
