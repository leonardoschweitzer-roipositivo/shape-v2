import React, { useState } from 'react';
import { Sparkles, ArrowRight, Scale, Ruler, GitCommit, Layers, Activity } from 'lucide-react';
import { InputField } from '@/components/atoms';

interface Measurements {
    weight: number;
    height: number;
    neck: number;
    shoulders: number;
    chest: number;
    waist: number;
    hips: number;
    armRight: number;
    armLeft: number;
    forearmRight: number;
    forearmLeft: number;
    thighRight: number;
    thighLeft: number;
    calfRight: number;
    calfLeft: number;
    wristRight: number;
    wristLeft: number;
    kneeRight: number;
    kneeLeft: number;
    ankleRight: number;
    ankleLeft: number;
}

interface Skinfolds {
    tricep: number;
    subscapular: number;
    chest: number;
    axillary: number;
    suprailiac: number;
    abdominal: number;
    thigh: number;
}

interface AssessmentFormProps {
    onConfirm: (data: { measurements: Measurements; skinfolds: Skinfolds }) => void;
    isModal?: boolean;
}

interface SymmetryRowProps {
    label: string;
    leftValue: number | undefined;
    rightValue: number | undefined;
    onLeftChange: (val: string) => void;
    onRightChange: (val: string) => void;
}

