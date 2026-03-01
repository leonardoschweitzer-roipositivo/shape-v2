import { supabase } from './src/services/supabase';

async function run() {
    const resT = await supabase.from('planos_treino').select('id, diagnostico_id');
    console.log("Planos de treino:", resT.data, resT.error);
}
run();
