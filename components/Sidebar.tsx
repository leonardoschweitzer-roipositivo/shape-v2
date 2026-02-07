import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Activity,
  Trophy,
  Bot,
  User,
  Settings,
  LogOut,
  Users,
  GraduationCap
} from 'lucide-react';
import { ProfileType } from './ProfileSelector';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  isPro?: boolean;
  isLogout?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive, isPro, isLogout, onClick }) => {
  const baseClasses = "flex items-center gap-3 px-4 py-3 rounded-lg transition-all group cursor-pointer";
  const activeClasses = "bg-primary/10 border border-primary/20 text-primary shadow-[0_0_10px_rgba(0,201,167,0.1)]";
  const inactiveClasses = isLogout
    ? "text-red-400/80 hover:text-red-400 hover:bg-red-500/10 mt-2"
    : "text-gray-400 hover:text-white hover:bg-white/5";

  return (
    <div onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      <Icon size={20} />
      <span className="text-sm font-medium">{label}</span>
      {isPro && (
        <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] font-bold bg-secondary/20 text-secondary border border-secondary/20">
          PRO
        </span>
      )}
    </div>
  );
};

interface SidebarProps {
  currentView?: string;
  onNavigate?: (view: string) => void;
  userProfile?: ProfileType;
}

interface NavItemData {
  icon: any;
  label: string;
  id: string;
  isPro?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView = 'dashboard', onNavigate, userProfile = 'atleta' }) => {
  const mainNavItems: NavItemData[] = [
    { icon: LayoutDashboard, label: 'Início', id: 'dashboard' },
    { icon: Activity, label: 'Avaliação', id: 'assessment' },
    { icon: TrendingUp, label: 'Evolução', id: 'evolution' },
    { icon: Trophy, label: 'Hall dos Deuses', id: 'hall' },
    { icon: Bot, label: 'Coach IA', id: 'coach', isPro: true },
  ];

  if (userProfile === 'academia') {
    mainNavItems.push(
      { icon: GraduationCap, label: 'Personais', id: 'trainers' },
      { icon: Users, label: 'Alunos', id: 'students' },
    );
  } else if (userProfile === 'personal') {
    mainNavItems.push(
      { icon: Users, label: 'Alunos', id: 'students' },
    );
  }

  const systemNavItems = [
    { icon: User, label: 'Perfil', id: 'profile' },
    { icon: Settings, label: 'Configurações', id: 'settings' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col justify-between border-r border-card-border bg-[#0A0F1C] h-full">
      <div className="flex flex-col p-6 gap-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-[#0A0F1C] font-bold text-xl shadow-lg shadow-primary/20">
            V
          </div>
          <h1 className="text-xl font-bold tracking-wider text-white">VITRU IA</h1>
        </div>

        {/* Main Nav */}
        <nav className="flex flex-col gap-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-2">Menu Principal</p>
          {mainNavItems.map((item, index) => (
            <NavItem
              key={index}
              {...item}
              isActive={currentView === item.id}
              onClick={() => onNavigate && onNavigate(item.id)}
            />
          ))}
        </nav>
      </div>

      {/* System Nav */}
      <div className="flex flex-col p-6 gap-2 border-t border-card-border bg-[#0A0F1C]">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-2">Sistema</p>
        {systemNavItems.map((item, index) => (
          <NavItem key={index} {...item} />
        ))}
        <NavItem icon={LogOut} label="Sair" isLogout />
      </div>
    </aside>
  );
};