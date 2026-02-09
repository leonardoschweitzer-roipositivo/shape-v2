import React from 'react';
import { X, Activity } from 'lucide-react';
import { AssessmentForm } from '../AssessmentForm';

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { measurements: any; skinfolds: any }) => void;
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#050810]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-[#131B2C] border border-white/10 w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-up">

        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-start justify-between bg-[#131B2C] z-10 shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Activity className="text-primary" size={20} />
              <h2 className="text-xl font-bold text-white tracking-wide">MEDIDAS CORPORAIS</h2>
            </div>
            <p className="text-sm text-gray-400">Insira os dados métricos para análise de simetria bilateral e proporção áurea.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 rounded border border-white/10 bg-primary/5 text-primary text-[10px] font-bold tracking-widest">
              PROTOCOLO V.2.0
            </span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          <AssessmentForm onConfirm={onConfirm} isModal={true} />
        </div>
      </div>
    </div>
  );
};