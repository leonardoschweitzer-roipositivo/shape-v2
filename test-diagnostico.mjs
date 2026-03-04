import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

const env = fs.readFileSync('.env.local', 'utf-8');
const match = env.match(/VITE_GEMINI_API_KEY=(.*)/);

console.log("Found key in env.local?", !!match);

