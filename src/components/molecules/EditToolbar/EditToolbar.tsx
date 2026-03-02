/**
 * EditToolbar — Barra de ações para modo de edição inline
 *
 * Aparece no topo de seções editáveis com botões:
 * - ✏️ Editar (quando não está editando)
 * - 💾 Salvar + ↩️ Descartar (quando está editando)
 */

import React from 'react';
import { Pencil, Save, Undo2, AlertCircle } from 'lucide-react';

interface EditToolbarProps {
    isEditing: boolean;
    hasChanges: boolean;
    onStartEditing: () => void;
    onSave: () => void;
    onDiscard: () => void;
    /** Esconde o botão editar quando em modo readOnly */
    readOnly?: boolean;
    /** Label customizado para o botão de salvar */
    saveLabel?: string;
}

export const EditToolbar: React.FC<EditToolbarProps> = ({
    isEditing,
    hasChanges,
    onStartEditing,
    onSave,
    onDiscard,
    readOnly = false,
    saveLabel = 'Salvar Alterações',
}) => {
    if (readOnly) return null;

    if (!isEditing) {
        return (
            <button
                onClick={onStartEditing}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-400 bg-white/5 border border-white/10 rounded-xl hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
            >
                <Pencil size={14} />
                Editar
            </button>
        );
    }

    return (
        <div className="flex items-center gap-3 animate-in fade-in duration-200">
            {hasChanges && (
                <span className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                    <AlertCircle size={12} />
                    Alterações não salvas
                </span>
            )}
            <button
                onClick={onDiscard}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-400 bg-white/5 border border-white/10 rounded-xl hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all"
            >
                <Undo2 size={14} />
                Descartar
            </button>
            <button
                onClick={onSave}
                disabled={!hasChanges}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#0A0F1C] bg-primary rounded-xl hover:shadow-[0_0_15px_rgba(0,201,167,0.3)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <Save size={14} />
                {saveLabel}
            </button>
        </div>
    );
};
