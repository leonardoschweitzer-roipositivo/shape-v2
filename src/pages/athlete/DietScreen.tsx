/**
 * DietScreen - Tela DIETA do Portal do Atleta
 * 
 * Tela dedicada à dieta com widgets visuais ricos:
 * - Header com fase da dieta
 * - Card de Dieta de Hoje (macros consumidos vs meta)
 * - Dica do Coach
 * - Estratégia Calórica (TDEE, déficit, metas por dia)
 * - Macros Detalhados (treino vs descanso)
 * - Refeições do Dia (accordion)
 * - Projeção Mensal
 * - Cardápio Sugerido
 * - Regras de Ajuste
 */

import React, { useState } from 'react'
import {
    Utensils, Flame, Zap, TrendingDown, TrendingUp, Moon, Dumbbell,
    ChevronDown, ChevronUp, ArrowRight, Target, Scale, AlertTriangle,
    CheckCircle2, Clock, Apple,
} from 'lucide-react'
import { HeaderIdentidade } from './components/HeaderIdentidade'
import { CardDieta } from '../../components/organisms/CardDieta'
import { DicaCoach } from '../../components/molecules/DicaCoach'
import type { DietOfDay, DicaCoach as DicaCoachType } from '../../types/athlete-portal'
import type { PlanoDieta, RefeicaoEstrutura, CardapioRefeicao, RegraAjuste } from '../../services/calculations/dieta'

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface DietScreenProps {
    dieta: DietOfDay
    dicaCoach: DicaCoachType
    planoDieta: PlanoDieta | null
    isTreinoDay: boolean
    nome?: string
    sexo?: string
    altura?: number
    peso?: number
    personalNome?: string
    onRegistrarRefeicao: () => void
    onFalarComCoach: () => void
}

// ═══════════════════════════════════════════════════════════
// FASE CONFIG
// ═══════════════════════════════════════════════════════════

