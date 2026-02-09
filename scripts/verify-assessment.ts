import { calcularAvaliacaoGeral } from '../src/services/calculations/assessment.ts';
import type { AvaliacaoGeralInput } from '../src/types/assessment.ts';

// Data from Spec Example 7.2
const input: AvaliacaoGeralInput = {
    proporcoes: {
        metodo: 'golden', // using internal type name
        vTaper: { indiceAtual: 1.03, indiceMeta: 1.62, percentualDoIdeal: 63.6, classificacao: 'NORMAL' },
        peitoral: { indiceAtual: 5.68, indiceMeta: 6.50, percentualDoIdeal: 87.4, classificacao: 'NORMAL' },
        braco: { indiceAtual: 2.10, indiceMeta: 2.52, percentualDoIdeal: 83.3, classificacao: 'NORMAL' },
        antebraco: { indiceAtual: 0.78, indiceMeta: 0.80, percentualDoIdeal: 97.5, classificacao: 'NORMAL' },
        triade: { harmoniaPercentual: 94.0, pescoco: 40, braco: 36, panturrilha: 38 },
        cintura: { indiceAtual: 0.82, indiceMeta: 0.86, percentualDoIdeal: 100, classificacao: 'NORMAL' },
        coxa: { indiceAtual: 1.48, indiceMeta: 1.75, percentualDoIdeal: 84.6, classificacao: 'NORMAL' },
        coxaPanturrilha: { indiceAtual: 1.55, indiceMeta: 1.50, percentualDoIdeal: 100, classificacao: 'NORMAL' },
        panturrilha: { indiceAtual: 1.58, indiceMeta: 1.92, percentualDoIdeal: 82.3, classificacao: 'NORMAL' },
        costas: null
    },
    composicao: {
        peso: 110,
        altura: 180,
        idade: 30,
        genero: 'MALE',
        bf: 38.4,
        metodo_bf: 'NAVY',
        pesoMagro: 67.8,
        pesoGordo: 42.2,
    },
    assimetrias: {
        braco: { esquerdo: 35.5, direito: 36.0, diferenca: 0.5, diferencaPercentual: 1.4, status: 'SIMETRICO' },
        antebraco: { esquerdo: 28.0, direito: 28.0, diferenca: 0, diferencaPercentual: 0, status: 'SIMETRICO' },
        coxa: { esquerdo: 59.0, direito: 60.0, diferenca: 1.0, diferencaPercentual: 1.7, status: 'SIMETRICO' },
        panturrilha: { esquerdo: 38.0, direito: 38.5, diferenca: 0.5, diferencaPercentual: 1.3, status: 'SIMETRICO' },
    },
};

const resultado = calcularAvaliacaoGeral(input);

console.log('--- RESULTADO DA AVALIAÇÃO ---');
console.log('Geral:', resultado.avaliacaoGeral);
console.log('Classificação:', resultado.classificacao.nivel);
console.log('');
console.log('Scores:');
console.log('  Proporções:', resultado.scores.proporcoes.valor.toFixed(1), 'contrib:', resultado.scores.proporcoes.contribuicao.toFixed(1));
console.log('  Composição:', resultado.scores.composicao.valor.toFixed(1), 'contrib:', resultado.scores.composicao.contribuicao.toFixed(1));
console.log('  Simetria:', resultado.scores.simetria.valor.toFixed(1), 'contrib:', resultado.scores.simetria.contribuicao.toFixed(1));

// Check against expected values
const expected = {
    geral: 71.0,
    prop: 85.2,
    comp: 48.5,
    sim: 100.0,
};

// Allow small floating point differences
const closeEnough = (a: number, b: number) => Math.abs(a - b) < 0.5;

if (
    closeEnough(resultado.avaliacaoGeral, expected.geral) &&
    closeEnough(resultado.scores.proporcoes.valor, expected.prop) &&
    closeEnough(resultado.scores.composicao.valor, expected.comp) &&
    closeEnough(resultado.scores.simetria.valor, expected.sim)
) {
    console.log('\n✅ VERIFICAÇÃO BEM SUCEDIDA: Os resultados batem com a spec!');
} else {
    console.log('\n❌ ERRO NA VERIFICAÇÃO: Resultados divergem da spec.');
    console.log('Esperado:', expected);
}
