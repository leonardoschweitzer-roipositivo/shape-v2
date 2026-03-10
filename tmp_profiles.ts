import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    console.log("Checking profiles...");
    const { data, error } = await supabase
        .from('profiles')
        .select('*');

    if (error) {
        console.error("Error fetching profiles (might be RLS):", error.message);
    } else {
        console.table(data);
    }
}

test();
