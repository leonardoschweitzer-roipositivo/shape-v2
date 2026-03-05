import React from 'react';
import {
    ArrowLeft, BookOpen, BarChart3, TrendingDown, TrendingUp,
    RefreshCcw, ShieldCheck, AlertTriangle, BookMarked, Zap, Target, ListChecks
} from 'lucide-react';

interface SourceSectionProps {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
}

const SourceSection: React.FC<SourceSectionProps> = ({ icon: Icon, title, children }) => (
    <section className="mb-12 animate-fade-in-up">
        <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                <Icon size={24} className="text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight uppercase">{title}</h2>
        </div>
        <div className="pl-0 sm:pl-16 space-y-4 text-gray-400 leading-relaxed font-light">
            {children}
        </div>
    </section>
);

interface EnergyBalanceSourceViewProps {
    onBack: () => void;
}

export const EnergyBalanceSourceView: React.FC<EnergyBalanceSourceViewProps> = ({ onBack }) => {
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
                    <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
                        <BookOpen size={12} />
                        <span>Plano de Dieta / V1.0</span>
                    </div>
                </div>

                {/* Title */}
                <div className="mb-16 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter uppercase mb-6">
                        Déficit e Superávit <span className="text-emerald-400">Calórico</span>
                    </h1>
                    <p className="text-gray-500 font-light max-w-3xl text-lg mb-6">
                        Base científica do VITRÚVIO para definir o balanço energético ideal — taxas de perda/ganho por % de gordura e nível de experiência, recomposição corporal, adaptação metabólica, platôs e protocolos de ajuste.
                    </p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-gray-600 font-mono uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            Vigente: Fev 2026
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={14} className="text-gray-500" />
                            Módulo Plano de Dieta / Evolução
                        </div>
                    </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-emerald-500/20 via-white/5 to-transparent mb-16" />

                {/* ─────────── SEÇÃO 1: FONTES + CONCEITOS ─────────── */}
                <SourceSection icon={BookMarked} title="1. Conceitos Fundamentais e Fontes Científicas">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-[#111] border border-red-500/20 rounded-xl p-5">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-2">Déficit (Cutting)</div>
                            <p className="text-sm text-white font-semibold mb-1">Consumido {'<'} Gasto</p>
                            <p className="text-xs text-gray-400">Perda de peso (gordura + potencialmente músculo)</p>
                        </div>
                        <div className="bg-[#111] border border-gray-500/20 rounded-xl p-5">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Manutenção</div>
                            <p className="text-sm text-white font-semibold mb-1">Consumido ≈ Gasto</p>
                            <p className="text-xs text-gray-400">Peso estável — base para recomposição</p>
                        </div>
                        <div className="bg-[#111] border border-emerald-500/20 rounded-xl p-5">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-2">Superávit (Bulking)</div>
                            <p className="text-sm text-white font-semibold mb-1">Consumido {'>'} Gasto</p>
                            <p className="text-xs text-gray-400">Ganho de peso (músculo + inevitavelmente alguma gordura)</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse min-w-[480px]">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Pesquisador / Estudo</th><th className="pb-3 pr-4 font-semibold">Ano</th><th className="pb-3 font-semibold">Contribuição</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                <tr><td className="py-2.5 text-white">Garthe et al.</td><td className="py-2.5">2011</td><td className="py-2.5">Taxa de perda de peso e massa magra em atletas de elite</td></tr>
                                <tr><td className="py-2.5 text-white">Helms et al.</td><td className="py-2.5">2014</td><td className="py-2.5">Nutrição para atletas naturais em déficit — preparação</td></tr>
                                <tr><td className="py-2.5 text-white">Murphy & Koehler</td><td className="py-2.5">2022</td><td className="py-2.5">Hipertrofia em déficit — meta-análise</td></tr>
                                <tr><td className="py-2.5 text-white">Trexler et al.</td><td className="py-2.5">2014</td><td className="py-2.5">Adaptação metabólica — magnitude e estratégias</td></tr>
                                <tr><td className="py-2.5 text-white">Ribeiro et al.</td><td className="py-2.5">2023</td><td className="py-2.5">Superávit pequeno vs grande em hipertrofia</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 bg-[#111] border border-white/5 rounded-xl mt-4 text-sm">
                        <p className="text-white font-semibold mb-1">Regra do 3.500 kcal</p>
                        <p className="text-gray-400">~3.500 kcal ≈ 0.45 kg de gordura (1 libra). Déficit de 500 kcal/dia × 7 dias = 3.500 kcal/sem ≈ 0.5 kg.</p>
                        <p className="text-xs text-gray-500 mt-2 italic">Nota: é uma boa aproximação, mas adaptação metabólica, variação de água e outros fatores tornam a relação não-linear na prática.</p>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 2: DÉFICIT (CUTTING) ─────────── */}
                <SourceSection icon={TrendingDown} title="2. Déficit Calórico — Cutting">
                    <h4 className="text-white text-sm font-bold mb-3">Taxas de Perda de Peso Recomendadas</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                        {[
                            { label: 'Conservadora', rate: '0.5%/sem', deficit: '300–400 kcal', ideal: 'Atletas magros (<15% BF), avançados', color: 'border-blue-500/20 bg-blue-500/5', tc: 'text-blue-400' },
                            { label: 'Moderada', rate: '0.7%/sem', deficit: '~500 kcal', ideal: 'Maioria dos praticantes', color: 'border-emerald-500/20 bg-emerald-500/5', tc: 'text-emerald-400' },
                            { label: 'Agressiva', rate: '1.0%/sem', deficit: '750–1000 kcal', ideal: 'Iniciantes, BF alto (>25%)', color: 'border-orange-500/20 bg-orange-500/5', tc: 'text-orange-400' },
                            { label: 'Máxima Rec.', rate: '1.4%/sem', deficit: '≥1000 kcal', ideal: 'Apenas obesos ou situações especiais', color: 'border-red-500/20 bg-red-500/5', tc: 'text-red-400' },
                        ].map(({ label, rate, deficit, ideal, color, tc }) => (
                            <div key={label} className={`rounded-xl border ${color} p-4`}>
                                <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${tc}`}>{label}</div>
                                <div className="text-lg font-extrabold text-white">{rate}</div>
                                <div className={`text-xs font-mono mb-2 ${tc}`}>{deficit}/dia</div>
                                <div className="text-xs text-gray-500">{ideal}</div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-[#111] border border-emerald-500/10 rounded-xl p-5 mb-6">
                        <h4 className="text-emerald-400 text-sm font-bold mb-3">Estudo Garthe et al. (2011) — O mais citado sobre taxa de perda</h4>
                        <p className="text-xs text-gray-500 mb-3">24 atletas de elite · 4×/sem treino de força · Slow (0.7%/sem) vs Fast (1.4%/sem)</p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse min-w-[400px]">
                                <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="pb-2 pr-4 font-semibold">Métrica</th>
                                    <th className="pb-2 pr-4 font-semibold text-emerald-400">Slow 0.7%/sem</th>
                                    <th className="pb-2 font-semibold text-red-400">Fast 1.4%/sem</th>
                                </tr></thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr><td className="py-2 text-white">Perda de peso total</td><td className="py-2 font-mono">5.6%</td><td className="py-2 font-mono">5.5%</td></tr>
                                    <tr><td className="py-2 text-white">Perda de gordura</td><td className="py-2 font-mono text-emerald-400">31%</td><td className="py-2 font-mono text-red-400">21%</td></tr>
                                    <tr><td className="py-2 text-white font-semibold">Massa magra</td><td className="py-2 font-mono text-emerald-400 font-bold">+2.1% ✓</td><td className="py-2 font-mono text-red-400">-0.2%</td></tr>
                                    <tr><td className="py-2 text-white">Força 1RM</td><td className="py-2 font-mono text-emerald-400">Aumentou</td><td className="py-2 font-mono">Manteve</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-emerald-300 mt-3">✓ Perda lenta (0.7%/sem) permitiu GANHO de massa magra durante o cutting!</p>
                    </div>

                    <h4 className="text-white text-sm font-bold mb-3">Ajuste da Taxa por % de Gordura Corporal</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse min-w-[500px]">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">% Gordura — Homens</th>
                                <th className="pb-3 pr-4 font-semibold">% Gordura — Mulheres</th>
                                <th className="pb-3 pr-4 font-semibold">Taxa/Semana</th>
                                <th className="pb-3 font-semibold">Déficit/Dia</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5 text-xs">
                                <tr><td className="py-2 text-red-400 font-semibold">{'>'} 25% (Obeso)</td><td className="py-2 text-red-400">{'>'} 32%</td><td className="py-2 font-mono">1.0–1.4%</td><td className="py-2 font-mono">750–1000 kcal</td></tr>
                                <tr><td className="py-2 text-orange-400">20–25% (Sobrepeso)</td><td className="py-2 text-orange-400">25–32%</td><td className="py-2 font-mono">0.7–1.0%</td><td className="py-2 font-mono">500–750 kcal</td></tr>
                                <tr><td className="py-2 text-white">15–20% (Normal)</td><td className="py-2 text-white">20–25%</td><td className="py-2 font-mono">0.5–0.7%</td><td className="py-2 font-mono">400–500 kcal</td></tr>
                                <tr><td className="py-2 text-emerald-400">10–15% (Atlético)</td><td className="py-2 text-emerald-400">15–20%</td><td className="py-2 font-mono">0.3–0.5%</td><td className="py-2 font-mono">250–400 kcal</td></tr>
                                <tr><td className="py-2 text-blue-400">{'<'} 10% (Competição)</td><td className="py-2 text-blue-400">{'<'} 15%</td><td className="py-2 font-mono">0.2–0.3%</td><td className="py-2 font-mono">150–250 kcal</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-emerald-400 mt-2">💡 Regra: quanto mais magro, mais conservador o déficit!</p>

                    <h4 className="text-white text-sm font-bold mt-6 mb-3">6 Pilares da Preservação Muscular em Déficit</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { n: '1', t: 'Déficit Moderado', d: 'Máximo 500–750 kcal para maioria. Déficits >1.000 kcal aumentam catabolismo significativamente.' },
                            { n: '2', t: 'Proteína Alta', d: '2.2–3.0 g/kg de peso. Distribuída em 4–6 refeições, 0.4–0.55 g/kg por refeição.' },
                            { n: '3', t: 'Treino de Força Mantido', d: 'Manter intensidade (carga). Pode reduzir volume. Priorizar compostos.' },
                            { n: '4', t: 'Sono Adequado', d: 'Mínimo 7–8 horas. Déficit de sono pode aumentar perda muscular em 50%!' },
                            { n: '5', t: 'Carboidratos Suficientes', d: 'Mínimo 2–3 g/kg para performance. Priorizar ao redor do treino.' },
                            { n: '6', t: 'Cardio Moderado', d: 'HIIT ou LISS em moderação. Evitar excesso (interferência com recuperação).' },
                        ].map(({ n, t, d }) => (
                            <div key={n} className="flex gap-3 bg-[#111] border border-white/5 rounded-xl p-3">
                                <span className="text-emerald-400 font-bold text-sm shrink-0">{n}.</span>
                                <div><p className="text-white text-xs font-bold">{t}</p><p className="text-xs text-gray-400 mt-0.5">{d}</p></div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 bg-[#111] border border-white/5 rounded-xl p-5">
                        <h4 className="text-white text-sm font-bold mb-3">Diet Breaks e Refeeds</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h5 className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-2">Refeed (1–2 dias)</h5>
                                <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
                                    <li>Calorias até manutenção (foco em <strong className="text-white">carboidratos</strong>)</li>
                                    <li>Restaura glicogênio e melhora performance</li>
                                    <li>Benefícios hormonais temporários (leptina, T3)</li>
                                    <li>Frequência: 1×/semana a cada 2 semanas</li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">Diet Break (1–2 semanas)</h5>
                                <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
                                    <li>Comer em manutenção por 1–2 semanas inteiras</li>
                                    <li>Reversão parcial da adaptação metabólica</li>
                                    <li>Benefício psicológico significativo</li>
                                    <li>Frequência: a cada 8–12 semanas de déficit</li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-3 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                            <p className="text-xs text-yellow-400 font-semibold mb-1">Quando usar:</p>
                            <p className="text-xs text-gray-400">Platô de peso {'>'} 2–3 semanas · Fadiga excessiva · Força caindo · Fome incontrolável · Humor/motivação muito baixos</p>
                        </div>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 3: SUPERÁVIT (BULKING) ─────────── */}
                <SourceSection icon={TrendingUp} title="3. Superávit Calórico — Bulking">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-[#111] border border-emerald-500/20 rounded-xl p-5">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">✓ Lean Bulk (Recomendado)</div>
                            <div className="text-xl font-extrabold text-white">200–300 <span className="text-xs font-normal text-gray-500">kcal/dia</span></div>
                            <div className="text-xs text-gray-400 mt-2">Ganho: 0.25–0.5 kg/sem · Ideal para intermediários e avançados · Ratio músculo:gordura melhor</div>
                        </div>
                        <div className="bg-[#111] border border-yellow-500/20 rounded-xl p-5">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-yellow-400 mb-1">Bulk Moderado</div>
                            <div className="text-xl font-extrabold text-white">300–500 <span className="text-xs font-normal text-gray-500">kcal/dia</span></div>
                            <div className="text-xs text-gray-400 mt-2">Ganho: 0.5–0.75 kg/sem · Bom para iniciantes com metabolismo rápido</div>
                        </div>
                        <div className="bg-[#111] border border-red-500/20 rounded-xl p-5">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-1">✗ Dirty Bulk (Não Rec.)</div>
                            <div className="text-xl font-extrabold text-white">500+ <span className="text-xs font-normal text-gray-500">kcal/dia</span></div>
                            <div className="text-xs text-gray-400 mt-2">Muito ganho de gordura · Cut longo · Não constrói mais músculo que lean bulk!</div>
                        </div>
                    </div>

                    <div className="bg-[#111] border border-emerald-500/10 rounded-xl p-5 mb-6">
                        <h4 className="text-emerald-400 text-sm font-bold mb-2">Estudo Ribeiro et al. (2023) — Superávit Pequeno vs Grande</h4>
                        <p className="text-xs text-gray-500 mb-3">3 grupos: Manutenção vs 5% superávit vs 15% superávit { }· Sports Medicine - Open</p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse min-w-[400px]">
                                <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="pb-2 pr-4 font-semibold">Métrica</th><th className="pb-2 pr-4 font-semibold">Manutenção</th><th className="pb-2 pr-4 font-semibold">5% Superávit</th><th className="pb-2 font-semibold">15% Superávit</th>
                                </tr></thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr><td className="py-2 text-white">Ganho de músculo</td><td className="py-2 text-emerald-400">Similar</td><td className="py-2 text-emerald-400">Similar</td><td className="py-2 text-emerald-400">Similar</td></tr>
                                    <tr><td className="py-2 text-white">Ganho de gordura</td><td className="py-2">Baixo</td><td className="py-2">Moderado</td><td className="py-2 text-red-400 font-bold">Alto ✗</td></tr>
                                    <tr><td className="py-2 text-white">Força</td><td className="py-2 text-emerald-400">Aumentou</td><td className="py-2 text-emerald-400">Aumentou</td><td className="py-2 text-emerald-400">Aumentou</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-red-400 mt-3">⚠️ Superávit maior (15%) NÃO construiu mais músculo — apenas acumulou mais gordura!</p>
                    </div>

                    <h4 className="text-white text-sm font-bold mb-3">Taxa Máxima Realista de Ganho de Músculo e Superávit por Nível</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse min-w-[540px]">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Nível</th>
                                <th className="pb-3 pr-4 font-semibold">Músculo/Mês</th>
                                <th className="pb-3 pr-4 font-semibold">Superávit/Dia</th>
                                <th className="pb-3 font-semibold">Ganho Peso/Mês</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5">
                                <tr><td className="py-2.5 text-white">Iniciante (0–1 ano)</td><td className="py-2.5 font-mono text-emerald-400 font-bold">0.9–1.3 kg</td><td className="py-2.5 font-mono">300–500 kcal</td><td className="py-2.5 font-mono">0.5–1.0 kg</td></tr>
                                <tr><td className="py-2.5 text-white">Intermediário (1–3 anos)</td><td className="py-2.5 font-mono text-emerald-400">0.45–0.9 kg</td><td className="py-2.5 font-mono">200–300 kcal</td><td className="py-2.5 font-mono">0.25–0.5 kg</td></tr>
                                <tr><td className="py-2.5 text-white">Avançado (3–7 anos)</td><td className="py-2.5 font-mono text-blue-400">0.2–0.45 kg</td><td className="py-2.5 font-mono">100–200 kcal</td><td className="py-2.5 font-mono">0.1–0.25 kg</td></tr>
                                <tr><td className="py-2.5 text-white">Elite (7+ anos)</td><td className="py-2.5 font-mono text-gray-500">0.1–0.2 kg</td><td className="py-2.5 font-mono">100–150 kcal</td><td className="py-2.5 font-mono text-gray-500">{'<'} 0.1 kg</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-orange-400 mt-3">⚠️ Se está ganhando mais que isso, a maioria é GORDURA — não músculo!</p>

                    <div className="mt-5 bg-[#111] border border-white/5 rounded-xl p-5">
                        <h4 className="text-white text-sm font-bold mb-3">Quando Parar o Bulk</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h5 className="text-red-400 text-xs font-bold uppercase tracking-wider mb-2">Critérios de BF%</h5>
                                <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
                                    <li><strong className="text-white">Homens:</strong> parar ao atingir 15–18% BF</li>
                                    <li><strong className="text-white">Mulheres:</strong> parar ao atingir 25–28% BF</li>
                                    <li>Sensibilidade à insulina diminui, particionamento piora acima disso</li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="text-red-400 text-xs font-bold uppercase tracking-wider mb-2">Ciclo Recomendado</h5>
                                <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
                                    <li>Bulk: <strong className="text-white">3–6 meses</strong></li>
                                    <li>Cut: <strong className="text-white">2–4 meses</strong> (até meta de BF%)</li>
                                    <li>Manutenção: 2–4 semanas entre fases</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 4: RECOMPOSIÇÃO ─────────── */}
                <SourceSection icon={RefreshCcw} title="4. Recomposição Corporal">
                    <p>
                        Ganhar músculo <strong className="text-white">E</strong> perder gordura <strong className="text-white">simultaneamente</strong>. É possível porque músculo e gordura são "contas bancárias" separadas — pode depositar em uma enquanto retira da outra.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-[#111] border border-emerald-500/20 rounded-xl p-5">
                            <h5 className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">✓ Alta Probabilidade de Sucesso</h5>
                            <ul className="text-sm text-gray-400 space-y-1 list-disc pl-4">
                                <li>Iniciantes em treino de força (primeiros 1–2 anos)</li>
                                <li>Retornando após pausa longa (<em>muscle memory</em>)</li>
                                <li>Alto % de gordura ({'>'} 20% H / {'>'} 30% M)</li>
                                <li>Usuários de substâncias anabólicas (TRT etc)</li>
                                <li>Pessoas subtreinadas (treinavam mal antes)</li>
                            </ul>
                        </div>
                        <div className="bg-[#111] border border-red-500/20 rounded-xl p-5">
                            <h5 className="text-red-400 text-xs font-bold uppercase tracking-wider mb-3">✗ Baixa Probabilidade</h5>
                            <ul className="text-sm text-gray-400 space-y-1 list-disc pl-4">
                                <li>Atletas avançados/elite já magros</li>
                                <li>Baixo % de gordura ({'<'} 12% H / {'<'} 20% M)</li>
                                <li>Pessoas já perto do potencial genético</li>
                            </ul>
                            <p className="text-xs text-orange-400 mt-3">→ Para esses perfis: ciclar bulk/cut é mais eficiente!</p>
                        </div>
                    </div>

                    <div className="bg-[#111] border border-white/5 rounded-xl p-5 mt-4">
                        <h4 className="text-white text-sm font-bold mb-3">Protocolo de Recomposição</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                            {[
                                { t: 'Calorias', d: 'Manutenção ou leve déficit (100–300 kcal abaixo). Algumas pessoas: manutenção é suficiente.' },
                                { t: 'Proteína', d: '2.0–2.4 g/kg de peso corporal. Distribuída em 4–5 refeições.' },
                                { t: 'Treino', d: 'Força progressiva é essencial! Volume moderado-alto. Foco em sobrecarga progressiva.' },
                            ].map(({ t, d }) => (
                                <div key={t}><p className="text-emerald-400 font-bold mb-1">{t}</p><p className="text-gray-400">{d}</p></div>
                            ))}
                        </div>
                        <div className="mt-4 p-3 bg-white/5 rounded-xl">
                            <p className="text-xs text-yellow-400 font-semibold mb-1">Expectativas para iniciantes (2–3 meses):</p>
                            <div className="grid grid-cols-3 gap-3 text-xs">
                                <div><p className="text-gray-500">Ganho músculo</p><p className="text-white font-mono">1–2 kg</p></div>
                                <div><p className="text-gray-500">Perda gordura</p><p className="text-white font-mono">2–4 kg</p></div>
                                <div><p className="text-gray-500">Peso líquido</p><p className="text-white font-mono">pode subir levemente</p></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Monitorar com fotos e medidas — não apenas pela balança!</p>
                        </div>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 5: ADAPTAÇÃO METABÓLICA ─────────── */}
                <SourceSection icon={Zap} title="5. Adaptação Metabólica">
                    <p>
                        Redução do gasto energético <strong className="text-white">além do esperado</strong> pela perda de peso. O corpo reduz TMB, NEAT e EAT como resposta ao déficit prolongado.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 mb-6">
                        {[
                            { comp: 'TMB ↓', pct: '5–15%', desc: 'Hormônios tireoidianos diminuem, eficiência aumenta' },
                            { comp: 'NEAT ↓', pct: 'Maior!', desc: '300–500 kcal/dia menos — movimentos inconscientes reduzem' },
                            { comp: 'EAT ↓', pct: 'Variável', desc: 'Menos energia = treinos menos intensos' },
                            { comp: 'TEF', pct: 'Estável', desc: 'Mas absoluto menor (menos comida ingerida)' },
                        ].map(({ comp, pct, desc }) => (
                            <div key={comp} className="bg-[#111] border border-white/5 rounded-xl p-4">
                                <div className="text-white font-bold text-sm mb-1">{comp}</div>
                                <div className="text-orange-400 font-mono text-xs font-bold mb-1">{pct}</div>
                                <div className="text-xs text-gray-500">{desc}</div>
                            </div>
                        ))}
                    </div>

                    <div className="overflow-x-auto mb-4">
                        <table className="w-full text-sm text-left border-collapse min-w-[440px]">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Situação</th><th className="pb-3 font-semibold">Adaptação Esperada</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5">
                                <tr><td className="py-2.5 text-white">Déficit moderado (-500 kcal) · curto prazo (4–8 sem)</td><td className="py-2.5 font-mono text-yellow-400">5–10% além do esperado</td></tr>
                                <tr><td className="py-2.5 text-white">Déficit moderado prolongado (3–6 meses)</td><td className="py-2.5 font-mono text-orange-400">10–15% além do esperado</td></tr>
                                <tr><td className="py-2.5 text-white">Déficit agressivo (-1000 kcal) · qualquer duração</td><td className="py-2.5 font-mono text-red-400">15–20% além do esperado</td></tr>
                                <tr><td className="py-2.5 text-white">Contest prep (bodybuilding)</td><td className="py-2.5 font-mono text-red-400 font-bold">20–25% além do esperado</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-[#111] border border-white/5 rounded-xl p-4">
                        <p className="text-sm text-white font-semibold mb-1">Exemplo prático de adaptação real</p>
                        <p className="text-xs text-gray-400">Pessoa perde 10 kg: <strong className="text-white">esperada</strong> redução de ~300 kcal na TMB. <strong className="text-orange-400">Real:</strong> redução de 400–450 kcal (adaptação adicional de 100–150 kcal).</p>
                    </div>

                    <h4 className="text-white text-sm font-bold mt-6 mb-3">7 Estratégias para Minimizar a Adaptação</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { n: '1', t: 'Déficit Moderado', d: 'Máximo -500 kcal. Déficits agressivos causam mais adaptação.' },
                            { n: '2', t: 'Diet Breaks Regulares', d: '1–2 semanas em manutenção a cada 8–12 semanas. Restaura hormônios.' },
                            { n: '3', t: 'Refeeds Semanais', d: '1–2 dias com carboidratos elevados. Manutenção nesses dias.' },
                            { n: '4', t: 'Manter Treino de Força', d: 'Preserva massa muscular. Músculo é metabolicamente ativo.' },
                            { n: '5', t: 'Aumentar NEAT Conscientemente', d: '8–10k passos/dia. Usar escadas. Ficar mais em pé. Contrabalança NEAT inconsciente.' },
                            { n: '6', t: 'Proteína Alta', d: '2.2–3.0 g/kg. Preserva massa magra + TEF mais alto.' },
                            { n: '7', t: 'Sono Adequado', d: '7–9 horas. Sono ruim piora a adaptação hormonal.' },
                        ].map(({ n, t, d }) => (
                            <div key={n} className="flex gap-3 bg-[#111] border border-white/5 rounded-xl p-3">
                                <span className="text-emerald-400 font-bold text-sm shrink-0">{n}.</span>
                                <div><p className="text-white text-xs font-bold">{t}</p><p className="text-xs text-gray-400 mt-0.5">{d}</p></div>
                            </div>
                        ))}
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 6: PLATÔS E AJUSTES ─────────── */}
                <SourceSection icon={AlertTriangle} title="6. Platôs e Protocolo de Ajustes">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h5 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Não é Platô (Normal)</h5>
                            <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
                                <li>Peso flutuou por 1 semana</li>
                                <li>Menstruação / TPM</li>
                                <li>Comeu mais sódio ou carboidratos recentemente</li>
                                <li>Iniciou creatina</li>
                                <li>Treinou mais pesado (inflamação muscular)</li>
                                <li>Constipação</li>
                            </ul>
                        </div>
                        <div className="bg-[#111] border border-red-500/20 rounded-xl p-5">
                            <h5 className="text-red-400 text-xs font-bold uppercase tracking-wider mb-3">Platô Real</h5>
                            <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
                                <li>Peso estagnado por <strong className="text-white">2–3+ semanas</strong></li>
                                <li>Aderência à dieta confirmada (sem "escorregadas")</li>
                                <li>Medidas de circunferência também estagnadas</li>
                                <li>Treino não está progredindo</li>
                            </ul>
                        </div>
                    </div>

                    <h4 className="text-white text-sm font-bold mb-3">Protocolo de Ajuste Calórico</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#111] border border-red-500/10 rounded-xl p-5">
                            <h5 className="text-red-400 text-xs font-bold uppercase tracking-wider mb-3">Em Déficit (Cutting)</h5>
                            <div className="space-y-3 text-xs">
                                <div><p className="text-white font-semibold">Se peso NÃO está caindo (platô):</p>
                                    <ul className="text-gray-400 list-disc pl-4 space-y-1 mt-1">
                                        <li>Aumentar gasto (NEAT, cardio): +100–200 kcal</li>
                                        <li>OU reduzir intake: -100–150 kcal</li>
                                        <li>Reduzir carboidratos ou gorduras (manter proteína)</li>
                                    </ul>
                                </div>
                                <div><p className="text-white font-semibold">Se peso cai MUITO RÁPIDO ({'>'} 1%/sem):</p>
                                    <ul className="text-gray-400 list-disc pl-4 space-y-1 mt-1">
                                        <li>Aumentar calorias em 100–200 kcal</li>
                                        <li>Provavelmente perdendo músculo</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#111] border border-emerald-500/10 rounded-xl p-5">
                            <h5 className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">Em Superávit (Bulking)</h5>
                            <div className="space-y-3 text-xs">
                                <div><p className="text-white font-semibold">Se peso NÃO está subindo:</p>
                                    <ul className="text-gray-400 list-disc pl-4 space-y-1 mt-1">
                                        <li>Verificar aderência ao tracking</li>
                                        <li>Aumentar calorias em 100–150 kcal</li>
                                        <li>Adicionar carboidratos principalmente</li>
                                    </ul>
                                </div>
                                <div><p className="text-white font-semibold">Se peso sobe MUITO RÁPIDO ({'>'} 0.5 kg/sem):</p>
                                    <ul className="text-gray-400 list-disc pl-4 space-y-1 mt-1">
                                        <li>Reduzir calorias em 100–150 kcal</li>
                                        <li>Está ganhando gordura desnecessária</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 p-3 bg-[#111] border border-white/5 rounded-xl text-xs">
                        <p className="text-white font-semibold">Frequência de ajustes:</p>
                        <p className="text-gray-400 mt-1">Avaliar semanalmente. Ajustar a cada <strong className="text-white">2–3 semanas</strong> se necessário. Ajustes pequenos (100–200 kcal) são preferíveis a mudanças drásticas.</p>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 7: TABELA RESUMO + REGRAS ─────────── */}
                <SourceSection icon={Target} title="7. Tabela Resumo e Regras de Ouro">
                    <h4 className="text-white text-sm font-bold mb-3">Déficit Calórico (Cutting)</h4>
                    <div className="overflow-x-auto mb-6">
                        <table className="w-full text-sm text-left border-collapse min-w-[500px]">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">% Gordura</th><th className="pb-3 pr-4 font-semibold">Taxa/Sem</th><th className="pb-3 pr-4 font-semibold">Déficit/Dia</th><th className="pb-3 font-semibold">Notas</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5 text-xs">
                                <tr><td className="py-2 text-red-400">{'>'} 25% (H) / 32% (M)</td><td className="py-2 font-mono">0.7–1.0%</td><td className="py-2 font-mono">500–750 kcal</td><td className="py-2 text-gray-400">Pode ser mais agressivo</td></tr>
                                <tr><td className="py-2 text-orange-400">15–25% (H) / 25–32%</td><td className="py-2 font-mono">0.5–0.7%</td><td className="py-2 font-mono">300–500 kcal</td><td className="py-2 text-gray-400">Taxa padrão</td></tr>
                                <tr><td className="py-2 text-emerald-400">10–15% (H) / 20–25%</td><td className="py-2 font-mono">0.3–0.5%</td><td className="py-2 font-mono">200–400 kcal</td><td className="py-2 text-gray-400">Preservar músculo é prioridade</td></tr>
                                <tr><td className="py-2 text-blue-400">{'<'} 10% (H) / {'<'} 20%</td><td className="py-2 font-mono">0.2–0.3%</td><td className="py-2 font-mono">100–250 kcal</td><td className="py-2 text-gray-400">Muito conservador</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h4 className="text-white text-sm font-bold mb-3">Superávit Calórico (Bulking)</h4>
                    <div className="overflow-x-auto mb-6">
                        <table className="w-full text-sm text-left border-collapse min-w-[500px]">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Experiência</th><th className="pb-3 pr-4 font-semibold">Superávit/Dia</th><th className="pb-3 pr-4 font-semibold">Ganho/Mês</th><th className="pb-3 font-semibold">Notas</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5 text-xs">
                                <tr><td className="py-2 text-white">Iniciante (0–1 ano)</td><td className="py-2 font-mono text-emerald-400">300–500 kcal</td><td className="py-2 font-mono">0.5–1.0 kg</td><td className="py-2 text-gray-400">Maior potencial de ganho</td></tr>
                                <tr><td className="py-2 text-white">Intermediário (1–3)</td><td className="py-2 font-mono text-emerald-400">200–300 kcal</td><td className="py-2 font-mono">0.25–0.5 kg</td><td className="py-2 text-gray-400">Lean bulk recomendado</td></tr>
                                <tr><td className="py-2 text-white">Avançado (3–7)</td><td className="py-2 font-mono">100–200 kcal</td><td className="py-2 font-mono">0.1–0.25 kg</td><td className="py-2 text-gray-400">Ganhos mais lentos</td></tr>
                                <tr><td className="py-2 text-white">Elite (7+)</td><td className="py-2 font-mono">100–150 kcal</td><td className="py-2 font-mono text-gray-500">{'<'} 0.1 kg</td><td className="py-2 text-gray-400">Quase em manutenção</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h4 className="text-white text-sm font-bold mb-3">7 Regras de Ouro</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { n: '1', t: 'Quanto mais magro, mais conservador o déficit', d: 'Alto BF: pode usar déficit agressivo. Baixo BF: déficit pequeno para preservar músculo.' },
                            { n: '2', t: 'Mais superávit ≠ mais músculo', d: 'Corpo tem limite de síntese proteica. Excesso vira gordura, não músculo.' },
                            { n: '3', t: 'Ajustes pequenos e frequentes', d: '100–200 kcal de cada vez. Avaliar a cada 2–3 semanas.' },
                            { n: '4', t: 'Proteína sempre alta', d: 'Especialmente em déficit (2.2–3.0 g/kg). É o pilar da preservação muscular.' },
                            { n: '5', t: 'Treino de força é inegociável', d: 'Essencial tanto no cut quanto no bulk. Manter intensidade, ajustar volume.' },
                            { n: '6', t: 'Peso na balança é só um indicador', d: 'Usar também: medidas, fotos, força no treino. Flutuações são normais.' },
                            { n: '7', t: 'Recomposição é possível (para alguns)', d: 'Iniciantes, detrained, alto BF. Não espere isso de atletas avançados.' },
                        ].map(({ n, t, d }) => (
                            <div key={n} className="flex gap-3 items-start bg-[#111] border border-white/5 rounded-xl p-3">
                                <span className="text-emerald-400 font-bold text-sm shrink-0">{n}.</span>
                                <div><p className="text-white text-xs font-bold">{t}</p><p className="text-xs text-gray-400 mt-0.5">{d}</p></div>
                            </div>
                        ))}
                    </div>
                </SourceSection>

                {/* ─────────── REFERÊNCIAS ─────────── */}
                <div className="mt-16 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Referências Bibliográficas</h3>

                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-4 mb-2">Taxa de Perda de Peso</h4>
                    <ol className="text-sm text-gray-400 space-y-1 list-decimal pl-5">
                        <li>Garthe I, et al. (2011). "Effect of two different weight-loss rates on body composition and strength and power-related performance in elite athletes." International Journal of Sport Nutrition and Exercise Metabolism.</li>
                        <li>Helms ER, et al. (2014). "Evidence-based recommendations for natural bodybuilding contest preparation: nutrition and supplementation." Journal of the ISSN.</li>
                        <li>Trexler ET, et al. (2014). "Metabolic adaptation to weight loss: implications for the athlete." Journal of the ISSN.</li>
                    </ol>

                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-6 mb-2">Superávit e Hipertrofia</h4>
                    <ol start={4} className="text-sm text-gray-400 space-y-1 list-decimal pl-5">
                        <li>Ribeiro AS, et al. (2023). "Effect of Small and Large Energy Surpluses on Strength, Muscle, and Skinfold Thickness in Resistance-Trained Individuals." Sports Medicine - Open.</li>
                        <li>Slater G, Phillips SM (2011). "Nutrition guidelines for strength sports: sprinting, weightlifting, throwing events, and bodybuilding." Journal of Sports Sciences.</li>
                    </ol>

                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-6 mb-2">Recomposição Corporal</h4>
                    <ol start={6} className="text-sm text-gray-400 space-y-1 list-decimal pl-5">
                        <li>Murphy C, Koehler K (2022). "Energy deficiency impairs resistance training gains in lean mass but not strength: A meta-analysis and meta-regression." Scandinavian Journal of Medicine & Science in Sports.</li>
                        <li>Barakat C, et al. (2020). "Body recomposition: can trained individuals build muscle and lose fat at the same time?" Strength and Conditioning Journal.</li>
                    </ol>

                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-6 mb-2">Adaptação Metabólica</h4>
                    <ol start={8} className="text-sm text-gray-400 space-y-1 list-decimal pl-5">
                        <li>Rosenbaum M, Leibel RL (2010). "Adaptive thermogenesis in humans." International Journal of Obesity.</li>
                        <li>Peos JJ, et al. (2021). "Achieving an Optimal Fat Loss Phase in Resistance-Trained Athletes: A Narrative Review." Nutrients.</li>
                    </ol>

                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-6 mb-2">Recomendações Gerais</h4>
                    <ol start={10} className="text-sm text-gray-400 space-y-1 list-decimal pl-5">
                        <li>Iraki J, et al. (2019). "Nutrition recommendations for bodybuilders in the off-season." Journal of the ISSN.</li>
                        <li>Helms ER, et al. (2020). "Nutritional Recommendations for Physique Athletes." Sports Medicine.</li>
                    </ol>
                </div>

            </div>
        </div>
    );
};
