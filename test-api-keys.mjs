import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

const env = fs.readFileSync('.env', 'utf-8');
const match = env.match(/VITE_GEMINI_API_KEY=(.*)/);
const key = match ? match[1] : null;

if (!key) {
    console.error("No key found!");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(key.trim());
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", generationConfig: { responseMimeType: 'application/json' } });

async function run() {
    try {
        const result = await model.generateContent("Give me some JSON data for a female athlete named Graciela.");
        console.log(result.response.text());
    } catch(e) {
        console.error("Error generating:", e);
    }
}
run();
