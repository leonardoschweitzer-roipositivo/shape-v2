/**
 * Temas do Design System — VITRU IA
 * 
 * Define os 3 presets de tema que o usuário GOD pode escolher.
 * Cada tema mapeia CSS variables usadas por toda a aplicação.
 * O tema é persistido no Supabase (app_settings) e afeta todos os usuários.
 * 
 * @see index.html — CSS variables definidas em :root
 * @see src/tokens/colors.ts — Objeto hierárquico de cores
 */

// ============================================
// TYPES
// ============================================

export interface ThemeColors {
    /** Fundo principal da aplicação */
    '--bg-primary': string
    /** Fundo de cards/painéis */
    '--bg-card': string
    /** Fundo de cards com transparência (glassmorphism) */
    '--bg-card-alpha': string
    /** Borda de cards */
    '--bg-card-border': string
    /** Fundo backdrop (modais) */
    '--bg-backdrop': string
    /** Surface elevada (hover, raised) */
    '--bg-surface-raised': string
    /** Cor de destaque principal (CTAs, links, accent) */
    '--color-accent': string
    /** Cor secundária (badges, gradientes) */
    '--color-secondary': string
    /** Texto principal */
    '--text-primary': string
    /** Texto secundário/body */
    '--text-secondary': string
    /** Texto muted (labels, legendas) */
    '--text-muted': string
    /** Texto disabled */
    '--text-disabled': string
}

export interface ThemePreset {
    id: string
    name: string
    emoji: string
    description: string
    colors: ThemeColors
}

export type ThemeId = 'shape-pro' | 'vitru-original' | 'black-red' | 'black-yellow'

// ============================================
// PRESETS
// ============================================

export const THEME_PRESETS: Record<ThemeId, ThemePreset> = {
    'shape-pro': {
        id: 'shape-pro',
        name: 'Shape Pro',
        emoji: '💎',
        description: 'Fundo azul profundo + Teal vibrante — referência do Portal do Aluno',
        colors: {
            '--bg-primary': '#0A0F1C',
            '--bg-card': '#131B2C',
            '--bg-card-alpha': 'rgba(19, 27, 44, 0.7)',
            '--bg-card-border': 'rgba(255, 255, 255, 0.08)',
            '--bg-backdrop': '#050810',
            '--bg-surface-raised': '#1F2937',
            '--color-accent': '#00C9A7',
            '--color-secondary': '#7C3AED',
            '--text-primary': '#FFFFFF',
            '--text-secondary': '#D1D5DB',
            '--text-muted': '#9CA3AF',
            '--text-disabled': '#6B7280',
        },
    },

    'vitru-original': {
        id: 'vitru-original',
        name: 'VITRU Original',
        emoji: '🟢',
        description: 'Paleta clássica com tons mais quentes — estilo dashboard original',
        colors: {
            '--bg-primary': '#0E1629',
            '--bg-card': '#162033',
            '--bg-card-alpha': 'rgba(22, 32, 51, 0.75)',
            '--bg-card-border': 'rgba(255, 255, 255, 0.07)',
            '--bg-backdrop': '#070B14',
            '--bg-surface-raised': '#1E2A3F',
            '--color-accent': '#10B981',
            '--color-secondary': '#8B5CF6',
            '--text-primary': '#F9FAFB',
            '--text-secondary': '#D1D5DB',
            '--text-muted': '#9CA3AF',
            '--text-disabled': '#6B7280',
        },
    },

    'black-red': {
        id: 'black-red',
        name: 'Black + Vermelho',
        emoji: '🔴',
        description: 'Preto fosco com vermelho para títulos e destaques',
        colors: {
            '--bg-primary': '#0A0A0A',
            '--bg-card': '#141414',
            '--bg-card-alpha': 'rgba(20, 20, 20, 0.85)',
            '--bg-card-border': 'rgba(255, 255, 255, 0.06)',
            '--bg-backdrop': '#030303',
            '--bg-surface-raised': '#1E1E1E',
            '--color-accent': '#EF4444',
            '--color-secondary': '#DC2626',
            '--text-primary': '#FFFFFF',
            '--text-secondary': '#D4D4D4',
            '--text-muted': '#A3A3A3',
            '--text-disabled': '#737373',
        },
    },

    'black-yellow': {
        id: 'black-yellow',
        name: 'Black + Amarelo',
        emoji: '🟡',
        description: 'Preto fosco com amarelo para títulos e destaques',
        colors: {
            '--bg-primary': '#0A0A0A',
            '--bg-card': '#141414',
            '--bg-card-alpha': 'rgba(20, 20, 20, 0.85)',
            '--bg-card-border': 'rgba(255, 255, 255, 0.06)',
            '--bg-backdrop': '#030303',
            '--bg-surface-raised': '#1E1E1E',
            '--color-accent': '#EAB308',
            '--color-secondary': '#CA8A04',
            '--text-primary': '#FFFFFF',
            '--text-secondary': '#D4D4D4',
            '--text-muted': '#A3A3A3',
            '--text-disabled': '#737373',
        },
    },
} as const

// ============================================
// HELPERS
// ============================================

/** Tema padrão da aplicação */
export const DEFAULT_THEME_ID: ThemeId = 'shape-pro'

/**
 * Aplica um tema ao document via CSS variables.
 * Todas as CSS variables são setadas no :root.
 */
export function applyTheme(themeId: ThemeId): void {
    const preset = THEME_PRESETS[themeId]
    if (!preset) return

    const root = document.documentElement
    const entries = Object.entries(preset.colors) as [keyof ThemeColors, string][]

    for (const [varName, value] of entries) {
        root.style.setProperty(varName, value)
    }

    // Backward compatibility: map --color-accent to existing aliases
    root.style.setProperty('--color-primary', preset.colors['--color-accent'])
    root.style.setProperty('--color-gold', preset.colors['--color-accent'])

    // Update body background directly for instant visual feedback
    document.body.style.backgroundColor = preset.colors['--bg-primary']
}

/**
 * Retorna o tema ativo a partir do ID salvo. Fallback para default.
 */
export function getThemePreset(themeId: string | null | undefined): ThemePreset {
    if (themeId && themeId in THEME_PRESETS) {
        return THEME_PRESETS[themeId as ThemeId]
    }
    return THEME_PRESETS[DEFAULT_THEME_ID]
}
