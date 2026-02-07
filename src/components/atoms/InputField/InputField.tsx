/**
 * InputField - Atom Component
 * 
 * Campo de entrada padronizado para o VITRU IA.
 * @see docs/specs/design-system.md
 */

import React from 'react'

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    /** Label exibido acima do input */
    label: string
    /** Unidade de medida (ex: cm, kg) */
    unit?: string
    /** Placeholder text */
    placeholder?: string
}

/**
 * Campo de entrada com label e unidade
 * 
 * @example
 * <InputField label="Altura" unit="cm" placeholder="180" />
 */
export const InputField: React.FC<InputFieldProps> = ({
    label,
    unit,
    placeholder = '00.0',
    className,
    ...props
}) => (
    <div className={`flex flex-col gap-1.5 ${className || ''}`}>
        <label className="text-xs text-gray-400 font-medium ml-1">{label}</label>
        <div className="relative group">
            <input
                type="number"
                className="w-full bg-[#0A0F1C] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors text-sm font-mono"
                placeholder={placeholder}
                {...props}
            />
            {unit && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 text-xs font-bold pointer-events-none">
                    {unit}
                </span>
            )}
        </div>
    </div>
)

export default InputField
