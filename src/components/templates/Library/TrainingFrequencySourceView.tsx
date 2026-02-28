import React, { useState } from 'react';
import {
    ArrowLeft, BookOpen, BarChart3, Zap, Clock, ShieldCheck,
    AlertTriangle, BookMarked, Calendar, Layers, RefreshCcw, Target
} from 'lucide-react';

interface SourceSectionProps {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
}

const SourceSection: React.FC<SourceSectionProps> = ({ icon: Icon, title, children }) => (
    <section className="mb-12 animate-fade-in-up">
        <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
                <Icon size={24} className="text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight uppercase">{title}</h2>
        </div>
        <div className="pl-0 sm:pl-16 space-y-4 text-gray-400 leading-relaxed font-light">
            {children}
        </div>
    </section>
);

/* ─── MPS Timeline Visual ─── */
const MpsTimeline: React.FC<{ freq: number }> = ({ freq }) => {
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    // trainDays: which day indices a muscle is trained
    const trainDays: Record<number, number[]> = {
        1: [0],
        2: [0, 3],
        3: [0, 2, 4],
    };
    const trained = new Set(trainDays[freq] ?? [0]);
    // For each day, compute MPS level (0-3) based on distance from last training
    const mpsLevel = days.map((_, i) => {
        let minDist = 99;
        trained.forEach(td => {
            const d = i - td;
            if (d >= 0 && d < minDist) minDist = d;
        });
        if (minDist === 0) return 3;
        if (minDist === 1) return 2;
        if (minDist === 2) return 1;
        return 0;
    });
    const colors = ['bg-gray-700/30', 'bg-cyan-500/20', 'bg-cyan-500/50', 'bg-cyan-400'];
    const labels = ['Baseline', 'Elevada', 'Pico', 'Treino'];
    const pct = Math.round((mpsLevel.filter(l => l > 0).length / 7) * 100);

    return (
        <div>
            <div className="flex gap-1.5 items-end h-16 mb-2">
                {days.map((d, i) => {
                    const lvl = mpsLevel[i];
                    const heights = ['h-1', 'h-4', 'h-8', 'h-16'];
                    return (
                        <div key={d} className="flex-1 flex flex-col items-center gap-1">
                            <div className={`w-full rounded-sm transition-all ${heights[lvl]} ${colors[lvl]}`} />
                            <span className="text-[9px] text-gray-600 font-mono">{d}</span>
                        </div>
                    );
                })}
            </div>
            <div className="flex items-center justify-between text-xs mt-3">
                <span className="text-gray-500">Tempo em estado anabólico:</span>
                <span className="text-cyan-400 font-bold font-mono">~{pct}%</span>
            </div>
        </div>
    );
};

interface TrainingFrequencySourceViewProps {
    onBack: () => void;
}

