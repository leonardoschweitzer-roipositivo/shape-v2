import React from 'react';

export const BodyFatGauge: React.FC = () => {
    return (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-6">
            <div className="w-full flex justify-between items-center mb-2">
                <h4 className="text-xs text-gray-400 font-bold uppercase tracking-widest">Gordura Corporal</h4>
                <div className="flex gap-1">
                    <span className="px-2 py-0.5 bg-[#00C9A7] text-[#0A0F1C] text-[9px] font-bold rounded">NAVY</span>
                    <span className="px-2 py-0.5 bg-white/5 text-gray-400 text-[9px] font-bold rounded border border-white/10">POLLOCK 7</span>
                </div>
            </div>

            <div className="relative w-48 h-24 mt-4 overflow-visible">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 200 110">
                    <path d="M 25 90 A 75 75 0 0 1 175 90" fill="none" stroke="#1F2937" strokeWidth="12" strokeLinecap="round" />
                    <path d="M 25 90 A 75 75 0 0 1 175 90" fill="none" stroke="#00C9A7" strokeWidth="12" strokeLinecap="round" strokeDasharray="60 235" />
                </svg>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                    <div className="text-3xl font-bold text-white tracking-tighter">12.9<span className="text-sm text-gray-400">%</span></div>
                    <div className="text-[10px] text-[#00C9A7] font-bold uppercase tracking-wider mt-1">Nível Atleta</div>
                </div>
            </div>

            <div className="w-full grid grid-cols-3 gap-2 mt-6 border-t border-white/5 pt-4">
                <div className="text-center">
                    <p className="text-[9px] text-gray-500 font-bold uppercase">Essencial</p>
                    <p className="text-xs font-bold text-white">2-5%</p>
                </div>
                <div className="text-center">
                    <p className="text-[9px] text-[#00C9A7] font-bold uppercase">Atleta</p>
                    <p className="text-xs font-bold text-[#00C9A7]">6-13%</p>
                </div>
                <div className="text-center">
                    <p className="text-[9px] text-gray-500 font-bold uppercase">Fitness</p>
                    <p className="text-xs font-bold text-white">14-17%</p>
                </div>
            </div>
        </div>
    );
};
