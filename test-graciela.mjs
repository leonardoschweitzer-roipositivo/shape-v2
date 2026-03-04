import fs from 'fs';
import { buildDiagnosticoPrompt } from './src/services/vitruviusPrompts.ts';
import { perfilParaTexto, diagnosticoParaTexto, getFontesCientificas } from './src/services/vitruviusContext.ts';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { gerarDiagnosticoCompleto } from './src/services/calculations/diagnostico.ts';

const env = fs.readFileSync('.env', 'utf-8');
const keyMatch = env.match(/VITE_GEMINI_API_KEY=(.*)/);
const key = keyMatch ? keyMatch[1].trim() : '';

const genAI = new GoogleGenerativeAI(key);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", generationConfig: { responseMimeType: 'application/json' } });

// Simulate Graciela
const m = { weight: 68.0, height: 165, neck: 32, shoulders: 108, chest: 92, waist: 64, hips: 105, pelvis: 92, armRight: 31, armLeft: 31, forearmRight: 25, forearmLeft: 25, thighRight: 64, thighLeft: 64, calfRight: 38, calfLeft: 38, wristRight: 15, wristLeft: 15, kneeRight: 36, kneeLeft: 36, ankleRight: 21, ankleLeft: 21 }
const input = {
    peso: m.weight,
    altura: m.height,
    idade: 30,
    sexo: 'F',
    gorduraPct: 15,
    score: 89,
    classificacao: 'AVANÇADO',
    ratio: 1.58,
    freqTreino: 5,
    nivelAtividade: 'ATIVO',
    usaAnabolizantes: false,
    usaTermogenicos: false,
    nomeAtleta: "Graciela",
    medidas: {
        ombros: m.shoulders,
        cintura: m.waist,
        peitoral: m.chest,
        costas: m.chest,
        bracoD: m.armRight,
        bracoE: m.armLeft,
        antebracoD: m.forearmRight,
        antebracoE: m.forearmLeft,
        coxaD: m.thighRight,
        coxaE: m.thighLeft,
        panturrilhaD: m.calfRight,
        panturrilhaE: m.calfLeft,
        punho: m.wristRight,
        joelho: m.kneeRight,
        tornozelo: m.ankleRight,
        pelvis: m.pelvis,
        pescoco: m.neck,
    },
    // SIMULATING PRE CALCULATED PROPORTIONS THAT BREAKS `metasProporcoes`
    proporcoesPreCalculadas: [
        { nome: 'Ampulheta', atual: 1.1, ideal: 1.2, pct: 90, status: 'META' },
        { nome: 'Hip-Thigh Ratio', atual: 1.1, ideal: 1.2, pct: 90, status: 'META' }
    ]
};

const diagnostico = gerarDiagnosticoCompleto(input, undefined);

const perfil = {
    nome: "Graciela",
    sexo: 'F',
    idade: 30,
    altura: 165,
    peso: 68,
    gorduraPct: 15,
    score: 89,
    classificacao: 'AVANÇADO',
    medidas: input.medidas,
    contexto: undefined,
};

const perfilTexto = perfilParaTexto(perfil);
const dadosTexto = diagnosticoParaTexto(diagnostico);
const fontesTexto = getFontesCientificas('diagnostico');
const prompt = buildDiagnosticoPrompt(perfilTexto, dadosTexto, fontesTexto, undefined);

console.log("SENDING TO GEMINI...");
async function run() {
    try {
        const result = await model.generateContent(prompt);
        console.log("RESPONSE SUCCESS:", result.response.text());
    } catch(e) {
        console.error("ERROR GENERATING:", e.message);
        if (e.response) console.error(JSON.stringify(e.response, null, 2));
    }
}
run();
