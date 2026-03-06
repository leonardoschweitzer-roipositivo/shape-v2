import React, { useState, useEffect, Suspense } from 'react';
import {
  Sidebar,
  Header,
  Footer,
  AssessmentModal,
  Login,
  AssessmentPage,
  CoachModal,
  DashboardView,
  PersonalDashboard,
  PersonalCoachDashboard,
  PersonalAthletesList,
  PersonalProfilePage,
  AthleteInvitationModal,
  PersonalInvitationModal,
  StudentRegistration,
  DebugAccess,
  TermsOfUse,
  PrivacyPolicy,
  NotificationDrawer,
  NotificationDetailModal,
  type ProfileType
} from '@/components';

// Lazy-loaded components for code splitting
import {
  LazyAssessmentResults as AssessmentResults,
  LazyDesignSystem as DesignSystem,
  LazyEvolution as Evolution,
  LazyHallDosDeuses as HallDosDeuses,
  LazyCoachIA as CoachIA,
  LazyAthleteProfilePage as AthleteProfilePage,
  LazyAthleteSettingsPage as AthleteSettingsPage,
  LazyRankingPersonaisPage as RankingPersonaisPage,
  LazyPersonalAssessmentView as PersonalAssessmentView,
  LazyPersonalEvolutionView as PersonalEvolutionView,
  LazyPersonalCoachView as PersonalCoachView,
  LazyDiagnosticoView as DiagnosticoView,
  LazyTreinoView as TreinoView,
  LazyDietaView as DietaView,
  LazyAthleteDetailsView as AthleteDetailsView,
  LazyAcademyDashboard as AcademyDashboard,
  LazyAcademyPersonalsList as AcademyPersonalsList,
  LazyAcademyPersonalDetails as AcademyPersonalDetails,
  LazyAcademyProfilePage as AcademyProfilePage,
  LazyAcademyAthletesList as AcademyAthletesList,
  LazyAcademyAthleteDetails as AcademyAthleteDetails,
  LazyLibraryView as LibraryView,
  LazyGoldenRatioSourceView as GoldenRatioSourceView,
  LazyMetabolismSourceView as MetabolismSourceView,
  LazyTrainingVolumeSourceView as TrainingVolumeSourceView,
  LazyProteinSourceView as ProteinSourceView,
  LazyEnergyBalanceSourceView as EnergyBalanceSourceView,
  LazyTrainingFrequencySourceView as TrainingFrequencySourceView,
  LazyPeriodizationSourceView as PeriodizationSourceView,
  LazyFeminineProportionsSourceView as FeminineProportionsSourceView,
  LazyAthletePortal as AthletePortal,
  LazyPortalLanding as PortalLanding,
  LazyNotificationsPage as NotificationsPage,
  LazyNotificationSettingsPage as NotificationSettingsPage,
  LazyBibliotecaExerciciosPage as BibliotecaExerciciosPage,
  LazyPersonalPortal as PersonalPortal,
} from '@/lazyPages';
// import { GamificationPage } from './pages/GamificationPage'; // DISABLED - Feature para depois

import { calculateAge } from '@/utils/dateUtils';
import { useAthleteStore } from '@/stores/athleteStore';
import { useDataStore } from '@/stores/dataStore';
import { useAuthStore } from '@/stores/authStore';
import { useSupabaseSync } from '@/hooks/useSupabaseSync';
import { useNotificacoes } from '@/hooks/useNotificacoes';
import { PersonalAthlete, MeasurementHistory } from '@/mocks/personal';
import { buscarDiagnostico, type DiagnosticoDados } from '@/services/calculations/diagnostico';
import { buscarPlanoTreino, type PlanoTreino } from '@/services/calculations/treino';
import { buscarPlanoDieta, type PlanoDieta } from '@/services/calculations/dieta';
import { supabase } from '@/services/supabase';
import { getPageTitle, type ViewState } from '@/utils/getPageTitle';

