/**
 * DietaView — Etapa 3: Plano de Dieta
 *
 * Última etapa do pipeline VITRÚVIO IA.
 * Autossuficiente: carrega dados do atleta via useDataStore,
 * calcula potencial e diagnóstico internamente (igual ao TreinoView).
 *
 * @see docs/specs/plano-evolucao-etapa-3-dieta.md
 */

import React, { useState, useMemo } from 'react';
import {
    ArrowLeft,
    Flame,
    Target,
    Salad,
    Stethoscope,
    Dumbbell,
    Bot,
    Loader2,
    BarChart2,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Award,
    Scale,
    LayoutList,
    UtensilsCrossed,
    Calendar,
    Save,
    ArrowRight,
    Activity,
    TrendingUp,
    ChevronDown,
    Trash2,
    Plus,
} from 'lucide-react';
import { useDataStore } from '@/stores/dataStore';
import {
    gerarDiagnosticoCompleto,
    type DiagnosticoDados,
    type DiagnosticoInput,
} from '@/services/calculations/diagnostico';
import {
    calcularPotencialAtleta,
    inferirNivelAtividade,
    type PotencialAtleta,
} from '@/services/calculations/potencial';
import {
    gerarPlanoDieta,
    salvarPlanoDieta,
    enriquecerDietaComIA,
    type PlanoDieta,
    type MacroSet,
    type RefeicaoEstrutura,
} from '@/services/calculations/dieta';
import {
    recomendarObjetivo,
    getObjetivoMeta,
    type ObjetivoVitruvio,
} from '@/services/calculations/objetivos';
import { ChatPlanoEvolucao } from '@/components/organisms/ChatPlanoEvolucao/ChatPlanoEvolucao';
import { perfilParaTexto, dietaParaTexto, getFontesCientificas } from '@/services/vitruviusContext';
import { extrairDiretrizesDoChat } from '@/services/vitruviusAI';
import { useEditableState } from '@/hooks/useEditableState';
import { EditToolbar } from '@/components/molecules/EditToolbar/EditToolbar';
import { EditableField } from '@/components/atoms/EditableField/EditableField';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface DietaViewProps {
    atletaId: string;
    onBack: () => void;
    onComplete?: () => void;
    diagnosticoId?: string;
    readOnlyData?: PlanoDieta;
}

type DietaState = 'idle' | 'generating' | 'ready' | 'saving' | 'saved';


// ═══════════════════════════════════════════════════════════
// EXTRACTED SHARED + SECTIONS
// ═══════════════════════════════════════════════════════════
import { EvolutionStepper, SectionCard, InsightBox } from './PlanoEvolucaoShared';
import { MacroCard, MacroBar, TabelaRefeicoes } from './dieta/DietaSections';
import { getClassificacao, buildPerfilIA, buildDiagnosticoInput } from './PlanoEvolucaoHelpers';


// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════

