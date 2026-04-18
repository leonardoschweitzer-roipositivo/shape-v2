/**
 * DiagnosticoView - Tela de Diagnóstico (Etapa 1 do Plano de Evolução)
 * 
 * Tela padrão da aplicação com:
 * - Stepper de progresso (3 etapas)
 * - Info do atleta selecionado
 * - 5 seções: Taxas, Composição, Estética, Fortes/Fracos, Metas
 * - Footer com navegação
 * 
 * @see docs/specs/plano-evolucao-etapa-1-diagnostico.md
 */

import React, { useState, useMemo, useEffect } from 'react';
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
    TrendingDown,
    BarChart3,
    Star,
    AlertTriangle,
    Award,
    Calendar,
    Bot,
    Loader2,
    Save,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import { useDataStore } from '@/stores/dataStore';
import {
    gerarDiagnosticoCompleto,
    enriquecerDiagnosticoComIA,
    salvarDiagnostico,
    type DiagnosticoDados,
    type DiagnosticoInput,
} from '@/services/calculations/diagnostico';
import { calcularPotencialAtleta, inferirNivelAtividade } from '@/services/calculations/potencial';
import {
    recomendarObjetivo,
    getObjetivoMeta,
    mapLegacyToVitruvio,
    TODOS_OBJETIVOS,
    type RecomendacaoObjetivo,
    type ObjetivoVitruvio,
} from '@/services/calculations/objetivos';
import { supabase } from '@/services/supabase';
import { ScoreWidget } from '@/components/organisms/AssessmentCards/ScoreWidget';
import { colors } from '@/tokens';
import { type ContextoAtleta } from './AthleteContextSection';
import { getClassificacao } from './PlanoEvolucaoHelpers';
import { gerarConteudoIA } from '@/services/vitruviusAI';
import { type PerfilAtletaIA, perfilParaTexto, getFontesCientificas, diagnosticoParaTexto } from '@/services/vitruviusContext';
import { buildAnaliseContextoPrompt } from '@/services/vitruviusPrompts';
import { ChatPlanoEvolucao } from '@/components/organisms/ChatPlanoEvolucao/ChatPlanoEvolucao';
import { extrairDiretrizesDoChat } from '@/services/vitruviusAI';
import { useEditableState } from '@/hooks/useEditableState';
import { EditToolbar } from '@/components/molecules/EditToolbar/EditToolbar';
import { EditableField } from '@/components/atoms/EditableField/EditableField';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface DiagnosticoViewProps {
    atletaId: string;
    onBack: () => void;
    onNext: (diagnosticoId?: string) => void;
    readOnlyData?: DiagnosticoDados;
}

type DiagnosticoState = 'idle' | 'generating' | 'ready' | 'saving' | 'saved';

// ═══════════════════════════════════════════════════════════
// EXTRACTED SUBCOMPONENTS & HELPERS
// ═══════════════════════════════════════════════════════════
import {
    EvolutionStepper, MetricCard, InsightBox, RefsBox,
    ProgressBar, SectionCard, SecaoTaxas, SecaoComposicao,
    SecaoEstetica, SecaoPrioridades, SecaoMetas,
} from './diagnostico/DiagnosticoSections';
import { generateGeneralAnalysis, getScoreClassification } from './diagnostico/diagnosticoHelpers';

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════