const App: React.FC = () => {

  // Auth Store
  const { isAuthenticated, profile: authProfile, signOut, checkSession, isLoading: isAuthLoading, entity } = useAuthStore();

  // Local UI State
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [isCoachModalOpen, setIsCoachModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isPersonalInviteModalOpen, setIsPersonalInviteModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);
  const [portalToken, setPortalToken] = useState<string | null>(null);

  // Personal Portal URL detection (/personal/:personalId)
  const personalPortalId = (() => {
    const match = window.location.pathname.match(/^\/personal\/([a-zA-Z0-9\-]+)/);
    return match ? match[1] : null;
  })();
  const [diagnosticoPlanId, setDiagnosticoPlanId] = useState<string | null>(null);
  const [consultaDiagData, setConsultaDiagData] = useState<DiagnosticoDados | null>(null);
  const [consultaTreinoData, setConsultaTreinoData] = useState<PlanoTreino | null>(null);
  const [consultaDietaData, setConsultaDietaData] = useState<PlanoDieta | null>(null);
  const [consultaPlanoCompleto, setConsultaPlanoCompleto] = useState<any | null>(null);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [selectedNotifDetail, setSelectedNotifDetail] = useState<Notificacao | null>(null);

  // Notifications hook (polling + state)
  const {
    notificacoes,
    naoLidas: notificacoesNaoLidas,
    loading: notificacoesLoading,
    marcarComoLida: marcarNotificacaoLida,
    marcarTodasComoLidas: marcarTodasNotificacoesLidas,
    recarregar: recarregarNotificacoes,
  } = useNotificacoes();

  // Run inactivity check + periodic summaries once per session for personals
  useEffect(() => {
    const personalId = entity?.personal?.id;
    if (!personalId) return;
    const sessionKey = `startup-checks-${personalId}`;
    if (sessionStorage.getItem(sessionKey)) return;

    sessionStorage.setItem(sessionKey, 'true');

    // 1. Inactivity check
    import('@/services/inactivityChecker').then(({ verificarInatividade }) => {
      verificarInatividade(personalId).then(count => {
        if (count > 0) {
          console.info(`[App] ${count} notificações de inatividade criadas`);
        }

        // 2. Periodic summaries (após inatividade para manter ordem)
        import('@/services/resumoNotificacoes').then(({ gerarResumosPendentes }) => {
          gerarResumosPendentes(personalId).then(resumos => {
            if (count > 0 || resumos > 0) {
              recarregarNotificacoes();
            }
          }).catch(err => console.warn('[App] Erro ao gerar resumos:', err));
        });
      }).catch(err => console.warn('[App] Erro ao verificar inatividade:', err));
    });
  }, [entity?.personal?.id, recarregarNotificacoes]);

  // Derived user profile from Auth Store
  const userProfile: ProfileType = (authProfile?.role?.toLowerCase() as ProfileType) || 'atleta';

  const { settings, profile, initializeProfile } = useAthleteStore();

  // Check Session on Mount
  useEffect(() => {
    checkSession();
  }, []);

  // FORÇA limpeza de caches antigos para todos os usuários com a nova atualização
  useEffect(() => {
    // Estas chaves armazenavam 'MOCK' em versões anteriores. Vamos limpar.
    const keysToPurge = ['vitru-data-storage', 'daily-tracking-storage'];
    let purged = false;

    keysToPurge.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        purged = true;
      }
    });

    if (purged) {
      console.info('[App] 🧹 Caches de dados antigos/mocks limpos automaticamente com a nova versão.');
    }
  }, []);

  // Detect portal token in URL (?token=XXX)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      console.info('[App] 🔗 Portal token detectado na URL:', token.substring(0, 8) + '...');
      setPortalToken(token);
    }
  }, []);

  // State for assessment flow
  const [assessmentData, setAssessmentData] = useState<{ studentName?: string; gender?: 'male' | 'female', assessment?: MeasurementHistory, birthDate?: string, athleteId?: string, age?: number }>({});
  const [athleteForEvaluation, setAthleteForEvaluation] = useState<PersonalAthlete | null>(null);

  // Hook for persistent Data Store
  const { personalAthletes, addAssessment } = useDataStore();

  // Supabase Sync - carrega dados reais quando autenticado
  const { dataSource } = useSupabaseSync();

  const handleAssessmentSubmit = (data?: {
    studentId?: string;
    studentName?: string;
    gender?: 'male' | 'female';
    measurements?: any;
    skinfolds?: any;
    age?: number;
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
      const athlete = personalAthletes.find(a => a.id === data.studentId);
      setAssessmentData({
        studentName: data.studentName,
        gender: data.gender,
        assessment: assessment,
        birthDate: athlete?.birthDate,
        athleteId: data.studentId,
        age: data.age
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
        assessment: assessment,
        birthDate: (profile?.birthDate || existingAthlete?.birthDate) as string | undefined,
        athleteId: athleteId
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
          assessment: assessment,
          birthDate: selectedAthlete.birthDate,
          athleteId: selectedAthlete.id,
          age: selectedAthlete.birthDate ? calculateAge(selectedAthlete.birthDate) : undefined
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
        assessment: latestAssessment,
        birthDate: athlete.birthDate,
        athleteId: athleteId,
        age: athlete.birthDate ? calculateAge(athlete.birthDate) : undefined
      });
      setSelectedAthleteId(athleteId);
      setCurrentView('results');
    }
  };

  const handleViewEvolutionPlan = async (plano: any) => {
    console.info('[App] 🔍 Visualizando plano completo:', plano.id);
    setConsultaPlanoCompleto(plano);

    // Garante que selectedAthleteId está definido (essencial para renderizar consulta-treino/dieta)
    if (plano.atleta_id) {
      setSelectedAthleteId(plano.atleta_id);
    }

    // Configura os dados do Diagnóstico
    if (plano.dados) setConsultaDiagData(plano.dados);

    // Configura os dados do Treino — tenta join local primeiro, depois busca no DB
    if (plano.planos_treino && plano.planos_treino.length > 0) {
      setConsultaTreinoData(plano.planos_treino[0].dados);
    } else if (plano.atleta_id) {
      // Fallback: busca o plano de treino mais recente do atleta no banco
      const treinoData = await buscarPlanoTreino(plano.atleta_id);
      setConsultaTreinoData(treinoData);
    } else {
      setConsultaTreinoData(null);
    }

    // Configura os dados da Dieta — tenta join local primeiro, depois busca no DB
    if (plano.planos_dieta && plano.planos_dieta.length > 0) {
      setConsultaDietaData(plano.planos_dieta[0].dados);
    } else if (plano.atleta_id) {
      // Fallback: busca o plano de dieta mais recente do atleta no banco
      const dietaData = await buscarPlanoDieta(plano.atleta_id);
      setConsultaDietaData(dietaData);
    } else {
      setConsultaDietaData(null);
    }

    setCurrentView('consulta-diagnostico');
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


  const handleLogout = () => {
    signOut();
    setCurrentView('dashboard');
  };

  const handleQuickLogin = (_user: unknown) => {
    // Legacy mock login support for DebugAccess
    // In a real scenario, this would likely bypass AuthStore or mock it
    // For now we just don't use it or implement a mockSignIn in AuthStore
    console.warn("Quick login not supported with Supabase yet");
  };



  const renderContent = () => {
    // Shared views
    if (currentView === 'terms') {
      return <TermsOfUse onBack={() => setCurrentView('dashboard')} />;
    }
    if (currentView === 'privacy') {
      return <PrivacyPolicy onBack={() => setCurrentView('dashboard')} />;
    }
    if (currentView === 'library') {
      return <LibraryView onNavigateToSource={(id) => {
        if (id === 'golden-ratio') setCurrentView('library-golden-ratio');
        if (id === 'metabolism') setCurrentView('library-metabolism');
        if (id === 'training-volume') setCurrentView('library-training-volume');
        if (id === 'protein') setCurrentView('library-protein');
        if (id === 'energy-balance') setCurrentView('library-energy-balance');
        if (id === 'training-frequency') setCurrentView('library-training-frequency');
        if (id === 'periodization') setCurrentView('library-periodization');
        if (id === 'feminine-proportions') setCurrentView('library-feminine-proportions');
      }} />;
    }
    if (currentView === 'library-golden-ratio') {
      return <GoldenRatioSourceView onBack={() => setCurrentView('library')} />;
    }
    if (currentView === 'library-metabolism') {
      return <MetabolismSourceView onBack={() => setCurrentView('library')} />;
    }
    if (currentView === 'library-training-volume') {
      return <TrainingVolumeSourceView onBack={() => setCurrentView('library')} />;
    }
    if (currentView === 'library-protein') {
      return <ProteinSourceView onBack={() => setCurrentView('library')} />;
    }
    if (currentView === 'library-energy-balance') {
      return <EnergyBalanceSourceView onBack={() => setCurrentView('library')} />;
    }
    if (currentView === 'library-training-frequency') {
      return <TrainingFrequencySourceView onBack={() => setCurrentView('library')} />;
    }
    if (currentView === 'library-periodization') {
      return <PeriodizationSourceView onBack={() => setCurrentView('library')} />;
    }
    if (currentView === 'library-feminine-proportions') {
      return <FeminineProportionsSourceView onBack={() => setCurrentView('library')} />;
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
                setSelectedAthleteId(id);
                setCurrentView('personal-details');
              }}
              onInvitePersonal={handleInvitePersonal}
            />
          );
        case 'personal-details':
          if (!selectedAthleteId) {
            setCurrentView('trainers');
            return null;
          }
          return (
            <AcademyPersonalDetails
              personalId={selectedAthleteId}
              onBack={() => setCurrentView('trainers')}
            />
          );
        case 'students':
          return (
            <AcademyAthletesList
              onSelectAthlete={(id) => {
                setSelectedAthleteId(id);
                setCurrentView('student-details');
              }}
              onViewEvolution={(id) => {
                setSelectedAthleteId(id);
                setCurrentView('evolution');
              }}
            />
          );
        case 'student-details':
          if (!selectedAthleteId) {
            setCurrentView('students');
            return null;
          }
          return (
            <AcademyAthleteDetails
              athleteId={selectedAthleteId}
              onBack={() => setCurrentView('students')}
              onConsultAssessment={(assessmentId) => {
                // Note: Academia can only view, not modify assessments
                alert(`Visualizar avaliação ${assessmentId} - funcionalidade em desenvolvimento`);
              }}
            />
          );
        case 'profile':
          return <AcademyProfilePage />;
        case 'settings':
          return <AthleteSettingsPage />;
        case 'evolution':
          return <PersonalEvolutionView initialAthleteId={selectedAthleteId} />;
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
              onViewPlan={handleViewEvolutionPlan}
              onDeleteAthlete={async (athleteId) => {
                try {
                  console.info('[App] 🗑️ Iniciando exclusão do atleta:', athleteId);
                  const personalId = useAuthStore.getState().entity?.personal?.id;
                  const authUserId = useAuthStore.getState().user?.id;
                  console.info('[App] personalId:', personalId, 'authUserId:', authUserId);

                  // 1. Deletar planos de treino
                  const r1 = await supabase.from('planos_treino').delete().eq('atleta_id', athleteId);
                  console.info('[App] planos_treino:', r1.error ? `❌ ${r1.error.message}` : '✅');

                  // 2. Deletar planos de dieta
                  const r2 = await supabase.from('planos_dieta').delete().eq('atleta_id', athleteId);
                  console.info('[App] planos_dieta:', r2.error ? `❌ ${r2.error.message}` : '✅');

                  // 3. Deletar diagnósticos
                  const r3 = await supabase.from('diagnosticos').delete().eq('atleta_id', athleteId);
                  console.info('[App] diagnosticos:', r3.error ? `❌ ${r3.error.message}` : '✅');

                  // 4. Deletar medidas
                  const r4 = await supabase.from('medidas').delete().eq('atleta_id', athleteId);
                  console.info('[App] medidas:', r4.error ? `❌ ${r4.error.message}` : '✅');

                  // 5. Deletar assessments
                  const r5 = await supabase.from('assessments').delete().eq('atleta_id', athleteId);
                  console.info('[App] assessments:', r5.error ? `❌ ${r5.error.message}` : '✅');

                  // 6. Deletar ficha do atleta
                  const r6 = await supabase.from('fichas').delete().eq('atleta_id', athleteId);
                  console.info('[App] fichas:', r6.error ? `❌ ${r6.error.message}` : '✅');

                  // 7. Deletar o atleta — verificar se realmente foi deletado
                  const r7 = await supabase.from('atletas').delete().eq('id', athleteId).select('id');
                  console.info('[App] atletas delete result:', JSON.stringify({ error: r7.error, data: r7.data, count: r7.count }));

                  if (r7.error) {
                    console.error('[App] ❌ atletas delete ERRO:', r7.error.code, r7.error.message, r7.error.details, r7.error.hint);
                    alert(`Erro ao excluir aluno:\n${r7.error.message}\n\nCódigo: ${r7.error.code}`);
                    return;
                  }

                  if (!r7.data || r7.data.length === 0) {
                    console.error('[App] ❌ atletas delete: nenhuma linha deletada (possível bloqueio de RLS)');
                    alert('Falha ao excluir: RLS pode estar bloqueando a operação.\nVeja o console F12 e verifique as políticas no Supabase.');
                    return;
                  }

                  console.info('[App] ✅ Atleta excluído com sucesso:', athleteId);

                  // 8. Recarregar dados e navegar
                  if (personalId) {
                    await useDataStore.getState().loadFromSupabase(personalId);
                  }
                  setCurrentView('students');
                } catch (error) {
                  console.error('[App] ❌ Exceção ao excluir atleta:', error);
                  alert('Erro ao excluir aluno. Verifique o console (F12) para detalhes.');
                }
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
          return <PersonalCoachView
            onStartDiagnostico={(atletaId) => {
              setSelectedAthleteId(atletaId);
              setCurrentView('diagnostico');
            }}
            onConsultPlan={async (atletaId, tipo) => {
              setSelectedAthleteId(atletaId);
              if (tipo === 'diagnostico') {
                const data = await buscarDiagnostico(atletaId);
                if (data) {
                  setConsultaDiagData(data);
                  setCurrentView('consulta-diagnostico');
                }
              } else if (tipo === 'treino') {
                const data = await buscarPlanoTreino(atletaId);
                if (data) {
                  setConsultaTreinoData(data);
                  setCurrentView('consulta-treino');
                }
              } else if (tipo === 'dieta') {
                const data = await buscarPlanoDieta(atletaId);
                if (data) {
                  setConsultaDietaData(data);
                  setCurrentView('consulta-dieta');
                }
              }
            }}
          />;
        case 'diagnostico':
          return selectedAthleteId ? (
            <DiagnosticoView
              atletaId={selectedAthleteId}
              onBack={() => setCurrentView('coach')}
              onNext={(diagId?: string) => {
                if (diagId) setDiagnosticoPlanId(diagId);
                setCurrentView('treino-plano');
              }}
            />
          ) : null;
        case 'treino-plano':
          return selectedAthleteId ? (
            <TreinoView
              atletaId={selectedAthleteId}
              diagnosticoId={diagnosticoPlanId ?? undefined}
              onBack={() => setCurrentView('diagnostico')}
              onNext={() => {
                setCurrentView('dieta-plano');
              }}
            />
          ) : null;
        case 'dieta-plano':
          return selectedAthleteId ? (
            <DietaView
              atletaId={selectedAthleteId}
              diagnosticoId={diagnosticoPlanId ?? undefined}
              onBack={() => setCurrentView('treino-plano')}
              onComplete={() => {
                setCurrentView('athlete-details');
              }}
            />
          ) : null;
        case 'consulta-diagnostico':
          return selectedAthleteId && consultaDiagData ? (
            <DiagnosticoView
              atletaId={selectedAthleteId}
              onBack={() => {
                if (consultaPlanoCompleto) {
                  setConsultaDiagData(null);
                  setConsultaPlanoCompleto(null);
                }
                setCurrentView('athlete-details');
              }}
              onNext={() => {
                if (consultaPlanoCompleto) setCurrentView('consulta-treino');
              }}
              readOnlyData={consultaDiagData}
            />
          ) : null;
        case 'consulta-treino':
          return selectedAthleteId ? (
            <TreinoView
              atletaId={selectedAthleteId}
              onBack={() => {
                if (consultaPlanoCompleto) setCurrentView('consulta-diagnostico');
                else {
                  setConsultaTreinoData(null);
                  setCurrentView('coach');
                }
              }}
              onNext={() => {
                if (consultaPlanoCompleto) setCurrentView('consulta-dieta');
              }}
              readOnlyData={consultaTreinoData || undefined}
            />
          ) : null;
        case 'consulta-dieta':
          return selectedAthleteId ? (
            <DietaView
              atletaId={selectedAthleteId}
              onBack={() => {
                if (consultaPlanoCompleto) setCurrentView('consulta-treino');
                else {
                  setConsultaDietaData(null);
                  setCurrentView('coach');
                }
              }}
              readOnlyData={consultaDietaData || undefined}
            />
          ) : null;
        case 'hall':
          return <HallDosDeuses />;
        case 'results':
          return (
            <AssessmentResults
              onBack={() => setCurrentView('dashboard')}
              studentName={assessmentData.studentName}
              gender={assessmentData.gender}
              assessment={assessmentData.assessment}
              birthDate={assessmentData.birthDate}
              athleteId={assessmentData.athleteId}
              age={assessmentData.age}
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
              onComplete={(atletaId?: string) => {
                if (atletaId) {
                  // Navigate to assessment with the newly created athlete pre-selected
                  const newAthlete = personalAthletes.find(a => a.id === atletaId);
                  if (newAthlete) {
                    setAthleteForEvaluation(newAthlete);
                  }
                  setCurrentView('assessment');
                } else {
                  setCurrentView('students');
                }
              }}
            />
          );
        case 'notifications':
          return (
            <NotificationsPage
              onAcao={(url) => {
                // Navegar para contexto — ex: /athlete-details?id=xxx
                if (url.startsWith('/athlete-details/')) {
                  const id = url.replace('/athlete-details/', '');
                  setSelectedAthleteId(id);
                  setCurrentView('athlete-details');
                }
              }}
            />
          );
        case 'notification-settings':
          return (
            <NotificationSettingsPage
              onBack={() => setCurrentView('notifications')}
            />
          );
        case 'exercicios-biblioteca':
          return (
            <BibliotecaExerciciosPage
              onBack={() => setCurrentView('dashboard')}
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
            birthDate={assessmentData.birthDate}
            athleteId={assessmentData.athleteId}
            age={assessmentData.age}
          />
        );
      case 'assessment': {
        const currentAthleteEmail = profile?.email?.toLowerCase();
        const currentAthleteName = profile?.name?.toLowerCase();
        const currentAthleteObj = personalAthletes.find(a =>
          a.id === profile?.id ||
          (currentAthleteEmail && a.email.toLowerCase() === currentAthleteEmail) ||
          (currentAthleteName && a.name.toLowerCase().includes(currentAthleteName))
        ) || personalAthletes.find(a => a.id === 'athlete-leonardo');

        const latestAssessment = currentAthleteObj?.assessments?.[0];
        const initialData = latestAssessment ? { measurements: latestAssessment.measurements, skinfolds: latestAssessment.skinfolds } : undefined;

        return <AssessmentPage onConfirm={(data: any) => handleAssessmentSubmit(data)} initialData={initialData} />;
      }
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
          age={currentAthleteForEvolution?.birthDate ? calculateAge(currentAthleteForEvolution.birthDate) : undefined}
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
            onViewPlan={handleViewEvolutionPlan}
            hideStatusControl={true}
          />
        );
      // case 'gamification': // DISABLED - Feature para depois
      //   return <GamificationPage />;
      case 'athlete-portal':
        return <AthletePortal atletaId={selectedAthleteId || ''} />;
      case 'dashboard':
      default:
        return <DashboardView userProfile={userProfile} />;
    }
  };


  // getPageTitle extracted to @/utils/getPageTitle.ts

  // Portal do Atleta via token (bypass auth — atleta acessa via link de convite)
  if (portalToken) {
    return (
      <Suspense fallback={
        <div className="flex h-screen w-full items-center justify-center bg-background-dark text-white">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <PortalLanding
          token={portalToken}
          onClose={() => {
            setPortalToken(null);
            const url = new URL(window.location.href);
            url.searchParams.delete('token');
            window.history.replaceState({}, '', url.pathname);
          }}
        />
      </Suspense>
    );
  }

  if (isAuthLoading && !personalPortalId) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background-dark text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  // Portal do Personal via URL (/personal/:personalId)
  if (personalPortalId) {
    return (
      <Suspense fallback={
        <div className="flex h-screen w-full items-center justify-center bg-[#060B18] text-white">
          <div className="w-8 h-8 border-4 border-[gold] border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <PersonalPortal
          personalId={personalPortalId}
          onLogout={() => {
            signOut();
            window.location.href = '/';
          }}
        />
      </Suspense>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={() => { }} />;
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
          onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
          title={getPageTitle(currentView, userProfile)}
          userProfile={userProfile}
          notificacoesNaoLidas={notificacoesNaoLidas}
        />

        {/* Content Area - Flex container to manage scrolling independently */}
        <div className="flex-1 overflow-y-auto relative flex flex-col custom-scrollbar">
          <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>{renderContent()}</Suspense>

          <Footer
            onOpenDesignSystem={() => setCurrentView('design-system')}
            onOpenLibrary={() => setCurrentView('library')}
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

          alert(`Convite enviado/Gerado! (Verifique o console para detalhes)`);
        }}
      />
      <PersonalInvitationModal
        isOpen={isPersonalInviteModalOpen}
        onClose={() => setIsPersonalInviteModalOpen(false)}
        onInvite={(data) => {

          alert(`Convite de Personal enviado/Gerado!`);
        }}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notificacoes={notificacoes.slice(0, 20)}
        naoLidas={notificacoesNaoLidas}
        loading={notificacoesLoading}
        onMarcarLida={marcarNotificacaoLida}
        onMarcarTodasLidas={marcarTodasNotificacoesLidas}
        onVerTodas={() => {
          setIsNotificationDrawerOpen(false);
          setCurrentView('notifications');
        }}
        onAcao={(notif) => {
          setSelectedNotifDetail(notif);
        }}
      />

      {/* Notification Detail Modal (Drawer) */}
      {
        selectedNotifDetail && (
          <NotificationDetailModal
            notificacao={selectedNotifDetail}
            onFechar={() => setSelectedNotifDetail(null)}
            onAcao={(url) => {
              if (url.startsWith('/athlete-details/')) {
                const id = url.replace('/athlete-details/', '');
                setSelectedAthleteId(id);
                setCurrentView('athlete-details');
              }
            }}
          />
        )
      }

      <DebugAccess
        onLogin={handleQuickLogin}
        isVisible={true}
      />
    </div>
  );
};

export default App;