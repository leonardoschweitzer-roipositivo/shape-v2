import React from 'react';
import { ArrowLeft, BookOpen, Flame, Zap, BarChart3, Activity, ShieldCheck, AlertTriangle, BookMarked, Target, RefreshCw, Briefcase } from 'lucide-react';

interface SourceSectionProps {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
}

const SourceSection: React.FC<SourceSectionProps> = ({ icon: Icon, title, children }) => (
    <section className="mb-12 animate-fade-in-up">
        <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shadow-lg shadow-orange-500/5">
                <Icon size={24} className="text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight uppercase">{title}</h2>
        </div>
        <div className="pl-0 sm:pl-16 space-y-4 text-gray-400 leading-relaxed font-light">
            {children}
        </div>
    </section>
);

const FormulaBox: React.FC<{ label: string; children: React.ReactNode; highlight?: boolean }> = ({ label, children, highlight }) => (
    <div className={`px-4 py-3 rounded-xl border ${highlight ? 'bg-orange-500/10 border-orange-500/30' : 'bg-[#111] border-white/5'}`}>
        <span className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${highlight ? 'text-orange-400' : 'text-gray-500'}`}>{label}</span>
        <div className="font-mono font-semibold text-sm text-white">{children}</div>
    </div>
);

const ComponentBadge: React.FC<{ label: string; pct: string; color: string; desc: string }> = ({ label, pct, color, desc }) => (
    <div className={`flex-1 rounded-xl border border-white/5 bg-[#111] p-4`}>
        <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${color}`}>{label}</div>
        <div className="text-2xl font-extrabold text-white mb-1">{pct}</div>
        <div className="text-xs text-gray-500">{desc}</div>
    </div>
);

interface MetabolismSourceViewProps {
    onBack: () => void;
}

export const MetabolismSourceView: React.FC<MetabolismSourceViewProps> = ({ onBack }) => {
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
                    <div className="flex items-center gap-2 text-[10px] font-bold text-orange-500 uppercase tracking-widest px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 w-fit">
                        <BookOpen size={12} />
                        <span>Diagnóstico / Plano de Dieta / V1.0</span>
                    </div>
                </div>

                {/* Title */}
                <div className="mb-16 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter uppercase mb-6">
                        Metabolismo e <span className="text-orange-500">Gasto Energético</span>
                    </h1>
                    <p className="text-gray-500 font-light max-w-3xl text-lg mb-6">
                        Base científica do VITRÚVIO para calcular necessidades calóricas, definir déficit ou superávit adequado, ajustar planos de dieta e compreender variações individuais de cada atleta.
                    </p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-gray-600 font-mono uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                            Vigente: Fev 2026
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={14} className="text-gray-500" />
                            Módulo Diagnóstico + Dieta
                        </div>
                    </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-orange-500/20 via-white/5 to-transparent mb-16" />

                {/* ─────────── TDEE OVERVIEW ─────────── */}
                <SourceSection icon={Flame} title="1. Componentes do Gasto Energético (TDEE)">
                    <p>
                        O <strong className="text-white">TDEE (Total Daily Energy Expenditure)</strong> é a soma de todos os gastos calóricos diários de um indivíduo. Ele é composto por quatro componentes distintos:
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <ComponentBadge label="TMB/BMR" pct="60–70%" color="text-orange-400" desc="Taxa Metabólica Basal" />
                        <ComponentBadge label="TEF" pct="8–15%" color="text-yellow-400" desc="Efeito Térmico dos Alimentos" />
                        <ComponentBadge label="NEAT" pct="15–30%" color="text-emerald-400" desc="Atividade Não-Exercício" />
                        <ComponentBadge label="EAT" pct="0–10%" color="text-blue-400" desc="Exercício Estruturado" />
                    </div>

                    <div className="bg-[#111] border border-white/5 rounded-xl p-5 mt-4">
                        <p className="font-mono text-white font-semibold">TDEE = TMB + TEF + NEAT + EAT</p>
                        <p className="text-xs text-gray-500 mt-2">Ou simplificado: TDEE = TMB × Fator de Atividade</p>
                    </div>

                    <h4 className="text-white text-sm font-bold mt-6 mb-3">Fontes Científicas Principais</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse min-w-[480px]">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Fonte</th><th className="pb-3 pr-4 font-semibold">Ano</th><th className="pb-3 font-semibold">Contribuição</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                <tr><td className="py-2.5 text-white">Harris & Benedict</td><td className="py-2.5">1918</td><td className="py-2.5">Primeira equação de TMB</td></tr>
                                <tr><td className="py-2.5 text-white">Mifflin-St Jeor</td><td className="py-2.5">1990</td><td className="py-2.5">Equação mais precisa para população geral</td></tr>
                                <tr><td className="py-2.5 text-white">Katch-McArdle</td><td className="py-2.5">1996</td><td className="py-2.5">Equação baseada em massa magra (atletas)</td></tr>
                                <tr><td className="py-2.5 text-white">Cunningham</td><td className="py-2.5">1980/1991</td><td className="py-2.5">Equação para atletas</td></tr>
                                <tr><td className="py-2.5 text-white">Oxford / Henry</td><td className="py-2.5">2005</td><td className="py-2.5">Maior amostra: 10.552 indivíduos</td></tr>
                                <tr><td className="py-2.5 text-white">Levine JA</td><td className="py-2.5">2002–2004</td><td className="py-2.5">Pesquisa sobre NEAT e adaptação</td></tr>
                            </tbody>
                        </table>
                    </div>
                </SourceSection>

                {/* ─────────── TMB ─────────── */}
                <SourceSection icon={Activity} title="2. Taxa Metabólica Basal (TMB)">
                    <p>
                        A <strong className="text-white">TMB</strong> é a energia mínima necessária para manter funções vitais em repouso absoluto, em ambiente termoneutro, após 12h de jejum. Representa <strong className="text-white">60–70%</strong> do gasto energético total em indivíduos sedentários.
                    </p>

                    <div className="bg-[#111] border border-white/5 rounded-xl p-5 mt-2">
                        <h4 className="text-orange-500 text-sm font-bold mb-3">O que a TMB inclui</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
                            <li>Funcionamento do cérebro (~20%)</li>
                            <li>Coração, pulmões e circulação</li>
                            <li>Função hepática e renal</li>
                            <li>Manutenção da temperatura corporal</li>
                            <li>Síntese proteica básica e funções celulares</li>
                        </ul>
                    </div>

                    <h4 className="text-white text-sm font-bold mt-6 mb-3">Fatores que Influenciam a TMB</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Fator</th><th className="pb-3 font-semibold">Impacto</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5">
                                <tr><td className="py-2.5 text-white">Massa Magra</td><td className="py-2.5">Principal determinante (~80% da variação)</td></tr>
                                <tr><td className="py-2.5 text-white">Idade</td><td className="py-2.5">↓ ~2% por década após 20 anos</td></tr>
                                <tr><td className="py-2.5 text-white">Sexo</td><td className="py-2.5">Homens ~5–10% maior que mulheres</td></tr>
                                <tr><td className="py-2.5 text-white">Genética</td><td className="py-2.5">Variação de ±200–300 kcal entre indivíduos</td></tr>
                                <tr><td className="py-2.5 text-white">Hormônios</td><td className="py-2.5">Tireoide, testosterona, cortisol</td></tr>
                                <tr><td className="py-2.5 text-white">Déficit calórico</td><td className="py-2.5">↓ Adaptação metabólica progressiva</td></tr>
                            </tbody>
                        </table>
                    </div>
                </SourceSection>

                {/* ─────────── EQUAÇÕES TMB ─────────── */}
                <SourceSection icon={BarChart3} title="3. Equações de Estimativa da TMB">
                    <h4 className="text-white text-sm font-bold mb-3">Comparação de Precisão</h4>
                    <div className="overflow-x-auto mb-6">
                        <table className="w-full text-sm text-left border-collapse min-w-[520px]">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Equação</th><th className="pb-3 pr-4 font-semibold">Precisão (±10%)</th><th className="pb-3 font-semibold">Melhor Para</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5">
                                <tr><td className="py-2.5 text-white font-semibold">Mifflin-St Jeor</td><td className="py-2.5 text-emerald-400">82% não-obesos</td><td className="py-2.5">População geral</td></tr>
                                <tr><td className="py-2.5 text-white font-semibold">Katch-McArdle</td><td className="py-2.5 text-emerald-400">~80% atletas</td><td className="py-2.5">Atletas com BF% medido</td></tr>
                                <tr><td className="py-2.5 text-white font-semibold">Cunningham</td><td className="py-2.5 text-emerald-400">~80% atletas</td><td className="py-2.5">Atletas (requer BF%)</td></tr>
                                <tr><td className="py-2.5 text-white">Harris-Benedict</td><td className="py-2.5 text-yellow-400">69% não-obesos</td><td className="py-2.5">Uso histórico (tende a +5%)</td></tr>
                                <tr><td className="py-2.5 text-white">Oxford / Henry</td><td className="py-2.5 text-blue-400">Menor viés</td><td className="py-2.5">População diversa (maior amostra)</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl text-sm text-orange-300 mb-6">
                        <strong className="text-orange-400">Recomendação científica:</strong> Mifflin-St Jeor para população geral, Katch-McArdle para atletas com BF% conhecido.
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h4 className="text-orange-500 text-sm font-bold mb-3">Mifflin-St Jeor (1990) ★</h4>
                            <p className="font-mono text-xs text-gray-300 mb-2">Homens:</p>
                            <p className="font-mono text-white text-xs mb-3">TMB = (10×P) + (6.25×A) − (5×I) + 5</p>
                            <p className="font-mono text-xs text-gray-300 mb-2">Mulheres:</p>
                            <p className="font-mono text-white text-xs">TMB = (10×P) + (6.25×A) − (5×I) − 161</p>
                            <p className="text-[10px] text-gray-500 mt-3">P = peso (kg), A = altura (cm), I = idade (anos)</p>
                        </div>
                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h4 className="text-orange-500 text-sm font-bold mb-3">Katch-McArdle (1996) ★</h4>
                            <p className="font-mono text-white text-xs mb-2">TMB = 370 + (21.6 × MM)</p>
                            <p className="font-mono text-xs text-gray-300 mb-3">MM = Peso × (1 − BF% / 100)</p>
                            <p className="text-xs text-gray-400">Vantagem: usa massa magra diretamente, mais preciso para atletas.</p>
                            <p className="text-[10px] text-gray-500 mt-2">MM = Massa Magra (kg)</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h4 className="text-white text-sm font-bold mb-3">Harris-Benedict (1918 / Rev. 1984)</h4>
                            <p className="font-mono text-xs text-gray-300 mb-1">Homens (revisada):</p>
                            <p className="font-mono text-white text-xs mb-3">88.362 + (13.397×P) + (4.799×A) − (5.677×I)</p>
                            <p className="font-mono text-xs text-gray-300 mb-1">Mulheres (revisada):</p>
                            <p className="font-mono text-white text-xs">447.593 + (9.247×P) + (3.098×A) − (4.330×I)</p>
                        </div>
                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h4 className="text-white text-sm font-bold mb-3">Oxford / Henry (2005)</h4>
                            <p className="text-xs text-gray-400 mb-2">Homens 18–30 anos (exemplo):</p>
                            <p className="font-mono text-white text-xs mb-3">TMB = (14.4×P) + (313×Alt_m) + 113</p>
                            <p className="text-xs text-gray-400 mb-2">Mulheres 18–30 anos (exemplo):</p>
                            <p className="font-mono text-white text-xs">TMB = (10.4×P) + (615×Alt_m) − 282</p>
                            <p className="text-[10px] text-gray-500 mt-2">Alt_m = altura em metros</p>
                        </div>
                    </div>
                </SourceSection>

                {/* ─────────── TEF ─────────── */}
                <SourceSection icon={Zap} title="4. Efeito Térmico dos Alimentos (TEF)">
                    <p>
                        O <strong className="text-white">TEF</strong> é o aumento do gasto energético após uma refeição, associado à digestão, absorção e armazenamento dos nutrientes. Representa <strong className="text-white">8–15% do TDEE</strong>.
                    </p>

                    <div className="overflow-x-auto mt-4">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Macronutriente</th><th className="pb-3 pr-4 font-semibold">TEF</th><th className="pb-3 font-semibold">Motivo</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5">
                                <tr><td className="py-2.5 text-white">Proteína</td><td className="py-2.5 text-emerald-400 font-semibold">20–35%</td><td className="py-2.5">Maior custo de digestão e síntese</td></tr>
                                <tr><td className="py-2.5 text-white">Carboidrato</td><td className="py-2.5 text-yellow-400 font-semibold">5–15%</td><td className="py-2.5">Custo moderado</td></tr>
                                <tr><td className="py-2.5 text-white">Gordura</td><td className="py-2.5 text-gray-400 font-semibold">0–5%</td><td className="py-2.5">Menor custo (armazenamento eficiente)</td></tr>
                                <tr><td className="py-2.5 text-white">Álcool</td><td className="py-2.5 text-orange-400 font-semibold">10–30%</td><td className="py-2.5">Metabolismo prioritário no fígado</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FormulaBox label="TEF Simplificado (dieta mista)">
                            TEF = Calorias × 0.10
                        </FormulaBox>
                        <FormulaBox label="TEF Detalhado por Macros">
                            <span className="text-[11px] leading-relaxed block">
                                (Prot_kcal × 0.25) + (Carbs_kcal × 0.08) + (Fat_kcal × 0.02)
                            </span>
                        </FormulaBox>
                    </div>
                </SourceSection>

                {/* ─────────── NEAT ─────────── */}
                <SourceSection icon={Briefcase} title="5. NEAT — Non-Exercise Activity Thermogenesis">
                    <p>
                        O <strong className="text-white">NEAT</strong> é a energia gasta em todas as atividades que não são dormir, comer ou exercício estruturado. Inclui andar, ficar em pé, digitar, gestos, manter postura e o <em>fidgeting</em> (movimentos involuntários). É o componente mais variável do TDEE.
                    </p>

                    <div className="p-4 bg-[#111] border border-white/5 rounded-xl mt-4">
                        <h4 className="text-orange-500 text-sm font-bold mb-3">Variação do NEAT entre Indivíduos</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-400">Pessoa sedentária (escritório)</span><span className="text-white font-mono">200–400 kcal/dia</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Pessoa moderadamente ativa</span><span className="text-white font-mono">400–800 kcal/dia</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Trabalhador ativo</span><span className="text-white font-mono">800–1.500 kcal/dia</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Trabalhador braçal / agricultor</span><span className="text-white font-mono">1.500–2.000+ kcal/dia</span></div>
                        </div>
                        <p className="text-xs text-orange-400 font-semibold mt-3">Diferença máxima: até 2.000 kcal/dia entre indivíduos do mesmo peso!</p>
                    </div>

                    <h4 className="text-white text-sm font-bold mt-6 mb-3">NEAT por Ocupação Profissional</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse min-w-[480px]">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Ocupação</th><th className="pb-3 pr-4 font-semibold">PAL*</th><th className="pb-3 font-semibold">NEAT Est.</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5">
                                <tr><td className="py-2.5 text-white">Escritório (sentado)</td><td className="py-2.5">1.4–1.5</td><td className="py-2.5 font-mono">200–400 kcal</td></tr>
                                <tr><td className="py-2.5 text-white">De pé (vendedor, professor)</td><td className="py-2.5">1.6–1.7</td><td className="py-2.5 font-mono">400–700 kcal</td></tr>
                                <tr><td className="py-2.5 text-white">Ativo (garçom, enfermeiro)</td><td className="py-2.5">1.8–1.9</td><td className="py-2.5 font-mono">700–1.000 kcal</td></tr>
                                <tr><td className="py-2.5 text-white">Pesado (construção, agricultura)</td><td className="py-2.5">2.0–2.4</td><td className="py-2.5 font-mono">1.000–2.000 kcal</td></tr>
                            </tbody>
                        </table>
                        <p className="text-[10px] text-gray-500 mt-2">*PAL = Physical Activity Level = TDEE / TMB</p>
                    </div>

                    <h4 className="text-white text-sm font-bold mt-6 mb-3">Estratégias para Aumentar NEAT (Trabalho Sedentário)</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Estratégia</th><th className="pb-3 font-semibold">Impacto Estimado</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5">
                                <tr><td className="py-2 text-white">10.000 passos/dia</td><td className="py-2 font-mono">+300–400 kcal</td></tr>
                                <tr><td className="py-2 text-white">Mesa de pé (standing desk)</td><td className="py-2 font-mono">+50–100 kcal/h</td></tr>
                                <tr><td className="py-2 text-white">Reuniões caminhando</td><td className="py-2 font-mono">+100–200 kcal</td></tr>
                                <tr><td className="py-2 text-white">Pausas ativas a cada 30 min</td><td className="py-2 font-mono">+100–200 kcal/dia</td></tr>
                            </tbody>
                        </table>
                    </div>
                </SourceSection>

                {/* ─────────── EAT ─────────── */}
                <SourceSection icon={Target} title="6. EAT — Exercise Activity Thermogenesis">
                    <p>
                        O <strong className="text-white">EAT</strong> é a energia gasta no exercício físico estruturado (musculação, cardio, esportes). Representa apenas <strong className="text-white">0–10%</strong> do TDEE na maioria das pessoas. Em atletas, pode chegar a <strong className="text-white">15–30%</strong>.
                    </p>

                    <div className="bg-[#111] border border-white/5 rounded-xl p-5 mt-4">
                        <h4 className="text-orange-500 text-sm font-bold mb-3">Gasto por MET (Metabolic Equivalent of Task)</h4>
                        <p className="text-xs text-gray-400 mb-3">1 MET = ~1 kcal/kg/hora — Cálculo: <span className="font-mono text-white">Kcal = MET × Peso(kg) × Tempo(h)</span></p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse min-w-[400px]">
                                <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="pb-2 pr-4 font-semibold">Atividade</th><th className="pb-2 pr-4 font-semibold">MET</th><th className="pb-2 font-semibold">Kcal/h (80kg)</th>
                                </tr></thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr><td className="py-2 text-white">Musculação (moderada)</td><td className="py-2">3.5–6.0</td><td className="py-2 font-mono">280–480</td></tr>
                                    <tr><td className="py-2 text-white">Musculação (intensa)</td><td className="py-2">6.0–8.0</td><td className="py-2 font-mono">480–640</td></tr>
                                    <tr><td className="py-2 text-white">Corrida (8 km/h)</td><td className="py-2">8.0</td><td className="py-2 font-mono">640</td></tr>
                                    <tr><td className="py-2 text-white">HIIT</td><td className="py-2">8.0–12.0</td><td className="py-2 font-mono">640–960</td></tr>
                                    <tr><td className="py-2 text-white">Natação</td><td className="py-2">6.0–10.0</td><td className="py-2 font-mono">480–800</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-4 bg-[#111] border border-white/5 rounded-xl p-5">
                        <h4 className="text-white text-sm font-bold mb-2">Estimativa para Musculação</h4>
                        <p className="text-sm">Gasto aproximado: <span className="font-mono text-orange-400 font-semibold">5–8 kcal/minuto</span></p>
                        <p className="text-sm mt-1">Treino de 60 min ≈ <span className="font-mono text-white font-semibold">300–500 kcal</span></p>
                    </div>
                </SourceSection>

                {/* ─────────── TDEE + FATORES + EXEMPLO ─────────── */}
                <SourceSection icon={BarChart3} title="7. Cálculo do TDEE — Fatores de Atividade">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse min-w-[420px]">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Perfil</th><th className="pb-3 pr-4 font-semibold">Fator</th><th className="pb-3 font-semibold">Exemplo</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5">
                                <tr><td className="py-2.5 text-white">Sedentário + sem treino</td><td className="py-2.5 font-mono font-bold">1.2</td><td className="py-2.5 text-gray-400">Escritório, não treina</td></tr>
                                <tr><td className="py-2.5 text-white">Sedentário + treino 3x</td><td className="py-2.5 font-mono font-bold">1.4</td><td className="py-2.5 text-gray-400">Escritório + academia</td></tr>
                                <tr><td className="py-2.5 text-white">Sedentário + treino 5x</td><td className="py-2.5 font-mono font-bold">1.5</td><td className="py-2.5 text-gray-400">Escritório + treino intenso</td></tr>
                                <tr><td className="py-2.5 text-white">Ativo + treino 3x</td><td className="py-2.5 font-mono font-bold">1.6</td><td className="py-2.5 text-gray-400">Professor + academia</td></tr>
                                <tr><td className="py-2.5 text-white">Ativo + treino 5x</td><td className="py-2.5 font-mono font-bold">1.7</td><td className="py-2.5 text-gray-400">Enfermeiro + treino</td></tr>
                                <tr><td className="py-2.5 text-white">Muito ativo + treino</td><td className="py-2.5 font-mono font-bold">1.9</td><td className="py-2.5 text-gray-400">Construção + treino</td></tr>
                                <tr><td className="py-2.5 text-white">Atleta profissional</td><td className="py-2.5 font-mono font-bold">2.0–2.4</td><td className="py-2.5 text-gray-400">Treino 2× por dia</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-[#111] border border-orange-500/20 rounded-xl p-5 mt-6">
                        <h4 className="text-orange-500 text-sm font-bold mb-4">Exemplo Prático — Atleta Sedentário, Treino 5×/sem</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div><span className="text-gray-500">Peso</span><span className="block text-white font-semibold">82.5 kg</span></div>
                            <div><span className="text-gray-500">Altura</span><span className="block text-white font-semibold">182 cm</span></div>
                            <div><span className="text-gray-500">Idade</span><span className="block text-white font-semibold">32 anos</span></div>
                            <div><span className="text-gray-500">Gordura Corporal</span><span className="block text-white font-semibold">15.8%</span></div>
                        </div>
                        <div className="space-y-2 text-sm border-t border-white/5 pt-4">
                            <div className="flex justify-between"><span className="text-gray-400">MM = 82.5 × (1 − 0.158)</span><span className="text-white font-mono">= 69.5 kg</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">TMB (Katch-McArdle)</span><span className="text-white font-mono">= 1.871 kcal</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">TEF (~10%)</span><span className="text-white font-mono">≈ 258 kcal</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">NEAT (sedentário × 0.15)</span><span className="text-white font-mono">≈ 281 kcal</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">EAT (60min × 5 × 6 ÷ 7)</span><span className="text-white font-mono">≈ 257 kcal</span></div>
                            <div className="flex justify-between border-t border-white/10 pt-2 mt-2 font-bold">
                                <span className="text-orange-400">TDEE Total</span><span className="text-orange-400 font-mono text-lg">≈ 2.667 kcal/dia</span>
                            </div>
                        </div>
                    </div>
                </SourceSection>

                {/* ─────────── ADAPTAÇÃO METABÓLICA ─────────── */}
                <SourceSection icon={RefreshCw} title="8. Adaptação Metabólica">
                    <p>
                        A <strong className="text-white">adaptação metabólica</strong> (ou "adaptive thermogenesis") ocorre quando, em déficit calórico prolongado, o corpo reduz o gasto energético além do esperado pela perda de peso. É o principal motivo dos platôs de emagrecimento.
                    </p>

                    <h4 className="text-white text-sm font-bold mt-4 mb-3">Magnitude da Adaptação por Situação</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Situação</th><th className="pb-3 font-semibold">Adaptação Metabólica</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5">
                                <tr><td className="py-2 text-white">Déficit moderado (−500 kcal), curto prazo</td><td className="py-2 text-yellow-400 font-semibold">5–10%</td></tr>
                                <tr><td className="py-2 text-white">Déficit moderado prolongado (3+ meses)</td><td className="py-2 text-yellow-400 font-semibold">10–15%</td></tr>
                                <tr><td className="py-2 text-white">Déficit agressivo (−1.000 kcal)</td><td className="py-2 text-orange-400 font-semibold">15–20%</td></tr>
                                <tr><td className="py-2 text-white">Contest prep (bodybuilding)</td><td className="py-2 text-red-400 font-semibold">20–25%</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h4 className="text-white text-sm font-bold mt-6 mb-3">Como Minimizar a Adaptação</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { title: 'Déficit Moderado', desc: '−300 a −500 kcal/dia · perda de ~0.5% peso/semana' },
                            { title: 'Diet Breaks', desc: '1–2 sem em manutenção a cada 8–12 sem em déficit' },
                            { title: 'Refeeds', desc: '1–2 dias na manutenção (foco em carboidratos) a cada 1–2 sem' },
                            { title: 'Treino de Força', desc: 'Preserva massa muscular e mantém TMB mais elevada' },
                            { title: 'Proteína Alta', desc: '2.0–2.4 g/kg em déficit para preservar massa magra' },
                            { title: 'Aumentar NEAT', desc: 'Passos e atividades de baixa intensidade para compensar' },
                        ].map(item => (
                            <div key={item.title} className="bg-[#111] border border-white/5 rounded-xl p-4">
                                <h5 className="text-white text-xs font-bold mb-1">{item.title}</h5>
                                <p className="text-xs text-gray-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </SourceSection>

                {/* ─────────── LIMITAÇÕES ─────────── */}
                <SourceSection icon={AlertTriangle} title="9. Limitações e Ajustes">
                    <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl mb-4">
                        <p className="text-sm text-red-400 font-bold mb-3">Margem de Erro das Estimativas</p>
                        <div className="space-y-2 text-sm text-gray-300">
                            <div className="flex justify-between"><span>TMB (melhor equação)</span><span className="font-mono">±150–200 kcal</span></div>
                            <div className="flex justify-between"><span>TDEE (variação individual)</span><span className="font-mono">±300–400 kcal</span></div>
                        </div>
                        <p className="text-xs text-red-300 italic mt-3">Fórmulas são PONTO DE PARTIDA — ajustar baseado na resposta real do atleta após 2–3 semanas.</p>
                    </div>

                    <h4 className="text-white text-sm font-bold mt-4 mb-3">Quando Ajustar o TDEE</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Situação</th><th className="pb-3 font-semibold">Ação</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5">
                                <tr><td className="py-2 text-white">Peso caindo {'>'} 0.7 kg/sem</td><td className="py-2 text-emerald-400">↑ Aumentar calorias 100–150</td></tr>
                                <tr><td className="py-2 text-white">Peso estagnado 2+ semanas</td><td className="py-2 text-yellow-400">↓ Reduzir 100–150 ou aumentar NEAT</td></tr>
                                <tr><td className="py-2 text-white">Peso subindo (em cutting)</td><td className="py-2 text-orange-400">Revisar aderência → depois ↓ 150–200</td></tr>
                                <tr><td className="py-2 text-white">Energia muito baixa</td><td className="py-2 text-blue-400">↑ Calorias ou realizar diet break</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="p-5 bg-primary/10 border border-primary/20 rounded-2xl mt-6">
                        <p className="text-sm text-primary font-bold mb-2">Diretriz de Comunicação do VITRÚVIO</p>
                        <p className="text-sm text-gray-300 leading-relaxed italic">
                            "Estes são valores estimados com margem de ±300 kcal. Ajustaremos baseado nos seus resultados reais nas próximas semanas. Seu corpo é único — as fórmulas são o ponto de partida, sua resposta real é o que guia os ajustes."
                        </p>
                    </div>
                </SourceSection>

                {/* ─────────── REFERÊNCIAS ─────────── */}
                <div className="mt-16 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Referências Bibliográficas</h3>

                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-4 mb-2">Equações de TMB</h4>
                    <ol className="text-sm text-gray-400 space-y-1 list-decimal pl-5">
                        <li>Harris JA, Benedict FG (1918). "A Biometric Study of Human Basal Metabolism." PNAS.</li>
                        <li>Mifflin MD, St Jeor ST, et al. (1990). "A new predictive equation for resting energy expenditure." American Journal of Clinical Nutrition.</li>
                        <li>Roza AM, Shizgal HM (1984). "The Harris Benedict equation reevaluated." AJCN.</li>
                        <li>Cunningham JJ (1991). "A reanalysis of the factors influencing basal metabolic rate." Nutrition Reviews.</li>
                        <li>Henry CJ (2005). "Basal metabolic rate studies in humans." Public Health Nutrition.</li>
                    </ol>

                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-6 mb-2">Validação e Comparação</h4>
                    <ol start={6} className="text-sm text-gray-400 space-y-1 list-decimal pl-5">
                        <li>Frankenfield D, et al. (2005). "Comparison of predictive equations for resting metabolic rate." Journal of the American Dietetic Association.</li>
                        <li>Flack KD, et al. (2023). "Accuracy of Resting Metabolic Rate Prediction Equations in Athletes." Sports Medicine.</li>
                    </ol>

                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-6 mb-2">NEAT</h4>
                    <ol start={8} className="text-sm text-gray-400 space-y-1 list-decimal pl-5">
                        <li>Levine JA (2002). "Non-exercise activity thermogenesis (NEAT)." Best Practice & Research Clinical Endocrinology & Metabolism.</li>
                        <li>Levine JA, et al. (2005). "Nonexercise activity thermogenesis: environment and biology." American Journal of Physiology.</li>
                        <li>Chung N, et al. (2018). "Non-exercise activity thermogenesis: a component of total daily energy expenditure." Journal of Exercise Nutrition & Biochemistry.</li>
                    </ol>

                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-6 mb-2">Adaptação Metabólica</h4>
                    <ol start={11} className="text-sm text-gray-400 space-y-1 list-decimal pl-5">
                        <li>Rosenbaum M, Leibel RL (2010). "Adaptive thermogenesis in humans." International Journal of Obesity.</li>
                        <li>Trexler ET, et al. (2014). "Metabolic adaptation to weight loss: implications for the athlete." Journal of the ISSN.</li>
                    </ol>
                </div>

            </div>
        </div>
    );
};
