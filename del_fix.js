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
    const { data, error: updErr } = await supabase.from('registros_diarios')
        .delete()
        .eq('id', 'aeea2025-fecb-48ee-b13c-002da5d51b52')
        .select();

    console.log('Deleted result:', data, updErr);
}
run();
