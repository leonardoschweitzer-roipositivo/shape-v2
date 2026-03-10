import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    // try to login as personal to get an authenticated session
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'leonardo.schweitzer@gmail.com',
        password: 'Shape2026!' // I will just try anon first or this password
    });

    console.log("Auth:", authError ? authError.message : 'Success');

    const { data, error } = await supabase.rpc('link_existing_user_to_atleta', {
        p_email: 'leonardo.roipositivo@gmail.com',
        p_atleta_id: '00000000-0000-0000-0000-000000000000' // dummy uuid just to see if type matching is the issue, or if we get a specific error
    });

    console.log("RPC Data:", data);
    console.log("RPC Error:", JSON.stringify(error, null, 2));
}

test();
