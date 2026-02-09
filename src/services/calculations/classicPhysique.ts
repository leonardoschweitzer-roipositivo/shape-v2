/**
 * Cálculos Classic Physique - VITRU IA
 * 
 * Funções de cálculo de proporções ideais baseadas em Chris Bumstead.
 * Referência: Chris Bumstead (6x Mr. Olympia Classic Physique)
 * 
 * @see docs/specs/calculo-proporcoes.md v2.0
 */

import { CLASSIC_PHYSIQUE, SCORE_WEIGHTS } from './constants'
import { getPesoMaximoClassic } from './utils'
import type { UserMeasurements, ProportionIdeals } from '@/types/proportions'

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
    const panturrilhaIdeal = bracoIdeal * CLASSIC_PHYSIQUE.PANTURRILHA_BRACO

    return {
        ombros: cintura * CLASSIC_PHYSIQUE.OMBROS_CINTURA,
        peito: punho * CLASSIC_PHYSIQUE.PEITO_PUNHO,
        braco: bracoIdeal,
        antebraco: bracoIdeal * CLASSIC_PHYSIQUE.ANTEBRACO_BRACO,
        cintura: altura * CLASSIC_PHYSIQUE.CINTURA_ALTURA,
        coxa: (altura * CLASSIC_PHYSIQUE.CINTURA_ALTURA) * CLASSIC_PHYSIQUE.COXA_CINTURA,
        panturrilha: panturrilhaIdeal,
        pescoco: bracoIdeal,
        costas: cintura * CLASSIC_PHYSIQUE.COSTAS_CINTURA,
        triade: {
            valor_ideal: bracoIdeal,
            regra: 'Pescoço ≈ Braço ≈ Panturrilha (Harmonia)',
        },
        coxa_panturrilha: {
            coxa_ideal: panturrilhaIdeal * CLASSIC_PHYSIQUE.COXA_PANTURRILHA,
            panturrilha_ref: panturrilhaIdeal,
            ratio: CLASSIC_PHYSIQUE.COXA_PANTURRILHA,
        },
        peso_maximo: getPesoMaximoClassic(altura),
    }
}

/**
 * Retorna os pesos de score para o método Classic Physique
 */
export function getClassicPhysiqueWeights() {
    return SCORE_WEIGHTS.classic_physique;
}

