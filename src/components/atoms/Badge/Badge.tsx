/**
 * Badge - Atom Component
 * 
 * Badge/tag para status, labels e indicadores.
 * @see docs/specs/design-system.md
 */

import React from 'react'

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary' | 'outline'
export type BadgeSize = 'xs' | 'sm' | 'md'

export interface BadgeProps {
    /** Variante visual */
    variant?: BadgeVariant
    /** Tamanho */
    size?: BadgeSize
    children: React.ReactNode
    className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
    success: 'bg-green-500/10 text-green-400 border-green-500/20',
    warning: 'bg-orange-400/10 text-orange-400 border-orange-400/30',
    error: 'bg-red-400/10 text-red-400 border-red-400/30',
    info: 'bg-blue-400/10 text-blue-400 border-blue-400/30',
    primary: 'bg-primary text-[#0A0F1C]',
    secondary: 'bg-secondary/20 text-secondary border-secondary/20',
    outline: 'bg-white/5 border-white/10 text-primary',
}

const sizeClasses: Record<BadgeSize, string> = {
    xs: 'px-1.5 py-0.5 text-[9px]',
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
}

/**
 * Badge para indicadores, status e labels
 * 
 * @example
 * <Badge variant="success">+5% Growth</Badge>
 * <Badge variant="warning" size="sm">Warning</Badge>
 */
export const Badge: React.FC<BadgeProps> = ({
    variant = 'primary',
    size = 'sm',
    children,
    className = '',
}) => (
    <span
        className={`
      inline-flex items-center justify-center rounded font-bold uppercase tracking-wider border
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${className}
    `}
    >
        {children}
    </span>
)

export default Badge
