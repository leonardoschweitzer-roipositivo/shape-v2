/**
 * Cálculos Golden Ratio - VITRU IA
 * 
 * Funções de cálculo de proporções ideais baseadas no Golden Ratio.
 * Referências: Steve Reeves, John McCallum
 * 
 * @see docs/specs/calculo-proporcoes.md v2.0
 */

import { GOLDEN_RATIO, SCORE_WEIGHTS } from './constants'
import type { UserMeasurements, ProportionIdeals } from '@/types/proportions'

/**
 * Calcula as medidas ideais baseado no Golden Ratio (1.618)
 * @pure - Função pura, sem side effects
 */
export function calcularIdeaisGoldenRatio(medidas: UserMeasurements): ProportionIdeals {
    const { cintura, punho, pelvis, joelho, tornozelo } = medidas

    const peitoIdeal = punho * GOLDEN_RATIO.PEITO_PUNHO
    const bracoIdeal = punho * GOLDEN_RATIO.BRACO_PUNHO
    const panturrilhaIdeal = tornozelo * GOLDEN_RATIO.PANTURRILHA_TORNOZELO

    return {
        ombros: cintura * GOLDEN_RATIO.PHI,
        peito: peitoIdeal,
        braco: bracoIdeal,
        antebraco: bracoIdeal * GOLDEN_RATIO.ANTEBRACO_BRACO,
        cintura: pelvis * GOLDEN_RATIO.CINTURA_PELVIS,
        coxa: joelho * GOLDEN_RATIO.COXA_JOELHO,
        panturrilha: panturrilhaIdeal,
        pescoco: bracoIdeal, // Em Golden Ratio, pescoço = braço
        costas: undefined, // N/A em Golden Ratio clássico
        triade: {
            valor_ideal: bracoIdeal,
            regra: 'Pescoço = Braço = Panturrilha',
        },
        coxa_panturrilha: {
            coxa_ideal: panturrilhaIdeal * GOLDEN_RATIO.COXA_PANTURRILHA,
            panturrilha_ref: panturrilhaIdeal,
            ratio: GOLDEN_RATIO.COXA_PANTURRILHA,
        },
    }
}

/**
 * Retorna os pesos de score para o método Golden Ratio
 */
export function getGoldenRatioWeights() {
    return SCORE_WEIGHTS.golden_ratio;
}

