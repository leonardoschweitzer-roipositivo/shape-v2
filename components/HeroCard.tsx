import React, { useState } from 'react';
import { Calendar, ArrowRight, AlertTriangle } from 'lucide-react';
import { HeroContent } from '../src/features/dashboard/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface HeroCardProps {
  content?: HeroContent;
}

export const HeroCard: React.FC<HeroCardProps> = ({ content }) => {
  const [imgError, setImgError] = useState(false);

  // Default content if none provided
  const defaultContent: HeroContent = {
    badge: { label: 'RELATÓRIO SEMANAL', variant: 'primary' },
    date: new Date(),
    title: 'SIMETRIA DO FÍSICO PERFEITO',
    description: 'Sua análise de Proporção Áurea indica uma evolução de 2.4% no deltoide lateral, aproximando-se do Golden Ratio ideal.',
    cta: { label: 'Ver análise detalhada', href: '/results' },
    image: {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBveJp4fqO5P_9M0jdpi0Fr1eqSirHZlFbxtgxUe2M1xw4O1RmZoLx82Qg9Lh9LWgrxfFP56XioCTHTqpe9HZxGIyQfiTBfaIDcUkiEuzK2NfC6XHfceWUhu2Zv3CW6SkkLRtv-znR5u01DoqRUUXnkOObEHU97h_WmTSD6q8bTsKOYaRGGAHe7SJHvDAN6gTjOMjRKy2HOMa_R3O_DJQTthbOTzSdpiJjsAeR9dAi6RL7o7v5w0juHcd7cZ5obRe2gzsq4AN3jESN",
      alt: "Hero Image",
      position: 'background'
    }
  };

  const displayContent = content || defaultContent;
  const { badge, date, title, description, cta, image } = displayContent;
  const fallbackImage = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop";

  const getBadgeColor = (variant: string) => {
    switch (variant) {
      case 'secondary': return 'text-secondary bg-secondary/20 border-secondary/20';
      case 'warning': return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/20';
      default: return 'text-primary bg-primary/20 border-primary/20';
    }
  };

  return (
    <div className="w-full h-[400px] md:h-[500px] rounded-2xl relative overflow-hidden group shadow-2xl shadow-black/50 border border-card-border">
      {/* Background Image Logic */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
        style={{
          backgroundImage: `url('${imgError ? fallbackImage : (image?.src || fallbackImage)}')`,
          backgroundPosition: 'center'
        }}
      >
        <img
          src={image?.src || fallbackImage}
          alt={image?.alt || "Hero"}
          className="hidden"
          onError={() => setImgError(true)}
        />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F1C] via-[#0A0F1C]/80 to-transparent"></div>

      {/* Decorative Grid */}
      <div className="absolute right-0 top-0 h-full w-1/2 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

      {/* Golden Ratio Circles Decoration (Restored) */}
      <div className="absolute right-10 md:right-32 top-1/2 -translate-y-1/2 w-64 h-64 border border-primary/20 rounded-full flex items-center justify-center pointer-events-none opacity-60">
        <div className="w-40 h-40 border border-secondary/30 rounded-full"></div>
        <div className="absolute w-full h-[1px] bg-primary/20 rotate-45"></div>
      </div>

      {/* "ATENÇÃO" Point on the right (Requested) */}
      {badge.variant === 'warning' && (
        <div className="absolute right-8 top-8 z-20 animate-pulse">
          <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/40 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg shadow-yellow-500/20">
            <AlertTriangle size={16} className="text-yellow-500" />
            <span className="text-yellow-500 text-[10px] font-bold uppercase tracking-widest">Ponto de Atenção</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-12 max-w-3xl">
        <div className="inline-flex items-center gap-3 mb-4">
          <span className={`text-[10px] md:text-xs font-bold px-2.5 py-1 rounded border tracking-wider uppercase ${getBadgeColor(badge.variant)}`}>
            {badge.label}
          </span>
          <span className="text-gray-400 text-xs flex items-center gap-1.5 font-medium uppercase">
            <Calendar size={14} className="text-gray-500" />
            {format(date, "d MMM, yyyy", { locale: ptBR })}
          </span>
        </div>

        {/* Restored Original Title with BR */}
        <h3 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-3">
          SIMETRIA DO <br className="hidden md:block" /> FÍSICO PERFEITO
        </h3>

        {/* Restored Original Description with Strong */}
        <p className="text-gray-300 text-sm md:text-base max-w-lg mb-8 leading-relaxed font-light">
          Sua análise de <strong className="text-white font-medium">Proporção Áurea</strong> indica uma evolução de 2.4% no deltoide lateral, aproximando-se do Golden Ratio ideal.
        </p>

        <div className="flex items-center gap-4">
          <a href={cta.href} className="text-white text-sm font-bold hover:text-primary transition-colors flex items-center gap-2 group/btn cursor-pointer">
            {cta.label}
            <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  );
};
