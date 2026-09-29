/**
 * VITRU IA — Edge Function: excluir-aluno
 *
 * POST { atleta_id: string } → 200 { excluido: true, login_removido: boolean }
 *
 * Exclusão definitiva: apaga o aluno e todos os dados dependentes numa transação
 * (RPC app_excluir_aluno_dados) e remove o login do aluno se ele não estiver ligado a mais nada.
 * Para liberar vaga sem perder histórico, o app oferece "Arquivar" (status INATIVO).
 */
import {
    adminClient,
    carregarAlunoDoPersonal,
    corsHeaders,
    json,
    responderErro,
} from '../_shared/acesso_aluno.ts'

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
    if (req.method !== 'POST') return json({ error: { code: 'METODO_INVALIDO' } }, 405)

    try {
        const body = await req.json().catch(() => ({}))
        const admin = adminClient()
        const { atleta } = await carregarAlunoDoPersonal(req, admin, body.atleta_id)

        const { data: authUserId, error } = await admin.rpc('app_excluir_aluno_dados', { p_atleta_id: atleta.id })
        if (error) throw error

        let loginRemovido = false
        if (authUserId) {
            const [{ data: perfil }, { count }] = await Promise.all([
                admin.from('profiles').select('role').eq('id', authUserId).maybeSingle(),
                admin.from('atletas').select('id', { count: 'exact', head: true }).eq('auth_user_id', authUserId),
            ])
            // Só remove login de ALUNO que não está ligado a nenhum outro cadastro
            if (perfil?.role === 'ATLETA' && (count ?? 0) === 0) {
                const { error: errDelete } = await admin.auth.admin.deleteUser(authUserId)
                if (errDelete) console.warn('[excluir-aluno] Falha ao remover login:', errDelete.message)
                else loginRemovido = true
            }
        }

        return json({ excluido: true, login_removido: loginRemovido })
    } catch (err) {
        return responderErro(err)
    }
})
