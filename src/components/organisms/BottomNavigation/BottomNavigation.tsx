/**
 * BottomNavigation Component
 * 
 * Navegação inferior fixa com 4 abas para o Portal do Atleta
 * Princípio: Mobile-first, sempre visível, transições suaves
 */

import React from 'react'
import { LayoutDashboard, Dumbbell, MessageCircle, TrendingUp } from 'lucide-react'
import { AthletePortalTab } from '../../../types/athlete-portal'

interface BottomNavigationProps {
    activeTab: AthletePortalTab
    onTabChange: (tab: AthletePortalTab) => void
}

interface NavItem {
    id: AthletePortalTab
    label: string
    icon: typeof Home
}

const NAV_ITEMS: NavItem[] = [
    {
        id: 'home',
        label: 'HOME',
        icon: LayoutDashboard // Using LayoutDashboard for Home
    },
    {
        id: 'hoje',
        label: 'HOJE',
        icon: Dumbbell
    },
    {
        id: 'coach',
        label: 'COACH',
        icon: MessageCircle
    },
    {
        id: 'avalicao',
        label: 'AVALIAÇÃO',
        icon: TrendingUp
    }
]

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#060B18] border-t border-white/5 z-50">
            <div className="max-w-screen-sm mx-auto">
                <div className="grid grid-cols-4 h-16">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon
                        const isActive = activeTab === item.id

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
                                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-400" />
                                )}

                                {/* Icon */}
                                <Icon
                                    size={24}
                                    className={`transition-colors ${isActive
                                        ? 'text-indigo-400'
                                        : 'text-gray-500'
                                        }`}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />

                                {/* Label */}
                                <span
                                    className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${isActive
                                        ? 'text-indigo-400'
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
