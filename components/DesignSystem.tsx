import React from 'react';
import {
  Bell, Camera, Sparkles, ArrowRight, Download, Share2,
  Dumbbell, Utensils, Ruler, Activity, Footprints, Accessibility, Hand
} from 'lucide-react';
import { GlassPanel } from './GlassPanel';
import { InputField } from './InputField';
import { RatioCard, HeatmapCard, ScoreCard } from './KpiCard';
import { HeroCard } from './HeroCard';
import { MetricsGrid } from './MetricsGrid';
import { RadarChart, BodyFatGauge, AsymmetryRadar } from './AssessmentCharts';
import { MassCard, ProportionCard, AsymmetryCard, ScoreWidget, AiAnalysisWidget, ProportionAiAnalysisCard, AiInsightCard } from './AssessmentCards';
import {
  GoldenEvolutionChart,
  MeasuresChart,
  WeightChart,
  BodyFatChart,
  AsymmetryScannerChart
} from './EvolutionCharts';
import { AssessmentList } from './AssessmentList';
import { ProfileSelector } from './ProfileSelector';

export const DesignSystem: React.FC = () => {
  const [selectedProfile, setSelectedProfile] = React.useState<'academia' | 'personal' | 'atleta'>('atleta');
  return (
    <div className="w-full flex-1 overflow-y-auto p-8 custom-scrollbar bg-background-dark pb-20">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">

        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">DESIGN SYSTEM</h1>
          <p className="text-gray-400 font-light text-lg">
            Guia oficial de identidade visual, componentes e biblioteca de widgets da aplicação SHAPE-V.
          </p>
        </div>

        <div className="h-px w-full bg-white/10" />

        {/* 1. CORES */}
        <section className="flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-8 h-1 bg-primary rounded-full"></span>
            01. Paleta de Cores
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Brand Primary */}
            <GlassPanel className="p-4 rounded-xl flex flex-col gap-3">
              <div className="w-full h-32 rounded-lg bg-primary shadow-[0_0_20px_rgba(0,201,167,0.3)]"></div>
              <div>
                <p className="text-white font-bold">Primary Teal</p>
                <p className="text-xs text-primary font-mono mt-1">#00C9A7</p>
                <p className="text-xs text-gray-500 mt-2">Ações principais, destaques, progresso positivo.</p>
              </div>
            </GlassPanel>

            {/* Brand Secondary */}
            <GlassPanel className="p-4 rounded-xl flex flex-col gap-3">
              <div className="w-full h-32 rounded-lg bg-secondary shadow-[0_0_20px_rgba(124,58,237,0.3)]"></div>
              <div>
                <p className="text-white font-bold">Secondary Purple</p>
                <p className="text-xs text-secondary font-mono mt-1">#7C3AED</p>
                <p className="text-xs text-gray-500 mt-2">Gradientes, acentos secundários, dados comparativos.</p>
              </div>
            </GlassPanel>

            {/* Backgrounds */}
            <GlassPanel className="p-4 rounded-xl flex flex-col gap-3">
              <div className="flex flex-1 gap-2 h-32">
                <div className="flex-1 bg-[#0A0F1C] rounded-lg border border-white/10 flex items-center justify-center text-[10px] text-gray-500">Dark</div>
                <div className="flex-1 bg-[#131B2C] rounded-lg border border-white/10 flex items-center justify-center text-[10px] text-gray-500">Card</div>
              </div>
              <div>
                <p className="text-white font-bold">Backgrounds</p>
                <p className="text-xs text-gray-400 font-mono mt-1">#0A0F1C / #131B2C</p>
                <p className="text-xs text-gray-500 mt-2">Camadas de profundidade da interface.</p>
              </div>
            </GlassPanel>

            {/* Semantic Colors */}
            <GlassPanel className="p-4 rounded-xl flex flex-col gap-3">
              <div className="flex flex-1 gap-2 h-32">
                <div className="flex-1 bg-green-500 rounded-lg"></div>
                <div className="flex-1 bg-red-400 rounded-lg"></div>
                <div className="flex-1 bg-yellow-400 rounded-lg"></div>
                <div className="flex-1 bg-orange-400 rounded-lg"></div>
              </div>
              <div>
                <p className="text-white font-bold">Semantic Status</p>
                <p className="text-xs text-gray-400 font-mono mt-1">Success, Error, Warn</p>
                <p className="text-xs text-gray-500 mt-2">Feedback de sistema e status de métricas.</p>
              </div>
            </GlassPanel>
          </div>
        </section>

        {/* 2. TIPOGRAFIA */}
        <section className="flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-8 h-1 bg-secondary rounded-full"></span>
            02. Tipografia
          </h2>

          <GlassPanel className="p-8 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Font Family: Space Grotesk</h3>
              <div className="flex flex-col gap-8">
                <div>
                  <h1 className="text-5xl font-bold text-white tracking-tight">Display H1</h1>
                  <span className="text-xs text-gray-500 font-mono">Bold / 48px / Tight Tracking</span>
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-white tracking-tight">Heading H2</h2>
                  <span className="text-xs text-gray-500 font-mono">Bold / 36px / Tight Tracking</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Heading H3</h3>
                  <span className="text-xs text-gray-500 font-mono">Bold / 24px</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Heading H4</h4>
                  <span className="text-xs text-gray-500 font-mono">Bold / 18px</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Body & Utility</h3>
              <div className="flex flex-col gap-8">
                <div>
                  <p className="text-base text-gray-300 leading-relaxed">
                    Body Regular. O texto padrão para parágrafos longos e descrições. Otimizado para leitura em fundo escuro com contraste balanceado.
                  </p>
                  <span className="text-xs text-gray-500 font-mono mt-1 block">Regular / 16px / Relaxed Line Height</span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">
                    Body Small. Utilizado para textos secundários, legendas de gráficos e informações de suporte.
                  </p>
                  <span className="text-xs text-gray-500 font-mono mt-1 block">Medium / 14px</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    LABEL / OVERLINE
                  </p>
                  <span className="text-xs text-gray-500 font-mono mt-1 block">Bold / 12px / Widest Tracking</span>
                </div>
                <div className="flex gap-4 items-center">
                  <span className="text-3xl font-bold text-white tracking-tighter">12.5%</span>
                  <span className="text-3xl font-mono text-primary">12.5%</span>
                </div>
                <span className="text-xs text-gray-500 font-mono block">Numbers: Sans vs Mono</span>
              </div>
            </div>
          </GlassPanel>
        </section>

        {/* 3. COMPONENTES DE UI */}
        <section className="flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-8 h-1 bg-white/20 rounded-full"></span>
            03. Componentes de UI
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Buttons */}
            <GlassPanel className="p-8 rounded-2xl flex flex-col gap-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Botões & Ações</h3>

              <div className="flex flex-wrap items-center gap-4">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-[#0A0F1C] rounded-lg font-bold text-sm transition-all shadow-[0_0_15px_rgba(0,201,167,0.3)]">
                  <Camera size={18} /> Primary Action
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-xs font-bold transition-all">
                  <Share2 size={16} /> Secondary Action
                </button>
                <button className="px-4 py-2 border border-blue-500/30 text-blue-400 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-blue-500/10 transition-colors">
                  Status Action
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5 border border-transparent hover:border-white/10">
                  <Bell size={20} />
                </button>
                <button className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/10">
                  <Activity size={20} />
                </button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">
                  Link Button <ArrowRight size={14} />
                </button>
              </div>
            </GlassPanel>

            {/* Inputs */}
            <GlassPanel className="p-8 rounded-2xl flex flex-col gap-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Campos de Entrada</h3>
              <div className="flex flex-col gap-4">
                <InputField label="Standard Input" placeholder="Digite algo..." />
                <InputField label="Metric Input" unit="cm" placeholder="00.0" />
              </div>
            </GlassPanel>

            {/* Tags & Badges */}
            <GlassPanel className="p-8 rounded-2xl flex flex-col gap-6 lg:col-span-2">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tags & Badges</h3>
              <div className="flex flex-wrap gap-4">
                <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold border border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]">
                  +5% Growth
                </span>
                <span className="px-2 py-0.5 bg-primary text-[#0A0F1C] text-[9px] font-bold rounded">NAVY LABEL</span>
                <span className="inline-block px-2 py-0.5 rounded bg-white/5 border border-white/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                  Badge Outline
                </span>
                <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide border text-orange-400 border-orange-400/30 bg-orange-400/10">
                  Warning Badge
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-secondary/20 text-secondary border border-secondary/20">
                  PRO
                </span>
              </div>
            </GlassPanel>

            {/* Profile Selector */}
            <GlassPanel className="p-8 rounded-2xl flex flex-col gap-6 lg:col-span-2">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Seletores</h3>
              <div className="max-w-md">
                <ProfileSelector
                  selected={selectedProfile}
                  onSelect={setSelectedProfile}
                />
              </div>
            </GlassPanel>
          </div>
        </section>

        {/* 4. DASHBOARD WIDGETS */}
        <section className="flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-8 h-1 bg-white/20 rounded-full"></span>
            04. Dashboard Widgets
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Hero Section</h3>
              <HeroCard />
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">KPI Cards Grid</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RatioCard />
                <HeatmapCard />
                <ScoreCard />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Metrics Grid System</h3>
              <MetricsGrid />
            </div>
          </div>
        </section>

        {/* 5. VISUALIZAÇÃO DE DADOS */}
        <section className="flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-8 h-1 bg-white/20 rounded-full"></span>
            05. Visualização de Dados (Charts)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassPanel className="p-4 rounded-2xl h-[350px]">
              <RadarChart />
            </GlassPanel>
            <GlassPanel className="p-4 rounded-2xl h-[350px]">
              <BodyFatGauge />
            </GlassPanel>
            <GlassPanel className="p-4 rounded-2xl h-[350px]">
              <AsymmetryRadar />
            </GlassPanel>
          </div>
        </section>

        {/* 6. ASSESSMENT CARDS */}
        <section className="flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-8 h-1 bg-white/20 rounded-full"></span>
            06. Assessment Cards
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MassCard label="Peso Exemplo" value={80.5} unit="kg" trend={1.2} color="green" />
            <MassCard label="Massa Magra" value={70.1} unit="kg" trend={0.5} color="purple" />
            <MassCard label="Gordura" value={15.0} unit="kg" trend={-2.5} color="red" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AsymmetryCard
              icon={<Accessibility size={20} />}
              title="BRAÇO"
              subtitle="EXEMPLO ALTA ASSIMETRIA"
              leftVal="41,0"
              rightVal="44,5"
              diff="+3,5"
              status="high"
            />
            <AsymmetryCard
              icon={<Footprints size={20} />}
              title="PANTURRILHA"
              subtitle="EXEMPLO SIMÉTRICO"
              leftVal="38,0"
              rightVal="38,0"
              diff="0,0"
              status="symmetrical"
            />
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Golden Ratio Card Complex</h3>
            <ProportionCard
              title="Shape-V"
              badge="ESCALA SHAPE-V"
              metrics={[{ label: 'Ombros', value: '133cm' }, { label: 'Cintura', value: '85cm' }]}
              currentValue="1.56"
              valueLabel="RATIO ATUAL"
              description="Exemplo de card complexo de proporção áurea com overlay visual."
              statusLabel="DEMONSTRAÇÃO"
              userPosition={78}
              goalPosition={88}
              image="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2070&auto=format&fit=crop"
              overlayStyle="v-taper"
            />
          </div>
        </section>

        {/* 7. EVOLUTION CHARTS */}
        <section className="flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-8 h-1 bg-white/20 rounded-full"></span>
            07. Gráficos de Evolução
          </h2>

          <div className="flex flex-col gap-6">
            {/* Main Chart */}
            <GlassPanel className="p-6 rounded-2xl h-[350px]">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Golden Evolution Chart</h3>
              <GoldenEvolutionChart />
            </GlassPanel>

            {/* Secondary Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassPanel className="p-6 rounded-2xl h-[300px]">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Measures Chart</h3>
                <MeasuresChart />
              </GlassPanel>
              <GlassPanel className="p-6 rounded-2xl h-[300px]">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Weight Chart</h3>
                <WeightChart />
              </GlassPanel>
            </div>

            {/* Tertiary Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <GlassPanel className="p-6 rounded-2xl h-[200px] flex flex-col">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Body Fat Sparkline</h3>
                <BodyFatChart />
              </GlassPanel>
              <GlassPanel className="p-6 rounded-2xl h-[200px] lg:col-span-2 flex flex-col">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Asymmetry Scanner</h3>
                <AsymmetryScannerChart />
              </GlassPanel>
            </div>
          </div>
        </section>

        {/* 8. AI & INSIGHTS WIDGETS */}
        <section className="flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-8 h-1 bg-white/20 rounded-full"></span>
            08. AI & Insights Widgets
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Score Widget</h3>
              <ScoreWidget score={85} label="Pontuação" change="+3.5%" />
            </div>

            <div className="lg:col-span-1 flex flex-col gap-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">AI Insight Card</h3>
              <AiInsightCard
                title="Dica Rápida"
                description="Seu progresso de ombro está excelente. Foque agora na largura dorsal para completar o V-Shape."
                type="Coach Tip"
              />
              <AiInsightCard
                title="Alerta de Assimetria"
                description={<span>Detectamos uma assimetria leve no <strong className="text-orange-400">Tríceps Direito</strong>. Considere exercícios unilaterais.</span>}
                type="Assimetria"
              />
            </div>

            <div className="lg:col-span-1">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Ratio Analysis Card</h3>
              <div className="h-[350px]">
                <ProportionAiAnalysisCard
                  strength="Seus <span class='text-primary font-bold'>Ombros Largos</span> são seu ponto forte genético."
                  weakness="A largura da cintura aumentou levemente este mês."
                  suggestion="Inclua vacuum abdominal na sua rotina matinal."
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Width AI Analysis</h3>
            <AiAnalysisWidget
              title="RELATÓRIO SEMANAL DO COACH IA"
              analysis={
                <span>
                  Com base nos seus dados recentes, sua <strong className="text-white">Simetria</strong> melhorou consideravelmente.
                  O foco para o próximo ciclo deve ser a <strong className="text-primary">Densidade Dorsal</strong> para acompanhar o desenvolvimento dos ombros.
                  Sua dieta está bem ajustada, mas considere aumentar levemente a ingestão de carboidratos nos dias de perna.
                </span>
              }
            />
          </div>
        </section>

        {/* 9. LISTS & TABLES */}
        <section className="flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-8 h-1 bg-white/20 rounded-full"></span>
            09. Listas & Tabelas
          </h2>

          <div className="flex flex-col gap-6">
            <AssessmentList />
          </div>
        </section>

      </div>
    </div>
  );
};