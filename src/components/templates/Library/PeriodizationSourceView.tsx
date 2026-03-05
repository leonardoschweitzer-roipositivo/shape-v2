import React, { useState } from 'react';
import {
    ArrowLeft, BookOpen, BarChart3, Layers, Calendar,
    ShieldCheck, BookMarked, RefreshCcw, TrendingUp, Target, Zap, Clock
} from 'lucide-react';

interface SourceSectionProps {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
}

const SourceSection: React.FC<SourceSectionProps> = ({ icon: Icon, title, children }) => (
    <section className="mb-12 animate-fade-in-up">
        <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                <Icon size={24} className="text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight uppercase">{title}</h2>
        </div>
        <div className="pl-0 sm:pl-16 space-y-4 text-gray-400 leading-relaxed font-light">
            {children}
        </div>
    </section>
);

/* ─── Mesociclo Visual ─── */
const MesocicloDiagram: React.FC<{ weeks: number; deloadWeek: number }> = ({ weeks, deloadWeek }) => {
    const items = Array.from({ length: weeks }, (_, i) => {
        const w = i + 1;
        const isDeload = w === deloadWeek;
        const progress = isDeload ? 0.2 : Math.min(1, (w / (weeks - 1)) * 0.9 + 0.3);
        const heights = ['h-4', 'h-6', 'h-9', 'h-12', 'h-16', 'h-20', 'h-24'];
        const heightIdx = Math.min(heights.length - 1, Math.round(progress * (heights.length - 1)));
        return { w, isDeload, height: heights[isDeload ? 0 : heightIdx] };
    });

    return (
        <div>
            <div className="flex items-end gap-1.5 h-24 mb-2">
                {items.map(({ w, isDeload, height }) => (
                    <div key={w} className="flex-1 flex flex-col items-center gap-1 justify-end">
                        <div className={`w-full rounded-sm transition-all ${height} ${isDeload ? 'bg-yellow-400/40' : 'bg-indigo-400/60'}`} />
                        <span className="text-[9px] text-gray-600 font-mono">{isDeload ? 'DL' : `S${w}`}</span>
                    </div>
                ))}
            </div>
            <div className="flex gap-4 text-[10px] text-gray-500 mt-2">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-indigo-400/60" /><span>Semana de treino (volume cresce)</span></div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-yellow-400/40" /><span>Deload</span></div>
            </div>
        </div>
    );
};

interface PeriodizationSourceViewProps {
    onBack: () => void;
}

