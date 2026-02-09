/**
 * Cálculos Open Bodybuilding - VITRU IA
 * 
 * Funções de cálculo de proporções ideais baseadas no Open Bodybuilding.
 * Referência: Derek Lunsford (Mr. Olympia 2024)
 * 
 * @see docs/specs/proporcoes-masculinas.md v3.0
 */

import { OPEN_BODYBUILDING, SCORE_WEIGHTS } from './constants';
import type { UserMeasurements, ProportionIdeals } from '@/types/proportions';

/**
 * Calcula as medidas ideais baseado no Open Bodybuilding
 * @pure - Função pura, sem side effects
 */
export function calcularIdeaisOpenBodybuilding(medidas: UserMeasurements): ProportionIdeals {
    const { altura, punho, cintura, joelho, peso } = medidas;

    // Fator de escala baseado na altura vs Derek Lunsford
    const fatorAltura = altura / OPEN_BODYBUILDING.DEREK_ALTURA;

    // Braço ideal escalado (56cm é a ref do Derek)
    const braco_ideal = fatorAltura * OPEN_BODYBUILDING.DEREK_BRACO;

    // Panturrilha baseada no braço
    const panturrilha_ideal = braco_ideal * OPEN_BODYBUILDING.PANTURRILHA_BRACO;

    return {
        // 1. OMBROS: 1.75 × Cintura (V-Taper Extremo)
        ombros: cintura * OPEN_BODYBUILDING.OMBROS_CINTURA,

        // 2. PEITORAL: 7.5 × Punho
        peito: punho * OPEN_BODYBUILDING.PEITO_PUNHO,

        // 3. BRAÇO: Escalado do Derek
        braco: braco_ideal,

        // 4. ANTEBRAÇO: 78% do Braço
        antebraco: braco_ideal * OPEN_BODYBUILDING.ANTEBRACO_BRACO,

        // 5. TRÍADE: Harmonia
        triade: {
            valor_ideal: braco_ideal,
            regra: 'Pescoço ≈ Braço ≈ Panturrilha (Massa Extrema)',
        },

        // 6. CINTURA: 0.44 × Altura
        cintura: altura * OPEN_BODYBUILDING.CINTURA_ALTURA,

        // 7. COXA: 1.85 × Joelho
        coxa: joelho * OPEN_BODYBUILDING.COXA_JOELHO,

        // 8. COXA/PANTURRILHA: 1.55:1
        coxa_panturrilha: {
            coxa_ideal: panturrilha_ideal * OPEN_BODYBUILDING.COXA_PANTURRILHA,
            panturrilha_ref: panturrilha_ideal,
            ratio: OPEN_BODYBUILDING.COXA_PANTURRILHA,
        },

        // 9. PANTURRILHA: 0.98 × Braço
        panturrilha: panturrilha_ideal,

        // 10. COSTAS: 1.7 × Cintura
        costas: cintura * OPEN_BODYBUILDING.COSTAS_CINTURA,

        // Pescoço (Tríade)
        pescoco: braco_ideal,
    };
}

/**
 * Retorna os pesos de score para o método Open Bodybuilding
 */
export function getOpenBodybuildingWeights() {
    return SCORE_WEIGHTS.open_bodybuilding;
}
