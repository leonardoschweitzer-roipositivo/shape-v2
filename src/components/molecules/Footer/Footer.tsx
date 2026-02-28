import React from 'react';
import { Layers } from 'lucide-react';

interface FooterProps {
  onOpenDesignSystem: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
  onOpenLibrary?: () => void;
  onOpenAthletePortal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDesignSystem, onOpenTerms, onOpenPrivacy, onOpenLibrary, onOpenAthletePortal }) => {
  return (
    <footer className="w-full border-t border-card-border bg-[#0A0F1C] py-6 px-8 mt-auto z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-500 font-medium">
          &copy; 2023 VITRU IA Analytics. Todos os direitos reservados.
        </p>

        <div className="flex items-center gap-6">
          <button
            onClick={onOpenDesignSystem}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary transition-colors uppercase tracking-wider group"
          >
            <Layers size={14} className="group-hover:text-primary transition-colors" />
            Design System
          </button>

          {onOpenAthletePortal && (
            <button
              onClick={onOpenAthletePortal}
              className="text-xs font-bold text-teal-500 hover:text-teal-400 transition-colors uppercase tracking-wider"
            >
              🏋️ Portal Atleta
            </button>
          )}

          <div className="flex gap-4">
            {onOpenLibrary && (
              <button
                onClick={onOpenLibrary}
                className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
              >
                Biblioteca
              </button>
            )}
            <button
              onClick={onOpenTerms}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Termos
            </button>
            <button
              onClick={onOpenPrivacy}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Privacidade
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};