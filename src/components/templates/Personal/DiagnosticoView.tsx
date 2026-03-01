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
    TODOS_OBJETIVOS,
    type RecomendacaoObjetivo,
    type ObjetivoVitruvio,
} from '@/services/calculations/objetivos';
import { supabase } from '@/services/supabase';
import { ScoreWidget } from '@/components/organisms/AssessmentCards/ScoreWidget';
import { colors } from '@/tokens';
import { type ContextoAtleta } from './AthleteContextSection';

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
// SUBCOMPONENTS
// ═══════════════════════════════════════════════════════════

/** Stepper reutilizável para as 3 etapas */
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

/** Card de métrica (TMB, NEAT, TDEE) */
const MetricCard: React.FC<{
    icon: React.ElementType;
    label: string;
    value: number;
    unit: string;
    sublabel: string;
    color: string;
}> = ({ icon: Icon, label, value, unit, sublabel, color }) => (
    <div className="bg-[#131B2C] border border-white/10 rounded-xl p-5 text-center">
        <Icon size={24} className={color} style={{ margin: '0 auto 10px' }} />
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">{label}</p>
        <p className="text-3xl font-bold text-white">{value.toLocaleString()}</p>
        <p className="text-sm text-gray-400">{unit}</p>
        <p className="text-xs text-gray-600 mt-2">{sublabel}</p>
    </div>
);

/** Box de insight do Vitrúvio */
const InsightBox: React.FC<{ text: string; title?: string }> = ({ text, title = 'Análise Vitrúvio IA' }) => (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mt-4">
        <div className="flex items-start gap-4">
            <Bot size={26} className="text-primary mt-0.5 shrink-0" />
            <div>
                <p className="text-base font-bold text-primary mb-2 uppercase tracking-wider">{title}</p>
                <p className="text-lg text-gray-300 leading-relaxed">"{text}"</p>
                <p className="text-xs text-gray-600 mt-3 text-right">— VITRÚVIO IA</p>
            </div>
        </div>
    </div>
);

