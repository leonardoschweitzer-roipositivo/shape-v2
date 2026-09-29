-- =============================================
-- VITRU IA — FASE 0 (parte B): Portal do aluno por LOGIN, fim das policies de token
-- =============================================
-- Rodar DEPOIS de 20260930_fase0_blindagem_auth.sql (usa as funções app_*).
-- Idempotente. É o passo de MAIOR RISCO da Fase 0 → testar o portal do aluno inteiro depois.
--
-- Contexto: o portal por token (portal_token) é código morto — o aluno entra com login.
-- Mas as policies de token continuam vivas e sem "TO", então valem para QUALQUER usuário:
--   • portal_select_atletas / portal_update_atletas  → todo logado lê/edita atletas com token
--   • portal_select_personais USING (true)           → todo mundo lê todos os personais
--   • notificacao_anon_* / atleta_notificacao_*      → leitura/escrita de notificações alheias
--   • atleta_comentario_*                            → comentários em notificações alheias
--
-- Estratégia: (1) criar policies "self" do aluno e "dono" do personal para TODAS as tabelas
-- que o app usa (policies só somam acesso — não quebram nada); (2) só então remover as de token.
-- Tabelas que não existirem no banco são puladas.
--
-- ─── PRÉ-CHECK ──────────────────────────────────────────────────────────────
--   SELECT tablename, policyname, cmd, roles FROM pg_policies
--   WHERE schemaname = 'public' ORDER BY 1, 2;
--   SELECT relname, relrowsecurity FROM pg_class
--   WHERE relname IN ('planos_treino','planos_dieta','registros_diarios','diagnosticos',
--                     'assessments','chat_messages','notificacoes') ;
--
-- ─── ROLLBACK (se o portal do aluno quebrar) ────────────────────────────────
--   Rodar de novo: supabase/migrations/add-portal-rls-policies.sql
--               e  supabase/fix-notificacao-rls-anon-insert.sql
--               e  src/sql/notificacoes_atleta_migration.sql (só os CREATE POLICY)
--   e avisar o Claude com o erro do console.
-- =============================================


-- =============================================
-- 1. Policies "self" (aluno logado) e "dono" (personal logado) por tabela
-- =============================================
DO $$
DECLARE
    -- tabela | comandos do aluno sobre as próprias linhas
    cfg  text[][] := ARRAY[
        ARRAY['fichas',            'SELECT,UPDATE'],
        ARRAY['medidas',           'SELECT,INSERT'],
        ARRAY['assessments',       'SELECT,INSERT'],
        ARRAY['diagnosticos',      'SELECT,INSERT'],
        ARRAY['planos_treino',     'SELECT,INSERT,UPDATE'],
        ARRAY['planos_dieta',      'SELECT,INSERT,UPDATE'],
        ARRAY['registros_diarios', 'SELECT,INSERT,UPDATE,DELETE'],
        ARRAY['chat_messages',     'SELECT,INSERT']
    ];
    t    text;
    cmd  text;
    i    int;
BEGIN
    FOR i IN 1 .. array_length(cfg, 1) LOOP
        t := cfg[i][1];

        IF to_regclass('public.' || t) IS NULL THEN
            RAISE NOTICE 'Tabela % não existe — pulando', t;
            CONTINUE;
        END IF;

        -- Aluno: só as próprias linhas
        FOREACH cmd IN ARRAY string_to_array(cfg[i][2], ',') LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'self_' || lower(cmd) || '_' || t, t);
            IF cmd = 'INSERT' THEN
                EXECUTE format(
                    'CREATE POLICY %I ON public.%I FOR INSERT WITH CHECK (atleta_id = public.app_meu_atleta_id())',
                    'self_insert_' || t, t);
            ELSIF cmd = 'UPDATE' THEN
                EXECUTE format(
                    'CREATE POLICY %I ON public.%I FOR UPDATE USING (atleta_id = public.app_meu_atleta_id()) WITH CHECK (atleta_id = public.app_meu_atleta_id())',
                    'self_update_' || t, t);
            ELSE
                EXECUTE format(
                    'CREATE POLICY %I ON public.%I FOR %s USING (atleta_id = public.app_meu_atleta_id())',
                    'self_' || lower(cmd) || '_' || t, t, cmd);
            END IF;
        END LOOP;

        -- Personal: tudo sobre as linhas dos próprios alunos
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'dono_all_' || t, t);
        EXECUTE format(
            'CREATE POLICY %I ON public.%I FOR ALL USING (public.app_atleta_eh_meu(atleta_id)) WITH CHECK (public.app_atleta_eh_meu(atleta_id))',
            'dono_all_' || t, t);
    END LOOP;
