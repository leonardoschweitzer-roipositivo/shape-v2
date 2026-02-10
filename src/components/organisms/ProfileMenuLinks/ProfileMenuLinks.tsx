/**
 * ProfileMenuLinks Component
 * 
 * Links de menu para configurações e ajuda
 */

import React from 'react'
import { Settings, HelpCircle, LogOut, ChevronRight } from 'lucide-react'

interface ProfileMenuLinksProps {
    onSettings: () => void
    onHelp: () => void
    onLogout: () => void
}

interface MenuLinkProps {
    icon: React.ReactNode
    label: string
    onClick: () => void
    variant?: 'default' | 'danger'
}

function MenuLink({ icon, label, onClick, variant = 'default' }: MenuLinkProps) {
    const textColor = variant === 'danger' ? 'text-red-400' : 'text-white'
    const hoverBg = variant === 'danger' ? 'hover:bg-red-500/10' : 'hover:bg-gray-800'

    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between p-4 ${hoverBg} rounded-lg transition-colors border border-gray-700`}
        >
            <div className="flex items-center gap-3">
                <div className={textColor}>
                    {icon}
                </div>
                <span className={`text-sm font-medium ${textColor}`}>
                    {label}
                </span>
            </div>
            <ChevronRight size={18} className="text-gray-600" />
        </button>
    )
}

export function ProfileMenuLinks({ onSettings, onHelp, onLogout }: ProfileMenuLinksProps) {
    return (
        <div className="space-y-2">
            <MenuLink
                icon={<Settings size={20} />}
                label="Configurações"
                onClick={onSettings}
            />

            <MenuLink
                icon={<HelpCircle size={20} />}
                label="Ajuda e Suporte"
                onClick={onHelp}
            />

            <MenuLink
                icon={<LogOut size={20} />}
                label="Sair"
                onClick={onLogout}
                variant="danger"
            />
        </div>
    )
}
