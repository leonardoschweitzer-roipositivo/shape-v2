
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

async function inspectTable() {
    const nomeAtleta = 'Rodrigo Ferri';
    const { data: atleta } = await supabase.from('atletas').select('id').eq('nome', nomeAtleta).single();
    if (!atleta) return console.log('Rodrigo Ferri not found');

    console.log('--- Assessments for Rodrigo Ferri ---');
    const { data: assessments } = await supabase.from('assessments').select('*').eq('atleta_id', atleta.id).order('date', { ascending: false });
    assessments?.forEach(a => {
        console.log(`ID: ${a.id}`);
        console.log(`Keys: ${Object.keys(a).join(', ')}`);
        console.log(`Date: ${a.date}`);
        console.log(`Score in JSON results: ${a.results?.avaliacaoGeral}`);
        console.log('---');
    });

    console.log('\n--- Avaliacoes (legacy) for Rodrigo Ferri ---');
    const { data: avaliacoes } = await supabase.from('avaliacoes').select('*').eq('atleta_id', atleta.id).order('data', { ascending: false });
    avaliacoes?.forEach(a => {
        console.log(`ID: ${a.id}`);
        console.log(`Date: ${a.data}`);
        console.log(`Score: ${a.score_geral}`);
        console.log('---');
    });
}

inspectTable();
