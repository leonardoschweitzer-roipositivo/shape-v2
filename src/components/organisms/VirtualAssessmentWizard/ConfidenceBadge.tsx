/**
 * ConfidenceBadge - Badge visual para nível de confiança da IA
 * 
 * Exibe High/Medium/Low com cores e ícone diferenciados.
 * Usado no StepResultado para cada medida estimada.
 */

import React, { memo } from 'react';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import type { ConfidenceLevel } from '@/services/virtualAssessment.service';

interface ConfidenceBadgeProps {
    level: ConfidenceLevel;
    size?: 'sm' | 'md';
}

const CONFIG: Record<ConfidenceLevel, {
    label: string;
    icon: typeof ShieldCheck;
    bgClass: string;
    textClass: string;
}> = {
    high: {
        label: 'Alta',
        icon: ShieldCheck,
        bgClass: 'bg-emerald-500/15',
        textClass: 'text-emerald-400',
    },
    medium: {
        label: 'Média',
        icon: Shield,
        bgClass: 'bg-amber-500/15',
        textClass: 'text-amber-400',
    },
    low: {
        label: 'Baixa',
        icon: ShieldAlert,
        bgClass: 'bg-red-500/15',
        textClass: 'text-red-400',
    },
};

export const ConfidenceBadge = memo(function ConfidenceBadge({
    level,
    size = 'sm',
}: ConfidenceBadgeProps) {
    const config = CONFIG[level];
    const Icon = config.icon;
    const iconSize = size === 'sm' ? 12 : 14;
    const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs';

    return (
        <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full ${config.bgClass} ${config.textClass} ${textSize} font-medium`}
        >
            <Icon size={iconSize} />
            {config.label}
        </span>
    );
});
