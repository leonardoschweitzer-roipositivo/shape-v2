import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

interface LinearMeasuresChartProps {
    data: { name: string, inicio: number, anterior?: number, atual: number }[];
    title: string;
}

export const LinearMeasuresChart: React.FC<LinearMeasuresChartProps> = ({ data, title }) => {
    const hasAnterior = data.some(d => d.anterior !== undefined && d.anterior !== d.inicio && d.anterior !== d.atual);

    return (
        <div className="w-full h-full flex flex-col">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 px-1">{title}</h4>
            <div className="flex-1 w-full min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={hasAnterior ? 4 : 8}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="rgba(255,255,255,0.3)"
                            tick={{ fontSize: 9, fontWeight: 600 }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.3)"
                            tick={{ fontSize: 9 }}
                            axisLine={false}
                            tickLine={false}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#131B2C',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                padding: '12px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                            }}
                            itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                            labelStyle={{ color: '#9CA3AF', fontSize: '10px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 'bold' }}
                            cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                            formatter={(value: any) => [`${value} cm`, '']}
                        />
                        <Legend
                            verticalAlign="top"
                            align="right"
                            iconType="circle"
                            iconSize={6}
                            wrapperStyle={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', paddingBottom: '15px' }}
                        />
                        <Bar
                            name="Início"
                            dataKey="inicio"
                            fill="rgba(255,255,255,0.15)"
                            radius={[4, 4, 0, 0]}
                            barSize={hasAnterior ? 8 : 12}
                        />
                        {hasAnterior && (
                            <Bar
                                name="Anterior"
                                dataKey="anterior"
                                fill="rgba(59, 130, 246, 0.4)"
                                radius={[4, 4, 0, 0]}
                                barSize={8}
                            />
                        )}
                        <Bar
                            name="Atual"
                            dataKey="atual"
                            fill="#00C9A7"
                            radius={[4, 4, 0, 0]}
                            barSize={hasAnterior ? 8 : 12}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
