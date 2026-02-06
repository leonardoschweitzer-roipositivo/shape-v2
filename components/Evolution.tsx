import React, { useState } from 'react';
import { GlassPanel } from './GlassPanel';
import { Info, List, BarChart2, TrendingUp, Accessibility, ChevronDown } from 'lucide-react';
import { 
  GoldenEvolutionChart, 
  MeasuresChart, 
  WeightChart, 
  BodyFatChart, 
  AsymmetryScannerChart 
} from './EvolutionCharts';

const proportions = [
  { id: 'shape-v', label: 'Shape-V (Ombro/Cintura)' },
  { id: 'arm-neck', label: 'Braço / Pescoço' },
  { id: 'thigh-calf', label: 'Coxa / Panturrilha' },
  { id: 'chest-waist', label: 'Peitoral / Cintura' },
  { id: 'waist-hip', label: 'Cintura / Quadril' },
  { id: 'arm-forearm', label: 'Braço / Antebraço' },
  { id: 'neck-calf', label: 'Pescoço / Panturrilha' },
  { id: 'biceps-thigh', label: 'Bíceps / Coxa' },
];

export const Evolution: React.FC = () => {
  const [period, setPeriod] = useState('6M');
  const [selectedProportion, setSelectedProportion] = useState('shape-v');

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar pb-20">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Header Description & Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-4 mb-2">
             <div>
                 <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">EVOLUÇÃO</h2>
                 <p className="text-gray-400 mt-2 font-light max-w-2xl">
                    Análise detalhada do progresso físico e simetria baseada na proporção áurea.
                 </p>
             </div>
             
             <div className="flex flex-wrap items-center gap-4">
                 {/* Toggle View */}
                 <div className="flex bg-[#131B2C] p-1 rounded-lg border border-white/10 shadow-lg">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-primary text-[#0A0F1C] rounded text-xs font-bold transition-all shadow-sm hover:brightness-110">
                        <BarChart2 size={14} /> GRÁFICOS
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:text-white rounded text-xs font-bold transition-all hover:bg-white/5">
                        <List size={14} /> LISTA
                    </button>
                 </div>

                 {/* Time Filter */}
                 <div className="flex bg-[#131B2C] p-1 rounded-lg border border-white/10 shadow-lg">
                    {['3M', '6M', '1A', 'TOTAL'].map((p) => (
                        <button 
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all ${period === p ? 'bg-[#1E293B] text-white border border-white/10 shadow-sm' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                        >
                            {p}
                        </button>
                    ))}
                 </div>
            </div>
        </div>

        {/* 1. Main Evolution Chart */}
        <GlassPanel className="p-6 md:p-8 rounded-2xl relative overflow-hidden min-h-[400px]">
             <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        EVOLUÇÃO ÁUREA 
                        <Info size={14} className="text-gray-500" />
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Convergência para proporção ideal (1.618)</p>
                </div>
                
                 <div className="text-right z-10">
                     <div className="text-4xl font-bold text-primary tracking-tighter shadow-primary drop-shadow-[0_0_10px_rgba(0,201,167,0.3)]">1.602</div>
                     <div className="text-[10px] text-green-500 font-bold flex items-center justify-end gap-1">
                        <TrendingUp size={10} /> +0.04 vs mês anterior
                     </div>
                 </div>
             </div>

             {/* Proportion Selector */}
             <div className="relative z-20 mb-2">
                <div className="relative inline-block">
                    <select
                      value={selectedProportion}
                      onChange={(e) => setSelectedProportion(e.target.value)}
                      className="appearance-none bg-[#0A0F1C] border border-white/10 text-white text-xs font-bold py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:border-primary/50 cursor-pointer shadow-lg hover:bg-white/5 transition-colors"
                    >
                      {proportions.map((p) => (
                        <option key={p.id} value={p.id}>{p.label}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-primary">
                      <ChevronDown size={14} />
                    </div>
                </div>
             </div>

             <div className="w-full h-[300px] mt-2">
                <GoldenEvolutionChart />
             </div>
        </GlassPanel>

        {/* Row 2: Measures & Weight */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Raw Measures */}
            <GlassPanel className="p-6 rounded-2xl min-h-[300px]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">MEDIDAS BRUTAS</h3>
                    <div className="flex gap-3">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-gray-600"></span>
                            <span className="text-[10px] text-gray-400 font-bold">Peitoral</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            <span className="text-[10px] text-gray-400 font-bold">Braço</span>
                        </div>
                    </div>
                </div>
                <div className="w-full h-[200px] mt-4">
                    <MeasuresChart />
                </div>
            </GlassPanel>

            {/* Weight Evolution */}
            <GlassPanel className="p-6 rounded-2xl min-h-[300px]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">EVOLUÇÃO PESO</h3>
                    <div className="flex gap-3">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-white"></span>
                            <span className="text-[10px] text-gray-400 font-bold">Total</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            <span className="text-[10px] text-gray-400 font-bold">Magro</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-secondary"></span>
                            <span className="text-[10px] text-gray-400 font-bold">Gordo</span>
                        </div>
                    </div>
                </div>
                <div className="w-full h-[200px] mt-4">
                    <WeightChart />
                </div>
            </GlassPanel>
        </div>

        {/* Row 3: Body Fat & Asymmetry */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Body Fat */}
            <GlassPanel className="p-6 rounded-2xl flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">GORDURA CORPORAL %</h3>
                    <span className="px-2 py-0.5 rounded bg-secondary/10 text-secondary text-[10px] font-bold border border-secondary/20">-1.2%</span>
                </div>
                <BodyFatChart />
            </GlassPanel>

            {/* Asymmetry Scanner */}
            <GlassPanel className="p-6 rounded-2xl lg:col-span-2">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                         <Accessibility className="text-primary" size={20} />
                         <h3 className="text-sm font-bold text-white uppercase tracking-wider">SCANNER DE ASSIMETRIAS</h3>
                    </div>
                    <span className="text-[10px] text-gray-500 font-bold">Esq vs Dir (Desvio %)</span>
                </div>
                <AsymmetryScannerChart />
            </GlassPanel>

        </div>

      </div>
    </div>
  );
};