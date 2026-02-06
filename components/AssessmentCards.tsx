import React from 'react';
import { Utensils, Dumbbell, ArrowUpRight, ArrowDownRight, Trophy } from 'lucide-react';
import { GlassPanel } from './GlassPanel';

// --- MASS CARD ---
export const MassCard: React.FC<{ label: string; value: number; unit: string; trend: number; color?: 'green' | 'red' | 'purple' }> = ({ label, value, unit, trend, color = 'green' }) => {
  const isPositive = trend > 0;
  const colorClass = color === 'green' ? 'text-primary' : color === 'red' ? 'text-red-400' : 'text-secondary';
  const bgClass = color === 'green' ? 'bg-primary/10' : color === 'red' ? 'bg-red-400/10' : 'bg-secondary/10';
  
  return (
    <GlassPanel className="p-5 rounded-xl flex flex-col justify-between relative overflow-hidden">
       <div className="flex justify-between items-start z-10">
          <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{label}</h4>
          {label === "Peso Gordo" ? <Utensils size={14} className="text-gray-600"/> : <Dumbbell size={14} className="text-gray-600"/>}
       </div>
       
       <div className="z-10 mt-2">
          <div className="flex items-baseline gap-1">
             <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
             <span className="text-xs text-gray-500 font-medium">{unit}</span>
          </div>
       </div>

       <div className="mt-4 flex items-center justify-between z-10">
          <div className="h-6 w-16 flex items-end gap-1">
             <div className={`w-1/4 rounded-t-sm opacity-20 ${color === 'red' ? 'bg-red-400 h-[80%]' : 'bg-primary h-[40%]'}`}></div>
             <div className={`w-1/4 rounded-t-sm opacity-40 ${color === 'red' ? 'bg-red-400 h-[60%]' : 'bg-primary h-[60%]'}`}></div>
             <div className={`w-1/4 rounded-t-sm opacity-60 ${color === 'red' ? 'bg-red-400 h-[50%]' : 'bg-primary h-[70%]'}`}></div>
             <div className={`w-1/4 rounded-t-sm ${color === 'red' ? 'bg-red-400 h-[40%]' : 'bg-primary h-[90%]'}`}></div>
          </div>

          <div className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold ${bgClass} ${colorClass}`}>
             {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
             <span>{Math.abs(trend)}%</span>
          </div>
       </div>
    </GlassPanel>
  );
};

// --- PROPORTION CARD ---
interface ProportionCardProps {
  title: string;
  badge: string;
  metrics: { label: string; value: string }[];
  currentValue: number | string;
  valueUnit?: string;
  valueLabel?: string;
  description: string;
  statusLabel: string;
  userPosition: number; // 0-100%
  goalPosition: number; // 0-100%
  goalLabel?: string;
  image: string;
  overlayStyle?: 'v-taper' | 'chest' | 'arm' | 'triad' | 'waist' | 'legs';
}

export const ProportionCard: React.FC<ProportionCardProps> = ({
  title, badge, metrics, currentValue, valueUnit, valueLabel, description, statusLabel, userPosition, goalPosition, goalLabel = "GOLDEN", image, overlayStyle
}) => {
  return (
    <GlassPanel className="rounded-2xl overflow-hidden border border-white/5 flex flex-col md:flex-row h-auto md:h-72" hoverEffect={false}>
      {/* Visual Section */}
      <div className="w-full md:w-1/3 relative bg-[#050810] flex items-center justify-center overflow-hidden group">
        <div className="absolute inset-0 flex items-center justify-center bg-[#050810]">
           <img 
               src={image} 
               alt={title}
               className="h-full w-full object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
           />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#050810]/20 to-[#131B2C]/90"></div>
        
        {/* Anatomy Overlays - Simplified for readability */}
        <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
             {/* Note: In a full refactor, these specific overlays could be their own components, but kept here for brevity */}
            {overlayStyle === 'v-taper' && (
                <div className="flex flex-col items-center gap-12 w-full px-8 mt-4">
                     <div className="w-full border-t border-dashed border-white/60 relative"></div>
                     <div className="h-20 w-full border-x border-blue-500/30 rounded-[50%]"></div>
                     <div className="w-2/3 border-t border-dashed border-blue-400 relative"></div>
                </div>
            )}
            {/* ... other overlay styles ... */}
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-900/40 border border-blue-500/30 rounded text-[10px] font-bold text-blue-400 uppercase tracking-widest backdrop-blur-sm">
                {badge}
            </div>
        </div>
      </div>

      {/* Data Section */}
      <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col justify-between relative">
         <div className="flex justify-between items-start">
             <div>
                 <span className="inline-block px-2 py-0.5 rounded bg-white/5 border border-white/10 text-primary text-[10px] font-bold uppercase tracking-wider mb-2">
                     {badge}
                 </span>
                 <h3 className="text-3xl font-bold text-white mb-2">{title}</h3>
                 <div className="flex gap-2">
                     {metrics.map((m, i) => (
                         <span key={i} className="bg-[#0A0F1C] px-3 py-1 rounded text-xs text-gray-400 border border-white/5 font-mono">
                             <span className="text-gray-500 mr-1">{m.label}:</span>
                             <strong className="text-gray-200">{m.value}</strong>
                         </span>
                     ))}
                 </div>
             </div>
             <div className="text-right">
                 <div className="text-4xl font-bold text-blue-400 tracking-tighter">
                     {currentValue}
                     {valueUnit && <span className="text-lg text-blue-500/50 ml-1">{valueUnit}</span>}
                 </div>
                 {valueLabel && <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">{valueLabel}</div>}
             </div>
         </div>

         <div className="my-6 relative">
             <div className="w-full h-3 bg-[#0A0F1C] rounded-full flex overflow-hidden border border-white/5 relative">
                 <div className="w-[20%] h-full bg-blue-900/30 border-r border-background-dark/50"></div>
                 <div className="w-[20%] h-full bg-blue-800/40 border-r border-background-dark/50"></div>
                 <div className="w-[20%] h-full bg-blue-600/50 border-r border-background-dark/50"></div>
                 <div className="w-[20%] h-full bg-blue-500/60 border-r border-background-dark/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>
                 <div className="w-[20%] h-full bg-indigo-500/60"></div>
             </div>
             
             <div className="flex justify-between text-[9px] text-gray-600 mt-2 uppercase font-bold tracking-widest px-1">
                 <span className="w-[20%] text-center">Bloco</span>
                 <span className="w-[20%] text-center">Normal</span>
                 <span className="w-[20%] text-center">Atlético</span>
                 <span className="w-[20%] text-center text-blue-400">Estético</span>
                 <span className="w-[20%] text-center opacity-50">Freak</span>
             </div>

             <div className="absolute top-[-20px]" style={{ left: `${userPosition}%`, transform: 'translateX(-50%)' }}>
                 <div className="px-1.5 py-0.5 bg-white text-[#0A0F1C] text-[9px] font-bold rounded mb-1 whitespace-nowrap">VOCÊ</div>
                 <div className="w-4 h-4 rounded-full bg-white border-4 border-[#0A0F1C] shadow-[0_0_10px_rgba(255,255,255,0.5)] mx-auto"></div>
             </div>

             <div className="absolute top-[-20px]" style={{ left: `${goalPosition}%`, transform: 'translateX(-50%)' }}>
                 <div className="flex flex-col items-center">
                    <Trophy size={10} className="text-yellow-400 mb-0.5" />
                    <div className="text-[8px] font-bold text-yellow-400 uppercase tracking-widest">{goalLabel}</div>
                    <div className="w-0.5 h-6 bg-yellow-400/50 mt-1 border-r border-dashed border-yellow-200"></div>
                 </div>
             </div>
         </div>

         <div className="flex justify-between items-end">
             <p className="text-xs text-gray-400 max-w-md leading-relaxed">
                 {description}
             </p>
             <button className="px-4 py-2 bg-[#0A0F1C] border border-blue-500/30 text-blue-400 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-blue-500/10 transition-colors">
                 {statusLabel}
             </button>
         </div>
      </div>
    </GlassPanel>
  );
};

// --- ASYMMETRY CARD ---
interface AsymmetryCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  leftVal: string;
  rightVal: string;
  diff: string;
  status: 'high' | 'moderate' | 'symmetrical';
}

export const AsymmetryCard: React.FC<AsymmetryCardProps> = ({ icon, title, subtitle, leftVal, rightVal, diff, status }) => {
  const statusConfig = {
    high: {
      text: 'ASSIMETRIA ALTA',
      badgeClass: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
    },
    moderate: {
      text: 'ASSIMETRIA MODERADA',
      badgeClass: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
    },
    symmetrical: {
      text: 'SIMÉTRICO',
      badgeClass: 'text-primary border-primary/30 bg-primary/10',
    }
  };

  const config = statusConfig[status];
  const isRightHeavy = parseFloat(rightVal.replace(',', '.')) > parseFloat(leftVal.replace(',', '.'));
  const isBalanced = status === 'symmetrical';

  return (
    <GlassPanel className="p-5 rounded-2xl border border-white/5 flex flex-col gap-4 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-full bg-[#131B2C] border border-white/10 flex items-center justify-center text-gray-400">
              {icon}
           </div>
           <div>
             <h4 className="text-white font-bold text-sm tracking-wide">{title}</h4>
             <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">{subtitle}</p>
           </div>
        </div>
        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${config.badgeClass}`}>
          {config.text}
        </span>
      </div>

      <div className="flex items-center justify-between mt-2 gap-4">
         <div className="text-center w-24">
            <div className="text-2xl font-bold text-secondary tracking-tight">{leftVal} <span className="text-xs text-gray-500 font-normal">cm</span></div>
            <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Esquerdo</div>
         </div>

         <div className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full h-2.5 bg-[#0A0F1C] rounded-full relative overflow-hidden flex items-center border border-white/5">
                <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-gray-600 z-10"></div>
                {!isBalanced && (
                    <div 
                      className={`h-full rounded-full absolute ${isRightHeavy ? 'right-1/2 origin-left bg-primary' : 'left-1/2 -translate-x-full origin-right bg-secondary'}`}
                      style={{ width: status === 'high' ? '40%' : '15%' }} 
                    ></div>
                )}
                {isBalanced && (
                   <div className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_rgba(0,201,167,0.8)]"></div>
                )}
            </div>
            
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${config.badgeClass} border-none`}>
              {status === 'symmetrical' ? '0,0 cm' : `${diff} cm`}
            </span>
         </div>

         <div className="text-center w-24">
            <div className="text-2xl font-bold text-primary tracking-tight">{rightVal} <span className="text-xs text-gray-500 font-normal">cm</span></div>
            <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Direito</div>
         </div>
      </div>
    </GlassPanel>
  );
};