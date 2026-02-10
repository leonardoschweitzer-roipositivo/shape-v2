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
  PersonalCoachDashboard,
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
  DebugAccess,
  TermsOfUse,
  PrivacyPolicy,
  type ProfileType
} from '@/components';
// import { GamificationPage } from './pages/GamificationPage'; // DISABLED - Feature para depois
import { AthletePortal } from './pages/AthletePortal';
import { useAthleteStore } from '@/stores/athleteStore';
import { useDataStore } from '@/stores/dataStore';
import { PersonalAthlete, MeasurementHistory } from '@/mocks/personal';

type ViewState = 'dashboard' | 'results' | 'design-system' | 'evolution' | 'hall' | 'coach' | 'profile' | 'settings' | 'assessment' | 'trainers' | 'students' | 'trainers-ranking' | 'student-registration' | 'athlete-details' | 'terms' | 'privacy' | 'my-record' | 'gamification' | 'athlete-portal';

const App: React.FC = () => {
  console.log('🎯 App component rendering...');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<ProfileType>('atleta');
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [isCoachModalOpen, setIsCoachModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isPersonalInviteModalOpen, setIsPersonalInviteModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);

  console.log('📊 Initializing stores...');
  const { settings, profile, initializeProfile } = useAthleteStore();

  console.log('✅ Store initialized:', { settings, profile });

  // State for assessment flow
  const [assessmentData, setAssessmentData] = useState<{ studentName?: string; gender?: 'male' | 'female', assessment?: MeasurementHistory }>({});
  const [athleteForEvaluation, setAthleteForEvaluation] = useState<PersonalAthlete | null>(null);

  // Hook for persistent Data Store
  const { personalAthletes, addAssessment } = useDataStore();

  const handleAssessmentSubmit = (data?: {
    studentId?: string;
    studentName?: string;
    gender?: 'male' | 'female';
    measurements?: any;
    skinfolds?: any;
  }) => {
    setIsAssessmentOpen(false);

    if (!data) return;

    if (data.studentId && data.measurements && data.skinfolds) {
      // Use Store to add assessment (persisted)
      const { assessment, result } = addAssessment({
        athleteId: data.studentId,
        measurements: data.measurements,
        skinfolds: data.skinfolds,
        gender: data.gender === 'female' ? 'FEMALE' : 'MALE'
      });

      // Update assessment data for results view
      setAssessmentData({
        studentName: data.studentName,
        gender: data.gender,
        assessment: assessment
      });
    } else if (data.measurements && data.skinfolds) {
      // Self/Atleta assessment
      // Try to find the athlete in the list or use Leonardo as fallback for this demo
      const targetEmail = profile?.email?.toLowerCase();
      const existingAthlete = personalAthletes.find(a =>
        (targetEmail && a.email.toLowerCase() === targetEmail) ||
        (profile && a.id === profile.id)
      );

      const athleteId = existingAthlete?.id || profile?.id || 'athlete-leonardo';

      const { assessment, result } = addAssessment({
        athleteId,
        measurements: data.measurements,
        skinfolds: data.skinfolds,
        gender: (profile?.gender === 'FEMALE' || existingAthlete?.gender === 'FEMALE') ? 'FEMALE' : 'MALE'
      });

      // Update athleteStore latest score if it matches the current athlete
      if (profile && athleteId === profile.id) {
        useAthleteStore.getState().updateLatestScore({
          overall: result.avaliacaoGeral,
          ratio: result.scores.proporcoes.valor,
          classification: result.classificacao.nivel
        });
      }

      setAssessmentData({
        studentName: profile?.name || 'Atleta',
        gender: profile?.gender === 'FEMALE' ? 'female' : 'male',
        assessment: assessment
      });
    } else if (data.studentName && data.gender) {
      // Legacy/Fallback or just simple pass-through
      setAssessmentData({ studentName: data.studentName, gender: data.gender });
    }

    // Simulate loading or transition
    setTimeout(() => {
      setCurrentView('results');
    }, 300);
  };

  const handleConsultAssessment = (assessmentId: string) => {
    // Try to find in personal athletes first (trainer view)
    let selectedAthlete = personalAthletes.find(a => a.id === selectedAthleteId);

    // If not found (maybe athlete view), check if it's the current user and we have their assessment
    if (!selectedAthlete && assessmentData.assessment?.id === assessmentId) {
      setCurrentView('results');
      return;
    }

    // Fallback: search all mock athletes if we're in "my record" view as an athlete
    if (!selectedAthlete && userProfile === 'atleta') {
      const targetEmail = profile?.email?.toLowerCase();
      selectedAthlete = personalAthletes.find(a => a.id === profile?.id) ||
        personalAthletes.find(a => targetEmail && a.email.toLowerCase() === targetEmail) ||
        personalAthletes.find(a => a.id === 'athlete-leonardo');
    }

    if (selectedAthlete) {
      const assessment = selectedAthlete.assessments.find(a => a.id === assessmentId);
      if (assessment) {
        setAssessmentData({
          studentName: selectedAthlete.name,
          gender: selectedAthlete.gender === 'FEMALE' ? 'female' : 'male',
          assessment: assessment
        });
        setCurrentView('results');
      }
    }
  };

  const handleViewLatestAssessment = (athleteId: string) => {
    const athlete = personalAthletes.find(a => a.id === athleteId);
    if (athlete && athlete.assessments.length > 0) {
      const latestAssessment = athlete.assessments[0];
      setAssessmentData({
        studentName: athlete.name,
        gender: athlete.gender === 'FEMALE' ? 'female' : 'male',
        assessment: latestAssessment
      });
      setSelectedAthleteId(athleteId);
      setCurrentView('results');
    }
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

  const handleQuickLogin = (user: any) => {
    setUserProfile(user.role);
    setIsAuthenticated(true);
    setCurrentView('dashboard');

    if (user.role === 'atleta') {
      const birthDate = user.name === 'Leonardo Schiwetzer' ? new Date(1978, 5, 15) : new Date(1995, 5, 15);
      initializeProfile({
        name: user.name,
        email: user.email,
        gender: user.gender,
        birthDate: birthDate,
        goal: 'aesthetics'
      });
    }
  };



  const renderContent = () => {
    // Shared views
    if (currentView === 'terms') {
      return <TermsOfUse onBack={() => setCurrentView('dashboard')} />;
    }
    if (currentView === 'privacy') {
      return <PrivacyPolicy onBack={() => setCurrentView('dashboard')} />;
    }

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
              athletes={personalAthletes}
              onSelectAthlete={(id) => {
                setSelectedAthleteId(id);
                setCurrentView('athlete-details');
              }}
              onViewEvolution={(id) => {
                setSelectedAthleteId(id);
                setCurrentView('evolution');
              }}
              onInviteAthlete={handleInviteAthlete}
              onRegisterStudent={() => setCurrentView('student-registration')}
              onRegisterMeasurement={(id) => {
                setSelectedAthleteId(id);
                const athlete = personalAthletes.find(a => a.id === id);
                if (athlete) setAthleteForEvaluation(athlete);
                setCurrentView('assessment');
              }}
              onViewLatestAssessment={handleViewLatestAssessment}
            />
          );
        case 'athlete-details':
          const selectedAthlete = personalAthletes.find(a => a.id === selectedAthleteId);
          if (!selectedAthlete) {
            setCurrentView('students');
            return null;
          }
          return (
            <AthleteDetailsView
              athlete={selectedAthlete}
              onBack={() => setCurrentView('students')}
              onConsultAssessment={handleConsultAssessment}
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
              onConfirm={handleAssessmentSubmit}
            />
          );
        case 'evolution':
          return <PersonalEvolutionView initialAthleteId={selectedAthleteId} />;
        case 'coach':
          return <PersonalCoachDashboard onAtletaClick={(id) => {
            setSelectedAthleteId(id);
            setCurrentView('athlete-details');
          }} />;
        case 'hall':
          return <HallDosDeuses />;
        case 'results':
          return (
            <AssessmentResults
              onBack={() => setCurrentView('dashboard')}
              studentName={assessmentData.studentName}
              gender={assessmentData.gender}
              assessment={assessmentData.assessment}
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
        return (
          <AssessmentResults
            onBack={() => setCurrentView('dashboard')}
            studentName={assessmentData.studentName}
            gender={assessmentData.gender}
            assessment={assessmentData.assessment}
          />
        );
      case 'assessment':
        return <AssessmentPage onConfirm={(data: any) => handleAssessmentSubmit(data)} />;
      case 'design-system':
        return <DesignSystem />;
      case 'evolution':
        // Robust athlete detection
        const userEmail = profile?.email?.toLowerCase();
        const userName = profile?.name?.toLowerCase();

        const currentAthleteForEvolution = personalAthletes.find(a =>
          a.id === profile?.id ||
          (userEmail && a.email.toLowerCase() === userEmail) ||
          (userName && a.name.toLowerCase().includes(userName))
        ) || personalAthletes.find(a => a.id === 'athlete-leonardo'); // Default to Leonardo for demo/dev

        return <Evolution
          gender={profile?.gender === 'FEMALE' ? 'FEMALE' : 'MALE'}
          assessments={currentAthleteForEvolution?.assessments || (assessmentData.assessment ? [assessmentData.assessment] : [])}
        />;
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
      case 'my-record':
        // Robust athlete detection with fallback to Leonardo
        const myRecordTargetEmail = profile?.email?.toLowerCase();

        const myRecordAthlete = personalAthletes.find(a =>
          (profile && a.id === profile.id) ||
          (myRecordTargetEmail && a.email.toLowerCase() === myRecordTargetEmail)
        ) || personalAthletes.find(a => a.id === 'athlete-leonardo');

        if (!myRecordAthlete && !profile) {
          return <DashboardView userProfile={userProfile} />;
        }

        // Use found mock athlete or construct from profile
        const displayAthlete: PersonalAthlete = myRecordAthlete || {
          id: profile!.id,
          name: profile!.name,
          email: profile!.email,
          gender: profile!.gender,
          avatarUrl: profile!.avatarUrl || null,
          score: profile!.latestScore?.overall || 0,
          scoreVariation: 0,
          ratio: profile!.latestScore?.ratio || 0,
          lastMeasurement: new Date().toISOString(),
          status: 'active',
          linkedSince: profile!.createdAt.toISOString(),
          assessments: assessmentData.assessment ? [assessmentData.assessment] : []
        };

        return (
          <AthleteDetailsView
            athlete={displayAthlete}
            onBack={() => setCurrentView('dashboard')}
            onConsultAssessment={handleConsultAssessment}
            onNewAssessment={() => {
              setCurrentView('assessment');
            }}
            hideStatusControl={true}
          />
        );
      // case 'gamification': // DISABLED - Feature para depois
      //   return <GamificationPage />;
      case 'athlete-portal':
        return <AthletePortal />;
      case 'dashboard':
      default:
        return <DashboardView userProfile={userProfile} />;
    }
  };


  const getPageTitle = () => {
    if (currentView === 'terms') return 'TERMOS DE USO';
    if (currentView === 'privacy') return 'POLÍTICA DE PRIVACIDADE';

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
      case 'my-record': return 'MINHA FICHA';
      case 'athlete-portal': return 'PORTAL DO ATLETA';
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

          <Footer
            onOpenDesignSystem={() => setCurrentView('design-system')}
            onOpenTerms={() => setCurrentView('terms')}
            onOpenPrivacy={() => setCurrentView('privacy')}
            onOpenAthletePortal={() => setCurrentView('athlete-portal')}
          />
        </div>
      </main>

      {/* Modals */}
      <AssessmentModal
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
        onConfirm={(data: any) => handleAssessmentSubmit(data)}
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

      <DebugAccess
        onLogin={handleQuickLogin}
        isVisible={true}
      />
    </div>
  );
};

export default App;