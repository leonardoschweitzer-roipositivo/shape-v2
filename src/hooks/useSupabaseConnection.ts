import { useState } from 'react'
import { supabase } from '../lib/supabase/client'

/**
 * Hook para testar conexão com Supabase
 * 
 * @example
 * ```tsx
 * import { useSupabaseConnection } from '@/hooks/useSupabaseConnection'
 * 
 * function TestConnection() {
 *   const { testConnection, isConnected, error, loading } = useSupabaseConnection()
 *   
 *   return (
 *     <button onClick={testConnection}>
 *       {loading ? 'Testando...' : isConnected ? 'Conectado!' : 'Testar Conexão'}
 *     </button>
 *   )
 * }
 * ```
 */
export function useSupabaseConnection() {
    const [isConnected, setIsConnected] = useState<boolean | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const testConnection = async () => {
        setLoading(true)
        setError(null)

        try {
            const { data, error } = await supabase
                .from('academias')
                .select('count')
                .limit(1)

            if (error) {
                setError(error.message)
                setIsConnected(false)
            } else {
                setIsConnected(true)
            }
        } catch (err: any) {
            setError(err.message || 'Erro ao conectar')
            setIsConnected(false)
        } finally {
            setLoading(false)
        }
    }

    return {
        testConnection,
        isConnected,
        error,
        loading
    }
}
