import React from 'react';
import { Target, TrendingUp, Dumbbell, Zap, Activity, Scale, ArrowUpDown, Triangle, Ruler, Weight, Flame } from 'lucide-react';
import type { MetaProporcao } from '@/types/personal-portal';

interface MedidasAtuais {
    ombros?: number;
    cintura?: number;
    braco?: number;
    antebraco?: number;
    coxa?: number;
    panturrilha?: number;
    peitoral?: number;
    costas?: number;
    punho?: number;
    joelho?: number;
    tornozelo?: number;
}

interface CardMetasTrimestrePersonalProps {
    diagnosticoDados: any;
    sexo: 'M' | 'F';
    composicaoAtual: {
        peso: number;
        gorduraPct: number;
    };
    medidas: MedidasAtuais;
    metasProporcoes: MetaProporcao[];
    scoreAtual?: number;
    scoreMeta3M?: number;
}

function getLabelGrupo(grupo: string): { icone: React.ReactNode; label: string } {
    const map: Record<string, { icone: React.ReactNode; label: string }> = {
        'Shape-V': { icone: <Triangle size={14} className="text-indigo-400 rotate-180" />, label: 'Ombros / Cintura' },
        'SHR': { icone: <Triangle size={14} className="text-indigo-400 rotate-180" />, label: 'Ombros / Quadril' },
        'Costas': { icone: <Dumbbell size={14} className="text-indigo-400" />, label: 'Costas' },
        'Peitoral': { icone: <Dumbbell size={14} className="text-indigo-400" />, label: 'Peitoral' },
        'Braço': { icone: <Zap size={14} className="text-indigo-400" />, label: 'Braço' },
        'Proporção de Braço': { icone: <Zap size={14} className="text-indigo-400" />, label: 'Braço' },
        'Antebraço': { icone: <Zap size={14} className="text-indigo-400" />, label: 'Antebraço' },
        'Coxa': { icone: <Activity size={14} className="text-indigo-400" />, label: 'Coxa' },
        'Desenvolvimento de Coxa': { icone: <Activity size={14} className="text-indigo-400" />, label: 'Coxa' },
        'Coxa vs Pantur.': { icone: <Activity size={14} className="text-indigo-400" />, label: 'Coxa' },
        'Proporção de Perna': { icone: <Activity size={14} className="text-indigo-400" />, label: 'Perna' },
        'Panturrilha': { icone: <Activity size={14} className="text-indigo-400" />, label: 'Panturrilha' },
        'Desenvolvimento de Panturrilha': { icone: <Activity size={14} className="text-indigo-400" />, label: 'Panturrilha' },
        'Cintura': { icone: <Target size={14} className="text-indigo-400" />, label: 'Cintura' },
        'WHR': { icone: <Target size={14} className="text-indigo-400" />, label: 'Cintura / Quadril' },
        'Hip-Thigh': { icone: <Target size={14} className="text-indigo-400" />, label: 'Quadril / Coxa' },
        'Tríade': { icone: <Scale size={14} className="text-indigo-400" />, label: 'Harmonia Muscular' },
        'Ampulheta': { icone: <Scale size={14} className="text-indigo-400" />, label: 'Ampulheta' },
        'Upper vs Lower': { icone: <ArrowUpDown size={14} className="text-indigo-400" />, label: 'Equilíbrio Corpo' },
    };
    return map[grupo] ?? { icone: <Ruler size={14} className="text-indigo-400" />, label: grupo };
}

function calcularCm(
    grupo: string,
    ratio: number,
    medidas: MedidasAtuais
): { atualCm: number; metaCm: number; nomeMedida: string } | null {
    if (!medidas) return null;
    switch (grupo) {
        case 'Shape-V':
        case 'Costas':
            if (!medidas.cintura) return null;
            return {
                atualCm: Math.round(ratio * medidas.cintura * 10) / 10,
                metaCm: 0,
                nomeMedida: grupo === 'Shape-V' ? 'Ombros' : 'Costas',
            };
        case 'SHR':
            if (!medidas.cintura) return null;
            return {
                atualCm: Math.round(ratio * medidas.cintura * 1.1 * 10) / 10,
                metaCm: 0,
                nomeMedida: 'Ombros',
            };
        case 'Peitoral':
        case 'Proporção de Braço':
        case 'Braço':
            if (!medidas.punho) return null;
            return {
                atualCm: Math.round(ratio * medidas.punho * 10) / 10,
                metaCm: 0,
                nomeMedida: grupo === 'Peitoral' ? 'Peitoral' : 'Braço',
            };
        case 'Antebraço':
            if (!medidas.braco) return null;
            return {
                atualCm: Math.round(ratio * medidas.braco * 10) / 10,
                metaCm: 0,
                nomeMedida: 'Antebraço',
            };
        case 'Coxa':
        case 'Desenvolvimento de Coxa':
            if (!medidas.joelho) return null;
            return {
                atualCm: Math.round(ratio * medidas.joelho * 10) / 10,
                metaCm: 0,
                nomeMedida: 'Coxa',
            };
        case 'Coxa vs Pantur.':
        case 'Proporção de Perna':
            if (!medidas.panturrilha) return null;
            return {
                atualCm: Math.round(ratio * medidas.panturrilha * 10) / 10,
                metaCm: 0,
                nomeMedida: 'Coxa',
            };
        case 'Panturrilha':
        case 'Desenvolvimento de Panturrilha':
            if (!medidas.tornozelo) return null;
            return {
                atualCm: Math.round(ratio * medidas.tornozelo * 10) / 10,
                metaCm: 0,
                nomeMedida: 'Panturrilha',
            };
        default:
            return null;
    }
}

