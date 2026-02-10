import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase URL or Anon Key. Check .env file.');
}

/**
 * Cliente Supabase sem tipagem genérica.
 * 
 * Os types de Row são usados via casting nos serviços.
 * Quando o schema estabilizar, rodar:
 * npx supabase gen types typescript --project-id <ID> > src/lib/database.types.ts
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
