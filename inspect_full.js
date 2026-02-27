
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

async function inspectFullData() {
    const nomeAtleta = 'Rodrigo Ferri';
    const { data: atleta } = await supabase.from('atletas').select('id').eq('nome', nomeAtleta).single();
    if (!atleta) return;

    const { data: assessment } = await supabase.from('assessments')
        .select('*')
        .eq('atleta_id', atleta.id)
        .order('date', { ascending: false })
        .limit(1)
        .single();

    if (assessment) {
        console.log('Full Assessment JSON:', JSON.stringify(assessment, null, 2));
    }
}

inspectFullData();
