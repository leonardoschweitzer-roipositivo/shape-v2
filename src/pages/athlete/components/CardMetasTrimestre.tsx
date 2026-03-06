/**
 * CardMetasTrimestre — Metas do Trimestre (Home do Portal do Aluno)
 *
 * Exibe as metas dos próximos 3 meses derivadas do Diagnóstico de Evolução:
 * - Top 3 proporções com maior deficiência (medida em cm + ratio)
 * - Meta de Peso e Gordura% do trimestre
 *
 * Dados: `DiagnosticoDados.metasProporcoes[].meta3M` + `projecaoMensal[mes=3]`
 */

import React from 'react';
import { Target, TrendingUp } from 'lucide-react';
import type { DiagnosticoDados, MetaProporcao } from '@/services/calculations/diagnostico';

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────────────────────

interface MedidasAtuais {
    /** medidas musculares em cm */
    ombros?: number;
    cintura?: number;
    braco?: number;       // média bilateral
    antebraco?: number;   // média bilateral
    coxa?: number;        // média bilateral
    panturrilha?: number; // média bilateral
    peitoral?: number;
    costas?: number;
    /** medidas ósseas (da ficha do atleta) */
    punho?: number;
    joelho?: number;
    tornozelo?: number;
}

interface CardMetasTrimestReProps {
    diagnosticoDados: DiagnosticoDados;
    sexo: 'M' | 'F';
    composicaoAtual: {
        peso: number;
        gorduraPct: number;
    };
    medidas: MedidasAtuais;
    onVerPlano?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Label legível para o aluno a partir do nome técnico do grupo */
function getLabelGrupo(grupo: string): { emoji: string; label: string } {
    const map: Record<string, { emoji: string; label: string }> = {
        'Shape-V': { emoji: '🔺', label: 'Ombros / Cintura' },
        'SHR': { emoji: '🔺', label: 'Ombros / Quadril' },
        'Costas': { emoji: '🏋️', label: 'Costas' },
        'Peitoral': { emoji: '🏋️', label: 'Peitoral' },
        'Braço': { emoji: '💪', label: 'Braço' },
        'Proporção de Braço': { emoji: '💪', label: 'Braço' },
        'Antebraço': { emoji: '💪', label: 'Antebraço' },
        'Coxa': { emoji: '🦵', label: 'Coxa' },
        'Desenvolvimento de Coxa': { emoji: '🦵', label: 'Coxa' },
        'Coxa vs Pantur.': { emoji: '🦵', label: 'Coxa' },
        'Proporção de Perna': { emoji: '🦵', label: 'Perna' },
        'Panturrilha': { emoji: '🦵', label: 'Panturrilha' },
        'Desenvolvimento de Panturrilha': { emoji: '🦵', label: 'Panturrilha' },
        'Cintura': { emoji: '🎯', label: 'Cintura' },
        'WHR': { emoji: '🎯', label: 'Cintura / Quadril' },
        'Hip-Thigh': { emoji: '🎯', label: 'Quadril / Coxa' },
        'Tríade': { emoji: '⚖️', label: 'Harmonia Muscular' },
        'Ampulheta': { emoji: '⚖️', label: 'Ampulheta' },
        'Upper vs Lower': { emoji: '↕️', label: 'Equilíbrio Corpo' },
    };
    return map[grupo] ?? { emoji: '📏', label: grupo };
}

/**
 * Calcula o valor em cm do numerador da proporção a partir do ratio e do denominador.
 * Retorna null se não houver denominador disponível.
 */
function calcularCm(
    grupo: string,
    ratio: number,
    medidas: MedidasAtuais
): { atualCm: number; metaCm: number; nomeMedida: string } | null {
    switch (grupo) {
        case 'Shape-V':
        case 'Costas':
            if (!medidas.cintura) return null;
            return {
                atualCm: Math.round(ratio * medidas.cintura * 10) / 10,
                metaCm: 0, // preenchido no chamador com a meta3M
                nomeMedida: grupo === 'Shape-V' ? 'Ombros' : 'Costas',
            };
        case 'SHR':
            // SHR = Ombros / Quadril
            if (!medidas.cintura) return null;
            return {
                atualCm: Math.round(ratio * medidas.cintura * 1.1 * 10) / 10,
                metaCm: 0,
                nomeMedida: 'Ombros',
            };
        case 'Peitoral':
        case 'Proporção de Braço':
            if (!medidas.punho) return null;
            return {
                atualCm: Math.round(ratio * medidas.punho * 10) / 10,
                metaCm: 0,
                nomeMedida: grupo === 'Peitoral' ? 'Peitoral' : 'Braço',
            };
        case 'Braço':
            if (!medidas.punho) return null;
            return {
                atualCm: Math.round(ratio * medidas.punho * 10) / 10,
                metaCm: 0,
                nomeMedida: 'Braço',
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

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTE: Item de Proporção
// ─────────────────────────────────────────────────────────────────────────────

function ItemProporção({
    item,
    medidas,
    proporcaoAtual,
}: {
    item: MetaProporcao;
    medidas: MedidasAtuais;
    proporcaoAtual?: { pct: number };
}) {
    const { emoji, label } = getLabelGrupo(item.grupo);
    const pct = proporcaoAtual?.pct ?? 0;

    // Calcular cm atual
    const cmInfo = calcularCm(item.grupo, item.atual, medidas);
    // Calcular cm meta (denominador × meta3M)
    let metaCmValor: number | null = null;
    if (cmInfo) {
        // Reusa o denominador implícito: metaCm = (atualCm / atual) * meta3M
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
        <div className="py-3">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-base">{emoji}</span>
                <span className="text-white font-bold text-sm uppercase tracking-wider">{label}</span>
                <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${pct >= 90 ? 'bg-emerald-500/20 text-emerald-400' :
                        pct >= 75 ? 'bg-blue-500/20 text-blue-400' :
                            pct >= 50 ? 'bg-amber-500/20 text-amber-400' :
                                'bg-red-500/20 text-red-400'
                    }`}>
                    {pct}% do ideal
                </span>
            </div>

            {/* Medida em cm (quando disponível) */}
            {cmInfo && metaCmValor !== null && deltaCm !== null && (
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-black text-base">
                        {cmInfo.atualCm} cm
                    </span>
                    <span className="text-zinc-500 text-sm">→</span>
                    <span className="text-indigo-300 font-black text-base">
                        {metaCmValor} cm
                    </span>
                    <span className={`text-xs font-bold ml-1 ${deltaCm >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        ({deltaCm >= 0 ? '+' : ''}{deltaCm} cm)
                    </span>
                </div>
            )}

            {/* Ratio */}
            <div className="flex items-center gap-2 mb-2">
                <span className="text-zinc-500 text-xs">Proporção:</span>
                <span className="text-zinc-300 text-xs font-mono">
                    {item.atual.toFixed(2)}
                </span>
                <span className="text-zinc-600 text-xs">→</span>
                <span className="text-indigo-300 text-xs font-mono font-bold">
                    {item.meta3M.toFixed(2)}
                </span>
                {!cmInfo && (
                    <span className="text-emerald-400 text-xs font-bold ml-auto">
                        +{deltaPct}% evolução
                    </span>
                )}
            </div>

            {/* Barra de progresso */}
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                        width: `${barWidth}%`,
                        background: pct >= 90 ? 'linear-gradient(90deg, #10b981, #34d399)' :
                            pct >= 75 ? 'linear-gradient(90deg, #6366f1, #818cf8)' :
                                pct >= 50 ? 'linear-gradient(90deg, #f59e0b, #fcd34d)' :
                                    'linear-gradient(90deg, #ef4444, #f87171)',
                    }}
                />
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

export function CardMetasTrimestre({
    diagnosticoDados,
    composicaoAtual,
    medidas,
    onVerPlano,
}: CardMetasTrimestReProps) {
    const { metasProporcoes, metasComposicao, analiseEstetica } = diagnosticoDados;

    // Top 3 proporções com maior deficiência (já vêm ordenadas por pct asc do gerarMetasProporcoes)
    const top3Proporcoes = (metasProporcoes ?? []).slice(0, 3);

    // Meta de composição do mês 3 (trimestre)
    const projecaoTrimestre = metasComposicao?.projecaoMensal?.find(p => p.mes === 3);
    const pesoMeta3M = projecaoTrimestre?.peso ?? null;
    const gorduraMeta3M = projecaoTrimestre?.gorduraPct ?? null;

    const deltaPeso = pesoMeta3M !== null
        ? Math.round((pesoMeta3M - composicaoAtual.peso) * 10) / 10
        : null;
    const deltaGordura = gorduraMeta3M !== null
        ? Math.round((gorduraMeta3M - composicaoAtual.gorduraPct) * 10) / 10
        : null;

    // Não renderiza se não há dados
    if (top3Proporcoes.length === 0 && pesoMeta3M === null) return null;

    return (
        <div className="mx-4 mb-6 bg-gradient-to-br from-[#0C1220] to-[#0A0F1C] rounded-2xl border border-white/5 shadow-xl overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                        <Target size={16} className="text-indigo-400" />
                    </div>
                    <div>
                        <p className="text-white font-black text-sm uppercase tracking-widest">
                            Metas do Trimestre
                        </p>
                        <p className="text-zinc-500 text-xs">Próximos 3 meses · Plano de Evolução</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 bg-indigo-500/10 rounded-full px-2.5 py-1">
                    <TrendingUp size={11} className="text-indigo-400" />
                    <span className="text-indigo-300 text-xs font-bold">Diagnóstico IA</span>
                </div>
            </div>

            <div className="px-5 pb-4">

                {/* Seção: Medidas em Foco */}
                {top3Proporcoes.length > 0 && (
                    <div className="mt-4">
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">
                            Medidas em Foco
                        </p>
                        <div className="divide-y divide-white/5">
                            {top3Proporcoes.map((item) => {
                                const propAtual = analiseEstetica?.proporcoes?.find(
                                    p => p.grupo === item.grupo
                                );
                                return (
                                    <ItemProporção
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

                {/* Divisor */}
                {top3Proporcoes.length > 0 && (pesoMeta3M !== null || gorduraMeta3M !== null) && (
                    <div className="border-t border-white/5 mt-2 mb-4" />
                )}

                {/* Seção: Composição Corporal */}
                {(pesoMeta3M !== null || gorduraMeta3M !== null) && (
                    <div>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3">
                            Composição Corporal
                        </p>
                        <div className="space-y-2.5">
                            {pesoMeta3M !== null && deltaPeso !== null && (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-base">⚖️</span>
                                        <span className="text-zinc-400 text-sm font-medium">Peso</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-bold text-sm">
                                            {composicaoAtual.peso} kg
                                        </span>
                                        <span className="text-zinc-600 text-xs">→</span>
                                        <span className="text-indigo-300 font-black text-sm">
                                            {pesoMeta3M} kg
                                        </span>
                                        <span className={`text-xs font-bold ${deltaPeso <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                            ({deltaPeso > 0 ? '+' : ''}{deltaPeso} kg)
                                        </span>
                                    </div>
                                </div>
                            )}

                            {gorduraMeta3M !== null && deltaGordura !== null && (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-base">🔥</span>
                                        <span className="text-zinc-400 text-sm font-medium">Gordura</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-bold text-sm">
                                            {composicaoAtual.gorduraPct}%
                                        </span>
                                        <span className="text-zinc-600 text-xs">→</span>
                                        <span className="text-indigo-300 font-black text-sm">
                                            {gorduraMeta3M}%
                                        </span>
                                        <span className={`text-xs font-bold ${deltaGordura <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                            ({deltaGordura > 0 ? '+' : ''}{deltaGordura} p.p.)
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* CTA */}
                {onVerPlano && (
                    <button
                        onClick={onVerPlano}
                        className="mt-5 w-full flex items-center justify-center gap-2 text-indigo-400 hover:text-indigo-300 text-xs font-bold uppercase tracking-widest transition-colors py-2 border border-indigo-500/20 hover:border-indigo-500/40 rounded-xl hover:bg-indigo-500/5"
                    >
                        Ver Plano Completo →
                    </button>
                )}
            </div>
        </div>
    );
}
