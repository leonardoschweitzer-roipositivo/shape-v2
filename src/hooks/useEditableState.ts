/**
 * useEditableState — Hook para gerenciar modo de edição inline
 *
 * Encapsula:
 * - Toggle de modo edição
 * - Snapshot do estado original (para descartar alterações)
 * - Detecção de mudanças (hasChanges)
 * - Commit e discard
 *
 * @example
 * const { isEditing, startEditing, cancelEditing, commitEditing, editData, updateField } = useEditableState(plano);
 */

import { useState, useCallback, useRef } from 'react';

interface UseEditableStateReturn<T> {
    /** Modo de edição ativo */
    isEditing: boolean;
    /** Dados sendo editados (ou o original se não estiver editando) */
    editData: T;
    /** Indica se houve alguma alteração em relação ao snapshot */
    hasChanges: boolean;
    /** Ativa modo de edição e salva snapshot */
    startEditing: () => void;
    /** Descarta alterações e restaura snapshot */
    cancelEditing: () => void;
    /** Confirma alterações — retorna os dados editados e sai do modo edição */
    commitEditing: () => T;
    /** Atualiza os dados de edição com uma função de update */
    updateEditData: (updater: (prev: T) => T) => void;
    /** Substitui os dados de edição diretamente */
    setEditData: (data: T) => void;
}

/**
 * Hook genérico para gerenciar estado editável com snapshot/rollback.
 *
 * @param data - Dados fonte (read-only quando não editando)
 * @param onCommit - Callback opcional chamado ao confirmar edição
 */
export function useEditableState<T>(
    data: T,
    onCommit?: (edited: T) => void,
): UseEditableStateReturn<T> {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<T>(data);
    const snapshotRef = useRef<T>(data);

    const startEditing = useCallback(() => {
        // Deep clone para snapshot (JSON roundtrip é suficiente para nossos dados serializáveis)
        const snapshot = JSON.parse(JSON.stringify(data)) as T;
        snapshotRef.current = snapshot;
        setEditData(JSON.parse(JSON.stringify(data)) as T);
        setIsEditing(true);
    }, [data]);

    const cancelEditing = useCallback(() => {
        setEditData(snapshotRef.current);
        setIsEditing(false);
    }, []);

    const commitEditing = useCallback((): T => {
        setIsEditing(false);
        onCommit?.(editData);
        return editData;
    }, [editData, onCommit]);

    const updateEditData = useCallback((updater: (prev: T) => T) => {
        setEditData(prev => updater(prev));
    }, []);

    const hasChanges = isEditing && JSON.stringify(editData) !== JSON.stringify(snapshotRef.current);

    return {
        isEditing,
        editData: isEditing ? editData : data,
        hasChanges,
        startEditing,
        cancelEditing,
        commitEditing,
        updateEditData,
        setEditData,
    };
}
