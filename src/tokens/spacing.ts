/**
 * Tokens de Espaçamento - VITRU IA Design System
 * 
 * Sistema de espaçamento baseado em múltiplos de 4px.
 * @see docs/specs/design-system.md
 */

export const spacing = {
    // === BASE SCALE (4px) ===
    px: '1px',
    0: '0',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px

    // === SEMANTIC SPACING ===
    section: '4rem',       // Entre seções
    card: '1.5rem',        // Padding de cards
    input: '0.75rem',      // Padding de inputs

    // === GAPS ===
    gap: {
        xs: '0.5rem',   // 8px
        sm: '0.75rem',  // 12px
        md: '1rem',     // 16px
        lg: '1.5rem',   // 24px
        xl: '2rem',     // 32px
        '2xl': '3rem',  // 48px
    },
} as const

// Type inference
export type Spacing = typeof spacing
