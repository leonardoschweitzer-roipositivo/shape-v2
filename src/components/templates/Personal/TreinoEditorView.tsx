/**
 * TreinoEditorView — editor de treino do personal (sem depender de avaliação/IA).
 *
 * Usos:
 *  - Criar do zero (escolhe quantos treinos) · copiar de outro aluno · aplicar modelo
 *  - Editar um plano salvo (Vitrúvio, manual ou copiado)
 *
 * Criar grava um plano NOVO (o ativo anterior vira histórico — RPC criar_plano_treino).
 * Editar atualiza só os dados do plano aberto.
 * O Plano de Evolução com IA continua no TreinoView (wizard).
 */
import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Copy, Dumbbell, Layers, Loader2, Save, BookmarkPlus, CheckCircle, XCircle } from 'lucide-react';
import { useDataStore } from '@/stores/dataStore';
import { derivarDivisao, type PlanoTreino, type TreinoDetalhado } from '@/services/calculations/treino';
import {
    atualizarPlanoTreino,
    buscarPlanoTreinoAtivoMeta,
    criarPlanoTreino,
    criarPlanoTreinoVazio,
    montarPlanoTreino,
} from '@/services/treino/planosTreino.service';
import { salvarComoModelo } from '@/services/treino/treinoModelos.service';
import { SecaoTreinosEditavel } from '@/components/organisms/SecaoTreinosEditavel/SecaoTreinosEditavel';
import { CopiarTreinoModal, type AbaCopiarTreino } from '@/components/organisms/CopiarTreinoModal';
import { SectionCard } from './PlanoEvolucaoShared';
import { SecaoDivisao } from './treino/TreinoSections';

interface TreinoEditorViewProps {
    atletaId: string;
    /** Plano sendo editado (null = criar um novo). */
    planoId: string | null;
    /** Dados do plano em edição (obrigatório quando planoId existe). */
    planoInicial?: PlanoTreino | null;
    onVoltar: () => void;
    onSalvo: () => void;
}

const ORIGEM_LABEL: Record<NonNullable<PlanoTreino['origem']>, string> = {
    vitruvio: 'Plano de Evolução (Vitrúvio IA)',
    manual: 'Criado do zero',
    copia: 'Copiado de outro aluno',
    modelo: 'Aplicado de modelo',
};

/** Remove exercícios sem nome e blocos vazios antes de salvar. */
function limparTreinos(treinos: TreinoDetalhado[]): TreinoDetalhado[] {
    return treinos.map(t => ({
        ...t,
        blocos: t.blocos
            .map(b => {
                const exercicios = b.exercicios
                    .filter(ex => ex.nome.trim())
                    .map((ex, i) => ({ ...ex, nome: ex.nome.trim(), ordem: i + 1 }));
                return { ...b, exercicios, seriesTotal: exercicios.reduce((s, ex) => s + (ex.series || 0), 0) };
            })
            .filter(b => b.exercicios.length > 0),
    }));
}

