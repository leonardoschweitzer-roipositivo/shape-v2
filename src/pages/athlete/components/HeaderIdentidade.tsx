import React from 'react'
import { User } from 'lucide-react'
import { HeaderAtletaProps } from './HomeAtletaTypes'

export function HeaderIdentidade({
    nome,
    sexo,
    altura,
    peso,
    fotoUrl,
}: HeaderAtletaProps) {
    return (
        <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/20 via-indigo-900/10 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />

            <div className="relative max-w-2xl mx-auto px-6 pt-10 pb-8">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20 flex-shrink-0">
                        {fotoUrl ? (
                            <img src={fotoUrl} alt={nome} className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                            <User className="text-white" size={24} />
                        )}
                    </div>
                    <div className="flex-1 space-y-1">
                        <h1 className="text-xl font-black text-white tracking-tight uppercase">
                            {nome}
                        </h1>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                                {sexo?.toUpperCase() || 'N/A'}
                            </span>
                            {altura > 0 && (
                                <>
                                    <span className="text-gray-700">•</span>
                                    <span className="text-[10px] font-bold tracking-wider text-gray-500">
                                        {altura} CM
                                    </span>
                                </>
                            )}
                            {peso && (
                                <>
                                    <span className="text-gray-700">•</span>
                                    <span className="text-[10px] font-bold tracking-wider text-gray-500">
                                        {peso} KG
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                    {/* Vitru Logo */}
                    <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                        <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-indigo-300 font-black text-sm">V</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                            <span className="text-white font-black text-[8px] tracking-widest">VITRU</span>
                            <span className="text-indigo-400 font-black text-[7px] tracking-widest italic">IA</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
