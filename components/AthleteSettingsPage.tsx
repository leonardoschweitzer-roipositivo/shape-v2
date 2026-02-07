import React, { useState } from 'react';
import {
    User,
    Bell,
    Shield,
    Lock,
    CreditCard,
    Database,
    Check,
    Mail,
    ChevronRight,
    Download,
    Trash2,
    Sparkles
} from 'lucide-react';
import { useAthleteStore } from '../stores/athleteStore';
import {
    ATHLETE_SETTINGS_SECTIONS,
    SettingsSectionId
} from '../types/settings';

// ============================================
// ICON MAP
// ============================================

const ICON_MAP: Record<string, React.ElementType> = {
    User,
    Bell,
    Shield,
    Lock,
    CreditCard,
    Database,
};

// ============================================
// SUB-COMPONENTS
// ============================================

interface SettingsNavItemProps {
    icon: string;
    label: string;
    description: string;
    badge?: 'PRO' | 'VITRÚVIO';
    isActive: boolean;
    onClick: () => void;
}

const SettingsNavItem: React.FC<SettingsNavItemProps> = ({
    icon,
    label,
    description,
    badge,
    isActive,
    onClick,
}) => {
    const Icon = ICON_MAP[icon] || User;

    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group ${isActive
                ? 'bg-primary/10 border border-primary/20 text-primary'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
        >
            <Icon size={20} className={isActive ? 'text-primary' : 'text-gray-500'} />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{label}</span>
                    {badge && (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${badge === 'PRO'
                            ? 'bg-secondary/20 text-secondary border border-secondary/20'
                            : 'bg-purple-500/20 text-purple-400 border border-purple-500/20'
                            }`}>
                            {badge}
                        </span>
                    )}
                </div>
                <p className="text-xs text-gray-500 truncate">{description}</p>
            </div>
        </button>
    );
};

interface SettingsCardProps {
    icon: React.ElementType;
    title: string;
    description?: string;
    children: React.ReactNode;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ icon: Icon, title, description, children }) => (
    <div className="p-6 bg-card-bg rounded-2xl border border-card-border">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon size={20} className="text-primary" />
            </div>
            <div>
                <h3 className="font-semibold text-white">{title}</h3>
                {description && <p className="text-xs text-gray-500">{description}</p>}
            </div>
        </div>
        <div className="space-y-1">
            {children}
        </div>
    </div>
);

interface SettingsRowProps {
    label: string;
    value?: string | React.ReactNode;
    action?: React.ReactNode;
    danger?: boolean;
}

const SettingsRow: React.FC<SettingsRowProps> = ({ label, value, action, danger }) => (
    <div className={`flex items-center justify-between py-3 border-b border-white/5 last:border-0 ${danger ? 'text-red-400' : ''}`}>
        <span className={`text-sm ${danger ? 'text-red-400' : 'text-gray-400'}`}>{label}</span>
        <div className="flex items-center gap-3">
            {value && <span className="text-sm font-medium text-white">{value}</span>}
            {action}
        </div>
    </div>
);

interface SettingsToggleProps {
    label: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

const SettingsToggle: React.FC<SettingsToggleProps> = ({ label, description, checked, onChange, disabled }) => (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
        <div>
            <span className="text-sm text-gray-300">{label}</span>
            {description && <p className="text-xs text-gray-500">{description}</p>}
        </div>
        <button
            onClick={() => !disabled && onChange(!checked)}
            disabled={disabled}
            className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-white/10'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
            <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'left-6' : 'left-1'
                    }`}
            />
        </button>
    </div>
);

// ============================================
// SECTION COMPONENTS
// ============================================

const AccountSection: React.FC = () => {
    const { profile } = useAthleteStore();

    return (
        <div className="space-y-6">
            <SettingsCard icon={Mail} title="Email">
                <SettingsRow
                    label="Email atual"
                    value={
                        <div className="flex items-center gap-2">
                            <span>{profile?.email || 'joao@email.com'}</span>
                            <span className="flex items-center gap-1 text-xs text-green-400">
                                <Check size={12} /> Verificado
                            </span>
                        </div>
                    }
                    action={
                        <button className="text-xs text-primary hover:text-primary/80 transition-colors">
                            Alterar email
                        </button>
                    }
                />
            </SettingsCard>

            <SettingsCard icon={User} title="Contas Conectadas" description="Faça login mais rápido com suas contas">
                <SettingsRow
                    label="🍎 Apple"
                    value="Não conectado"
                    action={
                        <button className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
                            Conectar <ChevronRight size={14} />
                        </button>
                    }
                />
                <SettingsRow
                    label="G Google"
                    value="Não conectado"
                    action={
                        <button className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
                            Conectar <ChevronRight size={14} />
                        </button>
                    }
                />
            </SettingsCard>

            <SettingsCard icon={User} title="Vinculação" description="Personal Trainer vinculado à sua conta">
                <div className="py-4 text-center text-gray-500">
                    <p className="text-sm">Você não está vinculado a nenhum Personal</p>
                    <p className="text-xs mt-1">Seu personal pode te convidar pelo seu email</p>
                </div>
            </SettingsCard>
        </div>
    );
};


const NotificationsSection: React.FC = () => {
    const { settings, updateNotifications } = useAthleteStore();
    const notifs = settings.notifications;

    return (
        <div className="space-y-6">
            <SettingsCard icon={Bell} title="Lembretes de Medição">
                <SettingsToggle
                    label="Notificações Push"
                    checked={notifs.medicaoLembrete.push}
                    onChange={(push) => updateNotifications({ medicaoLembrete: { ...notifs.medicaoLembrete, push } })}
                />
                <SettingsRow
                    label="Frequência"
                    action={
                        <select
                            value={notifs.medicaoLembrete.frequency}
                            onChange={(e) => updateNotifications({
                                medicaoLembrete: { ...notifs.medicaoLembrete, frequency: e.target.value as any }
                            })}
                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary/50"
                        >
                            <option value="off">Desativado</option>
                            <option value="daily">Diário</option>
                            <option value="weekly">Semanal</option>
                            <option value="monthly">Mensal</option>
                        </select>
                    }
                />
            </SettingsCard>

            <SettingsCard icon={Bell} title="Outras Notificações">
                <SettingsToggle
                    label="Insights do VITRÚVIO"
                    description="Receba dicas personalizadas do Coach IA"
                    checked={notifs.insightsVitruvio.push}
                    onChange={(push) => updateNotifications({ insightsVitruvio: { ...notifs.insightsVitruvio, push } })}
                />
                <SettingsToggle
                    label="Conquistas e Marcos"
                    description="Seja notificado quando atingir metas"
                    checked={notifs.conquistasMarcos.push}
                    onChange={(push) => updateNotifications({ conquistasMarcos: { ...notifs.conquistasMarcos, push } })}
                />
                <SettingsToggle
                    label="Novidades do App"
                    description="Fique por dentro das atualizações"
                    checked={notifs.novidadesApp.push}
                    onChange={(push) => updateNotifications({ novidadesApp: { ...notifs.novidadesApp, push } })}
                />
                <SettingsToggle
                    label="Promoções"
                    description="Ofertas especiais e descontos"
                    checked={notifs.promocoes.push}
                    onChange={(push) => updateNotifications({ promocoes: { ...notifs.promocoes, push } })}
                />
            </SettingsCard>

            <SettingsCard icon={Mail} title="Notificações por Email">
                <SettingsToggle
                    label="Relatório Semanal"
                    description="Resumo da sua evolução por email"
                    checked={notifs.relatorioSemanal.email}
                    onChange={(email) => updateNotifications({ relatorioSemanal: { ...notifs.relatorioSemanal, email } })}
                />
                <SettingsToggle
                    label="Insights do VITRÚVIO"
                    checked={notifs.insightsVitruvio.email}
                    onChange={(email) => updateNotifications({ insightsVitruvio: { ...notifs.insightsVitruvio, email } })}
                />
            </SettingsCard>
        </div>
    );
};

const PrivacySection: React.FC = () => {
    const { settings, updatePrivacy } = useAthleteStore();
    const priv = settings.privacy;

    return (
        <div className="space-y-6">
            <SettingsCard icon={Shield} title="Visibilidade Pública">
                <SettingsToggle
                    label="Aparecer no Hall dos Deuses"
                    description="Seu perfil pode aparecer no ranking público"
                    checked={priv.public.aparecerHallDeuses}
                    onChange={(aparecerHallDeuses) => updatePrivacy({ public: { ...priv.public, aparecerHallDeuses } })}
                />
                <SettingsToggle
                    label="Mostrar foto no ranking"
                    description="Sua foto será exibida junto ao seu nome"
                    checked={priv.public.mostrarFotoRanking}
                    onChange={(mostrarFotoRanking) => updatePrivacy({ public: { ...priv.public, mostrarFotoRanking } })}
                />
                <SettingsToggle
                    label="Permitir comparações anônimas"
                    description="Outros usuários podem comparar proporções"
                    checked={priv.public.permitirComparacoesAnonimas}
                    onChange={(permitirComparacoesAnonimas) => updatePrivacy({ public: { ...priv.public, permitirComparacoesAnonimas } })}
                />
            </SettingsCard>

            <SettingsCard icon={Shield} title="Visibilidade para Personal" description="Caso você esteja vinculado a um Personal">
                <div className="py-2 px-3 bg-green-500/10 text-green-400 text-xs rounded-lg mb-2">
                    ✓ Medidas e evolução sempre visíveis (necessário para acompanhamento)
                </div>
                <SettingsToggle
                    label="Fotos de progresso"
                    description="Personal pode ver suas fotos"
                    checked={priv.personal.fotosProgresso}
                    onChange={(fotosProgresso) => updatePrivacy({ personal: { ...priv.personal, fotosProgresso } })}
                />
                <div className="py-2 px-3 bg-purple-500/10 text-purple-400 text-xs rounded-lg mt-2">
                    🔒 Dados de saúde, medicamentos e ergogênicos são sempre privados
                </div>
            </SettingsCard>

            <SettingsCard icon={Shield} title="Uso de Dados">
                <SettingsToggle
                    label="Analytics de uso"
                    description="Ajude-nos a melhorar o app"
                    checked={priv.data.analyticsDeUso}
                    onChange={(analyticsDeUso) => updatePrivacy({ data: { ...priv.data, analyticsDeUso } })}
                />
                <SettingsToggle
                    label="Dados para pesquisa"
                    description="Contribua para estudos científicos (anônimo)"
                    checked={priv.data.dadosParaPesquisa}
                    onChange={(dadosParaPesquisa) => updatePrivacy({ data: { ...priv.data, dadosParaPesquisa } })}
                />
            </SettingsCard>
        </div>
    );
};

const SecuritySection: React.FC = () => (
    <div className="space-y-6">
        <SettingsCard icon={Lock} title="Senha">
            <SettingsRow
                label="Alterar senha"
                action={
                    <button className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
                        Alterar <ChevronRight size={14} />
                    </button>
                }
            />
        </SettingsCard>

        <SettingsCard icon={Lock} title="Autenticação de Dois Fatores">
            <SettingsRow
                label="2FA"
                value="Desativado"
                action={
                    <button className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
                        Ativar <ChevronRight size={14} />
                    </button>
                }
            />
        </SettingsCard>

        <SettingsCard icon={Lock} title="Sessões Ativas">
            <div className="py-4">
                <div className="flex items-center justify-between py-2">
                    <div>
                        <p className="text-sm text-white">Este dispositivo</p>
                        <p className="text-xs text-gray-500">macOS • Chrome • Agora</p>
                    </div>
                    <span className="text-xs text-green-400">Atual</span>
                </div>
            </div>
            <button className="w-full text-xs text-red-400 hover:text-red-300 py-2 border-t border-white/5">
                Encerrar outras sessões
            </button>
        </SettingsCard>
    </div>
);

const PlanSection: React.FC = () => {
    const { settings } = useAthleteStore();

    return (
        <div className="space-y-6">
            <SettingsCard icon={CreditCard} title="Plano Atual">
                <div className="py-4 text-center">
                    <span className={`text-2xl font-bold ${settings.plan.type === 'PRO' ? 'text-secondary' : 'text-gray-400'}`}>
                        {settings.plan.type}
                    </span>
                    {settings.plan.type === 'FREE' && (
                        <p className="text-xs text-gray-500 mt-1">
                            Faça upgrade para desbloquear o Coach VITRÚVIO completo
                        </p>
                    )}
                </div>
                {settings.plan.type === 'FREE' && (
                    <button className="w-full py-3 bg-gradient-to-r from-secondary/20 to-primary/20 border border-secondary/30 rounded-xl text-secondary font-medium hover:from-secondary/30 hover:to-primary/30 transition-all flex items-center justify-center gap-2">
                        <Sparkles size={16} />
                        Fazer Upgrade para PRO
                    </button>
                )}
            </SettingsCard>

            {settings.plan.type === 'PRO' && (
                <>
                    <SettingsCard icon={CreditCard} title="Faturamento">
                        <SettingsRow label="Próxima cobrança" value="07/03/2026" />
                        <SettingsRow label="Método de pagamento" value="•••• 4242" />
                    </SettingsCard>

                    <button className="w-full text-xs text-red-400 hover:text-red-300 py-2">
                        Cancelar assinatura
                    </button>
                </>
            )}
        </div>
    );
};

const DataSection: React.FC = () => (
    <div className="space-y-6">
        <SettingsCard icon={Download} title="Exportar Dados" description="Baixe uma cópia dos seus dados (LGPD)">
            <div className="py-4 space-y-3">
                <button className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    <Download size={16} />
                    Exportar como JSON
                </button>
                <button className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    <Download size={16} />
                    Exportar como CSV
                </button>
            </div>
        </SettingsCard>

        <SettingsCard icon={Trash2} title="Excluir Conta" description="Esta ação é irreversível">
            <div className="py-4">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-4">
                    <p className="text-sm text-red-400">
                        ⚠️ Ao excluir sua conta, todos os seus dados serão permanentemente apagados.
                        Isto inclui medidas, avaliações, e histórico de evolução.
                    </p>
                </div>
                <button className="w-full py-3 px-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 font-medium hover:bg-red-500/20 transition-all flex items-center justify-center gap-2">
                    <Trash2 size={16} />
                    Excluir minha conta
                </button>
            </div>
        </SettingsCard>
    </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

export const AthleteSettingsPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState<SettingsSectionId>('account');

    const renderSection = () => {
        switch (activeSection) {
            case 'account': return <AccountSection />;
            case 'notifications': return <NotificationsSection />;
            case 'privacy': return <PrivacySection />;
            case 'security': return <SecuritySection />;
            case 'plan': return <PlanSection />;
            case 'data': return <DataSection />;
            default: return <AccountSection />;
        }
    };

    return (
        <div className="flex-1 p-4 md:p-8 pb-20">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">
                {/* Page Header */}
                <div className="flex flex-col animate-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">CONFIGURAÇÕES</h2>
                    <p className="text-gray-400 mt-2 font-light">
                        Gerencie suas preferências, privacidade e conta.
                    </p>
                </div>

                <div className="h-px w-full bg-white/10" />

                {/* Settings Layout */}
                <div className="flex gap-6">
                    {/* Sidebar Navigation */}
                    <aside className="w-72 flex-shrink-0 hidden lg:block">
                        <div className="sticky top-6 space-y-1">
                            {ATHLETE_SETTINGS_SECTIONS.map((section) => (
                                <SettingsNavItem
                                    key={section.id}
                                    icon={section.icon}
                                    label={section.label}
                                    description={section.description}
                                    badge={section.badge}
                                    isActive={activeSection === section.id}
                                    onClick={() => setActiveSection(section.id as SettingsSectionId)}
                                />
                            ))}
                        </div>
                    </aside>

                    {/* Mobile Section Selector */}
                    <div className="lg:hidden mb-4">
                        <select
                            value={activeSection}
                            onChange={(e) => setActiveSection(e.target.value as SettingsSectionId)}
                            className="w-full bg-card-bg border border-card-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                        >
                            {ATHLETE_SETTINGS_SECTIONS.map((section) => (
                                <option key={section.id} value={section.id}>
                                    {section.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        {renderSection()}
                    </main>
                </div>
            </div>
        </div>
    );
};
