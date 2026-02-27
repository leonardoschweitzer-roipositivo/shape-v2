
import { createClient } from '@supabase/supabase-js';
import { join } from 'path';
import fs from 'fs';

// Get env vars from .env or .env.local
const envPath = join(process.cwd(), '.env.local');
let envContent = '';
try {
    envContent = fs.readFileSync(envPath, 'utf8');
} catch (e) {
    console.error('Cant read .env.local, trying .env');
    envContent = fs.readFileSync(join(process.cwd(), '.env'), 'utf8');
}

const env = {};
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        env[key] = value;
    }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectAthlete() {
    const nomeAtleta = 'Rodrigo Ferri';

    const { data: atleta } = await supabase
        .from('atletas')
        .select('id, nome')
        .eq('nome', nomeAtleta)
        .single();

    if (!atleta) {
        console.log('Atleta não encontrado');
        return;
    }

    console.log(`Atleta: ${atleta.nome} (${atleta.id})`);

    const { data: avaliacoes } = await supabase
        .from('avaliacoes')
        .select('*')
        .eq('atleta_id', atleta.id)
        .order('data', { ascending: false });

    console.log('\n--- Tabela avaliacoes (legacy) ---');
    avaliacoes?.forEach(a => {
        console.log(`ID: ${a.id} | Data: ${a.data} | Score: ${a.score_geral}`);
    });

    const { data: assessments } = await supabase
        .from('assessments')
        .select('*')
        .eq('atleta_id', atleta.id)
        .order('date', { ascending: false });

    console.log('\n--- Tabela assessments (new) ---');
    assessments?.forEach(na => {
        const res = na.results || {};
        console.log(`ID: ${na.id} | Data: ${na.date} | BF: ${na.body_fat} | Weight: ${na.weight} | Score in JSON: ${res.avaliacaoGeral}`);
    });

}

inspectAthlete();
