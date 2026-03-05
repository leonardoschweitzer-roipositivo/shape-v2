import React from 'react';
import {
    ArrowLeft, BookOpen, BarChart3, Layers, TrendingUp, Repeat2,
    Dumbbell, ShieldCheck, AlertTriangle, BookMarked, Target, ListChecks
} from 'lucide-react';

interface SourceSectionProps {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
}

const SourceSection: React.FC<SourceSectionProps> = ({ icon: Icon, title, children }) => (
    <section className="mb-12 animate-fade-in-up">
        <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-lg shadow-blue-500/5">
                <Icon size={24} className="text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight uppercase">{title}</h2>
        </div>
        <div className="pl-0 sm:pl-16 space-y-4 text-gray-400 leading-relaxed font-light">
            {children}
        </div>
    </section>
);

/** Volume tier badge */
const VolumeTier: React.FC<{ label: string; range: string; desc: string; color: string; borderColor: string }> = ({
    label, range, desc, color, borderColor
}) => (
    <div className={`flex-1 rounded-xl bg-[#111] border ${borderColor} p-4`}>
        <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${color}`}>{label}</div>
        <div className="text-xl font-extrabold text-white mb-1">{range}<span className="text-xs font-normal text-gray-500 ml-1">séries/sem</span></div>
        <div className="text-xs text-gray-500">{desc}</div>
    </div>
);

interface TrainingVolumeSourceViewProps {
    onBack: () => void;
}

export const TrainingVolumeSourceView: React.FC<TrainingVolumeSourceViewProps> = ({ onBack }) => {
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
                    <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 w-fit">
                        <BookOpen size={12} />
                        <span>Plano de Treino / V1.0</span>
                    </div>
                </div>

                {/* Title */}
                <div className="mb-16 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter uppercase mb-6">
                        Volume de Treino para <span className="text-blue-400">Hipertrofia</span>
                    </h1>
                    <p className="text-gray-500 font-light max-w-3xl text-lg mb-6">
                        Base científica do VITRÚVIO para prescrever o número ideal de séries por grupo muscular, ajustar volume conforme o nível do atleta, e periodizar o treino ao longo do tempo para máxima hipertrofia.
                    </p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-gray-600 font-mono uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                            Vigente: Fev 2026
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={14} className="text-gray-500" />
                            Módulo Plano de Treino
                        </div>
                    </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-blue-500/20 via-white/5 to-transparent mb-16" />

                {/* ─────────── SEÇÃO 1: VISÃO GERAL ─────────── */}
                <SourceSection icon={BookMarked} title="1. Fontes Científicas Principais">
                    <p>
                        O conhecimento do VITRÚVIO sobre volume de treino é fundamentado nas meta-análises mais relevantes da literatura científica moderna sobre hipertrofia:
                    </p>
                    <div className="overflow-x-auto mt-4">
                        <table className="w-full text-sm text-left border-collapse min-w-[480px]">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Pesquisador</th><th className="pb-3 pr-4 font-semibold">Ano</th><th className="pb-3 font-semibold">Contribuição</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                <tr><td className="py-2.5 text-white">Brad Schoenfeld</td><td className="py-2.5">2017</td><td className="py-2.5">Meta-análise dose-response entre volume e hipertrofia</td></tr>
                                <tr><td className="py-2.5 text-white">James Krieger</td><td className="py-2.5">2010/2020</td><td className="py-2.5">Meta-análises de volume por sessão e semanal</td></tr>
                                <tr><td className="py-2.5 text-white">Mike Israetel (RP)</td><td className="py-2.5">2015+</td><td className="py-2.5">Conceitos estruturados de MEV / MAV / MRV</td></tr>
                                <tr><td className="py-2.5 text-white">Baz-Valle et al.</td><td className="py-2.5">2022</td><td className="py-2.5">Volume moderado vs alto por grupo muscular</td></tr>
                                <tr><td className="py-2.5 text-white">Pelland et al.</td><td className="py-2.5">2024</td><td className="py-2.5">Modelo atualizado dose-response (67 estudos)</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-[#111] border border-white/5 rounded-xl p-5 mt-6">
                        <h4 className="text-blue-400 text-sm font-bold mb-3">Como Volume é Medido</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex gap-3 items-start">
                                <span className="text-blue-400 font-bold shrink-0">①</span>
                                <div><strong className="text-white">Séries por grupo muscular/semana</strong><span className="text-gray-500 ml-2">(método mais usado)</span><p className="text-gray-400 text-xs mt-0.5">Ex: 15 séries de peitoral por semana</p></div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <span className="text-blue-400 font-bold shrink-0">②</span>
                                <div><strong className="text-white">Séries × Reps × Carga (tonnage)</strong><p className="text-gray-400 text-xs mt-0.5">Ex: 10 séries × 10 reps × 80 kg = 8.000 kg</p></div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <span className="text-blue-400 font-bold shrink-0">③</span>
                                <div><strong className="text-white">Séries × Repetições (volume-load)</strong><p className="text-gray-400 text-xs mt-0.5">Ex: 10 séries × 10 reps = 100 repetições</p></div>
                            </div>
                        </div>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 2: MEV / MAV / MRV ─────────── */}
                <SourceSection icon={Layers} title="2. Conceitos Fundamentais: MV, MEV, MAV, MRV">
                    <p>
                        Conceitos desenvolvidos por Mike Israetel na <strong className="text-white">Renaissance Periodization (RP)</strong>, são a estrutura teórica mais completa para prescrição de volume baseada em evidências:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div className="rounded-xl border border-white/5 bg-[#111] p-5">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">MV — Maintenance Volume</div>
                            <div className="text-xl font-extrabold text-white mb-2">4–6 <span className="text-xs font-normal text-gray-500">séries/sem</span></div>
                            <p className="text-sm text-gray-400">Volume mínimo para <strong className="text-white">manter</strong> o tamanho muscular atual. Useful durante cortes ou fases de vida agitadas.</p>
                        </div>
                        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-1">MEV — Minimum Effective Volume</div>
                            <div className="text-xl font-extrabold text-white mb-2">6–8 <span className="text-xs font-normal text-gray-500">séries/sem</span></div>
                            <p className="text-sm text-gray-400">Volume mínimo para <strong className="text-white">produzir</strong> crescimento muscular. Ponto de entrada para fase de ganho.</p>
                        </div>
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">MAV — Maximum Adaptive Volume</div>
                            <div className="text-xl font-extrabold text-white mb-2">10–20 <span className="text-xs font-normal text-gray-500">séries/sem</span></div>
                            <p className="text-sm text-gray-400">Volume que produz o <strong className="text-white">máximo de crescimento</strong> por unidade de esforço. Zona ótima de custo-benefício.</p>
                        </div>
                        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-1">MRV — Maximum Recoverable Volume</div>
                            <div className="text-xl font-extrabold text-white mb-2">20–30+ <span className="text-xs font-normal text-gray-500">séries/sem</span></div>
                            <p className="text-sm text-gray-400">Volume máximo do qual ainda consegue se recuperar. <strong className="text-white">Acima disso:</strong> overreaching/overtraining.</p>
                        </div>
                    </div>

                    <h4 className="text-white text-sm font-bold mt-6 mb-3">Curva de Dose-Response (Schoenfeld et al., 2017)</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Volume Semanal</th><th className="pb-3 pr-4 font-semibold">Effect Size</th><th className="pb-3 font-semibold">Resultado</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5">
                                <tr><td className="py-2.5 text-white">{'<'} 5 séries</td><td className="py-2.5 text-gray-500">0.20</td><td className="py-2.5">Ganhos mínimos ou subótimos</td></tr>
                                <tr><td className="py-2.5 text-white">5–9 séries</td><td className="py-2.5 text-yellow-400">0.32</td><td className="py-2.5">Ganhos moderados (~0.37% adicional por série)</td></tr>
                                <tr><td className="py-2.5 text-white font-semibold">10–20 séries</td><td className="py-2.5 text-emerald-400 font-semibold">0.44</td><td className="py-2.5 text-emerald-400 font-semibold">Ganhos ótimos para maioria ✓</td></tr>
                                <tr><td className="py-2.5 text-white">20+ séries</td><td className="py-2.5 text-orange-400">↓</td><td className="py-2.5">Retornos diminuídos (pode ajudar avançados)</td></tr>
                                <tr><td className="py-2.5 text-white">30+ séries</td><td className="py-2.5 text-red-400">⚠️</td><td className="py-2.5">Risco de overreaching (apenas temporário + deload)</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-gray-500 italic mt-3">Cada série adicional ≈ +0.37% de ganho em hipertrofia (Schoenfeld et al., 2017)</p>
                </SourceSection>

                {/* ─────────── SEÇÃO 3: META-ANÁLISES ─────────── */}
                <SourceSection icon={BarChart3} title="3. Evidências Científicas — Meta-Análises">
                    <div className="space-y-5">
                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h4 className="text-white text-sm font-bold mb-1">Schoenfeld et al. (2017) — Dose-Response</h4>
                            <p className="text-xs text-gray-500 mb-3">15 estudos · 34 grupos de tratamento · Journal of Sports Sciences</p>
                            <p className="text-sm text-gray-400">Confirmou relação dose-response gradual — mais volume = mais hipertrofia (até certo ponto). Primeiro estudo a quantificar a relação de forma sistemática em humanos.</p>
                        </div>

                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h4 className="text-white text-sm font-bold mb-1">Schoenfeld et al. (2019) — Frequência</h4>
                            <p className="text-xs text-gray-500 mb-3">Journal of Sports Sciences</p>
                            <ul className="text-sm text-gray-400 space-y-1 list-disc pl-5">
                                <li>Quando volume é equalizado, <strong className="text-white">frequência não importa significativamente</strong></li>
                                <li>2x/semana por grupo muscular é suficiente</li>
                                <li>3x/semana não mostrou vantagem sobre 2x (volume igual)</li>
                            </ul>
                            <p className="text-xs text-blue-300 mt-3">💡 Implicação: Distribua o volume em 2–3 sessões por grupo muscular.</p>
                        </div>

                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h4 className="text-white text-sm font-bold mb-1">Baz-Valle et al. (2022) — Volume Moderado vs Alto</h4>
                            <p className="text-xs text-gray-500 mb-3">7 estudos · Journal of Human Kinetics</p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left border-collapse min-w-[360px]">
                                    <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                        <th className="pb-2 pr-4 font-semibold">Grupo</th><th className="pb-2 pr-4 font-semibold">p-valor</th><th className="pb-2 font-semibold">Conclusão</th>
                                    </tr></thead>
                                    <tbody className="divide-y divide-white/5">
                                        <tr><td className="py-2 text-white">Quadríceps</td><td className="py-2">p = 0.19</td><td className="py-2">Sem diferença significativa</td></tr>
                                        <tr><td className="py-2 text-white">Bíceps</td><td className="py-2">p = 0.59</td><td className="py-2">Sem diferença significativa</td></tr>
                                        <tr><td className="py-2 text-white font-semibold">Tríceps</td><td className="py-2 text-blue-400 font-semibold">p = 0.01</td><td className="py-2 text-blue-400 font-semibold">Alto volume MELHOR ✓</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">Conclusão: 12–20 séries/sem é ótimo para maioria. Tríceps pode precisar de mais (músculo sinergista com menor estímulo direto).</p>
                        </div>

                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h4 className="text-white text-sm font-bold mb-1">Krieger (2020) — Volume por Sessão</h4>
                            <p className="text-sm text-gray-400 mb-2">Hipertrofia aumenta até <strong className="text-white">~6–8 séries por grupo muscular por SESSÃO</strong>. Acima de 8 séries/sessão: retornos diminuídos significativos.</p>
                            <p className="text-xs text-blue-300">💡 "First set is most effective, subsequent sets have diminishing returns."</p>
                        </div>

                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h4 className="text-white text-sm font-bold mb-1">Pelland et al. (2024) — Modelo Atualizado</h4>
                            <p className="text-xs text-gray-500 mb-3">67 estudos · 2.058 participantes · Sports Medicine</p>
                            <ul className="text-sm text-gray-400 space-y-1 list-disc pl-5">
                                <li>Probabilidade de <strong className="text-white">100%</strong> de que mais volume = mais hipertrofia</li>
                                <li>Relação é <strong className="text-white">logarítmica</strong> (retornos diminuídos, não linear)</li>
                                <li>Séries diretas e indiretas têm pesos diferentes</li>
                                <li>Força mostra retornos mais diminuídos que hipertrofia</li>
                            </ul>
                        </div>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 4: VOLUME POR GRUPO ─────────── */}
                <SourceSection icon={Dumbbell} title="4. Volume por Grupo Muscular">
                    <h4 className="text-white text-sm font-bold mb-3">Recomendações MEV / MAV / MRV por Grupo</h4>
                    <p className="text-sm mb-4">Valores para atletas <strong className="text-white">intermediários a avançados</strong>. Iniciantes precisam de menos volume. Variação individual de ±30%.</p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse min-w-[500px]">
                            <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                <th className="pb-3 pr-4 font-semibold">Grupo Muscular</th><th className="pb-3 pr-4 font-semibold text-blue-400">MEV</th><th className="pb-3 pr-4 font-semibold text-emerald-400">MAV (Ótimo)</th><th className="pb-3 font-semibold text-red-400">MRV</th>
                            </tr></thead>
                            <tbody className="divide-y divide-white/5">
                                {[
                                    ['Peito', '6–8', '12–18', '20–25'],
                                    ['Costas (largura)', '6–8', '12–18', '20–25'],
                                    ['Costas (espessura)', '6–8', '10–16', '18–22'],
                                    ['Ombros (deltoide lateral)', '6–8', '12–18', '20–26'],
                                    ['Ombros (posterior)', '0–6', '8–14', '16–20'],
                                    ['Bíceps', '4–6', '10–16', '18–22'],
                                    ['Tríceps', '4–6', '10–16', '18–24'],
                                    ['Quadríceps', '6–8', '12–18', '22–28'],
                                    ['Isquiotibiais', '4–6', '10–14', '16–20'],
                                    ['Glúteos', '0–4', '8–14', '16–22'],
                                    ['Panturrilha', '6–8', '12–16', '20–26'],
                                    ['Abdominais', '0–4', '8–14', '16–20'],
                                    ['Trapézio', '0–4', '8–12', '14–18'],
                                    ['Antebraço', '0–4', '6–12', '14–18'],
                                ].map(([grupo, mev, mav, mrv]) => (
                                    <tr key={grupo}>
                                        <td className="py-2 text-white">{grupo}</td>
                                        <td className="py-2 font-mono text-blue-400">{mev}</td>
                                        <td className="py-2 font-mono text-emerald-400 font-semibold">{mav}</td>
                                        <td className="py-2 font-mono text-red-400">{mrv}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">MEV = 0 significa que o grupo recebe estímulo suficiente de exercícios compostos.</p>

                    <h4 className="text-white text-sm font-bold mt-6 mb-3">Considerações por Tolerância</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-[#111] border border-white/5 rounded-xl p-4">
                            <h5 className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">Toleram + Volume</h5>
                            <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
                                <li>Quadríceps (grande massa)</li>
                                <li>Costas / Dorsais</li>
                                <li>Ombros (deltoide)</li>
                                <li>Panturrilha (fibras tipo I)</li>
                            </ul>
                        </div>
                        <div className="bg-[#111] border border-white/5 rounded-xl p-4">
                            <h5 className="text-red-400 text-xs font-bold uppercase tracking-wider mb-2">Toleram − Volume</h5>
                            <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
                                <li>Isquiotibiais (risco de lesão)</li>
                                <li>Bíceps (pequeno, over fácil)</li>
                                <li>Lombar / Eretores (SNC)</li>
                                <li>Trapézio (muito estímulo)</li>
                            </ul>
                        </div>
                        <div className="bg-[#111] border border-white/5 rounded-xl p-4">
                            <h5 className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">Precisam + Isolamento</h5>
                            <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
                                <li>Panturrilha (fibras resistentes)</li>
                                <li>Tríceps (sinergista sub-estimulado)</li>
                                <li>Deltoide posterior</li>
                            </ul>
                        </div>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 5: SESSÃO VS SEMANAL ─────────── */}
                <SourceSection icon={Repeat2} title="5. Volume por Sessão vs Semanal">
                    <p>
                        O volume semanal ideal deve ser <strong className="text-white">distribuído em múltiplas sessões</strong>. Concentrar todo o volume em uma única sessão reduz a eficiência e aumenta o risco de lesões.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="bg-[#111] border border-red-500/20 rounded-xl p-5">
                            <h5 className="text-red-400 text-xs font-bold uppercase tracking-wider mb-2">❌ 1x/semana (Subótimo)</h5>
                            <p className="text-xs text-gray-400">Ex: 16 séries de peito em 1 dia.<br />Problema: fadiga excessiva, menos eficiência, apenas 1 pico de MPS.</p>
                        </div>
                        <div className="bg-[#111] border border-emerald-500/20 rounded-xl p-5">
                            <h5 className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">✓ 2x/semana (Recomendado)</h5>
                            <p className="text-xs text-gray-400">Ex: 8 séries (Seg) + 8 séries (Qui).<br />Vantagem: 2 picos de MPS, melhor recuperação, maior estímulo.</p>
                        </div>
                        <div className="bg-[#111] border border-blue-500/20 rounded-xl p-5">
                            <h5 className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">✓ 3x/semana (Também válido)</h5>
                            <p className="text-xs text-gray-400">Ex: 5–6 séries 3 vezes/sem.<br />Vantagem: 3 picos de MPS, menor fadiga por sessão.</p>
                        </div>
                    </div>

                    <div className="bg-[#111] border border-white/5 rounded-xl p-5 mt-4">
                        <h4 className="text-blue-400 text-sm font-bold mb-3">Base Científica — Síntese Proteica (MPS)</h4>
                        <ul className="text-sm text-gray-400 space-y-1 list-disc pl-5">
                            <li>MPS dura <strong className="text-white">~48–72h</strong> após o treino</li>
                            <li>Treinar 2–3x/semana = <strong className="text-white">múltiplos picos de MPS</strong></li>
                            <li>Treinar 1x/semana = apenas 1 pico, mesmo com alto volume</li>
                            <li>Máximo efetivo por sessão: <strong className="text-white">6–10 séries por grupo muscular</strong></li>
                        </ul>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 6: DIRETAS vs INDIRETAS ─────────── */}
                <SourceSection icon={ListChecks} title="6. Séries Diretas vs Indiretas">
                    <p>
                        Diferenciação introduzida por <strong className="text-white">Pelland et al. (2024)</strong> para tornar o cálculo do volume semanal mais preciso:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h5 className="text-white text-sm font-bold mb-2">Séries Diretas (100%)</h5>
                            <p className="text-sm text-gray-400">O músculo atua como <strong className="text-white">agonista principal</strong> no exercício.<br /><em className="text-gray-500">Ex: Supino para peitoral, Rosca para bíceps</em></p>
                        </div>
                        <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                            <h5 className="text-white text-sm font-bold mb-2">Séries Indiretas (~50%)</h5>
                            <p className="text-sm text-gray-400">O músculo atua como <strong className="text-white">sinergista</strong> no exercício.<br /><em className="text-gray-500">Ex: Supino para tríceps, Remada para bíceps</em></p>
                        </div>
                    </div>

                    <div className="bg-[#111] border border-blue-500/10 rounded-xl p-5 mt-4">
                        <h4 className="text-blue-400 text-sm font-bold mb-4">Exemplo Prático — Treino de Peito e Tríceps</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse min-w-[420px]">
                                <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="pb-2 pr-4 font-semibold">Exercício</th><th className="pb-2 pr-4 font-semibold text-white">Peito</th><th className="pb-2 font-semibold text-white">Tríceps</th>
                                </tr></thead>
                                <tbody className="divide-y divide-white/5 text-xs">
                                    <tr><td className="py-2 text-gray-300">Supino Reto 4×8</td><td className="py-2 text-white">4 diretas</td><td className="py-2 text-gray-400">4 indiretas (~2)</td></tr>
                                    <tr><td className="py-2 text-gray-300">Supino Inclinado 3×10</td><td className="py-2 text-white">3 diretas</td><td className="py-2 text-gray-400">3 indiretas (~1.5)</td></tr>
                                    <tr><td className="py-2 text-gray-300">Crucifixo 3×12</td><td className="py-2 text-white">3 diretas</td><td className="py-2 text-gray-400">—</td></tr>
                                    <tr><td className="py-2 text-gray-300">Tríceps Pulley 4×12</td><td className="py-2 text-gray-400">—</td><td className="py-2 text-white">4 diretas</td></tr>
                                    <tr><td className="py-2 text-gray-300">Tríceps Francês 3×10</td><td className="py-2 text-gray-400">—</td><td className="py-2 text-white">3 diretas</td></tr>
                                    <tr className="border-t font-bold"><td className="py-2.5 text-white">TOTAL / SESSÃO</td><td className="py-2.5 text-emerald-400">10 diretas</td><td className="py-2.5 text-blue-400">7 dir + 3.5 ind ≈ 10.5 eq.</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">Se treinar 2×/sem: Peito = 20 séries/sem · Tríceps = ~21 série equivalentes</p>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 7: PERIODIZAÇÃO ─────────── */}
                <SourceSection icon={TrendingUp} title="7. Periodização de Volume">
                    <p>
                        O volume deve ser <strong className="text-white">progressivo dentro de cada mesociclo</strong> (4–6 semanas), partindo do MEV e construindo em direção ao MAV/MRV, seguido por uma semana de deload para restaurar a capacidade adaptativa.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div>
                            <h4 className="text-white text-sm font-bold mb-3">Estrutura do Mesociclo</h4>
                            <div className="space-y-2">
                                {[
                                    { sem: 'Semana 1', desc: 'Volume MEV–baixo (acumulação)', color: 'bg-blue-500' },
                                    { sem: 'Semana 2', desc: 'Volume moderado (+10–15%)', color: 'bg-blue-500' },
                                    { sem: 'Semana 3', desc: 'Volume MAV (+10–15%)', color: 'bg-emerald-500' },
                                    { sem: 'Semana 4', desc: 'Volume alto / MRV (+10–15%)', color: 'bg-orange-500' },
                                    { sem: 'Semana 5', desc: 'DELOAD (50–60% do volume)', color: 'bg-gray-500' },
                                ].map(({ sem, desc, color }) => (
                                    <div key={sem} className="flex items-center gap-3">
                                        <div className={`w-2 h-8 rounded-full shrink-0 ${color}`} />
                                        <div>
                                            <div className="text-xs font-bold text-white">{sem}</div>
                                            <div className="text-xs text-gray-400">{desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-white text-sm font-bold mb-3">Exemplo — Peito, Atleta Intermediário</h4>
                            <div className="bg-[#111] border border-white/5 rounded-xl p-4 text-xs space-y-1">
                                <p className="text-gray-500 mb-2 font-bold">MESOCICLO 1:</p>
                                <div className="flex justify-between"><span className="text-gray-400">Semana 1</span><span className="text-white font-mono">10 séries/sem</span></div>
                                <div className="flex justify-between"><span className="text-gray-400">Semana 2</span><span className="text-white font-mono">12 séries/sem</span></div>
                                <div className="flex justify-between"><span className="text-gray-400">Semana 3</span><span className="text-white font-mono">14 séries/sem</span></div>
                                <div className="flex justify-between"><span className="text-gray-400">Semana 4</span><span className="text-white font-mono">16 séries/sem</span></div>
                                <div className="flex justify-between border-t border-white/5 mt-1 pt-1"><span className="text-gray-500">Semana 5 (Deload)</span><span className="text-gray-500 font-mono">8 séries/sem</span></div>
                                <p className="text-gray-500 mt-3 mb-2 font-bold">MESOCICLO 2 (reinicia mais alto):</p>
                                <div className="flex justify-between"><span className="text-gray-400">Semana 6</span><span className="text-white font-mono">12 séries/sem</span></div>
                                <div className="flex justify-between"><span className="text-gray-400">Semana 9</span><span className="text-emerald-400 font-mono">18 séries/sem</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Semana 10 (Deload)</span><span className="text-gray-500 font-mono">9 séries/sem</span></div>
                            </div>
                        </div>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 8: TABELA POR NÍVEL ─────────── */}
                <SourceSection icon={Target} title="8. Volume Recomendado por Nível de Experiência">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="pb-3 pr-4 font-semibold">Grupo</th>
                                    <th className="pb-3 pr-4 font-semibold">Iniciante<br /><span className="normal-case font-normal">(0–1 ano)</span></th>
                                    <th className="pb-3 pr-4 font-semibold">Intermediário<br /><span className="normal-case font-normal">(1–3 anos)</span></th>
                                    <th className="pb-3 pr-4 font-semibold">Avançado<br /><span className="normal-case font-normal">(3–7 anos)</span></th>
                                    <th className="pb-3 font-semibold">Elite<br /><span className="normal-case font-normal">(7+ anos)</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-mono text-xs">
                                {[
                                    ['Peito', '6–10', '10–16', '14–20', '16–25'],
                                    ['Costas (largura)', '6–10', '10–16', '14–20', '16–25'],
                                    ['Ombro (lateral)', '6–10', '10–16', '14–20', '16–26'],
                                    ['Bíceps', '4–8', '8–14', '12–18', '14–22'],
                                    ['Tríceps', '4–8', '8–14', '12–18', '14–24'],
                                    ['Quadríceps', '6–10', '10–16', '14–22', '18–28'],
                                    ['Isquiotibiais', '4–8', '8–12', '10–16', '12–20'],
                                    ['Glúteos', '4–6', '6–12', '10–16', '12–20'],
                                    ['Panturrilha', '8–12', '12–16', '14–20', '18–26'],
                                ].map(([grupo, ini, int, ava, eli]) => (
                                    <tr key={grupo}>
                                        <td className="py-2 text-white font-sans text-sm">{grupo}</td>
                                        <td className="py-2 text-gray-400">{ini}</td>
                                        <td className="py-2 text-blue-400">{int}</td>
                                        <td className="py-2 text-emerald-400">{ava}</td>
                                        <td className="py-2 text-amber-400">{eli}</td>
                                    </tr>
                                ))}
                                <tr className="border-t border-white/10 font-sans">
                                    <td className="py-2.5 text-white text-sm">Máx por sessão</td>
                                    <td className="py-2.5 text-gray-400">6–8</td>
                                    <td className="py-2.5 text-blue-400">8–10</td>
                                    <td className="py-2.5 text-emerald-400">10–12</td>
                                    <td className="py-2.5 text-amber-400">10–12</td>
                                </tr>
                                <tr>
                                    <td className="py-2 text-white text-sm">Frequência ideal</td>
                                    <td className="py-2 text-gray-400">2×</td>
                                    <td className="py-2 text-blue-400">2×</td>
                                    <td className="py-2 text-emerald-400">2–3×</td>
                                    <td className="py-2 text-amber-400">2–3×</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </SourceSection>

                {/* ─────────── SEÇÃO 9: OVERREACHING + REGRAS ─────────── */}
                <SourceSection icon={AlertTriangle} title="9. Sinais de Overreaching e Regras de Ouro">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                            <h5 className="text-red-400 text-xs font-bold uppercase tracking-wider mb-2">Performance</h5>
                            <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
                                <li>Força estagnada 2+ semanas</li>
                                <li>Incapaz de progredir em reps ou carga</li>
                                <li>Qualidade das contrações cai</li>
                            </ul>
                        </div>
                        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                            <h5 className="text-red-400 text-xs font-bold uppercase tracking-wider mb-2">Recuperação</h5>
                            <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
                                <li>Dor muscular {'>'} 72h após treino</li>
                                <li>Fadiga que não melhora com sono</li>
                                <li>Sensação de "peso" nos músculos</li>
                            </ul>
                        </div>
                        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                            <h5 className="text-red-400 text-xs font-bold uppercase tracking-wider mb-2">Sistêmicos</h5>
                            <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
                                <li>Sono prejudicado</li>
                                <li>Irritabilidade aumentada</li>
                                <li>Apetite diminuído</li>
                                <li>FC de repouso elevada</li>
                            </ul>
                        </div>
                    </div>
                    <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl text-sm text-orange-300 mb-6">
                        <strong className="text-orange-400">Ação imediata:</strong> Reduzir volume em 30–50% ou realizar deload completo.
                    </div>

                    <h4 className="text-white text-sm font-bold mb-3">Regras de Ouro para o VITRÚVIO</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { n: '1', rule: 'NUNCA prescrever menos que MEV para grupos prioritários' },
                            { n: '2', rule: 'NUNCA prescrever mais que 10–12 séries por grupo por sessão' },
                            { n: '3', rule: 'SEMPRE distribuir volume em 2–3 sessões semanais' },
                            { n: '4', rule: 'SEMPRE incluir deload a cada 4–6 semanas' },
                            { n: '5', rule: 'AUMENTAR volume gradualmente (10–20% por semana)' },
                            { n: '6', rule: 'REDUZIR volume se sinais de overreaching aparecerem' },
                            { n: '7', rule: 'AJUSTAR volume baseado na resposta real do atleta' },
                            { n: '8', rule: 'CONSIDERAR volume indireto ao calcular total semanal' },
                        ].map(({ n, rule }) => (
                            <div key={n} className="flex gap-3 items-start bg-[#111] border border-white/5 rounded-xl p-3">
                                <span className="text-blue-400 font-bold text-sm shrink-0">{n}.</span>
                                <span className="text-sm text-gray-400">{rule}</span>
                            </div>
                        ))}
                    </div>
                </SourceSection>

                {/* ─────────── REFERÊNCIAS ─────────── */}
                <div className="mt-16 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Referências Bibliográficas</h3>

                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-4 mb-2">Meta-Análises e Reviews</h4>
                    <ol className="text-sm text-gray-400 space-y-1 list-decimal pl-5">
                        <li>Schoenfeld BJ, Ogborn D, Krieger JW (2017). "Dose-response relationship between weekly resistance training volume and increases in muscle mass." Journal of Sports Sciences.</li>
                        <li>Schoenfeld BJ, Grgic J, Krieger J (2019). "How many times per week should a muscle be trained to maximize muscle hypertrophy?" Journal of Sports Sciences.</li>
                        <li>Krieger JW (2010). "Single vs. multiple sets of resistance exercise for muscle hypertrophy: a meta-analysis." Journal of Strength and Conditioning Research.</li>
                        <li>Baz-Valle E, et al. (2022). "A Systematic Review of The Effects of Different Resistance Training Volumes on Muscle Hypertrophy." Journal of Human Kinetics.</li>
                        <li>Pelland JC, et al. (2024). "The Resistance Training Dose Response: Meta-Regressions." Sports Medicine.</li>
                    </ol>

                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-6 mb-2">Estudos Originais</h4>
                    <ol start={6} className="text-sm text-gray-400 space-y-1 list-decimal pl-5">
                        <li>Schoenfeld BJ, et al. (2019). "Resistance Training Volume Enhances Muscle Hypertrophy but Not Strength in Trained Men." Medicine & Science in Sports & Exercise.</li>
                        <li>Aube D, et al. (2020). "Progressive Resistance Training Volume: Effects on Muscle Thickness, Mass, and Strength Adaptations." Journal of Strength and Conditioning Research.</li>
                    </ol>

                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-6 mb-2">Conceitos Teóricos</h4>
                    <ol start={8} className="text-sm text-gray-400 space-y-1 list-decimal pl-5">
                        <li>Israetel M, Hoffmann J, Smith CW (2015). "Scientific Principles of Strength Training." Renaissance Periodization.</li>
                        <li>Krieger JW (2020). "Set Volume for Muscle Size: The Ultimate Evidence Based Bible." Weightology Research Review.</li>
                    </ol>
                </div>

            </div>
        </div>
    );
};
