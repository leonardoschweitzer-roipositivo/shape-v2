/**
 * Estimativa de Body Fat para onboarding sem avaliação completa.
 *
 * Duas estratégias:
 *  1. Navy (preferida): usa cintura, pescoço e altura (homens) ou cintura+quadril+pescoço+altura (mulheres).
 *  2. Deurenberg (fallback): usa IMC + idade + sexo quando não há pescoço disponível.
 */

export interface BfEstimationInput {
    sexo: 'M' | 'F';
    altura: number; // cm
    peso: number;   // kg
    idade: number;
    cintura?: number;  // cm
    quadril?: number;  // cm
    pescoco?: number;  // cm
}

export interface BfEstimationResult {
    bodyFat: number;        // %
    metodo: 'NAVY' | 'DEURENBERG' | 'DEFAULT';
}

function navy(input: BfEstimationInput): number | null {
    const { sexo, altura, cintura, quadril, pescoco } = input;
    if (!cintura || !pescoco || !altura) return null;
    if (sexo === 'M') {
        if (cintura <= pescoco) return null;
        return 495 / (1.0324 - 0.19077 * Math.log10(cintura - pescoco) + 0.15456 * Math.log10(altura)) - 450;
    }
    if (!quadril || cintura + quadril <= pescoco) return null;
    return 495 / (1.29579 - 0.35004 * Math.log10(cintura + quadril - pescoco) + 0.22100 * Math.log10(altura)) - 450;
}

function deurenberg(input: BfEstimationInput): number {
    const { sexo, altura, peso, idade } = input;
    const bmi = peso / Math.pow(altura / 100, 2);
    const sexFactor = sexo === 'M' ? 1 : 0;
    return 1.2 * bmi + 0.23 * idade - 10.8 * sexFactor - 5.4;
}

export function estimarBodyFat(input: BfEstimationInput): BfEstimationResult {
    const navyBf = navy(input);
    if (navyBf !== null && navyBf >= 3 && navyBf <= 60) {
        return { bodyFat: Math.round(navyBf * 10) / 10, metodo: 'NAVY' };
    }
    const deurBf = deurenberg(input);
    if (deurBf >= 3 && deurBf <= 60) {
        return { bodyFat: Math.round(deurBf * 10) / 10, metodo: 'DEURENBERG' };
    }
    return { bodyFat: input.sexo === 'M' ? 20 : 28, metodo: 'DEFAULT' };
}
