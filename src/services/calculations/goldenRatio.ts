/**
 * Cálculos Golden Ratio - VITRU IA
 * 
 * Funções de cálculo de proporções ideais baseadas no Golden Ratio.
 * Referências: Steve Reeves, John McCallum
 * 
 * @see docs/specs/calculo-proporcoes.md v2.0
 */

import { GOLDEN_RATIO } from './constants'
import type { UserMeasurements, ProportionIdeals } from '../../types/proportions'

/**
 * Calcula as medidas ideais baseado no Golden Ratio (1.618)
 * @pure - Função pura, sem side effects
 */
export function calcularIdeaisGoldenRatio(medidas: UserMeasurements): ProportionIdeals {
    const { cintura, punho, pelvis, joelho, tornozelo, cabeca } = medidas

    const peitoIdeal = punho * GOLDEN_RATIO.PEITO_PUNHO
    const bracoIdeal = punho * GOLDEN_RATIO.BRACO_PUNHO

    return {
        ombros: cintura * GOLDEN_RATIO.PHI,
        peito: peitoIdeal,
        braco: bracoIdeal,
        antebraco: bracoIdeal * GOLDEN_RATIO.ANTEBRACO_BRACO,
        cintura: pelvis * GOLDEN_RATIO.CINTURA_PELVIS,
        coxa: joelho * GOLDEN_RATIO.COXA_JOELHO,
        panturrilha: tornozelo * GOLDEN_RATIO.PANTURRILHA_TORNOZELO,
        pescoco: cabeca * GOLDEN_RATIO.PESCOCO_CABECA,
        triade: {
            valor_ideal: bracoIdeal,
            regra: 'Braço, Panturrilha e Pescoço devem ser iguais',
        },
    }
}

/**
 * Retorna os pesos de score para o método Golden Ratio
 */
export function getGoldenRatioWeights() {
    return {
        ombros: 20,
        peito: 15,
        braco: 15,
        antebraco: 5,
        cintura: 15,
        coxa: 10,
        panturrilha: 8,
        pescoco: 5,
        triade: 7,
    }
}
