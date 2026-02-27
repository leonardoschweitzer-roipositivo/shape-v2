
import { createClient } from '@supabase/supabase-js';
import { join } from 'path';
import fs from 'fs';

// Get env vars from .env or .env.local
const envPath = join(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

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

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectTable() {
    console.log('--- Inspecting assessments table records ---');
    const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching assessments:', error);
    } else if (data && data.length > 0) {
        console.log('Record sample:', JSON.stringify(data[0], null, 2));
        console.log('Keys:', Object.keys(data[0]));
    } else {
        console.log('No records found in assessments');
    }

    console.log('\n--- Inspecting avaliacoes table records ---');
    const { data: data2, error: error2 } = await supabase
        .from('avaliacoes')
        .select('*')
        .limit(1);

    if (error2) {
        console.error('Error fetching avaliacoes:', error2);
    } else if (data2 && data2.length > 0) {
        console.log('Record sample:', JSON.stringify(data2[0], null, 2));
    }
}

inspectTable();
