import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Activity,
  Bot,
  User,
  Settings,
  LogOut,
  Layers,
  Users,
  Trophy,
  Dumbbell,
  Building2,
  Award,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { type ProfileType } from '../../../components';
import { useUIStore } from '../../../stores/uiStore';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  id?: string;
  isActive?: boolean;
  isPro?: boolean;
  isLogout?: boolean;
  onClick?: () => void;
  isSidebarCollapsed?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive, isPro, isLogout, onClick, isSidebarCollapsed }) => {
  const baseClasses = "flex items-center gap-3 px-4 py-3 rounded-lg transition-all group cursor-pointer w-full";
  const activeClasses = "bg-primary/10 border border-white/10 text-primary";

  let inactiveClasses = "text-gray-400 hover:text-white hover:bg-white/5";
  if (isLogout) {
    inactiveClasses = "text-red-400/80 hover:text-red-400 hover:bg-red-500/10 mt-2 border border-transparent hover:border-red-500/20";
  }

  return (
    <button
      onClick={onClick}
      title={isSidebarCollapsed ? label : undefined}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
    >
      <Icon size={20} className="flex-shrink-0" />
      {!isSidebarCollapsed && <span className="text-sm font-medium truncate">{label}</span>}
      {!isSidebarCollapsed && isPro && (
        <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] font-bold bg-secondary/20 text-secondary border border-secondary/20">
          PRO
        </span>
      )}
    </button>
  );
};

interface SidebarProps {
  currentView?: string;
  onNavigate?: (view: string) => void;
  onLogout?: () => void;
  userProfile?: ProfileType;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView = 'dashboard',
  onNavigate,
  onLogout,
  userProfile = 'atleta'
}) => {
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();

  // Define menu items based on profile
  const getNavItems = () => {
    switch (userProfile) {
      case 'academia':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
          { icon: Users, label: 'Personais', id: 'trainers' },
          { icon: Users, label: 'Alunos', id: 'students' },
          { icon: TrendingUp, label: 'Evolução', id: 'evolution' },
          { icon: Trophy, label: 'Ranking Personais', id: 'trainers-ranking' },
          { icon: Building2, label: 'Hall dos Deuses', id: 'hall' },
        ];
      case 'personal':
        return [
          { icon: LayoutDashboard, label: 'Início', id: 'dashboard' },
          { icon: Users, label: 'Meus Alunos', id: 'students' },
          { icon: Activity, label: 'Avaliação IA', id: 'assessment' },
          { icon: Bot, label: 'Montar Plano', id: 'coach', isPro: true },
          { icon: TrendingUp, label: 'Evolução', id: 'evolution' },
          { type: 'divider' as const },
          { icon: Dumbbell, label: 'Hall dos Deuses', id: 'hall' },
          { icon: Trophy, label: 'Ranking Personais', id: 'trainers-ranking' },
        ];
      case 'atleta':
      default:
        return [
          { icon: LayoutDashboard, label: 'Início', id: 'dashboard' },
          { icon: Users, label: 'Minha Ficha', id: 'my-record' },
          { icon: Activity, label: 'Avaliação', id: 'assessment' },
          { icon: Bot, label: 'Montar Plano', id: 'coach', isPro: true },
          { icon: TrendingUp, label: 'Evolução', id: 'evolution' },
          { type: 'divider' as const },
          { icon: Dumbbell, label: 'Hall dos Deuses', id: 'hall' },
          { icon: Trophy, label: 'Ranking Personais', id: 'trainers-ranking' },
        ];
    }
  };

  const mainNavItems = getNavItems();

  const systemNavItems = [
    { icon: User, label: userProfile === 'academia' ? 'Perfil da Academia' : 'Meu Perfil', id: 'profile' },
    { icon: Settings, label: 'Configurações', id: 'settings' },
  ];

  return (
    <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} flex-shrink-0 hidden md:flex flex-col justify-between border-r border-card-border bg-[#0A0F1C] h-full overflow-y-auto overflow-x-hidden custom-scrollbar transition-all duration-300 relative`}>
      <div className={`flex flex-col ${isSidebarCollapsed ? 'p-4' : 'p-6'} gap-8`}>
        {/* Logo and Toggle */}
        <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} gap-3`}>
          {!isSidebarCollapsed && (
            <img src="/logo-vitru.png" alt="VITRU IA Logo" className="h-[1.8rem] w-auto" />
          )}
          {isSidebarCollapsed && (
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
              <span className="text-primary font-bold text-xl">V</span>
            </div>
          )}

          <button
            onClick={toggleSidebar}
            className={`p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all ${isSidebarCollapsed ? 'mt-2' : ''}`}
            title={isSidebarCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Main Nav */}
        <nav className="flex flex-col gap-2">
          {!isSidebarCollapsed && (
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-2">
              Menu {userProfile === 'atleta' ? 'Principal' : userProfile.charAt(0).toUpperCase() + userProfile.slice(1)}
            </p>
          )}
          {mainNavItems.map((item, index) => {
            if ('type' in item && item.type === 'divider') {
              return <div key={`divider-${index}`} className="h-px bg-white/10 my-2 mx-2" />;
            }
            const navItem = item as { icon: React.ElementType, label: string, id: string, isPro?: boolean };
            return (
              <NavItem
                key={index}
                {...navItem}
                isActive={currentView === navItem.id}
                onClick={() => onNavigate && navItem.id && onNavigate(navItem.id)}
                isSidebarCollapsed={isSidebarCollapsed}
              />
            );
          })}
        </nav>
      </div>

      {/* System Nav */}
      <div className={`flex flex-col ${isSidebarCollapsed ? 'p-4' : 'p-6'} gap-2 border-t border-card-border bg-[#0A0F1C]`}>
        {!isSidebarCollapsed && (
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-2">Sistema</p>
        )}

        {systemNavItems.map((item, index) => (
          <NavItem
            key={index}
            {...item}
            isActive={currentView === item.id}
            onClick={() => onNavigate && item.id && onNavigate(item.id)}
            isSidebarCollapsed={isSidebarCollapsed}
          />
        ))}

        <div className={`pt-2 mt-2 border-t border-white/5`}>
          <NavItem
            icon={LogOut}
            label="Sair"
            isLogout
            onClick={onLogout}
            isSidebarCollapsed={isSidebarCollapsed}
          />
        </div>
      </div>
    </aside>
  );
};