import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '../database.types'

/**
 * Cliente Supabase para Server Components e Server Actions
 * 
 * @example Server Component
 * ```tsx
 * import { createClient } from '@/lib/supabase/server'
 * 
 * export default async function Page() {
 *   const supabase = await createClient()
 *   const { data } = await supabase.from('atletas').select('*')
 *   
 *   return <div>...</div>
 * }
 * ```
 * 
 * @example Server Action
 * ```tsx
 * 'use server'
 * 
 * import { createClient } from '@/lib/supabase/server'
 * 
 * export async function createAtleta(formData: FormData) {
 *   const supabase = await createClient()
 *   const { error } = await supabase.from('atletas').insert({...})
 * }
 * ```
 */
export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // Erro ao setar cookies em Server Component
                        // Isso é esperado e pode ser ignorado
                    }
                },
            },
        }
    )
}
