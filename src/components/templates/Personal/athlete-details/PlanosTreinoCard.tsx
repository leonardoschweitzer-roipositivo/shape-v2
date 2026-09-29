/**
 * PlanosTreinoCard — todos os planos de treino do aluno (ativo + histórico), de qualquer origem
 * (Vitrúvio, criado do zero, copiado, modelo). Lê planos_treino direto — antes só apareciam
 * planos ligados a um diagnóstico.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Dumbbell, Edit3, Eye, Loader2, Plus, Trash2 } from 'lucide-react';
import type { PlanoTreino } from '@/services/calculations/treino';
import {
    excluirPlanoTreino,
    listarPlanosTreino,
    type PlanoTreinoResumo,
} from '@/services/treino/planosTreino.service';

const ORIGEM_LABEL: Record<PlanoTreinoResumo['origem'], string> = {
    vitruvio: 'Vitrúvio IA',
    manual: 'Do zero',
    copia: 'Cópia',
    modelo: 'Modelo',
};

interface PlanosTreinoCardProps {
    atletaId: string;
    nomeAluno: string;
    /** Abre o editor: planoId null = novo treino. */
    onAbrirEditor: (planoId: string | null, dados: PlanoTreino | null) => void;
    onVisualizar: (dados: PlanoTreino) => void;
}

export const PlanosTreinoCard: React.FC<PlanosTreinoCardProps> = ({ atletaId, nomeAluno, onAbrirEditor, onVisualizar }) => {
    const [planos, setPlanos] = useState<PlanoTreinoResumo[] | null>(null);

    const carregar = useCallback(() => {
        listarPlanosTreino(atletaId).then(setPlanos);
    }, [atletaId]);

    useEffect(carregar, [carregar]);

    const excluir = async (p: PlanoTreinoResumo) => {
        const aviso = p.status === 'ativo'
            ? `Excluir o treino ATIVO de ${nomeAluno}? O aluno ficará sem treino no portal até você criar outro.`
            : 'Excluir este treino do histórico?';
        if (!window.confirm(aviso)) return;
        const r = await excluirPlanoTreino(p.id);
        if (!r.ok) return alert(r.erro);
        carregar();
    };

    return (
        <div className="bg-surface border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Dumbbell size={18} className="text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white uppercase tracking-wide">Treinos</h3>
                        <p className="text-xs text-gray-500">O treino ativo é o que o aluno vê no portal.</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => onAbrirEditor(null, null)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-wider"
                >
                    <Plus size={14} /> Novo treino (do zero, cópia ou modelo)
                </button>
            </div>

            {planos === null && <Loader2 className="mx-auto my-6 animate-spin text-primary" size={22} />}

            {planos?.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-6">
                    Nenhum treino ainda. Crie do zero, copie de outro aluno ou gere pelo Plano de Evolução.
                </p>
            )}

            {planos && planos.length > 0 && (
                <div className="divide-y divide-white/5">
                    {planos.map(p => (
                        <div key={p.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 py-3">
                            <div className="flex items-center gap-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${p.status === 'ativo' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-gray-500 border-white/10'}`}>
                                    {p.status === 'ativo' ? 'Ativo' : 'Histórico'}
                                </span>
                                <span className="text-sm text-white">
                                    {new Date(p.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                                    {ORIGEM_LABEL[p.origem]} · {p.dados?.treinos?.length ?? 0} treinos
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button type="button" onClick={() => onVisualizar(p.dados)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10" title="Visualizar">
                                    <Eye size={16} />
                                </button>
                                <button type="button" onClick={() => onAbrirEditor(p.id, p.dados)} className="p-2 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10" title="Editar">
                                    <Edit3 size={16} />
                                </button>
                                <button type="button" onClick={() => excluir(p)} className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10" title="Excluir">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
