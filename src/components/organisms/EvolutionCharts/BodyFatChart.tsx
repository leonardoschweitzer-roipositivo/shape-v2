import React from 'react';
import {
    AreaChart, Area, ResponsiveContainer
} from 'recharts';

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
