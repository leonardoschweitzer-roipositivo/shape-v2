/**
 * EditableField — Campo que alterna entre display e input
 *
 * Variantes: text, number, select, textarea
 * Renderiza texto estático quando isEditing=false, input editável quando isEditing=true.
 */

import React from 'react';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface BaseEditableFieldProps {
    isEditing: boolean;
    label?: string;
    className?: string;
    displayClassName?: string;
    inputClassName?: string;
}

interface TextFieldProps extends BaseEditableFieldProps {
    type: 'text' | 'textarea';
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

interface NumberFieldProps extends BaseEditableFieldProps {
    type: 'number';
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    suffix?: string;
}

interface SelectFieldProps extends BaseEditableFieldProps {
    type: 'select';
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
}

type EditableFieldProps = TextFieldProps | NumberFieldProps | SelectFieldProps;

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

const baseInputClass =
    'bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all';

export const EditableField: React.FC<EditableFieldProps> = (props) => {
    const { isEditing, label, className = '' } = props;

    if (!isEditing) {
        // Display mode
        return (
            <span className={`${props.displayClassName || ''} ${className}`}>
                {props.type === 'number' && props.suffix
                    ? `${props.value}${props.suffix}`
                    : props.type === 'select'
                        ? props.options.find(o => o.value === props.value)?.label || props.value
                        : String(props.value)
                }
            </span>
        );
    }

    // Edit mode
    const inputCn = `${baseInputClass} ${props.inputClassName || ''} ${className}`;

    switch (props.type) {
        case 'number':
            return (
                <div className="inline-flex items-center gap-1">
                    {label && <span className="text-[10px] text-gray-500 uppercase mr-1">{label}</span>}
                    <input
                        type="number"
                        value={props.value}
                        onChange={(e) => props.onChange(Number(e.target.value))}
                        min={props.min}
                        max={props.max}
                        step={props.step ?? 1}
                        className={`${inputCn} w-20 text-center`}
                    />
                    {props.suffix && <span className="text-xs text-gray-500">{props.suffix}</span>}
                </div>
            );

        case 'select':
            return (
                <select
                    value={props.value}
                    onChange={(e) => props.onChange(e.target.value)}
                    className={`${inputCn} cursor-pointer`}
                >
                    {props.options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-surface text-white">
                            {opt.label}
                        </option>
                    ))}
                </select>
            );

        case 'textarea':
            return (
                <textarea
                    value={props.value}
                    onChange={(e) => props.onChange(e.target.value)}
                    placeholder={props.placeholder}
                    rows={3}
                    className={`${inputCn} w-full resize-y`}
                />
            );

        case 'text':
        default:
            return (
                <input
                    type="text"
                    value={props.value}
                    onChange={(e) => props.onChange(e.target.value)}
                    placeholder={props.placeholder}
                    className={`${inputCn} w-full`}
                />
            );
    }
};
