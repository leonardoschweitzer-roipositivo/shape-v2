import React, { useState } from 'react';
import { X, UserPlus, Mail, User, Calendar, Target, Sparkles, ArrowRight } from 'lucide-react';
import { Gender, UserGoal, GENDER_LABELS, GOAL_LABELS } from '@/types/athlete';

interface AthleteInvitationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInvite: (data: {
        name: string;
        email: string;
        gender: Gender;
        birthDate: string;
        goal: UserGoal;
    }) => void;
}

export const AthleteInvitationModal: React.FC<AthleteInvitationModalProps> = ({
    isOpen,
    onClose,
    onInvite
}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState<Gender>('MALE');
    const [birthDate, setBirthDate] = useState('');
    const [goal, setGoal] = useState<UserGoal>('aesthetics');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onInvite({ name, email, gender, birthDate, goal });
        onClose();
        // Reset form
        setName('');
        setEmail('');
        setGender('MALE');
        setBirthDate('');
        setGoal('aesthetics');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#050810]/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-[#131B2C] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-up">

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#131B2C]">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                            CADASTRAR NOVO ALUNO
                            <Sparkles size={12} className="text-secondary animate-pulse" />
                        </h2>
                        <p className="text-xs text-gray-400">Insira os dados básicos para iniciar o acompanhamento.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Nome */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <User size={12} /> Nome Completo
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                            placeholder="Nome do aluno"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Mail size={12} /> Email do Aluno
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                            placeholder="email@aluno.com"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Gênero - CRITICAL CHANGE REQUESTED */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Gênero</label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value as Gender)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm appearance-none cursor-pointer"
                            >
                                <option value="MALE">Masculino</option>
                                <option value="FEMALE">Feminino</option>
                                <option value="OTHER">Outro</option>
                            </select>
                        </div>

                        {/* Nascimento */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Calendar size={12} /> Nascimento
                            </label>
                            <input
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                                required
                            />
                        </div>
                    </div>

                    {/* Objetivo */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Target size={12} /> Objetivo Principal
                        </label>
                        <select
                            value={goal}
                            onChange={(e) => setGoal(e.target.value as UserGoal)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm appearance-none cursor-pointer"
                        >
                            {Object.entries(GOAL_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 flex flex-col gap-3">
                        <button
                            type="submit"
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-[#0A0F1C] rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,201,167,0.2)] hover:shadow-[0_0_20px_rgba(0,201,167,0.4)] group"
                        >
                            CONCLUIR CADASTRO
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-3 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
