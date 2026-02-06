import React from 'react';

// --- SHARED HELPERS ---

export const GradientDefs = () => (
  <defs>
    <linearGradient id="grad-primary" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#00C9A7" stopOpacity="0.3" />
      <stop offset="100%" stopColor="#00C9A7" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="grad-secondary" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.3" />
      <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="grad-chart-purple" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#d8b4fe" />
    </linearGradient>
    <linearGradient id="grad-fill-purple" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.2"/>
        <stop offset="100%" stopColor="#7C3AED" stopOpacity="0"/>
    </linearGradient>
  </defs>
);

// 1. Golden Evolution Chart (Main)
export const GoldenEvolutionChart = () => {
  return (
    <div className="w-full h-full relative">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 300" preserveAspectRatio="none">
        <GradientDefs />
        
        {/* Grid Lines */}
        <line x1="0" y1="50" x2="1000" y2="50" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="4 4" />
        <line x1="0" y1="150" x2="1000" y2="150" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="4 4" />
        <line x1="0" y1="250" x2="1000" y2="250" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="4 4" />

        {/* Target Line (Golden Ratio 1.618) */}
        <line x1="0" y1="80" x2="1000" y2="80" stroke="#F59E0B" strokeWidth="2" strokeDasharray="6 4" strokeOpacity="0.8" />
        <text x="1000" y="80" fill="#F59E0B" fontSize="10" textAnchor="end" alignmentBaseline="middle" dx="20">PHI</text>

        {/* Data Line */}
        <path 
          d="M0 250 C 200 240, 400 200, 600 130 S 800 100, 1000 90" 
          fill="none" 
          stroke="#00C9A7" 
          strokeWidth="3" 
          strokeLinecap="round"
        />
        {/* Gradient Fill Area */}
        <path 
          d="M0 250 C 200 240, 400 200, 600 130 S 800 100, 1000 90 V 300 H 0 Z" 
          fill="url(#grad-primary)" 
          stroke="none"
        />

        {/* Points */}
        <circle cx="280" cy="225" r="4" fill="#0A0F1C" stroke="#00C9A7" strokeWidth="2" />
        <circle cx="560" cy="145" r="4" fill="#0A0F1C" stroke="#00C9A7" strokeWidth="2" />
        <circle cx="980" cy="91" r="5" fill="#00C9A7" stroke="#fff" strokeWidth="2" />

      </svg>
      
      {/* X Axis Labels */}
      <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-4 absolute bottom-0 w-full translate-y-6">
        <span>Jan</span>
        <span>Fev</span>
        <span>Mar</span>
        <span>Abr</span>
        <span>Mai</span>
        <span>Jun</span>
      </div>
    </div>
  );
};

// 2. Raw Measures Chart
export const MeasuresChart = () => {
  return (
    <div className="w-full h-full relative">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 400 200" preserveAspectRatio="none">
        {/* Chest Line (Grey) */}
        <path 
          d="M0 160 Q 100 150, 200 140 T 400 110" 
          fill="none" 
          stroke="#4B5563" 
          strokeWidth="2" 
        />
        
        {/* Arm Line (Teal) */}
        <path 
          d="M0 180 Q 150 170, 250 150 T 400 100" 
          fill="none" 
          stroke="#00C9A7" 
          strokeWidth="3" 
        />

        {/* Tooltip Simulation */}
        <line x1="300" y1="0" x2="300" y2="200" stroke="white" strokeOpacity="0.1" strokeDasharray="2 2" />
        <g transform="translate(300, 120)">
            <rect x="-25" y="-30" width="50" height="20" rx="4" fill="#1F2937" stroke="rgba(255,255,255,0.1)" />
            <text x="0" y="-16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">42.5cm</text>
        </g>
      </svg>
      
      <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-2 absolute bottom-0 w-full translate-y-5">
        <span>Jan</span>
        <span>Mar</span>
        <span>Mai</span>
        <span>Jun</span>
      </div>
    </div>
  );
};

