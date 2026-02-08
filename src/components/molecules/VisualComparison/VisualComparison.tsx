import React from 'react';
import { Camera, Share2, ArrowRight, Target } from 'lucide-react';
import { GlassPanel } from '@/components/atoms/GlassPanel';

export interface ComparisonSnapshot {
    date: Date;
    label: string;
    silhouetteUrl?: string; // URL da silhueta/foto
    measurements: {
        ombros: number;
        cintura: number;
        braco: number;
        coxa: number;
        panturrilha?: number;
        peitoral?: number;
    };
    ratio: number;
    score: number;
}

export interface TransformationSummary {
    periodLabel: string;
    biggestGain: {
        metric: string;
        change: number;
    };
    ratioImprovement: {
        change: number;
        changePercent: number;
    };
    scoreImprovement: {
        change: number;
        changePercent: number;
    };
}

export interface VisualComparisonProps {
    before: ComparisonSnapshot;
    after: ComparisonSnapshot;
    summary: TransformationSummary;
    onShare?: () => void;
}

// Helper: Silhouette Component (when no photo is available)
const BodyOutline: React.FC<{ measurements: ComparisonSnapshot['measurements'] }> = ({ measurements }) => {
    // Basic scaling logic for SVG drawing
    // This is a simplified visual representation
    const scale = 1.2;

    // Dimensions relative to SVG viewBox 0 0 150 200
    const centerX = 75;
    const shoulderY = 60;
    const waistY = 120;
    const hipY = 140;

    // Widths based on measurements (mock scaling)
    const shoulderW = (measurements.ombros || 110) * 0.5 * scale;
    const waistW = (measurements.cintura || 80) * 0.5 * scale;
    const hipW = (measurements.coxa || 60) * 0.8 * scale; // Approximation

    return (
        <svg viewBox="0 0 150 220" className="w-full h-full text-white/20 p-4">
            {/* Head */}
            <ellipse cx={centerX} cy="25" rx="12" ry="15" fill="none" stroke="currentColor" strokeWidth="2" />
            {/* Neck */}
            <line x1={centerX} y1="40" x2={centerX} y2="55" stroke="currentColor" strokeWidth="2" />

            {/* Body Shape */}
            <path
                d={`
                    M ${centerX - shoulderW} ${shoulderY}
                    L ${centerX - waistW} ${waistY}
                    L ${centerX - hipW} ${hipY}
                    L ${centerX - 20} 200
                    M ${centerX + 20} 200
                    L ${centerX + hipW} ${hipY}
                    L ${centerX + waistW} ${waistY}
                    L ${centerX + shoulderW} ${shoulderY}
                    Q ${centerX} ${shoulderY - 5} ${centerX - shoulderW} ${shoulderY}
                `}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />

            {/* Highlighted Waist Line */}
            <line
                x1={centerX - waistW} y1={waistY}
                x2={centerX + waistW} y2={waistY}
                stroke="#F59E0B"
                strokeWidth="2"
                strokeOpacity="0.5"
            />

            {/* Shoulder Line */}
            <line
                x1={centerX - shoulderW} y1={shoulderY}
                x2={centerX + shoulderW} y2={shoulderY}
                stroke="#00C9A7"
                strokeWidth="2"
                strokeOpacity="0.5"
            />
        </svg>
    );
};

