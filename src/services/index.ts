/**
 * Services Layer - Barrel File
 * 
 * Exporta todos os serviços da aplicação.
 * Os serviços são a camada de abstração entre os componentes/stores
 * e o Supabase, substituindo os dados mockados por dados reais.
 * 
 * Uso:
 * import { profileService, atletaService } from '@/services';
 */

// Core
export { supabase } from './supabase';

// Domain Services
export { profileService } from './profile.service';
export type { Profile, ProfileUpdate } from './profile.service';

export { atletaService } from './atleta.service';
export type { AtletaComFicha, AtletaResumo, CriarAtletaInput, CriarFichaInput } from './atleta.service';

export { medidasService } from './medidas.service';
export type { CriarMedidaInput } from './medidas.service';

export { avaliacaoService } from './avaliacao.service';
export type { CriarAvaliacaoInput } from './avaliacao.service';

export { personalService } from './personal.service';
export type { PersonalComKPIs, CriarPersonalInput } from './personal.service';

export { academiaService } from './academia.service';
export type { AcademiaComKPIs, CriarAcademiaInput } from './academia.service';
