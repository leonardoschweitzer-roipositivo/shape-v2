import React from 'react';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

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
