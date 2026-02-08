import React from 'react';
import { LucideIcon, ChevronRight, Sparkles } from 'lucide-react';

interface CoachPillarCardProps {
    number: string;
    icon: LucideIcon;
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
    onButtonClick: () => void;
    isPro?: boolean;
    isDisabled?: boolean;
}

export const CoachPillarCard: React.FC<CoachPillarCardProps> = ({
    number,
    icon: Icon,
    title,
    subtitle,
    description,
    buttonText,
    onButtonClick,
    isPro = false,
    isDisabled = false,
}) => {
    return (
        <div className="group relative bg-[#131B2C] border border-white/10 rounded-2xl p-6 transition-all hover:border-primary/30 hover:shadow-[0_0_30px_rgba(0,201,167,0.1)]">
            {/* PRO Badge */}
            {isPro && (
                <div className="absolute top-4 right-4 px-2 py-1 rounded-md text-[10px] font-bold bg-secondary/20 text-secondary border border-secondary/20 flex items-center gap-1">
                    <Sparkles size={10} />
                    PRO
                </div>
            )}

            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
                {/* Number Circle */}
                <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-white/10 flex items-center justify-center">
                        <span className="text-primary font-bold text-lg">{number}</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#131B2C] border border-primary/30 flex items-center justify-center">
                        <Icon size={12} className="text-primary" />
                    </div>
                </div>

                {/* Title & Subtitle */}
                <div className="flex flex-col gap-1 flex-1">
                    <h3 className="text-lg font-bold text-white tracking-wide uppercase">
                        {title}
                    </h3>
                    <p className="text-xs font-semibold text-primary uppercase tracking-widest">
                        {subtitle}
                    </p>
                </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
                {description}
            </p>

            {/* Action Button */}
            <button
                onClick={onButtonClick}
                disabled={isDisabled}
                className={`
                    w-full h-12 rounded-xl font-bold text-sm uppercase tracking-wider
                    flex items-center justify-center gap-2 transition-all
                    ${isDisabled
                        ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                        : 'bg-primary/10 border border-white/10 text-primary hover:bg-primary/20 hover:border-primary/40 hover:shadow-[0_0_15px_rgba(0,201,167,0.2)]'
                    }
                `}
            >
                {buttonText}
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Data Sources Hint */}
            <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest text-center">
                    Baseado no seu histórico de avaliações e objetivos
                </p>
            </div>
        </div>
    );
};
