import React from 'react';
import { Bell, Camera, MessageCircle, UserPlus } from 'lucide-react';
import { type ProfileType } from '../../../components';

interface HeaderProps {
  onOpenAssessment?: () => void;
  onOpenCoach?: () => void;
  onRegisterStudent?: () => void;
  onInvitePersonal?: () => void;
  title?: string;
  userProfile?: ProfileType;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAssessment,
  onOpenCoach,
  onRegisterStudent,
  onInvitePersonal,
  title = "INÍCIO",
  userProfile = 'atleta'
}) => {

  const renderAction = () => {
    switch (userProfile) {
      case 'academia':
        return (
          <button
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-[#0A0F1C] rounded-lg font-bold text-sm transition-all shadow-[0_0_15px_rgba(0,201,167,0.3)] hover:shadow-[0_0_20px_rgba(0,201,167,0.5)] transform hover:scale-105 active:scale-95"
            onClick={onInvitePersonal}
          >
            <UserPlus size={18} />
            <span>CONVIDAR PERSONAL</span>
          </button>
        );
      case 'personal':
        return (
          <button
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-[#0A0F1C] rounded-lg font-bold text-sm transition-all shadow-[0_0_15px_rgba(0,201,167,0.3)] hover:shadow-[0_0_20px_rgba(0,201,167,0.5)] transform hover:scale-105 active:scale-95"
            onClick={onRegisterStudent}
          >
            <UserPlus size={18} />
            <span>NOVO ALUNO</span>
          </button>
        );
      case 'atleta':
      default:
        return (
          <button
            onClick={onOpenCoach}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-[#0A0F1C] rounded-lg font-bold text-sm transition-all shadow-[0_0_15px_rgba(0,201,167,0.3)] hover:shadow-[0_0_20px_rgba(0,201,167,0.5)] transform hover:scale-105 active:scale-95"
          >
            <MessageCircle size={18} />
            <span>COACH IA</span>
          </button>
        );
    }
  };

  return (
    <header className="h-20 w-full flex-shrink-0 flex items-center justify-between px-8 border-b border-card-border bg-[#0A0F1C]/90 backdrop-blur-md z-30">
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="text-white tracking-wide font-semibold uppercase">{title}</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          <Bell size={20} />
        </button>

        {renderAction()}
      </div>
    </header>
  );
};