export const VisualComparison: React.FC<VisualComparisonProps> = ({ before, after, summary, onShare }) => {

    const metrics: (keyof ComparisonSnapshot['measurements'])[] = ['ombros', 'cintura', 'braco', 'coxa'];

    const getChangeIndicator = (metric: keyof ComparisonSnapshot['measurements']) => {
        const valBefore = before.measurements[metric] || 0;
        const valAfter = after.measurements[metric] || 0;
        const change = valAfter - valBefore;

        if (change === 0) return null;

        const isPositiveChange = metric === 'cintura' ? change < 0 : change > 0;
        const color = isPositiveChange ? '#10B981' : '#EF4444';
        const icon = change > 0 ? '↑' : '↓';

        return <span style={{ color, marginLeft: '4px' }}>{icon}</span>;
    };

    return (
        <section className="flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 ml-1">
                    <div className="p-2 bg-[#131B2C] rounded-xl text-primary border border-white/10 shadow-lg">
                        <Camera size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">COMPARATIVO VISUAL</h3>
                        <p className="text-[10px] text-gray-500 font-medium">Veja sua transformação no período</p>
                    </div>
                </div>
                {onShare && (
                    <button
                        onClick={onShare}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <Share2 size={18} />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* BEFORE CARD */}
                <GlassPanel className="p-0 rounded-2xl overflow-hidden flex flex-col">
                    <div className="bg-white/5 p-3 text-center border-b border-white/5">
                        <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">{before.label}</h4>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-transparent to-black/20 min-h-[200px]">
                        {before.silhouetteUrl ? (
                            <img src={before.silhouetteUrl} alt="Before" className="h-48 object-contain" />
                        ) : (
                            <div className="h-48 w-full max-w-[150px]">
                                <BodyOutline measurements={before.measurements} />
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-black/20 border-t border-white/5">
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                            {metrics.map(m => (
                                <div key={m} className="flex justify-between text-xs">
                                    <span className="text-gray-500 capitalize">{m}</span>
                                    <span className="text-gray-300 font-mono">{before.measurements[m]}cm</span>
                                </div>
                            ))}
                            <div className="col-span-2 h-px bg-white/5 my-1" />
                            <div className="flex justify-between text-xs font-bold">
                                <span className="text-primary">Ratio</span>
                                <span className="text-white">{before.ratio.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </GlassPanel>

                {/* AFTER CARD */}
                <GlassPanel className="p-0 rounded-2xl overflow-hidden flex flex-col relative border-primary/20">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
                    <div className="bg-white/5 p-3 text-center border-b border-white/5">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">{after.label}</h4>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-primary/5 to-black/20 min-h-[200px]">
                        {after.silhouetteUrl ? (
                            <img src={after.silhouetteUrl} alt="After" className="h-48 object-contain" />
                        ) : (
                            <div className="h-48 w-full max-w-[150px]">
                                <BodyOutline measurements={after.measurements} />
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-black/20 border-t border-white/5">
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                            {metrics.map(m => (
                                <div key={m} className="flex justify-between text-xs">
                                    <span className="text-gray-500 capitalize">{m}</span>
                                    <span className="text-gray-300 font-mono">
                                        {after.measurements[m]}cm
                                        {getChangeIndicator(m)}
                                    </span>
                                </div>
                            ))}
                            <div className="col-span-2 h-px bg-white/5 my-1" />
                            <div className="flex justify-between text-xs font-bold">
                                <span className="text-primary">Ratio</span>
                                <span className="text-white">
                                    {after.ratio.toFixed(2)}
                                    <span className="text-green-500 ml-1">↑</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </GlassPanel>
            </div>

            {/* Summary Footer */}
            <GlassPanel className="p-4 rounded-xl flex flex-wrap justify-between items-center gap-4 bg-white/5">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/10 rounded-lg text-gray-300">
                        <Camera size={14} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Período</span>
                        <span className="text-xs text-white font-bold">{summary.periodLabel}</span>
                    </div>
                </div>

                <div className="h-8 w-px bg-white/10 hidden sm:block" />

                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                        <ArrowRight size={14} className="-rotate-45" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Maior Ganho</span>
                        <span className="text-xs text-white font-bold">{summary.biggestGain.metric} +{summary.biggestGain.change}cm</span>
                    </div>
                </div>

                <div className="h-8 w-px bg-white/10 hidden sm:block" />

                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-secondary/10 rounded-lg text-secondary">
                        <Target size={14} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Score</span>
                        <span className="text-xs text-white font-bold">+{summary.scoreImprovement.change} pts</span>
                    </div>
                </div>
            </GlassPanel>
        </section>
    );
};
