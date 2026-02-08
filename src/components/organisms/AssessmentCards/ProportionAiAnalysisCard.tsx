import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { GlassPanel } from '@/components/atoms';
import { colors, typography, spacing, borders } from '@/tokens';

export interface ProportionAiAnalysisCardProps {
    strength?: string;
    weakness?: string;
    suggestion?: string;
}

export const ProportionAiAnalysisCard: React.FC<ProportionAiAnalysisCardProps> = ({ strength, weakness, suggestion }) => {
    return (
        <GlassPanel className="h-full p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-[#131B2C] to-[#0A0F1C] relative overflow-hidden flex flex-col" hoverEffect={false}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" style={{ background: `${colors.brand.primary}0D` }}></div>

            <div className="flex items-center gap-2 mb-4">
                <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: borders.radius.sm,
                    background: `${colors.brand.primary}1A`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${colors.brand.primary}33`,
                    boxShadow: `0 0 10px ${colors.brand.primary}1A`
                }}>
                    <Sparkles size={12} color={colors.brand.primary} />
                </div>
                <h4 style={{ color: colors.text.primary, fontWeight: typography.fontWeight.bold, fontSize: typography.fontSize.xs, letterSpacing: '0.05em' }}>ANÁLISE DE PROPORÇÃO</h4>
            </div>

            <div className="flex-1 space-y-4">
                {strength && (
                    <div className="relative pl-3">
                        <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: `linear-gradient(to bottom, ${colors.brand.primary}80, transparent)` }}></div>
                        <p style={{ fontSize: '9px', color: colors.text.muted, fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: spacing[1] }}>Ponto Forte</p>
                        <p style={{ fontSize: typography.fontSize.xs, color: colors.text.primary, lineHeight: typography.lineHeight.relaxed }} dangerouslySetInnerHTML={{ __html: strength }}></p>
                    </div>
                )}
                {weakness && (
                    <div className="relative pl-3">
                        <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: `linear-gradient(to bottom, ${colors.semantic.orange}80, transparent)` }}></div>
                        <p style={{ fontSize: '9px', color: colors.text.muted, fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: spacing[1] }}>Atenção</p>
                        <p style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, lineHeight: typography.lineHeight.relaxed }} dangerouslySetInnerHTML={{ __html: weakness }}></p>
                    </div>
                )}
            </div>

            {suggestion && (
                <div style={{ marginTop: spacing[4], paddingTop: spacing[4], borderTop: `1px solid rgba(255, 255, 255, 0.05)` }}>
                    <div className="flex items-center gap-1.5 mb-2">
                        <Bot size={12} color={colors.semantic.info} />
                        <span style={{ fontSize: '9px', fontWeight: typography.fontWeight.bold, color: colors.semantic.info, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Coach IA</span>
                    </div>
                    <p style={{ fontSize: '10px', color: colors.text.muted, fontStyle: 'italic', lineHeight: typography.lineHeight.relaxed }}>
                        "{suggestion}"
                    </p>
                </div>
            )}
        </GlassPanel>
    );
};
