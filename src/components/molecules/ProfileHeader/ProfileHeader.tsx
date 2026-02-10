/**
 * ProfileHeader Component
 * 
 * Header da tela de perfil com foto, nome e email do atleta
 */

import React from 'react'
import { User } from 'lucide-react'

interface ProfileHeaderProps {
    nome: string
    email: string
    fotoUrl?: string
}

export function ProfileHeader({ nome, email, fotoUrl }: ProfileHeaderProps) {
    return (
        <div className="bg-gradient-to-br from-teal-500/10 to-purple-500/10 border-b border-gray-800 px-4 py-8">
            <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full bg-gray-700 border-4 border-gray-800 overflow-hidden mb-4">
                    {fotoUrl ? (
                        <img src={fotoUrl} alt={nome} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-teal-500/20">
                            <User size={40} className="text-teal-400" />
                        </div>
                    )}
                </div>

                {/* Nome */}
                <h2 className="text-xl font-bold text-white mb-1">
                    {nome}
                </h2>

                {/* Email */}
                <p className="text-sm text-gray-400">
                    {email}
                </p>
            </div>
        </div>
    )
}
