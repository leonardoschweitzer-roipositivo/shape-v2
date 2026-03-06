import React from 'react';
import { Building2, User, Dumbbell, Shield, LucideIcon } from 'lucide-react';

export type ProfileType = 'god' | 'academia' | 'personal' | 'atleta';

interface ProfileOption {
    id: ProfileType;
    label: string;
    icon: LucideIcon;
}

interface ProfileSelectorProps {
    selected: ProfileType;
    onSelect: (profile: ProfileType) => void;
    /** Quando true, exibe a opção GOD (só visível em debug/login interno) */
    showGod?: boolean;
}

const profiles: ProfileOption[] = [
    { id: 'god', label: 'GOD', icon: Shield },
    { id: 'academia', label: 'Academia', icon: Building2 },
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'atleta', label: 'Atleta', icon: Dumbbell },
];

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({ selected, onSelect, showGod = false }) => {
    const visibleProfiles = showGod ? profiles : profiles.filter(p => p.id !== 'god');

    return (
        <div className="space-y-3">
            <label className="text-xs text-gray-400 font-medium ml-1">Selecione seu perfil</label>
            <div className={`grid gap-3 ${visibleProfiles.length === 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
                {visibleProfiles.map((profile) => {
                    const Icon = profile.icon;
                    const isSelected = selected === profile.id;
                    const isGod = profile.id === 'god';

                    return (
                        <button
                            key={profile.id}
                            type="button"
                            onClick={() => onSelect(profile.id)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${isSelected
                                ? isGod
                                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                                    : 'bg-white/5 border-primary text-primary shadow-[0_0_15px_rgba(0,201,167,0.1)]'
                                : 'bg-transparent border-white/5 text-gray-500 hover:border-white/10 hover:bg-white/[0.02]'
                                }`}
                        >
                            <Icon size={20} />
                            <span className="text-xs font-medium">{profile.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
