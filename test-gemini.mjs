import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("ERRO: VITE_GEMINI_API_KEY não localizada. Defina no .env!");
  process.exit(1);
}
console.log("Using API KEY:", API_KEY);

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function run() {
  try {
    const result = await model.generateContent("Diga 'Olá mundo' em JSON no formato { \"mensagem\": \"...\" }");
    console.log(result.response.text());
  } catch (e) {
    console.error("Error:", e);
  }
}
run();
