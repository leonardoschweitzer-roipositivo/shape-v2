import React, { useState } from 'react';
import { 
  Download, 
  Share2, 
  Trophy, 
  Bot, 
  Dumbbell, 
  Utensils, 
  ChevronLeft,
  Sparkles,
  Accessibility, 
  Hand,
  Activity,
  Footprints
} from 'lucide-react';
import { GlassPanel } from './GlassPanel';
import { RadarChart, BodyFatGauge, AsymmetryRadar } from './AssessmentCharts';
import { MassCard, ProportionCard, AsymmetryCard } from './AssessmentCards';

interface AssessmentResultsProps {
  onBack: () => void;
}

// --- TABS CONTENT ---

const DiagnosticTab = () => (
    <div className="flex flex-col gap-6 animate-fade-in-up">
        {/* Top Row: 3 Main Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[340px]">
        {/* 1. General Score */}
        <GlassPanel className="rounded-2xl p-1 relative flex flex-col items-center justify-center">
            <div className="absolute top-6 left-6 text-xs text-gray-400 font-bold uppercase tracking-widest">Avaliação Geral</div>
            <Trophy className="absolute top-6 right-6 text-gray-700" size={24} />
            
            <div className="relative w-48 h-48 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl opacity-20"></div>
                <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 240 240">
                    <circle cx="120" cy="120" r="80" fill="none" stroke="#131B2C" strokeWidth="16" />
                    <circle cx="120" cy="120" r="80" fill="none" stroke="#00C9A7" strokeWidth="16" strokeDasharray="502" strokeDashoffset="100" strokeLinecap="round" className="drop-shadow-[0_0_10px_rgba(0,201,167,0.4)]" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold text-white tracking-tighter">80</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Pontos</span>
                </div>
            </div>
            
            <div className="mt-6 flex flex-col items-center gap-2">
                <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold uppercase tracking-wide">Shape Atlético</span>
                <span className="text-[10px] text-green-400 font-bold">+5% <span className="text-gray-500 font-medium">vs. mês anterior</span></span>
            </div>
        </GlassPanel>

        {/* 2. Radar Chart */}
        <GlassPanel className="rounded-2xl relative">
            <RadarChart />
        </GlassPanel>

        {/* 3. Body Fat */}
        <GlassPanel className="rounded-2xl relative">
            <BodyFatGauge />
        </GlassPanel>
        </div>

        {/* Middle Row: Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MassCard label="Peso Atual" value={88.5} unit="kg" trend={1.2} color="green" />
            <MassCard label="Peso Magro" value={77.1} unit="kg" trend={0.8} color="purple" />
            <MassCard label="Peso Gordo" value={11.4} unit="kg" trend={-0.5} color="red" />
        </div>

        {/* Bottom Row: AI Analysis */}
        <div className="w-full rounded-2xl bg-gradient-to-r from-[#1E293B] to-[#131B2C] border border-white/10 p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-full bg-primary/5 -skew-x-12 translate-x-16"></div>
            
            <div className="flex flex-col md:flex-row gap-6 relative z-10">
                <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Bot size={28} className="text-white" />
                    </div>
                </div>
                
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-bold text-white">ANÁLISE DA INTELIGÊNCIA ARTIFICIAL</h3>
                        <span className="px-1.5 py-0.5 rounded bg-white/10 text-gray-400 text-[10px] font-bold border border-white/10">BETA</span>
                    </div>
                    
                    <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-4xl">
                        Com base na análise de simetria bilateral, o cliente apresenta um <span className="text-white font-medium">desequilíbrio leve no deltoide direito</span> em relação ao esquerdo (aproximadamente 4% de diferença em volume). Recomenda-se adicionar 2 séries de elevação lateral unilateral para correção. O percentual de gordura (12.9%) está em um ponto ideal para iniciar a fase de <span className="text-primary font-bold">bulking limpo</span>, focando em progressão de carga nos compostos principais.
                    </p>
                    
                    <div className="flex flex-wrap gap-4">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-xs font-bold transition-all hover:border-primary/50 group/btn">
                            <Dumbbell size={16} className="text-primary group-hover/btn:text-white transition-colors" />
                            Gerar Treino Corretivo
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-xs font-bold transition-all hover:border-secondary/50 group/btn">
                            <Utensils size={16} className="text-secondary group-hover/btn:text-white transition-colors" />
                            Ajustar Macros
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const GoldenRatioTab = () => {
    const [comparisonMode, setComparisonMode] = useState<'golden' | 'classic' | 'mens'>('golden');

    return (
        <div className="flex flex-col gap-6 animate-fade-in-up">
            {/* Control Bar */}
            <div className="flex justify-end mb-2">
                <div className="flex bg-[#0A0F1C] border border-white/10 rounded-lg p-1">
                    <button 
                        onClick={() => setComparisonMode('golden')}
                        className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${comparisonMode === 'golden' ? 'bg-[#1E293B] text-white shadow-sm border border-white/5' : 'text-gray-500 hover:text-white'}`}
                    >
                        {comparisonMode === 'golden' && <Sparkles size={12} className="text-primary" />}
                        Golden Ratio
                    </button>
                    <button 
                        onClick={() => setComparisonMode('classic')}
                        className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${comparisonMode === 'classic' ? 'bg-[#1E293B] text-white shadow-sm border border-white/5' : 'text-gray-500 hover:text-white'}`}
                    >
                        Classic Physique
                    </button>
                    <button 
                        onClick={() => setComparisonMode('mens')}
                        className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${comparisonMode === 'mens' ? 'bg-[#1E293B] text-white shadow-sm border border-white/5' : 'text-gray-500 hover:text-white'}`}
                    >
                        Men's Physique
                    </button>
                </div>
            </div>

            {/* Cards Stack */}
            <div className="flex flex-col gap-6">
                <ProportionCard 
                    title="Tríade"
                    badge="A TRINDADE"
                    metrics={[{ label: 'Meta Reeves', value: '100%' }]}
                    currentValue="98.2"
                    valueUnit="%"
                    description="A Tríade: Pescoço, Braço e Panturrilha em harmonia perfeita."
                    statusLabel="IDEAL CLÁSSICO (98%)"
                    userPosition={98}
                    goalPosition={100}
                    image="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=2070&auto=format&fit=crop"
                    overlayStyle="triad"
                />
                <ProportionCard 
                    title="Cintura"
                    badge="LINHA DE CINTURA"
                    metrics={[{ label: 'Meta Reeves', value: '86cm' }]}
                    currentValue="85"
                    valueUnit="cm"
                    description="Ponto focal da estética. Estreita para acentuar o V-Shape."
                    statusLabel="IDEAL CLÁSSICO (99%)"
                    userPosition={85}
                    goalPosition={86}
                    image="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop"
                    overlayStyle="waist"
                />
                <ProportionCard 
                    title="Shape-V"
                    badge="ESCALA SHAPE-V"
                    metrics={[{ label: 'Ombros', value: '133cm' }, { label: 'Cintura', value: '85cm' }]}
                    currentValue="1.56"
                    valueLabel="RATIO ATUAL"
                    description="V-Taper Index: A proporção estética entre a largura dos ombros e a circunferência da cintura, definindo o 'Shape em V'."
                    statusLabel="QUASE LÁ (1.56)"
                    userPosition={78}
                    goalPosition={88}
                    image="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2070&auto=format&fit=crop"
                    overlayStyle="v-taper"
                />
                {/* ... other cards mapped similarly if data was dynamic, but hardcoded for now ... */}
            </div>
        </div>
    );
};

const AsymmetryTab = () => (
    <div className="flex flex-col lg:flex-row gap-6 animate-fade-in-up h-full">
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
            <AsymmetryCard icon={<Accessibility size={20} />} title="BRAÇO" subtitle="BÍCEPS RELAXADO" leftVal="41,0" rightVal="44,5" diff="+3,5" status="high" />
            <AsymmetryCard icon={<Hand size={20} />} title="ANTEBRAÇO" subtitle="PORÇÃO MEDIAL" leftVal="32,0" rightVal="32,2" diff="+0,2" status="symmetrical" />
            <AsymmetryCard icon={<Activity size={20} />} title="COXA" subtitle="MEDIDA PROXIMAL" leftVal="62,0" rightVal="60,5" diff="+1,5" status="moderate" />
            <AsymmetryCard icon={<Footprints size={20} />} title="PANTURRILHA" subtitle="GASTROCNÊMIO" leftVal="38,0" rightVal="38,0" diff="0,0" status="symmetrical" />
        </div>

        <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <GlassPanel className="p-6 rounded-2xl border border-white/5 flex flex-col items-center flex-1 min-h-[400px]">
                <h4 className="text-white font-bold text-sm tracking-wide self-start mb-6">RADAR DE DESEQUILÍBRIO</h4>
                <div className="flex-1 w-full flex items-center justify-center">
                   <AsymmetryRadar />
                </div>
                <div className="flex gap-6 mt-6">
                    <div className="flex items-center gap-2">
                         <span className="w-3 h-3 rounded-full bg-secondary"></span>
                         <span className="text-xs text-gray-400 font-medium">Lado Esquerdo</span>
                    </div>
                    <div className="flex items-center gap-2">
                         <span className="w-3 h-3 rounded-full bg-primary"></span>
                         <span className="text-xs text-gray-400 font-medium">Lado Direito</span>
                    </div>
                </div>
            </GlassPanel>

            <GlassPanel className="p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-[#131B2C] to-[#0A0F1C] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
                <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-3">
                    <Sparkles size={10} /> AI Insight
                </div>
                <h4 className="text-white font-bold text-sm mb-2">Dominância do Hemicorpo Direito</h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                    Identificamos uma assimetria significativa no <strong className="text-orange-400">Braço Direito (+3,5cm)</strong> que pode estar relacionada à compensação em exercícios de empurrar.
                </p>
            </GlassPanel>
        </div>
    </div>
);

// --- MAIN COMPONENT ---

export const AssessmentResults: React.FC<AssessmentResultsProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'diagnostic' | 'golden' | 'asymmetry'>('diagnostic');
  const tabs = [
    { id: 'diagnostic', label: 'Diagnóstico Estético' },
    { id: 'golden', label: 'Proporções Áureas' },
    { id: 'asymmetry', label: 'Análise de Assimetrias' }
  ];

  return (
    <div className="w-full h-full flex flex-col bg-background-dark overflow-y-auto custom-scrollbar">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-[#0A0F1C] border-b border-card-border">
         <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
            <div className="flex flex-col animate-fade-in-up">
               <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-2 transition-colors text-xs font-bold uppercase tracking-wider w-fit">
                  <ChevronLeft size={14} /> Voltar para Dashboard
               </button>
               <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">RESULTADOS DA AVALIAÇÃO</h2>
               <p className="text-sm text-gray-400 flex items-center gap-2 mt-2 font-light">
                  Análise completa do físico de <strong className="text-gray-200 font-medium">João Silva</strong> • 24/10/2023
               </p>
            </div>
            <div className="flex gap-3">
               <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-gray-300 text-xs font-bold transition-all">
                  <Download size={16} /> Exportar PDF
               </button>
               <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-gray-300 text-xs font-bold transition-all">
                  <Share2 size={16} /> Compartilhar
               </button>
            </div>
         </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-[#0A0F1C] border-b border-card-border">
         <div className="max-w-7xl mx-auto px-8">
             <div className="flex gap-8">
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`py-4 text-sm font-bold transition-colors ${activeTab === tab.id ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        {tab.label}
                    </button>
                ))}
             </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-7xl mx-auto w-full flex flex-col gap-6 pb-20">
         {activeTab === 'diagnostic' && <DiagnosticTab />}
         {activeTab === 'golden' && <GoldenRatioTab />}
         {activeTab === 'asymmetry' && <AsymmetryTab />}
      </div>
    </div>
  );
};