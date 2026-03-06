/**
 * TreinoView - Tela de Plano de Treino (Etapa 2 do Plano de Evolução)
 * 
 * Tela padrão da aplicação com:
 * - Stepper de progresso (etapa 2 ativa)
 * - Info do atleta selecionado
 * - 6 seções: Resumo Diagnóstico, Visão Anual, Trimestre Atual, Divisão, Treinos Semanais, Observações
 * - Footer com navegação
 * 
 * @see docs/specs/plano-evolucao-etapa-2-treino.md
 */

import React, { useState, useMemo } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    Stethoscope,
    Dumbbell,
    Salad,
    Check,
    Flame,
    Activity,
    Zap,
    Target,
    TrendingUp,
    Calendar,
    Bot,
    Loader2,
    Save,
    Clock,
    Award,
    LayoutGrid,
    ChevronRight,
    Search,
    BookOpen,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import { useDataStore } from '@/stores/dataStore';
import {
    gerarDiagnosticoCompleto,
    type DiagnosticoDados,
    type DiagnosticoInput,
} from '@/services/calculations/diagnostico';
import {
    gerarPlanoTreino,
    salvarPlanoTreino,
    enriquecerTreinoComIA,
    type PlanoTreino,
    type TreinoDetalhado,
    type VolumePorGrupo
} from '@/services/calculations/treino';
import {
    calcularPotencialAtleta,
    type PotencialAtleta,
} from '@/services/calculations/potencial';
import {
    recomendarObjetivo,
    getObjetivoMeta,
    type ObjetivoVitruvio,
} from '@/services/calculations/objetivos';
import { ChatPlanoEvolucao } from '@/components/organisms/ChatPlanoEvolucao/ChatPlanoEvolucao';
import { perfilParaTexto, treinoParaTexto, getFontesCientificas } from '@/services/vitruviusContext';
import { extrairDiretrizesDoChat } from '@/services/vitruviusAI';
import { useEditableState } from '@/hooks/useEditableState';
import { EditToolbar } from '@/components/molecules/EditToolbar/EditToolbar';
import { SecaoTreinosEditavel } from '@/components/organisms/SecaoTreinosEditavel/SecaoTreinosEditavel';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface TreinoViewProps {
    atletaId: string;
    onBack: () => void;
    onNext: () => void;
    diagnosticoId?: string;
    readOnlyData?: PlanoTreino;
}

type TreinoState = 'idle' | 'generating' | 'ready' | 'saving' | 'saved';


// ═══════════════════════════════════════════════════════════
// EXTRACTED SHARED + SECTIONS
// ═══════════════════════════════════════════════════════════
import { EvolutionStepper, SectionCard, InsightBox } from './PlanoEvolucaoShared';
import { SecaoResumoDiagnostico, SecaoVisaoAnual, SecaoTrimestreAtual, SecaoDivisao, SecaoTreinosSemanais } from './treino/TreinoSections';
import { getClassificacao, buildPerfilIA, gerarDiagnosticoLocal } from './PlanoEvolucaoHelpers';


// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════

