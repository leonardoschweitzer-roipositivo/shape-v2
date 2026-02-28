import React from 'react';
import { ArrowLeft, BookOpen, Scale, FileText, Activity, ShieldCheck, Sparkles, Users, Dumbbell, BarChart3, AlertTriangle, BookMarked } from 'lucide-react';

interface SourceSectionProps {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
}

const SourceSection: React.FC<SourceSectionProps> = ({ icon: Icon, title, children }) => (
    <section className="mb-12 animate-fade-in-up">
        <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-lg shadow-amber-500/5">
                <Icon size={24} className="text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight uppercase">{title}</h2>
        </div>
        <div className="pl-0 sm:pl-16 space-y-4 text-gray-400 leading-relaxed font-light">
            {children}
        </div>
    </section>
);

/** Small reusable formula card */
const FormulaBox: React.FC<{ label: string; formula: string; highlight?: boolean }> = ({ label, formula, highlight }) => (
    <div className={`px-4 py-3 rounded-xl border ${highlight ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white/5 border-white/10'}`}>
        <span className={`block text-[10px] font-bold uppercase tracking-wider mb-0.5 ${highlight ? 'text-amber-400' : 'text-gray-500'}`}>{label}</span>
        <span className="font-mono font-semibold text-sm text-white">{formula}</span>
    </div>
);

interface GoldenRatioSourceViewProps {
    onBack: () => void;
}

