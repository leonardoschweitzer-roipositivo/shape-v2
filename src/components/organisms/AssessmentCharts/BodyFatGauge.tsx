import React from 'react';
interface BodyFatGaugeProps {
    value: number;
    method?: 'navy' | 'pollock';
    onMethodChange?: (method: 'navy' | 'pollock') => void;
    gender?: 'male' | 'female';
}

export const BodyFatGauge: React.FC<BodyFatGaugeProps> = ({
    value,
    method = 'navy',
    onMethodChange,
    gender = 'male'
}) => {
    // Standard BF categories according to gender
    const getLevelInfo = (val: number, g: 'male' | 'female') => {
        if (g === 'male') {
            if (val < 6) return { label: 'Essencial', color: '#9CA3AF' };
            if (val < 14) return { label: 'Nível Atleta', color: '#00C9A7' };
            if (val < 18) return { label: 'Fitness', color: '#3B82F6' };
            if (val < 25) return { label: 'Média', color: '#F59E0B' };
            if (val < 30) return { label: 'Acima da Média', color: '#EF4444' };
            return { label: 'Obesidade', color: '#B91C1C' };
        } else {
            // Female categories
            if (val < 12) return { label: 'Essencial', color: '#9CA3AF' };
            if (val < 21) return { label: 'Nível Atleta', color: '#00C9A7' };
            if (val < 25) return { label: 'Fitness', color: '#3B82F6' };
            if (val < 32) return { label: 'Média', color: '#F59E0B' };
            if (val < 39) return { label: 'Acima da Média', color: '#EF4444' };
            return { label: 'Obesidade', color: '#B91C1C' };
        }
    };

    const level = getLevelInfo(value, gender as 'male' | 'female');

    // Calculate gauge dasharray (semi-circle is approx 235 units long)
    // 0% to 50% range for display for females, 0% to 40% for males
    const maxRange = gender === 'female' ? 50 : 40;
    const percentage = Math.min(Math.max(value, 0), maxRange) / maxRange;
    const dashValue = percentage * 235;

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-6">
            <div className="w-full flex justify-between items-center mb-2">
                <h4 className="text-xs text-gray-400 font-bold uppercase tracking-widest">Gordura Corporal</h4>
                <div className="flex gap-1">
                    <button
                        onClick={() => onMethodChange?.('navy')}
                        className={`px-2 py-0.5 text-[9px] font-bold rounded transition-all ${method === 'navy'
                            ? 'bg-[#00C9A7] text-[#0A0F1C]'
                            : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                            }`}
                    >
                        NAVY
                    </button>
                    <button
                        onClick={() => onMethodChange?.('pollock')}
                        className={`px-2 py-0.5 text-[9px] font-bold rounded transition-all ${method === 'pollock'
                            ? 'bg-[#00C9A7] text-[#0A0F1C]'
                            : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                            }`}
                    >
                        POLLOCK 7
                    </button>
                </div>
            </div>

            <div className="relative w-48 h-24 mt-4 overflow-visible">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 200 110">
                    <path d="M 25 90 A 75 75 0 0 1 175 90" fill="none" stroke="#1F2937" strokeWidth="12" strokeLinecap="round" />
                    <path
                        d="M 25 90 A 75 75 0 0 1 175 90"
                        fill="none"
                        stroke={level.color}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${dashValue} 235`}
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                    <div className="text-3xl font-bold text-white tracking-tighter">
                        {value.toFixed(1)}<span className="text-sm text-gray-400">%</span>
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: level.color }}>
                        {level.label}
                    </div>
                </div>
            </div>

            <div className="w-full grid grid-cols-3 gap-2 mt-6 border-t border-white/5 pt-4">
                <div className="text-center">
                    <p className="text-[9px] text-gray-500 font-bold uppercase">Essencial</p>
                    <p className="text-xs font-bold text-white">{gender === 'male' ? '2-5%' : '10-13%'}</p>
                </div>
                <div className="text-center">
                    <p className="text-[9px] text-[#00C9A7] font-bold uppercase">Atleta</p>
                    <p className="text-xs font-bold text-[#00C9A7]">{gender === 'male' ? '6-13%' : '14-20%'}</p>
                </div>
                <div className="text-center">
                    <p className="text-[9px] text-gray-500 font-bold uppercase">Fitness</p>
                    <p className="text-xs font-bold text-white">{gender === 'male' ? '14-17%' : '21-24%'}</p>
                </div>
            </div>
        </div>
    );
};
