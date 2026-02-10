/**
 * CardMeuPersonal Component
 * 
 * Card com informações do personal trainer do atleta
 */

import React from 'react'
import { User, Phone, Mail, Award } from 'lucide-react'
import { MeuPersonal } from '../../../types/athlete-portal'

interface CardMeuPersonalProps {
    personal: MeuPersonal | null
}

export function CardMeuPersonal({ personal }: CardMeuPersonalProps) {
    if (!personal) {
        return (
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 border-dashed">
                <div className="text-center">
                    <User size={32} className="text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">
                        Nenhum personal trainer vinculado
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Meu Personal
            </h3>

            <div className="flex items-start gap-3 mb-4">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
                    {personal.fotoUrl ? (
                        <img src={personal.fotoUrl} alt={personal.nome} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-teal-500/20">
                            <User size={24} className="text-teal-400" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1">
                    <h4 className="text-base font-semibold text-white mb-1">
                        {personal.nome}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Award size={12} />
                        <span>CREF {personal.cref}</span>
                    </div>
                </div>
            </div>

            {/* Contato */}
            <div className="space-y-2">
                <a
                    href={`tel:${personal.telefone}`}
                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-teal-400 transition-colors"
                >
                    <Phone size={14} />
                    <span>{personal.telefone}</span>
                </a>

                <a
                    href={`mailto:${personal.email}`}
                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-teal-400 transition-colors"
                >
                    <Mail size={14} />
                    <span>{personal.email}</span>
                </a>
            </div>
        </div>
    )
}
