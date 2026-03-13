import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
    console.error('Missing env vars. Expected NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(url, key);

async function run() {
    console.log('Searching for users with role ACADEMIA (bypassing RLS)...');
    const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role')
        .eq('role', 'ACADEMIA');
        
    if (error) {
        console.error('Error fetching users:', error);
    } else {
        console.log('Results:');
        console.log(JSON.stringify(data, null, 2));
    }
}

run();
