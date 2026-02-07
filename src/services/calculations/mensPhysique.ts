/**
 * Cálculos Men's Physique - SHAPE-V
 * 
 * Funções de cálculo de proporções ideais baseadas em Ryan Terry.
 * Referência: Ryan Terry (3x Mr. Olympia Men's Physique)
 * 
 * @see docs/specs/calculo-proporcoes.md v2.0
 */

import { MENS_PHYSIQUE } from './constants'
import type { UserMeasurements, ProportionIdeals } from '../../types/proportions'

/**
 * Calcula as medidas ideais baseado no Men's Physique (Ryan Terry)
 * Fórmula: Braço = (Altura / 178) × 43cm
 * 
 * Nota: Coxa e Tríade são N/A nesta categoria (board shorts)
 * 
 * @pure - Função pura, sem side effects
 */
export function calcularIdeaisMensPhysique(medidas: UserMeasurements): ProportionIdeals {
    const { altura, punho, cintura, tornozelo } = medidas

    // Fator de escala baseado na altura do Ryan Terry
    const fatorAltura = altura / MENS_PHYSIQUE.RYAN_ALTURA
    const bracoIdeal = fatorAltura * MENS_PHYSIQUE.RYAN_BRACO

    return {
        ombros: cintura * MENS_PHYSIQUE.OMBROS_CINTURA,
        peito: punho * MENS_PHYSIQUE.PEITO_PUNHO,
        braco: bracoIdeal,
        antebraco: punho * MENS_PHYSIQUE.ANTEBRACO_PUNHO,
        cintura: altura * MENS_PHYSIQUE.CINTURA_ALTURA,
        coxa: null, // N/A - Não julgada na categoria Men's Physique
        panturrilha: tornozelo * MENS_PHYSIQUE.PANTURRILHA_TORNOZELO,
        pescoco: bracoIdeal * MENS_PHYSIQUE.PESCOCO_BRACO,
        // Tríade não é aplicável em Men's Physique
    }
}

/**
 * Retorna os pesos de score para o método Men's Physique
 * Nota: coxa e triade têm peso 0 (não julgadas)
 */
export function getMensPhysiqueWeights() {
    return {
        ombros: 25,
        peito: 20,
        braco: 25,
        antebraco: 5,
        cintura: 15,
        coxa: 0,        // Não julgada
        panturrilha: 5,
        pescoco: 5,
        triade: 0,      // Não aplicável
    }
}

/**
 * Retorna as notas específicas para Men's Physique
 */
export function getMensPhysiqueNotes() {
    return {
        coxa: 'Não julgada - usa board shorts',
        panturrilha: 'Estética geral, menos ênfase',
        triade: 'Não aplicável - foco em upper body',
        foco: 'Deltoides, braços e V-taper moderado',
    }
}
