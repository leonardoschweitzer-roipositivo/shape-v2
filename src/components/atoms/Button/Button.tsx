/**
 * Button - Atom Component
 * 
 * Botão padronizado com variantes do VITRU IA.
 * @see docs/specs/design-system.md
 */

import React from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'status'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Variante visual do botão */
    variant?: ButtonVariant
    /** Tamanho do botão */
    size?: ButtonSize
    /** Ícone à esquerda */
    leftIcon?: React.ReactNode
    /** Ícone à direita */
    rightIcon?: React.ReactNode
    children: React.ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-primary hover:bg-primary/90 text-[#0A0F1C] font-bold shadow-[0_0_15px_rgba(0,201,167,0.3)]',
    secondary: 'bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/5 rounded-full',
    status: 'border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 font-bold uppercase tracking-wide',
}

const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
}

/**
 * Botão com variantes (primary, secondary, ghost, status)
 * 
 * @example
 * <Button variant="primary" leftIcon={<Camera size={18} />}>
 *   Primary Action
 * </Button>
 */
export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    leftIcon,
    rightIcon,
    children,
    className = '',
    ...props
}) => (
    <button
        className={`
      flex items-center justify-center gap-2 rounded-lg transition-all
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${className}
    `}
        {...props}
    >
        {leftIcon}
        {children}
        {rightIcon}
    </button>
)

export default Button
