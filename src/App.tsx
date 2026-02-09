import React, { useState } from 'react';
import {
  Sidebar,
  Header,
  Footer,
  AssessmentModal,
  AssessmentResults,
  DesignSystem,
  Evolution,
  HallDosDeuses,
  Login,
  AssessmentPage,
  CoachModal,
  CoachIA,
  DashboardView,
  AthleteProfilePage,
  AthleteSettingsPage,
  RankingPersonaisPage,
  PersonalDashboard,
  PersonalAthletesList,
  PersonalAssessmentView,
  PersonalEvolutionView,
  PersonalCoachView,
  PersonalProfilePage,
  AthleteDetailsView,
  AcademyDashboard,
  AcademyPersonalsList,
  AcademyProfilePage,
  AthleteInvitationModal,
  PersonalInvitationModal,
  StudentRegistration,
  type ProfileType
} from '@/components';
import { useAthleteStore } from '@/stores/athleteStore';
import { mockPersonalAthletes, PersonalAthlete } from '@/mocks/personal';

type ViewState = 'dashboard' | 'results' | 'design-system' | 'evolution' | 'hall' | 'coach' | 'profile' | 'settings' | 'assessment' | 'trainers' | 'students' | 'trainers-ranking' | 'student-registration' | 'athlete-details';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<ProfileType>('atleta');
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [isCoachModalOpen, setIsCoachModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isPersonalInviteModalOpen, setIsPersonalInviteModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);
  const { settings, profile } = useAthleteStore();

  // State for assessment flow
  const [assessmentData, setAssessmentData] = useState<{ studentName?: string; gender?: 'male' | 'female' }>({});
  const [athleteForEvaluation, setAthleteForEvaluation] = useState<PersonalAthlete | null>(null);

  const handleAssessmentSubmit = (data?: { studentName: string; gender: 'male' | 'female' }) => {
    setIsAssessmentOpen(false);
    if (data) {
      setAssessmentData({ studentName: data.studentName, gender: data.gender });
    }

    // Simulate loading or transition
    setTimeout(() => {
      setCurrentView('results');
    }, 300);
  };

  const handleInviteAthlete = () => {
    setIsInviteModalOpen(true);
  };

  const handleInvitePersonal = () => {
    setIsPersonalInviteModalOpen(true);
  };

  // Apply primary color globally from settings
  React.useEffect(() => {
    if (settings.preferences.primaryColor) {
      document.documentElement.style.setProperty('--color-primary', settings.preferences.primaryColor);
    }
  }, [settings.preferences.primaryColor]);

  const handleLogin = (profile: ProfileType) => {
    setUserProfile(profile);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };



  const renderContent = () => {
    // Se usuário é Academia, renderiza views específicas
    if (userProfile === 'academia') {
      switch (currentView) {
        case 'dashboard':
          return (
            <AcademyDashboard
              onNavigateToPersonals={() => setCurrentView('trainers')}
              onNavigateToAthletes={() => setCurrentView('students')}
            />
          );
        case 'trainers':
          return (
            <AcademyPersonalsList
              onSelectPersonal={(id) => {
                alert(`Ver detalhes do personal ${id}`);
              }}
              onInvitePersonal={handleInvitePersonal}
            />
          );
        case 'students':
          return (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>Visão de Todos os Alunos da Academia (Agregado)</p>
            </div>
          );
        case 'profile':
          return <AcademyProfilePage />;
        case 'settings':
          return <AthleteSettingsPage />;
        case 'hall':
          return <HallDosDeuses />;
        case 'trainers-ranking':
          return <RankingPersonaisPage />;
        case 'design-system':
          return <DesignSystem />;
        default:
          return (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>Funcionalidade em desenvolvimento para Academia ({currentView})</p>
            </div>
          );
      }
    }

    // Se usuário é Personal, renderiza views específicas
    if (userProfile === 'personal') {
      switch (currentView) {
        case 'dashboard':
          return (
            <PersonalDashboard
              onNavigateToAthlete={(id) => {
                setSelectedAthleteId(id);
                setCurrentView('athlete-details');
              }}
              onNavigateToAthletes={() => setCurrentView('students')}
            />
          );
        case 'students':
          return (
            <PersonalAthletesList
              onSelectAthlete={(id) => {
                setSelectedAthleteId(id);
                setCurrentView('athlete-details');
              }}
              onInviteAthlete={handleInviteAthlete}
              onRegisterStudent={() => setCurrentView('student-registration')}
              onRegisterMeasurement={(id) => {
                setSelectedAthleteId(id);
                const athlete = mockPersonalAthletes.find(a => a.id === id);
                if (athlete) setAthleteForEvaluation(athlete);
                setCurrentView('assessment');
              }}
            />
          );
        case 'athlete-details':
          const selectedAthlete = mockPersonalAthletes.find(a => a.id === selectedAthleteId);
          if (!selectedAthlete) {
            setCurrentView('students');
            return null;
          }
          return (
            <AthleteDetailsView
              athlete={selectedAthlete}
              onBack={() => setCurrentView('students')}
              onNewAssessment={() => {
                setAthleteForEvaluation(selectedAthlete);
                setCurrentView('assessment');
              }}
            />
          );
        case 'assessment':
          return (
            <PersonalAssessmentView
              initialAthlete={athleteForEvaluation}
              onConfirm={(data) => handleAssessmentSubmit({
                studentName: data.studentName,
                gender: data.gender
              })}
            />
          );
        case 'evolution':
          return <PersonalEvolutionView />;
        case 'coach':
          return <PersonalCoachView />;
        case 'hall':
          return <HallDosDeuses />;
        case 'results':
          return (
            <AssessmentResults
              onBack={() => setCurrentView('dashboard')}
              studentName={assessmentData.studentName}
              gender={assessmentData.gender}
            />
          );
        case 'design-system':
          return <DesignSystem />;
        case 'profile':
          return <PersonalProfilePage />;
        case 'settings':
          return <AthleteSettingsPage />;
        case 'trainers-ranking':
          return <RankingPersonaisPage />;
        case 'student-registration':
          return (
            <StudentRegistration
              onBack={() => setCurrentView('students')}
              onComplete={() => {
                alert('Aluno cadastrado com sucesso!');
                setCurrentView('students');
              }}
            />
          );
        default:
          return (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>Funcionalidade em desenvolvimento para Personal ({currentView})</p>
            </div>
          );
      }
    }

    // Renderização para Atleta (lógica existente)
    switch (currentView) {
      case 'results':
        return <AssessmentResults onBack={() => setCurrentView('dashboard')} />;
      case 'assessment':
        return <AssessmentPage onConfirm={() => handleAssessmentSubmit()} />;
      case 'design-system':
        return <DesignSystem />;
      case 'evolution':
        return <Evolution gender={profile?.gender === 'FEMALE' ? 'FEMALE' : 'MALE'} />;
      case 'hall':
        return <HallDosDeuses />;
      case 'coach':
        return <CoachIA onOpenChat={() => setIsCoachModalOpen(true)} />;
      case 'profile':
        return <AthleteProfilePage />;
      case 'settings':
        return <AthleteSettingsPage />;
      case 'trainers-ranking':
        return <RankingPersonaisPage />;
      case 'trainers':
      case 'students':
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
    if (userProfile === 'academia') {
      switch (currentView) {
        case 'dashboard': return 'DASHBOARD ACADEMIA';
        case 'trainers': return 'PERSONAIS DA ACADEMIA';
        case 'students': return 'TODOS OS ALUNOS';
        case 'hall': return 'HALL DOS DEUSES';
        case 'design-system': return 'DESIGN SYSTEM';
        case 'trainers-ranking': return 'RANKING PERSONAIS';
        case 'profile': return 'PERFIL DA ACADEMIA';
        case 'settings': return 'CONFIGURAÇÕES';
        default: return currentView.toUpperCase();
      }
    }

    if (userProfile === 'personal') {
      switch (currentView) {
        case 'dashboard': return 'DASHBOARD PERSONAL';
        case 'students': return 'MEUS ALUNOS';
        case 'assessment': return 'AVALIAÇÃO IA';
        case 'evolution': return 'EVOLUÇÃO DOS ALUNOS';
        case 'coach': return 'COACH IA DOS ALUNOS';
        case 'hall': return 'HALL DOS DEUSES';
        case 'results': return 'RESULTADOS DA AVALIAÇÃO IA';
        case 'design-system': return 'DESIGN SYSTEM';
        case 'trainers-ranking': return 'RANKING PERSONAIS';
        case 'profile': return 'MEU PERFIL';
        case 'profile': return 'MEU PERFIL';
        case 'settings': return 'CONFIGURAÇÕES';
        case 'student-registration': return 'CADASTRO DE ALUNO';
        case 'athlete-details': return 'DETALHES DO ATLETA';
        default: return currentView.toUpperCase();
      }
    }

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
      case 'profile': return 'MEU PERFIL';
      case 'settings': return 'CONFIGURAÇÕES';
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
        onNavigate={(view) => {
          setCurrentView(view as ViewState);
          if (view !== 'assessment') {
            setAthleteForEvaluation(null);
          }
        }}
        onLogout={handleLogout}
        userProfile={userProfile}
      />

      {/* Main Content Wrapper */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-background-dark">

        {/* Global Header - Persistent across all views */}
        <Header
          onOpenCoach={() => setIsCoachModalOpen(true)}
          onRegisterStudent={() => setCurrentView('student-registration')}
          onInvitePersonal={handleInvitePersonal}
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
      <AthleteInvitationModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={(data) => {
          console.log('Inviting athlete:', data);
          alert(`Convite enviado/Gerado! (Verifique o console para detalhes)`);
        }}
      />
      <PersonalInvitationModal
        isOpen={isPersonalInviteModalOpen}
        onClose={() => setIsPersonalInviteModalOpen(false)}
        onInvite={(data) => {
          console.log('Inviting personal:', data);
          alert(`Convite de Personal enviado/Gerado!`);
        }}
      />
    </div>
  );
};

export default App;