/**
 * Tokens de Cores - VITRU IA Design System
 * 
 * Paleta de cores centralizada para toda a aplicação.
 * Cores de tema usam CSS variables para permitir theming dinâmico via GOD.
 * Cores semânticas (status) são fixas em todos os temas.
 * 
 * @see src/config/themes.ts — Presets de tema
 * @see index.html — CSS variables definidas em :root
 */

export const colors = {
    // === BRAND (Dynamic — mudam com tema) ===
    brand: {
        /** Ações principais, CTAs, progresso positivo */
        primary: 'var(--color-accent)',
        /** Gradientes, acentos secundários, badges PRO */
        secondary: 'var(--color-secondary)',
    },

    // === SEMANTIC (Fixed — iguais em todos os temas) ===
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

    // === BACKGROUND (Dynamic — mudam com tema) ===
    background: {
        /** Fundo principal da aplicação */
        dark: 'var(--bg-primary)',
        /** Painéis, cards, elementos elevados */
        card: 'var(--bg-card)',
        /** Glassmorphism overlay */
        glass: 'var(--bg-card-alpha)',
        /** Backdrop de modais */
        backdrop: 'var(--bg-backdrop)',
        /** Elementos elevados, hover */
        raised: 'var(--bg-surface-raised)',
    },

    // === TEXT (Dynamic — mudam com tema) ===
    text: {
        /** Títulos, valores principais */
        primary: 'var(--text-primary)',
        /** Texto de corpo, parágrafos */
        secondary: 'var(--text-secondary)',
        /** Legendas, descrições secundárias */
        muted: 'var(--text-muted)',
        /** Labels, informações de suporte */
        disabled: 'var(--text-disabled)',
    },

    // === PROPORTIONS (Fixed — específico VITRU IA) ===
    proportions: {
        /** Dourado - Golden Ratio */
        golden: '#FFD700',
        /** Roxo - Classic Physique */
        classic: '#7C3AED',
        /** Azul - Men's Physique */
        physique: '#3b82f6',
    },

    // === SCALE LEVELS (Fixed) ===
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

    // === ASYMMETRY LEVELS (Fixed) ===
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
