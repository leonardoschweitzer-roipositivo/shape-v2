import React from 'react';
import { User, Camera, Loader2, ChevronLeft } from 'lucide-react';

interface HeaderAlunoProps {
    nome: string;
    email: string;
    fotoUrl?: string | null;
    nivel: string | null;
    loading: boolean;
    uploading: boolean;
    onVoltar: () => void;
    onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function HeaderAluno({
    nome,
    email,
    fotoUrl,
    nivel,
    uploading,
    onVoltar,
    onAvatarUpload
}: HeaderAlunoProps) {
    const cfg: Record<string, string> = {
        ELITE: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
        ATLETA: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
        EVOLUINDO: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
        INICIANDO: 'text-gray-400 bg-gray-400/10 border-gray-400/30',
    };
    const nivelEstilo = cfg[nivel ?? ''] ?? 'text-gray-400 bg-gray-400/10 border-gray-400/30';

    return (
        <div className="relative overflow-hidden bg-background-dark border-b border-white/5">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/10 via-transparent to-transparent" />

            <div className="relative px-4 pt-5 pb-4">
                <button
                    onClick={onVoltar}
                    className="flex items-center gap-1.5 text-gray-400 text-sm mb-4 hover:text-white transition-colors"
                >
                    <ChevronLeft size={18} />
                    <span>Alunos</span>
                </button>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative group shrink-0">
                            <label className="cursor-pointer block">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={onAvatarUpload}
                                    disabled={uploading}
                                />
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/20 overflow-hidden relative">
                                    {uploading ? (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 text-white">
                                            <Loader2 size={20} className="animate-spin" />
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-colors">
                                            <Camera size={18} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    )}
                                    {fotoUrl ? (
                                        <img src={fotoUrl} alt={nome} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="text-white/80" size={28} />
                                    )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-white p-1.5 rounded-full border-2 border-background-dark shadow-lg">
                                    <Camera size={10} />
                                </div>
                            </label>
                        </div>

                        <div className="space-y-1">
                            <h1 className="text-white text-xl font-black tracking-tight uppercase">{nome}</h1>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{email}</span>
                                {nivel && (
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${nivelEstilo}`}>
                                        {nivel}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
