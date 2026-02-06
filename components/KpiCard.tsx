import React from 'react';
import { Calculator } from 'lucide-react';
import { GlassPanel } from './GlassPanel';

export const RatioCard: React.FC = () => {
  return (
    <GlassPanel className="p-6 rounded-2xl flex flex-col justify-between h-auto min-h-[300px] relative overflow-hidden">
      <div className="flex items-start justify-between mb-4 z-10">
        <div>
          <h4 className="text-xs text-gray-400 font-bold uppercase tracking-widest">Shape-V Ratio</h4>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-5xl font-bold text-white tracking-tight">1.56</span>
            <span className="text-sm font-medium text-gray-500">/ 1.618</span>
          </div>
        </div>
        <div className="p-2.5 bg-primary/10 rounded-xl text-primary border border-primary/10">
          <Calculator size={24} />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-end gap-3 z-10">
        <div className="flex justify-between text-[10px] text-gray-500 mb-1 font-bold tracking-wider">
          <span>INÍCIO</span>
          <span>GOLDEN</span>
        </div>
        
        {/* Custom Progress Bar */}
        <div className="w-full h-4 bg-[#0F1623] rounded-full overflow-hidden relative flex border border-white/5">
          <div className="h-full bg-gray-700 w-[20%] border-r border-background-dark/50"></div>
          <div className="h-full bg-gray-600 w-[20%] border-r border-background-dark/50"></div>
          <div className="h-full bg-secondary/80 w-[20%] border-r border-background-dark/50"></div>
          <div className="h-full bg-primary w-[20%] border-r border-background-dark/50 shadow-[0_0_15px_rgba(0,201,167,0.5)]"></div>
          <div className="h-full bg-purple-500 w-[20%]"></div>
          <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(255,255,255,1)] z-20" style={{ left: '78%' }}></div>
        </div>
        
        <div className="flex justify-between text-[9px] text-gray-500 mt-1 uppercase font-bold tracking-widest">
          <span className="w-[20%] text-center opacity-30">Bloco</span>
          <span className="w-[20%] text-center opacity-30">Normal</span>
          <span className="w-[20%] text-center opacity-60">Atlético</span>
          <span className="w-[20%] text-center text-primary">Estético</span>
          <span className="w-[20%] text-center opacity-30">Freak</span>
        </div>
        
        <p className="text-xs text-center text-gray-400 mt-4 border-t border-white/5 pt-4">
          Você está a <span className="text-white font-bold">0.058</span> do índice perfeito.
        </p>
      </div>
      
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
    </GlassPanel>
  );
};

export const HeatmapCard: React.FC = () => {
  return (
    <GlassPanel className="p-6 rounded-2xl flex flex-col items-center relative overflow-hidden min-h-[300px]">
      <h4 className="text-xs text-gray-400 font-bold uppercase tracking-widest self-start z-10">Mapa de Calor Corporal</h4>
      
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="w-48 h-48 bg-primary/30 rounded-full blur-3xl"></div>
      </div>
      
      <div className="flex-1 flex items-center justify-center w-full z-10 relative mt-4">
        <div className="relative h-48 w-32 flex flex-col items-center">
          <div className="w-32 h-10 rounded-full bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 border border-primary/40 shadow-[0_0_15px_rgba(0,201,167,0.2)] mb-2 relative">
             <div className="absolute -right-16 top-0 transform translate-y-1/2 flex items-center">
                <div className="h-[1px] w-8 bg-primary/50"></div>
                <div className="px-2 py-1 bg-[#0F1623] border border-primary/40 rounded text-[10px] text-primary font-bold shadow-lg whitespace-nowrap">
                  Ombros +2cm
                </div>
             </div>
          </div>
          <div className="w-24 h-16 rounded-2xl bg-secondary/10 border border-secondary/20 mb-2"></div>
          <div className="w-16 h-12 rounded-xl bg-gray-700/20 border border-gray-600/30 relative">
             <div className="absolute -left-16 bottom-2 flex items-center justify-end w-16">
                <div className="px-2 py-1 bg-[#0F1623] border border-red-500/40 rounded text-[10px] text-red-400 font-bold shadow-lg whitespace-nowrap">
                  Cintura -1cm
                </div>
                <div className="h-[1px] w-4 bg-red-500/40"></div>
             </div>
          </div>
          <div className="absolute top-0 bottom-0 w-[1px] bg-primary/20 border-r border-dashed border-primary/30 left-1/2 -translate-x-1/2"></div>
        </div>
      </div>
    </GlassPanel>
  );
};

export const ScoreCard: React.FC = () => {
  return (
    <GlassPanel className="p-6 rounded-2xl flex flex-col min-h-[300px]">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-xs text-gray-400 font-bold uppercase tracking-widest">Avaliação Geral</h4>
        <span className="px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold border border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]">
          +5% vs Mês Anterior
        </span>
      </div>
      
      <div className="flex-1 flex items-center justify-center relative">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="50%" cy="50%" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
            <circle cx="50%" cy="50%" r="70" fill="none" stroke="url(#gradient)" strokeWidth="12" strokeDasharray="440" strokeDashoffset="88" strokeLinecap="round" className="drop-shadow-[0_0_10px_rgba(0,201,167,0.3)]" />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00C9A7" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-[#151c2e] shadow-[inset_5px_5px_10px_rgba(0,0,0,0.5),inset_-5px_-5px_10px_rgba(255,255,255,0.02)] flex flex-col items-center justify-center border border-white/5">
                <span className="text-5xl font-bold text-white tracking-tighter">80</span>
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Pontos</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-2 grid grid-cols-2 gap-3 text-center">
        <div className="bg-white/5 rounded-lg p-2 border border-white/5">
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Simetria</p>
          <p className="text-sm font-bold text-primary">A+</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2 border border-white/5">
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Proporção</p>
          <p className="text-sm font-bold text-secondary">B</p>
        </div>
      </div>
    </GlassPanel>
  );
};