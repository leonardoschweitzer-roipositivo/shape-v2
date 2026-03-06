import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { error } = await supabase.from('registros_diarios').insert({
    atleta_id: '47d750c1-3de7-4edb-871c-4395ad716584',
    data: '2023-10-10',
    tipo: 'feedback',
    dados: { texto: "teste", alerta: false }
  });
  console.log("Error from insert:", JSON.stringify(error, null, 2));
}
run();
