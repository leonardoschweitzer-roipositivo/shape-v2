import React from 'react';
import {
    AreaChart, Area, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip
} from 'recharts';

interface BodyFatChartProps {
    method?: string;
    data?: { v: number }[];
    meta?: number;
}

export const BodyFatChart = ({ method = 'marinha', data: propData, meta = 8.0 }: BodyFatChartProps) => {
    // Fallback to mock data if no data is provided
    const data = propData || (method === 'marinha'
        ? [{ v: 10 }, { v: 10.2 }, { v: 9.8 }, { v: 9.5 }, { v: 9.0 }, { v: 8.8 }]
        : [{ v: 12 }, { v: 12.5 }, { v: 12.2 }, { v: 11.8 }, { v: 11.5 }, { v: 11.2 }]);

    const currentValue = data.length > 0 ? data[data.length - 1].v : 0;

    return (
        <div className="w-full h-[120px] relative mt-2 flex flex-col justify-end">
            <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={data} margin={{ top: 5, right: 0, left: -60, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorBf" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                        dataKey="name"
                        hide
                    />
                    <YAxis
                        domain={['dataMin - 1', 'dataMax + 1']}
                        hide
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#131B2C',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            padding: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        itemStyle={{ fontSize: '10px', fontWeight: 'bold', color: '#fff' }}
                        labelStyle={{ display: 'none' }}
                        cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                        formatter={(value: number) => [`${value.toFixed(2)}%`, method === 'marinha' ? 'B.F. (Marinha)' : 'B.F. (Pollock)']}
                    />
                    <Area
                        type="monotone"
                        dataKey="v"
                        stroke="#7C3AED"
                        strokeWidth={2}
                        fill="url(#colorBf)"
                        activeDot={{ r: 4, strokeWidth: 0, fill: '#fff' }}
                    />
                </AreaChart>
            </ResponsiveContainer>
            <div className="flex justify-between items-end relative z-10 -mt-2 px-1">
                <div className="text-4xl font-bold text-white tracking-tighter">{currentValue.toFixed(2)}<span className="text-lg text-gray-500 ml-0.5">%</span></div>
                <div className="text-xs text-gray-500 font-medium mb-1">Meta: {meta.toFixed(1)}%</div>
            </div>
        </div>
    );
};
