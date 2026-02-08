import { colors, typography, spacing, borders } from '@/tokens';

// --- SHARED STYLES ---
export const cardStyles = {
    badge: {
        base: {
            padding: `${spacing[1]} ${spacing[2]}`,
            borderRadius: borders.radius.sm,
            fontSize: '10px',
            fontWeight: typography.fontWeight.bold,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.05em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing[1]
        },
        primary: {
            color: colors.brand.primary,
            background: `${colors.brand.primary}1A`, // 10% opacity
            border: `1px solid ${colors.brand.primary}33`
        },
        secondary: {
            color: colors.brand.secondary,
            background: `${colors.brand.secondary}1A`,
            border: `1px solid ${colors.brand.secondary}33`
        },
        warning: {
            color: colors.semantic.warning,
            background: `${colors.semantic.warning}1A`,
            border: `1px solid ${colors.semantic.warning}33`
        }
    },
    metricLabel: {
        fontSize: typography.fontSize.xs,
        color: colors.text.muted,
        fontFamily: 'monospace'
    },
    metricValue: {
        color: colors.text.secondary,
        fontWeight: typography.fontWeight.bold
    }
};

export const bgOpacity = (themeColor: string, opacity: number) => {
    // If it's a hex color, we can just append the opacity
    if (themeColor.startsWith('#')) {
        return `${themeColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
    }
    return themeColor; // Fallback
};
