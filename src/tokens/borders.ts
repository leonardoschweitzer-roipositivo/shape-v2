/**
 * Tokens de Bordas - VITRU IA Design System
 * 
 * Border radius e width padronizados.
 * @see docs/specs/design-system.md
 */

export const borders = {
    // === BORDER RADIUS ===
    radius: {
        none: '0',
        sm: '0.25rem',    // 4px
        md: '0.375rem',   // 6px
        lg: '0.5rem',     // 8px (rounded-lg)
        xl: '0.75rem',    // 12px
        '2xl': '1rem',    // 16px (rounded-2xl)
        '3xl': '1.5rem',  // 24px
        full: '9999px',   // Círculo
    },

    // === BORDER WIDTH ===
    width: {
        0: '0',
        1: '1px',
        2: '2px',
        4: '4px',
        8: '8px',
    },
} as const

// Type inference
export type Borders = typeof borders
