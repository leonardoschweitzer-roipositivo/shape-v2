import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../database.types'

/**
 * Cliente Supabase para aplicação Vite + React
 * 
 * @example
 * ```tsx
 * import { supabase } from '@/lib/supabase/client'
 * 
 * function MyComponent() {
 *   const loadData = async () => {
 *     const { data } = await supabase.from('atletas').select('*')
 *     return data
 *   }
 * }
 * ```
 */
export const supabase = createSupabaseClient<Database>(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
)

/**
 * @deprecated Use 'supabase' directly instead
 */
export function createClient() {
    return supabase
}
