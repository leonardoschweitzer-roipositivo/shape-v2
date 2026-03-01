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
// SUBCOMPONENTS (REUTILIZADOS/ADAPTADOS)
// ═══════════════════════════════════════════════════════════

/** Stepper reutilizável */
const EvolutionStepper: React.FC<{ etapaAtual: number }> = ({ etapaAtual }) => {
    const steps = [
        { num: 1, label: 'Diagnóstico', icon: Stethoscope },
        { num: 2, label: 'Treino', icon: Dumbbell },
        { num: 3, label: 'Dieta', icon: Salad },
    ];

    return (
        <div className="flex items-center justify-between w-full my-8">
            {steps.map((step, idx) => (
                <React.Fragment key={step.num}>
                    {idx > 0 && (
                        <div className={`h-px flex-1 mx-4 ${step.num <= etapaAtual ? 'bg-primary' : 'bg-white/10'}`} />
                    )}
                    <div className={`flex items-center justify-center min-w-[180px] gap-3 px-6 py-3.5 rounded-xl border transition-all ${step.num === etapaAtual
                        ? 'bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(0,201,167,0.1)]'
                        : step.num < etapaAtual
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-white/[0.02] border-white/5 text-gray-600'
                        }`}>
                        {step.num < etapaAtual ? (
                            <Check size={16} />
                        ) : (
                            <step.icon size={16} />
                        )}
                        <span className="text-sm font-bold uppercase tracking-wider">{step.label}</span>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
};

/** Card de seção — Gold Standard alinhado com DiagnosticoView */
const SectionCard: React.FC<{
    icon: React.ElementType;
    title: string;
    subtitle: string;
    children: React.ReactNode;
}> = ({ icon: Icon, title, subtitle, children }) => (
    <div className="bg-[#131B2C] border border-white/10 rounded-2xl overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-white/10 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon size={22} className="text-primary" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">{title}</h3>
                <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
        </div>
        <div className="p-6">{children}</div>
    </div>
);

/** Box de insight do Vitrúvio */
const InsightBox: React.FC<{ text: string; title?: string; isLoading?: boolean }> = ({ text, title = 'Análise Vitrúvio IA', isLoading }) => (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mt-4">
        <div className="flex items-start gap-4">
            <Bot size={26} className={`text-primary mt-0.5 shrink-0 ${isLoading ? 'animate-pulse' : ''}`} />
            <div className="flex-1">
                <p className="text-base font-bold text-primary mb-2 uppercase tracking-wider">{title}</p>
                {isLoading ? (
                    <div className="space-y-2">
                        <div className="h-4 bg-primary/10 rounded animate-pulse w-full" />
                        <div className="h-4 bg-primary/10 rounded animate-pulse w-5/6" />
                        <div className="h-4 bg-primary/10 rounded animate-pulse w-4/6" />
                        <p className="text-xs text-primary/60 mt-3 animate-pulse">Vitrúvio IA analisando plano de treino...</p>
                    </div>
                ) : (
                    <>
                        <p className="text-lg text-gray-300 leading-relaxed">"{text}"</p>
                        <p className="text-xs text-gray-600 mt-3 text-right">— VITRÚVIO IA</p>
                    </>
                )}
            </div>
        </div>
    </div>
);

/** Barra de progresso visual */
const ProgressBar: React.FC<{ pct: number; color?: string }> = ({ pct, color = 'bg-primary' }) => (
    <div className="w-full h-3.5 bg-white/5 rounded-full overflow-hidden">
        <div
            className={`h-full rounded-full transition-all ${color}`}
            style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
        />
    </div>
);

// ═══════════════════════════════════════════════════════════
// SEÇÕES DO TREINO
// ═══════════════════════════════════════════════════════════

/** Seção 1: Resumo do Diagnóstico */
const SecaoResumoDiagnostico: React.FC<{ diagnostico: DiagnosticoDados; potencial?: PotencialAtleta; insightIA?: string; isLoading?: boolean }> = ({ diagnostico, potencial, insightIA, isLoading }) => {
    const priosAltas = diagnostico.prioridades.filter(p => p.nivel === 'ALTA');
    const nivelColors: Record<string, string> = {
        'INICIANTE': 'bg-blue-500/20  text-blue-400   border-blue-500/30',
        'INTERMEDIÁRIO': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        'AVANÇADO': 'bg-red-500/20   text-red-400    border-red-500/30',
    };

    return (
        <SectionCard icon={Target} title="Resumo do Diagnóstico" subtitle="Principais pontos que guiaram a montagem do treino">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/[0.03] p-4 rounded-xl border border-white/5">
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Score Atual</p>
                    <p className="text-2xl font-bold text-white">{diagnostico.analiseEstetica.scoreAtual}</p>
                </div>
                <div className="bg-white/[0.03] p-4 rounded-xl border border-white/5">
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Meta 12 Meses</p>
                    <p className="text-2xl font-bold text-primary">{diagnostico.analiseEstetica.scoreMeta12M}+</p>
                </div>
                {potencial && (
                    <div className="bg-white/[0.03] p-4 rounded-xl border border-white/5">
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Nível Detectado</p>
                        <span className={`inline-block mt-1 text-xs font-black px-3 py-1 rounded border uppercase tracking-wider ${nivelColors[potencial.nivel] || ''}`}>
                            {potencial.nivel}
                        </span>
                    </div>
                )}
                <div className="bg-white/[0.03] p-4 rounded-xl border border-white/5 md:col-span-1">
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Prioridades Cruciais</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {priosAltas.length > 0 ? (
                            priosAltas.map(p => (
                                <span key={p.grupo} className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded border border-red-500/30 uppercase">
                                    {p.grupo}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-400 text-sm">Nenhuma prioridade crítica.</span>
                        )}
                    </div>
                </div>
            </div>
            {/* Alertas contextuais do potencial */}
            {potencial && potencial.observacoesContexto.length > 0 && (
                <div className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-2">⚠️ Alertas do Contexto</p>
                    {potencial.observacoesContexto.map((alerta, i) => (
                        <p key={i} className="text-xs text-amber-200/70 leading-relaxed">• {alerta}</p>
                    ))}
                </div>
            )}
            <InsightBox isLoading={isLoading} text={insightIA || `Plano calibrado para atleta ${potencial?.nivel ?? ''}: do score ${diagnostico.analiseEstetica.scoreAtual} para ${diagnostico.analiseEstetica.scoreMeta12M} em 12 meses. Prioridades máximas: ${priosAltas.map(p => p.grupo).join(', ') || 'equilíbrio geral'}.`} />
        </SectionCard>
    );
};

/** Seção 2: Visão Geral do Plano Anual */
const SecaoVisaoAnual: React.FC<{ plano: PlanoTreino }> = ({ plano }) => {
    return (
        <SectionCard icon={Calendar} title="Visão Geral do Plano Anual" subtitle="Macro-objetivos de longo prazo para atingir as proporções áureas">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {plano.visaoAnual.trimestres.map((t) => (
                    <div key={t.numero} className="bg-[#0D1525] p-5 rounded-xl border border-white/5 relative overflow-hidden group hover:border-primary/30 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-primary font-bold text-lg">T{t.numero}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${t.volume === 'ALTO' ? 'bg-red-500/20 text-red-400' :
                                t.volume === 'MODERADO' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-400'
                                }`}>
                                VOLUME {t.volume}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Foco</p>
                        <div className="space-y-1 mb-4 min-h-[48px]">
                            {t.foco.map((f, i) => (
                                <p key={i} className="text-sm text-gray-300">• {f}</p>
                            ))}
                        </div>
                        <div className="pt-4 border-t border-white/5">
                            <p className="text-xs text-gray-500 mb-1 uppercase tracking-widest">Semana {t.semanas[0]} a {t.semanas[1]}</p>
                            <p className="text-base font-bold text-white">Score Alvo: {t.scoreEsperado}</p>
                        </div>
                    </div>
                ))}
            </div>
        </SectionCard>
    );
};

/** Seção 3: Trimestre Atual */
const SecaoTrimestreAtual: React.FC<{ plano: PlanoTreino }> = ({ plano }) => {
    return (
        <SectionCard icon={TrendingUp} title="Trimestre Atual" subtitle="Periodização detalhada das próximas 12 semanas">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {plano.trimestreAtual.mesociclos.map((m) => (
                    <div key={m.numero} className="bg-white/[0.02] p-5 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                                {m.numero}
                            </div>
                            <h4 className="font-bold text-white uppercase tracking-wider">{m.nome}</h4>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-xs text-gray-500 mb-1 uppercase">
                                    <span>Volume</span>
                                    <span>{m.volumeRelativo}%</span>
                                </div>
                                <ProgressBar pct={m.volumeRelativo} color="bg-blue-500" />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-gray-500 mb-1 uppercase">
                                    <span>Intensidade</span>
                                    <span>{m.intensidadeRelativa}%</span>
                                </div>
                                <ProgressBar pct={m.intensidadeRelativa} color="bg-orange-500" />
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-xs text-gray-500 uppercase">Esforço (RPE)</span>
                                <span className="text-sm font-bold text-white">{m.rpeAlvo[0]}-{m.rpeAlvo[1]}/10</span>
                            </div>
                            <div className="pt-3 mt-3 border-t border-white/5">
                                <p className="text-xs text-gray-500 leading-relaxed">{m.descricao}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <h4 className="text-base font-bold text-white uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Volume Semanal por Grupo (Checkmate)</h4>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/10 text-gray-500">
                            <th className="text-left py-3 font-semibold uppercase tracking-wider">Grupo Muscular</th>
                            <th className="text-center py-3 font-semibold uppercase tracking-wider">Séries Base</th>
                            <th className="text-center py-3 font-semibold uppercase tracking-wider">Séries Plano</th>
                            <th className="text-left py-3 font-semibold uppercase tracking-wider">Status/Foco</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plano.trimestreAtual.volumePorGrupo.map((v) => (
                            <tr key={v.grupo} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                                <td className="py-4 flex items-center gap-3">
                                    <span className={`w-2 h-2 rounded-full ${v.prioridade === 'ALTA' ? 'bg-red-500 animate-pulse' :
                                        v.prioridade === 'MEDIA' ? 'bg-yellow-500' : 'bg-gray-600'
                                        }`} />
                                    <span className="font-medium text-gray-200">{v.grupo}</span>
                                </td>
                                <td className="py-4 text-center text-gray-500">{v.seriesPadrao}</td>
                                <td className="py-4 text-center">
                                    <span className={`font-bold text-lg ${v.prioridade === 'ALTA' ? 'text-white' : 'text-gray-300'}`}>
                                        {v.seriesPlano}
                                    </span>
                                </td>
                                <td className="py-4">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${v.prioridade === 'ALTA' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                                        v.prioridade === 'MEDIA' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' :
                                            'bg-gray-500/10 text-gray-500 border-gray-500/30'
                                        }`}>
                                        {v.prioridade === 'NORMAL' ? 'MANUTENÇÃO' : v.prioridade}
                                    </span>
                                    <p className="text-[10px] text-gray-600 mt-1 italic">{v.observacao}</p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </SectionCard>
    );
};

/** Seção 4: Divisão de Treino */
const SecaoDivisao: React.FC<{ plano: PlanoTreino }> = ({ plano }) => {
    return (
        <SectionCard icon={LayoutGrid} title="Divisão do Plano" subtitle="Como o trabalho é distribuído ao longo da semana">
            <div className="flex items-center gap-6 mb-8">
                <div className="bg-primary/10 border border-primary/20 px-6 py-4 rounded-2xl">
                    <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">Estratégia</p>
                    <p className="text-3xl font-black text-white">{plano.divisao.tipo}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/10 px-6 py-4 rounded-2xl">
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Frequência</p>
                    <p className="text-3xl font-black text-white">{plano.divisao.frequenciaSemanal}x <span className="text-sm text-gray-500 font-normal">semanal</span></p>
                </div>
            </div>

            <div className="space-y-3">
                {plano.divisao.estruturaSemanal.map((e, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-white/[0.02] p-4 rounded-xl border border-white/5 hover:translate-x-1 transition-transform">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black border bg-primary/20 border-primary/40 text-primary`}>
                            {e.letra}
                        </div>
                        <div className="flex-1">
                            <p className="text-base font-bold text-gray-200">{e.grupos.join(' + ')}</p>
                            <div className="flex items-center gap-3 mt-1">
                                {e.duracaoMinutos > 0 && (
                                    <span className="flex items-center gap-1 text-[10px] text-gray-500 uppercase">
                                        <Clock size={10} /> {e.duracaoMinutos} min
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </SectionCard>
    );
};

/** Seção 5: Treinos Detalhados */
const SecaoTreinosSemanais: React.FC<{ treinos: TreinoDetalhado[] }> = ({ treinos }) => {
    const [activeTab, setActiveTab] = useState(treinos[0]?.id || '');
    const activeTreino = treinos.find(t => t.id === activeTab);

    return (
        <SectionCard icon={BookOpen} title="Treinos da Semana" subtitle="Fichas detalhadas de exercícios e técnicas avançadas">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 bg-white/[0.02] p-1.5 rounded-2xl border border-white/5">
                {treinos.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        className={`flex-1 min-w-[120px] px-4 py-3 rounded-xl font-bold text-sm uppercase transition-all ${activeTab === t.id
                            ? 'bg-primary text-[#0A0F1C] shadow-lg shadow-primary/20'
                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {t.nome}
                    </button>
                ))}
            </div>

            {/* Ficha Ativa */}
            {activeTreino && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight">{activeTreino.nome}</h3>
                            <div className="flex items-center gap-4 mt-1 text-gray-500">
                                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                                    <Dumbbell size={14} className="text-primary" /> Treino {activeTreino.letra}
                                </span>
                                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                                    <Clock size={14} className="text-primary" /> ~{activeTreino.duracaoMinutos} minutos
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {activeTreino.blocos.map((bloco, bIdx) => (
                            <div key={bIdx} className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                                <div className="bg-white/[0.03] px-6 py-4 flex items-center justify-between border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${bloco.isPrioridade ? 'bg-red-500 animate-pulse' : 'bg-primary/60'}`} />
                                        <h4 className="text-lg font-black text-white uppercase tracking-wider">{bloco.nomeGrupo}</h4>
                                    </div>
                                    <span className="text-[11px] font-bold text-gray-500 border border-white/10 px-3 py-1 rounded-full uppercase">
                                        Total: {bloco.seriesTotal} séries
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-base">
                                        <thead>
                                            <tr className="border-b border-white/5 text-[10px] text-gray-600 uppercase tracking-[0.2em]">
                                                <th className="text-left px-6 py-3 w-16">#</th>
                                                <th className="text-left py-3">Exercício</th>
                                                <th className="text-center py-3">Séries</th>
                                                <th className="text-center py-3">Reps</th>
                                                <th className="text-center py-3">Descanso</th>
                                                <th className="text-right px-6 py-3">Técnica</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bloco.exercicios.map((ex) => (
                                                <tr key={ex.ordem} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors">
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
                                                            <span className="text-[10px] font-black bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded uppercase tracking-wider shadow-[0_0_10px_rgba(0,201,167,0.05)]">
                                                                {ex.tecnica}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-700">—</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </SectionCard>
    );
};

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
        const classificacao = atleta.score >= 90 ? 'ELITE'
            : atleta.score >= 80 ? 'AVANÇADO'
                : atleta.score >= 70 ? 'ATLÉTICO'
                    : atleta.score >= 60 ? 'INTERMEDIÁRIO' : 'INICIANTE';

        return recomendarObjetivo({
            bf: ultimaAvaliacao.bf ?? 15,
            ffmi: (ultimaAvaliacao as any).ffmi ?? 20,
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

    if (!atleta || !ultimaAvaliacao) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-gray-500">Atleta não encontrado ou sem avaliação.</p>
            </div>
        );
    }

    /** Gera o diagnóstico (mesmo input determinístico do DiagnosticoView) */
    const gerarDiagnosticoLocal = (pot: PotencialAtleta): DiagnosticoDados => {
        const m = ultimaAvaliacao.measurements;
        const anyM = m as any;
        const classificacao = atleta.score >= 90 ? 'ELITE'
            : atleta.score >= 80 ? 'AVANÇADO'
                : atleta.score >= 70 ? 'ATLÉTICO'
                    : atleta.score >= 60 ? 'INTERMEDIÁRIO' : 'INICIANTE';
        const input: DiagnosticoInput = {
            peso: m.weight, altura: m.height,
            idade: atleta.birthDate ? Math.floor((Date.now() - new Date(atleta.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 30,
            sexo: atleta.gender === 'FEMALE' ? 'F' : 'M',
            gorduraPct: ultimaAvaliacao.bf ?? 15,
            score: atleta.score, classificacao, ratio: atleta.ratio,
            freqTreino: pot.frequenciaSemanal, nivelAtividade: 'SEDENTARIO',
            usaAnabolizantes: /testosterona|trt|anaboliz|durateston/i.test(atleta.contexto?.medicacoesUso?.descricao || ''),
            usaTermogenicos: false, nomeAtleta: atleta.name,
            medidas: {
                ombros: m.shoulders, cintura: m.waist,
                peitoral: m.chest || anyM.peito,
                costas: anyM.costas || m.chest || (m.shoulders * 0.9),
                bracoD: m.armRight || anyM.braco, bracoE: m.armLeft || anyM.braco,
                antebracoD: m.forearmRight || anyM.antebraco, antebracoE: m.forearmLeft || anyM.antebraco,
                coxaD: m.thighRight || anyM.coxa, coxaE: m.thighLeft || anyM.coxa,
                panturrilhaD: m.calfRight || anyM.panturrilha, panturrilhaE: m.calfLeft || anyM.panturrilha,
                punho: m.wrist || (atleta as any).punho || 17.5,
                joelho: m.knee || anyM.joelho || 38,
                tornozelo: m.ankle || (atleta as any).tornozelo || 22,
                pelvis: m.pelvis || anyM.pelvis || m.waist * 1.1,
                pescoco: m.neck || anyM.pescoco || 40,
            },
            proporcoesPreCalculadas: Array.isArray(ultimaAvaliacao.proporcoes) ? ultimaAvaliacao.proporcoes : undefined,
        };
        // Reanálise: diagnóstico recebe o potencial para usar score meta dinâmico
        return gerarDiagnosticoCompleto(input, pot);
    };

    /** Gera o plano de treino — pipeline completo: Potencial → Diagnóstico → Treino */
    const handleGerar = () => {
        setEstado('generating');
        setTimeout(() => {
            // 1. Calcular potencial do atleta (contexto + classificação)
            const classificacao = atleta.score >= 90 ? 'ELITE'
                : atleta.score >= 80 ? 'AVANÇADO'
                    : atleta.score >= 70 ? 'ATLÉTICO'
                        : atleta.score >= 60 ? 'INTERMEDIÁRIO' : 'INICIANTE';
            const pot = calcularPotencialAtleta(classificacao, atleta.score, atleta.contexto);
            setPotencial(pot);

            // 2. Reanalisar diagnóstico com o potencial (score meta dinâmico)
            const diag = gerarDiagnosticoLocal(pot);
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

            // 4. Gerar treino consumindo o potencial como fonte única + objetivo + contexto
            const resultado = gerarPlanoTreino(atletaId, atleta.name, diag, pot, rec.objetivo, atleta.contexto);
            setPlano(resultado);
            setEstado('ready');

            // Enriquecer com IA em background
            setIaEnriching(true);
            const perfil = {
                nome: atleta.name,
                sexo: (atleta.gender === 'FEMALE' ? 'F' : 'M') as 'M' | 'F',
                idade: atleta.birthDate ? Math.floor((Date.now() - new Date(atleta.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 30,
                altura: ultimaAvaliacao.measurements.height,
                peso: ultimaAvaliacao.measurements.weight,
                gorduraPct: ultimaAvaliacao.bf ?? 15,
                score: atleta.score,
                classificacao: classificacao,
                medidas: ultimaAvaliacao.measurements as Record<string, number>,
                contexto: atleta.contexto as any,
            };
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
            const classificacao = atleta.score >= 90 ? 'ELITE'
                : atleta.score >= 80 ? 'AVANÇADO'
                    : atleta.score >= 70 ? 'ATLÉTICO'
                        : atleta.score >= 60 ? 'INTERMEDIÁRIO' : 'INICIANTE';

            const perfil = {
                nome: atleta.name,
                sexo: (atleta.gender === 'FEMALE' ? 'F' : 'M') as 'M' | 'F',
                idade: atleta.birthDate ? Math.floor((Date.now() - new Date(atleta.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 30,
                altura: ultimaAvaliacao.measurements.height,
                peso: ultimaAvaliacao.measurements.weight,
                gorduraPct: ultimaAvaliacao.bf ?? 15,
                score: atleta.score,
                classificacao: classificacao,
                medidas: ultimaAvaliacao.measurements as Record<string, number>,
                contexto: atleta.contexto as any,
            };

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
                <div className="bg-[#131B2C] border border-white/10 rounded-2xl p-6">
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
                    <div className={`mt-6 rounded-2xl border p-6 ${getObjetivoMeta(objetivoAtleta).cor}`}>
                        <div className="flex items-start gap-5">
                            <span className="text-5xl leading-none mt-1">{getObjetivoMeta(objetivoAtleta).emoji}</span>
                            <div className="flex-1">
                                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-bold mb-1">Estrela do Norte deste Plano</p>
                                <h3 className="text-2xl font-bold text-white mb-2">{getObjetivoMeta(objetivoAtleta).label}</h3>
                                <p className="text-sm text-gray-300 leading-relaxed mb-4">{getObjetivoMeta(objetivoAtleta).descricao}</p>
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
                </div>

                {/* Estado: Ainda não gerou */}
                {estado === 'idle' && (
                    <div className="bg-[#131B2C] border border-white/10 rounded-2xl p-10 text-center">
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
                    <div className="bg-[#131B2C] border border-white/10 rounded-2xl p-10 text-center">
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
                        <SecaoDivisao plano={plano} />
                        <SecaoTreinosSemanais treinos={plano.treinos} />

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
                                altura: ultimaAvaliacao.measurements.height,
                                peso: ultimaAvaliacao.measurements.weight,
                                gorduraPct: ultimaAvaliacao.bf ?? 15,
                                score: atleta.score,
                                classificacao: atleta.score >= 90 ? 'ELITE' : atleta.score >= 80 ? 'AVANÇADO' : atleta.score >= 70 ? 'ATLÉTICO' : atleta.score >= 60 ? 'INTERMEDIÁRIO' : 'INICIANTE',
                                medidas: ultimaAvaliacao.measurements as Record<string, number>,
                                contexto: atleta.contexto as any,
                            })}
                            fontesCientificas={getFontesCientificas('treino')}
                            onAplicarAjustes={handleAplicarAjustes}
                            isApplying={isApplying}
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
