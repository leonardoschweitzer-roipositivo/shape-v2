/**
 * Cálculos Classic Physique - SHAPE-V
 * 
 * Funções de cálculo de proporções ideais baseadas em Chris Bumstead.
 * Referência: Chris Bumstead (6x Mr. Olympia Classic Physique)
 * 
 * @see docs/specs/calculo-proporcoes.md v2.0
 */

import { CLASSIC_PHYSIQUE } from './constants'
import { getPesoMaximoClassic } from './utils'
import type { UserMeasurements, ProportionIdeals } from '../../types/proportions'

/**
 * Calcula as medidas ideais baseado no Classic Physique (CBum)
 * Fórmula: Braço = (Altura / 185) × 50cm
 * @pure - Função pura, sem side effects
 */
export function calcularIdeaisClassicPhysique(medidas: UserMeasurements): ProportionIdeals {
    const { altura, punho, cintura } = medidas

    // Fator de escala baseado na altura do CBum
    const fatorAltura = altura / CLASSIC_PHYSIQUE.CBUM_ALTURA
    const bracoIdeal = fatorAltura * CLASSIC_PHYSIQUE.CBUM_BRACO

    return {
        ombros: cintura * CLASSIC_PHYSIQUE.OMBROS_CINTURA,
        peito: punho * CLASSIC_PHYSIQUE.PEITO_PUNHO,
        braco: bracoIdeal,
        antebraco: bracoIdeal * CLASSIC_PHYSIQUE.ANTEBRACO_BRACO,
        cintura: altura * CLASSIC_PHYSIQUE.CINTURA_ALTURA,
        coxa: cintura * CLASSIC_PHYSIQUE.COXA_CINTURA,
        panturrilha: bracoIdeal * CLASSIC_PHYSIQUE.PANTURRILHA_BRACO,
        pescoco: bracoIdeal * CLASSIC_PHYSIQUE.PESCOCO_BRACO,
        triade: {
            valor_ideal: bracoIdeal,
            regra: 'Braço ≈ Panturrilha ≈ Pescoço',
        },
        peso_maximo: getPesoMaximoClassic(altura),
    }
}

/**
 * Retorna os pesos de score para o método Classic Physique
 */
export function getClassicPhysiqueWeights() {
    return {
        ombros: 20,
        peito: 15,
        braco: 18,
        antebraco: 4,
        cintura: 18,
        coxa: 10,
        panturrilha: 7,
        pescoco: 3,
        triade: 5,
    }
}
