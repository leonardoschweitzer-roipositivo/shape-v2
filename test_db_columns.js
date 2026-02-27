import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
    const { data, error } = await supabase.from('medidas').insert({
        atleta_id: '11111111-1111-1111-1111-111111111111', // will likely fail foreign key, but we want to know if column exists first
        dobra_tricipital: 12
    }).select();
    
    console.log(error);
}

test();
