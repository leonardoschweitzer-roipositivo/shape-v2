import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envStr = fs.readFileSync('.env', 'utf-8');

let supabaseUrl = '';
let supabaseKey = '';

envStr.split('\n').forEach(line => {
    if (line.startsWith('VITE_SUPABASE_URL=')) {
        supabaseUrl = line.split('=')[1].trim().replace(/^"|"$/g, '');
    }
    if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) {
        supabaseKey = line.split('=')[1].trim().replace(/^"|"$/g, '');
    }
});

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const { data: atletas } = await supabase.from('atletas').select('id, nome').ilike('nome', '%Rodrigo Ferri%');
    console.log('Atleta:', atletas);

    if (!atletas || atletas.length === 0) return;

    const rodrigoId = atletas[0].id;

    const { data: registros } = await supabase.from('registros_diarios')
        .select('*')
        .eq('atleta_id', rodrigoId)
        .eq('tipo', 'treino')
        .order('created_at', { ascending: false });

    console.log('All Registros de treino:', JSON.stringify(registros, null, 2));
}
run();
