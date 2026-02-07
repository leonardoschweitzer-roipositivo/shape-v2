import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroCard } from './components/HeroCard';
import { RatioCard, HeatmapCard, ScoreCard } from './components/KpiCard';
import { MetricsGrid } from './components/MetricsGrid';
import { AssessmentModal } from './components/AssessmentModal';
import { AssessmentResults } from './components/AssessmentResults';
import { DesignSystem } from './components/DesignSystem';
import { Evolution } from './components/Evolution';
import { Login } from './components/Login';

import { AssessmentPage } from './components/AssessmentPage';

type ViewState = 'dashboard' | 'results' | 'design-system' | 'evolution' | 'coach' | 'profile' | 'settings' | 'assessment';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');

  const handleLogin = () => {
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
        return (
          <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar flex flex-col">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10 flex-1 w-full">
              {/* Page Title */}
              <div className="flex flex-col animate-fade-in-up">
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">INÍCIO</h2>
                <p className="text-gray-400 mt-2 font-light">Visão geral da sua simetria e progresso atual.</p>
              </div>

              <div className="h-px w-full bg-white/10" />

              {/* Hero Section */}
              <HeroCard />

              {/* KPI Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RatioCard />
                <HeatmapCard />
                <ScoreCard />
              </div>

              {/* Detailed Metrics */}
              <MetricsGrid />
            </div>
          </div>
        );
    }
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'INÍCIO';
      case 'results': return 'RESULTADOS';
      case 'evolution': return 'EVOLUÇÃO';
      case 'assessment': return 'AVALIAÇÃO IA';
      case 'design-system': return 'DESIGN SYSTEM';
      default: return currentView.toUpperCase();
    }
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-dark text-white font-sans selection:bg-primary selection:text-background-dark">
      {/* Sidebar Navigation */}
      <Sidebar currentView={currentView} onNavigate={(view) => setCurrentView(view as ViewState)} />

      {/* Main Content Wrapper */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-background-dark">

        {/* Global Header - Persistent across all views */}
        <Header
          onOpenAssessment={() => setIsAssessmentOpen(true)}
          title={getPageTitle()}
        />

        {/* Content Area - Flex container to manage scrolling independently */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {renderContent()}

          {/* Footer - Only shown in dashboard or design system view to avoid double scrollbars in results which has its own layout */}
          {currentView !== 'results' && (
            <Footer onOpenDesignSystem={() => setCurrentView('design-system')} />
          )}
        </div>
      </main>

      {/* Modals */}
      <AssessmentModal
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
        onConfirm={handleAssessmentSubmit}
      />
    </div>
  );
};

export default App;