/**
 * Tokens de Tipografia - SHAPE-V Design System
 * 
 * Fontes, tamanhos e estilos de texto centralizados.
 * @see docs/specs/design-system.md
 */

export const typography = {
    // === FONT FAMILIES ===
    fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'Menlo', 'Monaco', 'monospace'],
    },

    // === FONT SIZES ===
    fontSize: {
        xs: '0.75rem',     // 12px
        sm: '0.875rem',    // 14px
        base: '1rem',      // 16px
        lg: '1.125rem',    // 18px
        xl: '1.25rem',     // 20px
        '2xl': '1.5rem',   // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem',  // 36px
        '5xl': '3rem',     // 48px
    },

    // === FONT WEIGHTS ===
    fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },

    // === LINE HEIGHTS ===
    lineHeight: {
        none: '1',
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2',
    },

    // === LETTER SPACING ===
    letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
    },
} as const

// === TEXT STYLES COMPOSTOS ===
export const textStyles = {
    // Headings
    h1: {
        fontSize: typography.fontSize['5xl'],
        fontWeight: typography.fontWeight.bold,
        lineHeight: typography.lineHeight.tight,
        letterSpacing: typography.letterSpacing.tight,
    },
    h2: {
        fontSize: typography.fontSize['4xl'],
        fontWeight: typography.fontWeight.bold,
        lineHeight: typography.lineHeight.tight,
        letterSpacing: typography.letterSpacing.tight,
    },
    h3: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.bold,
        lineHeight: typography.lineHeight.snug,
    },
    h4: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        lineHeight: typography.lineHeight.snug,
    },

    // Body
    bodyLarge: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.normal,
        lineHeight: typography.lineHeight.relaxed,
    },
    body: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.normal,
        lineHeight: typography.lineHeight.normal,
    },
    bodySmall: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.normal,
        lineHeight: typography.lineHeight.normal,
    },

    // Labels
    label: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.bold,
        letterSpacing: typography.letterSpacing.widest,
        textTransform: 'uppercase' as const,
    },
    caption: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.normal,
        lineHeight: typography.lineHeight.normal,
    },

    // Numbers (para medidas)
    number: {
        fontSize: typography.fontSize['3xl'],
        fontWeight: typography.fontWeight.bold,
        fontFamily: typography.fontFamily.sans,
    },
    numberMono: {
        fontSize: typography.fontSize['3xl'],
        fontWeight: typography.fontWeight.bold,
        fontFamily: typography.fontFamily.mono,
    },
    numberSmall: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        fontFamily: typography.fontFamily.mono,
    },
} as const