export const DietaView: React.FC<DietaViewProps> = ({
    atletaId,
    onBack,
    onComplete,
    diagnosticoId,
    readOnlyData,
}) => {
    const { personalAthletes } = useDataStore();
    const atleta = useMemo(() => personalAthletes.find(a => a.id === atletaId), [personalAthletes, atletaId]);
    const ultimaAvaliacao = useMemo(() => atleta?.assessments[0] ?? null, [atleta]);

    // Recomendação de objetivo imediata para o Header
    const recomendacaoPadrao = useMemo(() => {
        if (!atleta || !ultimaAvaliacao) return null;
        const classificacao = getClassificacao(atleta.score);

        return recomendarObjetivo({
            bf: ultimaAvaliacao.bf ?? 15,
            ffmi: ultimaAvaliacao?.ffmi ?? 20,
            sexo: atleta.gender === 'FEMALE' ? 'F' : 'M',
            score: atleta.score,
            nivel: classificacao,
            adonis: atleta.ratio || undefined,
        });
    }, [atleta, ultimaAvaliacao]);

    const isReadOnly = !!readOnlyData;
    const [estado, setEstado] = useState<DietaState>(readOnlyData ? 'saved' : 'idle');
    const [plano, setPlano] = useState<PlanoDieta | null>(readOnlyData ?? null);
    const [potencial, setPotencial] = useState<PotencialAtleta | null>(null);
    const [diagnostico, setDiagnostico] = useState<DiagnosticoDados | null>(null);
    const [showDescanso, setShowDescanso] = useState(false);
    const [objetivoAtleta, setObjetivoAtleta] = useState<ObjetivoVitruvio>(
        readOnlyData?.objetivo || recomendacaoPadrao?.objetivo || 'RECOMP'
    );
    const [cardapioAberto, setCardapioAberto] = useState<Set<string>>(new Set());
    const [toastStatus, setToastStatus] = useState<'success' | 'error' | null>(null);
    const [iaEnriching, setIaEnriching] = useState(false);
    const [isApplying, setIsApplying] = useState(false);

    // ── Edição inline da dieta ──
    const {
        isEditing: isEditingDieta,
        editData: editPlano,
        hasChanges: hasDietChanges,
        startEditing: startEditingDieta,
        cancelEditing: cancelEditingDieta,
        commitEditing: commitEditingDieta,
        updateEditData: updateEditPlano,
    } = useEditableState<PlanoDieta | null>(plano);

    const handleSaveDietEdits = () => {
        const edited = commitEditingDieta();
        if (edited) setPlano(edited);
    };

    /** Dados ativos para render (editPlano quando editando, plano quando não) */
    const activePlano = isEditingDieta ? editPlano : plano;

    /** Helper: Atualiza um campo númerico do plano em edição */
    const updateDietField = <K extends keyof PlanoDieta>(field: K, value: PlanoDieta[K]) => {
        updateEditPlano(prev => prev ? { ...prev, [field]: value } : prev);
    };

    const toggleCardapio = (nome: string) => {
        setCardapioAberto(prev => {
            const next = new Set(prev);
            next.has(nome) ? next.delete(nome) : next.add(nome);
            return next;
        });
    };

    const nomeAtleta = atleta?.name ?? 'Atleta';

    if (!atleta) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-gray-500">Atleta não encontrado.</p>
            </div>
        );
    }

    // Em modo read-only, não exige avaliação — os dados já estão no readOnlyData
    if (!isReadOnly && !ultimaAvaliacao) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-gray-500">Atleta sem avaliação registrada. Realize uma avaliação primeiro.</p>
            </div>
        );
    }

    const handleGerar = () => {
        if (!ultimaAvaliacao) return;
        setEstado('generating');
        setTimeout(() => {
            // 1. Calcular Potencial
            const classificacao = getClassificacao(atleta.score);
            const pot = calcularPotencialAtleta(classificacao, atleta.score, atleta.contexto ?? undefined);
            setPotencial(pot);

            // 2. Calcular Diagnóstico (usando helper compartilhado)
            const nivelAtiv = inferirNivelAtividade(atleta.contexto ?? undefined);
            const input = buildDiagnosticoInput(
                atleta,
                ultimaAvaliacao.measurements as Record<string, unknown>,
                ultimaAvaliacao.bf ?? 15,
                pot,
                nivelAtiv,
                ultimaAvaliacao.proporcoes,
            );
            const diag = gerarDiagnosticoCompleto(input, pot);
            setDiagnostico(diag);

            // 3. Calcular objetivo recomendado (mesmo algoritmo do Diagnóstico/Treino)
            const adonisProp = diag.analiseEstetica.proporcoes.find(
                p => p.grupo === 'Shape-V' || p.grupo === 'V-Taper'
            );
            const rec = recomendarObjetivo({
                bf: diag.composicaoAtual.gorduraPct,
                ffmi: ultimaAvaliacao.ffmi ?? 20,
                sexo: atleta.gender === 'FEMALE' ? 'F' : 'M',
                score: diag.analiseEstetica.scoreAtual,
                nivel: diag.analiseEstetica.classificacaoAtual,
                adonis: adonisProp?.atual ?? undefined,
            });
            setObjetivoAtleta(rec.objetivo);

            // 4. Gerar Plano de Dieta (passando o objetivo Estrela do Norte + contexto do atleta)
            const resultado = gerarPlanoDieta(atletaId, atleta.name, diag, pot, rec.objetivo, atleta.contexto ?? undefined);
            setPlano(resultado);
            setEstado('ready');

            // Enriquecer com IA em background
            setIaEnriching(true);
            const perfil = buildPerfilIA(atleta.name, atleta.gender, atleta.birthDate, ultimaAvaliacao.measurements as Record<string, number>, ultimaAvaliacao.bf ?? 15, atleta.score, atleta.contexto ?? undefined);
            console.info('[DietaView] 🚀 Iniciando enriquecimento IA...');
            enriquecerDietaComIA(resultado, perfil)
                .then(enriquecido => {
                    if (enriquecido !== resultado) {
                        console.info('[DietaView] 🤖 Dieta enriquecida com IA!', {
                            temInsights: !!enriquecido.insightsPorSecao,
                            mensagemFinal: enriquecido.mensagemFinal?.substring(0, 50) + '...',
                        });
                        setPlano(enriquecido);
                    } else {
                        console.warn('[DietaView] ⚠️ IA retornou mesmo objeto (falha?)');
                    }
                })
                .catch(err => console.error('[DietaView] ❌ Erro IA:', err))
                .finally(() => setIaEnriching(false));
        }, 1200);
    };

    const faseColor = (fase: string) => {
        if (fase === 'CUTTING') return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
        if (fase === 'BULKING') return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    };

    /** Salva plano de dieta no Supabase */
    const handleSalvar = async () => {
        if (!plano) return;
        setEstado('saving');

        const personalId = atleta.personalId ?? null;
        const result = await salvarPlanoDieta(atletaId, personalId, plano, diagnosticoId);

        if (!result) {
            console.error('[Dieta] ❌ Erro ao salvar no banco.');
            setToastStatus('error');
            setEstado('ready');
            setTimeout(() => setToastStatus(null), 4000);
            return;
        }

        console.info('[Dieta] ✅ Plano salvo:', result.id);
        setToastStatus('success');
        setEstado('saved');
        setTimeout(() => setToastStatus(null), 3000);
    };

    /** Extrai diretrizes do chat e reprocessa o plano com IA */
    const handleAplicarAjustes = async () => {
        if (!plano || !potencial || !ultimaAvaliacao) return;
        setIsApplying(true);
        setIaEnriching(true);

        try {
            const perfil = buildPerfilIA(atleta.name, atleta.gender, atleta.birthDate, ultimaAvaliacao.measurements as Record<string, number>, ultimaAvaliacao.bf ?? 15, atleta.score, atleta.contexto);

            const diretrizes = await extrairDiretrizesDoChat(atletaId, 'dieta');
            if (diretrizes) {
                console.info('[DietaView] 🚀 Aplicando diretrizes do chat...');
                const enriquecido = await enriquecerDietaComIA(plano, perfil, diretrizes);
                setPlano(enriquecido);
            } else {
                console.warn('[DietaView] ⚠️ Nenhuma diretriz extraída do chat.');
            }
        } catch (err) {
            console.error('[DietaView] ❌ Erro ao aplicar ajustes:', err);
        } finally {
            setIsApplying(false);
            setIaEnriching(false);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar flex flex-col">
            <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-16 flex-1 w-full">

                {/* Toast inline */}
                {toastStatus && (
                    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-bold uppercase tracking-wider animate-in fade-in slide-in-from-top-4 duration-300 ${toastStatus === 'success'
                        ? 'bg-emerald-900/90 border-emerald-500/40 text-emerald-300'
                        : 'bg-red-900/90 border-red-500/40 text-red-300'
                        }`}>
                        {toastStatus === 'success'
                            ? <CheckCircle size={18} className="text-emerald-400" />
                            : <XCircle size={18} className="text-red-400" />}
                        {toastStatus === 'success' ? 'Plano de Dieta salvo com sucesso!' : 'Erro ao salvar. Tente novamente.'}
                    </div>
                )}

                {/* Page Header */}
                <div className="flex flex-col animate-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">
                        PLANO DE DIETA
                    </h2>
                    <p className="text-gray-400 mt-2 font-light text-base">
                        Etapa 3: Estratégia alimentar personalizada com base no diagnóstico e treino.
                    </p>
                </div>

                <div className="h-px w-full bg-white/10" />

                {/* Stepper */}
                <EvolutionStepper etapaAtual={3} />

                {/* Card info atleta + botão gerar */}
                <div className="bg-surface border border-white/10 rounded-2xl p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(79,70,229,0.1)]">
                                <span className="text-primary font-bold text-2xl">{atleta.name[0]}</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">{atleta.name}</h2>
                                <p className="text-sm text-gray-500 font-medium">Plano de Evolução — Dieta</p>
                            </div>
                        </div>

                        {(estado === 'idle' || estado === 'generating') && (
                            <button
                                onClick={handleGerar}
                                disabled={estado === 'generating'}
                                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all disabled:opacity-50"
                            >
                                {estado === 'generating' ? <Loader2 size={18} className="animate-spin" /> : <Salad size={18} />}
                                Gerar Plano de Dieta
                            </button>
                        )}
                    </div>

                    {/* Estrela do Norte — Objetivo (Substituindo os 4 cards antigos) */}
                    {getObjetivoMeta(objetivoAtleta || 'RECOMP') && (
                        <div className={`mt-4 rounded-2xl border p-6 ${getObjetivoMeta(objetivoAtleta || 'RECOMP').cor}`}>
                            <div className="flex items-start gap-5">
                                <span className="text-5xl leading-none mt-1">{getObjetivoMeta(objetivoAtleta || 'RECOMP').emoji}</span>
                                <div className="flex-1">
                                    <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-bold mb-1">Estrela do Norte deste Plano</p>
                                    <h3 className="text-2xl font-bold text-white mb-2">{getObjetivoMeta(objetivoAtleta || 'RECOMP').label}</h3>
                                    <p className="text-base text-gray-300 leading-relaxed mb-4">{getObjetivoMeta(objetivoAtleta || 'RECOMP').descricao}</p>
                                    <div className="flex flex-wrap gap-3">
                                        <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                                            <Flame size={12} className="text-primary" />
                                            Fase: {plano?.faseLabel?.split(' — ')[0] || (objetivoAtleta === 'CUT' ? 'CUTTING' : objetivoAtleta === 'BULK' ? 'BULKING' : 'RECOMP')}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                                            <Activity size={12} className="text-primary" />
                                            Estratégia: {objetivoAtleta === 'CUT' ? 'Déficit Calórico' : objetivoAtleta === 'BULK' ? 'Superávit Calórico' : 'Balanço Neutro'}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                                            <TrendingUp size={12} className="text-primary" />
                                            Proteína Suportada
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Estado: Ainda não gerou */}
                {estado === 'idle' && (
                    <div className="bg-surface border border-white/10 rounded-2xl p-10 text-center">
                        <Salad size={48} className="text-primary mx-auto mb-5" />
                        <h3 className="text-xl font-bold text-white mb-3">Gerar Plano de Dieta Completo</h3>
                        <p className="text-base text-gray-500 mb-8 max-w-lg mx-auto">
                            O Vitrúvio vai calcular seu déficit calórico contextual, distribuição de macros, estrutura de refeições, cardápio e checkpoints semanais.
                        </p>
                        <button
                            onClick={handleGerar}
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all"
                        >
                            <Salad size={18} /> Gerar Plano de Dieta
                        </button>
                    </div>
                )}

                {/* Estado: Gerando */}
                {estado === 'generating' && (
                    <div className="bg-surface border border-white/10 rounded-2xl p-10 text-center">
                        <Loader2 size={48} className="text-primary mx-auto mb-5 animate-spin" />
                        <h3 className="text-xl font-bold text-white mb-3">Vitrúvio calculando seu plano alimentar...</h3>
                        <p className="text-base text-gray-500">Cruzando TDEE, contexto e metas de composição corporal.</p>
                    </div>
                )}

                {/* Conteúdo gerado */}
                {plano && (estado === 'ready' || estado === 'saving' || estado === 'saved') && (
                    <>
                        {/* SEÇÃO 1: Estratégia Calórica */}
                        <SectionCard icon={Flame} title="Estratégia Calórica" subtitle="Definição do balanço energético para atingir as metas">
                            <div className="flex justify-end mb-4">
                                <EditToolbar
                                    isEditing={isEditingDieta}
                                    hasChanges={hasDietChanges}
                                    onStartEditing={startEditingDieta}
                                    onSave={handleSaveDietEdits}
                                    onDiscard={cancelEditingDieta}
                                    readOnly={isReadOnly}
                                />
                            </div>
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold uppercase tracking-widest mb-6 ${faseColor(activePlano!.fase)}`}>
                                <Target size={14} /> {activePlano!.faseLabel}
                            </div>

                            <div className="bg-white/[0.03] rounded-xl border border-white/5 p-5 mb-4">
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-4 font-bold">Cálculo do Balanço</p>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-400">TDEE (Gasto Total Diário)</span>
                                        <span className="text-white font-bold">{plano.tdee.toLocaleString('pt-BR')} kcal/dia</span>
                                    </div>
                                    <div className="border-t border-white/5 pt-3 flex justify-between items-center">
                                        <span className="text-sm text-gray-400">
                                            {plano.deficit > 0 ? 'Déficit planejado' : 'Superávit planejado'}
                                            <span className="ml-2 text-xs text-gray-600">({plano.deficitPct}% do TDEE)</span>
                                        </span>
                                        <span className={`font-bold ${plano.deficit > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                            {plano.deficit > 0 ? '-' : '+'}{Math.abs(plano.deficit)} kcal/dia
                                        </span>
                                    </div>
                                    <div className="border-t-2 border-primary/30 pt-3 flex justify-between items-center">
                                        <span className="text-sm font-bold text-white uppercase tracking-wider">Meta calórica diária (média)</span>
                                        <span className="text-2xl font-black text-primary">{plano.calMediaSemanal.toLocaleString('pt-BR')} kcal</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-white/[0.03] rounded-xl border border-white/5 p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Dumbbell size={14} className="text-primary" />
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dias de Treino</p>
                                    </div>
                                    {isEditingDieta ? (
                                        <EditableField
                                            type="number"
                                            isEditing
                                            value={editPlano?.calDiasTreino ?? 0}
                                            onChange={(v) => updateDietField('calDiasTreino', v)}
                                            min={800}
                                            max={6000}
                                            step={50}
                                            suffix=" kcal"
                                            inputClassName="text-2xl font-black"
                                        />
                                    ) : (
                                        <p className="text-2xl font-black text-white">{activePlano!.calDiasTreino.toLocaleString('pt-BR')}</p>
                                    )}
                                    <p className="text-xs text-gray-600">kcal · {activePlano!.frequenciaSemanal ?? 4}x/semana · +carbs</p>
                                </div>
                                <div className="bg-white/[0.03] rounded-xl border border-white/5 p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Scale size={14} className="text-gray-500" />
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dias de Descanso</p>
                                    </div>
                                    {isEditingDieta ? (
                                        <EditableField
                                            type="number"
                                            isEditing
                                            value={editPlano?.calDiasDescanso ?? 0}
                                            onChange={(v) => updateDietField('calDiasDescanso', v)}
                                            min={800}
                                            max={6000}
                                            step={50}
                                            suffix=" kcal"
                                            inputClassName="text-2xl font-black"
                                        />
                                    ) : (
                                        <p className="text-2xl font-black text-white">{activePlano!.calDiasDescanso.toLocaleString('pt-BR')}</p>
                                    )}
                                    <p className="text-xs text-gray-600">kcal · {7 - (activePlano!.frequenciaSemanal ?? 4)}x/semana · -carbs</p>
                                </div>
                            </div>

                            <div className="bg-white/[0.02] rounded-xl border border-white/5 p-4 mb-4">
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 font-bold">Projeção Mensal</p>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-600 text-xs mb-1">Déficit semanal</p>
                                        <p className="font-bold text-white">~{plano?.deficitSemanal?.toLocaleString('pt-BR')} kcal</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-xs mb-1">Perda de gordura estimada</p>
                                        <p className="font-bold text-rose-400">~{plano?.projecaoMensal?.perdaGorduraKg} kg/mês</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-xs mb-1">Peso no mês 1</p>
                                        <p className="font-bold text-white">{plano?.projecaoMensal?.pesoInicial} kg → {plano?.projecaoMensal?.pesoFinal} kg</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-xs mb-1">BF estimado</p>
                                        <p className="font-bold text-white">{plano?.projecaoMensal?.bfInicial}% → {plano?.projecaoMensal?.bfFinal}%</p>
                                    </div>
                                </div>
                            </div>

                            <InsightBox isLoading={iaEnriching} text={plano.insightsPorSecao?.estrategia || plano.estrategiaPrincipal} />
                        </SectionCard>

                        {/* SEÇÃO 2: Macros */}
                        <SectionCard icon={BarChart2} title="Distribuição de Macronutrientes" subtitle="Proteínas, carboidratos e gorduras para o objetivo">
                            <div className="flex gap-2 mb-5">
                                <button onClick={() => setShowDescanso(false)} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${!showDescanso ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-gray-500 border border-white/5'}`}>
                                    🏋️ Dias de Treino ({plano.calDiasTreino} kcal)
                                </button>
                                <button onClick={() => setShowDescanso(true)} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${showDescanso ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-gray-500 border border-white/5'}`}>
                                    😴 Dias de Descanso ({plano.calDiasDescanso} kcal)
                                </button>
                            </div>

                            {(() => {
                                const m = showDescanso ? plano.macrosDescanso : plano.macrosTreino;
                                return (
                                    <>
                                        <div className="grid grid-cols-3 gap-4 mb-4">
                                            <MacroCard label="Proteína" emoji="🥩" gramas={m.proteina.gramas} gKg={m.proteina.gKg} kcal={m.proteina.kcal} pct={m.proteina.pct} color="border-blue-500/20" />
                                            <MacroCard label="Carboidrato" emoji="🍚" gramas={m.carboidrato.gramas} gKg={m.carboidrato.gKg} kcal={m.carboidrato.kcal} pct={m.carboidrato.pct} color="border-amber-500/20" />
                                            <MacroCard label="Gordura" emoji="🥑" gramas={m.gordura.gramas} gKg={m.gordura.gKg} kcal={m.gordura.kcal} pct={m.gordura.pct} color="border-rose-500/20" />
                                        </div>
                                        <div className="mb-2 flex gap-4 text-xs text-gray-500">
                                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500/70 inline-block" /> Proteína {m.proteina.pct}%</span>
                                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-500/70 inline-block" /> Carbo {m.carboidrato.pct}%</span>
                                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-rose-500/70 inline-block" /> Gordura {m.gordura.pct}%</span>
                                        </div>
                                        <MacroBar macros={m} />
                                    </>
                                );
                            })()}

                            <div className="mt-6 space-y-3">
                                {[
                                    { icon: '🥩', label: 'Proteína', text: plano.justificativaMacros.proteina, color: 'border-blue-500/10 bg-blue-500/5' },
                                    { icon: '🍚', label: 'Carboidrato', text: plano.justificativaMacros.carboidrato, color: 'border-amber-500/10 bg-amber-500/5' },
                                    { icon: '🥑', label: 'Gordura', text: plano.justificativaMacros.gordura, color: 'border-rose-500/10 bg-rose-500/5' },
                                ].map(j => (
                                    <div key={j.label} className={`rounded-xl border p-4 ${j.color}`}>
                                        <p className="text-xs font-bold text-gray-400 mb-1">{j.icon} {j.label}</p>
                                        <p className="text-sm text-gray-400 leading-relaxed">{j.text}</p>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>

                        {/* SEÇÃO 3: Refeições */}
                        <SectionCard icon={UtensilsCrossed} title="Estrutura de Refeições" subtitle="Distribuição dos macros ao longo do dia">
                            <div className="flex gap-2 mb-5">
                                <button onClick={() => setShowDescanso(false)} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${!showDescanso ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-gray-500 border border-white/5'}`}>
                                    🏋️ Dias de Treino
                                </button>
                                <button onClick={() => setShowDescanso(true)} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${showDescanso ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-gray-500 border border-white/5'}`}>
                                    😴 Dias de Descanso
                                </button>
                            </div>
                            <TabelaRefeicoes
                                refeicoes={showDescanso
                                    ? (isEditingDieta ? editPlano!.refeicoesDescanso : plano.refeicoesDescanso)
                                    : (isEditingDieta ? editPlano!.refeicoesTreino : plano.refeicoesTreino)}
                                isEditing={isEditingDieta}
                                onUpdateRefeicoes={(updated) => {
                                    if (!isEditingDieta) return;
                                    const field = showDescanso ? 'refeicoesDescanso' : 'refeicoesTreino';
                                    updateEditPlano(prev => prev ? { ...prev, [field]: updated } : prev);
                                }}
                            />

                            <div className="mt-6 bg-white/[0.02] rounded-xl border border-white/5 p-5">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">🍕 Refeição Livre</p>
                                <ul className="space-y-2">
                                    {plano?.refeicaoLivreOrientacoes?.map((o, i) => (
                                        <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                                            <span className="text-primary mt-1">•</span> {o}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </SectionCard>

                        {/* SEÇÃO 4: Cardápio */}
                        <SectionCard icon={LayoutList} title="Exemplo de Cardápio" subtitle="Clique em cada refeição para ver as opções">
                            <div className="divide-y divide-white/5 rounded-xl overflow-hidden border border-white/5">
                                {plano?.cardapio?.map((refeicao, idx) => {
                                    const isOpen = cardapioAberto.has(refeicao.nome);
                                    return (
                                        <div key={refeicao.nome}>
                                            {/* Header do accordion */}
                                            <button
                                                onClick={() => toggleCardapio(refeicao.nome)}
                                                className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors ${isOpen ? 'bg-primary/5' : 'bg-white/[0.02] hover:bg-white/[0.04]'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isOpen ? 'bg-primary' : 'bg-gray-600'}`} />
                                                    <span className="text-sm font-bold text-white">{refeicao.nome}</span>
                                                    <span className="text-xs text-gray-600">{refeicao.macros}</span>
                                                </div>
                                                <ChevronDown
                                                    size={16}
                                                    className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : ''}`}
                                                />
                                            </button>

                                            {/* Corpo expandido */}
                                            {isOpen && (
                                                <div className="px-5 pb-5 pt-4 bg-white/[0.01] animate-in fade-in slide-in-from-top-1 duration-200">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {refeicao.opcoes?.map((opcao) => (
                                                            <div key={opcao.letra} className="bg-white/[0.03] rounded-xl border border-white/[0.05] p-4">
                                                                <p className="text-xs font-black text-primary/70 uppercase tracking-widest mb-3">Opção {opcao.letra}</p>
                                                                <ul className="space-y-1.5">
                                                                    {opcao.itens?.map((item, i) => (
                                                                        <li key={i} className="text-sm text-gray-400 flex items-start gap-1.5">
                                                                            <span className="text-gray-600 mt-0.5">•</span> {item}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 grid grid-cols-3 gap-3">
                                {[
                                    { label: '🥩 Proteínas', items: plano.alimentosSugeridos.proteinas, color: 'border-blue-500/10' },
                                    { label: '🍚 Carboidratos', items: plano.alimentosSugeridos.carboidratos, color: 'border-amber-500/10' },
                                    { label: '🥑 Gorduras', items: plano.alimentosSugeridos.gorduras, color: 'border-rose-500/10' },
                                ].map(g => (
                                    <div key={g.label} className={`bg-white/[0.02] rounded-xl border p-4 ${g.color}`}>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{g.label}</p>
                                        <ul className="space-y-1.5">
                                            {g.items.map((item, i) => (
                                                <li key={i} className="text-sm text-gray-400 flex items-start gap-1.5">
                                                    <span className="text-gray-600">•</span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>

                        {/* SEÇÃO 5: Checkpoints */}
                        <SectionCard icon={Calendar} title="Checkpoints e Ajustes" subtitle="Monitoramento semanal e regras de ajuste">
                            <div className="overflow-x-auto mb-6">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="text-left text-xs text-gray-500 uppercase tracking-widest font-bold pb-3 pr-4">Semana</th>
                                            <th className="text-left text-xs text-gray-500 uppercase tracking-widest font-bold pb-3 pr-4">Fase</th>
                                            <th className="text-right text-xs text-gray-500 uppercase tracking-widest font-bold pb-3 pr-4">Peso Esperado</th>
                                            <th className="text-left text-xs text-gray-500 uppercase tracking-widest font-bold pb-3">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.03]">
                                        {plano.checkpoints.map((c, i) => (
                                            <tr key={i} className="hover:bg-white/[0.02]">
                                                <td className="py-3 pr-4 text-gray-500 text-sm">{c.semana}</td>
                                                <td className="py-3 pr-4 text-gray-300 font-medium text-sm">{c.label}</td>
                                                <td className="py-3 pr-4 text-right font-bold text-white text-sm">
                                                    {c.pesoEsperado} kg
                                                    {c.tolerancia > 0 && <span className="text-gray-600 text-xs"> ±{c.tolerancia}</span>}
                                                </td>
                                                <td className="py-3 text-sm text-gray-400">{c.acao}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-emerald-500/5 rounded-xl border border-emerald-500/10 p-4">
                                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">✅ Fazer</p>
                                    <ul className="space-y-2">
                                        {plano.comoPesar.fazer.map((f, i) => (
                                            <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                                                <span className="text-emerald-500 mt-0.5">•</span> {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-red-500/5 rounded-xl border border-red-500/10 p-4">
                                    <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">❌ Não Fazer</p>
                                    <ul className="space-y-2">
                                        {plano.comoPesar.naoFazer.map((f, i) => (
                                            <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                                                <span className="text-red-500 mt-0.5">•</span> {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">🔧 Regras de Ajuste</p>
                                <div className="space-y-2">
                                    {plano.regrasAjuste.map((r, i) => {
                                        const colorMap = { ok: 'border-emerald-500/20 bg-emerald-500/5', warning: 'border-amber-500/20 bg-amber-500/5', danger: 'border-red-500/20 bg-red-500/5' };
                                        const Icon = r.tipo === 'ok' ? CheckCircle : r.tipo === 'warning' ? AlertTriangle : XCircle;
                                        const iconColor = r.tipo === 'ok' ? 'text-emerald-400' : r.tipo === 'warning' ? 'text-amber-400' : 'text-red-400';
                                        return (
                                            <div key={i} className={`rounded-xl border p-4 flex items-start gap-3 ${colorMap[r.tipo]}`}>
                                                <Icon size={16} className={`${iconColor} mt-0.5 shrink-0`} />
                                                <div>
                                                    <p className="text-sm text-gray-300 font-medium">{r.cenario}</p>
                                                    <p className="text-sm text-gray-500 mt-0.5">{r.ajuste}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">📈 Outros Indicadores</p>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/5">
                                                <th className="text-left text-xs text-gray-600 pb-2 pr-4">Indicador</th>
                                                <th className="text-left text-xs text-gray-600 pb-2 pr-4">Frequência</th>
                                                <th className="text-left text-xs text-gray-600 pb-2">Esperado</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/[0.03]">
                                            {plano.outrosIndicadores.map((o, i) => (
                                                <tr key={i}>
                                                    <td className="py-2.5 pr-4 text-gray-300">{o.indicador}</td>
                                                    <td className="py-2.5 pr-4 text-gray-500">{o.frequencia}</td>
                                                    <td className="py-2.5 text-gray-500">{o.esperado}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </SectionCard>

                        {/* SEÇÃO 6: Considerações do Vitrúvio */}
                        <SectionCard icon={Award} title="Considerações do Vitrúvio" subtitle="Resumo final e próximos passos">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                {plano.pontosAtencao.map((p, i) => (
                                    <div key={i} className="bg-white/[0.02] rounded-xl border border-white/5 p-4">
                                        <p className="text-xs font-bold text-white mb-2">{p.titulo}</p>
                                        <p className="text-xs text-gray-500 leading-relaxed">{p.descricao}</p>
                                    </div>
                                ))}
                            </div>

                            {plano.contextoConsiderado.length > 0 && (
                                <div className="bg-white/[0.02] rounded-xl border border-white/5 p-5 mb-6">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">📊 Contexto Considerado no Plano</p>
                                    <ul className="space-y-2">
                                        {plano.contextoConsiderado.map((c, i) => (
                                            <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                                                <span className="text-primary mt-0.5">•</span> {c}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="bg-primary/5 border border-primary/15 rounded-xl p-5 mb-6">
                                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3">✅ Próximos Passos</p>
                                <ol className="space-y-1.5">
                                    {plano.proximosPassos.map((p, i) => (
                                        <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                                            <span className="text-primary font-bold shrink-0">{i + 1}.</span> {p}
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            {plano.observacoesContexto.length > 0 && (
                                <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-5 mb-6">
                                    <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-3">⚠️ Alertas do Contexto</p>
                                    <ul className="space-y-2">
                                        {plano.observacoesContexto.map((a, i) => (
                                            <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                                                <span className="text-amber-400 mt-0.5 shrink-0">•</span> {a}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <InsightBox isLoading={iaEnriching} text={plano.mensagemFinal} title="Mensagem Final do Vitrúvio" />
                        </SectionCard>

                        {/* Chat Vitrúvio IA — Debater plano */}
                        <ChatPlanoEvolucao
                            tipo="dieta"
                            atletaId={atletaId}
                            nomeAtleta={atleta.name}
                            planoTexto={dietaParaTexto(plano)}
                            perfilTexto={perfilParaTexto({
                                nome: atleta.name,
                                sexo: (atleta.gender === 'FEMALE' ? 'F' : 'M') as 'M' | 'F',
                                idade: atleta.birthDate ? Math.floor((Date.now() - new Date(atleta.birthDate).getTime()) / 31557600000) : 30,
                                altura: ultimaAvaliacao?.measurements?.height || 170,
                                peso: ultimaAvaliacao?.measurements?.weight || 70,
                                gorduraPct: ultimaAvaliacao?.bf ?? 15,
                                score: atleta.score,
                                classificacao: atleta.score >= 90 ? 'ELITE' : atleta.score >= 80 ? 'AVANÇADO' : atleta.score >= 70 ? 'ATLÉTICO' : atleta.score >= 60 ? 'INTERMEDIÁRIO' : 'INICIANTE',
                                medidas: (ultimaAvaliacao?.measurements as Record<string, number>) || {},
                                contexto: atleta.contexto as unknown as Record<string, unknown>,
                            })}
                            fontesCientificas={getFontesCientificas('dieta')}
                        />

                        {/* Ações de Navegação */}
                        <div className="flex items-center justify-between pt-10 border-t border-white/10 mt-8">
                            <button
                                onClick={onBack}
                                className="flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wider text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                            >
                                <ArrowLeft size={18} /> Voltar
                            </button>

                            {!isReadOnly && (
                                <div className="flex items-center gap-4">
                                    {estado === 'ready' && (
                                        <button
                                            onClick={handleSalvar}
                                            className="flex items-center gap-3 px-8 py-3.5 bg-emerald-600 text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all"
                                        >
                                            <Save size={18} /> Confirmar e Salvar
                                        </button>
                                    )}
                                    {estado === 'saving' && (
                                        <button disabled className="flex items-center gap-3 px-8 py-3.5 bg-gray-800 text-gray-500 font-bold text-sm uppercase tracking-wider rounded-xl">
                                            <Loader2 size={18} className="animate-spin" /> Salvando...
                                        </button>
                                    )}
                                    {estado === 'saved' && (
                                        <div className="flex flex-col items-end gap-1">
                                            <button
                                                onClick={onComplete || onBack}
                                                className="flex items-center gap-3 px-8 py-3.5 bg-primary text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all"
                                            >
                                                <CheckCircle size={18} /> Concluir Plano
                                            </button>
                                            <p className="text-[10px] text-gray-600">Diagnóstico ✓ · Treino ✓ · Dieta ✓</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
