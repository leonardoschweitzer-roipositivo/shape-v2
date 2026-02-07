/**
 * GlassPanel - Atom Component
 * 
 * Container com efeito glassmorphism para dark theme.
 * @see docs/specs/design-system.md
 */

import React from 'react'

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    className?: string
    /** Ativa hover effect com borda primary */
    hoverEffect?: boolean
}

/**
 * Container glassmorphism padrão do VITRU IA
 * 
 * @example
 * <GlassPanel className="p-8 rounded-2xl">
 *   {children}
 * </GlassPanel>
 */
export const GlassPanel: React.FC<GlassPanelProps> = ({
    children,
    className = '',
    hoverEffect = true,
    ...props
}) => {
    const baseClasses = 'bg-[#131B2C]/70 backdrop-blur-md border border-white/10 transition-all duration-300'
    const hoverClasses = hoverEffect ? 'hover:border-primary/30 hover:bg-[#131B2C]/90' : ''

    return (
        <div className={`${baseClasses} ${hoverClasses} ${className}`} {...props}>
            {children}
        </div>
    )
}

export default GlassPanel
