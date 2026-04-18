/**
 * TDEE — Cálculo científico de gasto energético diário.
 *
 * Ponto único de verdade para:
 *   - BMR (Mifflin-St Jeor / Cunningham / Katch-McArdle / Schofield)
 *   - NEAT (5 níveis de atividade: SEDENTARIO → MUITO_ATIVO)
 *   - EAT por METs (intensidade do treino)
 *   - Ajustes por crescimento (adolescentes) e somatotipo
 *   - Faixa de confiança (tdeeMin / tdeeMax) por método escolhido
 *
 * Referências:
 *   - Mifflin MD et al. (1990) "A new predictive equation for resting energy expenditure". Am J Clin Nutr.
 *   - Cunningham JJ (1991) "Body composition as a determinant of energy expenditure". Am J Clin Nutr.
 *   - Katch VL & McArdle WD (1975) "Prediction of body density from simple anthropometric measurements".
 *   - Schofield WN (1985) "Predicting basal metabolic rate". WHO/FAO/UNU.
 *   - Levine JA (2005) "Non-exercise activity thermogenesis". Arq Bras Endocrinol Metabol.
 *   - Ainsworth BE et al. (2011) "Compendium of Physical Activities" (METs).
 */

import type { NivelAtleta } from './potencial';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export type NivelAtividade = 'SEDENTARIO' | 'LEVE' | 'MODERADO' | 'ATIVO' | 'MUITO_ATIVO';

export type Somatotipo = 'ECTOMORFO' | 'MESOMORFO' | 'ENDOMORFO';

export type MetodoBMR = 'MIFFLIN' | 'CUNNINGHAM' | 'KATCH_MCARDLE' | 'SCHOFIELD';

export interface EntradaTDEE {
    peso: number;              // kg
    altura: number;            // cm
    idade: number;             // anos
    sexo: 'M' | 'F';
    gorduraPct?: number;       // % — usado para calcular LBM se não passado
    lbm?: number;              // massa magra em kg (opcional; priorizado quando presente)
    ffmi?: number;             // para inferência de somatotipo (prova cruzada)
    nivelAtividade: NivelAtividade;
    freqTreino: number;        // sessões por semana
    duracaoMinSessao?: number; // default 60
    nivelAtleta?: NivelAtleta; // para METs e escolha de Cunningham
    somatotipo?: Somatotipo | null;
    usaAnabolizantes: boolean;
    usaTermogenicos: boolean;
}

export interface TaxasMetabolicas {
    // Campos originais (preservados para retrocompatibilidade)
    tmb: number;
    tmbAjustada: number;
    neat: number;
    eat: number;
    tdee: number;
    fatoresConsiderados: string[];

    // Campos expandidos
    metodoBMR?: MetodoBMR;
    fatorAtividade?: number;
    nivelAtividade?: NivelAtividade;
    ajusteCrescimento?: number;
    ajusteSomatotipo?: number;
    somatotipoUsado?: Somatotipo | null;
    somatotipoInferido?: Somatotipo | null;
    tdeeMin?: number;
    tdeeMax?: number;
    margemErroPct?: number;
}

// ═══════════════════════════════════════════════════════════
// CONSTANTES CIENTÍFICAS
// ═══════════════════════════════════════════════════════════

export const FATORES_ATIVIDADE: Record<NivelAtividade, { fator: number; descricao: string }> = {
    SEDENTARIO:  { fator: 1.20,  descricao: 'Pouco ou nenhum exercício, trabalho de escritório' },
    LEVE:        { fator: 1.375, descricao: '1-3 treinos/semana, rotina pouco ativa' },
    MODERADO:    { fator: 1.55,  descricao: '3-5 treinos/semana, rotina ativa' },
    ATIVO:       { fator: 1.725, descricao: '6-7 treinos/semana OU trabalho com atividade física' },
    MUITO_ATIVO: { fator: 1.90,  descricao: '2 treinos/dia, atleta ou trabalho físico pesado + treino' },
};

export const METS_POR_NIVEL_TREINO: Record<NivelAtleta, number> = {
    INICIANTE: 5,     // musculação iniciante, ritmo moderado (Compendium 02050)
    'INTERMEDIÁRIO': 6,
    'AVANÇADO': 7,    // treino pesado, progressivo (Compendium 02054)
};

