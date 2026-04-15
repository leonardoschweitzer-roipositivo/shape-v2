import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { PontoHistoricoCarga } from '@/types/athlete-portal'
import { colors } from '@/tokens/colors'

interface GraficoCargaExercicioProps {
    pontos: PontoHistoricoCarga[]
}

function formatarData(data: string): string {
    const [, mes, dia] = data.split('-')
    return `${dia}/${mes}`
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-[#1A202C] border border-[#2D3748] rounded-xl px-3 py-2 shadow-xl">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{label}</p>
            <p className="text-sm text-white font-black mt-1">
                {payload[0].value} <span className="text-[10px] text-gray-400 font-medium">kg</span>
            </p>
        </div>
    )
}

export function GraficoCargaExercicio({ pontos }: GraficoCargaExercicioProps) {
    if (pontos.length === 0) {
        return (
            <div className="py-6 text-center">
                <p className="text-[10px] text-gray-500 italic">Sem registros de carga neste período.</p>
            </div>
        )
    }

    const dados = pontos.map((p) => ({
        data: formatarData(p.data),
        carga: p.cargaMax,
    }))

    return (
        <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dados} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
                    <XAxis
                        dataKey="data"
                        stroke="#4A5568"
                        tick={{ fontSize: 10, fill: '#9CA3AF' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        stroke="#4A5568"
                        tick={{ fontSize: 10, fill: '#9CA3AF' }}
                        axisLine={false}
                        tickLine={false}
                        width={36}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#374151', strokeWidth: 1 }} />
                    <Line
                        type="monotone"
                        dataKey="carga"
                        stroke={colors.semantic.success}
                        strokeWidth={2}
                        dot={{ r: 3, fill: colors.semantic.success, stroke: 'none' }}
                        activeDot={{ r: 5 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