function ItemProporcao({
    item,
    medidas,
    proporcaoAtual,
}: {
    item: MetaProporcao;
    medidas: MedidasAtuais;
    proporcaoAtual?: { pct: number };
}) {
    const { icone, label } = getLabelGrupo(item.grupo);
    const pct = proporcaoAtual?.pct ?? 0;

    const cmInfo = calcularCm(item.grupo, item.atual, medidas);
    let metaCmValor: number | null = null;
    if (cmInfo) {
        const denominador = item.atual > 0 ? cmInfo.atualCm / item.atual : 0;
        metaCmValor = Math.round(denominador * item.meta3M * 10) / 10;
    }

    const deltaCm = cmInfo && metaCmValor !== null
        ? Math.round((metaCmValor - cmInfo.atualCm) * 10) / 10
        : null;

    const deltaPct = item.atual > 0
        ? Math.round(((item.meta3M - item.atual) / item.atual) * 1000) / 10
        : 0;

    const barWidth = Math.min(100, Math.max(0, pct));

    return (
        <div className="py-4">
            <div className="flex items-center gap-2 mb-3">
                {icone}
                <span className="text-white font-black text-xs uppercase tracking-widest">{label}</span>
                <span className={`ml-auto text-[10px] font-black px-2.5 py-1 rounded-full ${pct >= 90 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    pct >= 75 ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                        pct >= 50 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                    {pct}% do ideal
                </span>
            </div>

            {cmInfo && metaCmValor !== null && deltaCm !== null && (
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-white font-black text-lg">
                        {cmInfo.atualCm} cm
                    </span>
                    <span className="text-zinc-600 text-sm">→</span>
                    <span className="text-indigo-400 font-black text-lg">
                        {metaCmValor} cm
                    </span>
                    <span className={`text-xs font-bold ml-1 ${deltaCm >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        ({deltaCm >= 0 ? '+' : ''}{deltaCm} cm)
                    </span>
                </div>
            )}

            <div className="flex items-center gap-2 mb-3">
                <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-wider">Proporção:</span>
                <span className="text-zinc-400 text-[10px] font-mono">
                    {item.atual.toFixed(2)}
                </span>
                <span className="text-zinc-700 text-[10px]">→</span>
                <span className="text-indigo-400 text-[10px] font-mono font-black">
                    {item.meta3M.toFixed(2)}
                </span>
                {!cmInfo && (
                    <span className="text-emerald-400 text-[10px] font-black ml-auto uppercase tracking-wider">
                        +{deltaPct}% evolução
                    </span>
                )}
            </div>

            <div className="h-1.5 bg-white/[0.03] rounded-full overflow-hidden border border-white/5">
                <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                        width: `${barWidth}%`,
                        background: pct >= 90 ? '#10b981' :
                            pct >= 75 ? '#6366f1' :
                                pct >= 50 ? '#f59e0b' :
                                    '#ef4444',
                    }}
                />
            </div>
        </div>
    );
}