/** Bloco de referências científicas */
const RefsBox: React.FC<{ refs: string[] }> = ({ refs }) => (
    <div className="bg-white/[0.02] rounded-lg px-4 py-3 mt-4">
        <p className="text-[10px] uppercase tracking-wider text-gray-600 font-semibold mb-2">Referências Científicas</p>
        <div className="space-y-1">
            {refs.map((r, i) => (
                <p key={i} className="text-[10px] text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: `[${i + 1}] ${r}` }} />
            ))}
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

/** Card de seção */
const SectionCard: React.FC<{
    icon: React.ElementType;
    title: string;
    subtitle: string;
    children: React.ReactNode;
}> = ({ icon: Icon, title, subtitle, children }) => (
    <div className="bg-[#131B2C] border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-white/10 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon size={22} className="text-primary" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">{title}</h3>
                <p className="text-base text-gray-500">{subtitle}</p>
            </div>
        </div>
        <div className="p-6">{children}</div>
    </div>
);

// ═══════════════════════════════════════════════════════════
// SEÇÕES DO DIAGNÓSTICO
// ═══════════════════════════════════════════════════════════

/** Seção 1: Taxas Metabólicas */
const SecaoTaxas: React.FC<{ dados: DiagnosticoDados; insightIA?: string }> = ({ dados, insightIA }) => {
    const { taxas } = dados;
    const tmbPct = Math.round((taxas.tmbAjustada / taxas.tdee) * 100);
    const neatPct = Math.round((taxas.neat / taxas.tdee) * 100);
    const eatPct = Math.round((taxas.eat / taxas.tdee) * 100);

    return (
        <SectionCard icon={Flame} title="Taxas Metabólicas" subtitle="Gasto calórico diário baseado no contexto do atleta">
            <div className="grid grid-cols-3 gap-5 mb-6">
                <MetricCard icon={Activity} label="TMB" value={taxas.tmbAjustada} unit="kcal/dia" sublabel="Taxa Metab. Basal" color="text-blue-400" />
                <MetricCard icon={Zap} label="TMB + NEAT" value={taxas.tmbAjustada + taxas.neat} unit="kcal/dia" sublabel="+ Atividades Diárias" color="text-yellow-400" />
                <MetricCard icon={Flame} label="TDEE" value={taxas.tdee} unit="kcal/dia" sublabel="+ Treino" color="text-orange-400" />
            </div>

            {/* Barra de composição do gasto */}
            <div className="mb-4">
                <p className="text-base text-gray-500 mb-2 uppercase tracking-wider">Composição do Gasto Diário</p>
                <div className="flex h-10 rounded-lg overflow-hidden">
                    <div className="bg-blue-500/30 flex items-center justify-center" style={{ width: `${tmbPct}%` }}>
                        <span className="text-xs text-blue-300 font-bold">TMB {tmbPct}%</span>
                    </div>
                    <div className="bg-yellow-500/30 flex items-center justify-center" style={{ width: `${neatPct}%` }}>
                        <span className="text-xs text-yellow-300 font-bold">NEAT {neatPct}%</span>
                    </div>
                    <div className="bg-orange-500/30 flex items-center justify-center" style={{ width: `${eatPct}%` }}>
                        <span className="text-xs text-orange-300 font-bold">EAT {eatPct}%</span>
                    </div>
                </div>
            </div>

            {taxas.fatoresConsiderados.length > 0 && (
                <div className="bg-white/[0.03] rounded-lg p-4 mb-4">
                    <p className="text-sm uppercase tracking-wider text-gray-500 mb-2">Fatores Considerados</p>
                    {taxas.fatoresConsiderados.map((f, i) => (
                        <p key={i} className="text-base text-gray-400">• {f}</p>
                    ))}
                </div>
            )}

            <InsightBox text={insightIA || `Seu TDEE total é de ${taxas.tdee} kcal/dia, composto por TMB (${taxas.tmbAjustada} kcal — o mínimo para funções vitais), NEAT (${taxas.neat} kcal — atividades do dia a dia) e EAT (${taxas.eat} kcal — exercícios). ${taxas.neat < 400 ? 'O NEAT está baixo — incluir caminhadas de 20-30min pode elevar o gasto em ~150-200 kcal/dia, acelerando resultados sem esforço extra no treino.' : 'Seu NEAT está em bom nível, mas pode ser otimizado com deslocamentos ativos e atividades diárias.'} ${taxas.fatoresConsiderados.length > 0 ? `Foram considerados ajustes por: ${taxas.fatoresConsiderados.join(', ').toLowerCase()}.` : ''} Para recomposição corporal, o déficit ideal é de 300-500 kcal abaixo do TDEE.`} />

            <RefsBox refs={[
                'Harris, J.A. & Benedict, F.G. (1918). <span class="text-gray-500 italic">"A biometric study of human basal metabolism."</span> Proc Natl Acad Sci, 4(12), 370-373.',
                'Cunningham, J.J. (1991). <span class="text-gray-500 italic">"Body composition as a determinant of energy expenditure."</span> Am J Clin Nutr, 54(6), 963-969.',
                'Levine, J.A. (2002). <span class="text-gray-500 italic">"Non-exercise activity thermogenesis (NEAT)."</span> Best Pract Res Clin Endocrinol Metab, 16(4), 679-702.',
            ]} />
        </SectionCard>
    );
};

/** Seção 2: Composição Corporal */
const SecaoComposicao: React.FC<{ dados: DiagnosticoDados; insightIA?: string }> = ({ dados, insightIA }) => {
    const { composicaoAtual, metasComposicao } = dados;
    const projecao = metasComposicao.projecaoMensal;

    return (
        <SectionCard icon={BarChart3} title="Composição Corporal" subtitle="Análise da distribuição de massa magra e gordura">
            {/* Atual */}
            <div className="grid grid-cols-2 gap-5 mb-6">
                <div className="bg-[#0D1525] border border-white/5 rounded-xl p-5 text-center">
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Peso Total</p>
                    <p className="text-3xl font-bold text-white">{composicaoAtual.peso} <span className="text-sm text-gray-500">kg</span></p>
                    <div className="flex justify-center gap-6 mt-4">
                        <div>
                            <p className="text-sm text-emerald-400 font-bold">{composicaoAtual.massaMagra} kg</p>
                            <p className="text-xs text-gray-600">Massa Magra</p>
                        </div>
                        <div>
                            <p className="text-sm text-red-400 font-bold">{composicaoAtual.massaGorda} kg</p>
                            <p className="text-xs text-gray-600">Massa Gorda</p>
                        </div>
                    </div>
                </div>
                <div className="bg-[#0D1525] border border-white/5 rounded-xl p-5 text-center">
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Gordura Corporal</p>
                    <p className="text-3xl font-bold text-white">{composicaoAtual.gorduraPct}<span className="text-sm text-gray-500">%</span></p>
                    <div className="mt-4">
                        <ProgressBar pct={composicaoAtual.gorduraPct * 3} color="bg-red-500/60" />
                        <p className="text-xs text-gray-600 mt-1">Meta: {metasComposicao.gordura12Meses}%</p>
                    </div>
                </div>
            </div>

            {/* Tabela de projeção */}
            <p className="text-base text-gray-500 mb-3 uppercase tracking-wider font-semibold">Projeção Trimestral</p>
            <div className="overflow-x-auto">
                <table className="w-full text-base">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="text-left py-3 text-gray-500 font-semibold">Período</th>
                            <th className="text-right py-3 text-gray-500 font-semibold">Peso</th>
                            <th className="text-right py-3 text-gray-500 font-semibold">BF%</th>
                            <th className="text-right py-3 text-gray-500 font-semibold">M. Magra</th>
                            <th className="text-right py-3 text-gray-500 font-semibold">M. Gorda</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projecao.map((p) => (
                            <tr key={p.mes} className="border-b border-white/5">
                                <td className="py-3 text-gray-300 font-medium">{p.mes === 0 ? 'Atual' : `Mês ${p.mes}`}</td>
                                <td className="py-3 text-right text-gray-400">{p.peso} kg</td>
                                <td className="py-3 text-right text-gray-400">{p.gorduraPct}%</td>
                                <td className="py-3 text-right text-emerald-400">{p.massaMagra} kg</td>
                                <td className="py-3 text-right text-red-400">{p.massaGorda} kg</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <InsightBox text={insightIA || `Atualmente com ${composicaoAtual.peso}kg — sendo ${composicaoAtual.massaMagra}kg de massa magra e ${composicaoAtual.massaGorda}kg de gordura (${composicaoAtual.gorduraPct}%). ${composicaoAtual.gorduraPct > 20 ? 'A prioridade é reduzir gordura corporal via déficit calórico moderado combinado com treino de força para preservar massa magra.' : composicaoAtual.gorduraPct > 15 ? 'Faixa de transição — é possível buscar recomposição corporal simultânea (perder gordura e ganhar músculo) com alimentação estratégica.' : 'BF em faixa atlética. O foco deve ser ganho gradual de massa magra com surplus calórico controlado (+200-300 kcal).'} Meta 12M: ${metasComposicao.gordura12Meses}% de gordura, peso projetado de ${metasComposicao.peso12Meses}kg. A mudança visual será significativa mesmo que a balança não mude drasticamente.`} />

            <RefsBox refs={[
                'Jackson, A.S. & Pollock, M.L. (1978). <span class="text-gray-500 italic">"Generalized equations for predicting body density of men."</span> Br J Nutr, 40(3), 497-504.',
                'ACSM (2013). <span class="text-gray-500 italic">"Guidelines for Exercise Testing and Prescription."</span> 9th Ed. — Classificação de % gordura corporal.',
                'Helms, E.R. et al. (2014). <span class="text-gray-500 italic">"Evidence-based recommendations for natural bodybuilding contest preparation."</span> J Int Soc Sports Nutr, 11:20.',
            ]} />
        </SectionCard>
    );
};

/** Seção 3: Proporções Áureas */
const SecaoEstetica: React.FC<{ dados: DiagnosticoDados; insightIA?: string }> = ({ dados, insightIA }) => {
    const { analiseEstetica, prioridades } = dados;

    // Mapa de prioridades para badges
    const prioMap = new Map(prioridades.map(p => [p.grupo, p.nivel]));

    return (
        <SectionCard icon={Star} title="PROPORÇÕES ÁUREAS" subtitle="Avaliação baseada na Proporção Áurea (φ = 1.618)">
            {/* Score e classificação */}
            <div className="grid grid-cols-2 gap-5 mb-6">
                <div className="bg-[#0D1525] border border-white/5 rounded-xl p-5 text-center flex flex-col items-center justify-center min-h-[140px]">
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Score Geral</p>
                    <p className="text-5xl font-bold text-primary">{analiseEstetica.scoreAtual}</p>
                    <p className="text-sm text-gray-500 mt-2">Meta 12M: {analiseEstetica.scoreMeta12M}+</p>
                </div>
                <div className="bg-[#0D1525] border border-white/5 rounded-xl p-5 flex flex-col items-center justify-center min-h-[140px]">
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">Classificação</p>
                    {(() => {
                        const stages = [
                            { key: 'INICIANTE', label: 'Iniciante', emoji: '🌱' },
                            { key: 'INTERMEDIÁRIO', label: 'Intermediário', emoji: '📈' },
                            { key: 'ATLÉTICO', label: 'Atlético', emoji: '⚡' },
                            { key: 'AVANÇADO', label: 'Avançado', emoji: '💪' },
                            { key: 'ELITE', label: 'Elite', emoji: '🏆' },
                        ];
                        const currentIdx = stages.findIndex(s => s.key === analiseEstetica.classificacaoAtual);
                        return (
                            <div className="flex items-center w-full justify-between">
                                {stages.map((stage, idx) => {
                                    const isActive = idx === currentIdx;
                                    const isPast = idx < currentIdx;
                                    return (
                                        <React.Fragment key={stage.key}>
                                            {idx > 0 && (
                                                <div className={`h-[2px] flex-1 mx-0.5 ${idx <= currentIdx ? 'bg-primary' : 'bg-white/10'}`} />
                                            )}
                                            <div className="flex flex-col items-center shrink-0" style={{ minWidth: '48px' }}>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all ${isActive
                                                    ? 'bg-primary/20 border-primary shadow-[0_0_12px_rgba(0,201,167,0.3)] scale-110'
                                                    : isPast
                                                        ? 'bg-primary/10 border-primary/40'
                                                        : 'bg-white/[0.03] border-white/10'
                                                    }`}>
                                                    {stage.emoji}
                                                </div>
                                                <span className={`text-[9px] mt-1.5 font-semibold uppercase tracking-wider text-center leading-tight ${isActive ? 'text-primary' : isPast ? 'text-primary/50' : 'text-gray-600'
                                                    }`}>
                                                    {stage.label}
                                                </span>
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* Tabela de proporções */}
            <p className="text-lg text-white mb-3 uppercase tracking-wider font-semibold pb-2 border-b border-white/10">Proporções por Grupo (Índices)</p>

            {/* Cabeçalho */}
            <div className="flex items-center gap-4 px-1 pb-2 mb-4 border-b border-white/10">
                <span className="text-xs uppercase tracking-wider text-white font-semibold w-44 shrink-0">Proporção</span>
                <span className="text-xs uppercase tracking-wider text-white font-semibold w-14 text-right">Atual</span>
                <span className="text-xs uppercase tracking-wider text-white font-semibold flex-1 text-center">Progresso</span>
                <span className="text-xs uppercase tracking-wider text-white font-semibold w-14 text-right">%</span>
                <span className="text-xs uppercase tracking-wider text-white font-semibold w-14 text-right">Meta</span>
            </div>

            <div className="space-y-3 mb-4">
                {analiseEstetica.proporcoes.map((p) => {
                    const prio = prioMap.get(p.grupo);
                    return (
                        <div key={p.grupo} className="flex items-center gap-4">
                            <span className="text-base text-gray-400 w-44 shrink-0 flex items-center gap-2">
                                {prio && (
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${prio === 'ALTA' ? 'bg-red-500/20 text-red-400' :
                                        prio === 'MEDIA' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-green-500/20 text-green-400'
                                        }`}>{prio}</span>
                                )}
                                {p.grupo}
                            </span>
                            <span className="text-base text-white font-semibold w-14 text-right">{p.atual}</span>
                            <div className="flex-1">
                                <ProgressBar pct={p.pct} color={p.pct >= 95 ? 'bg-emerald-500' : p.pct >= 85 ? 'bg-primary' : p.pct >= 70 ? 'bg-yellow-500' : 'bg-red-500'} />
                            </div>
                            <span className={`text-base font-bold w-14 text-right ${p.pct >= 95 ? 'text-emerald-400' : p.pct >= 85 ? 'text-primary' : p.pct >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                                {p.pct}%
                            </span>
                            <span className="text-base text-gray-600 w-14 text-right">{p.ideal}</span>
                        </div>
                    );
                })}
            </div>

            {/* Simetria */}
            <div className="bg-[#0D1525] border border-white/5 rounded-xl p-5 mt-4">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-base text-gray-500 uppercase tracking-wider font-semibold">Análise de Simetria</p>
                    <span className={`text-base font-bold ${analiseEstetica.simetria.scoreGeral >= 95 ? 'text-emerald-400' : analiseEstetica.simetria.scoreGeral >= 85 ? 'text-primary' : 'text-yellow-400'}`}>
                        {analiseEstetica.simetria.scoreGeral}% — {analiseEstetica.simetria.status}
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {analiseEstetica.simetria.itens.map((s) => (
                        <div key={s.grupo} className="flex items-center justify-between text-base bg-white/[0.03] rounded-lg px-4 py-3">
                            <span className="text-gray-400 font-medium">{s.grupo}</span>
                            <div className="flex items-center gap-3">
                                <span className="text-gray-500">D:{s.direito}</span>
                                <span className="text-gray-500">E:{s.esquerdo}</span>
                                <span className={`font-bold ${s.diffPct < 2 ? 'text-emerald-400' : s.diffPct < 4 ? 'text-yellow-400' : 'text-red-400'}`}>
                                    {s.diffPct}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Análise IA das proporções */}
            {(() => {
                const melhores = [...analiseEstetica.proporcoes].sort((a, b) => b.pct - a.pct).slice(0, 2);
                const piores = [...analiseEstetica.proporcoes].sort((a, b) => a.pct - b.pct).slice(0, 2);
                const mediaGeral = Math.round(analiseEstetica.proporcoes.reduce((s, p) => s + p.pct, 0) / analiseEstetica.proporcoes.length);
                const acimaMeta = analiseEstetica.proporcoes.filter(p => p.pct >= 97).length;
                const abaixo50 = analiseEstetica.proporcoes.filter(p => p.pct < 50).length;

                return <InsightBox text={insightIA || (
                    `Média geral das proporções: ${mediaGeral}%. ` +
                    `${acimaMeta > 0 ? `${acimaMeta} proporção(ões) já atingiram ou superaram a meta (${melhores.map(m => m.grupo).join(', ')}).` : `Nenhuma proporção atingiu a meta ainda.`} ` +
                    `${abaixo50 > 0 ? `${abaixo50} proporção(ões) estão abaixo de 50% e precisam de atenção prioritária: ${piores.map(p => `${p.grupo} (${p.pct}%)`).join(', ')}.` : 'Todas as proporções estão acima de 50% — boa base construída.'} ` +
                    `A simetria bilateral está em ${analiseEstetica.simetria.scoreGeral}% (${analiseEstetica.simetria.status}). ` +
                    `O foco do treino deve priorizar as proporções mais fracas para elevar o score geral de ${analiseEstetica.scoreAtual} para ${analiseEstetica.scoreMeta12M}+ em 12 meses.`
                )} />;
            })()}

            <RefsBox refs={[
                'Vitruvius, M. (séc. I a.C.). <span class="text-gray-500 italic">"De Architectura"</span> — Proporções ideais do corpo humano.',
                'Da Vinci, L. (1490). <span class="text-gray-500 italic">"Homem Vitruviano"</span> — Estudo geométrico da proporção áurea (φ = 1.618).',
                'Sandow, E. (1894). <span class="text-gray-500 italic">"Strength and How to Obtain It"</span> — Primeiros índices de proporcionalidade física.',
                'Butt, C. (2010). <span class="text-gray-500 italic">"Your Muscular Potential"</span> — Modelo preditivo baseado em circunferências ósseas (punho/tornozelo).',
            ]} />
        </SectionCard>
    );
};

/** Seção 4: Pontos Fortes e Fracos */
const SecaoPrioridades: React.FC<{ dados: DiagnosticoDados; insightIA?: string }> = ({ dados, insightIA }) => {
    const { analiseEstetica, prioridades } = dados;
    const proporcoes = analiseEstetica.proporcoes;
    const fortes = [...proporcoes].sort((a, b) => b.pct - a.pct).slice(0, 3);
    const fracos = [...proporcoes].sort((a, b) => a.pct - b.pct).slice(0, 3);

    return (
        <SectionCard icon={Target} title="Pontos Fortes e Fracos" subtitle="Prioridades de desenvolvimento para o plano de treino">
            <div className="grid grid-cols-2 gap-5 mb-6">
                {/* Fortes */}
                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-5">
                    <p className="text-base font-bold text-emerald-400 mb-4 uppercase tracking-wider">✅ Pontos Fortes</p>
                    {fortes.map((p) => (
                        <div key={p.grupo} className="flex items-center justify-between mb-3">
                            <span className="text-base text-gray-300">{p.grupo}</span>
                            <span className="text-base font-bold text-emerald-400">{p.pct}%</span>
                        </div>
                    ))}
                </div>

                {/* Fracos */}
                <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-5">
                    <p className="text-base font-bold text-red-400 mb-4 uppercase tracking-wider">⚠️ Pontos Fracos</p>
                    {fracos.map((p) => (
                        <div key={p.grupo} className="flex items-center justify-between mb-3">
                            <span className="text-base text-gray-300">{p.grupo}</span>
                            <span className="text-base font-bold text-red-400">{p.pct}%</span>
                        </div>
                    ))}
                </div>
            </div>



            {(() => {
                const fortes3 = [...analiseEstetica.proporcoes].sort((a, b) => b.pct - a.pct).slice(0, 3);
                const fracos3 = [...analiseEstetica.proporcoes].sort((a, b) => a.pct - b.pct).slice(0, 3);
                const prioAltas = prioridades.filter(p => p.nivel === 'ALTA');
                const assimetrias = analiseEstetica.simetria.itens.filter(s => s.diffPct >= 4);

                return <InsightBox text={insightIA || (
                    `Destaques positivos: ${fortes3.map(f => `${f.grupo} (${f.pct}%)`).join(', ')} — esses grupos devem ser mantidos com volume de manutenção. ` +
                    `Pontos a desenvolver: ${fracos3.map(f => `${f.grupo} (${f.pct}%)`).join(', ')} — receberão volume extra e prioridade no plano de treino. ` +
                    `${prioAltas.length > 0 ? `${prioAltas.length} grupo(s) marcado(s) como prioridade ALTA: ${prioAltas.map(p => p.grupo).join(', ')}.` : 'Nenhum grupo em prioridade crítica.'} ` +
                    `${assimetrias.length > 0 ? `Assimetrias detectadas em ${assimetrias.map(a => `${a.grupo} (${a.diffPct}%)`).join(', ')} — serão corrigidas com trabalho unilateral (halteres e cabos).` : 'Simetria bilateral em bom nível — nenhuma correção unilateral necessária.'}`
                )} />;
            })()}
        </SectionCard>
    );
};

/** Seção 5: Metas 12 Meses */
const SecaoMetas: React.FC<{ dados: DiagnosticoDados; nomeAtleta: string; medidas?: any }> = ({ dados, nomeAtleta, medidas }) => {
    const { analiseEstetica, metasProporcoes, resumoVitruvio } = dados;
    const progressoPct = Math.round((analiseEstetica.scoreAtual / analiseEstetica.scoreMeta12M) * 100);

    return (
        <SectionCard icon={TrendingUp} title="Metas de 12 Meses" subtitle="Objetivos e checkpoints do plano de evolução">
            {/* Meta principal */}
            <div className="bg-[#0D1525] border border-white/5 rounded-xl p-6 text-center mb-6">
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">Meta Principal</p>
                <div className="flex items-center justify-center gap-6 mb-4">
                    <div>
                        <p className="text-3xl font-bold text-white">{analiseEstetica.scoreAtual}</p>
                        <p className="text-xs text-gray-500">{analiseEstetica.classificacaoAtual}</p>
                    </div>
                    <ArrowRight size={22} className="text-primary" />
                    <div>
                        <p className="text-3xl font-bold text-primary">{analiseEstetica.scoreMeta12M}+</p>
                        <p className="text-xs text-gray-500">META</p>
                    </div>
                </div>
                <ProgressBar pct={progressoPct} />
                <p className="text-xs text-gray-600 mt-2">Progresso: {progressoPct}%</p>
            </div>

            {/* Metas trimestrais por proporção */}
            {metasProporcoes.length > 0 && (() => {
                // Mapa de prioridades para badges
                const prioMap = new Map(dados.prioridades.map(p => [p.grupo, p.nivel]));

                // Mapa de referência cm: para cada grupo, qual músculo cresce e qual é fixo
                const getCmRef = (grupo: string, ratioAtual: number, ratio12M: number) => {
                    if (!medidas) return null;
                    const refs: Record<string, { musculo: string; fixo: number; label: string }> = {
                        'Costas': { musculo: 'Costas', fixo: medidas.cintura, label: 'cintura' },
                        'Shape-V': { musculo: 'Ombros', fixo: medidas.cintura, label: 'cintura' },
                        'Peitoral': { musculo: 'Peitoral', fixo: medidas.punho, label: 'punho' },
                        'Braço': { musculo: 'Braço', fixo: medidas.punho, label: 'punho' },
                        'Coxa': { musculo: 'Coxa', fixo: medidas.joelho, label: 'joelho' },
                        'Panturrilha': { musculo: 'Panturrilha', fixo: medidas.tornozelo, label: 'tornozelo' },
                        'Coxa vs Pantur.': { musculo: 'Coxa', fixo: Math.max(medidas.panturrilhaD, medidas.panturrilhaE), label: 'panturrilha' },
                    };
                    const ref = refs[grupo];
                    if (!ref || !ref.fixo) return null;
                    const cmAtual = Math.round(ratioAtual * ref.fixo * 10) / 10;
                    const cm12M = Math.round(ratio12M * ref.fixo * 10) / 10;
                    return { musculo: ref.musculo, cmAtual, cm12M, fixoLabel: ref.label, fixoVal: ref.fixo };
                };

                return (
                    <>
                        <p className="text-base text-gray-500 mb-1 uppercase tracking-wider font-semibold">Metas Trimestrais de Proporções</p>
                        <p className="text-xs text-gray-600 mb-3">Meta 12M baseada em crescimento muscular natural realista (cm/ano por grupo)</p>
                        <div className="overflow-x-auto mb-6">
                            <table className="w-full text-base">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left py-3 text-gray-500 font-semibold">Grupo</th>
                                        <th className="text-right py-3 text-gray-500 font-semibold">Atual</th>
                                        <th className="text-right py-3 text-gray-500 font-semibold">3M</th>
                                        <th className="text-right py-3 text-gray-500 font-semibold">6M</th>
                                        <th className="text-right py-3 text-gray-500 font-semibold">9M</th>
                                        <th className="text-right py-3 text-primary font-semibold">12M</th>
                                        <th className="text-right py-3 text-gray-600 font-semibold">Ideal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {metasProporcoes.map((m) => {
                                        const cm = getCmRef(m.grupo, m.atual, m.meta12M);
                                        const prio = prioMap.get(m.grupo);
                                        return (
                                            <React.Fragment key={m.grupo}>
                                                <tr className={cm ? '' : 'border-b border-white/5'}>
                                                    <td className="pt-3 pb-1 text-gray-300 font-medium flex items-center gap-2">
                                                        {prio && (
                                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${prio === 'ALTA' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                                                prio === 'MEDIA' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                                                    'bg-green-500/20 text-green-400 border border-green-500/30'
                                                                }`}>{prio}</span>
                                                        )}
                                                        {m.grupo}
                                                    </td>
                                                    <td className="pt-3 pb-1 text-right text-gray-400">{m.atual}</td>
                                                    <td className="pt-3 pb-1 text-right text-gray-500">{m.meta3M}</td>
                                                    <td className="pt-3 pb-1 text-right text-gray-500">{m.meta6M}</td>
                                                    <td className="pt-3 pb-1 text-right text-gray-500">{m.meta9M}</td>
                                                    <td className="pt-3 pb-1 text-right text-primary font-bold">{m.meta12M}</td>
                                                    <td className="pt-3 pb-1 text-right text-gray-600">{m.idealFinal}</td>
                                                </tr>
                                                {cm && (
                                                    <tr className="border-b border-white/5">
                                                        <td colSpan={7} className="pb-3 pt-0">
                                                            <div className="flex items-center gap-2 pl-1">
                                                                <span className="text-[11px] text-gray-600">📐</span>
                                                                <span className="text-[11px] text-gray-500">
                                                                    {cm.musculo}: <span className="text-gray-400 font-medium">{cm.cmAtual}cm</span>
                                                                    {' → '}
                                                                    <span className="text-primary font-medium">{cm.cm12M}cm</span>
                                                                    <span className="text-gray-600"> ({cm.fixoLabel}: {cm.fixoVal}cm fixo)</span>
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-white/[0.02] rounded-lg px-4 py-3 mt-2 mb-6">
                            <p className="text-[10px] uppercase tracking-wider text-gray-600 font-semibold mb-2">Referências Científicas — Taxas de Crescimento</p>
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-600 leading-relaxed">
                                    [1] Schoenfeld, B.J. (2010). <span className="text-gray-500 italic">"The mechanisms of muscle hypertrophy and their application to resistance training."</span> J Strength Cond Res, 24(10), 2857-2872.
                                </p>
                                <p className="text-[10px] text-gray-600 leading-relaxed">
                                    [2] Wernbom, M., Augustsson, J., & Thomeé, R. (2007). <span className="text-gray-500 italic">"The influence of frequency, intensity, volume and mode of strength training on whole muscle cross-sectional area in humans."</span> Sports Medicine, 37(3), 225-264.
                                </p>
                                <p className="text-[10px] text-gray-600 leading-relaxed">
                                    [3] ACSM (2009). <span className="text-gray-500 italic">"Position Stand: Progression models in resistance training for healthy adults."</span> Med Sci Sports Exerc, 41(3), 687-708.
                                </p>
                                <p className="text-[10px] text-gray-600 leading-relaxed">
                                    [4] Butt, C. (2010). <span className="text-gray-500 italic">"Your Muscular Potential: How to predict your maximum muscular bodyweight and measurements."</span> — Modelo preditivo baseado em estrutura óssea (punho/tornozelo).
                                </p>
                            </div>
                        </div>
                    </>
                );
            })()}

            {/* Resumo do Vitrúvio */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mt-4">
                <div className="flex items-start gap-4">
                    <Bot size={26} className="text-primary mt-0.5 shrink-0" />
                    <div>
                        <p className="text-base font-bold text-primary mb-2 uppercase tracking-wider">Resumo do Vitrúvio</p>
                        <p className="text-lg text-gray-300 leading-relaxed">"{resumoVitruvio}"</p>
                        <p className="text-xs text-gray-600 mt-3 text-right">— VITRÚVIO IA</p>
                    </div>
                </div>
            </div>
        </SectionCard>
    );
};

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

const generateGeneralAnalysis = (contexto: ContextoAtleta | null | undefined, score: number): string => {
    const scoreText = score >= 85 ? "nível de elite" : score >= 70 ? "perfil atlético sólido" : score >= 60 ? "estágio intermediário" : "fase inicial de desenvolvimento";

    if (!contexto) {
        return `O atleta encontra-se em um ${scoreText} (Score: ${score}). No entanto, a ausência de dados de contexto impossibilita uma análise de riscos e lifestyle. Recomenda-se preencher a ficha para personalizar as próximas etapas de treino e dieta.`;
    }

    const insights = [];

    // Saúde e Lesões (Prioridade Máxima)
    if ((contexto.problemas_saude && contexto.problemas_saude.toLowerCase() !== 'nenhum') ||
        (contexto.dores_lesoes && contexto.dores_lesoes.toLowerCase() !== 'nenhuma')) {
        insights.push(`Considerando ${contexto.problemas_saude || 'o histórico de saúde'} e as dores/lesões relatadas (${contexto.dores_lesoes}), a estratégia deve ser cautelosa.`);
    } else {
        insights.push("Com saúde íntegra e sem lesões relatadas, o atleta está apto a protocolos de alta intensidade.");
    }

    // Lifestyle e Histórico
    if (contexto.estilo_vida || contexto.historico_treino) {
        insights.push(`O lifestyle (${contexto.estilo_vida || 'não especificado'}) e o histórico de ${contexto.historico_treino || 'treino'} serão fundamentais para ajustar o volume de trabalho.`);
    }

    const baseMessage = `Com um score de ${score} (${scoreText}), o foco do diagnóstico será ${score >= 75 ? 'lapidar detalhes estéticos e proporções áureas' : 'construir uma base sólida de composição corporal'}.`;

    return `${baseMessage} ${insights.join(' ')} Cruzaremos estes dados com a volumetria métrica para definir o plano de ataque.`;
};

const getScoreClassification = (score: number) => {
    if (score >= 90) return { nivel: 'ELITE / PRO', emoji: '🏆', cor: colors.semantic.success };
    if (score >= 80) return { nivel: 'AVANÇADO', emoji: '💪', cor: colors.brand.primary };
    if (score >= 70) return { nivel: 'ATLÉTICO', emoji: '⚡', cor: colors.brand.secondary || '#3B82F6' };
    if (score >= 60) return { nivel: 'INTERMEDIÁRIO', emoji: '📈', cor: '#8B5CF6' };
    return { nivel: 'INICIANTE', emoji: '🌱', cor: '#F59E0B' };
};

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

    // Pegar dados da última avaliação
    const ultimaAvaliacao = useMemo(() => {
        if (!atleta || atleta.assessments.length === 0) return null;
        return atleta.assessments[0];
    }, [atleta]);

    if (!atleta || !ultimaAvaliacao) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-gray-500">Atleta não encontrado ou sem avaliação.</p>
            </div>
        );
    }

    const m = ultimaAvaliacao.measurements;

    /** Gera diagnóstico a partir dos dados reais do atleta */
    const handleGerar = () => {
        setEstado('generating');

        // Alias para facilitar mapeamento se vierem como peito/braco etc
        const anyM = m as any;

        // Simular delay de processamento IA
        setTimeout(() => {
            const input: DiagnosticoInput = {
                peso: m.weight,
                altura: m.height,
                idade: atleta.birthDate ? Math.floor((Date.now() - new Date(atleta.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 30,
                sexo: atleta.gender === 'FEMALE' ? 'F' : 'M',
                gorduraPct: ultimaAvaliacao.bf ?? 15,
                score: atleta.score,
                classificacao: atleta.score >= 90 ? 'ELITE' : atleta.score >= 80 ? 'AVANÇADO' : atleta.score >= 70 ? 'ATLÉTICO' : atleta.score >= 60 ? 'INTERMEDIÁRIO' : 'INICIANTE',
                ratio: atleta.ratio,
                freqTreino: 5,
                nivelAtividade: 'SEDENTARIO',
                usaAnabolizantes: atleta.contexto?.medicacoesUso?.descricao ? true : false,
                usaTermogenicos: false,
                nomeAtleta: atleta.name,
                medidas: {
                    ombros: m.shoulders,
                    cintura: m.waist,
                    peitoral: m.chest || anyM.peito,
                    costas: anyM.costas || m.chest || (m.shoulders * 0.9),
                    bracoD: m.armRight || anyM.braco,
                    bracoE: m.armLeft || anyM.braco,
                    antebracoD: m.forearmRight || anyM.antebraco,
                    antebracoE: m.forearmLeft || anyM.antebraco,
                    coxaD: m.thighRight || anyM.coxa,
                    coxaE: m.thighLeft || anyM.coxa,
                    panturrilhaD: m.calfRight || anyM.panturrilha,
                    panturrilhaE: m.calfLeft || anyM.panturrilha,
                    punho: m.wrist || atleta.punho || 17.5,
                    joelho: m.knee || anyM.joelho || 38,
                    tornozelo: m.ankle || atleta.tornozelo || 22,
                    pelvis: m.pelvis || anyM.pelvis || m.waist * 1.1,
                    pescoco: m.neck || anyM.pescoco || 40,
                },
                // Se a avaliação já tem proporções gravadas, usar diretamente (zero discrepância)
                proporcoesPreCalculadas: Array.isArray(ultimaAvaliacao.proporcoes) ? ultimaAvaliacao.proporcoes : undefined,
            };

            // Pipeline completo: Potencial → Diagnóstico reanalisado
            const classificacao = input.score >= 90 ? 'ELITE'
                : input.score >= 80 ? 'AVANÇADO'
                    : input.score >= 70 ? 'ATLÉTICO'
                        : input.score >= 60 ? 'INTERMEDIÁRIO' : 'INICIANTE';
            const potencial = calcularPotencialAtleta(classificacao, input.score, atleta.contexto);
            // Corrigir com valores reais do contexto (não mais hardcoded)
            input.nivelAtividade = inferirNivelAtividade(atleta.contexto);
            input.freqTreino = potencial.frequenciaSemanal;
            const resultado = gerarDiagnosticoCompleto(input, potencial);

            // Calcular o objetivo recomendado baseado nos dados do diagnóstico
            const adonisProp = resultado.analiseEstetica.proporcoes.find(
                p => p.grupo === 'Shape-V' || p.grupo === 'V-Taper'
            );
            const adonisVal = adonisProp?.atual ?? undefined;
            const rec = recomendarObjetivo({
                bf: resultado.composicaoAtual.gorduraPct,
                ffmi: ultimaAvaliacao.ffmi ?? 20,
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
                contexto: atleta.contexto as any,
            };
            enriquecerDiagnosticoComIA(resultado, perfil).then(enriquecido => {
                if (enriquecido !== resultado) {
                    console.info('[DiagnosticoView] 🤖 Diagnóstico enriquecido com IA');
                    setDiagnostico(enriquecido);
                }
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
                    .update({ objetivo_vitruvio: objetivoSelecionado } as any)
                    .eq('atleta_id', atletaId);
                console.info('[Diagnostico] ✅ Objetivo Vitrúvio salvo:', objetivoSelecionado);
            } catch (err) {
                console.warn('[Diagnostico] Aviso ao salvar objetivo:', err);
            }
        }

        setEstado('saved');
        setTimeout(() => setToastStatus(null), 3000);
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
                <div className="bg-[#131B2C] border border-white/10 rounded-2xl p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(0,201,167,0.1)]">
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
                                        <p className="text-lg text-gray-300 leading-relaxed italic">
                                            "{generateGeneralAnalysis(atleta.contexto, atleta.score)}"
                                        </p>
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
                                score={atleta.score}
                                label="SCORE GERAL"
                                change={atleta.scoreVariation >= 0 ? `+${atleta.scoreVariation}%` : `${atleta.scoreVariation}%`}
                                classification={getScoreClassification(atleta.score)}
                            />
                        </div>
                    </div>
                </div>

                {/* Estado: Ainda não gerou */}
                {estado === 'idle' && (
                    <div className="bg-[#131B2C] border border-white/10 rounded-2xl p-10 text-center">
                        <Stethoscope size={48} className="text-primary mx-auto mb-5" />
                        <h3 className="text-xl font-bold text-white mb-3">Gerar Diagnóstico Completo</h3>
                        <p className="text-base text-gray-500 mb-8 max-w-lg mx-auto">
                            O Vitrúvio vai analisar as medidas, composição corporal, proporções e simetria para criar um diagnóstico personalizado com metas de 12 meses.
                        </p>
                        <button
                            onClick={handleGerar}
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-[#0A0F1C] font-bold text-sm uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(0,201,167,0.3)] transition-all"
                        >
                            <Stethoscope size={18} />
                            Gerar Diagnóstico
                        </button>
                    </div>
                )}

                {/* Estado: Gerando */}
                {estado === 'generating' && (
                    <div className="bg-[#131B2C] border border-white/10 rounded-2xl p-10 text-center">
                        <Loader2 size={48} className="text-primary mx-auto mb-5 animate-spin" />
                        <h3 className="text-xl font-bold text-white mb-3">Analisando dados do atleta...</h3>
                        <p className="text-base text-gray-500">Calculando taxas metabólicas, analisando proporções e gerando metas.</p>
                    </div>
                )}

                {/* Estado: Diagnóstico gerado */}
                {diagnostico && (estado === 'ready' || estado === 'saving' || estado === 'saved') && (
                    <>
                        <SecaoTaxas dados={diagnostico} insightIA={diagnostico.insightsPorSecao?.taxas} />
                        <SecaoComposicao dados={diagnostico} insightIA={diagnostico.insightsPorSecao?.composicao} />
                        <SecaoEstetica dados={diagnostico} insightIA={diagnostico.insightsPorSecao?.proporcoes} />
                        <SecaoPrioridades dados={diagnostico} insightIA={diagnostico.insightsPorSecao?.prioridades} />
                        <SecaoMetas dados={diagnostico} nomeAtleta={atleta.name} medidas={(diagnostico as any)?._medidas} />

                        {/* Card de recomendação de objetivo */}
                        {recomendacao && (
                            <div className="bg-[#131B2C] border border-white/10 rounded-2xl overflow-hidden">
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
                                    <div className={`border rounded-xl p-5 mb-6 ${getObjetivoMeta(recomendacao.objetivo).cor}`}>
                                        <div className="flex items-start gap-4">
                                            <span className="text-4xl">{getObjetivoMeta(recomendacao.objetivo).emoji}</span>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <p className="text-xl font-bold text-white">{getObjetivoMeta(recomendacao.objetivo).label}</p>
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${recomendacao.confianca === 'ALTA' ? 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10'
                                                        : recomendacao.confianca === 'MEDIA' ? 'text-yellow-400 border-yellow-400/40 bg-yellow-400/10'
                                                            : 'text-gray-400 border-gray-400/40 bg-gray-400/10'
                                                        }`}>
                                                        Confiança {recomendacao.confianca}
                                                    </span>
                                                </div>
                                                <p className="text-base text-gray-300 leading-relaxed">{recomendacao.justificativa}</p>
                                                {recomendacao.alternativa && (
                                                    <p className="text-sm text-gray-500 mt-2">
                                                        Alternativa: {getObjetivoMeta(recomendacao.alternativa).emoji} {getObjetivoMeta(recomendacao.alternativa).label}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Seletor manual */}
                                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-semibold">Ou selecione um objetivo diferente:</p>
                                    <div className="grid grid-cols-3 gap-3">
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
                                </div>
                            </div>
                        )}
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
                                        className="flex items-center gap-3 px-8 py-3.5 bg-primary text-[#0A0F1C] font-bold text-sm uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(0,201,167,0.3)] transition-all"
                                    >
                                        Próximo: Plano de Treino
                                        <ArrowRight size={18} />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => onNext()}
                                className="flex items-center gap-3 px-8 py-3.5 bg-primary text-[#0A0F1C] font-bold text-sm uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(0,201,167,0.3)] transition-all"
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