export const TrainingFrequencySourceView: React.FC<TrainingFrequencySourceViewProps> = ({ onBack }) => {
    const [selectedFreq, setSelectedFreq] = useState<1 | 2 | 3>(2);
    const [selectedSplit, setSelectedSplit] = useState<'fullbody' | 'upperlower' | 'ppl'>('upperlower');

    const splits = {
        fullbody: {
            label: 'Full Body (3×/sem)',
            days: ['Seg', 'Qua', 'Sex'],
            sessions: [
                { day: 'Seg', muscles: ['Peito', 'Costas', 'Ombros', 'Quadríceps', 'Isquios', 'Bíceps', 'Tríceps'] },
                { day: 'Qua', muscles: ['Peito', 'Costas', 'Ombros', 'Quadríceps', 'Isquios', 'Bíceps', 'Tríceps'] },
                { day: 'Sex', muscles: ['Peito', 'Costas', 'Ombros', 'Quadríceps', 'Isquios', 'Bíceps', 'Tríceps'] },
            ],
            freq: '3×/sem por grupo',
            volume: '2–3 séries/sessão = 6–9 séries/sem',
            for: 'Iniciantes, pouco tempo disponível',
        },
        upperlower: {
            label: 'Upper/Lower (4×/sem)',
            days: ['Seg', 'Ter', 'Qui', 'Sex'],
            sessions: [
                { day: 'Seg (Upper)', muscles: ['Peito', 'Costas', 'Ombros', 'Bíceps', 'Tríceps'] },
                { day: 'Ter (Lower)', muscles: ['Quadríceps', 'Isquios', 'Glúteos', 'Panturrilha'] },
                { day: 'Qui (Upper)', muscles: ['Peito', 'Costas', 'Ombros', 'Bíceps', 'Tríceps'] },
                { day: 'Sex (Lower)', muscles: ['Quadríceps', 'Isquios', 'Glúteos', 'Panturrilha'] },
            ],
            freq: '2×/sem por grupo',
            volume: '4–6 séries/sessão = 8–12 séries/sem',
            for: 'Intermediários — melhor balanço estímulo/recuperação',
        },
        ppl: {
            label: 'Push/Pull/Legs (6×/sem)',
            days: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
            sessions: [
                { day: 'Seg (Push)', muscles: ['Peito', 'Ombros', 'Tríceps'] },
                { day: 'Ter (Pull)', muscles: ['Costas', 'Bíceps', 'Trapézio'] },
                { day: 'Qua (Legs)', muscles: ['Quadríceps', 'Isquios', 'Glúteos', 'Panturrilha'] },
                { day: 'Qui (Push)', muscles: ['Peito', 'Ombros', 'Tríceps'] },
                { day: 'Sex (Pull)', muscles: ['Costas', 'Bíceps', 'Posterior'] },
                { day: 'Sáb (Legs)', muscles: ['Quadríceps', 'Isquios', 'Glúteos', 'Panturrilha'] },
            ],
            freq: '2×/sem por grupo',
            volume: '6–8 séries/sessão = 12–16 séries/sem',
            for: 'Avançados com alto volume total',
        },
    };

    const currentSplit = splits[selectedSplit];

    return (
        <div className="flex-1 w-full bg-[#0A0F1C] p-4 md:p-8 pb-32">
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
                    <div className="flex items-center gap-2 text-[10px] font-bold text-cyan-400 uppercase tracking-widest px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 w-fit">
                        <BookOpen size={12} />
                        <span>Plano de Treino / V1.0</span>
                    </div>
                </div>

                {/* Title */}
                <div className="mb-16 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter uppercase mb-6">
                        Frequência de <span className="text-cyan-400">Treino</span>
                    </h1>
                    <p className="text-gray-500 font-light max-w-3xl text-lg mb-6">
                        Base científica do VITRÚVIO para determinar quantas vezes treinar cada grupo muscular por semana, distribuir volume entre sessões, escolher o split ideal e otimizar a síntese proteica muscular através da frequência.
                    </p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-gray-600 font-mono uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                            Vigente: Fev 2026
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={14} className="text-gray-500" />
                            Módulo Plano de Treino
                        </div>
                    </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-cyan-500/20 via-white/5 to-transparent mb-16" />

                {/* ─────────── SEÇÃO 1: FONTES + DEFINIÇÕES ─────────── */}
                <SourceSection icon={BookMarked} title="1. Definições e Fontes Científicas">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h5 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Frequência de Sessões</h5>
                            <p className="text-sm text-white font-semibold">Número total de treinos/semana</p>
                            <p className="text-xs text-gray-500 mt-1">Ex: "Treino 4 vezes por semana"</p>
                        </div>
                        <div className="bg-[#111] border border-cyan-500/20 rounded-xl p-5">
                            <h5 className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">Frequência por Grupo Muscular ★</h5>
                            <p className="text-sm text-white font-semibold">Quantas vezes cada músculo é treinado/sem</p>
                            <p className="text-xs text-cyan-300 mt-1">Esta é a frequência que REALMENTE importa para hipertrofia!</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse min-w-[480px]">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Pesquisador / Estudo</th><th className="pb-3 pr-4 font-semibold">Ano</th><th className="pb-3 font-semibold">Contribuição</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                <tr><td className="py-2.5 text-white">Schoenfeld et al.</td><td className="py-2.5">2016</td><td className="py-2.5">Meta-análise: 2× supera 1× por semana (volume não equalizado)</td></tr>
                                <tr><td className="py-2.5 text-white">Schoenfeld et al.</td><td className="py-2.5">2019</td><td className="py-2.5">Meta-análise: sem diferença quando volume é equalizado</td></tr>
                                <tr><td className="py-2.5 text-white">Grgic et al.</td><td className="py-2.5">2018</td><td className="py-2.5">Review sistemático de frequência e hipertrofia</td></tr>
                                <tr><td className="py-2.5 text-white">MacDougall et al.</td><td className="py-2.5">1995</td><td className="py-2.5">Duração da MPS após treino pesado</td></tr>
                                <tr><td className="py-2.5 text-white">Nuckols G. (SbS)</td><td className="py-2.5">2020</td><td className="py-2.5">Reanálise: efeito real da frequência é trivial (d = 0.113)</td></tr>
                            </tbody>
                        </table>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 2: MPS ─────────── */}
                <SourceSection icon={Zap} title="2. Síntese Proteica Muscular (MPS) e Frequência">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h4 className="text-white text-sm font-bold mb-3">Timeline da MPS após treino</h4>
                            <div className="bg-[#111] border border-white/5 rounded-xl p-4 space-y-2">
                                {[
                                    { t: '0–4h', v: '~50% acima do baseline (início)', c: 'w-1/4' },
                                    { t: '24h', v: 'PICO — 100–150% acima do baseline', c: 'w-full' },
                                    { t: '36h', v: 'Ainda elevada, diminuindo', c: 'w-3/4' },
                                    { t: '48h', v: 'Retornando ao baseline (treinados)', c: 'w-2/5' },
                                    { t: '72h', v: 'Próxima ao baseline', c: 'w-1/12' },
                                ].map(({ t, v, c }) => (
                                    <div key={t} className="flex gap-3 items-center text-xs">
                                        <span className="text-gray-500 font-mono w-10 shrink-0">{t}</span>
                                        <div className="flex-1 bg-white/5 rounded-full h-2">
                                            <div className={`${c} h-full bg-cyan-400/70 rounded-full`} />
                                        </div>
                                        <span className="text-gray-400 text-[10px] hidden sm:block w-36 shrink-0">{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-white text-sm font-bold mb-3">Treinados vs Não Treinados</h4>
                            <div className="space-y-3">
                                <div className="bg-[#111] border border-white/5 rounded-xl p-4">
                                    <h5 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Não Treinados</h5>
                                    <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
                                        <li>MPS elevada por 72–96 horas</li>
                                        <li>Mas muito desta MPS é para <strong className="text-white">reparar dano</strong></li>
                                        <li>Não necessariamente para crescimento</li>
                                    </ul>
                                </div>
                                <div className="bg-[#111] border border-cyan-500/20 rounded-xl p-4">
                                    <h5 className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">Treinados ★</h5>
                                    <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
                                        <li>MPS retorna ao baseline mais rápido (24–48h)</li>
                                        <li>Menos dano = <strong className="text-white">mais MPS para crescimento</strong></li>
                                        <li>Portanto, frequência <strong className="text-white">maior pode ser benéfica</strong></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MPS Visualizer interativo */}
                    <div className="bg-[#111] border border-cyan-500/10 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-cyan-400 text-sm font-bold">Visualizador Interativo de MPS/Semana</h4>
                            <div className="flex gap-2">
                                {([1, 2, 3] as const).map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setSelectedFreq(f)}
                                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${selectedFreq === f ? 'bg-cyan-500 text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                                    >
                                        {f}×/sem
                                    </button>
                                ))}
                            </div>
                        </div>
                        <MpsTimeline freq={selectedFreq} />
                        <div className="mt-3 text-xs text-gray-500">
                            {selectedFreq === 1 && 'MPS elevada ~48h, depois 5 dias no baseline. Apenas ~29% do tempo em estado anabólico.'}
                            {selectedFreq === 2 && '2 picos de MPS por semana. ~57% do tempo em estado anabólico. Recomendado para maioria.'}
                            {selectedFreq === 3 && 'MPS quase constantemente elevada. ~86% do tempo anabólico — mas requer menor volume por sessão.'}
                        </div>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 3: META-ANÁLISES ─────────── */}
                <SourceSection icon={BarChart3} title="3. Evidências Científicas — Meta-Análises">
                    <div className="space-y-4">
                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h4 className="text-white text-sm font-bold mb-1">Schoenfeld et al. (2016) — Volume NÃO equalizado</h4>
                            <p className="text-xs text-gray-500 mb-3">10 estudos · Sports Medicine</p>
                            <div className="overflow-x-auto mb-3">
                                <table className="w-full text-sm text-left border-collapse min-w-[380px]">
                                    <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                        <th className="pb-2 pr-4 font-semibold">Frequência</th><th className="pb-2 pr-4 font-semibold">Effect Size</th><th className="pb-2 font-semibold">Significância</th>
                                    </tr></thead>
                                    <tbody className="divide-y divide-white/5">
                                        <tr><td className="py-2 text-white font-semibold">Maior (2–3×/sem)</td><td className="py-2 font-mono text-cyan-400">0.49 ± 0.08</td><td className="py-2 text-cyan-400">p = 0.002</td></tr>
                                        <tr><td className="py-2 text-white">Menor (1×/sem)</td><td className="py-2 font-mono text-gray-400">0.30 ± 0.07</td><td className="py-2 text-gray-400">—</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-cyan-300">✓ Conclusão: frequências ≥2×/sem promovem hipertrofia superior a 1×/sem.</p>
                        </div>

                        <div className="bg-[#111] border border-cyan-500/20 rounded-xl p-5">
                            <h4 className="text-white text-sm font-bold mb-1">Schoenfeld et al. (2019) — Volume EQUALIZADO</h4>
                            <p className="text-xs text-gray-500 mb-3">25 estudos · Journal of Sports Sciences</p>
                            <div className="overflow-x-auto mb-3">
                                <table className="w-full text-sm text-left border-collapse min-w-[380px]">
                                    <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                        <th className="pb-2 pr-4 font-semibold">Análise</th><th className="pb-2 font-semibold">Resultado</th>
                                    </tr></thead>
                                    <tbody className="divide-y divide-white/5">
                                        <tr><td className="py-2 text-white">Geral (volume equalizado)</td><td className="py-2 text-gray-400">Sem diferença significativa (p {'>'} 0.05)</td></tr>
                                        <tr><td className="py-2 text-white">Medidas diretas</td><td className="py-2 text-gray-400">Sem diferença significativa</td></tr>
                                        <tr><td className="py-2 text-white">Indivíduos treinados</td><td className="py-2 text-gray-400">Sem diferença significativa</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-yellow-400">⚡ Quando volume é equalizado, frequência não faz diferença significativa.</p>
                        </div>

                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h4 className="text-white text-sm font-bold mb-3">Reconciliando os Dois Estudos</h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex gap-3">
                                    <span className="text-cyan-400 font-bold shrink-0">①</span>
                                    <p className="text-gray-400"><strong className="text-white">2016 (não equalizado):</strong> grupos de maior frequência também tinham mais volume. A frequência foi confundida com volume.</p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-cyan-400 font-bold shrink-0">②</span>
                                    <p className="text-gray-400"><strong className="text-white">2019 (equalizado):</strong> mesmo volume total, só frequência diferente. Sem diferença significativa.</p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-cyan-400 font-bold shrink-0">③</span>
                                    <p className="text-gray-400"><strong className="text-white">Reanálise Nuckols (2020):</strong> frequência maior = mais hipertrofia (p {'<'} 0.0001), mas efeito trivial (d = 0.113). Diferença de apenas ~0.5–1% ao longo de 1 ano.</p>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                                <p className="text-xs text-cyan-300 font-semibold mb-1">Conclusão Prática:</p>
                                <ol className="text-xs text-gray-400 space-y-0.5 list-decimal pl-4">
                                    <li>Volume total é o que mais importa</li>
                                    <li>Frequência é uma forma de <strong className="text-white">distribuir</strong> o volume</li>
                                    <li>Maior frequência <strong className="text-white">permite</strong> maior volume (mais fácil acumular)</li>
                                    <li>Se volume é igual, frequência não faz diferença significativa</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 4: FREQUÊNCIA POR GRUPO ─────────── */}
                <SourceSection icon={Target} title="4. Frequência Ótima por Grupo Muscular">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                        {[
                            { freq: '1×/sem', label: 'Mínimo', desc: 'Manutenção, tempo limitado', vol: '8–12 séries', color: 'border-gray-600/30', tc: 'text-gray-400' },
                            { freq: '2×/sem', label: 'Ideal ★', desc: 'Recomendado para maioria', vol: '5–8 séries', color: 'border-cyan-500/30 bg-cyan-500/5', tc: 'text-cyan-400' },
                            { freq: '3×/sem', label: 'Possível', desc: 'Grupos prioritários', vol: '3–5 séries', color: 'border-white/10', tc: 'text-white' },
                            { freq: '4×/sem', label: 'Máximo', desc: 'Panturrilha, abs, avançados', vol: '2–4 séries', color: 'border-white/5', tc: 'text-gray-400' },
                        ].map(({ freq, label, desc, vol, color, tc }) => (
                            <div key={freq} className={`bg-[#111] border ${color} rounded-xl p-4 text-center`}>
                                <div className={`text-xl font-extrabold mb-1 ${tc}`}>{freq}</div>
                                <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${tc}`}>{label}</div>
                                <div className="text-xs text-gray-500 mb-2">{desc}</div>
                                <div className="text-[10px] text-gray-600 font-mono">{vol}/sessão</div>
                            </div>
                        ))}
                    </div>

                    <h4 className="text-white text-sm font-bold mb-3">Frequência por Grupo Muscular Específico</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse min-w-[480px]">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Grupo Muscular</th><th className="pb-3 pr-4 font-semibold">Frequência</th><th className="pb-3 font-semibold">Razão</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5 text-xs">
                                <tr><td className="py-2.5 text-white">Peito</td><td className="py-2.5 font-mono text-cyan-400">2×/sem</td><td className="py-2.5 text-gray-400">Volume ótimo bem distribuído</td></tr>
                                <tr><td className="py-2.5 text-white">Costas</td><td className="py-2.5 font-mono text-cyan-400">2–3×/sem</td><td className="py-2.5 text-gray-400">Grande área — tolera mais frequência</td></tr>
                                <tr><td className="py-2.5 text-white">Ombros (lateral)</td><td className="py-2.5 font-mono text-cyan-400">2–3×/sem</td><td className="py-2.5 text-gray-400">Recupera rápido — músculo pequeno</td></tr>
                                <tr><td className="py-2.5 text-white">Bíceps</td><td className="py-2.5 font-mono text-cyan-400">2–3×/sem</td><td className="py-2.5 text-gray-400">Volume menor por sessão</td></tr>
                                <tr><td className="py-2.5 text-white">Tríceps</td><td className="py-2.5 font-mono">2×/sem</td><td className="py-2.5 text-gray-400">Recebe volume indireto do supino</td></tr>
                                <tr><td className="py-2.5 text-white">Quadríceps</td><td className="py-2.5 font-mono">2×/sem</td><td className="py-2.5 text-gray-400">Grande massa — precisa de recuperação</td></tr>
                                <tr><td className="py-2.5 text-white">Isquiotibiais</td><td className="py-2.5 font-mono">2×/sem</td><td className="py-2.5 text-gray-400">Propenso a lesões com alta frequência</td></tr>
                                <tr><td className="py-2.5 text-white">Glúteos</td><td className="py-2.5 font-mono text-cyan-400">2–3×/sem</td><td className="py-2.5 text-gray-400">Tolera frequência alta</td></tr>
                                <tr><td className="py-2.5 text-white">Panturrilha</td><td className="py-2.5 font-mono text-cyan-400 font-bold">3–4×/sem</td><td className="py-2.5 text-gray-400">Fibras tipo I — recupera muito rápido · músculo "teimoso"</td></tr>
                                <tr><td className="py-2.5 text-white">Abdominais</td><td className="py-2.5 font-mono text-cyan-400">2–4×/sem</td><td className="py-2.5 text-gray-400">Recupera rápido — volume menor por dia</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h4 className="text-white text-sm font-bold mt-6 mb-3">Frequência Recomendada por Nível de Experiência</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                            { nivel: 'Iniciante', exp: '0–1 ano', sessoes: '3/sem', freq: '3×/grupo', split: 'Full Body', vol: '2–3 séries/sessão', color: 'border-gray-500/20' },
                            { nivel: 'Intermediário', exp: '1–3 anos', sessoes: '4–5/sem', freq: '2×/grupo', split: 'Upper/Lower ou PPL', vol: '4–6 séries/sessão', color: 'border-cyan-500/20' },
                            { nivel: 'Avançado', exp: '3–7 anos', sessoes: '4–6/sem', freq: '2×/grupo', split: 'PPL ou híbrido', vol: 'Alto, distribuído', color: 'border-blue-500/20' },
                            { nivel: 'Elite', exp: '7+ anos', sessoes: '5–6+/sem', freq: '1–3×/grupo', split: 'Customizado', vol: 'Periodizado', color: 'border-violet-500/20' },
                        ].map(({ nivel, exp, sessoes, freq, split, vol, color }) => (
                            <div key={nivel} className={`bg-[#111] border ${color} rounded-xl p-4`}>
                                <div className="text-white font-bold text-sm mb-0.5">{nivel}</div>
                                <div className="text-gray-500 text-[10px] mb-3">{exp}</div>
                                <div className="space-y-1 text-xs">
                                    <div><span className="text-gray-500">Sessões: </span><span className="text-white">{sessoes}</span></div>
                                    <div><span className="text-gray-500">Freq: </span><span className="text-cyan-400">{freq}</span></div>
                                    <div><span className="text-gray-500">Split: </span><span className="text-gray-300">{split}</span></div>
                                    <div><span className="text-gray-500">Volume: </span><span className="text-gray-300">{vol}</span></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 5: SPLITS ─────────── */}
                <SourceSection icon={Calendar} title="5. Divisões de Treino (Splits)">
                    {/* Seletor interativo */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {(Object.entries(splits) as [string, typeof splits.fullbody][]).map(([key, s]) => (
                            <button
                                key={key}
                                onClick={() => setSelectedSplit(key as 'fullbody' | 'upperlower' | 'ppl')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedSplit === key ? 'bg-cyan-500 text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'}`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>

                    <div className="bg-[#111] border border-cyan-500/10 rounded-xl p-5 mb-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-xs">
                            <div><span className="text-gray-500">Freq por grupo: </span><span className="text-cyan-400 font-bold">{currentSplit.freq}</span></div>
                            <div><span className="text-gray-500">Volume: </span><span className="text-white">{currentSplit.volume}</span></div>
                            <div><span className="text-gray-500">Para: </span><span className="text-gray-300">{currentSplit.for}</span></div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {currentSplit.sessions.map(({ day, muscles }) => (
                                <div key={day} className="bg-white/5 rounded-xl p-3">
                                    <div className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider mb-2">{day}</div>
                                    <div className="flex flex-wrap gap-1">
                                        {muscles.map(m => (
                                            <span key={m} className="text-[9px] text-gray-400 bg-white/5 px-1.5 py-0.5 rounded">{m}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <h4 className="text-white text-sm font-bold mb-3">Guia para Escolha do Split</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse min-w-[500px]">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Dias/Sem</th><th className="pb-3 pr-4 font-semibold">Split Recomendado</th><th className="pb-3 pr-4 font-semibold">Freq/Grupo</th><th className="pb-3 font-semibold">Para quem</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5 text-xs">
                                <tr><td className="py-2.5 text-white font-bold">3 dias</td><td className="py-2.5 font-mono text-cyan-400">Full Body</td><td className="py-2.5">3×</td><td className="py-2.5 text-gray-400">Iniciantes, pouco tempo</td></tr>
                                <tr><td className="py-2.5 text-white font-bold">4 dias</td><td className="py-2.5 font-mono text-cyan-400">Upper/Lower</td><td className="py-2.5">2×</td><td className="py-2.5 text-gray-400">Intermediários — melhor balanço</td></tr>
                                <tr><td className="py-2.5 text-white font-bold">5 dias</td><td className="py-2.5 font-mono">Upper/Lower/Push/Pull/Legs</td><td className="py-2.5">2× (ajustável)</td><td className="py-2.5 text-gray-400">Intermediário-avançado</td></tr>
                                <tr><td className="py-2.5 text-white font-bold">6 dias</td><td className="py-2.5 font-mono">Push/Pull/Legs (2×)</td><td className="py-2.5">2×</td><td className="py-2.5 text-gray-400">Avançados, alto volume</td></tr>
                                <tr><td className="py-2.5 text-gray-500">Bro Split</td><td className="py-2.5 font-mono text-gray-500">5 dias (1 grupo/dia)</td><td className="py-2.5 text-gray-500">1×</td><td className="py-2.5 text-gray-500">Subótimo — funciona só com alto volume</td></tr>
                            </tbody>
                        </table>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 6: VOLUME/SESSÃO ─────────── */}
                <SourceSection icon={Layers} title="6. Volume por Sessão vs Frequência">
                    <p>Regra fundamental: <span className="font-mono text-cyan-400">Volume Semanal = Séries/Sessão × Frequência</span></p>

                    <div className="mt-4 space-y-3">
                        {[
                            { freq: '1×/sem', series: '16 séries em 1 sessão', quality: 'Series 1–6 OK · 7–10 moderado · 11–16 péssima qualidade', rec: false },
                            { freq: '2×/sem ★', series: '8 séries por sessão', quality: 'Todas as séries com boa qualidade — RECOMENDADO', rec: true },
                            { freq: '3×/sem', series: '5–6 séries por sessão', quality: 'Excelente qualidade — bom para prioridades ou avançados', rec: false },
                        ].map(({ freq, series, quality, rec }) => (
                            <div key={freq} className={`bg-[#111] border ${rec ? 'border-cyan-500/20' : 'border-white/5'} rounded-xl p-4 flex gap-4 items-start`}>
                                <div className={`text-xs font-bold font-mono shrink-0 w-20 ${rec ? 'text-cyan-400' : 'text-gray-400'}`}>{freq}</div>
                                <div>
                                    <p className="text-sm text-white font-semibold">{series}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{quality}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-[#111] border border-white/5 rounded-xl p-5 mt-4">
                        <h4 className="text-white text-sm font-bold mb-2">Limite de Volume por Sessão</h4>
                        <p className="text-sm text-gray-400">
                            Máximo <strong className="text-white">~6–10 séries por grupo muscular por sessão</strong>. Após 8 séries, cada série adicional tem retornos muito diminuídos. A partir de 10 séries, pode ser contraproducente.
                        </p>
                        <p className="text-xs text-cyan-400 mt-2">✓ Se quer mais de 10 séries semanais por grupo, é melhor dividir em 2+ sessões.</p>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 7: RECUPERAÇÃO ─────────── */}
                <SourceSection icon={RefreshCcw} title="7. Recuperação e Sinais de Frequência Excessiva">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h5 className="text-white text-sm font-bold mb-3">Tempo Mínimo entre Sessões</h5>
                            <div className="space-y-3 text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="text-white">24h (dia seguinte)</span>
                                    <span className="text-gray-500">Apenas panturrilha, abs — volume baixíssimo</span>
                                </div>
                                <div className="flex justify-between items-center border-t border-white/5 pt-2">
                                    <span className="text-white font-semibold">48h (2 dias)</span>
                                    <span className="text-cyan-400">Mínimo para maioria dos grupos</span>
                                </div>
                                <div className="flex justify-between items-center border-t border-white/5 pt-2">
                                    <span className="text-white font-semibold">72h (3 dias) ★</span>
                                    <span className="text-cyan-400">Ideal para grupos grandes ou treinos intensos</span>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-white/5 rounded-xl">
                                <p className="text-xs text-gray-400 font-semibold mb-1">Fatores que AUMENTAM tempo de recuperação:</p>
                                <div className="grid grid-cols-2 gap-1 text-[10px] text-gray-500">
                                    {['Treino até falha', 'Volume alto', 'Excêntrico alto', 'Déficit calórico', 'Sono insuficiente', 'Estresse alto', 'Idade avançada'].map(f => (
                                        <span key={f}>• {f}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#111] border border-red-500/10 rounded-xl p-5">
                            <h5 className="text-red-400 text-sm font-bold mb-3">Sinais de Frequência Excessiva</h5>
                            <div className="space-y-3 text-xs">
                                <div>
                                    <p className="text-white font-semibold mb-1">Performance:</p>
                                    <ul className="text-gray-400 list-disc pl-4 space-y-0.5">
                                        <li>Força diminuindo sessão a sessão</li>
                                        <li>Incapaz de igualar performance anterior</li>
                                        <li>Fadiga persistente no início do treino</li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-white font-semibold mb-1">Físicos:</p>
                                    <ul className="text-gray-400 list-disc pl-4 space-y-0.5">
                                        <li>Dor muscular que não resolve antes do próximo treino</li>
                                        <li>Sensação de "peso" ou fraqueza no músculo</li>
                                        <li>Articulações doloridas</li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-white font-semibold mb-1">Sistêmicos:</p>
                                    <ul className="text-gray-400 list-disc pl-4 space-y-0.5">
                                        <li>Sono piorando · Humor irritável</li>
                                        <li>Apetite diminuído · Motivação baixa</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#111] border border-yellow-500/10 rounded-xl p-4">
                        <p className="text-yellow-400 text-xs font-bold mb-2">Ação ao detectar sinais:</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                            {['Reduzir frequência', 'OR Reduzir volume/sessão', 'OR Reduzir intensidade (RIR+)', 'OR Fazer deload'].map((a, i) => (
                                <span key={a} className="px-2 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-300">
                                    {i + 1}. {a}
                                </span>
                            ))}
                        </div>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 8: REGRAS DE OURO ─────────── */}
                <SourceSection icon={ShieldCheck} title="8. Regras de Ouro">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { n: '1', t: 'Volume Total é Mais Importante que Frequência', d: 'Se volume é igual, frequência faz pouca diferença. Frequência é uma forma de DISTRIBUIR volume.' },
                            { n: '2', t: 'Mínimo 2×/Semana por Grupo para Otimizar', d: '1×/semana funciona, mas 2× é melhor para maioria. Exceto se volume for muito baixo.' },
                            { n: '3', t: 'Máximo ~8–10 Séries por Grupo por Sessão', d: 'Acima disso, dividir em mais sessões. Qualidade > quantidade em uma única sessão.' },
                            { n: '4', t: '48h Mínimo entre Sessões do Mesmo Grupo', d: 'Permite recuperação adequada. Exceto com volume muito baixo por sessão.' },
                            { n: '5', t: 'Frequência Alta para Grupos "Teimosos"', d: 'Panturrilha, deltoide posterior, abdominais. Toleram e podem precisar de mais estímulo.' },
                            { n: '6', t: 'Escolher Split pela Disponibilidade Real', d: 'O melhor split é o que você vai FAZER consistentemente. Não adianta 6×/sem se tem 4 dias.' },
                            { n: '7', t: 'Iniciantes: Full Body ou Alta Frequência', d: 'Aprender técnica com repetição frequente. Volume baixo por sessão, frequência alta.' },
                        ].map(({ n, t, d }) => (
                            <div key={n} className="flex gap-3 items-start bg-[#111] border border-white/5 rounded-xl p-3">
                                <span className="text-cyan-400 font-bold text-sm shrink-0">{n}.</span>
                                <div><p className="text-white text-xs font-bold">{t}</p><p className="text-xs text-gray-400 mt-0.5">{d}</p></div>
                            </div>
                        ))}
                    </div>
                </SourceSection>

                {/* ─────────── REFERÊNCIAS ─────────── */}
                <div className="mt-16 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Referências Bibliográficas</h3>

                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-4 mb-2">Meta-Análises</h4>
                    <ol className="text-sm text-gray-400 space-y-1 list-decimal pl-5">
                        <li>Schoenfeld BJ, Ogborn D, Krieger JW (2016). "Effects of Resistance Training Frequency on Measures of Muscle Hypertrophy: A Systematic Review and Meta-Analysis." Sports Medicine.</li>
                        <li>Schoenfeld BJ, Grgic J, Krieger J (2019). "How many times per week should a muscle be trained to maximize muscle hypertrophy? A systematic review and meta-analysis." Journal of Sports Sciences.</li>
                    </ol>

                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-6 mb-2">Síntese Proteica</h4>
                    <ol start={3} className="text-sm text-gray-400 space-y-1 list-decimal pl-5">
                        <li>MacDougall JD, et al. (1995). "The time course for elevated muscle protein synthesis following heavy resistance exercise." Canadian Journal of Applied Physiology.</li>
                        <li>Damas F, et al. (2016). "A review of resistance training-induced changes in skeletal muscle protein synthesis." Sports Medicine.</li>
                        <li>Phillips SM, et al. (1997). "Mixed muscle protein synthesis and breakdown after resistance exercise in humans." American Journal of Physiology.</li>
                    </ol>

                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-6 mb-2">Estudos sobre Frequência</h4>
                    <ol start={6} className="text-sm text-gray-400 space-y-1 list-decimal pl-5">
                        <li>Grgic J, Schoenfeld BJ, Latella C (2018). "Resistance training frequency and skeletal muscle hypertrophy: A review of available evidence." Journal of Science and Medicine in Sport.</li>
                        <li>Zaroni RS, et al. (2019). "High resistance-training frequency enhances muscle thickness in resistance-trained men." Journal of Strength and Conditioning Research.</li>
                        <li>Nuckols G (2020). "Training Frequency for Muscle Growth: What the Data Say." Stronger by Science.</li>
                        <li>Dankel SJ, et al. (2017). "Frequency: The Overlooked Resistance Training Variable for Inducing Muscle Hypertrophy?" Sports Medicine.</li>
                    </ol>
                </div>

            </div>
        </div>
    );
};
