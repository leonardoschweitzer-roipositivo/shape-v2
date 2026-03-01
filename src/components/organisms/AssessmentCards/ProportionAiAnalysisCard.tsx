import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { GlassPanel } from '@/components/atoms';
import { colors, typography, spacing, borders } from '@/tokens';

export interface ProportionAiAnalysisCardProps {
    analysis: string;
    suggestion: string;
    goal12m?: string; // mantido na interface para não quebrar chamadas existentes, mas não exibido
}

export const ProportionAiAnalysisCard: React.FC<ProportionAiAnalysisCardProps> = ({ analysis, suggestion }) => {
    return (
        <GlassPanel
            className="h-full p-5 rounded-2xl border border-white/10 bg-gradient-to-b from-[#131B2C] to-[#0A0F1C] relative overflow-hidden flex flex-col"
            hoverEffect={false}
        >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" style={{ background: `${colors.brand.primary}0D` }}></div>

            {/* Header — fixo no topo */}
            <div className="flex items-center gap-2 mb-4 flex-shrink-0">
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
                <h4 style={{ color: colors.text.primary, fontWeight: typography.fontWeight.bold, fontSize: typography.fontSize.xs, letterSpacing: '0.05em' }}>ASSISTENTE IA</h4>
            </div>

            {/* Conteúdo — scrollável quando ultrapassar a altura do card */}
            <div
                className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1"
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: `${colors.brand.primary}40 transparent`,
                }}
            >
                {/* Análise Atual */}
                <div className="relative pl-3">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: `linear-gradient(to bottom, ${colors.brand.primary}80, transparent)` }}></div>
                    <p style={{ fontSize: '9px', color: colors.text.muted, fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: spacing[1] }}>Análise Atual</p>
                    <p style={{ fontSize: typography.fontSize.xs, color: colors.text.primary, lineHeight: typography.lineHeight.relaxed }} dangerouslySetInnerHTML={{ __html: analysis }}></p>
                </div>

                {/* O que Fazer */}
                <div className="relative pl-3">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: `linear-gradient(to bottom, ${colors.semantic.info}80, transparent)` }}></div>
                    <div className="flex items-center gap-1.5 mb-1">
                        <Bot size={10} color={colors.semantic.info} />
                        <p style={{ fontSize: '9px', color: colors.semantic.info, fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.1em' }}>O que Fazer</p>
                    </div>
                    <p style={{ fontSize: '10px', color: colors.text.secondary, fontStyle: 'italic', lineHeight: typography.lineHeight.relaxed }}>
                        "{suggestion}"
                    </p>
                </div>

            </div>
        </GlassPanel>
    );
};