END $$;

-- Aluno lê a própria linha em atletas
DROP POLICY IF EXISTS "atletas_self_select" ON atletas;
CREATE POLICY "atletas_self_select" ON atletas FOR SELECT
    USING (auth_user_id = auth.uid());


-- =============================================
-- 2. NOTIFICAÇÕES (personal ↔ aluno)
-- =============================================
DROP POLICY IF EXISTS "self_select_notificacoes" ON notificacoes;
DROP POLICY IF EXISTS "self_insert_notificacoes" ON notificacoes;
DROP POLICY IF EXISTS "self_update_notificacoes" ON notificacoes;

-- Aluno lê as notificações do próprio atleta_id (inclui as enviadas ao personal → dedupe por grupo_id)
CREATE POLICY "self_select_notificacoes" ON notificacoes FOR SELECT
    USING (atleta_id = public.app_meu_atleta_id());

-- Aluno cria notificação para o PRÓPRIO personal, sobre si mesmo
CREATE POLICY "self_insert_notificacoes" ON notificacoes FOR INSERT
    WITH CHECK (
        atleta_id = public.app_meu_atleta_id()
        AND personal_id = public.app_personal_do_atleta()
    );

-- Aluno marca como lida as notificações destinadas a ele
CREATE POLICY "self_update_notificacoes" ON notificacoes FOR UPDATE
    USING (atleta_id = public.app_meu_atleta_id() AND destinatario = 'atleta')
    WITH CHECK (atleta_id = public.app_meu_atleta_id() AND destinatario = 'atleta');


-- =============================================
-- 3. COMENTÁRIOS de notificação
-- =============================================
DO $$
BEGIN
    IF to_regclass('public.comentarios_notificacao') IS NULL THEN
        RAISE NOTICE 'comentarios_notificacao não existe — pulando';
        RETURN;
    END IF;

    DROP POLICY IF EXISTS "dono_select_comentarios" ON comentarios_notificacao;
    DROP POLICY IF EXISTS "dono_insert_comentarios" ON comentarios_notificacao;
    DROP POLICY IF EXISTS "self_select_comentarios" ON comentarios_notificacao;
    DROP POLICY IF EXISTS "self_insert_comentarios" ON comentarios_notificacao;
    DROP POLICY IF EXISTS "dono_delete_comentarios" ON comentarios_notificacao;

    -- Personal: comentários das notificações que são dele
    CREATE POLICY "dono_select_comentarios" ON comentarios_notificacao FOR SELECT
        USING (EXISTS (
            SELECT 1 FROM notificacoes n
            WHERE n.id = comentarios_notificacao.notificacao_id AND n.personal_id = public.app_meu_personal_id()
        ));
    CREATE POLICY "dono_insert_comentarios" ON comentarios_notificacao FOR INSERT
        WITH CHECK (
            autor_tipo = 'personal'
            AND autor_id = public.app_meu_personal_id()
            AND EXISTS (
                SELECT 1 FROM notificacoes n
                WHERE n.id = comentarios_notificacao.notificacao_id AND n.personal_id = public.app_meu_personal_id()
            )
        );

    -- Aluno: comentários das notificações do próprio atleta_id
    CREATE POLICY "self_select_comentarios" ON comentarios_notificacao FOR SELECT
        USING (EXISTS (
            SELECT 1 FROM notificacoes n
            WHERE n.id = comentarios_notificacao.notificacao_id AND n.atleta_id = public.app_meu_atleta_id()
        ));
    CREATE POLICY "self_insert_comentarios" ON comentarios_notificacao FOR INSERT
        WITH CHECK (
            autor_tipo = 'atleta'
            AND autor_id = public.app_meu_atleta_id()
            AND EXISTS (
                SELECT 1 FROM notificacoes n
                WHERE n.id = comentarios_notificacao.notificacao_id AND n.atleta_id = public.app_meu_atleta_id()
            )
        );

    -- Personal apaga os próprios comentários
    CREATE POLICY "dono_delete_comentarios" ON comentarios_notificacao FOR DELETE
        USING (autor_tipo = 'personal' AND autor_id = public.app_meu_personal_id());

    -- Remover as abertas (qualquer atleta_id / qualquer autor).
    -- As 3 originais comparavam autor_id/personal_id com auth.uid() — o app grava personais.id/atletas.id,
    -- então nunca casavam no uso real, mas "criar" deixava QUALQUER logado comentar em qualquer notificação.
    DROP POLICY IF EXISTS "atleta_comentario_insert" ON comentarios_notificacao;
    DROP POLICY IF EXISTS "atleta_comentario_select" ON comentarios_notificacao;
    DROP POLICY IF EXISTS "Personal pode ler comentários das suas notificações" ON comentarios_notificacao;
    DROP POLICY IF EXISTS "Personal pode criar comentários" ON comentarios_notificacao;
    DROP POLICY IF EXISTS "Autor pode deletar seus próprios comentários" ON comentarios_notificacao;
