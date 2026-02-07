import React from 'react';
import { Layers } from 'lucide-react';

interface FooterProps {
  onOpenDesignSystem: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDesignSystem }) => {
  return (
    <footer className="w-full border-t border-card-border bg-[#0A0F1C] py-6 px-8 mt-auto z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-500 font-medium">
          &copy; 2023 SHAPE-V Analytics. Todos os direitos reservados.
        </p>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={onOpenDesignSystem}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary transition-colors uppercase tracking-wider group"
          >
            <Layers size={14} className="group-hover:text-primary transition-colors" />
            Design System
          </button>
          
          <div className="flex gap-4">
             <a href="#" className="text-xs text-gray-600 hover:text-gray-400">Termos</a>
             <a href="#" className="text-xs text-gray-600 hover:text-gray-400">Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
};