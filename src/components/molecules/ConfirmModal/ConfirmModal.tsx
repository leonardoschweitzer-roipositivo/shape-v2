import React from 'react'
import { AlertTriangle, Trash2 } from 'lucide-react'

export type ConfirmModalVariant = 'danger' | 'warning'

interface ConfirmModalProps {
    open: boolean
    title: string
    message: React.ReactNode
    confirmLabel?: string
    cancelLabel?: string
    variant?: ConfirmModalVariant
    loading?: boolean
    onConfirm: () => void
    onCancel: () => void
}

const VARIANT_STYLES: Record<ConfirmModalVariant, {
    iconBg: string
    iconColor: string
    confirmBg: string
    confirmShadow: string
    Icon: React.ComponentType<{ size?: number; className?: string }>
}> = {
    danger: {
        iconBg: 'bg-red-500/20',
        iconColor: 'text-red-400',
        confirmBg: 'bg-red-500 hover:bg-red-600',
        confirmShadow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
        Icon: Trash2,
    },
    warning: {
        iconBg: 'bg-amber-500/20',
        iconColor: 'text-amber-400',
        confirmBg: 'bg-amber-500 hover:bg-amber-600',
        confirmShadow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
        Icon: AlertTriangle,
    },
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    open,
    title,
    message,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    variant = 'danger',
    loading = false,
    onConfirm,
    onCancel,
}) => {
    if (!open) return null

    const styles = VARIANT_STYLES[variant]
    const Icon = styles.Icon

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => !loading && onCancel()}
        >
            <div
                className="bg-surface border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col items-center text-center gap-4">
                    <div className={`w-16 h-16 rounded-full ${styles.iconBg} flex items-center justify-center`}>
                        <Icon size={28} className={styles.iconColor} />
                    </div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-wide">{title}</h3>
                    <div className="text-gray-400 text-sm leading-relaxed">{message}</div>
                    <div className="flex items-center gap-3 w-full mt-4">
                        <button
                            onClick={onCancel}
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50"
                        >
                            {cancelLabel}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className={`flex-1 px-6 py-3 ${styles.confirmBg} text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${styles.confirmShadow} disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {loading ? 'Aguarde...' : confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
