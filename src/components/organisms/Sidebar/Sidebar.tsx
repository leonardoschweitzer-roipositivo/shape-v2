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
  Building2
} from 'lucide-react';
import { type ProfileType } from '../../../components';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  id?: string;
  isActive?: boolean;
  isPro?: boolean;
  isLogout?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive, isPro, isLogout, onClick }) => {
  const baseClasses = "flex items-center gap-3 px-4 py-3 rounded-lg transition-all group cursor-pointer w-full";
  const activeClasses = "bg-primary/10 border border-white/10 text-primary";

  let inactiveClasses = "text-gray-400 hover:text-white hover:bg-white/5";
  if (isLogout) {
    inactiveClasses = "text-red-400/80 hover:text-red-400 hover:bg-red-500/10 mt-2 border border-transparent hover:border-red-500/20";
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      <Icon size={20} />
      <span className="text-sm font-medium">{label}</span>
      {isPro && (
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
          { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
          { icon: Users, label: 'Meus Alunos', id: 'students' },
          { icon: Activity, label: 'Avaliação IA', id: 'assessment' },
          { icon: TrendingUp, label: 'Evolução', id: 'evolution' },
          { icon: Bot, label: 'Coach IA', id: 'coach', isPro: true },
          { icon: Dumbbell, label: 'Hall dos Deuses', id: 'hall' },
          { icon: Trophy, label: 'Ranking Personais', id: 'trainers-ranking' },
        ];
      case 'atleta':
      default:
        return [
          { icon: LayoutDashboard, label: 'Início', id: 'dashboard' },
          { icon: Activity, label: 'Avaliação', id: 'assessment' },
          { icon: TrendingUp, label: 'Evolução', id: 'evolution' },
          { icon: Bot, label: 'Coach IA', id: 'coach', isPro: true },
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
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col justify-between border-r border-card-border bg-[#0A0F1C] h-full overflow-y-auto custom-scrollbar">
      <div className="flex flex-col p-6 gap-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src="/logo-vitru.png" alt="VITRU IA Logo" className="h-[1.8rem] w-auto" />
        </div>

        {/* Main Nav */}
        <nav className="flex flex-col gap-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-2">
            Menu {userProfile === 'atleta' ? 'Principal' : userProfile.charAt(0).toUpperCase() + userProfile.slice(1)}
          </p>
          {mainNavItems.map((item, index) => (
            <NavItem
              key={index}
              {...item}
              isActive={currentView === item.id}
              onClick={() => onNavigate && item.id && onNavigate(item.id)}
            />
          ))}
        </nav>
      </div>

      {/* System Nav */}
      <div className="flex flex-col p-6 gap-2 border-t border-card-border bg-[#0A0F1C]">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-2">Sistema</p>

        {systemNavItems.map((item, index) => (
          <NavItem
            key={index}
            {...item}
            isActive={currentView === item.id}
            onClick={() => onNavigate && item.id && onNavigate(item.id)}
          />
        ))}

        <div className="pt-2 mt-2 border-t border-white/5">
          <NavItem
            icon={LogOut}
            label="Sair"
            isLogout
            onClick={onLogout}
          />
        </div>
      </div>
    </aside>
  );
};