/**
 * Calculadora de Proporções Corporais
 * 
 * Implementa os cálculos de proporções para 3 metodologias:
 * - Golden Ratio (Clássico) - Proporções áureas baseadas em Steve Reeves
 * - Classic Physique (CBum) - Baseado em Chris Bumstead
 * - Men's Physique (Ryan Terry) - Baseado nos padrões da categoria
 * 
 * @see docs/specs/calculo-proporcoes.md para documentação completa
 */

import {
    UserMeasurements,
    ProportionIdeals,
    ProportionResult,
    ProportionDiff,
    ProportionScore,
    ComparisonMode
} from './types/proportions';

// ============================================================================
// CONSTANTES POR METODOLOGIA
// ============================================================================

const GOLDEN_RATIO = {
    PHI: 1.618,
    PEITO_PUNHO: 6.5,
    BRACO_PUNHO: 2.52,
    ANTEBRACO_PEITO: 0.29,
    CINTURA_PELVIS: 0.86,
    COXA_JOELHO: 1.75,
    PANTURRILHA_TORNOZELO: 1.92,
    PESCOCO_CABECA: 0.79
};

const CLASSIC_PHYSIQUE = {
    OMBROS_CINTURA: 1.70,
    PEITO_PUNHO: 7.0,
    CINTURA_ALTURA: 0.42,
    COXA_CINTURA: 0.97,
    PANTURRILHA_BRACO: 0.96,
    CBUM_ALTURA: 185,
    CBUM_BRACO: 50,
    PESCOCO_BRACO: 1.0,
    ANTEBRACO_BRACO: 0.65
};

const MENS_PHYSIQUE = {
    OMBROS_CINTURA: 1.55,
    PEITO_PUNHO: 6.2,
    CINTURA_ALTURA: 0.455,
    RYAN_ALTURA: 178,
    RYAN_BRACO: 43,
    ANTEBRACO_PUNHO: 1.6,
    PANTURRILHA_TORNOZELO: 1.8,
    PESCOCO_BRACO: 0.9
};

// Tabela de peso máximo IFBB Pro Classic Physique
const CLASSIC_WEIGHT_LIMITS: Record<number, number> = {
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
    193.0: 115.2
};

// ============================================================================
// MOCK DATA PARA TESTES
// ============================================================================

export const MOCK_USER_MEASUREMENTS: UserMeasurements = {
    // Medidas estruturais
    altura: 180,
    punho: 17.5,
    tornozelo: 23,
    joelho: 38,
    pelvis: 98,
    cabeca: 58,

    // Medidas variáveis
    cintura: 82,
    ombros: 120,
    peito: 108,
    braco: 40,
    antebraco: 32,
    coxa: 60,
    panturrilha: 38,
    pescoco: 40
};

// ============================================================================
// FUNÇÕES DE CÁLCULO DE IDEAIS
// ============================================================================

export function calcularIdeaisGoldenRatio(medidas: UserMeasurements): ProportionIdeals {
    const { cintura, punho, pelvis, joelho, tornozelo, cabeca } = medidas;
    const peitoIdeal = punho * GOLDEN_RATIO.PEITO_PUNHO;
    const bracoIdeal = punho * GOLDEN_RATIO.BRACO_PUNHO;

    return {
        ombros: cintura * GOLDEN_RATIO.PHI,
        peito: peitoIdeal,
        braco: bracoIdeal,
        antebraco: peitoIdeal * GOLDEN_RATIO.ANTEBRACO_PEITO,
        cintura: pelvis * GOLDEN_RATIO.CINTURA_PELVIS,
        coxa: joelho * GOLDEN_RATIO.COXA_JOELHO,
        panturrilha: tornozelo * GOLDEN_RATIO.PANTURRILHA_TORNOZELO,
        pescoco: cabeca * GOLDEN_RATIO.PESCOCO_CABECA,
        triade: {
            valor_ideal: bracoIdeal,
            regra: "Braço, Panturrilha e Pescoço devem ser iguais"
        }
    };
}

export function calcularIdeaisClassicPhysique(medidas: UserMeasurements): ProportionIdeals {
    const { altura, punho, cintura } = medidas;
    const fatorAltura = altura / CLASSIC_PHYSIQUE.CBUM_ALTURA;
    const bracoIdeal = fatorAltura * CLASSIC_PHYSIQUE.CBUM_BRACO;

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
            regra: "Braço ≈ Panturrilha ≈ Pescoço"
        },
        peso_maximo: getPesoMaximoClassic(altura)
    };
}

