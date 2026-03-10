/**
 * EditarTreinoScreen — Tela de edição de treinos (Mobile)
 *
 * Reutiliza SecaoTreinosEditavel com isEditing=true.
 * Salva via salvarPlanoTreino (insere novo registro no histórico).
 */

import React, { useState } from 'react'
import { ChevronLeft, Save, Loader2, Check } from 'lucide-react'
import { SecaoTreinosEditavel } from '@/components/organisms/SecaoTreinosEditavel/SecaoTreinosEditavel'
import { salvarPlanoTreino } from '@/services/calculations/treino'
import type { PlanoTreino, TreinoDetalhado } from '@/services/calculations/treino'

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface EditarTreinoScreenProps {
    atletaId: string
    personalId: string
    planoTreino: PlanoTreino
    onVoltar: () => void
    onSalvo: () => void
}

type SaveStatus = 'idle' | 'saving' | 'success' | 'error'

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

export function EditarTreinoScreen({
    atletaId,
    personalId,
    planoTreino,
    onVoltar,
    onSalvo,
}: EditarTreinoScreenProps) {
    const [treinos, setTreinos] = useState<TreinoDetalhado[]>(planoTreino.treinos)
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')

    const handleSalvar = async () => {
        if (saveStatus === 'saving') return
        setSaveStatus('saving')

        const planoAtualizado: PlanoTreino = {
            ...planoTreino,
            treinos,
        }

        const result = await salvarPlanoTreino(atletaId, personalId, planoAtualizado)

        if (result) {
            setSaveStatus('success')
            setTimeout(() => {
                onSalvo()
            }, 1200)
        } else {
            setSaveStatus('error')
            setTimeout(() => setSaveStatus('idle'), 3000)
        }
    }

    return (
        <div className="min-h-screen bg-background-dark pb-24 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-indigo-500/10 via-indigo-900/5 to-transparent pointer-events-none" />

            {/* Header Fixo */}
            <div className="sticky top-0 z-30 bg-background-dark/90 backdrop-blur-md border-b border-white/5">
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onVoltar}
                            className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 active:scale-95 transition-transform"
                        >
                            <ChevronLeft size={20} className="text-zinc-400" />
                        </button>
                        <div>
                            <h1 className="text-white text-lg font-black tracking-tight uppercase">Editar Treinos</h1>
                            <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest">
                                {treinos.length} treino{treinos.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>

                    {/* Botão Salvar */}
                    <button
                        onClick={handleSalvar}
                        disabled={saveStatus === 'saving' || saveStatus === 'success'}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 ${saveStatus === 'success'
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                : saveStatus === 'error'
                                    ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                                    : saveStatus === 'saving'
                                        ? 'bg-zinc-700 text-zinc-400 cursor-wait'
                                        : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                            }`}
                    >
                        {saveStatus === 'saving' && <Loader2 size={12} className="animate-spin" />}
                        {saveStatus === 'success' && <Check size={12} strokeWidth={3} />}
                        {saveStatus === 'error' && '❌'}
                        {saveStatus === 'idle' && <Save size={12} />}
                        {saveStatus === 'saving' ? 'Salvando...' :
                            saveStatus === 'success' ? 'Salvo!' :
                                saveStatus === 'error' ? 'Erro' : 'Salvar'}
                    </button>
                </div>
            </div>

            {/* Conteúdo Editável */}
            <div className="px-4 pt-4 relative z-10">
                <SecaoTreinosEditavel
                    treinos={treinos}
                    isEditing={true}
                    onUpdateTreinos={setTreinos}
                />
            </div>
        </div>
    )
}
