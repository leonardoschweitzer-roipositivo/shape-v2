-- =============================================
-- VITRU IA — FASE 2: Alunos com convite (fim da senha padrão) + limite do plano
-- =============================================
-- Rodar DEPOIS das Fases 0 e 1. Idempotente.
-- Depois do SQL: deploy das Edge Functions convidar-aluno e excluir-aluno (ver PR).
--
-- ─── PRÉ-CHECK ──────────────────────────────────────────────────────────────
-- a) Personais acima do limite (mantêm os alunos, mas não conseguem adicionar novos):
--    SELECT p.email, p.plano, p.limite_atletas, count(a.*) AS ativos
--    FROM personais p JOIN atletas a ON a.personal_id = p.id AND a.status <> 'INATIVO'
--    GROUP BY 1, 2, 3 HAVING p.limite_atletas IS NOT NULL AND count(a.*) > p.limite_atletas;
--
-- b) E-mails duplicados no mesmo personal (impedem o índice único — resolva antes):
--    SELECT personal_id, lower(trim(email)), count(*), array_agg(nome)
--    FROM atletas WHERE email IS NOT NULL AND trim(email) <> ''
--    GROUP BY 1, 2 HAVING count(*) > 1;
--
-- c) Alunos que ainda usam a senha padrão antiga (o personal deve "Gerar novo link"):
--    SELECT a.nome, u.email FROM auth.users u JOIN atletas a ON a.auth_user_id = u.id
--    WHERE u.encrypted_password = extensions.crypt('Shape2026!', u.encrypted_password);
-- =============================================


-- =============================================
-- 1. Colunas de acompanhamento do convite
-- =============================================
ALTER TABLE atletas ADD COLUMN IF NOT EXISTS convite_enviado_em timestamptz;
ALTER TABLE atletas ADD COLUMN IF NOT EXISTS acesso_ativado_em  timestamptz;


-- =============================================
-- 2. E-mail normalizado + único por personal
-- =============================================
CREATE OR REPLACE FUNCTION public.trg_atletas_normalizar_email()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.email := nullif(lower(trim(NEW.email)), '');
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_atletas_normalizar_email ON atletas;
CREATE TRIGGER trg_atletas_normalizar_email
    BEFORE INSERT OR UPDATE OF email ON atletas
    FOR EACH ROW EXECUTE FUNCTION public.trg_atletas_normalizar_email();

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM atletas WHERE email IS NOT NULL AND trim(email) <> ''
        GROUP BY personal_id, lower(trim(email)) HAVING count(*) > 1
    ) THEN
        RAISE WARNING '⚠️ E-mails duplicados no mesmo personal — normalização e índice único NÃO aplicados. Veja PRÉ-CHECK (b).';
    ELSE
        UPDATE atletas SET email = email WHERE email IS DISTINCT FROM nullif(lower(trim(email)), '');
        CREATE UNIQUE INDEX IF NOT EXISTS atletas_personal_email_uniq
            ON atletas (personal_id, email) WHERE email IS NOT NULL;
    END IF;
END $$;


-- =============================================
-- 3. Limite de alunos do plano (arquivados = INATIVO não contam)
-- =============================================
CREATE OR REPLACE FUNCTION public.trg_atletas_limite_plano()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_limite integer;
    v_ativos integer;
BEGIN
    IF NEW.status = 'INATIVO' THEN
        RETURN NEW;
    END IF;
    -- Só conta quando o aluno passa a ocupar vaga: novo, reativado ou transferido
    IF TG_OP = 'UPDATE'
       AND OLD.status IS DISTINCT FROM 'INATIVO'
       AND OLD.personal_id = NEW.personal_id THEN
        RETURN NEW;
    END IF;

    -- Trava a linha do personal: cadastros simultâneos não furam o limite
    SELECT limite_atletas INTO v_limite
    FROM personais WHERE id = NEW.personal_id
    FOR UPDATE;

    IF v_limite IS NULL THEN
        RETURN NEW;   -- ilimitado
    END IF;

    SELECT count(*) INTO v_ativos
    FROM atletas
    WHERE personal_id = NEW.personal_id
      AND status IS DISTINCT FROM 'INATIVO'
      AND id <> NEW.id;

    IF v_ativos >= v_limite THEN
        RAISE EXCEPTION 'LIMITE_ALUNOS_ATINGIDO'
            USING ERRCODE = 'P0001',
                  DETAIL = v_limite::text,
                  HINT = 'Arquive um aluno ou faça upgrade do plano.';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_atletas_limite_plano ON atletas;
CREATE TRIGGER trg_atletas_limite_plano
    BEFORE INSERT OR UPDATE OF status, personal_id ON atletas
    FOR EACH ROW EXECUTE FUNCTION public.trg_atletas_limite_plano();


-- =============================================
-- 4. Vínculos do aluno só mudam em contexto admin (Edge Function / SQL Editor / GOD)
-- =============================================
CREATE OR REPLACE FUNCTION public.trg_atletas_proteger_campos()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF public.app_is_admin_ctx() THEN
        RETURN NEW;
    END IF;
    IF NEW.auth_user_id IS DISTINCT FROM OLD.auth_user_id
    OR NEW.personal_id  IS DISTINCT FROM OLD.personal_id THEN
        RAISE EXCEPTION 'CAMPO_ADMINISTRATIVO: login e personal do aluno só mudam pelo convite/suporte';
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_atletas_proteger_campos ON atletas;
CREATE TRIGGER trg_atletas_proteger_campos
    BEFORE UPDATE ON atletas
    FOR EACH ROW EXECUTE FUNCTION public.trg_atletas_proteger_campos();


