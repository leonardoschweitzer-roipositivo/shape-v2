import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * Middleware de autenticação e proteção de rotas
 * 
 * - Verifica autenticação em cada requisição
 * - Redireciona para /login se não autenticado
 * - Exceções para rotas públicas
 */
export async function middleware(request: NextRequest) {
    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc)
         * - api/public (public APIs)
         * - p/ (portal público do atleta)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/public|p/).*)',
    ],
}
