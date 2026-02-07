import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AssessmentModal } from './components/AssessmentModal';
import { AssessmentResults } from './components/AssessmentResults';
import { DesignSystem } from './components/DesignSystem';
import { Evolution } from './components/Evolution';
import { HallDosDeuses } from './components/HallDosDeuses';
import { Login } from './components/Login';
import { AssessmentPage } from './components/AssessmentPage';
import { CoachModal } from './components/CoachModal';
import { DashboardView } from './src/components/templates/DashboardView/DashboardView';
import { ProfileType } from './components/ProfileSelector';

type ViewState = 'dashboard' | 'results' | 'design-system' | 'evolution' | 'hall' | 'coach' | 'profile' | 'settings' | 'assessment' | 'trainers' | 'students' | 'trainers-ranking';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<ProfileType>('atleta');
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [isCoachModalOpen, setIsCoachModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');

  const handleLogin = (profile: ProfileType) => {
    setUserProfile(profile);
    setIsAuthenticated(true);
  };

  const handleAssessmentSubmit = () => {
    setIsAssessmentOpen(false);
    // Simulate loading or transition
    setTimeout(() => {
      setCurrentView('results');
    }, 300);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'results':
        return <AssessmentResults onBack={() => setCurrentView('dashboard')} />;
      case 'assessment':
        return <AssessmentPage onConfirm={handleAssessmentSubmit} />;
      case 'design-system':
        return <DesignSystem />;
      case 'evolution':
        return <Evolution />;
      case 'hall':
        return <HallDosDeuses />;
      case 'trainers':
      case 'students':
      case 'coach':
      case 'profile':
      case 'settings':
        return (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>Funcionalidade em desenvolvimento ({currentView})</p>
          </div>
        );
      case 'dashboard':
      default:
        return <DashboardView userProfile={userProfile} />;
    }
  };


  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'INÍCIO';
      case 'results': return 'RESULTADOS';
      case 'evolution': return 'EVOLUÇÃO';
      case 'hall': return 'HALL DOS DEUSES';
      case 'assessment': return 'AVALIAÇÃO';
      case 'design-system': return 'DESIGN SYSTEM';
      case 'trainers': return 'PERSONAIS';
      case 'students': return 'ALUNOS';
      case 'trainers-ranking': return 'RANKING PERSONAIS';
      default: return currentView.toUpperCase();
    }
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-dark text-white font-sans selection:bg-primary selection:text-background-dark">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view as ViewState)}
        userProfile={userProfile}
      />

      {/* Main Content Wrapper */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-background-dark">

        {/* Global Header - Persistent across all views */}
        <Header
          onOpenCoach={() => setIsCoachModalOpen(true)}
          title={getPageTitle()}
          userProfile={userProfile}
        />

        {/* Content Area - Flex container to manage scrolling independently */}
        <div className="flex-1 overflow-y-auto relative flex flex-col custom-scrollbar">
          {renderContent()}

          <Footer onOpenDesignSystem={() => setCurrentView('design-system')} />
        </div>
      </main>

      {/* Modals */}
      <AssessmentModal
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
        onConfirm={handleAssessmentSubmit}
      />

      <CoachModal
        isOpen={isCoachModalOpen}
        onClose={() => setIsCoachModalOpen(false)}
      />
    </div>
  );
};

export default App;