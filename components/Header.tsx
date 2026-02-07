import React from 'react';
import { Bell, Bot } from 'lucide-react';

interface HeaderProps {
  onOpenCoach?: () => void;
  title?: string;
  userProfile?: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCoach, title = "INÍCIO", userProfile = 'atleta' }) => {
  const getProfileLabel = () => {
    switch (userProfile) {
      case 'academia': return 'ACADEMIA';
      case 'personal': return 'PERSONAL';
      case 'atleta': return 'ATLETA';
      default: return userProfile.toUpperCase();
    }
  };

  return (
    <header className="h-20 w-full flex-shrink-0 flex items-center justify-between px-8 border-b border-card-border bg-[#0A0F1C]/90 backdrop-blur-md z-30">
      <div className="flex items-center gap-4 text-sm font-medium">
        <div className="flex items-center gap-2">
          <span className="text-white tracking-wide font-semibold uppercase">{title}</span>
        </div>
        <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-gray-400 font-bold tracking-widest">
          {getProfileLabel()}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          <Bell size={20} />
        </button>

        <button
          onClick={onOpenCoach}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-[#0A0F1C] rounded-lg font-bold text-sm transition-all shadow-[0_0_15px_rgba(0,201,167,0.3)] hover:shadow-[0_0_20px_rgba(0,201,167,0.5)] transform hover:scale-105 active:scale-95"
        >
          <Bot size={18} />
          <span>CONVERSAR COM COACH IA</span>
        </button>
      </div>
    </header>
  );
};