END $$;


-- =============================================
-- 4. REMOVER policies de token / abertas
-- =============================================
-- atletas
DROP POLICY IF EXISTS "portal_select_atletas"   ON atletas;
DROP POLICY IF EXISTS "portal_update_atletas"   ON atletas;
DROP POLICY IF EXISTS "atletas_portal_select"   ON atletas;
DROP POLICY IF EXISTS "atletas_portal_update"   ON atletas;
-- personais
DROP POLICY IF EXISTS "portal_select_personais" ON personais;   -- USING (true)!
DROP POLICY IF EXISTS "personais_portal_select" ON personais;
-- fichas
DROP POLICY IF EXISTS "portal_select_fichas"    ON fichas;
DROP POLICY IF EXISTS "portal_update_fichas"    ON fichas;
DROP POLICY IF EXISTS "fichas_portal_select"    ON fichas;
DROP POLICY IF EXISTS "fichas_portal_update"    ON fichas;
-- medidas
DROP POLICY IF EXISTS "portal_select_medidas"   ON medidas;
DROP POLICY IF EXISTS "portal_insert_medidas"   ON medidas;
DROP POLICY IF EXISTS "medidas_portal_select"   ON medidas;
DROP POLICY IF EXISTS "medidas_portal_insert"   ON medidas;
-- assessments / diagnosticos
DO $$
BEGIN
    IF to_regclass('public.assessments') IS NOT NULL THEN
        DROP POLICY IF EXISTS "portal_select_assessments" ON assessments;
        DROP POLICY IF EXISTS "assessments_portal_select" ON assessments;
        DROP POLICY IF EXISTS "assessments_portal_insert" ON assessments;
    END IF;
    IF to_regclass('public.diagnosticos') IS NOT NULL THEN
        DROP POLICY IF EXISTS "portal_select_diagnosticos" ON diagnosticos;
        DROP POLICY IF EXISTS "diagnosticos_portal_select" ON diagnosticos;
    END IF;
    IF to_regclass('public.avaliacoes') IS NOT NULL THEN
        DROP POLICY IF EXISTS "avaliacoes_portal_select" ON avaliacoes;
    END IF;
END $$;
-- notificacoes
DROP POLICY IF EXISTS "notificacao_anon_insert"        ON notificacoes;
DROP POLICY IF EXISTS "notificacao_anon_select"        ON notificacoes;
DROP POLICY IF EXISTS "atleta_notificacao_select"      ON notificacoes;
DROP POLICY IF EXISTS "atleta_notificacao_update_lida" ON notificacoes;


-- =============================================
-- 5. CONFERÊNCIA — policies que ainda citam portal_token ou são USING (true)
-- =============================================
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
  AND (qual ILIKE '%portal_token%' OR with_check ILIKE '%portal_token%' OR qual = 'true')
ORDER BY 1, 2;
-- ↑ Ideal: vazio (exceto exercicios_biblioteca de leitura pública, se existir).

SELECT '✅ Fase 0B aplicada: portal do aluno por login, policies de token removidas' AS status;
