import React, { useState } from 'react';
import { X, UserPlus, Mail, User, Calendar, Target, Sparkles, ArrowRight, Smartphone, Link as LinkIcon, QrCode } from 'lucide-react';
import { Gender, UserGoal, GENDER_LABELS, GOAL_LABELS } from '@/types/athlete';
import { inviteService } from '@/services/invites';
import { registrationService } from '@/services/registration';

interface AthleteInvitationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInvite: (data: any) => void;
}

type TabType = 'WHATSAPP' | 'EMAIL' | 'LINK' | 'QR' | 'MANUAL';

export const AthleteInvitationModal: React.FC<AthleteInvitationModalProps> = ({
    isOpen,
    onClose,
    onInvite
}) => {
    const [activeTab, setActiveTab] = useState<TabType>('WHATSAPP');
    const [loading, setLoading] = useState(false);

    // Manual Registration State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState<Gender>('MALE');
    const [birthDate, setBirthDate] = useState('');
    const [goal, setGoal] = useState<UserGoal>('aesthetics');

    // Invite State
    const [generatedLink, setGeneratedLink] = useState('');
    const [whatsappMessage, setWhatsappMessage] = useState(`Olá! 👋

Você foi convidado(a) para fazer parte do meu time de atletas no VITRU IA - o app que analisa suas proporções corporais usando a matemática do físico perfeito!

Clique no link abaixo para criar sua conta:
{link}

Qualquer dúvida, estou à disposição!`);

    if (!isOpen) return null;

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await registrationService.registerManual('ATLETA', {
                name,
                email,
                gender,
                birthDate,
                goal,
                sendInviteEmail: true
            });
            onInvite(result);
            onClose();
            // Reset
            setName('');
            setEmail('');
            setGender('MALE');
            setBirthDate('');
            setGoal('aesthetics');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const generateInviteLink = async (type: 'LINK_GENERIC' | 'WHATSAPP') => {
        setLoading(true);
        try {
            const invite = await inviteService.createInvite({
                type,
                targetRole: 'ATLETA',
                customMessage: type === 'WHATSAPP' ? whatsappMessage : undefined
            });

            if (type === 'WHATSAPP' && invite.whatsappUrl) {
                window.open(invite.whatsappUrl, '_blank');
            } else {
                setGeneratedLink(invite.url);
            }
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
                className="absolute inset-0 bg-backdrop/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="relative bg-surface border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-up h-[600px]">

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-surface">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                            CONVIDAR NOVO ALUNO
                            <Sparkles size={12} className="text-secondary animate-pulse" />
                        </h2>
                        <p className="text-xs text-gray-400">Escolha como deseja adicionar o aluno ao seu time.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Tabs */}
                    <div className="w-48 bg-background-dark border-r border-white/5 flex flex-col p-4 gap-2">
                        <button
                            onClick={() => setActiveTab('WHATSAPP')}
                            className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'WHATSAPP' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Smartphone size={18} /> WhatsApp
                        </button>
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
                        <button
                            onClick={() => setActiveTab('QR')}
                            className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'QR' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <QrCode size={18} /> QR Code
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
                    <div className="flex-1 overflow-y-auto p-6 bg-surface">

                        {activeTab === 'WHATSAPP' && (
                            <div className="space-y-6">
                                <div className="bg-background-dark p-4 rounded-xl border border-white/5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Prévia da Mensagem</label>
                                    <textarea
                                        value={whatsappMessage}
                                        onChange={(e) => setWhatsappMessage(e.target.value)}
                                        className="w-full h-40 bg-transparent text-white text-sm resize-none focus:outline-none"
                                    />
                                </div>
                                <button
                                    onClick={() => generateInviteLink('WHATSAPP')}
                                    disabled={loading}
                                    className="w-full h-12 bg-[#25D366] hover:brightness-110 text-black rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(37,211,102,0.2)]"
                                >
                                    {loading ? 'Gerando...' : 'Abrir no WhatsApp'}
                                </button>
                            </div>
                        )}

                        {activeTab === 'EMAIL' && (
                            <div className="space-y-6 flex flex-col items-center justify-center h-full text-center">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                    <Mail size={32} className="text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Convite por Email</h3>
                                <p className="text-gray-400 text-sm max-w-xs">Envie um link único e rastreável diretamente para o email do aluno.</p>
                                <input
                                    type="email"
                                    placeholder="email@aluno.com"
                                    className="w-full max-w-sm bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 text-sm"
                                />
                                <button className="w-full max-w-sm h-12 bg-primary hover:bg-primary/90 text-black rounded-xl font-bold transition-all">
                                    Enviar Convite
                                </button>
                            </div>
                        )}

                        {activeTab === 'LINK' && (
                            <div className="space-y-6">
                                <div className="text-center space-y-2">
                                    <h3 className="text-lg font-bold text-white">Link de Convite</h3>
                                    <p className="text-gray-400 text-sm">Gere um link reutilizável para compartilhar em qualquer lugar.</p>
                                </div>

                                {!generatedLink ? (
                                    <button
                                        onClick={() => generateInviteLink('LINK_GENERIC')}
                                        disabled={loading}
                                        className="w-full h-12 bg-primary hover:bg-primary/90 text-black rounded-xl font-bold transition-all"
                                    >
                                        {loading ? 'Gerando...' : 'Gerar Link'}
                                    </button>
                                ) : (
                                    <div className="space-y-4 animate-fade-in">
                                        <div className="bg-background-dark p-4 rounded-xl border border-primary/20 flex items-center justify-between gap-4">
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

                        {activeTab === 'QR' && (
                            <div className="h-full flex flex-col items-center justify-center space-y-6">
                                <div className="bg-white p-4 rounded-xl">
                                    {/* Mock QR Code */}
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://vitru.ia/register`}
                                        alt="QR Code"
                                        className="w-48 h-48"
                                    />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-white font-bold">QR Code para Cadastro</h3>
                                    <p className="text-gray-400 text-xs mt-1">Peça para o aluno escanear com a câmera</p>
                                </div>
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
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Gênero</label>
                                        <select
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value as Gender)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 text-sm appearance-none cursor-pointer"
                                        >
                                            <option value="MALE">Masculino</option>
                                            <option value="FEMALE">Feminino</option>
                                            <option value="OTHER">Outro</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nascimento</label>
                                        <input
                                            type="date"
                                            value={birthDate}
                                            onChange={(e) => setBirthDate(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 bg-primary hover:bg-primary/90 text-black rounded-xl font-bold flex items-center justify-center gap-2 transition-all mt-4"
                                >
                                    {loading ? 'Cadastrando...' : 'CADASTRAR ALUNO'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
