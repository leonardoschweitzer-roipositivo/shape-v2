/**
 * ThemeSwitcher — Seletor de Tema para GOD
 * 
 * Permite ao usuário GOD trocar o tema global da aplicação.
 * O tema selecionado afeta TODOS os usuários via Supabase app_settings.
 * 
 * @example
 * <ThemeSwitcher currentThemeId="vitru-original" onThemeChange={handleThemeChange} />
 */

import React, { useState, useCallback } from 'react'
import { Palette, Check, Monitor } from 'lucide-react'
import {
    THEME_PRESETS,
    applyTheme,
    type ThemeId,
    type ThemePreset,
} from '@/config/themes'

// ============================================
// TYPES
// ============================================

interface ThemeSwitcherProps {
    currentThemeId: ThemeId
    onThemeChange: (themeId: ThemeId) => Promise<void> | void
}

// ============================================
// SUB-COMPONENTS
// ============================================

interface ThemeCardProps {
    preset: ThemePreset
    isActive: boolean
    onSelect: () => void
}

const ThemeCard: React.FC<ThemeCardProps> = ({ preset, isActive, onSelect }) => {
    const { colors } = preset

    return (
        <button
            onClick={onSelect}
            className={`relative w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left group ${isActive
                    ? 'border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                    : 'border-white/10 hover:border-white/20 hover:scale-[1.01]'
                }`}
            style={{ backgroundColor: 'var(--bg-card)' }}
        >
            {/* Active indicator */}
            {isActive && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <Check size={14} className="text-black" />
                </div>
            )}

            {/* Theme Preview */}
            <div className="mb-3">
                <div
                    className="w-full h-20 rounded-xl overflow-hidden border border-white/5 relative"
                    style={{ backgroundColor: colors['--bg-primary'] }}
                >
                    {/* Mini card preview */}
                    <div
                        className="absolute bottom-2 left-2 right-2 h-8 rounded-lg flex items-center gap-2 px-3"
                        style={{
                            backgroundColor: colors['--bg-card'],
                            border: `1px solid ${colors['--bg-card-border']}`,
                        }}
                    >
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: colors['--color-accent'] }}
                        />
                        <div
                            className="h-2 w-12 rounded-full"
                            style={{ backgroundColor: colors['--text-muted'] }}
                        />
                        <div
                            className="h-2 w-6 rounded-full ml-auto"
                            style={{ backgroundColor: colors['--color-accent'] }}
                        />
                    </div>

                    {/* Top bar preview */}
                    <div className="absolute top-2 left-2 flex items-center gap-2">
                        <div
                            className="h-2.5 w-16 rounded-full"
                            style={{ backgroundColor: colors['--text-primary'], opacity: 0.9 }}
                        />
                        <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: colors['--color-secondary'] }}
                        />
                    </div>
                </div>
            </div>

            {/* Theme Info */}
            <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{preset.emoji}</span>
                <h4 className="font-semibold text-white text-sm">{preset.name}</h4>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{preset.description}</p>

            {/* Color Swatches */}
            <div className="flex gap-1.5 mt-3">
                {[
                    colors['--color-accent'],
                    colors['--color-secondary'],
                    colors['--bg-primary'],
                    colors['--bg-card'],
                ].map((color, i) => (
                    <div
                        key={i}
                        className="w-5 h-5 rounded-full border border-white/10"
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>
        </button>
    )
}

// ============================================
// MAIN COMPONENT
// ============================================

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
    currentThemeId,
    onThemeChange,
}) => {
    const [saving, setSaving] = useState(false)
    const [previewId, setPreviewId] = useState<ThemeId | null>(null)

    const activeId = previewId ?? currentThemeId

    const handleSelect = useCallback(async (themeId: ThemeId) => {
        // Instant visual preview
        applyTheme(themeId)
        setPreviewId(themeId)

        // Persist
        setSaving(true)
        try {
            await onThemeChange(themeId)
            setPreviewId(null)
        } catch {
            // Revert on error
            applyTheme(currentThemeId)
            setPreviewId(null)
        } finally {
            setSaving(false)
        }
    }, [currentThemeId, onThemeChange])

    const themeEntries = Object.entries(THEME_PRESETS) as [ThemeId, ThemePreset][]

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Palette size={20} className="text-primary" />
                </div>
                <div>
                    <h3 className="font-semibold text-white flex items-center gap-2">
                        Tema Global
                        {saving && (
                            <span className="text-xs text-primary animate-pulse">Salvando...</span>
                        )}
                    </h3>
                    <p className="text-xs text-gray-500">
                        Altera as cores de toda a aplicação para todos os usuários
                    </p>
                </div>
            </div>

            {/* Theme Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {themeEntries.map(([id, preset]) => (
                    <ThemeCard
                        key={id}
                        preset={preset}
                        isActive={activeId === id}
                        onSelect={() => handleSelect(id)}
                    />
                ))}
            </div>

            {/* Info */}
            <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 border border-primary/10 rounded-xl">
                <Monitor size={14} className="text-primary shrink-0" />
                <p className="text-xs text-gray-400">
                    A mudança é aplicada <strong className="text-white">globalmente</strong> — todos os
                    portais (Atleta, Personal, Dashboard) usarão o tema selecionado.
                </p>
            </div>
        </div>
    )
}