export function calcularIdeaisMensPhysique(medidas: UserMeasurements): ProportionIdeals {
    const { altura, punho, cintura, tornozelo } = medidas;
    const fatorAltura = altura / MENS_PHYSIQUE.RYAN_ALTURA;
    const bracoIdeal = fatorAltura * MENS_PHYSIQUE.RYAN_BRACO;

    return {
        ombros: cintura * MENS_PHYSIQUE.OMBROS_CINTURA,
        peito: punho * MENS_PHYSIQUE.PEITO_PUNHO,
        braco: bracoIdeal,
        antebraco: punho * MENS_PHYSIQUE.ANTEBRACO_PUNHO,
        cintura: altura * MENS_PHYSIQUE.CINTURA_ALTURA,
        coxa: null, // Não julgada na categoria Men's Physique
        panturrilha: tornozelo * MENS_PHYSIQUE.PANTURRILHA_TORNOZELO,
        pescoco: bracoIdeal * MENS_PHYSIQUE.PESCOCO_BRACO
    };
}

function getPesoMaximoClassic(altura_cm: number): number {
    const alturas = Object.keys(CLASSIC_WEIGHT_LIMITS).map(Number).sort((a, b) => a - b);

    if (altura_cm <= alturas[0]) return CLASSIC_WEIGHT_LIMITS[alturas[0]];
    if (altura_cm >= alturas[alturas.length - 1]) return CLASSIC_WEIGHT_LIMITS[alturas[alturas.length - 1]];

    for (let i = 0; i < alturas.length - 1; i++) {
        if (altura_cm >= alturas[i] && altura_cm < alturas[i + 1]) {
            const h1 = alturas[i], h2 = alturas[i + 1];
            const w1 = CLASSIC_WEIGHT_LIMITS[h1], w2 = CLASSIC_WEIGHT_LIMITS[h2];
            const fator = (altura_cm - h1) / (h2 - h1);
            return Math.round((w1 + (w2 - w1) * fator) * 10) / 10;
        }
    }

    return CLASSIC_WEIGHT_LIMITS[alturas[alturas.length - 1]];
}

// ============================================================================
// FUNÇÕES DE CÁLCULO DE SCORE
// ============================================================================

function calcularScoreProporcional(atual: number, ideal: number, peso: number): number {
    const percentual = Math.min(100, (atual / ideal) * 100);
    return percentual * (peso / 100);
}

function calcularScoreInverso(atual: number, ideal: number, peso: number): number {
    if (atual <= ideal) return peso;
    const percentual = (ideal / atual) * 100;
    return percentual * (peso / 100);
}

function calcularScoreTriade(braco: number, panturrilha: number, pescoco: number, peso: number): number {
    const media = (braco + panturrilha + pescoco) / 3;
    const desvios = [
        Math.abs(braco - media) / media,
        Math.abs(panturrilha - media) / media,
        Math.abs(pescoco - media) / media
    ];
    const desvioMedio = desvios.reduce((a, b) => a + b, 0) / 3;
    const percentual = Math.max(0, (1 - desvioMedio) * 100);
    return percentual * (peso / 100);
}

function calcularDiferencas(atuais: UserMeasurements, ideais: ProportionIdeals): Record<string, ProportionDiff> {
    const diffs: Record<string, ProportionDiff> = {};

    const campos: (keyof ProportionIdeals)[] = ['ombros', 'peito', 'braco', 'antebraco', 'cintura', 'coxa', 'panturrilha', 'pescoco'];

    for (const campo of campos) {
        const ideal = ideais[campo];
        const atual = atuais[campo as keyof UserMeasurements] as number;

        if (typeof ideal === 'number' && typeof atual === 'number') {
            const diferenca = Math.round((ideal - atual) * 10) / 10;
            const percentual = Math.round((atual / ideal) * 100);

            diffs[campo] = {
                diferenca: Math.abs(diferenca),
                necessario: diferenca > 0.5 ? 'aumentar' : diferenca < -0.5 ? 'diminuir' : 'manter',
                percentual
            };
        }
    }

    return diffs;
}

// ============================================================================
// FUNÇÃO PRINCIPAL: CALCULAR PROPORÇÕES
// ============================================================================

