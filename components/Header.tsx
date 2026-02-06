import React from 'react';
import { Bell, Camera } from 'lucide-react';

interface HeaderProps {
  onOpenAssessment?: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAssessment, title = "MOMENTO" }) => {
  return (
    <header className="h-20 w-full flex-shrink-0 flex items-center justify-between px-8 border-b border-card-border bg-[#0A0F1C]/90 backdrop-blur-md z-30">
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="text-gray-500">SHAPE-V</span>
        <span className="text-gray-600">/</span>
        <span className="text-white tracking-wide font-semibold uppercase">{title}</span>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          <Bell size={20} />
        </button>
        
        <button 
          onClick={onOpenAssessment}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-[#0A0F1C] rounded-lg font-bold text-sm transition-all shadow-[0_0_15px_rgba(0,201,167,0.3)] hover:shadow-[0_0_20px_rgba(0,201,167,0.5)] transform hover:scale-105 active:scale-95"
        >
          <Camera size={18} />
          <span>REALIZAR AVALIAÇÃO IA</span>
        </button>
      </div>
    </header>
  );
};