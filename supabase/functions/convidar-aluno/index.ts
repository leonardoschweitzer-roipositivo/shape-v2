/**
 * VITRU IA — Edge Function: convidar-aluno
 *
 * POST { atleta_id: string, email?: string }
 *   → 200 { link, email, tipo: 'invite' | 'recovery', expira_em }
 *
 * Gera o link de uso único para o aluno criar a própria senha em /definir-senha.
 * - Aluno sem login           → cria o login (invite) e vincula atletas.auth_user_id
 * - Aluno já com login        → link de recuperação (reenvio / migração da senha padrão antiga)
 * - E-mail de OUTRA conta     → 409 EMAIL_EM_USO (nunca gera link para conta alheia)
 *
 * O link aponta para o app com o token_hash (não o action_link do Supabase): o token só é
 * consumido quando o aluno envia a senha, então a prévia do WhatsApp não "queima" o link.
 *
 * Env: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY (automáticas) + APP_URL.
 */
import {
    adminClient,
    carregarAlunoDoPersonal,
    corsHeaders,
    ErroAcesso,
    json,
    responderErro,
} from '../_shared/acesso_aluno.ts'

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
/** Deve bater com Auth → Email → "Email OTP Expiration" no dashboard (recomendado: 86400). */
const VALIDADE_HORAS = 24

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
    if (req.method !== 'POST') return json({ error: { code: 'METODO_INVALIDO' } }, 405)

    try {
        const appUrl = (Deno.env.get('APP_URL') ?? '').replace(/\/+$/, '')
        if (!appUrl) throw new Error('APP_URL não configurada (supabase secrets set APP_URL=...)')

        const body = await req.json().catch(() => ({}))
        const admin = adminClient()
        const { atleta } = await carregarAlunoDoPersonal(req, admin, body.atleta_id)

        if (atleta.status === 'INATIVO') throw new ErroAcesso(409, 'ATLETA_ARQUIVADO')

        const email = String(body.email ?? atleta.email ?? '').trim().toLowerCase()
        if (!EMAIL_REGEX.test(email)) throw new ErroAcesso(400, 'EMAIL_INVALIDO')

        const { data: existenteId, error: errBusca } = await admin.rpc('app_auth_user_id_por_email', { p_email: email })
        if (errBusca) throw errBusca

        let tipo: 'invite' | 'recovery'
        let tokenHash: string

        if (existenteId) {
            if (existenteId !== atleta.auth_user_id) {
                // Login pertence a outra pessoa (outro aluno, personal, academia) — não entregar acesso
                throw new ErroAcesso(409, 'EMAIL_EM_USO')
            }
            const { data, error } = await admin.auth.admin.generateLink({ type: 'recovery', email })
            if (error) throw error
            tipo = 'recovery'
            tokenHash = data.properties.hashed_token
            if (atleta.email !== email) {
                await admin.from('atletas').update({ email }).eq('id', atleta.id)
            }
        } else {
            if (atleta.auth_user_id) {
                // Aluno já tem login com outro e-mail: não troca o login por aqui
                throw new ErroAcesso(409, 'ATLETA_JA_TEM_LOGIN')
            }
            const { data, error } = await admin.auth.admin.generateLink({
                type: 'invite',
                email,
                options: { data: { full_name: atleta.nome, role: 'ATLETA' } },
            })
            if (error) throw error
            tipo = 'invite'
            tokenHash = data.properties.hashed_token

            const { error: errVinculo } = await admin
                .from('atletas')
                .update({ auth_user_id: data.user.id, email, convite_enviado_em: new Date().toISOString() })
                .eq('id', atleta.id)
                .is('auth_user_id', null)
            if (errVinculo) {
                // Desfaz o login criado para não deixar conta órfã
                await admin.auth.admin.deleteUser(data.user.id)
                if (errVinculo.code === '23505') throw new ErroAcesso(409, 'EMAIL_EM_USO')
                throw errVinculo
            }
        }

        if (tipo === 'recovery') {
            await admin.from('atletas').update({ convite_enviado_em: new Date().toISOString() }).eq('id', atleta.id)
        }

        const link = `${appUrl}/definir-senha?th=${encodeURIComponent(tokenHash)}&type=${tipo}`
        const expiraEm = new Date(Date.now() + VALIDADE_HORAS * 3600 * 1000).toISOString()

        return json({ link, email, tipo, expira_em: expiraEm })
    } catch (err) {
        return responderErro(err)
    }
})
