import React from 'react';

// --- HELPERS ---
const getPoint = (center: number, radius: number, angle: number, value: number) => {
  const x = center + (radius * value) * Math.cos(angle * Math.PI / 180);
  const y = center + (radius * value) * Math.sin(angle * Math.PI / 180);
  return `${x},${y}`;
};

// --- RADAR CHART ---
export const RadarChart = () => {
  const size = 200;
  const center = size / 2;
  const radius = 70;
  const angles = [270, 330, 30, 90, 150, 210];
  const labels = ["Pescoço", "Bíceps", "Antebraço", "Panturrilha", "Coxa", "Peito"];
  
  const leftSide = [0.9, 0.8, 0.85, 0.9, 0.95, 0.85];
  const rightSide = [0.9, 0.95, 0.85, 0.9, 0.95, 0.7];

  const leftPath = angles.map((a, i) => getPoint(center, radius, a, leftSide[i])).join(" ");
  const rightPath = angles.map((a, i) => getPoint(center, radius, a, rightSide[i])).join(" ");
  const bgPath = angles.map(a => getPoint(center, radius, a, 1)).join(" ");
  const gridPath = angles.map(a => getPoint(center, radius, a, 0.6)).join(" ");

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <h4 className="absolute top-4 left-6 text-xs text-gray-400 font-bold uppercase tracking-widest">Radar de Simetria</h4>
      <span className="absolute top-4 right-6 text-lg font-bold text-secondary">94%</span>
      
      <div className="relative w-[260px] h-[220px] mt-4">
        <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
          <polygon points={bgPath} fill="none" stroke="#2a303c" strokeWidth="1" />
          <polygon points={gridPath} fill="none" stroke="#2a303c" strokeWidth="1" strokeDasharray="4 2" />
          {angles.map((a, i) => (
             <line key={i} x1={center} y1={center} x2={getPoint(center, radius, a, 1).split(',')[0]} y2={getPoint(center, radius, a, 1).split(',')[1]} stroke="#2a303c" strokeWidth="1" />
          ))}
          <polygon points={leftPath} fill="rgba(124, 58, 237, 0.2)" stroke="#7C3AED" strokeWidth="2" />
          <polygon points={rightPath} fill="transparent" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
        {/* Labels positioning logic kept simple for this component */}
        <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] text-gray-400">{labels[0]}</span>
        <span className="absolute top-[25%] right-2 text-[9px] text-gray-400">{labels[1]}</span>
        <span className="absolute bottom-[25%] right-0 text-[9px] text-gray-400">{labels[2]}</span>
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] text-gray-400">{labels[3]}</span>
        <span className="absolute bottom-[25%] left-4 text-[9px] text-gray-400">{labels[4]}</span>
        <span className="absolute top-[25%] left-8 text-[9px] text-gray-400">{labels[5]}</span>
      </div>

      <div className="flex gap-4 mt-2">
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-secondary"></span>
           <span className="text-[10px] text-gray-400">Esquerdo</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 rounded-full border border-white/30"></span>
           <span className="text-[10px] text-gray-400">Direito (Ref)</span>
        </div>
      </div>
    </div>
  );
};

// --- BODY FAT GAUGE ---
export const BodyFatGauge = () => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-6">
      <div className="w-full flex justify-between items-center mb-2">
         <h4 className="text-xs text-gray-400 font-bold uppercase tracking-widest">Gordura Corporal</h4>
         <div className="flex gap-1">
            <span className="px-2 py-0.5 bg-primary text-[#0A0F1C] text-[9px] font-bold rounded">NAVY</span>
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
            <div className="text-[10px] text-primary font-bold uppercase tracking-wider mt-1">Nível Atleta</div>
         </div>
      </div>

      <div className="w-full grid grid-cols-3 gap-2 mt-6 border-t border-white/5 pt-4">
         <div className="text-center">
            <p className="text-[9px] text-gray-500 font-bold uppercase">Essencial</p>
            <p className="text-xs font-bold text-white">2-5%</p>
         </div>
         <div className="text-center">
            <p className="text-[9px] text-primary font-bold uppercase">Atleta</p>
            <p className="text-xs font-bold text-primary">6-13%</p>
         </div>
         <div className="text-center">
            <p className="text-[9px] text-gray-500 font-bold uppercase">Fitness</p>
            <p className="text-xs font-bold text-white">14-17%</p>
         </div>
      </div>
    </div>
  );
};

// --- ASYMMETRY RADAR ---
export const AsymmetryRadar = () => {
    const size = 260;
    const center = size / 2;
    const radius = 90;
    const angles = [270, 342, 54, 126, 198]; // 5 points
    const labels = ["Braço", "Antebraço", "Panturrilha", "Coxa", "Peitoral"];
    
    // Left (Purple) Data
    const leftData = [0.8, 0.9, 0.95, 0.95, 0.85]; 
    // Right (Teal) Data
    const rightData = [1.0, 0.92, 0.95, 0.88, 0.85]; 
  
    const leftPath = angles.map((a, i) => getPoint(center, radius, a, leftData[i])).join(" ");
    const rightPath = angles.map((a, i) => getPoint(center, radius, a, rightData[i])).join(" ");
    
    // Background Grid
    const bgPath = angles.map(a => getPoint(center, radius, a, 1)).join(" ");
    const gridPath1 = angles.map(a => getPoint(center, radius, a, 0.7)).join(" ");
    const gridPath2 = angles.map(a => getPoint(center, radius, a, 0.4)).join(" ");

    return (
        <div className="relative w-full h-full flex flex-col items-center">
            <div className="relative w-full aspect-square max-w-[300px]">
                <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
                    {/* Grid */}
                    <polygon points={bgPath} fill="none" stroke="#1F2937" strokeWidth="1" />
                    <polygon points={gridPath1} fill="none" stroke="#1F2937" strokeWidth="1" />
                    <polygon points={gridPath2} fill="none" stroke="#1F2937" strokeWidth="1" />
                    
                    {/* Axis Lines */}
                    {angles.map((a, i) => (
                         <line key={i} x1={center} y1={center} x2={getPoint(center, radius, a, 1).split(',')[0]} y2={getPoint(center, radius, a, 1).split(',')[1]} stroke="#1F2937" strokeWidth="1" />
                    ))}

                    {/* Left Data (Purple) */}
                    <polygon points={leftPath} fill="none" stroke="#7C3AED" strokeWidth="2" className="drop-shadow-[0_0_4px_rgba(124,58,237,0.5)]" />
                    
                    {/* Right Data (Teal) */}
                    <polygon points={rightPath} fill="none" stroke="#00C9A7" strokeWidth="2" className="drop-shadow-[0_0_4px_rgba(0,201,167,0.5)]" />
                </svg>

                {/* Labels */}
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-[10px] text-gray-400 font-medium">{labels[0]}</span>
                <span className="absolute top-[30%] right-0 translate-x-2 text-[10px] text-gray-400 font-medium">{labels[1]}</span>
                <span className="absolute bottom-[20%] right-2 translate-y-2 text-[10px] text-gray-400 font-medium">{labels[2]}</span>
                <span className="absolute bottom-[20%] left-2 translate-y-2 text-[10px] text-gray-400 font-medium">{labels[3]}</span>
                <span className="absolute top-[30%] left-0 -translate-x-2 text-[10px] text-gray-400 font-medium">{labels[4]}</span>
            </div>
        </div>
    );
}