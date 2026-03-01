import { supabase } from './src/services/supabase';

async function run() {
    const diagId = "dummy"; // We will just check if we can query the plan sizes
    const res = await supabase.from('planos_treino').select('id, diagnostico_id');
    console.log("Planos de treino:", res.data);
}
run();
