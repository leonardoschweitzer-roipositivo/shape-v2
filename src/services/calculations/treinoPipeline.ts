/**
 * Pipeline de enriquecimento por IA do plano de treino (usado pelo Plano de Evolução e pelo
 * onboarding VITRU IA do aluno).
 *
 * Ordem importa: 1) a IA escolhe/ajusta os exercícios respeitando as diretrizes do personal;
 * 2) a prescrição série-a-série é feita sobre os exercícios escolhidos. Cada etapa recebe uma
 * cópia profunda e, se falhar, o pipeline segue com o resultado da etapa anterior.
 */
import { enriquecerTreinoComIA, type PlanoTreino } from './treino';
import { enriquecerPrescricaoComIA } from '@/services/prescricao/enriquecer';
import type { PerfilAtletaIA } from '@/services/vitruviusContext';

export async function enriquecerPlanoTreinoCompleto(
    plano: PlanoTreino,
    perfil: PerfilAtletaIA,
    diretrizes?: string
): Promise<PlanoTreino> {
    const comExercicios = await enriquecerTreinoComIA(structuredClone(plano), perfil, diretrizes).catch(err => {
        console.error('[TreinoPipeline] ❌ Erro na escolha de exercícios (IA):', err);
        return plano;
    });

    return enriquecerPrescricaoComIA(structuredClone(comExercicios)).catch(err => {
        console.error('[TreinoPipeline] ❌ Erro na prescrição (IA):', err);
        return comExercicios;
    });
}
