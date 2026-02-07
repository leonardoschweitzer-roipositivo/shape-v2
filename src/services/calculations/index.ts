/**
 * Services de Cálculo - VITRU IA
 * 
 * Exportação centralizada de todas as funções de cálculo de proporções.
 * 
 * @example
 * import { 
 *   GOLDEN_RATIO, 
 *   calcularIdeaisGoldenRatio,
 *   calcularScoreProporcional 
 * } from '@/services/calculations'
 */

// Constantes
export {
    GOLDEN_RATIO,
    CLASSIC_PHYSIQUE,
    MENS_PHYSIQUE,
    CLASSIC_WEIGHT_LIMITS,
    SCORE_WEIGHTS,
    SCORE_CLASSIFICATIONS,
} from './constants'
export type { ComparisonMethod } from './constants'

// Funções utilitárias
export {
    calcularScoreProporcional,
    calcularScoreInverso,
    calcularScoreTriade,
    interpolate,
    getPesoMaximoClassic,
    getClassificacao,
    getStatusLabel,
    formatDifference,
    calcularDiferenca,
} from './utils'

// Golden Ratio
export {
    calcularIdeaisGoldenRatio,
    getGoldenRatioWeights,
} from './goldenRatio'

// Classic Physique (CBum)
export {
    calcularIdeaisClassicPhysique,
    getClassicPhysiqueWeights,
} from './classicPhysique'

// Men's Physique (Ryan Terry)
export {
    calcularIdeaisMensPhysique,
    getMensPhysiqueWeights,
    getMensPhysiqueNotes,
} from './mensPhysique'
