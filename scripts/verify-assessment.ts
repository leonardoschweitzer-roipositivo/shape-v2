import { calcularAvaliacaoGeral } from '../src/services/calculations/assessment.ts';
import type { AvaliacaoGeralInput } from '../src/types/assessment.ts';

// Data for João Ogro Case - Spec v1.1
const input: AvaliacaoGeralInput = {
    proporcoes: {
        metodo: 'golden',
        vTaper: { indiceAtual: 1.03, indiceMeta: 1.62, percentualDoIdeal: 63.6, classificacao: 'NORMAL' },
        peitoral: { indiceAtual: 5.83, indiceMeta: 6.50, percentualDoIdeal: 89.7, classificacao: 'NORMAL' },
        braco: { indiceAtual: 2.00, indiceMeta: 2.52, percentualDoIdeal: 79.4, classificacao: 'NORMAL' },
        antebraco: { indiceAtual: 0.78, indiceMeta: 0.80, percentualDoIdeal: 97.5, classificacao: 'NORMAL' },
        triade: { harmoniaPercentual: 92.0, pescoco: 42, braco: 36, panturrilha: 38 },
        cintura: { indiceAtual: 0.974, indiceMeta: 0.86, percentualDoIdeal: 71.4, classificacao: 'NORMAL' },
        coxa: { indiceAtual: 1.49, indiceMeta: 1.75, percentualDoIdeal: 85.1, classificacao: 'NORMAL' },
        coxaPanturrilha: { indiceAtual: 1.57, indiceMeta: 1.50, percentualDoIdeal: 100, classificacao: 'NORMAL' },
        panturrilha: { indiceAtual: 1.58, indiceMeta: 1.92, percentualDoIdeal: 82.3, classificacao: 'NORMAL' },
        costas: null
    },
    composicao: {
        peso: 110,
        altura: 175,
        idade: 25,
        genero: 'MALE',
        bf: 26.5,
        metodo_bf: 'POLLOCK_7',
        pesoMagro: 80.8,
        pesoGordo: 29.2,
        cintura: 112, // Absolute measurement for penalization
    },
    assimetrias: {
        braco: { esquerdo: 35.5, direito: 36.0, diferenca: 0.5, diferencaPercentual: 1.4, status: 'SIMETRICO' },
        antebraco: { esquerdo: 28.0, direito: 28.0, diferenca: 0, diferencaPercentual: 0, status: 'SIMETRICO' },
        coxa: { esquerdo: 59.0, direito: 60.0, diferenca: 1.0, diferencaPercentual: 1.7, status: 'SIMETRICO' },
        panturrilha: { esquerdo: 38.0, direito: 38.0, diferenca: 0.0, diferencaPercentual: 0.0, status: 'SIMETRICO' },
    },
};

const resultado = calcularAvaliacaoGeral(input);

console.log('--- RESULTADO DA AVALIAÇÃO (JOÃO OGRO) ---');
console.log('Geral:', resultado.avaliacaoGeral);
console.log('Classificação:', resultado.classificacao.nivel, resultado.classificacao.emoji);
console.log('Penalização Cintura:', resultado.penalizacoes?.cintura);
console.log('Multiplicador V-Taper:', resultado.penalizacoes?.vTaper);
console.log('');
console.log('Scores:');
console.log('  Proporções:', resultado.scores.proporcoes.valor.toFixed(1), 'contrib:', resultado.scores.proporcoes.contribuicao.toFixed(1));
console.log('  Composição:', resultado.scores.composicao.valor.toFixed(1), 'contrib:', resultado.scores.composicao.contribuicao.toFixed(1));
console.log('  Simetria:', resultado.scores.simetria.valor.toFixed(1), 'contrib:', resultado.scores.simetria.contribuicao.toFixed(1));

// Check against expected values (v1.1)
// Base Spec Expected: ~54.0
const expected = {
    geral: 54.0,
    nivel: 'INICIANTE'
};

if (resultado.avaliacaoGeral < 60 && resultado.classificacao.nivel === 'INICIANTE') {
    console.log('\n✅ VERIFICAÇÃO BEM SUCEDIDA: O score caiu conforme esperado pela SPEC v1.1!');
} else {
    console.log('\n❌ ERRO NA VERIFICAÇÃO: Score ainda muito alto.');
}