export const AJUSTE_SOMATOTIPO: Record<Somatotipo, number> = {
    ECTOMORFO:  0.05,   // +5% termogênese adaptativa (NEAT maior)
    MESOMORFO:  0,
    ENDOMORFO: -0.04,   // -4% NEAT espontâneo menor
};

const MARGEM_ERRO_METODO: Record<MetodoBMR, number> = {
    MIFFLIN: 10,
    CUNNINGHAM: 8,
    KATCH_MCARDLE: 10,
    SCHOFIELD: 10,
};

// ═══════════════════════════════════════════════════════════
// FÓRMULAS DE BMR
// ═══════════════════════════════════════════════════════════

/** Mifflin-St Jeor (1990): fallback para adultos sem LBM medida. */
export function calcularBMRMifflin(peso: number, altura: number, idade: number, sexo: 'M' | 'F'): number {
    const base = (10 * peso) + (6.25 * altura) - (5 * idade);
    return Math.round(base + (sexo === 'M' ? 5 : -161));
}

/** Cunningham (1991): atletas com LBM medida. Mais preciso que Mifflin para treinados. */
export function calcularBMRCunningham(lbm: number): number {
    return Math.round(500 + 22 * lbm);
}

/** Katch-McArdle: alternativa conservadora quando há LBM mas não é atleta avançado. */
export function calcularBMRKatchMcArdle(lbm: number): number {
    return Math.round(370 + 21.6 * lbm);
}

/**
 * Schofield (1985, WHO/FAO): faixa etária 10–18 anos.
 * Fórmulas diferenciadas para 10–18 (pós-púbere padrão) e 3–10 (pré-púbere).
 */
export function calcularBMRSchofield(peso: number, idade: number, sexo: 'M' | 'F'): number {
    if (idade >= 10 && idade < 19) {
        return Math.round(sexo === 'M' ? (17.686 * peso + 658.2) : (13.384 * peso + 692.6));
    }
    // 3–9 anos
    return Math.round(sexo === 'M' ? (22.706 * peso + 504.3) : (20.315 * peso + 485.9));
}

/**
 * Escolhe o método de BMR mais adequado ao perfil.
 * Ordem: adolescente → Schofield; atleta com LBM → Cunningham; LBM iniciante → Katch; fallback Mifflin.
 */
export function selecionarMetodoBMR(args: {
    idade: number;
    sexo: 'M' | 'F';
    peso: number;
    altura: number;
    lbm?: number;
    nivelAtleta?: NivelAtleta;
}): { metodo: MetodoBMR; bmr: number; margemErroPct: number } {
    const { idade, sexo, peso, altura, lbm, nivelAtleta } = args;

    // 1. Adolescente (3–18): Schofield/WHO
    if (idade >= 3 && idade < 19) {
        return { metodo: 'SCHOFIELD', bmr: calcularBMRSchofield(peso, idade, sexo), margemErroPct: MARGEM_ERRO_METODO.SCHOFIELD };
    }

    // 2. LBM confiável + atleta experiente → Cunningham
    if (lbm && lbm > 0 && nivelAtleta && nivelAtleta !== 'INICIANTE') {
        return { metodo: 'CUNNINGHAM', bmr: calcularBMRCunningham(lbm), margemErroPct: MARGEM_ERRO_METODO.CUNNINGHAM };
    }

    // 3. LBM confiável + iniciante → Katch-McArdle
    if (lbm && lbm > 0) {
        return { metodo: 'KATCH_MCARDLE', bmr: calcularBMRKatchMcArdle(lbm), margemErroPct: MARGEM_ERRO_METODO.KATCH_MCARDLE };
    }

    // 4. Fallback: Mifflin-St Jeor
    return { metodo: 'MIFFLIN', bmr: calcularBMRMifflin(peso, altura, idade, sexo), margemErroPct: MARGEM_ERRO_METODO.MIFFLIN };
}

// ═══════════════════════════════════════════════════════════
// AJUSTES
// ═══════════════════════════════════════════════════════════

/**
 * Ajuste por fase de crescimento.
 * Schofield já considera idade, mas atletas em crescimento (10–18) têm demanda extra
 * não capturada pelo BMR isolado — ganho de massa magra + maturação óssea.
 */
