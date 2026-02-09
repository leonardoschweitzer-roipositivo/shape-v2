import { Measurements, IdealMeasurements } from '@/components/templates/AssessmentResults/types';

// ============================================
// CONSTANTES & CONFIGURAÇÕES
// ============================================

export const FEMALE_GOLDEN_RATIO = {
    // Razões principais
    WHR: 0.70,                    // Waist-to-Hip (MAIS IMPORTANTE)
    WCR: 0.70,                    // Waist-to-Chest  
    SHR: 0.95,                    // Shoulder-to-Hip
    SWR: 1.40,                    // Shoulder-to-Waist
    HOURGLASS_INDEX: 1.45,        // (Busto + Quadril) / (2 × Cintura)

    // Proporções de membros
    COXA_JOELHO: 1.60,            // Multiplicador coxa (menor que masculino)
    PANTURRILHA_TORNOZELO: 1.80,  // Multiplicador panturrilha
    BRACO_PUNHO: 2.20,            // Multiplicador braço (menor que masculino)
    ANTEBRACO_BRACO: 0.78,        // Proporção antebraço/braço

    // Proporções corporais
    BUSTO_QUADRIL: 0.97,          // Busto quase igual ao quadril
    OMBROS_QUADRIL: 0.95,         // Ombros levemente menores que quadril
    CINTURA_ALTURA: 0.38,         // Cintura ideal = 38% da altura

    // Gordura corporal
    BF_MIN: 18,
    BF_MAX: 23,
    BF_IDEAL: 20,
};

export const BIKINI_CONSTANTS = {
    name: 'Bikini',
    // Razões alvo
    WHR_TARGET: 0.68,           // Cintura/Quadril (mais apertada)
    WCR_TARGET: 0.70,           // Cintura/Busto
    SHR_TARGET: 0.95,           // Ombros/Quadril (quase iguais)
    SWR_TARGET: 1.45,           // Ombros/Cintura
    HOURGLASS_TARGET: 1.47,     // (Busto+Quadril)/(2×Cintura)
    reference: { height: 163 }
};

export const WELLNESS_CONSTANTS = {
    name: 'Wellness',
    // Razões alvo (WHR mais baixo = quadril maior)
    WHR_TARGET: 0.62,           // Cintura/Quadril MENOR (quadril dominante)
    WCR_TARGET: 0.72,           // Cintura/Busto
    SHR_TARGET: 0.85,           // Ombros/Quadril (ombros menores que quadril)
    SWR_TARGET: 1.35,           // Ombros/Cintura (V-Taper suave)
    HOURGLASS_TARGET: 1.55,     // Índice ampulheta MAIOR
    TWR_TARGET: 1.05,           // Coxa/Cintura (Coxa MAIOR que cintura)
    GWR_TARGET: 1.70,           // Glúteo/Cintura
    reference: { height: 158 }
};

export const FIGURE_CONSTANTS = {
    name: 'Figure',
    WHR_TARGET: 0.70,           // WHR clássico
    WCR_TARGET: 0.70,           // Cintura/Busto
    SHR_TARGET: 1.00,           // Ombros = Quadril (simetria)
    SWR_TARGET: 1.50,           // V-Taper mais pronunciado
    HOURGLASS_TARGET: 1.40,     // Índice ampulheta
    reference: { height: 165 }
};

// ============================================
// FUNÇÕES DE CÁLCULO
// ============================================

/**
 * Calcula ideais baseados no Golden Ratio Feminino (Padrão)
 */
export function calcularIdeaisFemaleGoldenRatio(medidas: Measurements): IdealMeasurements {
    const { quadril, punho, tornozelo, joelho } = medidas;

    // Calcular cintura ideal baseada no quadril
    const cintura_ideal = quadril * FEMALE_GOLDEN_RATIO.WHR;

    // Calcular busto ideal (similar ao quadril para forma ampulheta)
    const busto_ideal = quadril * FEMALE_GOLDEN_RATIO.BUSTO_QUADRIL;

    // Calcular ombros ideais (não muito largos)
    const ombros_ideal = quadril * FEMALE_GOLDEN_RATIO.OMBROS_QUADRIL;

    // Calcular membros
    const braco_ideal = punho * FEMALE_GOLDEN_RATIO.BRACO_PUNHO;
    const antebraco_ideal = braco_ideal * FEMALE_GOLDEN_RATIO.ANTEBRACO_BRACO;
    const panturrilha_ideal = tornozelo * FEMALE_GOLDEN_RATIO.PANTURRILHA_TORNOZELO;
    const coxa_ideal = joelho * FEMALE_GOLDEN_RATIO.COXA_JOELHO;

    return {
        cintura: cintura_ideal,
        busto: busto_ideal,
        ombros: ombros_ideal,
        braco: braco_ideal,
        antebraco: antebraco_ideal,
        coxa: coxa_ideal,
        panturrilha: panturrilha_ideal,
        // Optional placeholders
        pescoco: 0,
        peito: busto_ideal // Mapping busto to peito for compatibility if needed, or separate
    };
}

