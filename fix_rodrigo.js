import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

let envStr = '';
try {
    envStr = fs.readFileSync('.env.local', 'utf-8');
} catch (e) {
    envStr = fs.readFileSync('.env', 'utf-8');
}

let supabaseUrl = '';
let supabaseKey = '';

envStr.split('\n').forEach(line => {
    if (line.includes('VITE_SUPABASE_URL=')) {
        supabaseUrl = line.split('VITE_SUPABASE_URL=')[1].trim().replace(/^"|"$/g, '');
    }
    if (line.includes('VITE_SUPABASE_ANON_KEY=')) {
        supabaseKey = line.split('VITE_SUPABASE_ANON_KEY=')[1].trim().replace(/^"|"$/g, '');
    }
});

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log("Starting...");
    // Buscar id do Rodrigo
    const { data: atletas } = await supabase.from('atletas').select('id, nome').ilike('nome', '%Rodrigo Ferri%');
    console.log('Atletas:', atletas);
    const rodrigoId = atletas[0].id;

    // Buscar registro de hoje
    const hoje = new Date().toISOString().split('T')[0];
    const { data: registros, error } = await supabase.from('registros_diarios')
        .select('*')
        .eq('atleta_id', rodrigoId)
        .eq('tipo', 'treino')
        .eq('data', hoje);

    console.log('Registros:', registros, error);

    for (const reg of registros) {
        if (reg.dados && reg.dados.status === 'pulado') {
            const novosDados = { ...reg.dados, continuarHoje: true };
            const { error: updErr } = await supabase.from('registros_diarios')
                .update({ dados: novosDados })
                .eq('id', reg.id);
            console.log('Updated', reg.id, updErr);
        }
    }
}
run();
