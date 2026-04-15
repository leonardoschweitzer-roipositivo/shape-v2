import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { PontoVolume } from '@/services/personal/derivarMetricasTreino'
import { colors } from '@/tokens/colors'

interface GraficoVolumeTreinoProps {
    pontos: PontoVolume[]
}

function formatarData(data: string): string {
    const [, mes, dia] = data.split('-')
    return `${dia}/${mes}`
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; payload: { seriesValidas: number } }>; label?: string }) {
    if (!active || !payload?.length) return null
    const { value, payload: row } = payload[0]
    return (
        <div className="bg-[#1A202C] border border-[#2D3748] rounded-xl px-3 py-2 shadow-xl">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{label}</p>
            <p className="text-sm text-white font-black mt-1">
                {value.toLocaleString('pt-BR')} <span className="text-[10px] text-gray-400 font-medium">kg·rep</span>
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5">{row.seriesValidas} séries</p>
        </div>
    )
}

export function GraficoVolumeTreino({ pontos }: GraficoVolumeTreinoProps) {
    if (pontos.length === 0) {
        return (
            <div className="py-6 text-center">
                <p className="text-[10px] text-gray-500 italic">Sem sessões registradas neste período.</p>
            </div>
        )
    }

    const dados = pontos.map((p) => ({
        data: formatarData(p.data),
        volume: p.volume,
        seriesValidas: p.seriesValidas,
    }))

    return (
        <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dados} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
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
                        width={48}
                        tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} />
                    <Bar dataKey="volume" fill={colors.semantic.info} radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
