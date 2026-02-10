import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Endpoint de teste de conexão com o banco de dados Supabase
 * 
 * GET /api/test-db
 * 
 * Retorna:
 * - success: boolean
 * - message: string
 * - timestamp: string
 * 
 * @example
 * curl http://localhost:3000/api/test-db
 */
export async function GET() {
    try {
        const supabase = await createClient()

        // Testar conexão fazendo uma query simples
        const { data, error } = await supabase
            .from('academias')
            .select('count')
            .limit(1)

        if (error) {
            console.error('Erro ao conectar com Supabase:', error)
            return NextResponse.json({
                success: false,
                error: error.message,
                message: 'Falha na conexão com o banco de dados'
            }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: 'Conexão com banco de dados OK! ✅',
            timestamp: new Date().toISOString(),
            info: 'Cliente Supabase inicializado corretamente'
        })
    } catch (error: any) {
        console.error('Erro ao criar cliente Supabase:', error)
        return NextResponse.json({
            success: false,
            error: error?.message || 'Erro desconhecido',
            message: 'Erro ao criar cliente Supabase. Verifique as variáveis de ambiente.'
        }, { status: 500 })
    }
}
