/**
 * BottomNavigationPersonal
 *
 * Navegação inferior para o Portal do Personal — Mobile First.
 * Variante dedicada ao Personal com tabs: Home, Alunos, Alertas, Perfil.
 */

import React from 'react'
import { Home, Users, Bell, User } from 'lucide-react'
import type { PersonalPortalTab } from '@/types/personal-portal'

interface BottomNavigationPersonalProps {
    activeTab: PersonalPortalTab
    onTabChange: (tab: PersonalPortalTab) => void
    alertasNaoLidos?: number
}

interface NavItem {
    id: PersonalPortalTab
    label: string
    icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>
}

const NAV_ITEMS: NavItem[] = [
    { id: 'home', label: 'HOME', icon: Home },
    { id: 'alunos', label: 'ALUNOS', icon: Users },
    { id: 'alertas', label: 'ALERTAS', icon: Bell },
    { id: 'perfil', label: 'PERFIL', icon: User },
]

export function BottomNavigationPersonal({
    activeTab,
    onTabChange,
    alertasNaoLidos = 0,
}: BottomNavigationPersonalProps) {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#060B18] border-t border-white/5 z-50">
            <div className="max-w-screen-sm mx-auto">
                <div className="grid grid-cols-4 h-16">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon
                        const isActive = activeTab === item.id
                        const showBadge = item.id === 'alertas' && alertasNaoLidos > 0

                        return (
                            <button
                                key={item.id}
                                onClick={() => onTabChange(item.id)}
                                className="flex flex-col items-center justify-center gap-0.5 transition-colors relative"
                                aria-label={item.label}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                {/* Active indicator */}
                                {isActive && (
                                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--color-gold)]" />
                                )}

                                {/* Icon with badge */}
                                <div className="relative">
                                    <Icon
                                        size={24}
                                        className={`transition-colors ${isActive
                                            ? 'text-[var(--color-gold)]'
                                            : 'text-gray-500'
                                            }`}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                    {showBadge && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5">
                                            {alertasNaoLidos > 9 ? '9+' : alertasNaoLidos}
                                        </span>
                                    )}
                                </div>

                                {/* Label */}
                                <span
                                    className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${isActive
                                        ? 'text-[var(--color-gold)]'
                                        : 'text-gray-600'
                                        }`}
                                >
                                    {item.label}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}
