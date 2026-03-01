import { supabase } from './src/services/supabase';
async function test() {
    console.log("Fetching diagnosticos...");
    const d = await supabase.from('diagnosticos').select('id');
    console.log("diagnosticos:", d.data?.length, "err:", d.error);

    const t = await supabase.from('planos_treino').select('id, diagnostico_id');
    console.log("planos_treino:", t.data?.length, t.data, "err:", t.error);
}
test();
