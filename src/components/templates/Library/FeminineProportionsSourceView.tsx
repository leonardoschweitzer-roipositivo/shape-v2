import React, { useState } from 'react';
import {
    ArrowLeft, BookOpen, BarChart3, ShieldCheck, BookMarked,
    Heart, Target, Layers, Star, Calendar, Zap
} from 'lucide-react';

interface SourceSectionProps {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
}

const SourceSection: React.FC<SourceSectionProps> = ({ icon: Icon, title, children }) => (
    <section className="mb-12 animate-fade-in-up">
        <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 shadow-lg shadow-rose-500/5">
                <Icon size={24} className="text-rose-400" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight uppercase">{title}</h2>
        </div>
        <div className="pl-0 sm:pl-16 space-y-4 text-gray-400 leading-relaxed font-light">
            {children}
        </div>
    </section>
);

/* ─── WHR Calculator ─── */
const WHRCalculator: React.FC = () => {
    const [cintura, setCintura] = useState(65);
    const [quadril, setQuadril] = useState(93);
    const whr = cintura / quadril;
    const ideal = 0.70;
    const diff = (whr - ideal).toFixed(2);
    const getStatus = () => {
        if (whr <= 0.70) return { label: 'EXCELENTE', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
        if (whr <= 0.75) return { label: 'BOM', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' };
        if (whr <= 0.80) return { label: 'MÉDIO', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' };
        if (whr <= 0.85) return { label: 'PRECISA MELHORAR', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' };
        return { label: 'ATENÇÃO — RISCO SAÚDE', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' };
    };
    const st = getStatus();
    const pct = Math.min(100, (whr / 1.1) * 100);

    return (
        <div className="bg-[#111] border border-rose-500/10 rounded-xl p-5">
            <h4 className="text-rose-400 text-sm font-bold mb-4">Calculadora WHR Interativa</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Cintura (cm)</label>
                    <input type="range" min={50} max={100} value={cintura} onChange={e => setCintura(+e.target.value)}
                        className="w-full accent-rose-400" />
                    <div className="text-white font-mono font-bold text-lg mt-1">{cintura} cm</div>
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Quadril (cm)</label>
                    <input type="range" min={70} max={130} value={quadril} onChange={e => setQuadril(+e.target.value)}
                        className="w-full accent-rose-400" />
                    <div className="text-white font-mono font-bold text-lg mt-1">{quadril} cm</div>
                </div>
            </div>
            <div className="flex items-center gap-4 mb-3">
                <div className="flex-1 bg-white/5 rounded-full h-3">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-red-400 relative">
                        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-rose-400 transition-all"
                            style={{ left: `${Math.min(90, pct)}%` }} />
                    </div>
                </div>
            </div>
            <div className={`flex items-center justify-between p-3 rounded-xl border ${st.bg}`}>
                <div>
                    <p className="text-white font-bold font-mono text-xl">WHR: {whr.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Ideal: 0.70 | Diferença: {diff > '0' ? '+' : ''}{diff}</p>
                </div>
                <span className={`text-xs font-bold uppercase ${st.color}`}>{st.label}</span>
            </div>
        </div>
    );
};

/* ─── Body Type Card ─── */
const BodyTypeCard: React.FC<{
    type: string; pct: string; characteristics: string[];
    strategy: string; training: string; active: boolean; onClick: () => void;
}> = ({ type, pct, characteristics, strategy, training, active, onClick }) => (
    <button onClick={onClick}
        className={`text-left w-full bg-[#111] border rounded-xl p-4 transition-all ${active ? 'border-rose-500/40 bg-rose-500/5' : 'border-white/5 hover:border-white/10'}`}>
        <div className="flex justify-between items-start mb-2">
            <span className={`text-sm font-bold ${active ? 'text-rose-400' : 'text-white'}`}>{type}</span>
            <span className="text-[10px] text-gray-500 font-mono">{pct}</span>
        </div>
        {active && (
            <div className="space-y-2 mt-3 text-xs">
                <div>
                    <p className="text-gray-500 uppercase tracking-wider text-[10px] mb-1">Características:</p>
                    <ul className="text-gray-400 list-disc pl-4 space-y-0.5">{characteristics.map(c => <li key={c}>{c}</li>)}</ul>
                </div>
                <div><p className="text-gray-500 uppercase tracking-wider text-[10px] mb-0.5">Objetivo:</p><p className="text-gray-300">{strategy}</p></div>
                <div><p className="text-gray-500 uppercase tracking-wider text-[10px] mb-0.5">Treino:</p><p className={`text-rose-400 font-semibold`}>{training}</p></div>
            </div>
        )}
        {!active && <p className="text-xs text-gray-500 mt-1">{strategy}</p>}
    </button>
);

/* ─── Venus Calculator ─── */
const VenusCalculator: React.FC = () => {
    const [altura, setAltura] = useState(165);
    const cintura = Math.round(altura * 0.39);
    const quadril = Math.round(cintura / 0.7);
    const ombros = Math.round(cintura * 1.45);
    const busto = Math.round(quadril * 0.98);
    const coxa = Math.round(cintura * 0.62);
    const braco = Math.round(cintura * 0.32);

    return (
        <div className="bg-[#111] border border-rose-500/10 rounded-xl p-5">
            <h4 className="text-rose-400 text-sm font-bold mb-4">Calculadora Venus Index por Altura</h4>
            <div className="mb-4">
                <label className="text-xs text-gray-500 mb-1 block">Altura: <span className="text-white font-mono">{altura} cm</span></label>
                <input type="range" min={150} max={185} value={altura} onChange={e => setAltura(+e.target.value)}
                    className="w-full accent-rose-400" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                    { label: 'Cintura', val: cintura, note: '= altura × 0.39' },
                    { label: 'Quadril', val: quadril, note: 'WHR 0.70 ✓' },
                    { label: 'Ombros', val: ombros, note: '= cintura × 1.45' },
                    { label: 'Busto', val: busto, note: '≈ quadril' },
                    { label: 'Coxa', val: coxa, note: '= cintura × 0.62' },
                    { label: 'Braço', val: braco, note: '= cintura × 0.32' },
                ].map(({ label, val, note }) => (
                    <div key={label} className="bg-white/5 rounded-xl p-3">
                        <p className="text-gray-500 text-[10px] uppercase tracking-wider">{label}</p>
                        <p className="text-rose-400 font-bold font-mono text-lg">{val} cm</p>
                        <p className="text-gray-600 text-[10px] font-mono">{note}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface FeminineProportionsSourceViewProps {
    onBack: () => void;
}

export const FeminineProportionsSourceView: React.FC<FeminineProportionsSourceViewProps> = ({ onBack }) => {
    const [activeBodyType, setActiveBodyType] = useState<'ampulheta' | 'pera' | 'retangulo' | 'maca'>('retangulo');

    const bodyTypes = {
        ampulheta: {
            type: 'Ampulheta (Hourglass)', pct: '~8% das mulheres',
            characteristics: ['Busto ≈ Quadril', 'Cintura bem definida (≥ 9" a menos que busto/quadril)', 'WHR natural ~0.70-0.75'],
            strategy: 'Manter proporções já ideais',
            training: 'Treino equilibrado — manutenção de todos os grupos',
        },
        pera: {
            type: 'Pera (Triângulo)', pct: '~20% das mulheres',
            characteristics: ['Quadril > Busto', 'Cintura definida', 'Acumula gordura em quadril/coxas', 'Ombros mais estreitos'],
            strategy: 'Desenvolver parte superior para equilibrar',
            training: 'Priorizar: Ombros (14-18 sér/sem) + Costas (14-18 sér/sem)',
        },
        retangulo: {
            type: 'Retângulo (Banana)', pct: '~46% das mulheres',
            characteristics: ['Busto ≈ Cintura ≈ Quadril', 'Pouca definição na cintura', 'Silhueta mais reta', 'WHR > 0.80'],
            strategy: 'Criar curvas — X-shape (glúteos + ombros)',
            training: 'Glúteos ALTO (16-20 sér) + Deltoides ALTO (14-18 sér) + déficit leve',
        },
        maca: {
            type: 'Maçã (Triângulo Invertido)', pct: '~14% das mulheres',
            characteristics: ['Busto/Ombros > Quadril', 'Acumula gordura no abdômen', 'Pernas mais finas', 'Maior risco metabólico'],
            strategy: 'Reduzir cintura + construir inferior',
            training: 'Déficit + Glúteos ALTO (16-20 sér) + Quadríceps/Isquios ALTO',
        },
    };

    return (
        <div className="flex-1 w-full bg-[#0A0F1C] p-4 md:p-8 pb-32">
            <div className="max-w-4xl mx-auto">

                {/* Navigation */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors group w-fit">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium uppercase tracking-widest">Biblioteca Científica</span>
                    </button>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-rose-400 uppercase tracking-widest px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 w-fit">
                        <BookOpen size={12} />
                        <span>Avaliação Feminina / V1.0</span>
                    </div>
                </div>

                {/* Title */}
                <div className="mb-16 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter uppercase mb-6">
                        Proporções <span className="text-rose-400">Femininas</span>
                    </h1>
                    <p className="text-gray-500 font-light max-w-3xl text-lg mb-6">
                        Base científica do VITRÚVIO para avaliar proporções de atletas mulheres — WHR, Venus Index, tipos de corpo, categorias de competição, gordura corporal feminina e influência do ciclo menstrual.
                    </p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-gray-600 font-mono uppercase tracking-widest">
                        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />Vigente: Fev 2026</div>
                        <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-gray-500" />Avaliação Corporal / Golden Ratio Feminino</div>
                    </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-rose-500/20 via-white/5 to-transparent mb-16" />

                {/* ─────────── SEÇÃO 1: DIFERENÇAS + FONTES ─────────── */}
                <SourceSection icon={BookMarked} title="1. Homens vs Mulheres e Fontes Científicas">
                    <div className="overflow-x-auto mb-6">
                        <table className="w-full text-sm text-left border-collapse min-w-[520px]">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Aspecto</th><th className="pb-3 pr-4 font-semibold">Homens</th><th className="pb-3 font-semibold">Mulheres</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5 text-xs">
                                <tr><td className="py-2.5 text-white font-semibold">Proporção chave</td><td className="py-2.5 text-gray-400">Ombros/Cintura (V-taper)</td><td className="py-2.5 text-rose-400 font-semibold">Cintura/Quadril (Ampulheta)</td></tr>
                                <tr><td className="py-2.5 text-white font-semibold">Índice principal</td><td className="py-2.5 text-gray-400">Índice de Adônis (ombros÷cintura)</td><td className="py-2.5 text-rose-400 font-semibold">WHR (cintura÷quadril)</td></tr>
                                <tr><td className="py-2.5 text-white font-semibold">Foco estético</td><td className="py-2.5 text-gray-400">Largura de ombros</td><td className="py-2.5 text-rose-400 font-semibold">Curvas e cintura fina</td></tr>
                                <tr><td className="py-2.5 text-white font-semibold">Distribuição de gordura</td><td className="py-2.5 text-gray-400">Abdominal</td><td className="py-2.5 text-rose-400 font-semibold">Quadril / Coxas / Glúteos</td></tr>
                                <tr><td className="py-2.5 text-white font-semibold">% Gordura atlético</td><td className="py-2.5 text-gray-400">8–15%</td><td className="py-2.5 text-rose-400 font-semibold">15–22%</td></tr>
                                <tr><td className="py-2.5 text-white font-semibold">% Gordura essencial</td><td className="py-2.5 text-gray-400">2–5%</td><td className="py-2.5 text-rose-400 font-semibold">10–13%</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse min-w-[480px]">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Pesquisador / Estudo</th><th className="pb-3 pr-4 font-semibold">Ano</th><th className="pb-3 font-semibold">Contribuição</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                <tr><td className="py-2.5 text-white">Singh D.</td><td className="py-2.5">1993</td><td className="py-2.5">WHR 0.7 como padrão universal de atratividade (JPSP)</td></tr>
                                <tr><td className="py-2.5 text-white">Singh D.</td><td className="py-2.5">1994</td><td className="py-2.5">Papel crítico do WHR na atratividade feminina</td></tr>
                                <tr><td className="py-2.5 text-white">Hübner & Ufken</td><td className="py-2.5">2024</td><td className="py-2.5">Curvatura corporal como melhor preditor que WHR isolado</td></tr>
                                <tr><td className="py-2.5 text-white">Kościński K.</td><td className="py-2.5">2014</td><td className="py-2.5">Análise antropométrica de silhuetas digitais (WHR)</td></tr>
                                <tr><td className="py-2.5 text-white">Barban J.</td><td className="py-2.5">2010</td><td className="py-2.5">Venus Index — equivalente feminino do Índice de Adônis</td></tr>
                            </tbody>
                        </table>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 2: WHR ─────────── */}
                <SourceSection icon={Heart} title="2. WHR — Waist-to-Hip Ratio">
                    <div className="bg-[#111] border border-white/5 rounded-xl p-5 mb-4">
                        <p className="text-rose-400 font-mono font-bold text-lg mb-3">WHR = Cintura ÷ Quadril</p>
                        <p className="text-sm text-gray-400">Ex: Cintura 65 cm ÷ Quadril 93 cm = <strong className="text-white">0.70</strong></p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-3">WHR e Atratividade (Singh 1993)</h5>
                            <div className="space-y-2 text-xs">
                                {[
                                    { whr: '0.60', label: 'Atraente (culturas asiáticas)', color: 'text-cyan-400' },
                                    { whr: '0.70', label: 'MAIS ATRAENTE universalmente ★', color: 'text-rose-400 font-bold' },
                                    { whr: '0.80', label: 'Moderadamente atraente', color: 'text-yellow-400' },
                                    { whr: '0.90', label: 'Menos atraente', color: 'text-orange-400' },
                                    { whr: '1.00+', label: 'Associado a riscos de saúde', color: 'text-red-400' },
                                ].map(({ whr, label, color }) => (
                                    <div key={whr} className="flex items-center gap-3">
                                        <span className="font-mono text-gray-400 w-12 shrink-0">{whr}</span>
                                        <span className={color}>{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-3">WHR e Saúde (OMS)</h5>
                            <div className="space-y-2 text-xs">
                                {[
                                    { range: '< 0.75', class: 'Baixo risco', risk: 'Excelente', color: 'text-emerald-400' },
                                    { range: '0.75–0.80', class: 'Risco moderado', risk: 'Bom', color: 'text-cyan-400' },
                                    { range: '0.80–0.85', class: 'Risco elevado', risk: 'Atenção', color: 'text-yellow-400' },
                                    { range: '> 0.85', class: 'Risco alto', risk: 'Preocupante (OMS)', color: 'text-red-400' },
                                ].map(({ range, class: cls, risk, color }) => (
                                    <div key={range} className="flex justify-between items-center border-b border-white/5 pb-1">
                                        <span className="font-mono text-gray-400">{range}</span>
                                        <span className="text-gray-400">{cls}</span>
                                        <span className={`font-semibold ${color}`}>{risk}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-red-400 mt-3">OMS: WHR {'>'} 0.85 = indicador de obesidade abdominal em mulheres.</p>
                        </div>
                    </div>

                    <WHRCalculator />
                </SourceSection>

                {/* ─────────── SEÇÃO 3: VENUS INDEX ─────────── */}
                <SourceSection icon={Star} title="3. Venus Index — Sistema de Proporções">
                    <p className="text-sm">John Barban propôs o <strong className="text-white">Venus Index</strong> como equivalente feminino do Índice de Adônis — a <strong className="text-rose-400">cintura</strong> é a medida-base de todos os cálculos.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                        {[
                            { formula: 'Cintura = Altura × 0.39', note: 'Base de todos os cálculos', highlight: true },
                            { formula: 'Quadril = Cintura × 1.43', note: 'WHR = 0.70 ✓', highlight: false },
                            { formula: 'Ombros = Cintura × 1.45', note: 'X-shape com quadril', highlight: false },
                            { formula: 'Busto ≈ Quadril × 0.98', note: 'Similar ao quadril', highlight: false },
                            { formula: 'Coxa = Cintura × 0.62', note: 'Proporção membros', highlight: false },
                            { formula: 'Braço = Cintura × 0.32', note: 'Proporção membros', highlight: false },
                        ].map(({ formula, note, highlight }) => (
                            <div key={formula} className={`bg-[#111] border rounded-xl p-3 ${highlight ? 'border-rose-500/30' : 'border-white/5'}`}>
                                <p className={`text-xs font-mono font-bold ${highlight ? 'text-rose-400' : 'text-white'}`}>{formula}</p>
                                <p className="text-[10px] text-gray-500 mt-1">{note}</p>
                            </div>
                        ))}
                    </div>

                    <VenusCalculator />

                    <h4 className="text-white text-sm font-bold mt-6 mb-3">Tabela de Proporções por Altura</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse min-w-[520px]">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Altura</th><th className="pb-3 pr-4 font-semibold">Cintura Ideal</th><th className="pb-3 pr-4 font-semibold">Quadril Ideal</th><th className="pb-3 pr-4 font-semibold">Ombros Ideal</th><th className="pb-3 font-semibold">Busto Ideal</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5 text-xs">
                                {[
                                    ['155 cm', '59–62 cm', '84–88 cm', '86–90 cm', '82–88 cm'],
                                    ['160 cm', '61–64 cm', '87–91 cm', '88–93 cm', '85–91 cm'],
                                    ['165 cm', '63–66 cm', '89–94 cm', '91–96 cm', '87–94 cm'],
                                    ['170 cm', '65–68 cm', '92–97 cm', '94–99 cm', '90–97 cm'],
                                    ['175 cm', '67–70 cm', '95–99 cm', '97–101 cm', '93–99 cm'],
                                    ['180 cm', '68–72 cm', '97–102 cm', '99–104 cm', '95–102 cm'],
                                ].map(([alt, ...vals]) => (
                                    <tr key={alt}>
                                        <td className="py-2.5 text-white font-semibold">{alt}</td>
                                        {vals.map((v, i) => <td key={i} className="py-2.5 font-mono text-rose-400">{v}</td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 4: TIPOS DE CORPO ─────────── */}
                <SourceSection icon={Layers} title="4. Tipos de Corpo Feminino">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                        {(Object.entries(bodyTypes) as [string, typeof bodyTypes.retangulo][]).map(([key, bt]) => (
                            <BodyTypeCard
                                key={key}
                                {...bt}
                                active={activeBodyType === key}
                                onClick={() => setActiveBodyType(key as any)}
                            />
                        ))}
                    </div>

                    <h4 className="text-white text-sm font-bold mt-6 mb-3">Distribuição de Volume por Tipo de Corpo</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left border-collapse min-w-[600px]">
                            <thead><tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-3 font-semibold">Grupo Muscular</th>
                                <th className="pb-3 pr-3 font-semibold">Ampulheta</th>
                                <th className="pb-3 pr-3 font-semibold text-rose-400">Pera</th>
                                <th className="pb-3 pr-3 font-semibold text-rose-400">Retângulo</th>
                                <th className="pb-3 font-semibold text-rose-400">Maçã</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5">
                                {[
                                    ['Glúteos', 'Médio (12–14)', 'Médio (12–14)', 'ALTO (16–20) ★', 'ALTO (16–20) ★'],
                                    ['Quadríceps', 'Médio (10–12)', 'Baixo (6–8)', 'Médio (10–12)', 'ALTO (14–16) ★'],
                                    ['Isquiotibiais', 'Médio (10–12)', 'Baixo (8–10)', 'Médio (10–12)', 'ALTO (12–14) ★'],
                                    ['Deltoides', 'Médio (10–12)', 'ALTO (14–18) ★', 'ALTO (14–18) ★', 'Baixo (8–10)'],
                                    ['Costas (largura)', 'Médio (12–14)', 'ALTO (14–18) ★', 'ALTO (14–18) ★', 'Baixo (10–12)'],
                                    ['Peito', 'Baixo (6–8)', 'Médio (10–12)', 'Médio (10–12)', 'Baixo (6–8)'],
                                    ['Braços', 'Baixo (6–8)', 'Médio (8–10)', 'Baixo (6–8)', 'Baixo (6–8)'],
                                    ['Core/Oblíquos', 'Médio (8–10)', 'Baixo (6–8)', 'Baixo (6–8)', 'Apenas reto abdominal'],
                                ].map(([grupo, ...vals]) => (
                                    <tr key={grupo}>
                                        <td className="py-2 text-white font-semibold">{grupo}</td>
                                        {vals.map((v, i) => (
                                            <td key={i} className={`py-2 ${v.includes('★') ? 'text-rose-400 font-semibold' : 'text-gray-400'}`}>{v}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 5: COMPETIÇÃO ─────────── */}
                <SourceSection icon={Target} title="5. Categorias de Competição Feminina">
                    <div className="overflow-x-auto mb-6">
                        <table className="w-full text-sm text-left border-collapse min-w-[560px]">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Divisão</th><th className="pb-3 pr-4 font-semibold">% Gordura</th><th className="pb-3 pr-4 font-semibold">Musculatura</th><th className="pb-3 font-semibold">Ênfase</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5 text-xs">
                                {[
                                    ['Bikini', '10–14%', 'Suave, tonificada', 'Glúteos, cintura fina, X-shape'],
                                    ['Wellness', '10–14%', 'Inferior desenvolvido', 'Glúteos/coxas maiores, ênfase inferior'],
                                    ['Figure', '8–12%', 'Definida, simétrica', 'X-shape, separação muscular'],
                                    ['Physique', '6–10%', 'Muscular, estriada', 'Tamanho, definição, simetria'],
                                    ['Bodybuilding', '5–8%', 'Máxima musculatura', 'Tamanho extremo, estriações'],
                                ].map(([div, ...vals]) => (
                                    <tr key={div}>
                                        <td className="py-2.5 text-white font-bold">{div}</td>
                                        {vals.map((v, i) => <td key={i} className="py-2.5 text-gray-400">{v}</td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#111] border border-rose-500/10 rounded-xl p-5">
                            <h5 className="text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">Bikini — O Padrão Mais Popular</h5>
                            <div className="space-y-3 text-xs">
                                <div>
                                    <p className="text-white font-semibold mb-1">Desenvolver:</p>
                                    <ul className="text-gray-400 list-disc pl-4 space-y-0.5">
                                        <li>Deltoides laterais (criar largura)</li>
                                        <li>Glúteos (volume e forma)</li>
                                        <li>Costas (V-taper sutil)</li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-white font-semibold mb-1">Evitar:</p>
                                    <ul className="text-gray-400 list-disc pl-4 space-y-0.5">
                                        <li>Quadríceps muito grandes</li>
                                        <li>Muita definição/estriações</li>
                                        <li>Abdômen muito marcado (6-pack excessivo)</li>
                                    </ul>
                                </div>
                                <p className="text-rose-400 italic text-xs">Look desejado: "Suave e tonificada, não musculosa"</p>
                            </div>
                        </div>
                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Wellness — Ênfase no Inferior</h5>
                            <div className="space-y-3 text-xs">
                                <div>
                                    <p className="text-white font-semibold mb-1">Diferença do Bikini:</p>
                                    <ul className="text-gray-400 list-disc pl-4 space-y-0.5">
                                        <li>Glúteos e coxas <strong className="text-white">significativamente maiores</strong></li>
                                        <li>Parte superior menos desenvolvida (proporcional)</li>
                                        <li>Mais "curvas" no geral</li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-white font-semibold mb-1">Ideal para:</p>
                                    <ul className="text-gray-400 list-disc pl-4 space-y-0.5">
                                        <li>Tipo de corpo "pera" com musculatura</li>
                                        <li>Quem prefere não reduzir parte inferior</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 6: GORDURA CORPORAL ─────────── */}
                <SourceSection icon={BarChart3} title="6. Gordura Corporal Feminina">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                        {[
                            { cat: 'Essencial', pct: '10–13%', desc: 'Mínimo para saúde — NÃO sustentável', color: 'border-red-500/20 text-red-400' },
                            { cat: 'Competição', pct: '14–17%', desc: 'Palco — bikini, wellness, figure', color: 'border-rose-500/20 text-rose-400' },
                            { cat: 'Off-Season', pct: '18–22%', desc: 'Atlético, definido', color: 'border-orange-500/20 text-orange-400' },
                            { cat: 'Fitness', pct: '21–24%', desc: 'Saudável, tonificado', color: 'border-yellow-500/20 text-yellow-400' },
                            { cat: 'Aceitável', pct: '25–31%', desc: 'Média saudável', color: 'border-cyan-500/20 text-cyan-400' },
                            { cat: 'Sobrepeso', pct: '32%+', desc: 'Acima do recomendado', color: 'border-gray-500/20 text-gray-400' },
                        ].map(({ cat, pct, desc, color }) => (
                            <div key={cat} className={`bg-[#111] border ${color.split(' ')[0]} rounded-xl p-3`}>
                                <p className={`text-lg font-extrabold font-mono ${color.split(' ')[1]}`}>{pct}</p>
                                <p className="text-white text-xs font-bold">{cat}</p>
                                <p className="text-gray-500 text-[10px] mt-0.5">{desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                        <h5 className="text-white text-sm font-bold mb-3">Padrão Feminino de Deposição de Gordura</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div>
                                <p className="text-rose-400 font-semibold mb-2">Acumula primeiro / sai por último:</p>
                                <ol className="text-gray-400 list-decimal pl-4 space-y-0.5">
                                    <li>Quadril e glúteos</li>
                                    <li>Coxas (posterior e interna)</li>
                                    <li>Abdômen inferior</li>
                                    <li>Parte superior dos braços (tríceps)</li>
                                </ol>
                            </div>
                            <div>
                                <p className="text-cyan-400 font-semibold mb-2">Sai primeiro / acumula por último:</p>
                                <ol className="text-gray-400 list-decimal pl-4 space-y-0.5">
                                    <li>Rosto e pescoço</li>
                                    <li>Antebraços e panturrilhas</li>
                                    <li>Abdômen superior</li>
                                    <li>Parte superior das costas</li>
                                </ol>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl text-xs text-rose-300">
                            ⚡ Mulheres veem resultados no rosto/braços primeiro. Abdômen inferior e coxas são os últimos a definir — paciência é essencial.
                        </div>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 7: CICLO MENSTRUAL ─────────── */}
                <SourceSection icon={Calendar} title="7. Ciclo Menstrual e Medições">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        {[
                            { fase: 'Fase Folicular (Dias 1–14)', color: 'border-cyan-500/20', tc: 'text-cyan-400', items: ['Peso mais estável', 'Menos retenção de água', 'Energia geralmente maior', '✓ MELHOR MOMENTO PARA MEDIR'] },
                            { fase: 'Ovulação (Dia ~14)', color: 'border-white/5', tc: 'text-white', items: ['Possível leve aumento de peso', 'Pico de energia para algumas'] },
                            { fase: 'Fase Lútea (Dias 15–28)', color: 'border-orange-500/20', tc: 'text-orange-400', items: ['Retenção de água aumenta progressivamente', 'Peso pode aumentar 1–3 kg', 'Circunferências podem aumentar 1–3 cm', '✗ EVITAR MEDIR para comparação'] },
                            { fase: 'Menstruação (Dias 1–5)', color: 'border-white/5', tc: 'text-white', items: ['Peso começa a normalizar', 'Retenção diminui', 'Energia pode estar baixa'] },
                        ].map(({ fase, color, tc, items }) => (
                            <div key={fase} className={`bg-[#111] border ${color} rounded-xl p-4`}>
                                <h5 className={`text-xs font-bold uppercase tracking-wider mb-2 ${tc}`}>{fase}</h5>
                                <ul className="text-xs text-gray-400 space-y-0.5 list-disc pl-4">
                                    {items.map(item => <li key={item} className={item.startsWith('✓') ? 'text-cyan-400' : item.startsWith('✗') ? 'text-orange-400' : ''}>{item}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="bg-[#111] border border-cyan-500/10 rounded-xl p-4">
                        <h5 className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">Recomendação VITRÚVIO para Medição</h5>
                        <p className="text-sm text-gray-400">Sempre medir na <strong className="text-white">fase folicular (dias 5–10)</strong>. Comparações são válidas apenas entre medições na mesma fase. Variações de 1–3 cm na fase lútea são normais e não representam ganho real.</p>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 8: ÍNDICES E FFMI ─────────── */}
                <SourceSection icon={Zap} title="8. Índices Femininos e FFMI">
                    <div className="overflow-x-auto mb-6">
                        <table className="w-full text-sm text-left border-collapse min-w-[520px]">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Índice</th><th className="pb-3 pr-4 font-semibold">Fórmula</th><th className="pb-3 pr-4 font-semibold">Ideal</th><th className="pb-3 font-semibold">O que Mede</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5 text-xs">
                                <tr><td className="py-2.5 text-white font-bold">WHR</td><td className="py-2.5 font-mono text-gray-400">Cintura ÷ Quadril</td><td className="py-2.5 text-rose-400 font-bold">0.70</td><td className="py-2.5 text-gray-400">Proporção cintura-quadril</td></tr>
                                <tr><td className="py-2.5 text-white font-bold">Índice de Cintura</td><td className="py-2.5 font-mono text-gray-400">Cintura ÷ Altura</td><td className="py-2.5 text-rose-400 font-bold">0.38–0.42</td><td className="py-2.5 text-gray-400">Cintura proporcional à altura</td></tr>
                                <tr><td className="py-2.5 text-white font-bold">Venus Ratio</td><td className="py-2.5 font-mono text-gray-400">Ombros ÷ Cintura</td><td className="py-2.5 text-rose-400 font-bold">1.40–1.45</td><td className="py-2.5 text-gray-400">Largura superior vs cintura</td></tr>
                                <tr><td className="py-2.5 text-white font-bold">Busto-Quadril</td><td className="py-2.5 font-mono text-gray-400">Busto ÷ Quadril</td><td className="py-2.5 text-rose-400 font-bold">0.95–1.00</td><td className="py-2.5 text-gray-400">Equilíbrio superior/inferior</td></tr>
                                <tr><td className="py-2.5 text-white font-bold">FFMI</td><td className="py-2.5 font-mono text-gray-400">MM ÷ altura²</td><td className="py-2.5 text-rose-400 font-bold">{'<'} 21 natural</td><td className="py-2.5 text-gray-400">Muscularidade (Fat Free Mass Index)</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                        <h5 className="text-white text-sm font-bold mb-3">FFMI Feminino — Classificação</h5>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                            {[
                                { range: '< 14', label: 'Abaixo da média', color: 'text-gray-400' },
                                { range: '14–16', label: 'Média', color: 'text-gray-300' },
                                { range: '16–18', label: 'Acima da média / Fitness', color: 'text-cyan-400' },
                                { range: '18–20', label: 'Atlética / Competidora', color: 'text-rose-400' },
                                { range: '20–21', label: 'Elite natural', color: 'text-rose-400 font-bold' },
                                { range: '> 21', label: 'Provável auxílio farmacológico', color: 'text-red-400' },
                            ].map(({ range, label, color }) => (
                                <div key={range} className="bg-white/5 rounded-xl p-2">
                                    <p className={`font-mono font-bold text-sm ${color}`}>{range}</p>
                                    <p className="text-gray-500 text-[10px]">{label}</p>
                                </div>
                            ))}
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl text-xs text-gray-400">
                            <strong className="text-white">Exemplo:</strong> Peso 58 kg · Altura 1.65 m · % Gordura 20%<br />
                            Massa magra: 46.4 kg → FFMI: 46.4 ÷ 1.65² = <strong className="text-rose-400">17.0</strong> → Acima da média / potencial de competição
                        </div>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 9: REGRAS DE OURO ─────────── */}
                <SourceSection icon={ShieldCheck} title="9. Regras de Ouro para Proporções Femininas">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { n: '1', t: 'WHR 0.70 é o Alvo Universal', d: 'Correlacionado com saúde e estética. Funciona reduzindo cintura E/OU aumentando quadril.' },
                            { n: '2', t: 'Cintura é a Base de Tudo', d: 'Todas as proporções derivam da cintura. Reduzir cintura melhora TODOS os índices. Principal ferramenta: déficit calórico.' },
                            { n: '3', t: 'Ombros Criam Ilusão de Cintura Menor', d: 'Ombros largos fazem a cintura parecer menor. X-shape é mais importante que tamanho absoluto.' },
                            { n: '4', t: 'Glúteos são Prioridade para a Maioria', d: 'Criam curvas, melhoram WHR. Podem e devem ser treinados 3×/semana.' },
                            { n: '5', t: 'Evitar Oblíquos Pesados', d: 'Hipertrofiam a cintura. Fazer apenas reto abdominal. Vacuum é permitido e recomendado.' },
                            { n: '6', t: 'Tipo de Corpo Determina Estratégia', d: 'Retângulo: curvas (glúteos+ombros). Pera: desenvolver superior. Maçã: reduzir cintura+inferior. Ampulheta: manter.' },
                            { n: '7', t: 'Fase do Ciclo Afeta Medidas', d: 'Medir sempre na fase folicular (dias 5–10). Variação de 1–3 cm na fase lútea é normal.' },
                            { n: '8', t: '% Gordura Feminino é Naturalmente Maior', d: 'Essencial: 10–13%. Atlético: 15–20%. Saudável: 21–28%. Comparar com padrões femininos, não masculinos.' },
                        ].map(({ n, t, d }) => (
                            <div key={n} className="flex gap-3 items-start bg-[#111] border border-white/5 rounded-xl p-3">
                                <span className="text-rose-400 font-bold text-sm shrink-0">{n}.</span>
                                <div><p className="text-white text-xs font-bold">{t}</p><p className="text-xs text-gray-400 mt-0.5">{d}</p></div>
                            </div>
                        ))}
                    </div>
                </SourceSection>

                {/* ─────────── REFERÊNCIAS ─────────── */}
                <div className="mt-16 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Referências Bibliográficas</h3>
                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-4 mb-2">Proporções e Atratividade</h4>
                    <ol className="text-sm text-gray-400 space-y-1 list-decimal pl-5">
                        <li>Singh D (1993). "Adaptive significance of female physical attractiveness: role of waist-to-hip ratio." JPSP.</li>
                        <li>Singh D (1994). "Body shape and women's attractiveness: The critical role of waist-to-hip ratio." Human Nature.</li>
                        <li>Hübner R, Ufken ES (2024). "Curviness is a better predictor of a woman's body attractiveness than the waist-to-hip ratio." Scientific Reports.</li>
                        <li>Kościński K (2014). "Assessment of Waist-to-Hip Ratio Attractiveness in Women: An Anthropometric Analysis of Digital Silhouettes." Archives of Sexual Behavior.</li>
                    </ol>
                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-6 mb-2">Composição Corporal e Fitness</h4>
                    <ol start={5} className="text-sm text-gray-400 space-y-1 list-decimal pl-5">
                        <li>Lohman TG (1992). "Advances in Body Composition Assessment." Human Kinetics.</li>
                        <li>Jackson AS, Pollock ML (1985). "Practical Assessment of Body Composition." The Physician and Sportsmedicine.</li>
                        <li>Barban J (2010). "Venus Index Workout." Venus Factor Systems.</li>
                        <li>Schoenfeld BJ (2010). "The mechanisms of muscle hypertrophy and their application to resistance training." JSCR.</li>
                    </ol>
                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-6 mb-2">Ciclo Menstrual</h4>
                    <ol start={9} className="text-sm text-gray-400 space-y-1 list-decimal pl-5">
                        <li>Sung E, et al. (2014). "Effects of follicular versus luteal phase-based strength training in young women." Springerplus.</li>
                        <li>Wikström-Frisén L (2017). "Training and hormones in physically active women." Umeå University Medical Dissertations.</li>
                    </ol>
                </div>

            </div>
        </div>
    );
};