export const TreinoEditorView: React.FC<TreinoEditorViewProps> = ({
    atletaId,
    planoId,
    planoInicial,
    onVoltar,
    onSalvo,
}) => {
    const { personalAthletes } = useDataStore();
    const atleta = useMemo(() => personalAthletes.find(a => a.id === atletaId), [personalAthletes, atletaId]);
    const nomeAluno = atleta?.name ?? 'Aluno';

    const [plano, setPlano] = useState<PlanoTreino | null>(planoInicial ?? null);
    const [descricaoOrigem, setDescricaoOrigem] = useState<string | null>(null);
    const [modal, setModal] = useState<AbaCopiarTreino | null>(null);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [toast, setToast] = useState<'ok' | 'erro' | null>(null);
    const [temPlanoAtivo, setTemPlanoAtivo] = useState(false);
    const [nomeModelo, setNomeModelo] = useState<string | null>(null);

    const criando = !planoId;

    useEffect(() => {
        if (!criando) return;
        buscarPlanoTreinoAtivoMeta(atletaId).then(ativo => setTemPlanoAtivo(!!ativo));
    }, [atletaId, criando]);

    const mostrarToast = (tipo: 'ok' | 'erro') => {
        setToast(tipo);
        setTimeout(() => setToast(null), 3000);
    };

    const atualizarTreinos = (treinos: TreinoDetalhado[]) =>
        setPlano(p => (p ? { ...p, treinos, divisao: derivarDivisao(treinos, p.origem === 'vitruvio' ? p.divisao.tipo : undefined) } : p));

    const salvar = async () => {
        if (!plano) return;
        const treinos = limparTreinos(plano.treinos);
        if (treinos.every(t => t.blocos.length === 0)) {
            setErro('Adicione pelo menos um exercício antes de salvar.');
            return;
        }
        if (criando && temPlanoAtivo &&
            !window.confirm(`${nomeAluno} já tem um treino ativo. Substituir pelo novo? O atual fica no histórico.`)) {
            return;
        }

        setErro(null);
        setSalvando(true);
        const final: PlanoTreino = {
            ...plano,
            treinos,
            divisao: derivarDivisao(treinos, plano.origem === 'vitruvio' ? plano.divisao.tipo : undefined),
        };
        const r = criando ? await criarPlanoTreino(atletaId, final) : await atualizarPlanoTreino(planoId!, final);
        setSalvando(false);
        if (!r.ok) {
            setErro(r.erro);
            mostrarToast('erro');
            return;
        }
        mostrarToast('ok');
        onSalvo();
    };

    const confirmarModelo = async () => {
        if (!plano || nomeModelo === null) return;
        const r = await salvarComoModelo(nomeModelo, limparTreinos(plano.treinos), { observacoes: plano.observacoes });
        if (!r.ok) {
            alert(r.erro);
            return;
        }
        setNomeModelo(null);
        mostrarToast('ok');
    };

    // ── Escolha inicial (criar) ──
    if (!plano) {
        return (
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-3xl mx-auto flex flex-col gap-6">
                    <button onClick={onVoltar} className="self-start flex items-center gap-2 text-sm text-gray-400 hover:text-white">
                        <ArrowLeft size={16} /> Voltar
                    </button>
                    <div>
                        <h2 className="text-3xl font-bold text-white uppercase tracking-tight">Novo treino</h2>
                        <p className="text-gray-400 mt-2">Para {nomeAluno}. Não precisa de avaliação — você monta os exercícios.</p>
                    </div>

                    <div className="bg-surface border border-white/10 rounded-2xl p-6 space-y-4">
                        <h3 className="flex items-center gap-2 font-bold text-white"><Dumbbell size={18} className="text-primary" /> Criar do zero</h3>
                        <p className="text-sm text-gray-400">Quantos treinos por semana?</p>
                        <div className="flex flex-wrap gap-3">
                            {[2, 3, 4, 5, 6].map(n => (
                                <button
                                    key={n}
                                    type="button"
                                    onClick={() => {
                                        setPlano(criarPlanoTreinoVazio(atletaId, n));
                                        setDescricaoOrigem(null);
                                    }}
                                    className="w-16 h-16 rounded-xl border border-white/10 hover:border-primary/50 hover:bg-primary/10 text-white font-black text-lg"
                                >
                                    {n}x
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button type="button" onClick={() => setModal('alunos')} className="text-left bg-surface border border-white/10 hover:border-primary/40 rounded-2xl p-6">
                            <Copy size={18} className="text-primary mb-3" />
                            <p className="font-bold text-white">Copiar de outro aluno</p>
                            <p className="text-sm text-gray-500 mt-1">Reaproveite um treino que já funciona.</p>
                        </button>
                        <button type="button" onClick={() => setModal('modelos')} className="text-left bg-surface border border-white/10 hover:border-primary/40 rounded-2xl p-6">
                            <Layers size={18} className="text-primary mb-3" />
                            <p className="font-bold text-white">Aplicar um modelo</p>
                            <p className="text-sm text-gray-500 mt-1">Use um dos seus modelos salvos.</p>
                        </button>
                    </div>
                </div>

                <CopiarTreinoModal
                    aberto={modal !== null}
                    abaInicial={modal ?? 'alunos'}
                    atletaIdAtual={atletaId}
                    onFechar={() => setModal(null)}
                    onEscolher={({ treinos, origem, observacoes, descricao }) => {
                        setPlano(montarPlanoTreino(atletaId, treinos, origem, observacoes ? { objetivo: 'RECOMP', observacoes } : undefined));
                        setDescricaoOrigem(descricao);
                        setModal(null);
                    }}
                />
            </div>
        );
    }

    // ── Editor ──
    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-16">
                {toast && (
                    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-bold uppercase tracking-wider ${toast === 'ok' ? 'bg-emerald-900/90 border-emerald-500/40 text-emerald-300' : 'bg-red-900/90 border-red-500/40 text-red-300'}`}>
                        {toast === 'ok' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                        {toast === 'ok' ? 'Salvo!' : 'Erro ao salvar.'}
                    </div>
                )}

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <button onClick={onVoltar} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-3">
                            <ArrowLeft size={16} /> Voltar
                        </button>
                        <h2 className="text-3xl font-bold text-white uppercase tracking-tight">
                            {criando ? 'Novo treino' : 'Editar treino'} — {nomeAluno}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {descricaoOrigem ?? ORIGEM_LABEL[plano.origem ?? 'vitruvio']}
                            {criando && temPlanoAtivo && ' · ao salvar, substitui o treino ativo (o atual vai para o histórico)'}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setNomeModelo('')}
                            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-wider text-gray-300 hover:bg-white/5"
                        >
                            <BookmarkPlus size={14} /> Salvar como modelo
                        </button>
                        <button
                            type="button"
                            onClick={salvar}
                            disabled={salvando}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                        >
                            {salvando ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            {criando ? 'Salvar e ativar' : 'Salvar alterações'}
                        </button>
                    </div>
                </div>

                {erro && <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-sm text-red-400">{erro}</div>}

                {nomeModelo !== null && (
                    <div className="flex flex-col md:flex-row gap-3 p-4 rounded-xl border border-primary/30 bg-primary/5">
                        <input
                            autoFocus
                            value={nomeModelo}
                            onChange={e => setNomeModelo(e.target.value)}
                            placeholder="Nome do modelo (ex.: ABC Hipertrofia Iniciante)"
                            className="flex-1 bg-background-dark border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50"
                        />
                        <div className="flex gap-2">
                            <button type="button" onClick={() => setNomeModelo(null)} className="px-4 py-2.5 rounded-lg border border-white/10 text-xs text-gray-400">Cancelar</button>
                            <button type="button" onClick={confirmarModelo} className="px-4 py-2.5 rounded-lg bg-primary text-white text-xs font-bold uppercase">Salvar modelo</button>
                        </div>
                    </div>
                )}

                <SecaoDivisao treinos={plano.treinos} />

                <SectionCard icon={Dumbbell} title="Treinos da Semana" subtitle="Digite o nome do exercício para buscar na biblioteca (com vídeo para o aluno)">
                    <SecaoTreinosEditavel treinos={plano.treinos} isEditing onUpdateTreinos={atualizarTreinos} />
                </SectionCard>

                <SectionCard icon={Layers} title="Orientações para o aluno" subtitle="Aparecem junto do plano (opcional)">
                    <textarea
                        value={plano.observacoes.resumo}
                        onChange={e => setPlano(p => (p ? { ...p, observacoes: { ...p.observacoes, resumo: e.target.value } } : p))}
                        rows={4}
                        placeholder="Ex.: Aqueça 5 min antes. Progrida a carga quando completar todas as reps com boa técnica."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 resize-y"
                    />
                </SectionCard>
            </div>
        </div>
    );
};
