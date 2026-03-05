/**
 * TreinoView — Section Components
 */
import React, { useState } from 'react';
import { Calendar, Clock, Dumbbell, Layers, Target, BarChart3, AlertTriangle, ChevronDown, Activity, ArrowRight, TrendingUp, LayoutGrid, BookOpen } from 'lucide-react';
import { type PlanoTreino, type TreinoDetalhado } from '@/services/calculations/treino';
import { type DiagnosticoDados } from '@/services/calculations/diagnostico';
import { type PotencialAtleta } from '@/services/calculations/potencial';
import { SectionCard, InsightBox, ProgressBar } from '../PlanoEvolucaoShared';
import { colors } from '@/tokens';
import { EditableField } from '@/components/atoms/EditableField/EditableField';


/** Seção 1: Resumo do Diagnóstico */
export const SecaoResumoDiagnostico: React.FC<{ diagnostico: DiagnosticoDados; potencial?: PotencialAtleta; insightIA?: string; isLoading?: boolean }> = ({ diagnostico, potencial, insightIA, isLoading }) => {
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
export const SecaoVisaoAnual: React.FC<{ plano: PlanoTreino }> = ({ plano }) => {
    return (
        <SectionCard icon={Calendar} title="Visão Geral do Plano Anual" subtitle="Macro-objetivos de longo prazo para atingir as proporções áureas">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {plano?.visaoAnual?.trimestres?.map((t) => (
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
                            {t.foco?.map((f, i) => (
                                <p key={i} className="text-sm text-gray-300">• {f}</p>
                            ))}
                        </div>
                        <div className="pt-4 border-t border-white/5">
                            <p className="text-xs text-gray-500 mb-1 uppercase tracking-widest">Semana {t.semanas?.[0]} a {t.semanas?.[1]}</p>
                            <p className="text-base font-bold text-white">Score Alvo: {t.scoreEsperado}</p>
                        </div>
                    </div>
                ))}
            </div>
        </SectionCard>
    );
};

/** Seção 3: Trimestre Atual */
export const SecaoTrimestreAtual: React.FC<{ plano: PlanoTreino }> = ({ plano }) => {
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
                        {plano?.trimestreAtual?.volumePorGrupo?.map((v) => (
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

/** Seção 4: Divisão de Treino — derivada de treinos[] (fonte única de verdade) */
export const SecaoDivisao: React.FC<{ treinos: TreinoDetalhado[] }> = ({ treinos }) => {
    const letras = treinos.map(t => t.letra).join('');
    const frequencia = treinos.length;

    return (
        <SectionCard icon={LayoutGrid} title="Divisão do Plano" subtitle="Como o trabalho é distribuído ao longo da semana">
            <div className="flex items-center gap-6">
                <div className="bg-primary/10 border border-primary/20 px-6 py-4 rounded-2xl">
                    <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">Estratégia</p>
                    <p className="text-3xl font-black text-white">{letras}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/10 px-6 py-4 rounded-2xl">
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Frequência</p>
                    <p className="text-3xl font-black text-white">{frequencia}x <span className="text-sm text-gray-500 font-normal">semanal</span></p>
                </div>
            </div>
        </SectionCard>
    );
};

/** Seção 5: Treinos Detalhados */
export const SecaoTreinosSemanais: React.FC<{ treinos: TreinoDetalhado[] }> = ({ treinos }) => {
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
