/**
 * Lazy-loaded page components for code splitting.
 * 
 * Uses React.lazy() with named export resolution pattern.
 * Each lazy component loads its chunk only when first rendered.
 */
import { lazy } from 'react';

// ═══════════════════════════════════════════════════════════
// LIBRARY PAGES (7 views, 400-600 lines each — biggest win)
// ═══════════════════════════════════════════════════════════
export const LazyLibraryView = lazy(() =>
    import('@/components/templates/Library/LibraryView').then(m => ({ default: m.LibraryView }))
);
export const LazyGoldenRatioSourceView = lazy(() =>
    import('@/components/templates/Library/GoldenRatioSourceView').then(m => ({ default: m.GoldenRatioSourceView }))
);
export const LazyMetabolismSourceView = lazy(() =>
    import('@/components/templates/Library/MetabolismSourceView').then(m => ({ default: m.MetabolismSourceView }))
);
export const LazyTrainingVolumeSourceView = lazy(() =>
    import('@/components/templates/Library/TrainingVolumeSourceView').then(m => ({ default: m.TrainingVolumeSourceView }))
);
export const LazyProteinSourceView = lazy(() =>
    import('@/components/templates/Library/ProteinSourceView').then(m => ({ default: m.ProteinSourceView }))
);
export const LazyEnergyBalanceSourceView = lazy(() =>
    import('@/components/templates/Library/EnergyBalanceSourceView').then(m => ({ default: m.EnergyBalanceSourceView }))
);
export const LazyTrainingFrequencySourceView = lazy(() =>
    import('@/components/templates/Library/TrainingFrequencySourceView').then(m => ({ default: m.TrainingFrequencySourceView }))
);
export const LazyPeriodizationSourceView = lazy(() =>
    import('@/components/templates/Library/PeriodizationSourceView').then(m => ({ default: m.PeriodizationSourceView }))
);
export const LazyFeminineProportionsSourceView = lazy(() =>
    import('@/components/templates/Library/FeminineProportionsSourceView').then(m => ({ default: m.FeminineProportionsSourceView }))
);

// ═══════════════════════════════════════════════════════════
// PERSONAL VIEWS (heavy templates, 700-1400+ lines)
// ═══════════════════════════════════════════════════════════
export const LazyDiagnosticoView = lazy(() =>
    import('@/components/templates/Personal/DiagnosticoView').then(m => ({ default: m.DiagnosticoView }))
);
export const LazyTreinoView = lazy(() =>
    import('@/components/templates/Personal/TreinoView').then(m => ({ default: m.TreinoView }))
);
export const LazyDietaView = lazy(() =>
    import('@/components/templates/Personal/DietaView').then(m => ({ default: m.DietaView }))
);
export const LazyAthleteDetailsView = lazy(() =>
    import('@/components/templates/Personal/AthleteDetailsView').then(m => ({ default: m.AthleteDetailsView }))
);
export const LazyPersonalCoachView = lazy(() =>
    import('@/components/templates/Personal/PersonalCoachView').then(m => ({ default: m.PersonalCoachView }))
);
export const LazyPersonalAssessmentView = lazy(() =>
    import('@/components/templates/Personal/PersonalAssessmentView').then(m => ({ default: m.PersonalAssessmentView }))
);
export const LazyPersonalEvolutionView = lazy(() =>
    import('@/components/templates/Personal/PersonalEvolutionView').then(m => ({ default: m.PersonalEvolutionView }))
);

// ═══════════════════════════════════════════════════════════
// STANDALONE PAGES
// ═══════════════════════════════════════════════════════════
export const LazyEvolution = lazy(() =>
    import('@/components/templates/Evolution/Evolution').then(m => ({ default: m.Evolution }))
);
export const LazyHallDosDeuses = lazy(() =>
    import('@/components/templates/HallDosDeuses/HallDosDeuses').then(m => ({ default: m.HallDosDeuses }))
);
export const LazyDesignSystem = lazy(() =>
    import('@/components/templates/DesignSystem/DesignSystem').then(m => ({ default: m.DesignSystem }))
);
export const LazyCoachIA = lazy(() =>
    import('@/components/templates/CoachIA/CoachIA').then(m => ({ default: m.CoachIA }))
);
export const LazyAssessmentResults = lazy(() =>
    import('@/components/templates/AssessmentResults/AssessmentResults').then(m => ({ default: m.AssessmentResults }))
);
export const LazyAthleteProfilePage = lazy(() =>
    import('@/components/templates/AthleteProfilePage/AthleteProfilePage').then(m => ({ default: m.AthleteProfilePage }))
);
export const LazyAthleteSettingsPage = lazy(() =>
    import('@/components/templates/AthleteSettingsPage/AthleteSettingsPage').then(m => ({ default: m.AthleteSettingsPage }))
);
export const LazyRankingPersonaisPage = lazy(() =>
    import('@/components/templates/RankingPersonais/RankingPersonaisPage').then(m => ({ default: m.RankingPersonaisPage }))
);

// ═══════════════════════════════════════════════════════════
// ACADEMY VIEWS
// ═══════════════════════════════════════════════════════════
export const LazyAcademyDashboard = lazy(() =>
    import('@/components/templates/Academy/AcademyDashboard').then(m => ({ default: m.AcademyDashboard }))
);
export const LazyAcademyPersonalsList = lazy(() =>
    import('@/components/templates/Academy/AcademyPersonalsList').then(m => ({ default: m.AcademyPersonalsList }))
);
export const LazyAcademyPersonalDetails = lazy(() =>
    import('@/components/templates/Academy/AcademyPersonalDetails').then(m => ({ default: m.AcademyPersonalDetails }))
);
export const LazyAcademyProfilePage = lazy(() =>
    import('@/components/templates/Academy/AcademyProfilePage').then(m => ({ default: m.AcademyProfilePage }))
);
export const LazyAcademyAthletesList = lazy(() =>
    import('@/components/templates/Academy/AcademyAthletesList').then(m => ({ default: m.AcademyAthletesList }))
);
export const LazyAcademyAthleteDetails = lazy(() =>
    import('@/components/templates/Academy/AcademyAthleteDetails').then(m => ({ default: m.AcademyAthleteDetails }))
);

// ═══════════════════════════════════════════════════════════
// PAGES
// ═══════════════════════════════════════════════════════════
export const LazyAthletePortal = lazy(() =>
    import('@/pages/AthletePortal').then(m => ({ default: m.AthletePortal }))
);
export const LazyPortalLanding = lazy(() =>
    import('@/pages/athlete/PortalLanding').then(m => ({ default: m.PortalLanding }))
);
export const LazyNotificationsPage = lazy(() =>
    import('@/pages/NotificationsPage').then(m => ({ default: m.NotificationsPage }))
);
export const LazyNotificationSettingsPage = lazy(() =>
    import('@/pages/NotificationSettingsPage').then(m => ({ default: m.NotificationSettingsPage }))
);
export const LazyBibliotecaExerciciosPage = lazy(() =>
    import('@/pages/BibliotecaExerciciosPage').then(m => ({ default: m.BibliotecaExerciciosPage }))
);
