/**
 * Tokens de Animação - VITRU IA Design System
 * 
 * Durações, easings e transições padronizadas.
 * @see docs/specs/design-system.md
 */

export const animations = {
    // === DURATIONS ===
    duration: {
        instant: '0ms',
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
        slower: '700ms',
    },

    // === EASING ===
    easing: {
        linear: 'linear',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },

    // === TRANSITIONS COMPOSTAS ===
    transition: {
        fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
        normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
        slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
        colors: 'color 150ms, background-color 150ms, border-color 150ms',
        all: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    },

    // === KEYFRAMES (para usar com CSS-in-JS) ===
    keyframes: {
        fadeIn: {
            from: { opacity: 0 },
            to: { opacity: 1 },
        },
        fadeOut: {
            from: { opacity: 1 },
            to: { opacity: 0 },
        },
        slideUp: {
            from: { transform: 'translateY(10px)', opacity: 0 },
            to: { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
            from: { transform: 'translateY(-10px)', opacity: 0 },
            to: { transform: 'translateY(0)', opacity: 1 },
        },
        pulse: {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.5 },
        },
        scoreReveal: {
            from: { transform: 'scale(0.8)', opacity: 0 },
            to: { transform: 'scale(1)', opacity: 1 },
        },
        spin: {
            from: { transform: 'rotate(0deg)' },
            to: { transform: 'rotate(360deg)' },
        },
    },
} as const

// Type inference
export type Animations = typeof animations
