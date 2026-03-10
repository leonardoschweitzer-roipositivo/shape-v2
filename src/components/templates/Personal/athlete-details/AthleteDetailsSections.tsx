/**
 * AthleteDetailsView — Subcomponents & Helpers
 */
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, X, Archive } from 'lucide-react';

export const SectionHeader = ({ icon: Icon, title, subtitle, rightElement }: { icon: React.ElementType, title: string, subtitle: string, rightElement?: React.ReactNode }) => (
    <div className="flex items-center justify-between mb-8 group">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:border-primary/50 transition-all shadow-lg backdrop-blur-sm">
                <Icon size={24} />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-white uppercase tracking-tight leading-none mb-1">{title}</h2>
                <p className="text-gray-500 text-sm font-medium">{subtitle}</p>
            </div>
        </div>
        {rightElement}
    </div>
);

export const InfoCard = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
    <div className="bg-background-dark p-4 rounded-xl border border-white/5 flex items-center gap-4 group hover:border-primary/30 transition-all">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-all">
            <Icon size={20} />
        </div>
        <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</p>
            <p className="text-white font-semibold">{value}</p>
        </div>
    </div>
);

export const MeasurementItem = ({ label, value, unit, isEditing, onChange }: { label: string, value: number, unit: string, isEditing?: boolean, onChange?: (val: number) => void }) => (
    <div className="bg-background-dark/50 p-3 rounded-lg border border-white/5 flex justify-between items-center group hover:bg-background-dark transition-all">
        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">{label}</span>
        {isEditing ? (
            <div className="flex items-center gap-1">
                <input
                    type="number"
                    value={value || ''}
                    onChange={(e) => onChange?.(parseFloat(e.target.value) || 0)}
                    className="w-16 bg-transparent text-right text-white font-mono font-bold outline-none border-b border-primary/50 focus:border-primary px-1"
                />
                <span className="text-[10px] text-gray-500 font-normal">{unit}</span>
            </div>
        ) : (
            <span className="text-white font-mono font-bold">
                {value} <span className="text-[10px] text-gray-500 font-normal">{unit}</span>
            </span>
        )}
    </div>
);

export const Accordion = ({ title, icon: Icon, children, isOpen, onToggle, rightElement }: { title: string, icon: React.ElementType, children: React.ReactNode, isOpen: boolean, onToggle: () => void, rightElement?: React.ReactNode }) => (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-surface shadow-lg transition-all">
        <div className="flex items-center w-full hover:bg-white/[0.02] transition-colors group">
            <button
                onClick={onToggle}
                className="flex-1 flex items-center justify-between p-6 text-left"
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg transition-all ${isOpen ? 'bg-primary text-white' : 'bg-white/5 text-gray-400'}`}>
                        <Icon size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wide">{title}</h3>
                </div>
            </button>
            <div className="flex items-center gap-4 pr-6">
                {rightElement}
                <button onClick={onToggle} className="p-2">
                    {isOpen ? <ChevronUp className="text-primary" /> : <ChevronDown className="text-gray-500 group-hover:text-white" />}
                </button>
            </div>
        </div>
        {isOpen && (
            <div className="p-6 pt-0 border-t border-white/5 animate-fade-in">
                {children}
            </div>
        )}
    </div>
);

export const StatusSelector = ({ status, onChange }: { status: string, onChange: (s: string) => void }) => (
    <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
        {[
            { id: 'active', label: 'Ativo', icon: Check, color: 'text-green-500' },
            { id: 'inactive', label: 'Inativo', icon: X, color: 'text-gray-400' },
            { id: 'archived', label: 'Arquivar', icon: Archive, color: 'text-amber-500' }
        ].map((s) => (
            <button
                key={s.id}
                onClick={() => onChange(s.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${status === s.id ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
                    }`}
            >
                <s.icon size={12} className={status === s.id ? s.color : ''} />
                {s.label}
            </button>
        ))}
    </div>
);

export const calculateAge = (birthDateStr?: string): number | null => {
    if (!birthDateStr) return null;
    const birth = new Date(birthDateStr);
    if (isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};
