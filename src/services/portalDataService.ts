/**
 * Portal Data Service — Barrel re-exports
 *
 * Mantém compatibilidade total com imports existentes:
 * import { carregarContextoPortal, montarDadosHoje, ... } from '@/services/portalDataService'
 */

// Types
export type {
    SupaAtleta, SupaPersonal, SupaFicha, SupaRegistroDiario,
    SupaDiagnostico, SupaPlanoTreino, SupaPlanoDieta,
    AssessmentResults, SupaAssessment, SupaChatMessage, SupaMedida,
    PortalContext,
} from './portal/portalTypes';

// Context
export { carregarContextoPortal } from './portal/portalContext';

// Tela HOJE
export {
    derivarTreinoDoDia, derivarProximoTreino, derivarDietaDoDia,
    buscarRegistrosDoDia, gerarDicaCoach, montarDadosHoje,
} from './portal/portalHoje';
export type { ProximoTreino } from './portal/portalHoje';

// Tela PROGRESSO
export {
    buscarScoreGeral, buscarGraficoEvolucao, buscarProporcoes,
    buscarHistoricoAvaliacoes, buscarDadosAvaliacao,
    getClassificacaoLabel, getClassificacaoEmoji,
} from './portal/portalProgresso';
export type { AvaliacaoDadosResult } from './portal/portalProgresso';

// Coach / Chat
export { buscarMensagensChat, salvarMensagemChat } from './portal/portalCoach';

// Trackers
export { registrarTracker, completarTreino, pularTreino } from './portal/portalTrackers';

// Perfil
export { extrairDadosBasicos, buscarDadosPersonal } from './portal/portalPerfil';
