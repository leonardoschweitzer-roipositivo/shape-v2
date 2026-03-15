/**
 * VITRU IA — Supabase Client Helper
 * 
 * Cria um cliente Supabase usando o token JWT da requisição.
 * Isso garante que as queries respeitem as RLS policies do usuário logado.
 * 
 * @version 1.0.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * Cria um cliente Supabase autenticado com o token da requisição.
 * 
 * @param req - Request da Edge Function (contém o header Authorization)
 * @returns SupabaseClient configurado com o token do usuário
 * 
 * @example
 * const supabase = getSupabaseClient(req)
 * const { data: { user } } = await supabase.auth.getUser()
 */
export function getSupabaseClient(req: Request): SupabaseClient {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórios')
    }

    // Extrair o token do header Authorization
    const authHeader = req.headers.get('Authorization')

    return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            headers: {
                Authorization: authHeader || ''
            }
        },
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}

/**
 * Cria um cliente Supabase com Service Role Key.
 * Use apenas quando precisar bypassar RLS (operações administrativas).
 * 
 * @returns SupabaseClient com permissões elevadas
 * 
 * @example
 * const supabaseAdmin = getSupabaseAdminClient()
 * // Pode fazer queries que ignoram RLS
 */
export function getSupabaseAdminClient(): SupabaseClient {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error('SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios')
    }

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}