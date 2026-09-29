import React, { useState } from 'react';
import {
    User,
    Mail,
    Award,
    Briefcase,
    Calendar,
    Users,
    TrendingUp,
    Shield,
    ChevronRight,
    Edit3,
    Check,
    X,
    MessageCircle,
    Smartphone,
    Copy,
    ExternalLink,
    MapPin,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { PersonalProfile } from '@/mocks/personal';
import type { Personal } from '@/lib/database.types';
import { useAuthStore } from '@/stores/authStore';
import { useDataStore } from '@/stores/dataStore';
import { personalService } from '@/services/personal.service';
import {
    PersonalDadosForm,
    dadosProfissionaisDe,
    paraPayloadPersonal,
    validarDadosProfissionais,
    type DadosProfissionais,
    type ErrosDadosProfissionais,
} from '@/components/organisms/PersonalDadosForm';
import { AlterarSenhaModal } from '@/components/organisms/AlterarSenhaModal';
import {
    PLANO_PERSONAL_LABEL,
    SUPORTE_WHATSAPP_URL,
    formatarLimiteAlunos,
    percentualUsoPlano,
} from '@/utils/planoPersonal';

function formatarMembroDesde(iso: string | undefined): string {
    if (!iso) return '—';
    const data = new Date(iso);
    return Number.isNaN(data.getTime()) ? '—' : format(data, "MMMM 'de' yyyy", { locale: ptBR });
}

// ============================================
// SUB-COMPONENTS
// ============================================

const ProfileHeader: React.FC<{ profile: PersonalProfile; personal: Personal | null | undefined; ativos: number }> = ({
    profile,
    personal,
    ativos,
}) => {
    const initials = profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

    const plano = personal?.plano ?? 'FREE';
    const limite = personal?.limite_atletas ?? null;
    const uso = percentualUsoPlano(ativos, limite);

    return (
        <div className="flex flex-col md:flex-row md:items-center gap-6 p-6 bg-surface rounded-2xl border border-white/10 shadow-xl animate-fade-in-up">
            {/* Avatar */}
            <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30 flex items-center justify-center">
                    {profile.avatarUrl ? (
                        <img
                            src={profile.avatarUrl}
                            alt={profile.name}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <span className="text-3xl font-bold text-primary">{initials}</span>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                    <div className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-[10px] font-bold text-primary uppercase tracking-widest">
                        PERSONAL TRAINER
                    </div>
                </div>
                <p className="text-gray-400 font-light">{profile.email}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar size={14} className="text-gray-600" />
                        Membro desde {formatarMembroDesde(profile.createdAt)}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Shield size={14} className="text-gray-600" />
                        CREF: {profile.cref || 'Não cadastrado'}
                    </div>
                </div>
            </div>

            {/* Plano */}
            <div className="flex flex-col md:items-end gap-2">
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center min-w-[180px]">
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">PLANO ATUAL</span>
                    <span className="text-lg font-bold text-white uppercase tracking-tight">{PLANO_PERSONAL_LABEL[plano]}</span>
                    <div className="text-[10px] text-primary mt-1 font-medium uppercase">{formatarLimiteAlunos(limite)}</div>
                    {uso != null && (
                        <div className="w-full mt-3">
                            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${uso >= 100 ? 'bg-rose-500' : uso >= 80 ? 'bg-amber-400' : 'bg-primary'}`}
                                    style={{ width: `${uso}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1 text-center">{ativos} de {limite} alunos ativos</p>
                        </div>
                    )}
                </div>
                {plano !== 'UNLIMITED' && (SUPORTE_WHATSAPP_URL ? (
                    <a
                        href={SUPORTE_WHATSAPP_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1"
                    >
                        Fazer upgrade <ChevronRight size={12} />
                    </a>
                ) : (
                    <span className="text-[10px] text-gray-500">Para mais alunos, fale com o suporte.</span>
                ))}
            </div>
        </div>
    );
};

const InfoCard: React.FC<{
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
    onEdit?: () => void;
}> = ({ title, icon: Icon, children, onEdit }) => (
    <div className="bg-surface border border-white/10 rounded-2xl p-6 shadow-lg hover:border-white/20 transition-all">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                    <Icon size={20} className="text-primary" />
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">{title}</h3>
            </div>
            {onEdit && (
                <button
                    onClick={onEdit}
                    className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors"
                >
                    <Edit3 size={18} />
                </button>
            )}
        </div>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const InfoRow: React.FC<{ label: string; value: string | React.ReactNode; icon?: React.ElementType }> = ({ label, value, icon: Icon }) => (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors rounded-lg px-2 -mx-2">
        <div className="flex items-center gap-3 text-gray-400">
            {Icon && <Icon size={16} className="text-gray-500" />}
            <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm font-bold text-white text-right">{value}</span>
    </div>
);

// ============================================
// PORTAL CARD
// ============================================

const PortalCard: React.FC<{ personalId: string }> = ({ personalId }) => {
    const [copiado, setCopiado] = useState(false);
    const portalUrl = `${window.location.origin}/personal/${personalId}`;

    const copiarLink = () => {
        navigator.clipboard.writeText(portalUrl).then(() => {
            setCopiado(true);
            setTimeout(() => setCopiado(false), 2000);
        });
    };

    const abrirPortal = () => {
        window.open(portalUrl, '_blank');
    };

    return (
        <div className="bg-surface border border-white/10 rounded-2xl p-6 shadow-lg hover:border-white/20 transition-all">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                    <Smartphone size={20} className="text-primary" />
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">Portal do Personal</h3>
            </div>

            <p className="text-sm text-gray-400 font-light mb-4 leading-relaxed">
                Acesse sua visão mobile do portal para acompanhar alunos, alertas e atividades do dia a dia diretamente pelo celular.
            </p>

            {/* URL */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-4">
                <span className="text-xs text-gray-400 font-mono flex-1 truncate">{portalUrl}</span>
            </div>

            {/* Ações */}
            <div className="flex gap-3">
                <button
                    onClick={copiarLink}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${copiado
                            ? 'bg-primary/20 border-primary/40 text-primary'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                >
                    {copiado ? <Check size={14} /> : <Copy size={14} />}
                    {copiado ? 'Link Copiado!' : 'Copiar Link'}
                </button>
                <button
                    onClick={abrirPortal}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary/10 border border-primary/20 rounded-xl text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary/20 transition-all"
                >
                    <ExternalLink size={14} />
                    Abrir Portal
                </button>
            </div>
        </div>
    );
};

// ============================================
// MAIN COMPONENT
// ============================================

const CAMPOS_EDITAVEIS: (keyof DadosProfissionais)[] = ['nome', 'cref', 'telefone', 'cidade', 'estado', 'especialidades', 'bio'];

export const PersonalProfilePage: React.FC = () => {
    const { profile: authProfile, entity, refreshEntity } = useAuthStore();
    const { personalAthletes } = useDataStore();
    const personal = entity.personal;

    const [editando, setEditando] = useState(false);
    const [rascunho, setRascunho] = useState<DadosProfissionais>(() => dadosProfissionaisDe(personal));
    const [erros, setErros] = useState<ErrosDadosProfissionais>({});
    const [salvando, setSalvando] = useState(false);
    const [erroSalvar, setErroSalvar] = useState<string | null>(null);
    const [senhaAberta, setSenhaAberta] = useState(false);

    const ativos = personalAthletes.filter(a => a.status !== 'inactive').length;

    const profile: PersonalProfile = {
        id: personal?.id || authProfile?.id || '',
        name: personal?.nome || authProfile?.full_name || 'Personal',
        email: personal?.email || authProfile?.email || '',
        avatarUrl: personal?.foto_url || authProfile?.avatar_url || null,
        gender: 'MALE',
        cref: personal?.cref || '',
        specialties: personal?.especialidades ?? [],
        bio: personal?.bio || '',
        whatsapp: personal?.telefone ?? undefined,
        instagram: undefined,
        createdAt: personal?.created_at ?? '',
        stats: {
            totalAthletes: ativos,
            maxAthletes: personal?.limite_atletas ?? null,
            measuredThisWeek: 0,
            averageScore: personalAthletes.length > 0
                ? Math.round(personalAthletes.reduce((acc, a) => acc + (a.score || 0), 0) / personalAthletes.length * 10) / 10
                : 0,
            scoreVariation: 0,
            needsAttention: personalAthletes.filter(a => (a.score || 0) < 60).length,
        },
    };

    const abrirEdicao = () => {
        setRascunho(dadosProfissionaisDe(personal));
        setErros({});
        setErroSalvar(null);
        setEditando(true);
    };

    const salvar = async () => {
        if (!personal?.id) return;
        const novosErros = validarDadosProfissionais(rascunho, ['nome', 'cref', 'telefone']);
        setErros(novosErros);
        if (Object.keys(novosErros).length > 0) return;

        setSalvando(true);
        const { error } = await personalService.atualizarDadosProfissionais(personal.id, paraPayloadPersonal(rascunho));
        setSalvando(false);
        if (error) {
            setErroSalvar('Não foi possível salvar. Tente novamente.');
            return;
        }
        await refreshEntity();
        setEditando(false);
    };

    return (
        <div className="flex-1 p-4 md:p-8 pb-20 overflow-y-auto">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">

                {/* Page Title */}
                <div className="flex flex-col animate-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">MEU PERFIL PROFISSIONAL</h2>
                    <p className="text-gray-400 mt-2 font-light">
                        Gerencie suas informações profissionais, plano e credenciais de acesso.
                    </p>
                </div>

                <div className="h-px w-full bg-white/10" />

                {/* Header Section */}
                <ProfileHeader profile={profile} personal={personal} ativos={ativos} />

                {editando && (
                    <div className="bg-surface border border-primary/30 rounded-2xl p-6 shadow-lg">
                        <h3 className="text-lg font-bold text-white uppercase tracking-wide mb-6">Editar dados profissionais</h3>
                        <PersonalDadosForm dados={rascunho} onChange={setRascunho} campos={CAMPOS_EDITAVEIS} erros={erros} />
                        {erroSalvar && <p className="text-sm text-red-400 mt-4">{erroSalvar}</p>}
                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setEditando(false)}
                                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-sm text-gray-300 hover:bg-white/5"
                            >
                                <X size={14} /> Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={salvar}
                                disabled={salvando}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                            >
                                <Check size={14} /> {salvando ? 'Salvando...' : 'Salvar'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Grid Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* 1. Dados de acesso */}
                    <InfoCard title="Dados de Acesso" icon={User}>
                        <InfoRow label="Nome Completo" value={profile.name} icon={User} />
                        <InfoRow label="Email Profissional" value={profile.email} icon={Mail} />
                        <InfoRow label="Status da Conta" value={
                            <span className="flex items-center gap-1.5 text-primary">
                                <Check size={14} /> {personal?.status === 'ATIVO' ? 'Ativa' : personal?.status ?? '—'}
                            </span>
                        } />
                    </InfoCard>

                    {/* 2. Dados Profissionais */}
                    <InfoCard title="Credenciais" icon={Award} onEdit={abrirEdicao}>
                        <InfoRow label="CREF" value={profile.cref || 'Não cadastrado'} icon={Shield} />
                        <InfoRow
                            label="Cidade"
                            value={personal?.cidade ? `${personal.cidade}${personal.estado ? ` / ${personal.estado}` : ''}` : 'Não cadastrada'}
                            icon={MapPin}
                        />
                        <InfoRow label="Especialidades" value={
                            profile.specialties.length > 0 ? (
                                <div className="flex flex-wrap gap-2 justify-end">
                                    {profile.specialties.map(s => (
                                        <span key={s} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-gray-300">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            ) : 'Não cadastradas'
                        } />
                    </InfoCard>

                    {/* 3. Contato */}
                    <InfoCard title="Contato" icon={MessageCircle} onEdit={abrirEdicao}>
                        <InfoRow label="WhatsApp (Comercial)" value={profile.whatsapp || 'Não cadastrado'} icon={MessageCircle} />
                        <div className="mt-2 p-3 bg-primary/5 border border-primary/20 rounded-xl">
                            <p className="text-[10px] text-primary font-medium leading-relaxed">
                                💡 Seus alunos veem este contato no portal deles.
                            </p>
                        </div>
                    </InfoCard>

                    {/* 4. Bio / Apresentação */}
                    <InfoCard title="Biografia e Perfil" icon={Briefcase} onEdit={abrirEdicao}>
                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                            <p className="text-sm text-gray-300 leading-relaxed font-light italic">
                                {profile.bio ? `"${profile.bio}"` : 'Adicione uma breve apresentação sobre como você trabalha.'}
                            </p>
                        </div>
                    </InfoCard>

                    {/* 5. Resumo de Atividade */}
                    <InfoCard title="Resumo de Atividade" icon={TrendsUp}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center">
                                <Users size={20} className="text-primary mb-2" />
                                <span className="text-2xl font-bold text-white">{profile.stats.totalAthletes}</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Alunos Ativos</span>
                            </div>
                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center">
                                <TrendingUp size={20} className="text-secondary mb-2" />
                                <span className="text-2xl font-bold text-white">{profile.stats.averageScore}</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Score Médio</span>
                            </div>
                        </div>
                    </InfoCard>

                    {/* 6. Portal do Personal */}
                    <PortalCard personalId={profile.id} />

                    {/* 7. Segurança da Conta */}
                    <InfoCard title="Segurança da Conta" icon={Shield}>
                        <div className="flex flex-col gap-4">
                            <p className="text-sm text-gray-400 font-light px-2">
                                Troque sua senha periodicamente para manter seus dados e os dos seus alunos protegidos.
                            </p>
                            <button
                                type="button"
                                onClick={() => setSenhaAberta(true)}
                                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                            >
                                <Shield size={14} className="text-yellow-500" />
                                Alterar Senha
                            </button>
                        </div>
                    </InfoCard>
                </div>
            </div>

            <AlterarSenhaModal aberto={senhaAberta} onFechar={() => setSenhaAberta(false)} />
        </div>
    );
};

// Help for the missing icon in InfoCard
const TrendsUp = ({ size, className }: { size?: number, className?: string }) => (
    <TrendingUp size={size} className={className} />
);
