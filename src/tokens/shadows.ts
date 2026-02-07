/**
 * Tokens de Sombras - SHAPE-V Design System
 * 
 * Sombras e efeitos de glow para dark theme.
 * @see docs/specs/design-system.md
 */

export const shadows = {
    // === BASE SHADOWS ===
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',

    // === GLOW EFFECTS (para dark theme) ===
    glow: {
        /** Botões primários, destaques teal */
        primary: '0 0 15px rgba(0, 201, 167, 0.3)',
        /** Elementos purple */
        secondary: '0 0 20px rgba(124, 58, 237, 0.3)',
        /** Badges de sucesso */
        success: '0 0 10px rgba(74, 222, 128, 0.1)',
        /** Alertas de erro */
        error: '0 0 10px rgba(239, 68, 68, 0.2)',
    },

    // === COLORED SHADOWS (para cards de score) ===
    colored: {
        golden: '0 4px 14px 0 rgb(255 215 0 / 0.3)',
        success: '0 4px 14px 0 rgb(16 185 129 / 0.3)',
        warning: '0 4px 14px 0 rgb(245 158 11 / 0.3)',
        error: '0 4px 14px 0 rgb(239 68 68 / 0.3)',
        purple: '0 4px 14px 0 rgb(124 58 237 / 0.3)',
    },
} as const

// Type inference
export type Shadows = typeof shadows
