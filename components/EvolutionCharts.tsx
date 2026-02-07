import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, AreaChart, Area
} from 'recharts';

// --- Types ---
export interface MetricConfig {
    id: string;
    label: string;
    color: string;
    unit: string;
    idealValue?: number;
    yAxisId: 'left' | 'right';
}

export interface MeasurementPoint {
    date: string; // formatted date for axis
    fullDate?: Date; // for tooltip
    [key: string]: any;
}

// --- 1. Golden Evolution Chart (Main) ---

interface EvolutionChartProps {
    data: MeasurementPoint[];
    selectedMetrics: MetricConfig[];
    showIdealLine?: boolean;
    idealValue?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="bg-[#131B2C] border border-white/10 p-3 rounded-lg shadow-xl cursor-default select-none pointer-events-none z-50">
            <p className="text-gray-400 text-[10px] font-bold uppercase mb-2">{label}</p>
            {payload.map((entry: any, index: number) => (
                <div key={index} className="flex items-center gap-2 mb-1">
                    <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: entry.stroke }}
                    />
                    <span className="text-xs text-gray-300">
                        {entry.name}: <strong className="text-white">{Number(entry.value).toFixed(2)}</strong> {entry.unit}
                    </span>
                </div>
            ))}
        </div>
    );
};

export const GoldenEvolutionChart: React.FC<EvolutionChartProps> = ({
    data,
    selectedMetrics,
    showIdealLine = true,
    idealValue = 1.618
}) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                    dataKey="date"
                    stroke="rgba(255,255,255,0.3)"
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                />

                {/* Left YAxis (Usually Ratio) */}
                <YAxis
                    yAxisId="left"
                    stroke="rgba(255,255,255,0.3)"
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    domain={['auto', 'auto']}
                    dx={-10}
                />

                {/* Right YAxis (If needed for other metrics like Score or CM) */}
                {selectedMetrics.some(m => m.yAxisId === 'right') && (
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="rgba(255,255,255,0.3)"
                        tick={{ fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        domain={['auto', 'auto']}
                        dx={10}
                    />
                )}

                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />

                {/* Ideal Line Reference */}
                {showIdealLine && idealValue && (
                    <ReferenceLine
                        y={idealValue}
                        yAxisId="left"
                        stroke="#F59E0B"
                        strokeDasharray="5 5"
                        strokeOpacity={0.8}
                        label={{
                            value: 'IDEAL',
                            fill: '#F59E0B',
                            fontSize: 8,
                            position: 'insideRight',
                            dy: -10
                        }}
                    />
                )}

                {/* Render Lines for each selected metric */}
                {selectedMetrics.map((metric) => (
                    <Line
                        key={metric.id}
                        yAxisId={metric.yAxisId}
                        type="monotone"
                        dataKey={metric.id}
                        name={metric.label}
                        stroke={metric.color}
                        strokeWidth={2}
                        dot={{ fill: '#0A0F1C', stroke: metric.color, strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: metric.color, stroke: '#fff' }}
                        unit={metric.unit}
                        isAnimationActive={true}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

// --- 2. Weight Chart (Updated) ---

interface WeightChartProps {
    data: { date: string, total: number, lean: number, fat: number }[];
    selectedMetric?: 'all' | 'total' | 'lean' | 'fat';
}

export const WeightChart: React.FC<WeightChartProps> = ({ data, selectedMetric = 'all' }) => {
    const showTotal = selectedMetric === 'all' || selectedMetric === 'total';
    const showLean = selectedMetric === 'all' || selectedMetric === 'lean';
    const showFat = selectedMetric === 'all' || selectedMetric === 'fat';

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorLean" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00C9A7" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00C9A7" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorFat" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />

                <Tooltip
                    contentStyle={{ backgroundColor: '#131B2C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    labelStyle={{ color: '#9CA3AF', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}
                    itemStyle={{ fontSize: '12px' }}
                />

                {showTotal && (
                    <Area type="monotone" dataKey="total" name="Peso Total" stroke="#fff" fill="none" strokeDasharray="4 4" strokeOpacity={0.5} strokeWidth={2} />
                )}
                {showLean && (
                    <Area type="monotone" dataKey="lean" name="Massa Magra" stroke="#00C9A7" fillOpacity={1} fill="url(#colorLean)" strokeWidth={2} />
                )}
                {showFat && (
                    <Area type="monotone" dataKey="fat" name="Massa Gorda" stroke="#7C3AED" fillOpacity={1} fill="url(#colorFat)" strokeWidth={2} />
                )}
            </AreaChart>
        </ResponsiveContainer>
    );
};

// --- 3. Body Fat Sparkline (Updated) ---

export const BodyFatChart = ({ method = 'marinha' }: { method?: string }) => {
    // Mock Data based on method
    const data = method === 'marinha'
        ? [{ v: 10 }, { v: 10.2 }, { v: 9.8 }, { v: 9.5 }, { v: 9.0 }, { v: 8.8 }]
        : [{ v: 12 }, { v: 12.5 }, { v: 12.2 }, { v: 11.8 }, { v: 11.5 }, { v: 11.2 }];

    const currentValue = data[data.length - 1].v;
    const meta = 8.0;

    return (
        <div className="w-full h-[120px] relative mt-2 flex flex-col justify-end">
            <ResponsiveContainer width="100%" height="60%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorBf" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="v" stroke="#7C3AED" strokeWidth={2} fill="url(#colorBf)" />
                </AreaChart>
            </ResponsiveContainer>
            <div className="flex justify-between items-end relative z-10 mt-2">
                <div className="text-4xl font-bold text-white tracking-tighter">{currentValue}<span className="text-lg text-gray-500 ml-0.5">%</span></div>
                <div className="text-xs text-gray-500 font-medium mb-1">Meta: {meta.toFixed(1)}%</div>
            </div>
        </div>
    );
};