export function calcularAjusteCrescimento(idade: number, bmr: number): number {
    if (idade < 14) return Math.round(bmr * 0.10);   // pré-púbere / púbere precoce
    if (idade >= 14 && idade < 19) return Math.round(bmr * 0.05);
    return 0;
}

/**
 * Ajuste por medicações (preservado do comportamento anterior).
 * +10% anabolizantes, +5% termogênicos.
 */
export function ajustarTMBPorMedicacoes(
    tmb: number,
    usaAnabolizantes: boolean,
    usaTermogenicos: boolean,
): { tmbAjustada: number; fatores: string[] } {
    let fator = 1.0;
    const fatores: string[] = [];

    if (usaAnabolizantes) {
        fator += 0.10;
        fatores.push('Anabolizantes (+10% metabolismo)');
    }
    if (usaTermogenicos) {
        fator += 0.05;
        fatores.push('Termogênicos (+5% metabolismo)');
    }

    return { tmbAjustada: Math.round(tmb * fator), fatores };
}

export function calcularAjusteSomatotipo(somatotipo: Somatotipo | null | undefined, tdeeBase: number): number {
    if (!somatotipo) return 0;
    return Math.round(tdeeBase * AJUSTE_SOMATOTIPO[somatotipo]);
}

// ═══════════════════════════════════════════════════════════
// EAT POR METS
// ═══════════════════════════════════════════════════════════

/**
 * Calcula EAT diário (gasto com treino) usando equação MET.
 * kcal/sessão = MET × peso (kg) × duração (h).
 * EAT diário = média ponderada por frequência semanal.
 */
export function calcularEAT(args: {
    freqTreino: number;
    duracaoMinSessao: number;
    peso: number;
    nivelAtleta?: NivelAtleta;
}): number {
    const { freqTreino, duracaoMinSessao, peso, nivelAtleta } = args;
    if (freqTreino <= 0) return 0;
    const mets = METS_POR_NIVEL_TREINO[nivelAtleta ?? 'INICIANTE'];
    const horas = duracaoMinSessao / 60;
    const kcalPorSessao = mets * peso * horas;
    return Math.round((kcalPorSessao * freqTreino) / 7);
}

// ═══════════════════════════════════════════════════════════
// INFERÊNCIA DE SOMATOTIPO (prova cruzada via FFMI + BF%)
// ═══════════════════════════════════════════════════════════

/**
 * Infere somatotipo a partir de FFMI (já calculado em assessment.ts) e BF%.
 * Heurística simples baseada em limiares validados para adultos.
 *
 * - ECTOMORFO: FFMI baixo + BF baixo (massa magra pouca, sem gordura)
 * - ENDOMORFO: BF alto (retém gordura facilmente)
 * - MESOMORFO: caso intermediário / FFMI alto com BF controlado
 */
export function inferirSomatotipoDeFFMI(ffmi: number, bf: number, sexo: 'M' | 'F'): Somatotipo {
    const bfAlto = sexo === 'M' ? bf >= 20 : bf >= 28;
    const bfBaixo = sexo === 'M' ? bf <= 13 : bf <= 21;
    if (bfAlto) return 'ENDOMORFO';
    // FFMI < 20 com BF baixo caracteriza perfil ectomorfo (estrutura fina, músculo proporcional mas baixo total)
    if (ffmi < 20 && bfBaixo) return 'ECTOMORFO';
    return 'MESOMORFO';
}

// ═══════════════════════════════════════════════════════════
// PIPELINE PRINCIPAL
// ═══════════════════════════════════════════════════════════

/**
 * Calcula as taxas metabólicas completas (TMB, NEAT, EAT, TDEE) com:
 *   - Seleção dinâmica de fórmula de BMR
 *   - Ajuste de crescimento (se adolescente)
 *   - Ajuste por medicações
 *   - NEAT implícito via fator de atividade
 *   - EAT calculado por METs
 *   - Ajuste por somatotipo (se informado)
 *   - Faixa de confiança (tdeeMin / tdeeMax)
 */
