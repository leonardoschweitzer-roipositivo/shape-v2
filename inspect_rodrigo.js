
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
    const { data: atleta } = await supabase.from('atletas').select('id, nome').ilike('nome', `%${nomeAtleta}%`);
    if (!atleta || atleta.length === 0) return console.log('Rodrigo Ferri not found');

    console.log('--- Atleta Found ---');
    console.log(atleta);

    for (const a of atleta) {
        const atletaId = a.id;
        console.log(`\nChecking for Atleta ID: ${atletaId} (${a.nome})`);

        console.log('\n--- Medidas ---');
        const { data: medidas } = await supabase.from('medidas').select('*').eq('atleta_id', atletaId);
        console.log(`Found ${medidas?.length || 0} measures`);
        medidas?.forEach(m => {
            console.log(`ID: ${m.id}, Date: ${m.data}, Registrado Por: ${m.registrado_por}`);
        });

        console.log('\n--- Assessments ---');
        const { data: assessments } = await supabase.from('assessments').select('*').eq('atleta_id', atletaId);
        console.log(`Found ${assessments?.length || 0} assessments`);
        assessments?.forEach(ass => {
            console.log(`ID: ${ass.id}, Date: ${ass.date}, Score: ${ass.score}`);
        });

        console.log('\n--- Avaliacoes ---');
        const { data: avaliacoes } = await supabase.from('avaliacoes').select('*').eq('atleta_id', atletaId);
        console.log(`Found ${avaliacoes?.length || 0} evaluations`);
    }
}

inspectTable();


