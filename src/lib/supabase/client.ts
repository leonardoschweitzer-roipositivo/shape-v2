import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '../database.types'

/**
 * Cliente Supabase para uso no browser (Client Components)
 * 
 * @example
 * ```tsx
 * 'use client'
 * 
 * import { createClient } from '@/lib/supabase/client'
 * 
 * export function MyComponent() {
 *   const supabase = createClient()
 *   
 *   async function loadData() {
 *     const { data } = await supabase.from('atletas').select('*')
 *     return data
 *   }
 * }
 * ```
 */
export function createClient() {
    return createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
