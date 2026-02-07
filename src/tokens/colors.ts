/**
 * Tokens de Cores - SHAPE-V Design System
 * 
 * Paleta de cores centralizada para toda a aplicação.
 * @see docs/specs/design-system.md
 */

export const colors = {
    // === BRAND ===
    brand: {
        /** #00C9A7 - Ações principais, CTAs, progresso positivo */
        primary: '#00C9A7',
        /** #7C3AED - Gradientes, acentos secundários, badges PRO */
        secondary: '#7C3AED',
    },

    // === SEMANTIC ===
    semantic: {
        /** Verde - Sucesso, ganhos, métricas positivas */
        success: '#22c55e',
        /** Amarelo - Atenção, warning */
        warning: '#eab308',
        /** Vermelho - Erro, assimetria alta, métricas negativas */
        error: '#ef4444',
        /** Laranja - Assimetria moderada */
        orange: '#f97316',
        /** Azul - Informativo, status neutro */
        info: '#3b82f6',
    },

    // === BACKGROUND (Dark Theme) ===
    background: {
        /** #0A0F1C - Fundo principal da aplicação */
        dark: '#0A0F1C',
        /** #131B2C - Painéis, cards, elementos elevados */
        card: '#131B2C',
        /** Glassmorphism overlay */
        glass: 'rgba(255, 255, 255, 0.05)',
    },

    // === TEXT ===
    text: {
        /** Títulos, valores principais */
        primary: '#FFFFFF',
        /** Texto de corpo, parágrafos */
        secondary: '#D1D5DB',
        /** Legendas, descrições secundárias */
        muted: '#9CA3AF',
        /** Labels, informações de suporte */
        disabled: '#6B7280',
    },

    // === PROPORTIONS (específico SHAPE-V) ===
    proportions: {
        /** Dourado - Golden Ratio */
        golden: '#FFD700',
        /** Roxo - Classic Physique */
        classic: '#7C3AED',
        /** Azul - Men's Physique */
        physique: '#3b82f6',
    },

    // === SCALE LEVELS ===
    scale: {
        /** Bloco < 1.20 */
        bloco: '#6B7280',
        /** Normal 1.20-1.35 */
        normal: '#3b82f6',
        /** Atlético 1.35-1.50 */
        atletico: '#22c55e',
        /** Estético 1.50-1.618 */
        estetico: '#eab308',
        /** Freak > 1.618 */
        freak: '#ef4444',
    },

    // === ASYMMETRY LEVELS ===
    asymmetry: {
        /** < 3% - Simétrico */
        symmetrical: '#22c55e',
        /** 3-5% - Moderado */
        moderate: '#eab308',
        /** > 5% - Alta assimetria */
        high: '#ef4444',
    },
} as const

// Type inference
export type Colors = typeof colors
export type ColorKey = keyof typeof colors
