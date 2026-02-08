/**
 * Hook para facilitar uso de Design Tokens - VITRU IA
 * 
 * Centraliza acesso a tokens de design (cores, tipografia, espaçamento)
 * para uso em componentes via inline styles ou styled-components.
 * 
 * @example
 * const { colors, typography, spacing } = useTokens();
 * 
 * <div style={{
 *   backgroundColor: colors.background.card,
 *   fontSize: typography.fontSize.xl,
 *   padding: spacing[4]
 * }}>
 */

import { colors } from '../tokens/colors';
import { typography } from '../tokens/typography';
import { spacing } from '../tokens/spacing';
import { shadows } from '../tokens/shadows';
import { borders } from '../tokens/borders';

export const useTokens = () => {
    return {
        colors,
        typography,
        spacing,
        shadows,
        borders
    };
};

/**
 * Classe helper para aplicar múltiplos tokens rapidamente
 */
export class TokenStyles {
    static card(customBg?: string) {
        return {
            backgroundColor: customBg || colors.background.card,
            borderRadius: borders.radius.lg,
            padding: spacing[4],
            border: `1px solid ${colors.background.lighter}`,
            boxShadow: shadows.lg
        };
    }

    static glassmorphism() {
        return {
            background: `${colors.background.card}cc`, // com alpha
            backdropFilter: 'blur(20px)',
            border: `1px solid ${colors.background.lighter}`,
            borderRadius: borders.radius.xl,
            boxShadow: shadows.xl
        };
    }

    static primaryButton() {
        return {
            backgroundColor: colors.brand.primary,
            color: colors.text.primary,
            padding: `${spacing[2]} ${spacing[4]}`,
            borderRadius: borders.radius.md,
            fontWeight: typography.fontWeight.bold,
            fontSize: typography.fontSize.sm,
            boxShadow: shadows.glow.primary,
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
        };
    }

    static secondaryButton() {
        return {
            backgroundColor: 'transparent',
            color: colors.text.secondary,
            padding: `${spacing[2]} ${spacing[3]}`,
            borderRadius: borders.radius.md,
            fontWeight: typography.fontWeight.bold,
            fontSize: typography.fontSize.sm,
            border: `1px solid ${colors.background.lighter}`,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
        };
    }

    static heading(size: 'xl' | 'lg' | 'md' = 'xl') {
        const sizeMap = {
            xl: typography.fontSize['3xl'],
            lg: typography.fontSize.xl,
            md: typography.fontSize.lg
        };

        return {
            fontSize: sizeMap[size],
            fontWeight: typography.fontWeight.bold,
            color: colors.text.primary,
            letterSpacing: typography.letterSpacing.tight,
            lineHeight: typography.lineHeight.tight
        };
    }

    static body(variant: 'primary' | 'secondary' = 'primary') {
        return {
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.normal,
            color: variant === 'primary' ? colors.text.primary : colors.text.secondary,
            lineHeight: typography.lineHeight.relaxed
        };
    }
}
