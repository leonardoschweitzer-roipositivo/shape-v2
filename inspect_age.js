
import { createClient } from '@supabase/supabase-js';
import { join } from 'path';
import fs from 'fs';

const envPath = join(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) env[parts[0].trim()] = parts.slice(1).join('=').trim();
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function inspectAge() {
    const nomeAtleta = 'Rodrigo Ferri';
    const { data: atleta } = await supabase.from('atletas').select('id').eq('nome', nomeAtleta).single();
    if (!atleta) return;

    const { data: ficha } = await supabase.from('fichas').select('data_nascimento').eq('atleta_id', atleta.id).single();

    let ageFromFicha = 'N/A';
    if (ficha?.data_nascimento) {
        const birth = new Date(ficha.data_nascimento);
        const now = new Date();
        let age = now.getFullYear() - birth.getFullYear();
        const m = now.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
        ageFromFicha = age;
        console.log(`Ficha Birth Date: ${ficha.data_nascimento} -> Age: ${age}`);
    }

    const { data: assessments } = await supabase.from('assessments').select('age, date, results, weight, height').eq('atleta_id', atleta.id);
    assessments?.forEach(a => {
        console.log(`Assessment Date: ${a.date}`);
        console.log(`Age in Column: ${a.age}`);
        console.log(`Weight: ${a.weight}, Height: ${a.height}`);
        console.log(`Score in JSON: ${a.results?.avaliacaoGeral}`);
        console.log('---');
    });
}

inspectAge();
