/**
 * Constantes de Proporções Corporais - VITRU IA
 * 
 * Constantes centralizadas para todos os métodos de cálculo.
 * @see docs/specs/calculo-proporcoes.md v2.0
 */

// ============================================================================
// GOLDEN RATIO (Steve Reeves / John McCallum)
// ============================================================================

export const GOLDEN_RATIO = {
    /** Proporção Áurea (PHI) */
    PHI: 1.618,

    /** Peitoral = Punho × 6.5 */
    PEITO_PUNHO: 6.5,

    /** Braço = Punho × 2.52 */
    BRACO_PUNHO: 2.52,

    /** Antebraço = Braço × 0.80 */
    ANTEBRACO_BRACO: 0.80,

    /** Antebraço = Peito × 0.29 (alternativo) */
    ANTEBRACO_PEITO: 0.29,

    /** Cintura = Pelve × 0.86 */
    CINTURA_PELVIS: 0.86,

    /** Coxa = Joelho × 1.75 */
    COXA_JOELHO: 1.75,

    /** Coxa = Panturrilha × 1.5 */
    COXA_PANTURRILHA: 1.5,

    /** Panturrilha = Tornozelo × 1.92 */
    PANTURRILHA_TORNOZELO: 1.92,

    /** Pescoço = Cabeça × 0.79 */
    PESCOCO_CABECA: 0.79,
} as const

// ============================================================================
// CLASSIC PHYSIQUE (Chris Bumstead)
// ============================================================================

export const CLASSIC_PHYSIQUE = {
    /** Ombros = Cintura × 1.70 (V-Taper mais agressivo) */
    OMBROS_CINTURA: 1.70,

    /** Peitoral = Punho × 7.0 */
    PEITO_PUNHO: 7.0,

    /** Cintura = Altura × 0.42 (super apertada) */
    CINTURA_ALTURA: 0.42,

    /** Coxa = Cintura × 0.97 */
    COXA_CINTURA: 0.97,

    /** Panturrilha = Braço × 0.96 */
    PANTURRILHA_BRACO: 0.96,

    /** Antebraço = Braço × 0.80 */
    ANTEBRACO_BRACO: 0.80,

    /** Pescoço ≈ Braço (Tríade) */
    PESCOCO_BRACO: 1.0,

    /** Altura do CBum (referência) */
    CBUM_ALTURA: 185,

    /** Braço do CBum em cm (referência) */
    CBUM_BRACO: 50,
} as const

// ============================================================================
// MEN'S PHYSIQUE (Ryan Terry)
// ============================================================================

export const MENS_PHYSIQUE = {
    /** Ombros = Cintura × 1.55 (V-Taper mais suave) */
    OMBROS_CINTURA: 1.55,

    /** Peitoral = Punho × 6.2 */
    PEITO_PUNHO: 6.2,

    /** Cintura = Altura × 0.455 (menos extrema) */
    CINTURA_ALTURA: 0.455,

    /** Antebraço = Punho × 1.6 */
    ANTEBRACO_PUNHO: 1.6,

    /** Antebraço = Braço × 0.80 */
    ANTEBRACO_BRACO: 0.80,

    /** Panturrilha = Tornozelo × 1.8 (estética geral) */
    PANTURRILHA_TORNOZELO: 1.8,

    /** Pescoço = Braço × 0.9 */
    PESCOCO_BRACO: 0.9,

    /** Altura do Ryan Terry (referência) */
    RYAN_ALTURA: 178,

    /** Braço do Ryan Terry em cm (referência) */
    RYAN_BRACO: 43,
} as const

// ============================================================================
// TABELA DE PESO IFBB PRO CLASSIC PHYSIQUE
// ============================================================================

/**
 * Limites de peso máximo por altura (cm) - IFBB Pro Classic Physique
 * Fonte: IFBB Pro League 2024
 */
export const CLASSIC_WEIGHT_LIMITS: Record<number, number> = {
    162.6: 80.3,
    165.1: 82.6,
    167.6: 84.8,
    170.2: 87.1,
    172.7: 89.4,
    175.3: 91.6,
    177.8: 93.9,
    180.3: 97.5,
    182.9: 100.7,
    185.4: 104.3,
    188.0: 108.9,
    190.5: 112.0,
    193.0: 115.2,
} as const

// ============================================================================
// PESOS DE SCORE POR MÉTODO
// ============================================================================

export const SCORE_WEIGHTS = {
    golden_ratio: {
        ombros: 20,
        peito: 15,
        braco: 15,
        antebraco: 5,
        cintura: 15,
        coxa: 10,
        panturrilha: 8,
        pescoco: 5,
        triade: 7,
    },
    classic_physique: {
        ombros: 20,
        peito: 15,
        braco: 18,
        antebraco: 4,
        cintura: 18,
        coxa: 10,
        panturrilha: 7,
        pescoco: 3,
        triade: 5,
    },
    mens_physique: {
        ombros: 25,
        peito: 20,
        braco: 25,
        antebraco: 5,
        cintura: 15,
        coxa: 0,      // Não julgada
        panturrilha: 5,
        pescoco: 5,
        triade: 0,    // Não aplicável
    },
} as const

// ============================================================================
// CLASSIFICAÇÕES DE SCORE
// ============================================================================

export const SCORE_CLASSIFICATIONS = {
    ELITE: { min: 95, emoji: '🏆', descricao: 'Proporções excepcionais' },
    AVANCADO: { min: 85, emoji: '🥇', descricao: 'Muito acima da média' },
    INTERMEDIARIO: { min: 75, emoji: '🥈', descricao: 'Boas proporções' },
    INICIANTE: { min: 60, emoji: '💪', descricao: 'Em desenvolvimento' },
    DESENVOLVENDO: { min: 0, emoji: '🚀', descricao: 'Início da jornada' },
} as const

// ============================================================================
// TYPES
// ============================================================================

export type ComparisonMethod = 'golden_ratio' | 'classic_physique' | 'mens_physique'
