import React from 'react';
import { Building2, User, Dumbbell, LucideIcon } from 'lucide-react';

export type ProfileType = 'academia' | 'personal' | 'atleta';

interface ProfileOption {
    id: ProfileType;
    label: string;
    icon: LucideIcon;
}

interface ProfileSelectorProps {
    selected: ProfileType;
    onSelect: (profile: ProfileType) => void;
}

const profiles: ProfileOption[] = [
    { id: 'academia', label: 'Academia', icon: Building2 },
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'atleta', label: 'Atleta', icon: Dumbbell },
];

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({ selected, onSelect }) => {
    return (
        <div className="space-y-3">
            <label className="text-xs text-gray-400 font-medium ml-1">Selecione seu perfil</label>
            <div className="grid grid-cols-3 gap-3">
                {profiles.map((profile) => {
                    const Icon = profile.icon;
                    const isSelected = selected === profile.id;

                    return (
                        <button
                            key={profile.id}
                            type="button"
                            onClick={() => onSelect(profile.id)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${isSelected
                                    ? 'bg-white/5 border-primary text-primary shadow-[0_0_15px_rgba(0,201,167,0.1)]'
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
