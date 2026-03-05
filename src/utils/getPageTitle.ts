/**
 * getPageTitle — Maps view state to page title
 * Extracted from App.tsx for maintainability
 */
import type { ProfileType } from '@/components/organisms/ProfileSelector/ProfileSelector';

export type ViewState = 'dashboard' | 'results' | 'design-system' | 'evolution' | 'hall' | 'coach' | 'profile' | 'settings' | 'assessment' | 'trainers' | 'students' | 'trainers-ranking' | 'student-registration' | 'athlete-details' | 'terms' | 'privacy' | 'my-record' | 'gamification' | 'athlete-portal' | 'personal-details' | 'student-details' | 'diagnostico' | 'treino-plano' | 'dieta-plano' | 'consulta-diagnostico' | 'consulta-treino' | 'consulta-dieta' | 'library' | 'library-golden-ratio' | 'library-metabolism' | 'library-training-volume' | 'library-protein' | 'library-energy-balance' | 'library-training-frequency' | 'library-periodization' | 'library-feminine-proportions' | 'notifications' | 'notification-settings' | 'exercicios-biblioteca';

export function getPageTitle(currentView: ViewState, userProfile: ProfileType): string {
    if (currentView === 'terms') return 'TERMOS DE USO';
    if (currentView === 'privacy') return 'POLÍTICA DE PRIVACIDADE';
    if (currentView === 'library') return 'BIBLIOTECA CIENTÍFICA';
    if (currentView === 'library-golden-ratio') return 'FONTE: PROPORÇÕES ÁUREAS';
    if (currentView === 'library-metabolism') return 'FONTE: METABOLISMO E GASTO ENERGÉTICO';
    if (currentView === 'library-training-volume') return 'FONTE: VOLUME DE TREINO';
    if (currentView === 'library-protein') return 'FONTE: PROTEÍNA PARA HIPERTROFIA';
    if (currentView === 'library-energy-balance') return 'FONTE: DÉFICIT E SUPERÁVIT CALÓRICO';
    if (currentView === 'library-training-frequency') return 'FONTE: FREQUÊNCIA DE TREINO';
    if (currentView === 'library-periodization') return 'FONTE: PERIODIZAÇÃO DE TREINO';
    if (currentView === 'library-feminine-proportions') return 'FONTE: PROPORÇÕES CORPORAIS FEMININAS';
    if (currentView === 'exercicios-biblioteca') return 'BIBLIOTECA DE EXERCÍCIOS';

    if (userProfile === 'academia') {
        switch (currentView) {
            case 'dashboard': return 'DASHBOARD ACADEMIA';
            case 'trainers': return 'PERSONAIS DA ACADEMIA';
            case 'personal-details': return 'DETALHES DO PERSONAL';
            case 'students': return 'TODOS OS ALUNOS';
            case 'student-details': return 'DETALHES DO ALUNO';
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
            case 'coach': return 'VITRÚVIO IA';
            case 'diagnostico': return 'DIAGNÓSTICO — PLANO DE EVOLUÇÃO';
            case 'treino-plano': return 'PLANO DE TREINO — PLANO DE EVOLUÇÃO';
            case 'hall': return 'HALL DOS DEUSES';
            case 'results': return 'RESULTADOS DA AVALIAÇÃO IA';
            case 'design-system': return 'DESIGN SYSTEM';
            case 'trainers-ranking': return 'RANKING PERSONAIS';
            case 'profile': return 'MEU PERFIL';
            case 'settings': return 'CONFIGURAÇÕES';
            case 'student-registration': return 'CADASTRO DE ALUNO';
            case 'athlete-details': return 'DETALHES DO ATLETA';
            case 'notifications': return 'NOTIFICAÇÕES';
            case 'notification-settings': return 'CONFIGURAR NOTIFICAÇÕES';
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