const SymmetryRow: React.FC<SymmetryRowProps> = ({ label, leftValue, rightValue, onLeftChange, onRightChange }) => (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
        <div className="relative">
            <input
                type="number"
                value={leftValue || ''}
                onChange={(e) => onLeftChange(e.target.value)}
                className="w-full bg-[#0A0F1C] border border-white/10 rounded-lg px-4 py-2.5 text-right text-white placeholder-gray-700 focus:border-primary/50 focus:outline-none text-sm font-mono"
                placeholder="00.0"
            />
        </div>

        <span className="text-gray-400 text-sm font-medium w-32 text-center">{label}</span>

        <div className="relative">
            <input
                type="number"
                value={rightValue || ''}
                onChange={(e) => onRightChange(e.target.value)}
                className="w-full bg-[#0A0F1C] border border-white/10 rounded-lg px-4 py-2.5 text-left text-white placeholder-gray-700 focus:border-primary/50 focus:outline-none text-sm font-mono"
                placeholder="00.0"
            />
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
    // Initialize state with default or empty values
    // Using simple flat state for easier binding, will allow partial entry but validation might be needed later
    const [measurements, setMeasurements] = useState<Partial<Measurements>>({});
    const [skinfolds, setSkinfolds] = useState<Partial<Skinfolds>>({});

    const handleMeasurementChange = (field: keyof Measurements, value: string) => {
        setMeasurements(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
    };

    const handleSkinfoldChange = (field: keyof Skinfolds, value: string) => {
        setSkinfolds(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
    };

    const handleSubmit = () => {
        // Construct full objects, filling missing with 0
        const finalMeasurements: Measurements = {
            weight: measurements.weight || 0,
            height: measurements.height || 0,
            neck: measurements.neck || 0,
            shoulders: measurements.shoulders || 0,
            chest: measurements.chest || 0,
            waist: measurements.waist || 0,
            hips: measurements.hips || 0,
            armRight: measurements.armRight || 0,
            armLeft: measurements.armLeft || 0,
            forearmRight: measurements.forearmRight || 0,
            forearmLeft: measurements.forearmLeft || 0,
            thighRight: measurements.thighRight || 0,
            thighLeft: measurements.thighLeft || 0,
            calfRight: measurements.calfRight || 0,
            calfLeft: measurements.calfLeft || 0,
            wristRight: measurements.wristRight || 0,
            wristLeft: measurements.wristLeft || 0,
            kneeRight: measurements.kneeRight || 0,
            kneeLeft: measurements.kneeLeft || 0,
            ankleRight: measurements.ankleRight || 0,
            ankleLeft: measurements.ankleLeft || 0,
        };

        const finalSkinfolds: Skinfolds = {
            tricep: skinfolds.tricep || 0,
            subscapular: skinfolds.subscapular || 0,
            chest: skinfolds.chest || 0,
            axillary: skinfolds.axillary || 0,
            suprailiac: skinfolds.suprailiac || 0,
            abdominal: skinfolds.abdominal || 0,
            thigh: skinfolds.thigh || 0,
        };

        onConfirm({ measurements: finalMeasurements, skinfolds: finalSkinfolds });
    };

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
                            {/* Idade field is UI only for now in mock since it's not in measurements struct, or derived from birthdate */}
                            <InputField label="Idade" unit="anos" placeholder="00" />
                            <InputField
                                label="Altura" unit="cm" placeholder="000"
                                value={measurements.height || ''}
                                onChange={(e) => handleMeasurementChange('height', e.target.value)}
                            />
                            <InputField
                                label="Peso" unit="kg" placeholder="00.0"
                                value={measurements.weight || ''}
                                onChange={(e) => handleMeasurementChange('weight', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Trunk */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                            <UserIcon /> Tronco
                        </h3>
                        <div className="h-[1px] w-full bg-white/5"></div>
                        <div className="space-y-4">
                            <InputField
                                label="Pescoço" unit="cm"
                                value={measurements.neck || ''}
                                onChange={(e) => handleMeasurementChange('neck', e.target.value)}
                            />
                            <InputField
                                label="Ombros" unit="cm"
                                value={measurements.shoulders || ''}
                                onChange={(e) => handleMeasurementChange('shoulders', e.target.value)}
                            />
                            <InputField
                                label="Peitoral" unit="cm"
                                value={measurements.chest || ''}
                                onChange={(e) => handleMeasurementChange('chest', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Core */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                            <Layers size={14} /> Core
                        </h3>
                        <div className="h-[1px] w-full bg-white/5"></div>
                        <div className="space-y-4">
                            <InputField
                                label="Cintura" unit="cm"
                                value={measurements.waist || ''}
                                onChange={(e) => handleMeasurementChange('waist', e.target.value)}
                            />
                            <InputField
                                label="Quadril" unit="cm"
                                value={measurements.hips || ''}
                                onChange={(e) => handleMeasurementChange('hips', e.target.value)}
                            />
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
                            <SymmetryRow
                                label="Braço (Relaxado)"
                                leftValue={measurements.armLeft} rightValue={measurements.armRight}
                                onLeftChange={(v) => handleMeasurementChange('armLeft', v)}
                                onRightChange={(v) => handleMeasurementChange('armRight', v)}
                            />
                            <SymmetryRow
                                label="Antebraço"
                                leftValue={measurements.forearmLeft} rightValue={measurements.forearmRight}
                                onLeftChange={(v) => handleMeasurementChange('forearmLeft', v)}
                                onRightChange={(v) => handleMeasurementChange('forearmRight', v)}
                            />
                            <SymmetryRow
                                label="Punho"
                                leftValue={measurements.wristLeft} rightValue={measurements.wristRight}
                                onLeftChange={(v) => handleMeasurementChange('wristLeft', v)}
                                onRightChange={(v) => handleMeasurementChange('wristRight', v)}
                            />
                            <SymmetryRow
                                label="Coxa"
                                leftValue={measurements.thighLeft} rightValue={measurements.thighRight}
                                onLeftChange={(v) => handleMeasurementChange('thighLeft', v)}
                                onRightChange={(v) => handleMeasurementChange('thighRight', v)}
                            />
                            <SymmetryRow
                                label="Joelho"
                                leftValue={measurements.kneeLeft} rightValue={measurements.kneeRight}
                                onLeftChange={(v) => handleMeasurementChange('kneeLeft', v)}
                                onRightChange={(v) => handleMeasurementChange('kneeRight', v)}
                            />
                            <SymmetryRow
                                label="Panturrilha"
                                leftValue={measurements.calfLeft} rightValue={measurements.calfRight}
                                onLeftChange={(v) => handleMeasurementChange('calfLeft', v)}
                                onRightChange={(v) => handleMeasurementChange('calfRight', v)}
                            />
                            <SymmetryRow
                                label="Tornozelo"
                                leftValue={measurements.ankleLeft} rightValue={measurements.ankleRight}
                                onLeftChange={(v) => handleMeasurementChange('ankleLeft', v)}
                                onRightChange={(v) => handleMeasurementChange('ankleRight', v)}
                            />
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
                        <InputField
                            label="Subescapular" placeholder="0"
                            value={skinfolds.subscapular || ''}
                            onChange={(e) => handleSkinfoldChange('subscapular', e.target.value)}
                        />
                        <InputField
                            label="Tricipital" placeholder="0"
                            value={skinfolds.tricep || ''}
                            onChange={(e) => handleSkinfoldChange('tricep', e.target.value)}
                        />
                        <InputField
                            label="Peitoral" placeholder="0"
                            value={skinfolds.chest || ''}
                            onChange={(e) => handleSkinfoldChange('chest', e.target.value)}
                        />
                        <InputField
                            label="Axilar Média" placeholder="0"
                            value={skinfolds.axillary || ''}
                            onChange={(e) => handleSkinfoldChange('axillary', e.target.value)}
                        />
                        <InputField
                            label="Supra-ilíaca" placeholder="0"
                            value={skinfolds.suprailiac || ''}
                            onChange={(e) => handleSkinfoldChange('suprailiac', e.target.value)}
                        />
                        <InputField
                            label="Abdominal" placeholder="0"
                            value={skinfolds.abdominal || ''}
                            onChange={(e) => handleSkinfoldChange('abdominal', e.target.value)}
                        />
                        <InputField
                            label="Coxa" placeholder="0"
                            value={skinfolds.thigh || ''}
                            onChange={(e) => handleSkinfoldChange('thigh', e.target.value)}
                        />
                    </div>
                </div>

            </div>

            {/* Footer Actions */}
            <div className={`border-t border-white/5 flex justify-end ${isModal ? 'p-6 bg-[#131B2C]' : 'mt-10 pt-6'}`}>
                <button
                    onClick={handleSubmit}
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
