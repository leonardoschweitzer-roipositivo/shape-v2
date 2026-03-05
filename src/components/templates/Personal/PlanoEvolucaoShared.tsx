/**
 * PlanoEvolucaoShared — Shared subcomponents for Plano de Evolução views
 * (DiagnosticoView, TreinoView, DietaView)
 * 
 * Extracted to eliminate duplication across 3 files.
 */
import React from 'react';
import {
    Stethoscope, Dumbbell, Salad, Check,
    ArrowRight, Bot,
} from 'lucide-react';
import { colors } from '@/tokens';

// ═══════════════════════════════════════════════════════════
// EVOLUTION STEPPER
// ═══════════════════════════════════════════════════════════

const ETAPAS = [
    { num: 1, label: 'Diagnóstico', icon: Stethoscope },
    { num: 2, label: 'Treino', icon: Dumbbell },
    { num: 3, label: 'Dieta', icon: Salad },
];

export const EvolutionStepper: React.FC<{ etapaAtual: number }> = ({ etapaAtual }) => {
    return (
        <div className="flex items-center justify-between px-4 py-3 mb-4"
            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(59,130,246,0.08) 100%)', borderRadius: 16 }}>
            {ETAPAS.map((e, i) => {
                const isDone = etapaAtual > e.num;
                const isCurrent = etapaAtual === e.num;
                const Icon = isDone ? Check : e.icon;
                return (
                    <React.Fragment key={e.num}>
                        {i > 0 && <div className="flex-1 h-0.5 mx-2" style={{ background: isDone ? colors.brand.primary : 'rgba(255,255,255,0.15)' }} />}
                        <div className="flex flex-col items-center gap-1">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isDone ? 'bg-primary text-white' : isCurrent ? 'ring-2 ring-primary bg-primary/20 text-primary' : 'bg-white/10 text-gray-500'}`}>
                                <Icon size={18} />
                            </div>
                            <span className={`text-[10px] font-medium ${isCurrent ? 'text-primary' : isDone ? 'text-emerald-400' : 'text-gray-500'}`}>{e.label}</span>
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
    );
};

// ═══════════════════════════════════════════════════════════
// SECTION CARD
// ═══════════════════════════════════════════════════════════

export const SectionCard: React.FC<{
    icon: React.ElementType;
    title: string;
    subtitle: string;
    children: React.ReactNode;
}> = ({ icon: Icon, title, subtitle, children }) => (
    <div style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: '20px',
        marginBottom: '16px',
    }}>
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${colors.brand.primary}20` }}>
                <Icon size={20} style={{ color: colors.brand.primary }} />
            </div>
            <div>
                <h3 className="text-white font-bold text-sm">{title}</h3>
                <p className="text-gray-400 text-xs">{subtitle}</p>
            </div>
        </div>
        {children}
    </div>
);

// ═══════════════════════════════════════════════════════════
// INSIGHT BOX (Vitrúvio IA analysis)
// ═══════════════════════════════════════════════════════════

export const InsightBox: React.FC<{
    text: string;
    title?: string;
    isLoading?: boolean;
}> = ({ text, title = 'Análise Vitrúvio IA', isLoading = false }) => (
    <div style={{
        background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.10) 100%)',
        border: '1px solid rgba(139,92,246,0.3)',
        borderRadius: 12,
        padding: '14px 16px',
        marginTop: '12px',
    }}>
        <div className="flex items-center gap-2 mb-2">
            <Bot size={14} className="text-purple-400" />
            <span className="text-purple-300 text-xs font-semibold">{title}</span>
        </div>
        {isLoading ? (
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-400 text-xs italic">Analisando dados...</span>
            </div>
        ) : (
            <p className="text-gray-300 text-xs leading-relaxed whitespace-pre-line">{text}</p>
        )}
    </div>
);

// ═══════════════════════════════════════════════════════════
// PROGRESS BAR
// ═══════════════════════════════════════════════════════════

export const ProgressBar: React.FC<{ pct: number; color?: string }> = ({ pct, color = 'bg-primary' }) => (
    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(pct, 100)}%`, transition: 'width 0.5s ease' }} />
    </div>
);
