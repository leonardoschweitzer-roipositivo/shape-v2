/**
 * Interface unificada para as constantes de proporção corporal.
 * Cobre GOLDEN_RATIO, CLASSIC_PHYSIQUE, MENS_PHYSIQUE e OPEN_BODYBUILDING.
 * Propriedades opcionais existem apenas em alguns métodos.
 */
export interface ProportionConfig {
    // --- Presentes em todos os métodos ---
    PEITO_PUNHO: number;
    BRACO_PUNHO: number;
    ANTEBRACO_BRACO: number;
    BF_MIN: number;
    BF_MAX: number;
    BF_IDEAL: number;

    // --- Presentes em alguns métodos ---
    /** PHI (1.618) — usado como OMBROS/CINTURA no Golden Ratio */
    PHI?: number;
    /** Ombros/Cintura — Classic, Mens, Open */
    OMBROS_CINTURA?: number;
    /** Costas/Cintura — Classic, Mens, Open */
    COSTAS_CINTURA?: number;
    /** Cintura/Altura — Classic, Mens, Open */
    CINTURA_ALTURA?: number;
    /** Cintura/Pélvis — Golden Ratio */
    CINTURA_PELVIS?: number;
    /** Coxa/Joelho — Golden, Classic, Open */
    COXA_JOELHO?: number;
    /** Coxa/Panturrilha */
    COXA_PANTURRILHA?: number;
    /** Panturrilha/Tornozelo — Golden, Mens */
    PANTURRILHA_TORNOZELO?: number;
    /** Panturrilha/Braço — Classic, Open */
    PANTURRILHA_BRACO?: number;
    /** Upper/Lower ratio */
    UPPER_LOWER_RATIO?: number;

    // --- Index signature para propriedades de referência (CBUM_*, RYAN_*, DEREK_*) ---
    [key: string]: number | undefined;
}