export const TreinoView: React.FC<TreinoViewProps> = ({
    atletaId,
    onBack,
    onNext,
    diagnosticoId,
    readOnlyData,
}) => {
    const { personalAthletes } = useDataStore();
    const atleta = useMemo(() => personalAthletes.find(a => a.id === atletaId), [personalAthletes, atletaId]);

    const isReadOnly = !!readOnlyData;
    // Pegar dados da última avaliação (mesmo que DiagnosticoView)
    const ultimaAvaliacao = useMemo(() => {
        if (!atleta || atleta.assessments.length === 0) return null;
        return atleta.assessments[0];
    }, [atleta]);

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

    const [plano, setPlano] = useState<PlanoTreino | null>(readOnlyData ?? null);
    const [diagnostico, setDiagnostico] = useState<DiagnosticoDados | null>(null);
    const [potencial, setPotencial] = useState<PotencialAtleta | null>(null);
    const [estado, setEstado] = useState<TreinoState>(readOnlyData ? 'saved' : 'idle');
    const [objetivoAtleta, setObjetivoAtleta] = useState<ObjetivoVitruvio>(
        readOnlyData?.objetivo || recomendacaoPadrao?.objetivo || 'RECOMP'
    );
    const [toastStatus, setToastStatus] = useState<'success' | 'error' | null>(null);
    const [iaEnriching, setIaEnriching] = useState(false);
    const [isApplying, setIsApplying] = useState(false);

    // ── Edição inline do treino ──
    const {
        isEditing: isEditingTreino,
        editData: editTreinos,
        hasChanges: hasTrainingChanges,
        startEditing: startEditingTreino,
        cancelEditing: cancelEditingTreino,
        commitEditing: commitEditingTreino,
        updateEditData: updateEditTreinos,
    } = useEditableState<TreinoDetalhado[]>(plano?.treinos ?? []);

    const handleSaveEdits = async () => {
        if (!plano) return;
        const editedTreinos = commitEditingTreino();
        const updatedPlano = { ...plano, treinos: editedTreinos };
        setPlano(updatedPlano);

        if (isReadOnly) {
            const personalId = atleta.personalId ?? null;
            const result = await salvarPlanoTreino(atletaId, personalId, updatedPlano, diagnosticoId);

            if (result) {
                setToastStatus('success');
            } else {
                setToastStatus('error');
            }
            setTimeout(() => setToastStatus(null), 3000);
        }
    };

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

    /** Gera o diagnóstico (mesmo input determinístico do DiagnosticoView) */
    /** Gera o diagnóstico usando helper compartilhado */
    const gerarDiag = (pot: PotencialAtleta): DiagnosticoDados => {
        if (!ultimaAvaliacao) throw new Error('No assessment available');
        return gerarDiagnosticoLocal(
            atleta,
            ultimaAvaliacao.measurements as Record<string, unknown>,
            ultimaAvaliacao.bf ?? 15,
            pot,
            'SEDENTARIO',
            ultimaAvaliacao.proporcoes,
        );
    };

    /** Gera o plano de treino — pipeline completo: Potencial → Diagnóstico → Treino */
    const handleGerar = () => {
        if (!ultimaAvaliacao) return;
        setEstado('generating');
        setTimeout(() => {
            // 1. Calcular potencial do atleta (contexto + classificação)
            const classificacao = getClassificacao(atleta.score);
            const pot = calcularPotencialAtleta(classificacao, atleta.score, atleta.contexto ?? undefined);
            setPotencial(pot);

            // 2. Reanalisar diagnóstico com o potencial (score meta dinâmico)
            const diag = gerarDiag(pot);
            setDiagnostico(diag);

            // 3. Calcular objetivo recomendado (mesmo algoritmo do Diagnóstico)
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

            // 4. Gerar treino consumindo o potencial como fonte única + objetivo + contexto + sexo
            const resultado = gerarPlanoTreino(atletaId, atleta.name, diag, pot, rec.objetivo, atleta.contexto ?? undefined, atleta.gender === 'FEMALE' ? 'F' : 'M');
            setPlano(resultado);
            setEstado('ready');

            // Enriquecer com IA em background
            setIaEnriching(true);
            const perfil = buildPerfilIA(atleta.name, atleta.gender, atleta.birthDate, ultimaAvaliacao.measurements as Record<string, number>, ultimaAvaliacao.bf ?? 15, atleta.score, atleta.contexto ?? undefined);
            console.info('[TreinoView] 🚀 Iniciando enriquecimento IA...');
            enriquecerTreinoComIA(resultado, perfil)
                .then(enriquecido => {
                    if (enriquecido !== resultado) {
                        console.info('[TreinoView] 🤖 Treino enriquecido com IA!', {
                            temInsights: !!enriquecido.insightsPorSecao,
                            mensagemFinal: enriquecido.observacoes?.mensagemFinal?.substring(0, 50) + '...',
                        });
                        setPlano(enriquecido);
                    } else {
                        console.warn('[TreinoView] ⚠️ IA retornou mesmo objeto (falha?)');
                    }
                })
                .catch(err => console.error('[TreinoView] ❌ Erro IA:', err))
                .finally(() => setIaEnriching(false));
        }, 1800);
    };

    /** Salva o plano no Supabase */
    const handleSalvar = async () => {
        if (!plano) return;
        setEstado('saving');

        const personalId = atleta.personalId ?? null;
        const result = await salvarPlanoTreino(atletaId, personalId, plano, diagnosticoId);

        if (!result) {
            console.error('[Treino] ❌ Erro ao salvar no banco.');
            setToastStatus('error');
            setEstado('ready');
            setTimeout(() => setToastStatus(null), 4000);
            return;
        }

        console.info('[Treino] ✅ Plano salvo:', result.id);
        setToastStatus('success');
        setEstado('saved');
        setTimeout(() => setToastStatus(null), 3000);
    };

    /** Extrai diretrizes do chat e reprocessa o plano com IA */
    const handleAplicarAjustes = async () => {
        if (!plano || !potencial) return;
        setIsApplying(true);
        setIaEnriching(true);

        try {
            const perfil = buildPerfilIA(atleta.name, atleta.gender, atleta.birthDate, ultimaAvaliacao!.measurements as Record<string, number>, ultimaAvaliacao!.bf ?? 15, atleta.score, atleta.contexto ?? undefined);

            const diretrizes = await extrairDiretrizesDoChat(atletaId, 'treino');
            if (diretrizes) {
                console.info('[TreinoView] 🚀 Aplicando diretrizes do chat...');
                const enriquecido = await enriquecerTreinoComIA(plano, perfil, diretrizes);
                setPlano(enriquecido);
            } else {
                console.warn('[TreinoView] ⚠️ Nenhuma diretriz extraída do chat.');
            }
        } catch (err) {
            console.error('[TreinoView] ❌ Erro ao aplicar ajustes:', err);
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
                        {toastStatus === 'success' ? 'Plano de Treino salvo com sucesso!' : 'Erro ao salvar. Tente novamente.'}
                    </div>
                )}
                {/* Page Header */}
                <div className="flex flex-col animate-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">
                        PLANO DE TREINO
                    </h2>
                    <p className="text-gray-400 mt-2 font-light text-base">
                        Etapa 2: Periodização anual e fichas detalhadas baseadas nas metas do diagnóstico.
                    </p>
                </div>

                <div className="h-px w-full bg-white/10" />

                {/* Stepper */}
                <EvolutionStepper etapaAtual={2} />

                {/* Card info atleta */}
                <div className="bg-surface border border-white/10 rounded-2xl p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(0,201,167,0.1)]">
                                <span className="text-primary font-bold text-2xl">{atleta.name[0]}</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">{atleta.name}</h2>
                                <p className="text-sm text-gray-500 font-medium">Plano de Evolução — Treino Trimestral</p>
                            </div>
                        </div>

                        {(estado === 'idle' || estado === 'generating') && (
                            <button
                                onClick={handleGerar}
                                disabled={estado === 'generating'}
                                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-[#0A0F1C] font-bold text-sm uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(0,201,167,0.3)] transition-all disabled:opacity-50"
                            >
                                {estado === 'generating' ? <Loader2 size={18} className="animate-spin" /> : <Dumbbell size={18} />}
                                Gerar Plano de Treino
                            </button>
                        )}
                    </div>

                    {/* Estrela do Norte — Objetivo (Substituindo os 4 cards antigos) */}
                    {getObjetivoMeta(objetivoAtleta || 'RECOMP') && (
                        <div className={`mt-6 rounded-2xl border p-6 ${getObjetivoMeta(objetivoAtleta || 'RECOMP').cor}`}>
                            <div className="flex items-start gap-5">
                                <span className="text-5xl leading-none mt-1">{getObjetivoMeta(objetivoAtleta || 'RECOMP').emoji}</span>
                                <div className="flex-1">
                                    <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-bold mb-1">Estrela do Norte deste Plano</p>
                                    <h3 className="text-2xl font-bold text-white mb-2">{getObjetivoMeta(objetivoAtleta || 'RECOMP').label}</h3>
                                    <p className="text-sm text-gray-300 leading-relaxed mb-4">{getObjetivoMeta(objetivoAtleta || 'RECOMP').descricao}</p>
                                    <div className="flex flex-wrap gap-3">
                                        <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                                            <Activity size={12} className="text-primary" />
                                            Rep Range: {(() => {
                                                const o = objetivoAtleta;
                                                return o === 'BULK' ? '5-7 → 10-12' : o === 'CUT' ? '10-12 → 15-20' : o === 'MAINTAIN' ? '10-12 → 15-20' : '8-10 → 12-15';
                                            })()}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                                            <Clock size={12} className="text-primary" />
                                            Descanso: {objetivoAtleta === 'BULK' ? '75-120s' : objetivoAtleta === 'CUT' || objetivoAtleta === 'MAINTAIN' ? '40-75s' : '50-90s'}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                                            <TrendingUp size={12} className="text-primary" />
                                            Volume: {objetivoAtleta === 'BULK' ? '+5% base' : objetivoAtleta === 'CUT' ? '-10% base' : objetivoAtleta === 'MAINTAIN' ? '-25% base' : 'base'}
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
                        <Dumbbell size={48} className="text-primary mx-auto mb-5" />
                        <h3 className="text-xl font-bold text-white mb-3">Gerar Plano de Treino Completo</h3>
                        <p className="text-sm text-gray-500 mb-8 max-w-lg mx-auto">
                            O Vitrúvio vai calcular sua periodização anual, divisão semanal, fichas detalhadas e volume calibrado com base no diagnóstico.
                        </p>
                        <button
                            onClick={handleGerar}
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-[#0A0F1C] font-bold text-sm uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(0,201,167,0.3)] transition-all"
                        >
                            <Dumbbell size={18} /> Gerar Plano de Treino
                        </button>
                    </div>
                )}

                {/* Estado: Gerando */}
                {estado === 'generating' && (
                    <div className="bg-surface border border-white/10 rounded-2xl p-10 text-center">
                        <Loader2 size={48} className="text-primary mx-auto mb-5 animate-spin" />
                        <h3 className="text-xl font-bold text-white mb-3">Vitrúvio montando seu plano...</h3>
                        <p className="text-sm text-gray-500">Cruzando prioridades do diagnóstico com metas de 12 meses e periodização.</p>
                    </div>
                )}

                {/* Conteúdo Gerado — cards soltos, igual Dieta/Diagnóstico */}
                {plano && (isReadOnly || diagnostico) && (estado === 'ready' || estado === 'saving' || estado === 'saved') && (
                    <div className="animate-in fade-in duration-500 flex flex-col gap-0">

                        {diagnostico && <SecaoResumoDiagnostico diagnostico={diagnostico} potencial={potencial ?? undefined} insightIA={plano.insightsPorSecao?.resumoDiagnostico} isLoading={iaEnriching} />}
                        <SecaoVisaoAnual plano={plano} />
                        <SecaoTrimestreAtual plano={plano} />
                        <SecaoDivisao treinos={isEditingTreino ? editTreinos : plano.treinos} />
                        {/* Seção 5: Treinos — editável */}
                        <SectionCard icon={BookOpen} title="Treinos da Semana" subtitle="Fichas detalhadas de exercícios e técnicas avançadas">
                            <div className="flex justify-end mb-4">
                                <EditToolbar
                                    isEditing={isEditingTreino}
                                    hasChanges={hasTrainingChanges}
                                    onStartEditing={startEditingTreino}
                                    onSave={handleSaveEdits}
                                    onDiscard={cancelEditingTreino}
                                />
                            </div>
                            <SecaoTreinosEditavel
                                treinos={isEditingTreino ? editTreinos : plano.treinos}
                                isEditing={isEditingTreino}
                                onUpdateTreinos={(updated) => updateEditTreinos(() => updated)}
                            />
                        </SectionCard>

                        <SectionCard icon={Award} title="Instruções de Sucesso" subtitle="Diretrizes metodológicas para garantir os resultados planejados">
                            <div className="space-y-4">
                                <div className="bg-white/[0.03] p-5 rounded-xl border border-white/5">
                                    <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-3 font-bold">Resumo Metodológico</p>
                                    <p className="text-sm text-gray-300 leading-relaxed">{plano.observacoes.resumo}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-red-500/5 p-5 rounded-xl border border-red-500/10">
                                        <p className="text-[10px] uppercase tracking-widest text-red-400 mb-3 font-bold">⚠️ Pontos de Atenção</p>
                                        <ul className="space-y-2">
                                            {plano.observacoes.pontosAtencao.map((p, i) => (
                                                <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                                                    <span className="text-red-400 mt-1">•</span> {p}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-primary/5 p-5 rounded-xl border border-primary/10">
                                        <p className="text-[10px] uppercase tracking-widest text-primary mb-3 font-bold">✅ Alinhamento Vitruviano</p>
                                        <p className="text-sm text-gray-400">
                                            {plano.observacoes.alinhamentoMetodologia
                                                ? 'Protocolo 100% alinhado com as diretrizes de hipertrofia máxima e proporção áurea.'
                                                : plano.observacoes.sugestaoForaMetodologia}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <InsightBox isLoading={iaEnriching} text={plano.observacoes.mensagemFinal} title="Mensagem do Vitrúvio" />
                        </SectionCard>

                        {/* Chat Vitrúvio IA — Debater plano */}
                        <ChatPlanoEvolucao
                            tipo="treino"
                            atletaId={atletaId}
                            nomeAtleta={atleta.name}
                            planoTexto={treinoParaTexto(plano)}
                            perfilTexto={perfilParaTexto({
                                nome: atleta.name,
                                sexo: (atleta.gender === 'FEMALE' ? 'F' : 'M') as 'M' | 'F',
                                idade: atleta.birthDate ? Math.floor((Date.now() - new Date(atleta.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 30,
                                altura: ultimaAvaliacao?.measurements?.height || 170,
                                peso: ultimaAvaliacao?.measurements?.weight || 70,
                                gorduraPct: ultimaAvaliacao?.bf ?? 15,
                                score: atleta.score,
                                classificacao: atleta.score >= 90 ? 'ELITE' : atleta.score >= 80 ? 'AVANÇADO' : atleta.score >= 70 ? 'ATLÉTICO' : atleta.score >= 60 ? 'INTERMEDIÁRIO' : 'INICIANTE',
                                medidas: (ultimaAvaliacao?.measurements as Record<string, number>) || {},
                                contexto: atleta.contexto as unknown as Record<string, unknown>,
                            })}
                            fontesCientificas={getFontesCientificas('treino')}
                        />

                        {/* Navegação bottom */}
                        <div className="flex items-center justify-between pt-10 border-t border-white/10">
                            <button
                                onClick={onBack}
                                className="flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wider text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                            >
                                <ArrowLeft size={18} />
                                Voltar
                            </button>
                            {!isReadOnly ? (
                                <div className="flex items-center gap-4">
                                    {estado === 'ready' && (
                                        <button onClick={handleSalvar} className="flex items-center gap-3 px-8 py-3.5 bg-emerald-600 text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-emerald-500 transition-all">
                                            <Save size={18} /> Confirmar e Salvar
                                        </button>
                                    )}
                                    {estado === 'saving' && (
                                        <button disabled className="flex items-center gap-3 px-8 py-3.5 bg-gray-800 text-gray-500 font-bold text-sm uppercase tracking-wider rounded-xl">
                                            <Loader2 size={18} className="animate-spin" /> Salvando...
                                        </button>
                                    )}
                                    {estado === 'saved' && (
                                        <button onClick={onNext} className="flex items-center gap-3 px-8 py-3.5 bg-primary text-[#0A0F1C] font-bold text-sm uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(0,201,167,0.3)] transition-all">
                                            Próximo: Plano de Dieta <ArrowRight size={18} />
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={onNext}
                                    className="flex items-center gap-3 px-8 py-3.5 bg-primary text-[#0A0F1C] font-bold text-sm uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(0,201,167,0.3)] transition-all"
                                >
                                    Próximo: Plano de Dieta
                                    <ArrowRight size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
