import { supabase } from './src/services/supabase';
async function test() {
    console.log("Fetching columns...");
    const { data, error } = await supabase.rpc('get_columns_for_table', { table_name: 'planos_treino' });
    if (error) {
        // Fallback: just select 1 row
        const { data: rows, error: err } = await supabase.from('planos_treino').select('*').limit(1);
        console.log(rows, err);
    } else {
        console.log("Columns:", data);
    }
}
test();