export function calcularTaxasMetabolicas(entrada: EntradaTDEE): TaxasMetabolicas {
    // 1. LBM — usa a passada, ou calcula via peso × (1 - bf%)
    const lbm = entrada.lbm ?? (entrada.gorduraPct != null
        ? Math.round(entrada.peso * (1 - entrada.gorduraPct / 100) * 10) / 10
        : undefined);

    // 2. BMR base (escolhe método pelo perfil)
    const { metodo, bmr, margemErroPct } = selecionarMetodoBMR({
        idade: entrada.idade,
        sexo: entrada.sexo,
        peso: entrada.peso,
        altura: entrada.altura,
        lbm,
        nivelAtleta: entrada.nivelAtleta,
    });

    // 3. Ajuste de crescimento (adolescente)
    const ajusteCrescimento = calcularAjusteCrescimento(entrada.idade, bmr);

    // 4. Ajuste por medicações
    const { tmbAjustada, fatores } = ajustarTMBPorMedicacoes(
        bmr + ajusteCrescimento,
        entrada.usaAnabolizantes,
        entrada.usaTermogenicos,
    );

    // 5. Fator de atividade (NEAT implícito) + EAT por METs
    const { fator } = FATORES_ATIVIDADE[entrada.nivelAtividade];
    const eat = calcularEAT({
        freqTreino: entrada.freqTreino,
        duracaoMinSessao: entrada.duracaoMinSessao ?? 60,
        peso: entrada.peso,
        nivelAtleta: entrada.nivelAtleta,
    });
    const tdeeBruto = Math.round(tmbAjustada * fator);
    // NEAT = o que sobra do fator de atividade após subtrair BMR e EAT.
    // Piso: 10% da TMB ajustada (mesmo sedentário extremo tem alguma atividade espontânea).
    const neat = Math.max(Math.round(tmbAjustada * 0.10), tdeeBruto - tmbAjustada - eat);

    // 6. Somatotipo — declarado (fonte de verdade) e inferido (prova cruzada).
    // Se personal não declarou, aplicamos o inferido automaticamente para não perder precisão;
    // o campo `somatotipoUsado` permanece vazio para indicar que veio da inferência.
    const somatotipoDeclarado: Somatotipo | null = entrada.somatotipo ?? null;
    const somatotipoInferido: Somatotipo | null = (entrada.ffmi != null && entrada.gorduraPct != null)
        ? inferirSomatotipoDeFFMI(entrada.ffmi, entrada.gorduraPct, entrada.sexo)
        : null;
    const somatotipoEfetivo: Somatotipo | null = somatotipoDeclarado ?? somatotipoInferido;
    const somatotipoUsado = somatotipoDeclarado;

    const ajusteSomatotipo = calcularAjusteSomatotipo(somatotipoEfetivo, tdeeBruto);

    // 7. TDEE final
    const tdee = tdeeBruto + ajusteSomatotipo;
    const tdeeMin = Math.round(tdee * (1 - margemErroPct / 100));
    const tdeeMax = Math.round(tdee * (1 + margemErroPct / 100));

    // 8. Lista de fatores considerados (preenchida de verdade agora)
    const fatoresConsiderados = [
        ...fatores,
        ...(ajusteCrescimento > 0 ? [`Crescimento adolescente (+${ajusteCrescimento} kcal)`] : []),
        ...(ajusteSomatotipo !== 0 && somatotipoEfetivo
            ? [`Somatotipo ${somatotipoEfetivo}${!somatotipoDeclarado ? ' (inferido via FFMI+BF%)' : ''} (${ajusteSomatotipo > 0 ? '+' : ''}${ajusteSomatotipo} kcal)`]
            : []),
    ];

    return {
        tmb: bmr,
        tmbAjustada,
        neat,
        eat,
        tdee,
        fatoresConsiderados,
        metodoBMR: metodo,
        fatorAtividade: fator,
        nivelAtividade: entrada.nivelAtividade,
        ajusteCrescimento,
        ajusteSomatotipo,
        somatotipoUsado,
        somatotipoInferido,
        tdeeMin,
        tdeeMax,
        margemErroPct,
    };
}

// ═══════════════════════════════════════════════════════════
// RE-EXPORT LEGADO (compatibilidade)
// ═══════════════════════════════════════════════════════════

/** @deprecated Use calcularBMRMifflin. Mantido para código legado. */
export const calcularTMB = calcularBMRMifflin;
