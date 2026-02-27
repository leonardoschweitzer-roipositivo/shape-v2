
import { calcularAvaliacaoGeral } from './src/services/calculations/assessment.js';

// Data for Rodrigo Ferri from DB (waist 91)
const input = {
    atleta_id: '...',
    genero: 'MALE',
    idade: 35,
    medidas: {
        peso: 80.2,
        altura: 179,
        pescoco: 39,
        ombros: 122,
        peitoral: 105,
        cintura: 91,
        quadril: 98,
        braco_direito: 38,
        braco_esquerdo: 38,
        antebraco_direito: 30,
        antebraco_esquerdo: 30,
        coxa_direita: 60,
        coxa_esquerda: 60,
        panturrilha_direita: 38,
        panturrilha_esquerda: 38,
        punho: 17,
        joelho: 38,
        tornozelo: 22
    },
    dobras: {
        tricipital: 10,
        subescapular: 12,
        peitoral: 8,
        axilar_media: 10,
        suprailiaca: 12,
        abdominal: 15,
        coxa: 12
    },
    metodoBf: 'pollock7'
};

const result = calcularAvaliacaoGeral(input);
console.log('Calculated Score:', result.avaliacaoGeral);
console.log('Penalidades:', result.penalizacoes);
