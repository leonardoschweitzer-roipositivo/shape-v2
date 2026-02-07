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
      <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.2" />
      <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
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

        {/* Vertical Grid Lines */}
        <line x1="0" y1="0" x2="0" y2="300" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="4 4" />
        <line x1="200" y1="0" x2="200" y2="300" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="4 4" />
        <line x1="400" y1="0" x2="400" y2="300" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="4 4" />
        <line x1="600" y1="0" x2="600" y2="300" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="4 4" />
        <line x1="800" y1="0" x2="800" y2="300" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="4 4" />
        <line x1="1000" y1="0" x2="1000" y2="300" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="4 4" />

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
export const MeasuresChart = ({ selectedMeasure = 'chest' }: { selectedMeasure?: string }) => {
  // Mock data paths based on selection
  const getPath = () => {
    switch (selectedMeasure) {
      case 'chest': return "M0 160 Q 100 150, 200 140 T 400 110";
      case 'arm': return "M0 180 Q 150 170, 250 150 T 400 130";
      case 'waist': return "M0 140 Q 150 145, 250 130 T 400 120";
      case 'thigh': return "M0 170 Q 150 160, 250 140 T 400 90";
      case 'calf': return "M0 190 Q 150 185, 250 170 T 400 160";
      default: return "M0 160 Q 100 150, 200 140 T 400 110";
    }
  };

  const getLabel = () => {
    switch (selectedMeasure) {
      case 'chest': return "108cm";
      case 'arm': return "42.5cm";
      case 'waist': return "85cm";
      case 'thigh': return "62cm";
      case 'calf': return "40cm";
      default: return "0cm";
    }
  };

  return (
    <div className="w-full h-full relative">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 400 200" preserveAspectRatio="none">
        {/* Grid Lines */}
        <line x1="0" y1="50" x2="400" y2="50" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="2 2" />
        <line x1="0" y1="100" x2="400" y2="100" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="2 2" />
        <line x1="0" y1="150" x2="400" y2="150" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="2 2" />

        {/* Vertical Grid Lines */}
        <line x1="0" y1="0" x2="0" y2="200" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="2 2" />
        <line x1="133.3" y1="0" x2="133.3" y2="200" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="2 2" />
        <line x1="266.6" y1="0" x2="266.6" y2="200" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="2 2" />
        <line x1="400" y1="0" x2="400" y2="200" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="2 2" />

        {/* Selected Measure Line */}
        <path
          d={getPath()}
          fill="none"
          stroke="#00C9A7"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Tooltip Simulation (Visual Only) */}
        <line x1="300" y1="0" x2="300" y2="200" stroke="white" strokeOpacity="0.1" strokeDasharray="2 2" />
        <g transform="translate(300, 120)">
          <rect x="-25" y="-30" width="50" height="20" rx="4" fill="#1F2937" stroke="rgba(255,255,255,0.1)" />
          <text x="0" y="-16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{getLabel()}</text>
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
interface WeightChartProps {
  selectedMetric?: 'all' | 'total' | 'lean' | 'fat';
}

export const WeightChart = ({ selectedMetric = 'all' }: WeightChartProps) => {
  const showTotal = selectedMetric === 'all' || selectedMetric === 'total';
  const showLean = selectedMetric === 'all' || selectedMetric === 'lean';
  const showFat = selectedMetric === 'all' || selectedMetric === 'fat';

  return (
    <div className="w-full h-full relative">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 400 200" preserveAspectRatio="none">
        {/* Grid Lines */}
        <line x1="0" y1="50" x2="400" y2="50" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="2 2" />
        <line x1="0" y1="100" x2="400" y2="100" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="2 2" />
        <line x1="0" y1="150" x2="400" y2="150" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="2 2" />

        {/* Vertical Grid Lines */}
        <line x1="0" y1="0" x2="0" y2="200" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="2 2" />
        <line x1="133.3" y1="0" x2="133.3" y2="200" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="2 2" />
        <line x1="266.6" y1="0" x2="266.6" y2="200" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="2 2" />
        <line x1="400" y1="0" x2="400" y2="200" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="2 2" />

        {/* Total Weight (Dashed White) */}
        {showTotal && (
          <path
            d="M0 100 L 400 110"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            strokeOpacity="0.5"
          />
        )}

        {/* Lean Mass (Teal) */}
        {showLean && (
          <path
            d="M0 140 L 400 115"
            fill="none"
            stroke="#00C9A7"
            strokeWidth="2"
          />
        )}

        {/* Fat Mass (Purple) */}
        {showFat && (
          <path
            d="M0 180 L 400 190"
            fill="none"
            stroke="#7C3AED"
            strokeWidth="2"
          />
        )}

        {/* Current Weight Label - Only show if Total or All is selected, or maybe adapt it? 
            For now, let's keep it but arguably it belongs to Total. 
            If user selects Fat, maybe show Fat mass? 
            The static code has hardcoded '88.5 kg'. 
            I'll keep it simple for now and only filter the lines as requested.
        */}
        {showTotal && (
          <text x="400" y="90" textAnchor="end" fill="white" fontSize="24" fontWeight="bold">88.5 <tspan fontSize="12" fill="#9CA3AF" fontWeight="normal">kg</tspan></text>
        )}
      </svg>
    </div>
  );
};

// 4. Body Fat Sparkline
export const BodyFatChart = ({ method = 'marinha' }: { method?: string }) => {
  // Mock data variance based on method
  const value = method === 'marinha' ? '10.5' : '12.8';
  const meta = method === 'marinha' ? '8.0%' : '10.0%';
  const diff = method === 'marinha' ? '-1.2%' : '-0.8%';
  const pathD = method === 'marinha'
    ? "M0 35 L 400 75"
    : "M0 45 L 200 60 L 400 65";

  return (
    <div className="w-full h-[120px] relative mt-2 flex flex-col justify-end">
      <div className="absolute top-0 right-0">
        <span className="px-2 py-0.5 rounded bg-[#2E1065] text-[#A78BFA] text-[10px] font-bold border border-[#5B21B6]">{diff}</span>
      </div>
      <div className="absolute inset-0">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
          <GradientDefs />

          {/* Grid Lines */}
          <line x1="0" y1="25" x2="400" y2="25" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="2 2" />
          <line x1="0" y1="50" x2="400" y2="50" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="2 2" />
          <line x1="0" y1="75" x2="400" y2="75" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="2 2" />

          {/* Vertical Grid Lines */}
          <line x1="0" y1="0" x2="0" y2="100" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="2 2" />
          <line x1="100" y1="0" x2="100" y2="100" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="2 2" />
          <line x1="200" y1="0" x2="200" y2="100" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="2 2" />
          <line x1="300" y1="0" x2="300" y2="100" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="2 2" />
          <line x1="400" y1="0" x2="400" y2="100" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="2 2" />

          <path
            d={pathD}
            fill="none"
            stroke="url(#grad-chart-purple)"
            strokeWidth="3"
          />
          <path
            d={`${pathD} V 100 H 0 Z`}
            fill="url(#grad-fill-purple)"
            stroke="none"
          />
          <circle cx="400" cy={method === 'marinha' ? 75 : 65} r="4" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="2" />
        </svg>
      </div>

      <div className="flex justify-between items-end relative z-10">
        <div className="text-4xl font-bold text-white tracking-tighter">{value}<span className="text-lg text-gray-500 ml-0.5">%</span></div>
        <div className="text-xs text-gray-500 font-medium mb-1">Meta: {meta}</div>
      </div>
    </div>
  );
};

// 5. Asymmetry Scanner Chart
export const AsymmetryScannerChart = ({ member = 'arm' }: { member?: string }) => {
  // Data: + is Right dominance (Green), - is Left dominance (Red)
  const getMockData = () => {
    switch (member) {
      case 'arm':
        return [
          { month: 'JAN', val: 20 },
          { month: 'FEV', val: 5 },
          { month: 'MAR', val: 5 },
          { month: 'ABR', val: -30 },
          { month: 'MAI', val: 10 },
          { month: 'JUN', val: -5 },
        ];
      case 'forearm':
        return [
          { month: 'JAN', val: 10 },
          { month: 'FEV', val: 15 },
          { month: 'MAR', val: 8 },
          { month: 'ABR', val: 5 },
          { month: 'MAI', val: 3 },
          { month: 'JUN', val: 2 },
        ];
      case 'thigh':
        return [
          { month: 'JAN', val: -15 },
          { month: 'FEV', val: -10 },
          { month: 'MAR', val: -5 },
          { month: 'ABR', val: -20 },
          { month: 'MAI', val: -8 },
          { month: 'JUN', val: -2 },
        ];
      case 'calf':
        return [
          { month: 'JAN', val: 5 },
          { month: 'FEV', val: 5 },
          { month: 'MAR', val: 0 },
          { month: 'ABR', val: -5 },
          { month: 'MAI', val: -2 },
          { month: 'JUN', val: 1 },
        ];
      default:
        return [
          { month: 'JAN', val: 5 },
          { month: 'FEV', val: 3 },
          { month: 'MAR', val: 2 },
          { month: 'ABR', val: 1 },
          { month: 'MAI', val: 0 },
          { month: 'JUN', val: 0 },
        ];
    }
  };

  const data = getMockData();

  return (
    <div className="w-full h-[150px] relative mt-8 flex flex-col justify-end">
      <div className="relative w-full h-full flex items-center">
        {/* Center Axis */}
        <div className="absolute w-full h-[1px] bg-gray-700"></div>

        {/* Vertical Grid Lines (Simulated with absolute divs) */}
        <div className="absolute inset-x-0 inset-y-0 flex justify-between px-4 pointer-events-none opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-[1px] h-full border-l border-dashed border-white"></div>
          ))}
        </div>

        {/* Bars */}
        <div className="w-full flex justify-between px-4 relative z-10 h-full items-center">
          {data.map((d, i) => (
            <div key={i} className="flex flex-col items-center group cursor-pointer">
              <div className="relative h-[100px] w-4">
                <div
                  className={`w-3 rounded-full absolute left-1/2 -translate-x-1/2 transition-all duration-300 ${d.val > 0 ? 'bg-primary shadow-[0_0_10px_rgba(0,201,167,0.4)]' : d.val < 0 ? 'bg-red-400/80 shadow-[0_0_10px_rgba(248,113,113,0.3)]' : 'bg-gray-500'}`}
                  style={{
                    height: `${Math.max(2, Math.abs(d.val))}%`,
                    bottom: d.val > 0 ? '50%' : d.val === 0 ? '49%' : 'auto',
                    top: d.val < 0 ? '50%' : 'auto',
                  }}
                ></div>
              </div>
              <span className="text-[10px] text-gray-500 font-bold uppercase mt-2">{d.month}</span>

              {/* Hover Tooltip */}
              <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 border border-white/10 px-2 py-1 rounded text-[10px] whitespace-nowrap z-20 pointer-events-none">
                {d.val > 0 ? `Dir +${d.val}%` : d.val < 0 ? `Esq ${d.val}%` : 'Simétrico'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};