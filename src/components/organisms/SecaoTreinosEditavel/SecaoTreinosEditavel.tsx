/**
 * SecaoTreinosEditavel — Seção de Treinos Detalhados com edição inline
 *
 * Permite ao Personal:
 * - Editar nome, séries, reps, descanso e técnica de cada exercício
 * - Adicionar/remover exercícios dentro de um bloco
 * - Adicionar/remover treinos (letras)
 * - Reordenar exercícios com botões ▲/▼
 */

import React, { useState } from 'react';
import {
    BookOpen,
    Dumbbell,
    Clock,
    Plus,
    Trash2,
    ChevronUp,
    ChevronDown,
    GripVertical,
    Sparkles,
    Loader2,
} from 'lucide-react';
import type { TreinoDetalhado, BlocoTreino, Exercicio } from '@/services/calculations/treino';
import { EditableField } from '@/components/atoms/EditableField/EditableField';
import { BlocoPrescricaoSeries } from './BlocoPrescricaoSeries';
import { sugerirPrescricaoIA } from '@/services/prescricao/gerarViaIA';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface SecaoTreinosEditavelProps {
    treinos: TreinoDetalhado[];
    isEditing: boolean;
    onUpdateTreinos: (treinos: TreinoDetalhado[]) => void;
}

// ═══════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════

const TECNICAS_OPCOES = [
    { value: '', label: '— Nenhuma —' },
    { value: 'Drop-set', label: 'Drop-set' },
    { value: 'Rest-pause', label: 'Rest-pause' },
    { value: 'Bi-set', label: 'Bi-set' },
    { value: 'Tri-set', label: 'Tri-set' },
    { value: 'FST-7', label: 'FST-7' },
    { value: 'Myo-reps', label: 'Myo-reps' },
    { value: 'Cluster', label: 'Cluster' },
    { value: 'Pausa no pico', label: 'Pausa no pico' },
    { value: 'Excêntrico lento', label: 'Excêntrico lento' },
    { value: 'Isometria', label: 'Isometria' },
];

const DESCANSO_OPCOES = [
    { value: '30', label: '30s' },
    { value: '45', label: '45s' },
    { value: '60', label: '60s' },
    { value: '75', label: '75s' },
    { value: '90', label: '90s' },
    { value: '120', label: '120s' },
    { value: '150', label: '150s' },
    { value: '180', label: '180s' },
];

const PROXIMA_LETRA = (treinos: TreinoDetalhado[]): string => {
    const letras = treinos.map(t => t.letra);
    const alfabeto = 'ABCDEFGHIJ'.split('');
    return alfabeto.find(l => !letras.includes(l)) || String.fromCharCode(65 + treinos.length);
};

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

