import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { MeasurementPoint, MetricConfig } from './types';

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

                <YAxis
                    yAxisId="left"
                    stroke="rgba(255,255,255,0.3)"
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    domain={['auto', 'auto']}
                    dx={-10}
                />

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
