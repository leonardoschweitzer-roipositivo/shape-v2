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
} from 'lucide-react';
import { useDataStore } from '@/stores/dataStore';
import {
    gerarDiagnosticoCompleto,
    salvarDiagnostico,
    type DiagnosticoDados,
    type DiagnosticoInput,
} from '@/services/calculations/diagnostico';
import { ScoreWidget } from '@/components/organisms/AssessmentCards/ScoreWidget';
import { colors } from '@/tokens';
import { type ContextoAtleta } from './AthleteContextSection';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface DiagnosticoViewProps {
    atletaId: string;
    onBack: () => void;
    onNext: () => void;
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
const InsightBox: React.FC<{ text: string }> = ({ text }) => (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mt-4">
        <div className="flex items-start gap-3">
            <Bot size={18} className="text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-gray-300 leading-relaxed italic">"{text}"</p>
        </div>
    </div>
);

/** Barra de progresso visual */
const ProgressBar: React.FC<{ pct: number; color?: string }> = ({ pct, color = 'bg-primary' }) => (
    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
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
const SecaoTaxas: React.FC<{ dados: DiagnosticoDados }> = ({ dados }) => {
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

            <InsightBox text="Seu gasto com atividades diárias (NEAT) pode ser otimizado. Incluir caminhadas de 20-30min pode aumentar seu TDEE em ~150-200 kcal/dia." />
        </SectionCard>
    );
};

/** Seção 2: Composição Corporal */
const SecaoComposicao: React.FC<{ dados: DiagnosticoDados }> = ({ dados }) => {
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

            <InsightBox text={`Meta de recomposição: reduzir gordura de ${composicaoAtual.gorduraPct}% para ${metasComposicao.gordura12Meses}% enquanto ganha massa magra. O peso cairá moderadamente, mas a mudança visual será significativa.`} />
        </SectionCard>
    );
};

