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

    /** Cintura = Pelve × 0.86 */
    CINTURA_PELVIS: 0.86,

    /** Coxa = Joelho × 1.75 */
    COXA_JOELHO: 1.75,

    /** Coxa = Panturrilha × 1.5 */
    COXA_PANTURRILHA: 1.5,

    /** Panturrilha = Tornozelo × 1.92 */
    PANTURRILHA_TORNOZELO: 1.92,

    /** BF Ideal */
    BF_MIN: 8,
    BF_MAX: 12,
    BF_IDEAL: 10,
} as const;

// ============================================================================
// CLASSIC PHYSIQUE (Chris Bumstead)
// ============================================================================

export const CLASSIC_PHYSIQUE = {
    /** Ombros = Cintura × 1.70 (V-Taper mais agressivo) */
    OMBROS_CINTURA: 1.70,

    /** Peitoral = Punho × 7.0 */
    PEITO_PUNHO: 7.0,

    /** Braço = Punho × 2.70 */
    BRACO_PUNHO: 2.70,

    /** Cintura = Altura × 0.42 (super apertada) */
    CINTURA_ALTURA: 0.42,

    /** Coxa = Joelho × 1.85 */
    COXA_JOELHO: 1.85,

    /** Panturrilha = Braço × 0.96 */
    PANTURRILHA_BRACO: 0.96,

    /** Antebraço = Braço × 0.80 */
    ANTEBRACO_BRACO: 0.80,

    /** Proporção Coxa/Panturrilha = 1.5 */
    COXA_PANTURRILHA: 1.5,

    /** Costas = Cintura × 1.6 */
    COSTAS_CINTURA: 1.6,

    /** Altura do CBum (referência) */
    CBUM_ALTURA: 185,

    /** Braço do CBum em cm (referência) */
    CBUM_BRACO: 50,

    /** BF Ideal */
    BF_MIN: 3,
    BF_MAX: 6,
    BF_IDEAL: 4,
} as const;

// ============================================================================
// MEN'S PHYSIQUE (Ryan Terry)
// ============================================================================

export const MENS_PHYSIQUE = {
    /** Ombros = Cintura × 1.55 (V-Taper mais suave) */
    OMBROS_CINTURA: 1.55,

    /** Peitoral = Punho × 6.2 */
    PEITO_PUNHO: 6.2,

    /** Braço = Punho × 2.40 */
    BRACO_PUNHO: 2.40,

    /** Cintura = Altura × 0.455 (menos extrema) */
    CINTURA_ALTURA: 0.455,

    /** Antebraço = Braço × 0.80 */
    ANTEBRACO_BRACO: 0.80,

    /** Panturrilha = Tornozelo × 1.8 (estética geral) */
    PANTURRILHA_TORNOZELO: 1.8,

    /** Costas = Cintura × 1.5 */
    COSTAS_CINTURA: 1.5,

    /** Altura do Ryan Terry (referência) */
    RYAN_ALTURA: 178,

    /** Braço do Ryan Terry em cm (referência) */
    RYAN_BRACO: 43,

    /** BF Ideal */
    BF_MIN: 5,
    BF_MAX: 8,
    BF_IDEAL: 6,
} as const;

// ============================================================================
// OPEN BODYBUILDING (Derek Lunsford) - NOVO v3.0
// ============================================================================

export const OPEN_BODYBUILDING = {
    /** Ombros = Cintura × 1.75 (V-Taper Extremo) */
    OMBROS_CINTURA: 1.75,

    /** Peitoral = Punho × 7.5 */
    PEITO_PUNHO: 7.5,

    /** Braço = Punho × 3.11 */
    BRACO_PUNHO: 3.11,

    /** Cintura = Altura × 0.44 */
    CINTURA_ALTURA: 0.44,

    /** Coxa = Joelho × 1.85 */
    COXA_JOELHO: 1.85,

    /** Panturrilha = Braço × 0.98 */
    PANTURRILHA_BRACO: 0.98,

    /** Antebraço = Braço × 0.78 */
    ANTEBRACO_BRACO: 0.78,

    /** Proporção Coxa/Panturrilha = 1.55 */
    COXA_PANTURRILHA: 1.55,

    /** Costas = Cintura × 1.7 */
    COSTAS_CINTURA: 1.7,

    /** Altura do Derek Lunsford (referência) */
    DEREK_ALTURA: 166,

    /** Braço do Derek Lunsford em cm (referência) */
    DEREK_BRACO: 56,

    /** BF Ideal */
    BF_MIN: 2,
    BF_MAX: 5,
    BF_IDEAL: 3,
} as const;

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
} as const;

// ============================================================================
// PESOS DE SCORE POR MÉTODO (SPEC v3.0 - Seção 4.2)
// ============================================================================

export const SCORE_WEIGHTS = {
    golden_ratio: {
        ombros: 18,
        peito: 14,
        braco: 14,
        antebraco: 5,
        triade: 10,
        cintura: 12,
        coxa: 10,
        coxa_panturrilha: 8,
        panturrilha: 9,
        costas: 0,
    },
    classic_physique: {
        ombros: 18,
        peito: 14,
        braco: 16,
        antebraco: 4,
        triade: 8,
        cintura: 16,
        coxa: 10,
        coxa_panturrilha: 6,
        panturrilha: 8,
        costas: 0,
    },
    mens_physique: {
        ombros: 25,
        peito: 22,
        braco: 25,
        antebraco: 6,
        triade: 0,
        cintura: 17,
        coxa: 0,
        coxa_panturrilha: 0,
        panturrilha: 5,
        costas: 0,
    },
    open_bodybuilding: {
        ombros: 16,
        peito: 14,
        braco: 14,
        antebraco: 4,
        triade: 6,
        cintura: 12,
        coxa: 14,
        coxa_panturrilha: 8,
        panturrilha: 8,
        costas: 4,
    },
} as const;

// ============================================================================
// CLASSIFICAÇÕES DE SCORE
// ============================================================================

export const SCORE_CLASSIFICATIONS = {
    ELITE: { min: 95, emoji: '🏆', descricao: 'Proporções excepcionais' },
    AVANCADO: { min: 85, emoji: '🥇', descricao: 'Muito acima da média' },
    INTERMEDIARIO: { min: 75, emoji: '🥈', descricao: 'Boas proporções' },
    INICIANTE: { min: 60, emoji: '💪', descricao: 'Em desenvolvimento' },
    DESENVOLVENDO: { min: 0, emoji: '🚀', descricao: 'Início da jornada' },
} as const;

// ============================================================================
// TYPES
// ============================================================================

export type ComparisonMethod = 'golden_ratio' | 'classic_physique' | 'mens_physique' | 'open_bodybuilding';

