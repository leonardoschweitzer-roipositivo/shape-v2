import React from 'react';
import { Target, Dumbbell, Scale, Flame } from 'lucide-react';
import { EditableField } from '@/components/atoms/EditableField/EditableField';
import { type PlanoDieta } from '@/services/calculations/dieta';
import { InsightBox } from '../PlanoEvolucaoShared';

interface EstrategiaCaloricaSectionProps {
    plano: PlanoDieta;
    isEditing: boolean;
    editPlano: PlanoDieta | null;
    updateDietField: <K extends keyof PlanoDieta>(field: K, value: PlanoDieta[K]) => void;
    iaEnriching: boolean;
}

export const EstrategiaCaloricaSection: React.FC<EstrategiaCaloricaSectionProps> = ({
    plano,
    isEditing,
    editPlano,
    updateDietField,
    iaEnriching,
}) => {
    const activePlano = isEditing ? editPlano : plano;
    
    // Fase Coloring
    const faseColor = (fase: string) => {
        if (fase === 'CUTTING') return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
        if (fase === 'BULKING') return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    };

    const isDeficit = plano.deficit > 0;
    const isSurplus = plano.deficit < 0;
    
    // Waterfall calculation limits (max width 100%)
    const maxBarValue = Math.max(plano.tdee * 1.3, plano.calMediaSemanal * 1.1);
    const tdeeWidth = `${(plano.tdee / maxBarValue) * 100}%`;
    const diffWidth = `${(Math.abs(plano.deficit) / maxBarValue) * 100}%`;
    
    // Slope Chart Helpers
    const pesoStart = plano.projecaoMensal?.pesoInicial ?? 0;
    const pesoEnd = plano.projecaoMensal?.pesoFinal ?? 0;
    const pesoDiff = pesoEnd - pesoStart;
    const isGewichtLoss = pesoDiff < 0;

    const bfStart = plano.projecaoMensal?.bfInicial ?? 0;
    const bfEnd = plano.projecaoMensal?.bfFinal ?? 0;
    const bfDiff = bfEnd - bfStart;
    const isBfLoss = bfDiff < 0;

    return (
        <>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold uppercase tracking-widest mb-6 ${faseColor(activePlano!.fase)}`}>
                <Target size={14} /> {activePlano!.faseLabel}
            </div>

            {/* A. WATERFALL GAUGE (Balanço) */}
            <div className="bg-white/[0.03] rounded-xl border border-white/5 p-6 mb-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-6 font-bold flex items-center gap-2">
                    <Flame size={12} className="text-primary"/> Cálculo do Balanço Energético
                </p>
                
                <div className="mb-8">
                    {/* Visual Waterfall */}
                    <div className="relative h-10 w-full bg-white/5 rounded-lg overflow-hidden flex mb-3 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]">
                        {/* Base TDEE Segment */}
                        <div 
                            className="h-full bg-blue-500/30 border-r border-blue-400/50 flex items-center px-3"
                            style={{ width: tdeeWidth }}
                        >
                            <span className="text-xs font-bold text-blue-200 opacity-80 mix-blend-screen hidden sm:inline">TDEE</span>
                        </div>
                        
                        {/* Difference Segment (Only if there is a surplus, if deficit it overlaps backward) */}
                        {isSurplus && (
                            <div 
                                className="h-full bg-emerald-500/40 relative overflow-hidden"
                                style={{ width: diffWidth }}
                            >
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[shimmer_2s_linear_infinite]" />
                            </div>
                        )}
                        
                        {/* Deficit overlap - visual trick: absolute positioning over TDEE bar */}
                        {isDeficit && (
                            <div 
                                className="absolute top-0 bottom-0 right-0 bg-rose-500/40 border-l border-rose-400/50 backdrop-blur-sm"
                                style={{ width: diffWidth, left: `calc(${tdeeWidth} - ${diffWidth})` }}
                            >
                               <div className="absolute inset-0 bg-[linear-gradient(-45deg,transparent_25%,rgba(0,0,0,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:10px_10px]" />
                            </div>
                        )}
                    </div>
                    
                    {/* Legenda Flexível */}
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <p className="text-xs text-blue-300 font-medium">Gasto Diário (TDEE)</p>
                            <p className="text-lg font-bold text-white">{plano.tdee.toLocaleString('pt-BR')} <span className="text-sm font-normal text-gray-500">kcal</span></p>
                        </div>
                        
                        <div className="text-center px-4">
                            <p className={`text-[10px] uppercase font-bold tracking-wider mb-1 ${isDeficit ? 'text-rose-400' : 'text-emerald-400'}`}>
                                {isDeficit ? 'Déficit' : 'Superávit'} ({plano.deficitPct}%)
                            </p>
                            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-bold ${isDeficit ? 'bg-rose-500/10 text-rose-300' : 'bg-emerald-500/10 text-emerald-300'}`}>
                                {isDeficit ? '-' : '+'}{Math.abs(plano.deficit)} kcal
                            </div>
                        </div>
                        
                        <div className="text-right space-y-1">
                            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Meta Diária</p>
                            <p className="text-3xl font-black text-white">{plano.calMediaSemanal.toLocaleString('pt-BR')} <span className="text-sm font-normal text-gray-500">kcal</span></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/[0.03] rounded-xl border border-white/5 p-5 relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Dumbbell size={80} />
                    </div>
                    <div className="flex items-center gap-2 mb-3 relative z-10">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                            <Dumbbell size={12} className="text-primary" />
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dias de Treino</p>
                    </div>
                    {isEditing ? (
                        <EditableField
                            type="number"
                            isEditing
                            value={editPlano?.calDiasTreino ?? 0}
                            onChange={(v) => updateDietField('calDiasTreino', v)}
                            min={800}
                            max={6000}
                            step={50}
                            suffix=" kcal"
                            inputClassName="text-2xl font-black relative z-10"
                        />
                    ) : (
                        <p className="text-3xl font-black text-white relative z-10">{activePlano!.calDiasTreino.toLocaleString('pt-BR')}</p>
                    )}
                    <p className="text-xs font-medium text-gray-500 mt-1 relative z-10">kcal · {activePlano!.frequenciaSemanal ?? 4}x/sem · +carbs</p>
                </div>
                
                <div className="bg-white/[0.03] rounded-xl border border-white/5 p-5 relative overflow-hidden group">
                     <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Scale size={80} />
                    </div>
                    <div className="flex items-center gap-2 mb-3 relative z-10">
                        <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                            <Scale size={12} className="text-gray-400" />
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dias de Descanso</p>
                    </div>
                    {isEditing ? (
                        <EditableField
                            type="number"
                            isEditing
                            value={editPlano?.calDiasDescanso ?? 0}
                            onChange={(v) => updateDietField('calDiasDescanso', v)}
                            min={800}
                            max={6000}
                            step={50}
                            suffix=" kcal"
                            inputClassName="text-2xl font-black relative z-10"
                        />
                    ) : (
                        <p className="text-3xl font-black text-white relative z-10">{activePlano!.calDiasDescanso.toLocaleString('pt-BR')}</p>
                    )}
                    <p className="text-xs font-medium text-gray-500 mt-1 relative z-10">kcal · {7 - (activePlano!.frequenciaSemanal ?? 4)}x/sem · -carbs</p>
                </div>
            </div>

            {/* B. MINI-SLOPE CHARTS (Projeção) */}
            <div className="bg-white/[0.02] rounded-xl border border-white/5 p-6 mb-4">
                <div className="flex justify-between items-center mb-6">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Projeção p/ 4 Semanas</p>
                    <div className="flex gap-4">
                        <div className="text-right">
                            <p className="text-[9px] text-gray-600 uppercase tracking-wider mb-0.5">Déficit/Soma Semanal</p>
                            <p className="text-xs font-bold text-gray-400">~{plano?.deficitSemanal?.toLocaleString('pt-BR')} kcal</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] text-gray-600 uppercase tracking-wider mb-0.5">Ritmo Estimado</p>
                            <p className={`text-xs font-bold ${isDeficit ? 'text-rose-400' : 'text-emerald-400'}`}>
                                ~{plano?.projecaoMensal?.perdaGorduraKg} kg/mês
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                    {/* Slope 1: PESO */}
                    <div className="relative">
                        <p className="text-xs font-bold text-white mb-4">Peso Corporal</p>
                        
                        <div className="relative h-24 w-full border-b border-l border-white/10 pt-2 pb-2 pl-2">
                            {/* Y-axis labels */}
                            <span className="absolute -left-2 top-0 text-[9px] text-gray-600 -translate-x-full">{Math.max(pesoStart, pesoEnd) + 1}</span>
                            <span className="absolute -left-2 bottom-0 text-[9px] text-gray-600 -translate-x-full">{Math.min(pesoStart, pesoEnd) - 1}</span>
                            
                            {/* Slope Line SVG */}
                            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                <path 
                                    d={`M 0,${isGewichtLoss ? '20' : '80'} L 100%,${isGewichtLoss ? '80' : '20'}`} 
                                    stroke={isGewichtLoss ? '#fb7185' : '#34d399'} 
                                    strokeWidth="3" 
                                    fill="none" 
                                    strokeLinecap="round"
                                />
                                {/* Dots */}
                                <circle cx="0" cy={isGewichtLoss ? '20' : '80'} r="4" fill={isGewichtLoss ? '#fb7185' : '#34d399'} stroke="#111" strokeWidth="2" />
                                <circle cx="100%" cy={isGewichtLoss ? '80' : '20'} r="4" fill={isGewichtLoss ? '#fb7185' : '#34d399'} stroke="#111" strokeWidth="2" />
                            </svg>
                        </div>
                        
                        <div className="flex justify-between mt-2 px-2 text-xs font-medium">
                            <div>
                                <span className="text-gray-500 mr-2 text-[10px]">Semana 0</span>
                                <span className="text-white">{pesoStart.toFixed(1)}kg</span>
                            </div>
                            <div className="text-right">
                                <span className="text-white">{pesoEnd.toFixed(1)}kg</span>
                                <span className="text-gray-500 ml-2 text-[10px]">Semana 4</span>
                            </div>
                        </div>
                        
                        <div className={`absolute top-0 right-0 px-2 py-0.5 rounded text-[10px] font-bold ${isGewichtLoss ? 'text-rose-400 bg-rose-500/10' : 'text-emerald-400 bg-emerald-500/10'}`}>
                            {pesoDiff > 0 ? '+' : ''}{pesoDiff.toFixed(1)} kg {isGewichtLoss ? '↘' : '↗'}
                        </div>
                    </div>

                    {/* Slope 2: BF */}
                    <div className="relative">
                        <p className="text-xs font-bold text-white mb-4">Body Fat (Gordura)</p>
                        
                        <div className="relative h-24 w-full border-b border-l border-white/10 pt-2 pb-2 pl-2">
                             {/* Y-axis labels */}
                             <span className="absolute -left-2 top-0 text-[9px] text-gray-600 -translate-x-full">{Math.max(bfStart, bfEnd) + 1}%</span>
                             <span className="absolute -left-2 bottom-0 text-[9px] text-gray-600 -translate-x-full">{Math.min(bfStart, bfEnd) - 1}%</span>
                             
                            {/* Slope Line SVG */}
                            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                <path 
                                    d={`M 0,${isBfLoss ? '20' : '80'} L 100%,${isBfLoss ? '80' : '20'}`} 
                                    stroke={isBfLoss ? '#fb7185' : '#f59e0b'} // amber se ganhar bf (ruim geralmente)
                                    strokeWidth="3" 
                                    fill="none" 
                                    strokeLinecap="round"
                                />
                                <circle cx="0" cy={isBfLoss ? '20' : '80'} r="4" fill={isBfLoss ? '#fb7185' : '#f59e0b'} stroke="#111" strokeWidth="2" />
                                <circle cx="100%" cy={isBfLoss ? '80' : '20'} r="4" fill={isBfLoss ? '#fb7185' : '#f59e0b'} stroke="#111" strokeWidth="2" />
                            </svg>
                        </div>
                        
                        <div className="flex justify-between mt-2 px-2 text-xs font-medium">
                            <div>
                                <span className="text-gray-500 mr-2 text-[10px]">Hoje</span>
                                <span className="text-white">{bfStart.toFixed(1)}%</span>
                            </div>
                            <div className="text-right">
                                <span className="text-white">{bfEnd.toFixed(1)}%</span>
                                <span className="text-gray-500 ml-2 text-[10px]">Mês 1</span>
                            </div>
                        </div>
                        
                        <div className={`absolute top-0 right-0 px-2 py-0.5 rounded text-[10px] font-bold ${isBfLoss ? 'text-rose-400 bg-rose-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
                            {bfDiff > 0 ? '+' : ''}{bfDiff.toFixed(1)}% {isBfLoss ? '↘' : '↗'}
                        </div>
                    </div>
                </div>
            </div>

            <InsightBox isLoading={iaEnriching} text={plano.insightsPorSecao?.estrategia || plano.estrategiaPrincipal} />
        </>
    );
};
