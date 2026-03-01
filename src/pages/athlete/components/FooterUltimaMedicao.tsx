import React from 'react'
import { Clock, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react'
import { FooterMedicaoProps } from './HomeAtletaTypes'

export function FooterUltimaMedicao({
    dataUltimaMedida,
    diasDesdeUltima,
    statusMedicao,
}: FooterMedicaoProps) {
    const dataFormatada = new Intl.DateTimeFormat('pt-BR').format(dataUltimaMedida)

    const statusConfig = {
        em_dia: {
            icon: <CheckCircle className="text-emerald-400" size={14} />,
            cor: 'text-emerald-400',
            bg: 'bg-emerald-500/5 border-emerald-500/10',
            texto: 'Em dia',
        },
        atencao: {
            icon: <AlertTriangle className="text-amber-400" size={14} />,
            cor: 'text-amber-400',
            bg: 'bg-amber-500/5 border-amber-500/10',
            texto: 'Atenção',
        },
        atrasado: {
            icon: <AlertCircle className="text-red-400" size={14} />,
            cor: 'text-red-400',
            bg: 'bg-red-500/5 border-red-500/10',
            texto: 'Atrasado',
        },
    }

    const cfg = statusConfig[statusMedicao]

    return (
        <div className="max-w-2xl mx-auto px-6 mt-6 mb-4">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${cfg.bg}`}>
                <Clock className="text-gray-600 shrink-0" size={14} />
                <span className="text-[10px] text-gray-500 flex-1">
                    Última medida em{' '}
                    <span className="text-gray-300 font-bold">{dataFormatada}</span>
                    {diasDesdeUltima > 0 && (
                        <span className="text-gray-600"> ({diasDesdeUltima} dias atrás)</span>
                    )}
                </span>
                <span className={`flex items-center gap-1.5 text-[9px] font-bold tracking-wider uppercase ${cfg.cor}`}>
                    {cfg.icon}
                    {cfg.texto}
                </span>
            </div>

            {/* Powered by */}
            <div className="pt-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-[10px] text-gray-700 font-bold tracking-wider uppercase">
                        ✨ Powered by VITRU IA
                    </span>
                </div>
                <p className="text-[10px] text-gray-700">
                    Suas medidas são analisadas pela nossa IA para gerar seu score
                </p>
            </div>
        </div>
    )
}