export function CardMetasTrimestrePersonal({
    diagnosticoDados,
    composicaoAtual,
    medidas,
    metasProporcoes,
    scoreAtual,
    scoreMeta3M
}: CardMetasTrimestrePersonalProps) {
    const analiseEstetica = diagnosticoDados?.analiseEstetica;
    const top3Proporcoes = (metasProporcoes ?? []).slice(0, 3);
    const metasComposicao = diagnosticoDados?.metasComposicao;

    const projecaoTrimestre = metasComposicao?.projecaoMensal?.find((p: any) => p.mes === 3);
    const pesoMeta3M = projecaoTrimestre?.peso ?? null;
    const gorduraMeta3M = projecaoTrimestre?.gorduraPct ?? null;

    const deltaPeso = pesoMeta3M !== null
        ? Math.round((pesoMeta3M - composicaoAtual.peso) * 10) / 10
        : null;
    const deltaGordura = gorduraMeta3M !== null
        ? Math.round((gorduraMeta3M - composicaoAtual.gorduraPct) * 10) / 10
        : null;

    if (top3Proporcoes.length === 0 && pesoMeta3M === null) return null;

    return (
        <div className="bg-surface-deep rounded-3xl border border-white/5 shadow-xl overflow-hidden transition-all hover:border-white/10">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                        <Target size={20} className="text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-white font-black text-sm uppercase tracking-widest">
                            Metas do Trimestre
                        </h3>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mt-0.5">
                            Próximos 3 meses · Plano de Evolução
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 bg-indigo-500/10 rounded-full px-3 py-1.5 border border-indigo-500/20">
                    <TrendingUp size={12} className="text-indigo-400" />
                    <span className="text-indigo-300 text-[10px] font-black uppercase tracking-wider">Diagnóstico IA</span>
                </div>
            </div>

            {/* NOVO: Score e Meta no topo do card, conforme solicitado */}
            {(scoreAtual !== undefined || scoreMeta3M !== undefined) && (
                <div className="mx-6 mt-6 mb-2 p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-500/20 shadow-inner">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Score Atual</p>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-3xl font-black text-white">{scoreAtual?.toFixed(1) || '0.0'}</span>
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">pts</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <TrendingUp size={20} className="text-indigo-500/40 mb-1" />
                            <div className="h-px w-8 bg-indigo-500/20" />
                        </div>

                        <div className="space-y-1 text-right">
                            <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Meta 3 Meses</p>
                            <div className="flex items-baseline justify-end gap-1.5">
                                <span className="text-3xl font-black text-purple-400">{scoreMeta3M?.toFixed(1) || '0.0'}</span>
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">pts</span>
                            </div>
                        </div>
                    </div>

                    {scoreAtual && scoreMeta3M && scoreMeta3M > scoreAtual && (
                        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Faltam {(scoreMeta3M - scoreAtual).toFixed(1)} pts para a meta</p>
                            <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">+{((scoreMeta3M - scoreAtual) / scoreAtual * 100).toFixed(1)}% evolução</p>
                        </div>
                    )}
                </div>
            )}

            <div className="px-6 pb-6">
                {top3Proporcoes.length > 0 && (
                    <div className="mt-6">
                        <h4 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">
                            Medidas em Foco
                        </h4>
                        <div className="divide-y divide-white/5">
                            {top3Proporcoes.map((item) => {
                                const propAtual = analiseEstetica?.proporcoes?.find(
                                    (p: any) => p.grupo === item.grupo
                                );
                                return (
                                    <ItemProporcao
                                        key={item.grupo}
                                        item={item}
                                        medidas={medidas}
                                        proporcaoAtual={propAtual}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}

                {(pesoMeta3M !== null || gorduraMeta3M !== null) && (
                    <div className="mt-6 pt-6 border-t border-white/5">
                        <h4 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">
                            Composição Corporal
                        </h4>
                        <div className="space-y-4">
                            {pesoMeta3M !== null && deltaPeso !== null && (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                            <Weight size={14} className="text-indigo-400" />
                                        </div>
                                        <span className="text-zinc-400 text-sm font-bold uppercase tracking-wider">Peso</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-black text-sm">
                                            {composicaoAtual.peso} kg
                                        </span>
                                        <span className="text-zinc-600 text-xs text-bold">→</span>
                                        <span className="text-indigo-400 font-black text-sm">
                                            {pesoMeta3M} kg
                                        </span>
                                        <span className={`text-[10px] font-black ${deltaPeso <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                            ({deltaPeso > 0 ? '+' : ''}{deltaPeso} kg)
                                        </span>
                                    </div>
                                </div>
                            )}

                            {gorduraMeta3M !== null && deltaGordura !== null && (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                            <Flame size={14} className="text-orange-400" />
                                        </div>
                                        <span className="text-zinc-400 text-sm font-bold uppercase tracking-wider">Gordura</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-black text-sm">
                                            {composicaoAtual.gorduraPct}%
                                        </span>
                                        <span className="text-zinc-600 text-xs font-bold">→</span>
                                        <span className="text-indigo-400 font-black text-sm">
                                            {gorduraMeta3M}%
                                        </span>
                                        <span className={`text-[10px] font-black ${deltaGordura <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                            ({deltaGordura > 0 ? '+' : ''}{deltaGordura} p.p.)
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
