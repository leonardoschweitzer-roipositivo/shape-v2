/**
 * CopiarTreinoModal — escolher treinos de outro aluno ou de um modelo salvo
 * para semear o editor. Nada é gravado aqui: o personal revisa e salva no editor.
 */
import React, { useEffect, useState } from 'react';
import { Copy, Layers, Loader2, Trash2, X } from 'lucide-react';
import type { ObservacoesTreino, TreinoDetalhado } from '@/services/calculations/treino';
import {
    listarAlunosComPlano,
    sanitizarTreinosParaCopia,
    type AlunoComPlano,
} from '@/services/treino/planosTreino.service';
import { excluirModelo, listarModelos, type TreinoModelo } from '@/services/treino/treinoModelos.service';

export type AbaCopiarTreino = 'alunos' | 'modelos';

interface CopiarTreinoModalProps {
    aberto: boolean;
    abaInicial?: AbaCopiarTreino;
    /** Aluno que está sendo editado (não aparece na lista de origem). */
    atletaIdAtual: string;
    onFechar: () => void;
    onEscolher: (escolha: {
        treinos: TreinoDetalhado[];
        origem: 'copia' | 'modelo';
        observacoes?: ObservacoesTreino;
        descricao: string;
    }) => void;
}

const contarExercicios = (treinos: TreinoDetalhado[]) =>
    treinos.reduce((acc, t) => acc + t.blocos.reduce((a, b) => a + b.exercicios.length, 0), 0);

const ResumoTreinos: React.FC<{ treinos: TreinoDetalhado[] }> = ({ treinos }) => (
    <div className="mt-2 flex flex-wrap gap-1.5">
        {treinos.map(t => (
            <span key={t.id} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-gray-400">
                {t.letra}: {t.blocos.map(b => b.nomeGrupo).join(', ')}
            </span>
        ))}
    </div>
);

export const CopiarTreinoModal: React.FC<CopiarTreinoModalProps> = ({
    aberto,
    abaInicial = 'alunos',
    atletaIdAtual,
    onFechar,
    onEscolher,
}) => {
    const [aba, setAba] = useState<AbaCopiarTreino>(abaInicial);
    const [alunos, setAlunos] = useState<AlunoComPlano[] | null>(null);
    const [modelos, setModelos] = useState<TreinoModelo[] | null>(null);

    useEffect(() => {
        if (!aberto) return;
        setAba(abaInicial);
        listarAlunosComPlano(atletaIdAtual).then(setAlunos);
        listarModelos().then(setModelos);
    }, [aberto, abaInicial, atletaIdAtual]);

    if (!aberto) return null;

    const removerModelo = async (m: TreinoModelo) => {
        if (!window.confirm(`Excluir o modelo "${m.nome}"?`)) return;
        const r = await excluirModelo(m.id);
        if (!r.ok) return alert(r.erro);
        setModelos(prev => prev?.filter(x => x.id !== m.id) ?? null);
    };

    const lista = aba === 'alunos' ? alunos : modelos;

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4" onClick={onFechar}>
            <div
                className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-white/10 bg-surface text-white shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                    <h3 className="text-lg font-bold uppercase tracking-wide">Reaproveitar treino</h3>
                    <button type="button" onClick={onFechar} className="text-gray-500 hover:text-white" aria-label="Fechar">
                        <X size={18} />
                    </button>
                </div>

                <div className="flex gap-2 px-6 pt-4">
                    {([['alunos', 'De outro aluno', Copy], ['modelos', 'Meus modelos', Layers]] as const).map(([id, label, Icon]) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setAba(id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border ${aba === id ? 'bg-primary/15 border-primary/40 text-primary' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
                        >
                            <Icon size={14} /> {label}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                    <p className="text-xs text-gray-500">
                        As cargas não são copiadas (cada aluno tem as suas). Você revisa tudo antes de salvar.
                    </p>

                    {lista === null && <Loader2 className="mx-auto my-8 animate-spin text-primary" size={24} />}

                    {lista !== null && lista.length === 0 && (
                        <p className="py-8 text-center text-sm text-gray-500">
                            {aba === 'alunos'
                                ? 'Nenhum outro aluno com treino ativo.'
                                : 'Você ainda não tem modelos. Use "Salvar como modelo" no editor de treino.'}
                        </p>
                    )}

                    {aba === 'alunos' && alunos?.map(a => (
                        <button
                            key={a.planoId}
                            type="button"
                            onClick={() => onEscolher({
                                treinos: sanitizarTreinosParaCopia(a.dados.treinos),
                                origem: 'copia',
                                observacoes: a.dados.observacoes,
                                descricao: `Copiado do treino de ${a.nome}`,
                            })}
                            className="w-full text-left p-4 rounded-xl border border-white/10 hover:border-primary/40 hover:bg-white/[0.03] transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-semibold">{a.nome}</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                                    {a.dados.treinos.length} treinos · {contarExercicios(a.dados.treinos)} exercícios
                                </span>
                            </div>
                            <ResumoTreinos treinos={a.dados.treinos} />
                        </button>
                    ))}

                    {aba === 'modelos' && modelos?.map(m => (
                        <div key={m.id} className="flex items-stretch gap-2">
                            <button
                                type="button"
                                onClick={() => onEscolher({
                                    treinos: sanitizarTreinosParaCopia(m.treinos),
                                    origem: 'modelo',
                                    observacoes: m.observacoes,
                                    descricao: `Modelo "${m.nome}"`,
                                })}
                                className="flex-1 text-left p-4 rounded-xl border border-white/10 hover:border-primary/40 hover:bg-white/[0.03] transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">{m.nome}</span>
                                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                                        {m.treinos.length} treinos · {contarExercicios(m.treinos)} exercícios
                                    </span>
                                </div>
                                {m.descricao && <p className="text-xs text-gray-500 mt-1">{m.descricao}</p>}
                                <ResumoTreinos treinos={m.treinos} />
                            </button>
                            <button
                                type="button"
                                onClick={() => removerModelo(m)}
                                className="px-3 rounded-xl border border-white/10 text-gray-500 hover:text-red-400 hover:border-red-500/30"
                                aria-label={`Excluir modelo ${m.nome}`}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