// 3. Weight Evolution Chart
export const WeightChart = () => {
  return (
     <div className="w-full h-full relative">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 400 200" preserveAspectRatio="none">
        {/* Total Weight (Dashed White) */}
        <path 
          d="M0 100 L 400 110" 
          fill="none" 
          stroke="white" 
          strokeWidth="1.5" 
          strokeDasharray="4 4"
          strokeOpacity="0.5"
        />
        
        {/* Lean Mass (Teal) */}
        <path 
          d="M0 140 L 400 115" 
          fill="none" 
          stroke="#00C9A7" 
          strokeWidth="2" 
        />

        {/* Fat Mass (Purple) */}
        <path 
          d="M0 180 L 400 190" 
          fill="none" 
          stroke="#7C3AED" 
          strokeWidth="2" 
        />

        {/* Current Weight Label */}
        <text x="400" y="90" textAnchor="end" fill="white" fontSize="24" fontWeight="bold">88.5 <tspan fontSize="12" fill="#9CA3AF" fontWeight="normal">kg</tspan></text>
      </svg>
    </div>
  );
};

// 4. Body Fat Sparkline
export const BodyFatChart = () => {
  return (
    <div className="w-full h-[120px] relative mt-2">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
        <GradientDefs />
         <path 
          d="M0 20 L 400 60" 
          fill="none" 
          stroke="url(#grad-chart-purple)" 
          strokeWidth="3"
        />
        <path 
          d="M0 20 L 400 60 V 100 H 0 Z" 
          fill="url(#grad-fill-purple)" 
          stroke="none"
        />
        <circle cx="400" cy="60" r="4" fill="#7C3AED" stroke="#fff" strokeWidth="1" />
      </svg>
      <div className="flex justify-between items-end mt-2">
         <div className="text-4xl font-bold text-white tracking-tighter">10.5<span className="text-lg text-gray-500 ml-0.5">%</span></div>
         <div className="text-xs text-gray-500 font-medium mb-1">Meta: 8.0%</div>
      </div>
    </div>
  );
};

// 5. Asymmetry Scanner Chart
export const AsymmetryScannerChart = () => {
    // Data: + is Right dominance (Green), - is Left dominance (Red)
    const data = [
        { month: 'JAN', val: 20 },
        { month: 'FEV', val: 5 },
        { month: 'MAR', val: 5 },
        { month: 'ABR', val: -30 },
        { month: 'MAI', val: 10 },
        { month: 'JUN', val: -5 },
    ];

    return (
        <div className="w-full h-[150px] relative mt-8 flex flex-col justify-end">
            <div className="relative w-full h-full flex items-center">
                {/* Center Axis */}
                <div className="absolute w-full h-[1px] bg-gray-700"></div>
                
                {/* Bars */}
                <div className="w-full flex justify-between px-4 relative z-10 h-full items-center">
                    {data.map((d, i) => (
                        <div key={i} className="flex flex-col items-center group cursor-pointer">
                            <div className="relative h-[100px] w-4 flex items-center justify-center">
                                <div 
                                    className={`w-3 rounded-full transition-all duration-300 ${d.val > 0 ? 'bg-primary shadow-[0_0_10px_rgba(0,201,167,0.4)]' : 'bg-red-400/80 shadow-[0_0_10px_rgba(248,113,113,0.3)]'}`}
                                    style={{ 
                                        height: `${Math.abs(d.val)}%`,
                                        marginBottom: d.val > 0 ? `${Math.abs(d.val)}%` : '0',
                                        marginTop: d.val < 0 ? `${Math.abs(d.val)}%` : '0'
                                    }}
                                ></div>
                            </div>
                            <span className="text-[10px] text-gray-500 font-bold uppercase mt-2">{d.month}</span>
                            
                            {/* Hover Tooltip */}
                            <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 border border-white/10 px-2 py-1 rounded text-[10px] whitespace-nowrap z-20 pointer-events-none">
                                {d.val > 0 ? `Dir +${d.val}%` : `Esq ${d.val}%`}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};