export const DiagnosticoView: React.FC<DiagnosticoViewProps> = ({
    atletaId,
    onBack,
    onNext,
    readOnlyData,
}) => {
    const { personalAthletes } = useDataStore();
    const atleta = useMemo(() => personalAthletes.find(a => a.id === atletaId), [personalAthletes, atletaId]);

    const isReadOnly = !!readOnlyData;
    const [diagnostico, setDiagnostico] = useState<DiagnosticoDados | null>(readOnlyData ?? null);
    const [estado, setEstado] = useState<DiagnosticoState>(readOnlyData ? 'saved' : 'idle');
    const [recomendacao, setRecomendacao] = useState<RecomendacaoObjetivo | null>(null);
    const [objetivoSelecionado, setObjetivoSelecionado] = useState<ObjetivoVitruvio | null>(null);
    const [toastStatus, setToastStatus] = useState<'success' | 'error' | null>(null);
    const [iaEnriching, setIaEnriching] = useState(false);
    const [analiseContextoIA, setAnaliseContextoIA] = useState<string | null>(null);
    const [contextLoading, setContextLoading] = useState(true);
    const [isApplying, setIsApplying] = useState(false);

    // ── Edição inline do diagnóstico (metas e prioridades) ──
    const {
        isEditing: isEditingDiag,
        editData: editDiag,
        hasChanges: hasDiagChanges,
        startEditing: startEditingDiag,
        cancelEditing: cancelEditingDiag,
        commitEditing: commitEditingDiag,
        updateEditData: updateEditDiag,
    } = useEditableState<DiagnosticoDados | null>(diagnostico);

    const handleSaveDiagEdits = () => {
        const edited = commitEditingDiag();
        if (edited) setDiagnostico(edited);
    };

    // Pegar dados da última avaliação
    const ultimaAvaliacao = useMemo(() => {
        if (!atleta || atleta.assessments.length === 0) return null;
        return atleta.assessments[0];
    }, [atleta]);

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

    // Score efetivo: usa o score do atleta no store, com fallback no score da última avaliação.
    // O mapper já popula ultimaAvaliacao.score lendo também de results.avaliacaoGeral,
    // então esse valor é sempre o mais confiável disponível.
    const scoreEfetivo = useMemo(() => {
        if (atleta.score > 0) return atleta.score;
        if (ultimaAvaliacao?.score && ultimaAvaliacao.score > 0) return ultimaAvaliacao.score;
        return 0;
    }, [atleta.score, ultimaAvaliacao?.score]);

    // Ratio efetivo: usa o ratio do store, com fallback no ratio da última avaliação
    // ou no cálculo direto ombros/cintura das medidas.
    const ratioEfetivo = useMemo(() => {
        if (atleta.ratio > 0) return atleta.ratio;
        if (ultimaAvaliacao?.ratio && ultimaAvaliacao.ratio > 0) return ultimaAvaliacao.ratio;
        const m = ultimaAvaliacao?.measurements;
        if (m?.shoulders && m?.waist && m.waist > 0) {
            return Math.round((m.shoulders / m.waist) * 100) / 100;
        }
        return 0;
    }, [atleta.ratio, ultimaAvaliacao]);

    // Se for modo leitura, garantir que a recomendação e objetivo estejam setados para exibição no final
    useEffect(() => {
        if (isReadOnly && diagnostico && !recomendacao && ultimaAvaliacao) {
            const adonisProp = diagnostico.analiseEstetica.proporcoes.find(
                p => p.grupo === 'Shape-V' || p.grupo === 'V-Taper'
            );
            const rec = recomendarObjetivo({
                bf: diagnostico.composicaoAtual.gorduraPct,
                ffmi: ultimaAvaliacao?.ffmi ?? 20,
                sexo: atleta.gender === 'FEMALE' ? 'F' : 'M',
                score: diagnostico.analiseEstetica.scoreAtual,
                nivel: diagnostico.analiseEstetica.classificacaoAtual,
                adonis: (adonisProp?.atual ?? ratioEfetivo) || undefined,
            });
            setRecomendacao(rec);
            // Em modo leitura, o objetivo selecionado é o objetivo atual do atleta (mapeado se necessário) ou o recomendado
            const objAtleta = (atleta as any).objetivo;
            setObjetivoSelecionado(objAtleta ? mapLegacyToVitruvio(objAtleta) : rec.objetivo);
        }
    }, [isReadOnly, diagnostico, atleta, ultimaAvaliacao, ratioEfetivo, recomendacao]);

    const m = ultimaAvaliacao?.measurements;

    // Enriquecer "Análise de Contexto" com IA ao montar
    useEffect(() => {
        if (!atleta) {
            setContextLoading(false);
            return;
        }

        if (!m) return;

        // Impede re-chamadas se já houver texto
        if (analiseContextoIA) return;

        const perfil: PerfilAtletaIA = {
            nome: atleta.name,
            sexo: atleta.gender === 'FEMALE' ? 'F' : 'M',
            idade: atleta.birthDate ? Math.floor((Date.now() - new Date(atleta.birthDate).getTime()) / 31557600000) : 30,
            altura: m.height,
            peso: m.weight,
            gorduraPct: ultimaAvaliacao.bf ?? 15,
            score: scoreEfetivo,
            classificacao: scoreEfetivo >= 90 ? 'ELITE' : scoreEfetivo >= 80 ? 'AVANÇADO' : scoreEfetivo >= 70 ? 'ATLÉTICO' : scoreEfetivo >= 60 ? 'INTERMEDIÁRIO' : 'INICIANTE',
            medidas: m as Record<string, number>,
            contexto: atleta.contexto as unknown as Record<string, unknown>,
        };

        const perfilTexto = perfilParaTexto(perfil);
        const fontesTexto = getFontesCientificas('diagnostico');
        const prompt = buildAnaliseContextoPrompt(perfilTexto, fontesTexto);

        gerarConteudoIA<{ analiseContexto: string }>(prompt)
            .then(result => {
                if (result?.analiseContexto) {
                    console.info('[DiagnosticoView] 🤖 Análise de contexto IA gerada para ' + atleta.name);
                    setAnaliseContextoIA(result.analiseContexto);
                } else {
                    console.warn('[DiagnosticoView] IA retornou vazio para Análise de Contexto');
                }
            })
            .catch(err => console.error('[DiagnosticoView] Erro contexto IA:', err))
            .finally(() => setContextLoading(false));
    }, [atletaId, m, isReadOnly, atleta, analiseContextoIA]);

    /** Gera diagnóstico a partir dos dados reais do atleta */
    const handleGerar = () => {
        if (!m) return; // Guard: sem medidas, não gerar diagnóstico
        setEstado('generating');

        // Alias para facilitar mapeamento se vierem como peito/braco etc
        const anyM = m as Record<string, unknown>;

        // Simular delay de processamento IA
        setTimeout(() => {
            const ctxAny = (atleta.contexto ?? {}) as Record<string, unknown>;
            const nivelAtividadeFicha = typeof ctxAny.nivel_atividade === 'string' ? ctxAny.nivel_atividade : undefined;
            const duracaoFicha = typeof ctxAny.duracao_min_sessao === 'number' ? ctxAny.duracao_min_sessao : undefined;
            const somatotipoFicha = typeof ctxAny.somatotipo === 'string' ? ctxAny.somatotipo : undefined;

            const input: DiagnosticoInput = {
                peso: m.weight,
                altura: m.height,
                idade: atleta.birthDate ? Math.floor((Date.now() - new Date(atleta.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 30,
                sexo: atleta.gender === 'FEMALE' ? 'F' : 'M',
                gorduraPct: ultimaAvaliacao?.bf ?? 15,
                score: scoreEfetivo,
                classificacao: getClassificacao(scoreEfetivo),
                ratio: ratioEfetivo,
                freqTreino: 5, // sobrescrito após calcular potencial
                nivelAtividade: (nivelAtividadeFicha as DiagnosticoInput['nivelAtividade']) ?? 'MODERADO',
                duracaoMinSessao: duracaoFicha,
                somatotipo: (somatotipoFicha as DiagnosticoInput['somatotipo']) ?? null,
                ffmi: ultimaAvaliacao?.ffmi,
                usaAnabolizantes: !!((atleta.contexto as unknown as Record<string, unknown>)?.medicacoes),
                usaTermogenicos: false,
                nomeAtleta: atleta.name,
                medidas: {
                    ombros: m.shoulders,
                    cintura: m.waist,
                    peitoral: m.chest || (anyM.peito as number),
                    costas: (anyM.costas as number) || m.chest || (m.shoulders * 0.9),
                    bracoD: m.armRight || (anyM.braco as number),
                    bracoE: m.armLeft || (anyM.braco as number),
                    antebracoD: m.forearmRight || (anyM.antebraco as number),
                    antebracoE: m.forearmLeft || (anyM.antebraco as number),
                    coxaD: m.thighRight || (anyM.coxa as number),
                    coxaE: m.thighLeft || (anyM.coxa as number),
                    panturrilhaD: m.calfRight || (anyM.panturrilha as number),
                    panturrilhaE: m.calfLeft || (anyM.panturrilha as number),
                    punho: (anyM.wrist as number) || 17.5,
                    joelho: (anyM.knee as number) || 38,
                    tornozelo: (anyM.ankle as number) || 22,
                    pelvis: m.pelvis || (anyM.pelvis as number) || m.waist * 1.1,
                    pescoco: m.neck || (anyM.pescoco as number) || 40,
                },
                // Se a avaliação já tem proporções gravadas, usar diretamente (zero discrepância)
                proporcoesPreCalculadas: Array.isArray(ultimaAvaliacao?.proporcoes) ? ultimaAvaliacao.proporcoes : undefined,
            };

            // Pipeline completo: Potencial → Diagnóstico reanalisado
            const classificacao = getClassificacao(scoreEfetivo);
            const potencial = calcularPotencialAtleta(classificacao, scoreEfetivo, atleta.contexto ?? undefined);
            // Nível de atividade: prioridade ao campo explícito da ficha; fallback para inferência
            // considerando a frequência de treino já resolvida pelo potencial.
            if (!nivelAtividadeFicha) {
                input.nivelAtividade = inferirNivelAtividade(
                    atleta.contexto ?? undefined,
                    { frequenciaSemanal: potencial.frequenciaSemanal },
                );
            }
            input.freqTreino = potencial.frequenciaSemanal;
            input.nivelAtleta = potencial.nivel;
            const resultado = gerarDiagnosticoCompleto(input, potencial);

            // Calcular o objetivo recomendado baseado nos dados do diagnóstico
            const adonisProp = resultado.analiseEstetica.proporcoes.find(
                p => p.grupo === 'Shape-V' || p.grupo === 'V-Taper'
            );
            const adonisVal = adonisProp?.atual ?? undefined;
            const rec = recomendarObjetivo({
                bf: resultado.composicaoAtual.gorduraPct,
                ffmi: ultimaAvaliacao?.ffmi ?? 20,
                sexo: input.sexo,
                score: resultado.analiseEstetica.scoreAtual,
                nivel: resultado.analiseEstetica.classificacaoAtual,
                adonis: adonisVal,
            });

            setDiagnostico(resultado);
            setRecomendacao(rec);
            setObjetivoSelecionado(rec.objetivo);
            setEstado('ready');

            // Enriquecer com IA em background (não bloqueia UI)
            setIaEnriching(true);
            const perfil = {
                nome: atleta.name,
                sexo: input.sexo,
                idade: input.idade,
                altura: input.altura,
                peso: input.peso,
                gorduraPct: input.gorduraPct,
                score: input.score,
                classificacao: input.classificacao,
                medidas: input.medidas as Record<string, number>,
                contexto: atleta.contexto as unknown as Record<string, unknown>,
            };
            console.info('[DiagnosticoView] 🚀 Iniciando enriquecimento IA...');
            enriquecerDiagnosticoComIA(resultado, perfil)
                .then(enriquecido => {
                    if (enriquecido !== resultado) {
                        console.info('[DiagnosticoView] 🤖 Diagnóstico enriquecido com IA!', {
                            temInsights: !!enriquecido.insightsPorSecao,
                            secoes: enriquecido.insightsPorSecao ? Object.keys(enriquecido.insightsPorSecao) : [],
                            temRecomendacoes: !!enriquecido.recomendacoesIA?.length,
                            resumoVitruvio: enriquecido.resumoVitruvio?.substring(0, 80) + '...',
                        });
                        setDiagnostico(enriquecido);
                    } else {
                        console.warn('[DiagnosticoView] ⚠️ IA retornou mesmo objeto (falha?)');
                    }
                })
                .catch(err => {
                    console.error('[DiagnosticoView] ❌ Erro no enriquecimento IA:', err);
                })
                .finally(() => {
                    setIaEnriching(false);
                });
        }, 1500);
    };

    /** Salva diagnóstico no Supabase e persiste objetivo em fichas */
    const handleSalvar = async () => {
        if (!diagnostico) return;
        setEstado('saving');

        const personalId = atleta.personalId ?? null;

        // 1. Salvar diagnóstico
        const result = await salvarDiagnostico(atletaId, personalId, diagnostico);
        if (!result) {
            console.error('[Diagnostico] ❌ Erro ao salvar no banco.');
            setToastStatus('error');
            setEstado('ready'); // Volta para permitir nova tentativa
            setTimeout(() => setToastStatus(null), 4000);
            return;
        }

        setToastStatus('success');

        // 2. Persistir objetivo recomendado em fichas
        if (objetivoSelecionado) {
            try {
                await supabase
                    .from('fichas')
                    .update({ objetivo_vitruvio: objetivoSelecionado } as Record<string, unknown>)
                    .eq('atleta_id', atletaId);
                console.info('[Diagnostico] ✅ Objetivo Vitrúvio salvo:', objetivoSelecionado);
            } catch (err) {
                console.warn('[Diagnostico] Aviso ao salvar objetivo:', err);
            }
        }

        setEstado('saved');
        setTimeout(() => setToastStatus(null), 3000);
    };

    /** Extrai diretrizes do chat e reprocessa o diagnostico com IA */
    const handleAplicarAjustes = async () => {
        if (!diagnostico || !ultimaAvaliacao) return;
        setIsApplying(true);
        setIaEnriching(true);

        try {
            const classificacao = atleta.score >= 90 ? 'ELITE'
                : atleta.score >= 80 ? 'AVANÇADO'
                    : atleta.score >= 70 ? 'ATLÉTICO'
                        : atleta.score >= 60 ? 'INTERMEDIÁRIO' : 'INICIANTE';

            const perfil = {
                nome: atleta.name,
                sexo: (atleta.gender === 'FEMALE' ? 'F' : 'M') as 'M' | 'F',
                idade: atleta.birthDate ? Math.floor((Date.now() - new Date(atleta.birthDate).getTime()) / 31557600000) : 30,
                altura: ultimaAvaliacao?.measurements?.height || 170,
                peso: ultimaAvaliacao?.measurements?.weight || 70,
                gorduraPct: ultimaAvaliacao?.bf ?? 15,
                score: atleta.score,
                classificacao: classificacao,
                medidas: (ultimaAvaliacao?.measurements as Record<string, number>) || {},
                contexto: atleta.contexto as unknown as Record<string, unknown>,
            };

            const diretrizes = await extrairDiretrizesDoChat(atletaId, 'diagnostico');
            if (diretrizes) {
                console.info('[DiagnosticoView] 🚀 Aplicando diretrizes do chat...');
                const enriquecido = await enriquecerDiagnosticoComIA(diagnostico, perfil, diretrizes);
                setDiagnostico(enriquecido);
            } else {
                console.warn('[DiagnosticoView] ⚠️ Nenhuma diretriz extraída do chat.');
            }
        } catch (err) {
            console.error('[DiagnosticoView] ❌ Erro ao aplicar ajustes:', err);
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
                        {toastStatus === 'success' ? 'Diagnóstico salvo com sucesso!' : 'Erro ao salvar. Tente novamente.'}
                    </div>
                )}
                {/* Page Header */}
                <div className="flex flex-col animate-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">
                        DIAGNÓSTICO
                    </h2>
                    <p className="text-gray-400 mt-2 font-light text-base">
                        Etapa 1: Análise completa das taxas metabólicas e proporções estéticas do aluno.
                    </p>
                </div>

                <div className="h-px w-full bg-white/10" />

                {/* Stepper */}
                <EvolutionStepper etapaAtual={1} />

                {/* Card info atleta */}
                <div className="bg-surface border border-white/10 rounded-2xl p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(79,70,229,0.1)]">
                                <span className="text-primary font-bold text-2xl">{atleta.name[0]}</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">{atleta.name}</h2>
                                <p className="text-sm text-gray-500 font-medium">Plano de Evolução — Diagnóstico</p>
                            </div>
                        </div>
                        <div className="flex flex-col md:items-end">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Última Avaliação</span>
                            <div className="flex items-center gap-2 text-white/80">
                                <Calendar size={16} className="text-primary" />
                                <span className="text-lg font-bold">
                                    {new Date(atleta.lastMeasurement).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Context Analysis Block */}
                        <div className="lg:col-span-2 flex flex-col h-full">
                            <div className="flex-1 bg-[#0D1525] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Bot size={80} className="text-primary" />
                                </div>
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                            <Bot size={18} className="text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-white uppercase tracking-wider">Coach IA — Análise de Contexto</h3>
                                            <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">Personalização Baseada em Perfil</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        {contextLoading ? (
                                            <div className="space-y-2">
                                                <div className="h-4 bg-primary/10 rounded animate-pulse w-full" />
                                                <div className="h-4 bg-primary/10 rounded animate-pulse w-5/6" />
                                                <div className="h-4 bg-primary/10 rounded animate-pulse w-4/6" />
                                                <div className="h-4 bg-primary/10 rounded animate-pulse w-3/6" />
                                                <p className="text-xs text-primary/60 mt-3 animate-pulse">Vitrúvio IA analisando contexto do atleta...</p>
                                            </div>
                                        ) : (
                                            <p className="text-lg text-gray-300 leading-relaxed italic">
                                                "{analiseContextoIA || generateGeneralAnalysis(atleta.contexto, atleta.score)}"
                                            </p>
                                        )}
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                                        <span className="text-[10px] text-gray-600 font-medium uppercase tracking-widest">IA Engine v2.0</span>
                                        <div className="flex gap-1">
                                            {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/30" />)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Score Widget Block */}
                        <div className="lg:col-span-1">
                            <ScoreWidget
                                score={scoreEfetivo}
                                label="SCORE GERAL"
                                change={atleta.scoreVariation >= 0 ? `+${atleta.scoreVariation}%` : `${atleta.scoreVariation}%`}
                                classification={getScoreClassification(scoreEfetivo)}
                            />
                        </div>
                    </div>
                </div>

                {/* Estado: Ainda não gerou */}
                {estado === 'idle' && (
                    <div className="bg-surface border border-white/10 rounded-2xl p-10 text-center">
                        <Stethoscope size={48} className="text-primary mx-auto mb-5" />
                        <h3 className="text-xl font-bold text-white mb-3">Gerar Diagnóstico Completo</h3>
                        <p className="text-base text-gray-500 mb-8 max-w-lg mx-auto">
                            O Vitrúvio vai analisar as medidas, composição corporal, proporções e simetria para criar um diagnóstico personalizado com metas de 12 meses.
                        </p>
                        <button
                            onClick={handleGerar}
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all"
                        >
                            <Stethoscope size={18} />
                            Gerar Diagnóstico
                        </button>
                    </div>
                )}

                {/* Estado: Gerando */}
                {estado === 'generating' && (
                    <div className="bg-surface border border-white/10 rounded-2xl p-10 text-center">
                        <Loader2 size={48} className="text-primary mx-auto mb-5 animate-spin" />
                        <h3 className="text-xl font-bold text-white mb-3">Analisando dados do atleta...</h3>
                        <p className="text-base text-gray-500">Calculando taxas metabólicas, analisando proporções e gerando metas.</p>
                    </div>
                )}

                {/* Estado: Diagnóstico gerado */}
                {diagnostico && (estado === 'ready' || estado === 'saving' || estado === 'saved') && (
                    <>
                        <SecaoTaxas dados={diagnostico} insightIA={diagnostico.insightsPorSecao?.taxas} isLoading={iaEnriching} />
                        <SecaoComposicao dados={diagnostico} insightIA={diagnostico.insightsPorSecao?.composicao} isLoading={iaEnriching} />
                        <SecaoEstetica dados={diagnostico} insightIA={diagnostico.insightsPorSecao?.proporcoes} isLoading={iaEnriching} />
                        <SecaoPrioridades dados={diagnostico} insightIA={diagnostico.insightsPorSecao?.prioridades} isLoading={iaEnriching} />

                        {/* Metas editáveis */}
                        <div className="relative">
                            <div className="flex justify-end mb-2">
                                <EditToolbar
                                    isEditing={isEditingDiag}
                                    hasChanges={hasDiagChanges}
                                    onStartEditing={startEditingDiag}
                                    onSave={handleSaveDiagEdits}
                                    onDiscard={cancelEditingDiag}
                                    readOnly={isReadOnly}
                                    saveLabel="Salvar Metas"
                                />
                            </div>
                            <SecaoMetas
                                dados={isEditingDiag && editDiag ? editDiag : diagnostico}
                                nomeAtleta={atleta.name}
                                medidas={(diagnostico as unknown as Record<string, unknown>)?._medidas}
                                isEditing={isEditingDiag}
                                onUpdateData={updateEditDiag}
                            />
                        </div>

                        {/* Card de recomendação de objetivo */}
                        {recomendacao && (
                            <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden">
                                <div className="px-6 py-5 border-b border-white/10 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <Bot size={22} className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white uppercase tracking-wider">Objetivo Recomendado</h3>
                                        <p className="text-base text-gray-500">Baseado na análise completa do seu diagnóstico</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    {/* Recomendação principal */}
                                    <div className={`border rounded-xl p-5 ${isReadOnly ? '' : 'mb-6'} ${getObjetivoMeta(recomendacao.objetivo).cor}`}>
                                        <div className="flex items-start gap-4">
                                            <span className="text-4xl">{getObjetivoMeta(recomendacao.objetivo).emoji}</span>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <p className="text-xl font-bold text-white">
                                                        {isReadOnly && objetivoSelecionado ? getObjetivoMeta(objetivoSelecionado).label : getObjetivoMeta(recomendacao.objetivo).label}
                                                    </p>
                                                    {!isReadOnly && (
                                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${recomendacao.confianca === 'ALTA' ? 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10'
                                                            : recomendacao.confianca === 'MEDIA' ? 'text-yellow-400 border-yellow-400/40 bg-yellow-400/10'
                                                                : 'text-gray-400 border-gray-400/40 bg-gray-400/10'
                                                            }`}>
                                                            Confiança {recomendacao.confianca}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-base text-gray-300 leading-relaxed">
                                                    {isReadOnly && objetivoSelecionado
                                                        ? getObjetivoMeta(objetivoSelecionado).descricao
                                                        : recomendacao.justificativa}
                                                </p>
                                                {!isReadOnly && recomendacao.alternativa && (
                                                    <p className="text-sm text-gray-500 mt-2">
                                                        Alternativa: {getObjetivoMeta(recomendacao.alternativa).emoji} {getObjetivoMeta(recomendacao.alternativa).label}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Seletor manual — Ocultar em Read Only */}
                                    {!isReadOnly && (
                                        <>
                                            <p className="text-xs uppercase tracking-widest text-gray-500 mt-6 mb-3 font-semibold">Ou selecione um objetivo diferente:</p>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {TODOS_OBJETIVOS.map(obj => {
                                                    const meta = getObjetivoMeta(obj);
                                                    const isSelected = objetivoSelecionado === obj;
                                                    return (
                                                        <button
                                                            key={obj}
                                                            onClick={() => setObjetivoSelecionado(obj)}
                                                            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold transition-all ${isSelected
                                                                ? meta.cor + ' shadow-md scale-[1.02]'
                                                                : 'bg-white/[0.02] border-white/10 text-gray-500 hover:bg-white/5'
                                                                }`}
                                                        >
                                                            <span>{meta.emoji}</span>
                                                            <span className="text-left leading-tight">{meta.label}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Chat Vitrúvio IA — Debater plano */}
                        <ChatPlanoEvolucao
                            tipo="diagnostico"
                            atletaId={atletaId}
                            nomeAtleta={atleta.name}
                            planoTexto={diagnosticoParaTexto(diagnostico)}
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
                            fontesCientificas={getFontesCientificas('diagnostico')}
                        />
                    </>
                )}

                {/* Ações de Navegação */}
                {diagnostico && (
                    <div className="flex items-center justify-between pt-10 border-t border-white/10 mt-8">
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
                                    <button
                                        onClick={handleSalvar}
                                        className="flex items-center gap-3 px-8 py-3.5 bg-emerald-600 text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all"
                                    >
                                        <Save size={18} />
                                        Confirmar e Salvar
                                    </button>
                                )}
                                {estado === 'saving' && (
                                    <button disabled className="flex items-center gap-3 px-8 py-3.5 bg-gray-800 text-gray-500 font-bold text-sm uppercase tracking-wider rounded-xl">
                                        <Loader2 size={18} className="animate-spin" />
                                        Salvando...
                                    </button>
                                )}
                                {estado === 'saved' && (
                                    <button
                                        onClick={() => onNext(undefined)}
                                        className="flex items-center gap-3 px-8 py-3.5 bg-primary text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all"
                                    >
                                        Próximo: Plano de Treino
                                        <ArrowRight size={18} />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => onNext()}
                                className="flex items-center gap-3 px-8 py-3.5 bg-primary text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all"
                            >
                                Próximo: Plano de Treino
                                <ArrowRight size={18} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