export const PeriodizationSourceView: React.FC<PeriodizationSourceViewProps> = ({ onBack }) => {
    const [activeModel, setActiveModel] = useState<'lp' | 'dup' | 'wup' | 'block'>('dup');
    const [activeObjective, setActiveObjective] = useState<'hypertrophy' | 'strength' | 'maintenance'>('hypertrophy');

    const models = {
        lp: {
            label: 'Linear (LP)',
            subtitle: 'Clássica',
            variation: 'A cada 2–4 semanas',
            for: 'Iniciantes, foco em força',
            complexity: 'Baixa',
            phases: [
                { name: 'Hipertrofia (Sem 1–4)', reps: '10–12 reps', intensity: '65–75% 1RM', sets: '4 séries', rir: 'RIR 3' },
                { name: 'Força (Sem 5–8)', reps: '6–8 reps', intensity: '75–85% 1RM', sets: '4 séries', rir: 'RIR 2' },
                { name: 'Pico (Sem 9–12)', reps: '3–5 reps', intensity: '85–95% 1RM', sets: '3–4 séries', rir: 'RIR 1' },
            ],
            color: 'border-blue-500/20',
            tc: 'text-blue-400',
        },
        dup: {
            label: 'Ondulatória Diária (DUP)',
            subtitle: 'Mais Recomendada',
            variation: 'A cada sessão',
            for: 'Intermediários+, hipertrofia',
            complexity: 'Moderada',
            phases: [
                { name: 'Dia Força (Seg)', reps: '5–6 reps', intensity: '82% 1RM', sets: '4–5 séries', rir: 'RIR 1–2' },
                { name: 'Dia Hipertrofia (Qua)', reps: '10–12 reps', intensity: '70% 1RM', sets: '4 séries', rir: 'RIR 2–3' },
                { name: 'Dia Metabólico (Sex)', reps: '15+ reps', intensity: '60% 1RM', sets: '3 séries', rir: 'RIR 1' },
            ],
            color: 'border-indigo-500/20',
            tc: 'text-indigo-400',
        },
        wup: {
            label: 'Ondulatória Semanal (WUP)',
            subtitle: 'Híbrido',
            variation: 'A cada semana',
            for: 'Intermediários — híbrido LP/DUP',
            complexity: 'Baixa–Moderada',
            phases: [
                { name: 'Semana 1', reps: '10–12 reps', intensity: '65–75% 1RM', sets: '3–4 séries', rir: 'Hipertrofia' },
                { name: 'Semana 2', reps: '5–6 reps', intensity: '80–85% 1RM', sets: '4–5 séries', rir: 'Força' },
                { name: 'Semana 3', reps: '8–10 reps', intensity: '70–80% 1RM', sets: '4 séries', rir: 'Hipertrofia++' },
                { name: 'Semana 4', reps: '3–5 reps', intensity: '85–90% 1RM', sets: '5 séries', rir: 'Força++' },
            ],
            color: 'border-violet-500/20',
            tc: 'text-violet-400',
        },
        block: {
            label: 'Periodização em Blocos',
            subtitle: 'Atletas Avançados',
            variation: 'Por bloco (3–4 sem)',
            for: 'Avançados, competidores',
            complexity: 'Alta',
            phases: [
                { name: 'Bloco 1 — Acumulação', reps: '8–12+ reps', intensity: '65–75% 1RM', sets: '5 séries', rir: 'Volume ALTO' },
                { name: 'Bloco 2 — Transmutação', reps: '3–6 reps', intensity: '80–90% 1RM', sets: '4–5 séries', rir: 'Inten. ALTA' },
                { name: 'Bloco 3 — Realização', reps: '1–3 reps', intensity: '90–100%+ 1RM', sets: '3 séries', rir: 'PICO' },
            ],
            color: 'border-rose-500/20',
            tc: 'text-rose-400',
        },
    };

    const objective = {
        hypertrophy: {
            model: 'DUP ou Progressão Linear Simples',
            reason: 'Hipertrofia depende mais de VOLUME que do modelo. Variação de reps (6–12–15) explora diferentes fibras. DUP mantém variedade e motivação.',
            meso: '4–6 semanas + deload',
            progression: 'Dupla progressão (reps → carga)',
            example: [
                'Dia 1 — Força-Hiper: Supino 4×6–8 @RPE8',
                'Dia 2 — Hipertrofia: Sup. inclinado 4×10–12 @RPE8',
                'Dia 3 — Metabólico: Sup. máquina 3×15 @RPE9',
            ],
        },
        strength: {
            model: 'Block ou LP (treinados: DUP)',
            reason: 'Força requer especificidade — treinar pesado. Treinados se beneficiam de variação (DUP). Block permite pico para competição.',
            meso: '4 semanas por bloco + 1 realização',
            progression: 'Progressão por RIR (aproximar da falha)',
            example: [
                'Bloco Acum: Supino 5×8 @70–75%',
                'Bloco Trans: Supino 5×5 @80–85%',
                'Bloco Real: Supino 3×3 @90%+',
            ],
        },
        maintenance: {
            model: 'Simples (sem periodização complexa)',
            reason: 'Volume mínimo para manter: ~1/3 do volume de ganho. 6–9 séries/grupo/sem. 2 sessões/sem full body podem ser suficientes.',
            meso: '8 semanas (ciclos mais longos)',
            progression: 'Manter INTENSIDADE mesmo com volume reduzido',
            example: [
                'Sessão A: Agachamento 3×6–8, Supino 3×6–8, Remada 3×8–10',
                'Sessão B: Terra 3×5, Sup. inclinado 3×8–10, Puxada 3×8–10',
                '2×/sem full body — chave: manter a carga!',
            ],
        },
    };

    const currentModel = models[activeModel];
    const currentObjective = objective[activeObjective];

    return (
        <div className="flex-1 w-full bg-background-dark p-4 md:p-8 pb-32">
            <div className="max-w-4xl mx-auto">

                {/* Navigation */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors group w-fit"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium uppercase tracking-widest">Biblioteca Científica</span>
                    </button>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 uppercase tracking-widest px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 w-fit">
                        <BookOpen size={12} />
                        <span>Plano de Treino / V1.0</span>
                    </div>
                </div>

                {/* Title */}
                <div className="mb-16 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter uppercase mb-6">
                        Periodização de <span className="text-indigo-400">Treino</span>
                    </h1>
                    <p className="text-gray-500 font-light max-w-3xl text-lg mb-6">
                        Base científica do VITRÚVIO para estruturar programas em ciclos, escolher o modelo de periodização, implementar deloads, progredir carga ao longo do tempo e prevenir overtraining.
                    </p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-gray-600 font-mono uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                            Vigente: Fev 2026
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={14} className="text-gray-500" />
                            Módulo Plano de Treino / Evolução
                        </div>
                    </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-indigo-500/20 via-white/5 to-transparent mb-16" />

                {/* ─────────── SEÇÃO 1: HIERARQUIA + FONTES ─────────── */}
                <SourceSection icon={BookMarked} title="1. Hierarquia dos Ciclos e Fontes Científicas">
                    <div className="bg-[#111] border border-indigo-500/10 rounded-xl p-6 mb-6">
                        <h4 className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">Hierarquia dos Ciclos de Treino</h4>
                        <div className="space-y-2">
                            {[
                                { level: 'MACROCICLO', duration: '3–12 meses', desc: 'Período completo (temporada). Contém múltiplos mesociclos. Objetivo geral do atleta.', indent: 0, color: 'border-indigo-400/40' },
                                { level: 'MESOCICLO', duration: '3–6 semanas', desc: 'Bloco com objetivo específico (hipertrofia, força etc). Geralmente 4–6 semanas.', indent: 1, color: 'border-indigo-400/25' },
                                { level: 'MICROCICLO', duration: '1 semana', desc: 'Uma semana de treino — unidade básica de planejamento.', indent: 2, color: 'border-indigo-400/15' },
                                { level: 'SESSÃO DE TREINO', duration: 'Um treino', desc: 'Um treino individual.', indent: 3, color: 'border-indigo-400/10' },
                            ].map(({ level, duration, desc, indent, color }) => (
                                <div key={level} className={`ml-${indent * 4} flex gap-3 items-center`}>
                                    <div className={`flex-1 bg-[#0a0f1c] border ${color} rounded-xl p-3`} style={{ marginLeft: `${indent * 16}px` }}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-white text-xs font-bold">{level}</span>
                                            <span className="text-indigo-400 text-[10px] font-mono">{duration}</span>
                                        </div>
                                        <p className="text-gray-500 text-[11px]">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse min-w-[480px]">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Pesquisador / Estudo</th><th className="pb-3 pr-4 font-semibold">Ano</th><th className="pb-3 font-semibold">Contribuição</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                <tr><td className="py-2.5 text-white">Grgic et al.</td><td className="py-2.5">2017</td><td className="py-2.5">Meta-análise LP vs DUP — hipertrofia (PeerJ)</td></tr>
                                <tr><td className="py-2.5 text-white">Moesgaard et al.</td><td className="py-2.5">2022</td><td className="py-2.5">Periodizado vs não-periodizado — força e hipertrofia</td></tr>
                                <tr><td className="py-2.5 text-white">Harries et al.</td><td className="py-2.5">2015</td><td className="py-2.5">Review LP vs UP — força · JSCR</td></tr>
                                <tr><td className="py-2.5 text-white">Bell et al.</td><td className="py-2.5">2023</td><td className="py-2.5">Consenso Delphi Internacional sobre deload</td></tr>
                                <tr><td className="py-2.5 text-white">Williams et al.</td><td className="py-2.5">2017</td><td className="py-2.5">Meta-análise periodização e força máxima</td></tr>
                            </tbody>
                        </table>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 2: MODELOS ─────────── */}
                <SourceSection icon={Layers} title="2. Modelos de Periodização">
                    {/* Seletor interativo */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {(Object.entries(models) as [string, typeof models.dup][]).map(([key, m]) => (
                            <button
                                key={key}
                                onClick={() => setActiveModel(key as 'lp' | 'dup' | 'wup' | 'block')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${activeModel === key ? `${m.color} bg-white/5 ${m.tc}` : 'border-white/5 text-gray-400 hover:bg-white/5'}`}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>

                    <div className="bg-[#111] border border-indigo-500/10 rounded-xl p-5 mb-4">
                        <div className="flex flex-wrap gap-4 mb-4 text-xs">
                            <div><span className="text-gray-500">Variação: </span><span className={currentModel.tc}>{currentModel.variation}</span></div>
                            <div><span className="text-gray-500">Para: </span><span className="text-white">{currentModel.for}</span></div>
                            <div><span className="text-gray-500">Complexidade: </span><span className="text-gray-300">{currentModel.complexity}</span></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {currentModel.phases.map(({ name, reps, intensity, sets, rir }) => (
                                <div key={name} className={`bg-[#0a0f1c] border ${currentModel.color} rounded-xl p-4`}>
                                    <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${currentModel.tc}`}>{name}</div>
                                    <div className="space-y-1 text-xs">
                                        <div><span className="text-gray-500">Reps: </span><span className="text-white font-mono">{reps}</span></div>
                                        <div><span className="text-gray-500">Carga: </span><span className="text-white font-mono">{intensity}</span></div>
                                        <div><span className="text-gray-500">Séries: </span><span className="text-white font-mono">{sets}</span></div>
                                        <div><span className="text-gray-500">RIR: </span><span className={`font-mono ${currentModel.tc}`}>{rir}</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <h4 className="text-white text-sm font-bold mb-3">Comparação dos Modelos</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse min-w-[520px]">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Modelo</th><th className="pb-3 pr-4 font-semibold">Variação</th><th className="pb-3 pr-4 font-semibold">Para Quem</th><th className="pb-3 font-semibold">Complexidade</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5 text-xs">
                                <tr><td className="py-2.5 text-blue-400 font-semibold">Linear (LP)</td><td className="py-2.5">A cada 2–4 semanas</td><td className="py-2.5 text-gray-400">Iniciantes, foco em força</td><td className="py-2.5 text-gray-400">Baixa</td></tr>
                                <tr><td className="py-2.5 text-indigo-400 font-semibold">Ondulatória Diária (DUP)</td><td className="py-2.5">A cada sessão</td><td className="py-2.5 text-gray-400">Intermediários+, treinados</td><td className="py-2.5 text-gray-400">Moderada</td></tr>
                                <tr><td className="py-2.5 text-violet-400 font-semibold">Ondulatória Semanal (WUP)</td><td className="py-2.5">Semanal</td><td className="py-2.5 text-gray-400">Intermediários, híbrido LP/DUP</td><td className="py-2.5 text-gray-400">Baixa–Moderada</td></tr>
                                <tr><td className="py-2.5 text-rose-400 font-semibold">Blocos</td><td className="py-2.5">Por bloco (3–4 sem)</td><td className="py-2.5 text-gray-400">Avançados, competidores</td><td className="py-2.5 text-gray-400">Alta</td></tr>
                                <tr><td className="py-2.5 text-gray-500">Não-periodizado</td><td className="py-2.5">Nenhuma</td><td className="py-2.5 text-gray-500">Iniciantes (curto prazo), manutenção</td><td className="py-2.5 text-gray-500">Muito Baixa</td></tr>
                            </tbody>
                        </table>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 3: EVIDÊNCIAS ─────────── */}
                <SourceSection icon={BarChart3} title="3. O Que a Ciência Diz — Meta-Análises">
                    <div className="space-y-4">
                        <div className="bg-[#111] border border-indigo-500/20 rounded-xl p-5">
                            <h4 className="text-white text-sm font-bold mb-1">Moesgaard et al. (2022) — Periodizado vs Não-Periodizado</h4>
                            <p className="text-xs text-gray-500 mb-3">35 estudos · volume equalizado · Sports Medicine</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h5 className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">Para FORÇA</h5>
                                    <div className="space-y-1 text-xs">
                                        <div className="flex justify-between"><span className="text-white">Periodizado vs Não-Periodizado</span><span className="text-indigo-400 font-mono">ES = 0.31 ★</span></div>
                                        <div className="flex justify-between"><span className="text-white">Undulating vs Linear (treinados)</span><span className="text-indigo-400 font-mono">ES = 0.28 ★</span></div>
                                        <p className="text-indigo-300 text-[10px] mt-1">✓ Periodização é superior — UP melhor que LP para treinados</p>
                                    </div>
                                </div>
                                <div>
                                    <h5 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Para HIPERTROFIA</h5>
                                    <div className="space-y-1 text-xs">
                                        <div className="flex justify-between"><span className="text-white">Periodizado vs Não-Periodizado</span><span className="text-gray-400 font-mono">n.s. (p {'>'} 0.05)</span></div>
                                        <div className="flex justify-between"><span className="text-white">Undulating vs Linear</span><span className="text-gray-400 font-mono">ES = 0.05 (n.s.)</span></div>
                                        <p className="text-yellow-400 text-[10px] mt-1">⚡ Sem diferença significativa quando volume é igual</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h4 className="text-white text-sm font-bold mb-1">Grgic et al. (2017) — LP vs DUP para Hipertrofia</h4>
                            <p className="text-xs text-gray-500 mb-3">13 estudos · PeerJ</p>
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-extrabold text-gray-400 font-mono">-0.02</div>
                                    <div className="text-[10px] text-gray-600">Effect Size (Cohen's d)</div>
                                </div>
                                <div className="flex-1 text-xs text-gray-400 space-y-1">
                                    <p>IC 95%: [-0.25, 0.21] · p = 0.848</p>
                                    <p className="text-white font-semibold">LP e DUP produzem hipertrofia SIMILAR</p>
                                    <p>Para hipertrofia, o que importa: <span className="text-indigo-400">Volume total → Sobrecarga progressiva → Consistência</span></p>
                                    <p className="text-yellow-400">NÃO o modelo de periodização específico!</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h4 className="text-white text-sm font-bold mb-3">4 Conclusões do Stronger by Science (Nuckols, 2020)</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    { n: '1', t: 'Periodização importa mais para Força', d: 'Força: periodizado > não-periodizado. Hipertrofia: sem diferença significativa.' },
                                    { n: '2', t: 'Undulating pode ser melhor para Treinados', d: 'UP > LP para força em treinados. Não-treinados: LP = UP (sem diferença).' },
                                    { n: '3', t: 'Efeito varia por exercício', d: 'Supino: periodização parece importar mais. Agachamento: menos diferença entre modelos.' },
                                    { n: '4', t: 'Para hipertrofia, foque em Volume', d: 'Volume é o driver principal. Periodização é secundária. Escolha o modelo que permite acumular mais volume.' },
                                ].map(({ n, t, d }) => (
                                    <div key={n} className="flex gap-3 bg-white/5 rounded-xl p-3">
                                        <span className="text-indigo-400 font-bold shrink-0">{n}.</span>
                                        <div><p className="text-white text-xs font-bold">{t}</p><p className="text-xs text-gray-400 mt-0.5">{d}</p></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 4: DELOAD ─────────── */}
                <SourceSection icon={RefreshCcw} title="4. Deload — Semana de Descarga">
                    <div className="bg-[#111] border border-yellow-500/10 rounded-xl p-5 mb-4">
                        <h4 className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-2">Definição Oficial (Consenso Delphi, Bell et al. 2023)</h4>
                        <blockquote className="text-gray-300 text-sm italic border-l-2 border-yellow-400/40 pl-4">
                            "Período de estresse de treino reduzido projetado para mitigar fadiga fisiológica e psicológica, promover recuperação e aumentar preparação para o próximo ciclo de treino."
                        </blockquote>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h5 className="text-white text-sm font-bold mb-3">Quando Fazer Deload</h5>
                            <div className="space-y-3 text-xs">
                                <div><p className="text-indigo-400 font-semibold mb-1">Pré-planejado (Proativo):</p>
                                    <ul className="text-gray-400 list-disc pl-4 space-y-0.5">
                                        <li>A cada 4–6 semanas de treino intenso</li>
                                        <li>No final de cada mesociclo</li>
                                        <li>Antes de iniciar novo bloco/programa</li>
                                    </ul>
                                </div>
                                <div><p className="text-yellow-400 font-semibold mb-1">Autoregulado (Reativo):</p>
                                    <ul className="text-gray-400 list-disc pl-4 space-y-0.5">
                                        <li>Performance estagnada 2+ semanas</li>
                                        <li>Dor muscular persistente</li>
                                        <li>Fadiga excessiva antes do treino</li>
                                        <li>Motivação muito baixa · Sono piorando</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-3 p-2 bg-white/5 rounded-xl text-xs">
                                <span className="text-gray-500">Frequência média (pesquisa): </span>
                                <span className="text-white font-mono">a cada 5.6 ± 2.3 semanas</span>
                            </div>
                        </div>

                        <div className="bg-[#111] border border-yellow-500/10 rounded-xl p-5">
                            <h5 className="text-yellow-400 text-sm font-bold mb-3">4 Métodos de Deload</h5>
                            <div className="space-y-3 text-xs">
                                {[
                                    { m: 'Redução de Volume ★', d: 'Reduzir séries 40–60%. Manter carga. Ex: 4 séries → 2 séries.' },
                                    { m: 'Redução de Intensidade', d: 'Reduzir carga 40–60%. Ex: 100 kg → 60 kg.' },
                                    { m: 'Redução de Esforço (RIR)', d: 'De RIR 1–2 para RIR 4–5. Parar bem longe da falha.' },
                                    { m: 'Redução de Frequência', d: 'De 5× para 3× por semana. Menos comum, mas válido.' },
                                ].map(({ m, d }) => (
                                    <div key={m} className="flex gap-2">
                                        <span className="text-yellow-400 shrink-0">•</span>
                                        <div><span className="text-white font-semibold">{m}: </span><span className="text-gray-400">{d}</span></div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-xs">
                                <p className="text-yellow-300 font-semibold">Recomendação prática:</p>
                                <p className="text-gray-400 mt-0.5">Combinar: reduzir volume 50% + RIR para 4+. Manter frequência e exercícios.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                        <h4 className="text-white text-sm font-bold mb-3">O que a Pesquisa Mostra sobre Deload</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div>
                                <h5 className="text-indigo-400 text-[10px] uppercase font-bold tracking-wider mb-2">Schoenfeld et al. (2024) — 9 semanas, 90 séries/sem</h5>
                                <ul className="text-gray-400 space-y-1 list-disc pl-4">
                                    <li>Hipertrofia: sem diferença (deload vs contínuo)</li>
                                    <li>Força: leve vantagem para treino contínuo (isométrico)</li>
                                    <li>Overreaching por treino de força sozinho é <strong className="text-white">RARO</strong></li>
                                    <li>Deload pode não ser necessário para todos</li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="text-indigo-400 text-[10px] uppercase font-bold tracking-wider mb-2">Bosquet et al. — Detraining / Survey atletas</h5>
                                <ul className="text-gray-400 space-y-1 list-disc pl-4">
                                    <li>{'<'} 7 dias: sem perda de força</li>
                                    <li>7–14 dias: perda mínima</li>
                                    <li>{'>'} 21 dias: perda significativa começa</li>
                                    <li>92.3% dos atletas usam deload para reduzir fadiga</li>
                                    <li>Duração média: 6.4 ± 1.7 dias</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 5: PROGRESSÃO ─────────── */}
                <SourceSection icon={TrendingUp} title="5. Progressão de Carga">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                        {[
                            {
                                title: 'Progressão Linear Simples',
                                for: 'Iniciantes',
                                ex: ['+2.5 kg supino por semana', 'Funciona bem, eventualmente para (platô)'],
                                icon: '📈',
                            },
                            {
                                title: 'Dupla Progressão',
                                for: 'Intermediários ★',
                                ex: ['80 kg × 8 → 9 → 10 reps', 'Ao atingir 10: aumenta carga → volta a 8 reps'],
                                icon: '🔁',
                            },
                            {
                                title: 'Progressão de Volume',
                                for: 'Qualquer nível',
                                ex: ['Sem 1–2: 3 séries → Sem 3–4: 4 séries', 'Sem 5: DELOAD (2 séries) → Sem 6: +carga'],
                                icon: '📊',
                            },
                            {
                                title: 'Progressão por RIR',
                                for: 'Gerenciar fadiga',
                                ex: ['Sem 1: RIR 4 → Sem 2: RIR 3 → Sem 3: RIR 2', 'Sem 4: RIR 1 → Sem 5: DELOAD'],
                                icon: '🎯',
                            },
                        ].map(({ title, for: f, ex, icon }) => (
                            <div key={title} className="bg-[#111] border border-white/5 rounded-xl p-4">
                                <div className="flex items-start gap-2 mb-2">
                                    <span className="text-lg">{icon}</span>
                                    <div>
                                        <p className="text-white text-xs font-bold">{title}</p>
                                        <p className="text-indigo-400 text-[10px]">{f}</p>
                                    </div>
                                </div>
                                <ul className="text-xs text-gray-400 space-y-0.5 list-disc pl-4">
                                    {ex.map((e, i) => <li key={i}>{e}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Mesociclo visual */}
                    <div className="bg-[#111] border border-indigo-500/10 rounded-xl p-5">
                        <h4 className="text-indigo-400 text-sm font-bold mb-3">Mesociclo de Hipertrofia — Exemplo Supino (5 semanas)</h4>
                        <MesocicloDiagram weeks={5} deloadWeek={5} />
                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full text-xs text-left border-collapse min-w-[440px]">
                                <thead><tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-gray-500">
                                    <th className="pb-2 pr-4 font-semibold">Semana</th><th className="pb-2 pr-4">Séries × Reps</th><th className="pb-2 pr-4">Carga</th><th className="pb-2">RIR</th>
                                </tr></thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr><td className="py-2 text-white">Sem 1 — Introdução</td><td className="py-2 font-mono">3 × 10</td><td className="py-2 font-mono">80 kg</td><td className="py-2 text-green-400">RIR 3–4</td></tr>
                                    <tr><td className="py-2 text-white">Sem 2 — Acumulação</td><td className="py-2 font-mono">3 × 10–11</td><td className="py-2 font-mono">80 kg (↑reps)</td><td className="py-2 text-green-400">RIR 3</td></tr>
                                    <tr><td className="py-2 text-white">Sem 3 — Intensificação</td><td className="py-2 font-mono">4 × 10</td><td className="py-2 font-mono">82.5 kg</td><td className="py-2 text-yellow-400">RIR 2</td></tr>
                                    <tr><td className="py-2 text-white">Sem 4 — Overreaching</td><td className="py-2 font-mono">4 × 10–12</td><td className="py-2 font-mono">82.5 kg</td><td className="py-2 text-orange-400">RIR 1</td></tr>
                                    <tr className="bg-yellow-500/5"><td className="py-2 text-yellow-400 font-semibold">Sem 5 — DELOAD</td><td className="py-2 font-mono text-yellow-400">2 × 8</td><td className="py-2 font-mono text-yellow-400">75 kg</td><td className="py-2 text-yellow-400">RIR 4–5</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-indigo-400 mt-3">→ Próximo mesociclo: volta a 3 séries, começa com 85 kg</p>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 6: POR OBJETIVO ─────────── */}
                <SourceSection icon={Target} title="6. Periodização por Objetivo">
                    <div className="flex flex-wrap gap-2 mb-6">
                        {[
                            { key: 'hypertrophy', label: 'Hipertrofia' },
                            { key: 'strength', label: 'Força' },
                            { key: 'maintenance', label: 'Manutenção' },
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setActiveObjective(key as 'hypertrophy' | 'strength' | 'maintenance')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${activeObjective === key ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="bg-[#111] border border-indigo-500/10 rounded-xl p-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-xs">
                            <div><p className="text-gray-500 mb-0.5">Modelo</p><p className="text-indigo-400 font-semibold">{currentObjective.model}</p></div>
                            <div><p className="text-gray-500 mb-0.5">Mesociclo</p><p className="text-white">{currentObjective.meso}</p></div>
                            <div><p className="text-gray-500 mb-0.5">Progressão</p><p className="text-white">{currentObjective.progression}</p></div>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl mb-4">
                            <p className="text-xs text-gray-400">{currentObjective.reason}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-2">Exemplo Prático:</p>
                            <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
                                {currentObjective.example.map((e, i) => <li key={i}>{e}</li>)}
                            </ul>
                        </div>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 7: REGRAS DE OURO ─────────── */}
                <SourceSection icon={ShieldCheck} title="7. Regras de Ouro">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { n: '1', t: 'Volume é Rei para Hipertrofia', d: 'Modelo de periodização é secundário. Foque em acumular volume progressivamente.' },
                            { n: '2', t: 'Variação Importa para Força (Treinados)', d: 'DUP pode ser superior a LP para quem já treina. Iniciantes: qualquer modelo funciona.' },
                            { n: '3', t: 'Deload é Ferramenta, Não Regra', d: 'Use quando precisar (fadiga, platô). Ou programe preventivamente (4–6 semanas). Não é obrigatório.' },
                            { n: '4', t: 'Escolha o que Você vai Seguir', d: 'O melhor programa é o que você faz consistentemente. Preferência pessoal importa.' },
                            { n: '5', t: 'Sobrecarga Progressiva Sempre', d: 'Independente do modelo, progredir é essencial. Peso, reps ou séries devem aumentar.' },
                            { n: '6', t: 'Mesociclos de 4–6 Semanas', d: 'Tempo suficiente para adaptar. Curto o bastante para ajustar.' },
                            { n: '7', t: 'Não Complique Demais', d: 'Iniciantes: progressão linear simples. Avançados: modelos complexos. Complexidade não garante resultados.' },
                        ].map(({ n, t, d }) => (
                            <div key={n} className="flex gap-3 items-start bg-[#111] border border-white/5 rounded-xl p-3">
                                <span className="text-indigo-400 font-bold text-sm shrink-0">{n}.</span>
                                <div><p className="text-white text-xs font-bold">{t}</p><p className="text-xs text-gray-400 mt-0.5">{d}</p></div>
                            </div>
                        ))}
                    </div>
                </SourceSection>

                {/* ─────────── REFERÊNCIAS ─────────── */}
                <div className="mt-16 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Referências Bibliográficas</h3>

                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-4 mb-2">Meta-Análises de Periodização</h4>
                    <ol className="text-sm text-gray-400 space-y-1 list-decimal pl-5">
                        <li>Grgic J, et al. (2017). "Effects of linear and daily undulating periodized resistance training programs on measures of muscle hypertrophy: a systematic review and meta-analysis." PeerJ.</li>
                        <li>Moesgaard L, et al. (2022). "Effects of Periodization on Strength and Muscle Hypertrophy in Volume-Equated Resistance Training Programs: A Systematic Review and Meta-analysis." Sports Medicine.</li>
                        <li>Harries SK, et al. (2015). "Systematic review and meta-analysis of linear and undulating periodized resistance training programs on muscular strength." Journal of Strength and Conditioning Research.</li>
                        <li>Williams TD, et al. (2017). "Comparison of Periodized and Non-Periodized Resistance Training on Maximal Strength: A Meta-Analysis." Sports Medicine.</li>
                    </ol>

                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-6 mb-2">Deload e Recuperação</h4>
                    <ol start={5} className="text-sm text-gray-400 space-y-1 list-decimal pl-5">
                        <li>Bell L, et al. (2023). "Integrating Deloading into Strength and Physique Sports Training Programmes: An International Delphi Consensus Approach." Sports Medicine - Open.</li>
                        <li>Bell L, et al. (2022). "Coaches' perceptions, practices and experiences of deloading in strength and physique sports." Frontiers in Sports and Active Living.</li>
                        <li>Rogerson D, et al. (2024). "Deloading Practices in Strength and Physique Sports: A Cross-sectional Survey." Sports Medicine.</li>
                        <li>Schoenfeld BJ, et al. (2024). "Gaining more from doing less? The effects of a one-week deload period during supervised resistance training on muscular adaptations." PeerJ.</li>
                    </ol>

                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-6 mb-2">Análises Adicionais</h4>
                    <ol start={9} className="text-sm text-gray-400 space-y-1 list-decimal pl-5">
                        <li>Nuckols G (2020). "Periodization: What the Data Say." Stronger by Science.</li>
                        <li>Bosquet L, et al. (2013). "Effects of tapering on performance: a meta-analysis." Medicine and Science in Sports and Exercise.</li>
                    </ol>
                </div>

            </div>
        </div>
    );
};
