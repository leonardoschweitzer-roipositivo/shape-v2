import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env', 'utf-8');
const keyMatch = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/);
const urlMatch = env.match(/VITE_SUPABASE_URL=(.*)/);

const supabase = createClient(urlMatch[1], keyMatch[1]);

async function check() {
    const { data: atleta } = await supabase.from('atletas').select('id, nome').ilike('nome', '%Graciela%').single();
    if (!atleta) return console.log("No Graciela found");
    
    console.log("Graciela:", atleta);
    const { data: d } = await supabase.from('diagnosticos').select('id').eq('atleta_id', atleta.id);
    const { data: t } = await supabase.from('planos_treino').select('id').eq('atleta_id', atleta.id);
    const { data: c } = await supabase.from('planos_dieta').select('id').eq('atleta_id', atleta.id);
    
    console.log("Diagnosticos:", d.length);
    console.log("Treinos:", t.length);
    console.log("Dietas:", c.length);
}
check();
