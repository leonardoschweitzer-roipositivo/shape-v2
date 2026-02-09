
import React, { useState } from 'react';
import {
    User,
    Dumbbell,
    Building2,
    ChevronRight,
    Key,
    ShieldCheck,
    Layout
} from 'lucide-react';
import { ProfileType } from './organisms';

interface DebugUser {
    id: string;
    role: ProfileType;
    gender?: 'MALE' | 'FEMALE';
    name: string;
    email: string;
    password: string;
}

const DEBUG_USERS: DebugUser[] = [
    {
        id: 'debug-m-athlete',
        role: 'atleta',
        gender: 'MALE',
        name: 'Leonardo Schiwetzer',
        email: 'leonardo@email.com',
        password: '123'
    },
    {
        id: 'debug-f-athlete',
        role: 'atleta',
        gender: 'FEMALE',
        name: 'Atleta Mulher',
        email: 'atleta.mulher@vitru.v',
        password: '123'
    },
    {
        id: 'debug-personal',
        role: 'personal',
        name: 'Personal Trainer',
        email: 'personal@vitru.v',
        password: '123'
    },
    {
        id: 'debug-academia',
        role: 'academia',
        name: 'Academia Vitru',
        email: 'academia@vitru.v',
        password: '123'
    }
];

interface DebugAccessProps {
    onLogin: (user: DebugUser) => void;
    isVisible: boolean;
}

export const DebugAccess: React.FC<DebugAccessProps> = ({ onLogin, isVisible }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
            {/* Pop-up Panel */}
            {isOpen && (
                <div className="w-80 bg-[#0B101D]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="p-4 border-b border-white/5 bg-primary/10">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <ShieldCheck size={16} className="text-primary" />
                            DEBUG QUICK ACCESS
                        </h3>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">Selecione um perfil para testar</p>
                    </div>

                    <div className="p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                        {DEBUG_USERS.map((user) => (
                            <button
                                key={user.id}
                                onClick={() => onLogin(user)}
                                className="w-full p-3 rounded-xl hover:bg-white/5 transition-all text-left group flex items-center gap-3 border border-transparent hover:border-white/5"
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${user.role === 'atleta' ? 'bg-primary/20 text-primary' :
                                    user.role === 'personal' ? 'bg-secondary/20 text-secondary' :
                                        'bg-blue-500/20 text-blue-400'
                                    }`}>
                                    {user.role === 'atleta' && <Dumbbell size={18} />}
                                    {user.role === 'personal' && <User size={18} />}
                                    {user.role === 'academia' && <Building2 size={18} />}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                                        {user.gender && (
                                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10">
                                                {user.gender === 'MALE' ? '♂' : '♀'}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                                </div>

                                <ChevronRight size={16} className="text-gray-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </button>
                        ))}
                    </div>

                    <div className="p-3 bg-white/5 border-t border-white/5 text-center">
                        <p className="text-[9px] text-gray-500 flex items-center justify-center gap-1.5 uppercase tracking-widest">
                            <Key size={10} /> Password for all: 123
                        </p>
                    </div>
                </div>
            )}

            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 active:scale-90 border-2 ${isOpen
                    ? 'bg-background-dark border-primary text-primary rotate-90'
                    : 'bg-primary border-primary/20 text-background-dark'
                    }`}
            >
                {isOpen ? <Layout size={24} /> : <ShieldCheck size={24} />}
            </button>
        </div>
    );
};
