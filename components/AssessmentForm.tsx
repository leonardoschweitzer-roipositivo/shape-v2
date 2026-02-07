import React from 'react';
import { Sparkles, ArrowRight, Scale, Ruler, GitCommit, Layers, Activity } from 'lucide-react';
import { InputField } from './InputField';

interface AssessmentFormProps {
    onConfirm: () => void;
    isModal?: boolean;
}

const SymmetryRow: React.FC<{ label: string }> = ({ label }) => (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
        <div className="relative">
            <input type="number" className="w-full bg-[#0A0F1C] border border-white/10 rounded-lg px-4 py-2.5 text-right text-white placeholder-gray-700 focus:border-primary/50 focus:outline-none text-sm font-mono" placeholder="00.0" />
        </div>

        <span className="text-gray-400 text-sm font-medium w-32 text-center">{label}</span>

        <div className="relative">
            <input type="number" className="w-full bg-[#0A0F1C] border border-white/10 rounded-lg px-4 py-2.5 text-left text-white placeholder-gray-700 focus:border-primary/50 focus:outline-none text-sm font-mono" placeholder="00.0" />
        </div>
    </div>
);

// Simple icon component for Trunk section
const UserIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

export const AssessmentForm: React.FC<AssessmentFormProps> = ({ onConfirm, isModal = false }) => {
    return (
        <div className={`flex flex-col ${isModal ? 'h-full' : 'w-full'}`}>
            {/* Scrollable Form Area - Only scrollable if in modal */}
            <div className={`${isModal ? 'flex-1 overflow-y-auto p-6 md:p-8' : ''} space-y-10 custom-scrollbar`}>

                {/* Section 1: Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Basics */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                            <Scale size={14} /> Básicas
                        </h3>
                        <div className="h-[1px] w-full bg-white/5"></div>
                        <div className="space-y-4">
                            <InputField label="Idade" unit="anos" placeholder="00" />
                            <InputField label="Altura" unit="cm" placeholder="000" />
                            <InputField label="Peso" unit="kg" placeholder="00.0" />
                        </div>
                    </div>

                    {/* Trunk */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                            <UserIcon /> Tronco
                        </h3>
                        <div className="h-[1px] w-full bg-white/5"></div>
                        <div className="space-y-4">
                            <InputField label="Pescoço" unit="cm" />
                            <InputField label="Ombros" unit="cm" />
                            <InputField label="Peitoral" unit="cm" />
                        </div>
                    </div>

                    {/* Core */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                            <Layers size={14} /> Core
                        </h3>
                        <div className="h-[1px] w-full bg-white/5"></div>
                        <div className="space-y-4">
                            <InputField label="Cintura" unit="cm" />
                            <InputField label="Quadril" unit="cm" />
                        </div>
                    </div>
                </div>

                {/* Section 2: Symmetry */}
                <div className="space-y-6">
                    <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                        <GitCommit size={14} /> Simetria de Membros
                    </h3>
                    <div className="bg-[#0A0F1C]/50 rounded-xl p-6 border border-white/5">
                        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 mb-4 px-1">
                            <span className="text-[10px] font-bold text-primary uppercase text-right">Esquerda (cm)</span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase text-center w-32">Região</span>
                            <span className="text-[10px] font-bold text-primary uppercase text-left">Direita (cm)</span>
                        </div>

                        <div className="space-y-3">
                            <SymmetryRow label="Braço (Relaxado)" />
                            <SymmetryRow label="Antebraço" />
                            <SymmetryRow label="Punho" />
                            <SymmetryRow label="Coxa" />
                            <SymmetryRow label="Joelho" />
                            <SymmetryRow label="Panturrilha" />
                            <SymmetryRow label="Tornozelo" />
                        </div>
                    </div>
                </div>

                {/* Section 3: Skinfolds */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                            <Ruler size={14} /> Protocolo 7 Dobras
                        </h3>
                        <span className="text-[10px] font-bold text-secondary uppercase">Unidade: MM</span>
                    </div>
                    <div className="h-[1px] w-full bg-white/5"></div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <InputField label="Subescapular" placeholder="0" />
                        <InputField label="Tricipital" placeholder="0" />
                        <InputField label="Peitoral" placeholder="0" />
                        <InputField label="Axilar Média" placeholder="0" />
                        <InputField label="Supra-ilíaca" placeholder="0" />
                        <InputField label="Abdominal" placeholder="0" />
                        <InputField label="Coxa" placeholder="0" />
                    </div>
                </div>

            </div>

            {/* Footer Actions */}
            <div className={`border-t border-white/5 flex justify-end ${isModal ? 'p-6 bg-[#131B2C]' : 'mt-10 pt-6'}`}>
                <button
                    onClick={onConfirm}
                    className="flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-[#0A0F1C] rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(0,201,167,0.2)] hover:shadow-[0_0_30px_rgba(0,201,167,0.4)] transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Sparkles size={18} />
                    <span>Realizar Avaliação IA</span>
                    <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};