/**
 * Calcula ideais para categoria Bikini
 */
export function calcularIdeaisBikini(medidas: Measurements): IdealMeasurements {
    const { altura, quadril, punho, tornozelo, joelho } = medidas;

    // Cintura ideal (WHR de 0.68)
    const cintura_ideal = quadril * BIKINI_CONSTANTS.WHR_TARGET;

    // Busto ideal (hourglass index)
    // (Busto + Quadril) / (2 × Cintura) = 1.47
    // Busto = (1.47 × 2 × Cintura) - Quadril
    const busto_ideal = (BIKINI_CONSTANTS.HOURGLASS_TARGET * 2 * cintura_ideal) - quadril;

    // Ombros ideais
    const ombros_ideal = quadril * BIKINI_CONSTANTS.SHR_TARGET;

    // Membros (proporcionais, não volumosos)
    const braco_ideal = punho * 2.15;  // Menor que Golden Ratio
    const coxa_ideal = joelho * 1.55;
    const panturrilha_ideal = tornozelo * 1.75;

    // Glúteo ideal (proeminente)
    const gluteo_ideal = cintura_ideal * 1.55;

    return {
        cintura: cintura_ideal,
        busto: busto_ideal,
        ombros: ombros_ideal,
        braco: braco_ideal,
        coxa: coxa_ideal,
        panturrilha: panturrilha_ideal,
        gluteo: gluteo_ideal,
        peito: busto_ideal
    };
}

/**
 * Calcula ideais para categoria Wellness
 */
export function calcularIdeaisWellness(medidas: Measurements): IdealMeasurements {
    const { quadril, punho, coxa, cintura } = medidas;

    // Cintura ideal (WHR de 0.62 - quadril dominante)
    const cintura_ideal = quadril * WELLNESS_CONSTANTS.WHR_TARGET;

    // Coxa ideal (MAIOR que cintura - diferencial da categoria)
    const coxa_ideal = cintura_ideal * WELLNESS_CONSTANTS.TWR_TARGET;

    // Glúteo ideal (muito desenvolvido)
    const gluteo_ideal = cintura_ideal * WELLNESS_CONSTANTS.GWR_TARGET;

    // Ombros ideais (menores que quadril)
    const ombros_ideal = quadril * WELLNESS_CONSTANTS.SHR_TARGET;

    // Busto (proporcional, não é foco)
    const busto_ideal = cintura_ideal / WELLNESS_CONSTANTS.WCR_TARGET;

    // Membros superiores (proporcionais, não volumosos)
    const braco_ideal = punho * 2.10;

    // Panturrilha (proporcional às coxas desenvolvidas)
    const panturrilha_ideal = coxa_ideal * 0.65;

    return {
        cintura: cintura_ideal,
        busto: busto_ideal,
        ombros: ombros_ideal,
        coxa: coxa_ideal,
        gluteo: gluteo_ideal,
        panturrilha: panturrilha_ideal,
        braco: braco_ideal,
        peito: busto_ideal
    };
}

/**
 * Calcula ideais para categoria Figure
 */
export function calcularIdeaisFigure(medidas: Measurements): IdealMeasurements {
    const { quadril, punho, tornozelo, joelho } = medidas;

    // Cintura ideal (WHR de 0.70)
    const cintura_ideal = quadril * FIGURE_CONSTANTS.WHR_TARGET;

    // Ombros ideais (iguais ao quadril para simetria)
    const ombros_ideal = quadril * FIGURE_CONSTANTS.SHR_TARGET;

    // Busto ideal
    const busto_ideal = cintura_ideal / FIGURE_CONSTANTS.WCR_TARGET;

    // Membros (mais desenvolvidos que Bikini)
    const braco_ideal = punho * 2.30;
    const coxa_ideal = joelho * 1.65;
    const panturrilha_ideal = tornozelo * 1.85;

    return {
        cintura: cintura_ideal,
        busto: busto_ideal,
        ombros: ombros_ideal,
        braco: braco_ideal,
        coxa: coxa_ideal,
        panturrilha: panturrilha_ideal,
        peito: busto_ideal
    };
}

// Wrapper para as calculadoras simples (Womens Physique e BB podem ser adicionados futuramente)
export function calcularIdeaisWomensPhysique(medidas: Measurements): IdealMeasurements {
    // Placeholder logic - similar to Figure but more muscular
    return calcularIdeaisFigure(medidas);
}

export function calcularIdeaisWomensBodybuilding(medidas: Measurements): IdealMeasurements {
    // Placeholder logic - max muscle
    const ideais = calcularIdeaisFigure(medidas);
    return {
        ...ideais,
        braco: ideais.braco * 1.15,
        coxa: (ideais.coxa || 0) * 1.15,
        panturrilha: ideais.panturrilha * 1.10
    };
}
