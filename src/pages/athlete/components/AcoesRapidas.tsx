import React from 'react'
import { AcaoRapida } from './HomeAtletaTypes'

interface AcoesRapidasProps {
    acoes: AcaoRapida[]
}

export function AcoesRapidas({ acoes }: AcoesRapidasProps) {
    return (
        <div className="max-w-2xl mx-auto px-6 mt-4">
            <span className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase px-1 mb-3 block">
                Ações Rápidas
            </span>
            <div className="grid grid-cols-3 gap-3">
                {acoes.map((acao) => (
                    <button
                        key={acao.id}
                        onClick={acao.onClick}
                        disabled={acao.desabilitada}
                        className={`relative flex flex-col items-center gap-2 py-4 px-3 rounded-xl border transition-all ${acao.desabilitada
                                ? 'bg-white/[0.02] border-white/5 opacity-40 cursor-not-allowed'
                                : 'bg-[#0A0F1C] border-white/5 hover:bg-indigo-500/10 hover:border-indigo-500/20 active:scale-95'
                            }`}
                    >
                        <span className="text-2xl">{acao.icone}</span>
                        <span className="text-[10px] font-bold tracking-widest text-gray-300 uppercase">
                            {acao.label}
                        </span>
                        {acao.badge && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-[9px] font-black rounded-full shadow-lg">
                                {acao.badge}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    )
}