const FASE_CONFIG = {
    CUTTING: { label: 'CUTTING', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: TrendingDown },
    RECOMPOSICAO: { label: 'RECOMPOSIÇÃO', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Zap },
    BULKING: { label: 'BULKING', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: TrendingUp },
    MANUTENCAO: { label: 'MANUTENÇÃO', color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', icon: Target },
} as const

// ═══════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════

function FaseHeader({ plano }: { plano: PlanoDieta }) {
    const config = FASE_CONFIG[plano.fase] || FASE_CONFIG.MANUTENCAO
    const Icon = config.icon

    return (
        <div className={`rounded-2xl p-6 border ${config.bg} ${config.border} flex items-center gap-4`}>
            <div className={`w-14 h-14 rounded-2xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={28} className={config.color} />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-white uppercase tracking-wide truncate mb-0.5">
                    {config.label}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed truncate">
                    {plano.estrategiaPrincipal || plano.faseLabel}
                </p>
            </div>
        </div>
    )
}

function EstrategiaCard({ plano }: { plano: PlanoDieta }) {
    const isDeficit = plano.deficit > 0

    return (
        <div className="bg-surface-deep rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <Flame size={20} className="text-amber-400" />
                </div>
                <h3 className="text-base font-bold text-white uppercase tracking-wide">Estratégia Calórica</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {/* TDEE */}
                <div className="bg-white/[0.03] rounded-xl p-3.5 border border-white/5">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">TDEE</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-white">{plano.tdee?.toLocaleString('pt-BR')}</span>
                        <span className="text-[10px] text-gray-600">kcal</span>
                    </div>
                </div>

                {/* Déficit/Superávit */}
                <div className="bg-white/[0.03] rounded-xl p-3.5 border border-white/5">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                        {isDeficit ? 'DÉFICIT' : 'SUPERÁVIT'}
                    </span>
                    <div className="flex items-baseline gap-1">
                        <span className={`text-xl font-black ${isDeficit ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {Math.abs(plano.deficit)}
                        </span>
                        <span className="text-[10px] text-gray-600">kcal ({plano.deficitPct}%)</span>
                    </div>
                </div>

                {/* Dia de Treino */}
                <div className="bg-white/[0.03] rounded-xl p-3.5 border border-white/5">
                    <div className="flex items-center gap-1.5 mb-1">
                        <Dumbbell size={10} className="text-indigo-400" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">DIA TREINO</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-indigo-400">{plano.calDiasTreino?.toLocaleString('pt-BR')}</span>
                        <span className="text-[10px] text-gray-600">kcal</span>
                    </div>
                </div>

                {/* Dia de Descanso */}
                <div className="bg-white/[0.03] rounded-xl p-3.5 border border-white/5">
                    <div className="flex items-center gap-1.5 mb-1">
                        <Moon size={10} className="text-purple-400" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">DIA DESCANSO</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-purple-400">{plano.calDiasDescanso?.toLocaleString('pt-BR')}</span>
                        <span className="text-[10px] text-gray-600">kcal</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function MacroBar({ label, gramas, gKg, pct, color }: { label: string; gramas: number; gKg: number; pct: number; color: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{label}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{pct}%</span>
                </div>
                <div className="flex items-baseline gap-1.5 mb-1.5">
                    <span className="text-sm font-black text-white">{gramas}g</span>
                    <span className="text-[10px] text-gray-600">({gKg} g/kg)</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${Math.min(100, pct)}%` }} />
                </div>
            </div>
        </div>
    )
}

function MacrosDetalhados({ plano }: { plano: PlanoDieta }) {
    const [showDescanso, setShowDescanso] = useState(false)
    const macros = showDescanso ? plano.macrosDescanso : plano.macrosTreino

    return (
        <div className="bg-surface-deep rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Target size={20} className="text-purple-400" />
                </div>
                <h3 className="text-base font-bold text-white uppercase tracking-wide">Macros Detalhados</h3>
            </div>

            {/* Toggle Treino/Descanso */}
            <div className="flex bg-white/[0.03] rounded-xl p-1 mb-4 border border-white/5">
                <button
                    onClick={() => setShowDescanso(false)}
                    className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${!showDescanso
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        : 'text-gray-500 border border-transparent'
                        }`}
                >
                    <Dumbbell size={12} className="inline-block mr-1 -mt-0.5" />
                    Dia Treino
                </button>
                <button
                    onClick={() => setShowDescanso(true)}
                    className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${showDescanso
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'text-gray-500 border border-transparent'
                        }`}
                >
                    <Moon size={12} className="inline-block mr-1 -mt-0.5" />
                    Dia Descanso
                </button>
            </div>

            <div className="space-y-3">
                <MacroBar
                    label="Proteína"
                    gramas={macros.proteina.gramas}
                    gKg={macros.proteina.gKg}
                    pct={macros.proteina.pct}
                    color="bg-purple-500"
                />
                <MacroBar
                    label="Carboidrato"
                    gramas={macros.carboidrato.gramas}
                    gKg={macros.carboidrato.gKg}
                    pct={macros.carboidrato.pct}
                    color="bg-orange-500"
                />
                <MacroBar
                    label="Gordura"
                    gramas={macros.gordura.gramas}
                    gKg={macros.gordura.gKg}
                    pct={macros.gordura.pct}
                    color="bg-yellow-500"
                />
            </div>

            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Total</span>
                <span className="text-sm font-black text-white">
                    {(showDescanso ? plano.calDiasDescanso : plano.calDiasTreino)?.toLocaleString('pt-BR')} kcal
                </span>
            </div>
        </div>
    )
}

function RefeicaoItem({ refeicao, isOpen, onToggle }: { refeicao: RefeicaoEstrutura; isOpen: boolean; onToggle: () => void }) {
    return (
        <div className={`rounded-xl border transition-colors ${isOpen ? 'bg-white/[0.03] border-white/10' : 'bg-transparent border-white/5'}`}>
            <button
                onClick={onToggle}
                className="w-full flex items-center gap-3 p-3.5 text-left"
            >
                <span className="text-lg">{refeicao.emoji}</span>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate">{refeicao.nome}</span>
                        <span className="text-[10px] text-gray-500 font-mono ml-2">{refeicao.horario}</span>
                    </div>
                    <span className="text-[10px] text-gray-500">
                        {refeicao.kcal} kcal · {refeicao.proteina}P / {refeicao.carboidrato}C / {refeicao.gordura}G
                    </span>
                </div>
                {isOpen ? <ChevronUp size={14} className="text-gray-500 flex-shrink-0" /> : <ChevronDown size={14} className="text-gray-500 flex-shrink-0" />}
            </button>
            {isOpen && refeicao.observacao && (
                <div className="px-3.5 pb-3 pt-0">
                    <p className="text-[10px] text-gray-400 italic pl-8">💡 {refeicao.observacao}</p>
                </div>
            )}
        </div>
    )
}

function RefeicoesAccordion({ plano, isTreinoDay }: { plano: PlanoDieta; isTreinoDay: boolean }) {
    const [openIdx, setOpenIdx] = useState<number | null>(null)
    const refeicoes = isTreinoDay ? plano.refeicoesTreino : plano.refeicoesDescanso

    if (!refeicoes?.length) return null

    return (
        <div className="bg-surface-deep rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Clock size={20} className="text-green-400" />
                </div>
                <div>
                    <h3 className="text-base font-bold text-white uppercase tracking-wide">Refeições do Dia</h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                        {isTreinoDay ? '🏋️ Dia de Treino' : '😴 Dia de Descanso'} · {refeicoes.length} refeições
                    </p>
                </div>
            </div>

            <div className="space-y-1.5">
                {refeicoes.map((ref, idx) => (
                    <RefeicaoItem
                        key={idx}
                        refeicao={ref}
                        isOpen={openIdx === idx}
                        onToggle={() => setOpenIdx(openIdx === idx ? null : idx)}
                    />
                ))}
            </div>
        </div>
    )
}

function ProjecaoMensal({ plano }: { plano: PlanoDieta }) {
    const proj = plano.projecaoMensal
    if (!proj) return null

    const isLoss = proj.perdaGorduraKg > 0

    return (
        <div className="bg-surface-deep rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
                    <Scale size={20} className="text-cyan-400" />
                </div>
                <h3 className="text-base font-bold text-white uppercase tracking-wide">Projeção Mensal</h3>
            </div>

            <div className="space-y-3">
                {/* Peso */}
                <div className="flex items-center gap-3 bg-white/[0.03] rounded-xl p-3.5 border border-white/5">
                    <span className="text-lg">⚖️</span>
                    <div className="flex-1">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">Peso</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-white">{proj.pesoInicial} kg</span>
                            <ArrowRight size={14} className={isLoss ? 'text-emerald-400' : 'text-blue-400'} />
                            <span className={`text-sm font-black ${isLoss ? 'text-emerald-400' : 'text-blue-400'}`}>
                                {proj.pesoFinal} kg
                            </span>
                        </div>
                    </div>
                </div>

                {/* BF */}
                <div className="flex items-center gap-3 bg-white/[0.03] rounded-xl p-3.5 border border-white/5">
                    <span className="text-lg">📊</span>
                    <div className="flex-1">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">% Gordura</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-white">{proj.bfInicial}%</span>
                            <ArrowRight size={14} className="text-emerald-400" />
                            <span className="text-sm font-black text-emerald-400">{proj.bfFinal}%</span>
                        </div>
                    </div>
                </div>

                {/* Resultado estimado */}
                <div className={`rounded-xl p-3.5 border ${isLoss ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-blue-500/5 border-blue-500/20'}`}>
                    <p className={`text-xs font-bold text-center ${isLoss ? 'text-emerald-400' : 'text-blue-400'}`}>
                        {isLoss
                            ? `🔥 Estimativa: -${proj.perdaGorduraKg} kg de gordura neste mês`
                            : `💪 Estimativa: +${Math.abs(proj.perdaGorduraKg)} kg de massa neste mês`
                        }
                    </p>
                </div>
            </div>
        </div>
    )
}

function CardapioSugerido({ plano }: { plano: PlanoDieta }) {
    const [openIdx, setOpenIdx] = useState<number | null>(null)

    if (!plano.cardapio?.length) return null

    return (
        <div className="bg-surface-deep rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <Apple size={20} className="text-orange-400" />
                </div>
                <div>
                    <h3 className="text-base font-bold text-white uppercase tracking-wide">Cardápio Sugerido</h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">Opções flexíveis por refeição</p>
                </div>
            </div>

            <div className="space-y-1.5">
                {plano.cardapio.map((refeicao: CardapioRefeicao, idx: number) => {
                    const isOpen = openIdx === idx
                    return (
                        <div key={idx} className={`rounded-xl border transition-colors ${isOpen ? 'bg-white/[0.03] border-white/10' : 'border-white/5'}`}>
                            <button
                                onClick={() => setOpenIdx(isOpen ? null : idx)}
                                className="w-full flex items-center justify-between p-3.5 text-left"
                            >
                                <div>
                                    <span className="text-xs font-bold text-white">{refeicao.nome}</span>
                                    <span className="text-[10px] text-gray-500 ml-2 font-mono">{refeicao.macros}</span>
                                </div>
                                {isOpen ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
                            </button>

                            {isOpen && (
                                <div className="px-3.5 pb-3.5 space-y-3">
                                    {refeicao.opcoes.map((opcao, oIdx) => (
                                        <div key={oIdx} className="bg-white/[0.02] rounded-lg p-3 border border-white/5">
                                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wider mb-1.5 block">
                                                Opção {opcao.letra}
                                            </span>
                                            <ul className="space-y-1">
                                                {opcao.itens.map((item, iIdx) => (
                                                    <li key={iIdx} className="text-[11px] text-gray-300 flex items-start gap-1.5">
                                                        <span className="text-gray-600 mt-0.5">•</span>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function RegrasAjusteCard({ plano }: { plano: PlanoDieta }) {
    const [isOpen, setIsOpen] = useState(false)

    if (!plano.regrasAjuste?.length) return null

    const tipoConfig = {
        ok: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
        danger: { icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
    }

    return (
        <div className="bg-surface-deep rounded-2xl border border-white/5 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-3 p-6 text-left"
            >
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle size={20} className="text-amber-400" />
                </div>
                <div className="flex-1">
                    <h3 className="text-base font-bold text-white uppercase tracking-wide">Regras de Ajuste</h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">Quando e como ajustar a dieta</p>
                </div>
                {isOpen ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
            </button>

            {isOpen && (
                <div className="px-5 pb-5 space-y-2">
                    {plano.regrasAjuste.map((regra: RegraAjuste, idx: number) => {
                        const config = tipoConfig[regra.tipo]
                        const Icon = config.icon
                        return (
                            <div key={idx} className={`rounded-xl p-3.5 border ${config.bg} ${config.border}`}>
                                <div className="flex items-start gap-2.5">
                                    <Icon size={14} className={`${config.color} mt-0.5 flex-shrink-0`} />
                                    <div>
                                        <p className="text-[11px] font-bold text-white mb-0.5">{regra.cenario}</p>
                                        <p className="text-[10px] text-gray-400">{regra.ajuste}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════

export function DietScreen({
    dieta,
    dicaCoach,
    planoDieta,
    isTreinoDay,
    nome,
    sexo,
    altura,
    peso,
    personalNome,
    onRegistrarRefeicao,
    onFalarComCoach,
}: DietScreenProps) {
    // Se não tem plano de dieta, mostrar estado vazio
    if (!planoDieta) {
        return (
            <div className="min-h-screen bg-background-dark pb-20">
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center pt-24">
                    <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6">
                        <Utensils size={40} className="text-indigo-400" />
                    </div>
                    <h2 className="text-white text-xl font-black uppercase">Minha Dieta</h2>
                    <p className="text-gray-400 mt-2 max-w-xs">
                        Seu Personal ainda não gerou um plano de dieta. Peça a ele para criar o seu plano personalizado!
                    </p>
                </div>
            </div>
        )
    }

    const proteinMissing = (dieta.metaProteina - dieta.consumidoProteina).toFixed(1).replace('.', ',')
    const displayCoachTip = {
        ...dicaCoach,
        mensagem: dicaCoach.tipo === 'alerta' && parseFloat(proteinMissing.replace(',', '.')) > 0
            ? `Faltam ${proteinMissing}g de proteína hoje. Que tal um shake pós-treino com 2 scoops de whey?`
            : dicaCoach.mensagem
    }

    return (
        <div className="min-h-screen bg-background-dark pb-20">
            {/* Header */}
            <HeaderIdentidade
                nome={nome || planoDieta?.nomeAtleta || ''}
                sexo={sexo === 'M' ? 'MASCULINO' : 'FEMININO'}
                altura={altura ?? 0}
                peso={peso ?? 0}
                fotoUrl={undefined}
                personalNome={personalNome}
                personalRanking={3}
            />

            <div className="px-4 py-4 space-y-4">
                {/* 1. Objetivo (Fase do Plano) */}
                <FaseHeader plano={planoDieta} />

                {/* 2. Macros do Dia */}
                <CardDieta
                    dieta={dieta}
                    onRegistrarRefeicao={onRegistrarRefeicao}
                />

                {/* 3. Cardápio Sugerido */}
                <CardapioSugerido plano={planoDieta} />

                {/* 4. Refeições do Dia */}
                <RefeicoesAccordion plano={planoDieta} isTreinoDay={isTreinoDay} />

                {/* 5. Alerta do Coach (Mensagem Dinâmica) */}
                <DicaCoach
                    dica={displayCoachTip}
                    onFalarComCoach={onFalarComCoach}
                />

                {/* Divider sutil */}
                <div className="flex items-center gap-3 px-1 pt-2">
                    <div className="h-px flex-1 bg-white/5" />
                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">Seu Plano</span>
                    <div className="h-px flex-1 bg-white/5" />
                </div>

                {/* 6. Projeção Mensal */}
                <ProjecaoMensal plano={planoDieta} />

                {/* 7. Regras de Ajuste */}
                <RegrasAjusteCard plano={planoDieta} />
            </div>
        </div>
    )
}