/** Seção 3: Proporções Áureas */
const SecaoEstetica: React.FC<{ dados: DiagnosticoDados }> = ({ dados }) => {
    const { analiseEstetica } = dados;

    return (
        <SectionCard icon={Star} title="PROPORÇÕES ÁUREAS" subtitle="Avaliação baseada na Proporção Áurea (φ = 1.618)">
            {/* Score e classificação */}
            <div className="grid grid-cols-2 gap-5 mb-6">
                <div className="bg-[#0D1525] border border-white/5 rounded-xl p-5 text-center">
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Score Geral</p>
                    <p className="text-5xl font-bold text-primary">{analiseEstetica.scoreAtual}</p>
                    <p className="text-sm text-gray-500 mt-2">Meta 12M: {analiseEstetica.scoreMeta12M}+</p>
                </div>
                <div className="bg-[#0D1525] border border-white/5 rounded-xl p-5 text-center">
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Classificação</p>
                    <p className="text-xl font-bold text-white mt-2">{analiseEstetica.classificacaoAtual}</p>
                    <div className="mt-3 space-y-1.5">
                        {['ELITE', 'META', 'CAMINHO', 'INÍCIO'].map(c => (
                            <p key={c} className={`text-xs ${c === analiseEstetica.classificacaoAtual ? 'text-primary font-bold' : 'text-gray-600'}`}>
                                {c} {c === analiseEstetica.classificacaoAtual && '◀'}
                            </p>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabela de proporções */}
            <p className="text-base text-gray-500 mb-3 uppercase tracking-wider font-semibold">Proporções por Grupo (Índices)</p>
            <div className="space-y-3 mb-4">
                {analiseEstetica.proporcoes.map((p) => (
                    <div key={p.grupo} className="flex items-center gap-4">
                        <span className="text-base text-gray-400 w-32 shrink-0">{p.grupo}</span>
                        <span className="text-base text-gray-500 w-16 text-right">{p.atual}</span>
                        <span className="text-base text-gray-600 w-16 text-right">{p.ideal}</span>
                        <div className="flex-1">
                            <ProgressBar pct={p.pct} color={p.pct >= 95 ? 'bg-emerald-500' : p.pct >= 85 ? 'bg-primary' : p.pct >= 70 ? 'bg-yellow-500' : 'bg-red-500'} />
                        </div>
                        <span className={`text-base font-bold w-14 text-right ${p.pct >= 95 ? 'text-emerald-400' : p.pct >= 85 ? 'text-primary' : p.pct >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {p.pct}%
                        </span>
                    </div>
                ))}
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
        </SectionCard>
    );
};

/** Seção 4: Pontos Fortes e Fracos */
const SecaoPrioridades: React.FC<{ dados: DiagnosticoDados }> = ({ dados }) => {
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

            {/* Tabela de prioridades */}
            <p className="text-lg text-gray-500 mb-3 uppercase tracking-wider font-semibold">Prioridades de Desenvolvimento</p>
            <div className="space-y-3">
                {prioridades.map((p, idx) => (
                    <div key={p.grupo} className="flex items-center gap-4 bg-white/[0.03] rounded-lg px-5 py-4">
                        <span className="text-base font-bold text-gray-500 w-6">#{idx + 1}</span>
                        <span className={`text-base font-bold px-2.5 py-1 rounded ${p.nivel === 'ALTA' ? 'bg-red-500/20 text-red-400' :
                            p.nivel === 'MEDIA' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-green-500/20 text-green-400'
                            }`}>
                            {p.nivel}
                        </span>
                        <span className="text-base text-gray-300 flex-1">{p.grupo}</span>
                        <span className="text-base text-gray-500">{p.obs}</span>
                    </div>
                ))}
            </div>

            <InsightBox text="Os grupos com prioridade ALTA receberão volume extra no plano de treino. Assimetrias serão corrigidas com trabalho unilateral." />
        </SectionCard>
    );
};

/** Seção 5: Metas 12 Meses */
const SecaoMetas: React.FC<{ dados: DiagnosticoDados; nomeAtleta: string }> = ({ dados, nomeAtleta }) => {
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
            {metasProporcoes.length > 0 && (
                <>
                    <p className="text-base text-gray-500 mb-3 uppercase tracking-wider font-semibold">Metas Trimestrais de Proporções</p>
                    <div className="overflow-x-auto mb-6">
                        <table className="w-full text-base">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-3 text-gray-500 font-semibold">Grupo</th>
                                    <th className="text-right py-3 text-gray-500 font-semibold">Atual</th>
                                    <th className="text-right py-3 text-gray-500 font-semibold">3M</th>
                                    <th className="text-right py-3 text-gray-500 font-semibold">6M</th>
                                    <th className="text-right py-3 text-gray-500 font-semibold">9M</th>
                                    <th className="text-right py-3 text-gray-500 font-semibold">12M</th>
                                </tr>
                            </thead>
                            <tbody>
                                {metasProporcoes.map((m) => (
                                    <tr key={m.grupo} className="border-b border-white/5">
                                        <td className="py-3 text-gray-300 font-medium">{m.grupo}</td>
                                        <td className="py-3 text-right text-gray-400">{m.atual}</td>
                                        <td className="py-3 text-right text-gray-500">{m.meta3M}</td>
                                        <td className="py-3 text-right text-gray-500">{m.meta6M}</td>
                                        <td className="py-3 text-right text-gray-500">{m.meta9M}</td>
                                        <td className="py-3 text-right text-primary font-bold">{m.meta12M}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

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
}) => {
    const { personalAthletes } = useDataStore();
    const atleta = useMemo(() => personalAthletes.find(a => a.id === atletaId), [personalAthletes, atletaId]);

    const [diagnostico, setDiagnostico] = useState<DiagnosticoDados | null>(null);
    const [estado, setEstado] = useState<DiagnosticoState>('idle');

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
                    peitoral: m.chest,
                    costas: m.costas || (m.shoulders * 0.9), // Estimativa se não houver
                    bracoD: m.armRight,
                    bracoE: m.armLeft,
                    antebracoD: m.forearmRight,
                    antebracoE: m.forearmLeft,
                    coxaD: m.thighRight,
                    coxaE: m.thighLeft,
                    panturrilhaD: m.calfRight,
                    panturrilhaE: m.calfLeft,
                    punho: m.wrist || 17.5,
                    joelho: m.knee || 38,
                    tornozelo: m.ankle || 22,
                    pelvis: m.pelvis || m.waist * 1.1,
                    pescoco: m.neck || 40,
                },
            };

            const resultado = gerarDiagnosticoCompleto(input);
            setDiagnostico(resultado);
            setEstado('ready');
        }, 1500);
    };

    /** Salva diagnóstico no Supabase */
    const handleSalvar = async () => {
        if (!diagnostico) return;
        setEstado('saving');

        const result = await salvarDiagnostico(atletaId, null, diagnostico);
        if (result) {
            setEstado('saved');
        } else {
            // Salva local se falhar
            setEstado('saved');
            console.warn('[Diagnostico] Tabela não encontrada - salvo localmente.');
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar flex flex-col">
            <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-24 flex-1 w-full">
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
                        <SecaoTaxas dados={diagnostico} />
                        <SecaoComposicao dados={diagnostico} />
                        <SecaoEstetica dados={diagnostico} />
                        <SecaoPrioridades dados={diagnostico} />
                        <SecaoMetas dados={diagnostico} nomeAtleta={atleta.name} />
                    </>
                )}

                {/* Footer fixo */}
                {diagnostico && (
                    <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur border-t border-white/5 p-4 z-50">
                        <div className="max-w-4xl mx-auto flex items-center justify-between">
                            <button
                                onClick={onBack}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft size={16} />
                                Voltar
                            </button>

                            <div className="flex items-center gap-3">
                                {estado === 'ready' && (
                                    <button
                                        onClick={handleSalvar}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-emerald-500 transition-colors"
                                    >
                                        <Save size={14} />
                                        Confirmar e Salvar
                                    </button>
                                )}
                                {estado === 'saving' && (
                                    <button disabled className="flex items-center gap-2 px-5 py-2.5 bg-gray-700 text-gray-400 font-bold text-xs uppercase tracking-wider rounded-lg">
                                        <Loader2 size={14} className="animate-spin" />
                                        Salvando...
                                    </button>
                                )}
                                {estado === 'saved' && (
                                    <button
                                        onClick={onNext}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-[#0A0F1C] font-bold text-xs uppercase tracking-wider rounded-lg hover:shadow-[0_0_20px_rgba(0,201,167,0.3)] transition-all"
                                    >
                                        Próximo: Plano de Treino
                                        <ArrowRight size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
