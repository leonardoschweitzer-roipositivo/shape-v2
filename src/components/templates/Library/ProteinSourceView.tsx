import React from 'react';
import {
    ArrowLeft, BookOpen, BarChart3, Zap, Clock, ShieldCheck,
    AlertTriangle, BookMarked, Target, Leaf, TrendingUp, Layers
} from 'lucide-react';

interface SourceSectionProps {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
}

const SourceSection: React.FC<SourceSectionProps> = ({ icon: Icon, title, children }) => (
    <section className="mb-12 animate-fade-in-up">
        <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 shadow-lg shadow-violet-500/5">
                <Icon size={24} className="text-violet-400" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight uppercase">{title}</h2>
        </div>
        <div className="pl-0 sm:pl-16 space-y-4 text-gray-400 leading-relaxed font-light">
            {children}
        </div>
    </section>
);

const InfoCard: React.FC<{ title: string; value: string; sub?: string; color?: string }> = ({
    title, value, sub, color = 'text-violet-400'
}) => (
    <div className="bg-[#111] border border-white/5 rounded-xl p-4 flex-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">{title}</div>
        <div className={`text-xl font-extrabold ${color}`}>{value}</div>
        {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
    </div>
);

interface ProteinSourceViewProps {
    onBack: () => void;
}

export const ProteinSourceView: React.FC<ProteinSourceViewProps> = ({ onBack }) => {
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
                    <div className="flex items-center gap-2 text-[10px] font-bold text-violet-400 uppercase tracking-widest px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 w-fit">
                        <BookOpen size={12} />
                        <span>Plano de Dieta / V1.0</span>
                    </div>
                </div>

                {/* Title */}
                <div className="mb-16 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter uppercase mb-6">
                        Proteína para <span className="text-violet-400">Hipertrofia</span>
                    </h1>
                    <p className="text-gray-500 font-light max-w-3xl text-lg mb-6">
                        Base científica do VITRÚVIO para calcular necessidades proteicas, distribuir a proteína entre refeições, ajustar para objetivos de bulk/cut e recomendar fontes e timing ideais para cada atleta.
                    </p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-gray-600 font-mono uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                            Vigente: Fev 2026
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={14} className="text-gray-500" />
                            Módulo Plano de Dieta
                        </div>
                    </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-violet-500/20 via-white/5 to-transparent mb-16" />

                {/* ─────────── SEÇÃO 1: FONTES CIENTÍFICAS ─────────── */}
                <SourceSection icon={BookMarked} title="1. Fontes Científicas Principais">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse min-w-[480px]">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Pesquisador / Estudo</th><th className="pb-3 pr-4 font-semibold">Ano</th><th className="pb-3 font-semibold">Contribuição</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                <tr><td className="py-2.5 text-white">Morton et al.</td><td className="py-2.5">2018</td><td className="py-2.5">Meta-análise: breakpoint 1.6 g/kg/dia (49 estudos)</td></tr>
                                <tr><td className="py-2.5 text-white">Nunes et al.</td><td className="py-2.5">2022</td><td className="py-2.5">Meta-análise: ≥1.6 g/kg para jovens (74 estudos)</td></tr>
                                <tr><td className="py-2.5 text-white">Schoenfeld & Aragon</td><td className="py-2.5">2018</td><td className="py-2.5">Per-meal protein utilization e janela anabólica</td></tr>
                                <tr><td className="py-2.5 text-white">Phillips SM</td><td className="py-2.5">2016+</td><td className="py-2.5">Leucine threshold e ativação de mTORC1</td></tr>
                                <tr><td className="py-2.5 text-white">Stronger by Science (Nuckols)</td><td className="py-2.5">2025</td><td className="py-2.5">Reanálise crítica: breakpoint real ~2.0–2.35 g/kg</td></tr>
                            </tbody>
                        </table>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 2: NECESSIDADES DIÁRIAS ─────────── */}
                <SourceSection icon={Target} title="2. Necessidades Proteicas Diárias">
                    <h4 className="text-white text-sm font-bold mb-3">Recomendações por Objetivo</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse min-w-[480px]">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Objetivo</th><th className="pb-3 pr-4 font-semibold">Recomendação</th><th className="pb-3 font-semibold">Observação</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5">
                                <tr><td className="py-2.5 text-white">Sedentário (manutenção básica)</td><td className="py-2.5 font-mono text-gray-400">0.8 g/kg/dia</td><td className="py-2.5 text-xs">RDA mínimo</td></tr>
                                <tr><td className="py-2.5 text-white">Atleta recreativo (manter massa)</td><td className="py-2.5 font-mono">1.2–1.4 g/kg/dia</td><td className="py-2.5 text-xs">Atividade moderada</td></tr>
                                <tr><td className="py-2.5 text-white font-semibold">Hipertrofia (ganho muscular)</td><td className="py-2.5 font-mono text-violet-400 font-semibold">1.6–2.2 g/kg/dia</td><td className="py-2.5 text-xs text-violet-400">Consenso científico · ideal: 2.0</td></tr>
                                <tr><td className="py-2.5 text-white">Atleta avançado (hipertrofia máx)</td><td className="py-2.5 font-mono text-violet-400">2.0–2.4 g/kg/dia</td><td className="py-2.5 text-xs">Maior turnover proteico</td></tr>
                                <tr><td className="py-2.5 text-white font-semibold">Cutting (perda de gordura)</td><td className="py-2.5 font-mono text-emerald-400 font-semibold">2.2–2.8 g/kg/dia</td><td className="py-2.5 text-xs text-emerald-400">Preservar massa magra</td></tr>
                                <tr><td className="py-2.5 text-white">Idosos (≥60) + treino</td><td className="py-2.5 font-mono">1.6–2.0 g/kg/dia</td><td className="py-2.5 text-xs">Resistência anabólica</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                        <InfoCard title="Mínimo Efetivo" value="1.6 g/kg" sub="para hipertrofia" />
                        <InfoCard title="Ideal (VITRÚVIO)" value="2.0 g/kg" sub="evidência mais robusta" color="text-violet-400" />
                        <InfoCard title="Máximo Útil" value="2.4 g/kg" sub="em bulk / avanç." color="text-gray-200" />
                    </div>

                    <div className="bg-[#111] border border-white/5 rounded-xl p-5 mt-4">
                        <h4 className="text-violet-400 text-sm font-bold mb-2">Base de Cálculo</h4>
                        <ul className="text-sm text-gray-400 space-y-1 list-disc pl-5">
                            <li>Usar <strong className="text-white">peso corporal total</strong> — não massa magra — para o cálculo padrão</li>
                            <li>Para obesos ({'>'}25% BF): calcular sobre <strong className="text-white">peso ajustado</strong></li>
                            <li className="font-mono text-white">Peso ajustado = Massa Magra + (Gordura × 0.25)</li>
                        </ul>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 3: META-ANÁLISES ─────────── */}
                <SourceSection icon={BarChart3} title="3. Evidências Científicas — Meta-Análises">
                    <div className="space-y-5">
                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h4 className="text-white text-sm font-bold mb-1">Morton et al. (2018) — Meta-Análise Principal</h4>
                            <p className="text-xs text-gray-500 mb-3">49 estudos randomizados · 1.863 participantes · British Journal of Sports Medicine</p>
                            <div className="overflow-x-auto mb-3">
                                <table className="w-full text-sm text-left border-collapse min-w-[360px]">
                                    <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                        <th className="pb-2 pr-4 font-semibold">Métrica</th><th className="pb-2 font-semibold">Resultado</th>
                                    </tr></thead>
                                    <tbody className="divide-y divide-white/5">
                                        <tr><td className="py-2 text-white">Breakpoint identificado</td><td className="py-2 font-mono text-violet-400 font-bold">1.62 g/kg/dia</td></tr>
                                        <tr><td className="py-2 text-white">Intervalo de confiança (95%)</td><td className="py-2 font-mono">1.03–2.20 g/kg/dia</td></tr>
                                        <tr><td className="py-2 text-white">Ganho adicional FFM</td><td className="py-2 font-mono">+0.30 kg com suplementação</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-gray-500 italic">Conclusão original: acima de ~1.6 g/kg/dia, benefícios adicionais são mínimos.</p>
                        </div>

                        <div className="bg-[#111] border border-violet-500/20 rounded-xl p-5">
                            <h4 className="text-violet-400 text-sm font-bold mb-1">Reanálise Crítica — Stronger by Science (Nuckols, 2025)</h4>
                            <p className="text-xs text-gray-500 mb-3">Greg Nuckols identificou 4 limitações críticas no estudo de Morton et al.:</p>
                            <div className="space-y-3 text-sm">
                                <div className="flex gap-3"><span className="text-violet-400 font-bold shrink-0">①</span><div><strong className="text-white">Significância estatística fraca:</strong><span className="text-gray-400"> p = 0.079 (não significativo a 0.05) · IC muito amplo (1.03–2.20)</span></div></div>
                                <div className="flex gap-3"><span className="text-violet-400 font-bold shrink-0">②</span><div><strong className="text-white">Viés de população:</strong><span className="text-gray-400"> 39 de 49 estudos usaram indivíduos NÃO treinados</span></div></div>
                                <div className="flex gap-3"><span className="text-violet-400 font-bold shrink-0">③</span><div><strong className="text-white">Range de ingestão limitado:</strong><span className="text-gray-400"> Poucos dados acima de 2.0 g/kg nos estudos</span></div></div>
                                <div className="flex gap-3"><span className="text-violet-400 font-bold shrink-0">④</span><div><strong className="text-white">Simpson's Paradox:</strong><span className="text-gray-400"> Correlação negativa entre baseline e ganhos distorce o breakpoint</span></div></div>
                            </div>
                            <div className="mt-4 p-3 bg-violet-500/10 rounded-xl border border-violet-500/20">
                                <p className="text-sm text-violet-300 font-semibold">Breakpoint reavaliado: <span className="font-mono">~2.0 g/kg/dia</span></p>
                                <p className="text-xs text-gray-400 mt-1">Range plausível: 1.7–2.35 g/kg · Recomendação atualizada para atletas treinados: <strong>2.0–2.35 g/kg/dia</strong></p>
                            </div>
                        </div>

                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h4 className="text-white text-sm font-bold mb-1">Nunes et al. (2022)</h4>
                            <p className="text-xs text-gray-500 mb-3">74 estudos randomizados · Journal of Cachexia, Sarcopenia and Muscle</p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left border-collapse min-w-[360px]">
                                    <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                        <th className="pb-2 pr-4 font-semibold">Grupo</th><th className="pb-2 font-semibold">Ingestão Efetiva</th>
                                    </tr></thead>
                                    <tbody className="divide-y divide-white/5">
                                        <tr><td className="py-2 text-white">Jovens ({'<'}65 anos) + treino</td><td className="py-2 font-mono text-violet-400">≥1.6 g/kg/dia</td></tr>
                                        <tr><td className="py-2 text-white">Idosos (≥65 anos) + treino</td><td className="py-2 font-mono">1.2–1.59 g/kg (já mostra efeito)</td></tr>
                                        <tr><td className="py-2 text-white">Sem treino de força</td><td className="py-2 text-gray-500">Efeitos inconsistentes</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-violet-300 mt-3">⚡ Treino de resistência é essencial para proteína adicional resultar em ganhos de massa magra.</p>
                        </div>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 4: LEUCINA ─────────── */}
                <SourceSection icon={Zap} title="4. Leucina e o Leucine Threshold">
                    <p>
                        A <strong className="text-white">leucina</strong> é o BCAA que atua como "gatilho" da síntese proteica muscular (MPS) via ativação da via <strong className="text-white">mTORC1/P70S6K</strong>. Sem atingir o limiar de leucina, a refeição não estimula MPS de forma ótima.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-[#111] border border-violet-500/20 rounded-xl p-5">
                            <h5 className="text-violet-400 text-xs font-bold uppercase tracking-wider mb-3">Jovens ({'<'}40 anos)</h5>
                            <div className="text-2xl font-extrabold text-white mb-1">~2.5 g <span className="text-xs font-normal text-gray-500">leucina/refeição</span></div>
                            <p className="text-xs text-gray-400">≈ 20–25g de proteína de alta qualidade (whey, ovos)</p>
                        </div>
                        <div className="bg-[#111] border border-violet-500/20 rounded-xl p-5">
                            <h5 className="text-violet-400 text-xs font-bold uppercase tracking-wider mb-3">Idosos ({'>'}60 anos)</h5>
                            <div className="text-2xl font-extrabold text-white mb-1">~3–4 g <span className="text-xs font-normal text-gray-500">leucina/refeição</span></div>
                            <p className="text-xs text-gray-400">≈ 30–40g proteína · Causa: resistência anabólica</p>
                        </div>
                    </div>

                    <div className="bg-[#111] border border-white/5 rounded-xl p-4 mt-4">
                        <p className="text-sm font-mono text-white">Leucina necessária = <span className="text-violet-400">0.04 g × Peso (kg)</span> por refeição</p>
                        <p className="text-xs text-gray-500 mt-1">Exemplo (80 kg): 80 × 0.04 = <strong className="text-white">3.2 g leucina</strong> por refeição</p>
                    </div>

                    <h4 className="text-white text-sm font-bold mt-6 mb-3">Conteúdo de Leucina por Fonte</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse min-w-[400px]">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Fonte</th><th className="pb-3 pr-4 font-semibold">Leucina (%)</th><th className="pb-3 font-semibold">Para 3g leucina</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5">
                                <tr><td className="py-2 text-white font-semibold">Whey protein</td><td className="py-2 text-emerald-400 font-mono">10–12%</td><td className="py-2 font-mono">~25–30g proteína</td></tr>
                                <tr><td className="py-2 text-white font-semibold">Ovos</td><td className="py-2 text-emerald-400 font-mono">8.6%</td><td className="py-2 font-mono">~35g proteína</td></tr>
                                <tr><td className="py-2 text-white font-semibold">Caseína</td><td className="py-2 text-emerald-400 font-mono">8–9%</td><td className="py-2 font-mono">~33–38g proteína</td></tr>
                                <tr><td className="py-2 text-white">Carne bovina</td><td className="py-2 font-mono">8%</td><td className="py-2 font-mono">~37–40g proteína</td></tr>
                                <tr><td className="py-2 text-white">Frango</td><td className="py-2 font-mono">7.5%</td><td className="py-2 font-mono">~40g proteína</td></tr>
                                <tr><td className="py-2 text-white">Peixe</td><td className="py-2 font-mono">7–8%</td><td className="py-2 font-mono">~38–43g proteína</td></tr>
                                <tr><td className="py-2 text-white">Soja</td><td className="py-2 font-mono">7.5%</td><td className="py-2 font-mono">~40g proteína</td></tr>
                                <tr><td className="py-2 text-white">Arroz + Feijão</td><td className="py-2 text-gray-500 font-mono">6–7%</td><td className="py-2 font-mono text-gray-400">~45–50g proteína</td></tr>
                            </tbody>
                        </table>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 5: PROTEÍNA POR REFEIÇÃO ─────────── */}
                <SourceSection icon={Layers} title="5. Proteína por Refeição">
                    <div className="p-5 bg-violet-500/5 border border-violet-500/20 rounded-xl mb-4">
                        <h4 className="text-violet-400 text-sm font-bold mb-2">Desmistificando o "Limite de 30g"</h4>
                        <p className="text-sm text-gray-400">O corpo <strong className="text-white">absorve praticamente toda proteína ingerida</strong>. O que tem limite é a estimulação de MPS por refeição. Proteína "extra" ainda contribui para supressão de breakdown muscular, síntese de outras proteínas corporais e efeito térmico.</p>
                    </div>

                    <h4 className="text-white text-sm font-bold mb-3">Quantidade Ideal por Refeição (Schoenfeld & Aragon, 2018)</h4>
                    <p className="text-sm mb-4">Fórmula: <span className="font-mono text-violet-400">0.4 g/kg de peso corporal por refeição</span> (máximo individual ~0.55 g/kg).</p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse min-w-[360px]">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Peso</th><th className="pb-3 pr-4 font-semibold">Proteína/refeição</th><th className="pb-3 font-semibold">Range</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5 font-mono">
                                <tr><td className="py-2 text-white font-sans">60 kg</td><td className="py-2">24 g</td><td className="py-2">24–33 g</td></tr>
                                <tr><td className="py-2 text-white font-sans">70 kg</td><td className="py-2">28 g</td><td className="py-2">28–39 g</td></tr>
                                <tr><td className="py-2 text-white font-sans">80 kg</td><td className="py-2 text-violet-400 font-bold">32 g</td><td className="py-2">32–44 g</td></tr>
                                <tr><td className="py-2 text-white font-sans">90 kg</td><td className="py-2">36 g</td><td className="py-2">36–50 g</td></tr>
                                <tr><td className="py-2 text-white font-sans">100 kg</td><td className="py-2">40 g</td><td className="py-2">40–55 g</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-[#111] border border-white/5 rounded-xl p-4">
                            <h5 className="text-white text-xs font-bold mb-1">Jovens ({'<'}40 anos)</h5>
                            <p className="text-sm text-violet-400 font-semibold">25–40g por refeição</p>
                        </div>
                        <div className="bg-[#111] border border-white/5 rounded-xl p-4">
                            <h5 className="text-white text-xs font-bold mb-1">Idosos ({'>'}60 anos)</h5>
                            <p className="text-sm text-violet-400 font-semibold">35–50g por refeição</p>
                            <p className="text-xs text-gray-500">Maior dose compensa resistência anabólica</p>
                        </div>
                    </div>

                    <div className="bg-[#111] border border-white/5 rounded-xl p-5 mt-4">
                        <h4 className="text-white text-sm font-bold mb-2">Estudo: 20g vs 40g após treino de corpo inteiro (Macnaughton et al., 2016)</h4>
                        <p className="text-sm text-gray-400">40g produziu MPS <strong className="text-white">~20% MAIOR</strong> que 20g — mas somente após treinos de <strong className="text-white">corpo inteiro</strong> (maior massa exercitada = maior demanda). Para treinos isolados (só braço), 20–25g é suficiente.</p>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 6: DISTRIBUIÇÃO DIÁRIA ─────────── */}
                <SourceSection icon={Clock} title="6. Distribuição Diária e Período Refratário">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                            <h4 className="text-red-400 text-xs font-bold uppercase tracking-wider mb-3">❌ Distribuição Típica (Subótima)</h4>
                            <div className="bg-[#111] border border-red-500/10 rounded-xl p-4 space-y-2 text-xs">
                                {[
                                    { horario: 'Café', prot: '10g', desc: 'pão, café' },
                                    { horario: 'Almoço', prot: '25g', desc: 'arroz, feijão, carne' },
                                    { horario: 'Lanche', prot: '5g', desc: 'fruta' },
                                    { horario: 'Jantar', prot: '50g', desc: 'carne, salada' },
                                ].map(r => (
                                    <div key={r.horario} className="flex justify-between">
                                        <span className="text-gray-400">{r.horario} <span className="text-gray-600">({r.desc})</span></span>
                                        <span className={r.prot === '50g' ? 'text-red-400 font-bold' : 'text-gray-400'}>{r.prot}</span>
                                    </div>
                                ))}
                                <p className="text-red-400 text-[10px] pt-2 border-t border-red-500/10">Apenas 1–2 refeições atingem o leucine threshold → MPS ativada 1–2×/dia</p>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">✓ Distribuição Otimizada</h4>
                            <div className="bg-[#111] border border-emerald-500/10 rounded-xl p-4 space-y-2 text-xs">
                                {[
                                    { horario: 'Café', prot: '30–35g', desc: 'ovos, whey, iogurte' },
                                    { horario: 'Almoço', prot: '35–40g', desc: 'proteína animal/vegetal' },
                                    { horario: 'Lanche', prot: '25–30g', desc: 'whey, cottage, ovos' },
                                    { horario: 'Jantar', prot: '35–40g', desc: 'proteína animal' },
                                ].map(r => (
                                    <div key={r.horario} className="flex justify-between">
                                        <span className="text-gray-400">{r.horario} <span className="text-gray-600">({r.desc})</span></span>
                                        <span className="text-emerald-400 font-bold">{r.prot}</span>
                                    </div>
                                ))}
                                <p className="text-emerald-400 text-[10px] pt-2 border-t border-emerald-500/10">3–4 refeições atingem o threshold → 3–4 picos anabólicos/dia</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                        <h4 className="text-violet-400 text-sm font-bold mb-3">Período Refratário da MPS (Muscle Full Effect)</h4>
                        <div className="space-y-2 text-sm">
                            {[
                                { t: 'Hora 0', desc: 'Refeição com proteína → MPS aumenta', c: 'text-violet-400' },
                                { t: 'Hora 2–3', desc: 'MPS retorna ao baseline', c: 'text-gray-400' },
                                { t: 'Hora 3–4', desc: 'Período refratário termina', c: 'text-gray-400' },
                                { t: 'Hora 4–5', desc: 'Nova refeição pode estimular MPS novamente ✓', c: 'text-emerald-400' },
                            ].map(({ t, desc, c }) => (
                                <div key={t} className="flex gap-4 items-start">
                                    <span className="text-[10px] font-bold text-gray-600 font-mono shrink-0 w-16">{t}</span>
                                    <span className={`text-xs ${c}`}>{desc}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-orange-400 mt-4">⚠️ Grazing (comer pouquinho o tempo todo) é MENOS eficiente. Espaçar 3–5h permite novos picos de MPS.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                        <div className="bg-[#111] border border-white/5 rounded-xl p-4 text-center">
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Mínimo</div>
                            <div className="text-lg font-extrabold text-white">3 refeições</div>
                            <div className="text-xs text-gray-500">espaçadas 4–5h</div>
                        </div>
                        <div className="bg-[#111] border border-violet-500/20 rounded-xl p-4 text-center">
                            <div className="text-[10px] font-bold text-violet-400 uppercase tracking-wider mb-1">Ideal</div>
                            <div className="text-lg font-extrabold text-white">4 refeições</div>
                            <div className="text-xs text-gray-500">espaçadas 3–4h</div>
                        </div>
                        <div className="bg-[#111] border border-white/5 rounded-xl p-4 text-center">
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">5+ Refeições</div>
                            <div className="text-lg font-extrabold text-gray-500">↓ Retornos</div>
                            <div className="text-xs text-gray-600">MPS refratária</div>
                        </div>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 7: TIMING ─────────── */}
                <SourceSection icon={TrendingUp} title="7. Timing de Proteína">
                    <div className="p-4 bg-[#111] border border-white/5 rounded-xl mb-4">
                        <h4 className="text-white text-sm font-bold mb-2">O Mito da "Janela de 30 Minutos"</h4>
                        <p className="text-sm text-gray-400">
                            A "janela anabólica" é muito mais ampla — <strong className="text-white">~4–6 horas</strong>. O total diário de proteína é <strong className="text-white">mais importante que o timing</strong>. (Schoenfeld et al., meta-análise 2013)
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { title: 'Pré-treino (1–3h antes)', items: ['25–40g proteína na refeição', 'Se treinar em jejum: 10–20g whey 30min antes', 'Aminoácidos disponíveis durante e após treino'] },
                            { title: 'Pós-treino (até 2–3h depois)', items: ['25–40g proteína', 'Whey é conveniente, mas não obrigatório', 'Refeição completa funciona igualmente bem'] },
                            { title: 'Antes de dormir', items: ['30–40g proteína (caseína ou cottage)', 'Digestão lenta = aminoácidos durante a noite', 'Especialmente importante para idosos'] },
                            { title: 'Ao acordar', items: ['25–40g proteína', 'Interrompe o jejum noturno', 'Inicia primeiro pico de MPS do dia'] },
                        ].map(({ title, items }) => (
                            <div key={title} className="bg-[#111] border border-white/5 rounded-xl p-4">
                                <h5 className="text-violet-400 text-xs font-bold uppercase tracking-wider mb-2">{title}</h5>
                                <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
                                    {items.map(i => <li key={i}>{i}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 8: DÉFICIT ─────────── */}
                <SourceSection icon={AlertTriangle} title="8. Proteína em Déficit Calórico (Cutting)">
                    <p>
                        Durante o cutting, a ingestão de proteína deve ser <strong className="text-white">aumentada</strong> — não mantida ou reduzida. Há 4 razões científicas principais:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        {[
                            { n: '1', t: 'Preservar massa muscular', d: 'Déficit aumenta catabolismo — mais proteína = mais substrato para reconstrução' },
                            { n: '2', t: 'Compensar oxidação', d: 'Em déficit, corpo usa mais aminoácidos para energia → menos disponíveis para MPS' },
                            { n: '3', t: 'Saciedade', d: 'Proteína é o macronutriente mais saciante → controla fome no déficit' },
                            { n: '4', t: 'Efeito Térmico', d: 'TEF da proteína: 20–35% → maior gasto calórico na digestão' },
                        ].map(({ n, t, d }) => (
                            <div key={n} className="flex gap-3 bg-[#111] border border-white/5 rounded-xl p-4">
                                <span className="text-violet-400 font-bold text-sm shrink-0">{n}.</span>
                                <div><p className="text-white text-xs font-bold">{t}</p><p className="text-xs text-gray-400 mt-0.5">{d}</p></div>
                            </div>
                        ))}
                    </div>

                    <div className="overflow-x-auto mt-6">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Tipo de Déficit</th><th className="pb-3 font-semibold">Proteína Recomendada</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5">
                                <tr><td className="py-2.5 text-white">Déficit moderado (−300 a −500 kcal)</td><td className="py-2.5 font-mono text-emerald-400">2.0–2.4 g/kg/dia</td></tr>
                                <tr><td className="py-2.5 text-white">Déficit agressivo (−500 a −1000 kcal)</td><td className="py-2.5 font-mono text-emerald-400 font-semibold">2.4–3.1 g/kg/dia</td></tr>
                                <tr><td className="py-2.5 text-white">Fórmula por massa magra</td><td className="py-2.5 font-mono">2.3–3.1 g/kg de MM</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-[#111] border border-emerald-500/10 rounded-xl p-5 mt-4">
                        <h4 className="text-emerald-400 text-sm font-bold mb-3">Exemplo: 80kg, 15% BF em déficit</h4>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between"><span className="text-gray-400">Massa Magra</span><span className="text-white font-mono">80 × 0.85 = 68 kg</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Proteína mínima</span><span className="text-white font-mono">68 × 2.3 = 156 g/dia</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Proteína ideal</span><span className="text-emerald-400 font-mono font-bold">68 × 2.8 = 190 g/dia</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Simplificado (peso total)</span><span className="text-white font-mono">80 × 2.2 = 176 g/dia</span></div>
                        </div>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 9: QUALIDADE ─────────── */}
                <SourceSection icon={Leaf} title="9. Qualidade da Proteína e Animal vs Vegetal">
                    <div className="overflow-x-auto mb-4">
                        <table className="w-full text-sm text-left border-collapse min-w-[440px]">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Métrica</th><th className="pb-3 pr-4 font-semibold">Definição</th><th className="pb-3 font-semibold">Melhor Score</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5">
                                <tr><td className="py-2 text-white font-semibold">PDCAAS</td><td className="py-2">Digestibilidade + aminoácidos limitantes</td><td className="py-2 font-mono">1.0 (máximo)</td></tr>
                                <tr><td className="py-2 text-white font-semibold">DIAAS</td><td className="py-2">Digestibilidade ileal + aminoácidos</td><td className="py-2 font-mono">{'>'}100 (excelente)</td></tr>
                                <tr><td className="py-2 text-white">Valor Biológico</td><td className="py-2">% proteína retida pelo corpo</td><td className="py-2 font-mono">100 (ovo referência)</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h5 className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">Tier 1 — Excelente (PDCAAS = 1.0)</h5>
                            <ul className="text-sm text-gray-400 space-y-1 list-disc pl-4">
                                <li className="text-white">Whey protein</li>
                                <li className="text-white">Ovos</li>
                                <li className="text-white">Caseína</li>
                                <li className="text-white">Leite</li>
                            </ul>
                            <h5 className="text-blue-400 text-xs font-bold uppercase tracking-wider mt-4 mb-2">Tier 2 — Muito Bom</h5>
                            <ul className="text-sm text-gray-400 space-y-1 list-disc pl-4">
                                <li>Carne bovina, frango, peru</li>
                                <li>Peixe</li>
                                <li>Proteína de soja isolada</li>
                            </ul>
                        </div>
                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h5 className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-3">Tier 3 — Bom (PDCAAS 0.7–0.9)</h5>
                            <ul className="text-sm text-gray-400 space-y-1 list-disc pl-4">
                                <li>Leguminosas (feijão, lentilha)</li>
                                <li>Quinoa</li>
                                <li>Ervilha + arroz (combinadas)</li>
                            </ul>
                            <h5 className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-4 mb-2">Tier 4 — Moderado</h5>
                            <ul className="text-sm text-gray-500 space-y-1 list-disc pl-4">
                                <li>Cereais (arroz, trigo)</li>
                                <li>Nozes e sementes</li>
                                <li>Vegetais</li>
                            </ul>
                        </div>
                    </div>

                    <div className="p-5 bg-[#111] border border-violet-500/10 rounded-xl mt-4">
                        <h4 className="text-violet-400 text-sm font-bold mb-3">Para Veganos e Vegetarianos</h4>
                        <ul className="text-sm text-gray-400 space-y-1 list-disc pl-5">
                            <li>Aumentar ingestão total em <strong className="text-white">+20%</strong> (compensar biodisponibilidade)</li>
                            <li>Combinar fontes: arroz + feijão, ervilha + arroz (perfil completo)</li>
                            <li>Considerar suplementação de leucina ou proteína isolada</li>
                            <li>Atingir 2.0–2.2 g/kg/dia é possível, mas requer planejamento</li>
                        </ul>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 10: TABELA RESUMO + REGRAS ─────────── */}
                <SourceSection icon={ShieldCheck} title="10. Resumo e Regras de Ouro">
                    <h4 className="text-white text-sm font-bold mb-3">Proteína Diária por Objetivo e Faixa Etária (g/kg)</h4>
                    <div className="overflow-x-auto mb-6">
                        <table className="w-full text-sm text-left border-collapse min-w-[420px]">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Perfil</th>
                                <th className="pb-3 pr-4 font-semibold text-blue-400">Bulk</th>
                                <th className="pb-3 pr-4 font-semibold text-gray-400">Manutenção</th>
                                <th className="pb-3 font-semibold text-emerald-400">Cut</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5 font-mono text-xs">
                                <tr><td className="py-2.5 text-white font-sans text-sm">Jovem ({'<'}40)</td><td className="py-2.5 text-blue-400">1.8–2.2</td><td className="py-2.5">1.6–2.0</td><td className="py-2.5 text-emerald-400">2.2–2.8</td></tr>
                                <tr><td className="py-2.5 text-white font-sans text-sm">Meia-idade (40–60)</td><td className="py-2.5 text-blue-400">2.0–2.4</td><td className="py-2.5">1.8–2.2</td><td className="py-2.5 text-emerald-400">2.4–3.0</td></tr>
                                <tr><td className="py-2.5 text-white font-sans text-sm">Idoso ({'>'}60)</td><td className="py-2.5 text-blue-400">2.0–2.4</td><td className="py-2.5">1.8–2.2</td><td className="py-2.5 text-emerald-400">2.4–3.0</td></tr>
                                <tr><td className="py-2.5 text-white font-sans text-sm italic">Vegano/Veg.</td><td className="py-2.5 text-gray-500">+20%</td><td className="py-2.5 text-gray-500">+20%</td><td className="py-2.5 text-gray-500">+20%</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h4 className="text-white text-sm font-bold mb-3">Regras de Ouro</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { n: '1', t: 'Total Diário é Prioridade #1', d: 'Mínimo 1.6 g/kg, ideal 2.0 g/kg para hipertrofia. Mais importante que timing ou distribuição.' },
                            { n: '2', t: 'Atingir Leucine Threshold', d: 'Mínimo 25g proteína de qualidade por refeição, ou 2.5–3g de leucina.' },
                            { n: '3', t: '3–4 Refeições Espaçadas', d: 'Espaçadas 3–5 horas. Evitar concentrar em 1–2 refeições.' },
                            { n: '4', t: 'Aumentar no Déficit', d: '+0.4–0.6 g/kg adicional durante cutting. Preserva massa muscular.' },
                            { n: '5', t: 'Ajustar pela Idade', d: '+0.2 g/kg para >50 anos. +0.3 g/kg para >60 anos. Proteína antes de dormir é essencial.' },
                            { n: '6', t: 'Priorizar Qualidade', d: 'Fontes completas (animais, soja). Veganos: combinar fontes e aumentar quantidade em 20%.' },
                        ].map(({ n, t, d }) => (
                            <div key={n} className="flex gap-3 items-start bg-[#111] border border-white/5 rounded-xl p-3">
                                <span className="text-violet-400 font-bold text-sm shrink-0">{n}.</span>
                                <div><p className="text-white text-xs font-bold">{t}</p><p className="text-xs text-gray-400 mt-0.5">{d}</p></div>
                            </div>
                        ))}
                    </div>
                </SourceSection>

                {/* ─────────── REFERÊNCIAS ─────────── */}
                <div className="mt-16 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Referências Bibliográficas</h3>

                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-4 mb-2">Meta-Análises Principais</h4>
                    <ol className="text-sm text-gray-400 space-y-1 list-decimal pl-5">
                        <li>Morton RW, et al. (2018). "A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength." British Journal of Sports Medicine.</li>
                        <li>Nunes EA, et al. (2022). "Systematic review and meta-analysis of protein intake to support muscle mass and function in healthy adults." Journal of Cachexia, Sarcopenia and Muscle.</li>
                        <li>Schoenfeld BJ, Aragon AA (2018). "How much protein can the body use in a single meal for muscle-building?" Journal of the ISSN.</li>
                    </ol>

                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-6 mb-2">Leucina e MPS</h4>
                    <ol start={4} className="text-sm text-gray-400 space-y-1 list-decimal pl-5">
                        <li>Phillips SM (2016). "The impact of protein quality on the promotion of resistance exercise-induced changes in muscle mass." Nutrition & Metabolism.</li>
                        <li>Devries MC, et al. (2018). "Protein leucine content is a determinant of shorter- and longer-term muscle protein synthetic responses." AJCN.</li>
                        <li>Atherton PJ, Smith K (2012). "Muscle protein synthesis in response to nutrition and exercise." Journal of Physiology.</li>
                    </ol>

                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-6 mb-2">Timing e Distribuição</h4>
                    <ol start={7} className="text-sm text-gray-400 space-y-1 list-decimal pl-5">
                        <li>Schoenfeld BJ, et al. (2013). "The effect of protein timing on muscle strength and hypertrophy: a meta-analysis." Journal of the ISSN.</li>
                        <li>Areta JL, et al. (2013). "Timing and distribution of protein ingestion during prolonged recovery from resistance exercise." Journal of Physiology.</li>
                    </ol>

                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-6 mb-2">Déficit Calórico</h4>
                    <ol start={9} className="text-sm text-gray-400 space-y-1 list-decimal pl-5">
                        <li>Helms ER, et al. (2014). "A systematic review of dietary protein during caloric restriction in resistance trained lean athletes." International Journal of Sport Nutrition and Exercise Metabolism.</li>
                        <li>Mettler S, et al. (2010). "Increased protein intake reduces lean body mass loss during weight loss in athletes." Medicine & Science in Sports & Exercise.</li>
                        <li>Nuckols G (2025). "Protein Science Updated: Why It's Time to Move Beyond the '1.6-2.2g/kg' Rule." Stronger by Science.</li>
                    </ol>
                </div>

            </div>
        </div>
    );
};