-- =============================================
-- 5. RPC cadastrar_aluno — atleta + ficha numa transação (RLS do personal vale)
-- =============================================
CREATE OR REPLACE FUNCTION public.cadastrar_aluno(
    p_nome     text,
    p_sexo     text,
    p_email    text DEFAULT NULL,
    p_telefone text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
    v_personal personais%ROWTYPE;
    v_atleta   uuid;
BEGIN
    SELECT * INTO v_personal FROM personais WHERE id = public.app_meu_personal_id();
    IF v_personal.id IS NULL THEN
        RAISE EXCEPTION 'PERSONAL_NAO_ENCONTRADO';
    END IF;
    IF v_personal.status IN ('SUSPENSO', 'INATIVO') THEN
        RAISE EXCEPTION 'PERSONAL_SUSPENSO';
    END IF;
    IF length(trim(coalesce(p_nome, ''))) < 2 THEN
        RAISE EXCEPTION 'NOME_INVALIDO';
    END IF;
    IF p_sexo NOT IN ('M', 'F') THEN
        RAISE EXCEPTION 'SEXO_INVALIDO';
    END IF;
    IF nullif(trim(p_email), '') IS NOT NULL
       AND trim(p_email) !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
        RAISE EXCEPTION 'EMAIL_INVALIDO';
    END IF;

    INSERT INTO atletas (personal_id, academia_id, nome, email, telefone, status)
    VALUES (v_personal.id, v_personal.academia_id, trim(p_nome), p_email, nullif(trim(p_telefone), ''), 'ATIVO')
    RETURNING id INTO v_atleta;

    INSERT INTO fichas (atleta_id, sexo, objetivo, objetivo_vitruvio)
    VALUES (v_atleta, p_sexo::sexo_tipo, 'HIPERTROFIA', 'RECOMP')
    ON CONFLICT (atleta_id) DO UPDATE
        SET sexo = EXCLUDED.sexo,
            objetivo = EXCLUDED.objetivo,
            objetivo_vitruvio = EXCLUDED.objetivo_vitruvio;

    RETURN v_atleta;
END;
$$;

REVOKE ALL ON FUNCTION public.cadastrar_aluno(text, text, text, text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.cadastrar_aluno(text, text, text, text) TO authenticated;


-- =============================================
-- 6. Funções só para service_role (Edge Functions)
-- =============================================
CREATE OR REPLACE FUNCTION public.app_auth_user_id_por_email(p_email text)
RETURNS uuid
LANGUAGE sql STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
    SELECT id FROM auth.users WHERE lower(email) = lower(trim(p_email)) LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.app_auth_user_id_por_email(text) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.app_auth_user_id_por_email(text) TO service_role;

-- Apaga o aluno e TODOS os dados dependentes numa transação só. Devolve o auth_user_id (para
-- a Edge Function remover o login). Ordem explícita p/ FKs entre filhas; depois varre qualquer
-- outra tabela com coluna atleta_id.
CREATE OR REPLACE FUNCTION public.app_excluir_aluno_dados(p_atleta_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_auth   uuid;
    v_tabela text;
    v_ordem  text[] := ARRAY[
        'planos_treino', 'planos_dieta', 'diagnosticos', 'medidas_ia_metadata', 'medidas',
        'assessments', 'avaliacoes', 'registros_diarios', 'registros', 'consultorias',
        'chat_messages', 'notificacoes', 'fichas'
    ];
BEGIN
    SELECT auth_user_id INTO v_auth FROM atletas WHERE id = p_atleta_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'ATLETA_NAO_ENCONTRADO';
    END IF;

    FOREACH v_tabela IN ARRAY v_ordem LOOP
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = v_tabela AND column_name = 'atleta_id'
        ) THEN
            EXECUTE format('DELETE FROM public.%I WHERE atleta_id = $1', v_tabela) USING p_atleta_id;
        END IF;
    END LOOP;

    FOR v_tabela IN
        SELECT c.table_name FROM information_schema.columns c
        JOIN information_schema.tables t
          ON t.table_schema = c.table_schema AND t.table_name = c.table_name AND t.table_type = 'BASE TABLE'
        WHERE c.table_schema = 'public' AND c.column_name = 'atleta_id'
          AND c.table_name <> 'atletas' AND NOT (c.table_name = ANY (v_ordem))
    LOOP
        EXECUTE format('DELETE FROM public.%I WHERE atleta_id = $1', v_tabela) USING p_atleta_id;
    END LOOP;

    DELETE FROM atletas WHERE id = p_atleta_id;
    RETURN v_auth;
END;
$$;

REVOKE ALL ON FUNCTION public.app_excluir_aluno_dados(uuid) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.app_excluir_aluno_dados(uuid) TO service_role;


-- =============================================
-- 7. Aluno marca que ativou o acesso (chamado pela página /definir-senha)
-- =============================================
CREATE OR REPLACE FUNCTION public.app_marcar_acesso_ativado()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    UPDATE atletas SET acesso_ativado_em = now()
    WHERE auth_user_id = auth.uid() AND acesso_ativado_em IS NULL;
$$;

REVOKE ALL ON FUNCTION public.app_marcar_acesso_ativado() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.app_marcar_acesso_ativado() TO authenticated;


-- =============================================
-- 8. Fim do vínculo pelo navegador do personal (substituído pela Edge Function convidar-aluno)
-- =============================================
DROP FUNCTION IF EXISTS public.link_existing_user_to_atleta(text, uuid);


SELECT '✅ Fase 2 aplicada: convite de aluno, limite do plano, cadastro/exclusão atômicos' AS status;