/** Gera um ID único simples */
const uid = (): string => `ex-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

/** Cria exercício vazio */
const criarExercicioVazio = (ordem: number): Exercicio => ({
    ordem,
    nome: '',
    series: 3,
    repeticoes: '10-12',
    descansoSegundos: 60,
    tecnica: undefined,
    observacao: undefined,
});

/** Recalcula total de séries de um bloco */
const recalcularSeriesTotalBloco = (bloco: BlocoTreino): BlocoTreino => ({
    ...bloco,
    seriesTotal: bloco.exercicios.reduce((sum, ex) => sum + ex.series, 0),
});

// ═══════════════════════════════════════════════════════════
// SUBCOMPONENTS
// ═══════════════════════════════════════════════════════════

/** Linha editável de exercício */
const ExercicioRow: React.FC<{
    ex: Exercicio;
    isEditing: boolean;
    onUpdate: (ex: Exercicio) => void;
    onRemove: () => void;
    onMoveUp: (() => void) | null;
    onMoveDown: (() => void) | null;
}> = ({ ex, isEditing, onUpdate, onRemove, onMoveUp, onMoveDown }) => {
    if (!isEditing) {
        // Modo display — quando há prescrição detalhada, mostra tabela série-a-série read-only
        if (ex.prescricaoSeries && ex.prescricaoSeries.length > 0) {
            return (
                <tr className="border-b border-white/[0.04]">
                    <td colSpan={6} className="p-0">
                        <div className="px-6 py-4">
                            <p className="font-bold text-gray-200 text-base leading-tight mb-2">
                                <span className="text-gray-600 font-mono text-sm mr-2">{ex.ordem}.</span>
                                {ex.nome}
                            </p>
                            <BlocoPrescricaoSeries ex={ex} onUpdate={onUpdate} readOnly />
                        </div>
                    </td>
                </tr>
            );
        }
        // Fallback — plano antigo sem prescrição detalhada
        return (
            <tr className="border-b border-white/[0.04] hover:bg-white/[0.01] transition-colors">
                <td className="px-6 py-5 text-gray-600 font-mono text-lg">{ex.ordem}</td>
                <td className="py-5">
                    <p className="font-bold text-gray-200 text-lg leading-tight">{ex.nome}</p>
                    {ex.observacao && <p className="text-xs text-primary mt-1 italic opacity-80">{ex.observacao}</p>}
                </td>
                <td className="py-5 text-center font-bold text-white text-xl">{ex.series}</td>
                <td className="py-5 text-center text-gray-400 font-semibold">{ex.repeticoes}</td>
                <td className="py-5 text-center text-gray-500 text-sm">{ex.descansoSegundos}s</td>
                <td className="px-6 py-5 text-right">
                    {ex.tecnica ? (
                        <span className="text-[10px] font-black bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded uppercase tracking-wider shadow-[0_0_10px_rgba(79,70,229,0.05)]">
                            {ex.tecnica}
                        </span>
                    ) : (
                        <span className="text-gray-700">—</span>
                    )}
                </td>
            </tr>
        );
    }

    // Modo edição — layout empilhado para mobile
    return (
        <tr className="border-b border-white/[0.04]">
            <td colSpan={6} className="p-0">
                <div className="px-2.5 py-3.5 space-y-2">
                    {/* Linha 1: Ordem + Nome + Obs + Ações */}
                    <div className="flex items-start gap-2">
                        {/* Order badge + Move */}
                        <div className="flex flex-col items-center gap-0.5 shrink-0">
                            <div className="w-6 h-6 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
                                <span className="text-indigo-400 font-black text-[10px]">{ex.ordem}</span>
                            </div>
                            <div className="flex gap-0">
                                {onMoveUp && (
                                    <button onClick={onMoveUp} className="text-zinc-600 hover:text-primary p-0.5 transition-colors">
                                        <ChevronUp size={9} />
                                    </button>
                                )}
                                {onMoveDown && (
                                    <button onClick={onMoveDown} className="text-zinc-600 hover:text-primary p-0.5 transition-colors">
                                        <ChevronDown size={9} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Nome (a descrição do exercício é gerada no portal do aluno pela IA) */}
                        <div className="flex-1 min-w-0">
                            <EditableField
                                type="text"
                                isEditing
                                value={ex.nome}
                                onChange={(v) => onUpdate({ ...ex, nome: v })}
                                placeholder="Nome do exercício"
                                inputClassName="!text-sm !py-2 !px-2 font-bold"
                            />
                        </div>

                        {/* Remove */}
                        <button
                            onClick={onRemove}
                            className="p-0.5 text-zinc-700 hover:text-red-400 hover:bg-red-500/10 rounded transition-all shrink-0"
                            title="Remover exercício"
                        >
                            <Trash2 size={10} />
                        </button>
                    </div>

                    {/* Toggle "Prescrição detalhada" */}
                    <div className="flex items-center gap-2 pl-5 pb-1">
                        <label className="flex items-center gap-2 text-xs text-zinc-400 font-bold uppercase tracking-wider cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={!!ex.prescricaoSeries && ex.prescricaoSeries.length > 0}
                                onChange={e => {
                                    if (e.target.checked) {
                                        onUpdate({ ...ex, prescricaoSeries: [], topSetKg: ex.topSetKg, topSetReps: ex.topSetReps })
                                    } else {
                                        onUpdate({ ...ex, prescricaoSeries: undefined })
                                    }
                                }}
                                className="w-4 h-4 accent-indigo-500"
                            />
                            Prescrição detalhada
                        </label>
                    </div>

                    {ex.prescricaoSeries !== undefined ? (
                        /* Modo prescrição detalhada */
                        <div className="pl-5">
                            <BlocoPrescricaoSeries ex={ex} onUpdate={onUpdate} />
                        </div>
                    ) : (
                        /* Modo legado: Séries, Reps, Descanso, Técnica */
                        <div className="grid grid-cols-4 gap-1 pl-5">
                            <div>
                                <label className="text-[7px] text-zinc-600 font-bold uppercase tracking-wider block mb-0.5">Séries</label>
                                <EditableField
                                    type="number"
                                    isEditing
                                    value={ex.series}
                                    onChange={(v) => onUpdate({ ...ex, series: v })}
                                    min={1}
                                    max={10}
                                    inputClassName="!text-[10px] !py-1.5 !px-1.5 text-center"
                                />
                            </div>
                            <div>
                                <label className="text-[7px] text-zinc-600 font-bold uppercase tracking-wider block mb-0.5">Reps</label>
                                <EditableField
                                    type="text"
                                    isEditing
                                    value={ex.repeticoes}
                                    onChange={(v) => onUpdate({ ...ex, repeticoes: v })}
                                    placeholder="8-12"
                                    inputClassName="!text-[10px] !py-1.5 !px-1.5 text-center"
                                />
                            </div>
                            <div>
                                <label className="text-[7px] text-zinc-600 font-bold uppercase tracking-wider block mb-0.5">Descanso</label>
                                <EditableField
                                    type="select"
                                    isEditing
                                    value={String(ex.descansoSegundos)}
                                    onChange={(v) => onUpdate({ ...ex, descansoSegundos: Number(v) })}
                                    options={DESCANSO_OPCOES}
                                    inputClassName="!text-[10px] !py-1.5 !px-1"
                                />
                            </div>
                            <div>
                                <label className="text-[7px] text-zinc-600 font-bold uppercase tracking-wider block mb-0.5">Técnica</label>
                                <EditableField
                                    type="select"
                                    isEditing
                                    value={ex.tecnica || ''}
                                    onChange={(v) => onUpdate({ ...ex, tecnica: v || undefined })}
                                    options={TECNICAS_OPCOES}
                                    inputClassName="!text-[10px] !py-0.5 !px-1"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );
};

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════

export const SecaoTreinosEditavel: React.FC<SecaoTreinosEditavelProps> = ({
    treinos,
    isEditing,
    onUpdateTreinos,
}) => {
    const [activeTab, setActiveTab] = useState(treinos[0]?.id || '');
    const [iaBulkLoading, setIaBulkLoading] = useState(false);
    const activeTreino = treinos.find(t => t.id === activeTab);

    // ── Handlers de exercício ──

    const updateExercicio = (treinoId: string, blocoIdx: number, exOrdem: number, updated: Exercicio) => {
        const newTreinos = treinos.map(t => {
            if (t.id !== treinoId) return t;
            return {
                ...t,
                blocos: t.blocos.map((b, bIdx) => {
                    if (bIdx !== blocoIdx) return b;
                    const newBloco = {
                        ...b,
                        exercicios: b.exercicios.map(e => e.ordem === exOrdem ? updated : e),
                    };
                    return recalcularSeriesTotalBloco(newBloco);
                }),
            };
        });
        onUpdateTreinos(newTreinos);
    };

    /** Gera prescrição série-a-série via IA para TODOS os exercícios do treino ativo, em paralelo. */
    const gerarTudoComIA = async () => {
        if (!activeTreino) return;
        if (!window.confirm(`Gerar prescrição detalhada via IA para todos os exercícios do "${activeTreino.nome}"?\n\nPode levar alguns segundos.`)) return;
        setIaBulkLoading(true);
        try {
            const novosBlocos = await Promise.all(activeTreino.blocos.map(async bloco => {
                const novosExs = await Promise.all(bloco.exercicios.map(async ex => {
                    try {
                        const topKg = ex.topSetKg && ex.topSetKg > 0 ? ex.topSetKg : 100;
                        const repsMatch = ex.repeticoes.match(/\d+/g);
                        const repsTop = ex.topSetReps ?? (repsMatch ? Math.max(...repsMatch.map(Number)) : 10);
                        const series = await sugerirPrescricaoIA({
                            exercicioNome: ex.nome,
                            grupoMuscular: bloco.nomeGrupo,
                            topSetKg: topKg,
                            repsTop,
                            totalSeriesDesejado: Math.max(4, ex.series || 5),
                        });
                        return { ...ex, prescricaoSeries: series, topSetKg: ex.topSetKg, topSetReps: repsTop };
                    } catch {
                        return ex;
                    }
                }));
                return { ...bloco, exercicios: novosExs };
            }));
            const newTreinos = treinos.map(t => t.id === activeTreino.id ? { ...t, blocos: novosBlocos } : t);
            onUpdateTreinos(newTreinos);
        } finally {
            setIaBulkLoading(false);
        }
    };

    const removeExercicio = (treinoId: string, blocoIdx: number, exOrdem: number) => {
        const newTreinos = treinos.map(t => {
            if (t.id !== treinoId) return t;
            return {
                ...t,
                blocos: t.blocos.map((b, bIdx) => {
                    if (bIdx !== blocoIdx) return b;
                    const newExercicios = b.exercicios
                        .filter(e => e.ordem !== exOrdem)
                        .map((e, i) => ({ ...e, ordem: i + 1 }));
                    return recalcularSeriesTotalBloco({ ...b, exercicios: newExercicios });
                }),
            };
        });
        onUpdateTreinos(newTreinos);
    };

    const addExercicio = (treinoId: string, blocoIdx: number) => {
        const newTreinos = treinos.map(t => {
            if (t.id !== treinoId) return t;
            return {
                ...t,
                blocos: t.blocos.map((b, bIdx) => {
                    if (bIdx !== blocoIdx) return b;
                    const novoEx = criarExercicioVazio(b.exercicios.length + 1);
                    const newBloco = { ...b, exercicios: [...b.exercicios, novoEx] };
                    return recalcularSeriesTotalBloco(newBloco);
                }),
            };
        });
        onUpdateTreinos(newTreinos);
    };

    const moveExercicio = (treinoId: string, blocoIdx: number, exOrdem: number, direction: 'up' | 'down') => {
        const newTreinos = treinos.map(t => {
            if (t.id !== treinoId) return t;
            return {
                ...t,
                blocos: t.blocos.map((b, bIdx) => {
                    if (bIdx !== blocoIdx) return b;
                    const idx = b.exercicios.findIndex(e => e.ordem === exOrdem);
                    if (idx < 0) return b;
                    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
                    if (swapIdx < 0 || swapIdx >= b.exercicios.length) return b;
                    const newExercicios = [...b.exercicios];
                    [newExercicios[idx], newExercicios[swapIdx]] = [newExercicios[swapIdx], newExercicios[idx]];
                    return { ...b, exercicios: newExercicios.map((e, i) => ({ ...e, ordem: i + 1 })) };
                }),
            };
        });
        onUpdateTreinos(newTreinos);
    };

    // ── Handlers de treino (letra) ──

    const addTreino = () => {
        const letra = PROXIMA_LETRA(treinos);
        const novoTreino: TreinoDetalhado = {
            id: uid(),
            nome: `Treino ${letra}`,
            letra,
            duracaoMinutos: 60,
            blocos: [{
                nomeGrupo: 'Grupo Muscular',
                seriesTotal: 0,
                isPrioridade: false,
                exercicios: [criarExercicioVazio(1)],
            }],
        };
        const updated = [...treinos, novoTreino];
        onUpdateTreinos(updated);
        setActiveTab(novoTreino.id);
    };

    const removeTreino = (treinoId: string) => {
        if (treinos.length <= 1) return; // Mínimo 1 treino
        const updated = treinos.filter(t => t.id !== treinoId);
        onUpdateTreinos(updated);
        if (activeTab === treinoId) {
            setActiveTab(updated[0]?.id || '');
        }
    };

    const addBloco = (treinoId: string) => {
        const newTreinos = treinos.map(t => {
            if (t.id !== treinoId) return t;
            return {
                ...t,
                blocos: [...t.blocos, {
                    nomeGrupo: 'Novo Grupo',
                    seriesTotal: 0,
                    isPrioridade: false,
                    exercicios: [criarExercicioVazio(1)],
                }],
            };
        });
        onUpdateTreinos(newTreinos);
    };

    const removeBloco = (treinoId: string, blocoIdx: number) => {
        const newTreinos = treinos.map(t => {
            if (t.id !== treinoId) return t;
            if (t.blocos.length <= 1) return t; // Mínimo 1 bloco
            return { ...t, blocos: t.blocos.filter((_, i) => i !== blocoIdx) };
        });
        onUpdateTreinos(newTreinos);
    };

    const updateBlocoNome = (treinoId: string, blocoIdx: number, nome: string) => {
        const newTreinos = treinos.map(t => {
            if (t.id !== treinoId) return t;
            return {
                ...t,
                blocos: t.blocos.map((b, i) => i === blocoIdx ? { ...b, nomeGrupo: nome } : b),
            };
        });
        onUpdateTreinos(newTreinos);
    };

    const updateTreinoNome = (treinoId: string, nome: string) => {
        const newTreinos = treinos.map(t => t.id === treinoId ? { ...t, nome } : t);
        onUpdateTreinos(newTreinos);
    };

    // ═══════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════

    return (
        <>
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 bg-white/[0.02] p-1.5 rounded-2xl border border-white/5">
                {treinos.map((t) => (
                    <div key={t.id} className="relative flex-1 min-w-[120px]">
                        <button
                            onClick={() => setActiveTab(t.id)}
                            className={`w-full px-4 py-3 rounded-xl font-bold text-sm uppercase transition-all ${activeTab === t.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {t.nome}
                        </button>
                        {isEditing && treinos.length > 1 && (
                            <button
                                onClick={() => removeTreino(t.id)}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center bg-red-500/80 text-white rounded-full text-[10px] hover:bg-red-500 transition-all shadow-lg z-10"
                                title={`Remover ${t.nome}`}
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
                {isEditing && (
                    <button
                        onClick={addTreino}
                        className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary/10 border border-dashed border-primary/30 transition-all"
                    >
                        <Plus size={14} />
                        Treino
                    </button>
                )}
            </div>

            {/* Ficha Ativa */}
            {activeTreino && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center justify-between mb-6 gap-3">
                        <div>
                            {isEditing ? (
                                <EditableField
                                    type="text"
                                    isEditing
                                    value={activeTreino.nome}
                                    onChange={(v) => updateTreinoNome(activeTreino.id, v)}
                                    inputClassName="text-2xl font-black text-white"
                                />
                            ) : (
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight">{activeTreino.nome}</h3>
                            )}
                            <div className="flex items-center gap-4 mt-1 text-gray-500">
                                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                                    <Dumbbell size={14} className="text-primary" /> Treino {activeTreino.letra}
                                </span>
                                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                                    <Clock size={14} className="text-primary" /> ~{activeTreino.duracaoMinutos} minutos
                                </span>
                            </div>
                        </div>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={gerarTudoComIA}
                                disabled={iaBulkLoading}
                                className="h-10 px-4 flex items-center gap-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 shadow-lg shadow-amber-500/5"
                                title="Gerar prescrição série-a-série via IA para todos os exercícios deste treino"
                            >
                                {iaBulkLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                                {iaBulkLoading ? 'Gerando…' : 'Gerar tudo com IA'}
                            </button>
                        )}
                    </div>

                    <div className="space-y-8">
                        {activeTreino.blocos.map((bloco, bIdx) => (
                            <div key={bIdx} className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                                <div className="bg-white/[0.03] px-6 py-4 flex items-center justify-between border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${bloco.isPrioridade ? 'bg-red-500 animate-pulse' : 'bg-primary/60'}`} />
                                        {isEditing ? (
                                            <EditableField
                                                type="text"
                                                isEditing
                                                value={bloco.nomeGrupo}
                                                onChange={(v) => updateBlocoNome(activeTreino.id, bIdx, v)}
                                                inputClassName="text-lg font-black text-white uppercase"
                                            />
                                        ) : (
                                            <h4 className="text-lg font-black text-white uppercase tracking-wider">{bloco.nomeGrupo}</h4>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-bold text-gray-500 border border-white/10 px-3 py-1 rounded-full uppercase">
                                            Total: {bloco.seriesTotal} séries
                                        </span>
                                        {isEditing && activeTreino.blocos.length > 1 && (
                                            <button
                                                onClick={() => removeBloco(activeTreino.id, bIdx)}
                                                className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                title="Remover bloco"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-base">
                                        {!isEditing && (
                                            <thead>
                                                <tr className="border-b border-white/[0.04] text-[10px] text-gray-600 uppercase tracking-[0.2em]">
                                                    <th className="text-left px-6 py-3 w-16">#</th>
                                                    <th className="text-left py-3">Exercício</th>
                                                    <th className="text-center py-3">Séries</th>
                                                    <th className="text-center py-3">Reps</th>
                                                    <th className="text-center py-3">Descanso</th>
                                                    <th className="text-right px-6 py-3">Técnica</th>
                                                </tr>
                                            </thead>
                                        )}
                                        <tbody>
                                            {bloco.exercicios.map((ex, exIdx) => (
                                                <ExercicioRow
                                                    key={`${ex.ordem}-${exIdx}`}
                                                    ex={ex}
                                                    isEditing={isEditing}
                                                    onUpdate={(updated) => updateExercicio(activeTreino.id, bIdx, ex.ordem, updated)}
                                                    onRemove={() => removeExercicio(activeTreino.id, bIdx, ex.ordem)}
                                                    onMoveUp={exIdx > 0 ? () => moveExercicio(activeTreino.id, bIdx, ex.ordem, 'up') : null}
                                                    onMoveDown={exIdx < bloco.exercicios.length - 1 ? () => moveExercicio(activeTreino.id, bIdx, ex.ordem, 'down') : null}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {isEditing && (
                                    <div className="px-6 py-3 border-t border-white/5">
                                        <button
                                            onClick={() => addExercicio(activeTreino.id, bIdx)}
                                            className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider hover:bg-primary/10 px-4 py-2 rounded-xl transition-all"
                                        >
                                            <Plus size={14} />
                                            Adicionar Exercício
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isEditing && (
                            <button
                                onClick={() => addBloco(activeTreino.id)}
                                className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-white/10 rounded-2xl text-sm font-bold text-gray-500 uppercase tracking-wider hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all"
                            >
                                <Plus size={16} />
                                Adicionar Grupo Muscular
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