export const GoldenRatioSourceView: React.FC<GoldenRatioSourceViewProps> = ({ onBack }) => {
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
                    <div className="flex items-center gap-2 text-[10px] font-bold text-amber-500 uppercase tracking-widest px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 w-fit">
                        <BookOpen size={12} />
                        <span>Módulo de Avaliação / V1.0</span>
                    </div>
                </div>

                {/* Title */}
                <div className="mb-16 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter uppercase mb-6">
                        Proporções Áureas e <span className="text-amber-500">Ideais Corporais</span>
                    </h1>
                    <p className="text-gray-500 font-light max-w-3xl text-lg mb-6">
                        Base de conhecimento científico e histórico sobre proporções corporais ideais utilizada pelo VITRÚVIO para calcular medidas ideais personalizadas, avaliar o score estético, definir metas de desenvolvimento muscular e identificar pontos fortes e fracos.
                    </p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-gray-600 font-mono uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            Vigente: Fev 2026
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={14} className="text-gray-500" />
                            Conhecimento Científico Fundamental
                        </div>
                    </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-amber-500/20 via-white/5 to-transparent mb-16" />

                {/* ─────────── SEÇÃO 1: FONTES PRIMÁRIAS ─────────── */}
                <SourceSection icon={BookMarked} title="1. Fontes Primárias">
                    <p>
                        O conhecimento do VITRÚVIO é composto por cinco pilares científicos e históricos, cada um contribuindo com uma peça fundamental para o cálculo das proporções ideais.
                    </p>
                    <div className="overflow-x-auto mt-4">
                        <table className="w-full text-sm text-left border-collapse min-w-[550px]">
                            <thead>
                                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="pb-3 pr-4 font-semibold">Fonte</th>
                                    <th className="pb-3 pr-4 font-semibold">Tipo</th>
                                    <th className="pb-3 pr-4 font-semibold">Ano</th>
                                    <th className="pb-3 font-semibold">Contribuição</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <tr><td className="py-3 text-white">Eugen Sandow</td><td className="py-3">Histórica</td><td className="py-3">1897</td><td className="py-3">Grecian Ideal original</td></tr>
                                <tr><td className="py-3 text-white">Steve Reeves</td><td className="py-3">Histórica</td><td className="py-3">1995</td><td className="py-3">Fórmulas muscle-to-bone</td></tr>
                                <tr><td className="py-3 text-white">John McCallum</td><td className="py-3">Histórica</td><td className="py-3">1965</td><td className="py-3">Fórmulas baseadas no pulso</td></tr>
                                <tr><td className="py-3 text-white">Casey Butt, Ph.D.</td><td className="py-3">Científica</td><td className="py-3">2009</td><td className="py-3">Pesquisa com ~300 atletas naturais</td></tr>
                                <tr><td className="py-3 text-white">Golden Ratio (φ)</td><td className="py-3">Matemática</td><td className="py-3">—</td><td className="py-3">Proporção 1:1.618</td></tr>
                            </tbody>
                        </table>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 2: PROPORÇÃO ÁUREA ─────────── */}
                <SourceSection icon={Sparkles} title="2. A Proporção Áurea (Phi)">
                    <p>
                        A proporção áurea (<strong className="text-white">φ = 1.6180339887...</strong>) é definida pela relação <span className="font-mono text-white">a/b = (a+b)/a = φ ≈ 1.618</span>. Ela aparece recorrentemente na natureza e é considerada o fundamento universal de simetria e beleza.
                    </p>
                    <div className="bg-[#111] border border-white/5 rounded-xl p-5 mt-2">
                        <h4 className="text-amber-500 text-sm font-bold mb-3">Presença na Natureza</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
                            <li>Espirais de conchas (<em>Nautilus</em>)</li>
                            <li>Disposição de pétalas de flores e sementes de girassol</li>
                            <li>Proporções do corpo humano (Da Vinci — Homem Vitruviano)</li>
                            <li>Arquitetura clássica (Partenon, Grécia)</li>
                            <li>Arte renascentista</li>
                        </ul>
                    </div>

                    <div className="bg-[#111] border border-white/5 rounded-xl p-5 mt-4">
                        <h4 className="text-amber-500 text-sm font-bold mb-2">Proporção Áurea Principal — Shape-V</h4>
                        <p className="font-mono text-white text-lg mb-2">Ombros : Cintura = 1.618 : 1</p>
                        <p className="text-sm text-gray-500">Exemplo: Cintura de 80 cm → Ombros ideais = 80 × 1.618 = <strong className="text-white">129.4 cm</strong></p>
                    </div>

                    <div className="mt-4">
                        <h4 className="text-white text-sm font-bold mb-2">Sequência de Fibonacci no Corpo</h4>
                        <p className="text-sm">
                            Cada número da sequência (1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89...) dividido pelo anterior converge para φ. No corpo humano, esse princípio rege proporções segmentares:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
                            <li>Proporção mão : antebraço : braço</li>
                            <li>Proporção pé : canela : coxa</li>
                            <li>Proporção face (terços faciais)</li>
                        </ul>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 3: EUGEN SANDOW ─────────── */}
                <SourceSection icon={Scale} title="3. Eugen Sandow — Grecian Ideal (1897)">
                    <p>
                        Eugen Sandow (1867–1925), considerado o "Pai do Bodybuilding Moderno", mediu estátuas gregas e romanas em museus europeus para desenvolver o <strong className="text-white">Grecian Ideal</strong>. Ele construiu seu próprio físico seguindo essas proporções, e o troféu do Mr. Olympia é baseado em sua imagem.
                    </p>
                    <p className="text-sm mt-2">
                        <strong className="text-white">Livros de referência:</strong> "Strength and How to Obtain It" (1897), "Sandow's System of Physical Training" (1894), "The Construction and Reconstruction of the Human Body" (1907).
                    </p>

                    <h4 className="text-white text-sm font-bold mt-6 mb-3">Fórmulas do Grecian Ideal (Baseadas no Pulso)</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <FormulaBox label="Braço (flexionado)" formula="Pulso × 2.5" />
                        <FormulaBox label="Panturrilha" formula="= Braço" />
                        <FormulaBox label="Pescoço" formula="= Braço" />
                        <FormulaBox label="Ombros" formula="Cintura × 1.618" highlight />
                        <FormulaBox label="Peitoral" formula="Pulso × 6.5" />
                    </div>

                    <h4 className="text-white text-sm font-bold mt-6 mb-3">Medidas de Referência de Sandow</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Medida</th><th className="pb-3 font-semibold">Valor</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5">
                                <tr><td className="py-2 text-white">Altura</td><td className="py-2">175 cm (5'9")</td></tr>
                                <tr><td className="py-2 text-white">Peso</td><td className="py-2">88 kg (195 lbs)</td></tr>
                                <tr><td className="py-2 text-white">Peitoral</td><td className="py-2">122 cm (48")</td></tr>
                                <tr><td className="py-2 text-white">Cintura</td><td className="py-2">74 cm (29")</td></tr>
                                <tr><td className="py-2 text-white">Braço</td><td className="py-2">45 cm (17.5")</td></tr>
                                <tr><td className="py-2 text-white">Panturrilha</td><td className="py-2">45 cm (17.5")</td></tr>
                                <tr><td className="py-2 text-white">Pescoço</td><td className="py-2">45 cm (17.5")</td></tr>
                                <tr><td className="py-2 text-white">Coxa</td><td className="py-2">66 cm (26")</td></tr>
                            </tbody>
                        </table>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 4: STEVE REEVES ─────────── */}
                <SourceSection icon={Dumbbell} title="4. Steve Reeves — Muscle-to-Bone Ratios (1995)">
                    <p>
                        Steve Reeves (1926–2000), considerado o físico mais simétrico de todos os tempos. Mr. America 1947, Mr. World 1948, Mr. Universe 1950, e ator de filmes de Hércules. Autor de "Building the Classic Physique: The Natural Way".
                    </p>
                    <p className="mt-2 text-sm italic border-l-2 border-amber-500/50 pl-3">
                        "Seu pescoço, braços e panturrilhas devem ter a mesma medida." — Steve Reeves
                    </p>
                    <p className="mt-4 text-sm">
                        Reeves acreditava que <strong className="text-white">Proporção {'>'} Tamanho</strong>, defendendo simetria bilateral perfeita e um físico que deveria parecer natural e atlético.
                    </p>

                    <h4 className="text-white text-sm font-bold mt-6 mb-3">Fórmulas Completas de Reeves</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse min-w-[500px]">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Região</th><th className="pb-3 pr-4 font-semibold">Grupo</th><th className="pb-3 pr-4 font-semibold">Base Óssea</th><th className="pb-3 font-semibold">Fórmula</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5">
                                <tr><td className="py-3 text-gray-500 text-xs uppercase">Superior</td><td className="py-3 text-white">Braço</td><td className="py-3">Pulso</td><td className="py-3 font-mono">× 2.52 (252%)</td></tr>
                                <tr><td className="py-3"></td><td className="py-3 text-white">Antebraço</td><td className="py-3">Pulso</td><td className="py-3 font-mono">× 1.88 (188%)</td></tr>
                                <tr><td className="py-3"></td><td className="py-3 text-white">Pescoço</td><td className="py-3">Cabeça</td><td className="py-3 font-mono">× 0.79 (79%)</td></tr>
                                <tr><td className="py-3"></td><td className="py-3 text-white">Peitoral</td><td className="py-3">Quadril</td><td className="py-3 font-mono">× 1.48 (148%)</td></tr>
                                <tr><td className="py-3 text-gray-500 text-xs uppercase">Inferior</td><td className="py-3 text-white">Panturrilha</td><td className="py-3">Tornozelo</td><td className="py-3 font-mono">× 1.92 (192%)</td></tr>
                                <tr><td className="py-3"></td><td className="py-3 text-white">Coxa</td><td className="py-3">Joelho</td><td className="py-3 font-mono">× 1.75 (175%)</td></tr>
                                <tr><td className="py-3 text-gray-500 text-xs uppercase">Tronco</td><td className="py-3 text-white">Cintura</td><td className="py-3">Quadril</td><td className="py-3 font-mono">× 0.86 (86%)</td></tr>
                                <tr><td className="py-3"></td><td className="py-3 text-white">Ombros</td><td className="py-3">Cintura</td><td className="py-3 font-mono text-amber-400">× 1.618 (φ)</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h4 className="text-white text-sm font-bold mt-6 mb-3">Medidas de Referência de Steve Reeves</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Medida</th><th className="pb-3 pr-4 font-semibold">Valor</th><th className="pb-3 font-semibold">Observação</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5">
                                <tr><td className="py-2 text-white">Altura</td><td className="py-2">185 cm (6'1")</td><td className="py-2">—</td></tr>
                                <tr><td className="py-2 text-white">Peso</td><td className="py-2">97 kg (215 lbs)</td><td className="py-2">—</td></tr>
                                <tr><td className="py-2 text-white">Peitoral</td><td className="py-2">132 cm (52")</td><td className="py-2">—</td></tr>
                                <tr><td className="py-2 text-white">Cintura</td><td className="py-2">74 cm (29")</td><td className="py-2">—</td></tr>
                                <tr><td className="py-2 text-white">Braço</td><td className="py-2">47 cm (18.5")</td><td className="py-2">= Pescoço = Panturrilha</td></tr>
                                <tr><td className="py-2 text-white">Pulso</td><td className="py-2">18.4 cm (7.25")</td><td className="py-2">Base óssea</td></tr>
                                <tr><td className="py-2 text-white">Tornozelo</td><td className="py-2">24.5 cm (9.65")</td><td className="py-2">Base óssea</td></tr>
                            </tbody>
                        </table>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 5: JOHN McCALLUM ─────────── */}
                <SourceSection icon={FileText} title="5. John McCallum — Wrist-Based Formula (1965)">
                    <p>
                        John McCallum foi colunista de destaque da revista "Strength & Health" por mais de uma década com a coluna "Keys to Progress". A ideia central é que o <strong className="text-white">tamanho do pulso</strong> reflete a estrutura óssea geral e pode ser usado como base para calcular proporções musculares ideais.
                    </p>
                    <p className="text-sm mt-2">
                        <strong className="text-white">Livro:</strong> "The Complete Keys to Progress" (1993). Também publicado em "Brawn" e "Super Squats" de Stuart McRobert.
                    </p>

                    <h4 className="text-white text-sm font-bold mt-6 mb-3">Fórmulas de McCallum (% do Peitoral)</h4>
                    <p className="text-sm mb-4">
                        <strong className="text-white">Passo 1:</strong> Calcular o peitoral = Pulso × 6.5. <strong className="text-white">Passo 2:</strong> Calcular as demais medidas como percentual do peitoral.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <FormulaBox label="Peitoral (base)" formula="Pulso × 6.5" highlight />
                        <FormulaBox label="Cintura" formula="Peitoral × 70%" />
                        <FormulaBox label="Quadril" formula="Peitoral × 85%" />
                        <FormulaBox label="Coxa" formula="Peitoral × 53%" />
                        <FormulaBox label="Pescoço" formula="Peitoral × 37%" />
                        <FormulaBox label="Braço" formula="Peitoral × 36%" />
                        <FormulaBox label="Panturrilha" formula="Peitoral × 34%" />
                        <FormulaBox label="Antebraço" formula="Peitoral × 29%" />
                    </div>

                    <div className="bg-[#111] border border-white/5 rounded-xl p-5 mt-6">
                        <h4 className="text-amber-500 text-sm font-bold mb-3">Exemplo Prático — Pulso = 17.5 cm</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="pb-2 pr-4 font-semibold">Grupo</th><th className="pb-2 pr-4 font-semibold">Cálculo</th><th className="pb-2 font-semibold">Resultado</th>
                                </tr></thead>
                                <tbody className="divide-y divide-white/5 text-gray-300">
                                    <tr><td className="py-2 text-white">Peitoral</td><td className="py-2">17.5 × 6.5</td><td className="py-2 font-mono text-amber-400">113.75 cm</td></tr>
                                    <tr><td className="py-2">Cintura</td><td className="py-2">113.75 × 0.70</td><td className="py-2 font-mono">79.6 cm</td></tr>
                                    <tr><td className="py-2">Quadril</td><td className="py-2">113.75 × 0.85</td><td className="py-2 font-mono">96.7 cm</td></tr>
                                    <tr><td className="py-2">Coxa</td><td className="py-2">113.75 × 0.53</td><td className="py-2 font-mono">60.3 cm</td></tr>
                                    <tr><td className="py-2">Braço</td><td className="py-2">113.75 × 0.36</td><td className="py-2 font-mono">41.0 cm</td></tr>
                                    <tr><td className="py-2">Panturrilha</td><td className="py-2">113.75 × 0.34</td><td className="py-2 font-mono">38.7 cm</td></tr>
                                    <tr><td className="py-2">Antebraço</td><td className="py-2">113.75 × 0.29</td><td className="py-2 font-mono">33.0 cm</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 6: CASEY BUTT ─────────── */}
                <SourceSection icon={BarChart3} title="6. Casey Butt, Ph.D. — Modelo Científico (2009)">
                    <p>
                        Dr. Casey Butt pesquisou aproximadamente 300 bodybuilders naturais campeões (1947–2010). Diferente de Sandow, Reeves e McCallum (que basearam suas fórmulas em observação), Butt analisou dados estatísticos reais, incluiu <strong className="text-white">duas variáveis simultâneas para estrutura óssea</strong> (pulso e tornozelo), separou potencial de parte superior e inferior, e criou categorias Hardgainer vs Easygainer.
                    </p>
                    <p className="text-sm mt-2">
                        <strong className="text-white">Livro:</strong> "Your Muscular Potential" (4ª edição, 2009).
                    </p>

                    <h4 className="text-white text-sm font-bold mt-6 mb-3">Fórmula de Massa Magra Máxima (LBM)</h4>
                    <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                        <p className="font-mono text-white text-sm leading-relaxed">
                            M = H^1.5 × (√W / 22.667 + √A / 17.01) × (F / 224 + 1)
                        </p>
                        <div className="mt-4 text-sm space-y-1">
                            <p><strong className="text-white">M</strong> = Massa Magra Máxima (kg)</p>
                            <p><strong className="text-white">H</strong> = Altura (m)</p>
                            <p><strong className="text-white">W</strong> = Circunferência do Pulso (cm)</p>
                            <p><strong className="text-white">A</strong> = Circunferência do Tornozelo (cm)</p>
                            <p><strong className="text-white">F</strong> = Percentual de Gordura (%) — usar 10%</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-4 italic">Nota: potencial "realista" = 95% do valor calculado.</p>
                    </div>

                    <h4 className="text-white text-sm font-bold mt-6 mb-3">Classificação Hardgainer vs Easygainer</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Parte Superior (Altura / Pulso)</h5>
                            <ul className="space-y-2 text-sm">
                                <li className="flex justify-between"><span className="text-gray-400">{'<'} 9.5</span><span className="text-emerald-400 font-semibold">Easygainer</span></li>
                                <li className="flex justify-between"><span className="text-gray-400">9.5 – 10.5</span><span className="text-yellow-400 font-semibold">Médio</span></li>
                                <li className="flex justify-between"><span className="text-gray-400">{'>'} 10.5</span><span className="text-red-400 font-semibold">Hardgainer</span></li>
                            </ul>
                        </div>
                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Parte Inferior (Altura / Tornozelo)</h5>
                            <ul className="space-y-2 text-sm">
                                <li className="flex justify-between"><span className="text-gray-400">{'<'} 7.0</span><span className="text-emerald-400 font-semibold">Easygainer</span></li>
                                <li className="flex justify-between"><span className="text-gray-400">7.0 – 8.0</span><span className="text-yellow-400 font-semibold">Médio</span></li>
                                <li className="flex justify-between"><span className="text-gray-400">{'>'} 8.0</span><span className="text-red-400 font-semibold">Hardgainer</span></li>
                            </ul>
                        </div>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 7: OUTRAS REFERÊNCIAS ─────────── */}
                <SourceSection icon={Users} title="7. Outras Referências Científicas">
                    <div className="space-y-6">
                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h4 className="text-white text-sm font-bold mb-2">Martin Berkhan — LeanGains</h4>
                            <p className="text-sm mb-2">Fórmula simplificada para peso corporal máximo em competição (4–5% BF):</p>
                            <p className="font-mono text-white">Peso máximo (kg) = Altura (cm) – 100</p>
                            <p className="text-xs text-gray-500 mt-2">Exemplo: Altura 180 cm → Peso máximo natural em competição ≈ 80 kg</p>
                        </div>

                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h4 className="text-white text-sm font-bold mb-2">Fat-Free Mass Index (FFMI)</h4>
                            <p className="text-sm mb-2">Índice normalizado que relaciona massa magra e altura:</p>
                            <p className="font-mono text-white mb-4">FFMI = (Massa Magra em kg) / (Altura em m)²</p>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between"><span className="text-gray-400">{'<'} 18</span><span>Abaixo da média</span></div>
                                <div className="flex justify-between"><span className="text-gray-400">18 – 20</span><span>Média (homem não treinado)</span></div>
                                <div className="flex justify-between"><span className="text-gray-400">20 – 22</span><span>Acima da média</span></div>
                                <div className="flex justify-between"><span className="text-gray-400">22 – 25</span><span className="text-emerald-400 font-semibold">Excelente (próximo do limite natural)</span></div>
                                <div className="flex justify-between"><span className="text-gray-400">{'>'} 25</span><span className="text-red-400 font-semibold">Suspeito de uso de esteroides</span></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-4">FFMI Normalizado = FFMI + (6.1 × (1.8 – Altura))</p>
                        </div>

                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h4 className="text-white text-sm font-bold mb-2">Estudo Kouri et al. (1995)</h4>
                            <p className="text-sm">Estudo comparando FFMI de usuários e não usuários de esteroides concluiu que o <strong className="text-white">limite natural observado é FFMI ≈ 25</strong>. Atletas naturais de elite ficam entre 22–25, enquanto usuários de esteroides frequentemente ultrapassam 25.</p>
                        </div>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 8: TABELA CONSOLIDADA ─────────── */}
                <SourceSection icon={Activity} title="8. Tabela Consolidada de Fórmulas">
                    <p>Comparação das fórmulas entre os três métodos clássicos para cada grupo muscular:</p>
                    <div className="overflow-x-auto mt-4">
                        <table className="w-full text-sm text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="pb-3 pr-4 font-semibold">Grupo</th>
                                    <th className="pb-3 pr-4 font-semibold">Sandow</th>
                                    <th className="pb-3 pr-4 font-semibold">Reeves</th>
                                    <th className="pb-3 font-semibold">McCallum</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-mono text-xs">
                                <tr><td className="py-3 text-white font-sans text-sm">Braço</td><td className="py-3">Pulso × 2.5</td><td className="py-3">Pulso × 2.52</td><td className="py-3">Peitoral × 0.36</td></tr>
                                <tr><td className="py-3 text-white font-sans text-sm">Antebraço</td><td className="py-3 text-gray-600">—</td><td className="py-3">Pulso × 1.88</td><td className="py-3">Peitoral × 0.29</td></tr>
                                <tr><td className="py-3 text-white font-sans text-sm">Pescoço</td><td className="py-3">= Braço</td><td className="py-3">Cabeça × 0.79</td><td className="py-3">Peitoral × 0.37</td></tr>
                                <tr><td className="py-3 text-white font-sans text-sm">Panturrilha</td><td className="py-3">= Braço</td><td className="py-3">Tornz. × 1.92</td><td className="py-3">Peitoral × 0.34</td></tr>
                                <tr><td className="py-3 text-white font-sans text-sm">Coxa</td><td className="py-3 text-gray-600">—</td><td className="py-3">Joelho × 1.75</td><td className="py-3">Peitoral × 0.53</td></tr>
                                <tr><td className="py-3 text-white font-sans text-sm">Peitoral</td><td className="py-3">Pulso × 6.5</td><td className="py-3">Quadril × 1.48</td><td className="py-3">Pulso × 6.5</td></tr>
                                <tr><td className="py-3 text-white font-sans text-sm">Cintura</td><td className="py-3 text-gray-600">—</td><td className="py-3">Quadril × 0.86</td><td className="py-3">Peitoral × 0.70</td></tr>
                                <tr><td className="py-3 text-white font-sans text-sm">Ombros</td><td className="py-3 text-amber-400">Cint. × 1.618</td><td className="py-3 text-amber-400">Cint. × 1.618</td><td className="py-3 text-gray-600">—</td></tr>
                            </tbody>
                        </table>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 9: FÓRMULAS DO VITRÚVIO ─────────── */}
                <SourceSection icon={ShieldCheck} title="9. Fórmulas Recomendadas para o VITRÚVIO">
                    <p>
                        Considerando todas as fontes, o VITRÚVIO utiliza as seguintes fórmulas como referência principal para calcular as proporções ideais de cada atleta:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                        <FormulaBox label="Shape-V (Principal)" formula="Cintura × 1.618" highlight />
                        <FormulaBox label="Braço" formula="Pulso × 2.5" />
                        <FormulaBox label="Panturrilha" formula="Tornozelo × 1.75" />
                        <FormulaBox label="Coxa" formula="Joelho × 1.75" />
                        <FormulaBox label="Peitoral / Costas" formula="Cintura × 1.48" />
                        <FormulaBox label="Antebraço" formula="Pulso × 1.88" />
                        <FormulaBox label="Pescoço" formula="= Braço" />
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 10: LIMITAÇÕES ─────────── */}
                <SourceSection icon={AlertTriangle} title="10. Limitações e Considerações">
                    <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl mb-4">
                        <p className="text-sm text-red-400 font-bold mb-3">
                            Limitações das Fórmulas
                        </p>
                        <ul className="text-sm text-gray-300 space-y-2 list-disc pl-5">
                            <li><strong className="text-white">Base histórica:</strong> Fórmulas de Sandow/Reeves baseadas em poucos indivíduos</li>
                            <li><strong className="text-white">Sem validação rigorosa:</strong> McCallum não possui método científico formal</li>
                            <li><strong className="text-white">Genética individual:</strong> Comprimento de músculos e inserções variam entre indivíduos</li>
                            <li><strong className="text-white">Biotipos diferentes:</strong> Ectomorfo, mesomorfo, endomorfo respondem diferentemnte</li>
                            <li><strong className="text-white">Época diferente:</strong> Padrões estéticos mudam com o tempo</li>
                        </ul>
                    </div>

                    <div className="p-5 bg-primary/10 border border-primary/20 rounded-2xl">
                        <p className="text-sm text-primary font-bold mb-3">
                            Diretriz de Aplicação da IA
                        </p>
                        <div className="text-sm text-gray-300 space-y-2">
                            <p>O VITRÚVIO <strong className="text-white">DEVE</strong>:</p>
                            <ul className="list-none space-y-2 mb-4">
                                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✅</span> Usar fórmulas como REFERÊNCIA, não como verdade absoluta</li>
                                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✅</span> Considerar o biotipo e estrutura óssea do atleta</li>
                                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✅</span> Ajustar expectativas baseado em anos de treino</li>
                                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✅</span> Focar em PROGRESSO PESSOAL, não em números absolutos</li>
                                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✅</span> Comunicar que são metas inspiracionais</li>
                            </ul>
                            <p>O VITRÚVIO <strong className="text-white">NÃO DEVE</strong>:</p>
                            <ul className="list-none space-y-2">
                                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">❌</span> Prometer que atleta atingirá medidas exatas</li>
                                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">❌</span> Ignorar limitações genéticas</li>
                                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">❌</span> Criar expectativas irreais</li>
                                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">❌</span> Comparar diretamente com bodybuilders históricos</li>
                            </ul>
                        </div>
                    </div>
                </SourceSection>

                {/* ─────────── REFERÊNCIAS ─────────── */}
                <div className="mt-16 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Referências Bibliográficas</h3>

                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-4 mb-2">Livros</h4>
                    <ol className="text-sm text-gray-400 space-y-1 list-decimal pl-5">
                        <li>Sandow, E. (1897). "Strength and How to Obtain It"</li>
                        <li>Sandow, E. (1894). "Sandow's System of Physical Training"</li>
                        <li>Sandow, E. (1907). "The Construction and Reconstruction of the Human Body"</li>
                        <li>Reeves, S. (1995). "Building the Classic Physique: The Natural Way"</li>
                        <li>McCallum, J. (1993). "The Complete Keys to Progress"</li>
                        <li>McRobert, S. (1991). "Brawn"</li>
                        <li>McRobert, S. (1998). "Beyond Brawn"</li>
                        <li>Butt, C. (2009). "Your Muscular Potential" (4ª edição)</li>
                    </ol>

                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-6 mb-2">Estudos Científicos</h4>
                    <ol className="text-sm text-gray-400 space-y-1 list-decimal pl-5">
                        <li>Kouri, E.M. et al. (1995). "Fat-free mass index in users and nonusers of anabolic-androgenic steroids." Clinical Journal of Sport Medicine.</li>
                        <li>Schoenfeld, B.J. et al. (2017). "Dose-response relationship between weekly resistance training volume and increases in muscle mass." Journal of Sports Sciences.</li>
                    </ol>
                </div>

            </div>
        </div>
    );
};
