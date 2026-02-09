import React, { useState } from 'react';
import { X, UserPlus, Mail, Link as LinkIcon, Sparkles, ArrowRight, ShieldCheck, Dumbbell } from 'lucide-react';
import { inviteService } from '@/services/invites';
import { registrationService } from '@/services/registration';

interface PersonalInvitationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInvite: (data: any) => void;
}

type TabType = 'EMAIL' | 'LINK' | 'MANUAL';

export const PersonalInvitationModal: React.FC<PersonalInvitationModalProps> = ({
    isOpen,
    onClose,
    onInvite
}) => {
    const [activeTab, setActiveTab] = useState<TabType>('EMAIL');
    const [loading, setLoading] = useState(false);

    // Manual Registration State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cref, setCref] = useState('');
    const [specialties, setSpecialties] = useState('');

    // Invite State
    const [generatedLink, setGeneratedLink] = useState('');

    if (!isOpen) return null;

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await registrationService.registerManual('PERSONAL', {
                name,
                email,
                cref,
                specialties: specialties.split(',').map(s => s.trim()),
                sendInviteEmail: true
            });
            onInvite(result);
            onClose();
            // Reset
            setName('');
            setEmail('');
            setCref('');
            setSpecialties('');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const generateInviteLink = async (type: 'LINK_GENERIC') => {
        setLoading(true);
        try {
            const invite = await inviteService.createInvite({
                type,
                targetRole: 'PERSONAL'
            });
            setGeneratedLink(invite.url);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(generatedLink);
        alert('Link copiado!');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-[#050810]/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="relative bg-[#131B2C] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-up h-[500px]">

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#131B2C]">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                            ADICIONAR PERSONAL TRAINER
                            <Sparkles size={12} className="text-secondary animate-pulse" />
                        </h2>
                        <p className="text-xs text-gray-400">Gerencie o time de personais da academia.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Tabs */}
                    <div className="w-48 bg-[#0A0F1C] border-r border-white/5 flex flex-col p-4 gap-2">
                        <button
                            onClick={() => setActiveTab('EMAIL')}
                            className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'EMAIL' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Mail size={18} /> Email
                        </button>
                        <button
                            onClick={() => setActiveTab('LINK')}
                            className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'LINK' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <LinkIcon size={18} /> Link
                        </button>
                        <div className="my-2 border-t border-white/5 mx-2"></div>
                        <button
                            onClick={() => setActiveTab('MANUAL')}
                            className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'MANUAL' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <UserPlus size={18} /> Manual
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 bg-[#131B2C]">

                        {activeTab === 'EMAIL' && (
                            <div className="space-y-6 flex flex-col items-center justify-center h-full text-center">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                    <Mail size={32} className="text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Convite por Email</h3>
                                <p className="text-gray-400 text-sm max-w-xs">O personal receberá um link para cadastro vinculado à sua academia.</p>
                                <input
                                    type="email"
                                    placeholder="email@personal.com"
                                    className="w-full max-w-sm bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 text-sm"
                                />
                                <button className="w-full max-w-sm h-12 bg-primary hover:bg-primary/90 text-[#0A0F1C] rounded-xl font-bold transition-all">
                                    Enviar Convite
                                </button>
                            </div>
                        )}

                        {activeTab === 'LINK' && (
                            <div className="space-y-6">
                                <div className="text-center space-y-2">
                                    <h3 className="text-lg font-bold text-white">Link de Afiliação</h3>
                                    <p className="text-gray-400 text-sm">Compartilhe este link com personais para que eles se cadastrem na sua academia.</p>
                                </div>

                                {!generatedLink ? (
                                    <button
                                        onClick={() => generateInviteLink('LINK_GENERIC')}
                                        disabled={loading}
                                        className="w-full h-12 bg-primary hover:bg-primary/90 text-[#0A0F1C] rounded-xl font-bold transition-all"
                                    >
                                        {loading ? 'Gerando...' : 'Gerar Link'}
                                    </button>
                                ) : (
                                    <div className="space-y-4 animate-fade-in">
                                        <div className="bg-[#0A0F1C] p-4 rounded-xl border border-primary/20 flex items-center justify-between gap-4">
                                            <code className="text-primary text-sm truncate">{generatedLink}</code>
                                            <button onClick={copyLink} className="text-white hover:text-primary transition-colors text-sm font-bold whitespace-nowrap">
                                                COPIAR
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => setGeneratedLink('')}
                                            className="w-full py-2 text-xs font-bold text-gray-500 hover:text-white transition-colors"
                                        >
                                            Gerar novo link
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'MANUAL' && (
                            <form onSubmit={handleManualSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nome Completo</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 text-sm"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <ShieldCheck size={12} /> CREF
                                        </label>
                                        <input
                                            type="text"
                                            value={cref}
                                            onChange={(e) => setCref(e.target.value)}
                                            placeholder="000000-G/UF"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 text-sm"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <Dumbbell size={12} /> Especialidades
                                        </label>
                                        <input
                                            type="text"
                                            value={specialties}
                                            onChange={(e) => setSpecialties(e.target.value)}
                                            placeholder="Musculação, CrossFit..."
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 text-sm"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 bg-primary hover:bg-primary/90 text-[#0A0F1C] rounded-xl font-bold flex items-center justify-center gap-2 transition-all mt-4"
                                >
                                    {loading ? 'Cadastrando...' : 'CADASTRAR PERSONAL'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
