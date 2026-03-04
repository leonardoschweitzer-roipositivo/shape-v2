import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envStr = fs.readFileSync('.env.local', 'utf-8');

let supabaseUrl = '';
let supabaseKey = '';

envStr.split('\n').forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
        supabaseUrl = line.split('=')[1].trim().replace(/^"|"$/g, '');
    }
    if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
        supabaseKey = line.split('=')[1].trim().replace(/^"|"$/g, '');
    }
});

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const { data: atletas } = await supabase.from('atletas').select('id').ilike('nome', '%Rodrigo Ferri%');
    const atletaId = atletas[0].id;

    const { data } = await supabase
        .from('registros_diarios')
        .select('dados, data')
        .eq('atleta_id', atletaId)
        .eq('tipo', 'treino')
        .order('data', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(30);

    console.log(data);

    if (!data || data.length === 0) return -1;

    // Procura o último treino completo ou pulado
    for (const record of data) {
        const d = record.dados;
        if (d && (d.status === 'completo' || d.status === 'pulado')) {
            if (typeof d.treinoIndex === 'number') {
                console.log('has index', d.treinoIndex);
                return d.treinoIndex;
            }
            // Fallback
            if (record.data) {
                const parts = record.data.split('-');
                if (parts.length === 3) {
                    const dataRecordLocal = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
                    let tsIndex = dataRecordLocal.getDay() - 1;
                    if (tsIndex < 0) tsIndex = 0; // domingo tratamos como 0 para não bugar negativo
                    console.log('computed fallback index', tsIndex);
                    return tsIndex;
                }
            }
        }
    }
    return -1;
}
run();
