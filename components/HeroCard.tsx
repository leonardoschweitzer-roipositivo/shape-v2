import React, { useState } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

export const HeroCard: React.FC = () => {
  const [imgError, setImgError] = useState(false);

  // Using the URL provided in the prompt's HTML, with a fallback to Unsplash
  const mainImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuCBveJp4fqO5P_9M0jdpi0Fr1eqSirHZlFbxtgxUe2M1xw4O1RmZoLx82Qg9Lh9LWgrxfFP56XioCTHTqpe9HZxGIyQfiTBfaIDcUkiEuzK2NfC6XHfceWUhu2Zv3CW6SkkLRtv-znR5u01DoqRUUXnkOObEHU97h_WmTSD6q8bTsKOYaRGGAHe7SJHxDAN6gTjOMjRKy2HOMa_R3O_DJQTthbOTzSdpiJjsAeR9dAi6RL7o7v5w0juHcd7cZ5obRe2gzsq4AN3jESN";
  const fallbackImage = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="w-full h-80 md:h-72 rounded-2xl relative overflow-hidden group shadow-2xl shadow-black/50 border border-card-border">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
        style={{ 
          backgroundImage: `url('${imgError ? fallbackImage : mainImage}')` 
        }}
      >
        <img 
            src={mainImage} 
            alt="hidden check" 
            className="hidden" 
            onError={() => setImgError(true)} 
        />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F1C] via-[#0A0F1C]/80 to-transparent"></div>
      
      {/* Decorative Grid */}
      <div className="absolute right-0 top-0 h-full w-1/2 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

      {/* Golden Ratio Circles Decoration */}
      <div className="absolute right-10 md:right-32 top-1/2 -translate-y-1/2 w-64 h-64 border border-primary/20 rounded-full flex items-center justify-center pointer-events-none opacity-60">
        <div className="w-40 h-40 border border-secondary/30 rounded-full"></div>
        <div className="absolute w-full h-[1px] bg-primary/20 rotate-45"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-12 max-w-3xl">
        <div className="inline-flex items-center gap-3 mb-4">
          <span className="bg-primary/20 text-primary text-[10px] md:text-xs font-bold px-2.5 py-1 rounded border border-primary/20 tracking-wider">RELATÓRIO SEMANAL</span>
          <span className="text-gray-400 text-xs flex items-center gap-1.5 font-medium">
            <Calendar size={14} className="text-gray-500"/> 12 OUT, 2023
          </span>
        </div>
        
        <h3 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-3">SIMETRIA DO <br className="hidden md:block" /> FÍSICO PERFEITO</h3>
        
        <p className="text-gray-300 text-sm md:text-base max-w-lg mb-8 leading-relaxed font-light">
          Sua análise de <strong className="text-white font-medium">Proporção Áurea</strong> indica uma evolução de 2.4% no deltoide lateral, aproximando-se do Golden Ratio ideal.
        </p>
        
        <div className="flex items-center gap-4">
          <button className="text-white text-sm font-bold hover:text-primary transition-colors flex items-center gap-2 group/btn">
            Ver análise detalhada 
            <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
