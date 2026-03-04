import fs from 'fs';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const env = fs.readFileSync('.env', 'utf-8');
const keyMatch = env.match(/VITE_GEMINI_API_KEY=(.*)/);
const key = keyMatch ? keyMatch[1].trim() : '';

const genAI = new GoogleGenerativeAI(key);

const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    safetySettings: [
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        }
    ]
});

async function run() {
    try {
        const result = await model.generateContent("Give me details on female proportions including bust, thighs, hips, glutes, and waist size.");
        console.log("SUCCESS:", result.response.text().substring(0, 50));
    } catch(e) {
        console.error("ERROR GENERATING:", e.message);
    }
}
run();