export function calcularProportions(
    medidas: UserMeasurements,
    mode: ComparisonMode
): ProportionResult {
    let ideais: ProportionIdeals;
    let pesos: Record<string, number>;
    let notas: Record<string, string> | undefined;

    switch (mode) {
        case 'golden':
            ideais = calcularIdeaisGoldenRatio(medidas);
            pesos = {
                ombros: 20,
                peito: 15,
                braco: 15,
                antebraco: 5,
                cintura: 15,
                coxa: 10,
                panturrilha: 8,
                pescoco: 5,
                triade: 7
            };
            break;

        case 'classic':
            ideais = calcularIdeaisClassicPhysique(medidas);
            pesos = {
                ombros: 20,
                peito: 15,
                braco: 18,
                antebraco: 4,
                cintura: 18,
                coxa: 10,
                panturrilha: 7,
                pescoco: 3,
                triade: 5
            };
            break;

        case 'mens':
            ideais = calcularIdeaisMensPhysique(medidas);
            pesos = {
                ombros: 25,
                peito: 20,
                braco: 25,
                antebraco: 5,
                cintura: 15,
                coxa: 0,
                panturrilha: 5,
                pescoco: 5,
                triade: 0
            };
            notas = {
                coxa: "Não julgada - usa board shorts",
                panturrilha: "Estética geral, menos ênfase",
                foco: "Deltoides, braços e V-taper moderado"
            };
            break;
    }

    const scores: ProportionScore = {
        ombros: calcularScoreProporcional(medidas.ombros, ideais.ombros, pesos.ombros),
        peito: calcularScoreProporcional(medidas.peito, ideais.peito, pesos.peito),
        braco: calcularScoreProporcional(medidas.braco, ideais.braco, pesos.braco),
        antebraco: calcularScoreProporcional(medidas.antebraco, ideais.antebraco, pesos.antebraco),
        cintura: calcularScoreInverso(medidas.cintura, ideais.cintura, pesos.cintura),
        coxa: ideais.coxa !== null
            ? calcularScoreProporcional(medidas.coxa, ideais.coxa, pesos.coxa)
            : 0,
        panturrilha: calcularScoreProporcional(medidas.panturrilha, ideais.panturrilha, pesos.panturrilha),
        pescoco: calcularScoreProporcional(medidas.pescoco, ideais.pescoco, pesos.pescoco),
        triade: mode !== 'mens'
            ? calcularScoreTriade(medidas.braco, medidas.panturrilha, medidas.pescoco, pesos.triade)
            : 0
    };

    const score_total = Object.values(scores).reduce((a, b) => a + b, 0);

    return {
        ideais,
        diferencas: calcularDiferencas(medidas, ideais),
        scores,
        score_total: Math.round(score_total * 100) / 100,
        notas
    };
}

// ============================================================================
// HELPERS PARA UI
// ============================================================================

export function getMethodLabel(mode: ComparisonMode): string {
    switch (mode) {
        case 'golden': return 'Meta Golden';
        case 'classic': return 'Meta CBum';
        case 'mens': return 'Meta MP';
    }
}

export function getStatusLabel(percentual: number, mode: ComparisonMode): string {
    if (percentual >= 98) return 'IDEAL CLÁSSICO';
    if (percentual >= 90) return 'QUASE LÁ';
    if (percentual >= 80) return 'EM PROGRESSO';
    if (percentual >= 60) return 'DESENVOLVENDO';
    return 'INICIANDO';
}

export function formatDifference(diff: ProportionDiff): string {
    if (diff.necessario === 'manter') return '✓ Na meta';
    const sinal = diff.necessario === 'aumentar' ? '+' : '-';
    return `${sinal}${diff.diferenca}cm para meta`;
}

export function getClassificacao(score: number): { nivel: string; emoji: string; descricao: string } {
    if (score >= 95) return { nivel: 'ELITE', emoji: '🏆', descricao: 'Proporções excepcionais' };
    if (score >= 85) return { nivel: 'AVANÇADO', emoji: '🥇', descricao: 'Muito acima da média' };
    if (score >= 75) return { nivel: 'INTERMEDIÁRIO', emoji: '🥈', descricao: 'Boas proporções' };
    if (score >= 60) return { nivel: 'INICIANTE', emoji: '💪', descricao: 'Em desenvolvimento' };
    return { nivel: 'INICIANTE', emoji: '🚀', descricao: 'Início da jornada' };
}
